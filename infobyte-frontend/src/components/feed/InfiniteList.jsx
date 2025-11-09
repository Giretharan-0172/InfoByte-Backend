import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function InfiniteList({ articles, loadMore, hasMore, loading }) {
  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<LoadingSpinner />}
      endMessage={
        <p className="text-center text-gray-400 py-8">
          You've reached the end! 🎉
        </p>
      }
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} isHero={index === 0} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
