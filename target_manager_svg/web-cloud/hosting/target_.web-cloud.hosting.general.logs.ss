================================================================================
SCREENSHOT: target_.web-cloud.hosting.general.logs.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: General / Liste services (ALL 1er) | NAV4: Logs
NAV5: Logs OVH (actif) | User Logs

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
│  ========                    │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=General (ACTIF)        │ [General] [Statistiques] [Logs] [Modules] [SEO]                                     │
├──────────────────────────────┤                          ====                                                       │
│ [Rechercher...]              │                          NAV4=Logs (ACTIF)                                          │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [Logs OVH] | User Logs                                                              │
├──────────────────────────────┤  =========                                                                          │
│ o Tous les services          │  NAV5=Logs OVH (ACTIF)                                                              │
│   4 hebergements             ├─────────────────────────────────────────────────────────────────────────────────────┤
│                              │                                                                                     │
│ * monsite.ovh.net            │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Performance 1              │  │ Logs de votre hebergement                                                     │  │
│   Actif (SELECTIONNE)        │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│ o boutique.example.com       │  │ Les logs sont conserves pendant 3 mois et mis a jour quotidiennement.        │  │
│   Pro                        │  │ Ils incluent les acces web et erreurs.                                        │  │
│   Actif                      │  │                                                                               │  │
│                              │  │ URL d'acces: https://logs.cluster042.hosting.ovh.net                          │  │
│ o blog.monsite.fr            │  │ Identifiant: monsite.ovh.net                                                   │  │
│   Perso                      │  │ Mot de passe: [Definir un mot de passe]                                       │  │
│   Actif                      │  │                                                                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ o dev.test.ovh               │                                                                                     │
│   Start                      │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Maintenance                │  │ Fichiers logs disponibles                                     [Rafraichir]    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │ Type          Periode        Taille    Action                                 │  │
│                              │  │ ──────────────────────────────────────────────────────────────────────────── │  │
│                              │  │ access        Janvier 2026   12.4 Mo   [Telecharger]                          │  │
│                              │  │ error         Janvier 2026   1.2 Mo    [Telecharger]                          │  │
│                              │  │ access        Decembre 2025  45.8 Mo   [Telecharger]                          │  │
│                              │  │ error         Decembre 2025  3.1 Mo    [Telecharger]                          │  │
│                              │  │ access        Novembre 2025  38.2 Mo   [Telecharger]                          │  │
│                              │  │ error         Novembre 2025  2.8 Mo    [Telecharger]                          │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "logsUrl": "https://logs.cluster042.hosting.ovh.net",
  "username": "monsite.ovh.net",
  "files": [
    {"type": "access", "period": "Janvier 2026", "size": "12.4 Mo"},
    {"type": "error", "period": "Janvier 2026", "size": "1.2 Mo"},
    {"type": "access", "period": "Decembre 2025", "size": "45.8 Mo"},
    {"type": "error", "period": "Decembre 2025", "size": "3.1 Mo"},
    {"type": "access", "period": "Novembre 2025", "size": "38.2 Mo"},
    {"type": "error", "period": "Novembre 2025", "size": "2.8 Mo"}
  ]
}

================================================================================
