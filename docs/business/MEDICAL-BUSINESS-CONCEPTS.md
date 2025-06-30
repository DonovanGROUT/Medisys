# Concepts métier - Santé numérique

## 📚 À propos

Ce document compile les concepts rencontrés lors du développement d'applications médicales. Bien que certains ne soient pas exclusivement spécifiques au secteur de la santé, ils revêtent une importance particulière et des exigences renforcées dans le domaine médical en raison des enjeux de sécurité, confidentialité et conformité réglementaire.

## 🏥 Domaine médical

**Dossier Patient Informatisé (DPI)** : Version numérique complète du dossier médical traditionnel, incluant historique, traitements, examens.

**Interopérabilité** : Capacité des systèmes de santé à communiquer et échanger des données de manière cohérente et sécurisée. Inclut aujourd’hui l’utilisation d’APIs REST et de standards ouverts (HL7, FHIR) notamment.

**Télémédecine** : Pratique médicale à distance utilisant les technologies de communication (vidéo, messaging, IoT médical).

**Consentement numérique** : Recueil du consentement du patient de façon électronique (case à cocher, signature numérique, traçabilité du consentement en base). Indispensable pour les traitements en ligne, la télémédecine, et la gestion des droits d’accès.

**Accessibilité numérique** : Obligation légale et éthique de rendre les applications utilisables par tous, y compris les personnes en situation de handicap. Respect des référentiels (RGAA, WCAG), contrastes, navigation clavier, alternatives textuelles, etc. Particulièrement critique dans le secteur médical pour garantir l’accès aux soins et à l’information.

**Rendez-vous médical (Appointment)** : Acte planifié entre un patient et un professionnel de santé, consigné dans le dossier médical. Le rendez-vous médical implique des enjeux forts de confidentialité, de traçabilité (horodatage, auteur, statut), et de gestion des droits d’accès. Il est indissociable du patient, et sa gestion doit garantir l’intégrité des données, la conformité réglementaire (RGPD), et la sécurité des échanges (notamment en cas de télémédecine ou de partage interprofessionnel).

## 📋 Standards et Normes

**HL7** : Health Level 7, famille de standards internationaux pour l'échange de données de santé entre systèmes informatiques.

**FHIR** : Fast Healthcare Interoperability Resources, standard moderne basé sur les APIs REST pour l'échange de données médicales.

**DICOM** : Digital Imaging and Communications in Medicine, standard pour la gestion d'images médicales.

## 🔒 Sécurité et Conformité

**RGPD santé** : Application du Règlement Général sur la Protection des Données aux données de santé, avec exigences renforcées.

**Hébergement HDS** : Certification française obligatoire pour héberger des données de santé à caractère personnel.

**Pseudonymisation** : Technique de protection des données personnelles en remplaçant les identifiants directs.

**Chiffrement bout en bout** : Protection des données pendant leur transmission et stockage.

## 🛡️ Sécurité Avancée - Secteur Médical

**Authentification forte** : Mécanismes renforcés (2FA, cartes à puce) obligatoires pour accéder aux systèmes critiques.

**Gestion des habilitations** : Contrôle d'accès granulaire basé sur les rôles médicaux et le principe du moindre privilège.

**Cloisonnement des données** : Séparation physique et logique des données selon leur niveau de sensibilité.

**Sauvegarde chiffrée** : Procédures de backup sécurisées avec tests de restauration réguliers.

**Plan de Reprise d'Activité (PRA)** : Continuité de service critique pour les établissements de soins.

## 📜 Conformité RGPD Renforcée

**RGPD** : Règlement sur la protection des données. Exige sécurisation et contrôle d'accès aux données personnelles.

**Consentement explicite** : Recueil du consentement libre, éclairé et spécifique pour chaque traitement de données.

**Droit à la portabilité** : Capacité technique à exporter les données patient dans un format interopérable.

**Droit à l'oubli** : Suppression sécurisée des données avec preuve de destruction complète.

**Analyse d'Impact (AIPD)** : Étude obligatoire avant tout nouveau traitement de données sensibles.

**Registre des traitements** : Documentation exhaustive de tous les traitements de données personnelles.

**Délégué à la Protection des Données (DPO)** : Responsable de la conformité RGPD dans l'établissement.

## 🔍 Audit et Traçabilité

**Audit Trail** : Traçabilité des modifications avec timestamps automatiques (createdAt, updatedAt) pour conformité médicale.

**Logs d'accès nominatifs** : Enregistrement horodaté de chaque consultation de dossier patient.

**Traçabilité des modifications** : Historique complet des changements avec identification de l'auteur.

**Monitoring de sécurité** : Surveillance en temps réel des tentatives d'intrusion ou d'accès anormaux.

**Rapports de conformité** : Tableaux de bord automatisés pour démontrer le respect des exigences légales.

## ⚖️ Cadre Légal Spécifique

**Code de la Santé Publique** : Réglementation française sur la protection des données de santé.

**Doctrine technique CNIL** : Recommandations spécifiques pour le secteur de la santé.

**Certification ISO 27001** : Standard international de management de la sécurité de l'information.

**Agrément hébergeur de données de santé** : Certification obligatoire pour stocker des données médicales.

---

>Document enrichi au fur et à mesure de la découverte du domaine
