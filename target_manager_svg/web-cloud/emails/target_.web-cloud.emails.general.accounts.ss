================================================================================
SCREENSHOT: target_.web-cloud.emails.general.accounts.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Comptes

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
│ [Rechercher un domaine...]   │  =======                                                                            │
├──────────────────────────────┤  NAV4=Comptes (ACTIF)                                                               │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Creer un compte]  [Importer] [Exporter]           Filtre: [Toutes offres v]      │
│ o Tous les services          │ [Rechercher...]                                                                     │
│   5 domaines - 47 comptes    │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ * example.com                │  │ Compte              │ Offre       │ Quota     │ Statut   │ Actions          │   │
│   12 comptes (SELECTIONNE)   │  ├─────────────────────┼─────────────┼───────────┼──────────┼──────────────────┤   │
│   [Exchange] [Email Pro]     │  │ ceo@example.com     │ Exchange    │ 45/50 Go  │ Actif    │ [E][K][A][D][M][X]│  │
│                              │  │ contact@example.com │ Email Pro   │ 8/10 Go   │ Actif    │ [E][K][A][D][X]  │   │
│ o mon-entreprise.fr          │  │ support@example.com │ Email Pro   │ 6/10 Go   │ Actif    │ [E][K][A][D][X]  │   │
│   25 comptes [Exchange]      │  │ admin@example.com   │ Exchange    │ 12/50 Go  │ Actif    │ [E][K][A][D][M][X]│  │
│                              │  │ dev@example.com     │ MX Plan     │ 2/5 Go    │ Actif    │ [E][K][X]        │   │
│ o boutique.shop              │  │ newsletter@example  │ Email Pro   │ 1/10 Go   │ Suspendu │ [E][K][>][X]     │   │
│   5 comptes [Email Pro]      │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o perso.ovh                  │  6 comptes sur 12                                            [<] [1] [2] [>]        │
│   3 comptes [MX Plan]        │                                                                                     │
│                              │  Legende:                                                                           │
│ o startup.io                 │  [E]=Modifier [K]=Mot de passe [A]=Alias [D]=Delegation                            │
│   8 comptes [Zimbra]         │  [M]=MFA (Exchange) [X]=Supprimer [>]=Reactiver                                     │
│                              │                                                                                     │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "domain": "example.com",
  "totalAccounts": 12,
  "offers": ["exchange", "email-pro"],
  "accounts": [
    {"email": "ceo@example.com", "type": "exchange", "quota": {"used": 45, "total": 50}, "status": "active", "mfa": true},
    {"email": "contact@example.com", "type": "email-pro", "quota": {"used": 8, "total": 10}, "status": "active"},
    {"email": "support@example.com", "type": "email-pro", "quota": {"used": 6, "total": 10}, "status": "active"},
    {"email": "admin@example.com", "type": "exchange", "quota": {"used": 12, "total": 50}, "status": "active", "mfa": true},
    {"email": "dev@example.com", "type": "mx-plan", "quota": {"used": 2, "total": 5}, "status": "active"},
    {"email": "newsletter@example.com", "type": "email-pro", "quota": {"used": 1, "total": 10}, "status": "suspended"}
  ],
  "pagination": {"shown": 6, "total": 12, "currentPage": 1, "totalPages": 2}
}

================================================================================
