import { supabase } from '../lib/supabase'

export default function TestPushButton() {
  const sendTestPush = async () => {
    const { data, error } = await supabase.functions.invoke('push-notification', {
      body: {}
    })

        console.log('Function data:', data)
    console.log('Function error:', error)

    if (error) {
      console.error(error)
      alert('Erreur envoi push')
      return
    }

    alert('Push envoyée')
  }

  return (
    <button
      onClick={sendTestPush}
      className="rounded-xl bg-black px-4 py-2 text-white"
    >
      Envoyer une push test
    </button>
  )
}