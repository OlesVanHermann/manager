# SCREENSHOT: CDN - Modal Desactiver regle
# NAV1: Network | NAV2: CDN | Modal: Desactiver regle

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Desactiver la regle de cache                                [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Regle: Images - *.jpg, *.png, *.gif                               │    │
│   │                                                                    │    │
│   │  /!\ Attention                                                     │    │
│   │  Les fichiers correspondant a cette regle ne seront plus mis       │    │
│   │  en cache. Ils seront servis directement depuis l'origine.         │    │
│   │                                                                    │    │
│   │  Le cache existant sera conserve jusqu'a expiration.               │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                    [Annuler]     [Desactiver]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page CDN
