#!/bin/bash
# ============================================================
# SCRIPT DE MISE À JOUR - i18n + CSS défactorisation
# Exécuter depuis /home/ubuntu/aiapp/frontend/
# ============================================================

set -e
echo "🚀 Début de la mise à jour..."

# === Vérification du répertoire ===
if [ ! -f "package.json" ]; then
  echo "❌ Erreur: Exécutez ce script depuis /home/ubuntu/aiapp/frontend/"
  exit 1
fi

# ============================================================
# NAV2 #1 : general/general
# ============================================================
echo "📁 general/general..."

mkdir -p public/locales/fr/general/general
tee public/locales/fr/general/general/general.json > /dev/null <<'FILEEND'
{
  "title": "Tableau de bord",
  "welcome": "Bienvenue sur votre espace client OVHcloud",
  "description": "Gérez l'ensemble de vos services depuis cette interface",
  "loading": "Chargement...",
  "error": "Une erreur est survenue",
  "retry": "Réessayer"
}
FILEEND

mkdir -p public/locales/en/general/general
tee public/locales/en/general/general/general.json > /dev/null <<'FILEEND'
{
  "title": "Dashboard",
  "welcome": "Welcome to your OVHcloud customer area",
  "description": "Manage all your services from this interface",
  "loading": "Loading...",
  "error": "An error occurred",
  "retry": "Retry"
}
FILEEND

rm -rf src/pages/general/components.20251225T190528 2>/dev/null || true

# ============================================================
# NAV2 #2 : general/account
# ============================================================
echo "📁 general/account..."

mkdir -p public/locales/fr/general/account
mkdir -p public/locales/en/general/account

tee public/locales/fr/general/account/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Gérez les informations de votre compte",
  "nichandle": "Identifiant client",
  "email": "Adresse email",
  "firstname": "Prénom",
  "lastname": "Nom",
  "phone": "Téléphone",
  "address": "Adresse",
  "city": "Ville",
  "zipcode": "Code postal",
  "country": "Pays",
  "language": "Langue",
  "edit": "Modifier",
  "save": "Enregistrer",
  "cancel": "Annuler",
  "success": "Modifications enregistrées",
  "error": "Erreur lors de la sauvegarde",
  "loading": "Chargement..."
}
FILEEND

tee public/locales/en/general/account/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Manage your account information",
  "nichandle": "Customer ID",
  "email": "Email address",
  "firstname": "First name",
  "lastname": "Last name",
  "phone": "Phone",
  "address": "Address",
  "city": "City",
  "zipcode": "Zip code",
  "country": "Country",
  "language": "Language",
  "edit": "Edit",
  "save": "Save",
  "cancel": "Cancel",
  "success": "Changes saved",
  "error": "Error saving changes",
  "loading": "Loading..."
}
FILEEND

tee public/locales/fr/general/account/kyc.json > /dev/null <<'FILEEND'
{
  "title": "Vérification d'identité",
  "description": "Vérifiez votre identité pour sécuriser votre compte",
  "status": "Statut",
  "verified": "Vérifié",
  "pending": "En attente",
  "notVerified": "Non vérifié",
  "uploadDocument": "Télécharger un document",
  "supportedFormats": "Formats acceptés : PDF, JPG, PNG",
  "maxSize": "Taille maximale : 10 Mo",
  "submit": "Soumettre",
  "documentType": "Type de document",
  "idCard": "Carte d'identité",
  "passport": "Passeport",
  "driverLicense": "Permis de conduire",
  "proofOfAddress": "Justificatif de domicile",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement"
}
FILEEND

tee public/locales/en/general/account/kyc.json > /dev/null <<'FILEEND'
{
  "title": "Identity verification",
  "description": "Verify your identity to secure your account",
  "status": "Status",
  "verified": "Verified",
  "pending": "Pending",
  "notVerified": "Not verified",
  "uploadDocument": "Upload document",
  "supportedFormats": "Supported formats: PDF, JPG, PNG",
  "maxSize": "Maximum size: 10 MB",
  "submit": "Submit",
  "documentType": "Document type",
  "idCard": "ID card",
  "passport": "Passport",
  "driverLicense": "Driver's license",
  "proofOfAddress": "Proof of address",
  "loading": "Loading...",
  "error": "Error loading"
}
FILEEND

