================================================================================
SCREENSHOT: target_.web-cloud.voip.groups.services.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Groups | NAV4: Services

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ OVH-TELECOM-12345                                                     [Actif]       │
│ [Trunk (0)]                  │ Telephonie Bureau Paris                                                             │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │ [General] [Services] [Commandes] [Portabilite] [Facturation] [Reversements] [Secu]  │
├──────────────────────────────┤            ========                                                                 │
│ [Rechercher...]              │            NAV4=Services (ACTIF)                                                    │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ ├──────────┼───────────────┤ │  │ Services du groupe                                      [+ Ajouter]        │     │
│ │Numeros(8)│ Services      │ │  ├────────────────────────────────────────────────────────────────────────────┤     │
│ └──────────┴───────────────┘ │  │                                                                            │     │
│ NAV3b=Groups (ACTIF)         │  │  [Tous (14)] [Lignes (5)] [Numeros (8)] [Fax (1)]       [Filtrer...]       │     │
├──────────────────────────────┤  │                                                                            │     │
│ 2 groupes                    │  │  Service                │ Type    │ Description        │ Statut │ Actions │     │
├──────────────────────────────┤  │  ═════════════════════════════════════════════════════════════════════════ │     │
│ * Bureau Paris           ████│  │  +33 9 72 10 12 34      │ Ligne   │ Ligne Accueil      │[v]Actif│ [->]    │     │
│   OVH-TELECOM-12345          │  │  +33 9 72 10 12 35      │ Ligne   │ Ligne Direction    │[v]Actif│ [->]    │     │
│   5 lignes · 8 numeros · 1fax│  │  +33 9 72 10 12 36      │ Ligne   │ Ligne Commercial   │[v]Actif│ [->]    │     │
│   (SELECTIONNE)       [Actif]│  │  +33 9 72 10 12 37      │ Ligne   │ Ligne Support      │[v]Actif│ [->]    │     │
├──────────────────────────────┤  │  +33 9 72 10 12 38      │ Ligne   │ Ligne Technique    │[o]Inact│ [->]    │     │
│ o Agence Lyon                │  │  ────────────────────────────────────────────────────────────────────────  │     │
│   OVH-TELECOM-67890          │  │  +33 1 84 88 00 00      │ Numero  │ Numero Principal   │[v]Actif│ [->]    │     │
│   3 lignes · 4 numeros · 0fax│  │  +33 1 84 88 00 01      │ Numero  │ Accueil            │[v]Actif│ [->]    │     │
│                       [Actif]│  │  +33 1 84 88 00 02      │ Numero  │ Support            │[v]Actif│ [->]    │     │
│                              │  │  ...                                                                       │     │
│                              │  │  ────────────────────────────────────────────────────────────────────────  │     │
│                              │  │  +33 9 72 10 77 77      │ Fax     │ Fax Bureau         │[v]Actif│ [->]    │     │
│                              │  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-14 sur 14                                                              │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "services": [
    {"service": "+33 9 72 10 12 34", "type": "line", "description": "Ligne Accueil", "status": "active"},
    {"service": "+33 9 72 10 12 35", "type": "line", "description": "Ligne Direction", "status": "active"},
    {"service": "+33 9 72 10 12 36", "type": "line", "description": "Ligne Commercial", "status": "active"},
    {"service": "+33 9 72 10 12 37", "type": "line", "description": "Ligne Support", "status": "active"},
    {"service": "+33 9 72 10 12 38", "type": "line", "description": "Ligne Technique", "status": "inactive"},
    {"service": "+33 1 84 88 00 00", "type": "number", "description": "Numero Principal", "status": "active"},
    {"service": "+33 1 84 88 00 01", "type": "number", "description": "Accueil", "status": "active"},
    {"service": "+33 1 84 88 00 02", "type": "number", "description": "Support", "status": "active"},
    {"service": "+33 9 72 10 77 77", "type": "fax", "description": "Fax Bureau", "status": "active"}
  ],
  "filters": {
    "all": 14,
    "lines": 5,
    "numbers": 8,
    "fax": 1
  }
}

================================================================================
