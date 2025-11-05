export class AbstractController {
    protected readonly basePath: string;

    constructor(basePath) {
        this.basePath = basePath;
    }

    protected async request(path: string, options: Record<string, any> = {}): Promise<Response> {
        const defaultOptions: RequestInit = {
            method: options.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(path, defaultOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed: ${response.status} ${response.statusText} — ${errorText}`);
            }

            return response;
        } catch (err) {
            console.error('API request error:', err);
            throw err; // пробрасываем наверх
        }
    }

    protected replaceUrlPathVariables(path: string, variables: Record<string, string | number>)
    {
        return path.replace(/\{(\w+)}/g, (_, key) => String(variables[key]));
    }
}