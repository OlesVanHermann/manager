# SCREENSHOT: Load Balancer - Modal Supprimer certificat
# NAV1: Network | NAV2: Load Balancer | Modal: Supprimer SSL

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Supprimer le certificat SSL                                  [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Certificat: example.com                                           │    │
│   │  Type: Custom                                                      │    │
│   │  Expiration: 15/06/2026                                            │    │
│   │                                                                    │    │
│   │  /!\\ Attention                                                    │    │
│   │  Les frontends utilisant ce certificat passeront en HTTP ou        │    │
│   │  utiliseront le certificat par defaut.                             │    │
│   │                                                                    │    │
│   │  Frontends concernes:                                              │    │
│   │  • frontend-https (port 443)                                       │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Supprimer]     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
