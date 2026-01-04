# SCREENSHOT: Subnet selectionne - Tab Taches
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: Taches

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.0/24                              [...] │ │
│ │ ALL             │ │ │ OK Protection active • Mode: Auto                  │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │       [Taches]           ▲                         │ │
│ │ o Tous les svc  │ │ │                          └ ACTIF                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * 51.210.x.0/24 │◀│ │ Historique des taches                              │ │
│ │   OK Auto       │ │ │                                                    │ │
│ │ o 51.210.45.67  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK Auto       │ │ │ │ Date        │ Operation      │ Cible   │Statut│ │ │
│ │                 │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │                 │ │ │ │ 02/01 10:15 │ Ajout regle    │ UDP:19  │ OK   │ │ │
│ │                 │ │ │ │ 01/01 16:30 │ Changement mode│ Auto    │ OK   │ │ │
│ │                 │ │ │ │ 28/12 14:00 │ Ajout regle    │ GRE:*   │ OK   │ │ │
│ │                 │ │ │ │ 25/12 09:15 │ Suppr. regle   │ ICMP:*  │ OK   │ │ │
│ │                 │ │ │ │ 20/12 11:30 │ Changement mode│ Permanent│ OK   │ │ │
│ │                 │ │ │ │ ...         │                │         │      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Legende: .. En cours  OK Succes  XX Erreur         │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: Taches
ETAT: Historique des operations de configuration
