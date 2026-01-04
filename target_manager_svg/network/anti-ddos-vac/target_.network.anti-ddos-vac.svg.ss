# SCREENSHOT: Security - Vue principale avec service selectionne
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service selectionne | NAV4: General

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
│ ├─────────────────┤ │ │          ▲     [Taches]                            │ │
│ │ [Rechercher...] │ │ │          └ ACTIF                                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc  │ │ │ Informations                                       │ │
│ ├─────────────────┤ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ * 51.210.x.0/24 │◀│ │ │ IP/Subnet        │ 51.210.123.0/24             │ │ │
│ │   OK Auto       │ │ │ │ Mode mitigation  │ OK Automatique              │ │ │
│ │ o 51.210.45.67  │ │ │ │ Seuil detection  │ 1000 Mbps                   │ │ │
│ │   OK Auto       │ │ │ │ Regles perman.   │ 2                           │ │ │
│ │ o 141.94.x.0/28 │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │   .. Permanent  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │ o 57.128.99.1   │ │ │                                                    │ │
│ │   XX Desactive  │ │ │ Resume (30 jours)                                  │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Attaques         │ 12                          │ │ │
│ │                 │ │ │ │ Volume bloque    │ 456 GB                      │ │ │
│ │                 │ │ │ │ Duree totale     │ 2h 34min                    │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service selectionne | NAV4: General
