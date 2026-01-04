# SCREENSHOT: vRack - Modal Supprimer services
# NAV1: Network | NAV2: vRack | Modal: Supprimer services

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Retirer des services du vRack                               [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  vRack: pn-123456 (Production)                                     │    │
│   │                                                                    │    │
│   │  Services a retirer:                                               │    │
│   │  ┌────────────────────────────────────────────────────────────┐   │    │
│   │  │ [x] ns123456.ip-51-210-xxx.eu (Serveur dedie)              │   │    │
│   │  │ [x] pci-project-xxx (Public Cloud)                         │   │    │
│   │  │ [ ] lb-prod-xxx (Load Balancer)                            │   │    │
│   │  └────────────────────────────────────────────────────────────┘   │    │
│   │                                                                    │    │
│   │  /!\ Attention                                                     │    │
│   │  Les services retires perdront leur connectivite vRack.            │    │
│   │  Cette operation peut entrainer une interruption temporaire.       │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                      [Annuler]      [Retirer]      │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page vRack
