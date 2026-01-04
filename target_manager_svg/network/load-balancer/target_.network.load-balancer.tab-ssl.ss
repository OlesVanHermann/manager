# SCREENSHOT: LB selectionne - Tab SSL
# NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: SSL

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
│ ├─────────────────┤ │ │                                     ▲              │ │
│ │ o Tous les svc  │ │ │                                     └── ACTIF      │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * lb-prod    ◀  │ │ │ Certificats SSL (3)                    [+ Ajouter] │ │
│ │   OK GRA,RBX    │ │ │                                                    │ │
│ │ o lb-staging    │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK GRA        │ │ │ │ Domaine         │ Type        │Expire  │Stat│:│ │ │
│ │ o lb-dev        │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   !! GRA        │ │ │ │ *.example.com   │Let's Encrypt│15/03/26│ OK │:│ │ │
│ │                 │ │ │ │ api.example.com │Custom       │01/06/26│ OK │:│ │ │
│ │                 │ │ │ │ legacy.example  │Custom       │15/01/26│ !! │:│ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ !! 1 certificat expire dans moins de 30 jours      │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Types de certificats :                             │ │
│ │                 │ │ │ - Let's Encrypt : gratuit, renouvellement auto     │ │
│ │                 │ │ │ - Custom : certificat importe manuellement         │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [+ Generer Let's Encrypt] [+ Importer certificat] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Load Balancer | NAV3: Region (ALL) / lb-prod selectionne | NAV4: SSL
