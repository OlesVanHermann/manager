#!/bin/bash
# ============================================================
# SCRIPT DE MISE À JOUR - Clés i18n manquantes
# Exécuter depuis /home/ubuntu/aiapp/frontend/
# ============================================================

set -e
echo "🚀 Ajout des clés i18n manquantes..."

if [ ! -f "package.json" ]; then
  echo "❌ Erreur: Exécutez ce script depuis /home/ubuntu/aiapp/frontend/"
  exit 1
fi

# ============================================================
# general/account/advanced
# ============================================================
echo "📁 general/account/advanced..."

tee public/locales/fr/general/account/advanced.json > /dev/null <<'FILEEND'
{
  "title": "Paramètres avancés",
  "description": "Configuration avancée de votre compte",
  "loading": "Chargement...",
  "errors": {
    "loadError": "Erreur lors du chargement des préférences",
    "saveFailed": "Erreur lors de la sauvegarde"
  },
  "success": {
    "preferencesSaved": "Préférences enregistrées",
    "devModeEnabled": "Mode développeur activé",
    "devModeDisabled": "Mode développeur désactivé",
    "savedLocally": "Enregistré localement"
  },
  "beta": {
    "title": "Fonctionnalités Beta",
    "enableLabel": "Activer les fonctionnalités beta"
  },
  "developer": {
    "title": "Mode développeur",
    "modeLabel": "Activer le mode développeur",
    "saving": "Enregistrement...",
    "joinUs": "Rejoignez-nous",
    "features": {
      "openSource": "Accès aux projets open source",
      "components": "Composants de développement",
      "apiConsole": "Console API"
    }
  },
  "deleteAccount": "Supprimer le compte",
  "deleteWarning": "Cette action est irréversible",
  "confirmDelete": "Confirmer la suppression",
  "exportData": "Exporter mes données",
  "exportDescription": "Télécharger une copie de vos données personnelles",
  "apiAccess": "Accès API",
  "apiDescription": "Gérer vos clés d'API"
}
FILEEND

tee public/locales/en/general/account/advanced.json > /dev/null <<'FILEEND'
{
  "title": "Advanced settings",
  "description": "Advanced account configuration",
  "loading": "Loading...",
  "errors": {
    "loadError": "Error loading preferences",
    "saveFailed": "Error saving"
  },
  "success": {
    "preferencesSaved": "Preferences saved",
    "devModeEnabled": "Developer mode enabled",
    "devModeDisabled": "Developer mode disabled",
    "savedLocally": "Saved locally"
  },
  "beta": {
    "title": "Beta Features",
    "enableLabel": "Enable beta features"
  },
  "developer": {
    "title": "Developer Mode",
    "modeLabel": "Enable developer mode",
    "saving": "Saving...",
    "joinUs": "Join us",
    "features": {
      "openSource": "Access to open source projects",
      "components": "Development components",
      "apiConsole": "API Console"
    }
  },
  "deleteAccount": "Delete account",
  "deleteWarning": "This action is irreversible",
  "confirmDelete": "Confirm deletion",
  "exportData": "Export my data",
  "exportDescription": "Download a copy of your personal data",
  "apiAccess": "API access",
  "apiDescription": "Manage your API keys"
}
FILEEND

# ============================================================
# general/account/contacts-requests
# ============================================================
echo "📁 general/account/contacts-requests..."

tee public/locales/fr/general/account/contacts-requests.json > /dev/null <<'FILEEND'
{
  "title": "Demandes de changement",
  "description": "Gérez les demandes de changement de contact",
  "loading": "Chargement...",
  "errors": {
    "authRequired": "Authentification requise",
    "loadError": "Erreur lors du chargement",
    "acceptError": "Erreur lors de l'acceptation",
    "refuseError": "Erreur lors du refus"
  },
  "status": {
    "todo": "À traiter",
    "doing": "En cours",
    "done": "Terminé",
    "refused": "Refusé",
    "validating": "Validation en cours"
  },
  "contactTypes": {
    "admin": "Administrateur",
    "tech": "Technique",
    "billing": "Facturation"
  },
  "filters": {
    "pending": "En attente",
    "all": "Toutes"
  },
  "empty": {
    "pending": "Aucune demande en attente",
    "all": "Aucune demande"
  },
  "columns": {
    "service": "Service",
    "contactType": "Type de contact",
    "from": "De",
    "to": "Vers",
    "date": "Date",
    "status": "Statut",
    "actions": "Actions"
  },
  "actions": {
    "accept": "Accepter",
    "refuse": "Refuser"
  },
  "modal": {
    "acceptTitle": "Accepter la demande",
    "refuseTitle": "Refuser la demande",
    "description": "Confirmez cette action",
    "tokenLabel": "Code de validation",
    "tokenPlaceholder": "Entrez le code reçu par email",
    "tokenHint": "Un code vous a été envoyé par email"
  }
}
FILEEND

tee public/locales/en/general/account/contacts-requests.json > /dev/null <<'FILEEND'
{
  "title": "Change requests",
  "description": "Manage contact change requests",
  "loading": "Loading...",
  "errors": {
    "authRequired": "Authentication required",
    "loadError": "Error loading",
    "acceptError": "Error accepting",
    "refuseError": "Error refusing"
  },
  "status": {
    "todo": "To process",
    "doing": "In progress",
    "done": "Done",
    "refused": "Refused",
    "validating": "Validating"
  },
  "contactTypes": {
    "admin": "Administrator",
    "tech": "Technical",
    "billing": "Billing"
  },
  "filters": {
    "pending": "Pending",
    "all": "All"
  },
  "empty": {
    "pending": "No pending requests",
    "all": "No requests"
  },
  "columns": {
    "service": "Service",
    "contactType": "Contact type",
    "from": "From",
    "to": "To",
    "date": "Date",
    "status": "Status",
    "actions": "Actions"
  },
  "actions": {
    "accept": "Accept",
    "refuse": "Refuse"
  },
  "modal": {
    "acceptTitle": "Accept request",
    "refuseTitle": "Refuse request",
    "description": "Confirm this action",
    "tokenLabel": "Validation code",
    "tokenPlaceholder": "Enter the code received by email",
    "tokenHint": "A code was sent to your email"
  }
}
FILEEND

# ============================================================
# general/account/contacts-services
# ============================================================
echo "📁 general/account/contacts-services..."

tee public/locales/fr/general/account/contacts-services.json > /dev/null <<'FILEEND'
{
  "title": "Contacts par service",
  "description": "Gérez les contacts associés à vos services",
  "loading": "Chargement...",
  "errors": {
    "loadError": "Erreur lors du chargement",
    "changeError": "Erreur lors du changement de contact"
  },
  "empty": "Aucun service trouvé",
  "count": "{{count}} service(s)",
  "columns": {
    "service": "Service",
    "type": "Type",
    "admin": "Administrateur",
    "tech": "Technique",
    "billing": "Facturation",
    "actions": "Actions"
  },
  "actions": {
    "changeContact": "Modifier le contact"
  },
  "contactTypes": {
    "admin": "Administrateur",
    "tech": "Technique",
    "billing": "Facturation"
  },
  "modal": {
    "title": "Modifier le contact",
    "description": "Changer le contact pour ce service",
    "success": "Demande de changement envoyée",
    "contactTypeLabel": "Type de contact",
    "currentContact": "Contact actuel",
    "newNicLabel": "Nouvel identifiant",
    "newNicPlaceholder": "ex: ab12345-ovh",
    "newNicHint": "L'identifiant OVHcloud du nouveau contact",
    "submitButton": "Envoyer la demande"
  },
  "search": "Rechercher un service",
  "filter": "Filtrer",
  "allTypes": "Tous les types"
}
FILEEND

