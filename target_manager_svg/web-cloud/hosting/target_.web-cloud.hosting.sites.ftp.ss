================================================================================
SCREENSHOT: target_.web-cloud.hosting.sites.ftp.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Sites / Liste services (ALL 1er) | NAV4: FTP-SSH

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                       =============                                                                                │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Sites][Offre]      │ monsite.ovh.net                                                                     │
│          =====               │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=Sites (ACTIF)          │ [Multisite] [SSL] [FTP-SSH] [BDD] [CDN]                                             │
├──────────────────────────────┤                   =======                                                           │
│ [Rechercher...]              │                   NAV4=FTP-SSH (ACTIF)                                              │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [+ Creer un utilisateur]                                                            │
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   4 hebergements             │  │ Informations de connexion FTP/SSH                                             │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * monsite.ovh.net            │  │ Serveur FTP    ftp.cluster042.hosting.ovh.net                                 │  │
│   Performance 1              │  │ Port FTP       21 (ou 22 pour SFTP)                                           │  │
│   Actif (SELECTIONNE)        │  │ Port SSH       22                                                             │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ o boutique.example.com       │                                                                                     │
│   Pro                        │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   Actif                      │  │ Utilisateur        │ Acces       │ Chemin racine │ Etat   │ Actions         │   │
│                              │  ├────────────────────┼─────────────┼───────────────┼────────┼─────────────────┤   │
│ o blog.monsite.fr            │  │ monsite.ovh.net    │ FTP + SSH   │ /             │ Actif  │ [E] [K]         │   │
│   Perso                      │  │ deploy             │ FTP + SSH   │ /www/         │ Actif  │ [E] [K] [X]     │   │
│   Actif                      │  │ backup             │ FTP seul    │ /backup/      │ Actif  │ [E] [K] [X]     │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│ o dev.test.ovh               │                                                                                     │
│   Start                      │  Legende:                                                                           │
│   Maintenance                │  [E] = Modifier permissions - [K] = Changer mot de passe - [X] = Supprimer          │
│                              │                                                                                     │
│                              │  (i) Le compte principal ne peut pas etre supprime.                                 │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "server": "ftp.cluster042.hosting.ovh.net",
  "ftpPort": 21,
  "sshPort": 22,
  "users": [
    {"username": "monsite.ovh.net", "access": "FTP + SSH", "rootPath": "/", "status": "active", "isPrimary": true},
    {"username": "deploy", "access": "FTP + SSH", "rootPath": "/www/", "status": "active", "isPrimary": false},
    {"username": "backup", "access": "FTP seul", "rootPath": "/backup/", "status": "active", "isPrimary": false}
  ]
}

================================================================================
