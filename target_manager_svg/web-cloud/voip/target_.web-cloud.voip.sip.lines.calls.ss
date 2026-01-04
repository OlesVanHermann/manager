================================================================================
SCREENSHOT: target_.web-cloud.voip.sip.lines.calls.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Lignes | NAV4: Appels
NOTE: Hub gestion appels (renvois, filtrage, logs)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ +33 9 72 10 12 34                                                     [Actif]       │
│ [Trunk (0)]                  │ Ligne Accueil - Cisco IP Phone 8845                                                 │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │ [General] [Telephone] [Appels] [Renvois] [Messagerie] [Consommation] [Options]      │
├──────────────────────────────┤                        ======                                                       │
│ [Rechercher...]              │                        NAV4=Appels (ACTIF)                                          │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌───────────────────────────────────────┐  ┌───────────────────────────────────┐   │
│ ├──────────┼───────────────┤ │  │ Filtrage d'appels                     │  │ Appel en attente                  │   │
│ │Numeros(8)│ Services      │ │  ├───────────────────────────────────────┤  ├───────────────────────────────────┤   │
│ └──────────┴───────────────┘ │  │                                       │  │                                   │   │
│ NAV3b=Lignes (ACTIF)         │  │  Mode         [Aucun filtrage v]      │  │  [x] Activer le signal d'appel    │   │
├──────────────────────────────┤  │                                       │  │      en attente                   │   │
│ 5 lignes                     │  │  - Aucun filtrage                     │  │                                   │   │
├──────────────────────────────┤  │  - Liste blanche uniquement           │  │  [x] Permettre le transfert       │   │
│ * Ligne Accueil          ████│  │  - Liste noire bloques               │  │      d'appel                      │   │
│   +33 9 72 10 12 34          │  │                                       │  │                                   │   │
│   Cisco IP Phone 8845        │  └───────────────────────────────────────┘  └───────────────────────────────────┘   │
│   (SELECTIONNE)       [Actif]│                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ o Ligne Direction            │  │ Historique des appels (7 derniers jours)                    [Exporter]     │     │
│   +33 9 72 10 12 35          │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   Yealink T46S               │  │                                                                            │     │
│                       [Actif]│  │  [Tous (156)] [Entrants (89)] [Sortants (67)] [Manques (12)]               │     │
├──────────────────────────────┤  │                                                                            │     │
│ o Ligne Commercial           │  │  Date/Heure   │ Dir│ Correspondant   │ Duree │ Statut                     │     │
│   +33 9 72 10 12 36          │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│   Softphone                  │  │  03/01 14:32  │ E  │ +33 6 12 34 56 78│ 05:23 │ [v] Decroche               │     │
│                       [Actif]│  │  03/01 12:15  │ S  │ +33 1 42 86 55 00│ 02:45 │ [v] Abouti                 │     │
│                              │  │  03/01 10:30  │ E  │ +33 6 98 76 54 32│   -   │ [x] Manque                 │     │
│                              │  │  03/01 09:00  │ E  │ +33 1 55 00 00 00│ 01:30 │ [v] Decroche               │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "filtering": {
    "mode": "none",
    "options": ["Aucun filtrage", "Liste blanche uniquement", "Liste noire bloques"]
  },
  "callWaiting": {
    "signalEnabled": true,
    "transferEnabled": true
  },
  "callHistory": {
    "period": "7 derniers jours",
    "filters": {
      "all": 156,
      "incoming": 89,
      "outgoing": 67,
      "missed": 12
    },
    "calls": [
      {"datetime": "03/01 14:32", "direction": "incoming", "correspondent": "+33 6 12 34 56 78", "duration": "05:23", "status": "answered"},
      {"datetime": "03/01 12:15", "direction": "outgoing", "correspondent": "+33 1 42 86 55 00", "duration": "02:45", "status": "completed"},
      {"datetime": "03/01 10:30", "direction": "incoming", "correspondent": "+33 6 98 76 54 32", "duration": null, "status": "missed"},
      {"datetime": "03/01 09:00", "direction": "incoming", "correspondent": "+33 1 55 00 00 00", "duration": "01:30", "status": "answered"}
    ]
  }
}

================================================================================
