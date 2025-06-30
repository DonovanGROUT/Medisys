<?php

namespace App\Mapper;

use App\Dto\AppointmentDTO;
use App\Entity\Appointment;
use App\Entity\Patient;

class AppointmentMapper
{
    /**
     * Mappe un AppointmentDTO vers une entité Appointment (création ou update)
     */
    public function dtoToEntity(AppointmentDTO $dto, Patient $patient, ?Appointment $entity = null): Appointment
    {
        $appointment = $entity ?? new Appointment();
        $appointment->setPatient($patient);
        $appointment->setDateTime(new \DateTimeImmutable($dto->dateTime));
        $appointment->setDuration($dto->duration);
        $appointment->setReason($dto->reason);
        $appointment->setStatus($dto->status);
        return $appointment;
    }
}
