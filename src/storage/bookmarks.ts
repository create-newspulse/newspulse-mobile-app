import AsyncStorage from './asyncStorage';

export type NormalizedArticle = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  category?: string;
  language?: string;
  date?: string;
};

export type Bookmark = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  savedAt: string;
  content?: string; // optional cached content
  category?: string;
  language?: string;
  date?: string;
};

const BOOKMARKS_KEY = 'bookmarks';
const ARTICLE_CACHE_KEY = 'article-cache';

export async function getBookmarks(): Promise<Bookmark[]> {
  const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

export async function isBookmarked(id: string): Promise<boolean> {
  const all = await getBookmarks();
  return all.some(b => b._id === id);
}

export async function addBookmark(article: NormalizedArticle): Promise<void> {
  const all = await getBookmarks();
  if (all.some(b => b._id === article._id)) return; // already saved
  const entry: Bookmark = {
    _id: article._id,
    title: article.title,
    description: article.description,
    imageUrl: article.imageUrl,
    savedAt: new Date().toISOString(),
    content: article.content,
    category: article.category,
    language: article.language,
    date: article.date,
  };
  const next = [entry, ...all];
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  // also ensure cached article is stored
  await setArticleInCache({ ...article });
}

export async function removeBookmark(id: string): Promise<void> {
  const all = await getBookmarks();
  const next = all.filter(b => b._id !== id);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
}

// Article cache helpers (offline-friendly)
export async function getArticleCache(): Promise<Record<string, NormalizedArticle>> {
  const raw = await AsyncStorage.getItem(ARTICLE_CACHE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, NormalizedArticle>;
  } catch {
    return {};
  }
}

export async function getArticleFromCache(id: string): Promise<NormalizedArticle | undefined> {
  const map = await getArticleCache();
  return map[id];
}

export async function setArticleInCache(article: NormalizedArticle): Promise<void> {
  const map = await getArticleCache();
  map[article._id] = article;
  await AsyncStorage.setItem(ARTICLE_CACHE_KEY, JSON.stringify(map));
}
