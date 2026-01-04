NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NetApp / Mon NetApp Production | NAV4: Volumes

File > NetApp - Volumes

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
│ NAV3a                      │  │  [Tableau de bord] [Volumes] [Snapshots] [ACL] [Policies]  │   │
│                            │  └─────────────────────────────────────────────────────────────┘   │
│ Region: [Toutes]           │                     ─────────                                       │
│ [Rechercher...]            │  Volumes                                     [+ Creer un volume]   │
│                            │                                                                     │
│ [NAS-HA] [NetApp]          │  ┌─────────────────────────────────────────────────────────────────┐│
│ NAV3b (NetApp actif)       │  │ Nom       │ Desc    │ Taille │ Util.    │ Proto │ Statut │ Act ││
│                            │  ├───────────┼─────────┼────────┼──────────┼───────┼────────┼─────┤│
│ ○ Tous les services  (3)   │  │ vol-data  │ Donnees │ 2 To   │ ████░ 45%│ NFSv4 │[avail] │  ⋮  ││
│ ● Mon NetApp Production    │  │ vol-backup│ Backup  │ 5 To   │ ██████░70│ NFSv3 │[avail] │  ⋮  ││
│ ○ NetApp Backup            │  │ vol-share │ Partage │ 1 To   │ ██░░░ 25%│ NFSv4 │[avail] │  ⋮  ││
│                            │  └─────────────────────────────────────────────────────────────────┘│
│                            │                                                                     │
│                            │  Actions menu:                                                      │
│                            │  - Detail / Snapshot / ACL / Resize / Delete                       │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
