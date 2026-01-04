# SCREENSHOT: Load Balancer - Liste complete
# NAV1: Network | NAV2: Load Balancer | NAV3: General | Liste

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Load Balancer - Tous les services                  │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │                                   [+Commander LB]  │ │
│ │ ALL             │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ [Rechercher...] │ │ │ │ Nom      │ IP       │ Frontends│ Farms│ Statut│ │ │
│ ├─────────────────┤ │ │ ├──────────┼──────────┼──────────┼──────┼───────┤ │ │
│ │ • Tous les svc  │◀│ │ │ lb-prod  │ 51.210...│ 3        │ 2    │[Actif]│ │ │
│ ├─────────────────┤ │ │ │ lb-api   │ 141.94...│ 2        │ 1    │[Actif]│ │ │
│ │ ○ lb-prod-web   │ │ │ │ lb-stag  │ 57.128...│ 1        │ 1    │[Pause]│ │ │
│ │   GRA           │ │ │ │ lb-dev   │ 198.27...│ 2        │ 2    │[Actif]│ │ │
│ │ ○ lb-api        │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   SBG           │ │ │                                                    │ │
│ │ ○ lb-staging    │ │ │ 4 load balancers                                   │ │
│ │   GRA           │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | Tous les svc
ETAT: Liste complete des load balancers avec compteurs
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
