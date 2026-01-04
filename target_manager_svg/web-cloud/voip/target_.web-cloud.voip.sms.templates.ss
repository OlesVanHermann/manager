================================================================================
SCREENSHOT: target_.web-cloud.voip.sms.templates.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SMS | NAV3b: - (pas de NAV3b) | NAV4: Modeles

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ sms-ab12345                                     [1 234 credits]  [+ Acheter]        │
│ [Trunk (0)]                  │ Marketing                                                                           │
│             ===              ├─────────────────────────────────────────────────────────────────────────────────────┤
│         NAV3a=SMS (ACTIF)    │ [General] [Envoyer] [Campagnes] [Sortants] [Entrants] [Expediteurs] [Modeles]       │
├──────────────────────────────┤                                                                     =======         │
│ [Rechercher...]              │                                                                     NAV4=Modeles    │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 compte                     │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Marketing              ████│  │ Modeles de SMS                                             [+ Creer]       │     │
│   sms-ab12345                │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   1 234 credits              │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │  (i) Utilisez des variables: {nom}, {date}, {code}, {lien}                │     │
│                              │  │                                                                            │     │
│                              │  │  Nom                │ Contenu (extrait)                   │ Util.│ Actions│     │
│                              │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│                              │  │  Confirmation RDV   │ Bonjour {nom}, rappel RDV le {date} │  234 │[Ut][x] │     │
│                              │  │  Code verification  │ Votre code de verification: {code}  │ 1567 │[Ut][x] │     │
│                              │  │  Livraison          │ Votre colis arrive le {date}. Suiv..│  456 │[Ut][x] │     │
│                              │  │  Promo generale     │ Profitez de -{promo}% avec le code..│   89 │[Ut][x] │     │
│                              │  │  Bienvenue          │ Bienvenue {nom}! Votre compte est...│  123 │[Ut][x] │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Variables disponibles                                                      │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │  {nom} - Nom du destinataire    {date} - Date formatee                    │     │
│                              │  │  {code} - Code unique genere    {lien} - URL raccourcie                   │     │
│                              │  │  {promo} - Valeur promotion     {entreprise} - Nom entreprise             │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "templates": [
    {"name": "Confirmation RDV", "content": "Bonjour {nom}, rappel RDV le {date}", "usageCount": 234},
    {"name": "Code verification", "content": "Votre code de verification: {code}", "usageCount": 1567},
    {"name": "Livraison", "content": "Votre colis arrive le {date}. Suiv...", "usageCount": 456},
    {"name": "Promo generale", "content": "Profitez de -{promo}% avec le code...", "usageCount": 89},
    {"name": "Bienvenue", "content": "Bienvenue {nom}! Votre compte est...", "usageCount": 123}
  ],
  "variables": [
    {"{nom}": "Nom du destinataire"},
    {"{date}": "Date formatee"},
    {"{code}": "Code unique genere"},
    {"{lien}": "URL raccourcie"},
    {"{promo}": "Valeur promotion"},
    {"{entreprise}": "Nom entreprise"}
  ]
}

================================================================================
