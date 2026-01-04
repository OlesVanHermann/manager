# SCREENSHOT: OCC selectionne - Tab General
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (ALL) / occ-prod-par selectionne | NAV4: General

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
│ ├─────────────────┤ │ │ Informations                                       │ │
│ │ o Tous les svc  │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Service          │ occ-prod-par-xxx            │ │ │
│ │ * occ-prod-par  │◀│ │ │ Type             │ Direct                      │ │ │
│ │   OK Direct•PAR │ │ │ │ Statut           │ OK                          │ │ │
│ │ o occ-backup-fra│ │ │ │ POP              │ Equinix PA3                 │ │ │
│ │   OK Provider•FR│ │ │ │ Datacenter       │ PAR DC                      │ │ │
│ │ o occ-prod-rbx  │ │ │ │ Bande passante   │ 10 Gbps                     │ │ │
│ │   OK Direct•RBX │ │ │ │ vRack            │ pn-123456                   │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Utilisation                                        │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Bande passante: 3.2 / 10 Gbps                  │ │ │
│ │                 │ │ │ │ ████████░░░░░░░░░░░░░░░░░░░░  32%              │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (ALL) / occ-prod-par selectionne | NAV4: General
ETAT: Detail d'une connexion Direct
