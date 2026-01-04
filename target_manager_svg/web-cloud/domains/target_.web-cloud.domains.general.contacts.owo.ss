================================================================================
SCREENSHOT: target_.web-cloud.domains.general.contacts.owo.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: General / Liste services (ALL 1er) | NAV4: Contacts
NAV5: Contacts | OWO (actif)

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
├──────────────────────────────┤ Contacts | [OWO]                                                                    │
│ o Tous les services          │            ===                                                                      │
│   5 domaines                 │            NAV5=OWO (ACTIF)                                                         │
│                              ├─────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com          [.com]│                                                                                     │
│   Actif (SELECTIONNE)        │  Obfuscation des donnees WHOIS (OWO)                                                │
│                              │  Masquez vos informations personnelles dans le WHOIS public                         │
│ o mon-site.fr          [.fr] │                                                                                     │
│   Actif                      │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Champ                    │ Valeur actuelle          │ Obfusque  │ Action    │   │
│ o boutique.shop       [.shop]│  ├──────────────────────────┼──────────────────────────┼───────────┼───────────┤   │
│   Expire bientot             │  │ Email proprietaire       │ jean.dupont@email.com    │ [v] Oui   │ [Toggle]  │   │
│                              │  │ Telephone proprietaire   │ +33 1 23 45 67 89        │ [v] Oui   │ [Toggle]  │   │
│ o api.example.com            │  │ Adresse proprietaire     │ 123 Rue Example...       │ [ ] Non   │ [Toggle]  │   │
│   Zone seule                 │  │ Email admin              │ admin@example.com        │ [v] Oui   │ [Toggle]  │   │
│                              │  │ Email technique          │ tech@ovh.net             │ [ ] Non   │ [Toggle]  │   │
│ o legacy.org         [.org]  │  └──────────────────────────────────────────────────────────────────────────────┘   │
│   Expire                     │                                                                                     │
│                              │                                                                                     │
│                              │  [Regenerer tous les emails OWO]          [Sauvegarder les modifications]          │
│                              │                                                                                     │
│                              │                                                                                     │
│ [+ Commander domaine]        │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "owoFields": [
    {"field": "Email proprietaire", "value": "jean.dupont@email.com", "obfuscated": true},
    {"field": "Telephone proprietaire", "value": "+33 1 23 45 67 89", "obfuscated": true},
    {"field": "Adresse proprietaire", "value": "123 Rue Example...", "obfuscated": false},
    {"field": "Email admin", "value": "admin@example.com", "obfuscated": true},
    {"field": "Email technique", "value": "tech@ovh.net", "obfuscated": false}
  ]
}

================================================================================
