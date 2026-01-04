================================================================================
SCREENSHOT: target_.web-cloud.access.general.modem-perso.svg
================================================================================

NAV1: Web Cloud | NAV2: Acces | NAV3: General | NAV4: Modem | NAV5: Informations (Modem Perso)
NOTE: Vue specifique pour les modems personnels (non OVH)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                           =====                                                    │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [OTB]              │ VDSL Bureau Lyon                                              [Demenager] [Migrer]  │
│  =======                     │ xdsl-cd67890-2                               [VDSL2] [Acces seul] [Actif]           │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [General] [Ligne] [Modem] [Services] [VoIP] [Options] [Taches]                      │
│ [Rechercher...]              │                   =====                                                             │
├──────────────────────────────┤                   NAV4=Modem (ACTIF)                                                │
│ 3 connexions                 │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Informations] [Identifiants] [VLAN] [Guides]                                       │
│ o Fibre Pro Paris            │  ============                                                                       │
│   xdsl-ab12345-1             │  NAV5=Informations (ACTIF)                                                          │
│   FTTH - Pack Pro            │ ────────────────────────────────────────────────────────────────────────────────────┤
│                       [Actif]│                                                                                     │
├──────────────────────────────┤  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ * VDSL Bureau Lyon       ████│  │ Modem personnel                                                           │     │
│   xdsl-cd67890-2             │  ├────────────────────────────────────────────────────────────────────────────┤     │
│   VDSL2 - Acces seul         │  │                                                                            │     │
│   (SELECTIONNE)       [Actif]│  │   Modele declare     Netgear R7000                                        │     │
├──────────────────────────────┤  │   MAC Address        AA:BB:CC:DD:EE:FF                                     │     │
│ o Backup 4G                  │  │   Declare le         15/06/2024                                            │     │
│   xdsl-ef11111-3             │  │                                                                            │     │
│   4G/LTE - Acces seul        │  │   (!) Ce modem n'est pas gere par OVH.                                    │     │
│                     [Degrade]│  │       Vous devez le configurer manuellement.                              │     │
│                              │  │                                                                            │     │
│                              │  │                           [Modifier] [Supprimer declaration]               │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│                              │  │ Parametres de connexion                                                    │     │
│                              │  ├────────────────────────────────────────────────────────────────────────────┤     │
│                              │  │                                                                            │     │
│                              │  │   Ces parametres sont a configurer dans votre modem:                      │     │
│                              │  │                                                                            │     │
│                              │  │   Type             PPPoE                                                   │     │
│                              │  │   Identifiant      fti/abc123@orange.fr                                   │     │
│                              │  │   Mot de passe     •••••••• [eye Afficher]                                │     │
│                              │  │                                                                            │     │
│                              │  │   VLAN             835                                                     │     │
│                              │  │   MTU              1492                                                    │     │
│                              │  │                                                                            │     │
│                              │  │   DNS primaire     213.186.33.99                                          │     │
│                              │  │   DNS secondaire   1.1.1.1                                                │     │
│                              │  │                                                                            │     │
│                              │  │                                        [Copier tous les parametres]        │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  (i) Besoin d'aide pour configurer votre modem ?                                   │
│                              │      Consultez nos guides de configuration ->                                      │
│                              │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "modemType": "personal",
  "modem": {
    "model": "Netgear R7000",
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "declaredDate": "15/06/2024"
  },
  "connectionParams": {
    "type": "PPPoE",
    "username": "fti/abc123@orange.fr",
    "vlan": 835,
    "mtu": 1492,
    "dnsPrimary": "213.186.33.99",
    "dnsSecondary": "1.1.1.1"
  },
  "warning": "Ce modem n'est pas gere par OVH. Vous devez le configurer manuellement."
}

================================================================================
