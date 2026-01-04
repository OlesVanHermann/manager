================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.zone.history.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: Zone DNS
NAV5: Enregistrements | Historique (actif)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines et DNS] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                     │
│            =================                                                                                       │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][DNS][Expert]       │ example.com                                                                         │
│          ===                 │ [.com] [Actif] [DNSSEC ok]                                                          │
│          NAV3=DNS (ACTIF)    ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Infos DNS][Serveurs DNS][Zone DNS][DNSSEC][SPF][DKIM][DMARC]...                    │
│ [Rechercher...]              │                           ========                                                  │
├──────────────────────────────┤                           NAV4=Zone DNS (ACTIF)                                     │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Enregistrements | [Historique]                                                      │
│ o Tous les services          │                   ==========                                                        │
│   5 domaines                 │                   NAV5=Historique (ACTIF)                                           │
│                              ├─────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com          [.com]│                                                                                     │
│   Actif (SELECTIONNE)        │  Historique de la zone DNS                                                          │
│                              │  Restaurez une version anterieure de votre zone                                     │
│ o mon-site.fr          [.fr] │                                                                                     │
│   Actif                      │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Date               │ Heure  │ Modifications        │ Actions                │   │
│ o boutique.shop       [.shop]│  ├────────────────────┼────────┼──────────────────────┼────────────────────────┤   │
│   Expire bientot             │  │ 03/01/2026         │ 14:32  │ +2 records (MX)      │ [Voir] [Restaurer]     │   │
│                              │  │ 03/01/2026         │ 10:15  │ +1 record (TXT/SPF)  │ [Voir] [Restaurer]     │   │
│ o api.example.com            │  │ 02/01/2026         │ 18:45  │ -3 records (CNAME)   │ [Voir] [Restaurer]     │   │
│   Zone seule                 │  │ 01/01/2026         │ 12:00  │ +5 records (init)    │ [Voir] [Restaurer]     │   │
│                              │  │ 28/12/2025         │ 09:30  │ +2 records (A)       │ [Voir] [Restaurer]     │   │
│ o legacy.org         [.org]  │  │ 25/12/2025         │ 15:22  │ +1 record (AAAA)     │ [Voir] [Restaurer]     │   │
│   Expire                     │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  6 versions sur 15                                     [<] [1] [2] [3] [>]          │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Les versions sont conservees pendant 90 jours.                           │  │
│                              │  │     Pour exporter une version, cliquez sur [Voir] puis [Exporter].           │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "history": [
    {"date": "2026-01-03", "time": "14:32", "changes": "+2 records (MX)"},
    {"date": "2026-01-03", "time": "10:15", "changes": "+1 record (TXT/SPF)"},
    {"date": "2026-01-02", "time": "18:45", "changes": "-3 records (CNAME)"},
    {"date": "2026-01-01", "time": "12:00", "changes": "+5 records (init)"},
    {"date": "2025-12-28", "time": "09:30", "changes": "+2 records (A)"},
    {"date": "2025-12-25", "time": "15:22", "changes": "+1 record (AAAA)"}
  ],
  "total": 15,
  "retentionDays": 90
}

================================================================================
