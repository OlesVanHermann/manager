NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: Block / NAV3b: Ceph / Tous les services | NAV4: -

Block > Ceph - Tous les services (Overview)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVH Logo]  Bare Metal Cloud   Public Cloud   Web Cloud   Network   IAM        [?] [FR] [User] │ <- NAV1 (50px)
│             ════════════════                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [General]   Serveurs    VPS    Stockage    Licences                                            │ <- NAV2 (40px)
│                                  ────────                                                        │    [Stockage] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                 15px gap                         │
├────────────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ LEFT PANEL (280px)         │ RIGHT PANEL                                                         │
│                            │                                                                     │
│ ┌────────────┬───────────┐ │  Cloud Disk Array - Vue d'ensemble                                 │
│ │   File     │   Block   │ │  3 clusters                                                        │
│ │   (15)     │    (6)    │ │                                                                     │
│ └────────────┴───────────┘ │  ┌─────────────────────────────────────────────────────────────────┐│
│                            │  │ Nom        │Statut │Sante   │DC  │Espace     │OSDs │Pool│ Act ││
│ Region: [Toutes]           │  ├────────────┼───────┼────────┼────┼───────────┼─────┼────┼─────┤│
│ [Rechercher...]            │  │ Mon Cluster│[Actif]│[HEALTH]│GRA1│████░ 40%  │48/48│ 3  │  ⋮  ││
│                            │  │ Cluster Bkp│[Actif]│[HEALTH]│SBG1│██░░░ 25%  │24/24│ 2  │  ⋮  ││
│ ┌────────────┬───────────┐ │  │ Cluster Tst│[Actif]│[WARN]  │GRA1│██████░70% │12/12│ 1  │  ⋮  ││
│ │   Ceph     │  NetApp   │ │  └─────────────────────────────────────────────────────────────────┘│
│ │    (3)     │    (3)    │ │                                                                     │
│ └────────────┴───────────┘ │  Actions menu:                                                      │
│                            │  - Voir details                                                    │
│ ● Tous les services  (3)   │  - Modifier                                                        │
│ ○ Mon Cluster Ceph         │                                                                     │
│ ○ Cluster Backup           │                                                                     │
│ ○ Cluster Test             │                                                                     │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
