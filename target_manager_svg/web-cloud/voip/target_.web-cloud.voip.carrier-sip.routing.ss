================================================================================
SCREENSHOT: target_.web-cloud.voip.carrier-sip.routing.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: Trunk | NAV3b: - (pas de NAV3b) | NAV4: Routing

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ carrier-sip-98765                                             [12/50 appels]        │
│ [Trunk (1)]                  │ Trunk Principal                                                                     │
│           =====              ├─────────────────────────────────────────────────────────────────────────────────────┤
│       NAV3a=Trunk (ACTIF)    │ [General] [CDR] [Endpoints] [Routing] [DDI] [Settings]                              │
├──────────────────────────────┤                              =======                                                │
│ [Rechercher...]              │                              NAV4=Routing (ACTIF)                                   │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 trunk                      │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Trunk Principal        ████│  │ Regles de routage                                          [+ Ajouter]     │     │
│   carrier-sip-98765          │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   12/50 appels               │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │  (i) Les regles sont evaluees dans l'ordre de priorite                    │     │
│                              │  │                                                                            │     │
│                              │  │  Pri│ Nom            │ Prefixe      │ Action       │ Statut  │ Actions    │     │
│                              │  │  ═══════════════════════════════════════════════════════════════════════   │     │
│                              │  │   1 │ France Mobile  │ +336, +337   │ PBX Principal│ [v]Actif│ [^][v][x]  │     │
│                              │  │   2 │ France Fixe    │ +331, +332..5│ PBX Principal│ [v]Actif│ [^][v][x]  │     │
│                              │  │   3 │ International  │ +*           │ SBC Cloud    │ [v]Actif│ [^][v][x]  │     │
│                              │  │   4 │ Premium        │ 08*          │ Bloquer      │ [v]Actif│ [^][v][x]  │     │
│                              │  │   5 │ Default        │ *            │ PBX Backup   │ [v]Actif│ [^][v][x]  │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Actions disponibles                                                        │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │  - Routage vers endpoint    - Bloquer l'appel                             │     │
│                              │  │  - Failover (backup)        - Manipulation numero (prefixe/suffixe)       │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "routingRules": [
    {"priority": 1, "name": "France Mobile", "prefix": "+336, +337", "action": "PBX Principal", "status": "active"},
    {"priority": 2, "name": "France Fixe", "prefix": "+331, +332..5", "action": "PBX Principal", "status": "active"},
    {"priority": 3, "name": "International", "prefix": "+*", "action": "SBC Cloud", "status": "active"},
    {"priority": 4, "name": "Premium", "prefix": "08*", "action": "Bloquer", "status": "active"},
    {"priority": 5, "name": "Default", "prefix": "*", "action": "PBX Backup", "status": "active"}
  ],
  "availableActions": [
    "Routage vers endpoint",
    "Bloquer l'appel",
    "Failover (backup)",
    "Manipulation numero (prefixe/suffixe)"
  ]
}

================================================================================
