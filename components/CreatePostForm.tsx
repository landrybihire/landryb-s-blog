import React, { useState } from 'react';
import { generateBlogPost, generateBlogImage, generateTopicSuggestions } from '../services/geminiService';
import type { Post, TopicSuggestion } from '../types';
import Spinner from './Spinner';
import { SparklesIcon, DocumentTextIcon, LightBulbIcon } from './icons';
import MarkdownEditor from './MarkdownEditor';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

interface FormErrors {
    title?: string;
    prompt?: string;
    api?: string;
}

type Stage = 'prompting' | 'editing';
type Draft = Omit<Post, 'id' | 'createdAt'>;

const loadingMessages = [
    "Warming up the AI...",
    "Drafting your article...",
    "Painting a masterpiece image...",
    "Consulting with digital muses...",
    "Putting the final touches...",
    "Almost there..."
];

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [stage, setStage] = useState<Stage>('prompting');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const validateForm = (): boolean => {
      const newErrors: FormErrors = {};
      if (!title.trim()) newErrors.title = "Post title is required.";
      if (!prompt.trim()) newErrors.prompt = "A prompt is required to generate content.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSuggestTopics = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    setErrors({});
    try {
        const topics = await generateTopicSuggestions();
        setSuggestions(topics);
    } catch (err) {
        setErrors({ api: err instanceof Error ? err.message : "Could not fetch suggestions." });
    } finally {
        setIsSuggesting(false);
    }
  }

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuggestions([]);
    
    let messageInterval: number;
    try {
        let messageIndex = 0;
        messageInterval = window.setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 2000);

      const [content, imageUrl] = await Promise.all([
        generateBlogPost(prompt, title),
        generateBlogImage(prompt)
      ]);

      setDraft({ title, prompt, content, imageUrl });
      setStage('editing');

    } catch (err) {
      setErrors({ api: err instanceof Error ? err.message : "An unknown error occurred." });
    } finally {
      setIsLoading(false);
      clearInterval(messageInterval);
    }
  };

  const handlePublish = () => {
    if (!draft) return;
    const newPost: Post = {
      id: new Date().toISOString(),
      ...draft,
      createdAt: new Date().toISOString(),
    };
    onPostCreated(newPost);
  };
  
  const handleStartOver = () => {
      setStage('prompting');
      setDraft(null);
      // Keep title and prompt for convenience
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <Spinner className="w-16 h-16 mx-auto text-blue-600" />
            <p className="mt-6 text-xl text-gray-700 font-semibold animate-pulse">{loadingMessage}</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while Gemini crafts your draft.</p>
        </div>
      </div>
    );
  }

  if (stage === 'editing' && draft) {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <h2 className="text-4xl font-bold font-serif text-gray-800">Review and Edit</h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                    <img src={draft.imageUrl} alt={draft.title} className="w-full h-full object-cover" />
                </div>
                <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Post Title
                    </label>
                    <input
                        type="text"
                        id="edit-title"
                        value={draft.title}
                        onChange={(e) => setDraft({...draft, title: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <MarkdownEditor 
                        content={draft.content} 
                        onContentChange={(newContent) => setDraft({...draft, content: newContent})}
                    />
                </div>
                <div className="flex justify-end items-center gap-4 pt-4">
                    <button type="button" onClick={handleStartOver} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Start Over
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      className="flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Publish Post
                    </button>
                </div>
            </div>
        </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold font-serif text-gray-800">Create a New Post</h2>
            <p className="mt-2 text-md text-gray-500">Let Gemini be your creative partner.</p>
        </div>
        
        <form onSubmit={handleGenerateDraft} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 bg-gray-50 ring-1 ring-inset ${errors.title ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-150`}
                    placeholder="e.g., The Future of AI"
                    aria-describedby="title-error"
                />
            </div>
            {errors.title && <p id="title-error" className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">What's on your mind?</label>
                <button 
                    type="button" 
                    onClick={handleSuggestTopics} 
                    disabled={isSuggesting}
                    className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                >
                    {isSuggesting ? <><Spinner className="w-4 h-4 mr-1.5" />Suggesting...</> : <><LightBulbIcon className="w-4 h-4 mr-1.5" />Suggest a Topic</>}
                </button>
            </div>
            <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 bg-gray-50 ring-1 ring-inset ${errors.prompt ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-150`}
                placeholder="Describe the topic you want Gemini to write about..."
                aria-describedby="prompt-error"
            />
            {errors.prompt && <p id="prompt-error" className="mt-2 text-sm text-red-600">{errors.prompt}</p>}
            <p className="mt-2 text-xs text-gray-500">This will be used to generate the article content and the header image.</p>
          </div>

          {suggestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium text-gray-900">Here are some ideas:</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i} 
                            type="button" 
                            onClick={() => { setTitle(s.title); setPrompt(s.prompt); setSuggestions([]); }}
                            className="p-4 text-left bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <p className="font-semibold text-sm text-gray-800">{s.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{s.prompt}</p>
                        </button>
                    ))}
                </div>
              </div>
          )}

          {errors.api && <p className="text-sm text-red-600 rounded-md bg-red-50 p-3">{errors.api}</p>}
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Draft with AI
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePostForm;
