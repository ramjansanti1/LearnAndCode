export class MessageConstants {
    static mongoConnected = {
        success: 'MongoDB connected on host:',
        error: 'MongoDB connection error:',
    };

    static access = {
        success: "Access granted successfully",
        error: "Error granting access",
        revokedSuccess: "Access revoked successfully",
        revokedError: "Error revoking access",
    };

    static reports = {
        success: "Reports fetched successfully",
        error: "Error fetching reports",
    };

    static articleUpdate = {
        success: "Article updated successfully",
        error: "Error updating article",
    };

    static categories = {
        fetchSuccess: "Categories fetched successfully",
        fetchError: "Error fetching categories",
        addSuccess: "Categories added successfully",
        addError: "Error adding categories",
        updateSuccess: "Categories updated successfully",
        updateError: "Error updating categories",
    };

    static externalSource = {
        fetchSuccess: "External sources fetched successfully",
        fetchError: "Error fetching sources",
        addSuccess: "External source added successfully",
        addError: "Error adding source",
        apiKeyUpdateSuccess: "External source API updated successfully",
        apiKeyUpdateError: "Error updating source API key",
        statusUpdateSuccess: "External source status updated successfully",
        statusUpdateError: "Error updating source",
    };

    static news = {
        fetchSuccess: "News fetched successfully",
        fetchError: "Error fetching news",
    };

    static article = {
        fetchSuccess: "Article fetched successfully",
        fetchError: "Error fetching article",
        saveSuccess: "Article saved successfully",
        saveError: "Error saving article",
        deleteSuccess: "Article deleted successfully",
        deleteError: "Error deleting article",
        likeSuccess: "Article liked successfully",
        likeError: "Error liking article",
        dislikeSuccess: "Article disliked successfully",
        dislikeError: "Error disliking article",
        reportSuccess: "Article reported successfully",
        reportError: "Error reporting article",
    };

    static notification = {
        fetchSuccess: "Notification config fetched successfully",
        fetchError: "Error getting notification config",
        addSuccess: "Notification config added successfully",
        addError: "Error adding notification config",
        categoryAddSuccess: "Category added successfully",
        categoryAddError: "Error adding category",
        categoryRemoveSuccess: "Category removed successfully",
        categoryRemoveError: "Error removing category",
        keywordAddSuccess: "Keyword added successfully",
        keywordAddError: "Error adding keyword",
        keywordRemoveSuccess: "Keyword removed successfully",
        keywordRemoveError: "Error removing keyword",
    };
}
