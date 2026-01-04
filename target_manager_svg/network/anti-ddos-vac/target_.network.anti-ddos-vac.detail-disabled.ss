# SCREENSHOT: IP avec protection Desactivee (warning)
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 57.128.99.1 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 57.128.99.1                                  [...] │ │
│ │ ALL             │ │ │ XX Protection desactivee                           │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.x.0/24 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK Auto       │ │ │ │ ! AVERTISSEMENT                               │ │ │
│ │ o 51.210.45.67  │ │ │ │                                                │ │ │
│ │   OK Auto       │ │ │ │ La protection Anti-DDoS est desactivee pour    │ │ │
│ │ o 141.94.x.0/28 │ │ │ │ cette IP. Votre service est vulnerable aux     │ │ │
│ │   .. Permanent  │ │ │ │ attaques DDoS.                                 │ │ │
│ │ * 57.128.99.1   │◀│ │ │                                                │ │ │
│ │   XX Desactive  │ │ │ │ [Reactiver la protection]                      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Informations                                       │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ IP               │ 57.128.99.1                 │ │ │
│ │                 │ │ │ │ Mode mitigation  │ XX Desactive                │ │ │
│ │                 │ │ │ │ Desactive depuis │ 15/12/2025                  │ │ │
│ │                 │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 57.128.99.1 selectionne | NAV4: General
ETAT: Protection desactivee - warning avec action pour reactiver
