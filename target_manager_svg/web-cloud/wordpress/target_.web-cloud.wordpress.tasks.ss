================================================================================
SCREENSHOT: target_.web-cloud.wordpress.tasks.svg
================================================================================

NAV1: Web Cloud | NAV2: WordPress | NAV3: - (pas de NAV3) / Liste services (ALL 1er) | NAV4: Taches

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                              =========                                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ (pas de NAV3 pour WordPress) │ mon-blog.fr                                                                         │
│                              │ WordPress 6.4.2 - Pro                                               [Actif]         │
│ [Rechercher...]              ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Domaines] [Performance] [Extensions] [Sauvegardes] [Taches]              │
│ Filtre: [Tous v] 3 sites     │                                                              ======                 │
├──────────────────────────────┤                                                              NAV4=Taches (ACTIF)    │
│ o Tous les services          │ ────────────────────────────────────────────────────────────────────────────────────┤
│   3 sites WordPress          │ Taches (2 en cours)                           [v Auto-refresh]  [Actualiser]       │
│                              │                                                                                     │
│ * mon-blog.fr                │ Filtres: [Toutes (5)] [En cours (2)] [Terminees (3)]                                │
│   WordPress 6.4.2            │                                                                                     │
│   Pro (SELECTIONNE)          │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   [v] Actif                  │  │ Operation                    │ Statut    │ Debut       │ Fin               │   │
│                              │  ├──────────────────────────────┼───────────┼─────────────┼───────────────────┤   │
│ o boutique-mode.com          │  │ Mise a jour WordPress 6.4.2  │ Terminee  │ 03/01 09:15 │ 03/01 09:18       │   │
│   WordPress 6.4.1            │  │ Vider le cache               │ Terminee  │ 02/01 14:30 │ 02/01 14:30       │   │
│   Business                   │  │ Backup automatique           │ En cours  │ 03/01 12:00 │ -                 │   │
│   [v] Actif                  │  │ Installation plugin          │ En cours  │ 03/01 11:55 │ -                 │   │
│                              │  │ Renouvellement SSL           │ Terminee  │ 01/01 00:00 │ 01/01 00:05       │   │
│ o test-staging.ovh           │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   WordPress 6.3.2            │                                                                                     │
│   Start                      │  (i) Actualisation automatique toutes les 30 secondes                              │
│   [o] MAJ en cours           │                                                                                     │
│                              │                                                                                     │
│ [+ Nouveau site]             │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "tasks": [
    {"operation": "Mise a jour WordPress 6.4.2", "status": "done", "start": "03/01 09:15", "end": "03/01 09:18"},
    {"operation": "Vider le cache", "status": "done", "start": "02/01 14:30", "end": "02/01 14:30"},
    {"operation": "Backup automatique", "status": "in_progress", "start": "03/01 12:00", "end": null},
    {"operation": "Installation plugin", "status": "in_progress", "start": "03/01 11:55", "end": null},
    {"operation": "Renouvellement SSL", "status": "done", "start": "01/01 00:00", "end": "01/01 00:05"}
  ],
  "filters": {
    "all": 5,
    "inProgress": 2,
    "done": 3
  },
  "autoRefresh": true,
  "refreshInterval": 30
}

================================================================================
