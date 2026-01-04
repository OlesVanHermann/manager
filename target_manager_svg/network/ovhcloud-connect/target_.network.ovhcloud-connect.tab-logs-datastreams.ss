# SCREENSHOT: OVHcloud Connect - Tab Logs Datastreams
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
│ │ PAR             │ │ │       [Datastreams •][Livetail]                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ [Rechercher...] │ │ │                             [+Creer datastream]    │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ ○ occ-prod-fr   │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   PAR-TH2       │ │ │ │ Nom           │ Destination  │ Statut │ ...   │ │ │
│ │                 │ │ │ ├───────────────┼──────────────┼────────┼───────┤ │ │
│ │                 │ │ │ │ logs-prod     │ LDP (Graylog)│ [Actif]│ [⋮]   │ │ │
│ │                 │ │ │ │ logs-archive  │ Cold Storage │ [Actif]│ [⋮]   │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ 2 datastreams configures                           │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Logs/Datastreams
ETAT: Configuration des flux de logs
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
