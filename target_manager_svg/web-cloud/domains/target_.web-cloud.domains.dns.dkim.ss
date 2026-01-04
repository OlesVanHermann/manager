================================================================================
SCREENSHOT: target_.web-cloud.domains.dns.dkim.svg
================================================================================

NAV1: Web Cloud | NAV2: Domaines et DNS | NAV3: DNS / Liste services (ALL 1er) | NAV4: DKIM

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
├──────────────────────────────┤ ...[DNSSEC][SPF][DKIM][DMARC][ARC][BIMI][CAA][DynHost][Anycast]                     │
│ [Rechercher...]              │                 ====                                                                │
├──────────────────────────────┤                 NAV4=DKIM (ACTIF)                                                   │
│ Filtre: [Tous v] 5 services  ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤                                                                                     │
│ o Tous les services          │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   5 domaines                 │  │ Configuration DKIM                                            [v] Configure   │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ * example.com          [.com]│  │                                                                               │  │
│   Actif (SELECTIONNE)        │  │ DKIM permet de signer cryptographiquement vos emails                          │  │
│                              │  │ pour prouver qu'ils proviennent bien de votre domaine.                        │  │
│ o mon-site.fr          [.fr] │  │                                                                               │  │
│   Actif                      │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│ o boutique.shop       [.shop]│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   Expire bientot             │  │ Selecteurs DKIM                                                  [+ Ajouter]  │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ o api.example.com            │  │                                                                               │  │
│   Zone seule                 │  │ Selecteur: ovh                                                                │  │
│                              │  │ ─────────────────────────────────────────────────────────────────────────────│  │
│ o legacy.org         [.org]  │  │ Enregistrement: ovh._domainkey.example.com                                    │  │
│   Expire                     │  │ Type: CNAME                                                                   │  │
│                              │  │ Valeur: ovh._domainkey.mail.ovh.net.                                          │  │
│                              │  │ Etat: [v] Valide                                                     [X]      │  │
│                              │  │                                                                               │  │
│                              │  │ Selecteur: google                                                             │  │
│                              │  │ ─────────────────────────────────────────────────────────────────────────────│  │
│                              │  │ Enregistrement: google._domainkey.example.com                                 │  │
│                              │  │ Type: TXT                                                                     │  │
│                              │  │ Valeur: v=DKIM1; k=rsa; p=MIGfMA0GCSqGS...                                    │  │
│                              │  │ Etat: [v] Valide                                                     [X]      │  │
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
  "configured": true,
  "selectors": [
    {
      "name": "ovh",
      "record": "ovh._domainkey.example.com",
      "type": "CNAME",
      "value": "ovh._domainkey.mail.ovh.net.",
      "valid": true
    },
    {
      "name": "google",
      "record": "google._domainkey.example.com",
      "type": "TXT",
      "value": "v=DKIM1; k=rsa; p=MIGfMA0GCSqGS...",
      "valid": true
    }
  ]
}

================================================================================
