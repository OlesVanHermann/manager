# SCREENSHOT: Filtre POP selectionne
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (Equinix PA3) filtre actif

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ OVHcloud Connect - Vue (Equinix PA3)[+ Commander] │ │
│ │ ALL             │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ NAV4: [General][Datacenter][POP][Interfaces]       │ │
│ │ POP         [v] │ │ │                ▲                                   │ │
│ │ Equinix PA3     │ │ │                └ ACTIF                             │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ Filtre actif: Equinix PA3            [x Effacer] │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ * Tous les svc  │◀│ │ ┌───────────┐ ┌───────────┐                       │ │
│ ├─────────────────┤ │ │ │ Connexions│ │ Bande pass│                       │ │
│ │ o occ-prod-par  │ │ │ │ 1         │ │ 10 Gbps   │                       │ │
│ │   OK Direct•PAR │ │ │ └───────────┘ └───────────┘                       │ │
│ │                 │ │ │                                                    │ │
│ │  ┌───────────┐  │ │ │ Connexions dans ce POP                             │ │
│ │  │occ-backup │  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │  │ (FRA)     │  │ │ │ │ Service       │ Type  │ Datacenter │ Statut   │ │ │
│ │  │  masque   │  │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │  └───────────┘  │ │ │ │ occ-prod-par  │ Direct│ PAR DC     │ OK       │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (Equinix PA3) filtre actif | NAV4: General
ETAT: Vue filtree par POP - connexions masquees non matchantes
