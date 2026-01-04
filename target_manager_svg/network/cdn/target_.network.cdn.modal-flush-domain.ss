# SCREENSHOT: CDN - Modal Purger cache domaine
# NAV1: Network | NAV2: CDN | Modal: Purger cache domaine

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Purger le cache du domaine                                   [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Domaine: cdn.example.com                                          │    │
│   │                                                                    │    │
│   │  Type de purge                                                     │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ Purge complete                                          [v]│   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  /!\\ Information                                                  │    │
│   │  La purge complete supprimera tout le contenu en cache pour       │    │
│   │  ce domaine sur tous les POPs. Cette operation peut prendre       │    │
│   │  quelques minutes.                                                 │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                       [Annuler]      [Purger]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page CDN
