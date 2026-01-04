# SCREENSHOT: Bare Metal Hover Service
# NAV1: bare-metal | NAV2: general | NAV3: AUCUN (FULL WIDTH) | NAV4: AUCUN
# Type: Page FULL WIDTH sans sidecar (NAV2=general)

Hub - Click sur ligne "Services recents" (hover + navigation)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVH Logo]  Bare Metal Cloud   Public Cloud   Web Cloud   Network   IAM        [?] [FR] [User] │ <- NAV1 (50px)
│             ════════════════                                                                     │    [Bare Metal Cloud] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [General]   Serveurs    VPS    Stockage    Licences                                            │ <- NAV2 (40px)
│   ────────                                                                                       │    [General] actif
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  ... (KPIs)                                                                                      │
│                                                                                                  │
│  Services recents                                                        [Voir tout ->]         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ Type        │ Nom                  │ Statut    │ Region   │ Derniere activite           │   │
│  ├─────────────┼──────────────────────┼───────────┼──────────┼─────────────────────────────┤   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  │░ Serveur    │ ns1234.ip-51-68.eu   │ [Actif]   │ GRA      │ Il y a 2 heures     HOVER ░│   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  │ VPS         │ vps-abc123           │ [Actif]   │ SBG      │ Il y a 5 heures             │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘   │
│        ↑                                                                                         │
│        Click -> Navigation vers /bare-metal/serveurs/ns1234                                     │
│                  NAV2 devient [Serveurs] actif                                                  │
│                  Service selectionne dans sidecar                                               │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
