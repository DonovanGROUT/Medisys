<?php

namespace App\Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Patient;

/**
 * Test fonctionnel pour la création d'un patient (action new).
 */
class PatientControllerNewTest extends WebTestCase
{
    /**
     * Teste la création d'un patient via le formulaire.
     */
    public function testNewPatient(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/patients/new');
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Nouveau patient');

        $uniqueEmail = 'alice.' . uniqid() . '@example.com';
        $form = $crawler->selectButton('Enregistrer')->form([
            'patient[firstName]' => 'Alice',
            'patient[lastName]' => 'Martin',
            'patient[email]' => $uniqueEmail,
            'patient[phone]' => '0612345678',
            'patient[birthDate]' => '1990-05-10',
            'patient[gender]' => 'Femme',
            'patient[medicalHistory]' => 'RAS',
        ]);
        $client->submit($form);
        $this->assertResponseRedirects('/patients');
        $client->followRedirect();
        $this->assertSelectorExists('.alert-success');
        $this->assertSelectorExists('td:contains("' . $uniqueEmail . '")');
        $this->assertSelectorExists('td:contains("Alice")');
        $this->assertSelectorExists('td:contains("Martin")');
    }
}
