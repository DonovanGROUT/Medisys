<?php

namespace App\DataFixtures;

use App\Entity\Appointment;
use App\Entity\Patient;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

/**
 * Fixture de jeu de données pour l'entité Appointment (rendez-vous).
 * Génère des rendez-vous de test pour chaque patient existant.
 */
class AppointmentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $patients = $manager->getRepository(Patient::class)->findAll();
        $now = new \DateTimeImmutable();
        $motifs = ['Consultation', 'Suivi', 'Bilan', 'Urgence', 'Vaccination'];
        $statuses = ['scheduled', 'cancelled', 'completed'];

        foreach ($patients as $i => $patient) {
            for ($j = 0; $j < 3; $j++) {
                $appointment = new Appointment();
                $appointment->setPatient($patient);
                $appointment->setDateTime($now->modify('+' . ($i * 3 + $j + 1) . ' days')->setTime(9 + $j * 2, 0));
                $appointment->setDuration(30 + 15 * $j);
                $appointment->setReason($motifs[array_rand($motifs)]);
                $appointment->setStatus($statuses[array_rand($statuses)]);
                $manager->persist($appointment);
            }
        }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [PatientFixtures::class];
    }
}
