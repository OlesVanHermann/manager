# SCREENSHOT: Bare Metal Hover Alerte
# NAV1: bare-metal | NAV2: general | NAV3: AUCUN (FULL WIDTH) | NAV4: AUCUN
# Type: Page FULL WIDTH sans sidecar (NAV2=general)

Hub - Click sur alerte (hover + navigation)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVH Logo]  Bare Metal Cloud   Public Cloud   Web Cloud   Network   IAM        [?] [FR] [User] │ <- NAV1 (50px)
│             ════════════════                                                                     │    [Bare Metal Cloud] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [General]   Serveurs    VPS    Stockage    Licences                                            │ <- NAV2 (40px)
│   ────────                                                                                       │    [General] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  ... (KPIs + Services recents)                                                                   │
│                                                                                                  │
│  Alertes (2)                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  │░ [!] Cluster Test: Espace disque > 70%                              Il y a 1 jour HOVER░│   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  │ [!] NAS Backup: Partition 85%                                      Il y a 3 jours       │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│        ↑                                                                                         │
│        Click -> Navigation vers /bare-metal/stockage/cluster-test                               │
│                  NAV2 devient [Stockage] actif                                                  │
│                  Service selectionne dans sidecar                                               │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
