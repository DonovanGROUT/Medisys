<?php

namespace App\Repository;

use App\Entity\Appointment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository Appointment - Couche d'accès aux données de rendez-vous
 *
 * Cette classe gère l'accès sécurisé aux rendez-vous médicaux.
 * Elle permet de rechercher, filtrer et auditer les rendez-vous associés aux patients.
 *
 * Fonctionnalités :
 * - Recherche par patient, date, statut
 * - Sécurité et audit des accès
 *
 * @author Donovan GROUT
 * @since 2.0.0
 */
class AppointmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

    /**
     * Recherche des rendez-vous par patient
     *
     * @param int $patientId
     * @return Appointment[]
     */
    public function findByPatientId(int $patientId): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.patient = :patientId')
            ->setParameter('patientId', $patientId)
            ->orderBy('a.dateTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche des rendez-vous à venir
     *
     * @return Appointment[]
     */
    public function findUpcoming(): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.dateTime > :now')
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('a.dateTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Ajoute un rendez-vous
     *
     * @param Appointment $appointment
     * @param bool $flush
     */
    public function add(Appointment $appointment, bool $flush = false): void
    {
        $em = $this->getEntityManager();
        $em->persist($appointment);
        if ($flush) {
            $em->flush();
        }
    }

    /**
     * Supprime un rendez-vous
     *
     * @param Appointment $appointment
     * @param bool $flush
     */
    public function remove(Appointment $appointment, bool $flush = false): void
    {
        $em = $this->getEntityManager();
        $em->remove($appointment);
        if ($flush) {
            $em->flush();
        }
    }
}
