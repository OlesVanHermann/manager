================================================================================
SCREENSHOT: target_.web-cloud.access.general.voip.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: VoIP | NAV5: Lignes

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
│ [Rechercher...]              │                                       ====                                          │
├──────────────────────────────┤                                       NAV4=VoIP (ACTIF)                             │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Lignes] [EcoFax]                                            [+ Ajouter une ligne]  │
│ * Fibre Pro Paris        ████│  ======                                                                             │
│   xdsl-ab12345-1             │  NAV5=Lignes (ACTIF)                                                                │
│   FTTH - Pack Pro            │ ────────────────────────────────────────────────────────────────────────────────────┤
│   (SELECTIONNE)       [Actif]│                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ o VDSL Bureau Lyon           │  │ +33 9 72 10 12 34                                        [v] Active       │     │
│   xdsl-cd67890-2             │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   VDSL2 - Acces seul         │  │                                                                            │     │
│                       [Actif]│  │   Description     Ligne principale                                         │     │
├──────────────────────────────┤  │   Type            VoIP incluse (Pack Pro)                                  │     │
│ o Backup 4G                  │  │   Equipement      Livebox 6 (port TEL1)                                    │     │
│   xdsl-ef11111-3             │  │                                                                            │     │
│   4G/LTE - Acces seul        │  │   Fonctionnalites:                                                         │     │
│                     [Degrade]│  │     [x] Messagerie vocale                                                  │     │
│                              │  │     [x] Presentation du numero                                             │     │
│                              │  │     [x] Renvoi d'appels                                                    │     │
│                              │  │     [ ] Double appel                                                       │     │
│                              │  │                                                                            │     │
│                              │  │                             [Configurer] [Historique appels]               │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ (i) Ajouter des lignes supplementaires                                     │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │                                                                            │     │
│                              │  │   Vous pouvez ajouter jusqu'a 5 lignes VoIP supplementaires               │     │
│                              │  │   sur votre connexion internet.                                           │     │
│                              │  │                                                                            │     │
│                              │  │   A partir de 1,99€ HT/mois par ligne                                     │     │
│                              │  │                                                                            │     │
│                              │  │                                           [Commander une ligne ->]         │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "voipLines": [
    {
      "number": "+33 9 72 10 12 34",
      "description": "Ligne principale",
      "type": "VoIP incluse (Pack Pro)",
      "equipment": "Livebox 6 (port TEL1)",
      "status": "active",
      "features": {
        "voicemail": true,
        "callerId": true,
        "callForward": true,
        "callWaiting": false
      }
    }
  ],
  "maxLines": 5,
  "additionalLinePrice": "1,99€ HT/mois"
}

================================================================================
