================================================================================
SCREENSHOT: target_.web-cloud.hosting.expert.envvars.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Expert / Liste services (ALL 1er) | NAV4: Variables

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
│                              │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  ======                      │ [General] [Boost] [Indy] [Emails] [Variables] [OvhConfig] [Runtimes] [Cron] [Taches] [CloudDb]
│  NAV3=Expert (ACTIF)         │                                   =========                                         │
├──────────────────────────────┤                                   NAV4=Variables (ACTIF)                            │
│ [Rechercher...]              │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Ajouter une variable]                                                            │
│ Filtre: [Tous v] 4 services  │                                                                                     │
├──────────────────────────────┤  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ o Tous les services          │  │ Nom                │ Valeur                              │ Actions          │   │
│   4 hebergements             │  ├────────────────────┼─────────────────────────────────────┼──────────────────┤   │
│                              │  │ DATABASE_URL       │ mysql://user:***@mysql42.sql...     │ [O] [E] [X]      │   │
│ * monsite.ovh.net            │  │ APP_ENV            │ production                          │ [O] [E] [X]      │   │
│   Performance 1              │  │ APP_SECRET         │ ********************************    │ [O] [E] [X]      │   │
│   Actif (SELECTIONNE)        │  │ SMTP_HOST          │ ssl0.ovh.net                        │ [O] [E] [X]      │   │
│                              │  │ SMTP_PORT          │ 465                                 │ [O] [E] [X]      │   │
│ o boutique.example.com       │  │ API_KEY            │ ********************************    │ [O] [E] [X]      │   │
│   Pro                        │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   Actif                      │                                                                                     │
│                              │  Legende:                                                                           │
│ o blog.monsite.fr            │  [O]=Voir valeur [E]=Modifier [X]=Supprimer                                         │
│   Perso                      │                                                                                     │
│   Actif                      │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Les variables d'environnement sont accessibles dans vos scripts          │  │
│ o dev.test.ovh               │  │     via $_ENV ou getenv() en PHP, process.env en Node.js.                    │  │
│   Start                      │  │                                                                               │  │
│   Maintenance                │  │     Redemarrage automatique apres modification.                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "envVars": [
    {"name": "DATABASE_URL", "value": "mysql://user:password@mysql42.sql.hosting.ovh.net/monsite_db", "masked": true},
    {"name": "APP_ENV", "value": "production", "masked": false},
    {"name": "APP_SECRET", "value": "XXX", "masked": true},
    {"name": "SMTP_HOST", "value": "ssl0.ovh.net", "masked": false},
    {"name": "SMTP_PORT", "value": "465", "masked": false},
    {"name": "API_KEY", "value": "XXX", "masked": true}
  ]
}

================================================================================
