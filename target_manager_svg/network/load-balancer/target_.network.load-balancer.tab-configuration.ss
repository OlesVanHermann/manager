# SCREENSHOT: Load Balancer - Tab Configuration
# NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Configuration

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
│ │ Region      [v] │ │ │ NAV4: [Dashboard][Frontends][Farms][Config •]     │ │
│ │ GRA             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ [Rechercher...] │ │ │ ┌─────────────────────────────────────────────────┐│ │
│ ├─────────────────┤ │ │ │ Configuration generale                         ││ │
│ │ ○ lb-prod-web   │◀│ │ ├─────────────────────────────────────────────────┤│ │
│ │   GRA           │ │ │ │ Display name    lb-prod-web               [✏️] ││ │
│ │                 │ │ │ │ Offre           L - 2000 conn/s           [↑]  ││ │
│ │                 │ │ │ │ IP publique     51.210.45.100                  ││ │
│ │                 │ │ │ │ IP Failover     Non configuree            [+]  ││ │
│ │                 │ │ │ │ Cipher suite    Modern                    [✏️] ││ │
│ │                 │ │ │ └─────────────────────────────────────────────────┘│ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ ┌─────────────────────────────────────────────────┐│ │
│ │                 │ │ │ │ Zones                              [+Ajouter]  ││ │
│ │                 │ │ │ ├─────────────────────────────────────────────────┤│ │
│ │                 │ │ │ │ • GRA - Gravelines (zone principale)           ││ │
│ │                 │ │ │ │ • SBG - Strasbourg (failover)             [x]  ││ │
│ │                 │ │ │ └─────────────────────────────────────────────────┘│ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: Configuration
ETAT: Configuration generale du load balancer
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
