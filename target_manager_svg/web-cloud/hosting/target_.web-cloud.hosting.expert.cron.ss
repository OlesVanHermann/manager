================================================================================
SCREENSHOT: target_.web-cloud.hosting.expert.cron.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Expert / Liste services (ALL 1er) | NAV4: Cron

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
│  ======                      │ ... [Variables] [OvhConfig] [Runtimes] [Cron] [Taches] [CloudDb]                    │
│  NAV3=Expert (ACTIF)         │                                         ====                                        │
├──────────────────────────────┤                                         NAV4=Cron (ACTIF)                           │
│ [Rechercher...]              │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Creer une tache cron]                                                            │
│ Filtre: [Tous v] 4 services  │                                                                                     │
├──────────────────────────────┤  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ o Tous les services          │  │ Commande            │ Frequence           │ Derniere exec │ Etat  │ Actions│   │
│   4 hebergements             │  ├─────────────────────┼─────────────────────┼───────────────┼───────┼────────┤   │
│                              │  │ php www/cron/daily  │ Tous les jours 03:00│ 03/01 03:00 v │ Actif │[E][>][X]│  │
│ * monsite.ovh.net            │  │ php www/cron/hourly │ Toutes les heures   │ 03/01 14:00 v │ Actif │[E][>][X]│  │
│   Performance 1              │  │ php artisan sched.. │ Toutes les minutes  │ 03/01 14:32 v │ Actif │[E][>][X]│  │
│   Actif (SELECTIONNE)        │  │ php www/cron/backup │ Dim a 02:00         │ 29/12 02:00 v │ Actif │[E][>][X]│  │
│                              │  │ php www/cron/clean  │ 1er du mois 04:00   │ 01/01 04:00 x │ Erreur│[E][>][L][X]││
│ o boutique.example.com       │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   Pro                        │                                                                                     │
│   Actif                      │  Legende:                                                                           │
│                              │  [E]=Modifier [>]=Executer maintenant [L]=Voir logs [X]=Supprimer                   │
│ o blog.monsite.fr            │                                                                                     │
│   Perso                      │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Actif                      │  │ Quota                                                                         │  │
│                              │  │ Taches cron: 5 / 20                                                           │  │
│ o dev.test.ovh               │  │ Frequence minimale: 1 minute (offre Performance)                              │  │
│   Start                      │  └───────────────────────────────────────────────────────────────────────────────┘  │
│   Maintenance                │                                                                                     │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "cronTasks": [
    {"command": "php www/cron/daily.php", "frequency": "Tous les jours a 03:00", "lastExec": "03/01 03:00", "success": true, "status": "active"},
    {"command": "php www/cron/hourly.php", "frequency": "Toutes les heures", "lastExec": "03/01 14:00", "success": true, "status": "active"},
    {"command": "php www/artisan schedule:run", "frequency": "Toutes les minutes", "lastExec": "03/01 14:32", "success": true, "status": "active"},
    {"command": "php www/cron/backup.php", "frequency": "Dim a 02:00", "lastExec": "29/12 02:00", "success": true, "status": "active"},
    {"command": "php www/cron/cleanup.php", "frequency": "1er du mois a 04:00", "lastExec": "01/01 04:00", "success": false, "status": "error"}
  ],
  "quota": {
    "used": 5,
    "total": 20,
    "minFrequency": "1 minute"
  }
}

================================================================================
