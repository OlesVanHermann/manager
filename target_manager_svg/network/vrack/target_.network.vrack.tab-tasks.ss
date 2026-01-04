# SCREENSHOT: vRack selectionne - NAV4=Taches
# NAV1: Network | NAV2: vRack | NAV3: Region (ALL) / pn-123456 selectionne | NAV4: Taches

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                         [xx-ovh] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet] [vRack] [Load Balancer] [CDN] [OVHcloud Connect] [Anti-DDoS VAC]          │
├───────────────────────────┬─────────────────────────────────────────────────────┤
│ LEFT PANEL (280px)        │ RIGHT PANEL                                         │
│ ┌───────────────────────┐ │ ┌─────────────────────────────────────────────────┐ │
│ │ NAV3 - Region         │ │ │ pn-123456                       [Modifier] [↻] │ │
│ │ [ALL               ▼] │ │ │ Production network                              │ │
│ ├───────────────────────┤ │ ├─────────────────────────────────────────────────┤ │
│ │ Rechercher...         │ │ │ NAV4                                            │ │
│ ├───────────────────────┤ │ │  General  Services  IPv6 [Taches]               │ │
│ │                       │ │ │                            ▲                    │ │
│ │  Tous les svc         │ │ │                            └── ACTIF            │ │
│ │  ─────────────────    │ │ ├─────────────────────────────────────────────────┤ │
│ │  pn-123456         ◀  │ │ │ Historique des operations                       │ │
│ │     Production        │ │ │                                                 │ │
│ │  pn-789012            │ │ │ Date        │ Operation       │ Cible   │Statut │ │
│ │     Staging           │ │ │ ────────────┼─────────────────┼─────────┼───────│ │
│ │  pn-345678            │ │ │ 02/01 14:30 │ Ajout IPv6      │ bloc-5  │  --   │ │
│ │     Dev               │ │ │ 02/01 14:15 │ Creation IPv6   │ bloc-4  │  OK   │ │
│ │                       │ │ │ 02/01 10:00 │ Ajout service   │ ns789   │  OK   │ │
│ │                       │ │ │ 01/01 16:45 │ Ajout service   │cloud-prd│  OK   │ │
│ │                       │ │ │ 01/01 09:30 │ Retrait service │ ns-old  │  OK   │ │
│ │                       │ │ │ 31/12 18:00 │ Creation IPv6   │ bloc-3  │  OK   │ │
│ │                       │ │ │                                                 │ │
│ │                       │ │ │ Legende: -- En cours  OK Succes  !! Erreur      │ │
│ └───────────────────────┘ │ └─────────────────────────────────────────────────┘ │
└───────────────────────────┴─────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: vRack | NAV3: Region (ALL) / pn-123456 selectionne | NAV4: Taches
