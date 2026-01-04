# SCREENSHOT: IP avec profil ARK
# NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP ARK selectionnee | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC][Anti-DDoS Game]      │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.46                                [...] │ │
│ │ ALL             │ │ │ ARK: Survival - Protection Game active             │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Profils][Statistiques][Taches]     │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.123.45 │ │ │ Informations                                       │ │
│ │   Minecraft     │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ * 51.210.123.46 │◀│ │ │ IP               │ 51.210.123.46               │ │ │
│ │   ARK           │ │ │ │ Profil actif     │ ARK: Survival Evolved       │ │ │
│ │ o 141.94.12.34  │ │ │ │ Port principal   │ 7777                        │ │ │
│ │   Rust          │ │ │ │ Protocole        │ UDP                         │ │ │
│ │                 │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Ports configures                                   │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ 7777 (UDP) - Game port                         │ │ │
│ │                 │ │ │ │ 7778 (UDP) - Raw UDP                           │ │ │
│ │                 │ │ │ │ 27015 (UDP) - Query port                       │ │ │
│ │                 │ │ │ │ 27020 (TCP) - RCON                             │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Modifier profil] [Configurer filtrage]           │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP ARK selectionnee | NAV4: General
ETAT: Details de l'IP avec profil ARK et ses ports specifiques
