================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.zone.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: Zone DNS
NAV5: Enregistrements (actif) | Historique

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines et DNS] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                     │
│            =================                                                                                       │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][DNS][Expert]       │ example.com                                                                         │
│          ===                 │ [.com] [Actif] [DNSSEC ok]                                                          │
│          NAV3=DNS (ACTIF)    ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Infos DNS][Serveurs DNS][Zone DNS][DNSSEC][SPF][DKIM][DMARC]...                    │
│ [Rechercher...]              │                           ========                                                  │
├──────────────────────────────┤                           NAV4=Zone DNS (ACTIF)                                     │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Enregistrements] | Historique                                                      │
│ o Tous les services          │  ================                                                                   │
│   5 domaines                 │  NAV5=Enregistrements (ACTIF)                                                       │
│                              ├─────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com          [.com]│                                                                                     │
│   Actif (SELECTIONNE)        │  [+ Ajouter une entree]  [Importer] [Exporter] [Reinitialiser]     [Modifier TTL]   │
│                              │                                                                                     │
│ o mon-site.fr          [.fr] │  Filtres: [Type v] [Sous-domaine v]                         [Rechercher...]         │
│   Actif                      │                                                                                     │
│                              │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│ o boutique.shop       [.shop]│  │ Type  │ Sous-dom │ Cible                 │ TTL  │ Actions                   │   │
│   Expire bientot             │  ├───────┼──────────┼───────────────────────┼──────┼───────────────────────────┤   │
│                              │  │ A     │ @        │ 1.2.3.4               │ 3600 │ [Edit] [X]                │   │
│ o api.example.com            │  │ A     │ www      │ 1.2.3.4               │ 3600 │ [Edit] [X]                │   │
│   Zone seule                 │  │ AAAA  │ @        │ 2001:db8::1           │ 3600 │ [Edit] [X]                │   │
│                              │  │ MX    │ @        │ mx1.ovh.net (10)      │ 3600 │ [Edit] [X]                │   │
│ o legacy.org         [.org]  │  │ MX    │ @        │ mx2.ovh.net (20)      │ 3600 │ [Edit] [X]                │   │
│   Expire                     │  │ CNAME │ mail     │ mail.ovh.net.         │ 3600 │ [Edit] [X]                │   │
│                              │  │ TXT   │ @        │ v=spf1 include:mx...  │ 3600 │ [Edit] [X]                │   │
│                              │  │ TXT   │ _dmarc   │ v=DMARC1; p=none...   │ 3600 │ [Edit] [X]                │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  Affichage 1-8 sur 24 enregistrements              [<] [1] [2] [3] [>]              │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "records": [
    {"type": "A", "subdomain": "@", "target": "1.2.3.4", "ttl": 3600},
    {"type": "A", "subdomain": "www", "target": "1.2.3.4", "ttl": 3600},
    {"type": "AAAA", "subdomain": "@", "target": "2001:db8::1", "ttl": 3600},
    {"type": "MX", "subdomain": "@", "target": "mx1.ovh.net", "priority": 10, "ttl": 3600},
    {"type": "MX", "subdomain": "@", "target": "mx2.ovh.net", "priority": 20, "ttl": 3600},
    {"type": "CNAME", "subdomain": "mail", "target": "mail.ovh.net.", "ttl": 3600},
    {"type": "TXT", "subdomain": "@", "target": "v=spf1 include:mx.ovh.com ~all", "ttl": 3600},
    {"type": "TXT", "subdomain": "_dmarc", "target": "v=DMARC1; p=none;", "ttl": 3600}
  ],
  "total": 24,
  "page": 1,
  "perPage": 8
}

================================================================================
