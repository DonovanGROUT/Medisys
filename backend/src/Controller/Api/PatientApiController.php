<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Annotations as OA;
use App\Mapper\PatientMapper;

/**
 * Contrôleur API REST pour la gestion des patients (CRUD).
 *
 * - GET    /api/patients         : liste tous les patients
 * - GET    /api/patients/{id}    : détail d'un patient
 * - POST   /api/patients         : création d'un patient
 * - PUT    /api/patients/{id}    : modification totale (remplacement)
 * - PATCH  /api/patients/{id}    : modification partielle (privilégiée)
 * - DELETE /api/patients/{id}    : suppression d'un patient
 *
 * Convention :
 *   - PATCH est la méthode recommandée pour la modification côté front (modif partielle).
 *   - PUT reste disponible pour la modification totale (remplacement complet de la ressource).
 *   - Toutes les routes sont documentées via OpenAPI/Swagger.
 *
 * @package App\Controller
 */

#[Route('/api/patients', name: 'api_patients_')]
class PatientApiController extends AbstractController
{
    // TODO Sécurité d'accès : ajouter vérification des droits (authentification, rôles, voters) sur chaque endpoint dès que l'authentification sera en place.
    // Exemple : @IsGranted('ROLE_USER') ou voter personnalisé (ex : un rendez-vous ne peut être modifié que par le praticien du patient ou par l'admin).

    private PatientRepository $patientRepository;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    private PatientMapper $patientMapper;

    public function __construct(PatientRepository $patientRepository, SerializerInterface $serializer, ValidatorInterface $validator, PatientMapper $patientMapper)
    {
        $this->patientRepository = $patientRepository;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->patientMapper = $patientMapper;
    }

