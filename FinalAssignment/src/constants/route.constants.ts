export class RouteConstants {
    static root = '/';

    static admin = {
        externalSource: "/externalsource",
        grantadminaccess: "/grantadminaccess",
        revokeadminaccess: "/revokeadminaccess",
        reports: "/reports",
        categories: "/categories"
    }

    static externalSource = {
        activate: "/activate",
        deactivate: "/deactivate"
    }

    static news = {
        date: "/date",
        save: "/save",
        like: "/like",
        dislike: "/dislike",
        report: "/report"
    }

    static notification = {
        config: "/config",
        addCategory: "/addCategory",
        removeCategory: "/removeCategory",
        addKeyWord: "/addKeyWord",
        removeKeyword: "/removeKeyword"
    }

    static user = {
        signup: "/signup",
        login: "/login",
        changepassword: "/changepassword"
    }
}
