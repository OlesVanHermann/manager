================================================================================
SCREENSHOT: target_.web-cloud.emails.general.advanced.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Avance
NAV5: Ressources (actif) | Contacts ext. | Audit | Appareils

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
│ [Rechercher un domaine...]   │                                                                ======               │
├──────────────────────────────┤                                                                NAV4=Avance (ACTIF)  │
│ Filtre: [Tous v] 5 domaines  │ ────────────────────────────────────────────────────────────────────────────────────┤
├──────────────────────────────┤ [Ressources] | Contacts ext. | Audit | Appareils                                   │
│ o Tous les services          │  ==========                                                                         │
│   5 domaines - 47 comptes    │  NAV5=Ressources (ACTIF)                                                            │
│                              │ ────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com                │ [+ Creer une ressource]                                                             │
│   12 comptes (SELECTIONNE)   │                                                                                     │
│   [Exchange] [Email Pro]     │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Ressource           │ Type      │ Email              │ Capacite │ Actions   │   │
│ o mon-entreprise.fr          │  ├─────────────────────┼───────────┼────────────────────┼──────────┼───────────┤   │
│   25 comptes [Exchange]      │  │ Salle Reunion A     │ Salle     │ salle-a@example.com│ 10 pers. │ [C][E][X] │   │
│                              │  │ Salle Reunion B     │ Salle     │ salle-b@example.com│ 6 pers.  │ [C][E][X] │   │
│ o boutique.shop              │  │ Videoprojecteur     │ Equipement│ projector@example  │ -        │ [C][E][X] │   │
│   5 comptes [Email Pro]      │  │ Voiture societe     │ Vehicule  │ car@example.com    │ -        │ [C][E][X] │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│ o perso.ovh                  │                                                                                     │
│   3 comptes [MX Plan]        │  Legende:                                                                           │
│                              │  [C]=Voir calendrier [E]=Modifier [X]=Supprimer                                     │
│ o startup.io                 │                                                                                     │
│   8 comptes [Zimbra]         │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Les ressources Exchange permettent de gerer la reservation               │  │
│                              │  │     de salles, equipements et vehicules via le calendrier Outlook.           │  │
│                              │  │                                                                               │  │
│                              │  │     Note: Cette fonctionnalite est disponible uniquement pour                │  │
│                              │  │     les comptes Exchange.                                                     │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ [+ Ajouter un domaine]       │                                                                                     │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "resources": [
    {"name": "Salle Reunion A", "type": "room", "email": "salle-a@example.com", "capacity": "10 pers."},
    {"name": "Salle Reunion B", "type": "room", "email": "salle-b@example.com", "capacity": "6 pers."},
    {"name": "Videoprojecteur", "type": "equipment", "email": "projector@example.com", "capacity": null},
    {"name": "Voiture societe", "type": "vehicle", "email": "car@example.com", "capacity": null}
  ]
}

================================================================================
