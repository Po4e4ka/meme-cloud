export const getApiBaseUrl = (): string => {
    if (import.meta.env.APP_URL) {
        return import.meta.env.APP_URL;
    }

    // Автоопределение по NODE_ENV
    switch (import.meta.env.APP_ENV) {
        case "dev":
            return "http://localhost:8000/-/api";
        case "staging":
            return "https://staging.yourdomain.com/-/api";
        case "production":
            return "https://yourdomain.com/-/api";
        default:
            return "/-/api";
    }
};