tee public/locales/en/general/account/contacts-services.json > /dev/null <<'FILEEND'
{
  "title": "Contacts by service",
  "description": "Manage contacts associated with your services",
  "loading": "Loading...",
  "errors": {
    "loadError": "Error loading",
    "changeError": "Error changing contact"
  },
  "empty": "No services found",
  "count": "{{count}} service(s)",
  "columns": {
    "service": "Service",
    "type": "Type",
    "admin": "Administrator",
    "tech": "Technical",
    "billing": "Billing",
    "actions": "Actions"
  },
  "actions": {
    "changeContact": "Change contact"
  },
  "contactTypes": {
    "admin": "Administrator",
    "tech": "Technical",
    "billing": "Billing"
  },
  "modal": {
    "title": "Change contact",
    "description": "Change the contact for this service",
    "success": "Change request sent",
    "contactTypeLabel": "Contact type",
    "currentContact": "Current contact",
    "newNicLabel": "New identifier",
    "newNicPlaceholder": "e.g., ab12345-ovh",
    "newNicHint": "The OVHcloud identifier of the new contact",
    "submitButton": "Send request"
  },
  "search": "Search for a service",
  "filter": "Filter",
  "allTypes": "All types"
}
FILEEND

# ============================================================
# general/account/general
# ============================================================
echo "📁 general/account/general..."

tee public/locales/fr/general/account/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Gérez les informations de votre compte",
  "loading": "Chargement...",
  "errors": {
    "updateFailed": "Erreur lors de la mise à jour"
  },
  "sections": {
    "identity": "Identité",
    "address": "Adresse",
    "preferences": "Préférences"
  },
  "fields": {
    "firstname": "Prénom",
    "name": "Nom",
    "email": "Adresse email",
    "phone": "Téléphone",
    "address": "Adresse",
    "zip": "Code postal",
    "city": "Ville",
    "country": "Pays",
    "language": "Langue",
    "nichandle": "Identifiant client"
  },
  "hints": {
    "emailDisabled": "L'email ne peut pas être modifié ici",
    "countryDisabled": "Le pays ne peut pas être modifié",
    "languageDisabled": "La langue ne peut pas être modifiée ici",
    "nichandleDisabled": "L'identifiant ne peut pas être modifié"
  },
  "buttons": {
    "reset": "Réinitialiser",
    "saving": "Enregistrement...",
    "save": "Enregistrer"
  },
  "nichandle": "Identifiant client",
  "edit": "Modifier",
  "save": "Enregistrer",
  "cancel": "Annuler",
  "success": "Modifications enregistrées",
  "error": "Erreur lors de la sauvegarde"
}
FILEEND

tee public/locales/en/general/account/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Manage your account information",
  "loading": "Loading...",
  "errors": {
    "updateFailed": "Error updating"
  },
  "sections": {
    "identity": "Identity",
    "address": "Address",
    "preferences": "Preferences"
  },
  "fields": {
    "firstname": "First name",
    "name": "Last name",
    "email": "Email address",
    "phone": "Phone",
    "address": "Address",
    "zip": "Zip code",
    "city": "City",
    "country": "Country",
    "language": "Language",
    "nichandle": "Customer ID"
  },
  "hints": {
    "emailDisabled": "Email cannot be modified here",
    "countryDisabled": "Country cannot be modified",
    "languageDisabled": "Language cannot be modified here",
    "nichandleDisabled": "Customer ID cannot be modified"
  },
  "buttons": {
    "reset": "Reset",
    "saving": "Saving...",
    "save": "Save"
  },
  "nichandle": "Customer ID",
  "edit": "Edit",
  "save": "Save",
  "cancel": "Cancel",
  "success": "Changes saved",
  "error": "Error saving changes"
}
FILEEND

# ============================================================
# general/account/kyc
# ============================================================
echo "📁 general/account/kyc..."

tee public/locales/fr/general/account/kyc.json > /dev/null <<'FILEEND'
{
  "title": "Vérification d'identité",
  "description": "Vérifiez votre identité pour sécuriser votre compte",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "status": "Statut",
  "verified": "Vérifié",
  "pending": {
    "title": "En attente",
    "processingTime": "Le traitement peut prendre jusqu'à 48h"
  },
  "notVerified": "Non vérifié",
  "none": {
    "futureNotice": "La vérification d'identité pourra être requise ultérieurement"
  },
  "upload": {
    "startButton": "Commencer la vérification",
    "selectTitle": "Sélectionnez un document",
    "dropZone": "Glissez-déposez votre fichier ici ou cliquez pour sélectionner",
    "formats": "Formats acceptés : PDF, JPG, PNG (max 10 Mo)",
    "submitButton": "Envoyer le document",
    "uploading": "Envoi en cours...",
    "successTitle": "Document envoyé",
    "successMessage": "Votre document a été envoyé avec succès",
    "errors": {
      "noLink": "Lien d'upload non disponible",
      "generic": "Erreur lors de l'envoi du document"
    }
  },
  "info": {
    "title": "Pourquoi vérifier mon identité ?",
    "description": "La vérification d'identité permet de sécuriser votre compte et de prévenir la fraude.",
    "privacyLink": "En savoir plus sur la confidentialité"
  },
  "documentType": "Type de document",
  "idCard": "Carte d'identité",
  "passport": "Passeport",
  "driverLicense": "Permis de conduire",
  "proofOfAddress": "Justificatif de domicile",
  "supportedFormats": "Formats acceptés : PDF, JPG, PNG",
  "maxSize": "Taille maximale : 10 Mo",
  "submit": "Soumettre"
}
FILEEND

tee public/locales/en/general/account/kyc.json > /dev/null <<'FILEEND'
{
  "title": "Identity verification",
  "description": "Verify your identity to secure your account",
  "loading": "Loading...",
  "error": "Error loading",
  "status": "Status",
  "verified": "Verified",
  "pending": {
    "title": "Pending",
    "processingTime": "Processing may take up to 48 hours"
  },
  "notVerified": "Not verified",
  "none": {
    "futureNotice": "Identity verification may be required later"
  },
  "upload": {
    "startButton": "Start verification",
    "selectTitle": "Select a document",
    "dropZone": "Drag and drop your file here or click to select",
    "formats": "Accepted formats: PDF, JPG, PNG (max 10 MB)",
    "submitButton": "Submit document",
    "uploading": "Uploading...",
    "successTitle": "Document sent",
    "successMessage": "Your document has been sent successfully",
    "errors": {
      "noLink": "Upload link not available",
      "generic": "Error uploading document"
    }
  },
  "info": {
    "title": "Why verify my identity?",
    "description": "Identity verification helps secure your account and prevent fraud.",
    "privacyLink": "Learn more about privacy"
  },
  "documentType": "Document type",
  "idCard": "ID card",
  "passport": "Passport",
  "driverLicense": "Driver's license",
  "proofOfAddress": "Proof of address",
  "supportedFormats": "Supported formats: PDF, JPG, PNG",
  "maxSize": "Maximum size: 10 MB",
  "submit": "Submit"
}
FILEEND

# ============================================================
# general/account/privacy
# ============================================================
echo "📁 general/account/privacy..."

tee public/locales/fr/general/account/privacy.json > /dev/null <<'FILEEND'
{
  "title": "Vie privée",
  "description": "Gérez vos préférences de confidentialité",
  "loading": "Chargement...",
  "errors": {
    "loadError": "Erreur lors du chargement",
    "invalidCode": "Code invalide"
  },
  "status": {
    "completed": "Terminé",
    "inProgress": "En cours",
    "cancelled": "Annulé",
    "blocked": "Bloqué",
    "pending": "En attente"
  },
  "rights": {
    "title": "Vos droits",
    "access": {
      "title": "Droit d'accès",
      "description": "Accédez à vos données personnelles"
    },
    "rectification": {
      "title": "Droit de rectification",
      "description": "Corrigez vos données personnelles"
    },
    "erasure": {
      "title": "Droit à l'effacement",
      "description": "Demandez la suppression de vos données"
    },
    "portability": {
      "title": "Droit à la portabilité",
      "description": "Exportez vos données dans un format standard"
    }
  },
  "requests": {
    "title": "Mes demandes",
    "pending": "Demande en cours",
    "resendEmail": "Renvoyer l'email",
    "history": "Historique des demandes"
  },
  "erasure": {
    "warning": "La suppression de vos données est irréversible",
    "requestButton": "Demander la suppression",
    "unavailable": "La suppression n'est pas disponible pour le moment"
  },
  "learnMore": {
    "title": "En savoir plus",
    "privacyPolicy": "Politique de confidentialité"
  },
  "modal": {
    "confirmRequest": {
      "title": "Confirmer la demande",
      "description": "Un email de confirmation va vous être envoyé"
    },
    "enterCode": {
      "title": "Entrez le code de validation",
      "description": "Entrez le code reçu par email",
      "placeholder": "Code à 6 chiffres"
    },
    "emailSent": "Email envoyé"
  },
  "dataUsage": "Utilisation des données",
  "marketing": "Communications marketing",
  "marketingDescription": "Recevoir des offres et actualités OVHcloud",
  "analytics": "Analytiques",
  "analyticsDescription": "Nous aider à améliorer nos services",
  "thirdParty": "Partenaires tiers",
  "thirdPartyDescription": "Partage de données avec nos partenaires",
  "enabled": "Activé",
  "disabled": "Désactivé",
  "save": "Enregistrer"
}
FILEEND

