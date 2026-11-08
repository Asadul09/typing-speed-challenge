import { CodeSnippetItem, QuoteItem } from '../types';

export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "speed", "focus", "flow", "react", "code", "light", "shift", "power", "key", "press",
  "stream", "screen", "build", "world", "quick", "clean", "type", "fast", "mind", "pulse",
  "system", "program", "logic", "simple", "create", "future", "vision", "learn", "skill", "test",
  "cloud", "device", "memory", "signal", "vector", "matrix", "energy", "spark", "drive", "space",
  "network", "server", "design", "engine", "syntax", "state", "render", "native", "thread", "stack",
  "great", "small", "large", "change", "number", "point", "sound", "hand", "high", "place",
  "order", "table", "group", "while", "never", "always", "every", "again", "under", "water",
  "stand", "begin", "start", "leave", "write", "right", "night", "force", "field", "plane"
];

export const FAMOUS_QUOTES: QuoteItem[] = [
  {
    id: 'quote-1',
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
    source: "Stanford Commencement Address",
    category: "tech",
    length: "medium"
  },
  {
    id: 'quote-2',
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    author: "Alan Turing",
    source: "Computing Machinery and Intelligence",
    category: "tech",
    length: "short"
  },
  {
    id: 'quote-3',
    text: "Simplicity is prerequisite for reliability. Complex systems always break in complex ways.",
    author: "Edsger W. Dijkstra",
    category: "tech",
    length: "short"
  },
  {
    id: 'quote-4',
    text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "philosophy",
    length: "short"
  },
  {
    id: 'quote-5',
    text: "Somewhere, something incredible is waiting to be known. The cosmos is within us. We are made of star-stuff.",
    author: "Carl Sagan",
    source: "Cosmos",
    category: "science",
    length: "medium"
  },
  {
    id: 'quote-6',
    text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    category: "science",
    length: "medium"
  },
  {
    id: 'quote-7',
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "tech",
    length: "short"
  },
  {
    id: 'quote-8',
    text: "In the middle of difficulty lies opportunity. Life is like riding a bicycle. To keep your balance, you must keep moving.",
    author: "Albert Einstein",
    category: "wisdom",
    length: "medium"
  },
  {
    id: 'quote-9',
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    source: "Structure and Interpretation of Computer Programs",
    category: "tech",
    length: "medium"
  },
  {
    id: 'quote-10',
    text: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks.",
    author: "Mark Twain",
    category: "wisdom",
    length: "medium"
  }
];

export const CODE_SNIPPETS: CodeSnippetItem[] = [
  {
    id: 'code-js-1',
    language: 'javascript',
    title: 'Array Filter & Map',
    code: "const results = items.filter(x => x.score > 90).map(x => ({ ...x, status: 'passed' }));"
  },
  {
    id: 'code-ts-1',
    language: 'typescript',
    title: 'Generic Async Handler',
    code: "async function fetchData<T>(url: string): Promise<T> { const res = await fetch(url); return res.json(); }"
  },
  {
    id: 'code-py-1',
    language: 'python',
    title: 'List Comprehension',
    code: "squares = [x ** 2 for x in range(10) if x % 2 == 0]"
  },
  {
    id: 'code-rust-1',
    language: 'rust',
    title: 'Pattern Match & Result',
    code: "let value = match buffer.read_line() { Ok(n) => n, Err(e) => panic!(\"Failed: {}\", e) };"
  },
  {
    id: 'code-html-1',
    language: 'html',
    title: 'Modern Flex Container',
    code: "<div className=\"flex items-center justify-between p-4 bg-slate-900 rounded-xl shadow-lg\">"
  }
];

class TextGeneratorService {
  /**
   * Generates a random sequence of words with length count
   */
  public generateWords(count: number = 30): string {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
      list.push(COMMON_WORDS[randomIndex]);
    }
    return list.join(" ");
  }

  /**
   * Get random quote, optionally by category
   */
  public getRandomQuote(category?: string): QuoteItem {
    let pool = FAMOUS_QUOTES;
    if (category && category !== 'all') {
      pool = FAMOUS_QUOTES.filter(q => q.category === category);
    }
    if (pool.length === 0) pool = FAMOUS_QUOTES;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  /**
   * Get random code snippet, optionally by language
   */
  public getRandomCodeSnippet(language?: string): CodeSnippetItem {
    let pool = CODE_SNIPPETS;
    if (language && language !== 'all') {
      pool = CODE_SNIPPETS.filter(c => c.language === language);
    }
    if (pool.length === 0) pool = CODE_SNIPPETS;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  /**
   * Clean custom text
   */
  public cleanCustomText(text: string): string {
    return text
      .trim()
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .slice(0, 1000);
  }
}

export const textGenerator = new TextGeneratorService();
