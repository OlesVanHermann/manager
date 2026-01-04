# SCREENSHOT: Load Balancer - Tab Logs Datastreams
# NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Logs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Load Balancer > lb-prod-web                        │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [Dashboard][Frontends][Farms][Logs •]       │ │
│ │ GRA             │ │ │       [Datastreams •][Livetail]                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │                            [+Creer datastream]     │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ ○ lb-prod-web   │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   GRA           │ │ │ │ Nom           │ Destination  │ Statut │ ...   │ │ │
│ │                 │ │ │ ├───────────────┼──────────────┼────────┼───────┤ │ │
│ │                 │ │ │ │ lb-access     │ LDP (Graylog)│ [Actif]│ [⋮]   │ │ │
│ │                 │ │ │ │ lb-errors     │ Cold Storage │ [Actif]│ [⋮]   │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ 2 datastreams configures                           │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Logs/Datastreams
ETAT: Configuration des flux de logs
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
