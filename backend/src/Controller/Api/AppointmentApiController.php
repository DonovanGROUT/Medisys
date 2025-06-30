<?php

namespace App\Controller\Api;

use App\Dto\AppointmentDTO;
use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Repository\PatientRepository;
use App\Mapper\AppointmentMapper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Annotations as OA;

/**
 * Contrôleur API REST pour la gestion des rendez-vous (CRUD).
 *
 * @package App\Controller
 */
#[Route('/api/appointments', name: 'api_appointments_')]
class AppointmentApiController extends AbstractController
{
    // TODO Sécurité d'accès : ajouter vérification des droits (authentification, rôles, voters) sur chaque endpoint dès que l'authentification sera en place.
    // Exemple : @IsGranted('ROLE_USER') ou voter personnalisé selon le type d'utilisateur (ex : un rendez-vous ne peut être modifié que par le praticien du patient ou par l'admin).

    private AppointmentRepository $appointmentRepository;
    private PatientRepository $patientRepository;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    private AppointmentMapper $appointmentMapper;

    public function __construct(AppointmentRepository $appointmentRepository, PatientRepository $patientRepository, SerializerInterface $serializer, ValidatorInterface $validator, AppointmentMapper $appointmentMapper)
    {
        $this->appointmentRepository = $appointmentRepository;
        $this->patientRepository = $patientRepository;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->appointmentMapper = $appointmentMapper;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    /**
     * Crée un nouveau rendez-vous.
     * POST /api/appointments
     *
     * @OA\Post(
     *     path="/api/appointments",
     *     summary="Créer un rendez-vous",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/AppointmentDTO")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Rendez-vous créé"
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
            $appointmentDTO = $this->serializer->deserialize($data, AppointmentDTO::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées.',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($appointmentDTO);
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
        $patient = $this->patientRepository->find($appointmentDTO->patientId);
        if (!$patient) {
            return $this->json([
                'error' => 'Patient non trouvé',
                'violations' => ['patientId' => ["Aucun patient avec l'ID fourni"]]
            ], 400);
        }
        try {
            $appointment = $this->appointmentMapper->dtoToEntity($appointmentDTO, $patient);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Données invalides',
                'violations' => [
                    'exception' => [$e->getMessage()]
                ]
            ], 400);
        }
        $errors = $this->validator->validate($appointment);
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
        $this->appointmentRepository->add($appointment, true);
        $json = $this->serializer->serialize($appointment, 'json');
        return new JsonResponse($json, 201, [], true);
    }

    #[Route('', name: 'list', methods: ['GET'])]
    /**
     * Liste tous les rendez-vous.
     * GET /api/appointments
     *
     * @OA\Get(
     *     path="/api/appointments",
     *     summary="Liste des rendez-vous",
     *     @OA\Response(
     *         response=200,
     *         description="Liste des rendez-vous"
     *     )
     * )
     */
    public function list(): JsonResponse
    {
        $appointments = $this->appointmentRepository->findAll();
        // On filtre les rendez-vous dont le patient n'existe plus (évite EntityNotFoundException)
        $filtered = array_filter($appointments, function ($appointment) {
            try {
                // On tente d'accéder à l'id du patient, ce qui force Doctrine à initialiser le proxy
                return $appointment->getPatient() !== null && $appointment->getPatient()->getId() !== null;
            } catch (\Throwable $e) {
                // Patient supprimé ou proxy non initialisable
                return false;
            }
        });
        $data = $this->serializer->serialize(array_values($filtered), 'json');
        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    /**
     * Détail d'un rendez-vous par son identifiant.
     * GET /api/appointments/{id}
     *
     * @OA\Get(
     *     path="/api/appointments/{id}",
     *     summary="Détail d'un rendez-vous",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du rendez-vous",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détail du rendez-vous"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rendez-vous non trouvé"
     *     )
     * )
     */
    public function show(?Appointment $appointment): JsonResponse
    {
        if (!$appointment) {
            return $this->json(['error' => 'Rendez-vous non trouvé'], 404);
        }
        $data = $this->serializer->serialize($appointment, 'json');
        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    /**
     * Met à jour un rendez-vous existant.
     * PUT/PATCH /api/appointments/{id}
     *
     * @OA\Put(
     *     path="/api/appointments/{id}",
     *     summary="Met à jour un rendez-vous",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du rendez-vous",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/AppointmentDTO")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Rendez-vous mis à jour"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Données invalides"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rendez-vous non trouvé"
     *     )
     * )
     * @OA\Patch(
     *     path="/api/appointments/{id}",
     *     summary="Met à jour partiellement un rendez-vous",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du rendez-vous",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/AppointmentDTO")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Rendez-vous mis à jour"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Données invalides"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rendez-vous non trouvé"
     *     )
     * )
     */
    public function update(Request $request, ?Appointment $appointment): JsonResponse
    {
        if (!$appointment) {
            return $this->json(['error' => 'Rendez-vous non trouvé'], 404);
        }
        $data = $request->getContent();
        try {
            $appointmentDTO = $this->serializer->deserialize($data, AppointmentDTO::class, 'json');
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur de format dans les données envoyées.',
                'details' => $e->getMessage(),
            ], 400);
        }
        $errors = $this->validator->validate($appointmentDTO);
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
        $patient = $this->patientRepository->find($appointmentDTO->patientId);
        if (!$patient) {
            return $this->json([
                'error' => 'Patient non trouvé',
                'violations' => ['patientId' => ["Aucun patient avec l'ID fourni"]]
            ], 400);
        }
        try {
            $this->appointmentMapper->dtoToEntity($appointmentDTO, $patient, $appointment);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Données invalides',
                'violations' => [
                    'exception' => [$e->getMessage()]
                ]
            ], 400);
        }
        $errors = $this->validator->validate($appointment);
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
        $this->appointmentRepository->add($appointment, true);
        $json = $this->serializer->serialize($appointment, 'json');
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    /**
     * Supprime un rendez-vous existant.
     * DELETE /api/appointments/{id}
     *
     * @OA\Delete(
     *     path="/api/appointments/{id}",
     *     summary="Supprime un rendez-vous",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du rendez-vous",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Rendez-vous supprimé"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rendez-vous non trouvé"
     *     )
     * )
     */
    public function delete(?Appointment $appointment): JsonResponse
    {
        if (!$appointment) {
            return $this->json(['error' => 'Rendez-vous non trouvé'], 404);
        }
        $this->appointmentRepository->remove($appointment, true);
        return new JsonResponse(null, 204);
    }
}
