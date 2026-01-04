# SCREENSHOT: Subnet unitaire (VPS) selectionnee
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 141.94.12.34 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 141.94.12.34                                 [...] │ │
│ │ ALL             │ │ │ IPv4 • VPS • RBX                                   │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Informations                                       │ │
│ │ o 51.210.x.x/24 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ o 10.0.0.0/16   │ │ │ │ Adresse IP       │ 141.94.12.34                │ │ │
│ ├─────────────────┤ │ │ │ Version          │ IPv4                        │ │ │
│ │ IP unitaires    │ │ │ │ Type             │ Principale                  │ │ │
│ │ o 51.210.45.67  │ │ │ │ Region           │ EU-West (RBX.FR)            │ │ │
│ │   Dedicated     │ │ │ │ Firewall         │ OK Actif                    │ │ │
│ │ * 141.94.12.34  │◀│ │ │ Mitigation       │ OK Auto                     │ │ │
│ │   VPS           │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │ o 57.128.99.1   │ │ │                                                    │ │
│ │   Public Cloud  │ │ │ Service associe                                    │ │
│ │ o 2001:db8::1   │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │   Dedicated v6  │ │ │ │ Type             │ VPS                         │ │ │
│ │                 │ │ │ │ Nom              │ vps-abc123def.vps.ovh.net   │ │ │
│ │                 │ │ │ │ Offre            │ VPS Starter                 │ │ │
│ │                 │ │ │ │ Datacenter       │ RBX (Roubaix)               │ │ │
│ │                 │ │ │ │ Statut           │ OK Actif                    │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Configurer FW] [Gerer mitigation] [Voir reverse] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 141.94.12.34 selectionne | NAV4: General
ETAT: Detail d'une IP principale VPS
