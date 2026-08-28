import { FONTS } from '../lib/product.types'

type Props = {
    petName: string
    phone1: string
    phone2: string
    phone1Error: string
    phone2Error: string
    selectedFont: string
    onPetNameChange: (v: string) => void
    onPhone1Change: (v: string) => void
    onPhone2Change: (v: string) => void
    onFontChange: (v: string) => void
}

export const ProductCustomization = ({
    petName, phone1, phone2, phone1Error, phone2Error, selectedFont,
    onPetNameChange, onPhone1Change, onPhone2Change, onFontChange,
}: Props) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Personnalisation</span>
                <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-4">
                <Field label="Nom de l'animal *">
                    <input
                        type="text"
                        value={petName}
                        onChange={e => onPetNameChange(e.target.value)}
                        placeholder="ex: Médor"
                        className="w-full px-3 py-2 rounded border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-0 placeholder:text-text-muted"
                    />
                </Field>

                <Field label="Téléphone 1 *" error={phone1Error}>
                    <input
                        type="tel"
                        value={phone1}
                        onChange={e => onPhone1Change(e.target.value)}
                        placeholder="06 01 02 03 04"
                        className={`w-full px-3 py-2 rounded border focus:ring-0 bg-bg-surface text-text-primary text-sm ${
                            phone1Error ? 'border-error' : 'border-border focus:border-accent'
                        }`}
                    />
                </Field>

                <Field label="Téléphone 2 (optionnel)" error={phone2Error}>
                    <input
                        type="tel"
                        value={phone2}
                        onChange={e => onPhone2Change(e.target.value)}
                        placeholder="06 05 06 07 08"
                        className={`w-full px-3 py-2 rounded border focus:ring-0 bg-bg-surface text-text-primary text-sm ${
                            phone2Error ? 'border-error' : 'border-border focus:border-accent'
                        }`}
                    />
                </Field>

                <div>
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Police d'écriture</p>
                    <div className="flex gap-1.5">
                        {FONTS.map((font) => (
                            <button
                                key={font.value}
                                type="button"
                                onClick={() => onFontChange(font.value)}
                                className={`px-3 py-1.5 text-xs border rounded transition-all ${
                                    selectedFont === font.value
                                        ? 'border-accent bg-accent text-bg'
                                        : 'border-border text-text-secondary hover:border-border-strong'
                                }`}
                                style={{ fontFamily: font.family }}
                            >
                                {font.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
)
