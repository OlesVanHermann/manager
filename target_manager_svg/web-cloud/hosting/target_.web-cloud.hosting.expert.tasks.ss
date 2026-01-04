================================================================================
SCREENSHOT: target_.web-cloud.hosting.expert.tasks.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Expert / Liste services (ALL 1er) | NAV4: Taches

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
│                              │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  ======                      │ ... [Cron] [Taches] [CloudDb]                                                       │
│  NAV3=Expert (ACTIF)         │            ======                                                                   │
├──────────────────────────────┤            NAV4=Taches (ACTIF)                                                      │
│ [Rechercher...]              │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Taches (1 en cours)                                           [Actualiser]          │
│ Filtre: [Tous v] 4 services  │ Filtres: [Toutes] [En cours] [Terminees] [Erreurs]                                  │
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   4 hebergements             │  │ Operation            │ Statut   │ Debut       │ Fin         │ Details       │   │
│                              │  ├──────────────────────┼──────────┼─────────────┼─────────────┼───────────────┤   │
│ * monsite.ovh.net            │  │ Regeneration SSL     │ En cours │ 03/01 14:30 │ -           │ Let's Encrypt │   │
│   Performance 1              │  │ Ajout domaine        │ Terminee │ 03/01 12:15 │ 03/01 12:16 │ api.monsite.. │   │
│   Actif (SELECTIONNE)        │  │ Modification FTP     │ Terminee │ 03/01 10:00 │ 03/01 10:01 │ deploy        │   │
│                              │  │ Creation BDD         │ Terminee │ 02/01 16:45 │ 02/01 16:46 │ wp_cache      │   │
│ o boutique.example.com       │  │ Mise a jour PHP      │ Terminee │ 02/01 14:00 │ 02/01 14:05 │ 8.1 -> 8.2    │   │
│   Pro                        │  │ Import SQL           │ Erreur   │ 02/01 11:30 │ 02/01 11:31 │ Timeout       │   │
│   Actif                      │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o blog.monsite.fr            │  6 taches sur 24                                        [<] [1] [2] [3] [4] [>]     │
│   Perso                      │                                                                                     │
│   Actif                      │                                                                                     │
│                              │                                                                                     │
│ o dev.test.ovh               │                                                                                     │
│   Start                      │                                                                                     │
│   Maintenance                │                                                                                     │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "tasks": [
    {"operation": "Regeneration SSL", "status": "in_progress", "start": "03/01 14:30", "end": null, "details": "Let's Encrypt"},
    {"operation": "Ajout domaine", "status": "done", "start": "03/01 12:15", "end": "03/01 12:16", "details": "api.monsite.ovh.net"},
    {"operation": "Modification FTP", "status": "done", "start": "03/01 10:00", "end": "03/01 10:01", "details": "deploy"},
    {"operation": "Creation BDD", "status": "done", "start": "02/01 16:45", "end": "02/01 16:46", "details": "wp_cache"},
    {"operation": "Mise a jour PHP", "status": "done", "start": "02/01 14:00", "end": "02/01 14:05", "details": "8.1 -> 8.2"},
    {"operation": "Import SQL", "status": "error", "start": "02/01 11:30", "end": "02/01 11:31", "details": "Timeout"}
  ],
  "pagination": {
    "current": 1,
    "total": 4,
    "itemsShown": 6,
    "itemsTotal": 24
  }
}

================================================================================
