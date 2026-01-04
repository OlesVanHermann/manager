# SCREENSHOT: CDN - Modal Purger cache regle
# NAV1: Network | NAV2: CDN | Modal: Purger cache regle

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Purger le cache de la regle                                  [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Regle: Images - *.jpg, *.png, *.gif                               │    │
│   │                                                                    │    │
│   │  /!\\ Information                                                  │    │
│   │  Tous les fichiers correspondant au pattern de cette regle        │    │
│   │  seront purges du cache sur tous les POPs.                         │    │
│   │                                                                    │    │
│   │  Les prochaines requetes iront chercher le contenu frais          │    │
│   │  sur le serveur d'origine.                                         │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                       [Annuler]      [Purger]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page CDN
