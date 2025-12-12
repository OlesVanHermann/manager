# COMPOSANTS UI - NEW MANAGER
# Source: @ovh-ux/muk (Manager UI Kit)

## IMPORT
```tsx
import { Button, Modal, Datagrid } from '@ovh-ux/muk';
```

---

## LAYOUT

| Composant | Usage |
|-----------|-------|
| BaseLayout | Layout principal avec header |
| Header | En-tête de page |
| GridLayout | Grille responsive |
| OnboardingLayout | Page d'accueil vide |
| Divider | Séparateur horizontal |

---

## NAVIGATION

| Composant | Usage |
|-----------|-------|
| Breadcrumb | Fil d'Ariane |
| Tabs, Tab, TabList, TabContent | Système d'onglets |
| Link | Lien stylisé |
| LinkCard | Carte cliquable |
| GuideMenu | Menu d'aide/guides |
| ChangelogMenu | Menu changelog |

---

## ACTIONS

| Composant | Usage |
|-----------|-------|
| Button | Bouton (primary, secondary, ghost, danger) |
| ActionMenu | Menu dropdown d'actions |
| ActionBanner | Bannière avec CTA |

---

## FORMULAIRES

| Composant | Usage |
|-----------|-------|
| Input | Champ texte |
| Textarea | Zone de texte multi-lignes |
| Select | Liste déroulante |
| Checkbox, CheckboxGroup | Cases à cocher |
| RadioGroup, Radio | Boutons radio |
| Toggle | Interrupteur on/off |
| Switch | Switch multi-options |
| Range | Slider |
| Quantity | Input numérique avec +/- |
| Datepicker | Sélecteur de date |
| Timepicker | Sélecteur d'heure |
| PhoneNumber | Numéro de téléphone |
| Password | Mot de passe avec force |
| FileUpload | Upload fichier |
| Combobox | Select avec recherche |
| FormField | Wrapper label + input + error |
| FormFieldLabel | Label |
| FormFieldError | Message d'erreur |
| FormFieldHelper | Texte d'aide |

---

## DATA DISPLAY

| Composant | Usage |
|-----------|-------|
| Datagrid | Tableau avec tri, pagination, filtres |
| Table | Tableau simple |
| Tile | Tuile d'information |
| Badge | Badge/Tag coloré |
| Tag | Tag simple |
| TagsList | Liste de tags |
| ServiceStateBadge | Badge d'état de service |
| Price | Affichage de prix formaté |
| Code | Bloc de code |
| Clipboard | Copier dans le presse-papier |
| Medium | Affichage média (image/vidéo) |
| Text | Texte stylisé |
| Icon | Icône |
| TreeView | Arborescence |

---

## FEEDBACK

| Composant | Usage |
|-----------|-------|
| Modal | Fenêtre modale |
| DeleteModal | Modal de confirmation suppression |
| UpdateNameModal | Modal de renommage |
| Drawer | Panneau latéral |
| Message | Message inline (info, success, warning, error) |
| Notifications | Système de notifications toast |
| Spinner | Indicateur de chargement |
| Skeleton | Placeholder de chargement |
| Progress | Barre de progression |
| Error | Affichage d'erreur |
| ErrorBoundary | Capture d'erreurs React |

---

## OVERLAYS

| Composant | Usage |
|-----------|-------|
| Popover | Bulle contextuelle |
| Tooltip | Info-bulle |
| Accordion | Accordéon dépliable |

---

## HOOKS DISPONIBLES

| Hook | Usage |
|------|-------|
| useMe | Infos utilisateur (/me) |
| useOvhIam | Permissions IAM |
| useDataApi | Appels API paginés |
| useFormatDate | Formatage dates i18n |
| useDateFnsLocale | Locale date-fns |
| useBytes | Formatage tailles (Ko, Mo) |
| useAllCountries | Liste pays |
| useAllLocationsByType | Datacenters |
| useCatalogPrice | Prix catalogue |
| useNotifications | Gestion notifications |
| useTranslatedMicroRegions | Régions OVH |
