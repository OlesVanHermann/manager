================================================================================
SCREENSHOT: target_.web-cloud.hosting.sites.ssl.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Sites / Liste services (ALL 1er) | NAV4: SSL

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
├──────────────────────────────┤             ===                                                                     │
│ [Rechercher...]              │             NAV4=SSL (ACTIF)                                                        │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [+ Commander certificat SSL]          [Importer un certificat]                      │
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   4 hebergements             │  │ Certificat SSL actif                                          [v] Valide      │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * monsite.ovh.net            │  │                                                                               │  │
│   Performance 1              │  │ Type            Let's Encrypt (gratuit)                                       │  │
│   Actif (SELECTIONNE)        │  │ Domaine         monsite.ovh.net                                               │  │
│                              │  │ Emis le         15/12/2025                                                    │  │
│ o boutique.example.com       │  │ Expire le       15/03/2026 (71 jours)                                         │  │
│   Pro                        │  │ Renouvellement  Automatique                                                   │  │
│   Actif                      │  │                                                                               │  │
│                              │  │ Domaines couverts:                                                            │  │
│ o blog.monsite.fr            │  │   * monsite.ovh.net                                                           │  │
│   Perso                      │  │   * www.monsite.ovh.net                                                       │  │
│   Actif                      │  │   * boutique.monsite.ovh.net                                                  │  │
│                              │  │   * api.monsite.ovh.net                                                       │  │
│ o dev.test.ovh               │  │                                                                               │  │
│   Start                      │  │                                    [Regenerer] [X Supprimer]                  │  │
│   Maintenance                │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Certificats premium disponibles                                               │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │ Sectigo DV        49,99 EUR/an    [Commander]                                 │  │
│                              │  │ Validation domaine, 1 domaine                                                 │  │
│                              │  │                                                                               │  │
│                              │  │ Sectigo EV        199,99 EUR/an   [Commander]                                 │  │
│                              │  │ Validation etendue, barre verte                                               │  │
│                              │  │                                                                               │  │
│                              │  │ Wildcard          99,99 EUR/an    [Commander]                                 │  │
│                              │  │ Tous les sous-domaines *.monsite.ovh.net                                      │  │
│                              │  │                                                                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "certificate": {
    "type": "Let's Encrypt",
    "domain": "monsite.ovh.net",
    "issuedDate": "2025-12-15",
    "expirationDate": "2026-03-15",
    "daysRemaining": 71,
    "autoRenew": true,
    "coveredDomains": ["monsite.ovh.net", "www.monsite.ovh.net", "boutique.monsite.ovh.net", "api.monsite.ovh.net"]
  },
  "premiumOptions": [
    {"name": "Sectigo DV", "price": "49,99 EUR/an", "description": "Validation domaine, 1 domaine"},
    {"name": "Sectigo EV", "price": "199,99 EUR/an", "description": "Validation etendue, barre verte"},
    {"name": "Wildcard", "price": "99,99 EUR/an", "description": "Tous les sous-domaines"}
  ]
}

================================================================================
