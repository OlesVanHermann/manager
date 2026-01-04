NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: Block / NAV3b: Ceph / Mon Cluster Ceph | NAV4: Pools

Block > Ceph - Pools

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
│ [File] [Block]             │  ┌───────────────────────────────────────────────────────────────┐ │
│ (Block actif)              │  │ [Dashboard] [Sante] [Pools] [IPs] [Users] [Espace] [Taches]  │ │
│                            │  └───────────────────────────────────────────────────────────────┘ │
│ Region: [Toutes]           │                        ───────                                      │
│ [Rechercher...]            │                                                                     │
│                            │  Pools                                                              │
│ [Ceph] [NetApp]            │                                                                     │
│ (Ceph actif)               │  ┌─────────────────────────────────────────────────────────────────┐│
│                            │  │ ℹ Vous pouvez creer vos pools ici. Les pools sont des         ││
│ ○ Tous les services  (3)   │  │   "containers" pour vos donnees.                               ││
│ ● Mon Cluster Ceph         │  └─────────────────────────────────────────────────────────────────┘│
│ ○ Cluster Backup           │                                                                     │
│                            │                                         [+ Ajouter un pool]        │
│                            │                                                                     │
│                            │  ┌─────────────────────────────────────────────────────────────────┐│
│                            │  │ Nom      │ Type       │ Repliques │ Min actives │ Actions     ││
│                            │  ├──────────┼────────────┼───────────┼─────────────┼─────────────┤│
│                            │  │ data     │ replicated │ 3         │ 2           │ [Supprimer] ││
│                            │  │ backup   │ replicated │ 3         │ 2           │ [Supprimer] ││
│                            │  │ archive  │ erasure    │ -         │ -           │ [Supprimer] ││
│                            │  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
