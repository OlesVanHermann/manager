NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NetApp / netapp-prod-01 | NAV4: Policies

File > NetApp - Service selectionne, Tab Policies

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
│                            │  │ [General] [Volumes] [Snapshots] [ACL] [Policies*]           │   │
│ Region: [Toutes]           │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                            ────────               │
│ [Rechercher...]            │                                                                     │
│                            │  Politiques de snapshots                                           │
│ ┌────────────┬───────────┐ │                                                                     │
│ │  NAS-HA    │  NetApp   │ │  Definissez les politiques de retention automatique des snapshots.│
│ │   (12)     │    (3)    │ │                                                                     │
│ └────────────┴───────────┘ │                                               [+ Creer politique] │
│                            │                                                                     │
│ ○ Tous les services  (3)   │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│ * netapp-prod-01           │  │ Daily-7         │ │ Weekly-4        │ │ Monthly-12      │       │
│   Performance | GRA        │  │                 │ │                 │ │                 │       │
│ ○ netapp-backup            │  │ Frequence:      │ │ Frequence:      │ │ Frequence:      │       │
│   Capacity | RBX           │  │ Tous les jours  │ │ Chaque dimanche │ │ 1er du mois     │       │
│ ○ netapp-dev               │  │ a 00:00         │ │ a 00:00         │ │ a 00:00         │       │
│   Performance | GRA        │  │                 │ │                 │ │                 │       │
│                            │  │ Retention:      │ │ Retention:      │ │ Retention:      │       │
│                            │  │ 7 snapshots     │ │ 4 snapshots     │ │ 12 snapshots    │       │
│                            │  │                 │ │                 │ │                 │       │
│                            │  │ [Modifier] [x]  │ │ [Modifier] [x]  │ │ [Modifier] [x]  │       │
│                            │  └─────────────────┘ └─────────────────┘ └─────────────────┘       │
│                            │                                                                     │
│                            │  RESERVE SNAPSHOT                                                  │
│                            │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │ Espace reserve pour les snapshots: 20% de chaque volume    │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
