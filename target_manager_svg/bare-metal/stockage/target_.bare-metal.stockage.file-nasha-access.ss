NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NAS-HA / Mon NAS Prod | NAV4: Acces

File > NAS-HA - Service selectionne, Tab Acces (ACL)

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
│ ┌────────────┬───────────┐ │  Mon NAS Prod                                                      │
│ │   File     │   Block   │ │  zpool-123456-1                                                    │
│ │   (15)     │    (6)    │ │                                                                     │
│ └────────────┴───────────┘ │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │ [General] [Partitions] [Snapshots] [Acces*] [Taches]        │   │
│ Region: [Toutes]           │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                        ─────                       │
│ [Rechercher...]            │                                                                     │
│                            │  Controle d'acces par partition                                    │
│ ┌────────────┬───────────┐ │                                                                     │
│ │  NAS-HA    │  NetApp   │ │  Les acces definissent quelles IPs peuvent acceder a vos          │
│ │   (12)     │    (3)    │ │  partitions via NFS ou CIFS.                                       │
│ └────────────┴───────────┘ │                                                                     │
│                            │  Partition: [data-prod v]                    [+ Ajouter un acces]  │
│ ○ Tous les services  (12)  │                                                                     │
│ * Mon NAS Prod             │  ┌─────────────────────────────────────────────────────────────┐   │
│   3 To | GRA               │  │ IP / CIDR           │ Type     │ Protocole │ Actions       │   │
│ ○ NAS Backup               │  ├─────────────────────┼──────────┼───────────┼───────────────┤   │
│   5 To | SBG               │  │ 192.168.1.0/24      │ RW       │ NFS       │     [x]       │   │
│ ○ NAS Dev                  │  │ 10.0.0.0/8          │ RO       │ NFS       │     [x]       │   │
│   1 To | GRA               │  │ 172.16.0.50/32      │ RW       │ CIFS      │     [x]       │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                                                     │
│                            │  3 acces configures                                                │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
