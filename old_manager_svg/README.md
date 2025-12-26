# OVH Old Manager SVG Mockups - Extended Set

Complete set of **59 SVG mockups** representing the OVH Manager old interface for migration reference.

## Design System
- **Header**: #000E9C (OVH Blue)
- **Primary**: #0050D7
- **Success**: #10B981 / #D1FAE5
- **Warning**: #F59E0B / #FEF3C7
- **Danger**: #DC2626
- **Background**: #F9FAFB
- **Typography**: Source Sans Pro

---

## Module: Bare-Metal / NAS-HA (18 files)

### Pages
| File | Description |
|------|-------------|
| `old_manager.bare-metal.nasha.svg` | Dashboard with 6 tiles |
| `old_manager.bare-metal.nasha.list.svg` | NAS-HA service list |
| `old_manager.bare-metal.nasha.onboarding.svg` | Empty state / first visit |
| `old_manager.bare-metal.nasha.partition-detail.svg` | Partition detail view |

### Tabs
| File | Description |
|------|-------------|
| `old_manager.bare-metal.nasha.tab-partitions.svg` | Partitions datagrid + **ActionMenu OPEN** |
| `old_manager.bare-metal.nasha.tab-snapshots.svg` | Snapshots management |
| `old_manager.bare-metal.nasha.tab-acl.svg` | ACL / Access control |
| `old_manager.bare-metal.nasha.tab-tasks.svg` | Tasks history |

### Modals
| File | Description |
|------|-------------|
| `modal-create-partition.svg` | Create partition form |
| `modal-delete-partition.svg` | Delete partition confirmation |
| `modal-edit-size.svg` | Resize partition |
| `modal-zfs-options.svg` | ZFS options (Sync, Atime, Recordsize) |
| `modal-add-access.svg` | Add IP access |
| `modal-delete-access.svg` | Delete IP access |
| `modal-create-snapshot.svg` | Create manual snapshot |
| `modal-delete-snapshot.svg` | Delete snapshot |
| `modal-edit-description.svg` | Edit partition description |
| `modal-snapshot-policy.svg` | Snapshot policy config |

---

## Module: Bare-Metal / Dedicated Server (21 files)

### Pages
| File | Description |
|------|-------------|
| `old_manager.bare-metal.dedicated.svg` | Dashboard with 6 tiles |
| `old_manager.bare-metal.dedicated.list.svg` | Server list with search/filter |

### Tabs
| File | Description |
|------|-------------|
| `tab-network-interfaces.svg` | Network interfaces + **ActionMenu OPEN** |
| `tab-ipmi.svg` | IPMI (KVM, SoL, Tests) |
| `tab-ftp-backup.svg` | Backup storage FTP |
| `tab-secondary-dns.svg` | Secondary DNS zones |
| `tab-tasks.svg` | Tasks history with status chips |
| `tab-interventions.svg` | Datacenter interventions |
| `tab-statistics.svg` | Bandwidth statistics with chart |

### Modals
| File | Description |
|------|-------------|
| `modal-reboot.svg` | Reboot options (soft/hard/power cycle) |
| `modal-netboot.svg` | Boot mode config (HDD/Rescue/iPXE) |
| `modal-reinstall.svg` | OS reinstallation wizard |
| `modal-monitoring.svg` | Monitoring toggle |
| `modal-terminate.svg` | Server termination |
| `modal-reverse-dns.svg` | Reverse DNS edit |
| `modal-vrack.svg` | vRack attachment |
| `modal-rename.svg` | Rename display name |
| `modal-ola.svg` | OLA network aggregation |
| `modal-add-backup-access.svg` | Add backup FTP access |
| `modal-add-secondary-dns.svg` | Add secondary DNS domain |
| `modal-change-backup-password.svg` | Change FTP password |

---

## Module: Web / Hosting (8 files)

### Pages & Tabs
| File | Description |
|------|-------------|
| `old_manager.web.hosting.svg` | Dashboard with 6 tiles |
| `old_manager.web.hosting.tab-multisite.svg` | Multisite management + **ActionMenu OPEN** |
| `old_manager.web.hosting.tab-ftp.svg` | FTP/SSH users |
| `old_manager.web.hosting.tab-database.svg` | Database management |

### Modals
| File | Description |
|------|-------------|
| `modal-add-multisite.svg` | Add domain/subdomain |
| `modal-create-ftp.svg` | Create FTP user |
| `modal-create-database.svg` | Create MySQL database |

---

## Module: Web / Domain (4 files)

### Pages & Tabs
| File | Description |
|------|-------------|
| `old_manager.web.domain.svg` | Domain dashboard |
| `old_manager.web.domain.tab-dns-zone.svg` | DNS zone editor (colored record types) |
| `old_manager.web.domain.list.svg` | Domain list view |

### Modals
| File | Description |
|------|-------------|
| `modal-add-dns.svg` | Add DNS record |

---

## Module: Web / Email (3 files)

### Pages & Tabs
| File | Description |
|------|-------------|
| `old_manager.web.email.svg` | Email Pro dashboard |
| `old_manager.web.email.tab-accounts.svg` | Email accounts + **ActionMenu OPEN** |

### Modals
| File | Description |
|------|-------------|
| `modal-create-account.svg` | Create email account |

---

## Module: Billing (2 files)

| File | Description |
|------|-------------|
| `old_manager.billing.svg` | Billing dashboard (balance, invoices) |
| `old_manager.billing.services.svg` | Services list with renewal status |

---

## UI Components Demonstrated

### Navigation
- Header with OVHcloud branding
- Sidebar with active state highlighting
- Breadcrumb navigation
- Tab navigation with active indicator

### Data Display
- Datagrid with sortable headers
- Status chips (success/warning/error/in-progress)
- Progress bars
- Tile cards with key/value pairs
- Statistics charts

### Interactive Elements
- **ActionMenu** (dropdown with actions) - shown OPEN state
- Radio buttons (selected/unselected)
- Checkboxes (checked/unchecked)
- Toggle switches (on/off)
- Input fields with placeholders
- Dropdown selects
- Primary/Secondary/Danger buttons

### Feedback
- Info banners (blue)
- Warning banners (yellow)
- Danger banners (red)
- Modal overlays with backdrop

---

## Usage for Migration

These mockups serve as visual reference for:
1. **Component mapping**: Identify OVH design system equivalents
2. **Layout structure**: Understand page hierarchy and flow
3. **State management**: See all interactive states
4. **i18n extraction**: French labels for translation keys
5. **API correlation**: Match UI to API endpoints

Generated: 2024-12-26
Total: 59 SVG files
