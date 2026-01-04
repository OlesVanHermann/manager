# SCREENSHOT: Dashboard Load Balancer - Vue d'ensemble (Tous les services)
# NAV1: Network | NAV2: Load Balancer | NAV3: General | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
│                               ▲                                              │
│                               └ ACTIF                                        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ Load Balancer - Vue d'ensemble      [+ Commander] │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [General][Fermes][Frontends][SSL][Taches]    │ │
│ │ ALL             │ │ │          ▲                                         │ │
│ ├─────────────────┤ │ │          └ ACTIF                                   │ │
│ │ [Rechercher...] │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │ * Tous les svc  │◀│ │ │ Total     │ │ OK Actifs │ │ XX Erreur │         │ │
│ ├─────────────────┤ │ │ │ 5         │ │ 4         │ │ 1         │         │ │
│ │ o lb-prod       │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │   OK GRA,RBX    │ │ │                                                    │ │
│ │ o lb-staging    │ │ │ Trafic total (24h)                                 │ │
│ │   OK GRA        │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o lb-dev        │ │ │ │ Requetes: 12.4M  |  Bande passante: 456 GB    │ │ │
│ │   OK GRA        │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Par zone                                           │ │
│ │                 │ │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐      │ │
│ │                 │ │ │ │ GRA: 3 LB  │ │ RBX: 2 LB  │ │ PAR: 1 LB  │      │ │
│ │                 │ │ │ └────────────┘ └────────────┘ └────────────┘      │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: General / Tous les svc selectionne | NAV4: General
ETAT: Vue agregee - statistiques globales Load Balancer
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
