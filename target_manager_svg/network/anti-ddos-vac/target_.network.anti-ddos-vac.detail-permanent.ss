# SCREENSHOT: IP avec mode Permanent selectionnee
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 141.94.x.0/28 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 141.94.12.0/28                               [...] │ │
│ │ ALL             │ │ │ .. Protection permanente • Mode: Permanent         │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ o Tous les svc  │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o 51.210.x.0/24 │ │ │ Informations                                       │ │
│ │   OK Auto       │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ o 51.210.45.67  │ │ │ │ IP/Subnet        │ 141.94.12.0/28              │ │ │
│ │   OK Auto       │ │ │ │ Mode mitigation  │ .. Permanent                │ │ │
│ │ * 141.94.x.0/28 │◀│ │ │ Seuil detection  │ N/A (permanent)             │ │ │
│ │   .. Permanent  │ │ │ │ Regles perman.   │ 5                           │ │ │
│ │ o 57.128.99.1   │ │ │ │ Region           │ EU-West (RBX.FR)            │ │ │
│ │   XX Desactive  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ ! Mode Permanent : Tout le trafic passe par le    │ │
│ │                 │ │ │   scrubbing center. Peut ajouter une legere       │ │
│ │                 │ │ │   latence mais offre une protection maximale.     │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Resume (30 jours)                                  │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Attaques         │ 89 (cible frequente)        │ │ │
│ │                 │ │ │ │ Volume bloque    │ 2.1 TB                      │ │ │
│ │                 │ │ │ │ Duree totale     │ 18h 45min                   │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 141.94.x.0/28 selectionne | NAV4: General
ETAT: IP avec mode Permanent (cible frequente)
