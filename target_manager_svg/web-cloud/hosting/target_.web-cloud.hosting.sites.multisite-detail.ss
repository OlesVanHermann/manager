================================================================================
SCREENSHOT: target_.web-cloud.hosting.sites.multisite-detail.svg
================================================================================

NAV1: Web Cloud | NAV2: Hebergement | NAV3: Sites / Liste services (ALL 1er) | NAV4: Multisite
SERVICE SELECTIONNE: monsite.ovh.net

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
├──────────────────────────────┤  =========                                                                          │
│ [Rechercher...]              │  NAV4=Multisite (ACTIF)                                                             │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ Filtre: [Tous v] 4 services  │ [+ Ajouter un domaine]                                    Filtre: [Tous v]          │
├──────────────────────────────┤                                                                                     │
│ o Tous les services     ████ │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   4 hebergements             │  │ Domaine                  │ Chemin     │ SSL │ CDN │ Firewall │ Actions      │   │
│                              │  ├──────────────────────────┼────────────┼─────┼─────┼──────────┼──────────────┤   │
│ * monsite.ovh.net            │  │ monsite.ovh.net          │ /www/      │ [v] │ [v] │ [v]      │ [E] [?] [X]  │   │
│   Performance 1              │  │ www.monsite.ovh.net      │ /www/      │ [v] │ [v] │ [v]      │ [E] [?] [X]  │   │
│   [v] Actif (SELECTIONNE)    │  │ boutique.monsite.ovh.net │ /boutique/ │ [v] │ [x] │ [v]      │ [E] [?] [X]  │   │
│                              │  │ api.monsite.ovh.net      │ /api/      │ [v] │ [x] │ [x]      │ [E] [?] [X]  │   │
│ o boutique.example.com       │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   Pro                        │                                                                                     │
│   [v] Actif                  │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Vous pouvez attacher jusqu'a 100 domaines sur cet hebergement.           │  │
│ o blog.monsite.fr            │  │     4 domaines actuellement attaches.                                        │  │
│   Perso                      │  └───────────────────────────────────────────────────────────────────────────────┘  │
│   [v] Actif                  │                                                                                     │
│                              │  Legende:                                                                           │
│ o dev.test.ovh               │  [E]=Modifier [?]=Diagnostic [X]=Detacher                                           │
│   Start                      │                                                                                     │
│   [!] Maintenance            │                                                                                     │
│                              │                                                                                     │
│ [+ Commander hebergement]    │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "serviceName": "monsite.ovh.net",
  "offer": "Performance 1",
  "datacenter": "gra3",
  "status": "active",
  "attachedDomains": [
    {"domain": "monsite.ovh.net", "path": "/www/", "ssl": true, "cdn": true, "firewall": true},
    {"domain": "www.monsite.ovh.net", "path": "/www/", "ssl": true, "cdn": true, "firewall": true},
    {"domain": "boutique.monsite.ovh.net", "path": "/boutique/", "ssl": true, "cdn": false, "firewall": true},
    {"domain": "api.monsite.ovh.net", "path": "/api/", "ssl": true, "cdn": false, "firewall": false}
  ],
  "maxDomains": 100,
  "currentDomains": 4
}

================================================================================
