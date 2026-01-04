================================================================================
SCREENSHOT: target_.web-cloud.emails.general.security.svg
================================================================================

NAV1: Web Cloud | NAV2: Emails | NAV3: General / Liste services (ALL 1er) | NAV4: Securite
NAV5: DNS Config (actif) | Antispam | Signature

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
├──────────────────────────────┤ [DNS Config] | Antispam | Signature                                                 │
│ o Tous les services          │  ==========                                                                         │
│   5 domaines - 47 comptes    │  NAV5=DNS Config (ACTIF)                                                            │
│                              │ ────────────────────────────────────────────────────────────────────────────────────┤
│ * example.com                │ [Verifier la configuration DNS]                                                     │
│   12 comptes (SELECTIONNE)   │                                                                                     │
│   [Exchange] [Email Pro]     │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ Configuration DNS pour example.com                         [o] Partiel       │  │
│ o mon-entreprise.fr          │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│   25 comptes [Exchange]      │  │ 4/5 enregistrements correctement configures                                  │  │
│                              │  └───────────────────────────────────────────────────────────────────────────────┘  │
│ o boutique.shop              │                                                                                     │
│   5 comptes [Email Pro]      │  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│                              │  │ Type  │ Enregistrement              │ Statut        │ Actions              │   │
│ o perso.ovh                  │  ├───────┼─────────────────────────────┼───────────────┼──────────────────────┤   │
│   3 comptes [MX Plan]        │  │ MX    │ mx1.mail.ovh.net (10)       │ [v] OK        │ [Copier]             │   │
│                              │  │ MX    │ mx2.mail.ovh.net (20)       │ [v] OK        │ [Copier]             │   │
│ o startup.io                 │  │ SPF   │ v=spf1 include:mx.ovh ~all  │ [v] OK        │ [Copier]             │   │
│   8 comptes [Zimbra]         │  │ DKIM  │ ovh._domainkey -> CNAME     │ [v] OK        │ [Copier]             │   │
│                              │  │ DMARC │ v=DMARC1; p=none            │ [x] Manquant  │ [+ Configurer]       │   │
│                              │  └──────────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                                                     │
│                              │  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│                              │  │ (i) Configuration DMARC recommandee                                          │  │
│                              │  ├───────────────────────────────────────────────────────────────────────────────┤  │
│                              │  │ Ajoutez cet enregistrement TXT dans votre zone DNS :                         │  │
│                              │  │                                                                               │  │
│                              │  │ Nom:    _dmarc.example.com                                                    │  │
│                              │  │ Type:   TXT                                                                   │  │
│                              │  │ Valeur: v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com                 │  │
│                              │  │                                                                               │  │
│                              │  │                                           [Copier] [-> Zone DNS]             │  │
│ [+ Ajouter un domaine]       │  └───────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

================================================================================
DONNEES MOCK
================================================================================

{
  "dnsConfig": {
    "domain": "example.com",
    "status": "partial",
    "configured": 4,
    "total": 5,
    "records": [
      {"type": "MX", "value": "mx1.mail.ovh.net (10)", "status": "ok"},
      {"type": "MX", "value": "mx2.mail.ovh.net (20)", "status": "ok"},
      {"type": "SPF", "value": "v=spf1 include:mx.ovh.com ~all", "status": "ok"},
      {"type": "DKIM", "value": "ovh._domainkey -> CNAME", "status": "ok"},
      {"type": "DMARC", "value": "v=DMARC1; p=none", "status": "missing"}
    ],
    "dmarcRecommendation": "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"
  }
}

================================================================================
