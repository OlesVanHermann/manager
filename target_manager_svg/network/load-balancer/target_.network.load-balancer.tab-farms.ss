# SCREENSHOT: LB selectionne - Tab Fermes
# NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Fermes

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
│ ├─────────────────┤ │ │                  ▲                                 │ │
│ │ o Tous les svc  │ │ │                  └── ACTIF                         │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * lb-prod    ◀  │ │ │ Fermes de serveurs (3)                   [+ Creer] │ │
│ │   OK GRA,RBX    │ │ │                                                    │ │
│ │ o lb-staging    │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK GRA        │ │ │ │ Ferme     │Port│Proto│Balance │Serv. │Stat│ : │ │ │
│ │ o lb-dev        │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   !! GRA        │ │ │ │ farm-web  │ 80 │HTTP │RoundRob│ 4/4OK│ OK │ : │ │ │
│ │                 │ │ │ │ farm-api  │8080│HTTP │LeastCon│ 3/4!!│ OK │ : │ │ │
│ │                 │ │ │ │ farm-ws   │ 443│TCP  │Source  │ 2/2OK│ OK │ : │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Legende balance:                                   │ │
│ │                 │ │ │ RoundRobin | LeastConn | Source | URI             │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Appliquer la configuration]                       │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Fermes