tee public/locales/fr/general/account/advanced.json > /dev/null <<'FILEEND'
{
  "title": "Paramètres avancés",
  "description": "Configuration avancée de votre compte",
  "deleteAccount": "Supprimer le compte",
  "deleteWarning": "Cette action est irréversible",
  "confirmDelete": "Confirmer la suppression",
  "exportData": "Exporter mes données",
  "exportDescription": "Télécharger une copie de vos données personnelles",
  "apiAccess": "Accès API",
  "apiDescription": "Gérer vos clés d'API",
  "loading": "Chargement...",
  "error": "Erreur"
}
FILEEND

tee public/locales/en/general/account/advanced.json > /dev/null <<'FILEEND'
{
  "title": "Advanced settings",
  "description": "Advanced account configuration",
  "deleteAccount": "Delete account",
  "deleteWarning": "This action is irreversible",
  "confirmDelete": "Confirm deletion",
  "exportData": "Export my data",
  "exportDescription": "Download a copy of your personal data",
  "apiAccess": "API access",
  "apiDescription": "Manage your API keys",
  "loading": "Loading...",
  "error": "Error"
}
FILEEND

tee public/locales/fr/general/account/privacy.json > /dev/null <<'FILEEND'
{
  "title": "Vie privée",
  "description": "Gérez vos préférences de confidentialité",
  "dataUsage": "Utilisation des données",
  "marketing": "Communications marketing",
  "marketingDescription": "Recevoir des offres et actualités OVHcloud",
  "analytics": "Analytiques",
  "analyticsDescription": "Nous aider à améliorer nos services",
  "thirdParty": "Partenaires tiers",
  "thirdPartyDescription": "Partage de données avec nos partenaires",
  "enabled": "Activé",
  "disabled": "Désactivé",
  "save": "Enregistrer",
  "loading": "Chargement...",
  "error": "Erreur"
}
FILEEND

tee public/locales/en/general/account/privacy.json > /dev/null <<'FILEEND'
{
  "title": "Privacy",
  "description": "Manage your privacy preferences",
  "dataUsage": "Data usage",
  "marketing": "Marketing communications",
  "marketingDescription": "Receive OVHcloud offers and news",
  "analytics": "Analytics",
  "analyticsDescription": "Help us improve our services",
  "thirdParty": "Third-party partners",
  "thirdPartyDescription": "Data sharing with our partners",
  "enabled": "Enabled",
  "disabled": "Disabled",
  "save": "Save",
  "loading": "Loading...",
  "error": "Error"
}
FILEEND

tee public/locales/fr/general/account/security.json > /dev/null <<'FILEEND'
{
  "title": "Sécurité",
  "description": "Protégez l'accès à votre compte",
  "password": "Mot de passe",
  "changePassword": "Changer le mot de passe",
  "lastChanged": "Dernière modification",
  "twoFactor": "Double authentification",
  "twoFactorDescription": "Ajouter une couche de sécurité supplémentaire",
  "enable2FA": "Activer",
  "disable2FA": "Désactiver",
  "backupCodes": "Codes de secours",
  "generateCodes": "Générer de nouveaux codes",
  "activeSessions": "Sessions actives",
  "currentSession": "Session actuelle",
  "revokeSession": "Révoquer",
  "revokeAll": "Révoquer toutes les sessions",
  "sshKeys": "Clés SSH",
  "addSshKey": "Ajouter une clé SSH",
  "loading": "Chargement...",
  "error": "Erreur"
}
FILEEND

tee public/locales/en/general/account/security.json > /dev/null <<'FILEEND'
{
  "title": "Security",
  "description": "Protect access to your account",
  "password": "Password",
  "changePassword": "Change password",
  "lastChanged": "Last changed",
  "twoFactor": "Two-factor authentication",
  "twoFactorDescription": "Add an extra layer of security",
  "enable2FA": "Enable",
  "disable2FA": "Disable",
  "backupCodes": "Backup codes",
  "generateCodes": "Generate new codes",
  "activeSessions": "Active sessions",
  "currentSession": "Current session",
  "revokeSession": "Revoke",
  "revokeAll": "Revoke all sessions",
  "sshKeys": "SSH keys",
  "addSshKey": "Add SSH key",
  "loading": "Loading...",
  "error": "Error"
}
FILEEND