tee public/locales/en/general/account/privacy.json > /dev/null <<'FILEEND'
{
  "title": "Privacy",
  "description": "Manage your privacy preferences",
  "loading": "Loading...",
  "errors": {
    "loadError": "Error loading",
    "invalidCode": "Invalid code"
  },
  "status": {
    "completed": "Completed",
    "inProgress": "In progress",
    "cancelled": "Cancelled",
    "blocked": "Blocked",
    "pending": "Pending"
  },
  "rights": {
    "title": "Your rights",
    "access": {
      "title": "Right of access",
      "description": "Access your personal data"
    },
    "rectification": {
      "title": "Right to rectification",
      "description": "Correct your personal data"
    },
    "erasure": {
      "title": "Right to erasure",
      "description": "Request deletion of your data"
    },
    "portability": {
      "title": "Right to portability",
      "description": "Export your data in a standard format"
    }
  },
  "requests": {
    "title": "My requests",
    "pending": "Request in progress",
    "resendEmail": "Resend email",
    "history": "Request history"
  },
  "erasure": {
    "warning": "Data deletion is irreversible",
    "requestButton": "Request deletion",
    "unavailable": "Deletion is not available at this time"
  },
  "learnMore": {
    "title": "Learn more",
    "privacyPolicy": "Privacy policy"
  },
  "modal": {
    "confirmRequest": {
      "title": "Confirm request",
      "description": "A confirmation email will be sent to you"
    },
    "enterCode": {
      "title": "Enter validation code",
      "description": "Enter the code received by email",
      "placeholder": "6-digit code"
    },
    "emailSent": "Email sent"
  },
  "dataUsage": "Data usage",
  "marketing": "Marketing communications",
  "marketingDescription": "Receive OVHcloud offers and news",
  "analytics": "Analytics",
  "analyticsDescription": "Help us improve our services",
  "thirdParty": "Third-party partners",
  "thirdPartyDescription": "Data sharing with our partners",
  "enabled": "Enabled",
  "disabled": "Disabled",
  "save": "Save"
}
FILEEND

# ============================================================
# general/account/security
# ============================================================
echo "📁 general/account/security..."

tee public/locales/fr/general/account/security.json > /dev/null <<'FILEEND'
{
  "title": "Sécurité",
  "description": "Protégez l'accès à votre compte",
  "loading": "Chargement...",
  "error": "Erreur",
  "common": {
    "yes": "Oui",
    "no": "Non"
  },
  "actions": {
    "resend": "Renvoyer",
    "validate": "Valider"
  },
  "password": {
    "title": "Mot de passe",
    "description": "Modifiez votre mot de passe régulièrement",
    "changeButton": "Changer le mot de passe",
    "lastChanged": "Dernière modification"
  },
  "twoFactor": {
    "title": "Double authentification",
    "description": "Renforcez la sécurité de votre compte",
    "enabled": "Activée",
    "disableButton": "Désactiver la 2FA",
    "sms": {
      "title": "SMS",
      "description": "Recevez un code par SMS",
      "addButton": "Configurer SMS"
    },
    "totp": {
      "title": "Application TOTP",
      "description": "Utilisez une application d'authentification",
      "configureButton": "Configurer TOTP"
    },
    "u2f": {
      "title": "Clé de sécurité U2F",
      "description": "Utilisez une clé physique",
      "addButton": "Ajouter une clé U2F"
    },
    "backup": {
      "title": "Codes de secours",
      "description": "Codes de récupération en cas de perte",
      "remaining": "{{count}} codes restants",
      "regenerateButton": "Régénérer les codes"
    }
  },
  "ipRestrictions": {
    "title": "Restrictions IP",
    "description": "Limitez l'accès à certaines adresses IP",
    "defaultRule": "Règle par défaut",
    "allow": "Autoriser",
    "deny": "Refuser",
    "alertsEnabled": "Alertes activées",
    "addButton": "Ajouter une restriction",
    "columns": {
      "ip": "Adresse IP",
      "alert": "Alerte",
      "rule": "Règle"
    }
  },
  "modals": {
    "password": {
      "title": "Changer le mot de passe",
      "description": "Un email vous sera envoyé pour réinitialiser votre mot de passe",
      "sendButton": "Envoyer l'email"
    },
    "sms": {
      "title": "Configuration SMS",
      "phoneDescription": "Entrez votre numéro de téléphone",
      "phoneLabel": "Numéro de téléphone",
      "sendCode": "Envoyer le code",
      "codeDescription": "Entrez le code reçu par SMS",
      "codeLabel": "Code de vérification"
    },
    "deleteSms": {
      "title": "Supprimer SMS",
      "description": "Voulez-vous vraiment supprimer l'authentification SMS ?"
    },
    "totp": {
      "title": "Configuration TOTP",
      "generateDescription": "Générez un secret TOTP",
      "generateButton": "Générer",
      "scanDescription": "Scannez ce QR code avec votre application",
      "manualEntry": "Ou entrez ce code manuellement",
      "codeLabel": "Code de vérification"
    },
    "deleteTotp": {
      "title": "Supprimer TOTP",
      "description": "Voulez-vous vraiment supprimer l'authentification TOTP ?"
    },
    "u2f": {
      "title": "Ajouter une clé U2F",
      "description": "Insérez votre clé de sécurité et appuyez sur le bouton",
      "addButton": "Ajouter la clé"
    },
    "deleteU2f": {
      "title": "Supprimer la clé U2F",
      "description": "Voulez-vous vraiment supprimer cette clé de sécurité ?"
    },
    "backup": {
      "title": "Codes de secours",
      "generateDescription": "Générez de nouveaux codes de secours",
      "generateButton": "Générer",
      "saveWarning": "Sauvegardez ces codes dans un endroit sûr",
      "validateLabel": "J'ai sauvegardé mes codes"
    },
    "disable2fa": {
      "title": "Désactiver la 2FA",
      "warning": "Attention : votre compte sera moins sécurisé",
      "codeLabel": "Code de vérification",
      "codePlaceholder": "Entrez un code 2FA",
      "disableButton": "Désactiver"
    },
    "ip": {
      "title": "Ajouter une restriction IP",
      "ipLabel": "Adresse IP ou plage CIDR",
      "ruleLabel": "Règle",
      "warningLabel": "Activer les alertes"
    }
  },
  "enable2FA": "Activer",
  "disable2FA": "Désactiver",
  "backupCodes": "Codes de secours",
  "generateCodes": "Générer de nouveaux codes",
  "activeSessions": "Sessions actives",
  "currentSession": "Session actuelle",
  "revokeSession": "Révoquer",
  "revokeAll": "Révoquer toutes les sessions",
  "sshKeys": "Clés SSH",
  "addSshKey": "Ajouter une clé SSH"
}
FILEEND

