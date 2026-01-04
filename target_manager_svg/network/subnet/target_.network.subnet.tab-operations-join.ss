# SCREENSHOT: Tab Operations - Join
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.x.0/25 selectionne | NAV4: Operations

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.0/25                              [...] │ │
│ │ ALL             │ │ │ IPv4 • Failover • GRA                              │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                                  ▲                 │ │
│ │ o Tous les svc  │ │ │                                  └ ACTIF           │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Operations sur le bloc                             │ │
│ │ * 51.210.x.0/25 │◀│ │                                                    │ │
│ │   Failover /25  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o 51.210.x.128  │ │ │ │ Fusionner (Join)                               │ │ │
│ │   Failover /25  │ │ │ │                                                │ │ │
│ │ o 10.0.0.0/16   │ │ │ │ Bloc actuel : 51.210.123.0/25 (128 adresses)   │ │ │
│ ├─────────────────┤ │ │ │                                                │ │ │
│ │ IP unitaires    │ │ │ │ Blocs adjacents disponibles :                  │ │ │
│ │ o 51.210.45.67  │ │ │ │ [x] 51.210.123.128/25 (128 adresses)           │ │ │
│ │ o 141.94.12.34  │ │ │ │                                                │ │ │
│ │                 │ │ │ │ Resultat :                                     │ │ │
│ │                 │ │ │ │ -> 51.210.123.0/24 (256 adresses)              │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ OK Les deux blocs sont eligibles a la fusion  │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │                         [Fusionner blocs]      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.x.0/25 selectionne | NAV4: Operations
ETAT: Operation Join (fusion) de blocs IP adjacents
