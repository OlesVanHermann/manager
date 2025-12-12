# PATTERNS D'USAGE - NEW MANAGER
# Comment utiliser le design system

---

## PAGE STANDARD
```tsx
import { BaseLayout, Header, Breadcrumb } from '@ovh-ux/muk';

export const MyPage = () => (
  <BaseLayout>
    <Header>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Section', href: '/section' },
        { label: 'Page actuelle' }
      ]} />
      <h1>Titre de la page</h1>
    </Header>
    <main className="p-6">
      {/* Contenu */}
    </main>
  </BaseLayout>
);
```

---

## FORMULAIRE
```tsx
import { FormField, Input, Button, Message } from '@ovh-ux/muk';

export const MyForm = () => {
  const [error, setError] = useState('');

  return (
    <form className="space-y-4 max-w-md">
      {error && <Message type="error">{error}</Message>}
      
      <FormField label="Email" required error={errors.email}>
        <Input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <FormField label="Mot de passe" required>
        <Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <div className="flex gap-4">
        <Button variant="primary" type="submit">Valider</Button>
        <Button variant="secondary" type="button">Annuler</Button>
      </div>
    </form>
  );
};
```

---

## TABLEAU DE DONNÉES
```tsx
import { Datagrid, Badge, ActionMenu } from '@ovh-ux/muk';

const columns = [
  { id: 'name', header: 'Nom', accessorKey: 'name' },
  { id: 'status', header: 'Statut', cell: ({ row }) => (
    <Badge color={row.original.status === 'active' ? 'success' : 'neutral'}>
      {row.original.status}
    </Badge>
  )},
  { id: 'actions', header: '', cell: ({ row }) => (
    <ActionMenu items={[
      { label: 'Modifier', onClick: () => edit(row.original) },
      { label: 'Supprimer', onClick: () => del(row.original), variant: 'danger' },
    ]} />
  )},
];

export const MyTable = ({ data }) => (
  <Datagrid
    columns={columns}
    data={data}
    pagination={{ pageSize: 10 }}
  />
);
```

---

## MODAL DE CONFIRMATION
```tsx
import { DeleteModal } from '@ovh-ux/muk';

export const ConfirmDelete = ({ item, onConfirm, onCancel }) => (
  <DeleteModal
    open={true}
    heading={`Supprimer ${item.name} ?`}
    onConfirm={onConfirm}
    onCancel={onCancel}
  >
    Cette action est irréversible.
  </DeleteModal>
);
```

---

## CARTE D'INFORMATION
```tsx
import { Tile } from '@ovh-ux/muk';

export const InfoCard = ({ service }) => (
  <Tile.Root>
    <Tile.Item term="Nom">{service.name}</Tile.Item>
    <Tile.Item term="Statut">{service.status}</Tile.Item>
    <Tile.Item term="Créé le">{formatDate(service.createdAt)}</Tile.Item>
  </Tile.Root>
);
```

---

## ÉTATS DE CHARGEMENT
```tsx
import { Skeleton, Spinner } from '@ovh-ux/muk';

// Skeleton pour page
export const PageSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Spinner pour action
export const LoadingButton = ({ loading, children }) => (
  <Button disabled={loading}>
    {loading ? <Spinner size="sm" /> : children}
  </Button>
);
```

---

## MESSAGES / ALERTES
```tsx
import { Message, Notifications, useNotifications } from '@ovh-ux/muk';

// Message inline
<Message type="success">Opération réussie</Message>
<Message type="warning">Attention requise</Message>
<Message type="error">Une erreur est survenue</Message>
<Message type="info">Information importante</Message>

// Toast notifications
const { addNotification } = useNotifications();
addNotification({ type: 'success', message: 'Sauvegardé !' });
```

---

## CLASSES TAILWIND FRÉQUENTES
```
Container:     max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Card:          bg-white rounded-lg shadow-md p-6
Flex center:   flex items-center justify-center
Grid 3 cols:   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Stack:         flex flex-col space-y-4
Row:           flex flex-row space-x-4
Full height:   min-h-screen
```

---

FIN DES PATTERNS
