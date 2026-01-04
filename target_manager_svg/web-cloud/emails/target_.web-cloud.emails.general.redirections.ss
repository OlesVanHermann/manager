================================================================================
SCREENSHOT: target_.web-cloud.emails.general.redirections.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Redirections

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
│ [Rechercher un domaine...]   │            ============                                                             │
├──────────────────────────────┤            NAV4=Redirections (ACTIF)                                                │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Creer une redirection]                                                           │
│ o Tous les services          │                                                                                     │
│   5 domaines - 47 comptes    │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Source                │ Destination            │ Type     │ Copie │ Actions │   │
│ * example.com                │  ├───────────────────────┼────────────────────────┼──────────┼───────┼─────────┤   │
│   12 comptes (SELECTIONNE)   │  │ info@example.com      │ ceo@example.com        │ Interne  │ [v]   │ [E] [X] │   │
│   [Exchange] [Email Pro]     │  │ sales@example.com     │ contact, support       │ Multiple │ [v]   │ [E] [X] │   │
│                              │  │ old@example.com       │ new@external.com       │ Externe  │ [x]   │ [E] [X] │   │
│ o mon-entreprise.fr          │  │ catch-all@example.com │ admin@example.com      │ Catch-all│ [v]   │ [E] [X] │   │
│   25 comptes [Exchange]      │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o boutique.shop              │  Legende:                                                                           │
│   5 comptes [Email Pro]      │  [E]=Modifier [X]=Supprimer                                                         │
│                              │  [v]=Copie locale activee [x]=Copie locale desactivee                               │
│ o perso.ovh                  │                                                                                     │
│   3 comptes [MX Plan]        │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Les redirections permettent de transferer automatiquement                │  │
│ o startup.io                 │  │     les emails vers une autre adresse.                                       │  │
│   8 comptes [Zimbra]         │  │                                                                               │  │
│                              │  │     "Copie locale" conserve une copie dans la boite source.                  │  │
│ [+ Ajouter un domaine]       │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "redirections": [
    {"source": "info@example.com", "destination": "ceo@example.com", "type": "internal", "localCopy": true},
    {"source": "sales@example.com", "destination": ["contact@example.com", "support@example.com"], "type": "multiple", "localCopy": true},
    {"source": "old@example.com", "destination": "new@external.com", "type": "external", "localCopy": false},
    {"source": "catch-all@example.com", "destination": "admin@example.com", "type": "catch-all", "localCopy": true}
  ]
}

================================================================================
