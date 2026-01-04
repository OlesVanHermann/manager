# SCREENSHOT: OVHcloud Connect - Vue liste principale
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
│                                                      ▲                       │
│                                                      └ ACTIF                 │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ OVHcloud Connect                  [+Commander]    │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │                                                    │ │
│ │ ALL             │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Nom           │ POP     │ vRack   │ Statut    │ │ │
│ │ [Rechercher...] │ │ │ ├───────────────┼─────────┼─────────┼───────────┤ │ │
│ ├─────────────────┤ │ │ │ occ-prod-fr   │ PAR-TH2 │ pn-123  │ [Actif]   │ │ │
│ │ • Tous les svc  │ │ │ │ occ-backup    │ FRA-AM2 │ pn-456  │ [Actif]   │ │ │
│ ├─────────────────┤ │ │ │ occ-dev       │ PAR-TH2 │ --      │ [Pending] │ │ │
│ │ ○ occ-prod-fr   │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   PAR-TH2       │ │ │                                                    │ │
│ │ ○ occ-backup    │ │ │ 3 connexions OVHcloud Connect                      │ │
│ │   FRA-AM2       │ │ │                                                    │ │
│ │ ○ occ-dev       │ │ │                                                    │ │
│ │   PAR-TH2       │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | Tous les services selectionne
ETAT: Vue liste de toutes les connexions OVHcloud Connect
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
