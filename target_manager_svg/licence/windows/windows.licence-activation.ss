┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────┐                                                                                         │
│  │ OVH │   Bare Metal   Public Cloud   Web Cloud   Network   [Licences]   IAM                   │
│  └─────┘                                                       ▔▔▔▔▔▔▔▔                          │
│                                                                 NAV1=license (actif)             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  General   cPanel   Plesk   [Windows]   SQL Server   CloudLinux   DirectAdmin   SPLA            │
│                                      ▔▔▔▔▔▔▔▔                                                    │
│                                      NAV2=windows (actif)                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│ ┌─────────────────────────┐  ┌──────────────────────────────────────────────────────────────────┐│
│ │ LEFT PANEL (280px)      │  │ RIGHT PANEL                                                      ││
│ ├─────────────────────────┤  ├──────────────────────────────────────────────────────────────────┤│
│ │ NAV3: [Général]         │  │  NAV4: [Informations]  [Activation]  [Historique]                ││
│ ├─────────────────────────┤  │                         ▔▔▔▔▔▔▔▔▔▔▔                               ││
│ │ Région: [Toutes    ▼]   │  │                         NAV4=activation (actif)                  ││
│ ├─────────────────────────┤  │                                                                  ││
│ │ [Rechercher...]         │  │  Guide d'activation Windows Server                               ││
│ ├─────────────────────────┤  │  win-12345678                    ✓ Licence activée et valide    ││
│ │ ○ Toutes les licences   │  │                                                                  ││
│ │ ● win-12345678     ←    │  │  ┌──────────────────────────────────────────────────────────────┐││
│ │   (sélectionné)         │  │  │ Étape 1 : Récupérer la clé de produit                        │││
│ │ ○ win-23456789          │  │  ├──────────────────────────────────────────────────────────────┤││
│ │                         │  │  │ ┌────────────────────────────────────────────────┐ [Copier]  │││
│ │                         │  │  │ │ XXXXX-XXXXX-XXXXX-XXXXX-XXXXX                  │           │││
│ │                         │  │  │ └────────────────────────────────────────────────┘           │││
│ │                         │  │  └──────────────────────────────────────────────────────────────┘││
│ │                         │  │                                                                  ││
│ │                         │  │  ┌───────────────────────────────┐ ┌────────────────────────────┐││
│ │                         │  │  │ Étape 2 : Activer via         │ │ Étape 3 : Vérifier         │││
│ │                         │  │  │ PowerShell                    │ │ l'activation               │││
│ │                         │  │  ├───────────────────────────────┤ ├────────────────────────────┤││
│ │                         │  │  │ # Installer la clé            │ │ # Vérifier le statut       │││
│ │                         │  │  │ slmgr.vbs /ipk XXXXX...       │ │ slmgr.vbs /dli             │││
│ │                         │  │  │                    [Copier]   │ │                  [Copier]  │││
│ │                         │  │  │ # Activer Windows             │ │ Résultat attendu:          │││
│ │                         │  │  │ slmgr.vbs /ato                │ │ License Status: Licensed   │││
│ │                         │  │  │                    [Copier]   │ │                            │││
│ │                         │  │  │ ℹ️  Exécuter PowerShell       │ │ [Besoin d'aide ?]          │││
│ │                         │  │  │    en tant qu'administrateur  │ │                            │││
│ │                         │  │  └───────────────────────────────┘ └────────────────────────────┘││
│ └─────────────────────────┘  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

--- SCREENSHOT INFO ---
Title: Licence sélectionnée - Tab Activation (Guide PowerShell)
NAV1: Licences (actif)
NAV2: Windows (actif)
NAV3: Général
NAV4: Activation (actif)
Sidecar: win-12345678 (sélectionné)
