import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="mb-8">
          <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            DoggyTracker
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Suivi animal en 1 scan. 
            <br className="md:hidden" />
            <span className="font-semibold text-blue-600">QR Code → Infos instantanées</span>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md mx-auto mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl">
            <div className="w-16 h-16 bg-linear-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">📱</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Scanner QR</h3>
              <p className="text-gray-600">Fiche complète en 1s</p>
            </div>
          </div>
          <Link
            to="/login"
            className="w-full block bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center"
          >
            🚀 Commencer
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-left p-8 bg-white/70 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🐕</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Fiche complète</h3>
            <p className="text-gray-600">Santé, vaccins, comportement</p>
          </div>
          <div className="text-left p-8 bg-white/70 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Instantané</h3>
            <p className="text-gray-600">Scan → données (0 attente)</p>
          </div>
          <div className="text-left p-8 bg-white/70 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Sécurisé</h3>
            <p className="text-gray-600">Supabase + auth pro</p>
          </div>
        </div>
      </section>
    </div>
  )
}
