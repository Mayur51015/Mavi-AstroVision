import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/articles/${slug}`);
      if (res.data.success) {
        setArticle(res.data.article);
        setRelated(res.data.related || []);
      }
    } catch (err) {
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, text: article?.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  const renderContent = (content) => {
    if (!content) return null;

    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-cinzel font-bold text-gradient-gold mt-6 mb-3">
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-white mt-4 mb-2">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('- ') || block.startsWith('1. ') || block.startsWith('2. ') || block.startsWith('3. ') || block.startsWith('4. ')) {
        const items = block.split('\n');
        return (
          <ul key={idx} className="space-y-2 my-3 pl-4">
            {items.map((it, iIdx) => (
              <li key={iIdx} className="text-xs sm:text-sm text-white/80 leading-relaxed list-disc">
                {it.replace(/^[-*]|\d+\./g, '').trim()}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-white/80 leading-relaxed my-3 font-light">
          {block}
        </p>
      );
    });
  };

  if (loading) return <Loader />;
  if (!article) return <div className="min-h-screen text-center pt-32 text-white">Article not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Articles
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 font-semibold">
              {article.category}
            </span>
            <span className="text-white/40 flex items-center gap-1">
              <Clock size={12} /> {article.readTime}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/40 flex items-center gap-1">
              <Eye size={12} /> {article.views} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-white/70 italic leading-relaxed border-l-2 border-gold-400 pl-4 py-1">
            {article.excerpt}
          </p>

          {/* Author and Share Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-aurora-purple flex items-center justify-center text-cosmic-950 font-bold">
                <User size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{article.author?.name}</h4>
                <p className="text-[10px] text-white/50">{article.author?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition"
                title="Share article"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-white/10 h-72 sm:h-96">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div className="card-cosmic p-6 sm:p-10 space-y-4 border border-white/10">
          {renderContent(article.content)}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/40">Tags:</span>
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gold-300/80"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-xl font-cinzel font-bold text-white">Related Celestial Wisdom</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/articles/${rel.slug}`}
                  className="card-cosmic p-4 border border-white/10 hover:border-gold-500/40 transition group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] text-gold-400 font-semibold block">{rel.category}</span>
                    <h4 className="text-xs font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-white/50 flex items-center gap-1 mt-3">
                    Read <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
