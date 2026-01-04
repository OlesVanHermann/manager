================================================================================
SCREENSHOT: target_.web-cloud.voip.sms.senders.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SMS | NAV3b: - (pas de NAV3b) | NAV4: Expediteurs

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
├──────────────────────────────┤                                                         ===========                 │
│ [Rechercher...]              │                                                         NAV4=Expediteurs (ACTIF)    │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 compte                     │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Marketing              ████│  │ Expediteurs (Sender IDs)                                 [+ Ajouter]       │     │
│   sms-ab12345                │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   1 234 credits              │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │  (i) L'expediteur apparait comme nom d'envoi sur le telephone du dest.    │     │
│                              │  │                                                                            │     │
│                              │  │  Nom               │ Type        │ Statut        │ Par defaut │ Actions   │     │
│                              │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│                              │  │  OVH Marketing     │ Alphanumerique│ [v] Valide   │    [*]     │ [Mod][x]  │     │
│                              │  │  MonEntreprise     │ Alphanumerique│ [v] Valide   │    [ ]     │ [Mod][x]  │     │
│                              │  │  +33612345678      │ Numerique   │ [v] Valide   │    [ ]     │ [Mod][x]  │     │
│                              │  │  ServiceClient     │ Alphanumerique│ [o] En attente│    [ ]     │ [x]       │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Regles d'utilisation                                                       │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │  - Alphanumerique: 3-11 caracteres, lettres et chiffres uniquement        │     │
│                              │  │  - Numerique: numero de telephone valide avec indicatif pays              │     │
│                              │  │  - Validation requise sous 48h pour les nouveaux expediteurs              │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "senders": [
    {"name": "OVH Marketing", "type": "alphanumeric", "status": "validated", "isDefault": true},
    {"name": "MonEntreprise", "type": "alphanumeric", "status": "validated", "isDefault": false},
    {"name": "+33612345678", "type": "numeric", "status": "validated", "isDefault": false},
    {"name": "ServiceClient", "type": "alphanumeric", "status": "pending", "isDefault": false}
  ],
  "rules": [
    "Alphanumerique: 3-11 caracteres, lettres et chiffres uniquement",
    "Numerique: numero de telephone valide avec indicatif pays",
    "Validation requise sous 48h pour les nouveaux expediteurs"
  ]
}

================================================================================
