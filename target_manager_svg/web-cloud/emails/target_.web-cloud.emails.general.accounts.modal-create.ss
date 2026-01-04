================================================================================
SCREENSHOT: target_.web-cloud.emails.general.accounts.modal-create.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Comptes
MODAL: Creer un compte email

================================================================================

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [=] OVHcloud   [Bare Metal] [Public Cloud] [Web Cloud] [Network] [IAM]                              [?] [avatar]  │
│                                             ===========                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [General] [Domaines] [Hebergements] [Emails] [WordPress] [Acces] [VoIP]                                            │
│                                     ======                                                                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ [General][Packs]             │                                                                                     │
│  =======                     │   ┌─────────────────────────────────────────────────────────────────────┐           │
│  NAV3=General (ACTIF)        │   │ Creer un compte email                                         [X]  │           │
├──────────────────────────────┤   ├─────────────────────────────────────────────────────────────────────┤           │
│ [Rechercher un domaine...]   │   │                                                                     │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  Adresse email                                                      │           │
│ Filtre: [Tous v] 5 domaines  │   │  ┌───────────────────────────────┬────────────────────────────┐    │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  │ nouveau                       │ @example.com               │    │           │
│ o Tous les services          │   │  └───────────────────────────────┴────────────────────────────┘    │           │
│   5 domaines - 47 comptes    │   │                                                                     │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  Type de compte                                                    │           │
│ * example.com                │   │  o Exchange (50 Go, calendrier, MFA) - 4,99 EUR/mois               │           │
│   12 comptes (SELECTIONNE)   │   │  * Email Pro (10 Go, alias, delegation) - 1,99 EUR/mois            │           │
│   [Exchange] [Email Pro]     │   │  o MX Plan (5 Go, basique) - inclus                                │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │                                                                     │           │
│ o mon-entreprise.fr          │   │  Pack a utiliser                                                    │           │
│   25 comptes [Exchange]      │   │  ┌─────────────────────────────────────────────────────────────┐   │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  │ Email Pro 5 (0/5 disponibles)                            [v] │   │           │
│ o boutique.shop              │   │  └─────────────────────────────────────────────────────────────┘   │           │
│   5 comptes [Email Pro]      │   │                                                                     │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  Mot de passe                                                       │           │
│ o perso.ovh                  │   │  ┌─────────────────────────────────────────────┐  [Generer]        │           │
│   3 comptes [MX Plan]        │   │  │ ********************************        [O] │                   │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  └─────────────────────────────────────────────┘                   │           │
│ o startup.io                 │   │  Force: ████████░░ Fort                                            │           │
│   8 comptes [Zimbra]         │   │                                                                     │           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  ┌─────────────────────┐  ┌─────────────────────┐                  │           │
│                              │   │  │ Prenom              │  │ Nom                 │                  │           │
│                              │   │  └─────────────────────┘  └─────────────────────┘                  │           │
│                              │   │                                                                     │           │
│                              │   │  [x] Envoyer les identifiants par email                            │           │
│                              │   │  [ ] Forcer le changement de mot de passe                          │           │
│                              │   │                                                                     │           │
│                              │   ├─────────────────────────────────────────────────────────────────────┤           │
│                              │   │                           [Annuler]  [Creer le compte]             │           │
│ [+ Ajouter un domaine]       │   └─────────────────────────────────────────────────────────────────────┘           │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

Note: Zone grisee = overlay modal

================================================================================
DONNEES MOCK
================================================================================

{
  "modal": {
    "title": "Creer un compte email",
    "form": {
      "email": "nouveau",
      "domain": "@example.com",
      "type": "email-pro",
      "typeOptions": [
        {"name": "Exchange", "price": "4,99 EUR/mois", "features": ["50 Go", "calendrier", "MFA"]},
        {"name": "Email Pro", "price": "1,99 EUR/mois", "features": ["10 Go", "alias", "delegation"]},
        {"name": "MX Plan", "price": "inclus", "features": ["5 Go", "basique"]}
      ],
      "pack": "Email Pro 5",
      "packAvailable": 0,
      "passwordStrength": "Fort",
      "options": {
        "sendCredentials": true,
        "forcePasswordChange": false
      }
    }
  }
}

================================================================================
