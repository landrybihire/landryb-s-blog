
import React from 'react';
import type { Post } from '../types';

interface BlogPostCardProps {
  post: Post;
  onClick: () => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-56">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold font-serif text-gray-800 group-hover:text-blue-600 transition-colors">{post.title}</h2>
        <p className="mt-2 text-sm text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default BlogPostCard;
