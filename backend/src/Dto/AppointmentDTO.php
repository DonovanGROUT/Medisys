<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *   schema="AppointmentDTO",
 *   type="object",
 *   required={"patientId", "dateTime", "duration", "reason", "status"},
 *   @OA\Property(property="patientId", type="integer", example=1, description="ID du patient associé au rendez-vous"),
 *   @OA\Property(property="dateTime", type="string", format="date-time", example="2025-07-01T09:00:00+00:00", description="Date et heure du rendez-vous"),
 *   @OA\Property(property="duration", type="integer", example=30, description="Durée du rendez-vous en minutes"),
 *   @OA\Property(property="reason", type="string", example="Consultation annuelle", description="Motif du rendez-vous"),
 *   @OA\Property(property="status", type="string", example="scheduled", description="Statut du rendez-vous (scheduled, cancelled, completed)")
 * )
 */
class AppointmentDTO
{
    /**
     * @Assert\NotNull(message="L'ID du patient est obligatoire.")
     */
    public ?int $patientId = null;

    /**
     * @Assert\NotBlank(message="La date et l'heure du rendez-vous sont obligatoires.")
     * @Assert\GreaterThan("now", message="La date du rendez-vous doit être dans le futur.")
     */
    public ?string $dateTime = null;

    /**
     * @Assert\NotBlank(message="La durée est obligatoire.")
     * @Assert\Positive(message="La durée doit être positive.")
     */
    public ?int $duration = null;

    /**
     * @Assert\NotBlank(message="Le motif est obligatoire.")
     * @Assert\Length(max=255, maxMessage="Le motif ne doit pas dépasser 255 caractères.")
     */
    public ?string $reason = null;

    /**
     * @Assert\Choice(choices={"scheduled", "cancelled", "completed"}, message="Statut invalide.")
     */
    public ?string $status = 'scheduled';
}
