<?php

namespace App\Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Tests d'intégration pour le contrôleur API des rendez-vous (AppointmentApiController)
 *
 * Objectif :
 *   - Vérifier le comportement de l'endpoint POST /api/appointments
 *   - Couvrir les cas métier principaux (succès, patient inexistant, données invalides)
 *
 * Convention :
 *   - Les tests utilisent le client HTTP Symfony (WebTestCase)
 *   - Les payloads sont inspirés des exemples Swagger UI
 *
 * @see \App\Controller\Api\AppointmentApiController
 */
class AppointmentApiControllerTest extends WebTestCase
{
    /**
     * Crée dynamiquement un patient de test via l'API et retourne son ID.
     */
    private function createTestPatient($client): int
    {
        $payload = [
            'firstName' => 'Jean',
            'lastName' => 'Testeur',
            'gender' => 'M',
            'birthDate' => '1990-01-01',
            'phone' => '0102030405',
            'email' => uniqid('test', true) . '@example.com',
        ];
        $client->request('POST', '/api/patients', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        return $data['id'];
    }

    /**
     * Cas nominal : création d'un rendez-vous avec un patient existant et des données valides.
     * Attendu : code 201, retour de l'objet créé avec tous les champs attendus.
     */
    public function testCreateAppointmentSuccess(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2030-01-01T09:00:00+00:00',
            'duration' => 30,
            'reason' => 'Consultation annuelle',
            'status' => 'scheduled',
        ];
        $client->request('POST', '/api/appointments', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertEquals($payload['reason'], $data['reason']);
        $this->assertEquals($payload['status'], $data['status']);
        $this->assertEquals($payload['duration'], $data['duration']);
        $this->assertEquals($payload['dateTime'], $data['dateTime']);
        $this->assertEquals($payload['patientId'], $data['patient']['id']);
    }

    /**
     * Cas d'erreur : création d'un rendez-vous avec un patient inexistant.
     * Attendu : code 400, message d'erreur explicite et violation sur patientId.
     */
    public function testCreateAppointmentPatientNotFound(): void
    {
        $client = static::createClient();
        $payload = [
            'patientId' => 9999,
            'dateTime' => '2030-01-01T09:00:00+00:00',
            'duration' => 30,
            'reason' => 'Consultation annuelle',
            'status' => 'scheduled',
        ];
        $client->request('POST', '/api/appointments', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Patient non trouvé', $data['error']);
        $this->assertArrayHasKey('violations', $data);
        $this->assertArrayHasKey('patientId', $data['violations']);
    }

    /**
     * Cas d'erreur : création d'un rendez-vous avec des données invalides (date passée, statut inconnu).
     * Attendu : code 400, message d'erreur et violations détaillées.
     */
    public function testCreateAppointmentInvalidData(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2020-01-01T09:00:00+00:00', // date passée
            'duration' => 30,
            'reason' => 'Consultation annuelle',
            'status' => 'invalid_status',
        ];
        $client->request('POST', '/api/appointments', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Données invalides', $data['error']);
        $this->assertArrayHasKey('violations', $data);
    }

    /**
     * Cas nominal : récupération de la liste des rendez-vous.
     * Attendu : code 200, tableau JSON.
     */
    public function testGetAppointmentsList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/appointments');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        // Optionnel : vérifier qu'il y a au moins un rendez-vous si fixtures chargées
    }

    /**
     * Cas nominal : récupération du détail d'un rendez-vous existant.
     * Attendu : code 200, objet JSON avec les champs attendus.
     */
    public function testGetAppointmentDetailSuccess(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant via l'API liste
        $client->request('GET', '/api/appointments');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertNotEmpty($data, 'Aucun rendez-vous disponible pour le test.');
        $appointment = $data[0];
        $id = $appointment['id'];
        $client->request('GET', '/api/appointments/' . $id);
        $this->assertResponseStatusCodeSame(200);
        $detail = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $detail);
        $this->assertEquals($id, $detail['id']);
    }

