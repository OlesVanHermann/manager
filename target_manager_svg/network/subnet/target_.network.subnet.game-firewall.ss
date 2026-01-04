# SCREENSHOT: Subnet - Game Firewall
# NAV1: Network | NAV2: Subnet | NAV3: General | Game Firewall

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ IP > 51.210.45.67 > Game Firewall                  │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │                                    [+Ajouter regle] │ │
│ │ GRA             │ │ │                                                    │ │
│ ├─────────────────┤ │ │ Statut: [Actif]                    [Desactiver]    │ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ Mode anti-DDoS Game: [Actif]                       │ │
│ │ • Tous les svc  │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ ○ 51.210.45.67  │◀│ │ │ #  │ Action │ Proto │ Ports    │ Description  │ │ │
│ │   Game Server   │ │ │ ├────┼────────┼───────┼──────────┼──────────────┤ │ │
│ │                 │ │ │ │ 1  │ ACCEPT │ UDP   │ 27015    │ Source Eng.  │ │ │
│ │                 │ │ │ │ 2  │ ACCEPT │ UDP   │ 27020    │ RCON         │ │ │
│ │                 │ │ │ │ 3  │ ACCEPT │ TCP   │ 27015    │ Steam Query  │ │ │
│ │                 │ │ │ │ 4  │ DROP   │ ALL   │ ALL      │ Default      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: General | IP selectionne > Game Firewall
ETAT: Configuration du firewall gaming optimise
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
