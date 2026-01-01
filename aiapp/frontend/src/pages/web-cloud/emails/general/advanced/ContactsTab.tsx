// ============================================================
// SUB-TAB - Contacts (Contacts partagés / Carnet d'adresses)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ContactsTabProps {
  domain?: string;
}

interface SharedContact {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  company?: string;
  department?: string;
  folder: string;
  createdAt: string;
}

interface ContactFolder {
  id: string;
  name: string;
  contactCount: number;
  shared: boolean;
}

/** Sous-onglet Contacts - Gestion des contacts partagés. */
export default function ContactsTab({ domain }: ContactsTabProps) {
  const { t } = useTranslation("web-cloud/emails/advanced");

  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  // Mock data - remplacer par appel API
  const folders: ContactFolder[] = useMemo(() => [
    { id: "all", name: "Tous les contacts", contactCount: 156, shared: false },
    { id: "global", name: "Carnet global", contactCount: 89, shared: true },
    { id: "clients", name: "Clients", contactCount: 45, shared: true },
    { id: "fournisseurs", name: "Fournisseurs", contactCount: 22, shared: true },
  ], []);

  const contacts: SharedContact[] = useMemo(() => [
    {
      id: "1",
      displayName: "Jean Dupont",
      email: "jean.dupont@client.com",
      phone: "+33 6 12 34 56 78",
      company: "Client SA",
      department: "Direction",
      folder: "clients",
      createdAt: "2023-06-01T00:00:00Z",
    },
    {
      id: "2",
      displayName: "Marie Martin",
      email: "m.martin@fournisseur.fr",
      phone: "+33 1 23 45 67 89",
      company: "Fournisseur SARL",
      department: "Commercial",
      folder: "fournisseurs",
      createdAt: "2023-08-15T00:00:00Z",
    },
    {
      id: "3",
      displayName: "Pierre Bernard",
      email: "p.bernard@partner.com",
      company: "Partner Inc",
      folder: "global",
      createdAt: "2024-01-10T00:00:00Z",
    },
  ], []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (selectedFolder !== "all" && c.folder !== selectedFolder) {
        return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          c.displayName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.company?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [contacts, selectedFolder, search]);

  const handleCreateContact = () => {
  };

  const handleCreateFolder = () => {
  };

  const handleEditContact = (contact: SharedContact) => {
  };

  const handleDeleteContact = (contact: SharedContact) => {
  };

  const handleImport = () => {
  };

  const handleExport = () => {
  };

  return (
    <div className="contacts-tab">
      <div className="contacts-layout">
        {/* Sidebar with folders */}
        <div className="contacts-sidebar">
          <div className="sidebar-header">
            <h4>{t("contacts.folders.title")}</h4>
            <button className="btn btn-sm btn-outline" onClick={handleCreateFolder}>
              +
            </button>
          </div>
          <ul className="folders-list">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className={`folder-item ${selectedFolder === folder.id ? "active" : ""}`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <span className="folder-icon">{folder.shared ? "👥" : "📁"}</span>
                <span className="folder-name">{folder.name}</span>
                <span className="folder-count">{folder.contactCount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="contacts-main">
          {/* Toolbar */}
          <div className="emails-toolbar">
            <div className="emails-toolbar-left">
              <button className="btn btn-primary" onClick={handleCreateContact}>
                + {t("contacts.actions.create")}
              </button>
              <button className="btn btn-outline" onClick={handleImport}>
                ↓ {t("contacts.actions.import")}
              </button>
              <button className="btn btn-outline" onClick={handleExport}>
                ↑ {t("contacts.actions.export")}
              </button>
            </div>
            <div className="emails-toolbar-right">
              <input
                type="text"
                className="filter-input"
                placeholder={t("contacts.filters.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Contacts list */}
          {filteredContacts.length === 0 ? (
            <div className="emails-empty">
              <div className="emails-empty-icon">👤</div>
              <h3 className="emails-empty-title">{t("contacts.empty.title")}</h3>
              <p className="emails-empty-text">{t("contacts.empty.description")}</p>
              <button className="btn btn-primary" onClick={handleCreateContact}>
                + {t("contacts.actions.create")}
              </button>
            </div>
          ) : (
            <table className="emails-table">
              <thead>
                <tr>
                  <th>{t("contacts.table.name")}</th>
                  <th>{t("contacts.table.email")}</th>
                  <th>{t("contacts.table.phone")}</th>
                  <th>{t("contacts.table.company")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <div className="contact-name">
                        <span className="contact-avatar">
                          {contact.displayName.charAt(0).toUpperCase()}
                        </span>
                        <span className="contact-display-name">{contact.displayName}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${contact.email}`} className="contact-email">
                        {contact.email}
                      </a>
                    </td>
                    <td>
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="contact-phone">
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="contact-company">
                        <span>{contact.company || "-"}</span>
                        {contact.department && (
                          <span className="contact-department">{contact.department}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn"
                          title={t("contacts.actions.edit")}
                          onClick={() => handleEditContact(contact)}
                        >
                          ✎
                        </button>
                        <button
                          className="action-btn danger"
                          title={t("contacts.actions.delete")}
                          onClick={() => handleDeleteContact(contact)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
