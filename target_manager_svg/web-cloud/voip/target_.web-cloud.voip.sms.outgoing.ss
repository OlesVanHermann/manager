================================================================================
SCREENSHOT: target_.web-cloud.voip.sms.outgoing.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SMS | NAV3b: - (pas de NAV3b) | NAV4: Sortants

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
├──────────────────────────────┤                                   ========                                          │
│ [Rechercher...]              │                                   NAV4=Sortants (ACTIF)                             │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ 1 compte                     │                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * Marketing              ████│  │ SMS envoyes                                                [Exporter]      │     │
│   sms-ab12345                │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   1 234 credits              │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │  [Tous (2456)] [Aujourd'hui (45)] [Cette semaine (312)]  [Filtrer...]      │     │
│                              │  │                                                                            │     │
│                              │  │  Date         │ Destinataire  │ Message (extrait)       │ Statut  │Credits│     │
│                              │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│                              │  │  03/01 14:32  │ +33612345678  │ Votre code: 847293      │[v]Deliv.│   1   │     │
│                              │  │  03/01 12:15  │ +33698765432  │ Rappel RDV demain 10h   │[v]Deliv.│   1   │     │
│                              │  │  03/01 10:00  │ +33655443322  │ Promo -20% ce week-end  │[o]Attent│   1   │     │
│                              │  │  03/01 09:30  │ +33611223344  │ Confirmation commande...│[v]Deliv.│   1   │     │
│                              │  │  02/01 18:00  │ +33677889900  │ Votre colis est arrive  │[v]Deliv.│   1   │     │
│                              │  │  02/01 16:45  │ +33644556677  │ Bienvenue chez...       │[x]Echec │   0   │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-6 sur 2456                                   [<] [1] [2] ... [>]       │
│                              │                                                                                     │
│                              │  Resume: 2456 envoyes - 98.5% delivres - 2421 credits consommes                    │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "outgoingSms": [
    {"date": "03/01 14:32", "recipient": "+33612345678", "message": "Votre code: 847293", "status": "delivered", "credits": 1},
    {"date": "03/01 12:15", "recipient": "+33698765432", "message": "Rappel RDV demain 10h", "status": "delivered", "credits": 1},
    {"date": "03/01 10:00", "recipient": "+33655443322", "message": "Promo -20% ce week-end", "status": "pending", "credits": 1},
    {"date": "03/01 09:30", "recipient": "+33611223344", "message": "Confirmation commande...", "status": "delivered", "credits": 1},
    {"date": "02/01 18:00", "recipient": "+33677889900", "message": "Votre colis est arrive", "status": "delivered", "credits": 1},
    {"date": "02/01 16:45", "recipient": "+33644556677", "message": "Bienvenue chez...", "status": "failed", "credits": 0}
  ],
  "filters": {
    "all": 2456,
    "today": 45,
    "thisWeek": 312
  },
  "summary": {
    "totalSent": 2456,
    "deliveryRate": 98.5,
    "creditsUsed": 2421
  }
}

================================================================================
