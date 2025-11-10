import { formatDistanceToNow } from 'date-fns';
import { interactionAPI } from '../services/api';

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

// ✅ FIXED: Share function with proper error handling
export const shareArticle = async (article, userId) => {
  try {
    // Record share in backend first
    if (userId && article.id) {
      await interactionAPI.shareArticle(userId, article.id);
    }
    
    // Try native share API
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.summary || article.title,
        url: article.sourceUrl
      });
      return true;
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(article.sourceUrl);
        alert('Link copied to clipboard!');
        return true;
      } else {
        // Older browser fallback
        const textArea = document.createElement('textarea');
        textArea.value = article.sourceUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Link copied to clipboard!');
          return true;
        } catch (err) {
          document.body.removeChild(textArea);
          console.error('Failed to copy:', err);
          alert('Failed to share. Please copy the link manually.');
          return false;
        }
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error sharing:', err);
      // Don't show error if user just cancelled the share dialog
      if (err.message && !err.message.includes('share')) {
        alert('Failed to share article');
      }
    }
    return false;
  }
};