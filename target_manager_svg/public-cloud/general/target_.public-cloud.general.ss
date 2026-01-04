# ============================================================================
# SCREENSHOTS - PUBLIC CLOUD > GENERAL
# ============================================================================
# Version: 1.0 (2026-01-04)
# ============================================================================

## VARIANTE 01 : Dashboard Normal (avec projets)
```
+--------------------------------------------------------------------------------+
| OVHcloud                    Public Cloud                          [xx-ovh]    |
+--------------------------------------------------------------------------------+
| [General*] [Projet] [Compute] [Storage] [Databases] [Containers] [AI/ML] ... |
+--------------------------------------------------------------------------------+
|                                                                                |
|  Public Cloud                                        [+ Nouveau projet]        |
|                                                                                |
|  +----------------+    +----------------+    +----------------+                |
|  |       3        |    |      26        |    |     595E       |                |
|  |    Projets     |    |   Instances    |    |   Cout/mois    |                |
|  +----------------+    +----------------+    +----------------+                |
|                                                                                |
|  Vos Projets                                                                   |
|  +----------------------------------------------------------------------+     |
|  | Nom                    | Region principale | Cout/mois   | Status   |     |
|  +------------------------+-------------------+-------------+----------+     |
|  | Mon Projet Prod        | GRA               | 450E        | OK       | ->  |
|  | Projet Dev             | SBG               | 120E        | OK       | ->  |
|  | Test Environment       | GRA               | 25E         | OK       | ->  |
|  +----------------------------------------------------------------------+     |
|                                                                                |
|  Alertes                                                                       |
|  +----------------------------------------------------------------------+     |
|  | [i] Upgrade Kubernetes disponible: 1.30.5 (k8s-staging)              |     |
|  | [!] Quota instances: 85% utilise sur Mon Projet Prod                 |     |
|  | [i] Nouvelle region disponible: AP-Mumbai (BOM)                      |     |
|  +----------------------------------------------------------------------+     |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## VARIANTE 02 : Onboarding (nouveau client - etat vide)
```
+--------------------------------------------------------------------------------+
| OVHcloud                    Public Cloud                          [xx-ovh]    |
+--------------------------------------------------------------------------------+
| [General*] [Projet] [Compute] [Storage] [Databases] [Containers] [AI/ML] ... |
+--------------------------------------------------------------------------------+
|                                                                                |
|                                                                                |
|                    +---------------------------------------+                   |
|                    |                                       |                   |
|                    |              [Cloud Icon]             |                   |
|                    |                                       |                   |
|                    |      Bienvenue sur Public Cloud       |                   |
|                    |                                       |                   |
|                    |   Creez votre premier projet pour     |                   |
|                    |   commencer a utiliser nos services   |                   |
|                    |                                       |                   |
|                    |        [+ Creer un projet]            |                   |
|                    |                                       |                   |
|                    +---------------------------------------+                   |
|                                                                                |
|  Decouvrez Public Cloud                                                        |
|  +----------------------------------------------------------------------+     |
|  | - Instances compute flexibles      - Stockage object S3-compatible  |     |
|  | - Kubernetes manage                - Bases de donnees managees      |     |
|  | - AI/ML avec GPU                   - Reseau prive (vRack)           |     |
|  +----------------------------------------------------------------------+     |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## VARIANTE 03 : Dashboard avec alertes critiques
```
+--------------------------------------------------------------------------------+
| OVHcloud                    Public Cloud                          [xx-ovh]    |
+--------------------------------------------------------------------------------+
| [General*] [Projet] [Compute] [Storage] [Databases] [Containers] [AI/ML] ... |
+--------------------------------------------------------------------------------+
|                                                                                |
| +--------------------------------------------------------------------------+  |
| | [X] ALERTE CRITIQUE                                     [Voir details]  |  |
| |     2 instances en erreur sur Mon Projet Prod                           |  |
| +--------------------------------------------------------------------------+  |
|                                                                                |
|  Public Cloud                                        [+ Nouveau projet]        |
|                                                                                |
|  +----------------+    +----------------+    +----------------+                |
|  |       3        |    |    24/26       |    |     595E       |                |
|  |    Projets     |    |   Instances    |    |   Cout/mois    |                |
|  |                |    |   2 erreurs    |    |                |                |
|  +----------------+    +----------------+    +----------------+                |
|                                                                                |
|  Vos Projets                                                                   |
|  +----------------------------------------------------------------------+     |
|  | Nom                    | Region principale | Cout/mois   | Status   |     |
|  +------------------------+-------------------+-------------+----------+     |
|  | Mon Projet Prod        | GRA               | 450E        | 2 err    | ->  |
|  | Projet Dev             | SBG               | 120E        | OK       | ->  |
|  +----------------------------------------------------------------------+     |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## VARIANTE 04 : Modal Creer Projet
```
+--------------------------------------------------------------------------------+
| OVHcloud                    Public Cloud                          [xx-ovh]    |
+--------------------------------------------------------------------------------+
| [General*] [Projet] [Compute] [Storage] [Databases] [Containers] [AI/ML] ... |
+--------------------------------------------------------------------------------+
|                                                                                |
|     +----------------------------------------------------+                    |
|     |  Creer un nouveau projet                     [X]   |                    |
|     +----------------------------------------------------+                    |
|     |                                                    |                    |
|     |  Nom du projet *                                   |                    |
|     |  +----------------------------------------------+  |                    |
|     |  | Mon nouveau projet                           |  |                    |
|     |  +----------------------------------------------+  |                    |
|     |                                                    |                    |
|     |  Description (optionnel)                           |                    |
|     |  +----------------------------------------------+  |                    |
|     |  |                                              |  |                    |
|     |  |                                              |  |                    |
|     |  +----------------------------------------------+  |                    |
|     |                                                    |                    |
|     |                    [Annuler]  [Creer]              |                    |
|     +----------------------------------------------------+                    |
|                                                                                |
+--------------------------------------------------------------------------------+
```

---

## NOTES TECHNIQUES

### Layout specifique NAV2=General
- **FULL-WIDTH** : Pas de sidecar (LEFT PANEL)
- **PAGE PAR DEFAUT** : Affichee quand on arrive sur NAV1=Public Cloud
- **Contenu max-width** : 1200px
- **Margins horizontaux** : 24px
- **Gap vertical sections** : 24px

### Cards metriques (3 colonnes)
- **Projets** : Nombre total de projets actifs
- **Instances** : Nombre total (actives/total si erreurs)
- **Cout/mois** : Estimation cout mensuel en euros

### Table Projets
- **Colonnes** : Nom, Region principale, Cout/mois, Status, Navigation (->)
- **Tri par defaut** : Cout decroissant
- **Clic ligne** : Navigation vers NAV2=Projet avec projet selectionne

### Alertes
- **Position** : En bas de page (sauf critiques)
- **Alertes critiques** : Banniere rouge en haut du contenu
- **Types** : Info (bleu), Warning (orange), Critique (rouge)

### Rafraichissement
- **Metriques** : Toutes les 60 secondes
- **Alertes** : Toutes les 30 secondes
