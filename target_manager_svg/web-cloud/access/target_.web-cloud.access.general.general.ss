================================================================================
SCREENSHOT: target_.web-cloud.access.general.general.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: General

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                           =====                                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [OTB]              │ Fibre Pro Paris                                                [Demenager] [Migrer] │
│  =======                     │ xdsl-ab12345-1                                    [FTTH] [Pack Pro] [Actif]         │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Ligne] [Modem] [Services] [VoIP] [Options] [Taches]                      │
│ [Rechercher...]              │  =======                                                                            │
├──────────────────────────────┤  NAV4=General (ACTIF)                                                               │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ * Fibre Pro Paris        ████│  ┌───────────────────────────────────┐  ┌───────────────────────────────────┐       │
│   xdsl-ab12345-1             │  │ Informations                      │  │ Etat de la ligne                  │       │
│   FTTH - Pack Pro            │  ├───────────────────────────────────┤  ├───────────────────────────────────┤       │
│   (SELECTIONNE)       [Actif]│  │                                   │  │                                   │       │
├──────────────────────────────┤  │  Reference    xdsl-ab12345-1      │  │  Statut      [v] Synchronisee     │       │
│ o VDSL Bureau Lyon           │  │  Type         FTTH (Fibre opt.)   │  │                                   │       │
│   xdsl-cd67890-2             │  │  Offre        Pack Pro            │  │  Debit descendant                 │       │
│   VDSL2 - Acces seul         │  │  Statut       [v] Actif           │  │  ████████████████ 1000 Mbps       │       │
│                       [Actif]│  │  Creation     15/03/2023          │  │                                   │       │
├──────────────────────────────┤  │  Expiration   15/03/2026          │  │  Debit montant                    │       │
│ o Backup 4G                  │  │                                   │  │  ████████░░░░░░░░  500 Mbps       │       │
│   xdsl-ef11111-3             │  │  Adresse:                         │  │                                   │       │
│   4G/LTE - Acces seul        │  │  123 Avenue des Champs-Elysees    │  │  Technologie  GPON                │       │
│                     [Degrade]│  │  75008 Paris                      │  │                                   │       │
│                              │  │                                   │  │       [Voir details ligne ->]    │       │
│                              │  └───────────────────────────────────┘  └───────────────────────────────────┘       │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────┐  ┌───────────────────────────────────┐       │
│                              │  │ Modem OVH                         │  │ Services inclus (Pack Pro)        │       │
│                              │  ├───────────────────────────────────┤  ├───────────────────────────────────┤       │
│                              │  │                                   │  │                                   │       │
│                              │  │  Modele       Livebox 6           │  │  Domaine                          │       │
│                              │  │  N serie      LB6-123456789       │  │  example.com        [Gerer ->]    │       │
│                              │  │  IP locale    192.168.1.1         │  │                                   │       │
│                              │  │  WiFi         [v] Actif (5G+2.4G) │  │  Emails (5 comptes MX Plan)       │       │
│                              │  │  Firmware     4.52.1              │  │  contact@example.com [Gerer ->]   │       │
│                              │  │                                   │  │                                   │       │
│                              │  │  Appareils connectes: 12          │  │  Ligne VoIP                       │       │
│                              │  │                                   │  │  +33 9 72 10 12 34  [Gerer ->]    │       │
│                              │  │    [Configurer modem ->]          │  │                                   │       │
│                              │  └───────────────────────────────────┘  └───────────────────────────────────┘       │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "connection": {
    "connectionId": "xdsl-ab12345-1",
    "description": "Fibre Pro Paris",
    "type": "FTTH",
    "offer": "Pack Pro",
    "status": "active",
    "creationDate": "2023-03-15",
    "expirationDate": "2026-03-15",
    "address": "123 Avenue des Champs-Elysees, 75008 Paris"
  },
  "line": {
    "status": "synchronized",
    "download": 1000,
    "upload": 500,
    "technology": "GPON"
  },
  "modem": {
    "model": "Livebox 6",
    "serial": "LB6-123456789",
    "ip": "192.168.1.1",
    "wifi": "active",
    "firmware": "4.52.1",
    "connectedDevices": 12
  },
  "services": {
    "domain": "example.com",
    "emails": ["contact@example.com"],
    "emailCount": 5,
    "voip": "+33 9 72 10 12 34"
  }
}

================================================================================
