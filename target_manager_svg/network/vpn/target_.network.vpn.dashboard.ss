# SCREENSHOT: Dashboard VPN - Vue d'ensemble (Tous les services)
# NAV1: Network | NAV2: VPN | NAV3: General | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][VPN][Anti-DDoS VAC]         │
│                                                          ▲                   │
│                                                          └ ACTIF             │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ VPN - Vue d'ensemble             [+ Creer tunnel] │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Region      [v] │ │ │ NAV4: [General][Logs]                              │ │
│ │ ALL             │ │ │          ▲                                         │ │
│ ├─────────────────┤ │ │          └ ACTIF                                   │ │
│ │ [Rechercher...] │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │
│ │ * Tous les svc  │◀│ │ │ Total     │ │ OK Up     │ │ XX Down   │         │ │
│ ├─────────────────┤ │ │ │ 4         │ │ 2         │ │ 1         │         │ │
│ │ o vpn-aws-prod  │ │ │ └───────────┘ └───────────┘ └───────────┘         │ │
│ │   OK Connected  │ │ │                                                    │ │
│ │ o vpn-azure-dr  │ │ │ Statut des tunnels                                 │ │
│ │   OK Connected  │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o vpn-paris-01  │ │ │ │ Nom          │ Type   │ Statut                 │ │ │
│ │   XX Down       │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │ o vpn-gcp-dev   │ │ │ │ vpn-aws-prod │ IPSec  │ OK Connected           │ │ │
│ │   .. Connecting │ │ │ │ vpn-azure-dr │ IPSec  │ OK Connected           │ │ │
│ │                 │ │ │ │ vpn-paris-01 │ WireG. │ XX Down                │ │ │
│ │                 │ │ │ │ vpn-gcp-dev  │ IPSec  │ .. Connecting          │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Trafic total (24h): 12.4 GB                        │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: VPN | NAV3: General / Tous les svc selectionne | NAV4: General
ETAT: Vue agregee - statut de tous les tunnels VPN
SIDECAR: [NAV3] -> Region -> [Rechercher] -> Tous les svc -> Liste