tee public/locales/en/general/account/security.json > /dev/null <<'FILEEND'
{
  "title": "Security",
  "description": "Protect access to your account",
  "loading": "Loading...",
  "error": "Error",
  "common": {
    "yes": "Yes",
    "no": "No"
  },
  "actions": {
    "resend": "Resend",
    "validate": "Validate"
  },
  "password": {
    "title": "Password",
    "description": "Change your password regularly",
    "changeButton": "Change password",
    "lastChanged": "Last changed"
  },
  "twoFactor": {
    "title": "Two-factor authentication",
    "description": "Strengthen your account security",
    "enabled": "Enabled",
    "disableButton": "Disable 2FA",
    "sms": {
      "title": "SMS",
      "description": "Receive a code by SMS",
      "addButton": "Configure SMS"
    },
    "totp": {
      "title": "TOTP Application",
      "description": "Use an authenticator app",
      "configureButton": "Configure TOTP"
    },
    "u2f": {
      "title": "U2F Security Key",
      "description": "Use a physical key",
      "addButton": "Add U2F key"
    },
    "backup": {
      "title": "Backup codes",
      "description": "Recovery codes in case of loss",
      "remaining": "{{count}} codes remaining",
      "regenerateButton": "Regenerate codes"
    }
  },
  "ipRestrictions": {
    "title": "IP Restrictions",
    "description": "Limit access to certain IP addresses",
    "defaultRule": "Default rule",
    "allow": "Allow",
    "deny": "Deny",
    "alertsEnabled": "Alerts enabled",
    "addButton": "Add restriction",
    "columns": {
      "ip": "IP Address",
      "alert": "Alert",
      "rule": "Rule"
    }
  },
  "modals": {
    "password": {
      "title": "Change password",
      "description": "An email will be sent to reset your password",
      "sendButton": "Send email"
    },
    "sms": {
      "title": "SMS Configuration",
      "phoneDescription": "Enter your phone number",
      "phoneLabel": "Phone number",
      "sendCode": "Send code",
      "codeDescription": "Enter the code received by SMS",
      "codeLabel": "Verification code"
    },
    "deleteSms": {
      "title": "Delete SMS",
      "description": "Do you really want to delete SMS authentication?"
    },
    "totp": {
      "title": "TOTP Configuration",
      "generateDescription": "Generate a TOTP secret",
      "generateButton": "Generate",
      "scanDescription": "Scan this QR code with your app",
      "manualEntry": "Or enter this code manually",
      "codeLabel": "Verification code"
    },
    "deleteTotp": {
      "title": "Delete TOTP",
      "description": "Do you really want to delete TOTP authentication?"
    },
    "u2f": {
      "title": "Add U2F key",
      "description": "Insert your security key and press the button",
      "addButton": "Add key"
    },
    "deleteU2f": {
      "title": "Delete U2F key",
      "description": "Do you really want to delete this security key?"
    },
    "backup": {
      "title": "Backup codes",
      "generateDescription": "Generate new backup codes",
      "generateButton": "Generate",
      "saveWarning": "Save these codes in a safe place",
      "validateLabel": "I have saved my codes"
    },
    "disable2fa": {
      "title": "Disable 2FA",
      "warning": "Warning: your account will be less secure",
      "codeLabel": "Verification code",
      "codePlaceholder": "Enter a 2FA code",
      "disableButton": "Disable"
    },
    "ip": {
      "title": "Add IP restriction",
      "ipLabel": "IP address or CIDR range",
      "ruleLabel": "Rule",
      "warningLabel": "Enable alerts"
    }
  },
  "enable2FA": "Enable",
  "disable2FA": "Disable",
  "backupCodes": "Backup codes",
  "generateCodes": "Generate new codes",
  "activeSessions": "Active sessions",
  "currentSession": "Current session",
  "revokeSession": "Revoke",
  "revokeAll": "Revoke all sessions",
  "sshKeys": "SSH keys",
  "addSshKey": "Add SSH key"
}
FILEEND

# ============================================================
# general/general/general
# ============================================================
echo "📁 general/general/general..."

tee public/locales/fr/general/general/general.json > /dev/null <<'FILEEND'
{
  "title": "Tableau de bord",
  "loading": "Chargement...",
  "error": "Une erreur est survenue",
  "retry": "Réessayer",
  "errors": {
    "servicesLoad": "Erreur lors du chargement des services",
    "billingLoad": "Erreur lors du chargement de la facturation"
  },
  "welcome": {
    "greeting": "Bonjour {{name}}",
    "subtitle": "Bienvenue sur votre espace client",
    "securedAccount": "Compte sécurisé"
  },
  "debt": {
    "message": "Vous avez un solde impayé de {{amount}}",
    "payButton": "Régulariser"
  },
  "services": {
    "title": "Mes services",
    "titleWithCount": "Mes services ({{count}})",
    "serviceCount": "{{count}} service(s)",
    "empty": "Vous n'avez pas encore de service",
    "orderButton": "Commander"
  },
  "quickActions": {
    "title": "Accès rapides",
    "invoices": "Mes factures",
    "account": "Mon compte",
    "support": "Support",
    "order": "Commander"
  },
  "lastBill": {
    "title": "Dernière facture",
    "downloadPdf": "Télécharger PDF",
    "viewAll": "Voir toutes les factures",
    "empty": "Aucune facture"
  },
  "lastOrder": {
    "title": "Dernière commande"
  },
  "notifications": {
    "title": "Notifications"
  },
  "openTickets": {
    "title": "Tickets ouverts",
    "viewAll": "Voir tous les tickets"
  }
}
FILEEND

tee public/locales/en/general/general/general.json > /dev/null <<'FILEEND'
{
  "title": "Dashboard",
  "loading": "Loading...",
  "error": "An error occurred",
  "retry": "Retry",
  "errors": {
    "servicesLoad": "Error loading services",
    "billingLoad": "Error loading billing"
  },
  "welcome": {
    "greeting": "Hello {{name}}",
    "subtitle": "Welcome to your customer area",
    "securedAccount": "Secured account"
  },
  "debt": {
    "message": "You have an unpaid balance of {{amount}}",
    "payButton": "Pay now"
  },
  "services": {
    "title": "My services",
    "titleWithCount": "My services ({{count}})",
    "serviceCount": "{{count}} service(s)",
    "empty": "You don't have any services yet",
    "orderButton": "Order"
  },
  "quickActions": {
    "title": "Quick access",
    "invoices": "My invoices",
    "account": "My account",
    "support": "Support",
    "order": "Order"
  },
  "lastBill": {
    "title": "Last invoice",
    "downloadPdf": "Download PDF",
    "viewAll": "View all invoices",
    "empty": "No invoices"
  },
  "lastOrder": {
    "title": "Last order"
  },
  "notifications": {
    "title": "Notifications"
  },
  "openTickets": {
    "title": "Open tickets",
    "viewAll": "View all tickets"
  }
}
FILEEND

# ============================================================
# iam/general/groups
# ============================================================
echo "📁 iam/general/groups..."

tee public/locales/fr/iam/general/groups.json > /dev/null <<'FILEEND'
{
  "title": "Groupes",
  "description": "Gérez les groupes d'utilisateurs",
  "loading": "Chargement...",
  "errors": {
    "notAuthenticated": "Authentification requise",
    "loadError": "Erreur lors du chargement"
  },
  "count": "{{count}} groupe(s)",
  "createButton": "Créer un groupe",
  "empty": {
    "title": "Aucun groupe",
    "description": "Créez votre premier groupe pour organiser vos utilisateurs"
  },
  "columns": {
    "name": "Nom",
    "owner": "Propriétaire",
    "resources": "Ressources",
    "createdAt": "Date de création",
    "actions": "Actions"
  },
  "common": {
    "readOnly": "Lecture seule"
  },
  "field": {
    "name": "Nom",
    "description": "Description",
    "members": "Membres",
    "createdAt": "Date de création",
    "role": "Rôle"
  },
  "action": {
    "add": "Créer un groupe",
    "edit": "Modifier",
    "delete": "Supprimer",
    "addMember": "Ajouter un membre",
    "removeMember": "Retirer"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer ce groupe ?"
  }
}
FILEEND

