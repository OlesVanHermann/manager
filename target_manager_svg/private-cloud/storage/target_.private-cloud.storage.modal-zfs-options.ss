┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │ Options ZFS                                                              ✕  │   │
│   ├─────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                             │   │
│   │  Partition: backup-prod                                                     │   │
│   │                                                                             │   │
│   │  Compression                                                                │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐    │   │
│   │  │ lz4 (recommandé)                                                  ▼ │    │   │
│   │  └─────────────────────────────────────────────────────────────────────┘    │   │
│   │  ℹ️ lz4: rapide, bon ratio • zstd: meilleur ratio • off: désactivé         │   │
│   │                                                                             │   │
│   │  Déduplication                                                              │   │
│   │  ○ Activée (économise l'espace, consomme RAM)                               │   │
│   │  ● Désactivée (recommandé)                                                  │   │
│   │  ⚠️ La déduplication nécessite beaucoup de RAM sur le NAS-HA               │   │
│   │                                                                             │   │
│   │  Synchronisation (sync)                                                     │   │
│   │  ┌─────────────────────────────────────────────────────────────────────┐    │   │
│   │  │ standard                                                          ▼ │    │   │
│   │  └─────────────────────────────────────────────────────────────────────┘    │   │
│   │  ℹ️ standard: équilibré • always: max sécurité • disabled: max perf        │   │
│   │                                                                             │   │
│   │  Enregistrement Access Time (atime)                                         │   │
│   │  ○ Activé (enregistre l'heure d'accès)                                      │   │
│   │  ● Désactivé (meilleures performances)                                      │   │
│   │                                                                             │   │
│   │                                         [Annuler]  [Enregistrer]            │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

Type: Modal 580×500px
NAV1: Hosted Private Cloud | NAV2: Storage | NAV3: Général / NAS-HA sélectionné | NAV4: Partitions
