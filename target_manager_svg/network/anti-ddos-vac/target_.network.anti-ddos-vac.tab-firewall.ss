# SCREENSHOT: Security - Tab Firewall
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service | NAV4: Firewall

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ 51.210.123.0/24                               [..] │ │
│ ├─────────────────┤ │ │ OK Protection active - Mode: Auto                  │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Statistiques][Firewall][Trafic]    │ │
│ ├─────────────────┤ │ │                                ▲       [Taches]    │ │
│ │ [Rechercher...] │ │ │                                └ ACTIF             │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc  │ │ │ Regles de firewall permanent (3)      [+ Ajouter] │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ * 51.210.x.0/24 │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK Auto       │ │ │ │ Regle     │ Proto │ Port │ Action  │ Stat │ .. │ │ │
│ │ o 51.210.45.67  │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   OK Auto       │ │ │ │ Block GRE │ GRE   │  *   │ Bloquer │  OK  │ .. │ │ │
│ │                 │ │ │ │ Limit DNS │ UDP   │  53  │ Limiter │  OK  │ .. │ │ │
│ │                 │ │ │ │ Block NTP │ UDP   │ 123  │ Bloquer │  OK  │ .. │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Ces regles sont appliquees en permanence,          │ │
│ │                 │ │ │ meme sans attaque detectee.                        │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Actions: Bloquer, Limiter (rate limit), Autoriser  │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / service | NAV4: Firewall
