# SCREENSHOT: CDN selectionne - Tab SSL
# NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: SSL

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ POP         [v] │ │ │ cdn-prod.ovh.net                    [Vider cache] │ │
│ │ ALL             │ │ │ OK - Anycast: 1.2.3.4                              │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Domaines][Cache][SSL][Stats][Taches]│
│ ├─────────────────┤ │ │                              ▲                     │ │
│ │ o Tous les svc  │ │ │                              └── ACTIF             │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * cdn-prod   ◀  │ │ │ Certificats SSL (4)                    [+ Ajouter] │ │
│ │   OK            │ │ │                                                    │ │
│ │ o cdn-staging   │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK            │ │ │ │ Domaine         │ Type        │Expire  │Stat│:│ │ │
│ │ o cdn-legacy    │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   OK            │ │ │ │ www.example.com │Let's Encrypt│15/03/26│ OK │:│ │ │
│ │                 │ │ │ │ *.example.com   │Custom       │01/06/26│ OK │:│ │ │
│ │                 │ │ │ │ static.example  │Let's Encrypt│20/02/26│ OK │:│ │ │
│ │                 │ │ │ │ api.example.com │Let's Encrypt│10/01/26│ !! │:│ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ !! 1 certificat expire dans moins de 30 jours      │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [+ Generer Let's Encrypt] [+ Importer certificat] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: SSL
