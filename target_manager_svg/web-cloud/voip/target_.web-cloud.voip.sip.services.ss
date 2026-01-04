================================================================================
SCREENSHOT: target_.web-cloud.voip.sip.services.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Services | NAV4: - (pas de tabs)

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                                                   ====                                             │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [SIP (2)][SMS (1)][FAX (1)]  │ OVH-TELECOM-12345 - Services                                                        │
│ [Trunk (0)]                  │ Tous les services du groupe                                                         │
│          ===                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│        NAV3a=SIP (ACTIF)     │                                                                                     │
├──────────────────────────────┤  [Tous (14)] [Lignes (5)] [Numeros (8)] [Fax (1)]              [Filtrer...]         │
│ [Rechercher...]              │                                                                                     │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ ├──────────┼───────────────┤ │  │                                                                            │     │
│ │Numeros(8)│ Services      │ │  │  Service                │ Type         │ Description      │ Statut        │     │
│ └──────────┴───────────────┘ │  │  ═════════════════════════════════════════════════════════════════════════ │     │
│ NAV3b=Services (ACTIF)       │  │  +33 9 72 10 12 34      │ Ligne        │ Ligne Accueil    │ [v] Actif     │     │
├──────────────────────────────┤  │  +33 9 72 10 12 35      │ Ligne        │ Ligne Direction  │ [v] Actif     │     │
│ 14 services                  │  │  +33 9 72 10 12 36      │ Ligne        │ Ligne Commercial │ [v] Actif     │     │
├──────────────────────────────┤  │  +33 9 72 10 12 37      │ Ligne        │ Ligne Support    │ [v] Actif     │     │
│ o +33 9 72 10 12 34          │  │  +33 9 72 10 12 38      │ Ligne        │ Ligne Technique  │ [o] Inactif   │     │
│   Ligne Accueil              │  │  ─────────────────────────────────────────────────────────────────────────  │     │
│   Ligne              [Actif] │  │  +33 1 84 88 00 00      │ Numero       │ Numero Principal │ [v] Actif     │     │
├──────────────────────────────┤  │  +33 1 84 88 00 01      │ Numero       │ Accueil          │ [v] Actif     │     │
│ o +33 9 72 10 12 35          │  │  +33 1 84 88 00 02      │ Numero       │ Support          │ [v] Actif     │     │
│   Ligne Direction            │  │  +33 1 84 88 00 03      │ Numero       │ Commercial       │ [v] Actif     │     │
│   Ligne              [Actif] │  │  +33 1 84 88 00 04      │ Numero       │ SAV              │ [v] Actif     │     │
├──────────────────────────────┤  │  +33 1 84 88 00 05      │ Numero       │ Facturation      │ [v] Actif     │     │
│ o +33 1 84 88 00 00          │  │  +33 1 84 88 00 06      │ Numero       │ RH               │ [v] Actif     │     │
│   Numero Principal           │  │  +33 1 84 88 00 07      │ Numero       │ Technique        │ [v] Actif     │     │
│   File att.          [Actif] │  │  ─────────────────────────────────────────────────────────────────────────  │     │
│                              │  │  +33 9 72 10 77 77      │ Fax          │ Fax Bureau       │ [v] Actif     │     │
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
    {"service": "+33 1 84 88 00 03", "type": "number", "description": "Commercial", "status": "active"},
    {"service": "+33 1 84 88 00 04", "type": "number", "description": "SAV", "status": "active"},
    {"service": "+33 1 84 88 00 05", "type": "number", "description": "Facturation", "status": "active"},
    {"service": "+33 1 84 88 00 06", "type": "number", "description": "RH", "status": "active"},
    {"service": "+33 1 84 88 00 07", "type": "number", "description": "Technique", "status": "active"},
    {"service": "+33 9 72 10 77 77", "type": "fax", "description": "Fax Bureau", "status": "active"}
  ],
  "filters": {
    "all": 14,
    "lines": 5,
    "numbers": 8,
    "fax": 1
  },
  "nav3b": "Services"
}

================================================================================
