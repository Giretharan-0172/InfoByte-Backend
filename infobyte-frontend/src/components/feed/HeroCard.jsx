import React from 'react';
import ArticleCard from './ArticleCard';

export default function HeroCard({ article }) {
  if (!article) return null;
  return <ArticleCard article={article} isHero={true} />;
}