tee public/locales/en/iam/general/groups.json > /dev/null <<'FILEEND'
{
  "title": "Groups",
  "description": "Manage user groups",
  "loading": "Loading...",
  "errors": {
    "notAuthenticated": "Authentication required",
    "loadError": "Error loading"
  },
  "count": "{{count}} group(s)",
  "createButton": "Create group",
  "empty": {
    "title": "No groups",
    "description": "Create your first group to organize your users"
  },
  "columns": {
    "name": "Name",
    "owner": "Owner",
    "resources": "Resources",
    "createdAt": "Creation date",
    "actions": "Actions"
  },
  "common": {
    "readOnly": "Read only"
  },
  "field": {
    "name": "Name",
    "description": "Description",
    "members": "Members",
    "createdAt": "Creation date",
    "role": "Role"
  },
  "action": {
    "add": "Create group",
    "edit": "Edit",
    "delete": "Delete",
    "addMember": "Add member",
    "removeMember": "Remove"
  },
  "confirm": {
    "delete": "Do you really want to delete this group?"
  }
}
FILEEND

# ============================================================
# iam/general/identities
# ============================================================
echo "📁 iam/general/identities..."

tee public/locales/fr/iam/general/identities.json > /dev/null <<'FILEEND'
{
  "title": "Identités",
  "description": "Gérez les utilisateurs et comptes de service",
  "loading": "Chargement...",
  "errors": {
    "notAuthenticated": "Authentification requise",
    "loadError": "Erreur lors du chargement"
  },
  "count": "{{count}} identité(s)",
  "addButton": "Ajouter une identité",
  "empty": {
    "title": "Aucune identité",
    "description": "Ajoutez votre première identité pour commencer"
  },
  "columns": {
    "login": "Identifiant",
    "email": "Email",
    "group": "Groupe",
    "status": "Statut",
    "actions": "Actions"
  },
  "status": {
    "active": "Actif",
    "inactive": "Inactif",
    "disabled": "Désactivé",
    "pending": "En attente",
    "passwordChange": "Changement de mot de passe requis"
  },
  "tabs": {
    "users": "Utilisateurs",
    "serviceAccounts": "Comptes de service"
  },
  "field": {
    "login": "Identifiant",
    "email": "Email",
    "status": "Statut",
    "group": "Groupe",
    "lastLogin": "Dernière connexion",
    "createdAt": "Date de création",
    "description": "Description"
  },
  "action": {
    "add": "Ajouter",
    "addUser": "Ajouter un utilisateur",
    "addServiceAccount": "Ajouter un compte de service",
    "edit": "Modifier",
    "delete": "Supprimer",
    "enable": "Activer",
    "disable": "Désactiver",
    "resetPassword": "Réinitialiser le mot de passe"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer cette identité ?"
  }
}
FILEEND

tee public/locales/en/iam/general/identities.json > /dev/null <<'FILEEND'
{
  "title": "Identities",
  "description": "Manage users and service accounts",
  "loading": "Loading...",
  "errors": {
    "notAuthenticated": "Authentication required",
    "loadError": "Error loading"
  },
  "count": "{{count}} identity(ies)",
  "addButton": "Add identity",
  "empty": {
    "title": "No identities",
    "description": "Add your first identity to get started"
  },
  "columns": {
    "login": "Login",
    "email": "Email",
    "group": "Group",
    "status": "Status",
    "actions": "Actions"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "disabled": "Disabled",
    "pending": "Pending",
    "passwordChange": "Password change required"
  },
  "tabs": {
    "users": "Users",
    "serviceAccounts": "Service accounts"
  },
  "field": {
    "login": "Login",
    "email": "Email",
    "status": "Status",
    "group": "Group",
    "lastLogin": "Last login",
    "createdAt": "Creation date",
    "description": "Description"
  },
  "action": {
    "add": "Add",
    "addUser": "Add user",
    "addServiceAccount": "Add service account",
    "edit": "Edit",
    "delete": "Delete",
    "enable": "Enable",
    "disable": "Disable",
    "resetPassword": "Reset password"
  },
  "confirm": {
    "delete": "Do you really want to delete this identity?"
  }
}
FILEEND

# ============================================================
# iam/general/policies
# ============================================================
echo "📁 iam/general/policies..."

tee public/locales/fr/iam/general/policies.json > /dev/null <<'FILEEND'
{
  "title": "Politiques",
  "description": "Gérez les politiques d'accès IAM",
  "loading": "Chargement...",
  "errors": {
    "notAuthenticated": "Authentification requise",
    "loadError": "Erreur lors du chargement"
  },
  "count": "{{count}} politique(s)",
  "createButton": "Créer une politique",
  "empty": {
    "title": "Aucune politique",
    "description": "Créez votre première politique d'accès"
  },
  "columns": {
    "name": "Nom",
    "description": "Description",
    "identities": "Identités",
    "resources": "Ressources",
    "createdAt": "Date de création",
    "actions": "Actions"
  },
  "common": {
    "readOnly": "Lecture seule"
  },
  "field": {
    "name": "Nom",
    "description": "Description",
    "permissions": "Permissions",
    "resources": "Ressources",
    "identities": "Identités",
    "createdAt": "Date de création",
    "updatedAt": "Dernière modification"
  },
  "permission": {
    "allow": "Autoriser",
    "deny": "Refuser"
  },
  "action": {
    "add": "Créer une politique",
    "edit": "Modifier",
    "delete": "Supprimer",
    "duplicate": "Dupliquer",
    "viewJson": "Voir JSON"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer cette politique ?"
  }
}
FILEEND

tee public/locales/en/iam/general/policies.json > /dev/null <<'FILEEND'
{
  "title": "Policies",
  "description": "Manage IAM access policies",
  "loading": "Loading...",
  "errors": {
    "notAuthenticated": "Authentication required",
    "loadError": "Error loading"
  },
  "count": "{{count}} policy(ies)",
  "createButton": "Create policy",
  "empty": {
    "title": "No policies",
    "description": "Create your first access policy"
  },
  "columns": {
    "name": "Name",
    "description": "Description",
    "identities": "Identities",
    "resources": "Resources",
    "createdAt": "Creation date",
    "actions": "Actions"
  },
  "common": {
    "readOnly": "Read only"
  },
  "field": {
    "name": "Name",
    "description": "Description",
    "permissions": "Permissions",
    "resources": "Resources",
    "identities": "Identities",
    "createdAt": "Creation date",
    "updatedAt": "Last modified"
  },
  "permission": {
    "allow": "Allow",
    "deny": "Deny"
  },
  "action": {
    "add": "Create policy",
    "edit": "Edit",
    "delete": "Delete",
    "duplicate": "Duplicate",
    "viewJson": "View JSON"
  },
  "confirm": {
    "delete": "Do you really want to delete this policy?"
  }
}
FILEEND

# ============================================================
# iam/okms/credentials
# ============================================================
echo "📁 iam/okms/credentials..."

tee public/locales/fr/iam/okms/credentials.json > /dev/null <<'FILEEND'
{
  "title": "Identifiants",
  "description": "Gérez les identifiants d'accès au KMS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "create": "Créer un identifiant",
  "confirmRevoke": "Voulez-vous vraiment révoquer cet identifiant ?",
  "empty": {
    "title": "Aucun identifiant",
    "description": "Créez votre premier identifiant pour accéder au KMS"
  },
  "fields": {
    "id": "ID",
    "created": "Date de création",
    "expires": "Date d'expiration"
  },
  "expiringSoon": "Expire bientôt",
  "downloadCert": "Télécharger le certificat",
  "revoke": "Révoquer",
  "field": {
    "id": "ID",
    "name": "Nom",
    "description": "Description",
    "status": "Statut",
    "createdAt": "Date de création",
    "expiresAt": "Date d'expiration",
    "certificate": "Certificat"
  },
  "status": {
    "active": "Actif",
    "expired": "Expiré",
    "revoked": "Révoqué"
  },
  "action": {
    "add": "Créer un identifiant",
    "edit": "Modifier",
    "delete": "Supprimer",
    "download": "Télécharger",
    "revoke": "Révoquer",
    "renew": "Renouveler"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer cet identifiant ?",
    "revoke": "Voulez-vous vraiment révoquer cet identifiant ?"
  },
  "success": {
    "created": "Identifiant créé avec succès",
    "revoked": "Identifiant révoqué"
  }
}
FILEEND

