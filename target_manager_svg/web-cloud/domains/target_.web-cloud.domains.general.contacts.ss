================================================================================
SCREENSHOT: target_.web-cloud.domains.general.contacts.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: General / Liste services (ALL 1er) | NAV4: Contacts
NAV5: Contacts (actif) | OWO

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
│  ========                    │ [.com] [Actif] [DNSSEC ok]                                                          │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Infos generales] [Contacts] [Alldom]                                               │
│ [Rechercher...]              │                    =========                                                        │
├──────────────────────────────┤                    NAV4=Contacts (ACTIF)                                            │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Contacts] | OWO                                                                    │
│ o Tous les services          │  =========                                                                          │
│   5 domaines                 │  NAV5=Contacts (ACTIF)                                                              │
│                              ├─────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com          [.com]│                                                                                     │
│   Actif (SELECTIONNE)        │  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│                              │  │ PROPRIETAIRE                    │  │ ADMINISTRATEUR                  │           │
│ o mon-site.fr          [.fr] │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│   Actif                      │  │ Jean DUPONT                     │  │ Jean DUPONT                     │           │
│                              │  │ jean.dupont@email.com           │  │ admin@example.com               │           │
│ o boutique.shop       [.shop]│  │ 123 Rue Example                 │  │                                 │           │
│   Expire bientot             │  │ 75001 Paris, France             │  │ Contact ID: AB12345-OVH        │           │
│                              │  │                                 │  │                                 │           │
│ o api.example.com            │  │ Contact ID: AB12345-OVH        │  │                     [Modifier]  │           │
│   Zone seule                 │  │                     [Modifier]  │  └─────────────────────────────────┘           │
│                              │  └─────────────────────────────────┘                                                │
│ o legacy.org         [.org]  │                                                                                     │
│   Expire                     │  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐           │
│                              │  │ TECHNIQUE                       │  │ FACTURATION                     │           │
│                              │  ├─────────────────────────────────┤  ├─────────────────────────────────┤           │
│                              │  │ OVH SAS                         │  │ Jean DUPONT                     │           │
│                              │  │ tech@ovh.net                    │  │ billing@example.com             │           │
│                              │  │                                 │  │                                 │           │
│                              │  │ Contact ID: OVH-TECH            │  │ Contact ID: AB12345-OVH        │           │
│                              │  │                     [Modifier]  │  │                     [Modifier]  │           │
│                              │  └─────────────────────────────────┘  └─────────────────────────────────┘           │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "contacts": {
    "owner": {"name": "Jean DUPONT", "email": "jean.dupont@email.com", "address": "123 Rue Example, 75001 Paris", "id": "AB12345-OVH"},
    "admin": {"name": "Jean DUPONT", "email": "admin@example.com", "id": "AB12345-OVH"},
    "tech": {"name": "OVH SAS", "email": "tech@ovh.net", "id": "OVH-TECH"},
    "billing": {"name": "Jean DUPONT", "email": "billing@example.com", "id": "AB12345-OVH"}
  }
}

================================================================================
