================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.anycast.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: Anycast

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
│          ===                 │ [.com] [Actif] [DNSSEC ok]                                                          │
│          NAV3=DNS (ACTIF)    ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ ...[CAA][DynHost][Anycast]                                                          │
│ [Rechercher...]              │                  =======                                                            │
├──────────────────────────────┤                  NAV4=Anycast (ACTIF)                                               │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   5 domaines                 │  │ DNS Anycast                                               ( ) Non souscrit    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * example.com          [.com]│  │                                                                               │  │
│   Actif (SELECTIONNE)        │  │                                                                               │  │
│                              │  │                             [GLOBE]                                           │  │
│ o mon-site.fr          [.fr] │  │                                                                               │  │
│   Actif                      │  │                    Optimisez la resolution DNS                                │  │
│                              │  │                                                                               │  │
│ o boutique.shop       [.shop]│  │      DNS Anycast repartit vos requetes DNS sur plusieurs                      │  │
│   Expire bientot             │  │      serveurs a travers le monde pour une resolution                          │  │
│                              │  │      plus rapide et une meilleure disponibilite.                              │  │
│ o api.example.com            │  │                                                                               │  │
│   Zone seule                 │  │      [v] Latence reduite                                                      │  │
│                              │  │      [v] Haute disponibilite                                                  │  │
│ o legacy.org         [.org]  │  │      [v] Protection DDoS                                                      │  │
│   Expire                     │  │                                                                               │  │
│                              │  │      Prix: 2,99 EUR HT/mois                                                   │  │
│                              │  │                                                                               │  │
│                              │  │                        [Souscrire DNS Anycast]                                │  │
│                              │  │                                                                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "anycastEnabled": false,
  "price": {
    "monthly": 2.99,
    "currency": "EUR"
  },
  "benefits": ["Latence reduite", "Haute disponibilite", "Protection DDoS"]
}

================================================================================
