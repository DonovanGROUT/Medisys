<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Contrôleur d'accueil de l'application Medisys.
 *
 * Affiche la page d'accueil principale.
 *
 * @package App\Controller
 */
final class HomeController extends AbstractController
{
    /**
     * Page d'accueil (route /).
     *
     * @return Response Page d'accueil
     */
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }
}
