================================================================================
SCREENSHOT: target_.web-cloud.hosting.offre.offer.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Offre / Liste services (ALL 1er) | NAV4: Offre

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
│                =====         │ Performance 1 - gra3                                                    [Actif]     │
│  [Expert]                    ├─────────────────────────────────────────────────────────────────────────────────────┤
│  NAV3=Offre (ACTIF)          │ [Offre] [Changement] [Migration] [Resiliation]                                      │
├──────────────────────────────┤  =====                                                                              │
│ [Rechercher...]              │  NAV4=Offre (ACTIF)                                                                 │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │                                                                                     │
├──────────────────────────────┤  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│ o Tous les services          │  │ Votre offre actuelle                                                          │  │
│   4 hebergements             │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│ * monsite.ovh.net            │  │ [ICON] Performance 1                                       9,99 EUR HT/mois   │  │
│   Performance 1              │  │                                                                               │  │
│   Actif (SELECTIONNE)        │  │ Caracteristiques:                                                             │  │
│                              │  │   * 100 Go d'espace disque                                                    │  │
│ o boutique.example.com       │  │   * 10 bases de donnees (1 Go max chacune)                                    │  │
│   Pro                        │  │   * 10 comptes FTP                                                            │  │
│   Actif                      │  │   * SSL gratuit (Let's Encrypt)                                               │  │
│                              │  │   * CDN inclus                                                                │  │
│ o blog.monsite.fr            │  │   * PHP 8.2, Node.js, Python                                                  │  │
│   Perso                      │  │   * SSH active                                                                │  │
│   Actif                      │  │   * Boost disponible                                                          │  │
│                              │  │                                                                               │  │
│ o dev.test.ovh               │  │ Renouvellement: 15/06/2026                                                    │  │
│   Start                      │  │ Mode: Automatique                                                             │  │
│   Maintenance                │  │                                                                               │  │
│                              │  │          [Passer a Performance 2]  [Gerer le renouvellement]                  │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Offres disponibles                                                            │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │         Perso      Pro       Perf 1 *   Perf 2                                │  │
│                              │  │ ─────────────────────────────────────────────────────────────────────────────│  │
│                              │  │ Prix    2,99 EUR   5,99 EUR  9,99 EUR   19,99 EUR                             │  │
│                              │  │ Disque  100 Go     250 Go    100 Go     250 Go                                │  │
│                              │  │ BDD     5          10        10         20                                    │  │
│                              │  │ RAM     -          -         512 Mo     1 Go                                  │  │
│                              │  │ SSH     [x]        [x]       [v]        [v]                                   │  │
│                              │  │ Boost   [x]        [x]       [v]        [v]                                   │  │
│                              │  │                                                                               │  │
│                              │  │                       [Changer d'offre]                                       │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "currentOffer": {
    "name": "Performance 1",
    "price": "9,99 EUR HT/mois",
    "features": {
      "disk": "100 Go",
      "databases": "10 (1 Go max)",
      "ftpAccounts": 10,
      "ssl": "Let's Encrypt gratuit",
      "cdn": true,
      "runtimes": ["PHP 8.2", "Node.js", "Python"],
      "ssh": true,
      "boost": true
    },
    "renewal": "2026-06-15",
    "renewalMode": "automatic"
  },
  "availableOffers": [
    {"name": "Perso", "price": "2,99 EUR", "disk": "100 Go", "bdd": 5, "ram": "-", "ssh": false, "boost": false},
    {"name": "Pro", "price": "5,99 EUR", "disk": "250 Go", "bdd": 10, "ram": "-", "ssh": false, "boost": false},
    {"name": "Perf 1", "price": "9,99 EUR", "disk": "100 Go", "bdd": 10, "ram": "512 Mo", "ssh": true, "boost": true, "current": true},
    {"name": "Perf 2", "price": "19,99 EUR", "disk": "250 Go", "bdd": 20, "ram": "1 Go", "ssh": true, "boost": true}
  ]
}

================================================================================
