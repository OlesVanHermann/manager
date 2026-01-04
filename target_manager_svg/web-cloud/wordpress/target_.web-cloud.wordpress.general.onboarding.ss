================================================================================
SCREENSHOT: target_.web-cloud.wordpress.general.onboarding.svg
================================================================================

NAV1: Web Cloud | NAV2: WordPress | NAV3: - (pas de NAV3) | NAV4: General
PAGE VIDE: Onboarding (aucun service)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                              =========                                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ (pas de NAV3 pour WordPress) │ WordPress Manage                                                                    │
│                              │ Hebergement WordPress optimise avec mises a jour automatiques                       │
│ [Rechercher...]              ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Domaines] [Performance] [Extensions] [Sauvegardes] [Taches]              │
│ Aucun site                   │  =======                                                                            │
│                              │  NAV4=General (ACTIF)                                                               │
│                              │ ────────────────────────────────────────────────────────────────────────────────────┤
│                              │                                                                                     │
│                              │                                                                                     │
│                              │                              [ICON WP]                                              │
│                              │                                                                                     │
│                              │                        WordPress Manage                                             │
│                              │                                                                                     │
│                              │            Creez et gerez vos sites WordPress avec un hebergement                   │
│                              │            optimise, des mises a jour automatiques et des                           │
│                              │            sauvegardes quotidiennes.                                                │
│                              │                                                                                     │
│                              │       [Perf]      [Secu]       [MAJ auto]     [Backups]                             │
│                              │       optimisee   renforcee                   quotidiens                            │
│                              │                                                                                     │
│                              │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐                     │
│                              │  │ Start            │ │ Pro   [Populaire]│ │ Business         │                     │
│                              │  │ 4,99 EUR/mois    │ │ 9,99 EUR/mois    │ │ 24,99 EUR/mois   │                     │
│                              │  │ 1 site WP        │ │ 5 sites WP       │ │ 10 sites WP      │                     │
│                              │  │ 20 Go            │ │ 100 Go           │ │ 500 Go           │                     │
│                              │  │ SSL inclus       │ │ CDN inclus       │ │ CDN + HTTP/3     │                     │
│                              │  └──────────────────┘ └──────────────────┘ └──────────────────┘                     │
│                              │                                                                                     │
│                              │                   [+ Creer un site] [Importer un site]                              │
│                              │                                                                                     │
│ [+ Nouveau site]             │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "onboarding": {
    "title": "WordPress Manage",
    "subtitle": "Creez et gerez vos sites WordPress avec un hebergement optimise, des mises a jour automatiques et des sauvegardes quotidiennes.",
    "features": ["Performance optimisee", "Securite renforcee", "MAJ auto", "Backups quotidiens"],
    "offers": [
      {"name": "Start", "price": "4,99 EUR/mois", "sites": 1, "storage": "20 Go", "features": ["SSL inclus"]},
      {"name": "Pro", "price": "9,99 EUR/mois", "sites": 5, "storage": "100 Go", "features": ["CDN inclus"], "popular": true},
      {"name": "Business", "price": "24,99 EUR/mois", "sites": 10, "storage": "500 Go", "features": ["CDN + HTTP/3"]}
    ]
  }
}

================================================================================
