
import React from 'react';
import type { Post } from '../types';
import BlogPostCard from './BlogPostCard';

interface HomePageProps {
  posts: Post[];
  onSelectPost: (id: string) => void;
  onNewPost: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ posts, onSelectPost, onNewPost }) => {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md border border-dashed border-gray-300">
          <h2 className="text-3xl font-bold text-gray-700">Welcome to Landry's Log!</h2>
          <p className="mt-4 text-lg text-gray-500">There are no posts yet. Let's create one!</p>
          <button
            onClick={onNewPost}
            className="mt-8 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} onClick={() => onSelectPost(post.id)} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
