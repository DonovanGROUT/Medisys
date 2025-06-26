<?php

namespace App\DataFixtures;

use App\Entity\Patient;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Fixture de jeu de données pour l'entité Patient.
 *
 * Permet d'initialiser la base avec des patients de test pour le développement,
 * la démonstration ou les tests automatisés front/back.
 *
 * Les données générées sont fictives et ne doivent jamais être utilisées en production.
 */
class PatientFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $patientsData = [
            [
                'firstName' => 'Marie',
                'lastName' => 'Dupont',
                'email' => 'marie.dupont@email.com',
                'phone' => '0601020304',
                'birthDate' => '1985-04-12',
                'gender' => 'F',
            ],
            [
                'firstName' => 'Paul',
                'lastName' => 'Martin',
                'email' => 'paul.martin@email.com',
                'phone' => null,
                'birthDate' => '1978-11-23',
                'gender' => 'M',
            ],
            [
                'firstName' => 'Sophie',
                'lastName' => 'Durand',
                'email' => 'sophie.durand@email.com',
                'phone' => '0611223344',
                'birthDate' => '1992-07-05',
                'gender' => 'F',
            ],
            [
                'firstName' => 'Alex',
                'lastName' => 'Morgan',
                'email' => 'alex.morgan@email.com',
                'phone' => '0612345678',
                'birthDate' => '1990-01-01',
                'gender' => 'X',
            ],
            [
                'firstName' => 'Jean',
                'lastName' => 'Testeur',
                'email' => 'jean.testeur@email.com',
                'phone' => '0600000000',
                'birthDate' => '2000-01-01',
                'gender' => 'M',
                'medicalHistory' => 'Patient ajouté pour test front/back',
            ],
        ];

        foreach ($patientsData as $data) {
            $patient = new Patient();
            $patient->setFirstName($data['firstName']);
            $patient->setLastName($data['lastName']);
            $patient->setEmail($data['email']);
            $patient->setPhone($data['phone']);
            $patient->setBirthDate(new \DateTime($data['birthDate']));
            $patient->setGender($data['gender']);
            if (isset($data['medicalHistory'])) {
                $patient->setMedicalHistory($data['medicalHistory']);
            }
            $manager->persist($patient);
        }
        $manager->flush();
    }
}
