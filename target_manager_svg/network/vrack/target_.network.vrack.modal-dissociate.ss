# SCREENSHOT: vRack Services - Modal Dissocier
# NAV1: Network | NAV2: vRack Services | Modal: Dissocier vRack

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [General][Subnet][vRack][vRack Services][Load Balancer][CDN][OVHcloud Co.] │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ Dissocier du vRack                                           [x]   │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                                                    │    │
│   │  vRack Services: vs-production-01                                  │    │
│   │  vRack actuel: pn-123456                                           │    │
│   │                                                                    │    │
│   │  /!\\ Attention                                                    │    │
│   │  La dissociation empechera les services du vRack de                │    │
│   │  communiquer avec les sous-reseaux de ce vRack Services.           │    │
│   │                                                                    │    │
│   │  Les sous-reseaux et endpoints seront conserves.                   │    │
│   │  Vous pourrez associer un autre vRack ulterieurement.              │    │
│   │                                                                    │    │
│   ├────────────────────────────────────────────────────────────────────┤    │
│   │                                     [Annuler]      [Dissocier]     │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

TYPE: Modal sur page vRack Services
