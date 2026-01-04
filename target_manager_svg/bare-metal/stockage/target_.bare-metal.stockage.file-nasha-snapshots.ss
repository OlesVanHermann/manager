NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NAS-HA / Mon NAS Production | NAV4: Snapshots

File > NAS-HA - Snapshots

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
│ [File] [Block]             │  ┌─────────────────────────────────────────────────────────────┐   │
│                            │  │  [Tableau de bord] [Partitions] [Snapshots] [Acces] [Taches]│   │
│ Region: [Toutes]           │  └─────────────────────────────────────────────────────────────┘   │
│ [Rechercher...]            │                                   ───────────                       │
│                            │                                                                     │
│ [NAS-HA] [NetApp]          │  Snapshots                                                         │
│                            │                                                                     │
│ ○ Tous les services        │  7 snapshots configures                                            │
│ ● Mon NAS Production       │                                                                     │
│                            │  ┌─────────────────────────────────────────────────────────────────┐│
│                            │  │ ⚠ Les snapshots personnalises ne beneficient pas de la        ││
│                            │  │   retention automatique.                                        ││
│                            │  └─────────────────────────────────────────────────────────────────┘│
│                            │                                                                     │
│                            │                                  [+ Creer un snapshot custom]      │
│                            │                                                                     │
│                            │  ┌─────────────────────────────────────────────────────────────────┐│
│                            │  │ Type        │ Nom                    │ Options                 ││
│                            │  ├─────────────┼────────────────────────┼─────────────────────────┤│
│                            │  │ Quotidien   │ snap-daily-2026-01-03  │ [Configurer]            ││
│                            │  │ Hebdo       │ snap-weekly-2026-w01   │ [Configurer]            ││
│                            │  │ Custom      │ avant-migration        │ [Supprimer]             ││
│                            │  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
