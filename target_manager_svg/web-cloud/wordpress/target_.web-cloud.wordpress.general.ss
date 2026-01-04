================================================================================
SCREENSHOT: target_.web-cloud.wordpress.general.svg
================================================================================

NAV1: Web Cloud | NAV2: WordPress | NAV3: - (pas de NAV3) / Liste services (ALL 1er) | NAV4: General

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
│ Filtre: [Tous v] 3 sites     │  =======                                                                            │
├──────────────────────────────┤  NAV4=General (ACTIF)                                                               │
│ o Tous les services          │ ────────────────────────────────────────────────────────────────────────────────────┤
│   3 sites WordPress          │                                                                                     │
│                              │ [Acceder a l'admin WordPress] [Visiter le site] [Vider le cache] [Reinit. MDP]     │
│ * mon-blog.fr                │                                                                                     │
│   WordPress 6.4.2            │  ┌───────────────────────────┐  ┌───────────────────────────┐                       │
│   Pro (SELECTIONNE)          │  │ WORDPRESS                 │  │ TECHNIQUE                 │                       │
│   [v] Actif                  │  ├───────────────────────────┤  ├───────────────────────────┤                       │
│                              │  │                           │  │                           │                       │
│ o boutique-mode.com          │  │ Etat        [v] Actif     │  │ Offre          Pro        │                       │
│   WordPress 6.4.1            │  │ Version     6.4.2         │  │ Datacenter     rbx1       │                       │
│   Business                   │  │ PHP         8.2           │  │ SSL            [v] LE     │                       │
│   [v] Actif                  │  │ URL         mon-blog.fr   │  │ CDN            [v] Actif  │                       │
│                              │  │ Admin       admin         │  │ Auto-update    [v] Active │                       │
│ o test-staging.ovh           │  │                           │  │ Creation       15/01/2024 │                       │
│   WordPress 6.3.2            │  │                           │  │ Expiration     15/01/2025 │                       │
│   Start                      │  └───────────────────────────┘  └───────────────────────────┘                       │
│   [o] MAJ en cours           │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ [!] ZONE DANGER                                                               │  │
│                              │  │ La suppression est definitive et irreversible.                               │  │
│                              │  │                                                            [Supprimer]        │  │
│ [+ Nouveau site]             │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "site": {
    "serviceName": "wp-abc123xyz",
    "displayName": "mon-blog.fr",
    "url": "https://mon-blog.fr",
    "adminUrl": "https://mon-blog.fr/wp-admin",
    "state": "active",
    "wordpressVersion": "6.4.2",
    "phpVersion": "8.2",
    "offer": "Pro",
    "datacenter": "rbx1",
    "sslEnabled": true,
    "cdnEnabled": true,
    "autoUpdate": true,
    "creationDate": "2024-01-15",
    "expirationDate": "2025-01-15"
  }
}

================================================================================
