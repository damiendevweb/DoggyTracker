import { useEffect, useState } from 'react'

interface Address {
  display_name: string
  road?: string
  city?: string
  postcode?: string
  country?: string
}

export function useAddress(lat: number, lng: number) {
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(!lat || !lng ? false : true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!lat || !lng) return

    let cancelled = false

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`)
      .then(res => res.json())
      .then((data: Address) => {
        if (!cancelled) {
          setAddress(data)
          setError('')
        }
      })
      .catch(() => { if (!cancelled) setError('Adresse indisponible') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [lat, lng])

  return { address, loading, error }
}
