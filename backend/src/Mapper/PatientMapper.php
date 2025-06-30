<?php

namespace App\Mapper;

use App\Dto\PatientDTO;
use App\Entity\Patient;

class PatientMapper
{
    /**
     * Mappe un PatientDTO vers une entité Patient (création ou update)
     */
    public function dtoToEntity(PatientDTO $dto, ?Patient $entity = null): Patient
    {
        $patient = $entity ?? new Patient();
        $patient->setFirstName($dto->firstName);
        $patient->setLastName($dto->lastName);
        $patient->setEmail($dto->email);
        $patient->setBirthDate(new \DateTimeImmutable($dto->birthDate));
        $patient->setGender($dto->gender);
        $patient->setPhone($dto->phone);
        $patient->setMedicalHistory($dto->medicalHistory);
        return $patient;
    }
}
