# SCREENSHOT: Dashboard Anti-DDoS VAC - Vue d'ensemble (Tous les services)
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]              │
│                                                             ▲                │
│                                                             └ ACTIF          │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Anti-DDoS VAC - Vue d'ensemble                    │ │
│ ├─────────────────┤ │ │ Protection DDoS incluse avec vos services          │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │          ▲     [Taches]                            │ │
│ │ [Rechercher...] │ │ │          └ ACTIF                                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * Tous les svc  │◀│ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ ├─────────────────┤ │ │ │IPs proteg.│ │Attaques30j│ │Vol. bloque│         │ │
│ │ o 51.210.x.0/24 │ │ │ │ 248       │ │ 47        │ │ 2.4 TB    │         │ │
│ │   OK Auto       │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │ o 51.210.45.67  │ │ │                                                    │ │
│ │   OK Auto       │ │ │ Attaques par type (30j)                            │ │
│ │ o 141.94.x.0/28 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   .. Permanent  │ │ │ │ UDP Flood         ████████████████░░░░  45%   │ │ │
│ │ o 57.128.99.1   │ │ │ │ SYN Flood         ████████░░░░░░░░░░░░  28%   │ │ │
│ │   XX Desactive  │ │ │ │ DNS Amplification ████░░░░░░░░░░░░░░░░  15%   │ │ │
│ │                 │ │ │ │ Autres            ██░░░░░░░░░░░░░░░░░░  12%   │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Historique (7j)                                    │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ L   M   M   J   V   S   D   <- attaques       │ │ │
│ │                 │ │ │ │ #   -   ##  -   #   -   -      3   5   2      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / Tous les svc selectionne | NAV4: General
ETAT: Vue agregee - statistiques globales protection DDoS
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
