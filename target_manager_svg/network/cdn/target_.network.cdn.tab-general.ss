# SCREENSHOT: CDN selectionne - Tab General
# NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: General

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
│ ├─────────────────┤ │ │          ▲                                         │ │
│ │ o Tous les svc  │ │ │          └── ACTIF                                 │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * cdn-prod   ◀  │ │ │ Informations                                       │ │
│ │   OK            │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ o cdn-staging   │ │ │ │ Service          │ cdn-prod.ovh.net            │ │ │
│ │   OK            │ │ │ │ Anycast          │ 1.2.3.4                     │ │ │
│ │ o cdn-legacy    │ │ │ │ Offre            │ CDN Infrastructure          │ │ │
│ │   OK            │ │ │ │ Domaines         │ 12 configures               │ │ │
│ │                 │ │ │ │ Statut           │ OK                          │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Metriques (24h)                                    │ │
│ │                 │ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │                 │ │ │ │ Requetes  │ │ Hit Rate  │ │ Bande pass│         │ │
│ │                 │ │ │ │ 2.3M      │ │ 89.2%     │ │ 156 GB    │         │ │
│ │                 │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: General
