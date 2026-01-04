# SCREENSHOT: LB selectionne - Tab Taches
# NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Taches

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ LB Production                              [...]  │ │
│ │ ALL             │ │ │ IP: 51.210.x.x - GRA,RBX - OK                      │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Fermes][Frontends][SSL][Taches]    │ │
│ ├─────────────────┤ │ │                                          ▲         │ │
│ │ o Tous les svc  │ │ │                                          └ ACTIF   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * lb-prod    ◀  │ │ │ Historique des taches                              │ │
│ │   OK GRA,RBX    │ │ │                                                    │ │
│ │ o lb-staging    │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK GRA        │ │ │ │ Date        │ Operation        │ Cible  │Statut│ │ │
│ │                 │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │                 │ │ │ │ 02/01 14:32 │ Refresh config   │ -      │  --  │ │ │
│ │                 │ │ │ │ 02/01 14:30 │ Ajout serveur    │farm-web│  OK  │ │ │
│ │                 │ │ │ │ 02/01 10:15 │ Creation frontend│f-api   │  OK  │ │ │
│ │                 │ │ │ │ 01/01 18:00 │ SSL renouvele    │*.ex.com│  OK  │ │ │
│ │                 │ │ │ │ 01/01 16:30 │ Refresh config   │ -      │  OK  │ │ │
│ │                 │ │ │ │ 01/01 16:25 │ Modif. ferme     │farm-api│  OK  │ │ │
│ │                 │ │ │ │ 31/12 14:00 │ Creation ferme   │farm-ws │  OK  │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Legende: -- En cours  OK Succes  !! Erreur         │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Taches
