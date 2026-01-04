================================================================================
SCREENSHOT: target_.web-cloud.emails.general.responders.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Repondeurs

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
│ [Rechercher un domaine...]   │                          ==========                                                 │
├──────────────────────────────┤                          NAV4=Repondeurs (ACTIF)                                    │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [+ Configurer un repondeur]                                                         │
│ o Tous les services          │                                                                                     │
│   5 domaines - 47 comptes    │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Compte             │ Statut    │ Periode           │ Message      │ Actions │   │
│ * example.com                │  ├────────────────────┼───────────┼───────────────────┼──────────────┼─────────┤   │
│   12 comptes (SELECTIONNE)   │  │ ceo@example.com    │ [v] Actif │ 24/12 -> 02/01    │ "Je suis..." │ [E] [X] │   │
│   [Exchange] [Email Pro]     │  │ contact@example.com│ [x] Inactif │ -               │ -            │[+ Config]│  │
│                              │  │ support@example.com│ [o] Planifie│ 15/01 -> 20/01  │ "En form..." │ [E] [X] │   │
│ o mon-entreprise.fr          │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   25 comptes [Exchange]      │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│ o boutique.shop              │  │ ceo@example.com                                               [v] Actif       │  │
│   5 comptes [Email Pro]      │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│ o perso.ovh                  │  │ Periode: 24/12/2025 -> 02/01/2026                                             │  │
│   3 comptes [MX Plan]        │  │                                                                               │  │
│                              │  │ Message:                                                                      │  │
│ o startup.io                 │  │ ┌─────────────────────────────────────────────────────────────────────────┐   │  │
│   8 comptes [Zimbra]         │  │ │ Bonjour,                                                                │   │  │
│                              │  │ │                                                                         │   │  │
│                              │  │ │ Je suis actuellement absent du bureau et ne pourrai                    │   │  │
│                              │  │ │ pas repondre a votre email avant le 3 janvier 2026.                    │   │  │
│                              │  │ │                                                                         │   │  │
│                              │  │ │ Pour toute urgence, contactez support@example.com.                     │   │  │
│                              │  │ │                                                                         │   │  │
│                              │  │ │ Cordialement,                                                           │   │  │
│                              │  │ │ Jean Dupont                                                             │   │  │
│                              │  │ └─────────────────────────────────────────────────────────────────────────┘   │  │
│                              │  │                                                                               │  │
│                              │  │                                        [Modifier] [X Desactiver]              │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "responders": [
    {
      "email": "ceo@example.com",
      "status": "active",
      "startDate": "2025-12-24",
      "endDate": "2026-01-02",
      "message": "Bonjour,\n\nJe suis actuellement absent du bureau et ne pourrai pas repondre a votre email avant le 3 janvier 2026.\n\nPour toute urgence, contactez support@example.com.\n\nCordialement,\nJean Dupont"
    },
    {"email": "contact@example.com", "status": "inactive"},
    {"email": "support@example.com", "status": "scheduled", "startDate": "2026-01-15", "endDate": "2026-01-20", "message": "En formation..."}
  ]
}

================================================================================
