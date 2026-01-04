# SCREENSHOT: Tab Vue d'ensemble d'un vRack Services avec menu actions
# NAV1: Network | NAV2: vRack Services | NAV3: General | NAV4: Général

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][vRack Services][Load Balancer][CDN][OVHcloud Co.] │
│                              ▲                                               │
│                              └ ACTIF                                         │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Network / vRack Services / vs-abc123-prod         │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ Region      [v] │ │ │ vs-abc123-prod [✏️]                                │ │
│ │ ALL             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ NAV4: [Général •][Sous-réseau][Service Endpoints]  │ │
│ │ [Rechercher...] │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ ┌─────────────────────────────────────────────┐   │ │
│ │ • Tous les svc  │ │ │ │ Informations                                │   │ │
│ ├─────────────────┤ │ │ ├─────────────────────────────────────────────┤   │ │
│ │ ○ vs-abc123-prod│◀│ │ │ Nom             vs-abc123-prod         [✏️] │   │ │
│ │   ACTIVE        │ │ │ │ Statut          [ACTIVE]                    │   │ │
│ │ ○ vs-staging    │ │ │ │ Région          France, Gravelines (GRA)    │   │ │
│ │   ACTIVE        │ │ │ │ Private Network pn-123456              [⋮]  │   │ │
│ │                 │ │ │ │ Date création   27/12/2024 ┌──────────────┐ │   │ │
│ │                 │ │ │ │                            │Associer vRack│ │   │ │
│ │                 │ │ │ │                            │Autre vRack   │ │   │ │
│ │                 │ │ │ │                            │Dissocier     │ │   │ │
│ │                 │ │ │ │                            └──────────────┘ │   │ │
│ │                 │ │ │ └─────────────────────────────────────────────┘   │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack Services | NAV3: General / vs-abc123-prod sélectionné | NAV4: Général
ETAT: Tab overview avec menu actions Private Network ouvert
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
