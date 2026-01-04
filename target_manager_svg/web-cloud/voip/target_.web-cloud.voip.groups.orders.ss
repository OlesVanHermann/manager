================================================================================
SCREENSHOT: target_.web-cloud.voip.groups.orders.svg
================================================================================

NAV1: Web Cloud | NAV2: VoIP | NAV3a: SIP | NAV3b: Groups | NAV4: Commandes

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
├──────────────────────────────┤                       =========                                                     │
│ [Rechercher...]              │                       NAV4=Commandes (ACTIF)                                        │
├──────────────────────────────┤ ────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬───────────────┐ │                                                                                     │
│ │Groups (2)│ Lignes (5)    │ │  ┌────────────────────────────────────────────────────────────────────────────┐     │
│ ├──────────┼───────────────┤ │  │ Historique des commandes                               [+ Nouvelle commande]│     │
│ │Numeros(8)│ Services      │ │  ├────────────────────────────────────────────────────────────────────────────┤     │
│ └──────────┴───────────────┘ │  │                                                                            │     │
│ NAV3b=Groups (ACTIF)         │  │  [Toutes (8)] [En cours (1)] [Terminees (7)]            [Filtrer...]       │     │
├──────────────────────────────┤  │                                                                            │     │
│ 2 groupes                    │  │  Date       │ Ref            │ Type               │ Statut    │ Actions   │     │
├──────────────────────────────┤  │  ═════════════════════════════════════════════════════════════════════════ │     │
│ * Bureau Paris           ████│  │  02/01/2026 │ ORD-2026-00123 │ Ligne SIP          │ [o]Encours│ [Suivre]  │     │
│   OVH-TELECOM-12345          │  │  15/12/2025 │ ORD-2025-98765 │ Numero geographique│ [v]Termine│ [Details] │     │
│   5 lignes · 8 numeros · 1fax│  │  01/12/2025 │ ORD-2025-98000 │ Telephone IP       │ [v]Termine│ [Details] │     │
│   (SELECTIONNE)       [Actif]│  │  15/11/2025 │ ORD-2025-87654 │ Ligne SIP          │ [v]Termine│ [Details] │     │
├──────────────────────────────┤  │  01/09/2025 │ ORD-2025-76543 │ Portabilite        │ [v]Termine│ [Details] │     │
│ o Agence Lyon                │  │  15/07/2025 │ ORD-2025-65432 │ Numero geographique│ [v]Termine│ [Details] │     │
│   OVH-TELECOM-67890          │  │  01/05/2025 │ ORD-2025-54321 │ Ligne SIP          │ [v]Termine│ [Details] │     │
│   3 lignes · 4 numeros · 0fax│  │  15/03/2022 │ ORD-2022-00001 │ Groupe VoIP        │ [v]Termine│ [Details] │     │
│                       [Actif]│  │                                                                            │     │
│                              │  └────────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                                                     │
│                              │  Affichage 1-8 sur 8                                                                │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "orders": [
    {"date": "02/01/2026", "ref": "ORD-2026-00123", "type": "Ligne SIP", "status": "in_progress"},
    {"date": "15/12/2025", "ref": "ORD-2025-98765", "type": "Numero geographique", "status": "completed"},
    {"date": "01/12/2025", "ref": "ORD-2025-98000", "type": "Telephone IP", "status": "completed"},
    {"date": "15/11/2025", "ref": "ORD-2025-87654", "type": "Ligne SIP", "status": "completed"},
    {"date": "01/09/2025", "ref": "ORD-2025-76543", "type": "Portabilite", "status": "completed"},
    {"date": "15/07/2025", "ref": "ORD-2025-65432", "type": "Numero geographique", "status": "completed"},
    {"date": "01/05/2025", "ref": "ORD-2025-54321", "type": "Ligne SIP", "status": "completed"},
    {"date": "15/03/2022", "ref": "ORD-2022-00001", "type": "Groupe VoIP", "status": "completed"}
  ],
  "filters": {
    "all": 8,
    "inProgress": 1,
    "completed": 7
  }
}

================================================================================
