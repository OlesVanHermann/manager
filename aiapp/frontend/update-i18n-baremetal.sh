#!/bin/bash
# ============================================================
# SCRIPT DE MISE À JOUR - Clés i18n bare-metal manquantes
# Exécuter depuis /home/ubuntu/aiapp/frontend/
# ============================================================

set -e
echo "🚀 Ajout des clés bare-metal manquantes..."

if [ ! -f "package.json" ]; then
  echo "❌ Erreur: Exécutez ce script depuis /home/ubuntu/aiapp/frontend/"
  exit 1
fi

# ============================================================
# bare-metal/dedicated/ipmi
# ============================================================
echo "📁 bare-metal/dedicated/ipmi..."

tee public/locales/fr/bare-metal/dedicated/ipmi.json > /dev/null <<'FILEEND'
{
  "title": "IPMI / KVM",
  "description": "Accès console à distance de votre serveur dédié",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "notAvailable": "IPMI non disponible",
  "supported": "Supporté",
  "notSupported": "Non supporté",
  "launchKvm": "Lancer KVM",
  "launchSol": "Lancer SOL",
  "sessionUrl": "URL de session",
  "openSession": "Ouvrir la session",
  "whatIs": "Qu'est-ce que l'IPMI ?",
  "explanation": "L'IPMI (Intelligent Platform Management Interface) permet d'accéder à la console de votre serveur à distance, même si le système d'exploitation ne répond plus.",
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
  "notAvailable": "IPMI not available",
  "supported": "Supported",
  "notSupported": "Not supported",
  "launchKvm": "Launch KVM",
  "launchSol": "Launch SOL",
  "sessionUrl": "Session URL",
  "openSession": "Open session",
  "whatIs": "What is IPMI?",
  "explanation": "IPMI (Intelligent Platform Management Interface) allows you to access your server console remotely, even if the operating system is not responding.",
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
# bare-metal/housing/general
# ============================================================
echo "📁 bare-metal/housing/general..."

tee public/locales/fr/bare-metal/housing/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre baie Housing",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "fields": {
    "name": "Nom",
    "datacenter": "Datacenter",
    "rack": "Baie",
    "bandwidth": "Bande passante"
  },
  "info": {
    "title": "À propos du Housing",
    "description": "Le service Housing vous permet d'héberger vos propres équipements dans nos datacenters."
  },
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
  "fields": {
    "name": "Name",
    "datacenter": "Datacenter",
    "rack": "Rack",
    "bandwidth": "Bandwidth"
  },
  "info": {
    "title": "About Housing",
    "description": "The Housing service allows you to host your own equipment in our datacenters."
  },
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

# ============================================================
# bare-metal/housing/tasks
# ============================================================
echo "📁 bare-metal/housing/tasks..."

tee public/locales/fr/bare-metal/housing/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": {
    "title": "Aucune tâche récente"
  },
  "columns": {
    "function": "Fonction",
    "status": "Statut",
    "started": "Démarré",
    "completed": "Terminé"
  },
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
  "empty": {
    "title": "No recent tasks"
  },
  "columns": {
    "function": "Function",
    "status": "Status",
    "started": "Started",
    "completed": "Completed"
  },
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

# ============================================================
# bare-metal/vps/backups
# ============================================================
echo "📁 bare-metal/vps/backups..."

