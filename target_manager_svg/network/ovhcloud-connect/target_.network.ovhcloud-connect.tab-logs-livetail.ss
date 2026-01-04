# SCREENSHOT: OVHcloud Connect - Tab Logs Livetail
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Logs

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
│ │ Region      [v] │ │ │ NAV4: [Vue generale][POPs][Logs •]                │ │
│ │ PAR             │ │ │       [Datastreams][Livetail •]                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │ [Filtrer...]                    [Pause] [Effacer] │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ ○ occ-prod-fr   │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   PAR-TH2       │ │ │ │ 14:35:21 INFO  BGP session established         │ │ │
│ │                 │ │ │ │ 14:35:20 INFO  Port link up                    │ │ │
│ │                 │ │ │ │ 14:35:18 DEBUG BGP keepalive sent              │ │ │
│ │                 │ │ │ │ 14:35:15 INFO  Route update received           │ │ │
│ │                 │ │ │ │ 14:35:12 DEBUG Traffic stats collected         │ │ │
│ │                 │ │ │ │ 14:35:10 INFO  Datacenter sync completed       │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Streaming...                                       │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Logs/Livetail
ETAT: Logs en temps reel
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
