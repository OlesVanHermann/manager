# SCREENSHOT: vRack Services - Tab Configuration
# NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Configuration

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][vRack Services][Load Balancer][CDN][OVHcloud Co.] │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vRack Services > vs-production-01                 │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [Vue d'ensemble][Sous-reseaux][Endpoints]   │ │
│ │ GRA             │ │ │        [Configuration •]                          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌─────────────────────────────────────────────────┐│ │
│ │ • Tous les svc  │ │ │ │ Configuration reseau                           ││ │
│ ├─────────────────┤ │ │ ├─────────────────────────────────────────────────┤│ │
│ │ ○ vs-production │◀│ │ │ Mode routage      Statique               [✏️]  ││ │
│ │   Actif         │ │ │ │ MTU               1500                   [✏️]  ││ │
│ │ ○ vs-staging    │ │ │ │ Jumbo Frames      Desactive              [✏️]  ││ │
│ │   Actif         │ │ │ └─────────────────────────────────────────────────┘│ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ ┌─────────────────────────────────────────────────┐│ │
│ │                 │ │ │ │ Association vRack                              ││ │
│ │                 │ │ │ ├─────────────────────────────────────────────────┤│ │
│ │                 │ │ │ │ vRack actuel      pn-123456               [✏️] ││ │
│ │                 │ │ │ │ Services lies     3                            ││ │
│ │                 │ │ │ └─────────────────────────────────────────────────┘│ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Configuration
ETAT: Configuration reseau du vRack Services
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
