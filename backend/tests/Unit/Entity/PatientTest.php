<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Patient;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires pour l'entité Patient
 *
 * Ces tests vérifient le comportement de l'entité sans base de données.
 *
 * @author Donovan GROUT
 * @since 1.1.0
 */
class PatientTest extends TestCase
{
    private Patient $patient;

    protected function setUp(): void
    {
        $this->patient = new Patient();
    }

    /**
     * Vérifie que le patient est créé avec un audit trail automatique
     */
    public function testPatientCreation(): void
    {
        $this->assertNotNull($this->patient->getCreatedAt());
        $this->assertNotNull($this->patient->getUpdatedAt());
        $this->assertNull($this->patient->getId());
    }

    /**
     * Teste le chaînage fluide des setters (pattern fluent interface)
     */
    public function testFluentInterface(): void
    {
        $result = $this->patient
            ->setFirstName("Donovan")
            ->setLastName("GROUT")
            ->setEmail("donovan@medisys.fr");

        // Vérifie que le chaînage retourne bien l'instance
        $this->assertSame($this->patient, $result);
    }

    /**
     * Vérifie la concaténation du nom complet
     */
    public function testGetFullName(): void
    {
        $this->patient
            ->setFirstName("Donovan")
            ->setLastName("GROUT");

        $this->assertEquals("Donovan GROUT", $this->patient->getFullName());
    }

    /**
     * Calcul automatique de l'âge basé sur la date de naissance
     */
    public function testGetAge(): void
    {
        $birthDate = new \DateTime('1991-05-28');
        $this->patient->setBirthDate($birthDate);

        $expectedAge = $birthDate->diff(new \DateTime())->y;
        $this->assertEquals($expectedAge, $this->patient->getAge());
    }

    /**
     * Gestion du cas où la date de naissance n'est pas renseignée
     */
    public function testGetAgeWithNullBirthDate(): void
    {
        $this->assertNull($this->patient->getAge());
    }

    /**
     * Validation de l'email (contrainte d'unicité testée en intégration)
     */
    public function testEmailUniqueness(): void
    {
        // Ce test sera plus pertinent avec la base de données
        $email = "test@medisys.fr";
        $this->patient->setEmail($email);

        $this->assertEquals($email, $this->patient->getEmail());
    }

    /**
     * L'historique médical est optionnel par défaut
     */
    public function testMedicalHistoryOptional(): void
    {
        $this->assertNull($this->patient->getMedicalHistory());

        $history = "Allergie aux arachides";
        $this->patient->setMedicalHistory($history);

        $this->assertEquals($history, $this->patient->getMedicalHistory());
    }

    /**
     * Test basique du genre (validation métier à implémenter)
     */
    public function testGenderValidation(): void
    {
        // Dans une vraie app, on ajouterait une validation
        $this->patient->setGender("M");
        $this->assertEquals("M", $this->patient->getGender());
    }
}
