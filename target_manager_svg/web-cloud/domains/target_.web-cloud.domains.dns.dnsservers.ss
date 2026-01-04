================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.dnsservers.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: Serveurs DNS

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
│ [Rechercher...]              │             ============                                                            │
├──────────────────────────────┤             NAV4=Serveurs DNS (ACTIF)                                               │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  Serveurs DNS                                    [Modifier les serveurs DNS]        │
│   5 domaines                 │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│ * example.com          [.com]│  │ Configuration actuelle                                                        │  │
│   Actif (SELECTIONNE)        │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │ Type: DNS OVH (zone hebergee chez OVH)                                        │  │
│ o mon-site.fr          [.fr] │  │                                                                               │  │
│   Actif                      │  │ Serveurs primaires:                                                           │  │
│                              │  │   * ns1.ovh.net                                                               │  │
│ o boutique.shop       [.shop]│  │   * dns1.ovh.net                                                              │  │
│   Expire bientot             │  │                                                                               │  │
│                              │  │ Serveurs secondaires:                                                         │  │
│ o api.example.com            │  │   * ns1.ovh.net (Anycast)                                                     │  │
│   Zone seule                 │  │                                                                               │  │
│                              │  │ [v] Propagation complete                                                      │  │
│ o legacy.org         [.org]  │  └───────────────────────────────────────────────────────────────────────────────┘  │
│   Expire                     │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Options disponibles                                                           │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │ (*) DNS OVH (recommande)                                                      │  │
│                              │  │     Zone hebergee et geree chez OVH                                           │  │
│                              │  │                                                                               │  │
│                              │  │ ( ) DNS externes                                                              │  │
│                              │  │     Utiliser vos propres serveurs DNS                                         │  │
│                              │  │                                                                               │  │
│                              │  │ ( ) DNS Anycast OVH                                                           │  │
│                              │  │     Performance optimisee avec reseau Anycast                                 │  │
│                              │  │     [> Souscrire Anycast]                                                     │  │
│                              │  │                                                                               │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "dnsType": "hosted",
  "nameServers": {
    "primary": ["ns1.ovh.net", "dns1.ovh.net"],
    "secondary": ["ns1.ovh.net (Anycast)"]
  },
  "propagationComplete": true
}

================================================================================
