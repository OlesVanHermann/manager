# SCREENSHOT: OVHcloud Connect - Tab Statistiques
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Statistiques

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
│ │ Region      [v] │ │ │ NAV4: [Vue generale][POPs][Datacenters][Stats •]  │ │
│ │ PAR             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Periode: [Dernieres 24h v]                         │ │
│ │ [Rechercher...] │ │ │                                                    │ │
│ ├─────────────────┤ │ │ Bande passante                                     │ │
│ │ ○ occ-prod-fr   │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   PAR-TH2       │ │ │ │ 8 Gbps ┃                    ╭────────╮        │ │ │
│ │                 │ │ │ │ 6 Gbps ┃         ╭─────────╯        ╰─────    │ │ │
│ │                 │ │ │ │ 4 Gbps ┃    ╭────╯                            │ │ │
│ │                 │ │ │ │ 2 Gbps ┃────╯                                  │ │ │
│ │                 │ │ │ │        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │ │
│ │                 │ │ │ │        00:00   06:00   12:00   18:00   24:00   │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ ─ Entrant (RX)  ─ Sortant (TX)                     │ │
│ │                 │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: OVHcloud Connect | NAV3: General | NAV4: Statistiques
ETAT: Graphiques de bande passante
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
