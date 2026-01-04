================================================================================
SCREENSHOT: target_.web-cloud.hosting.all.general.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: General / Liste services (ALL 1er) | NAV4: General
VUE AGREGEE: Tous les services SELECTIONNE

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                       =============                                                                                │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Sites][Offre]      │ Hebergements Web                                                                    │
│  =======                     │ Vue d'ensemble de tous vos hebergements                                             │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=General (ACTIF)        │ [General] [Statistiques] [Taches]                                                   │
├──────────────────────────────┤  =======                                                                            │
│ [Rechercher...]              │  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │                                                                                     │
├──────────────────────────────┤  ┌───────────────────────────┐  ┌───────────────────────────┐                       │
│ * Tous les services     ████ │  │ RESUME                    │  │ STOCKAGE GLOBAL           │                       │
│   4 hebergements             │  ├───────────────────────────┤  ├───────────────────────────┤                       │
│   (SELECTIONNE)              │  │ Hebergements    4         │  │ Utilise       156 Go      │                       │
│                              │  │ Actifs          3         │  │ Total         550 Go      │                       │
│ o monsite.ovh.net            │  │ Maintenance     1         │  │ ██████░░░░░░░░░░░ 28%     │                       │
│   Performance 1              │  │ Domaines        12        │  │                           │                       │
│   [v] Actif                  │  │ BDD             15        │  │ [Details par offre]       │                       │
│                              │  └───────────────────────────┘  └───────────────────────────┘                       │
│ o boutique.example.com       │                                                                                     │
│   Pro                        │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   [v] Actif                  │  │ TOUS LES HEBERGEMENTS                                  [Exporter CSV]        │   │
│                              │  ├──────────────────────────────────────────────────────────────────────────────┤   │
│ o blog.monsite.fr            │  │ Hebergement         │ Offre      │ Espace   │ BDD  │ Etat      │ ->         │   │
│   Perso                      │  ├─────────────────────┼────────────┼──────────┼──────┼───────────┼────────────┤   │
│   [v] Actif                  │  │ monsite.ovh.net     │ Perf 1     │ 12/100Go │ 3/10 │ [v] Actif │ [->]       │   │
│                              │  │ boutique.example.com│ Pro        │ 45/250Go │ 5/10 │ [v] Actif │ [->]       │   │
│ o dev.test.ovh               │  │ blog.monsite.fr     │ Perso      │ 8/100Go  │ 2/5  │ [v] Actif │ [->]       │   │
│   Start                      │  │ dev.test.ovh        │ Start      │ 1/10Go   │ 0/1  │ [!] Maint.│ [->]       │   │
│   [!] Maintenance            │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ [!] ALERTES (1)                                                              │   │
│                              │  ├──────────────────────────────────────────────────────────────────────────────┤   │
│                              │  │ [!] dev.test.ovh en maintenance planifiee jusqu'au 05/01       [Details]    │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ [+ Commander hebergement]    │ Actions: [+ Commander] [Rapport complet]                                            │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": {
    "summary": {
      "totalHostings": 4,
      "activeHostings": 3,
      "maintenanceHostings": 1,
      "totalDomains": 12,
      "totalDatabases": 15
    },
    "storage": {
      "used": "156 Go",
      "total": "550 Go",
      "percentage": 28
    },
    "hostings": [
      {"name": "monsite.ovh.net", "offer": "Perf 1", "space": "12/100Go", "bdd": "3/10", "status": "active"},
      {"name": "boutique.example.com", "offer": "Pro", "space": "45/250Go", "bdd": "5/10", "status": "active"},
      {"name": "blog.monsite.fr", "offer": "Perso", "space": "8/100Go", "bdd": "2/5", "status": "active"},
      {"name": "dev.test.ovh", "offer": "Start", "space": "1/10Go", "bdd": "0/1", "status": "maintenance"}
    ],
    "alerts": [
      {"type": "maintenance", "service": "dev.test.ovh", "message": "maintenance planifiee jusqu'au 05/01"}
    ]
  }
}

================================================================================
