# SCREENSHOT: Load Balancer - Modal Supprimer farm
# NAV1: Network | NAV2: Load Balancer | Modal: Supprimer farm

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Supprimer la ferme de serveurs                               [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Farm: farm-web                                                    │    │
│   │  Serveurs: 4                                                       │    │
│   │                                                                    │    │
│   │  /!\\ Attention                                                    │    │
│   │  Cette action supprimera la ferme et tous les serveurs associes.   │    │
│   │  Les frontends utilisant cette ferme perdront leur backend.        │    │
│   │                                                                    │    │
│   │  Frontends utilisant cette ferme:                                  │    │
│   │  • frontend-https (port 443)                                       │    │
│   │  • frontend-http (port 80)                                         │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Supprimer]     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
