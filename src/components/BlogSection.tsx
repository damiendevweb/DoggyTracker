import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export const BlogSection = () => {
    return (
        <section className="bg-bg-elevated border-y border-border py-20">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex items-center gap-3 mb-10">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-widest">Blog</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded overflow-hidden">
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="group bg-bg-elevated hover:bg-bg-hover transition-colors p-6"
                        >
                            <div className="flex items-center gap-2 text-[10px] mb-4">
                                <time className="text-text-muted">{post.date}</time>
                                <span className="bg-accent-dim text-accent rounded px-1.5 py-0.5 font-medium">
                                    {post.category}
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
                                {post.title}
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{post.excerpt}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-accent-dim flex items-center justify-center text-[9px] font-bold text-accent">
                                    {post.authorInitials}
                                </div>
                                <span className="text-[11px] text-text-muted">{post.author}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
