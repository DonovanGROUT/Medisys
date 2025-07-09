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
                // Répartir les rendez-vous autour de la date courante :
                // - le premier dans le passé, les deux autres dans le futur
                if ($j === 0) {
                    $date = $now->modify('-' . ($i + 1) . ' days')->setTime(9, 0);
                } else {
                    $date = $now->modify('+' . ($i * 3 + $j + 1) . ' days')->setTime(9 + $j * 2, 0);
                }
                $appointment->setPatient($patient);
                $appointment->setDateTime($date);
                $appointment->setDuration(30 + 15 * $j);
                $appointment->setReason($motifs[array_rand($motifs)]);
                // Statut : 'completed' seulement si la date est passée, sinon 'scheduled' ou 'cancelled'
                if ($date < $now) {
                    $status = 'completed';
                } else {
                    $status = (rand(0, 1) ? 'scheduled' : 'cancelled');
                }
                $appointment->setStatus($status);
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
