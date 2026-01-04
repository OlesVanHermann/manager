# SCREENSHOT: Subnet selectionne - Tab Scrubbing
# NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: Scrubbing

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ 51.210.123.0/24                              [...] │ │
│ │ ALL             │ │ │ OK Protection active • Mode: Auto                  │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Statistiques][Scrubbing][Trafic]   │ │
│ ├─────────────────┤ │ │                                   ▲                │ │
│ │ o Tous les svc  │ │ │                                   └ ACTIF          │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * 51.210.x.0/24 │◀│ │ Mode de mitigation                                 │ │
│ │   OK Auto       │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o 51.210.45.67  │ │ │ │ * Automatique (recommande)                     │ │ │
│ │   OK Auto       │ │ │ │   Mitigation activee uniquement lors d'une     │ │ │
│ │ o 141.94.x.0/28 │ │ │ │   attaque detectee                             │ │ │
│ │   .. Permanent  │ │ │ │                                                │ │ │
│ │                 │ │ │ │ o Permanent                                    │ │ │
│ │                 │ │ │ │   Tout le trafic passe par le scrubbing center │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ o Desactive                                    │ │ │
│ │                 │ │ │ │   ! Non recommande - Aucune protection        │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Regles de filtrage permanent (2)    [+ Ajouter]   │ │
│ │                 │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │                 │ │ │ │ Regle     │Proto│Port│ Action    │Statut│     │ │ │
│ │                 │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │                 │ │ │ │ Block GRE │ GRE │ *  │ Bloquer   │ OK   │     │ │ │
│ │                 │ │ │ │ Limit DNS │ UDP │ 53 │ Rate limit│ OK   │     │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: Anti-DDoS VAC | NAV3: General / 51.210.x.0/24 selectionne | NAV4: Scrubbing
ETAT: Configuration mode mitigation et regles permanentes
