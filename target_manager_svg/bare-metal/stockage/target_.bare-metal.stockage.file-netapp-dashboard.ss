NAV1: Bare Metal Cloud | NAV2: Stockage | NAV3a: File / NAV3b: NetApp / Mon NetApp Production | NAV4: Tableau de bord

File > NetApp - Dashboard

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
│ ┌────────────┬───────────┐ │  ┌─────────────────────────────────────────────────────────────┐   │
│ │   File     │   Block   │ │  │  [Tableau de bord] [Volumes] [Snapshots] [ACL] [Policies]  │   │
│ │   (15)     │    (6)    │ │  └─────────────────────────────────────────────────────────────┘   │
│ └────────────┴───────────┘ │   ─────────────────                                                │
│                            │                                                                     │
│ Region: [EU-West (GRA)]    │  Mon NetApp Production                                              │
│                            │  ══════════════════════                                             │
│ [Rechercher...]            │                                                                     │
│                            │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│ ┌────────────┬───────────┐ │  │ Informations    │ │ Capacite        │ │ Performance     │       │
│ │  NAS-HA    │  NetApp   │ │  │                 │ │                 │ │                 │       │
│ │   (12)     │    (3)    │ │  │ Nom: Mon NetApp │ │ Total: 10 To    │ │ Type: Perf      │       │
│ └────────────┴───────────┘ │  │ ID: netapp-abc  │ │ Utilise: 6.2 To │ │ IOPS: 64000     │       │
│     (NetApp actif)         │  │ Region: GRA     │ │ ██████░░░░ 62%  │ │ Debit: 1024Mo/s │       │
│                            │  │ Statut: [Actif] │ │ Dispo: 3.8 To   │ │                 │       │
│ ○ Tous les services  (3)   │  └─────────────────┘ └─────────────────┘ └─────────────────┘       │
│ ● Mon NetApp Production    │                                                                     │
│ ○ NetApp Backup            │                                                                     │
│ ○ NetApp Archive           │                                                                     │
└────────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
