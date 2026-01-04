# SCREENSHOT: Load Balancer - Modal Commander certificat SSL
# NAV1: Network | NAV2: Load Balancer | Modal: Commander SSL

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Commander un certificat SSL                                   [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Type de certificat                                                │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ ● Let's Encrypt (gratuit)                                  │   │    │
│   │  │   Certificat DV automatique, renouvele tous les 90 jours   │   │    │
│   │  │                                                            │   │    │
│   │  │ ○ Certificat Sectigo DV                                    │   │    │
│   │  │   Certificat DV valide 1 an - 49.99 EUR/an                 │   │    │
│   │  │                                                            │   │    │
│   │  │ ○ Certificat Sectigo EV                                    │   │    │
│   │  │   Certificat EV avec barre verte - 199.99 EUR/an           │   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  Domaine *                                                         │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ www.example.com                                            │   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  /i\ Pour Let's Encrypt, le domaine doit pointer vers le LB.      │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                    [Annuler]      [Commander]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
