================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.spf.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: SPF

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
├──────────────────────────────┤ ...[Zone DNS][DNSSEC][SPF][DKIM][DMARC][ARC][BIMI][CAA][DynHost][Anycast]           │
│ [Rechercher...]              │                       ===                                                           │
├──────────────────────────────┤                       NAV4=SPF (ACTIF)                                              │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   5 domaines                 │  │ Configuration SPF                                             [v] Configure   │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * example.com          [.com]│  │                                                                               │  │
│   Actif (SELECTIONNE)        │  │ Enregistrement TXT actuel:                                                    │  │
│                              │  │ ┌─────────────────────────────────────────────────────────────────────────┐   │  │
│ o mon-site.fr          [.fr] │  │ │ v=spf1 include:mx.ovh.com include:spf.ovh.net ~all                      │   │  │
│   Actif                      │  │ └─────────────────────────────────────────────────────────────────────────┘   │  │
│                              │  │                                                                               │  │
│ o boutique.shop       [.shop]│  │                                            [Modifier]   [Aide SPF]           │  │
│   Expire bientot             │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ o api.example.com            │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Zone seule                 │  │ Assistant de configuration                                                    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ o legacy.org         [.org]  │  │                                                                               │  │
│   Expire                     │  │ [v] Autoriser les serveurs MX du domaine                                      │  │
│                              │  │ [v] Autoriser les serveurs OVH                                                │  │
│                              │  │ [ ] Autoriser Google Workspace                                                │  │
│                              │  │ [ ] Autoriser Microsoft 365                                                   │  │
│                              │  │ [ ] Autoriser Mailjet                                                         │  │
│                              │  │                                                                               │  │
│                              │  │ IP supplementaires: [                                               ]         │  │
│                              │  │                                                                               │  │
│                              │  │ Politique:                                                                    │  │
│                              │  │ (*) ~all (soft fail - recommande)                                             │  │
│                              │  │ ( ) -all (hard fail - strict)                                                 │  │
│                              │  │ ( ) ?all (neutral)                                                            │  │
│                              │  │                                                                               │  │
│                              │  │                                       [Appliquer la configuration]            │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "spfRecord": "v=spf1 include:mx.ovh.com include:spf.ovh.net ~all",
  "configured": true,
  "options": {
    "allowMx": true,
    "allowOvh": true,
    "allowGoogle": false,
    "allowMicrosoft": false,
    "allowMailjet": false,
    "policy": "softfail"
  }
}

================================================================================