tee public/locales/fr/bare-metal/vps/backups.json > /dev/null <<'FILEEND'
{
  "title": "Sauvegardes",
  "description": "Gérez les sauvegardes automatiques de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "confirmRestore": "Voulez-vous vraiment restaurer cette sauvegarde ?",
  "restoreStarted": "Restauration démarrée",
  "restore": "Restaurer",
  "empty": {
    "title": "Aucune sauvegarde disponible"
  },
  "columns": {
    "id": "ID",
    "date": "Date",
    "actions": "Actions"
  },
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
  "confirmRestore": "Do you really want to restore this backup?",
  "restoreStarted": "Restore started",
  "restore": "Restore",
  "empty": {
    "title": "No backup available"
  },
  "columns": {
    "id": "ID",
    "date": "Date",
    "actions": "Actions"
  },
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

# ============================================================
# bare-metal/vps/disks
# ============================================================
echo "📁 bare-metal/vps/disks..."

tee public/locales/fr/bare-metal/vps/disks.json > /dev/null <<'FILEEND'
{
  "title": "Disques",
  "description": "Gérez les disques de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucun disque trouvé",
  "bandwidthLimit": "Limite de bande passante",
  "id": "ID",
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
  "bandwidthLimit": "Bandwidth limit",
  "id": "ID",
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

# ============================================================
# bare-metal/vps/general
# ============================================================
echo "📁 bare-metal/vps/general..."

tee public/locales/fr/bare-metal/vps/general.json > /dev/null <<'FILEEND'
{
  "title": "Informations générales",
  "description": "Vue d'ensemble de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "retry": "Réessayer",
  "displayName": "Nom d'affichage",
  "model": "Modèle",
  "vcore": "vCores",
  "memory": "Mémoire",
  "disk": "Disque",
  "zone": "Zone",
  "cluster": "Cluster",
  "netboot": "Netboot",
  "monitoring": "Monitoring",
  "service": "Service",
  "creation": "Création",
  "expiration": "Expiration",
  "renew": "Renouvellement",
  "automatic": "Automatique",
  "manual": "Manuel",
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
  "displayName": "Display name",
  "model": "Model",
  "vcore": "vCores",
  "memory": "Memory",
  "disk": "Disk",
  "zone": "Zone",
  "cluster": "Cluster",
  "netboot": "Netboot",
  "monitoring": "Monitoring",
  "service": "Service",
  "creation": "Creation",
  "expiration": "Expiration",
  "renew": "Renewal",
  "automatic": "Automatic",
  "manual": "Manual",
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

# ============================================================
# bare-metal/vps/ips
# ============================================================
echo "📁 bare-metal/vps/ips..."

tee public/locales/fr/bare-metal/vps/ips.json > /dev/null <<'FILEEND'
{
  "title": "Adresses IP",
  "description": "Gérez les adresses IP de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune IP trouvée",
  "address": "Adresse",
  "gateway": "Passerelle",
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
  "address": "Address",
  "gateway": "Gateway",
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

# ============================================================
# bare-metal/vps/snapshot
# ============================================================
echo "📁 bare-metal/vps/snapshot..."

tee public/locales/fr/bare-metal/vps/snapshot.json > /dev/null <<'FILEEND'
{
  "title": "Snapshot",
  "description": "Gérez le snapshot de votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "noSnapshot": "Aucun snapshot disponible",
  "confirmCreate": "Le snapshot actuel sera remplacé. Continuer ?",
  "confirmRestore": "Le VPS sera restauré à l'état du snapshot. Continuer ?",
  "confirmDelete": "Voulez-vous vraiment supprimer ce snapshot ?",
  "available": "Snapshot disponible",
  "none": "Aucun snapshot",
  "restore": "Restaurer",
  "create": "Créer un snapshot",
  "info": {
    "title": "À propos des snapshots",
    "description": "Un snapshot est une image instantanée de votre VPS. Vous pouvez restaurer votre VPS à cet état à tout moment."
  },
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
  "confirmCreate": "Current snapshot will be replaced. Continue?",
  "confirmRestore": "VPS will be restored to snapshot state. Continue?",
  "confirmDelete": "Do you really want to delete this snapshot?",
  "available": "Snapshot available",
  "none": "No snapshot",
  "restore": "Restore",
  "create": "Create snapshot",
  "info": {
    "title": "About snapshots",
    "description": "A snapshot is an instant image of your VPS. You can restore your VPS to this state at any time."
  },
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

# ============================================================
# bare-metal/vps/tasks
# ============================================================
echo "📁 bare-metal/vps/tasks..."

tee public/locales/fr/bare-metal/vps/tasks.json > /dev/null <<'FILEEND'
{
  "title": "Tâches",
  "description": "Historique des opérations sur votre VPS",
  "loading": "Chargement...",
  "error": "Erreur lors du chargement",
  "empty": "Aucune tâche récente",
  "progress": "Progression",
  "started": "Démarré",
  "done": "Terminé",
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
  "progress": "Progress",
  "started": "Started",
  "done": "Done",
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

# ============================================================
# FIN
# ============================================================
echo ""
echo "============================================================"
echo "🎉 Clés bare-metal manquantes ajoutées !"
echo "============================================================"
echo ""
echo "💡 Prochaine étape : npm run build:dev"
