import "./styles.css";

export default function CarbonPage() {
  return (
    <div className="carbon-page">
      <div className="page-header">
        <h1>Mon empreinte carbone</h1>
        <p className="page-description">Retrouvez et téléchargez l'analyse des émissions des gaz à effet de serre de votre infrastructure. Suivez l'impact environnemental lié à la fabrication, à la consommation énergétique et aux opérations annexes de vos services Cloud.</p>
      </div>

      <div className="carbon-section">
        <h2>Quelle est la composition du bilan carbone d'OVHcloud ?</h2>
        <p>OVHcloud inclut l'ensemble des sources émettrices de CO2eq, données fournies par la formule :</p>
        
        <div className="carbon-formula">
          <div className="formula-item">
            <div className="formula-icon">🏭</div>
            <span>Fabrication</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚡</div>
            <span>Électricité</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚙️</div>
            <span>Opérations</span>
          </div>
          <span className="formula-operator">=</span>
          <div className="formula-item result">
            <div className="formula-icon">🌍</div>
            <span>Émissions de gaz à effet de serre</span>
          </div>
        </div>
      </div>

      <div className="carbon-section">
        <p>Ce document comprend les émissions de gaz à effet de serre du mois précédent :</p>
        <ul className="carbon-list">
          <li>de vos services <strong>infrastructure Baremetal</strong></li>
          <li>de vos services <strong>Hosted Private Cloud</strong></li>
          <li>de vos services <strong>Public Cloud</strong></li>
        </ul>
        <p>dont vous êtes le <strong>contact facturation</strong></p>
      </div>

      <div className="carbon-actions">
        <a href="https://www.ovh.com/manager/#/dedicated/carbon-calculator" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Télécharger mon empreinte de novembre 2025
        </a>
      </div>
    </div>
  );
}
