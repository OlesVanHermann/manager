# SCREENSHOT: vRack Services - Tab Sous-reseaux
# NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Sous-reseaux

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][vRack Services][Load Balancer][CDN][OVHcloud Co.] │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vRack Services > vs-production-01                 │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [Vue d'ensemble][Sous-reseaux •][Endpoints] │ │
│ │ GRA             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                             [+Creer un sous-reseau] │ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ • Tous les svc  │ │ │ │ Nom            │ CIDR          │ VLAN │ Endp │ │ │
│ ├─────────────────┤ │ │ ├────────────────┼───────────────┼──────┼──────┤ │ │
│ │ ○ vs-production │◀│ │ │ subnet-prod    │ 10.0.0.0/24   │ 100  │ 3    │ │ │
│ │   Actif         │ │ │ │ subnet-data    │ 10.0.1.0/24   │ 101  │ 2    │ │ │
│ │ ○ vs-staging    │ │ │ │ subnet-mgmt    │ 10.0.255.0/24 │ 999  │ 1    │ │ │
│ │   Actif         │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ 3 sous-reseaux                                     │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Sous-reseaux
ETAT: Liste des sous-reseaux avec nombre d'endpoints
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
