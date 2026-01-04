================================================================================
SCREENSHOT: target_.web-cloud.emails.packs.packs.modal-order.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: Packs / Liste services (ALL 1er) | NAV4: Mes packs
MODAL: Commander un pack email

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │                                                                                     │
│          =====               │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  NAV3=Packs (ACTIF)          │  │ Commander un pack email                                                  [X] │  │
├──────────────────────────────┤  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ [Rechercher un pack...]      │  │                                                                               │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  Choisissez votre offre:                                                     │  │
│ Filtre: [Tous v] 3 packs     │  │                                                                               │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐              │  │
│ o Tous les services          │  │  │ Exchange         │ │ Email Pro        │ │ Zimbra           │              │  │
│   3 packs                    │  │  │                  │ │                  │ │                  │              │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  │ 4,99 EUR/mois    │ │ 1,99 EUR/mois    │ │ 2,99 EUR/mois    │              │  │
│ * Exchange Business 10       │  │  │                  │ │                  │ │                  │              │  │
│   8/10 licences (SELECTIONNE)│  │  │ * 50 Go stockage │ │ * 10 Go stockage │ │ * 10 Go stockage │              │  │
│   [Exchange]                 │  │  │ * Calendrier     │ │ * Alias illimites│ │ * Webmail avance │              │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  │ * MFA            │ │ * Delegation     │ │ * Collaboration  │              │  │
│ o Email Pro 5                │  │  │ * Ressources     │ │ * Archivage      │ │ * Carnet partage │              │  │
│   5/5 licences               │  │  │                  │ │                  │ │                  │              │  │
│   [Email Pro]                │  │  │ [* Selectionne]  │ │ [o Selectionner] │ │ [o Selectionner] │              │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘              │  │
│ o Zimbra Standard            │  │                                                                               │  │
│   12/20 licences             │  │  Nombre de licences: [10 v]  (5, 10, 25, 50, 100)                             │  │
│   [Zimbra]                   │  │                                                                               │  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │  Scope:                                                                       │  │
│                              │  │  * Multi-domaines (licences utilisables sur tous vos domaines)               │  │
│                              │  │  o Mono-domaine (licences reservees a un seul domaine)                       │  │
│                              │  │                                                                               │  │
│                              │  │  Engagement:                                                                  │  │
│                              │  │  o Mensuel (sans engagement)                                                  │  │
│                              │  │  * Annuel (-20%) <- recommande                                                │  │
│                              │  │                                                                               │  │
│                              │  │  ┌─────────────────────────────────────────────────────────────────────────┐  │  │
│                              │  │  │ Recapitulatif                                                          │  │  │
│                              │  │  ├─────────────────────────────────────────────────────────────────────────┤  │  │
│                              │  │  │ Exchange 10 licences (annuel)                                          │  │  │
│                              │  │  │ 10 x 4,99 EUR x 12 mois x 0.8 = 479,04 EUR HT/an                       │  │  │
│                              │  │  │                                                                         │  │  │
│                              │  │  │ Soit 39,92 EUR HT/mois                                                  │  │  │
│                              │  │  └─────────────────────────────────────────────────────────────────────────┘  │  │
│                              │  │                                                                               │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ [+ Commander un pack]        │  │                                            [Annuler]  [Commander]            │  │
└──────────────────────────────┴──└───────────────────────────────────────────────────────────────────────────────┘──┘
```

Note: Zone grisee = overlay modal

================================================================================
DONNEES MOCK
================================================================================

{
  "modal": {
    "title": "Commander un pack email",
    "offers": [
      {"name": "Exchange", "price": "4,99 EUR/mois", "features": ["50 Go stockage", "Calendrier", "MFA", "Ressources"], "selected": true},
      {"name": "Email Pro", "price": "1,99 EUR/mois", "features": ["10 Go stockage", "Alias illimites", "Delegation", "Archivage"]},
      {"name": "Zimbra", "price": "2,99 EUR/mois", "features": ["10 Go stockage", "Webmail avance", "Collaboration", "Carnet partage"]}
    ],
    "config": {
      "licenses": 10,
      "scope": "multi-domain",
      "commitment": "annual"
    },
    "summary": {
      "description": "Exchange 10 licences (annuel)",
      "calculation": "10 x 4,99 EUR x 12 mois x 0.8 = 479,04 EUR HT/an",
      "monthly": "39,92 EUR HT/mois"
    }
  }
}

================================================================================
