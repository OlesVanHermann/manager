# SCREENSHOT: OVHcloud Connect - Tab Service Keys
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Service Keys

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ OVHcloud Connect > occ-prod-fr                     │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [Vue generale][POPs][Service Keys •]        │ │
│ │ PAR             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │                              [+Generer nouvelle cle]│ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ ○ occ-prod-fr   │◀│ │ │ Cle           │ Creation    │ Statut │ ...   │ │ │
│ │   PAR-TH2       │ │ │ ├───────────────┼─────────────┼────────┼───────┤ │ │
│ │                 │ │ │ │ sk-abc123...  │ 01/01/2026  │ [Actif]│ [⋮]   │ │ │
│ │                 │ │ │ │ sk-def456...  │ 15/12/2025  │ [Revoke]│ [⋮]   │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ /i\\ Les service keys sont utilises pour           │ │
│ │                 │ │ │ l'authentification lors de la configuration.       │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Service Keys
ETAT: Liste des cles de service
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
