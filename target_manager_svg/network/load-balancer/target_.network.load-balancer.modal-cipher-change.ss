# SCREENSHOT: Load Balancer - Modal Modifier cipher suite
# NAV1: Network | NAV2: Load Balancer | Modal: Cipher suite

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Modifier la cipher suite                                     [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Load Balancer: lb-prod-web                                        │    │
│   │                                                                    │    │
│   │  Cipher suite                                                      │    │
│   │  ○ Compatible (TLS 1.0+)                                           │    │
│   │    Support des anciens navigateurs                                 │    │
│   │                                                                    │    │
│   │  ● Modern (TLS 1.2+) - Recommande                                  │    │
│   │    Securite maximale, navigateurs recents                          │    │
│   │                                                                    │    │
│   │  ○ Intermediate (TLS 1.1+)                                         │    │
│   │    Compromis securite/compatibilite                                │    │
│   │                                                                    │    │
│   │  /i\\ La modification sera effective immediatement sur tous        │    │
│   │  les frontends utilisant SSL.                                      │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                    [Annuler]      [Enregistrer]    │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
