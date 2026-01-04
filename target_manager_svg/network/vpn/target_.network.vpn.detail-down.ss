# SCREENSHOT: Tunnel VPN Down - Detail erreur
# NAV1: Network | NAV2: VPN | NAV3: General / vpn-paris-01 selectionne | NAV4: General

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][VPN][Anti-DDoS VAC]       │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ [General]       │ │ │ vpn-paris-01                          [Reconnecter]│ │
│ ├─────────────────┤ │ │ WireGuard • XX Down                                │ │
│ │ Region      [v] │ │ ├────────────────────────────────────────────────────┤ │
│ │ ALL             │ │ │ NAV4: [General][Logs]                              │ │
│ ├─────────────────┤ │ │                 ▲                                  │ │
│ │ Rechercher...   │ │ │                 └ ACTIF                            │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ o Tous les svc    │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ ├─────────────────┤ │ │ │ XX TUNNEL DOWN                                 │ │ │
│ │ o vpn-aws-prod  │ │ │ │                                                │ │ │
│ │   OK Connected  │ │ │ │ Derniere connexion : 02/01/2026 18:45          │ │ │
│ │ o vpn-azure-dr  │ │ │ │ Raison : Timeout - peer unreachable            │ │ │
│ │   OK Connected  │ │ │ │                                                │ │ │
│ │ * vpn-paris-01  │◀│ │ │ Verifiez :                                     │ │ │
│ │   XX Down       │ │ │ │ • L'endpoint distant est accessible            │ │ │
│ │ o vpn-gcp-dev   │ │ │ │ • Les regles firewall sont correctes           │ │ │
│ │   .. Connecting │ │ │ │ • Les cles sont valides                        │ │ │
│ │                 │ │ │ │                                                │ │ │
│ │                 │ │ │ │ [Voir les logs]  [Reconnecter]                 │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Configuration                                      │ │
│ │                 │ │ │ ┌──────────────────┬─────────────────────────────┐ │ │
│ │                 │ │ │ │ Endpoint local   │ 51.210.45.67:51820          │ │ │
│ │                 │ │ │ │ Endpoint distant │ 82.45.123.89:51820          │ │ │
│ │                 │ │ │ │ Reseau local     │ 192.168.10.0/24             │ │ │
│ │                 │ │ │ └──────────────────┴─────────────────────────────┘ │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: VPN | NAV3: General / vpn-paris-01 selectionne | NAV4: General
ETAT: Tunnel DOWN avec diagnostic et actions
