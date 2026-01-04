# SCREENSHOT: Attaque en cours (alerte)
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 sous attaque | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.0/24                              [...] │ │
│ │ ALL             │ │ │ XX ATTAQUE EN COURS • Mitigation active            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * 51.210.x.0/24 │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   XX Attaque!   │ │ │ │ XX ATTAQUE DDOS EN COURS                       │ │ │
│ │ o 51.210.45.67  │ │ │ │                                                │ │ │
│ │   OK Auto       │ │ │ │ Type     : UDP Flood                           │ │ │
│ │ o 141.94.x.0/28 │ │ │ │ Volume   : 18.5 Gbps                           │ │ │
│ │   .. Permanent  │ │ │ │ Debut    : 02/01/2026 14:32:15                 │ │ │
│ │                 │ │ │ │ Duree    : 3min 45s                            │ │ │
│ │                 │ │ │ │ Statut   : OK Mitigation active                │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ Le trafic malveillant est filtre.              │ │ │
│ │                 │ │ │ │ Vos services restent accessibles.              │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Trafic temps reel                                  │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Clean    : 450 Mbps                            │ │ │
│ │                 │ │ │ │ Blocked  : 18.5 Gbps                           │ │ │
│ │                 │ │ │ │ Efficacy : 97.6%                               │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 sous attaque | NAV4: General
ETAT: Attaque DDoS en cours avec mitigation active
