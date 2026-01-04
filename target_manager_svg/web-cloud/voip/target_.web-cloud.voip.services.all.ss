================================================================================
SCREENSHOT: target_.web-cloud.voip.services.all.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Services | NAV4: General (VUE AGREGEE)
NOTE: Vue de tous les services de tous les groupes

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ Tous les services SIP                                                               │
│ [Trunk (0)]                  │ Vue d'ensemble de tous les services                                                 │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │                                                                                     │
├──────────────────────────────┤  [Tous (21)] [Lignes (8)] [Numeros (12)] [Fax (1)]         [Filtrer...]             │
│ [Rechercher...]              │                                                                                     │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ ├──────────┼───────────────┤ │  │                                                                            │     │
│ │Numeros(8)│ Services      │ │  │  Service            │ Type    │ Groupe         │ Description    │ Statut  │     │
│ └──────────┴───────────────┘ │  │  ════════════════════════════════════════════════════════════════════════  │     │
│ NAV3b=Services (ACTIF)       │  │  +33 9 72 10 12 34  │ Ligne   │ Bureau Paris   │ Ligne Accueil  │[v]Actif │     │
├──────────────────────────────┤  │  +33 9 72 10 12 35  │ Ligne   │ Bureau Paris   │ Ligne Direction│[v]Actif │     │
│ 21 services (tous groupes)   │  │  +33 9 72 10 12 36  │ Ligne   │ Bureau Paris   │ Ligne Commerc. │[v]Actif │     │
├──────────────────────────────┤  │  +33 9 72 20 00 01  │ Ligne   │ Agence Lyon    │ Ligne Lyon 1   │[v]Actif │     │
│ o +33 9 72 10 12 34          │  │  ────────────────────────────────────────────────────────────────────────  │     │
│   Ligne Accueil              │  │  +33 1 84 88 00 00  │ Numero  │ Bureau Paris   │ Num Principal  │[v]Actif │     │
│   Ligne              [Actif] │  │  +33 1 84 88 00 01  │ Numero  │ Bureau Paris   │ Accueil        │[v]Actif │     │
├──────────────────────────────┤  │  +33 1 84 88 00 02  │ Numero  │ Bureau Paris   │ Support        │[v]Actif │     │
│ o +33 9 72 10 12 35          │  │  +33 1 55 00 00 00  │ Numero  │ Agence Lyon    │ Num Lyon       │[v]Actif │     │
│   Ligne Direction            │  │  ────────────────────────────────────────────────────────────────────────  │     │
│   Ligne              [Actif] │  │  +33 9 72 10 77 77  │ Fax     │ Bureau Paris   │ Fax Bureau     │[v]Actif │     │
├──────────────────────────────┤  │                                                                            │     │
│ ...                          │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-10 sur 21                                    [<] [1] [2] [3] [>]       │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": true,
  "services": [
    {"service": "+33 9 72 10 12 34", "type": "line", "group": "Bureau Paris", "description": "Ligne Accueil", "status": "active"},
    {"service": "+33 9 72 10 12 35", "type": "line", "group": "Bureau Paris", "description": "Ligne Direction", "status": "active"},
    {"service": "+33 9 72 10 12 36", "type": "line", "group": "Bureau Paris", "description": "Ligne Commerc.", "status": "active"},
    {"service": "+33 9 72 20 00 01", "type": "line", "group": "Agence Lyon", "description": "Ligne Lyon 1", "status": "active"},
    {"service": "+33 1 84 88 00 00", "type": "number", "group": "Bureau Paris", "description": "Num Principal", "status": "active"},
    {"service": "+33 1 84 88 00 01", "type": "number", "group": "Bureau Paris", "description": "Accueil", "status": "active"},
    {"service": "+33 1 84 88 00 02", "type": "number", "group": "Bureau Paris", "description": "Support", "status": "active"},
    {"service": "+33 1 55 00 00 00", "type": "number", "group": "Agence Lyon", "description": "Num Lyon", "status": "active"},
    {"service": "+33 9 72 10 77 77", "type": "fax", "group": "Bureau Paris", "description": "Fax Bureau", "status": "active"}
  ],
  "filters": {
    "all": 21,
    "lines": 8,
    "numbers": 12,
    "fax": 1
  }
}

================================================================================
