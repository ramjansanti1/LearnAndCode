export default interface ExternalNewsService {
    fetchNewsFromExternalApiByCategory(category: string): { [key: string]: any };
    processArticlesToStoreInDB(articles: { [key: string]: any }[], category: string): { [key: string]: any }[];
}