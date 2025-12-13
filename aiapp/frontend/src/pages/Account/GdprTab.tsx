export default function GdprTab() {
  return (
    <div className="tab-content gdpr-tab">
      {/* Delete Account Section */}
      <div className="gdpr-delete-section">
        <h2>Supprimer mon compte OVHcloud</h2>
        <p className="delete-warning">
          <strong>
            Si vous choisissez de supprimer votre compte, vous ne pourrez plus le réactiver. 
            Nous procéderons à la suppression de votre compte après la confirmation.
          </strong>
        </p>
        <p className="delete-info">
          Conformément à notre politique d'utilisation des données, certaines des données 
          (notamment logs de connexion, données comptables et financières, etc.) resterons 
          dans nos bases de données afin de nous conformer à nos obligations légales et 
          faire valoir nos droits, et ce, conformément à la réglementation en vigueur.
        </p>
        
        <a 
          href="https://www.ovh.com/manager/#/useraccount/gdpr"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Supprimer mon compte
        </a>
      </div>

      {/* Requests Table Section */}
      <div className="gdpr-requests-section">
        <h3>Vos demandes</h3>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Demande</th>
                <th>Statut</th>
                <th>Ticket support</th>
                <th>Raison</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="empty-cell">
                  Aucun résultat
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