tee public/locales/fr/general/account/contacts-services.json > /dev/null <<'FILEEND'
{
  "title": "Contacts par service",
  "description": "Gérez les contacts associés à vos services",
  "service": "Service",
  "admin": "Administrateur",
  "tech": "Technique",
  "billing": "Facturation",
  "changeContact": "Modifier le contact",
  "noServices": "Aucun service trouvé",
  "search": "Rechercher un service",
  "filter": "Filtrer",
  "allTypes": "Tous les types",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement"
}
FILEEND

tee public/locales/en/general/account/contacts-services.json > /dev/null <<'FILEEND'
{
  "title": "Contacts by service",
  "description": "Manage contacts associated with your services",
  "service": "Service",
  "admin": "Administrator",
  "tech": "Technical",
  "billing": "Billing",
  "changeContact": "Change contact",
  "noServices": "No services found",
  "search": "Search for a service",
  "filter": "Filter",
  "allTypes": "All types",
  "loading": "Loading...",
  "error": "Error loading"
}
FILEEND

tee public/locales/fr/general/account/contacts-requests.json > /dev/null <<'FILEEND'
{
  "title": "Demandes de changement",
  "description": "Gérez les demandes de changement de contact",
  "pending": "En attente",
  "accepted": "Acceptées",
  "refused": "Refusées",
  "service": "Service",
  "from": "De",
  "to": "Vers",
  "type": "Type",
  "date": "Date",
  "status": "Statut",
  "accept": "Accepter",
  "refuse": "Refuser",
  "noRequests": "Aucune demande",
  "loading": "Chargement...",
  "error": "Erreur"
}
FILEEND

tee public/locales/en/general/account/contacts-requests.json > /dev/null <<'FILEEND'
{
  "title": "Change requests",
  "description": "Manage contact change requests",
  "pending": "Pending",
  "accepted": "Accepted",
  "refused": "Refused",
  "service": "Service",
  "from": "From",
  "to": "To",
  "type": "Type",
  "date": "Date",
  "status": "Status",
  "accept": "Accept",
  "refuse": "Refuse",
  "noRequests": "No requests",
  "loading": "Loading...",
  "error": "Error"
}
FILEEND

# ============================================================
# NAV2 #3 : bare-metal/vps
# ============================================================
echo "📁 bare-metal/vps..."

mkdir -p public/locales/fr/bare-metal/vps
mkdir -p public/locales/en/bare-metal/vps

