type Props = {
    currentFont: { family: string }
    previewText: string
}

export const ProductMedalPreview = ({ currentFont, previewText }: Props) => {
    return (
        <div className="flex items-center justify-center gap-6">
            <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                <MedalBase />
                <div className="relative text-center px-3" style={{ fontFamily: currentFont.family }}>
                    {previewText.split('\n').map((line, i) => (
                        <p key={i} className={`text-text-primary ${i === 0 ? 'text-sm font-bold' : 'text-xs'}`}>
                            {line}
                        </p>
                    ))}
                </div>
            </div>
            <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                <MedalBase />
                <img
                    src="https://izugqskkkniyybedqoem.supabase.co/storage/v1/object/public/qr-code/qr-ZCRBZ.png"
                    alt="QR code de la médaille"
                    className="relative w-24 h-24 mix-blend-multiply"
                />
            </div>
        </div>
    )
}

const MedalBase = () => (
    <>
        <div className="absolute inset-0 rounded-full bg-bg-surface border-[3px] border-border" />
        <div className="absolute inset-1.5 rounded-full bg-bg-elevated" />
    </>
)
