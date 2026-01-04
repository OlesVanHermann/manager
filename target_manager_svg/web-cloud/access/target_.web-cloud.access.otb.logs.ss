================================================================================
SCREENSHOT: target_.web-cloud.access.otb.logs.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: OTB | NAV4: Journaux
NOTE: Logs systeme de l'OverTheBox

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                           =====                                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [OTB]              │ OTB Bureau Principal                                        [Redemarrer] [Journaux] │
│            ===               │ overthebox-abc123                                                     [Actif]       │
│            NAV3=OTB (ACTIF)  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Acces distants] [Configuration] [Journaux] [Taches]                      │
│ [Rechercher...]              │                                             ========                                │
├──────────────────────────────┤                                             NAV4=Journaux (ACTIF)                   │
│ 2 services OTB               │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Niveau: [Tous v]    Periode: [Derniere heure v]          [Exporter] [Actualiser]    │
│ * OTB Bureau Principal   ████│ ────────────────────────────────────────────────────────────────────────────────────┤
│   overthebox-abc123          │                                                                                     │
│   3 connexions               │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│   (SELECTIONNE)       [Actif]│  │ Journaux systeme                                                           │     │
├──────────────────────────────┤  ├────────────────────────────────────────────────────────────────────────────┤     │
│ o OTB Entrepot               │  │                                                                            │     │
│   overthebox-xyz789          │  │  14:32:15 │ INFO  │ mptcp    │ Connection WAN1 stable                      │     │
│   2 connexions               │  │  14:32:10 │ INFO  │ network  │ Traffic stats updated                       │     │
│                    [Warning] │  │  14:31:45 │ WARN  │ wan3     │ 4G signal degraded (-85dBm)                 │     │
│                              │  │  14:30:00 │ INFO  │ system   │ Health check OK                             │     │
│                              │  │  14:28:30 │ INFO  │ tunnel   │ SSH tunnel established                      │     │
│                              │  │  14:25:15 │ INFO  │ mptcp    │ Aggregation active: WAN1+WAN2               │     │
│                              │  │  14:20:00 │ INFO  │ system   │ Uptime: 45d 12h                             │     │
│                              │  │  14:15:30 │ WARN  │ wan2     │ Latency spike: 45ms -> 120ms                │     │
│                              │  │  14:15:00 │ INFO  │ system   │ Health check OK                             │     │
│                              │  │  14:10:22 │ INFO  │ network  │ DNS resolution: 12ms                        │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-10 sur 156                                       [<] [1] [2] ... [>]   │
│                              │                                                                                     │
│                              │  Legende: INFO - Information | WARN - Avertissement | ERROR - Erreur | DEBUG       │
│                              │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "filters": {
    "level": "all",
    "period": "last_hour"
  },
  "logs": [
    {"time": "14:32:15", "level": "INFO", "source": "mptcp", "message": "Connection WAN1 stable"},
    {"time": "14:32:10", "level": "INFO", "source": "network", "message": "Traffic stats updated"},
    {"time": "14:31:45", "level": "WARN", "source": "wan3", "message": "4G signal degraded (-85dBm)"},
    {"time": "14:30:00", "level": "INFO", "source": "system", "message": "Health check OK"},
    {"time": "14:28:30", "level": "INFO", "source": "tunnel", "message": "SSH tunnel established"},
    {"time": "14:25:15", "level": "INFO", "source": "mptcp", "message": "Aggregation active: WAN1+WAN2"},
    {"time": "14:20:00", "level": "INFO", "source": "system", "message": "Uptime: 45d 12h"},
    {"time": "14:15:30", "level": "WARN", "source": "wan2", "message": "Latency spike: 45ms -> 120ms"},
    {"time": "14:15:00", "level": "INFO", "source": "system", "message": "Health check OK"},
    {"time": "14:10:22", "level": "INFO", "source": "network", "message": "DNS resolution: 12ms"}
  ],
  "pagination": {
    "current": 1,
    "total": 16,
    "perPage": 10
  }
}

================================================================================
