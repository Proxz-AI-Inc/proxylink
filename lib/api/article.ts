// file: lib/api/article.ts
type Article = {
  title: string;
  slug: string;
  body?: {
    html: string;
  };
  teaser?: string;
};

export async function getArticles(): Promise<Article[]> {
  const response = await fetch(process.env.NEXT_PUBLIC_HYGRAPH_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query Articles {
        articles {
          title
          slug
          teaser
        }
      }`,
    }),
  });
  const json = await response.json();
  return json.data.articles;
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!process.env.NEXT_PUBLIC_HYGRAPH_URL) {
    throw new Error('NEXT_PUBLIC_HYGRAPH_URL is not set');
  }
  const response = await fetch(process.env.NEXT_PUBLIC_HYGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query Article($slug:String!) {
        article(where: { slug: $slug }) {
          title
          slug
          body {
            html
          }
        }
      }`,
      variables: { slug },
    }),
  });
  const json = await response.json();
  return json.data.article;
}

type JobPosting = {
  title: string;
  slug: string;
  content: {
    html: string;
  };
};

export async function getJobPosting(slug: string): Promise<JobPosting | null> {
  if (!process.env.NEXT_PUBLIC_HYGRAPH_URL) {
    throw new Error('NEXT_PUBLIC_HYGRAPH_URL is not set');
  }
  const response = await fetch(process.env.NEXT_PUBLIC_HYGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query JobPosting($slug: String!) {
        jobPosting(where: { slug: $slug }) {
          title
          slug
          content {
            html
          }
        }
      }`,
      variables: { slug },
    }),
  });
  const json = await response.json();
  return json.data.jobPosting;
}
