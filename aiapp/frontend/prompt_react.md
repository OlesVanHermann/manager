# New Manager - Frontend React/TypeScript

## Structure du Projet
```
frontend/
├── src/
│   ├── App.tsx                    # Point d'entrée, routing, layout principal
│   ├── main.tsx                   # Bootstrap React
│   ├── contexts/
│   │   └── AuthContext.tsx        # Context d'authentification
│   ├── components/
│   │   ├── Sidebar/               # Sidebar navigation OVH
│   │   │   ├── Sidebar.tsx        # Composant sidebar collapsible
│   │   │   ├── navigationTree.ts  # Arbre de navigation (univers OVH)
│   │   │   ├── styles.css
│   │   │   └── index.ts
│   │   └── AccountSidebar/        # Sidebar utilisateur (dropdown)
│   │       ├── AccountSidebar.tsx
│   │       ├── styles.css
│   │       └── index.ts
│   ├── pages/
│   │   ├── Login.tsx              # Page de connexion OAuth OVH
│   │   ├── Home.tsx               # Dashboard accueil
│   │   ├── Dev.tsx                # Page développeur/debug
│   │   ├── Account/               # Page Mon compte
│   │   │   ├── AccountPage.tsx    # Layout avec onglets
│   │   │   ├── ProfileTile.tsx    # Tile profil utilisateur
│   │   │   ├── ShortcutsTile.tsx  # Tile raccourcis (navigation)
│   │   │   ├── LastBillTile.tsx   # Tile dernière facture
│   │   │   ├── SecurityTab.tsx    # Onglet Sécurité (2FA, mot de passe)
│   │   │   ├── SupportLevelTab.tsx # Onglet niveau de support
│   │   │   ├── GdprTab.tsx        # Onglet données personnelles/RGPD
│   │   │   ├── AdvancedTab.tsx    # Onglet paramètres avancés
│   │   │   ├── styles.css
│   │   │   └── index.ts
│   │   └── Billing/               # Page Factures
│   │       ├── BillingPage.tsx    # Liste factures, paiements, moyens
│   │       ├── styles.css
│   │       └── index.ts
│   ├── services/
│   │   ├── auth.service.ts        # API auth OVH (/me, credentials)
│   │   ├── billing.service.ts     # API facturation (/me/bill, /me/deposit, /me/payment)
│   │   ├── account.service.ts     # API compte (/me/supportLevel, /me/marketing, /me/privacy)
│   │   └── security.service.ts    # API sécurité (/me/accessRestriction/*)
│   ├── types/
│   │   └── auth.types.ts          # Types TypeScript
│   └── design-system/
│       └── tokens.css             # Variables CSS (couleurs OVH, spacing, etc.)
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## APIs OVH Utilisées

### Authentification
- `POST /auth/credential` - Demande de consumer key
- `GET /me` - Informations utilisateur

### Facturation
- `GET /me/bill` - Liste des IDs de factures
- `GET /me/bill/{billId}` - Détails d'une facture
- `GET /me/deposit` - Liste des paiements
- `GET /me/deposit/{depositId}` - Détails d'un paiement
- `GET /me/payment/method` - Moyens de paiement
- `GET /me/debtAccount` - Encours/dette

### Sécurité (2FA)
- `GET /me/accessRestriction/sms` - Liste SMS 2FA
- `GET /me/accessRestriction/sms/{id}` - Détails SMS
- `GET /me/accessRestriction/totp` - Liste TOTP (app mobile)
- `GET /me/accessRestriction/totp/{id}` - Détails TOTP
- `GET /me/accessRestriction/u2f` - Liste clés U2F
- `GET /me/accessRestriction/u2f/{id}` - Détails U2F
- `GET /me/accessRestriction/backupCode` - Codes de secours

### Compte
- `GET /me/supportLevel` - Niveau de support
- `GET /me/marketing` - Préférences marketing
- `PUT /me/marketing` - Mise à jour marketing
- `GET /me/privacy/requests/capabilities` - Capacités RGPD
- `GET /me/privacy/requests` - Demandes RGPD
- `POST /me/privacy/requests/erasure` - Demande suppression

## Design System

### Couleurs Principales
```css
--color-primary-500: #00B4D8;    /* Bleu OVH */
--color-primary-700: #006C82;    /* Hover */
--color-primary-800: #004857;    /* Texte foncé */
--color-neutral-050: #F8F9FA;    /* Background clair */
--color-neutral-200: #DEE2E6;    /* Bordures */
--color-success-500: #28A745;    /* Succès */
--color-critical-500: #DC3545;   /* Erreur */
--color-warning-500: #FFC107;    /* Warning */
```

### Composants UI
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-outline` - Boutons
- `.tile` / `.tile-header` / `.tile-content` - Cartes/Tiles
- `.tab-btn` / `.tabs-list` - Onglets
- `.status-badge` / `.badge-success` / `.badge-warning` - Badges
- `.toggle-switch` / `.toggle-slider` - Toggle switches
- `.security-card` / `.two-factor-method` - Cartes sécurité
- `.bills-table` / `.method-table` - Tableaux

