================================================================================
SCREENSHOT: target_.web-cloud.voip.onboarding.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: - (tous a 0) | NAV3b: - | NAV4: - (onboarding)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (0)][SMS (0)][FAX (0)]  │                                                                                     │
│ [Trunk (0)]                  │                                                                                     │
├──────────────────────────────┤                                                                                     │
│ [Rechercher...]              │                                    [TEL]                                            │
├──────────────────────────────┤                                                                                     │
│                              │                        Bienvenue dans VoIP OVHcloud                                 │
│                              │                                                                                     │
│        [VIDE]                │              Gerez vos lignes telephoniques, numeros, SMS et fax                    │
│                              │                        depuis une interface unifiee.                                │
│   Aucun service VoIP         │                                                                                     │
│                              │                                                                                     │
│                              │    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                    │
│                              │    │      [TEL]      │  │      [SMS]      │  │      [FAX]      │                    │
│                              │    │ Telephonie SIP  │  │  Service SMS    │  │  Service Fax    │                    │
│                              │    │                 │  │                 │  │                 │                    │
│                              │    │ Lignes, numeros,│  │ Envoyez des SMS │  │ Fax virtuel     │                    │
│                              │    │ files d'attente │  │ en masse        │  │ avec email      │                    │
│                              │    │                 │  │                 │  │                 │                    │
│                              │    │  [Commander ->] │  │  [Commander ->] │  │  [Commander ->] │                    │
│                              │    └─────────────────┘  └─────────────────┘  └─────────────────┘                    │
│                              │                                                                                     │
│                              │    ┌───────────────────────────────────────────────────────────────────────┐        │
│                              │    │                              [LINK]                                   │        │
│                              │    │                        Trunk Carrier SIP                              │        │
│                              │    │           Pour les professionnels avec volumes importants             │        │
│                              │    │                         [En savoir plus ->]                           │        │
│                              │    └───────────────────────────────────────────────────────────────────────┘        │
│                              │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "onboarding": true,
  "services": {
    "sip": 0,
    "sms": 0,
    "fax": 0,
    "trunk": 0
  },
  "cards": [
    {
      "id": "sip",
      "title": "Telephonie SIP",
      "description": "Lignes, numeros, files d'attente",
      "action": "Commander"
    },
    {
      "id": "sms",
      "title": "Service SMS",
      "description": "Envoyez des SMS en masse",
      "action": "Commander"
    },
    {
      "id": "fax",
      "title": "Service Fax",
      "description": "Fax virtuel avec email",
      "action": "Commander"
    }
  ],
  "trunkPromo": {
    "title": "Trunk Carrier SIP",
    "description": "Pour les professionnels avec volumes importants",
    "action": "En savoir plus"
  }
}

================================================================================
