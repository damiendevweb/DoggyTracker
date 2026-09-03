export type ReverseGeocodeResult = {
  displayName: string
  shortAddress: string
  address: {
    houseNumber: string | null
    road: string | null
    suburb: string | null
    city: string | null
    postcode: string | null
    county: string | null
    state: string | null
    country: string | null
    countryCode: string | null
  }
}

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`
  )

  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const addr = data.address ?? {}

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.hamlet ||
    null

  const line1 = [addr.house_number, addr.road].filter(Boolean).join(' ').trim()
  const line2 = [addr.postcode, city].filter(Boolean).join(' ').trim()

  const shortAddress = [line1, line2].filter(Boolean).join(', ').trim()

  return {
    displayName: data.display_name ?? '',
    shortAddress,
    address: {
      houseNumber: addr.house_number ?? null,
      road: addr.road ?? null,
      suburb: addr.suburb ?? null,
      city,
      postcode: addr.postcode ?? null,
      county: addr.county ?? null,
      state: addr.state ?? null,
      country: addr.country ?? null,
      countryCode: addr.country_code ?? null,
    },
  }
}