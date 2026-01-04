================================================================================
SCREENSHOT: target_.web-cloud.domains.expert.tasks.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: Expert / Liste services (ALL 1er) | NAV4: Taches

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines et DNS] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                     │
│            =================                                                                                       │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][DNS][Expert]       │ example.com                                                                         │
│              ======          │ [.com] [Actif] [DNSSEC ok]                                                          │
│              NAV3=Expert     ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [GLUE] [Taches]                                                                     │
│ [Rechercher...]              │        ======                                                                       │
├──────────────────────────────┤        NAV4=Taches (ACTIF)                                                          │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  Taches                                         [2 en cours]      [Actualiser]     │
│   5 domaines                 │                                                                                     │
│                              │  [Toutes (8)] [En cours (2)] [Terminees (5)] [Erreurs (1)]                          │
│ * example.com          [.com]│                                                                                     │
│   Actif (SELECTIONNE)        │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Operation          │ Domaine      │ Statut      │ Debut       │ Fin         │   │
│ o mon-site.fr          [.fr] │  ├────────────────────┼──────────────┼─────────────┼─────────────┼─────────────┤   │
│   Actif                      │  │ Modification DNS   │ example.com  │ [~] En cours│ 03/01 14:30 │ -           │   │
│                              │  │ Activation DNSSEC  │ example.com  │ [~] En cours│ 03/01 14:28 │ -           │   │
│ o boutique.shop       [.shop]│  │ Ajout enreg. MX    │ mon-site.fr  │ [v] Termine │ 03/01 12:15 │ 03/01 12:16 │   │
│   Expire bientot             │  │ Modification SPF   │ example.com  │ [v] Termine │ 03/01 10:00 │ 03/01 10:02 │   │
│                              │  │ Import zone        │ legacy.org   │ [x] Erreur  │ 02/01 18:45 │ 02/01 18:46 │   │
│ o api.example.com            │  │ Renouvellement     │ boutique.shop│ [v] Termine │ 02/01 00:00 │ 02/01 00:05 │   │
│   Zone seule                 │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o legacy.org         [.org]  │  6 taches sur 8                                        [<] [1] [2] [>]              │
│   Expire                     │                                                                                     │
│                              │                                                                                     │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "tasks": [
    {"operation": "Modification DNS", "domain": "example.com", "status": "doing", "startDate": "2026-01-03T14:30:00"},
    {"operation": "Activation DNSSEC", "domain": "example.com", "status": "doing", "startDate": "2026-01-03T14:28:00"},
    {"operation": "Ajout enreg. MX", "domain": "mon-site.fr", "status": "done", "startDate": "2026-01-03T12:15:00", "endDate": "2026-01-03T12:16:00"},
    {"operation": "Modification SPF", "domain": "example.com", "status": "done", "startDate": "2026-01-03T10:00:00", "endDate": "2026-01-03T10:02:00"},
    {"operation": "Import zone", "domain": "legacy.org", "status": "error", "startDate": "2026-01-02T18:45:00", "endDate": "2026-01-02T18:46:00"},
    {"operation": "Renouvellement", "domain": "boutique.shop", "status": "done", "startDate": "2026-01-02T00:00:00", "endDate": "2026-01-02T00:05:00"}
  ],
  "total": 8,
  "inProgress": 2,
  "completed": 5,
  "errors": 1
}

================================================================================