    /**
     * Cas d'erreur : récupération d'un rendez-vous inexistant.
     * Attendu : code 404, message d'erreur explicite.
     */
    public function testGetAppointmentDetailNotFound(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/appointments/99999');
        $this->assertResponseStatusCodeSame(404);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Rendez-vous non trouvé', $data['error']);
    }

    /**
     * Cas nominal : mise à jour d'un rendez-vous existant avec des données valides.
     * Attendu : code 200, retour de l'objet modifié avec les champs mis à jour.
     */
    public function testUpdateAppointmentSuccess(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertNotEmpty($data, 'Aucun rendez-vous disponible pour le test.');
        $appointment = $data[0];
        $id = $appointment['id'];

        $payload = [
            'patientId' => $appointment['patient']['id'],
            'dateTime' => '2031-01-01T10:00:00+00:00',
            'duration' => 45,
            'reason' => 'Mise à jour motif',
            'status' => 'scheduled',
        ];
        $client->request('PUT', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(200);
        $updated = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals($payload['reason'], $updated['reason']);
        $this->assertEquals($payload['status'], $updated['status']);
        $this->assertEquals($payload['duration'], $updated['duration']);
        $this->assertEquals($payload['dateTime'], $updated['dateTime']);
        $this->assertEquals($payload['patientId'], $updated['patient']['id']);
    }

    /**
     * Cas d'erreur : mise à jour d'un rendez-vous inexistant (PUT).
     * Attendu : code 404, message d'erreur explicite.
     */
    public function testUpdateAppointmentNotFound(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2031-01-01T10:00:00+00:00',
            'duration' => 45,
            'reason' => 'Mise à jour motif',
            'status' => 'scheduled',
        ];
        $client->request('PUT', '/api/appointments/99999', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(404);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Rendez-vous non trouvé', $data['error']);
    }

    /**
     * Cas d'erreur : mise à jour d'un rendez-vous avec un patient inexistant (PUT).
     * Attendu : code 400, message d'erreur explicite.
     */
    public function testUpdateAppointmentPatientNotFound(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $data = json_decode($client->getResponse()->getContent(), true);
        $appointment = $data[0];
        $id = $appointment['id'];
        $payload = [
            'patientId' => 99999,
            'dateTime' => '2031-01-01T10:00:00+00:00',
            'duration' => 45,
            'reason' => 'Mise à jour motif',
            'status' => 'scheduled',
        ];
        $client->request('PUT', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Patient non trouvé', $data['error']);
        $this->assertArrayHasKey('violations', $data);
        $this->assertArrayHasKey('patientId', $data['violations']);
    }

    /**
     * Cas d'erreur : mise à jour d'un rendez-vous avec des données invalides (PUT).
     * Attendu : code 400, message d'erreur explicite.
     */
    public function testUpdateAppointmentInvalidData(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $data = json_decode($client->getResponse()->getContent(), true);
        $appointment = $data[0];
        $id = $appointment['id'];
        $payload = [
            'patientId' => $appointment['patient']['id'],
            'dateTime' => '2020-01-01T10:00:00+00:00', // date passée
            'duration' => 45,
            'reason' => '', // raison vide
            'status' => 'scheduled',
        ];
        $client->request('PUT', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Données invalides', $data['error']);
        $this->assertArrayHasKey('violations', $data);
    }

    /**
     * Cas nominal : mise à jour partielle d'un rendez-vous existant (PATCH).
     * Attendu : code 200, retour de l'objet modifié avec les champs mis à jour.
     */
    public function testPatchAppointmentSuccess(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertNotEmpty($data, 'Aucun rendez-vous disponible pour le test.');
        $appointment = $data[0];
        $id = $appointment['id'];

        $payload = [
            'patientId' => $appointment['patient']['id'],
            'dateTime' => '2032-01-01T11:00:00+00:00',
            'duration' => 60,
            'reason' => 'Patch motif',
            'status' => 'scheduled',
        ];
        $client->request('PATCH', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(200);
        $updated = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals($payload['reason'], $updated['reason']);
        $this->assertEquals($payload['status'], $updated['status']);
        $this->assertEquals($payload['duration'], $updated['duration']);
        $this->assertEquals($payload['dateTime'], $updated['dateTime']);
        $this->assertEquals($payload['patientId'], $updated['patient']['id']);
    }

    /**
     * Cas d'erreur : mise à jour partielle d'un rendez-vous inexistant (PATCH).
     * Attendu : code 404, message d'erreur explicite.
     */
    public function testPatchAppointmentNotFound(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2032-01-01T11:00:00+00:00',
            'duration' => 60,
            'reason' => 'Patch motif',
            'status' => 'scheduled',
        ];
        $client->request('PATCH', '/api/appointments/99999', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(404);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Rendez-vous non trouvé', $data['error']);
    }

    /**
     * Cas d'erreur : mise à jour partielle d'un rendez-vous avec un patient inexistant (PATCH).
     * Attendu : code 400, message d'erreur explicite.
     */
    public function testPatchAppointmentPatientNotFound(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $data = json_decode($client->getResponse()->getContent(), true);
        $appointment = $data[0];
        $id = $appointment['id'];
        $payload = [
            'patientId' => 99999,
            'dateTime' => '2032-01-01T11:00:00+00:00',
            'duration' => 60,
            'reason' => 'Patch motif',
            'status' => 'scheduled',
        ];
        $client->request('PATCH', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Patient non trouvé', $data['error']);
        $this->assertArrayHasKey('violations', $data);
        $this->assertArrayHasKey('patientId', $data['violations']);
    }

    /**
     * Cas d'erreur : mise à jour partielle d'un rendez-vous avec des données invalides (PATCH).
     * Attendu : code 400, message d'erreur explicite.
     */
    public function testPatchAppointmentInvalidData(): void
    {
        $client = static::createClient();
        // On récupère dynamiquement un rendez-vous existant
        $client->request('GET', '/api/appointments');
        $data = json_decode($client->getResponse()->getContent(), true);
        $appointment = $data[0];
        $id = $appointment['id'];
        $payload = [
            'patientId' => $appointment['patient']['id'],
            'dateTime' => '2020-01-01T11:00:00+00:00', // date passée
            'duration' => 60,
            'reason' => '', // raison vide
            'status' => 'scheduled',
        ];
        $client->request('PATCH', '/api/appointments/' . $id, [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Données invalides', $data['error']);
        $this->assertArrayHasKey('violations', $data);
    }

    /**
     * Cas nominal : suppression d'un rendez-vous existant (création + suppression).
     * Attendu : code 204, le rendez-vous n'existe plus ensuite.
     */
    public function testDeleteAppointmentSuccess(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        // On crée un rendez-vous pour garantir qu'il existe
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2035-01-01T10:00:00+00:00',
            'duration' => 30,
            'reason' => 'Suppression test',
            'status' => 'scheduled',
        ];
        $client->request('POST', '/api/appointments', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'];

        $client->request('DELETE', '/api/appointments/' . $id);
        $this->assertResponseStatusCodeSame(204);

        // Vérifie que le rendez-vous n'existe plus
        $client->request('GET', '/api/appointments/' . $id);
        $this->assertResponseStatusCodeSame(404);
    }

    /**
     * Cas d'erreur : suppression d'un rendez-vous inexistant.
     * Attendu : code 404, message d'erreur explicite.
     */
    public function testDeleteAppointmentNotFound(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/appointments/99999');
        $this->assertResponseStatusCodeSame(404);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Rendez-vous non trouvé', $data['error']);
    }

    /**
     * Cas d'erreur : PATCH sans ID (route invalide).
     * Attendu : code 405 ou 404.
     */
    public function testPatchAppointmentWithoutId(): void
    {
        $client = static::createClient();
        $patientId = $this->createTestPatient($client);
        $payload = [
            'patientId' => $patientId,
            'dateTime' => '2032-01-01T11:00:00+00:00',
            'duration' => 60,
            'reason' => 'Patch motif',
            'status' => 'scheduled',
        ];
        $client->request('PATCH', '/api/appointments', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode($payload));
        $this->assertTrue(
            in_array($client->getResponse()->getStatusCode(), [400, 404, 405]),
            'La route PATCH sans ID doit retourner 400, 404 ou 405.'
        );
    }
}
