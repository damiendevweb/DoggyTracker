import { useParams, Link, Navigate } from 'react-router-dom'
import { getBlogPost } from '../data/blogPosts'

export const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const post = getBlogPost(slug || '')

    if (!post) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-3xl mx-auto px-5 py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-8"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour aux articles
                </Link>

                <article className="bg-bg-elevated border border-border overflow-hidden">
                    <div className="bg-bg-surface border-b border-border p-12 text-center">
                        <span className="text-4xl">🐾</span>
                    </div>

                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <time className="text-[10px] text-text-muted">{post.date}</time>
                            <span className="text-[10px] font-medium bg-accent-dim text-accent rounded px-1.5 py-0.5">
                                {post.category}
                            </span>
                            <span className="text-[10px] text-text-muted">{post.readTime} de lecture</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-8" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            {post.title}
                        </h1>

                        <div className="prose prose-sm max-w-none text-text-secondary">
                            {post.content.split('\n').map((line, i) => {
                                if (line.startsWith('## ')) {
                                    return <h2 key={i} className="text-lg font-bold text-text-primary mt-8 mb-3">{line.slice(3)}</h2>
                                }
                                if (line.startsWith('### ')) {
                                    return <h3 key={i} className="text-base font-semibold text-text-primary mt-6 mb-2">{line.slice(4)}</h3>
                                }
                                if (line.startsWith('- **')) {
                                    const match = line.match(/- \*\*(.+?)\*\*(.*)/)
                                    if (match) {
                                        return (
                                            <p key={i} className="ml-4 mb-2">
                                                <span className="font-bold">{match[1]}</span>{match[2]}
                                            </p>
                                        )
                                    }
                                }
                                if (line.trim() === '') {
                                    return <div key={i} className="h-2" />
                                }
                                return <p key={i} className="leading-relaxed mb-3">{line}</p>
                            })}
                        </div>

                        <div className="mt-10 pt-6 border-t border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-accent-dim flex items-center justify-center text-xs font-bold text-accent">
                                    {post.authorInitials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">{post.author}</p>
                                    <p className="text-xs text-text-muted">{post.authorRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Voir tous les articles
                    </Link>
                </div>
            </div>
        </div>
    )
}
