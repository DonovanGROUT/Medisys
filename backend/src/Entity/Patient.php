<?php

namespace App\Entity;

use App\Repository\PatientRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Entité Patient - Représente un patient dans le système médical Medisys
 *
 * Cette classe contient les informations personnelles et médicales d'un patient.
 * Toutes les propriétés sont privées pour garantir la confidentialité des données
 * médicales conformément aux réglementations RGPD et de sécurité médicale.
 *
 * @OA\Schema(
 *   schema="Patient",
 *   type="object",
 *   required={"firstName", "lastName", "email", "birthDate", "gender"},
 *   @OA\Property(property="id", type="integer", example=1, description="Identifiant unique du patient"),
 *   @OA\Property(property="firstName", type="string", example="Jean", description="Prénom du patient"),
 *   @OA\Property(property="lastName", type="string", example="Dupont", description="Nom du patient"),
 *   @OA\Property(property="email", type="string", format="email", example="jean.dupont@email.com", description="Adresse email du patient"),
 *   @OA\Property(property="phone", type="string", example="+33612345678", description="Numéro de téléphone du patient"),
 *   @OA\Property(property="birthDate", type="string", format="date", example="1990-01-01", description="Date de naissance (YYYY-MM-DD)"),
 *   @OA\Property(property="gender", type="string", example="M", description="Genre du patient (M=Homme, F=Femme, X=Autre)"),
 *   @OA\Property(property="medicalHistory", type="string", example="Aucune allergie connue", description="Historique médical du patient"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", example="2025-06-25T10:00:00+00:00", description="Date de création du dossier"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", example="2025-06-25T10:00:00+00:00", description="Date de dernière modification")
 * )
 */
#[ORM\Entity(repositoryClass: PatientRepository::class)]
class Patient
{
    /**
     * Identifiant unique du patient
     * Généré automatiquement par la base de données
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Prénom du patient
     * Information personnelle sensible - accès contrôlé
     * @Assert\NotBlank(message="Le prénom est obligatoire.")
     * @Assert\Length(max=100, maxMessage="Le prénom ne doit pas dépasser 100 caractères.")
     */
    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    /**
     * Nom de famille du patient
     * Information personnelle sensible - accès contrôlé
     * @Assert\NotBlank(message="Le nom est obligatoire.")
     * @Assert\Length(max=100, maxMessage="Le nom ne doit pas dépasser 100 caractères.")
     */
    #[ORM\Column(length: 100)]
    private ?string $lastName = null;

    /**
     * Adresse email du patient (unique)
     * Utilisée pour la communication et l'authentification
     * RGPD : données personnelles sensibles
     * @Assert\NotBlank(message="L'email est obligatoire.")
     * @Assert\Email(message="L'email n'est pas valide.")
     * @Assert\Length(max=180, maxMessage="L'email ne doit pas dépasser 180 caractères.")
     */
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    /**
     * Numéro de téléphone du patient (optionnel)
     * Format international recommandé (+33...)
     * @Assert\Length(max=20, maxMessage="Le téléphone ne doit pas dépasser 20 caractères.")
     * @Assert\Regex(pattern="/^\+?[0-9 .-]{8,20}$/", message="Le numéro de téléphone n'est pas valide.")
     */
    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phone = null;

    /**
     * Date de naissance du patient
     * Utilisée pour calculer l'âge et vérifier l'éligibilité aux traitements
     * @Assert\NotBlank(message="La date de naissance est obligatoire.")
     * @Assert\Date(message="La date de naissance doit être une date valide.")
     */
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $birthDate = null;

    /**
     * Genre du patient
     * Valeurs acceptées : 'M' (Masculin), 'F' (Féminin), 'X' (Autre)
     * Information médicale importante pour les traitements
     * @Assert\NotBlank(message="Le genre est obligatoire.")
     * @Assert\Choice(choices={"M", "F", "X"}, message="Le genre doit être M, F ou X.")
     */
    #[ORM\Column(length: 10)]
    private ?string $gender = null;

    /**
     * Historique médical du patient
     * CONFIDENTIALITÉ MAXIMALE - Données médicales sensibles
     * Contient allergies, antécédents, traitements en cours, etc.
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $medicalHistory = null;

    /**
     * Date de création du dossier patient
     * Audit trail - Important pour la traçabilité
     */
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * Date de dernière modification du dossier
     * Audit trail - Important pour la traçabilité
     */
    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        if (empty(trim($firstName))) {
            throw new \InvalidArgumentException("Le prénom est obligatoire.");
        }
        if (mb_strlen($firstName) > 100) {
            throw new \InvalidArgumentException("Le prénom ne doit pas dépasser 100 caractères.");
        }
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        if (empty(trim($lastName))) {
            throw new \InvalidArgumentException("Le nom est obligatoire.");
        }
        if (mb_strlen($lastName) > 100) {
            throw new \InvalidArgumentException("Le nom ne doit pas dépasser 100 caractères.");
        }
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("L'email n'est pas valide.");
        }
        if (mb_strlen($email) > 180) {
            throw new \InvalidArgumentException("L'email ne doit pas dépasser 180 caractères.");
        }
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        if ($phone !== null) {
            if (mb_strlen($phone) > 20) {
                throw new \InvalidArgumentException("Le téléphone ne doit pas dépasser 20 caractères.");
            }
            if (!preg_match('/^\+?[0-9 .-]{8,20}$/', $phone)) {
                throw new \InvalidArgumentException("Le numéro de téléphone n'est pas valide.");
            }
        }
        $this->phone = $phone;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static
    {
        if (!$birthDate instanceof \DateTimeInterface) {
            throw new \InvalidArgumentException("La date de naissance doit être une date valide.");
        }
        $now = new \DateTimeImmutable('today');
        if ($birthDate > $now) {
            throw new \InvalidArgumentException("La date de naissance ne peut pas être dans le futur.");
        }
        $this->birthDate = $birthDate;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): static
    {
        if (!in_array($gender, ['M', 'F', 'X'], true)) {
            throw new \InvalidArgumentException("Le genre doit être M, F ou X.");
        }
        $this->gender = $gender;

        return $this;
    }

    public function getMedicalHistory(): ?string
    {
        return $this->medicalHistory;
    }

    public function setMedicalHistory(?string $medicalHistory): static
    {
        $this->medicalHistory = $medicalHistory;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Méthode utilitaire pour obtenir le nom complet
     */
    public function getFullName(): string
    {
        return $this->firstName . ' ' . $this->lastName;
    }

    /**
     * Méthode utilitaire pour calculer l'âge
     */
    public function getAge(): ?int
    {
        if (!$this->birthDate) {
            return null;
        }

        return $this->birthDate->diff(new \DateTime())->y;
    }
}