tee public/locales/fr/bare-metal/vps/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "section": {
    "info": "Informations",
    "system": "Système",
    "network": "Réseau",
    "subscription": "Abonnement"
  },
  "field": {
    "name": "Nom",
    "displayName": "Nom d'affichage",
    "state": "État",
    "model": "Modèle",
    "offer": "Offre",
    "datacenter": "Datacenter",
    "zone": "Zone",
    "os": "Système d'exploitation",
    "ip": "Adresse IP",
    "ipv6": "Adresse IPv6",
    "vcore": "vCores",
    "memory": "Mémoire",
    "disk": "Disque",
    "createdAt": "Date de création",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "state": {
    "running": "En cours d'exécution",
    "stopped": "Arrêté",
    "rescued": "Mode rescue",
    "installing": "Installation en cours"
  },
  "action": {
    "start": "Démarrer",
    "stop": "Arrêter",
    "reboot": "Redémarrer",
    "rescue": "Mode rescue",
    "reinstall": "Réinstaller"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your VPS",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "section": {
    "info": "Information",
    "system": "System",
    "network": "Network",
    "subscription": "Subscription"
  },
  "field": {
    "name": "Name",
    "displayName": "Display name",
    "state": "State",
    "model": "Model",
    "offer": "Offer",
    "datacenter": "Datacenter",
    "zone": "Zone",
    "os": "Operating system",
    "ip": "IP address",
    "ipv6": "IPv6 address",
    "vcore": "vCores",
    "memory": "Memory",
    "disk": "Disk",
    "createdAt": "Creation date",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "state": {
    "running": "Running",
    "stopped": "Stopped",
    "rescued": "Rescue mode",
    "installing": "Installing"
  },
  "action": {
    "start": "Start",
    "stop": "Stop",
    "reboot": "Reboot",
    "rescue": "Rescue mode",
    "reinstall": "Reinstall"
  }
}
FILEEND

tee public/locales/fr/bare-metal/vps/disks.json > /dev/null <<'FILEEND'
{
  "title": "Disques",
  "description": "Gérez les disques de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun disque trouvé",
  "field": {
    "name": "Nom",
    "size": "Taille",
    "type": "Type",
    "state": "État",
    "primary": "Principal",
    "additional": "Additionnel"
  },
  "type": {
    "ssd": "SSD",
    "hdd": "HDD",
    "nvme": "NVMe"
  },
  "state": {
    "active": "Actif",
    "inactive": "Inactif",
    "error": "Erreur"
  },
  "action": {
    "add": "Ajouter un disque",
    "remove": "Supprimer",
    "resize": "Redimensionner"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/disks.json > /dev/null <<'FILEEND'
{
  "title": "Disks",
  "description": "Manage your VPS disks",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No disks found",
  "field": {
    "name": "Name",
    "size": "Size",
    "type": "Type",
    "state": "State",
    "primary": "Primary",
    "additional": "Additional"
  },
  "type": {
    "ssd": "SSD",
    "hdd": "HDD",
    "nvme": "NVMe"
  },
  "state": {
    "active": "Active",
    "inactive": "Inactive",
    "error": "Error"
  },
  "action": {
    "add": "Add disk",
    "remove": "Remove",
    "resize": "Resize"
  }
}
FILEEND

tee public/locales/fr/bare-metal/vps/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "progress": "Progression",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "comment": "Commentaire"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "type": {
    "reboot": "Redémarrage",
    "reinstall": "Réinstallation",
    "backup": "Sauvegarde",
    "snapshot": "Snapshot",
    "upgrade": "Mise à niveau"
  },
  "action": {
    "refresh": "Actualiser",
    "cancel": "Annuler"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history on your VPS",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "progress": "Progress",
    "startDate": "Start date",
    "endDate": "End date",
    "comment": "Comment"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "type": {
    "reboot": "Reboot",
    "reinstall": "Reinstallation",
    "backup": "Backup",
    "snapshot": "Snapshot",
    "upgrade": "Upgrade"
  },
  "action": {
    "refresh": "Refresh",
    "cancel": "Cancel"
  }
}
FILEEND

tee public/locales/fr/bare-metal/vps/ips.json > /dev/null <<'FILEEND'
{
  "title": "Adresses IP",
  "description": "Gérez les adresses IP de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune IP trouvée",
  "field": {
    "ip": "Adresse IP",
    "version": "Version",
    "type": "Type",
    "reverse": "Reverse DNS",
    "gateway": "Passerelle",
    "netmask": "Masque réseau"
  },
  "type": {
    "primary": "Principale",
    "failover": "Failover",
    "additional": "Additionnelle"
  },
  "version": {
    "ipv4": "IPv4",
    "ipv6": "IPv6"
  },
  "action": {
    "editReverse": "Modifier le reverse",
    "move": "Déplacer l'IP",
    "order": "Commander une IP"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/ips.json > /dev/null <<'FILEEND'
{
  "title": "IP addresses",
  "description": "Manage your VPS IP addresses",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No IP found",
  "field": {
    "ip": "IP address",
    "version": "Version",
    "type": "Type",
    "reverse": "Reverse DNS",
    "gateway": "Gateway",
    "netmask": "Netmask"
  },
  "type": {
    "primary": "Primary",
    "failover": "Failover",
    "additional": "Additional"
  },
  "version": {
    "ipv4": "IPv4",
    "ipv6": "IPv6"
  },
  "action": {
    "editReverse": "Edit reverse",
    "move": "Move IP",
    "order": "Order an IP"
  }
}
FILEEND

tee public/locales/fr/bare-metal/vps/backups.json > /dev/null <<'FILEEND'
{
  "title": "Sauvegardes",
  "description": "Gérez les sauvegardes automatiques de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune sauvegarde disponible",
  "status": {
    "enabled": "Sauvegardes activées",
    "disabled": "Sauvegardes désactivées"
  },
  "field": {
    "id": "ID",
    "date": "Date",
    "size": "Taille",
    "state": "État"
  },
  "state": {
    "available": "Disponible",
    "creating": "En cours de création",
    "restoring": "Restauration en cours",
    "error": "Erreur"
  },
  "action": {
    "enable": "Activer les sauvegardes",
    "disable": "Désactiver",
    "restore": "Restaurer",
    "delete": "Supprimer",
    "mount": "Monter"
  },
  "confirm": {
    "restore": "Voulez-vous vraiment restaurer cette sauvegarde ?",
    "delete": "Voulez-vous vraiment supprimer cette sauvegarde ?"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/backups.json > /dev/null <<'FILEEND'
{
  "title": "Backups",
  "description": "Manage automatic backups of your VPS",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No backup available",
  "status": {
    "enabled": "Backups enabled",
    "disabled": "Backups disabled"
  },
  "field": {
    "id": "ID",
    "date": "Date",
    "size": "Size",
    "state": "State"
  },
  "state": {
    "available": "Available",
    "creating": "Creating",
    "restoring": "Restoring",
    "error": "Error"
  },
  "action": {
    "enable": "Enable backups",
    "disable": "Disable",
    "restore": "Restore",
    "delete": "Delete",
    "mount": "Mount"
  },
  "confirm": {
    "restore": "Do you really want to restore this backup?",
    "delete": "Do you really want to delete this backup?"
  }
}
FILEEND

tee public/locales/fr/bare-metal/vps/snapshot.json > /dev/null <<'FILEEND'
{
  "title": "Snapshot",
  "description": "Gérez le snapshot de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "noSnapshot": "Aucun snapshot disponible",
  "field": {
    "date": "Date de création",
    "description": "Description",
    "size": "Taille estimée"
  },
  "action": {
    "create": "Créer un snapshot",
    "restore": "Restaurer",
    "delete": "Supprimer"
  },
  "confirm": {
    "create": "Le snapshot actuel sera remplacé. Continuer ?",
    "restore": "Le VPS sera restauré à l'état du snapshot. Continuer ?",
    "delete": "Voulez-vous vraiment supprimer ce snapshot ?"
  },
  "success": {
    "create": "Snapshot créé avec succès",
    "restore": "Restauration en cours",
    "delete": "Snapshot supprimé"
  }
}
FILEEND

tee public/locales/en/bare-metal/vps/snapshot.json > /dev/null <<'FILEEND'
{
  "title": "Snapshot",
  "description": "Manage your VPS snapshot",
  "loading": "Loading...",
  "error": "Error loading",
  "noSnapshot": "No snapshot available",
  "field": {
    "date": "Creation date",
    "description": "Description",
    "size": "Estimated size"
  },
  "action": {
    "create": "Create snapshot",
    "restore": "Restore",
    "delete": "Delete"
  },
  "confirm": {
    "create": "Current snapshot will be replaced. Continue?",
    "restore": "VPS will be restored to snapshot state. Continue?",
    "delete": "Do you really want to delete this snapshot?"
  },
  "success": {
    "create": "Snapshot created successfully",
    "restore": "Restoration in progress",
    "delete": "Snapshot deleted"
  }
}
FILEEND

# CSS VPS
cd src/pages/bare-metal/vps
cp index.css index.css.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
mv index.css VpsPage.css 2>/dev/null || true
sed -i 's/import "\.\/index\.css"/import "\.\/VpsPage.css"/' index.tsx 2>/dev/null || true
cd /home/ubuntu/aiapp/frontend

# ============================================================
# NAV2 #4 : bare-metal/housing
# ============================================================
echo "📁 bare-metal/housing..."

mkdir -p public/locales/fr/bare-metal/housing
mkdir -p public/locales/en/bare-metal/housing

tee public/locales/fr/bare-metal/housing/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre baie Housing",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "section": {
    "info": "Informations",
    "location": "Localisation",
    "network": "Réseau",
    "subscription": "Abonnement"
  },
  "field": {
    "name": "Nom",
    "datacenter": "Datacenter",
    "rack": "Baie",
    "unit": "Unité",
    "size": "Taille",
    "power": "Alimentation",
    "bandwidth": "Bande passante",
    "expiration": "Expiration",
    "renewal": "Renouvellement"
  },
  "action": {
    "edit": "Modifier",
    "renew": "Renouveler"
  }
}
FILEEND

tee public/locales/en/bare-metal/housing/general.json > /dev/null <<'FILEEND'
{
  "title": "General information",
  "description": "Overview of your Housing bay",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "section": {
    "info": "Information",
    "location": "Location",
    "network": "Network",
    "subscription": "Subscription"
  },
  "field": {
    "name": "Name",
    "datacenter": "Datacenter",
    "rack": "Rack",
    "unit": "Unit",
    "size": "Size",
    "power": "Power supply",
    "bandwidth": "Bandwidth",
    "expiration": "Expiration",
    "renewal": "Renewal"
  },
  "action": {
    "edit": "Edit",
    "renew": "Renew"
  }
}
FILEEND

tee public/locales/fr/bare-metal/housing/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "État",
    "startDate": "Date de début",
    "endDate": "Date de fin",
    "comment": "Commentaire"
  },
  "state": {
    "todo": "À faire",
    "doing": "En cours",
    "done": "Terminé",
    "cancelled": "Annulé",
    "error": "Erreur"
  },
  "action": {
    "refresh": "Actualiser"
  }
}
FILEEND

tee public/locales/en/bare-metal/housing/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tasks",
  "description": "Operations history",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No recent tasks",
  "field": {
    "id": "ID",
    "type": "Type",
    "state": "State",
    "startDate": "Start date",
    "endDate": "End date",
    "comment": "Comment"
  },
  "state": {
    "todo": "To do",
    "doing": "In progress",
    "done": "Done",
    "cancelled": "Cancelled",
    "error": "Error"
  },
  "action": {
    "refresh": "Refresh"
  }
}
FILEEND

# CSS Housing
cd src/pages/bare-metal/housing
cp index.css index.css.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
mv index.css HousingPage.css 2>/dev/null || true
sed -i 's/import "\.\/index\.css"/import "\.\/HousingPage.css"/' index.tsx 2>/dev/null || true
cd /home/ubuntu/aiapp/frontend

# ============================================================
# NAV2 #5 : bare-metal/dedicated
# ============================================================
echo "📁 bare-metal/dedicated..."

mkdir -p public/locales/fr/bare-metal/dedicated
mkdir -p public/locales/en/bare-metal/dedicated

tee public/locales/fr/bare-metal/dedicated/ipmi.json > /dev/null <<'FILEEND'
{
  "title": "IPMI / KVM",
  "description": "Accès console à distance de votre serveur dédié",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "section": {
    "access": "Accès IPMI",
    "kvm": "Console KVM",
    "sol": "Serial Over LAN"
  },
  "field": {
    "ip": "Adresse IP IPMI",
    "type": "Type",
    "supported": "Supporté",
    "notSupported": "Non supporté"
  },
  "status": {
    "available": "Disponible",
    "unavailable": "Indisponible",
    "inProgress": "En cours"
  },
  "action": {
    "launchKvm": "Lancer KVM",
    "launchSol": "Lancer SOL",
    "generateAccess": "Générer un accès",
    "resetIpmi": "Réinitialiser IPMI",
    "refresh": "Actualiser"
  },
  "kvm": {
    "javaWarning": "La console KVM nécessite Java",
    "html5": "Console HTML5",
    "jnlp": "Télécharger JNLP"
  },
  "confirm": {
    "reset": "Voulez-vous vraiment réinitialiser l'IPMI ?"
  },
  "success": {
    "accessGenerated": "Accès généré avec succès",
    "resetStarted": "Réinitialisation en cours"
  }
}
FILEEND

tee public/locales/en/bare-metal/dedicated/ipmi.json > /dev/null <<'FILEEND'
{
  "title": "IPMI / KVM",
  "description": "Remote console access to your dedicated server",
  "loading": "Loading...",
  "error": "Error loading",
  "retry": "Retry",
  "section": {
    "access": "IPMI Access",
    "kvm": "KVM Console",
    "sol": "Serial Over LAN"
  },
  "field": {
    "ip": "IPMI IP address",
    "type": "Type",
    "supported": "Supported",
    "notSupported": "Not supported"
  },
  "status": {
    "available": "Available",
    "unavailable": "Unavailable",
    "inProgress": "In progress"
  },
  "action": {
    "launchKvm": "Launch KVM",
    "launchSol": "Launch SOL",
    "generateAccess": "Generate access",
    "resetIpmi": "Reset IPMI",
    "refresh": "Refresh"
  },
  "kvm": {
    "javaWarning": "KVM console requires Java",
    "html5": "HTML5 Console",
    "jnlp": "Download JNLP"
  },
  "confirm": {
    "reset": "Do you really want to reset IPMI?"
  },
  "success": {
    "accessGenerated": "Access generated successfully",
    "resetStarted": "Reset in progress"
  }
}
FILEEND

# ============================================================
# NAV2 #6 : iam/general
# ============================================================
echo "📁 iam/general..."

mkdir -p public/locales/fr/iam/general
mkdir -p public/locales/en/iam/general

tee public/locales/fr/iam/general/identities.json > /dev/null <<'FILEEND'
{
  "title": "Identités",
  "description": "Gérez les utilisateurs et comptes de service",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune identité trouvée",
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
  "status": {
    "active": "Actif",
    "inactive": "Inactif",
    "disabled": "Désactivé",
    "pending": "En attente"
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
  "error": "Error loading",
  "empty": "No identity found",
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
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "disabled": "Disabled",
    "pending": "Pending"
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

tee public/locales/fr/iam/general/groups.json > /dev/null <<'FILEEND'
{
  "title": "Groupes",
  "description": "Gérez les groupes d'utilisateurs",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun groupe trouvé",
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
  "error": "Error loading",
  "empty": "No group found",
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

tee public/locales/fr/iam/general/policies.json > /dev/null <<'FILEEND'
{
  "title": "Politiques",
  "description": "Gérez les politiques d'accès IAM",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune politique trouvée",
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
  "error": "Error loading",
  "empty": "No policy found",
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

tee public/locales/fr/iam/general/logs.json > /dev/null <<'FILEEND'
{
  "title": "Journaux",
  "description": "Consultez les journaux d'audit IAM",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun journal trouvé",
  "field": {
    "date": "Date",
    "identity": "Identité",
    "action": "Action",
    "resource": "Ressource",
    "result": "Résultat",
    "ip": "Adresse IP",
    "details": "Détails"
  },
  "result": {
    "success": "Succès",
    "failure": "Échec",
    "denied": "Refusé"
  },
  "filter": {
    "dateRange": "Période",
    "identity": "Identité",
    "action": "Action",
    "result": "Résultat"
  },
  "action": {
    "refresh": "Actualiser",
    "export": "Exporter",
    "viewDetails": "Voir détails"
  }
}
FILEEND

tee public/locales/en/iam/general/logs.json > /dev/null <<'FILEEND'
{
  "title": "Logs",
  "description": "View IAM audit logs",
  "loading": "Loading...",
  "error": "Error loading",
  "empty": "No logs found",
  "field": {
    "date": "Date",
    "identity": "Identity",
    "action": "Action",
    "resource": "Resource",
    "result": "Result",
    "ip": "IP address",
    "details": "Details"
  },
  "result": {
    "success": "Success",
    "failure": "Failure",
    "denied": "Denied"
  },
  "filter": {
    "dateRange": "Date range",
    "identity": "Identity",
    "action": "Action",
    "result": "Result"
  },
  "action": {
    "refresh": "Refresh",
    "export": "Export",
    "viewDetails": "View details"
  }
}
FILEEND

# CSS IAM General
cd src/pages/iam/general
cp GeneralPage.css GeneralPage.css.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
mv GeneralPage.css IamGeneralPage.css 2>/dev/null || true
sed -i 's/\.general-page/.iam-general-page/g' IamGeneralPage.css 2>/dev/null || true
sed -i 's/\.general-tab/.iam-general-page-tab/g' IamGeneralPage.css 2>/dev/null || true
sed -i 's/\.general-tabs/.iam-general-page-tabs/g' IamGeneralPage.css 2>/dev/null || true
sed -i 's/\.general-guides/.iam-general-page-guides/g' IamGeneralPage.css 2>/dev/null || true
sed -i 's/\.general-content/.iam-general-page-content/g' IamGeneralPage.css 2>/dev/null || true
sed -i 's/import "\.\/GeneralPage\.css"/import "\.\/IamGeneralPage.css"/' index.tsx 2>/dev/null || true
sed -i 's/className="general-page/className="iam-general-page/g' index.tsx 2>/dev/null || true
sed -i 's/className="general-tab/className="iam-general-page-tab/g' index.tsx 2>/dev/null || true
sed -i 's/className="general-tabs/className="iam-general-page-tabs/g' index.tsx 2>/dev/null || true
sed -i 's/className="general-guides/className="iam-general-page-guides/g' index.tsx 2>/dev/null || true
sed -i 's/className="general-content/className="iam-general-page-content/g' index.tsx 2>/dev/null || true
cd /home/ubuntu/aiapp/frontend

# ============================================================
# NAV2 #7 : iam/okms
# ============================================================
echo "📁 iam/okms..."

mkdir -p public/locales/fr/iam/okms
mkdir -p public/locales/en/iam/okms

tee public/locales/fr/iam/okms/keys.json > /dev/null <<'FILEEND'
{
  "title": "Clés",
  "description": "Gérez vos clés de chiffrement KMS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune clé trouvée",
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
  "empty": "No key found",
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

tee public/locales/fr/iam/okms/credentials.json > /dev/null <<'FILEEND'
{
  "title": "Identifiants",
  "description": "Gérez les identifiants d'accès au KMS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun identifiant trouvé",
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
  "empty": "No credential found",
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
# NAV2 #8 : iam/secret
# ============================================================
echo "📁 iam/secret..."

mkdir -p public/locales/fr/iam/secret
mkdir -p public/locales/en/iam/secret

tee public/locales/fr/iam/secret/access.json > /dev/null <<'FILEEND'
{
  "title": "Accès",
  "description": "Gérez les accès au gestionnaire de secrets",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun accès configuré",
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
  "empty": "No access configured",
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

tee public/locales/fr/iam/secret/secrets.json > /dev/null <<'FILEEND'
{
  "title": "Secrets",
  "description": "Gérez vos secrets",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun secret trouvé",
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
  "empty": "No secret found",
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

tee public/locales/fr/iam/secret/versions.json > /dev/null <<'FILEEND'
{
  "title": "Versions",
  "description": "Historique des versions du secret",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune version trouvée",
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
  "empty": "No version found",
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
# NAV2 #9 : license/plesk
# ============================================================
echo "📁 license/plesk..."

mkdir -p public/locales/fr/license/plesk
mkdir -p public/locales/en/license/plesk

tee public/locales/fr/license/plesk/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence Plesk",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
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

tee public/locales/fr/license/plesk/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
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
# NAV2 #10 : license/cloudlinux
# ============================================================
echo "📁 license/cloudlinux..."

mkdir -p public/locales/fr/license/cloudlinux
mkdir -p public/locales/en/license/cloudlinux

tee public/locales/fr/license/cloudlinux/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence CloudLinux",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
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

tee public/locales/fr/license/cloudlinux/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
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
# NAV2 #11 : license/directadmin
# ============================================================
echo "📁 license/directadmin..."

mkdir -p public/locales/fr/license/directadmin
mkdir -p public/locales/en/license/directadmin

tee public/locales/fr/license/directadmin/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence DirectAdmin",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
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

tee public/locales/fr/license/directadmin/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
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
# NAV2 #12 : license/sqlserver
# ============================================================
echo "📁 license/sqlserver..."

mkdir -p public/locales/fr/license/sqlserver
mkdir -p public/locales/en/license/sqlserver

tee public/locales/fr/license/sqlserver/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre licence SQL Server",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
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

tee public/locales/fr/license/sqlserver/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre licence",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
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
# VÉRIFICATION FINALE
# ============================================================
echo ""
echo "============================================================"
echo "🎉 MISE À JOUR TERMINÉE !"
echo "============================================================"
echo ""
echo "📊 Fichiers i18n créés :"
find public/locales -name "*.json" | wc -l
echo ""
echo "📁 Structure FR :"
find public/locales/fr -type d | sort
echo ""
echo "🔧 CSS renommés :"
find src/pages -name "*Page.css" | sort
echo ""
echo "💡 Prochaine étape : npm run build:dev"
