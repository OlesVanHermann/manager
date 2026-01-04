================================================================================
SCREENSHOT: target_.web-cloud.emails.general.security.antispam.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Securite
NAV5: DNS Config | Antispam (actif) | Signature

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │ example.com                                                                         │
│  =======                     │ 12 comptes - Exchange + Email Pro                    [Exchange] [Email Pro]         │
│  NAV3=General (ACTIF)        ├─────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Comptes] [Redirections] [Repondeurs] [Listes] [Securite] [Avance] [Taches]         │
│ [Rechercher un domaine...]   │                                                      ========                       │
├──────────────────────────────┤                                                      NAV4=Securite (ACTIF)          │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ DNS Config | [Antispam] | Signature                                                 │
│ o Tous les services          │             ========                                                                │
│   5 domaines - 47 comptes    │             NAV5=Antispam (ACTIF)                                                   │
│                              │ ────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com                │                                                                                     │
│   12 comptes (SELECTIONNE)   │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│   [Exchange] [Email Pro]     │  │ Politique antispam globale                                                    │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│ o mon-entreprise.fr          │  │                                                                               │  │
│   25 comptes [Exchange]      │  │ Niveau de filtrage:                                                           │  │
│                              │  │ o Desactive - Aucun filtrage                                                  │  │
│ o boutique.shop              │  │ o Faible - Spam evident uniquement                                            │  │
│   5 comptes [Email Pro]      │  │ * Modere - Equilibre entre securite et faux positifs                          │  │
│                              │  │ o Strict - Filtrage agressif (risque de faux positifs)                        │  │
│ o perso.ovh                  │  │                                                                               │  │
│   3 comptes [MX Plan]        │  │ Action sur spam detecte:                                                      │  │
│                              │  │ * Deplacer vers Spam                                                          │  │
│ o startup.io                 │  │ o Marquer comme [SPAM] dans l'objet                                           │  │
│   8 comptes [Zimbra]         │  │ o Supprimer directement                                                       │  │
│                              │  │                                                                               │  │
│                              │  │                                      [Appliquer les modifications]            │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Listes personnalisees                                                         │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │                                                                               │  │
│                              │  │ Liste blanche (toujours accepter):                          [+ Ajouter]       │  │
│                              │  │   * *@trusted-partner.com                                                     │  │
│                              │  │   * newsletter@service.com                                                    │  │
│                              │  │                                                                               │  │
│                              │  │ Liste noire (toujours bloquer):                             [+ Ajouter]       │  │
│                              │  │   * *@spam-domain.xyz                                                         │  │
│                              │  │   * annoying@sender.com                                                       │  │
│                              │  │                                                                               │  │
│ [+ Ajouter un domaine]       │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "antispam": {
    "filterLevel": "moderate",
    "action": "move_to_spam",
    "whitelist": ["*@trusted-partner.com", "newsletter@service.com"],
    "blacklist": ["*@spam-domain.xyz", "annoying@sender.com"]
  }
}

================================================================================