## Layout Principal (App.tsx)
```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────┐ │
│ │          │ │ Header: Boutons nav + Avatar user     │ │
│ │          │ ├────────────────────────────────────────┤ │
│ │ Sidebar  │ │                                        │ │
│ │ OVH      │ │   Content Area (activePane)            │ │
│ │          │ │   - home: Home                         │ │
│ │ (toggle) │ │   - account: AccountPage               │ │
│ │          │ │   - billing: BillingPage               │ │
│ │          │ │   - dev: Dev                           │ │
│ │          │ │                                        │ │
│ └──────────┘ └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Onglets Mon Compte

1. **Informations générales** - Profil, Raccourcis, Dernière facture
2. **Sécurité** - Mot de passe, 2FA (SMS/TOTP/U2F), Codes secours, Restriction IP
3. **Mon niveau de support** - Standard/Premium/Business/Enterprise
4. **Données personnelles** - Suppression compte, demandes RGPD
5. **Paramètres avancés** - Beta, Mode développeur, liens GitHub

## Onglets Facturation

1. **Historique des factures** - Liste + téléchargement PDF
2. **Suivi des paiements** - Dépôts/paiements
3. **Moyens de paiement** - Cartes, SEPA, etc.
4. **Mon encours** - Dette éventuelle

## Proxy Nginx

Le frontend communique avec l'API OVH via `/api/ovh/*` qui est proxifié par nginx vers `https://eu.api.ovh.com/1.0/*` avec signature automatique des requêtes.

Headers requis pour les appels API :
```
X-Ovh-App-Key: {appKey}
X-Ovh-App-Secret: {appSecret}
X-Ovh-Consumer-Key: {consumerKey}
```

## Session Storage

Les credentials sont stockés dans `sessionStorage` sous la clé `ovh_credentials`:
```json
{
  "appKey": "...",
  "appSecret": "...",
  "consumerKey": "..."
}
```

## Build & Deploy
```bash
cd /home/ubuntu/aiapp/frontend
npm run build:dev              # Build development
npm run build                  # Build production
/home/ubuntu/aiapp/scripts/D1-build_frontend_dev.sh  # Deploy vers nginx
```

## Navigation Sidebar

Univers OVH disponibles :
- Bare Metal Cloud (serveurs dédiés, VPS)
- Hosted Private Cloud (VMware, Nutanix)
- Public Cloud (compute, storage, AI/ML)
- Network (IP, vRack, CDN)
- Telecom (VoIP, SMS)
- Web Cloud (domaines, hébergement, emails)
- Sécurité, Identité & Operations (IAM)

## Raccourcis (depuis AccountPage)

- Voir mes factures → billing/history
- Suivre mes paiements → billing/payments
- Ajouter un moyen de paiement → billing/methods
- Voir mes contrats → (TODO)
- Gérer mes services → (TODO)
- Gérer mes utilisateurs → (TODO)
- Ajouter un contact → (TODO)
