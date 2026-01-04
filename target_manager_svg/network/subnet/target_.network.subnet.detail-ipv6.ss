# SCREENSHOT: Subnetv6 selectionnee
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 2001:db8::1 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 2001:41d0:302:2200::1                        [...] │ │
│ │ ALL             │ │ │ IPv6 • Dedicated Server • GRA                      │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Informations                                       │ │
│ │ o 51.210.x.x/24 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Adresse IP       │ 2001:41d0:302:2200::1       │ │ │
│ │ IP unitaires    │ │ │ │ Version          │ IPv6                        │ │ │
│ │ o 51.210.45.67  │ │ │ │ Bloc parent      │ 2001:41d0:302:2200::/64     │ │ │
│ │ o 141.94.12.34  │ │ │ │ Type             │ Principale                  │ │ │
│ │ o 57.128.99.1   │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │ * 2001:db8::1   │◀│ │ │ Mitigation       │ OK Auto                     │ │ │
│ │   Dedicated v6  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Service associe                                    │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Type             │ Serveur dedie               │ │ │
│ │                 │ │ │ │ Nom              │ ns4567890.ip-51-210-45.eu   │ │ │
│ │                 │ │ │ │ Datacenter       │ GRA (Gravelines)            │ │ │
│ │                 │ │ │ │ Statut           │ OK Actif                    │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Gerer mitigation] [Voir reverse]                  │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 2001:db8::1 selectionne | NAV4: General
ETAT: Detail d'une adresse IPv6 sur Dedicated Server
