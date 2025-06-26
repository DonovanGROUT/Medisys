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
class PatientControllerShowTest extends WebTestCase
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

        // Création d'un patient de test avec des données uniques
        $uniqueEmail = 'jean.dupont.' . uniqid() . '@example.com';
        $patient = new Patient();
        $patient->setFirstName('Jean')
            ->setLastName('Dupont')
            ->setEmail($uniqueEmail)
            ->setPhone('0601020304')
            ->setBirthDate(new \DateTime('1980-01-01'))
            ->setGender('M');
        $em->persist($patient);
        $em->flush();

        // Appel de la page show pour afficher la fiche du patient
        $client->request('GET', '/patients/' . $patient->getId());
        $this->assertResponseIsSuccessful(); // Vérifie que la page s'affiche sans erreur

        // Vérifie que le titre de la page est correct
        $this->assertSelectorTextContains('h1', 'Fiche patient');
        // Vérifie que le nom du patient est affiché
        $this->assertSelectorTextContains('tr:contains("Nom") td', 'Dupont');
        // Vérifie que le prénom du patient est affiché
        $this->assertSelectorTextContains('tr:contains("Prénom") td', 'Jean');
        // Vérifie que l'email du patient est affiché
        $this->assertSelectorTextContains('tr:contains("Email") td', $uniqueEmail);
    }
}