    #[Route('', name: 'list', methods: ['GET'])]
    /**
     * Liste tous les patients.
     * GET /api/patients
     *
     * @OA\Get(
     *     path="/api/patients",
     *     summary="Liste des patients",
     *     @OA\Response(
     *         response=200,
     *         description="Liste des patients"
     *     )
     * )
     */
    public function list(): JsonResponse
    {
        $patients = $this->patientRepository->findAll();
        $data = $this->serializer->serialize($patients, 'json');
        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    /**
     * Détail d'un patient par son identifiant.
     * GET /api/patients/{id}
     *
     * @OA\Get(
     *     path="/api/patients/{id}",
     *     summary="Détail d'un patient",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du patient",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détail du patient"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Patient non trouvé"
     *     )
     * )
     */
    public function show(Patient $patient): JsonResponse
    {
        $data = $this->serializer->serialize($patient, 'json');
        return new JsonResponse($data, 200, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    /**
     * Crée un nouveau patient.
     * POST /api/patients
     *
     * @OA\Post(
     *     path="/api/patients",
     *     summary="Créer un patient",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/PatientDTO")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Patient créé"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Données invalides"
     *     )
     * )
     */
    public function create(Request $request): JsonResponse
    {
        $data = $request->getContent();
        try {
            $patientDTO = $this->serializer->deserialize($data, \App\Dto\PatientDTO::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($patientDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $property = $error->getPropertyPath();
                $errorMessages[$property][] = $error->getMessage();
            }
            return $this->json([
                'error' => 'Données invalides',
                'violations' => $errorMessages
            ], 400);
        }
        try {
            $patient = $this->patientMapper->dtoToEntity($patientDTO);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur lors du mapping des données (champ manquant ou invalide)',
                'details' => $e->getMessage(),
            ], 400);
        }
        try {
            $this->patientRepository->add($patient, true);
        } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException | \Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return $this->json([
                'error' => "Contrainte d'unicité ou de non-nullité violée (ex: email déjà utilisé)",
                'details' => $e->getMessage(),
            ], 400);
        }
        $json = $this->serializer->serialize($patient, 'json');
        return new JsonResponse($json, 201, [], true);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    /**
     * Met à jour totalement un patient (remplacement complet).
     * PUT /api/patients/{id}
     * À utiliser pour remplacer toutes les données d'un patient.
     *
     * @OA\Put(
     *     path="/api/patients/{id}",
     *     summary="Mettre à jour un patient",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du patient",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Patient")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Patient mis à jour"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Données invalides"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Patient non trouvé"
     *     )
     * )
     */
    public function update(Request $request, Patient $patient): JsonResponse
    {
        $data = $request->getContent();
        try {
            $patientDTO = $this->serializer->deserialize($data, \App\Dto\PatientDTO::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($patientDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            $missingFields = [];
            foreach ($errors as $error) {
                $property = $error->getPropertyPath();
                $errorMessages[$property][] = $error->getMessage();
                if (stripos($error->getMessage(), 'obligatoire') !== false) {
                    $missingFields[] = $property;
                }
            }
            $errorText = 'Données invalides';
            if (!empty($missingFields)) {
                $errorText = 'Champ obligatoire manquant : ' . implode(', ', $missingFields);
            }
            return $this->json([
                'error' => $errorText,
                'violations' => $errorMessages
            ], 400);
        }
        try {
            $this->patientMapper->dtoToEntity($patientDTO, $patient);
        } catch (\Throwable $e) {
            $msg = $e->getMessage();
            if (preg_match('/must not be accessed before initialization/', $msg, $m)) {
                if (preg_match('/\\\
PatientDTO::\$(\w+)/', $msg, $propMatch)) {
                    $field = $propMatch[1];
                    $msg = "Le champ $field est obligatoire.";
                } else {
                    $msg = "Champ obligatoire manquant.";
                }
            }
            return $this->json([
                'error' => 'Erreur lors du mapping des données (champ manquant ou invalide)',
                'details' => $msg,
            ], 400);
        }
        try {
            $this->patientRepository->add($patient, true);
        } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException | \Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return $this->json([
                'error' => "Contrainte d'unicité ou de non-nullité violée (ex: email déjà utilisé)",
                'details' => $e->getMessage(),
            ], 400);
        }
        $json = $this->serializer->serialize($patient, 'json');
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    /**
     * Supprime un patient.
     * DELETE /api/patients/{id}
     *
     * @OA\Delete(
     *     path="/api/patients/{id}",
     *     summary="Supprimer un patient",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du patient",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Patient supprimé"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Patient non trouvé"
     *     )
     * )
     */
    public function delete(Patient $patient): JsonResponse
    {
        $this->patientRepository->remove($patient, true);
        return new JsonResponse(null, 204);
    }

    #[Route('/{id}', name: 'patch', methods: ['PATCH'])]
    /**
     * Modifie partiellement un patient (modification recommandée).
     * PATCH /api/patients/{id}
     * Privilégier cette méthode pour la modification côté front.
     *
     * @OA\Patch(
     *     path="/api/patients/{id}",
     *     summary="Modifier partiellement un patient",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du patient",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Patient")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Patient modifié"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Données invalides"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Patient non trouvé"
     *     )
     * )
     */
    public function patch(Request $request, Patient $patient): JsonResponse
    {
        $data = $request->getContent();
        $dataArray = json_decode($data, true);
        // Vérification des champs inconnus
        $allowedFields = ['firstName', 'lastName', 'email', 'birthDate', 'gender', 'phone', 'medicalHistory'];
        $unknownFields = array_diff(array_keys($dataArray), $allowedFields);
        if (!empty($unknownFields)) {
            return $this->json([
                'error' => 'Champs inconnus dans la requête',
                'violations' => array_values($unknownFields)
            ], 400);
        }
        try {
            $patientDTO = $this->serializer->deserialize($data, \App\Dto\PatientDTO::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        // Validation partielle : on ne valide que les champs présents dans la requête
        $groups = [];
        foreach ($dataArray as $field => $value) {
            $groups[] = $field;
        }
        $errors = $this->validator->validate($patientDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $property = $error->getPropertyPath();
                // On ne remonte que les erreurs sur les champs présents dans la requête
                if (array_key_exists($property, $dataArray)) {
                    $errorMessages[$property][] = $error->getMessage();
                }
            }
            if (!empty($errorMessages)) {
                return $this->json([
                    'error' => 'Données invalides',
                    'violations' => $errorMessages
                ], 400);
            }
        }
        // Mapping conditionnel DTO -> entité (seulement les champs présents)
        if (isset($dataArray['firstName'])) $patient->setFirstName($patientDTO->firstName);
        if (isset($dataArray['lastName'])) $patient->setLastName($patientDTO->lastName);
        if (isset($dataArray['email'])) $patient->setEmail($patientDTO->email);
        if (isset($dataArray['birthDate'])) $patient->setBirthDate(new \DateTimeImmutable($patientDTO->birthDate));
        if (isset($dataArray['gender'])) $patient->setGender($patientDTO->gender);
        if (array_key_exists('phone', $dataArray)) $patient->setPhone($patientDTO->phone);
        if (array_key_exists('medicalHistory', $dataArray)) $patient->setMedicalHistory($patientDTO->medicalHistory);
        try {
            $this->patientRepository->add($patient, true);
        } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException | \Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return $this->json([
                'error' => "Contrainte d'unicité ou de non-nullité violée (ex: email déjà utilisé)",
                'details' => $e->getMessage(),
            ], 400);
        }
        $json = $this->serializer->serialize($patient, 'json');
        return new JsonResponse($json, 200, [], true);
    }
}
