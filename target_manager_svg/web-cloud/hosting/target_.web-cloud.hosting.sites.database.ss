================================================================================
SCREENSHOT: target_.web-cloud.hosting.sites.database.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Sites / Liste services (ALL 1er) | NAV4: BDD
NAV5: Liste (actif) | Statistiques | Dumps

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
│          =====               │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=Sites (ACTIF)          │ [Multisite] [SSL] [FTP-SSH] [BDD] [CDN]                                             │
├──────────────────────────────┤                              ===                                                    │
│ [Rechercher...]              │                              NAV4=BDD (ACTIF)                                       │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [Liste] | Statistiques | Dumps                                                      │
├──────────────────────────────┤  =====                                                                              │
│ o Tous les services          │  NAV5=Liste (ACTIF)                                                                 │
│   4 hebergements             ├─────────────────────────────────────────────────────────────────────────────────────┤
│                              │ [+ Creer une base]                                            [phpMyAdmin]          │
│ * monsite.ovh.net            │                                                                                     │
│   Performance 1              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   Actif (SELECTIONNE)        │  │ Nom            │ Type       │ Serveur                    │ Taille │ Actions │   │
│                              │  ├────────────────┼────────────┼────────────────────────────┼────────┼─────────┤   │
│ o boutique.example.com       │  │ monsite_db     │ MySQL 8.0  │ mysql42.sql.hosting.ovh.net│ 245 Mo │ [E][K][D][C][X]│
│   Pro                        │  │ boutique_db    │ MySQL 8.0  │ mysql42.sql.hosting.ovh.net│ 89 Mo  │ [E][K][D][C][X]│
│   Actif                      │  │ wp_cache       │ MySQL 8.0  │ mysql42.sql.hosting.ovh.net│ 12 Mo  │ [E][K][D][C][X]│
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│ o blog.monsite.fr            │                                                                                     │
│   Perso                      │  Legende:                                                                           │
│   Actif                      │  [E]=Modifier [K]=Changer MDP [D]=Creer dump [C]=Copier/Restaurer [X]=Supprimer     │
│                              │                                                                                     │
│ o dev.test.ovh               │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Start                      │  │ Quota                                                                         │  │
│   Maintenance                │  │ Bases utilisees: 3 / 10                                                       │  │
│                              │  │ Espace total: 346 Mo / 1 Go                                                   │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "databases": [
    {"name": "monsite_db", "type": "MySQL 8.0", "server": "mysql42.sql.hosting.ovh.net", "size": "245 Mo"},
    {"name": "boutique_db", "type": "MySQL 8.0", "server": "mysql42.sql.hosting.ovh.net", "size": "89 Mo"},
    {"name": "wp_cache", "type": "MySQL 8.0", "server": "mysql42.sql.hosting.ovh.net", "size": "12 Mo"}
  ],
  "quota": {
    "used": 3,
    "total": 10,
    "spaceUsed": "346 Mo",
    "spaceTotal": "1 Go"
  }
}

================================================================================
