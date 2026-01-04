================================================================================
SCREENSHOT: target_.web-cloud.emails.packs.packs.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: Packs / Liste services (ALL 1er) | NAV4: Mes packs

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │ Exchange Business 10                                                                │
│          =====               │ 8/10 licences utilisees - Multi-domaines                        [Exchange]          │
│  NAV3=Packs (ACTIF)          ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Mes packs] [A la carte] [Historique]                                               │
│ [Rechercher un pack...]      │  =========                                                                          │
├──────────────────────────────┤  NAV4=Mes packs (ACTIF)                                                             │
│ Filtre: [Tous v] 3 packs     │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   3 packs                    │  │ Exchange Business 10                                          [Exchange]     │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * Exchange Business 10       │  │                                                                               │  │
│   8/10 licences (SELECTIONNE)│  │ Type              Exchange                                                    │  │
│   [Exchange]                 │  │ Licences          8 / 10 utilisees                                            │  │
│                              │  │ Scope             Multi-domaines                                              │  │
│ o Email Pro 5                │  │ Prix              49,99 EUR HT/mois                                           │  │
│   5/5 licences               │  │ Renouvellement    15/02/2026                                                  │  │
│   [Email Pro]                │  │                                                                               │  │
│                              │  │ ████████░░ 80% utilise                                                        │  │
│ o Zimbra Standard            │  │                                                                               │  │
│   12/20 licences             │  │                     [Upgrade pack] [Gerer] [X Resilier]                       │  │
│   [Zimbra]                   │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Comptes associes (8)                                                          │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │ Domaine: example.com                                                          │  │
│                              │  │   * ceo@example.com                                                           │  │
│                              │  │   * admin@example.com                                                         │  │
│                              │  │   * finance@example.com                                                       │  │
│                              │  │                                                                               │  │
│                              │  │ Domaine: mon-entreprise.fr                                                    │  │
│                              │  │   * direction@mon-entreprise.fr                                               │  │
│                              │  │   * rh@mon-entreprise.fr                                                      │  │
│                              │  │   * compta@mon-entreprise.fr                                                  │  │
│                              │  │   * commercial@mon-entreprise.fr                                              │  │
│                              │  │   * support@mon-entreprise.fr                                                 │  │
│                              │  │                                                                               │  │
│ [+ Commander un pack]        │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "pack": {
    "name": "Exchange Business 10",
    "type": "exchange",
    "licenses": {"used": 8, "total": 10},
    "scope": "multi-domain",
    "price": "49,99 EUR HT/mois",
    "renewal": "2026-02-15"
  },
  "accounts": {
    "example.com": ["ceo@example.com", "admin@example.com", "finance@example.com"],
    "mon-entreprise.fr": ["direction@mon-entreprise.fr", "rh@mon-entreprise.fr", "compta@mon-entreprise.fr", "commercial@mon-entreprise.fr", "support@mon-entreprise.fr"]
  }
}

================================================================================
