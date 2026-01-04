# SCREENSHOT: Filtre Region applique
# NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / Region (GRA) filtre actif | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC][Anti-DDoS Game]      │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ Anti-DDoS Game - Vue d'ensemble (GRA)             │ │
│ │ EU-West(GRA.FR) │ │ │ Protection specialisee pour serveurs de jeux       │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Profils][Statistiques][Taches]     │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ * Tous les svc  │◀│ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.123.45 │ │ │ Filtre actif: EU-West (GRA.FR)        [x Effacer] │ │
│ │   Minecraft     │ │ │                                                    │ │
│ │ o 51.210.123.46 │ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │   ARK           │ │ │ │ IPs (GRA) │ │ Profils   │ │Attaques30j│         │ │
│ │ o 57.128.99.1   │ │ │ │ 12        │ │ 12        │ │ 45        │         │ │
│ │   Custom        │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │ o 51.210.123.47 │ │ │                                                    │ │
│ │   CS2           │ │ │ i Affichage des serveurs de jeux de la region GRA │ │
│ │                 │ │ │                                                    │ │
│ │  ┌───────────┐  │ │ │                                                    │ │
│ │  │141.94...  │  │ │ │                                                    │ │
│ │  │ (RBX)     │  │ │ │                                                    │ │
│ │  │  masque   │  │ │ │                                                    │ │
│ │  └───────────┘  │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS Game | NAV3: General / Region (GRA) filtre actif | NAV4: General
ETAT: Vue filtree par region - elements non-matchants masques
