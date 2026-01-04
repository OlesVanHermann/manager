================================================================================
SCREENSHOT: target_.web-cloud.emails.general.advanced.audit.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Avance
NAV5: Ressources | Contacts ext. | Audit (actif) | Appareils

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
│ [Rechercher un domaine...]   │                                                                ======               │
├──────────────────────────────┤                                                                NAV4=Avance (ACTIF)  │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ Ressources | Contacts ext. | [Audit] | Appareils                                   │
│ o Tous les services          │                               =====                                                 │
│   5 domaines - 47 comptes    │                               NAV5=Audit (ACTIF)                                    │
│                              │ ────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com                │ Periode: [7 derniers jours v]  Type: [Tous les evenements v]  [Exporter]            │
│   12 comptes (SELECTIONNE)   │                                                                                     │
│   [Exchange] [Email Pro]     │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Date/Heure  │ Utilisateur        │ Action      │ Details         │ IP       │   │
│ o mon-entreprise.fr          │  ├─────────────┼────────────────────┼─────────────┼─────────────────┼──────────┤   │
│   25 comptes [Exchange]      │  │ 03/01 14:32 │ ceo@example.com    │ Connexion   │ Outlook Desktop │ 86.123.x │   │
│                              │  │ 03/01 14:28 │ admin@example.com  │ Modif. MDP  │ support@example │ 92.45.x  │   │
│ o boutique.shop              │  │ 03/01 12:15 │ ceo@example.com    │ Envoi       │ -> external@    │ 86.123.x │   │
│   5 comptes [Email Pro]      │  │ 03/01 10:00 │ contact@example.com│ Connexion   │ Webmail OWA     │ 77.89.x  │   │
│                              │  │ 02/01 18:45 │ admin@example.com  │ Creation    │ dev@example.com │ 92.45.x  │   │
│ o perso.ovh                  │  │ 02/01 16:30 │ ceo@example.com    │ Delegation  │ -> assistant@   │ 86.123.x │   │
│   3 comptes [MX Plan]        │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ o startup.io                 │  50 evenements sur 234                              [<] [1] [2] [3] ... [5] [>]     │
│   8 comptes [Zimbra]         │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Filtres actifs:                                                               │  │
│                              │  │ Periode: 7 derniers jours                                                     │  │
│                              │  │ Types: Connexion, Modification, Envoi, Creation, Delegation                  │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "audit": {
    "period": "7 days",
    "eventTypes": ["Connexion", "Modification", "Envoi", "Creation", "Delegation"],
    "events": [
      {"datetime": "03/01 14:32", "user": "ceo@example.com", "action": "Connexion", "details": "Outlook Desktop", "ip": "86.123.x.x"},
      {"datetime": "03/01 14:28", "user": "admin@example.com", "action": "Modif. MDP", "details": "support@example.com", "ip": "92.45.x.x"},
      {"datetime": "03/01 12:15", "user": "ceo@example.com", "action": "Envoi", "details": "-> external@client.com", "ip": "86.123.x.x"},
      {"datetime": "03/01 10:00", "user": "contact@example.com", "action": "Connexion", "details": "Webmail OWA", "ip": "77.89.x.x"},
      {"datetime": "02/01 18:45", "user": "admin@example.com", "action": "Creation", "details": "dev@example.com", "ip": "92.45.x.x"},
      {"datetime": "02/01 16:30", "user": "ceo@example.com", "action": "Delegation", "details": "-> assistant@example.com", "ip": "86.123.x.x"}
    ],
    "pagination": {"shown": 50, "total": 234, "currentPage": 1, "totalPages": 5}
  }
}

================================================================================
