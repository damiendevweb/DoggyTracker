import { useState, useCallback } from 'react'

interface GeoState {
  loading: boolean
  latitude?: number
  longitude?: number
  error?: string
}

type GeoResult = { latitude: number; longitude: number } | null

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ loading: false })

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Géo non supportée' })
      return
    }

    setState({ loading: true })
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        setState({ 
          loading: false, 
          error: `Refus: ${error.message}` 
        })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const getLocationPromise = useCallback((timeoutMs = 8000): Promise<GeoResult> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      let settled = false

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true
          resolve(null)
        }
      }, timeoutMs)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!settled) {
            settled = true
            clearTimeout(timer)
            setState({
              loading: false,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          }
        },
        () => {
          if (!settled) {
            settled = true
            clearTimeout(timer)
            setState((prev) => ({ ...prev, loading: false, error: 'Géolocalisation refusée' }))
            resolve(null)
          }
        },
        { enableHighAccuracy: true, timeout: timeoutMs }
      )
    })
  }, [])

  return { ...state, getLocation, getLocationPromise }
}
