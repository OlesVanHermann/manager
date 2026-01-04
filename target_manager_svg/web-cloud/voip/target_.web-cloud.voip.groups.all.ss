================================================================================
SCREENSHOT: target_.web-cloud.voip.groups.all.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Groups | NAV4: General (VUE AGREGEE)
NOTE: "Tous les groupes" selectionne dans le sidecar

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ Tous les groupes VoIP                                                               │
│ [Trunk (0)]                  │ Vue d'ensemble de vos 2 groupes                                                     │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │ [General] [Factures]                                                                │
├──────────────────────────────┤  =======                                                                            │
│ [Rechercher...]              │  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│ ├──────────┼───────────────┤ │  │    2 groupes   │  │    8 lignes    │  │   12 numeros   │  │     1 fax      │     │
│ │Numeros(8)│ Services      │ │  │   [BLEU]       │  │   [VERT]       │  │   [ORANGE]     │  │   [VIOLET]     │     │
│ └──────────┴───────────────┘ │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘     │
│ NAV3b=Groups (ACTIF)         │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ 2 groupes                    │  │ Vos groupes VoIP                                       [+ Nouveau groupe]  │     │
├──────────────────────────────┤  ├────────────────────────────────────────────────────────────────────────────┤     │
│ * Tous les groupes       ████│  │                                                                            │     │
│   (VUE AGREGEE)              │  │  Compte            │ Description     │ Lignes│ Nums│ Fax│ Credit │ Statut │     │
│   (SELECTIONNE)              │  │  ════════════════════════════════════════════════════════════════════════  │     │
├──────────────────────────────┤  │  OVH-TELECOM-12345 │ Bureau Paris    │   5   │  8  │  1 │ 50EUR  │[v]Actif│     │
│ o Bureau Paris               │  │  OVH-TELECOM-67890 │ Agence Lyon     │   3   │  4  │  0 │ 25EUR  │[v]Actif│     │
│   OVH-TELECOM-12345          │  │                                                                            │     │
│   5 lignes · 8 numeros · 1fax│  └────────────────────────────────────────────────────────────────────────────┘     │
│                       [Actif]│                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ o Agence Lyon                │  │ Activite recente                                                           │     │
│   OVH-TELECOM-67890          │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   3 lignes · 4 numeros · 0fax│  │  - 03/01: Nouvelle ligne commandee (Bureau Paris)                         │     │
│                       [Actif]│  │  - 02/01: Portabilite terminee (Agence Lyon)                               │     │
│                              │  │  - 01/01: Credit recharge 50EUR (Bureau Paris)                             │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": true,
  "stats": {
    "groups": 2,
    "lines": 8,
    "numbers": 12,
    "fax": 1
  },
  "groups": [
    {"account": "OVH-TELECOM-12345", "description": "Bureau Paris", "lines": 5, "numbers": 8, "fax": 1, "credit": 50, "status": "active"},
    {"account": "OVH-TELECOM-67890", "description": "Agence Lyon", "lines": 3, "numbers": 4, "fax": 0, "credit": 25, "status": "active"}
  ],
  "recentActivity": [
    {"date": "03/01", "action": "Nouvelle ligne commandee", "group": "Bureau Paris"},
    {"date": "02/01", "action": "Portabilite terminee", "group": "Agence Lyon"},
    {"date": "01/01", "action": "Credit recharge 50EUR", "group": "Bureau Paris"}
  ]
}

================================================================================
