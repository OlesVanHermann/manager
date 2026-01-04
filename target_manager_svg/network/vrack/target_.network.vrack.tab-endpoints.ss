# SCREENSHOT: vRack Services - Tab Endpoints
# NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Endpoints

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
│ │ Region      [v] │ │ │ NAV4: [Vue d'ensemble][Sous-reseaux][Endpoints •] │ │
│ │ GRA             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                               [+Creer un endpoint] │ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ • Tous les svc  │ │ │ │ Service         │ Type       │ Sous-res │ Act │ │ │
│ ├─────────────────┤ │ │ ├─────────────────┼────────────┼──────────┼─────┤ │ │
│ │ ○ vs-production │◀│ │ │ ns1234.ip      │ Dedicated  │ prod     │ [⋮] │ │ │
│ │   Actif         │ │ │ │ pci-abc123     │ PCI        │ data     │ [⋮] │ │ │
│ │ ○ vs-staging    │ │ │ │ k8s-cluster    │ Kubernetes │ prod     │ [⋮] │ │ │
│ │   Actif         │ │ │ │ lb-front       │ LB         │ prod     │ [⋮] │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ 4 endpoints                                        │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Endpoints
ETAT: Liste des endpoints avec services connectes
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
