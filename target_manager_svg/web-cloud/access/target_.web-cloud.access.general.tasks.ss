================================================================================
SCREENSHOT: target_.web-cloud.access.general.tasks.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: Taches

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                           =====                                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [OTB]              │ Fibre Pro Paris                                                [Demenager] [Migrer] │
│  =======                     │ xdsl-ab12345-1                                    [FTTH] [Pack Pro] [Actif]         │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Ligne] [Modem] [Services] [VoIP] [Options] [Taches]                      │
│ [Rechercher...]              │                                                           ======                    │
├──────────────────────────────┤                                                           NAV4=Taches (ACTIF)       │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [1 en cours]    [Toutes] [En cours] [Terminees] [Erreurs]             [Actualiser]  │
│ * Fibre Pro Paris        ████│ ────────────────────────────────────────────────────────────────────────────────────┤
│   xdsl-ab12345-1             │                                                                                     │
│   FTTH - Pack Pro            │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│   (SELECTIONNE)       [Actif]│  │ Taches                                                                     │     │
├──────────────────────────────┤  ├────────────────────────────────────────────────────────────────────────────┤     │
│ o VDSL Bureau Lyon           │  │                                                                            │     │
│   xdsl-cd67890-2             │  │  Operation              │ Statut      │ Debut        │ Fin         │ Details│     │
│   VDSL2 - Acces seul         │  │  ════════════════════════════════════════════════════════════════════════  │     │
│                       [Actif]│  │  Mise a jour firmware   │ [o] En cours│ 03/01 14:30  │ -           │ Livebox│     │
├──────────────────────────────┤  │  Changement DNS         │ [v] Termine │ 03/01 10:15  │ 03/01 10:16 │ Zone   │     │
│ o Backup 4G                  │  │  Resynchronisation      │ [v] Termine │ 02/01 08:00  │ 02/01 08:02 │ FTTH   │     │
│   xdsl-ef11111-3             │  │  Activation IPv6        │ [v] Termine │ 15/03/2023   │ 15/03/2023  │ Option │     │
│   4G/LTE - Acces seul        │  │  Installation           │ [v] Termine │ 15/03/2023   │ 15/03/2023  │ Service│     │
│                     [Degrade]│  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-5 sur 5                                          [<] [1] [>]           │
│                              │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "summary": {
    "inProgress": 1,
    "total": 5
  },
  "tasks": [
    {
      "operation": "Mise a jour firmware",
      "status": "in_progress",
      "start": "03/01 14:30",
      "end": null,
      "details": "Livebox 6"
    },
    {
      "operation": "Changement DNS",
      "status": "completed",
      "start": "03/01 10:15",
      "end": "03/01 10:16",
      "details": "Zone example.com"
    },
    {
      "operation": "Resynchronisation",
      "status": "completed",
      "start": "02/01 08:00",
      "end": "02/01 08:02",
      "details": "Ligne FTTH"
    },
    {
      "operation": "Activation IPv6",
      "status": "completed",
      "start": "15/03/2023",
      "end": "15/03/2023",
      "details": "Option ajoutee"
    },
    {
      "operation": "Installation",
      "status": "completed",
      "start": "15/03/2023",
      "end": "15/03/2023",
      "details": "Mise en service"
    }
  ]
}

================================================================================
