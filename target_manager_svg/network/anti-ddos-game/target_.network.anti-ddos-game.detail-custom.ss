# SCREENSHOT: IP avec profil Custom
# NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP Custom selectionnee | NAV4: Profils

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC][Anti-DDoS Game]      │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 57.128.99.1                                  [...] │ │
│ │ ALL             │ │ │ Custom - Protection Game active                    │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Profils][Statistiques][Taches]     │ │
│ ├─────────────────┤ │ │                   ▲                                │ │
│ │ o Tous les svc  │ │ │                   └ ACTIF                          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.123.45 │ │ │ Profil de jeu                                      │ │
│ │   Minecraft     │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o 51.210.123.46 │ │ │ │ o Minecraft          o ARK: Survival           │ │ │
│ │   ARK           │ │ │ │ o CS2 / Source       o Rust                    │ │ │
│ │ o 141.94.12.34  │ │ │ │ o FiveM              o Valheim                 │ │ │
│ │   Rust          │ │ │ │ o Terraria           * Custom                  │ │ │
│ │ * 57.128.99.1   │◀│ │ └────────────────────────────────────────────────┘ │ │
│ │   Custom        │ │ │                                                    │ │
│ │                 │ │ │ Configuration Custom                               │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Ports configures                  [+ Ajouter] │ │ │
│ │                 │ │ │ │ ┌──────────────────────────────────────────┐  │ │ │
│ │                 │ │ │ │ │ 7000 │ UDP │ Game server           │ .. │  │ │ │
│ │                 │ │ │ │ │ 7001 │ UDP │ Voice chat            │ .. │  │ │ │
│ │                 │ │ │ │ │ 7002 │ TCP │ Admin panel           │ .. │  │ │ │
│ │                 │ │ │ │ └──────────────────────────────────────────┘  │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ Rate limit personnalise: 1000 pps             │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Enregistrer]                      [Reinitialiser] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP Custom selectionnee | NAV4: Profils
ETAT: Configuration Custom avec ports personnalises
