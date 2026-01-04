================================================================================
SCREENSHOT: target_.web-cloud.domains.list.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: General / Liste services (ALL 1er = SELECTIONNE) | NAV4: General
(VUE AGREGEE - Tous les services)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
│                                             NAV1=Web Cloud (ACTIF)                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines et DNS] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                     │
│            =================                                                                                       │
│            NAV2=Domaines et DNS (ACTIF)                                                                            │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][DNS][Expert]       │ Domaines et DNS                                                                     │
│  ========                    │ Vue d'ensemble de tous vos domaines                                                 │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Renouvellements] [Taches]                                                │
│ [Rechercher...]              │  ========                                                                           │
├──────────────────────────────┤  NAV4=General (ACTIF) - VUE AGREGEE                                                 │
│ Filtre: [Tous v] 12 services ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ ┌────────────────────────────┐ ┌────────────────────────────┐                       │
│ * Tous les services    ####  │ │ RESUME                     │ │ EXPIRATIONS                │                       │
│   12 domaines                │ ├────────────────────────────┤ ├────────────────────────────┤                       │
│   (SELECTIONNE)              │ │ Total           12         │ │ < 30 jours    [!] 2        │                       │
│   ====================       │ │ Actifs          10         │ │ < 90 jours    [~] 3        │                       │
│                              │ │ Expirent        2          │ │ > 90 jours    [v] 7        │                       │
│ o example.com          [.com]│ │ Zones DNS       12         │ │                            │                       │
│   Actif                      │ │ DNSSEC actif    8          │ │ [Voir calendrier >]        │                       │
│                              │ └────────────────────────────┘ └────────────────────────────┘                       │
│ o mon-site.fr          [.fr] │                                                                                     │
│   Actif                      │ ┌──────────────────────────────────────────────────────────────────────────────┐    │
│                              │ │ TOUS LES DOMAINES                                      [Exporter CSV]        │    │
│ o boutique.shop       [.shop]│ ├──────────────────────────────────────────────────────────────────────────────┤    │
│   Expire bientot             │ │ Domaine          │ Ext. │ Expiration │ DNSSEC│ Zone │ Etat   │ >            │    │
│                              │ │──────────────────┼──────┼────────────┼───────┼──────┼────────┼──────────────│    │
│ o api.example.com            │ │ example.com      │ .com │ 15/12/2026 │ [v]   │ [v]  │ [v] OK │ [>]          │    │
│   Zone seule                 │ │ mon-site.fr      │ .fr  │ 01/06/2026 │ [v]   │ [v]  │ [v] OK │ [>]          │    │
│                              │ │ boutique.shop    │ .shop│ 15/01/2026 │ [x]   │ [v]  │ [~] Exp│ [>]          │    │
│ o legacy.org         [.org]  │ │ startup.io       │ .io  │ 20/01/2026 │ [v]   │ [v]  │ [~] Exp│ [>]          │    │
│   Actif                      │ │ legacy.org       │ .org │ 01/03/2026 │ [x]   │ [v]  │ [v] OK │ [>]          │    │
│                              │ └──────────────────────────────────────────────────────────────────────────────┘    │
│ ... (7 autres)               │ 5 sur 12 - [<] 1 2 3 [>]                                                            │
│                              │                                                                                     │
│                              │ ┌──────────────────────────────────────────────────────────────────────────────┐    │
│                              │ │ [!] ALERTES (2)                                                              │    │
│                              │ ├──────────────────────────────────────────────────────────────────────────────┤    │
│                              │ │ [!] boutique.shop expire dans 12 jours                    [Renouveler >]    │    │
│                              │ │ [!] startup.io expire dans 17 jours                       [Renouveler >]    │    │
│                              │ └──────────────────────────────────────────────────────────────────────────────┘    │
│                              │                                                                                     │
│ [+ Commander domaine]        │ Actions: [Tout renouveler] [Rapport complet]                                        │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "summary": {
    "total": 12,
    "active": 10,
    "expiring": 2,
    "zones": 12,
    "dnssecActive": 8
  },
  "expirations": {
    "within30days": 2,
    "within90days": 3,
    "beyond90days": 7
  },
  "domains": [
    {"name": "example.com", "ext": ".com", "expiration": "2026-12-15", "dnssec": true, "zone": true, "status": "ok"},
    {"name": "mon-site.fr", "ext": ".fr", "expiration": "2026-06-01", "dnssec": true, "zone": true, "status": "ok"},
    {"name": "boutique.shop", "ext": ".shop", "expiration": "2026-01-15", "dnssec": false, "zone": true, "status": "expiring"},
    {"name": "startup.io", "ext": ".io", "expiration": "2026-01-20", "dnssec": true, "zone": true, "status": "expiring"},
    {"name": "legacy.org", "ext": ".org", "expiration": "2026-03-01", "dnssec": false, "zone": true, "status": "ok"}
  ],
  "alerts": [
    {"domain": "boutique.shop", "message": "expire dans 12 jours"},
    {"domain": "startup.io", "message": "expire dans 17 jours"}
  ]
}

================================================================================
