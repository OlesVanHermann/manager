# SCREENSHOT: Tunnel VPN selectionne - Configuration
# NAV1: Network | NAV2: VPN | NAV3: General / vpn-aws-prod selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][VPN][Anti-DDoS VAC]       │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vpn-aws-prod                        [Sauvegarder] │ │
│ ├─────────────────┤ │ │ IPSec IKEv2 • OK Connected                         │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Logs]                              │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ Rechercher...   │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc    │ │ │ Phase 1 (IKE)                                      │ │
│ ├─────────────────┤ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │ * vpn-aws-prod  │◀│ │ │ Encryption       │ [AES-256            v]     │ │ │
│ │   OK Connected  │ │ │ │ Hash             │ [SHA-256            v]     │ │ │
│ │ o vpn-azure-dr  │ │ │ │ DH Group         │ [Group 14           v]     │ │ │
│ │   OK Connected  │ │ │ │ Lifetime         │ [28800s             ]      │ │ │
│ │ o vpn-paris-01  │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │   XX Down       │ │ │ Phase 2 (ESP)                                      │ │
│ │ o vpn-gcp-dev   │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │   .. Connecting │ │ │ │ Encryption       │ [AES-256            v]     │ │ │
│ │                 │ │ │ │ Hash             │ [SHA-256            v]     │ │ │
│ │                 │ │ │ │ PFS Group        │ [Group 14           v]     │ │ │
│ │                 │ │ │ │ Lifetime         │ [3600s              ]      │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ │                 │ │ │ Reseaux                                            │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Local            │ [192.168.0.0/16     ]      │ │ │
│ │                 │ │ │ │ Distant          │ [10.0.0.0/8         ]      │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: VPN | NAV3: General / vpn-aws-prod selectionne | NAV4: General
ETAT: Configuration IPSec IKEv2 d'un tunnel connecte
