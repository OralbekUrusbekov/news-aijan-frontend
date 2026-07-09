'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { CommentItem } from '@/lib/types';
import { formatDateTime as formatDate } from '@/lib/i18n/date';

function CommentRow({ comment, onReply, onLike, onDelete, currentUserId, isAdmin, depth = 0 }: {
  comment: CommentItem;
  onReply: (parentId: number, content: string) => Promise<void>;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  currentUserId?: number;
  isAdmin?: boolean;
  depth?: number;
}) {
  const { locale, t } = useLocale();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await onReply(comment.id, replyText);
    setReplyText('');
    setReplying(false);
  };

  const canDelete = currentUserId === comment.user.id || isAdmin;

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : 'border-b border-slate-100 py-5'}>
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={comment.user.avatar_url} alt={comment.user.name} className="w-10 h-10 rounded-full shrink-0 ring-2 ring-slate-50" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-900">{comment.user.name}</span>
            <span className="text-xs text-slate-400">{formatDate(comment.created_at, locale)}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-slate-500">
            <button onClick={() => onLike(comment.id)} className={`hover:text-blue-600 transition ${comment.is_liked ? 'text-blue-600' : ''}`}>
              👍 {comment.likes}
            </button>
            {user && depth === 0 && (
              <button onClick={() => setReplying((v) => !v)} className="hover:text-blue-600 transition">{t('comments_reply')}</button>
            )}
            {canDelete && (
              <button onClick={() => onDelete(comment.id)} className="text-red-500 hover:text-red-700 transition">{t('comments_delete')}</button>
            )}
          </div>

          {replying && (
            <form onSubmit={submitReply} className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('comments_placeholder')}
                className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition">{t('comments_submit')}</button>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div>
              {comment.replies.map((reply) => (
                <CommentRow
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ newsSlug, initialComments }: { newsSlug: string; initialComments: CommentItem[] }) {
  const { user } = useAuth();
  const { t } = useLocale();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const comment = await api.post<CommentItem>(`/news/${newsSlug}/comments/`, { content }, { auth: true });
      setComments((prev) => [comment, ...prev]);
      setContent('');
    } catch (err) {
      setError(err instanceof ApiError ? String(err.message) : t('common_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: number, replyContent: string) => {
    const reply = await api.post<CommentItem>(`/news/${newsSlug}/comments/`, { content: replyContent, parent_id: parentId }, { auth: true });
    setComments((prev) => prev.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c)));
  };

  const handleLike = async (id: number) => {
    if (!user) return;
    const res = await api.post<{ liked: boolean; likes: number }>(`/comments/${id}/like/`, undefined, { auth: true });
    setComments((prev) => prev.map((c) => updateLike(c, id, res)));
  };

  const updateLike = (c: CommentItem, id: number, res: { liked: boolean; likes: number }): CommentItem => {
    if (c.id === id) return { ...c, is_liked: res.liked, likes: res.likes };
    if (c.replies) return { ...c, replies: c.replies.map((r) => updateLike(r, id, res)) };
    return c;
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/comments/${id}/`, { auth: true });
    setComments((prev) =>
      prev.filter((c) => c.id !== id).map((c) => ({ ...c, replies: c.replies?.filter((r) => r.id !== id) })),
    );
  };

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-extrabold mb-5 text-slate-900 flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-blue-600" />
        {t('comments_title')} <span className="text-slate-400 font-medium text-base">({comments.length})</span>
      </h2>

      {user ? (
        <form onSubmit={submitComment} className="flex gap-2 mb-6">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('comments_placeholder')}
            className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <button disabled={submitting} className="bg-blue-600 text-white px-5 rounded-full text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {t('comments_submit')}
          </button>
        </form>
      ) : (
        <p className="text-sm text-slate-500 mb-6 bg-slate-50 rounded-xl px-4 py-3">
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">{t('comments_login_required')}</Link>
        </p>
      )}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {comments.length === 0 ? (
        <p className="text-sm text-slate-400">{t('comments_empty')}</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              onReply={handleReply}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUserId={user?.id}
              isAdmin={user?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </section>
  );
}
