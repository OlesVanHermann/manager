# SCREENSHOT: Load Balancer - Modal IP Failover
# NAV1: Network | NAV2: Load Balancer | Modal: IP Failover

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Associer une IP Failover                                     [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Load Balancer: lb-prod-web                                        │    │
│   │  IP publique: 51.210.45.100                                        │    │
│   │                                                                    │    │
│   │  IP Failover a associer                                            │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ 51.210.45.200 (disponible)                              [v]│   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  /i\\ Information                                                  │    │
│   │  L'IP failover sera utilisee comme adresse de sortie pour les     │    │
│   │  connexions vers les backends. Cela permet de conserver la meme    │    │
│   │  IP source en cas de failover.                                     │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Associer]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
