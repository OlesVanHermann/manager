# SCREENSHOT: Load Balancer - Modal Resilier
# NAV1: Network | NAV2: Load Balancer | Modal: Resilier

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Resilier le Load Balancer                                     [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  /!\ Attention - Action irreversible                               │    │
│   │                                                                    │    │
│   │  Vous etes sur le point de resilier le load balancer:              │    │
│   │                                                                    │    │
│   │  Nom: lb-prod-web                                                  │    │
│   │  Region: GRA                                                       │    │
│   │  IP: 51.210.xxx.xxx                                                │    │
│   │                                                                    │    │
│   │  Cette action va:                                                  │    │
│   │  • Supprimer definitivement le load balancer                       │    │
│   │  • Liberer l'adresse IP associee                                   │    │
│   │  • Supprimer tous les frontends et farms configures                │    │
│   │  • Interrompre immediatement le trafic                             │    │
│   │                                                                    │    │
│   │  Pour confirmer, tapez "TERMINATE":                                │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │                                                            │   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                   [Annuler]      [Resilier]        │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
