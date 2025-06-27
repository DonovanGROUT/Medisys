<?php

namespace App\Tests\Integration\Repository;

use App\Entity\Appointment;
use App\Entity\Patient;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Tests d'intégration pour le Repository Appointment
 *
 * Ces tests utilisent une vraie base de données de test
 * pour vérifier le fonctionnement des requêtes personnalisées.
 *
 * @author Donovan GROUT
 * @since 2.0.0
 */
class AppointmentRepositoryTest extends KernelTestCase
{
    private EntityManagerInterface $entityManager;
    private AppointmentRepository $repository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
        $this->repository = $this->entityManager->getRepository(Appointment::class);
        $this->cleanDatabase();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
    }

    /**
     * Nettoie la base de données entre chaque test
     */
    private function cleanDatabase(): void
    {
        $this->entityManager->createQuery('DELETE FROM App\\Entity\\Appointment')->execute();
        $this->entityManager->createQuery('DELETE FROM App\\Entity\\Patient')->execute();
    }

    /**
     * Teste la sauvegarde et récupération d'un rendez-vous
     */
    public function testSaveAndRetrieveAppointment(): void
    {
        $patient = $this->createPatient('Test', 'Patient', 'apptest@medisys.fr');
        $appointment = new Appointment();
        $appointment->setPatient($patient)
            ->setDateTime(new \DateTimeImmutable('+1 day'))
            ->setDuration(30)
            ->setReason('Consultation')
            ->setStatus('scheduled');
        $this->entityManager->persist($patient);
        $this->entityManager->persist($appointment);
        $this->entityManager->flush();

        $saved = $this->repository->find($appointment->getId());
        $this->assertNotNull($saved);
        $this->assertEquals('Consultation', $saved->getReason());
        $this->assertEquals($patient->getId(), $saved->getPatient()->getId());
    }

    /**
     * Teste la recherche par patient
     */
    public function testFindByPatientId(): void
    {
        $patient1 = $this->createPatient('Alice', 'Test', 'alice@medisys.fr');
        $patient2 = $this->createPatient('Bob', 'Test', 'bob@medisys.fr');
        $this->entityManager->persist($patient1);
        $this->entityManager->persist($patient2);
        $this->entityManager->flush();

        $appt1 = new Appointment();
        $appt1->setPatient($patient1)->setDateTime(new \DateTimeImmutable('+2 days'))->setDuration(30)->setReason('Bilan')->setStatus('scheduled');
        $appt2 = new Appointment();
        $appt2->setPatient($patient2)->setDateTime(new \DateTimeImmutable('+3 days'))->setDuration(45)->setReason('Suivi')->setStatus('scheduled');
        $this->entityManager->persist($appt1);
        $this->entityManager->persist($appt2);
        $this->entityManager->flush();

        $results = $this->repository->findByPatientId($patient1->getId());
        $this->assertCount(1, $results);
        $this->assertEquals('Bilan', $results[0]->getReason());
    }

    /**
     * Teste la recherche des rendez-vous à venir
     */
    public function testFindUpcoming(): void
    {
        $patient = $this->createPatient('Upcoming', 'Test', 'upcoming@medisys.fr');
        $past = new Appointment();
        $past->setPatient($patient)->setDateTime(new \DateTimeImmutable('-1 day'))->setDuration(30)->setReason('Ancien')->setStatus('completed');
        $future = new Appointment();
        $future->setPatient($patient)->setDateTime(new \DateTimeImmutable('+2 days'))->setDuration(30)->setReason('Futur')->setStatus('scheduled');
        $this->entityManager->persist($patient);
        $this->entityManager->persist($past);
        $this->entityManager->persist($future);
        $this->entityManager->flush();

        $results = $this->repository->findUpcoming();
        $this->assertNotEmpty($results);
        $this->assertEquals('Futur', $results[0]->getReason());
    }

    /**
     * Crée un patient de test
     */
    private function createPatient(string $first, string $last, string $email): Patient
    {
        $patient = new Patient();
        $patient->setFirstName($first)
            ->setLastName($last)
            ->setEmail($email)
            ->setGender('F')
            ->setBirthDate(new \DateTime('1990-01-01'));
        return $patient;
    }
}
