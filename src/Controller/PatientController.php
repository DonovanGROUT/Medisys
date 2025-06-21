<?php

namespace App\Controller;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Contrôleur pour la gestion des patients (listing).
 *
 * Affiche la liste des patients enregistrés dans le système.
 *
 * @package App\Controller
 */
final class PatientController extends AbstractController
{
    /**
     * Affiche la liste des patients (route /patients).
     *
     * @param PatientRepository $patientRepository Repository Patient
     * @return Response Vue liste des patients
     */
    #[Route('/patients', name: 'app_patient_index', methods: ['GET'])]
    public function index(PatientRepository $patientRepository): Response
    {
        return $this->render('patient/index.html.twig', [
            'patients' => $patientRepository->findAll(),
        ]);
    }
}
