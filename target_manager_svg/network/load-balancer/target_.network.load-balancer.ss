# SCREENSHOT: Load Balancer - Vue liste principale
# NAV1: Network | NAV2: Load Balancer | NAV3: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
│                              ▲                                               │
│                              └ ACTIF                                         │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Load Balancer                     [+Commander]    │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │                                                    │ │
│ │ ALL             │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Nom           │ Region │ IP        │ Statut   │ │ │
│ │ [Rechercher...] │ │ │ ├───────────────┼────────┼───────────┼──────────┤ │ │
│ ├─────────────────┤ │ │ │ lb-prod-web   │ GRA    │ 51.210... │ [Actif]  │ │ │
│ │ • Tous les svc  │ │ │ │ lb-api        │ SBG    │ 141.94... │ [Actif]  │ │ │
│ ├─────────────────┤ │ │ │ lb-staging    │ GRA    │ 57.128... │ [Inactif]│ │ │
│ │ ○ lb-prod-web   │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   GRA           │ │ │                                                    │ │
│ │ ○ lb-api        │ │ │ 3 load balancers                                   │ │
│ │   SBG           │ │ │                                                    │ │
│ │ ○ lb-staging    │ │ │                                                    │ │
│ │   GRA           │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | Tous les services selectionne
ETAT: Vue liste de tous les load balancers
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
