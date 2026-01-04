# SCREENSHOT: LB selectionne - Tab Frontends
# NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Frontends

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ LB Production                              [...]  │ │
│ │ ALL             │ │ │ IP: 51.210.x.x - GRA,RBX - OK                      │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Fermes][Frontends][SSL][Taches]    │ │
│ ├─────────────────┤ │ │                        ▲                           │ │
│ │ o Tous les svc  │ │ │                        └── ACTIF                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * lb-prod    ◀  │ │ │ Frontends (3)                            [+ Creer] │ │
│ │   OK GRA,RBX    │ │ │                                                    │ │
│ │ o lb-staging    │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK GRA        │ │ │ │ Frontend   │Port│Proto│Ferme    │SSL│Stat│ :  │ │ │
│ │ o lb-dev        │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   !! GRA        │ │ │ │ front-https│443 │HTTPS│farm-web │ OK│ OK │ :  │ │ │
│ │                 │ │ │ │ front-http │ 80 │HTTP │farm-web │ --│ OK │ :  │ │ │
│ │                 │ │ │ │ front-api  │8443│HTTPS│farm-api │ OK│ OK │ :  │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Options configurables par frontend:                │ │
│ │                 │ │ │ - Port d'ecoute (1-65535)                          │ │
│ │                 │ │ │ - Protocole (HTTP, HTTPS, TCP)                     │ │
│ │                 │ │ │ - Ferme par defaut                                 │ │
│ │                 │ │ │ - Certificat SSL (si HTTPS)                        │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Appliquer la configuration]                       │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: Frontends
