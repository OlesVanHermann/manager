# SCREENSHOT: OCC Provider - Tab Cles
# NAV1: Network | NAV2: OVHcloud Connect | NAV3: Region (ALL) / POP (ALL) / occ-backup-fra selectionne | NAV4: Cles

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ Region      [v] │ │ │ OCC Backup Frankfurt                         [...] │ │
│ │ ALL             │ │ │ OK • Provider • Megaport -> FRA DC                 │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ POP         [v] │ │ │ NAV4: [General][Datacenter][POP][Interfaces]       │ │
│ │ ALL             │ │ │       [Cles][Taches]   ▲                           │ │
│ ├─────────────────┤ │ │                        └ ACTIF                     │ │
│ │ Rechercher...   │ │ ├────────────────────────────────────────────────────┤ │
│ ├─────────────────┤ │ │ Cles de service (2)                 [+ Generer]   │ │
│ │ o Tous les svc  │ │ │                                                    │ │
│ ├─────────────────┤ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │ o occ-prod-par  │ │ │ │ Cle            │Partenaire│Statut     │Creee │ │ │ │
│ │   OK Direct•PAR │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │ * occ-backup-fra│◀│ │ │ sk-occ-001-xxx │ Megaport │ OK Utilisee│15/01│ │ │ │
│ │   OK Provider•FR│ │ │ │ sk-occ-002-xxx │ Megaport │ -- Disponib│20/12│ │ │ │
│ │ o occ-prod-rbx  │ │ │ └────────────────────────────────────────────────┘ │ │
│ │   OK Direct•RBX │ │ │                                                    │ │
│ │                 │ │ │ i Les cles de service sont utilisees pour activer │ │
│ │                 │ │ │   la connexion chez le partenaire (Provider).     │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: b) NAV1: Network | NAV2: OVHcloud Connect | NAV3a: Region (ALL) / NAV3b: POP (ALL) / occ-backup-fra selectionne | NAV4: Cles
ETAT: Cles de service pour connexion Provider
NOTE: Tab Cles visible uniquement pour connexions de type Provider
