<?php

namespace App\Tests\Integration\Controller;

use App\Entity\Patient;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Test d'intégration pour l'édition d'un patient (action edit).
 *
 * Vérifie que le formulaire d'édition fonctionne et que les modifications sont bien enregistrées.
 *
 * @covers \App\Controller\PatientController::edit
 */
class PatientControllerEditTest extends WebTestCase
{
    /**
     * Teste l'édition d'un patient existant.
     *
     * - Crée un patient de test en base
     * - Appelle la page /patients/{id}/edit
     * - Modifie les données via le formulaire
     * - Vérifie la redirection et la présence des nouvelles données
     */
    public function testEditPatient(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get(EntityManagerInterface::class);

        // Création d'un patient de test
        $uniqueEmail = 'edit.jean.dupont.' . uniqid() . '@example.com';
        $patient = new Patient();
        $patient->setFirstName('Jean')
            ->setLastName('Dupont')
            ->setEmail($uniqueEmail)
            ->setPhone('0601020304')
            ->setBirthDate(new \DateTime('1980-01-01'))
            ->setGender('M');
        $em->persist($patient);
        $em->flush();

        // Appel de la page d'édition
        $crawler = $client->request('GET', '/patients/' . $patient->getId() . '/edit');
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Modifier le patient');

        // Remplit et soumet le formulaire avec de nouvelles données
        $form = $crawler->selectButton('Enregistrer')->form([
            'patient[firstName]' => 'Jean-Édité',
            'patient[lastName]' => 'Dupont-Édité',
            'patient[email]' => 'edit2.' . $uniqueEmail,
            'patient[phone]' => '0708091011',
            'patient[birthDate]' => '1990-12-31',
            'patient[gender]' => 'M',
        ]);
        $client->submit($form);

        // Vérifie la redirection vers la liste
        $this->assertResponseRedirects('/patients');
        $crawler = $client->followRedirect();
        $this->assertSelectorTextContains('div.alert-success', 'Patient updated successfully.');

        // Recherche la ligne du patient modifié via son email unique
        $found = false;
        foreach ($crawler->filter('tbody tr') as $tr) {
            $rowText = $tr->textContent;
            if (str_contains($rowText, 'edit2.' . $uniqueEmail)) {
                $this->assertStringContainsString('Jean-Édité', $rowText);
                $this->assertStringContainsString('Dupont-Édité', $rowText);
                $this->assertStringContainsString('edit2.' . $uniqueEmail, $rowText);
                $this->assertStringContainsString('0708091011', $rowText);
                // On attend explicitement le format d/m/Y (année sur 4 chiffres)
                $expectedDate = (new \DateTime('1990-12-31'))->format('d/m/Y');
                $this->assertStringContainsString($expectedDate, $rowText, 'La date de naissance doit être affichée au format d/m/Y (année sur 4 chiffres).');
                $found = true;
                break;
            }
        }
        $this->assertTrue($found, 'La ligne du patient édité doit être présente dans le tableau.');
    }
}
