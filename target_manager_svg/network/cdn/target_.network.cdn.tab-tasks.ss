# SCREENSHOT: CDN selectionne - Tab Taches
# NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: Taches

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV1 - Network                                                      [xx-ovh] │
├──────────────────────────────────────────────────────────────────────────────┤
│ NAV2  [Subnet][vRack][Load Balancer][CDN][OVHcloud Connect][Anti-DDoS VAC]            │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ LEFT (280px)        │ RIGHT PANEL                                            │
│ ┌─────────────────┐ │ ┌────────────────────────────────────────────────────┐ │
│ │ POP         [v] │ │ │ cdn-prod.ovh.net                    [Vider cache] │ │
│ │ ALL             │ │ │ OK - Anycast: 1.2.3.4                              │ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ Rechercher...   │ │ │ NAV4: [General][Domaines][Cache][SSL][Stats][Taches]│
│ ├─────────────────┤ │ │                                             ▲      │ │
│ │ o Tous les svc  │ │ │                                             └ ACTIF│ │
│ ├─────────────────┤ │ ├────────────────────────────────────────────────────┤ │
│ │ * cdn-prod   ◀  │ │ │ Historique des taches                              │ │
│ │   OK            │ │ │                                                    │ │
│ │ o cdn-staging   │ │ │ ┌────────────────────────────────────────────────┐ │ │
│ │   OK            │ │ │ │ Date        │ Operation     │ Cible     │Statut│ │ │
│ │                 │ │ │ ├────────────────────────────────────────────────┤ │ │
│ │                 │ │ │ │ 02/01 14:32 │ Purge cache   │ /logo.png │  OK  │ │ │
│ │                 │ │ │ │ 02/01 10:15 │ Ajout domaine │ new.ex.com│  OK  │ │ │
│ │                 │ │ │ │ 01/01 18:00 │ SSL renouvele │ www.ex.com│  OK  │ │ │
│ │                 │ │ │ │ 01/01 09:30 │ Purge domaine │ static.ex │  OK  │ │ │
│ │                 │ │ │ │ 31/12 16:45 │ Modif regle   │ Images    │  OK  │ │ │
│ │                 │ │ │ │ 31/12 14:00 │ Ajout regle   │ API       │  OK  │ │ │
│ │                 │ │ │ │ ...         │               │           │      │ │ │
│ │                 │ │ │ └────────────────────────────────────────────────┘ │ │
│ │                 │ │ │                                                    │ │
│ │                 │ │ │ Legende: -- En cours  OK Succes  !! Erreur         │ │
│ └─────────────────┘ │ └────────────────────────────────────────────────────┘ │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

TYPE: a) NAV1: Network | NAV2: CDN | NAV3: POP (ALL) / cdn-prod selectionne | NAV4: Taches
