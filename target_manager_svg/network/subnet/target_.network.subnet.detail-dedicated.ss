# SCREENSHOT: Subnet unitaire (Dedicated Server) selectionnee
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.45.67 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.45.67                                 [...] │ │
│ │ ALL             │ │ │ IPv4 • Dedicated Server • GRA                      │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Informations                                       │ │
│ │ o 51.210.x.x/24 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ o 10.0.0.0/16   │ │ │ │ Adresse IP       │ 51.210.45.67                │ │ │
│ │ o 192.99.x.x/28 │ │ │ │ Version          │ IPv4                        │ │ │
│ ├─────────────────┤ │ │ │ Type             │ Principale                  │ │ │
│ │ IP unitaires    │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │ * 51.210.45.67  │◀│ │ │ Firewall         │ OK Actif                    │ │ │
│ │   Dedicated     │ │ │ │ Mitigation       │ OK Auto                     │ │ │
│ │ o 141.94.12.34  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │   VPS           │ │ │                                                    │ │
│ │ o 57.128.99.1   │ │ │ Service associe                                    │ │
│ │   Public Cloud  │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ o 2001:db8::1   │ │ │ │ Type             │ Serveur dedie               │ │ │
│ │   Dedicated v6  │ │ │ │ Nom              │ ns1234567.ip-51-210-45.eu   │ │ │
│ │                 │ │ │ │ Offre            │ Advance-1 Gen2              │ │ │
│ │                 │ │ │ │ Datacenter       │ GRA (Gravelines)            │ │ │
│ │                 │ │ │ │ Statut           │ OK Actif                    │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Configurer FW] [Gerer mitigation] [Voir reverse] │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.45.67 selectionne | NAV4: General
ETAT: Detail d'une IP principale Dedicated Server
