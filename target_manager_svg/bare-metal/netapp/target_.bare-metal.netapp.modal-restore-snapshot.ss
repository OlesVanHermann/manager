NAV1: Bare Metal Cloud | NAV2: NetApp | NAV3: General / netapp-prod-01 | Modal: Restaurer Snapshot

Modal Restaurer un snapshot

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│         ┌───────────────────────────────────────────────────────────┐               │
│         │ Restaurer un snapshot                                [×] │               │
│         ├───────────────────────────────────────────────────────────┤               │
│         │                                                           │               │
│         │ Volume: vol_db                                            │               │
│         │ Snapshot: daily.0 (02/01/2026 00:00)                      │               │
│         │ Taille: 110 GB                                            │               │
│         │                                                           │               │
│         │ Mode de restauration:                                     │               │
│         │ ┌─────────────────────────────────────────────────────┐   │               │
│         │ │ ● Restauration in-place                             │   │               │
│         │ │   Remplace les données actuelles du volume          │   │               │
│         │ │                                                     │   │               │
│         │ │ ○ Créer un nouveau volume                           │   │               │
│         │ │   Clone le snapshot vers un nouveau volume          │   │               │
│         │ └─────────────────────────────────────────────────────┘   │               │
│         │                                                           │               │
│         │ ⚠️ ATTENTION                                              │               │
│         │ La restauration in-place remplacera toutes les données    │               │
│         │ écrites après la date du snapshot.                        │               │
│         │                                                           │               │
│         │ Tapez "RESTORE" pour confirmer:                           │               │
│         │ ┌─────────────────────────────────────────────────────┐   │               │
│         │ │                                                     │   │               │
│         │ └─────────────────────────────────────────────────────┘   │               │
│         │                                                           │               │
│         │              [Annuler]  [Restaurer]                       │               │
│         │                                                           │               │
│         └───────────────────────────────────────────────────────────┘               │
│                                                                                     │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ BACKDROP ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────────────────────────────────────┘
```
