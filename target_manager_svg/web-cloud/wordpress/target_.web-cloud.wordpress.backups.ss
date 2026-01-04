================================================================================
SCREENSHOT: target_.web-cloud.wordpress.backups.svg
================================================================================

NAV1: Web Cloud | NAV2: WordPress | NAV3: - (pas de NAV3) / Liste services (ALL 1er) | NAV4: Sauvegardes
MESSAGE: API non disponible

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
│ Filtre: [Tous v] 3 sites     │                                                 ===========                         │
├──────────────────────────────┤                                                 NAV4=Sauvegardes (ACTIF)            │
│ o Tous les services          │ ────────────────────────────────────────────────────────────────────────────────────┤
│   3 sites WordPress          │                                                                                     │
│                              │                                                                                     │
│ * mon-blog.fr                │                                                                                     │
│   WordPress 6.4.2            │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Pro (SELECTIONNE)          │  │                                                                               │  │
│   [v] Actif                  │  │                              [BACKUP]                                         │  │
│                              │  │                                                                               │  │
│ o boutique-mode.com          │  │               Sauvegardes non disponibles                                     │  │
│   WordPress 6.4.1            │  │                                                                               │  │
│   Business                   │  │   La gestion des sauvegardes n'est pas encore                                │  │
│   [v] Actif                  │  │   disponible dans la nouvelle interface.                                     │  │
│                              │  │                                                                               │  │
│ o test-staging.ovh           │  │                      [Ouvrir le Manager OVH ->]                               │  │
│   WordPress 6.3.2            │  │                                                                               │  │
│   Start                      │  └───────────────────────────────────────────────────────────────────────────────┘  │
│   [o] MAJ en cours           │                                                                                     │
│                              │                                                                                     │
│                              │                                                                                     │
│                              │                                                                                     │
│ [+ Nouveau site]             │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "unavailable": {
    "feature": "backups",
    "message": "Sauvegardes non disponibles",
    "description": "La gestion des sauvegardes n'est pas encore disponible dans la nouvelle interface.",
    "fallbackUrl": "https://www.ovh.com/manager/web/"
  }
}

================================================================================
