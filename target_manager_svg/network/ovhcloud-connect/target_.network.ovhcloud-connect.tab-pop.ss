# SCREENSHOT: OCC selectionne - Tab POP
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (ALL) / occ-prod-par selectionne | NAV4: POP

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
│ │ ALL             │ │ │       [Cles][Taches]          ▲                    │ │
│ ├─────────────────┤ │ │                               └ ACTIF              │ │
│ │ Rechercher...   │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Point of Presence                                  │ │
│ │ o Tous les svc  │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ POP              │ Equinix PA3                 │ │ │
│ │ * occ-prod-par  │◀│ │ │ Operateur        │ Equinix                     │ │ │
│ │   OK Direct•PAR │ │ │ │ Adresse          │ 114 rue Ambroise Croizat   │ │ │
│ │ o occ-backup-fra│ │ │ │                  │ 93200 Saint-Denis, France   │ │ │
│ │   OK Provider•FR│ │ │ │ Port             │ PA3:01:MMR:0123:456        │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Connexion physique                                 │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Type connecteur  │ LC/UPC (Single-mode)        │ │ │
│ │                 │ │ │ │ Debit            │ 10 Gbps                     │ │ │
│ │                 │ │ │ │ Statut link      │ OK UP                       │ │ │
│ │                 │ │ │ │ Light level (Rx) │ -3.2 dBm                    │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Telecharger LOA]                                  │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (ALL) / occ-prod-par selectionne | NAV4: POP
ETAT: Informations Point of Presence et connexion physique
