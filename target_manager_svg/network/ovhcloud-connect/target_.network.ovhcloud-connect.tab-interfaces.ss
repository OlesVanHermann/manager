# SCREENSHOT: OCC selectionne - Tab Interfaces
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (ALL) / occ-prod-par selectionne | NAV4: Interfaces

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ OCC Production Paris                         [...] │ │
│ │ ALL             │ │ │ OK • Direct • Equinix PA3 -> PAR DC                │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ POP         [v] │ │ │ NAV4: [General][Datacenter][POP][Interfaces]       │ │
│ │ ALL             │ │ │       [Cles][Taches]               ▲               │ │
│ ├─────────────────┤ │ │                                    └ ACTIF         │ │
│ │ Rechercher...   │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Interfaces reseau (2)              [+ Ajouter]    │ │
│ │ o Tous les svc  │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ * occ-prod-par  │◀│ │ │ Interface│ Type  │ IP locale   │ Peer IP │Stat│ │ │
│ │   OK Direct•PAR │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │ o occ-backup-fra│ │ │ │ eth0     │ BGP   │ 10.0.0.1/30 │10.0.0.2 │ OK │ │ │
│ │   OK Provider•FR│ │ │ │ eth1     │ Static│ 10.0.1.1/24 │ -       │ OK │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Configuration BGP                                  │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Local AS         │ 65000                       │ │ │
│ │                 │ │ │ │ Remote AS        │ 64512                       │ │ │
│ │                 │ │ │ │ Peer IP          │ 10.0.0.2                    │ │ │
│ │                 │ │ │ │ Statut BGP       │ OK Established              │ │ │
│ │                 │ │ │ │ Prefixes recus   │ 128                         │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Configurer BGP]                                   │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (ALL) / occ-prod-par selectionne | NAV4: Interfaces
ETAT: Liste interfaces reseau et config BGP
