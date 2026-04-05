import { useDoggyQR } from '../hooks/useDoggyQR'

export const GenerateQR = () => {
  const { randomId, storageUrl, generateNewQR, loading } = useDoggyQR();

  return (
    <section className="p-6 bg-white rounded-2xl shadow-2xl ">
      <h3 className="text-xl font-bold mb-4 text-center">🐕 Générateur Doggy QR</h3>
      <button
        onClick={generateNewQR}
        disabled={loading}
        className="block m-auto bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold mb-4 transition-all disabled:opacity-50"
      >
        {loading ? '⏳ Génération...' : '🎲 Générer nouveau QR'}
      </button>

      {randomId && (
        <div className="mb-6">
          {storageUrl ? (
            <>
              <img src={storageUrl} alt="QR Code" className="w-72 h-72 mx-auto shadow-2xl rounded-2xl mb-4 block" />
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-mono font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
                  {randomId}
                </span>
              </div>
            </>
          ) : (
            <div className="w-72 h-72 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center text-gray-400">
              Aucun QR généré
            </div>
          )}
        </div>
      )}
    </section>
  )

}