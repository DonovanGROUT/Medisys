<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO pour la création et la modification d'un patient (POST/PUT/PATCH)
 *
 * @OA\Schema(
 *   schema="PatientDTO",
 *   type="object",
 *   required={"firstName", "lastName", "email", "birthDate", "gender"},
 *   @OA\Property(property="firstName", type="string", maxLength=255, example="Jean"),
 *   @OA\Property(property="lastName", type="string", maxLength=255, example="Dupont"),
 *   @OA\Property(property="email", type="string", format="email", maxLength=255, example="jean.dupont@email.com"),
 *   @OA\Property(property="birthDate", type="string", format="date", example="1990-01-01"),
 *   @OA\Property(property="gender", type="string", enum={"M","F","X"}, example="M"),
 *   @OA\Property(property="phone", type="string", maxLength=20, nullable=true, example="+33612345678"),
 *   @OA\Property(property="medicalHistory", type="string", maxLength=1000, nullable=true, example="Aucun antécédent connu")
 * )
 */
class PatientDTO
{
    /**
     * Prénom du patient
     * @Assert\NotBlank
     * @Assert\Length(max: 255)
     */
    public string $firstName;

    /**
     * Nom du patient
     * @Assert\NotBlank
     * @Assert\Length(max: 255)
     */
    public string $lastName;

    /**
     * Email du patient
     * @Assert\NotBlank
     * @Assert\Email
     * @Assert\Length(max: 255)
     */
    public string $email;

    /**
     * Date de naissance (YYYY-MM-DD)
     * @Assert\NotBlank
     * @Assert\Date
     */
    public string $birthDate;

    /**
     * Genre du patient (M, F, X)
     * @Assert\NotBlank
     * @Assert\Choice(['M', 'F', 'X'])
     */
    public string $gender;

    /**
     * Numéro de téléphone (optionnel)
     * @Assert\Length(max: 20)
     */
    public ?string $phone = null;

    /**
     * Historique médical (optionnel)
     * @Assert\Length(max: 1000)
     */
    public ?string $medicalHistory = null;
}
