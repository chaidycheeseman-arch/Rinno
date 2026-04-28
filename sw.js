const CACHE_NAME = 'rinno-cache-v20260428-app-icon-refresh-1';
const PRECACHE_URLS = [
    './',
    'index.html',
    'manifest.json',
    'manifest.json?v=20260428-app-icon-refresh-1',
    'icon-192-v20260428-app-refresh-1.png',
    'icon-512-v20260428-app-refresh-1.png',
    'https://unpkg.com/dexie@3.2.4/dist/dexie.js',
    'style.css?v=20260425-top-chrome-controls-1',
    'app/style/style.css?v=20260425-top-chrome-controls-1',
    'app/settings/settings.css?v=20260423-click-cleanup-3',
    'app/prologue/prologue.css?v=20260423-click-cleanup-3',
    'app/private/private.css?v=20260427-private-chat-rinno-sticker-fix-15',
    'app/letter/letter.css?v=20260423-click-cleanup-3',
    'app/community/community.css?v=20260423-click-cleanup-3',
    'app/encounter/encounter.css?v=20260423-click-cleanup-3',
    'app/dossier/dossier.css?v=20260423-upload-image-cover-1',
    'app/wanye/wanye.css?v=20260423-new-apps-1',
    'app/lingguang/lingguang.css?v=20260423-new-apps-1',
    'app/guide/guide.css?v=20260423-new-apps-1',
    'app/zhenxuan/zhenxuan.css?v=20260427-zhenxuan-icon-fix-3',
    'app/phone/phone.css?v=20260427-zhenxuan-phone-restore-1',
    'app/theme-bridge.css?v=20260427-zhenxuan-phone-restore-1',
    'app/contact-homepage-overrides.css?v=20260427-private-chat-recall-translucent-fix-9',
    'app/safe-area.css?v=20260427-private-chat-direct-fix-3',
    'script.js?v=20260427-zhenxuan-polish-2',
    'app/style/style.tpl',
    'app/settings/settings.tpl',
    'app/prologue/prologue.tpl',
    'app/private/private.tpl',
    'app/letter/letter.tpl',
    'app/community/community.tpl',
    'app/encounter/encounter.tpl',
    'app/dossier/dossier.tpl',
    'app/wanye/wanye.tpl',
    'app/lingguang/lingguang.tpl',
    'app/guide/guide.tpl',
    'app/zhenxuan/zhenxuan.tpl',
    'app/phone/phone.tpl',
    'app/private/private.js',
    'app/letter/letter.js',
    'app/settings/settings.js',
    'app/prologue/prologue.js',
    'app/style/style.js',
    'app/community/community.js',
    'app/encounter/encounter.js',
    'app/dossier/dossier.js',
    'app/wanye/wanye.js',
    'app/lingguang/lingguang.js',
    'app/guide/guide.js',
    'app/zhenxuan/zhenxuan.js',
    'app/phone/phone.js',
    'app/style/assets/fonts/xinjie-10.ttf'
];

async function warmPrecache() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
        PRECACHE_URLS.map(async url => {
            try {
                await cache.add(url);
            } catch (error) {
                console.warn('[Rinno SW] precache skipped:', url, error);
            }
        })
    );
}

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        await warmPrecache();
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
        );
        await self.clients.claim();
    })());
});

function canHandleRequest(request) {
    if (!request || request.method !== 'GET') return false;
    const url = new URL(request.url);
    return url.origin === self.location.origin || request.url === 'https://unpkg.com/dexie@3.2.4/dist/dexie.js';
}

function isManifestOrAppIconRequest(request) {
    if (!request) return false;
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\//, '');
    return pathname === 'manifest.json'
        || pathname === 'icon-192-v20260428-app-refresh-1.png'
        || pathname === 'icon-512-v20260428-app-refresh-1.png';
}

async function cacheResponse(cache, request, response) {
    if (!response || (!response.ok && response.type !== 'opaque')) return response;
    await cache.put(request, response.clone());
    return response;
}

async function handleNavigation(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        await cacheResponse(cache, request, response);
        return response;
    } catch (error) {
        return (
            await cache.match(request)
            || await cache.match('index.html')
            || await cache.match('./')
            || Response.error()
        );
    }
}

async function handleAsset(event) {
    const { request } = event;
    const cache = await caches.open(CACHE_NAME);
    if (isManifestOrAppIconRequest(request)) {
        try {
            const response = await fetch(request, { cache: 'no-store' });
            return await cacheResponse(cache, request, response);
        } catch (error) {
            return (
                await cache.match(request)
                || Response.error()
            );
        }
    }
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then(response => cacheResponse(cache, request, response))
        .catch(() => null);

    if (cached) {
        event.waitUntil(networkPromise);
        return cached;
    }

    const network = await networkPromise;
    if (network) return network;

    if (request.destination === 'document') {
        return (
            await cache.match('index.html')
            || await cache.match('./')
            || Response.error()
        );
    }

    return Response.error();
}

self.addEventListener('fetch', event => {
    if (!canHandleRequest(event.request)) return;
    if (event.request.mode === 'navigate') {
        event.respondWith(handleNavigation(event.request));
        return;
    }
    event.respondWith(handleAsset(event));
});
