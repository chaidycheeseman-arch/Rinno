(() => {
    const appRoot = document.getElementById('app-root');
    const appFragments = [
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
        'app/phone/phone.tpl',
        'app/assets/assets.tpl'
    ];
    const appScriptFiles = [
        'app/settings/settings.js?v=20260425-rionn-chat-errorfix-3',
        'app/private/private.js?v=20260425-rionn-chat-errorfix-5',
        'app/letter/letter.js',
        'app/prologue/prologue.js?v=20260425-rionn-chat-errorfix-1',
        'app/style/style.js',
        'app/community/community.js',
        'app/encounter/encounter.js',
        'app/dossier/dossier.js',
        'app/wanye/wanye.js',
        'app/lingguang/lingguang.js',
        'app/guide/guide.js',
        'app/phone/phone.js',
        'app/assets/assets.js?v=20260425-assets-global-toast-1'
    ];
    const appLauncherFns = {
        letter: 'openLetterApp',
        settings: 'openSettingsApp',
        style: 'openStyleApp',
        private: 'openPrivateApp',
        prologue: 'openPrologueApp',
        community: 'openCommunityApp',
        encounter: 'openEncounterApp',
        dossier: 'openDossierApp',
        wanye: 'openWanyeApp',
        lingguang: 'openLingguangApp',
        guide: 'openGuideApp',
        phone: 'openPhoneApp',
        assets: 'openAssetsApp'
    };
    const appCloserFns = {
        letter: 'closeLetterApp',
        settings: 'closeSettingsApp',
        style: 'closeStyleApp',
        private: 'closePrivateApp',
        prologue: 'closePrologueApp',
        community: 'closeCommunityApp',
        encounter: 'closeEncounterApp',
        dossier: 'closeDossierApp',
        wanye: 'closeWanyeApp',
        lingguang: 'closeLingguangApp',
        guide: 'closeGuideApp',
        phone: 'closePhoneApp',
        assets: 'closeAssetsApp'
    };
    const appTitleCloseSelectors = [
        ['#settings-title', 'settings'],
        ['#style-title', 'style'],
        ['#letter-title', 'letter'],
        ['#private-chat-title', 'private'],
        ['.private-topbar .private-title', 'private'],
        ['#prologue-close-title', 'prologue'],
        ['#community-header-action', 'community'],
        ['#encounter-header-action', 'encounter'],
        ['#dossier-close-title', 'dossier'],
        ['#wanye-close-title', 'wanye'],
        ['#lingguang-close-title', 'lingguang'],
        ['#guide-close-title', 'guide'],
        ['#phone-close-title', 'phone'],
        ['#assets-close-title', 'assets']
    ];
    const appLauncherNames = {
        '信笺': 'letter',
        '设置': 'settings',
        '风格': 'style',
        '私叙': 'private',
        '序章': 'prologue',
        '社区': 'community',
        '邂逅': 'encounter',
        '卷宗': 'dossier',
        '晚契': 'wanye',
        '翎光': 'lingguang',
        '指南': 'guide',
        '电话': 'phone',
        '资管': 'assets'
    };

    let appRuntimeReady = false;
    let queuedAppLaunch = '';
    let appLaunchSuppressedUntil = 0;
    const APP_CLOSE_LAUNCH_SUPPRESS_MS = 520;

    function now() {
        return window.performance && typeof window.performance.now === 'function'
            ? window.performance.now()
            : Date.now();
    }

    function suppressAppLaunchAfterClose(ms = APP_CLOSE_LAUNCH_SUPPRESS_MS) {
        appLaunchSuppressedUntil = Math.max(appLaunchSuppressedUntil, now() + ms);
        window.__rinnoSuppressAppLaunchUntil = appLaunchSuppressedUntil;
    }

    function isAppLaunchSuppressed() {
        return now() < Math.max(appLaunchSuppressedUntil, Number(window.__rinnoSuppressAppLaunchUntil) || 0);
    }

    function isLockScreenBlockingAppLaunch() {
        const lock = document.getElementById('lock-screen');
        return Boolean(lock && !lock.classList.contains('unlocked'));
    }

    function openRuntimeApp(name) {
        if (isLockScreenBlockingAppLaunch()) return false;
        const fn = window[appLauncherFns[name]];
        if (typeof fn !== 'function') return false;
        try {
            const result = fn();
            if (result && typeof result.catch === 'function') {
                result.catch(error => console.error('Rinno app open failed:', name, error));
            }
            return true;
        } catch (error) {
            console.error('Rinno app open failed:', name, error);
            return true;
        }
    }

    function closeRuntimeApp(name, instant = false) {
        const fn = window[appCloserFns[name]];
        if (typeof fn !== 'function') return false;
        suppressAppLaunchAfterClose(instant ? 260 : APP_CLOSE_LAUNCH_SUPPRESS_MS);
        try {
            fn(instant);
            return true;
        } catch (error) {
            console.error('Rinno app close failed:', name, error);
            return true;
        }
    }

    function getAppTitleCloseTarget(element) {
        if (!(element instanceof Element)) return null;
        for (const [selector, name] of appTitleCloseSelectors) {
            const title = element.closest(selector);
            if (title && appRoot?.contains(title)) return { title, name };
        }
        return null;
    }

    function syncAppLaunchAttributes(root = document) {
        root.querySelectorAll?.('.app-wrapper').forEach(app => {
            const name = (app.querySelector('.app-name')?.textContent || '').trim();
            const appName = appLauncherNames[name];
            if (appName) app.setAttribute('data-open-app', appName);
        });
    }

    function ensureDatabase() {
        if (window.db?.edits && window.db?.layout) return window.db;
        if (typeof window.Dexie !== 'function') {
            console.warn('Rinno database unavailable: Dexie was not loaded.');
            return null;
        }
        const database = new window.Dexie('rinno_desktop_state');
        database.version(1).stores({
            layout: 'id',
            edits: 'id,type'
        });
        window.db = database;
        return database;
    }

    function queueOrOpenApp(name) {
        if (isLockScreenBlockingAppLaunch()) return false;
        if (appRuntimeReady) return openRuntimeApp(name);
        queuedAppLaunch = name;
        return true;
    }

    function flushQueuedAppLaunch() {
        if (!queuedAppLaunch) return;
        const name = queuedAppLaunch;
        if (openRuntimeApp(name)) queuedAppLaunch = '';
    }

    async function fetchText(path) {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`${path} ${response.status}`);
        return response.text();
    }

    async function loadFragments() {
        if (!appRoot) return;
        const fragments = await Promise.all(appFragments.map(fetchText));
        appRoot.innerHTML = fragments.join('\n');
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.dataset.appScriptSrc = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(script);
        });
    }

    async function loadScripts() {
        for (const src of appScriptFiles) {
            await loadScript(src);
        }
    }

    async function bootRuntime() {
        try {
            await loadFragments();
            ensureDatabase();
            syncAppLaunchAttributes();
            await loadScripts();
            appRuntimeReady = true;
            syncAppLaunchAttributes();
            flushQueuedAppLaunch();
        } catch (error) {
            console.error('Rinno runtime boot failed:', error);
        }
    }

    window.suppressRinnoAppLaunch = suppressAppLaunchAfterClose;
    window.isRinnoAppLaunchSuppressed = isAppLaunchSuppressed;

    document.addEventListener('pointerdown', event => {
        if (getAppTitleCloseTarget(event.target)) suppressAppLaunchAfterClose();
    }, true);

    document.addEventListener('touchstart', event => {
        if (getAppTitleCloseTarget(event.target)) suppressAppLaunchAfterClose();
    }, { capture: true, passive: true });

    document.addEventListener('click', event => {
        const titleClose = getAppTitleCloseTarget(event.target);
        if (titleClose?.name === 'private' && typeof window.handlePrivateTitleBack === 'function') {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.handlePrivateTitleBack();
            return;
        }
        if (titleClose && closeRuntimeApp(titleClose.name)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        if (isAppLaunchSuppressed()) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const launcher = target?.closest?.('[data-open-app]');
        if (!launcher || appRoot?.contains(launcher)) return;
        const name = launcher.getAttribute('data-open-app') || '';
        if (!Object.prototype.hasOwnProperty.call(appLauncherFns, name)) return;
        if (!queueOrOpenApp(name)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootRuntime, { once: true });
    } else {
        void bootRuntime();
    }
})();
