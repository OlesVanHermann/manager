# SCREENSHOT: Load Balancer - Modal Supprimer frontend
# NAV1: Network | NAV2: Load Balancer | Modal: Supprimer frontend

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Supprimer le frontend                                        [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Frontend: frontend-https                                          │    │
│   │  Port: 443                                                         │    │
│   │  Farm: farm-web                                                    │    │
│   │                                                                    │    │
│   │  /!\\ Attention                                                    │    │
│   │  Le trafic sur le port 443 ne sera plus route vers la ferme.       │    │
│   │  Cette action prend effet immediatement.                           │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Supprimer]     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
