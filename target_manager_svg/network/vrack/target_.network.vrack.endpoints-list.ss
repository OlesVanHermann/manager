# SCREENSHOT: vRack Services - Liste des endpoints
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
│ │ • Tous les svc  │ │ │ │ Service         │ Type       │ IP       │ ... │ │ │
│ ├─────────────────┤ │ │ ├─────────────────┼────────────┼──────────┼─────┤ │ │
│ │ ○ vs-production │◀│ │ │ ns1234.ip      │ Dedicated  │ 10.0.0.1 │ [⋮] │ │ │
│ │   Actif         │ │ │ │ pci-abc123     │ PCI        │ 10.0.0.2 │ [⋮] │ │ │
│ │ ○ vs-staging    │ │ │ │ k8s-cluster    │ Kubernetes │ 10.0.0.3 │ [⋮] │ │ │
│ │   Actif         │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ 3 endpoints                                        │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Endpoints
ETAT: Liste des endpoints avec services connectes
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
