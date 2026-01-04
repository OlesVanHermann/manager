================================================================================
SCREENSHOT: target_.web-cloud.wordpress.all.general.svg
================================================================================

NAV1: Web Cloud | NAV2: WordPress | NAV3: - (pas de NAV3) / Liste services (ALL 1er) | NAV4: General (VUE AGREGEE)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                              =========                                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ (pas de NAV3 pour WordPress) │ Tous les sites WordPress                                                            │
│                              │ Vue d'ensemble de vos 3 sites                                                       │
│ [Rechercher...]              ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Taches]                                                                  │
│ Filtre: [Tous v] 3 sites     │  =======                                                                            │
├──────────────────────────────┤  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
│ * Tous les services          │ ────────────────────────────────────────────────────────────────────────────────────┤
│   3 sites WordPress          │                                                                                     │
│   (SELECTIONNE)              │ Statistiques globales                                                               │
│                              │                                                                                     │
│ o mon-blog.fr                │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│   WordPress 6.4.2            │  │ Sites actifs   │  │ Mises a jour   │  │ Stockage total │  │ Taches         │     │
│   Pro                        │  │      3/3       │  │      1         │  │   2.4 Go       │  │    2 en cours  │     │
│   [v] Actif                  │  │   [VERT]       │  │   [ORANGE]     │  │   [BLEU]       │  │   [JAUNE]      │     │
│                              │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘     │
│ o boutique-mode.com          │                                                                                     │
│   WordPress 6.4.1            │ Vos sites WordPress                                              [+ Nouveau site]   │
│   Business                   │                                                                                     │
│   [v] Actif                  │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Site                   │ Version  │ Offre    │ Stockage │ Statut           │   │
│ o test-staging.ovh           │  ├────────────────────────┼──────────┼──────────┼──────────┼──────────────────┤   │
│   WordPress 6.3.2            │  │ mon-blog.fr            │ 6.4.2    │ Pro      │ 1.2 Go   │ [v] Actif        │   │
│   Start                      │  │ boutique-mode.com      │ 6.4.1    │ Business │ 0.8 Go   │ [v] Actif        │   │
│   [o] MAJ en cours           │  │ test-staging.ovh       │ 6.3.2    │ Start    │ 0.4 Go   │ [o] MAJ en cours │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │ Derniere activite                                                                   │
│                              │  - 03/01 12:00 : Backup automatique en cours (mon-blog.fr)                          │
│                              │  - 03/01 11:55 : Installation plugin en cours (mon-blog.fr)                         │
│                              │  - 03/01 09:18 : Mise a jour WordPress 6.4.2 terminee (mon-blog.fr)                 │
│                              │                                                                                     │
│ [+ Nouveau site]             │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": true,
  "stats": {
    "activeSites": 3,
    "totalSites": 3,
    "pendingUpdates": 1,
    "totalStorage": "2.4 Go",
    "runningTasks": 2
  },
  "sites": [
    {
      "domain": "mon-blog.fr",
      "version": "6.4.2",
      "offer": "Pro",
      "storage": "1.2 Go",
      "status": "active"
    },
    {
      "domain": "boutique-mode.com",
      "version": "6.4.1",
      "offer": "Business",
      "storage": "0.8 Go",
      "status": "active"
    },
    {
      "domain": "test-staging.ovh",
      "version": "6.3.2",
      "offer": "Start",
      "storage": "0.4 Go",
      "status": "updating"
    }
  ],
  "recentActivity": [
    {"date": "03/01 12:00", "action": "Backup automatique en cours", "site": "mon-blog.fr"},
    {"date": "03/01 11:55", "action": "Installation plugin en cours", "site": "mon-blog.fr"},
    {"date": "03/01 09:18", "action": "Mise a jour WordPress 6.4.2 terminee", "site": "mon-blog.fr"}
  ]
}

================================================================================
