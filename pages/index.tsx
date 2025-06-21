import { useState } from 'react';

export default function Home() {
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#1a4e8a');
  const [platform, setPlatform] = useState('trustpilot');
  const [customLink, setCustomLink] = useState('');
  const [supportLink, setSupportLink] = useState('');

  const reviewLink = platform === 'custom' ? customLink : {
    trustpilot: 'https://www.trustpilot.com/evaluate',
    google: 'https://search.google.com/local/writereview',
    capterra: 'https://www.capterra.com/reviews',
    facebook: 'https://www.facebook.com'
  }[platform];

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">🎯 Configuration de votre widget Reputly</h1>

        <label className="block mt-4">Logo (URL):</label>
        <input
          type="url"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="https://..."
          className="w-full border p-2 rounded"
        />

        <label className="block mt-4">Couleur principale :</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 p-1 border rounded"
        />

        <label className="block mt-4">Plateforme d'avis :</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="trustpilot">Trustpilot</option>
          <option value="google">Google Reviews</option>
          <option value="capterra">Capterra</option>
          <option value="facebook">Facebook</option>
          <option value="custom">Autre (lien personnalisé)</option>
        </select>

        {platform === 'custom' && (
          <>
            <label className="block mt-2">Lien d'avis personnalisé :</label>
            <input
              type="url"
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value)}
              placeholder="https://..."
              className="w-full border p-2 rounded"
            />
          </>
        )}

        <label className="block mt-4">Lien de contact SAV :</label>
        <input
          type="url"
          value={supportLink}
          onChange={(e) => setSupportLink(e.target.value)}
          placeholder="https://..."
          className="w-full border p-2 rounded"
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">🔍 Aperçu du widget</h2>
          <div className="border rounded p-4 text-center" style={{ backgroundColor: '#f9f9f9' }}>
            {logo && <img src={logo} alt="Logo" className="h-12 mx-auto mb-2" />}
            <p className="font-medium mb-2">Comment évaluez-vous votre expérience ?</p>
            <div className="text-2xl" style={{ color }}>★ ★ ★ ★ ★</div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">📋 Code à intégrer</h2>
          <textarea
            className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
            rows={4}
            readOnly
            value={`<script src="https://cdn.reputly.app/widget.js"
  data-color="${color}"
  data-logo="${logo}"
  data-review="${reviewLink}"
  data-sav="${supportLink}"></script>`}
          />
        </div>
      </div>
    </main>
  );
}
