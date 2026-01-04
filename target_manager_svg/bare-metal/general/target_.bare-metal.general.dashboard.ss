# SCREENSHOT: Bare Metal Dashboard
# NAV1: bare-metal | NAV2: general | NAV3: AUCUN (FULL WIDTH) | NAV4: AUCUN
# Type: Page FULL WIDTH sans sidecar (NAV2=general)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVH Logo]  Bare Metal Cloud   Public Cloud   Web Cloud   Network   IAM        [?] [FR] [User] │ <- NAV1 (50px)
│             ════════════════                                                                     │    [Bare Metal Cloud] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [General]   Serveurs    VPS    Stockage    Licences                                            │ <- NAV2 (40px)
│   ────────                                                                                       │    [General] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  Bare Metal Cloud                                                                               │
│  ══════════════════                                                                              │
│                                                                                                  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐      │
│  │ Serveurs      │ │ VPS           │ │ Stockage      │ │ Licences      │ │ Alertes       │      │
│  │      12       │ │       8       │ │      21       │ │      15       │ │       2       │      │
│  │   actifs      │ │   actifs      │ │   services    │ │   actives     │ │   critiques   │      │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘      │
│                                                                                                  │
│  Services recents                                                        [Voir tout ->]         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ Type        │ Nom                  │ Statut    │ Region   │ Derniere activite           │   │
│  ├─────────────┼──────────────────────┼───────────┼──────────┼─────────────────────────────┤   │
│  │ Serveur     │ ns1234.ip-51-68.eu   │ [Actif]   │ GRA      │ Il y a 2 heures             │   │
│  │ VPS         │ vps-abc123           │ [Actif]   │ SBG      │ Il y a 5 heures             │   │
│  │ NAS-HA      │ mon-nas-prod         │ [Actif]   │ GRA      │ Hier                        │   │
│  │ Ceph        │ cluster-backup       │ [Actif]   │ BHS      │ Il y a 3 jours              │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                  │
│  Alertes (2)                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ [!] Cluster Test: Espace disque > 70%                                   Il y a 1 jour   │   │
│  │ [!] NAS Backup: Partition 85%                                          Il y a 3 jours   │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
