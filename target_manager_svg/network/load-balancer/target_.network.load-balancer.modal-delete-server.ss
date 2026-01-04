# SCREENSHOT: Load Balancer - Modal Supprimer serveur
# NAV1: Network | NAV2: Load Balancer | Modal: Supprimer serveur

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Supprimer le serveur                                         [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Serveur: web-01                                                   │    │
│   │  IP: 10.0.0.11                                                     │    │
│   │  Farm: farm-web                                                    │    │
│   │                                                                    │    │
│   │  /!\\ Attention                                                    │    │
│   │  Ce serveur ne recevra plus de trafic de ce load balancer.         │    │
│   │  Les connexions existantes seront terminees proprement.            │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Supprimer]     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