tee public/locales/en/iam/okms/credentials.json > /dev/null <<'FILEEND'
{
  "title": "Credentials",
  "description": "Manage KMS access credentials",
  "loading": "Loading...",
  "error": "Error loading",
  "create": "Create credential",
  "confirmRevoke": "Do you really want to revoke this credential?",
  "empty": {
    "title": "No credentials",
    "description": "Create your first credential to access the KMS"
  },
  "fields": {
    "id": "ID",
    "created": "Creation date",
    "expires": "Expiration date"
  },
  "expiringSoon": "Expiring soon",
  "downloadCert": "Download certificate",
  "revoke": "Revoke",
  "field": {
    "id": "ID",
    "name": "Name",
    "description": "Description",
    "status": "Status",
    "createdAt": "Creation date",
    "expiresAt": "Expiration date",
    "certificate": "Certificate"
  },
  "status": {
    "active": "Active",
    "expired": "Expired",
    "revoked": "Revoked"
  },
  "action": {
    "add": "Create credential",
    "edit": "Edit",
    "delete": "Delete",
    "download": "Download",
    "revoke": "Revoke",
    "renew": "Renew"
  },
  "confirm": {
    "delete": "Do you really want to delete this credential?",
    "revoke": "Do you really want to revoke this credential?"
  },
  "success": {
    "created": "Credential created successfully",
    "revoked": "Credential revoked"
  }
}
FILEEND

# ============================================================
# iam/okms/keys
# ============================================================
echo "📁 iam/okms/keys..."

tee public/locales/fr/iam/okms/keys.json > /dev/null <<'FILEEND'
{
  "title": "Clés",
  "description": "Gérez vos clés de chiffrement KMS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "create": "Créer une clé",
  "confirmDeactivate": "Voulez-vous vraiment désactiver cette clé ?",
  "deactivate": "Désactiver",
  "empty": {
    "title": "Aucune clé",
    "description": "Créez votre première clé de chiffrement"
  },
  "columns": {
    "name": "Nom",
    "type": "Type",
    "algorithm": "Algorithme",
    "state": "État",
    "created": "Date de création",
    "actions": "Actions"
  },
  "field": {
    "id": "ID",
    "name": "Nom",
    "type": "Type",
    "state": "État",
    "algorithm": "Algorithme",
    "size": "Taille",
    "createdAt": "Date de création",
    "expiresAt": "Date d'expiration",
    "operations": "Opérations autorisées"
  },
  "type": {
    "symmetric": "Symétrique",
    "asymmetric": "Asymétrique",
    "rsa": "RSA",
    "ec": "Courbe elliptique"
  },
  "state": {
    "active": "Active",
    "inactive": "Inactive",
    "compromised": "Compromise",
    "deactivated": "Désactivée",
    "destroyed": "Détruite"
  },
  "operation": {
    "encrypt": "Chiffrer",
    "decrypt": "Déchiffrer",
    "sign": "Signer",
    "verify": "Vérifier",
    "wrap": "Encapsuler",
    "unwrap": "Désencapsuler"
  },
  "action": {
    "add": "Créer une clé",
    "edit": "Modifier",
    "delete": "Supprimer",
    "activate": "Activer",
    "deactivate": "Désactiver",
    "rotate": "Rotation"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer cette clé ? Cette action est irréversible.",
    "deactivate": "Voulez-vous vraiment désactiver cette clé ?"
  }
}
FILEEND

tee public/locales/en/iam/okms/keys.json > /dev/null <<'FILEEND'
{
  "title": "Keys",
  "description": "Manage your KMS encryption keys",
  "loading": "Loading...",
  "error": "Error loading",
  "create": "Create key",
  "confirmDeactivate": "Do you really want to deactivate this key?",
  "deactivate": "Deactivate",
  "empty": {
    "title": "No keys",
    "description": "Create your first encryption key"
  },
  "columns": {
    "name": "Name",
    "type": "Type",
    "algorithm": "Algorithm",
    "state": "State",
    "created": "Creation date",
    "actions": "Actions"
  },
  "field": {
    "id": "ID",
    "name": "Name",
    "type": "Type",
    "state": "State",
    "algorithm": "Algorithm",
    "size": "Size",
    "createdAt": "Creation date",
    "expiresAt": "Expiration date",
    "operations": "Allowed operations"
  },
  "type": {
    "symmetric": "Symmetric",
    "asymmetric": "Asymmetric",
    "rsa": "RSA",
    "ec": "Elliptic curve"
  },
  "state": {
    "active": "Active",
    "inactive": "Inactive",
    "compromised": "Compromised",
    "deactivated": "Deactivated",
    "destroyed": "Destroyed"
  },
  "operation": {
    "encrypt": "Encrypt",
    "decrypt": "Decrypt",
    "sign": "Sign",
    "verify": "Verify",
    "wrap": "Wrap",
    "unwrap": "Unwrap"
  },
  "action": {
    "add": "Create key",
    "edit": "Edit",
    "delete": "Delete",
    "activate": "Activate",
    "deactivate": "Deactivate",
    "rotate": "Rotate"
  },
  "confirm": {
    "delete": "Do you really want to delete this key? This action is irreversible.",
    "deactivate": "Do you really want to deactivate this key?"
  }
}
FILEEND

# ============================================================
# iam/secret/access
# ============================================================
echo "📁 iam/secret/access..."

tee public/locales/fr/iam/secret/access.json > /dev/null <<'FILEEND'
{
  "title": "Accès",
  "description": "Gérez les accès au gestionnaire de secrets",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "grant": "Accorder un accès",
  "confirmRevoke": "Voulez-vous vraiment révoquer cet accès ?",
  "revoke": "Révoquer",
  "empty": {
    "title": "Aucun accès",
    "description": "Accordez un premier accès pour commencer"
  },
  "columns": {
    "identity": "Identité",
    "type": "Type",
    "permission": "Permission",
    "granted": "Date d'attribution",
    "actions": "Actions"
  },
  "field": {
    "identity": "Identité",
    "role": "Rôle",
    "permissions": "Permissions",
    "grantedAt": "Date d'attribution",
    "grantedBy": "Attribué par"
  },
  "role": {
    "admin": "Administrateur",
    "reader": "Lecteur",
    "writer": "Rédacteur",
    "custom": "Personnalisé"
  },
  "permission": {
    "read": "Lecture",
    "write": "Écriture",
    "delete": "Suppression",
    "manage": "Gestion"
  },
  "action": {
    "add": "Ajouter un accès",
    "edit": "Modifier",
    "revoke": "Révoquer"
  },
  "confirm": {
    "revoke": "Voulez-vous vraiment révoquer cet accès ?"
  }
}
FILEEND

tee public/locales/en/iam/secret/access.json > /dev/null <<'FILEEND'
{
  "title": "Access",
  "description": "Manage access to the secret manager",
  "loading": "Loading...",
  "error": "Error loading",
  "grant": "Grant access",
  "confirmRevoke": "Do you really want to revoke this access?",
  "revoke": "Revoke",
  "empty": {
    "title": "No access",
    "description": "Grant a first access to get started"
  },
  "columns": {
    "identity": "Identity",
    "type": "Type",
    "permission": "Permission",
    "granted": "Granted at",
    "actions": "Actions"
  },
  "field": {
    "identity": "Identity",
    "role": "Role",
    "permissions": "Permissions",
    "grantedAt": "Granted at",
    "grantedBy": "Granted by"
  },
  "role": {
    "admin": "Administrator",
    "reader": "Reader",
    "writer": "Writer",
    "custom": "Custom"
  },
  "permission": {
    "read": "Read",
    "write": "Write",
    "delete": "Delete",
    "manage": "Manage"
  },
  "action": {
    "add": "Add access",
    "edit": "Edit",
    "revoke": "Revoke"
  },
  "confirm": {
    "revoke": "Do you really want to revoke this access?"
  }
}
FILEEND

# ============================================================
# iam/secret/secrets
# ============================================================
echo "📁 iam/secret/secrets..."

