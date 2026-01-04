# SCREENSHOT: vRack Services - Vue liste principale
# NAV1: Network | NAV2: vRack Services | NAV3: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][vRack Services][Load Balancer][CDN][OVHcloud Co.] │
│                              ▲                                               │
│                              └ ACTIF                                         │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vRack Services                    [+Commander]    │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │                                                    │ │
│ │ ALL             │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Nom               │ Region │ vRack   │ Statut  │ │ │
│ │ [Rechercher...] │ │ │ ├───────────────────┼────────┼─────────┼─────────┤ │ │
│ ├─────────────────┤ │ │ │ vs-production-01  │ GRA    │ pn-123  │ [Actif] │ │ │
│ │ • Tous les svc  │ │ │ │ vs-staging        │ SBG    │ pn-123  │ [Actif] │ │ │
│ ├─────────────────┤ │ │ │ vs-dev            │ BHS    │ --      │ [Draft] │ │ │
│ │ ○ vs-production │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   Actif         │ │ │                                                    │ │
│ │ ○ vs-staging    │ │ │ 3 vRack Services                                   │ │
│ │   Actif         │ │ │                                                    │ │
│ │ ○ vs-dev        │ │ │                                                    │ │
│ │   Brouillon     │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | Tous les services selectionne
ETAT: Vue liste de tous les vRack Services
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
