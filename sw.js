const CACHE_NAME = 'rinno-cache-20260513-private-modal-flow-0147';
const PRECACHE_URLS = [
    './',
    'index.html',
    'manifest.json',
    'manifest.json?v=20260510-wanye-sensual-tags-0081',
    'icon-192-v20260428-app-refresh-1.png',
    'icon-512-v20260428-app-refresh-1.png',
    'https://unpkg.com/dexie@3.2.4/dist/dexie.js',
    'style.css?v=20260512-editorial-ui-0144',
    'app/style/css/style.css?v=20260425-top-chrome-controls-1',
    'app/settings/css/settings.css?v=20260510-update-modal-0122',
    'app/prologue/css/prologue.css?v=20260510-ios-viewport-bottom-0116',
    'app/private/css/private.css?v=20260513-private-modal-flow-0147',
    'app/private/css/private.tail-fix.css?v=20260429-chat-shell-tail-fix-1',
    'app/letter/css/letter.css?v=20260423-click-cleanup-3',
    'app/community/css/community.css?v=20260510-ios-viewport-bottom-0116',
    'app/encounter/css/encounter.css?v=20260423-click-cleanup-3',
    'app/dossier/css/dossier.css?v=20260510-ios-viewport-bottom-0116',
    'app/wanye/css/wanye.css?v=20260510-ios-viewport-bottom-0116',
    'app/lingguang/css/lingguang.css?v=20260423-new-apps-1',
    'app/guide/css/guide.css?v=20260423-new-apps-1',
    'app/zhenxuan/css/zhenxuan.css?v=20260510-ios-viewport-bottom-0116',
    'app/phone/css/phone.css?v=20260510-ios-viewport-bottom-0116',
    'app/assets/css/assets.css?v=20260510-ios-viewport-bottom-0116',
    'app/_shared/css/theme-bridge.css?v=20260512-editorial-ui-0144',
    'app/_shared/css/frame-shell.css?v=20260512-update-log-0142',
    'app/_shared/css/contact-homepage-overrides.css?v=20260510-ios-viewport-bottom-0116',
    'app/_shared/css/safe-area.css?v=20260510-ios-viewport-bottom-0116',
    'script.js?v=20260513-private-modal-flow-0147',
    'app/style/tpl/style.tpl?v=20260501-dossier-private-fix-4',
    'app/settings/tpl/settings.tpl?v=20260510-update-modal-0122',
    'app/prologue/tpl/prologue.tpl?v=20260501-dossier-private-fix-4',
    'app/private/tpl/private.tpl?v=20260510-update-modal-0122',
    'app/letter/tpl/letter.tpl?v=20260501-dossier-private-fix-4',
    'app/community/tpl/community.tpl?v=20260510-community-x-real-light-0115',
    'app/encounter/tpl/encounter.tpl?v=20260501-dossier-private-fix-4',
    'app/dossier/tpl/dossier.tpl?v=20260501-dossier-private-fix-4',
    'app/wanye/tpl/wanye.tpl?v=20260510-v0081-wanye-sensual-tags',
    'app/lingguang/tpl/lingguang.tpl?v=20260501-dossier-private-fix-4',
    'app/guide/tpl/guide.tpl?v=20260501-dossier-private-fix-4',
    'app/zhenxuan/tpl/zhenxuan.tpl?v=20260510-v0112-private-pay-status',
    'app/phone/tpl/phone.tpl?v=20260501-dossier-private-fix-4',
    'app/assets/tpl/assets.tpl?v=20260501-dossier-private-fix-4',
    'app/mijing/html/mijing-frame.html?v=20260510-trace-card-monitor-0093',
    'app/cinema/html/cinema-frame.html?v=20260510-update-modal-0122',
    'app/fuyue/html/fuyue-frame.html?v=20260512-offline-rendezvous-0140',
    'app/private/js/private.js?v=20260513-private-modal-flow-0147',
    'app/trace/html/trace-frame.html?v=20260510-trace-card-monitor-0093',
    'app/letter/js/letter.js?v=20260501-dossier-private-fix-4',
    'app/settings/js/settings.js?v=20260510-update-modal-0122',
    'app/prologue/js/prologue.js?v=20260501-dossier-private-fix-4',
    'app/style/js/style.js?v=20260512-editorial-ui-0144',
    'app/community/js/community.js?v=20260510-community-x-real-light-0115',
    'app/encounter/js/encounter.js?v=20260501-dossier-private-fix-4',
    'app/dossier/js/dossier.js?v=20260509-v0087-right-arrow-dossier-char-editor',
    'app/wanye/js/wanye.js?v=20260510-v0081-wanye-sensual-tags',
    'app/lingguang/js/lingguang.js?v=20260501-dossier-private-fix-4',
    'app/guide/js/guide.js?v=20260501-dossier-private-fix-4',
    'app/zhenxuan/js/zhenxuan.js?v=20260510-v0112-private-pay-status',
    'app/phone/js/phone.js?v=20260501-dossier-private-fix-4',
    'app/assets/js/assets.js?v=20260509-v0091-private-pay-password'
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



self.addEventListener('message', event => {
    const data = event.data || {};
    if (data.type !== 'RINNO_SHOW_NOTIFICATION') return;
    const title = String(data.title || 'Rinno').trim() || 'Rinno';
    const options = data.options && typeof data.options === 'object' ? data.options : {};
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    const data = event.notification?.data || {};
    event.notification.close();
    const contactId = String(data.contactId || '');
    const targetUrl = `./?rinnoOpen=private&contactId=${encodeURIComponent(contactId)}`;
    event.waitUntil((async () => {
        const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of windowClients) {
            if ('focus' in client) {
                await client.focus();
                try {
                    client.postMessage({ type: 'RINNO_OPEN_PRIVATE_CHAT', contactId });
                } catch (error) {
                    // Ignore clients that cannot receive the message.
                }
                return;
            }
        }
        if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
    })());
});

self.addEventListener('fetch', event => {
    if (!canHandleRequest(event.request)) return;
    if (event.request.mode === 'navigate') {
        event.respondWith(handleNavigation(event.request));
        return;
    }
    event.respondWith(handleAsset(event));
});
