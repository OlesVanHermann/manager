# SCREENSHOT: Bloc IP Failover selectionne - Tab General
# NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.x.x/24 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]        │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.0/24                              [...] │ │
│ │ ALL             │ │ │ IPv4 • Failover • GRA                              │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Reverse][Operations][BYOIP]        │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Blocs           │ │ │ Informations                                       │ │
│ │ * 51.210.x.x/24 │◀│ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │   Failover /24  │ │ │ │ Bloc             │ 51.210.123.0/24             │ │ │
│ │ o 10.0.0.0/16   │ │ │ │ Version          │ IPv4                        │ │ │
│ │   vRack prive   │ │ │ │ Type             │ Failover                    │ │ │
│ │ o 192.99.x.x/28 │ │ │ │ Region           │ EU-West (GRA.FR)            │ │ │
│ │   BYOIP         │ │ │ │ Taille           │ 256 adresses                │ │ │
│ ├─────────────────┤ │ │ │ Firewall         │ OK Actif                    │ │ │
│ │ IP unitaires    │ │ │ │ Mitigation       │ OK Auto                     │ │ │
│ │ o 51.210.45.67  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │ o 141.94.12.34  │ │ │                                                    │ │
│ │ o 57.128.99.1   │ │ │ Utilisation du bloc                                │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Utilisees    ████████████░░░░░░░░  189/256     │ │ │
│ │                 │ │ │ │ Disponibles  ░░░░░░░░░░░░████████   67/256     │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ [Configurer FW] [Gerer mitigation] [Voir IPs]     │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Subnet | NAV3: Region (ALL) / 51.210.x.x/24 selectionne | NAV4: General
ETAT: Detail d'un bloc IP Failover avec utilisation
