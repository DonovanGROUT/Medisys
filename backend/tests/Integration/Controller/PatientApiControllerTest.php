<?php

namespace App\Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Tests d'intégration pour l'API Patient (CRUD, validation, erreurs)
 */
class PatientApiControllerTest extends WebTestCase
{
    public function testCreatePatientValid(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'Alice',
            'lastName' => 'Martin',
            'email' => 'alice.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1990-05-10',
            'gender' => 'F',
            'medicalHistory' => 'RAS',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $this->assertJson($client->getResponse()->getContent());
    }

    public function testCreatePatientInvalidEmail(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'Bob',
            'lastName' => 'Martin',
            'email' => 'not-an-email',
            'phone' => '+33612345678',
            'birthDate' => '1990-05-10',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('email', $client->getResponse()->getContent());
    }

    public function testCreatePatientInvalidGender(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'Charlie',
            'lastName' => 'Martin',
            'email' => 'charlie.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1990-05-10',
            'gender' => 'Z',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('genre', $client->getResponse()->getContent());
    }

    public function testCreatePatientInvalidBirthDate(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'David',
            'lastName' => 'Martin',
            'email' => 'david.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => 'not-a-date',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('date', $client->getResponse()->getContent());
    }

    public function testCreatePatientMissingRequired(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => '',
            'lastName' => '',
            'email' => '',
            'birthDate' => '',
            'gender' => '',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('obligatoire', $client->getResponse()->getContent());
    }

    public function testCreatePatientDuplicateEmail(): void
    {
        $client = static::createClient();
        $uniqueEmail = 'eve.dupont.' . uniqid() . '@example.com';
        $payload = [
            'firstName' => 'Eve',
            'lastName' => 'Dupont',
            'email' => $uniqueEmail,
            'phone' => '+33612345678',
            'birthDate' => '1992-01-01',
            'gender' => 'F',
        ];
        // Première création (succès)
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        // Deuxième création avec le même email (échec)
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('email', $client->getResponse()->getContent());
    }

