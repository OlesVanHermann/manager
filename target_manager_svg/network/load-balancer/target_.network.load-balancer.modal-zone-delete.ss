# SCREENSHOT: Load Balancer - Modal Supprimer zone
# NAV1: Network | NAV2: Load Balancer | Modal: Supprimer zone

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Supprimer une zone                                            [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Load Balancer: lb-prod-web                                        │    │
│   │                                                                    │    │
│   │  Zone a supprimer                                                  │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ SBG - Strasbourg (France)                                  │   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  /!\ Attention                                                     │    │
│   │  La suppression de cette zone va:                                  │    │
│   │  • Retirer les serveurs de cette zone du pool                      │    │
│   │  • Rediriger le trafic vers les autres zones                       │    │
│   │  • Supprimer les IP anycast de cette zone                          │    │
│   │                                                                    │    │
│   │  Cette action prendra effet immediatement.                         │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                   [Annuler]      [Supprimer]       │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
