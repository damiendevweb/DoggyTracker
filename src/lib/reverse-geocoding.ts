export const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  )

  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  return {
    displayName: data.display_name,
    address: data.address,
  }
}