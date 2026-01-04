================================================================================
SCREENSHOT: target_.web-cloud.hosting.expert.cdn.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Sites / Liste services (ALL 1er) | NAV4: CDN
NAV5: Etat (actif) | Parametres

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
├──────────────────────────────┤                                        ===                                          │
│ [Rechercher...]              │                                        NAV4=CDN (ACTIF)                             │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [Etat] | Parametres                                                                 │
├──────────────────────────────┤  ====                                                                               │
│ o Tous les services          │  NAV5=Etat (ACTIF)                                                                  │
│   4 hebergements             │ ────────────────────────────────────────────────────────────────────────────────────┤
│                              │                                                                                     │
│ * monsite.ovh.net            │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Performance 1              │  │ CDN OVHcloud                                                   [v] Actif      │  │
│   Actif (SELECTIONNE)        │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│ o boutique.example.com       │  │ Le CDN accelere votre site en distribuant le contenu                         │  │
│   Pro                        │  │ statique depuis des serveurs proches de vos visiteurs.                       │  │
│   Actif                      │  │                                                                               │  │
│                              │  │ Domaines avec CDN actif:                                                      │  │
│ o blog.monsite.fr            │  │   * monsite.ovh.net              [v]                                          │  │
│   Perso                      │  │   * www.monsite.ovh.net          [v]                                          │  │
│   Actif                      │  │                                                                               │  │
│                              │  │ Statistiques (7 derniers jours):                                              │  │
│ o dev.test.ovh               │  │   Requetes servies par CDN: 45,234 (78%)                                      │  │
│   Start                      │  │   Bande passante economisee: 12.4 Go                                          │  │
│   Maintenance                │  │   Temps de reponse moyen: 45 ms                                               │  │
│                              │  │                                                                               │  │
│                              │  │                      [Vider le cache] [X Desactiver CDN]                      │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Domaines sans CDN                                                             │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │   boutique.monsite.ovh.net       [Activer CDN]                                │  │
│                              │  │   api.monsite.ovh.net            [Activer CDN]                                │  │
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
  "cdn": {
    "status": "active",
    "domainsWithCdn": ["monsite.ovh.net", "www.monsite.ovh.net"],
    "domainsWithoutCdn": ["boutique.monsite.ovh.net", "api.monsite.ovh.net"],
    "stats": {
      "period": "7 days",
      "requestsServed": 45234,
      "cacheHitRate": "78%",
      "bandwidthSaved": "12.4 Go",
      "avgResponseTime": "45 ms"
    }
  }
}

================================================================================
