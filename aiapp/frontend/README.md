# 📦 Défactorisation Module Emails

## Contenu
- `run-defacto.sh` : Script principal de défactorisation
- `rollback.sh` : Script de rollback en cas d'erreur

## Installation

```bash
# 1. Uploader le tar sur le serveur
scp defacto-emails.tar user@server:/tmp/

# 2. Sur le serveur
cd /home/ubuntu/aiapp/frontend
tar -xvf /tmp/defacto-emails.tar

# 3. Exécuter
chmod +x run-defacto.sh rollback.sh
./run-defacto.sh
```

## Ce que fait le script

### Phase 1 : Création des services de page
Crée les fichiers `*Page.service.ts` pour chaque module :
- `emails/emailsPage.service.ts`
- `emails/email-domain/emailDomainPage.service.ts`
- `emails/email-pro/emailProPage.service.ts`
- `emails/exchange/exchangePage.service.ts`
- `emails/office/officePage.service.ts`
- `emails/zimbra/zimbraPage.service.ts`

### Phase 2 : Mise à jour des index.tsx
Met à jour tous les `index.tsx` pour utiliser les services locaux au lieu des services monolithiques.

### Phase 3 : Vérification
Vérifie qu'aucun import de service monolithique ne reste.

### Phase 4 : Nettoyage
Supprime les services monolithiques (avec backup) :
- `src/services/web-cloud.email-domain.ts`
- `src/services/web-cloud.email-pro.ts`
- `src/services/web-cloud.exchange.ts`
- `src/services/web-cloud.office.ts`
- `src/services/web-cloud.zimbra.ts`

### Phase 5 : Build
Lance `npm run build:dev` pour vérifier.

## Rollback

En cas d'erreur :
```bash
./rollback.sh
npm run build:dev
```

## Backups créés
- Services monolithiques : `src/services/backup.YYYYMMDDTHHMMSS/`
- index.tsx : `*.tsx.YYYYMMDDTHHMMSS`
