================================================================================
SCREENSHOT: target_.web-cloud.emails.all.general.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: General
VUE AGREGEE: Tous les services SELECTIONNE

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │ Emails                                                                              │
│  =======                     │ Vue d'ensemble de tous vos services email                                           │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Comptes] [Taches]                                                        │
│ [Rechercher un domaine...]   │  =======                                                                            │
├──────────────────────────────┤  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ * Tous les services     ████ │  ┌───────────────────────────┐  ┌───────────────────────────┐                       │
│   5 domaines - 47 comptes    │  │ RESUME                    │  │ QUOTAS                    │                       │
│   (SELECTIONNE)              │  ├───────────────────────────┤  ├───────────────────────────┤                       │
│                              │  │ Domaines      5           │  │ Comptes       47/60       │                       │
│ o example.com                │  │ Comptes       47          │  │ ████████████░░░ 78%       │                       │
│   12 comptes                 │  │ Redirections  23          │  │                           │                       │
│   [Exchange] [Email Pro]     │  │ Listes        8           │  │ Stockage      234/500 Go  │                       │
│                              │  └───────────────────────────┘  │ ████████░░░░░░░ 47%       │                       │
│ o mon-entreprise.fr          │                                 └───────────────────────────┘                       │
│   25 comptes [Exchange]      │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ o boutique.shop              │  │ SERVICES PAR DOMAINE                                  [Exporter CSV]        │   │
│   5 comptes [Email Pro]      │  ├──────────────────────────────────────────────────────────────────────────────┤   │
│                              │  │ Domaine           │ Type      │ Comptes │ Stockage │ Etat   │ ->           │   │
│ o perso.ovh                  │  ├───────────────────┼───────────┼─────────┼──────────┼────────┼──────────────┤   │
│   3 comptes [MX Plan]        │  │ example.com       │ Exchange  │ 12      │ 89 Go    │ [v] OK │ [->]         │   │
│                              │  │ mon-entreprise.fr │ Exchange  │ 25      │ 120 Go   │ [v] OK │ [->]         │   │
│ o startup.io                 │  │ boutique.shop     │ Email Pro │ 5       │ 15 Go    │ [!] 98%│ [->]         │   │
│   2 comptes [Zimbra]         │  │ perso.ovh         │ MX Plan   │ 3       │ 8 Go     │ [v] OK │ [->]         │   │
│                              │  │ startup.io        │ Zimbra    │ 2       │ 2 Go     │ [v] OK │ [->]         │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ [!] ALERTES (2)                                                              │   │
│                              │  ├──────────────────────────────────────────────────────────────────────────────┤   │
│                              │  │ [!] boutique.shop : Quota email atteint (98%)                   [Voir ->]   │   │
│                              │  │ [!] 1 tache en erreur sur example.com                           [Voir ->]   │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│ [+ Ajouter un domaine]       │ Actions: [+ Commander emails] [Rapport complet]                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "aggregatedView": {
    "summary": {
      "totalDomains": 5,
      "totalAccounts": 47,
      "totalRedirections": 23,
      "totalLists": 8
    },
    "quotas": {
      "accounts": {"used": 47, "total": 60, "percentage": 78},
      "storage": {"used": "234 Go", "total": "500 Go", "percentage": 47}
    },
    "domains": [
      {"name": "example.com", "type": "exchange", "accounts": 12, "storage": "89 Go", "status": "ok"},
      {"name": "mon-entreprise.fr", "type": "exchange", "accounts": 25, "storage": "120 Go", "status": "ok"},
      {"name": "boutique.shop", "type": "email-pro", "accounts": 5, "storage": "15 Go", "status": "warning", "warningMsg": "98%"},
      {"name": "perso.ovh", "type": "mx-plan", "accounts": 3, "storage": "8 Go", "status": "ok"},
      {"name": "startup.io", "type": "zimbra", "accounts": 2, "storage": "2 Go", "status": "ok"}
    ],
    "alerts": [
      {"type": "quota", "domain": "boutique.shop", "message": "Quota email atteint (98%)"},
      {"type": "error", "domain": "example.com", "message": "1 tache en erreur"}
    ]
  }
}

================================================================================
