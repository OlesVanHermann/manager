# SCREENSHOT: Attaque en cours sur serveur de jeu
# NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP sous attaque | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC][Anti-DDoS Game]      │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.45                                [...] │ │
│ │ ALL             │ │ │ XX ATTAQUE EN COURS - Mitigation active            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Profils][Statistiques][Taches]     │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * 51.210.123.45 │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   XX Attaque!   │ │ │ │ XX ATTAQUE DDOS EN COURS                       │ │ │
│ │ o 51.210.123.46 │ │ │ │                                                │ │ │
│ │   ARK           │ │ │ │ Type     : Query Flood                         │ │ │
│ │ o 141.94.12.34  │ │ │ │ Volume   : 1.2M queries/s                      │ │ │
│ │   Rust          │ │ │ │ Debut    : 02/01/2026 20:15:32                 │ │ │
│ │                 │ │ │ │ Duree    : 5min 12s                            │ │ │
│ │                 │ │ │ │ Statut   : OK Mitigation active                │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ Les joueurs peuvent continuer a jouer.         │ │ │
│ │                 │ │ │ │ Trafic malveillant filtre en temps reel.       │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Metriques temps reel                               │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Joueurs connectes│ 89                          │ │ │
│ │                 │ │ │ │ Queries legitimes│ 450/s                       │ │ │
│ │                 │ │ │ │ Queries bloquees │ 1.2M/s                      │ │ │
│ │                 │ │ │ │ Efficacite       │ 99.96%                      │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / IP sous attaque | NAV4: General
ETAT: Attaque en cours avec mitigation active - metriques temps reel
