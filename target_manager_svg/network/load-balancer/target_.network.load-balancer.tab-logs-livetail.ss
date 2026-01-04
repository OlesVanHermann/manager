# SCREENSHOT: Load Balancer - Tab Logs Livetail
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
│ │ GRA             │ │ │       [Datastreams][Livetail •]                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │ [Filtrer...]                    [Pause] [Effacer] │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ ○ lb-prod-web   │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   GRA           │ │ │ │ 14:35:21 GET /api/users 200 12ms 10.0.0.11    │ │ │
│ │                 │ │ │ │ 14:35:20 GET /api/health 200 2ms 10.0.0.12    │ │ │
│ │                 │ │ │ │ 14:35:18 POST /api/data 201 156ms 10.0.0.13   │ │ │
│ │                 │ │ │ │ 14:35:15 GET /static/app.js 200 45ms          │ │ │
│ │                 │ │ │ │ 14:35:12 GET / 200 156ms 10.0.0.11            │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Streaming...                                       │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Logs/Livetail
ETAT: Logs en temps reel
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
