# SCREENSHOT: IP Game selectionnee - Tab Profils
# NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP selectionnee | NAV4: Profils

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC][Anti-DDoS Game]      │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.45                                [...] │ │
│ │ ALL             │ │ │ Minecraft - Protection Game active                 │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Profils][Statistiques][Taches]     │ │
│ ├─────────────────┤ │ │                   ▲                                │ │
│ │ o Tous les svc  │ │ │                   └ ACTIF                          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * 51.210.123.45 │◀│ │ Profil de jeu                                      │ │
│ │   Minecraft     │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o 51.210.123.46 │ │ │ │ Selectionnez le profil correspondant :         │ │ │
│ │   ARK           │ │ │ │                                                │ │ │
│ │ o 141.94.12.34  │ │ │ │ * Minecraft          o ARK: Survival           │ │ │
│ │   Rust          │ │ │ │ o CS2 / Source       o Rust                    │ │ │
│ │                 │ │ │ │ o FiveM              o Valheim                 │ │ │
│ │                 │ │ │ │ o Terraria           o Custom                  │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Configuration ports                  [+ Ajouter]  │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Port  │ Protocole │ Description          │ .. │ │ │
│ │                 │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │                 │ │ │ │ 25565 │ TCP + UDP │ Minecraft Java       │ .. │ │ │
│ │                 │ │ │ │ 19132 │ UDP       │ Minecraft Bedrock    │ .. │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Options de filtrage                                │ │
│ │                 │ │ │ [x] Filtrage Query intelligent                     │ │
│ │                 │ │ │ [x] Protection contre les bots                     │ │
│ │                 │ │ │ [x] Rate limiting adaptatif                        │ │
│ │                 │ │ │ [ ] Mode strict !                                  │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Enregistrer]                      [Reinitialiser] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP selectionnee | NAV4: Profils
ETAT: Configuration du profil de jeu et des ports
