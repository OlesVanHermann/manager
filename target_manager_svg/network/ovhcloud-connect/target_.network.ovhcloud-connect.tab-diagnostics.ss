# SCREENSHOT: OVHcloud Connect - Tab Diagnostics
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Diagnostics

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
│ │ Region      [v] │ │ │ NAV4: [Vue generale][POPs][Diagnostics •]         │ │
│ │ PAR             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                                   [Lancer diagnos.] │ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌─────────────────────────────────────────────────┐│ │
│ │ ○ occ-prod-fr   │◀│ │ │ Statut des composants                          ││ │
│ │   PAR-TH2       │ │ │ ├─────────────────────────────────────────────────┤│ │
│ │                 │ │ │ │ Port physique     [OK]   Link Up                ││ │
│ │                 │ │ │ │ BGP Session       [OK]   Established            ││ │
│ │                 │ │ │ │ vRack association [OK]   Connecte               ││ │
│ │                 │ │ │ │ Service Keys      [OK]   1 cle active           ││ │
│ │                 │ │ │ │ Datacenter        [OK]   2 DCs configures       ││ │
│ │                 │ │ │ └─────────────────────────────────────────────────┘│ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Dernier diagnostic: 03/01/2026 14:35               │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Diagnostics
ETAT: Vue diagnostics et sante de la connexion
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
