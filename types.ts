
export interface Post {
  id: string;
  title: string;
  prompt: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export interface TopicSuggestion {
  title: string;
  prompt: string;
}
