# SCREENSHOT: vRack Services - Sous-reseaux vide
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
│ ├─────────────────┤ │ │                                                    │ │
│ │ [Rechercher...] │ │ │  ┌──────────────────────────────────────────────┐ │ │
│ ├─────────────────┤ │ │  │                                              │ │ │
│ │ • Tous les svc  │ │ │  │           [icon: network]                    │ │ │
│ ├─────────────────┤ │ │  │                                              │ │ │
│ │ ○ vs-production │◀│ │  │   Aucun sous-reseau configure                │ │ │
│ │   Actif         │ │ │  │                                              │ │ │
│ │ ○ vs-staging    │ │ │  │   Configurez un sous-reseau pour commencer   │ │ │
│ │   Actif         │ │ │  │   a utiliser ce vRack Services.              │ │ │
│ │                 │ │ │  │                                              │ │ │
│ │                 │ │ │  │          [Creer un sous-reseau]              │ │ │
│ │                 │ │ │  │                                              │ │ │
│ │                 │ │ │  └──────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Sous-reseaux
ETAT: Liste sous-reseaux vide (empty state)
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
