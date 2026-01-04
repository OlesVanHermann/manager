================================================================================
SCREENSHOT: target_.web-cloud.hosting.general.general.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: General / Liste services (ALL 1er) | NAV4: General

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                       =============                                                                                │
│                       NAV2=Hebergements (ACTIF)                                                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Sites][Offre]      │ monsite.ovh.net                                                                     │
│  ========                    │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=General (ACTIF)        │ [General] [Statistiques] [Logs] [Modules] [SEO]                                     │
├──────────────────────────────┤  ========                                                                           │
│ [Rechercher...]              │  NAV4=General (ACTIF)                                                               │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │                                                                                     │
├──────────────────────────────┤  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│ o Tous les services          │  │ INFORMATIONS                    │  │ CONFIGURATION                   │           │
│   4 hebergements             │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│                              │  │ Hebergement  monsite.ovh.net    │  │ PHP             8.2             │           │
│ * monsite.ovh.net            │  │ Offre        Performance 1      │  │ Moteur          php-fpm         │           │
│   Performance 1              │  │ Cluster      cluster042         │  │ SSL             Let's Encrypt   │           │
│   Actif (SELECTIONNE)        │  │ Datacenter   gra3 (Gravelines)  │  │ CDN             Actif           │           │
│                              │  │ Creation     15/06/2023         │  │ SSH             Active (SFTP)   │           │
│ o boutique.example.com       │  └─────────────────────────────────┘  └─────────────────────────────────┘           │
│   Pro                        │                                                                                     │
│   Actif                      │  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│                              │  │ STOCKAGE                        │  │ ACTIONS RAPIDES                 │           │
│ o blog.monsite.fr            │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│   Perso                      │  │ Espace disque                   │  │ [Acceder via FTP]               │           │
│   Actif                      │  │ ████████░░░░░ 12.4/100 Go (12%) │  │ [phpMyAdmin]                    │           │
│                              │  │                                 │  │ [Statistiques Urchin]           │           │
│ o dev.test.ovh               │  │ Bases de donnees    3 / 10      │  │ [Modifier .htaccess]            │           │
│   Start                      │  │ Comptes FTP         2 / 10      │  │                                 │           │
│   Maintenance                │  │ Emails inclus       100 / 100   │  │                                 │           │
│                              │  │                                 │  │                                 │           │
│                              │  │ [Voir les statistiques >]       │  │                                 │           │
│                              │  └─────────────────────────────────┘  └─────────────────────────────────┘           │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "serviceName": "monsite.ovh.net",
  "offer": "Performance 1",
  "cluster": "cluster042",
  "datacenter": "gra3",
  "creationDate": "2023-06-15",
  "phpVersion": "8.2",
  "sslEnabled": true,
  "cdnEnabled": true,
  "quotaUsed": 12.4,
  "quotaTotal": 100,
  "databases": {"used": 3, "total": 10},
  "ftpAccounts": {"used": 2, "total": 10},
  "emails": {"used": 100, "total": 100}
}

================================================================================
