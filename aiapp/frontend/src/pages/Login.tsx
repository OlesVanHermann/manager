import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, isLoading, error } = useAuth();
  const [appKey, setAppKey] = useState("");
  const [appSecret, setAppSecret] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationUrl = await login(appKey, appSecret);
      window.location.href = validationUrl;
    } catch {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">New Manager</h1>
        <p className="text-gray-500 text-sm mb-6">Connectez-vous avec vos credentials OVH API</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Key</label>
            <input
              type="text"
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Votre Application Key"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Secret</label>
            <input
              type="password"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Votre Application Secret"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-gray-500 mb-2">Pas encore de credentials ?</p>
          <a href="https://eu.api.ovh.com/createApp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Creer une application sur eu.api.ovh.com</a>
        </div>
      </div>
    </div>
  );
}
