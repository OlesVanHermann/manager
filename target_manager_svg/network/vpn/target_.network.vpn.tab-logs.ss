# SCREENSHOT: Tunnel VPN selectionne - Tab Logs
# NAV1: Network | NAV2: VPN | NAV3: General / vpn-aws-prod selectionne | NAV4: Logs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][VPN][Anti-DDoS VAC]       │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vpn-aws-prod                           [Exporter] │ │
│ ├─────────────────┤ │ │ Logs VPN                                           │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Logs]                              │ │
│ ├─────────────────┤ │ │                      ▲                             │ │
│ │ Rechercher...   │ │ │                      └ ACTIF                       │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc    │ │ │ [IP...] [Evenement v] [Periode: 24h v]             │ │
│ ├─────────────────┤ │ │                                                    │ │
│ │ * vpn-aws-prod  │◀│ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK Connected  │ │ │ │                                                │ │ │
│ │ o vpn-azure-dr  │ │ │ │ 2026-01-03 14:32:15 OK CONNECTED 54.23.x.x     │ │ │
│ │   OK Connected  │ │ │ │ 2026-01-03 14:32:14 .. HANDSHAKE Phase2 done   │ │ │
│ │ o vpn-paris-01  │ │ │ │ 2026-01-03 14:32:12 .. HANDSHAKE Phase1 done   │ │ │
│ │   XX Down       │ │ │ │ 2026-01-03 14:32:10 >> ATTEMPT IKE_SA_INIT     │ │ │
│ │ o vpn-gcp-dev   │ │ │ │ 2026-01-03 12:15:45 XX DOWN timeout            │ │ │
│ │   .. Connecting │ │ │ │ 2026-01-03 12:14:30 .. REKEY Phase2            │ │ │
│ │                 │ │ │ │ 2026-01-03 10:00:00 OK CONNECTED 54.23.x.x     │ │ │
│ │                 │ │ │ │ ...                                            │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │ 11 of 1,234 events | OK 456 | XX 23                │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: VPN | NAV3: General / vpn-aws-prod selectionne | NAV4: Logs
ETAT: Historique des evenements du tunnel VPN
