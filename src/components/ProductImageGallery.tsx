import type { ProductImage } from '../lib/product.types'

type Props = {
    images: ProductImage[]
    productName: string
}

export const ProductImageGallery = ({ images, productName }: Props) => {
    const [main, ...thumbs] = images

    return (
        <div className="space-y-2 lg:sticky lg:top-24">
            {main && (
                <img
                    src={main.image_url}
                    alt={main.image_alt || productName}
                    className="aspect-square w-full object-cover rounded"
                />
            )}

            {thumbs.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {thumbs.map((image) => (
                        <img
                            key={image.id}
                            src={image.image_url}
                            alt={image.image_alt || productName}
                            className="aspect-square w-full object-cover rounded"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
