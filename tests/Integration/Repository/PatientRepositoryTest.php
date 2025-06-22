<?php

namespace App\Tests\Integration\Repository;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Tests d'intégration pour le Repository Patient
 *
 * Ces tests utilisent une vraie base de données de test
 * pour vérifier que Doctrine fonctionne correctement.
 *
 * @author Donovan GROUT
 * @since 1.1.0
 */
class PatientRepositoryTest extends KernelTestCase
{
    private EntityManagerInterface $entityManager;
    private PatientRepository $repository;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->repository = $this->entityManager
            ->getRepository(Patient::class);

        // Nettoyage de la base entre chaque test
        $this->cleanDatabase();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
    }

    /**
     * Nettoie la base de données entre chaque test pour éviter les conflits
     */
    private function cleanDatabase(): void
    {
        // Supprime tous les patients pour éviter les conflits d'email
        $this->entityManager->createQuery('DELETE FROM App\Entity\Patient')->execute();
    }

    /**
     * Teste la sauvegarde et récupération d'un patient en base de données
     */
    public function testSaveAndRetrievePatient(): void
    {
        $patient = new Patient();
        $patient->setFirstName("Test")
                ->setLastName("Patient")
                ->setEmail("test@medisys.fr")
                ->setGender("F")
                ->setBirthDate(new \DateTime('1985-03-20'));

        // Sauvegarde
        $this->entityManager->persist($patient);
        $this->entityManager->flush();

        // Récupération
        $savedPatient = $this->repository->find($patient->getId());

        $this->assertNotNull($savedPatient);
        $this->assertEquals("Test Patient", $savedPatient->getFullName());
        $this->assertEquals("test@medisys.fr", $savedPatient->getEmail());
    }

    /**
     * Vérifie que la contrainte d'unicité sur l'email fonctionne correctement
     */
    public function testEmailUniqueness(): void
    {
        // Test de contrainte d'unicité
        $patient1 = new Patient();
        $patient1->setFirstName("Patient")
                 ->setLastName("Un")
                 ->setEmail("unique@medisys.fr")
                 ->setGender("M")
                 ->setBirthDate(new \DateTime('1990-01-01'));

        $patient2 = new Patient();
        $patient2->setFirstName("Patient")
                 ->setLastName("Deux")
                 ->setEmail("unique@medisys.fr") // Même email !
                 ->setGender("F")
                 ->setBirthDate(new \DateTime('1992-01-01'));

        $this->entityManager->persist($patient1);
        $this->entityManager->flush();

        $this->entityManager->persist($patient2);

        // Doit lever une exception de contrainte
        $this->expectException(\Doctrine\DBAL\Exception\UniqueConstraintViolationException::class);
        $this->entityManager->flush();
    }

    /**
     * Vérifie que l'audit trail (dates automatiques) fonctionne correctement
     */
    public function testAuditTrail(): void
    {
        $patient = new Patient();
        $patient->setFirstName("Audit")
                ->setLastName("Test")
                ->setEmail("audit@medisys.fr")
                ->setGender("M")
                ->setBirthDate(new \DateTime('1988-06-15'));

        $createdAt = $patient->getCreatedAt();
        $updatedAt = $patient->getUpdatedAt();

        // Vérifications avant sauvegarde
        $this->assertNotNull($createdAt);
        $this->assertNotNull($updatedAt);
        $this->assertEquals($createdAt->format('Y-m-d H:i:s'),
                           $updatedAt->format('Y-m-d H:i:s'));

        $this->entityManager->persist($patient);
        $this->entityManager->flush();

        // Simulation d'une modification
        sleep(1); // Pour avoir une différence de timestamp
        $patient->setFirstName("Audit Modifié");
        $patient->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        // Vérification de l'audit trail
        $this->assertNotEquals($createdAt->format('Y-m-d H:i:s'),
                              $patient->getUpdatedAt()->format('Y-m-d H:i:s'));
    }
}
