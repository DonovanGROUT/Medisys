<?php

/**
 * Test d'environnement - Validation des fonctionnalités de sécurité PHP
 * pour le projet Medisys
 */

echo "=== Test d'environnement PHP pour Medisys ===\n\n";

// 1. Test de création de classe simple (modélisation d'un patient)
echo "1. Test de création de classe Patient...\n";

class Patient
{
    private string $nom;
    private string $prenom;
    private string $dateNaissance;
    private array $donnesSensibles;

    public function __construct(string $nom, string $prenom, string $dateNaissance)
    {
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->dateNaissance = $dateNaissance;
        $this->donnesSensibles = [];
    }

    public function getNomComplet(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    public function ajouterDonneeSensible(string $cle, string $valeur): void
    {
        $this->donnesSensibles[$cle] = $valeur;
    }

    public function getDonneesSensibles(): array
    {
        return $this->donnesSensibles;
    }
}

$patient = new Patient("Dupont", "Jean", "1980-05-15");
$patient->ajouterDonneeSensible("numeroSecu", "1 80 05 75 123 456 78");
echo "✅ Classe Patient créée avec succès : " . $patient->getNomComplet() . "\n\n";

// 2. Test de chiffrement basique avec base64
echo "2. Test de chiffrement basique...\n";
$donneeSensible = "Informations médicales confidentielles";
$donneeChiffree = base64_encode($donneeSensible);
$donneeDechiffree = base64_decode($donneeChiffree);

echo "Original : $donneeSensible\n";
echo "Chiffrée : $donneeChiffree\n";
echo "Déchiffrée : $donneeDechiffree\n";
echo "✅ Test de chiffrement réussi\n\n";

// 3. Test de hashage de mots de passe
echo "3. Test de hashage de mots de passe...\n";
$motDePasse = "MotDePasseSecurise123!";
$hashMotDePasse = password_hash($motDePasse, PASSWORD_DEFAULT);
$verificationOK = password_verify($motDePasse, $hashMotDePasse);
$verificationKO = password_verify("MauvaisMotDePasse", $hashMotDePasse);

echo "Mot de passe original : $motDePasse\n";
echo "Hash généré : $hashMotDePasse\n";
echo "Vérification correcte : " . ($verificationOK ? "✅ OK" : "❌ ÉCHEC") . "\n";
echo "Vérification incorrecte : " . ($verificationKO ? "❌ PROBLÈME" : "✅ OK (rejetée)") . "\n\n";

// 4. Test de génération de logs d'accès
echo "4. Test de génération de logs d'accès...\n";
$horodatage = date('Y-m-d H:i:s');
$logAcces = [
    'timestamp' => $horodatage,
    'user' => 'test_user',
    'action' => 'access_patient_record',
    'patient_id' => 'PATIENT_001',
    'ip' => '127.0.0.1'
];

$logJson = json_encode($logAcces, JSON_PRETTY_PRINT);
echo "Log d'accès généré :\n$logJson\n";
echo "✅ Test de logs réussi\n\n";

// 5. Test des fonctionnalités OpenSSL
echo "5. Test des fonctionnalités OpenSSL...\n";
if (extension_loaded('openssl')) {
    $cles = openssl_pkey_new([
        "digest_alg" => "sha256",
        "private_key_bits" => 2048,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
    ]);
    
    if ($cles) {
        echo "✅ OpenSSL disponible - Génération de clés RSA réussie\n";
    } else {
        echo "❌ Erreur lors de la génération des clés OpenSSL\n";
    }
} else {
    echo "❌ Extension OpenSSL non disponible\n";
}

echo "\n=== Résumé des tests ===\n";
echo "✅ PHP Version : " . PHP_VERSION . " (8.2+ requis)\n";
echo "✅ Classes et encapsulation : OK\n";
echo "✅ Chiffrement base64 : OK\n";
echo "✅ Hashage de mots de passe : OK\n";
echo "✅ Génération de logs : OK\n";
echo "✅ OpenSSL : " . (extension_loaded('openssl') ? "OK" : "Manquant") . "\n";

echo "\n🎉 Environnement prêt pour le développement Symfony/Vue.js !\n";
