import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

type ProductImage = {
    id: string
    image_url: string
    image_alt: string | null
    sort_order: number
    is_primary: boolean
}

type Product = {
    id: string
    slug: string
    name: string
    description: string | null
    price_cents: number
    category: string | null
    stock: number | null
    is_active: boolean
    product_images: ProductImage[]
}

const formatPrice = (priceCents: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(priceCents / 100)

export const ProductPage = () => {
    const { slug } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToCart } = useCart()

    useEffect(() => {
        const getProduct = async () => {
            if (!slug) return

            setLoading(true)
            setError(null)

            const { data, error } = await supabase
                .from('products')
                .select(`
          id,
          slug,
          name,
          description,
          price_cents,
          category,
          stock,
          is_active,
          product_images (
            id,
            image_url,
            image_alt,
            sort_order,
            is_primary
          )
        `)
                .eq('slug', slug)
                .eq('is_active', true)
                .single()

            if (error) {
                console.error(error)
                setError('Impossible de charger ce produit.')
                setProduct(null)
            } else {
                setProduct(data)
            }

            setLoading(false)
        }

        getProduct()
    }, [slug])

    const sortedImages = useMemo(() => {
        if (!product?.product_images) return []
        return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)
    }, [product])

    if (loading) {
        return (
            <div className="px-4 py-16 text-center">
                <p className="text-gray-600">Chargement du produit...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-4 py-16 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="px-4 py-16 text-center">
                <p className="text-gray-600">Produit introuvable.</p>
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="space-y-4">
                        {sortedImages[0] && (
                            <img
                                src={sortedImages[0].image_url}
                                alt={sortedImages[0].image_alt || product.name}
                                className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
                            />
                        )}

                        {sortedImages.length > 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                {sortedImages.slice(1, 3).map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.image_url}
                                        alt={image.image_alt || product.name}
                                        className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-semibold text-gray-900">
                            {formatPrice(product.price_cents)}
                        </p>

                        {product.description && (
                            <div className="mt-6">
                                <p className="text-base leading-7 text-gray-600">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() =>
                                addToCart({
                                    id: product.id,
                                    slug: product.slug,
                                    name: product.name,
                                    price_cents: product.price_cents,
                                    image_url: sortedImages[0]?.image_url ?? null,
                                })
                            }
                            type="button"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-yellow-150 px-6 py-3 text-base font-medium text-white hover:bg-yellow-150/80 sm:w-auto"
                        >
                            Ajouter au panier
                        </button>

                        {typeof product.stock === 'number' && (
                            <p className="mt-4 text-sm text-gray-500">
                                {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}