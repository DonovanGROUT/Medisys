# Fiche de révision 08 – DTO, Mapper & structuration API Symfony

## 🚦 Qu’est-ce qu’un DTO ?

**DTO (Data Transfer Object)** : objet simple servant à transférer des données entre les couches d’une application (ex : entre l’API et le domaine). Il ne contient aucune logique métier, seulement des propriétés et parfois des annotations de validation.

**Objectifs** :
- Découpler la structure exposée par l’API de l’entité Doctrine (base de données)
- Faciliter la validation (annotations sur le DTO)
- Documenter précisément les entrées/sorties de l’API (OpenAPI)
- Sécuriser les données exposées (ne jamais exposer l’entité brute)

**Exemple** :
```php
class AppointmentDTO {
    public int $patientId;
    public \DateTimeInterface $dateTime;
    public int $duration;
    public string $reason;
    public string $status;
}
```

## 🔄 Le Mapper (mapping DTO ↔ entité)

**Rôle** : convertir un DTO en entité Doctrine (et inversement), centraliser la logique de transformation, éviter la duplication de code dans les contrôleurs.

**Exemple** :
```php
class AppointmentMapper {
    public function dtoToEntity(AppointmentDTO $dto, Appointment $entity = null): Appointment { /* ... */ }
    public function entityToDto(Appointment $entity): AppointmentDTO { /* ... */ }
}
```

## 🏗️ Structuration d’un contrôleur API moderne

- **Injection des dépendances** : repository, mapper, validator, serializer
- **Validation** : validation stricte des DTO (annotations Symfony Validator)
- **Gestion des erreurs** : centralisation des erreurs de validation/mapping, réponses 400 structurées
- **Mapping** : conversion explicite DTO ↔ entité via le Mapper
- **Documentation** : annotations OpenAPI sur les DTO, schéma à jour

**Exemple d’usage dans un contrôleur (extrait simplifié du projet)** :
```php
public function create(Request $request): JsonResponse
{
    $dto = $this->serializer->deserialize($request->getContent(), AppointmentDTO::class, 'json');
    $errors = $this->validator->validate($dto);
    if (count($errors) > 0) {
        // ... gestion des erreurs ...
        return $this->json(['error' => 'Données invalides', 'violations' => $violations], 400);
    }
    $patient = $this->patientRepository->find($dto->patientId);
    if (!$patient) {
        return $this->json(['error' => 'Patient non trouvé'], 400);
    }
    $appointment = $this->appointmentMapper->dtoToEntity($dto, $patient);
    $this->appointmentRepository->add($appointment, true);
    $json = $this->serializer->serialize($appointment, 'json');
    return new JsonResponse($json, 201, [], true);
}
```

## ✅ Bonnes pratiques
- Ne jamais exposer directement les entités Doctrine dans l’API
- Centraliser le mapping dans un service dédié (Mapper)
- Valider systématiquement les DTO avant mapping
- Structurer les erreurs de validation (retour 400 avec détails)
- Documenter les DTO avec OpenAPI

## ⚠️ Pièges à éviter
- Mélanger logique métier et mapping dans le contrôleur
- Oublier de valider les DTO (risque de faille de sécurité)
- Exposer des propriétés sensibles de l’entité

## 📚 Ressources
- [Symfony – Data Transfer Objects](https://symfony.com/doc/current/data_transfer_object.html)
- [Symfony – Validation](https://symfony.com/doc/current/validation.html)
- [Symfony – Serializer](https://symfony.com/doc/current/components/serializer.html)
- [OpenAPI & NelmioApiDocBundle](https://symfony.com/bundles/NelmioApiDocBundle/current/index.html)
