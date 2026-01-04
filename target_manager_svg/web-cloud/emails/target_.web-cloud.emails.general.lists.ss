================================================================================
SCREENSHOT: target_.web-cloud.emails.general.lists.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Listes

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
│ [Rechercher un domaine...]   │                                       ======                                        │
├──────────────────────────────┤                                       NAV4=Listes (ACTIF)                           │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Creer une liste]                                                                 │
│ o Tous les services          │                                                                                     │
│   5 domaines - 47 comptes    │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Liste                │ Membres │ Moderation   │ Proprietaire    │ Actions   │   │
│ * example.com                │  ├──────────────────────┼─────────┼──────────────┼─────────────────┼───────────┤   │
│   12 comptes (SELECTIONNE)   │  │ team@example.com     │ 8       │ Aucune       │ ceo@example.com │ [U][E][X] │   │
│   [Exchange] [Email Pro]     │  │ dev@example.com      │ 4       │ Aucune       │ admin@example.com│ [U][E][X] │  │
│                              │  │ newsletter@example   │ 156     │ Proprietaire │ contact@example │ [U][E][X] │   │
│ o mon-entreprise.fr          │  │ support-ext@example  │ 3       │ Tous         │ support@example │ [U][E][X] │   │
│   25 comptes [Exchange]      │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o boutique.shop              │  Legende:                                                                           │
│   5 comptes [Email Pro]      │  [U]=Gerer les membres [E]=Modifier parametres [X]=Supprimer                        │
│                              │                                                                                     │
│ o perso.ovh                  │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   3 comptes [MX Plan]        │  │ Types de moderation:                                                          │  │
│                              │  │                                                                               │  │
│ o startup.io                 │  │ Aucune       - Tous peuvent envoyer                                          │  │
│   8 comptes [Zimbra]         │  │ Proprietaire - Seul le proprietaire peut envoyer                             │  │
│                              │  │ Tous         - Tous les messages sont moderes                                │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "mailingLists": [
    {"email": "team@example.com", "members": 8, "moderation": "none", "owner": "ceo@example.com"},
    {"email": "dev@example.com", "members": 4, "moderation": "none", "owner": "admin@example.com"},
    {"email": "newsletter@example.com", "members": 156, "moderation": "owner", "owner": "contact@example.com"},
    {"email": "support-ext@example.com", "members": 3, "moderation": "all", "owner": "support@example.com"}
  ]
}

================================================================================
