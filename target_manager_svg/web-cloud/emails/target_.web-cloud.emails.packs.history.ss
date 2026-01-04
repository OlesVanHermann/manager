================================================================================
SCREENSHOT: target_.web-cloud.emails.packs.history.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: Packs / Liste services (ALL 1er) | NAV4: Historique

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │ Historique des commandes                                                            │
│          =====               │                                                                                     │
│  NAV3=Packs (ACTIF)          ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Mes packs] [A la carte] [Historique]                                               │
│ [Rechercher un pack...]      │                          ==========                                                 │
├──────────────────────────────┤                          NAV4=Historique (ACTIF)                                    │
│ Filtre: [Tous v] 3 packs     │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Periode: [12 derniers mois v]                                    [Exporter]         │
│ o Tous les services          │                                                                                     │
│   3 packs                    │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Date       │ Type            │ Description            │ Montant   │ Facture│   │
│ * Exchange Business 10       │  ├────────────┼─────────────────┼────────────────────────┼───────────┼────────┤   │
│   8/10 licences (SELECTIONNE)│  │ 15/12/2025 │ Renouvellement  │ Exchange Business 10   │ 479,04 EUR│ [PDF]  │   │
│   [Exchange]                 │  │ 15/12/2025 │ Renouvellement  │ Email Pro 5            │ 95,76 EUR │ [PDF]  │   │
│                              │  │ 01/11/2025 │ Ajout licence   │ Exchange a la carte    │ 4,99 EUR  │ [PDF]  │   │
│ o Email Pro 5                │  │ 15/10/2025 │ Upgrade         │ Email Pro 3 -> 5       │ 19,16 EUR │ [PDF]  │   │
│   5/5 licences               │  │ 01/09/2025 │ Nouvelle commande│ Zimbra Standard 20    │ 574,80 EUR│ [PDF]  │   │
│   [Email Pro]                │  │ 15/06/2025 │ Resiliation     │ MX Plan Basic          │ -24,00 EUR│ [PDF]  │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│ o Zimbra Standard            │                                                                                     │
│   12/20 licences             │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   [Zimbra]                   │  │ Resume 2025                                                                   │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │ Total facture:        1 249,75 EUR HT                                        │  │
│                              │  │ Economies packs:      - 312,44 EUR                                           │  │
│                              │  │ Prochaine echeance:   15/02/2026 (479,04 EUR)                                │  │
│                              │  │                                                                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ [+ Commander un pack]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "history": [
    {"date": "15/12/2025", "type": "renewal", "description": "Exchange Business 10", "amount": "479,04 EUR"},
    {"date": "15/12/2025", "type": "renewal", "description": "Email Pro 5", "amount": "95,76 EUR"},
    {"date": "01/11/2025", "type": "add_license", "description": "Exchange a la carte", "amount": "4,99 EUR"},
    {"date": "15/10/2025", "type": "upgrade", "description": "Email Pro 3 -> 5", "amount": "19,16 EUR"},
    {"date": "01/09/2025", "type": "new_order", "description": "Zimbra Standard 20", "amount": "574,80 EUR"},
    {"date": "15/06/2025", "type": "termination", "description": "MX Plan Basic", "amount": "-24,00 EUR"}
  ],
  "summary": {
    "year": 2025,
    "totalBilled": "1249,75 EUR",
    "packSavings": "-312,44 EUR",
    "nextDue": {"date": "2026-02-15", "amount": "479,04 EUR"}
  }
}

================================================================================
