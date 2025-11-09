import { formatDistanceToNow } from 'date-fns';

export const categoryColors = {
  Technology: 'bg-blue-500',
  Science: 'bg-purple-500',
  Business: 'bg-amber-500',
  Sports: 'bg-red-500',
  Medicine: 'bg-green-500',
  WorldNews: 'bg-pink-500'
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Just now';
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const shareArticle = async (article) => {
  const shareData = {
    title: article.title,
    text: article.summary,
    url: article.sourceUrl
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(article.sourceUrl);
    alert('Link copied to clipboard!');
  }
};