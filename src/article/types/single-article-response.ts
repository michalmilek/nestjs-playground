export interface SingleArticleResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user: {
    username: string;
    email: string;
    bio: string;
    image: string;
  };
}
