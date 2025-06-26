<?php

namespace App\Controller;

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
    private PatientRepository $patientRepository;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;

    public function __construct(PatientRepository $patientRepository, SerializerInterface $serializer, ValidatorInterface $validator)
    {
        $this->patientRepository = $patientRepository;
        $this->serializer = $serializer;
        $this->validator = $validator;
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
     *         @OA\JsonContent(ref="#/components/schemas/Patient")
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
            $patient = $this->serializer->deserialize($data, Patient::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($patient);
        if (count($errors) > 0) {
            // Transformation des violations en tableau lisible
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
        $data = json_decode($request->getContent(), true);
        // Vérification stricte des champs obligatoires pour PUT (REST)
        $requiredFields = ['firstName', 'lastName', 'email', 'birthDate', 'gender'];
        $missing = array_diff($requiredFields, array_keys($data ?? []));
        if (count($missing) > 0) {
            return $this->json([
                'error' => 'Champs obligatoires manquants pour un PUT complet',
                'missing' => array_values($missing)
            ], 400);
        }
        try {
            $this->serializer->deserialize($request->getContent(), Patient::class, 'json', ['object_to_populate' => $patient]);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($patient);
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
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Données invalides'], 400);
        }
        // Liste blanche des champs autorisés pour PATCH
        $allowedFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'medicalHistory'];
        $unknownFields = array_diff(array_keys($data), $allowedFields);
        if (count($unknownFields) > 0) {
            return $this->json([
                'error' => 'Champs inconnus dans la requête',
                'fields' => array_values($unknownFields)
            ], 400);
        }
        try {
            foreach ($data as $field => $value) {
                if (property_exists($patient, $field)) {
                    $setter = 'set' . ucfirst($field);
                    if (method_exists($patient, $setter)) {
                        // Conversion spécifique pour birthDate
                        if ($field === 'birthDate' && is_string($value)) {
                            $value = \DateTimeImmutable::createFromFormat('Y-m-d', $value) ?: new \DateTimeImmutable($value);
                        }
                        $patient->$setter($value);
                    }
                }
            }
        } catch (\Throwable $e) {
            // Gestion spécifique pour les erreurs métier du setter (ex: genre invalide)
            if ($e instanceof \InvalidArgumentException) {
                return $this->json([
                    'error' => 'Données invalides',
                    'violations' => [
                        'gender' => [$e->getMessage()]
                    ]
                ], 400);
            }
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées (ex: date invalide, type incorrect).',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($patient);
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
