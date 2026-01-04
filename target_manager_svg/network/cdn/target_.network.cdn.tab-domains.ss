# SCREENSHOT: CDN selectionne - Tab Domaines
# NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: Domaines

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
│ ├─────────────────┤ │ │                  ▲                                 │ │
│ │ o Tous les svc  │ │ │                  └── ACTIF                         │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * cdn-prod   ◀  │ │ │ Domaines configures (12)              [+ Ajouter] │ │
│ │   OK            │ │ │                                                    │ │
│ │ o cdn-staging   │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK            │ │ │ │ Domaine          │Origine    │SSL│ TTL │Stat│:│ │ │
│ │ o cdn-legacy    │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │   OK            │ │ │ │ www.example.com  │51.210.x.x │ OK│ 24h │ OK │:│ │ │
│ │                 │ │ │ │ static.example   │s3.ovh.net │ OK│  7j │ OK │:│ │ │
│ │                 │ │ │ │ api.example.com  │51.210.x.x │ OK│  0  │ OK │:│ │ │
│ │                 │ │ │ │ img.example.com  │s3.ovh.net │ OK│ 30j │ OK │:│ │ │
│ │                 │ │ │ │ cdn.example.com  │51.210.x.x │ OK│ 24h │ OK │:│ │ │
│ │                 │ │ │ │ ...              │           │   │     │    │ │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Legende TTL: 0 = no-cache (pass-through)           │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: Domaines
