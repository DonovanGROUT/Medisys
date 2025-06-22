<?php

namespace App\Tests\Integration\Controller;

use App\Entity\Patient;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Test d'intégration pour l'affichage de la fiche patient (action show).
 *
 * Vérifie que la page détail d'un patient s'affiche correctement avec les bonnes informations.
 *
 * @covers \App\Controller\PatientController::show
 */
class PatientControllerTest extends WebTestCase
{
    /**
     * Teste l'affichage de la fiche d'un patient existant.
     *
     * - Crée un patient de test en base
     * - Appelle la page /patients/{id}
     * - Vérifie la présence des informations principales
     */
    public function testShowPatient(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get(EntityManagerInterface::class);

        // Création d'un patient de test
        $uniqueEmail = 'jean.dupont.' . uniqid() . '@example.com';
        $patient = new Patient();
        $patient->setFirstName('Jean')
            ->setLastName('Dupont')
            ->setEmail($uniqueEmail)
            ->setPhone('0601020304')
            ->setBirthDate(new \DateTime('1980-01-01'))
            ->setGender('Homme');
        $em->persist($patient);
        $em->flush();

        // Appel de la page show
        $client->request('GET', '/patients/' . $patient->getId());
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Fiche patient');
        $this->assertSelectorTextContains('tr:contains("Nom") td', 'Dupont');
        $this->assertSelectorTextContains('tr:contains("Prénom") td', 'Jean');
        $this->assertSelectorTextContains('tr:contains("Email") td', $uniqueEmail);
    }
}
