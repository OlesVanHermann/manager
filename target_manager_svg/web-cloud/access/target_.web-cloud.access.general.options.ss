================================================================================
SCREENSHOT: target_.web-cloud.access.general.options.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: Options

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
│ [Rechercher...]              │                                                  =======                            │
├──────────────────────────────┤                                                  NAV4=Options (ACTIF)               │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ * Fibre Pro Paris        ████│  ┌────────────────────────────────────────────────────────────────────────────┐     │
│   xdsl-ab12345-1             │  │ Options actives                                                            │     │
│   FTTH - Pack Pro            │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   (SELECTIONNE)       [Actif]│  │                                                                            │     │
├──────────────────────────────┤  │   IP Fixe v4                                          Inclus Pack Pro      │     │
│ o VDSL Bureau Lyon           │  │   86.123.45.67                                                             │     │
│   xdsl-cd67890-2             │  │                                                                            │     │
│   VDSL2 - Acces seul         │  │   IPv6                                                Inclus Pack Pro      │     │
│                       [Actif]│  │   2001:41d0:1234::1/64                                                     │     │
├──────────────────────────────┤  │   Active le 15/03/2023                                                     │     │
│ o Backup 4G                  │  │                                                                            │     │
│   xdsl-ef11111-3             │  │   GTR 4h                                              Inclus Pack Pro      │     │
│   4G/LTE - Acces seul        │  │   Garantie de temps de retablissement 4 heures                            │     │
│                     [Degrade]│  │   24h/24, 7j/7                                                             │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Options disponibles                                                        │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │                                                                            │     │
│                              │  │   Backup 4G                                          9,99€ HT/mois         │     │
│                              │  │   Basculement automatique en cas de panne fibre                           │     │
│                              │  │                                                            [Souscrire]     │     │
│                              │  │                                                                            │     │
│                              │  │   QoS Voix                                           4,99€ HT/mois         │     │
│                              │  │   Priorisation du trafic voix                                             │     │
│                              │  │                                                            [Souscrire]     │     │
│                              │  │                                                                            │     │
│                              │  │   Supervision Pro                                    2,99€ HT/mois         │     │
│                              │  │   Alertes et rapports detailles                                           │     │
│                              │  │                                                            [Souscrire]     │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "activeOptions": [
    {
      "name": "IP Fixe v4",
      "value": "86.123.45.67",
      "includedIn": "Pack Pro"
    },
    {
      "name": "IPv6",
      "value": "2001:41d0:1234::1/64",
      "activatedDate": "15/03/2023",
      "includedIn": "Pack Pro"
    },
    {
      "name": "GTR 4h",
      "description": "Garantie de temps de retablissement 4 heures, 24h/24, 7j/7",
      "includedIn": "Pack Pro"
    }
  ],
  "availableOptions": [
    {
      "name": "Backup 4G",
      "price": "9,99€ HT/mois",
      "description": "Basculement automatique en cas de panne fibre"
    },
    {
      "name": "QoS Voix",
      "price": "4,99€ HT/mois",
      "description": "Priorisation du trafic voix"
    },
    {
      "name": "Supervision Pro",
      "price": "2,99€ HT/mois",
      "description": "Alertes et rapports detailles"
    }
  ]
}

================================================================================
