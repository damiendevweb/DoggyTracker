type Props = {
    isFormValid: boolean
    isOutOfStock: boolean
    added: boolean
    onAddToCart: () => void
}

export const ProductActions = ({ isFormValid, isOutOfStock, added, onAddToCart }: Props) => {
    const disabled = !isFormValid || isOutOfStock

    return (
        <div className="flex flex-col gap-2 pt-2">
            <button
                onClick={onAddToCart}
                disabled={disabled}
                type="button"
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-semibold rounded transition-all ${
                    disabled
                        ? 'bg-bg-surface text-text-muted cursor-not-allowed border border-border'
                        : 'bg-accent text-bg hover:bg-accent-hover'
                }`}
            >
                {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
            </button>

            {isOutOfStock && (
                <p className="text-xs text-error font-medium text-center">Rupture de stock</p>
            )}
            {!isOutOfStock && !isFormValid && (
                <p className="text-xs text-text-muted text-center">Remplis le nom et le téléphone 1</p>
            )}
        </div>
    )
}
