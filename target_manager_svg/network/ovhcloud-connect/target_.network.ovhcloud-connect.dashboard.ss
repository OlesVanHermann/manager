# SCREENSHOT: Dashboard OVHcloud Connect - Vue d'ensemble (Tous les services)
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]              │
│                                             ▲                                │
│                                             └ ACTIF                          │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ OVHcloud Connect - Vue d'ensemble   [+ Commander] │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [General][Datacenter][POP][Interfaces]       │ │
│ │ ALL             │ │ │          ▲                                         │ │
│ ├─────────────────┤ │ │          └ ACTIF                                   │ │
│ │ [Rechercher...] │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │ POP         [v] │ │ │ │ Total     │ │ Direct    │ │ Provider  │         │ │
│ │ ALL             │ │ │ │ 4         │ │ 2         │ │ 2         │         │ │
│ ├─────────────────┤ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │ * Tous les svc  │◀│ │                                                    │ │
│ ├─────────────────┤ │ │ Par datacenter                                     │ │
│ │ o occ-prod-par  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK Direct•PAR │ │ │ │ PAR ████████████░░░░░░░░  2                    │ │ │
│ │ o occ-backup-fra│ │ │ │ FRA ████████░░░░░░░░░░░░  1                    │ │ │
│ │   OK Provider•FR│ │ │ │ RBX ████░░░░░░░░░░░░░░░░  1                    │ │ │
│ │ o occ-prod-rbx  │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   OK Direct•RBX │ │ │                                                    │ │
│ │ o occ-dev       │ │ │ Bande passante totale                              │ │
│ │   OK Provider•PA│ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Configuree: 40 Gbps                            │ │ │
│ │                 │ │ │ │ Utilisee  : ████████░░░░░░░░░░░░  17 Gbps 42% │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General / Tous les svc selectionne | NAV4: General
ETAT: Vue agregee - statistiques globales toutes connexions
SIDECAR: [NAV3] -> Region -> [Rechercher] -> [POP] -> Tous les svc -> Liste
