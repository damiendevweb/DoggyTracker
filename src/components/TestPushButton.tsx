import { supabase } from '../lib/supabase'

export default function TestPushButton() {
  const sendTestPush = async () => {
    const { data, error } = await supabase.functions.invoke('push-notification', {
      body: { body: 'Notification de test depuis l\'interface DoggyTracker.' },
    })

    if (error) {
      const detail = data ? '\n' + JSON.stringify(data) : ''
      const context = error.context ? '\n' + JSON.stringify(error.context) : ''
      alert(`Erreur ${error.status || ''}: ${error.message}${detail}${context}`)
    } else {
      alert(`Notification envoyée ! (${data?.sent || 0} appareil(s))`)
    }
  }

  return (
    <button
      type="button"
      onClick={sendTestPush}
      className="rounded bg-accent/10 border border-accent/20 px-4 py-2 text-accent font-medium hover:bg-accent/20 transition-colors text-sm"
    >
      Envoyer une push test
    </button>
  )
}
