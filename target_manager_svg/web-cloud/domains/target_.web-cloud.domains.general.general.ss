================================================================================
SCREENSHOT: target_.web-cloud.domains.general.general.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: General / Liste services (ALL 1er) | NAV4: Infos generales
(Service selectionne: example.com)

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
│ [General][DNS][Expert]       │ example.com                                                                         │
│  ========                    │ [.com] [Actif] [DNSSEC ok]                                                          │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Infos generales] [Contacts] [Alldom]                                               │
│ [Rechercher...]              │  ================                                                                   │
├──────────────────────────────┤  NAV4=Infos generales (ACTIF)                                                       │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services     #### │  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│   5 domaines                 │  │ INFORMATIONS                    │  │ CONFIGURATION DNS               │           │
│                              │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│ * example.com          [.com]│  │ Domaine      example.com        │  │ Serveurs DNS                    │           │
│   Actif (SELECTIONNE)        │  │ Extension    .com               │  │   ns1.ovh.net                   │           │
│                              │  │ Registrar    OVH SAS            │  │   dns1.ovh.net                  │           │
│ o mon-site.fr          [.fr] │  │ Creation     10/03/2020         │  │                                 │           │
│   Actif                      │  │ Expiration   15/12/2025         │  │ Zone DNS    Active (OVH)        │           │
│                              │  │              (347 jours)        │  │             [> Gerer la zone]   │           │
│ o boutique.shop       [.shop]│  └─────────────────────────────────┘  └─────────────────────────────────┘           │
│   Expire bientot             │                                                                                     │
│                              │  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│ o api.example.com            │  │ SECURITE                        │  │ ABONNEMENT                      │           │
│   Zone seule                 │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│                              │  │ Verrouillage  Active            │  │ Renouvellement  Automatique     │           │
│ o legacy.org         [.org]  │  │               [Deverrouiller]   │  │ Prochaine fact. 15/12/2025      │           │
│   Expire                     │  │                                 │  │ [> Gerer le renouvellement]     │           │
│                              │  │ DNSSEC        Active            │  │                                 │           │
│                              │  │               [> Gerer DNSSEC]  │  │ Contacts                        │           │
│                              │  │                                 │  │ [> Voir les contacts]           │           │
│                              │  │ Code transfert ********         │  │                                 │           │
│                              │  │               [Afficher]        │  │                                 │           │
│                              │  └─────────────────────────────────┘  └─────────────────────────────────┘           │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "domain": "example.com",
  "extension": ".com",
  "registrar": "OVH SAS",
  "creationDate": "2020-03-10",
  "expirationDate": "2025-12-15",
  "daysRemaining": 347,
  "transferLock": true,
  "dnssecEnabled": true,
  "nameServers": ["ns1.ovh.net", "dns1.ovh.net"],
  "zoneStatus": "active",
  "renewalMode": "automatic"
}

================================================================================
