# SCREENSHOT: Load Balancer - Tab Logs
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
│ │ GRA             │ │ │       [Datastreams][Livetail]                     │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ ○ lb-prod-web   │◀│ │ │ 14:35:21 INFO  Request 200 /api/users 12ms    │ │ │
│ │   GRA           │ │ │ │ 14:35:20 INFO  Request 200 /api/health 2ms    │ │ │
│ │                 │ │ │ │ 14:35:18 WARN  Request 502 /api/heavy 30s     │ │ │
│ │                 │ │ │ │ 14:35:15 INFO  Request 200 /static/js 45ms    │ │ │
│ │                 │ │ │ │ 14:35:12 INFO  Request 200 / 156ms             │ │ │
│ │                 │ │ │ │ 14:35:10 INFO  Health check OK farm-web       │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Filtrer...]                         [Telecharger] │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Logs
ETAT: Vue des logs d'acces
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
