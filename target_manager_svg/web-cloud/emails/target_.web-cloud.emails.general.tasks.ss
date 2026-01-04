================================================================================
SCREENSHOT: target_.web-cloud.emails.general.tasks.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Taches

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │ example.com                                                                         │
│  =======                     │ 12 comptes - Exchange + Email Pro                    [Exchange] [Email Pro]         │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Comptes] [Redirections] [Repondeurs] [Listes] [Securite] [Avance] [Taches]         │
│ [Rechercher un domaine...]   │                                                                     ======          │
├──────────────────────────────┤                                                                     NAV4=Taches     │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Taches (1 en cours)                                        [Actualiser]             │
│ o Tous les services          │ Filtres: [Toutes] [En cours] [Terminees] [Erreurs]                                  │
│   5 domaines - 47 comptes    │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ * example.com                │  │ Operation           │ Compte            │ Statut   │ Debut       │ Fin      │   │
│   12 comptes (SELECTIONNE)   │  ├─────────────────────┼───────────────────┼──────────┼─────────────┼──────────┤   │
│   [Exchange] [Email Pro]     │  │ Creation compte     │ new@example.com   │ En cours │ 03/01 14:30 │ -        │   │
│                              │  │ Modification MDP    │ support@example   │ Terminee │ 03/01 12:00 │ 12:01    │   │
│ o mon-entreprise.fr          │  │ Ajout alias         │ ceo@example.com   │ Terminee │ 03/01 10:15 │ 10:16    │   │
│   25 comptes [Exchange]      │  │ Activation MFA      │ admin@example.com │ Terminee │ 02/01 16:00 │ 16:05    │   │
│                              │  │ Import CSV          │ 5 comptes         │ Erreur   │ 02/01 14:00 │ 14:02    │   │
│ o boutique.shop              │  │ Migration Exchange  │ 3 comptes         │ Terminee │ 01/01 00:00 │ 02:30    │   │
│   5 comptes [Email Pro]      │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o perso.ovh                  │                                                                                     │
│   3 comptes [MX Plan]        │                                                                                     │
│                              │                                                                                     │
│ o startup.io                 │                                                                                     │
│   8 comptes [Zimbra]         │                                                                                     │
│                              │                                                                                     │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "tasks": [
    {"operation": "Creation compte", "account": "new@example.com", "status": "in_progress", "start": "03/01 14:30", "end": null},
    {"operation": "Modification MDP", "account": "support@example.com", "status": "done", "start": "03/01 12:00", "end": "03/01 12:01"},
    {"operation": "Ajout alias", "account": "ceo@example.com", "status": "done", "start": "03/01 10:15", "end": "03/01 10:16"},
    {"operation": "Activation MFA", "account": "admin@example.com", "status": "done", "start": "02/01 16:00", "end": "02/01 16:05"},
    {"operation": "Import CSV", "account": "5 comptes", "status": "error", "start": "02/01 14:00", "end": "02/01 14:02"},
    {"operation": "Migration Exchange", "account": "3 comptes", "status": "done", "start": "01/01 00:00", "end": "01/01 02:30"}
  ]
}

================================================================================
