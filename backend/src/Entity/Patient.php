<?php

namespace App\Entity;

use App\Repository\PatientRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Entité Patient - Représente un patient dans le système médical Medisys
 * 
 * Cette classe contient les informations personnelles et médicales d'un patient.
 * Toutes les propriétés sont privées pour garantir la confidentialité des données
 * médicales conformément aux réglementations RGPD et de sécurité médicale.
 * 
 * @author Donovan GROUT
 * @since 1.1.0
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
     */
    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    /**
     * Nom de famille du patient  
     * Information personnelle sensible - accès contrôlé
     */
    #[ORM\Column(length: 100)]
    private ?string $lastName = null;

    /**
     * Adresse email du patient (unique)
     * Utilisée pour la communication et l'authentification
     * RGPD: Donnée personnelle sensible
     */
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    /**
     * Numéro de téléphone du patient (optionnel)
     * Format international recommandé (+33...)
     */
    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phone = null;

    /**
     * Date de naissance du patient
     * Utilisée pour calculer l'âge et vérifier l'éligibilité aux traitements
     */
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $birthDate = null;

    /**
     * Genre du patient
     * Valeurs acceptées : 'M' (Masculin), 'F' (Féminin), 'Autre'
     * Information médicale importante pour les traitements
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
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): static
    {
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
