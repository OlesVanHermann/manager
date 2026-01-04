================================================================================
SCREENSHOT: target_.web-cloud.emails.general.mailing-lists.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Listes
VUE DETAIL: Gestion des membres d'une liste de diffusion

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
├──────────────────────────────┤ [<- Retour aux listes]                                                              │
│ o Tous les services          │                                                                                     │
│   5 domaines - 47 comptes    │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ team@example.com                                             8 membres       │  │
│ * example.com                │  │                                                                               │  │
│   12 comptes (SELECTIONNE)   │  │ Proprietaire: ceo@example.com                                                 │  │
│   [Exchange] [Email Pro]     │  │ Moderation: Aucune (tous peuvent poster)                                      │  │
│                              │  │ Creee le: 15/09/2024                                                          │  │
│ o mon-entreprise.fr          │  └───────────────────────────────────────────────────────────────────────────────┘  │
│   25 comptes [Exchange]      │                                                                                     │
│                              │  Membres (8)                                            [+ Ajouter un membre]       │
│ o boutique.shop              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   5 comptes [Email Pro]      │  │ Email                    │ Type      │ Role       │ Actions                 │   │
│                              │  ├──────────────────────────┼───────────┼────────────┼─────────────────────────┤   │
│ o perso.ovh                  │  │ ceo@example.com          │ Interne   │ Moderateur │ [E] [X]                 │   │
│   3 comptes [MX Plan]        │  │ admin@example.com        │ Interne   │ Membre     │ [E] [X]                 │   │
│                              │  │ dev@example.com          │ Interne   │ Membre     │ [E] [X]                 │   │
│ o startup.io                 │  │ support@example.com      │ Interne   │ Membre     │ [E] [X]                 │   │
│   8 comptes [Zimbra]         │  │ contact@example.com      │ Interne   │ Membre     │ [E] [X]                 │   │
│                              │  │ finance@example.com      │ Interne   │ Membre     │ [E] [X]                 │   │
│                              │  │ external@partner.com     │ Externe   │ Membre     │ [E] [X]                 │   │
│                              │  │ client@client.fr         │ Externe   │ Membre     │ [E] [X]                 │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Parametres de la liste                        [Modifier parametres]      │  │
│                              │  │ * Tous les membres peuvent envoyer des messages                              │  │
│                              │  │ * Reponses envoyees a la liste (reply-to: team@example.com)                  │  │
│ [+ Ajouter un domaine]       │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "mailingList": {
    "email": "team@example.com",
    "members": 8,
    "owner": "ceo@example.com",
    "moderation": "none",
    "createdAt": "2024-09-15",
    "replyTo": "list"
  },
  "members": [
    {"email": "ceo@example.com", "type": "internal", "role": "moderator"},
    {"email": "admin@example.com", "type": "internal", "role": "member"},
    {"email": "dev@example.com", "type": "internal", "role": "member"},
    {"email": "support@example.com", "type": "internal", "role": "member"},
    {"email": "contact@example.com", "type": "internal", "role": "member"},
    {"email": "finance@example.com", "type": "internal", "role": "member"},
    {"email": "external@partner.com", "type": "external", "role": "member"},
    {"email": "client@client.fr", "type": "external", "role": "member"}
  ]
}

================================================================================
