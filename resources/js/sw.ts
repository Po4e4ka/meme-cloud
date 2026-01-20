/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import {
    CacheFirst,
    NetworkFirst,
    NetworkOnly,
    StaleWhileRevalidate,
} from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

const authRouteMatchers = [
    /^\/login/,
    /^\/register/,
    /^\/password/,
    /^\/forgot-password/,
    /^\/reset-password/,
    /^\/email\/verify/,
    /^\/logout/,
];

const isAuthPath = (pathname: string) =>
    authRouteMatchers.some((matcher) => matcher.test(pathname));

registerRoute(
    ({ request, url }) => request.mode === 'navigate' && isAuthPath(url.pathname),
    new NetworkOnly()
);

registerRoute(
    ({ request, url }) =>
        request.mode === 'navigate' && !isAuthPath(url.pathname),
    new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 5,
        plugins: [
            {
                cacheWillUpdate: async ({ response }) => {
                    if (!response || !response.ok) {
                        return null;
                    }
                    if (response.redirected) {
                        return null;
                    }
                    if (response.url.includes('/login')) {
                        return null;
                    }
                    return response;
                },
            },
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
            }),
        ],
    })
);

registerRoute(
    ({ request }) =>
        request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7,
            }),
        ],
    })
);

registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 14,
            }),
        ],
    })
);

registerRoute(
    ({ request }) => request.destination === 'video',
    new CacheFirst({
        cacheName: 'media',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
            }),
        ],
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api',
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 5,
            }),
        ],
    })
);

setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
        return (await caches.match('/offline.html')) ?? Response.error();
    }

    return Response.error();
});
