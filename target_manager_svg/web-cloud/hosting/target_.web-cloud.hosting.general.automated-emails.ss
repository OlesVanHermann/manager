================================================================================
SCREENSHOT: target_.web-cloud.hosting.general.automated-emails.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: General / Liste services (ALL 1er) | NAV4: Scripts Email

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                       =============                                                                                │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Sites][Offre]      │ monsite.ovh.net                                                                     │
│  =======                     │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=General (ACTIF)        │ [Dashboard] [Stats] [Logs] [Modules] [Emails] [Taches]                              │
├──────────────────────────────┤                                        ======                                       │
│ [Rechercher...]              │                                        NAV4=Scripts Email (ACTIF)                   │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ Scripts e-mail                                                         [Guide]      │
├──────────────────────────────┤ E-mails envoyes depuis des scripts CGI/PERL/PHP                                     │
│ o Tous les services          │                                                                                     │
│   4 hebergements             │  ┌──────────────────────────────┐  ┌──────────────────────────────┐                 │
│                              │  │ Etat du service              │  │ Statistiques                 │                 │
│ * monsite.ovh.net            │  ├──────────────────────────────┤  ├──────────────────────────────┤                 │
│   Performance 1              │  │                              │  │                              │                 │
│   Actif (SELECTIONNE)        │  │ Etat       [v] Actif         │  │ Total envoyes     12,456     │                 │
│                              │  │                              │  │ Envoyes aujourd   234        │                 │
│ o boutique.example.com       │  │ Rapport a  admin@monsite.fr  │  │ En erreur         [!] 18     │                 │
│   Pro                        │  │            [Changer]         │  │                              │                 │
│   Actif                      │  │                              │  │ (i) Pour purger, bloquer     │                 │
│                              │  │ [Bloquer l'envoi]            │  │     d'abord l'envoi          │                 │
│ o blog.monsite.fr            │  │                              │  │                              │                 │
│   Perso                      │  └──────────────────────────────┘  └──────────────────────────────┘                 │
│   Actif                      │                                                                                     │
│                              │  E-mails en erreur                                                                  │
│ o dev.test.ovh               │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   Start                      │  │ Date              │ E-mail              │ Message                           │   │
│   Maintenance                │  ├───────────────────┼─────────────────────┼───────────────────────────────────┤   │
│                              │  │ 03/01 14:32       │ user@invalid.xyz    │ 550 User unknown                  │   │
│                              │  │ 03/01 12:15       │ test@bounce.com     │ 550 Mailbox full                  │   │
│                              │  │ 02/01 18:45       │ spam@blocked.net    │ 554 Rejected (spam)               │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  3 erreurs sur 18                                              [<] 1 [>]            │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "automatedEmails": {
    "status": "active",
    "reportEmail": "admin@monsite.fr",
    "stats": {
      "totalSent": 12456,
      "sentToday": 234,
      "errors": 18
    },
    "recentErrors": [
      {"date": "03/01 14:32", "email": "user@invalid.xyz", "message": "550 User unknown"},
      {"date": "03/01 12:15", "email": "test@bounce.com", "message": "550 Mailbox full"},
      {"date": "02/01 18:45", "email": "spam@blocked.net", "message": "554 Rejected (spam)"}
    ],
    "errorPagination": {
      "shown": 3,
      "total": 18,
      "currentPage": 1
    }
  }
}

================================================================================
