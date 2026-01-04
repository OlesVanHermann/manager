# SCREENSHOT: Filtre Region applique
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / Region (GRA) filtre actif | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ Anti-DDoS VAC - Vue d'ensemble (GRA)              │ │
│ │ EU-West(GRA.FR) │ │ │ Protection DDoS incluse avec vos services          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ * Tous les svc  │◀│ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.x.0/24 │ │ │ Filtre actif: EU-West (GRA.FR)        [x Effacer] │ │
│ │   OK Auto       │ │ │                                                    │ │
│ │ o 51.210.45.67  │ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │   OK Auto       │ │ │ │IPs (GRA)  │ │Attaques30j│ │Vol. bloque│         │ │
│ │ o 57.128.99.1   │ │ │ │ 186       │ │ 32        │ │ 1.8 TB    │         │ │
│ │   XX Desactive  │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │                 │ │ │                                                    │ │
│ │  ┌───────────┐  │ │ │ i Affichage des IP/subnets de la region GRA       │ │
│ │  │141.94.x   │  │ │ │                                                    │ │
│ │  │ (RBX)     │  │ │ │                                                    │ │
│ │  │  masque   │  │ │ │                                                    │ │
│ │  └───────────┘  │ │ │                                                    │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / Region (GRA) filtre actif | NAV4: General
ETAT: Vue filtree par region - elements non-matchants masques
