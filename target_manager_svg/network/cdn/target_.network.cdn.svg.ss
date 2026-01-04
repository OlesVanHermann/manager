# SCREENSHOT: Dashboard CDN - Vue d'ensemble (Tous les services)
# NAV1: Network | NAV2: CDN | NAV3: General | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
│                                            ▲                                 │
│                                            └ ACTIF                           │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ CDN - Vue d'ensemble                [+ Commander] │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ POP         [v] │ │ │ NAV4: [General][Domaines][Cache][SSL][Stats]       │ │
│ │ ALL             │ │ │          ▲                                         │ │
│ ├─────────────────┤ │ │          └ ACTIF                                   │ │
│ │ [Rechercher...] │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │ * Tous les svc  │◀│ │ │ Total     │ │ Domaines  │ │ Bande pass│         │ │
│ ├─────────────────┤ │ │ │ 3         │ │ 47        │ │ 2.4 TB/mois│        │ │
│ │ o cdn-prod      │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │   OK            │ │ │                                                    │ │
│ │ o cdn-staging   │ │ │ Trafic par CDN (30j)                               │ │
│ │   OK            │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o cdn-legacy    │ │ │ │ cdn-prod    ████████████████░░░░  1.8 TB       │ │ │
│ │   OK            │ │ │ │ cdn-staging ██████░░░░░░░░░░░░░░  0.4 TB       │ │ │
│ │                 │ │ │ │ cdn-legacy  ████░░░░░░░░░░░░░░░░  0.2 TB       │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Cache Hit Rate global                              │ │
│ │                 │ │ │ ████████████████████████░░░░░░  87.3%              │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: CDN | NAV3: General / Tous les svc selectionne | NAV4: General
ETAT: Vue agregee - statistiques globales CDN
SIDECAR: [NAV3] -> [POP] -> [Rechercher] -> Tous les svc -> Liste
