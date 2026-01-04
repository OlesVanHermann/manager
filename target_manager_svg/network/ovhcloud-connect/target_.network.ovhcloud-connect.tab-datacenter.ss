# SCREENSHOT: OCC selectionne - Tab Datacenter
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (ALL) / occ-prod-par selectionne | NAV4: Datacenter

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
│ │ ALL             │ │ │       [Cles][Taches]      ▲                        │ │
│ ├─────────────────┤ │ │                           └ ACTIF                  │ │
│ │ Rechercher...   │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Datacenter de destination                          │ │
│ │ o Tous les svc  │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Datacenter       │ PAR DC                      │ │ │
│ │ * occ-prod-par  │◀│ │ │ Region           │ EU-West (PAR.FR)            │ │ │
│ │   OK Direct•PAR │ │ │ │ Statut           │ OK Connecte                 │ │ │
│ │ o occ-backup-fra│ │ │ │ Port DC          │ dc-port-xxx-001             │ │ │
│ │   OK Provider•FR│ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Configuration vRack                                │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ vRack            │ pn-123456 (Production)      │ │ │
│ │                 │ │ │ │ Subnet           │ 10.0.100.0/24               │ │ │
│ │                 │ │ │ │ VLAN ID          │ 1000                        │ │ │
│ │                 │ │ │ │ IP Gateway       │ 10.0.100.1                  │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Modifier vRack]                  [Modifier VLAN] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (ALL) / occ-prod-par selectionne | NAV4: Datacenter
ETAT: Configuration datacenter et vRack
