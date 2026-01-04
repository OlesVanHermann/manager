================================================================================
SCREENSHOT: target_.web-cloud.voip.lines.all.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Lignes | NAV4: General (VUE AGREGEE)
NOTE: "Toutes les lignes" selectionne dans le sidecar

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ Toutes les lignes                                                                   │
│ [Trunk (0)]                  │ Vue d'ensemble de vos 8 lignes                                                      │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │ [General] [Statistiques]                                                            │
├──────────────────────────────┤  =======                                                                            │
│ [Rechercher...]              │  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│ ├──────────┼───────────────┤ │  │  8 lignes      │  │  7 actives     │  │  1 inactive    │  │  5 telephones  │     │
│ │Numeros(8)│ Services      │ │  │   [BLEU]       │  │   [VERT]       │  │   [ORANGE]     │  │   [VIOLET]     │     │
│ └──────────┴───────────────┘ │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘     │
│ NAV3b=Lignes (ACTIF)         │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ 8 lignes                     │  │ Vos lignes SIP                                                             │     │
├──────────────────────────────┤  ├────────────────────────────────────────────────────────────────────────────┤     │
│ * Toutes les lignes      ████│  │                                                                            │     │
│   (VUE AGREGEE)              │  │  [Toutes (8)] [Actives (7)] [Inactives (1)]             [Filtrer...]       │     │
│   (SELECTIONNE)              │  │                                                                            │     │
├──────────────────────────────┤  │  Ligne              │ Groupe         │ Telephone      │ Statut │ Actions  │     │
│ o Ligne Accueil              │  │  ════════════════════════════════════════════════════════════════════════  │     │
│   +33 9 72 10 12 34          │  │  +33 9 72 10 12 34  │ Bureau Paris   │ Cisco 8845     │[v]Enreg│ [->]     │     │
│   Cisco IP Phone 8845        │  │  +33 9 72 10 12 35  │ Bureau Paris   │ Yealink T46S   │[v]Enreg│ [->]     │     │
│                       [Actif]│  │  +33 9 72 10 12 36  │ Bureau Paris   │ Softphone      │[v]Enreg│ [->]     │     │
│                              │  │  +33 9 72 10 12 37  │ Bureau Paris   │ Cisco 8811     │[v]Enreg│ [->]     │     │
│ o Ligne Direction            │  │  +33 9 72 10 12 38  │ Bureau Paris   │ -              │[o]Inact│ [->]     │     │
│   +33 9 72 10 12 35          │  │  +33 9 72 20 00 01  │ Agence Lyon    │ Yealink T42U   │[v]Enreg│ [->]     │     │
│   Yealink T46S               │  │  +33 9 72 20 00 02  │ Agence Lyon    │ Yealink T42U   │[v]Enreg│ [->]     │     │
│                       [Actif]│  │  +33 9 72 20 00 03  │ Agence Lyon    │ Softphone      │[v]Enreg│ [->]     │     │
│                              │  │                                                                            │     │
│ ...                          │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": true,
  "stats": {
    "total": 8,
    "active": 7,
    "inactive": 1,
    "withPhone": 5
  },
  "lines": [
    {"number": "+33 9 72 10 12 34", "group": "Bureau Paris", "phone": "Cisco 8845", "status": "registered"},
    {"number": "+33 9 72 10 12 35", "group": "Bureau Paris", "phone": "Yealink T46S", "status": "registered"},
    {"number": "+33 9 72 10 12 36", "group": "Bureau Paris", "phone": "Softphone", "status": "registered"},
    {"number": "+33 9 72 10 12 37", "group": "Bureau Paris", "phone": "Cisco 8811", "status": "registered"},
    {"number": "+33 9 72 10 12 38", "group": "Bureau Paris", "phone": null, "status": "inactive"},
    {"number": "+33 9 72 20 00 01", "group": "Agence Lyon", "phone": "Yealink T42U", "status": "registered"},
    {"number": "+33 9 72 20 00 02", "group": "Agence Lyon", "phone": "Yealink T42U", "status": "registered"},
    {"number": "+33 9 72 20 00 03", "group": "Agence Lyon", "phone": "Softphone", "status": "registered"}
  ]
}

================================================================================
