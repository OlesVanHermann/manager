# SCREENSHOT: Subnet unitaire (Public Cloud) selectionnee
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 57.128.99.1 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 57.128.99.1                                  [...] │ │
│ │ ALL             │ │ │ IPv4 • Public Cloud • GRA                          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Informations                                       │ │
│ │ o 51.210.x.x/24 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ Adresse IP       │ 57.128.99.1                 │ │ │
│ │ IP unitaires    │ │ │ │ Version          │ IPv4                        │ │ │
│ │ o 51.210.45.67  │ │ │ │ Type             │ Floating IP                 │ │ │
│ │ o 141.94.12.34  │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │ * 57.128.99.1   │◀│ │ │ Firewall         │ -- Non gere (Security Group)│ │ │
│ │   Public Cloud  │ │ │ │ Mitigation       │ OK Auto                     │ │ │
│ │ o 2001:db8::1   │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │   Dedicated v6  │ │ │                                                    │ │
│ │                 │ │ │ Service associe                                    │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Type             │ Public Cloud Instance       │ │ │
│ │                 │ │ │ │ Projet           │ my-cloud-project            │ │ │
│ │                 │ │ │ │ Instance         │ instance-prod-web-01        │ │ │
│ │                 │ │ │ │ Flavor           │ b2-15                       │ │ │
│ │                 │ │ │ │ Region           │ GRA11                       │ │ │
│ │                 │ │ │ │ Statut           │ OK Attache                  │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Detacher IP] [Gerer mitigation] [Voir reverse]   │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 57.128.99.1 selectionne | NAV4: General
ETAT: Detail d'une Floating IP Public Cloud
