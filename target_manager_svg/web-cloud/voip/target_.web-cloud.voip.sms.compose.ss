================================================================================
SCREENSHOT: target_.web-cloud.voip.sms.compose.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SMS | NAV3b: - (pas de NAV3b) | NAV4: Envoyer
NOTE: Formulaire d'envoi SMS complet avec toutes les options

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
├──────────────────────────────┤            =======                                                                  │
│ [Rechercher...]              │            NAV4=Envoyer (ACTIF)                                                     │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 compte                     │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Marketing              ████│  │ Composer un SMS                                                            │     │
│   sms-ab12345                │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   1 234 credits              │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │   Expediteur     [OVH Marketing v]                                         │     │
│                              │  │                                                                            │     │
│                              │  │   Destinataires  [+33 6 12 34 56 78, +33 6 98 76 54 32       ]             │     │
│                              │  │                  2 destinataires                                           │     │
│                              │  │                  [Importer depuis fichier CSV]                             │     │
│                              │  │                                                                            │     │
│                              │  │   Message        ┌────────────────────────────────────────────────┐        │     │
│                              │  │                  │ Bonjour {nom},                                │        │     │
│                              │  │                  │                                                │        │     │
│                              │  │                  │ Votre commande #{ref} est prete.              │        │     │
│                              │  │                  │ Retirez-la en magasin avant le {date}.        │        │     │
│                              │  │                  │                                                │        │     │
│                              │  │                  │ L'equipe MyShop                               │        │     │
│                              │  │                  └────────────────────────────────────────────────┘        │     │
│                              │  │                  142 car. - 1 SMS/dest. - Cout: 2 credits (total)          │     │
│                              │  │                                                                            │     │
│                              │  │   [x] Planifier l'envoi    Date: [05/01/2026]  Heure: [10:00]              │     │
│                              │  │   [ ] Notification par email a l'envoi                                     │     │
│                              │  │                                                                            │     │
│                              │  │                                   [Apercu]  [Envoyer]                      │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "form": {
    "sender": "OVH Marketing",
    "recipients": ["+33 6 12 34 56 78", "+33 6 98 76 54 32"],
    "recipientCount": 2,
    "message": "Bonjour {nom},\n\nVotre commande #{ref} est prete.\nRetirez-la en magasin avant le {date}.\n\nL'equipe MyShop",
    "characterCount": 142,
    "smsPerRecipient": 1,
    "totalCost": 2,
    "scheduled": true,
    "scheduleDate": "05/01/2026",
    "scheduleTime": "10:00",
    "emailNotification": false
  },
  "senderOptions": ["OVH Marketing", "OVH Support", "MonEntreprise"],
  "account": {
    "serviceName": "sms-ab12345",
    "creditsLeft": 1234
  }
}

================================================================================
