================================================================================
SCREENSHOT: target_.web-cloud.voip.sms.blacklist.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SMS | NAV3b: - (pas de NAV3b) | NAV4: Liste noire
NOTE: Numeros bloques (STOP + manuels)

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
│         NAV3a=SMS (ACTIF)    │ [General] [Envoyer] [Campagnes] [Sortants] [Entrants] [Expediteurs] [Liste noire]   │
├──────────────────────────────┤                                                                     ===========     │
│ [Rechercher...]              │                                                                     NAV4            │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 compte                     │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Marketing              ████│  │ Liste noire (numeros bloques)                        [+ Ajouter manuellement]│     │
│   sms-ab12345                │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   1 234 credits              │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │  (i) Les numeros en liste noire ne recevront plus vos SMS.                │     │
│                              │  │      Les destinataires ayant repondu STOP sont automatiquement ajoutes.   │     │
│                              │  │                                                                            │     │
│                              │  │  [Tous (23)] [STOP (18)] [Manuels (5)]                  [Filtrer...]       │     │
│                              │  │                                                                            │     │
│                              │  │  Numero          │ Type    │ Date ajout  │ Raison             │ Actions   │     │
│                              │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│                              │  │  +33 6 12 34 56 78│ STOP    │ 03/01/2026  │ Reponse STOP       │ [Debloquer]│     │
│                              │  │  +33 6 98 76 54 32│ STOP    │ 02/01/2026  │ Reponse STOP       │ [Debloquer]│     │
│                              │  │  +33 6 55 44 33 22│ Manuel  │ 01/01/2026  │ Demande client     │ [Debloquer]│     │
│                              │  │  +33 6 11 22 33 44│ STOP    │ 28/12/2025  │ Reponse STOP       │ [Debloquer]│     │
│                              │  │  +33 6 77 88 99 00│ Manuel  │ 15/12/2025  │ Plainte CNIL       │ [Debloquer]│     │
│                              │  │  +33 6 44 55 66 77│ STOP    │ 10/12/2025  │ Reponse STOP       │ [Debloquer]│     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-6 sur 23                                     [<] [1] [2] ... [>]       │
│                              │                                                                                     │
│                              │  (!) Attention: debloquer un numero ayant repondu STOP peut entrainer des          │
│                              │      problemes de conformite RGPD.                                                  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "blacklist": [
    {"number": "+33 6 12 34 56 78", "type": "STOP", "dateAdded": "03/01/2026", "reason": "Reponse STOP"},
    {"number": "+33 6 98 76 54 32", "type": "STOP", "dateAdded": "02/01/2026", "reason": "Reponse STOP"},
    {"number": "+33 6 55 44 33 22", "type": "manual", "dateAdded": "01/01/2026", "reason": "Demande client"},
    {"number": "+33 6 11 22 33 44", "type": "STOP", "dateAdded": "28/12/2025", "reason": "Reponse STOP"},
    {"number": "+33 6 77 88 99 00", "type": "manual", "dateAdded": "15/12/2025", "reason": "Plainte CNIL"},
    {"number": "+33 6 44 55 66 77", "type": "STOP", "dateAdded": "10/12/2025", "reason": "Reponse STOP"}
  ],
  "filters": {
    "all": 23,
    "stop": 18,
    "manual": 5
  },
  "warning": "Debloquer un numero ayant repondu STOP peut entrainer des problemes de conformite RGPD."
}

================================================================================
