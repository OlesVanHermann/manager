# SCREENSHOT: Filtre Region applique - EU-West (GRA.FR)
# NAV1: Network | NAV2: Subnet | NAV3: Region (GRA) / General selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ Subnet - Vue d'ensemble (GRA)      [+ Commander]  │ │
│ │ EU-West(GRA.FR) │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ │ Rechercher...   │ │ │                 ▲                                  │ │
│ ├─────────────────┤ │ │                 └ ACTIF                            │ │
│ │ * Tous les svc  │◀│ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Filtre actif: EU-West (GRA.FR)        [x Effacer] │ │
│ │ Blocs           │ │ │                                                    │ │
│ │ o 51.210.x.x/24 │ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │   Failover /24  │ │ │ │ Total     │ │ IPv4      │ │ IPv6      │         │ │
│ │                 │ │ │ │ 186       │ │ 152       │ │ 34        │         │ │
│ │  ┌───────────┐  │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │  │10.0.0.0/16│  │ │ │                                                    │ │
│ │  │ masque    │  │ │ │ Par type (GRA uniquement)                          │ │
│ │  │(pas a GRA)│  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │  └───────────┘  │ │ │ │ Dedicated Server  ████████████░░  54           │ │ │
│ │                 │ │ │ │ VPS               ██████░░░░░░░░  28           │ │ │
│ ├─────────────────┤ │ │ │ Public Cloud      ████████░░░░░░  42           │ │ │
│ │ IP unitaires    │ │ │ │ Failover          ██████████░░░░  62           │ │ │
│ │ o 51.210.45.67  │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   Dedicated     │ │ │                                                    │ │
│ │ o 57.128.99.1   │ │ │                                                    │ │
│ │   Public Cloud  │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (GRA) filtre actif / General selectionne | NAV4: General
ETAT: Vue filtree par region - elements non-matchants masques dans sidecar
