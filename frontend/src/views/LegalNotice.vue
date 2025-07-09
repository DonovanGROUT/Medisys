<!--
  -----------------------------------------------------------------------------
  Page de mentions légales (fictive, informative, accessible)
  -----------------------------------------------------------------------------
  Présente les informations légales obligatoires du site (éditeur, hébergeur, propriété, données personnelles, contact).
  Cette version est fictive et sert uniquement à la démonstration.

  Accessibilité :
    - Titres hiérarchisés (h1, h2)
    - Contraste couleurs conforme WCAG AA
    - Liens explicites

  Exemple d’utilisation :
    Route /mentions-legales

  -----------------------------------------------------------------------------
-->
<template>
  <div class="max-w-3xl mx-auto py-12 px-4">
    <div class="flex justify-end mb-6">
      <router-link
        to="/"
        class="rounded-[6px] border border-[#263238] text-[#263238] px-4 py-2 font-semibold hover:bg-[#263238] hover:text-white transition-colors duration-200 focus:outline focus:outline-2 focus:outline-[#263238] sm:w-auto w-full"
        aria-label="Retour à l'accueil"
        data-testid="back-home-btn"
      >
        Retour à l'accueil
      </router-link>
    </div>
    <div class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded">
      <strong>Note :</strong> Cette page de mentions légales est fictive et a été rédigée uniquement
      pour les besoins d’une démonstration. Les informations ci-dessous sont inventées.
    </div>
    <h1 class="text-3xl font-bold text-blue-800 mb-6">Mentions légales</h1>
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-2">Éditeur du site</h2>
      <p>
        Medisys - Système de gestion médicale<br />
        123 rue de la Santé, 75000 Paris<br />
        Email : contact@medisys.fr
      </p>
    </section>
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-2">Hébergement</h2>
      <p>Hébergeur fictif - 456 avenue du Cloud, 75000 Paris</p>
    </section>
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-2">Propriété intellectuelle</h2>
      <p>
        Tous les contenus présents sur ce site sont la propriété de Medisys ou de leurs auteurs
        respectifs. Toute reproduction, même partielle, est interdite sans autorisation écrite.
      </p>
    </section>
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-2">Données personnelles</h2>
      <p>
        Les données collectées via ce site sont strictement confidentielles et ne sont utilisées que
        dans le cadre du service proposé. Conformément à la loi Informatique et Libertés, vous
        disposez d’un droit d’accès, de rectification et de suppression de vos données.
      </p>
    </section>
    <section>
      <h2 class="text-xl font-semibold text-blue-800 mb-2">Contact</h2>
      <p>
        Pour toute question, contactez-nous à l’adresse :
        <a href="mailto:contact@medisys.fr" class="text-blue-800 underline">contact@medisys.fr</a>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts"></script>
