import { useDoggyQR } from '../hooks/useDoggyQR'

export const GenerateQR = () => {
  const { randomId, storageUrl, generateNewQR, loading } = useDoggyQR();

  return (
    <section className="p-6 bg-bg-elevated border border-border rounded">
      <h3 className="font-unbounded text-lg font-bold mb-4 text-center text-text-primary">Générateur de QR</h3>
      <button
        onClick={generateNewQR}
        disabled={loading}
        className="block m-auto bg-accent hover:bg-accent-hover text-bg py-2.5 px-6 rounded font-semibold mb-4 transition-all disabled:opacity-50 text-sm"
      >
        {loading ? 'Génération...' : 'Générer nouveau QR'}
      </button>

      {randomId && (
        <div className="mb-6">
          {storageUrl ? (
            <>
              <img src={storageUrl} alt="QR Code" className="w-64 h-64 mx-auto border border-border rounded mb-4 block" />
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-success bg-success/10 px-4 py-2 rounded border border-success/20">
                  {randomId}
                </span>
              </div>
            </>
          ) : (
            <div className="w-64 h-64 bg-bg-surface rounded mx-auto flex items-center justify-center text-text-muted border border-border">
              Aucun QR généré
            </div>
          )}
        </div>
      )}
    </section>
  )
}
