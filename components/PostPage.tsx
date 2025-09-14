import React from 'react';
import type { Post } from '../types';
import { ArrowLeftIcon } from './icons';
import { renderMarkdown } from '../utils/markdown';

interface PostPageProps {
  post: Post;
  onBack: () => void;
}

const PostPage: React.FC<PostPageProps> = ({ post, onBack }) => {

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to all posts
      </button>

      <article>
        <header>
          <h1 className="text-5xl font-bold font-serif text-gray-900 leading-tight">{post.title}</h1>
          <p className="mt-4 text-md text-gray-500">Published on {formattedDate}</p>
          <div className="mt-6 aspect-video w-full rounded-lg overflow-hidden shadow-xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </header>

        <div className="mt-8 font-serif text-lg text-gray-800">
          {renderMarkdown(post.content)}
        </div>
      </article>
    </main>
  );
};

export default PostPage;
