# SCREENSHOT: vRack - Modal vRack non vide
# NAV1: Network | NAV2: vRack | Modal: Erreur non vide

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Impossible de resilier le vRack                             [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │                         /!\                                        │    │
│   │                                                                    │    │
│   │  Le vRack pn-123456 ne peut pas etre resilie car il contient      │    │
│   │  encore des services:                                              │    │
│   │                                                                    │    │
│   │  - 6 serveurs dedies                                               │    │
│   │  - 4 projets Public Cloud                                          │    │
│   │  - 2 Load Balancers                                                │    │
│   │                                                                    │    │
│   │  Veuillez d'abord retirer tous les services du vRack avant        │    │
│   │  de pouvoir le resilier.                                           │    │
│   │                                                                    │    │
│   │  [Voir les services]                                               │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                      [Fermer]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal erreur sur page vRack
