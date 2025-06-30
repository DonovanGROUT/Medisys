<?php

namespace App\Entity;

use App\Repository\AppointmentRepository;
use App\Entity\Patient;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Entité Appointment - Représente un rendez-vous médical dans Medisys
 *
 * Cette classe contient les informations d'un rendez-vous associé à un patient.
 * Toutes les propriétés sont privées pour garantir la cohérence métier et la sécurité des données.
 *
 * @OA\Schema(
 *   schema="Appointment",
 *   type="object",
 *   required={"patient", "dateTime", "duration", "reason", "status"},
 *   @OA\Property(property="id", type="integer", example=1, description="Identifiant unique du rendez-vous"),
 *   @OA\Property(property="patient", ref="#/components/schemas/Patient", description="Patient associé au rendez-vous"),
 *   @OA\Property(property="dateTime", type="string", format="date-time", example="2025-07-01T09:00:00+00:00", description="Date et heure du rendez-vous"),
 *   @OA\Property(property="duration", type="integer", example=30, description="Durée du rendez-vous en minutes"),
 *   @OA\Property(property="reason", type="string", example="Consultation annuelle", description="Motif du rendez-vous"),
 *   @OA\Property(property="status", type="string", example="scheduled", description="Statut du rendez-vous (scheduled, cancelled, completed)")
 * )
 */
#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
class Appointment
{
    /**
     * Identifiant unique du rendez-vous
     * Généré automatiquement par la base de données
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Patient associé au rendez-vous
     * Relation ManyToOne obligatoire
     * @Assert\NotNull(message="Le patient est obligatoire.")
     */
    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Patient $patient = null;

    /**
     * Date et heure du rendez-vous
     * @Assert\NotBlank(message="La date et l'heure du rendez-vous sont obligatoires.")
     * @Assert\GreaterThan("now", message="La date du rendez-vous doit être dans le futur.")
     */
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateTime = null;

    /**
     * Durée du rendez-vous en minutes
     * @Assert\NotBlank(message="La durée est obligatoire.")
     * @Assert\Positive(message="La durée doit être positive.")
     */
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $duration = null;

    /**
     * Motif du rendez-vous
     * @Assert\NotBlank(message="Le motif est obligatoire.")
     * @Assert\Length(max=255, maxMessage="Le motif ne doit pas dépasser 255 caractères.")
     */
    #[ORM\Column(length: 255)]
    private ?string $reason = null;

    /**
     * Statut du rendez-vous (prévu, annulé, terminé...)
     * @Assert\Choice(choices={"scheduled", "cancelled", "completed"}, message="Statut invalide.")
     */
    #[ORM\Column(length: 20)]
    private ?string $status = 'scheduled';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(Patient $patient): static
    {
        $this->patient = $patient;
        return $this;
    }

    public function getDateTime(): ?\DateTimeInterface
    {
        return $this->dateTime;
    }

    public function setDateTime(\DateTimeInterface $dateTime): static
    {
        $this->dateTime = $dateTime;
        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        if ($duration <= 0) {
            throw new \InvalidArgumentException("La durée doit être positive.");
        }
        $this->duration = $duration;
        return $this;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): static
    {
        if (empty(trim($reason))) {
            throw new \InvalidArgumentException("Le motif est obligatoire.");
        }
        if (mb_strlen($reason) > 255) {
            throw new \InvalidArgumentException("Le motif ne doit pas dépasser 255 caractères.");
        }
        $this->reason = $reason;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $valid = ["scheduled", "cancelled", "completed"];
        if (!in_array($status, $valid, true)) {
            throw new \InvalidArgumentException("Statut invalide.");
        }
        $this->status = $status;
        return $this;
    }
}
