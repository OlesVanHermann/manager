================================================================================
SCREENSHOT: target_.web-cloud.voip.numbers.all.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Numeros | NAV4: General (VUE AGREGEE)
NOTE: "Tous les numeros" selectionne dans le sidecar

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ Tous les numeros                                                                    │
│ [Trunk (0)]                  │ Vue d'ensemble de vos 12 numeros                                                    │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │ [General] [Statistiques]                                                            │
├──────────────────────────────┤  =======                                                                            │
│ [Rechercher...]              │  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│ ├──────────┼───────────────┤ │  │  12 numeros    │  │  3 files att.  │  │  2 SVI         │  │  7 redirections│     │
│ │Numeros(8)│ Services      │ │  │   [BLEU]       │  │   [VERT]       │  │   [ORANGE]     │  │   [VIOLET]     │     │
│ └──────────┴───────────────┘ │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘     │
│ NAV3b=Numeros (ACTIF)        │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ 12 numeros                   │  │ Vos numeros                                            [+ Commander]       │     │
├──────────────────────────────┤  ├────────────────────────────────────────────────────────────────────────────┤     │
│ * Tous les numeros       ████│  │                                                                            │     │
│   (VUE AGREGEE)              │  │  [Tous (12)] [Files att. (3)] [SVI (2)] [Redirect. (7)]  [Filtrer...]      │     │
│   (SELECTIONNE)              │  │                                                                            │     │
├──────────────────────────────┤  │  Numero             │ Groupe         │ Type       │ Destination│ Statut   │     │
│ o +33 1 84 88 00 00          │  │  ════════════════════════════════════════════════════════════════════════  │     │
│   Numero Principal           │  │  +33 1 84 88 00 00  │ Bureau Paris   │ File att.  │ 4 agents   │[v]Actif  │     │
│   File d'attente             │  │  +33 1 84 88 00 01  │ Bureau Paris   │ Redirect.  │ Ligne Acc. │[v]Actif  │     │
│                  [File att.] │  │  +33 1 84 88 00 02  │ Bureau Paris   │ SVI        │ 5 options  │[v]Actif  │     │
│                              │  │  +33 1 84 88 00 03  │ Bureau Paris   │ Redirect.  │ Ligne Dir. │[v]Actif  │     │
│ o +33 1 84 88 00 01          │  │  +33 1 84 88 00 04  │ Bureau Paris   │ Redirect.  │ Externe    │[v]Actif  │     │
│   Accueil                    │  │  +33 1 55 00 00 00  │ Agence Lyon    │ File att.  │ 2 agents   │[v]Actif  │     │
│              [Redirection]   │  │  +33 1 55 00 00 01  │ Agence Lyon    │ SVI        │ 3 options  │[v]Actif  │     │
│                              │  │  ...                                                                       │     │
│ ...                          │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": true,
  "stats": {
    "total": 12,
    "queues": 3,
    "ivr": 2,
    "redirections": 7
  },
  "numbers": [
    {"number": "+33 1 84 88 00 00", "group": "Bureau Paris", "type": "queue", "destination": "4 agents", "status": "active"},
    {"number": "+33 1 84 88 00 01", "group": "Bureau Paris", "type": "redirect", "destination": "Ligne Acc.", "status": "active"},
    {"number": "+33 1 84 88 00 02", "group": "Bureau Paris", "type": "ivr", "destination": "5 options", "status": "active"},
    {"number": "+33 1 84 88 00 03", "group": "Bureau Paris", "type": "redirect", "destination": "Ligne Dir.", "status": "active"},
    {"number": "+33 1 84 88 00 04", "group": "Bureau Paris", "type": "redirect", "destination": "Externe", "status": "active"},
    {"number": "+33 1 55 00 00 00", "group": "Agence Lyon", "type": "queue", "destination": "2 agents", "status": "active"},
    {"number": "+33 1 55 00 00 01", "group": "Agence Lyon", "type": "ivr", "destination": "3 options", "status": "active"}
  ]
}

================================================================================
