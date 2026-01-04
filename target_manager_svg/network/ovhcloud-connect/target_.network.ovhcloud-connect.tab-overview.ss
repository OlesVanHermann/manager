# SCREENSHOT: OVHcloud Connect - Tab Vue generale
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Vue generale

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ OVHcloud Connect > occ-prod-fr                     │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [Vue generale •][POPs][Datacenters][Stats]  │ │
│ │ PAR             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ [Rechercher...] │ │ │ ┌───────────────────────┐ ┌───────────────────────┐│ │
│ ├─────────────────┤ │ │ │ Connectivite          │ │ Bande passante        ││ │
│ │ ○ occ-prod-fr   │◀│ │ │ ████████████████ 100% │ │ ████████░░░░ 6.2 Gbps ││ │
│ │   PAR-TH2       │ │ │ │ 2/2 POPs actifs       │ │ sur 10 Gbps           ││ │
│ │                 │ │ │ └───────────────────────┘ └───────────────────────┘│ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Architecture                                       │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │  [Votre DC] ──── [PAR-TH2] ──── [OVH DC GRA]   │ │ │
│ │                 │ │ │ │             ╲    [FRA-AM2] ────╱                │ │ │
│ │                 │ │ │ │              ╲─────────────────╱                 │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Vue generale
ETAT: Vue d'ensemble de la connexion avec schema
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
