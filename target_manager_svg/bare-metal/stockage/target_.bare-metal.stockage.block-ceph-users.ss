NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: Block / NAV3b: Ceph / cda-cluster-prod | NAV4: Users

Block > Ceph - Service selectionne, Tab Users

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
│ ┌────────────┬───────────┐ │  cda-cluster-prod                                                  │
│ │   File     │   Block   │ │  Cloud Disk Array | Gravelines (GRA1)                              │
│ │   (15)     │    (6)    │ │                                                                     │
│ └────────────┴───────────┘ │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │ [General] [Sante] [Pools] [IPs] [Users*] [Espace] [Taches]  │   │
│ Region: [Toutes]           │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                  ─────                             │
│ [Rechercher...]            │                                                                     │
│                            │  Utilisateurs                                                      │
│ ┌────────────┬───────────┐ │                                                                     │
│ │   Ceph     │  NetApp   │ │  ┌─────────────────────────────────────────────────────────────┐   │
│ │    (3)     │    (3)    │ │  │ (i) Vos utilisateurs peuvent utiliser le cluster avec des   │   │
│ └────────────┴───────────┘ │  │     permissions specifiques par pool.                        │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
│ ○ Tous les services  (3)   │                                                                     │
│ * cda-cluster-prod         │                                          [+ Ajouter un utilisateur]│
│   46 To | GRA1             │                                                                     │
│ ○ cda-cluster-dev          │  ┌─────────────────────────────────────────────────────────────┐   │
│   10 To | SBG1             │  │ Nom          │ Cle              │ Pools         │ Actions   │   │
│ ○ cda-backup-01            │  ├──────────────┼──────────────────┼───────────────┼───────────┤   │
│   20 To | GRA1             │  │ admin        │ AQC5K...****     │ * (tous)      │ [i] [x]   │   │
│                            │  │ app-prod     │ AQD8M...****     │ data, logs    │ [i] [x]   │   │
│                            │  │ backup-agent │ AQE2N...****     │ backup        │ [i] [x]   │   │
│                            │  │ monitoring   │ AQF7P...****     │ * (lecture)   │ [i] [x]   │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
│                            │                                                                     │
│                            │  4 utilisateurs configures                                         │
│                            │  [i] = Voir permissions   [x] = Supprimer                          │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
