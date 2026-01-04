# SCREENSHOT: Security - Scrubbing Center detail
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service | NAV4: Scrubbing

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ 51.210.123.0/24                               [..] │ │
│ ├─────────────────┤ │ │ OK Protection active - Mode: Auto                  │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                                  ▲       [Taches]  │ │
│ │ [Rechercher...] │ │ │                                  └ ACTIF           │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc  │ │ │ Centre de nettoyage                                │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ * 51.210.x.0/24 │◀│ │ Scrubbing Center: VAC-GRA (France)                 │ │
│ │   OK Auto       │ │ │ Capacite: 5+ Tbps                                  │ │
│ │ o 51.210.45.67  │ │ │                                                    │ │
│ │   OK Auto       │ │ │ Fonctionnement                                     │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │  Internet ──> [VAC] ──> Serveur                │ │ │
│ │                 │ │ │ │                 │                              │ │ │
│ │                 │ │ │ │              Filtrage                          │ │ │
│ │                 │ │ │ │              DDoS                              │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Latence ajoutee: < 1ms (mode permanent)            │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service | NAV4: Scrubbing
