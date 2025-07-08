import { customObject } from "../types/types";

export default interface ExternalNewsService {
    fetchNewsFromExternalApiByCategory(category: string): customObject;
    processArticlesToStoreInDB(articles: customObject[], category: string): customObject[];
}