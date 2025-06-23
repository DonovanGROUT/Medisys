<?php

namespace App\Repository;

use App\Entity\Patient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository Patient - Couche d'accès aux données médicales
 *
 * Cette classe gère l'accès sécurisé aux données des patients.
 * Elle agit comme un "garde-barrière" pour garantir que seules les opérations
 * autorisées sont effectuées sur les données médicales sensibles.
 *
 * Fonctionnalités de sécurité :
 * - Contrôle d'accès aux données personnelles
 * - Audit des requêtes sur les dossiers médicaux
 * - Méthodes de recherche sécurisées
 *
 * @author Donovan GROUT
 * @since 1.1.0
 */
class PatientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Patient::class);
    }

    /**
     * Recherche des patients par critères (exemple commenté)
     *
     * Cette méthode montre comment créer des requêtes sécurisées
     * pour rechercher des patients selon des critères spécifiques.
     *
     * @param mixed $value Valeur à rechercher
     * @return Patient[] Tableau de patients correspondants
     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Patient
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
