<?php

namespace App\Controller;

use App\Entity\Patient;
use App\Form\PatientType;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Contrôleur Symfony pour la gestion des patients (CRUD).
 *
 * - Affiche la liste des patients
 * - Affiche la fiche d'un patient
 * - Permet la création d'un patient
 *
 * Utilise le FormType PatientType pour la création/édition.
 *
 * @see PatientType
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

    /**
     * Affiche la fiche d'un patient (route /patients/{id}).
     *
     * @param Patient $patient L'entité Patient injectée automatiquement
     * @return Response Vue fiche patient
     */
    #[Route('/patients/{id}', name: 'app_patient_show', requirements: ['id' => '\\d+'], methods: ['GET'])]
    public function show(Patient $patient): Response
    {
        return $this->render('patient/show.html.twig', [
            'patient' => $patient,
        ]);
    }

    /**
     * Crée un nouveau patient (route /patients/new).
     *
     * Affiche et traite le formulaire de création de patient. En cas de succès, redirige vers la liste.
     *
     * @param Request $request
     * @param EntityManagerInterface $em
     * @return Response
     */
    #[Route('/patients/new', name: 'app_patient_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $patient = new Patient();
        $form = $this->createForm(PatientType::class, $patient);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($patient);
            $em->flush();
            $em->clear(); // Force Doctrine à rafraîchir le cache des entités
            $this->addFlash('success', 'Patient created successfully.');
            return $this->redirectToRoute('app_patient_index');
        }

        return $this->render('patient/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
