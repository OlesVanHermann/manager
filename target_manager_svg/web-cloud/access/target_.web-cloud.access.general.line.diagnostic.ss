================================================================================
SCREENSHOT: target_.web-cloud.access.general.line.diagnostic.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: Ligne | NAV5: Diagnostic

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
│ [Rechercher...]              │            =====                                                                    │
├──────────────────────────────┤            NAV4=Ligne (ACTIF)                                                       │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Statut] [Diagnostic] [Statistiques] [Alertes]            [Lancer un diagnostic]    │
│ * Fibre Pro Paris        ████│            ==========                                                               │
│   xdsl-ab12345-1             │            NAV5=Diagnostic (ACTIF)                                                  │
│   FTTH - Pack Pro            │ ────────────────────────────────────────────────────────────────────────────────────┤
│   (SELECTIONNE)       [Actif]│                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ o VDSL Bureau Lyon           │  │ Diagnostic du 03/01/2026 a 14:30                              [v] OK       │     │
│   xdsl-cd67890-2             │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   VDSL2 - Acces seul         │  │                                                                            │     │
│                       [Actif]│  │   [v] Ligne physique                                          OK           │     │
├──────────────────────────────┤  │       Fibre connectee, signal optimal                                      │     │
│ o Backup 4G                  │  │                                                                            │     │
│   xdsl-ef11111-3             │  │   [v] Synchronisation                                         OK           │     │
│   4G/LTE - Acces seul        │  │       1000/500 Mbps - Stable depuis 48h                                    │     │
│                     [Degrade]│  │                                                                            │     │
│                              │  │   [v] Authentification                                        OK           │     │
│                              │  │       Session PPPoE active                                                 │     │
│                              │  │                                                                            │     │
│                              │  │   [v] Routage                                                 OK           │     │
│                              │  │       Gateway accessible, routes OK                                        │     │
│                              │  │                                                                            │     │
│                              │  │   [v] DNS                                                     OK           │     │
│                              │  │       Resolution en 12ms                                                   │     │
│                              │  │                                                                            │     │
│                              │  │   [v] Services OVH                                            OK           │     │
│                              │  │       API et services accessibles                                          │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Historique diagnostics                                                     │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │  Date/Heure  │ Resultat    │ Duree│ Details                               │     │
│                              │  │  03/01 14:30 │ [v] OK      │  45s │ Tout OK                               │     │
│                              │  │  02/01 10:15 │ [v] OK      │  42s │ Tout OK                               │     │
│                              │  │  01/01 09:00 │ [o] Partiel │  38s │ DNS lent (250ms)                      │     │
│                              │  │  28/12 16:45 │ [v] OK      │  44s │ Tout OK                               │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "lastDiagnostic": {
    "date": "03/01/2026 14:30",
    "result": "ok",
    "tests": [
      {"name": "Ligne physique", "status": "ok", "detail": "Fibre connectee, signal optimal"},
      {"name": "Synchronisation", "status": "ok", "detail": "1000/500 Mbps - Stable depuis 48h"},
      {"name": "Authentification", "status": "ok", "detail": "Session PPPoE active"},
      {"name": "Routage", "status": "ok", "detail": "Gateway accessible, routes OK"},
      {"name": "DNS", "status": "ok", "detail": "Resolution en 12ms"},
      {"name": "Services OVH", "status": "ok", "detail": "API et services accessibles"}
    ]
  },
  "history": [
    {"datetime": "03/01 14:30", "result": "ok", "duration": "45s", "details": "Tout OK"},
    {"datetime": "02/01 10:15", "result": "ok", "duration": "42s", "details": "Tout OK"},
    {"datetime": "01/01 09:00", "result": "partial", "duration": "38s", "details": "DNS lent (250ms)"},
    {"datetime": "28/12 16:45", "result": "ok", "duration": "44s", "details": "Tout OK"}
  ]
}

================================================================================
