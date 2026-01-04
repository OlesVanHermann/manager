# SCREENSHOT: Load Balancer - Modal Statut serveur
# NAV1: Network | NAV2: Load Balancer | Modal: Statut serveur

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Modifier le statut du serveur                                [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  Serveur: web-01                                                   │    │
│   │  IP: 10.0.0.11                                                     │    │
│   │  Statut actuel: [Healthy]                                          │    │
│   │                                                                    │    │
│   │  Nouveau statut                                                    │    │
│   │  ○ Actif - Recoit du trafic normalement                            │    │
│   │  ● Drain - N'accepte plus de nouvelles connexions                  │    │
│   │  ○ Maintenance - Completement retire du pool                       │    │
│   │                                                                    │    │
│   │  /i\\ Le mode Drain permet de vider progressivement les            │    │
│   │  connexions existantes avant une maintenance.                      │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                    [Annuler]      [Appliquer]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page Load Balancer
