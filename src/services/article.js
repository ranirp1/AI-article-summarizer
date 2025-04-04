import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSummary: builder.query({
            query: (params) => {
                const { articleUrl, length = 3, lang = 'en', engine = '2' } = params;
                return `/summarize?url=${encodeURIComponent(articleUrl)}&length=${length}&lang=${lang}&engine=${engine}`;
            },
        }),
        getArticle: builder.query({
            query: (params) => {
                const { articleUrl } = params;
                return `/extract?url=${encodeURIComponent(articleUrl)}`;
            },
        }),
    }),
})

export const { useLazyGetSummaryQuery, useLazyGetArticleQuery } = articleApi