tee public/locales/fr/iam/secret/secrets.json > /dev/null <<'FILEEND'
{
  "title": "Secrets",
  "description": "Gérez vos secrets",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "create": "Créer un secret",
  "confirmDelete": "Voulez-vous vraiment supprimer ce secret ?",
  "empty": {
    "title": "Aucun secret",
    "description": "Créez votre premier secret"
  },
  "columns": {
    "name": "Nom",
    "description": "Description",
    "versions": "Versions",
    "updated": "Dernière modification",
    "actions": "Actions"
  },
  "field": {
    "name": "Nom",
    "description": "Description",
    "type": "Type",
    "version": "Version",
    "createdAt": "Date de création",
    "updatedAt": "Dernière modification",
    "expiresAt": "Expiration"
  },
  "type": {
    "opaque": "Opaque",
    "password": "Mot de passe",
    "apiKey": "Clé API",
    "certificate": "Certificat",
    "sshKey": "Clé SSH"
  },
  "action": {
    "add": "Créer un secret",
    "edit": "Modifier",
    "delete": "Supprimer",
    "view": "Afficher",
    "copy": "Copier",
    "rotate": "Rotation"
  },
  "confirm": {
    "delete": "Voulez-vous vraiment supprimer ce secret ?",
    "view": "Afficher le contenu du secret ?"
  },
  "success": {
    "copied": "Secret copié dans le presse-papiers",
    "created": "Secret créé avec succès",
    "deleted": "Secret supprimé"
  }
}
FILEEND

tee public/locales/en/iam/secret/secrets.json > /dev/null <<'FILEEND'
{
  "title": "Secrets",
  "description": "Manage your secrets",
  "loading": "Loading...",
  "error": "Error loading",
  "create": "Create secret",
  "confirmDelete": "Do you really want to delete this secret?",
  "empty": {
    "title": "No secrets",
    "description": "Create your first secret"
  },
  "columns": {
    "name": "Name",
    "description": "Description",
    "versions": "Versions",
    "updated": "Last modified",
    "actions": "Actions"
  },
  "field": {
    "name": "Name",
    "description": "Description",
    "type": "Type",
    "version": "Version",
    "createdAt": "Creation date",
    "updatedAt": "Last modified",
    "expiresAt": "Expiration"
  },
  "type": {
    "opaque": "Opaque",
    "password": "Password",
    "apiKey": "API key",
    "certificate": "Certificate",
    "sshKey": "SSH key"
  },
  "action": {
    "add": "Create secret",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "copy": "Copy",
    "rotate": "Rotate"
  },
  "confirm": {
    "delete": "Do you really want to delete this secret?",
    "view": "Display secret content?"
  },
  "success": {
    "copied": "Secret copied to clipboard",
    "created": "Secret created successfully",
    "deleted": "Secret deleted"
  }
}
FILEEND

# ============================================================
# iam/secret/versions
# ============================================================
echo "📁 iam/secret/versions..."

tee public/locales/fr/iam/secret/versions.json > /dev/null <<'FILEEND'
{
  "title": "Versions",
  "description": "Historique des versions du secret",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": {
    "title": "Aucune version",
    "description": "Ce secret n'a pas encore de version"
  },
  "columns": {
    "secret": "Secret",
    "version": "Version",
    "status": "Statut",
    "created": "Date de création",
    "actions": "Actions"
  },
  "field": {
    "version": "Version",
    "status": "Statut",
    "createdAt": "Date de création",
    "createdBy": "Créé par"
  },
  "status": {
    "current": "Actuelle",
    "previous": "Précédente",
    "deprecated": "Obsolète",
    "destroyed": "Détruite"
  },
  "action": {
    "view": "Afficher",
    "restore": "Restaurer",
    "destroy": "Détruire"
  },
  "confirm": {
    "restore": "Voulez-vous vraiment restaurer cette version ?",
    "destroy": "Voulez-vous vraiment détruire cette version ? Cette action est irréversible."
  }
}
FILEEND

tee public/locales/en/iam/secret/versions.json > /dev/null <<'FILEEND'
{
  "title": "Versions",
  "description": "Secret version history",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": {
    "title": "No versions",
    "description": "This secret has no versions yet"
  },
  "columns": {
    "secret": "Secret",
    "version": "Version",
    "status": "Status",
    "created": "Creation date",
    "actions": "Actions"
  },
  "field": {
    "version": "Version",
    "status": "Status",
    "createdAt": "Creation date",
    "createdBy": "Created by"
  },
  "status": {
    "current": "Current",
    "previous": "Previous",
    "deprecated": "Deprecated",
    "destroyed": "Destroyed"
  },
  "action": {
    "view": "View",
    "restore": "Restore",
    "destroy": "Destroy"
  },
  "confirm": {
    "restore": "Do you really want to restore this version?",
    "destroy": "Do you really want to destroy this version? This action is irreversible."
  }
}
FILEEND

# ============================================================
# license/cloudlinux/general
# ============================================================
echo "📁 license/cloudlinux/general..."

tee public/locales/fr/license/cloudlinux/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence CloudLinux",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "fields": {
    "id": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "created": "Date de création"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Changer l'IP",
    "terminate": "Résilier"
  },
  "section": {
    "info": "Informations",
    "subscription": "Abonnement"
  },
  "field": {
    "licenseId": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "type": "Type",
    "status": "Statut",
    "createdAt": "Date de création",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "status": {
    "active": "Active",
    "expired": "Expirée",
    "suspended": "Suspendue"
  },
  "action": {
    "changeIp": "Changer l'IP",
    "renew": "Renouveler",
    "terminate": "Résilier"
  },
  "confirm": {
    "terminate": "Voulez-vous vraiment résilier cette licence ?"
  }
}
FILEEND

tee public/locales/en/license/cloudlinux/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your CloudLinux license",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "fields": {
    "id": "License ID",
    "ip": "IP address",
    "version": "Version",
    "created": "Creation date"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Change IP",
    "terminate": "Terminate"
  },
  "section": {
    "info": "Information",
    "subscription": "Subscription"
  },
  "field": {
    "licenseId": "License ID",
    "ip": "IP address",
    "version": "Version",
    "type": "Type",
    "status": "Status",
    "createdAt": "Creation date",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "status": {
    "active": "Active",
    "expired": "Expired",
    "suspended": "Suspended"
  },
  "action": {
    "changeIp": "Change IP",
    "renew": "Renew",
    "terminate": "Terminate"
  },
  "confirm": {
    "terminate": "Do you really want to terminate this license?"
  }
}
FILEEND

# ============================================================
# license/cloudlinux/tasks
# ============================================================
echo "📁 license/cloudlinux/tasks..."

tee public/locales/fr/license/cloudlinux/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Statut",
    "startDate": "Date de début",
    "doneDate": "Date de fin"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "startDate": "Date de début",
    "endDate": "Date de fin"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "type": {
    "changeIp": "Changement d'IP",
    "renewal": "Renouvellement"
  },
  "action": {
    "refresh": "Actualiser"
  }
}
FILEEND

tee public/locales/en/license/cloudlinux/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history on your license",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Status",
    "startDate": "Start date",
    "doneDate": "End date"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "startDate": "Start date",
    "endDate": "End date"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "type": {
    "changeIp": "IP change",
    "renewal": "Renewal"
  },
  "action": {
    "refresh": "Refresh"
  }
}
FILEEND

# ============================================================
# license/directadmin/general
# ============================================================
echo "📁 license/directadmin/general..."

tee public/locales/fr/license/directadmin/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence DirectAdmin",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "fields": {
    "id": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "os": "Système d'exploitation",
    "created": "Date de création"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Changer l'IP",
    "terminate": "Résilier"
  },
  "section": {
    "info": "Informations",
    "subscription": "Abonnement",
    "options": "Options"
  },
  "field": {
    "licenseId": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "type": "Type",
    "status": "Statut",
    "os": "Système d'exploitation",
    "createdAt": "Date de création",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "status": {
    "active": "Active",
    "expired": "Expirée",
    "suspended": "Suspendue"
  },
  "action": {
    "changeIp": "Changer l'IP",
    "changeOs": "Changer l'OS",
    "renew": "Renouveler",
    "terminate": "Résilier"
  },
  "confirm": {
    "terminate": "Voulez-vous vraiment résilier cette licence ?"
  }
}
FILEEND

