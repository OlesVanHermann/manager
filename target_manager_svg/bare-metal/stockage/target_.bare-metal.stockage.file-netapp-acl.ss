NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NetApp / netapp-prod-01 | NAV4: ACL

File > NetApp - Service selectionne, Tab ACL

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVH Logo]  Bare Metal Cloud   Public Cloud   Web Cloud   Network   IAM        [?] [FR] [User] │
│             ════════════════                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [General]   Serveurs    VPS    Stockage    Licences                                            │
│                                  ────────                                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   (15px gap)     │
├────────────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ LEFT PANEL (280px)         │ RIGHT PANEL                                                         │
│                            │                                                                     │
│ ┌────────────┬───────────┐ │  netapp-prod-01                                                    │
│ │   File     │   Block   │ │  Performance | Gravelines (GRA)                                    │
│ │   (15)     │    (6)    │ │                                                                     │
│ └────────────┴───────────┘ │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │ [General] [Volumes] [Snapshots] [ACL*] [Policies]           │   │
│ Region: [Toutes]           │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                   ───                              │
│ [Rechercher...]            │                                                                     │
│                            │  Controle d'acces                                                  │
│ ┌────────────┬───────────┐ │                                                                     │
│ │  NAS-HA    │  NetApp   │ │  Volume: [vol-data-prod v]                    [+ Ajouter export]  │
│ │   (12)     │    (3)    │ │                                                                     │
│ └────────────┴───────────┘ │  EXPORTS NFS                                                       │
│                            │  ┌─────────────────────────────────────────────────────────────┐   │
│ ○ Tous les services  (3)   │  │ Client IP/CIDR      │ Droits   │ Root Squash │ Actions     │   │
│ * netapp-prod-01           │  ├─────────────────────┼──────────┼─────────────┼─────────────┤   │
│   Performance | GRA        │  │ 192.168.1.0/24      │ RW       │ Non         │   [x]       │   │
│ ○ netapp-backup            │  │ 10.0.0.0/8          │ RO       │ Oui         │   [x]       │   │
│   Capacity | RBX           │  │ 172.16.0.0/16       │ RW       │ Non         │   [x]       │   │
│ ○ netapp-dev               │  └─────────────────────────────────────────────────────────────┘   │
│   Performance | GRA        │                                                                     │
│                            │  PARTAGES CIFS                                    [+ Creer share] │
│                            │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │ Nom partage         │ Path         │ Permissions │ Actions │   │
│                            │  ├─────────────────────┼──────────────┼─────────────┼─────────┤   │
│                            │  │ share-prod          │ /vol-data    │ Everyone:RW │   [x]   │   │
│                            │  │ share-readonly      │ /vol-archive │ Everyone:RO │   [x]   │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
