# SCREENSHOT: CDN - Modal Activer regle
# NAV1: Network | NAV2: CDN | Modal: Activer regle

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Activer la regle de cache                                   [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Regle: Images - *.jpg, *.png, *.gif                               │    │
│   │  TTL: 30 jours                                                     │    │
│   │                                                                    │    │
│   │  Cette regle sera appliquee immediatement sur tous les POPs.       │    │
│   │                                                                    │    │
│   │  Les fichiers correspondant au pattern seront mis en cache         │    │
│   │  pendant la duree specifiee.                                       │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                      [Annuler]      [Activer]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page CDN