    public function testGetPatientNotFound(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/patients/999999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeletePatientNotFound(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/patients/999999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testPatchPatientSingleField(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Patch',
            'lastName' => 'Test',
            'email' => 'patch.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PATCH sur le prénom uniquement
        $patch = ['firstName' => 'Patched'];
        $client->request('PATCH', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseIsSuccessful();
        $this->assertStringContainsString('Patched', $client->getResponse()->getContent());
    }

    public function testGetPatientSuccess(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Read',
            'lastName' => 'Test',
            'email' => 'read.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1993-01-01',
            'gender' => 'F',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // Lecture du patient
        $client->request('GET', "/api/patients/$id");
        $this->assertResponseIsSuccessful();
        $this->assertStringContainsString('Read', $client->getResponse()->getContent());
    }

    public function testDeletePatientSuccess(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Delete',
            'lastName' => 'Test',
            'email' => 'delete.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1994-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // Suppression du patient
        $client->request('DELETE', "/api/patients/$id");
        $this->assertResponseStatusCodeSame(204);
        // Vérifier qu'il n'existe plus
        $client->request('GET', "/api/patients/$id");
        $this->assertResponseStatusCodeSame(404);
    }

    public function testGetPatientsList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/patients');
        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    public function testCreatePatientMaxLength(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => str_repeat('A', 256),
            'lastName' => str_repeat('B', 256),
            'email' => str_repeat('c', 245) . '@ex.com',
            'phone' => str_repeat('1', 30),
            'birthDate' => '1990-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreatePatientTypeInjection(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 123,
            'lastName' => true,
            'email' => 456,
            'phone' => false,
            'birthDate' => [],
            'gender' => null,
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreatePatientFutureBirthDate(): void
    {
        $client = static::createClient();
        $future = (new \DateTimeImmutable('+1 year'))->format('Y-m-d');
        $payload = [
            'firstName' => 'Future',
            'lastName' => 'Test',
            'email' => 'future.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => $future,
            'gender' => 'F',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testPatchPatientUnknownField(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Unknown',
            'lastName' => 'Field',
            'email' => 'unknown.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1995-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PATCH avec un champ inconnu
        $patch = ['fooBar' => 'baz'];
        $client->request('PATCH', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testPutPatientSuccess(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Put',
            'lastName' => 'Test',
            'email' => 'put.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1990-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // Remplacement complet avec PUT
        $put = [
            'firstName' => 'Replaced',
            'lastName' => 'Patient',
            'email' => 'replaced.' . uniqid() . '@example.com',
            'phone' => '+33700000000',
            'birthDate' => '1980-12-31',
            'gender' => 'F',
        ];
        $client->request('PUT', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($put));
        $this->assertResponseStatusCodeSame(200);
        $this->assertStringContainsString('Replaced', $client->getResponse()->getContent());
    }

    public function testPutPatientInvalidEmail(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'Put',
            'lastName' => 'Test',
            'email' => 'put2.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1990-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PUT avec email invalide
        $put = [
            'firstName' => 'Replaced',
            'lastName' => 'Patient',
            'email' => 'not-an-email',
            'phone' => '+33700000000',
            'birthDate' => '1980-12-31',
            'gender' => 'F',
        ];
        $client->request('PUT', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($put));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('email', $client->getResponse()->getContent());
    }

    public function testPutPatientWithMissingFields(): void
    {
        $client = static::createClient();
        // Création d'un patient
        $payload = [
            'firstName' => 'PutMissing',
            'lastName' => 'Test',
            'email' => 'putmissing.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1990-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PUT avec champs manquants (ex: pas de lastName)
        $put = [
            'firstName' => 'Replaced',
            'email' => 'replaced2.' . uniqid() . '@example.com',
            'phone' => '+33700000000',
            'birthDate' => '1980-12-31',
            'gender' => 'F',
        ];
        $client->request('PUT', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($put));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('obligatoire', $client->getResponse()->getContent());
    }

    public function testPatchPatientMultipleFields(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'PatchMulti',
            'lastName' => 'Test',
            'email' => 'patchmulti.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PATCH sur plusieurs champs
        $patch = [
            'firstName' => 'Patched',
            'phone' => '+33777777777',
        ];
        $client->request('PATCH', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseIsSuccessful();
        $this->assertStringContainsString('Patched', $client->getResponse()->getContent());
        $this->assertStringContainsString('+33777777777', $client->getResponse()->getContent());
    }

    public function testPatchPatientTypeInjection(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'PatchType',
            'lastName' => 'Test',
            'email' => 'patchtype.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PATCH avec type incorrect
        $patch = [
            'firstName' => 123,
            'phone' => false,
        ];
        $client->request('PATCH', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testPatchPatientNullField(): void
    {
        $client = static::createClient();
        $payload = [
            'firstName' => 'PatchNull',
            'lastName' => 'Test',
            'email' => 'patchnull.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'M',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload));
        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $id = $data['id'] ?? null;
        $this->assertNotNull($id);
        // PATCH avec champ null
        $patch = [
            'firstName' => null
        ];
        $client->request('PATCH', "/api/patients/$id", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseStatusCodeSame(400);
    }

    public function testPatchPatientDuplicateEmail(): void
    {
        $client = static::createClient();
        // Création de deux patients
        $payload1 = [
            'firstName' => 'PatchDup1',
            'lastName' => 'Test',
            'email' => 'patchdup1.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'M',
        ];
        $payload2 = [
            'firstName' => 'PatchDup2',
            'lastName' => 'Test',
            'email' => 'patchdup2.' . uniqid() . '@example.com',
            'phone' => '+33612345678',
            'birthDate' => '1991-01-01',
            'gender' => 'F',
        ];
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload1));
        $this->assertResponseStatusCodeSame(201);
        $data1 = json_decode($client->getResponse()->getContent(), true);
        $id1 = $data1['id'] ?? null;
        $this->assertNotNull($id1);
        $client->request('POST', '/api/patients', [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($payload2));
        $this->assertResponseStatusCodeSame(201);
        $data2 = json_decode($client->getResponse()->getContent(), true);
        $id2 = $data2['id'] ?? null;
        $this->assertNotNull($id2);
        // PATCH du patient 2 avec l'email du patient 1
        $patch = ['email' => $payload1['email']];
        $client->request('PATCH', "/api/patients/$id2", [
            'CONTENT_TYPE' => 'application/json',
        ], [], [], json_encode($patch));
        $this->assertResponseStatusCodeSame(400);
        $this->assertStringContainsString('email', $client->getResponse()->getContent());
    }
}
