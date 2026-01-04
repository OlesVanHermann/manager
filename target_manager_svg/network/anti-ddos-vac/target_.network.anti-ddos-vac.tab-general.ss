# SCREENSHOT: Subnet selectionne - Tab General
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ 51.210.123.0/24                              [...] │ │
│ ├─────────────────┤ │ │ OK Protection active • Mode: Auto                  │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │       [Taches]               ▲                     │ │
│ │ Rechercher...   │ │ │                              └ ACTIF               │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc    │ │ │ Informations                                       │ │
│ ├─────────────────┤ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ * 51.210.x.0/24 │◀│ │ │ IP/Subnet        │ 51.210.123.0/24             │ │ │
│ │   OK Auto       │ │ │ │ Mode mitigation  │ OK Automatique              │ │ │
│ │ o 51.210.45.67  │ │ │ │ Seuil detection  │ 1000 Mbps                   │ │ │
│ │   OK Auto       │ │ │ │ Regles perman.   │ 2                           │ │ │
│ │ o 141.94.x.0/28 │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │   .. Permanent  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │ o 57.128.99.1   │ │ │                                                    │ │
│ │   XX Desactive  │ │ │ Resume (30 jours)                                  │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Attaques         │ 12                          │ │ │
│ │                 │ │ │ │ Volume bloque    │ 456 GB                      │ │ │
│ │                 │ │ │ │ Duree totale     │ 2h 34min                    │ │ │
│ │                 │ │ │ │ Derniere attaque │ 01/01/2026 14:32            │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Modifier mode] [Configurer regles]               │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: General
ETAT: Detail protection Anti-DDoS pour un subnet
