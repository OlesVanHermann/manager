================================================================================
SCREENSHOT: target_.web-cloud.domains.general.alldom.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: General / Liste services (ALL 1er) | NAV4: Alldom

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
│  ========                    │ [.com] [Actif] [DNSSEC ok]                                                          │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Infos generales] [Contacts] [Alldom]                                               │
│ [Rechercher...]              │                               ======                                                │
├──────────────────────────────┤                               NAV4=Alldom (ACTIF)                                   │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  Packs AllDom                                                                       │
│   5 domaines                 │  Gerez vos packs multi-extensions                                                   │
│                              │                                                                                     │
│ * example.com          [.com]│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Actif (SELECTIONNE)        │  │ Pack FRENCH                                                        [Actif]    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ o mon-site.fr          [.fr] │  │ Domaines inclus:                                                              │  │
│   Actif                      │  │   * example.fr        Actif   exp. 15/12/2025                                 │  │
│                              │  │   * example.com       Actif   exp. 15/12/2025                                 │  │
│ o boutique.shop       [.shop]│  │   * example.eu        Actif   exp. 15/12/2025                                 │  │
│   Expire bientot             │  │   * example.be        Actif   exp. 15/12/2025                                 │  │
│                              │  │   * example.ch        Actif   exp. 15/12/2025                                 │  │
│ o api.example.com            │  │                                                                               │  │
│   Zone seule                 │  │ Renouvellement: 15/12/2025                           [> Gerer le pack]        │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ o legacy.org         [.org]  │                                                                                     │
│   Expire                     │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Pack INTERNATIONAL                                                 [Actif]    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │ Domaines inclus:                                                              │  │
│                              │  │   * mon-site.com      Actif   exp. 01/06/2025                                 │  │
│                              │  │   * mon-site.net      Actif   exp. 01/06/2025                                 │  │
│                              │  │   * mon-site.org      Actif   exp. 01/06/2025                                 │  │
│                              │  │                                                                               │  │
│                              │  │ Renouvellement: 01/06/2025                           [> Gerer le pack]        │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "packs": [
    {
      "name": "FRENCH",
      "status": "active",
      "renewalDate": "2025-12-15",
      "domains": [
        {"name": "example.fr", "status": "active", "expiration": "2025-12-15"},
        {"name": "example.com", "status": "active", "expiration": "2025-12-15"},
        {"name": "example.eu", "status": "active", "expiration": "2025-12-15"},
        {"name": "example.be", "status": "active", "expiration": "2025-12-15"},
        {"name": "example.ch", "status": "active", "expiration": "2025-12-15"}
      ]
    },
    {
      "name": "INTERNATIONAL",
      "status": "active",
      "renewalDate": "2025-06-01",
      "domains": [
        {"name": "mon-site.com", "status": "active", "expiration": "2025-06-01"},
        {"name": "mon-site.net", "status": "active", "expiration": "2025-06-01"},
        {"name": "mon-site.org", "status": "active", "expiration": "2025-06-01"}
      ]
    }
  ]
}

================================================================================
