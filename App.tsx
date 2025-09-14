import React, { useState, useEffect, useCallback } from 'react';
import type { Post } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PostPage from './components/PostPage';
import CreatePostForm from './components/CreatePostForm';

type View = 'home' | 'post' | 'create';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check for admin status on initial load from URL parameter or session storage
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      sessionStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (sessionStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true);
    }
  }, []);


  useEffect(() => {
    // A simple effect to sort posts by date whenever they change.
    // Newest posts first.
    setPosts(currentPosts => [...currentPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [posts.length]);


  const handleNewPost = useCallback(() => {
    if (isAdmin) {
      setCurrentView('create');
      setSelectedPostId(null);
    }
  }, [isAdmin]);
  
  const handleGoHome = useCallback(() => {
    setCurrentView('home');
    setSelectedPostId(null);
  }, []);

  const handleSelectPost = useCallback((id: string) => {
    setSelectedPostId(id);
    setCurrentView('post');
  }, []);

  const handlePostCreated = useCallback((newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentView('home');
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        if (!isAdmin) {
            handleGoHome();
            return null;
        }
        return <CreatePostForm onPostCreated={handlePostCreated} />;
      case 'post':
        const selectedPost = posts.find(p => p.id === selectedPostId);
        if (selectedPost) {
          return <PostPage post={selectedPost} onBack={handleGoHome} />;
        }
        // Fallback to home if post not found
        handleGoHome();
        return null;
      case 'home':
      default:
        return <HomePage posts={posts} onSelectPost={handleSelectPost} onNewPost={handleNewPost} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNewPost={handleNewPost} onGoHome={handleGoHome} isAdmin={isAdmin} />
      <div className="flex-grow">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default App;
