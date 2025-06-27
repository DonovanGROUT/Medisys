<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Appointment;
use App\Entity\Patient;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires pour l'entité Appointment
 *
 * Ces tests vérifient le comportement de l'entité sans base de données.
 *
 * @author Donovan GROUT
 * @since 2.0.0
 */
class AppointmentTest extends TestCase
{
    private Appointment $appointment;
    private Patient $patient;

    protected function setUp(): void
    {
        $this->appointment = new Appointment();
        $this->patient = new Patient();
        $this->patient->setFirstName('Test')->setLastName('Patient');
    }

    /**
     * Teste le chaînage fluide des setters (pattern fluent interface)
     */
    public function testFluentInterface(): void
    {
        $result = $this->appointment
            ->setPatient($this->patient)
            ->setDateTime(new \DateTimeImmutable('+1 day'))
            ->setDuration(30)
            ->setReason('Consultation')
            ->setStatus('scheduled');
        $this->assertSame($this->appointment, $result);
    }

    /**
     * Vérifie l'association Patient <-> Appointment
     */
    public function testSetAndGetPatient(): void
    {
        $this->appointment->setPatient($this->patient);
        $this->assertSame($this->patient, $this->appointment->getPatient());
    }

    /**
     * Vérifie la gestion de la date/heure du rendez-vous
     */
    public function testSetAndGetDateTime(): void
    {
        $date = new \DateTimeImmutable('+2 days');
        $this->appointment->setDateTime($date);
        $this->assertEquals($date, $this->appointment->getDateTime());
    }

    /**
     * Vérifie la gestion de la durée du rendez-vous
     */
    public function testSetAndGetDuration(): void
    {
        $this->appointment->setDuration(45);
        $this->assertEquals(45, $this->appointment->getDuration());
    }

    /**
     * Doit lever une exception si la durée est négative ou nulle
     */
    public function testSetDurationThrowsOnNegative(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->appointment->setDuration(0);
    }

    /**
     * Vérifie la gestion du motif du rendez-vous
     */
    public function testSetAndGetReason(): void
    {
        $this->appointment->setReason('Bilan');
        $this->assertEquals('Bilan', $this->appointment->getReason());
    }

    /**
     * Doit lever une exception si le motif est vide
     */
    public function testSetReasonThrowsOnEmpty(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->appointment->setReason('');
    }

    /**
     * Doit lever une exception si le motif dépasse 255 caractères
     */
    public function testSetReasonThrowsOnTooLong(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->appointment->setReason(str_repeat('a', 256));
    }

    /**
     * Vérifie la gestion du statut du rendez-vous
     */
    public function testSetAndGetStatus(): void
    {
        $this->appointment->setStatus('completed');
        $this->assertEquals('completed', $this->appointment->getStatus());
    }

    /**
     * Doit lever une exception si le statut est invalide
     */
    public function testSetStatusThrowsOnInvalid(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->appointment->setStatus('invalid_status');
    }
}