tee public/locales/en/license/directadmin/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your DirectAdmin license",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "fields": {
    "id": "License ID",
    "ip": "IP address",
    "version": "Version",
    "os": "Operating system",
    "created": "Creation date"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Change IP",
    "terminate": "Terminate"
  },
  "section": {
    "info": "Information",
    "subscription": "Subscription",
    "options": "Options"
  },
  "field": {
    "licenseId": "License ID",
    "ip": "IP address",
    "version": "Version",
    "type": "Type",
    "status": "Status",
    "os": "Operating system",
    "createdAt": "Creation date",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "status": {
    "active": "Active",
    "expired": "Expired",
    "suspended": "Suspended"
  },
  "action": {
    "changeIp": "Change IP",
    "changeOs": "Change OS",
    "renew": "Renew",
    "terminate": "Terminate"
  },
  "confirm": {
    "terminate": "Do you really want to terminate this license?"
  }
}
FILEEND

# ============================================================
# license/directadmin/tasks
# ============================================================
echo "📁 license/directadmin/tasks..."

tee public/locales/fr/license/directadmin/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Statut",
    "startDate": "Date de début",
    "doneDate": "Date de fin"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "startDate": "Date de début",
    "endDate": "Date de fin"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "type": {
    "changeIp": "Changement d'IP",
    "changeOs": "Changement d'OS",
    "renewal": "Renouvellement"
  },
  "action": {
    "refresh": "Actualiser"
  }
}
FILEEND

tee public/locales/en/license/directadmin/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history on your license",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Status",
    "startDate": "Start date",
    "doneDate": "End date"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "startDate": "Start date",
    "endDate": "End date"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "type": {
    "changeIp": "IP change",
    "changeOs": "OS change",
    "renewal": "Renewal"
  },
  "action": {
    "refresh": "Refresh"
  }
}
FILEEND

# ============================================================
# license/plesk/general
# ============================================================
echo "📁 license/plesk/general..."

tee public/locales/fr/license/plesk/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence Plesk",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "fields": {
    "id": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "domainNumber": "Nombre de domaines",
    "created": "Date de création"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Changer l'IP",
    "terminate": "Résilier"
  },
  "section": {
    "info": "Informations",
    "subscription": "Abonnement",
    "options": "Options"
  },
  "field": {
    "licenseId": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "type": "Type",
    "status": "Statut",
    "domains": "Domaines",
    "domainsLimit": "Limite de domaines",
    "createdAt": "Date de création",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "status": {
    "active": "Active",
    "expired": "Expirée",
    "suspended": "Suspendue"
  },
  "action": {
    "changeIp": "Changer l'IP",
    "upgrade": "Mettre à niveau",
    "renew": "Renouveler",
    "terminate": "Résilier"
  },
  "confirm": {
    "terminate": "Voulez-vous vraiment résilier cette licence ?"
  }
}
FILEEND

tee public/locales/en/license/plesk/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your Plesk license",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "fields": {
    "id": "License ID",
    "ip": "IP address",
    "version": "Version",
    "domainNumber": "Number of domains",
    "created": "Creation date"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Change IP",
    "terminate": "Terminate"
  },
  "section": {
    "info": "Information",
    "subscription": "Subscription",
    "options": "Options"
  },
  "field": {
    "licenseId": "License ID",
    "ip": "IP address",
    "version": "Version",
    "type": "Type",
    "status": "Status",
    "domains": "Domains",
    "domainsLimit": "Domains limit",
    "createdAt": "Creation date",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "status": {
    "active": "Active",
    "expired": "Expired",
    "suspended": "Suspended"
  },
  "action": {
    "changeIp": "Change IP",
    "upgrade": "Upgrade",
    "renew": "Renew",
    "terminate": "Terminate"
  },
  "confirm": {
    "terminate": "Do you really want to terminate this license?"
  }
}
FILEEND

# ============================================================
# license/plesk/tasks
# ============================================================
echo "📁 license/plesk/tasks..."

tee public/locales/fr/license/plesk/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Statut",
    "startDate": "Date de début",
    "doneDate": "Date de fin"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "startDate": "Date de début",
    "endDate": "Date de fin"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "type": {
    "changeIp": "Changement d'IP",
    "upgrade": "Mise à niveau",
    "renewal": "Renouvellement"
  },
  "action": {
    "refresh": "Actualiser"
  }
}
FILEEND

tee public/locales/en/license/plesk/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history on your license",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Status",
    "startDate": "Start date",
    "doneDate": "End date"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "startDate": "Start date",
    "endDate": "End date"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "type": {
    "changeIp": "IP change",
    "upgrade": "Upgrade",
    "renewal": "Renewal"
  },
  "action": {
    "refresh": "Refresh"
  }
}
FILEEND

# ============================================================
# license/sqlserver/general
# ============================================================
echo "📁 license/sqlserver/general..."

tee public/locales/fr/license/sqlserver/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence SQL Server",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "fields": {
    "id": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "created": "Date de création"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Changer l'IP",
    "terminate": "Résilier"
  },
  "section": {
    "info": "Informations",
    "subscription": "Abonnement"
  },
  "field": {
    "licenseId": "ID de licence",
    "ip": "Adresse IP",
    "version": "Version",
    "edition": "Édition",
    "type": "Type",
    "status": "Statut",
    "cores": "Cœurs",
    "createdAt": "Date de création",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "edition": {
    "standard": "Standard",
    "web": "Web",
    "enterprise": "Enterprise"
  },
  "status": {
    "active": "Active",
    "expired": "Expirée",
    "suspended": "Suspendue"
  },
  "action": {
    "changeIp": "Changer l'IP",
    "upgrade": "Mettre à niveau",
    "renew": "Renouveler",
    "terminate": "Résilier"
  },
  "confirm": {
    "terminate": "Voulez-vous vraiment résilier cette licence ?"
  }
}
FILEEND

tee public/locales/en/license/sqlserver/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your SQL Server license",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "fields": {
    "id": "License ID",
    "ip": "IP address",
    "version": "Version",
    "created": "Creation date"
  },
  "actions": {
    "title": "Actions",
    "changeIp": "Change IP",
    "terminate": "Terminate"
  },
  "section": {
    "info": "Information",
    "subscription": "Subscription"
  },
  "field": {
    "licenseId": "License ID",
    "ip": "IP address",
    "version": "Version",
    "edition": "Edition",
    "type": "Type",
    "status": "Status",
    "cores": "Cores",
    "createdAt": "Creation date",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "edition": {
    "standard": "Standard",
    "web": "Web",
    "enterprise": "Enterprise"
  },
  "status": {
    "active": "Active",
    "expired": "Expired",
    "suspended": "Suspended"
  },
  "action": {
    "changeIp": "Change IP",
    "upgrade": "Upgrade",
    "renew": "Renew",
    "terminate": "Terminate"
  },
  "confirm": {
    "terminate": "Do you really want to terminate this license?"
  }
}
FILEEND

# ============================================================
# license/sqlserver/tasks
# ============================================================
echo "📁 license/sqlserver/tasks..."

tee public/locales/fr/license/sqlserver/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Statut",
    "startDate": "Date de début",
    "doneDate": "Date de fin"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "startDate": "Date de début",
    "endDate": "Date de fin"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "type": {
    "changeIp": "Changement d'IP",
    "upgrade": "Mise à niveau",
    "renewal": "Renouvellement"
  },
  "action": {
    "refresh": "Actualiser"
  }
}
FILEEND

tee public/locales/en/license/sqlserver/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history on your license",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "columns": {
    "id": "ID",
    "action": "Action",
    "status": "Status",
    "startDate": "Start date",
    "doneDate": "End date"
  },
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "startDate": "Start date",
    "endDate": "End date"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "type": {
    "changeIp": "IP change",
    "upgrade": "Upgrade",
    "renewal": "Renewal"
  },
  "action": {
    "refresh": "Refresh"
  }
}
FILEEND

# ============================================================
# FIN
# ============================================================
echo ""
echo "============================================================"
echo "🎉 Clés i18n manquantes ajoutées !"
echo "============================================================"
echo ""
echo "💡 Prochaine étape : npm run build:dev"
