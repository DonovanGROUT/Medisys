<?php

namespace App\Tests\Integration\Controller;

use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Test fonctionnel pour la suppression d'un patient (action delete).
 *
 * Vérifie la suppression effective, la sécurité CSRF, les messages flash et la redirection.
 */
class PatientControllerDeleteTest extends WebTestCase
{
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        // Le kernel sera booté par createClient()
    }

    public function testDeletePatientWithValidCsrfToken(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $this->em = $container->get('doctrine')->getManager();
        // Création d'un patient de test
        $patient = new Patient();
        $patient->setFirstName('Test');
        $patient->setLastName('Delete');
        $patient->setEmail('delete_'.uniqid().'@test.fr');
        $patient->setBirthDate(new \DateTime('2000-01-01'));
        $patient->setGender('M');
        $this->em->persist($patient);
        $this->em->flush();
        $id = $patient->getId();

        // Récupère le token CSRF depuis le formulaire de la page d'index
        $crawler = $client->request('GET', '/patients');
        $form = $crawler->filter('form[action="/patients/' . $id . '/delete"]')->first();
        $csrfToken = $form->filter('input[name="_token"]')->attr('value');

        // Envoie la requête POST de suppression
        $client->request('POST', '/patients/'.$id.'/delete', [
            '_token' => $csrfToken,
        ]);

        // Vérifie la redirection
        $this->assertResponseRedirects('/patients');
        $client->followRedirect();
        // Vérifie le message flash
        $this->assertSelectorExists('.alert-success');
        // Vérifie que le patient n'existe plus
        $this->assertNull($this->em->getRepository(Patient::class)->find($id));
    }

    public function testDeletePatientWithInvalidCsrfToken(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $this->em = $container->get('doctrine')->getManager();
        // Création et démarrage d'une session de test
        $sessionFactory = $container->get('session.factory');
        $session = $sessionFactory->createSession();
        $session->start();
        $client->getCookieJar()->set(new \Symfony\Component\BrowserKit\Cookie($session->getName(), $session->getId()));
        // Initialisation de la session via une requête GET
        $client->request('GET', '/patients');
        $patient = new Patient();
        $patient->setFirstName('Test');
        $patient->setLastName('Delete');
        $patient->setEmail('delete_'.uniqid().'@test.fr');
        $patient->setBirthDate(new \DateTime('2000-01-01'));
        $patient->setGender('M');
        $this->em->persist($patient);
        $this->em->flush();
        $id = $patient->getId();

        // Envoie la requête POST avec un token invalide
        $client->request('POST', '/patients/'.$id.'/delete', [
            '_token' => 'invalid_token',
        ]);

        $this->assertResponseRedirects('/patients');
        $client->followRedirect();
        // Vérifie le message flash d'erreur
        $this->assertSelectorExists('.alert-error');
        // Vérifie que le patient existe toujours
        $this->assertNotNull($this->em->getRepository(Patient::class)->find($id));
    }
}
