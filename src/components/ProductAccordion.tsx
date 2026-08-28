import { useState } from 'react'

type AccordionItem = {
    name: string
    label: string
    content: React.ReactNode
}

type Props = {
    items: AccordionItem[]
}

export const ProductAccordion = ({ items }: Props) => {
    const [open, setOpen] = useState<string | null>(null)
    const toggle = (name: string) => setOpen(open === name ? null : name)

    return (
        <div className="space-px bg-border rounded overflow-hidden">
            {items.map((item) => (
                <div key={item.name} className="bg-bg-elevated">
                    <button
                        onClick={() => toggle(item.name)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-bg-hover transition-colors"
                    >
                        {item.label}
                        <svg className={`w-3.5 h-3.5 shrink-0 text-text-muted transition-transform duration-200 ${open === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {open === item.name && (
                        <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
