import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProduct'
import { FONTS, formatPrice, validatePhone } from '../lib/product.types'
import { ProductImageGallery } from '../components/ProductImageGallery'
import { ProductMedalPreview } from '../components/ProductMedalPreview'
import { ProductCustomization } from '../components/ProductCustomization'
import { ProductAccordion } from '../components/ProductAccordion'
import { ProductActions } from '../components/ProductActions'

export const ProductPage = () => {
    const { slug } = useParams()
    const { product, loading, error, sortedImages } = useProduct(slug)
    const { addToCart } = useCart()

    const [petName, setPetName] = useState('')
    const [phone1, setPhone1] = useState('')
    const [phone2, setPhone2] = useState('')
    const [phone1Error, setPhone1Error] = useState('')
    const [phone2Error, setPhone2Error] = useState('')
    const [selectedFont, setSelectedFont] = useState(FONTS[0].value)
    const [added, setAdded] = useState(false)

    const isFormValid = petName.trim() !== '' && phone1.trim() !== '' && !phone1Error && !phone2Error
    const isOutOfStock = product?.stock !== null && product?.stock !== undefined && product.stock <= 0

    const handleAddToCart = () => {
        if (!product || !isFormValid || isOutOfStock) return
        addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price_cents: product.price_cents,
            image_url: sortedImages[0]?.image_url ?? null,
            customization: {
                petName: petName.trim(),
                phone1: phone1.trim(),
                phone2: phone2.trim(),
                font: selectedFont,
            },
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const previewText = petName
        ? `${petName}\n${phone1 || '06 01 02 03 04'}${phone2 ? `\n${phone2}` : ''}`
        : 'Médor\n06 01 02 03 04\n06 05 06 07 08'

    const currentFont = FONTS.find(f => f.value === selectedFont)!

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <p className="text-sm text-text-muted">Chargement...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <p className="text-sm text-error">{error}</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <p className="text-sm text-text-muted">Produit introuvable.</p>
            </div>
        )
    }

    const accordionItems = [
        ...(product.description
            ? [{ name: 'description', label: 'Description', content: <p className="text-sm text-text-secondary">{product.description}</p> }]
            : []),
        {
            name: 'caracteristiques',
            label: 'Caractéristiques',
            content: (
                <div className="space-y-px bg-border rounded overflow-hidden">
                    {[
                        { label: 'Marque', value: 'Parfs' },
                        { label: 'Collection', value: '2022' },
                        { label: 'Référence', value: 'G480745' },
                        { label: 'Matériau', value: 'Acier inoxydable' },
                        { label: 'Diamètre', value: '30 mm' },
                    ].map((row) => (
                        <div key={row.label} className="bg-bg-elevated grid grid-cols-2 gap-4 px-4 py-2.5">
                            <span className="text-xs text-text-muted">{row.label}</span>
                            <span className="text-xs text-text-primary font-medium text-right">{row.value}</span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            name: 'paiement',
            label: 'Paiement & livraison',
            content: (
                <div className="space-y-2 text-xs text-text-secondary">
                    <p>Paiement sécurisé par carte bancaire (Stripe).</p>
                    <p>Livraison offerte en France métropolitaine sous 5-7 jours ouvrés.</p>
                </div>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-6xl mx-auto px-5 py-10">
                <div className="lg:grid lg:gap-10 lg:grid-cols-2 lg:items-start">
                    <ProductImageGallery images={sortedImages} productName={product.name} />

                    <div className="flex flex-col gap-6 mt-8 lg:mt-0">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Médaille connectée</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                            <h1 className="text-2xl md:text-3xl text-text-primary" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                {product.name}
                            </h1>
                            <p className="mt-2 text-lg font-bold text-accent">
                                {formatPrice(product.price_cents)}
                            </p>
                            {product.description && (
                                <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-md">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        <ProductCustomization
                            petName={petName}
                            phone1={phone1}
                            phone2={phone2}
                            phone1Error={phone1Error}
                            phone2Error={phone2Error}
                            selectedFont={selectedFont}
                            onPetNameChange={setPetName}
                            onPhone1Change={(v) => { setPhone1(v); setPhone1Error(validatePhone(v)) }}
                            onPhone2Change={(v) => { setPhone2(v); setPhone2Error(validatePhone(v)) }}
                            onFontChange={setSelectedFont}
                        />

                        <ProductMedalPreview currentFont={currentFont} previewText={previewText} />

                        <ProductActions
                            isFormValid={isFormValid}
                            isOutOfStock={isOutOfStock}
                            added={added}
                            onAddToCart={handleAddToCart}
                        />

                        <ProductAccordion items={accordionItems} />
                    </div>
                </div>
            </div>

            {/* QR Code section */}
            <section className="bg-bg-elevated border-y border-border py-20">
                <div className="max-w-4xl mx-auto px-5 text-center">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Technologie</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Un QR Code, des retrouvailles
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-xl mx-auto mb-10">
                        Au cœur de ce médaillon, un QR code unique, prêt à transmettre l'identité de votre animal.
                    </p>
                    <div className="bg-bg-surface border border-border p-8 inline-flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-48 h-48">
                            <img
                                src="https://izugqskkkniyybedqoem.supabase.co/storage/v1/object/public/qr-code/qr-ZCRBZ.png"
                                alt="QR code médaillon"
                                className="relative w-32 h-32 mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
