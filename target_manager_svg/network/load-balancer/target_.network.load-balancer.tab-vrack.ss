# SCREENSHOT: Load Balancer - Tab vRack
# NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: vRack

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
│ │ Region      [v] │ │ │ NAV4: [Dashboard][Frontends][Farms][SSL][vRack •] │ │
│ │ GRA             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ [Rechercher...] │ │ │ ┌─────────────────────────────────────────────────┐│ │
│ ├─────────────────┤ │ │ │ Configuration vRack                            ││ │
│ │ ○ lb-prod-web   │◀│ │ ├─────────────────────────────────────────────────┤│ │
│ │   GRA           │ │ │ │ vRack associe  pn-123456                  [✏️] ││ │
│ │                 │ │ │ │ VLAN ID        100                              ││ │
│ │                 │ │ │ │ IP privee      10.0.0.100/24                    ││ │
│ │                 │ │ │ │ Statut         [Actif]                          ││ │
│ │                 │ │ │ └─────────────────────────────────────────────────┘│ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ /i\\ Le vRack permet au load balancer de           │ │
│ │                 │ │ │ communiquer avec vos serveurs sur le reseau prive. │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Dissocier du vRack]                               │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: vRack
ETAT: Configuration vRack du load balancer
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
