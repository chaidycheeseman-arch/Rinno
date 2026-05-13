// --- 独立私叙应用页逻辑 ---
let privatePresetEditingId = '';
let privateGuideToastTimer = null;
let privateOpenSessionToken = 0;
let privateContactChatReturnTab = 'whisper';
let privateContactChatSettingsReturnTab = 'contact-chat';
let privateActiveContactChatId = '';
let privateContactChatQuotedMessageId = '';
let privateContactChatMenuMessageId = '';
let privateContactChatEditMessageId = '';
let privateContactChatRecallDetailMessageId = '';
let privateContactChatConfirmResolver = null;
let privateContactChatPayStatusContext = null;
let privateContactChatSendingId = '';
let privateContactChatSelectionMode = false;
let privateContactChatSelectedMessageIds = new Set();
let privateContactChatMenuPressTimer = 0;
let privateContactChatMenuPressX = 0;
let privateContactChatMenuPressY = 0;
let privateContactChatPlaceholderPressTimer = 0;
let privateContactChatPlaceholderPressX = 0;
let privateContactChatPlaceholderPressY = 0;
let privateContactChatImageInput = null;
let privateContactChatSettingsAvatarInput = null;
let privateContactChatSettingsAvatarTarget = null;
let privateContactChatWallpaperInput = null;
let privateContactChatWallpaperTargetId = '';
let privateContactHomepageReturnTab = 'contacts';
let privateContactHomepageCoverTargetId = '';
let privateContactHomepageActiveSection = 'about';
let privateContactChatHistoryExpandedId = '';
let privateContactChatExpandedTranslationKeys = new Set();
let privateContactChatFlippedCameraMessageIds = new Set();
let privateContactChatExpandedVoiceMessageIds = new Set();
let privateContactChatComposerPanel = '';
let privateContactChatComposeModalState = null;
let privateContactChatComposerViewportDismissBound = false;
let privateContactChatLastEnterSubmitAt = 0;
let privateContactChatPromptStickerInventory = [];
let privateStickerLibraryState = null;
let privateStickerLibraryLoadedFor = '';
let privateContactAccountModalReadyAt = 0;
let privateChatNotificationBannerTimer = 0;
let privateChatNotificationBannerQueue = [];
let privateChatNotificationBannerVisible = false;
let privateChatNotificationSoundAudio = null;
let privateNotificationSettingsCache = null;

const privatePendingContactGenerationKeys = new Set();
const privatePendingContactSummaryKeys = new Set();
const PRIVATE_STICKER_LIBRARY_ID_PREFIX = 'private_sticker_library_state';
const PRIVATE_STICKER_DEFAULT_GROUP_ID = 'default';
privateStickerLibraryState = createDefaultPrivateStickerLibraryState();
const PRIVATE_CONTACT_CHAT_LONG_PRESS_MS = 420;
const PRIVATE_CONTACT_CHAT_PLACEHOLDER_LONG_PRESS_MS = 540;
const PRIVATE_CONTACT_CHAT_MENU_MOVE_TOLERANCE = 10;
const PRIVATE_CONTACT_CHAT_PAGE_SIZE = 20;
const PRIVATE_CONTACT_CHAT_DEFAULT_PLACEHOLDER = '想和 ${targetName} 说点什么…';
const PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX = '';
const PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX = '';
const PRIVATE_CONTACT_CHAT_QUOTE_FLASH_MS = 1800;
const PRIVATE_CONTACT_CHAT_ASSISTANT_RECALL_DELAY_MS = 980;
const PRIVATE_CONTACT_CHAT_USER_RECALL_CAUGHT_PROBABILITY = 0.6;
const PRIVATE_CONTACT_CHAT_MIN_PLAN_LENGTH = 2;
const PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT = 24;
const PRIVATE_CONTACT_CHAT_ROLE_GENERATION_PENDING_PREFIX = 'chat-role-generation-';
const PRIVATE_CONTACT_CHAT_REPLY_CONTEXT_LIMIT = 20;
const PRIVATE_CONTACT_CHAT_REPLY_MAX_LENGTH = 220;
const PRIVATE_CONTACT_CHAT_TRANSLATION_MAX_LENGTH = 260;
const PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT = 56;
const PRIVATE_CONTACT_CHAT_REMARK_MAX_LENGTH = 24;
const PRIVATE_CONTACT_CHAT_TIMEZONE_MAX_LENGTH = 64;
const PRIVATE_CONTACT_SUMMARY_MIN_THRESHOLD = 20;
const PRIVATE_CONTACT_SUMMARY_MAX_THRESHOLD = Number.MAX_SAFE_INTEGER;
const PRIVATE_CONTACT_SUMMARY_TEXT_LIMIT = 1800;
const PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT = 1200;
const PRIVATE_CONTACT_LONG_MEMORY_ENTRY_LIMIT = 80;
const PRIVATE_CONTACT_CORE_MEMORY_LIMIT = 24;
const PRIVATE_CONTACT_PROMISE_LIMIT = 40;
const PRIVATE_CONTACT_DAILY_SUMMARY_LIMIT = 60;
const PRIVATE_CONTACT_DAILY_SUMMARY_TEXT_LIMIT = 900;
const PRIVATE_CONTACT_LONG_MEMORY_RECALL_LIMIT = 8;
const PRIVATE_CONTACT_AUTONOMOUS_INSIGHT_LIMIT = 36;
const PRIVATE_CONTACT_RECALL_HINT_LIMIT = 36;
const PRIVATE_CONTACT_CHAT_REPLY_COUNT_MIN = 1;
const PRIVATE_CONTACT_CHAT_REPLY_COUNT_MAX = 12;
const PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MIN = PRIVATE_CONTACT_CHAT_MIN_PLAN_LENGTH;
const PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MAX = 8;
const PRIVATE_CONTACT_SETTINGS_PROFILE_MAX_LENGTH = 900;
const PRIVATE_CONTACT_SYSTEM_CAPSULE_PREFIX = '[[RINNO_CAPSULE]]';
const PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS = 6;
const PRIVATE_CONTACT_CHAT_AUTO_REPLY_ENABLED = true;
const PRIVATE_CONTACT_CHAT_MULTI_SEND_BASE_DELAY_MS = 780;
const PRIVATE_CONTACT_CHAT_PROLOGUE_GROUP_LIMIT = 10;
const PRIVATE_CONTACT_CHAT_PROLOGUE_ENTRY_LIMIT = 24;
const PRIVATE_CONTACT_CHAT_PROLOGUE_STATE_ID = 'prologue_world_bible_state';
const PRIVATE_CONTACT_CHAT_STICKER_PROMPT_LIMIT = 60;
const PRIVATE_IMAGE_MAX_EDGE = 1280;
const PRIVATE_AVATAR_IMAGE_MAX_EDGE = 512;
const PRIVATE_IMAGE_JPEG_QUALITY = 0.78;
const PRIVATE_CONTACT_CHAT_CAMERA_LABEL = '相机照片';
const PRIVATE_CONTACT_CHAT_IMAGE_LABEL = '图片';
const PRIVATE_CONTACT_CHAT_VOICE_LABEL = '语音';
const PRIVATE_CONTACT_CHAT_LOCATION_LABEL = '定位';
const PRIVATE_CONTACT_CHAT_STICKER_LABEL = '表情包';
const PRIVATE_CONTACT_CHAT_CAMERA_CARD_IMAGE_PATH = 'icon-192.png';
const PRIVATE_CONTACT_CHAT_CAMERA_CARD_SIZE = 180;
const PRIVATE_CONTACT_CHAT_VOICE_CHAR_PER_SECOND = 3;
const PRIVATE_CONTACT_CHAT_RICH_MESSAGE_RECENT_WINDOW = 5;
const PRIVATE_CONTACT_CHAT_STICKER_RICH_RATE = 0;
const PRIVATE_CONTACT_CHAT_VOICE_RICH_RATE = 0;
const PRIVATE_CONTACT_CHAT_CAMERA_RICH_RATE = 0;
const PRIVATE_CONTACT_CHAT_LOCATION_RICH_RATE = 0;
const PRIVATE_CONTACT_CHAT_IMAGE_MAX_SOURCE_LENGTH = 2600000;
const PRIVATE_CONTACT_CHAT_MESSAGE_TYPES = new Set(['text', 'camera', 'image', 'voice', 'location', 'sticker', 'red_packet', 'transaction', 'gift_receipt', 'trace_forward']);
const PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES = new Set(['text', 'reply', 'camera', 'voice', 'location', 'sticker', 'red_packet', 'transaction', 'gift_receipt', 'trace_forward', 'open_red_packet', 'accept_transaction', 'refund_transaction', 'return_transaction']);
const PRIVATE_CONTACT_CHAT_LEGACY_PLACEHOLDERS = new Set([
    'Type a note for this chat. Only your manual sends are kept.',
    'Type a note',
    'Type a message...'
]);
const PRIVATE_CONTACT_CHAT_PLACEHOLDER_TOKENS = Object.freeze([
    { key: 'targetName', token: '${targetName}', label: '联系人姓名' },
    { key: 'targetNick', token: '${targetNick}', label: '联系人昵称' },
    { key: 'targetStatus', token: '${targetStatus}', label: '联系人状态' },
    { key: 'userName', token: '${userName}', label: '你的名字' },
    { key: 'userNick', token: '${userNick}', label: '你的昵称' },
    { key: 'userId', token: '${userId}', label: '你的账号' },
    { key: 'relationName', token: '${relationName}', label: '关系名称' },
    { key: 'relationDesc', token: '${relationDesc}', label: '关系详述' },
    { key: 'ipCity', token: '${ipCity}', label: 'TA 的 IP 城市' }
]);
const PRIVATE_CONTACT_CHAT_MENU_PAGES = [
    ['copy', 'edit', 'favorite', 'quote'],
    ['multi-select', 'remove', 'backtrack', 'reroll']
];
const PRIVATE_CONTACT_CHAT_LANGUAGE_RULES = [
    { keywords: ['中国大陆', '中华人民共和国', '中国', 'china', 'prc', 'cn'], language: '简体中文', code: 'zh', foreign: false },
    { keywords: ['香港', 'hong kong', 'hk'], language: '繁体中文（香港书面中文）', code: 'zh-hk', foreign: false },
    { keywords: ['澳门', 'macau', 'macao'], language: '繁体中文（澳门书面中文）', code: 'zh-mo', foreign: false },
    { keywords: ['台湾', 'taiwan'], language: '繁体中文（台湾用语）', code: 'zh-tw', foreign: false },
    { keywords: ['日本', 'japan', 'jp'], language: '日语', code: 'ja', foreign: true },
    { keywords: ['韩国', 'korea', 'south korea', 'kr'], language: '韩语', code: 'ko', foreign: true },
    { keywords: ['英国', 'united kingdom', 'england', 'britain', 'uk'], language: '英语', code: 'en', foreign: true },
    { keywords: ['美国', 'united states', 'usa', 'u.s.a', 'america'], language: '英语', code: 'en', foreign: true },
    { keywords: ['加拿大', 'canada'], language: '英语', code: 'en', foreign: true },
    { keywords: ['澳大利亚', 'australia'], language: '英语', code: 'en', foreign: true },
    { keywords: ['新加坡', 'singapore'], language: '英语', code: 'en', foreign: true },
    { keywords: ['法国', 'france'], language: '法语', code: 'fr', foreign: true },
    { keywords: ['德国', 'germany'], language: '德语', code: 'de', foreign: true },
    { keywords: ['俄罗斯', 'russia'], language: '俄语', code: 'ru', foreign: true },
    { keywords: ['泰国', 'thailand'], language: '泰语', code: 'th', foreign: true },
    { keywords: ['越南', 'vietnam'], language: '越南语', code: 'vi', foreign: true },
    { keywords: ['马来西亚', 'malaysia'], language: '马来语', code: 'ms', foreign: true },
    { keywords: ['菲律宾', 'philippines'], language: '菲律宾语', code: 'fil', foreign: true },
    { keywords: ['印度', 'india'], language: '印地语', code: 'hi', foreign: true }
];
const PRIVATE_CONTACT_STAGE_LABELS = ['幼时', '年少时', '如今'];
const PRIVATE_CONTACT_PHONE_RULES = [
    { keywords: ['中国大陆', '中国', 'china', 'cn'], code: '+86', lengths: [11], cities: ['上海', '北京', '杭州', '深圳', '成都', '南京'] },
    { keywords: ['香港', 'hong kong'], code: '+852', lengths: [8], cities: ['香港'] },
    { keywords: ['澳门', 'macau', 'macao'], code: '+853', lengths: [8], cities: ['澳门'] },
    { keywords: ['台湾', 'taiwan'], code: '+886', lengths: [9], cities: ['台北', '高雄', '台中'] },
    { keywords: ['日本', 'japan', 'jp'], code: '+81', lengths: [10], cities: ['东京', '大阪', '横滨', '福冈'] },
    { keywords: ['韩国', 'korea', 'kr'], code: '+82', lengths: [10], cities: ['首尔', '釜山', '仁川'] },
    { keywords: ['新加坡', 'singapore'], code: '+65', lengths: [8], cities: ['新加坡'] },
    { keywords: ['英国', 'uk', 'united kingdom', 'england', 'britain'], code: '+44', lengths: [10], cities: ['伦敦', '曼彻斯特', '伯明翰'] },
    { keywords: ['法国', 'france'], code: '+33', lengths: [9], cities: ['巴黎', '里昂', '尼斯'] },
    { keywords: ['德国', 'germany'], code: '+49', lengths: [10], cities: ['柏林', '慕尼黑', '汉堡'] },
    { keywords: ['加拿大', 'canada'], code: '+1', lengths: [10], cities: ['多伦多', '温哥华', '蒙特利尔'] },
    { keywords: ['美国', 'usa', 'united states', 'us'], code: '+1', lengths: [10], cities: ['纽约', '洛杉矶', '西雅图', '芝加哥'] },
    { keywords: ['澳大利亚', 'australia'], code: '+61', lengths: [9], cities: ['悉尼', '墨尔本', '布里斯班'] },
    { keywords: ['泰国', 'thailand'], code: '+66', lengths: [9], cities: ['曼谷', '清迈', '普吉'] },
    { keywords: ['越南', 'vietnam'], code: '+84', lengths: [9], cities: ['河内', '胡志明市', '岘港'] },
    { keywords: ['马来西亚', 'malaysia'], code: '+60', lengths: [9, 10], cities: ['吉隆坡', '槟城', '新山'] },
    { keywords: ['菲律宾', 'philippines'], code: '+63', lengths: [10], cities: ['马尼拉', '宿务', '达沃'] },
    { keywords: ['印度', 'india'], code: '+91', lengths: [10], cities: ['孟买', '德里', '班加罗尔'] },
    { keywords: ['俄罗斯', 'russia'], code: '+7', lengths: [10], cities: ['莫斯科', '圣彼得堡', '喀山'] }
];
const PRIVATE_CONTACT_DEFAULT_PHONE_RULE = {
    code: '+86',
    lengths: [11],
    cities: ['上海', '北京', '杭州', '深圳', '成都', '南京']
};
const PRIVATE_CONTACT_PROFESSION_RULES = [
    { keywords: ['音乐', '唱', '乐队', '舞台', 'music', 'song'], label: '独立音乐人' },
    { keywords: ['摄影', '镜头', '照片', '拍摄', 'camera', 'photo'], label: '摄影师' },
    { keywords: ['画', '设计', '插画', '美术', 'design', 'illustration'], label: '视觉设计师' },
    { keywords: ['医生', '治疗', '护理', '药', 'heal', 'care'], label: '康复治疗师' },
    { keywords: ['书', '诗', '写', '信', 'writer', 'poet'], label: '专栏作者' },
    { keywords: ['调查', '档案', '线索', '案', 'archive', 'case'], label: '档案调查员' },
    { keywords: ['学生', '学校', '校园', 'study', 'school'], label: '研究生' },
    { keywords: ['程序', '代码', '系统', 'engineer', 'code'], label: '产品工程师' },
    { keywords: ['酒', '调香', '香', 'taste', 'scent'], label: '调香师' }
];
const PRIVATE_CONTACT_FALLBACK_PROFESSIONS = [
    '编辑',
    '策展人',
    '品牌顾问',
    '城市研究员',
    '珠宝修复师',
    '花艺师',
    '唱片店店员',
    '电影剪辑师'
];

function createDefaultPrivateUserPreset() {
    return {
        name: '我',
        id: '@ rinno',
        gender: '未设定',
        setting: '把人物设定写在这里。'
    };
}

function getPrivateContactChatDefaultPlaceholderText() {
    return PRIVATE_CONTACT_CHAT_DEFAULT_PLACEHOLDER;
}

function isLegacyPrivateContactChatPlaceholder(value) {
    const raw = String(value || '').trim();
    if (!raw || /(?:\$\s*){2,}/.test(raw)) return true;
    return [
        '小猫邮递员派件ing..',
        '小猫邮递员派件ing..。',
        'Type a note for this chat. Only your manual sends are kept.',
        'Type a note',
        'Type a message...'
    ].includes(raw);
}

function getPrivateContactChatPlaceholderTokenKey(value) {
    const compact = String(value || '')
        .trim()
        .replace(/^\$/, '')
        .replace(/[^a-z0-9]+/gi, '')
        .toLowerCase();
    return {
        charname: 'targetName',
        charactername: 'targetName',
        targetname: 'targetName',
        targetnick: 'targetNick',
        targetstatus: 'targetStatus',
        username: 'userName',
        usernick: 'userNick',
        userid: 'userId',
        relation: 'relationName',
        relationship: 'relationName',
        relationname: 'relationName',
        relationdesc: 'relationDesc',
        intimacy: 'relationDesc',
        ipcity: 'ipCity'
    }[compact] || '';
}

function normalizePrivateContactChatPlaceholderTemplate(value) {
    const raw = String(value || '').replace(/\r/g, '').trim();
    if (!raw) return '';
    const canonicalize = (match, token) => {
        const key = getPrivateContactChatPlaceholderTokenKey(token);
        return key ? `\${${key}}` : match;
    };
    return raw
        .replace(/\{\$\s*([a-zA-Z][\w-]*)\s*\}/g, canonicalize)
        .replace(/\$\{\s*([a-zA-Z][\w-]*)\s*\}/g, canonicalize)
        .replace(/\{\{\s*([a-zA-Z][\w-]*)\s*\}\}/g, canonicalize)
        .replace(/\{\s*([a-zA-Z][\w-]*)\s*\}/g, canonicalize)
        .replace(/\s{2,}/g, ' ');
}

function normalizePrivateContactChatPlaceholder(value) {
    const raw = normalizePrivateContactChatPlaceholderTemplate(value);
    if (isLegacyPrivateContactChatPlaceholder(raw)) return getPrivateContactChatDefaultPlaceholderText();
    return raw || getPrivateContactChatDefaultPlaceholderText();
}

function normalizePrivateContactRemark(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizePrivateContactNudgeSuffix(value, fallback = PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX) {
    const normalize = raw => {
        let text = String(raw || '')
            .replace(/\r/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^(拍了拍|拍拍|拍)+/g, '')
            .replace(/[。；;]+$/g, '');
        if (!text || text === '头像' || text === '的头像' || text === '了头像') return '';
        if (text && !/^的/.test(text)) text = `的${text}`;
        return text.slice(0, 24);
    };
    return normalize(value) || normalize(fallback);
}

function getPrivateRuntimeTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai';
    } catch (error) {
        return 'Asia/Shanghai';
    }
}

function isPrivateValidTimezone(value) {
    const timezone = String(value || '').trim();
    if (!timezone) return false;
    try {
        new Intl.DateTimeFormat('zh-CN', { timeZone: timezone }).format(new Date());
        return true;
    } catch (error) {
        return false;
    }
}

function normalizePrivateContactTimezone(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (!isPrivateValidTimezone(raw)) return '';
    try {
        return new Intl.DateTimeFormat('en-US', { timeZone: raw }).resolvedOptions().timeZone || raw;
    } catch (error) {
        return raw;
    }
}

function resolvePrivateContactTimezone(contact = {}) {
    return normalizePrivateContactTimezone(contact?.timezone) || getPrivateRuntimeTimezone();
}

function normalizePrivateContactSummaryThreshold(value) {
    const threshold = Math.round(Number(value) || PRIVATE_CONTACT_SUMMARY_MIN_THRESHOLD);
    return Math.max(PRIVATE_CONTACT_SUMMARY_MIN_THRESHOLD, threshold);
}

function normalizePrivateContactReplyCount(value, fallback = PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MIN) {
    const count = Math.round(Number(value) || Number(fallback) || PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MIN);
    return Math.min(
        PRIVATE_CONTACT_CHAT_REPLY_COUNT_MAX,
        Math.max(PRIVATE_CONTACT_CHAT_REPLY_COUNT_MIN, count)
    );
}

function resolvePrivateContactReplyCadenceConfig(source = {}) {
    const rawMin = source?.replyMinCount ?? source?.minReplyCount ?? source?.replyMin ?? source?.minReplies;
    const rawMax = source?.replyMaxCount ?? source?.maxReplyCount ?? source?.replyMax ?? source?.maxReplies;
    const min = normalizePrivateContactReplyCount(rawMin, PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MIN);
    const max = Math.max(
        min,
        normalizePrivateContactReplyCount(
            rawMax,
            Math.max(PRIVATE_CONTACT_CHAT_REPLY_COUNT_DEFAULT_MAX, min)
        )
    );
    return {
        min,
        max,
        label: min === max ? `${min}` : `${min}-${max}`
    };
}

function normalizePrivateContactArchiveText(value, maxLength = PRIVATE_CONTACT_SUMMARY_TEXT_LIMIT) {
    return String(value || '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, maxLength);
}

function normalizePrivateContactSummaryEventText(value) {
    return String(value || '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function normalizePrivateContactSummaryEvents(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => {
            const text = normalizePrivateContactSummaryEventText(item?.text || item?.content || item?.summary || '');
            if (!text) return null;
            return {
                id: String(item?.id || `summary-event-${Date.now()}-${index}`).trim(),
                source: String(item?.source || item?.kind || 'archive').trim() || 'archive',
                text,
                createdAt: Math.max(0, Number(item?.createdAt || item?.time || item?.timestamp) || 0)
            };
        })
        .filter(Boolean)
        .sort((left, right) => {
            const timeDiff = (left.createdAt || 0) - (right.createdAt || 0);
            if (timeDiff !== 0) return timeDiff;
            return String(left.id || '').localeCompare(String(right.id || ''));
        });
}


function normalizePrivateContactLongMemoryAxis(value) {
    const raw = value && typeof value === 'object' ? value : {};
    return {
        when: normalizePrivateContactSummaryEventText(raw.when || raw.time || raw.timeline || raw['时间轴'] || '').slice(0, 160),
        feel: normalizePrivateContactSummaryEventText(raw.feel || raw.emotion || raw.emotional || raw['情感轴'] || '').slice(0, 160),
        who: normalizePrivateContactSummaryEventText(raw.who || raw.relation || raw.relationship || raw['关系轴'] || '').slice(0, 160),
        what: normalizePrivateContactSummaryEventText(raw.what || raw.semantic || raw.topic || raw['语义轴'] || '').slice(0, 220),
        where: normalizePrivateContactSummaryEventText(raw.where || raw.scene || raw.context || raw['场景轴'] || '').slice(0, 160)
    };
}

function normalizePrivateLongMemoryTags(value) {
    const list = Array.isArray(value)
        ? value
        : String(value || '').split(/[，,、;；\n]+/g);
    return [...new Set(list
        .map(item => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 10))];
}

function clampPrivateLongMemoryWeight(value, fallback = 50) {
    const number = Math.round(Number(value));
    if (!Number.isFinite(number)) return Math.max(0, Math.min(100, Math.round(Number(fallback) || 50)));
    return Math.max(0, Math.min(100, number));
}

function normalizePrivateContactLongMemoryEntries(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => {
            const text = normalizePrivateContactArchiveText(
                item?.text || item?.content || item?.memory || item?.summary || '',
                520
            );
            if (!text) return null;
            const createdAt = Math.max(0, Number(item?.createdAt || item?.time || item?.timestamp) || 0) || Date.now();
            const axis = normalizePrivateContactLongMemoryAxis(item?.axis || item?.fiveDimensionalIndex || item?.dimensions || item);
            return {
                id: String(item?.id || `long-memory-${createdAt}-${index}`).trim(),
                source: String(item?.source || item?.kind || 'summary').trim() || 'summary',
                text,
                axis,
                tags: normalizePrivateLongMemoryTags(item?.tags || item?.keywords || item?.semanticTags || axis.what),
                emotionalWeight: clampPrivateLongMemoryWeight(item?.emotionalWeight ?? item?.emotionWeight ?? item?.feelWeight, 50),
                relationWeight: clampPrivateLongMemoryWeight(item?.relationWeight ?? item?.relationshipWeight, 50),
                recallCount: Math.max(0, Number(item?.recallCount || item?.recalled || 0) || 0),
                lastRecalledAt: Math.max(0, Number(item?.lastRecalledAt || 0) || 0),
                core: Boolean(item?.core || item?.isCore || item?.coreMemory),
                decayProtected: Boolean(item?.decayProtected || item?.protected || item?.core || item?.isCore),
                createdAt,
                updatedAt: Math.max(createdAt, Number(item?.updatedAt || createdAt) || createdAt)
            };
        })
        .filter(Boolean)
        .sort((left, right) => {
            if (left.core !== right.core) return left.core ? -1 : 1;
            return (right.updatedAt || 0) - (left.updatedAt || 0);
        })
        .slice(0, PRIVATE_CONTACT_LONG_MEMORY_ENTRY_LIMIT);
}

function normalizePrivateContactPromiseRecords(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => {
            const text = normalizePrivateContactArchiveText(item?.text || item?.content || item?.promise || item?.summary || '', 360);
            if (!text) return null;
            const status = String(item?.status || item?.state || '进行中').trim() || '进行中';
            const createdAt = Math.max(0, Number(item?.createdAt || item?.time || item?.timestamp) || 0) || Date.now();
            return {
                id: String(item?.id || `promise-${createdAt}-${index}`).trim(),
                text,
                status: status.slice(0, 24),
                dueText: normalizePrivateContactSummaryEventText(item?.dueText || item?.due || item?.deadline || '').slice(0, 80),
                importance: clampPrivateLongMemoryWeight(item?.importance ?? item?.weight, 60),
                source: String(item?.source || 'summary').trim() || 'summary',
                createdAt,
                updatedAt: Math.max(createdAt, Number(item?.updatedAt || createdAt) || createdAt)
            };
        })
        .filter(Boolean)
        .sort((left, right) => (right.importance - left.importance) || ((right.updatedAt || 0) - (left.updatedAt || 0)))
        .slice(0, PRIVATE_CONTACT_PROMISE_LIMIT);
}

function normalizePrivateContactCoreMemoryRecords(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => {
            const text = normalizePrivateContactArchiveText(item?.text || item?.content || item?.memory || item?.summary || '', 420);
            if (!text) return null;
            const createdAt = Math.max(0, Number(item?.createdAt || item?.time || item?.timestamp) || 0) || Date.now();
            return {
                id: String(item?.id || `core-memory-${createdAt}-${index}`).trim(),
                type: String(item?.type || item?.category || '核心记忆').trim().slice(0, 40) || '核心记忆',
                change: String(item?.change || item?.evolution || item?.action || '新增').trim().slice(0, 40) || '新增',
                text,
                intensity: clampPrivateLongMemoryWeight(item?.intensity ?? item?.importance ?? item?.weight, 80),
                createdAt,
                updatedAt: Math.max(createdAt, Number(item?.updatedAt || createdAt) || createdAt)
            };
        })
        .filter(Boolean)
        .sort((left, right) => (right.intensity - left.intensity) || ((right.updatedAt || 0) - (left.updatedAt || 0)))
        .slice(0, PRIVATE_CONTACT_CORE_MEMORY_LIMIT);
}

function getPrivateContactLocalDateKey(timestamp = Date.now(), timezone = getPrivateRuntimeTimezone()) {
    const date = new Date(Math.max(0, Number(timestamp) || Date.now()));
    try {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: normalizePrivateContactTimezone(timezone) || getPrivateRuntimeTimezone(),
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(date).reduce((map, part) => {
            if (part.type !== 'literal') map[part.type] = part.value;
            return map;
        }, {});
        if (parts.year && parts.month && parts.day) return `${parts.year}-${parts.month}-${parts.day}`;
    } catch (error) {
        // fall back to device local date below
    }
    return date.toISOString().slice(0, 10);
}

function normalizePrivateContactDailySummaries(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => {
            const date = String(item?.date || item?.day || '').trim() || getPrivateContactLocalDateKey(item?.createdAt || Date.now());
            const summary = normalizePrivateContactArchiveText(item?.summary || item?.text || item?.content || '', PRIVATE_CONTACT_DAILY_SUMMARY_TEXT_LIMIT);
            const keyPoints = normalizePrivateLongMemoryTags(item?.keyPoints || item?.key_points || item?.points || item?.keywords);
            const unresolved = normalizePrivateLongMemoryTags(item?.unresolved || item?.openLoops || item?.open_loops || []);
            const promises = normalizePrivateLongMemoryTags(item?.promises || item?.agreements || []);
            if (!summary && !keyPoints.length && !unresolved.length && !promises.length) return null;
            const createdAt = Math.max(0, Number(item?.createdAt || item?.time || item?.timestamp) || 0) || Date.now();
            return {
                id: String(item?.id || `daily-summary-${date}-${index}`).trim(),
                date,
                summary,
                keyPoints,
                mood: String(item?.mood || item?.tone || '').trim().slice(0, 80),
                unresolved,
                promises,
                messageCount: Math.max(0, Number(item?.messageCount || item?.count || 0) || 0),
                createdAt,
                updatedAt: Math.max(createdAt, Number(item?.updatedAt || createdAt) || createdAt)
            };
        })
        .filter(Boolean)
        .sort((left, right) => String(right.date || '').localeCompare(String(left.date || '')) || ((right.updatedAt || 0) - (left.updatedAt || 0)))
        .slice(0, PRIVATE_CONTACT_DAILY_SUMMARY_LIMIT);
}

function normalizePrivateContactLongMemoryState(value, charId = 'contact_memory') {
    const raw = value && typeof value === 'object' ? value : {};
    const entries = normalizePrivateContactLongMemoryEntries(raw.entries || raw.memories || raw.memoryEntries || []);
    const promises = normalizePrivateContactPromiseRecords(raw.promises || raw.promiseRecords || raw.agreements || []);
    const coreMemories = normalizePrivateContactCoreMemoryRecords(raw.coreMemories || raw.core_memory_changes || raw.coreMemoryChanges || []);
    const dailySummaries = normalizePrivateContactDailySummaries(raw.dailySummaries || raw.onlineDailySummaries || raw.daily_summary || []);
    return {
        charId: normalizePrivateContactRecordId(raw.charId || charId || 'contact_memory', 'contact_memory'),
        entries,
        promises,
        coreMemories,
        dailySummaries,
        autonomousInsights: normalizePrivateLongMemoryTags(raw.autonomousInsights || raw.autonomous_insights || raw.insights).slice(0, PRIVATE_CONTACT_AUTONOMOUS_INSIGHT_LIMIT),
        recallHints: normalizePrivateLongMemoryTags(raw.recallHints || raw.recall_hints || raw.hints).slice(0, PRIVATE_CONTACT_RECALL_HINT_LIMIT),
        coreUpdatedAt: Math.max(0, Number(raw.coreUpdatedAt || raw.updatedAt || 0) || 0),
        lastActiveDate: String(raw.lastActiveDate || raw.activeDate || '').trim(),
        updatedAt: Math.max(0, Number(raw.updatedAt || 0) || 0)
    };
}

function createPrivateContactLongMemorySeed(contact = {}) {
    const summaryMemory = normalizePrivateContactArchiveText(contact?.summaryMemory || '', PRIVATE_CONTACT_SUMMARY_TEXT_LIMIT);
    const summaryStory = normalizePrivateContactArchiveText(contact?.summaryStory || '', PRIVATE_CONTACT_SUMMARY_TEXT_LIMIT);
    const summaryDigest = normalizePrivateContactArchiveText(contact?.summaryDigest || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT);
    const seedEntries = [];
    const createdAt = Math.max(0, Number(contact?.summaryUpdatedAt || Date.now()) || Date.now());
    if (summaryMemory) seedEntries.push({ id: `seed-memory-${contact?.id || 'contact'}`, text: summaryMemory, source: 'legacy-summary', core: false, createdAt, updatedAt: createdAt, axis: { what: summaryMemory } });
    if (summaryStory) seedEntries.push({ id: `seed-story-${contact?.id || 'contact'}`, text: summaryStory, source: 'legacy-story', core: false, createdAt, updatedAt: createdAt, axis: { what: summaryStory } });
    if (summaryDigest) seedEntries.push({ id: `seed-relation-${contact?.id || 'contact'}`, text: summaryDigest, source: 'legacy-relation', core: true, createdAt, updatedAt: createdAt, axis: { who: summaryDigest, feel: summaryDigest } });
    return normalizePrivateContactLongMemoryState({
        charId: contact?.id || 'contact_memory',
        entries: seedEntries,
        updatedAt: createdAt,
        coreUpdatedAt: summaryDigest ? createdAt : 0
    }, contact?.id || 'contact_memory');
}

function mergePrivateLongMemoryList(existing, incoming, normalizer, keyGetter, limit) {
    const map = new Map();
    normalizer(existing).forEach(item => {
        const key = keyGetter(item);
        if (key) map.set(key, item);
    });
    normalizer(incoming).forEach(item => {
        const key = keyGetter(item);
        if (!key) return;
        const old = map.get(key);
        map.set(key, old ? { ...old, ...item, createdAt: Math.min(old.createdAt || item.createdAt || 0, item.createdAt || old.createdAt || 0), updatedAt: Math.max(old.updatedAt || 0, item.updatedAt || 0) } : item);
    });
    return Array.from(map.values())
        .sort((left, right) => ((right.core ? 1 : 0) - (left.core ? 1 : 0)) || ((right.intensity || right.importance || right.emotionalWeight || 0) - (left.intensity || left.importance || left.emotionalWeight || 0)) || ((right.updatedAt || 0) - (left.updatedAt || 0)))
        .slice(0, limit);
}

function mergePrivateContactLongMemoryState(base = {}, patch = {}, charId = 'contact_memory') {
    const current = normalizePrivateContactLongMemoryState(base, charId);
    const incoming = normalizePrivateContactLongMemoryState(patch, charId);
    const now = Date.now();
    return normalizePrivateContactLongMemoryState({
        charId: current.charId || incoming.charId || charId,
        entries: mergePrivateLongMemoryList(current.entries, incoming.entries, normalizePrivateContactLongMemoryEntries, item => normalizePrivateContactSummaryEventText(item.text).slice(0, 160).toLowerCase(), PRIVATE_CONTACT_LONG_MEMORY_ENTRY_LIMIT),
        promises: mergePrivateLongMemoryList(current.promises, incoming.promises, normalizePrivateContactPromiseRecords, item => normalizePrivateContactSummaryEventText(item.text).slice(0, 160).toLowerCase(), PRIVATE_CONTACT_PROMISE_LIMIT),
        coreMemories: mergePrivateLongMemoryList(current.coreMemories, incoming.coreMemories, normalizePrivateContactCoreMemoryRecords, item => normalizePrivateContactSummaryEventText(item.text).slice(0, 180).toLowerCase(), PRIVATE_CONTACT_CORE_MEMORY_LIMIT),
        dailySummaries: mergePrivateLongMemoryList(current.dailySummaries, incoming.dailySummaries, normalizePrivateContactDailySummaries, item => String(item.date || item.id || '').trim(), PRIVATE_CONTACT_DAILY_SUMMARY_LIMIT),
        autonomousInsights: [...new Set([...current.autonomousInsights, ...incoming.autonomousInsights])].slice(0, PRIVATE_CONTACT_AUTONOMOUS_INSIGHT_LIMIT),
        recallHints: [...new Set([...current.recallHints, ...incoming.recallHints])].slice(0, PRIVATE_CONTACT_RECALL_HINT_LIMIT),
        coreUpdatedAt: Math.max(current.coreUpdatedAt || 0, incoming.coreUpdatedAt || 0),
        lastActiveDate: incoming.lastActiveDate || current.lastActiveDate || getPrivateContactLocalDateKey(now),
        updatedAt: Math.max(current.updatedAt || 0, incoming.updatedAt || 0, now)
    }, charId);
}

function normalizePrivateContactProfileSetting(value) {
    return String(value || '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function getPrivateContactDisplayName(contact = {}) {
    return normalizePrivateContactRemark(contact?.remark)
        || String(contact?.title || '').trim()
        || String(contact?.subtitle || '').trim()
        || 'Contact';
}

function formatPrivateContactAwareTime(date = new Date(), timezone = getPrivateRuntimeTimezone()) {
    const resolvedTimezone = normalizePrivateContactTimezone(timezone) || getPrivateRuntimeTimezone();
    try {
        const formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: resolvedTimezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${formatter.format(date)} · ${resolvedTimezone}`;
    } catch (error) {
        return `${date.toLocaleString('zh-CN')} · ${resolvedTimezone}`;
    }
}

function formatPrivateContactArchiveTime(value = 0) {
    const timestamp = Number(value) || 0;
    if (!timestamp) return '';
    try {
        return new Intl.DateTimeFormat('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date(timestamp));
    } catch (error) {
        return '';
    }
}

function extractPrivateContactSystemCapsuleText(value) {
    const text = String(value || '').trim();
    return text.startsWith(PRIVATE_CONTACT_SYSTEM_CAPSULE_PREFIX)
        ? text.slice(PRIVATE_CONTACT_SYSTEM_CAPSULE_PREFIX.length).trim()
        : '';
}

function createPrivateContactSystemCapsuleText(value) {
    const content = String(value || '').trim();
    return content ? `${PRIVATE_CONTACT_SYSTEM_CAPSULE_PREFIX}${content}` : '';
}

function buildPrivateContactCapsulePromptNote(message = {}) {
    const capsuleText = extractPrivateContactSystemCapsuleText(message?.content || '');
    if (!capsuleText) return '';
    return [
        '[最近归档事件]',
        capsuleText
    ].join('\n');
}

function normalizePrivateWanyeSessionCount(value, minimum = 0) {
    const parsed = Math.round(Number(value) || 0);
    return Math.max(minimum, parsed);
}

function getPrivateContactWanyeBindingSnapshot() {
    const safeContactId = String(privateActiveContactChatId || '').trim()
        ? normalizePrivateContactRecordId(privateActiveContactChatId)
        : '';
    if (!safeContactId) {
        return {
            ok: false,
            reason: 'missing_contact_id',
            message: '当前没有锁定私叙联系人 ID。先在私叙中打开目标联系人，再进入晚契。'
        };
    }
    const contact = getPrivateContactById(safeContactId);
    if (!contact) {
        return {
            ok: false,
            reason: 'contact_not_found',
            message: '当前锁定的私叙联系人不存在，晚契不会跨人归档。'
        };
    }
    const record = getPrivateContactProfileRecord(contact);
    const accountId = normalizePrivateDossierAccount(contact?.accountId || record?.accountId || '');
    if (!accountId) {
        return {
            ok: false,
            reason: 'missing_account_id',
            message: '当前联系人没有可用的账号 ID，晚契不会跨人归档。'
        };
    }
    return {
        ok: true,
        contactId: safeContactId,
        accountId,
        title: getPrivateContactDisplayName(contact),
        subtitle: String(contact?.subtitle || '').trim()
    };
}

function listPrivateWanyeContacts() {
    return buildPrivateContactChatPreviewItems()
        .filter(item => {
            const type = String(item?.contact?.type || '').trim();
            return Boolean(item?.contact?.id) && !['assistant', 'group'].includes(type);
        })
        .map((item, index) => {
            const contact = item.contact;
            const record = getPrivateContactProfileRecord(contact);
            const profile = resolvePrivateContactGeneratedProfile(contact, record || {});
            const contactId = normalizePrivateContactRecordId(contact.id);
            const accountId = normalizePrivateDossierAccount(contact?.accountId || record?.accountId || '');
            return {
                contactId,
                accountId,
                title: getPrivateContactDisplayName(contact),
                subtitle: buildPrivateContactChatSubtitle(contact),
                signature: normalizePrivateContactSignature(profile?.signature || contact?.signature || ''),
                profession: String(profile?.profession || contact?.profession || '').trim().slice(0, 24),
                preview: trimPrivateContactChatSnippet(item?.preview || '', 72),
                note: normalizePrivateContactArchiveText(contact?.note || record?.setting || '', 180),
                avatar: String(contact?.avatar || '').trim(),
                updatedAt: Number(item?.updatedAt) || 0,
                unread: Math.max(0, Number(item?.unread) || 0),
                available: Boolean(accountId),
                availabilityMessage: accountId ? '' : '该联系人缺少账号 ID，晚契不会对其归档。',
                sortIndex: index
            };
        });
}

const PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID = 'private_wanye_script_library_state_v1';
const PRIVATE_WANYE_SESSION_DRAFT_STATE_ID = 'private_wanye_session_draft_state_v1';
const PRIVATE_WANYE_SCRIPT_GENERATION_COUNT = 4;
const PRIVATE_WANYE_RANDOM_TAG_COUNT = 6;
const PRIVATE_WANYE_SCRIPT_TAG_POOL = Object.freeze([
    '4i', 'SM', 'D/s', 'Femdom', 'Brat', 'Brat taming', 'Switch', 'Subspace', 'Aftercare', 'Praise kink',
    'Degradation', 'Bondage', 'Collar / Leash', 'Edging', 'Overstimulation', 'Begging', 'Power exchange', 'Role reversal', 'Service top', 'Service sub',
    'Soft dom', 'Hard dom', 'Sensory play', 'Restraint', 'Ownership kink', 'Voice kink', 'Eye contact', 'Hair pulling', 'Spanking', 'Blindfold',
    'Tease and denial', 'Marking', 'Body worship', 'Voyeurism', 'Exhibitionism', 'Wax play', 'Impact play', 'Consent play', 'Size kink', 'Dirty talk'
]);
let privateWanyeScriptLibraryState = null;
let privateWanyeScriptLibraryStateReady = null;
let privateWanyeSessionDraftState = null;
let privateWanyeSessionDraftStateReady = null;

function normalizePrivateWanyeScriptText(value, maxLength = 220) {
    return String(value || '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, maxLength);
}

function normalizePrivateWanyeScriptRecord(value = {}, contactId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId || value?.contactId || '');
    const title = normalizePrivateWanyeScriptText(value?.title || value?.name || '未命名剧本', 48) || '未命名剧本';
    const tag = normalizePrivateWanyeScriptText(value?.tag || value?.label || '晚契', 48) || '晚契';
    const summary = normalizePrivateWanyeScriptText(value?.summary || value?.desc || value?.description || '', 260);
    return {
        id: String(value?.id || `wanye-script-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`).trim(),
        contactId: safeContactId,
        title,
        tag,
        summary,
        source: String(value?.source || value?.origin || 'manual').trim() === 'generated' ? 'generated' : 'manual',
        createdAt: Math.max(0, Number(value?.createdAt) || Date.now()),
        updatedAt: Math.max(0, Number(value?.updatedAt) || Number(value?.createdAt) || Date.now())
    };
}

function normalizePrivateWanyeScriptList(value, contactId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    return (Array.isArray(value) ? value : [])
        .map(item => normalizePrivateWanyeScriptRecord(item, safeContactId))
        .filter(item => item.contactId === safeContactId)
        .sort((left, right) => {
            const timeDiff = (Number(right.updatedAt) || 0) - (Number(left.updatedAt) || 0);
            if (timeDiff !== 0) return timeDiff;
            return String(left.title || '').localeCompare(String(right.title || ''));
        });
}

function normalizePrivateWanyeScriptLibraryState(value) {
    const source = value && typeof value === 'object' ? value : {};
    const rawMap = source.scriptsByContact && typeof source.scriptsByContact === 'object'
        ? source.scriptsByContact
        : source.contacts && typeof source.contacts === 'object'
            ? source.contacts
            : {};
    const scriptsByContact = {};
    Object.entries(rawMap).forEach(([rawContactId, scripts]) => {
        const safeContactId = normalizePrivateContactRecordId(rawContactId);
        if (!safeContactId) return;
        scriptsByContact[safeContactId] = normalizePrivateWanyeScriptList(scripts, safeContactId);
    });
    return { scriptsByContact };
}

async function loadPrivateWanyeScriptLibraryState() {
    if (privateWanyeScriptLibraryState) return privateWanyeScriptLibraryState;
    if (privateWanyeScriptLibraryStateReady) return privateWanyeScriptLibraryStateReady;
    privateWanyeScriptLibraryStateReady = (async () => {
        let rawState = null;
        try {
            if (typeof db !== 'undefined' && db?.edits?.get) {
                const saved = await db.edits.get(PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID);
                rawState = typeof saved?.content === 'string' ? JSON.parse(saved.content) : saved?.content;
            }
        } catch (error) {
            console.warn('Private Wanye script library load failed:', error);
        }
        if (!rawState) {
            try {
                const saved = localStorage.getItem(PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID);
                rawState = saved ? JSON.parse(saved) : null;
            } catch (error) {
                rawState = null;
            }
        }
        privateWanyeScriptLibraryState = normalizePrivateWanyeScriptLibraryState(rawState);
        return privateWanyeScriptLibraryState;
    })();
    const state = await privateWanyeScriptLibraryStateReady;
    privateWanyeScriptLibraryStateReady = null;
    return state;
}

async function persistPrivateWanyeScriptLibraryState(state) {
    const normalizedState = normalizePrivateWanyeScriptLibraryState(state);
    privateWanyeScriptLibraryState = normalizedState;
    try {
        if (typeof db !== 'undefined' && db?.edits?.put) {
            await db.edits.put({
                id: PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID,
                type: 'private-wanye-script-library',
                content: JSON.stringify(normalizedState)
            });
        } else {
            localStorage.setItem(PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID, JSON.stringify(normalizedState));
        }
    } catch (error) {
        console.warn('Private Wanye script library save failed:', error);
        try {
            localStorage.setItem(PRIVATE_WANYE_SCRIPT_LIBRARY_STATE_ID, JSON.stringify(normalizedState));
        } catch (storageError) {
            console.warn('Private Wanye script library local fallback failed:', storageError);
        }
    }
    return normalizedState;
}

async function listPrivateWanyeScripts(contactId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    if (!safeContactId) return [];
    const state = await loadPrivateWanyeScriptLibraryState();
    return normalizePrivateWanyeScriptList(state?.scriptsByContact?.[safeContactId] || [], safeContactId);
}

async function savePrivateWanyeScriptRecord(contactId = '', payload = {}) {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    if (!safeContactId) return null;
    const state = await loadPrivateWanyeScriptLibraryState();
    const currentList = normalizePrivateWanyeScriptList(state?.scriptsByContact?.[safeContactId] || [], safeContactId);
    const safeRecord = normalizePrivateWanyeScriptRecord({
        ...payload,
        contactId: safeContactId,
        updatedAt: Date.now(),
        createdAt: payload?.createdAt || Date.now()
    }, safeContactId);
    const nextList = [safeRecord, ...currentList.filter(item => String(item.id || '').trim() !== safeRecord.id)];
    await persistPrivateWanyeScriptLibraryState({
        ...state,
        scriptsByContact: {
            ...(state?.scriptsByContact || {}),
            [safeContactId]: nextList
        }
    });
    return safeRecord;
}

async function deletePrivateWanyeScriptRecord(contactId = '', scriptId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    const safeScriptId = String(scriptId || '').trim();
    if (!safeContactId || !safeScriptId) return false;
    const state = await loadPrivateWanyeScriptLibraryState();
    const currentList = normalizePrivateWanyeScriptList(state?.scriptsByContact?.[safeContactId] || [], safeContactId);
    const nextList = currentList.filter(item => String(item.id || '').trim() !== safeScriptId);
    if (nextList.length === currentList.length) return false;
    await persistPrivateWanyeScriptLibraryState({
        ...state,
        scriptsByContact: {
            ...(state?.scriptsByContact || {}),
            [safeContactId]: nextList
        }
    });
    return true;
}

function buildPrivateWanyeSessionDraftKey(payload = {}) {
    const safeContactId = normalizePrivateContactRecordId(payload?.contactId || '');
    if (!safeContactId) return '';
    const safeScenarioId = String(payload?.scenarioId || payload?.scriptId || '').trim();
    const safeScriptTitle = normalizePrivateWanyeScriptText(payload?.scriptTitle || payload?.title || '', 48);
    const suffix = safeScenarioId || safeScriptTitle;
    return suffix ? `${safeContactId}::${suffix}` : '';
}

function normalizePrivateWanyeSessionDraftMessage(value = {}, index = 0) {
    const role = value?.role === 'assistant'
        ? 'assistant'
        : value?.role === 'system'
            ? 'system'
            : 'user';
    const id = String(value?.id || `wanye-draft-${Date.now()}-${index}`).trim();
    const createdAt = Math.max(0, Number(value?.createdAt) || Date.now());
    if (role === 'assistant') {
        const segments = normalizePrivateWanyeSegments(value?.segments, { fullText: true });
        if (!segments.length) return null;
        return {
            id,
            role,
            segments,
            charCount: Number(value?.charCount) || countPrivateWanyeReplyChars(segments),
            createdAt
        };
    }
    if (role === 'system') {
        const text = normalizePrivateContactSummaryEventText(value?.text || '').slice(0, 240);
        if (!text) return null;
        return { id, role, text, createdAt };
    }
    const speech = normalizePrivateContactSummaryEventText(value?.speech || '').slice(0, 2400);
    const action = normalizePrivateContactSummaryEventText(value?.action || '').slice(0, 2400);
    const text = normalizePrivateContactSummaryEventText(value?.text || '').slice(0, 2400);
    if (!speech && !action && !text) return null;
    return {
        id,
        role,
        speech,
        action,
        text,
        createdAt
    };
}

function normalizePrivateWanyeSessionDraftMessages(value) {
    return (Array.isArray(value) ? value : [])
        .map((item, index) => normalizePrivateWanyeSessionDraftMessage(item, index))
        .filter(Boolean);
}

function normalizePrivateWanyeSessionDraftRecord(value = {}, binding = {}) {
    const safeContactId = normalizePrivateContactRecordId(binding?.contactId || value?.contactId || '');
    const safeAccountId = normalizePrivateDossierAccount(binding?.accountId || value?.accountId || '');
    const scenarioId = String(value?.scenarioId || value?.scriptId || '').trim();
    const scriptTitle = normalizePrivateWanyeScriptText(value?.scriptTitle || value?.title || '未命名剧本', 48) || '未命名剧本';
    const key = buildPrivateWanyeSessionDraftKey({
        contactId: safeContactId,
        scenarioId,
        scriptTitle
    });
    const messages = normalizePrivateWanyeSessionDraftMessages(value?.messages);
    const leadRole = normalizePrivateWanyeLeadRole(value?.leadRole || value?.position || 'contact');
    const turnDirective = normalizePrivateWanyeTurnDirective(value?.turnDirective || null);
    return {
        key,
        id: String(value?.id || `wanye-draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`).trim(),
        contactId: safeContactId,
        accountId: safeAccountId,
        partner: normalizePrivateWanyeScriptText(value?.partner || binding?.title || '联系人', 48) || '联系人',
        scenarioId,
        scriptTitle,
        scriptTag: normalizePrivateWanyeScriptText(value?.scriptTag || value?.tag || '晚契', 48) || '晚契',
        scriptSummary: normalizePrivateWanyeScriptText(value?.scriptSummary || value?.summary || value?.desc || '', 260),
        leadRole,
        position: getPrivateWanyeLeadRoleLabel(leadRole),
        messages,
        startedAt: Math.max(0, Number(value?.startedAt) || Date.now()),
        phaseStartedAt: Math.max(0, Number(value?.phaseStartedAt) || Number(value?.startedAt) || Date.now()),
        archiveCursor: Math.min(messages.length, Math.max(0, Number(value?.archiveCursor) || 0)),
        turnDirective,
        updatedAt: Math.max(0, Number(value?.updatedAt) || Date.now())
    };
}

function normalizePrivateWanyeSessionDraftState(value) {
    const source = value && typeof value === 'object' ? value : {};
    const rawMap = source.draftsByKey && typeof source.draftsByKey === 'object'
        ? source.draftsByKey
        : source.sessions && typeof source.sessions === 'object'
            ? source.sessions
            : {};
    const draftsByKey = {};
    Object.values(rawMap).forEach(record => {
        const normalized = normalizePrivateWanyeSessionDraftRecord(record);
        if (!normalized.key || !normalized.contactId || !normalized.accountId) return;
        draftsByKey[normalized.key] = normalized;
    });
    return { draftsByKey };
}

async function loadPrivateWanyeSessionDraftState() {
    if (privateWanyeSessionDraftState) return privateWanyeSessionDraftState;
    if (privateWanyeSessionDraftStateReady) return privateWanyeSessionDraftStateReady;
    privateWanyeSessionDraftStateReady = (async () => {
        let rawState = null;
        try {
            if (typeof db !== 'undefined' && db?.edits?.get) {
                const saved = await db.edits.get(PRIVATE_WANYE_SESSION_DRAFT_STATE_ID);
                rawState = typeof saved?.content === 'string' ? JSON.parse(saved.content) : saved?.content;
            }
        } catch (error) {
            console.warn('Private Wanye session draft load failed:', error);
        }
        if (!rawState) {
            try {
                const saved = localStorage.getItem(PRIVATE_WANYE_SESSION_DRAFT_STATE_ID);
                rawState = saved ? JSON.parse(saved) : null;
            } catch (error) {
                rawState = null;
            }
        }
        privateWanyeSessionDraftState = normalizePrivateWanyeSessionDraftState(rawState);
        return privateWanyeSessionDraftState;
    })();
    const state = await privateWanyeSessionDraftStateReady;
    privateWanyeSessionDraftStateReady = null;
    return state;
}

async function persistPrivateWanyeSessionDraftState(state) {
    const normalizedState = normalizePrivateWanyeSessionDraftState(state);
    privateWanyeSessionDraftState = normalizedState;
    try {
        if (typeof db !== 'undefined' && db?.edits?.put) {
            await db.edits.put({
                id: PRIVATE_WANYE_SESSION_DRAFT_STATE_ID,
                type: 'private-wanye-session-draft',
                content: JSON.stringify(normalizedState)
            });
        } else {
            localStorage.setItem(PRIVATE_WANYE_SESSION_DRAFT_STATE_ID, JSON.stringify(normalizedState));
        }
    } catch (error) {
        console.warn('Private Wanye session draft save failed:', error);
        try {
            localStorage.setItem(PRIVATE_WANYE_SESSION_DRAFT_STATE_ID, JSON.stringify(normalizedState));
        } catch (storageError) {
            console.warn('Private Wanye session draft local fallback failed:', storageError);
        }
    }
    return normalizedState;
}

async function getPrivateWanyeSessionDraft(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const key = buildPrivateWanyeSessionDraftKey({
        contactId: binding.contactId,
        scenarioId: payload?.scenarioId || payload?.scriptId || '',
        scriptTitle: payload?.scriptTitle || payload?.title || ''
    });
    if (!key) {
        return {
            ok: false,
            reason: 'missing_scenario',
            message: '晚契草稿必须绑定到明确的剧本 ID 或剧本标题。'
        };
    }
    const state = await loadPrivateWanyeSessionDraftState();
    const draft = state?.draftsByKey?.[key]
        ? normalizePrivateWanyeSessionDraftRecord(state.draftsByKey[key], binding)
        : null;
    return {
        ok: true,
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title,
        draft
    };
}

async function savePrivateWanyeSessionDraft(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const draft = normalizePrivateWanyeSessionDraftRecord({
        ...payload,
        contactId: binding.contactId,
        accountId: binding.accountId,
        updatedAt: Date.now()
    }, binding);
    if (!draft.key) {
        return {
            ok: false,
            reason: 'missing_scenario',
            message: '晚契草稿必须绑定到明确的剧本 ID 或剧本标题。'
        };
    }
    const state = await loadPrivateWanyeSessionDraftState();
    await persistPrivateWanyeSessionDraftState({
        ...state,
        draftsByKey: {
            ...(state?.draftsByKey || {}),
            [draft.key]: draft
        }
    });
    return {
        ok: true,
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title,
        draft
    };
}

async function removePrivateWanyeSessionDraft(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const key = buildPrivateWanyeSessionDraftKey({
        contactId: binding.contactId,
        scenarioId: payload?.scenarioId || payload?.scriptId || '',
        scriptTitle: payload?.scriptTitle || payload?.title || ''
    });
    if (!key) {
        return {
            ok: false,
            reason: 'missing_scenario',
            message: '晚契草稿必须绑定到明确的剧本 ID 或剧本标题。'
        };
    }
    const state = await loadPrivateWanyeSessionDraftState();
    const nextDraftsByKey = {
        ...(state?.draftsByKey || {})
    };
    const removed = Boolean(nextDraftsByKey[key]);
    delete nextDraftsByKey[key];
    await persistPrivateWanyeSessionDraftState({
        ...state,
        draftsByKey: nextDraftsByKey
    });
    return {
        ok: true,
        removed,
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title
    };
}

function parsePrivateWanyeScriptGenerationResult(text, contactId = '') {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('晚契剧本生成接口没有返回内容。');
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
        ? unfenced.slice(jsonStart, jsonEnd + 1)
        : unfenced;
    const data = JSON.parse(jsonText);
    const scripts = Array.isArray(data?.scripts)
        ? data.scripts
        : Array.isArray(data?.items)
            ? data.items
            : [];
    const safeContactId = normalizePrivateContactRecordId(contactId);
    const normalizedScripts = scripts
        .map((item, index) => normalizePrivateWanyeScriptRecord({
            ...item,
            id: item?.id || `generated-${Date.now().toString(36)}-${index}`,
            source: 'generated'
        }, safeContactId))
        .filter(item => item.title && item.summary);
    if (!normalizedScripts.length) {
        throw new Error('晚契剧本生成结果为空。');
    }
    return normalizedScripts;
}


function normalizePrivateWanyeScriptTags(value) {
    const source = Array.isArray(value)
        ? value
        : String(value || '').split(/\n|,|，|、|;|；/g);
    return Array.from(new Set(
        source
            .map(item => normalizePrivateWanyeScriptText(item, 32))
            .filter(Boolean)
    )).slice(0, 32);
}

function normalizePrivateWanyeScriptBrief(value) {
    return normalizePrivateContactPromptBlock(value || '', 360);
}

function pickPrivateWanyeRandomScriptTags(count = PRIVATE_WANYE_RANDOM_TAG_COUNT) {
    const pool = PRIVATE_WANYE_SCRIPT_TAG_POOL.slice();
    for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.max(1, Math.min(12, Number(count) || PRIVATE_WANYE_RANDOM_TAG_COUNT)));
}

async function buildPrivateWanyeScriptGenerationMessages(contact = {}, options = {}) {
    const record = getPrivateContactProfileRecord(contact) || {};
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    const archive = resolvePrivateContactArchiveSnapshot(contact, record);
    const relationshipContext = buildPrivateContactChatRelationshipContext(contact);
    const promptContext = buildPrivateContactChatPromptContext(contact, getPrivateContactChatThread(contact.id) || { messages: [] }, await loadPrivateContactApiSettings(), [], await buildPrivateContactChatPrologueBlocks());
    const safeContactName = escapePrivateContactPromptTag(getPrivateContactDisplayName(contact), 40) || '联系人';
    const safeUserName = escapePrivateContactPromptTag(promptContext.userName || getPrivateDisplayName(), 40) || '用户';
    const safeContactSetting = escapePrivateContactPromptText(record?.setting || contact?.note || '未填写', 720) || '未填写';
    const safeUserSetting = escapePrivateContactPromptText(promptContext.userPersona || '未填写', 720) || '未填写';
    const safeRelationship = escapePrivateContactPromptTag(promptContext.relationship || '未设定', 72) || '未设定';
    const safeRelationshipNote = escapePrivateContactPromptText(promptContext.relationshipNote || '未填写', 360) || '未填写';
    const safeIntimacy = escapePrivateContactPromptTag(promptContext.intimacy || '未设定', 40) || '未设定';
    const safeProfession = escapePrivateContactPromptTag(profile?.profession || contact?.profession || '未填写', 40) || '未填写';
    const safeSignature = escapePrivateContactPromptText(profile?.signature || contact?.signature || '未填写', 120) || '未填写';
    const safeIpCity = escapePrivateContactPromptTag(profile?.ipCity || contact?.ipCity || '未填写', 40) || '未填写';
    const safeArchiveMemory = escapePrivateContactPromptText(archive.memory || '无', 960) || '无';
    const safeArchiveStory = escapePrivateContactPromptText(archive.story || '无', 960) || '无';
    const safeArchiveDigest = escapePrivateContactPromptText(archive.digest || '无', 720) || '无';
    const existingTitles = (await listPrivateWanyeScripts(contact.id))
        .map(item => normalizePrivateWanyeScriptText(item.title, 48))
        .filter(Boolean)
        .join('、') || '无';
    const requestedTagInput = normalizePrivateWanyeScriptTags(options?.tags || options?.scriptTags || options?.labels || []);
    const requestedTags = requestedTagInput.length ? requestedTagInput : pickPrivateWanyeRandomScriptTags();
    const safeRequestedTags = escapePrivateContactPromptText(requestedTags.join('、'), 420);
    const safeRequestedTagMode = requestedTagInput.length ? '用户选择/填写' : '用户留空后系统随机抽取';
    const safeGenerateBrief = escapePrivateContactPromptText(normalizePrivateWanyeScriptBrief(options?.brief || options?.note || options?.requirement || ''), 360) || '无';
    return [
        {
            role: 'system',
            content: [
                `你现在在为 Rinno 的晚契剧本库生成可点击进入的剧本卡片，对象是 ${safeContactName}。`,
                '这不是写晚契正文，而是生成“剧本标题 + 标签 + 剧本摘要”。',
                '只输出严格 JSON 对象，不要 Markdown，不要解释。',
                `JSON schema: {"scripts":[{"title":"...","tag":"...","summary":"..."},{"title":"...","tag":"...","summary":"..."}]}`,
                `至少返回 ${PRIVATE_WANYE_SCRIPT_GENERATION_COUNT} 个剧本。每个剧本都必须明显贴合联系人设定、关系状态、拾光记忆和当前角色气质，不能是空泛模板。`,
                'title 要像可点击的剧本名；tag 要短；summary 要写清这一场晚契的切入点、气氛、推进方式和独特点。',
                `本次标签来源：${safeRequestedTagMode}。`,
                `本次必须优先参考这些性癖标签生成：${safeRequestedTags}。每个剧本至少明显融合其中 1 个标签，但不要机械堆砌。`,
                '标签规范：4i 表示四爱，语义是女攻男受；但输出 tag 字段只写 4i，不要写括号解释，也不要把 4i 拆成“女攻”“男受”两个标签。',
                '本轮标签只能作为性癖/权力结构/身体互动偏好使用，不要混入剧情 trope 标签。',
                '晚契的产品定位是成人性爱与情欲剧本软件；所有对象默认成年人，互动以自愿同意、边界沟通和事后照护为前提，但剧本卡必须有明确情色张力、欲望方向、身体推进或权力关系，不要生成普通约会/聊天模板。',
                safeGenerateBrief !== '无' ? `本次额外生成要求：${safeGenerateBrief}` : '',
                '不同剧本之间必须有明显区别，不要改几个近义词凑数，不要重复已有剧本标题。',
                '允许暧昧、欲望、支配、试探、追逐、余韵等方向，但必须服从角色设定和关系阶段。',
                '晚契只是系统内部的场景名称，不是角色知道的 app。剧本也不必都从性交开始，可以从冷战后的拉扯、追逐、命令、亲吻、前戏、停顿或事后余温切入。'
            ].join('\n')
        },
        {
            role: 'user',
            content: [
                `用户：${safeUserName}`,
                `用户设定：${safeUserSetting}`,
                `联系人：${safeContactName}`,
                `联系人设定：${safeContactSetting}`,
                `联系人职业：${safeProfession}`,
                `联系人签名：${safeSignature}`,
                `联系人IP城市：${safeIpCity}`,
                `关系标签：${safeRelationship}`,
                `关系说明：${safeRelationshipNote}`,
                `亲密度：${safeIntimacy}`,
                `拾光长期记忆：${safeArchiveMemory}`,
                `拾光剧情线：${safeArchiveStory}`,
                `拾光关系总结：${safeArchiveDigest}`,
                `已有剧本标题：${existingTitles}`,
                `本次标签来源：${safeRequestedTagMode}`,
                `本次选择标签：${safeRequestedTags}`,
                `本次补充要求：${safeGenerateBrief}`,
                '',
                '现在请生成一组新的晚契剧本卡片。'
            ].join('\n')
        }
    ];
}

async function generatePrivateWanyeScripts(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const rawContact = getPrivateContactById(binding.contactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        return {
            ok: false,
            reason: 'contact_not_found',
            message: '晚契绑定的私叙联系人不存在。'
        };
    }
    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        return {
            ok: false,
            reason: 'api_not_configured',
            message: '请先到私叙设置中填写 API 聊天接口和模型。'
        };
    }
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
    const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            temperature: Math.min(1.1, Math.max(0.35, Number(chat.temperature) || 0.85)),
            messages: await buildPrivateWanyeScriptGenerationMessages(contact, payload)
        })
    });
    if (!response.ok) {
        return {
            ok: false,
            reason: 'api_failed',
            message: `晚契剧本生成失败：${response.status}`
        };
    }
    const result = await response.json();
    const scripts = parsePrivateWanyeScriptGenerationResult(extractPrivateContactGeneratedText(result), binding.contactId);
    const savedScripts = [];
    for (const script of scripts) {
        const saved = await savePrivateWanyeScriptRecord(binding.contactId, {
            ...script,
            source: 'generated'
        });
        if (saved) savedScripts.push(saved);
    }
    return {
        ok: true,
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title,
        scripts: savedScripts
    };
}

async function savePrivateWanyeScript(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const saved = await savePrivateWanyeScriptRecord(binding.contactId, {
        id: payload?.id,
        title: payload?.title,
        tag: payload?.tag,
        summary: payload?.summary || payload?.desc || payload?.description,
        source: String(payload?.source || 'manual').trim() === 'generated' ? 'generated' : 'manual',
        createdAt: payload?.createdAt,
        updatedAt: Date.now()
    });
    return saved
        ? { ok: true, contactId: binding.contactId, accountId: binding.accountId, title: binding.title, script: saved }
        : { ok: false, reason: 'save_failed', message: '晚契剧本保存失败。' };
}

async function removePrivateWanyeScript(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const removed = await deletePrivateWanyeScriptRecord(binding.contactId, payload?.scriptId || payload?.id);
    return removed
        ? { ok: true, contactId: binding.contactId, accountId: binding.accountId, title: binding.title }
        : { ok: false, reason: 'not_found', message: '没有找到要删除的晚契剧本。' };
}

function resolvePrivateContactStrictBinding(query = {}) {
    const explicitContactId = normalizePrivateContactRecordId(query?.contactId || '');
    const explicitAccountId = normalizePrivateDossierAccount(query?.accountId || '');
    if (explicitContactId) {
        const contact = getPrivateContactById(explicitContactId);
        if (!contact) {
            return {
                ok: false,
                reason: 'contact_not_found',
                message: '晚契记录指定的联系人 ID 不存在。'
            };
        }
        const record = getPrivateContactProfileRecord(contact);
        const accountId = normalizePrivateDossierAccount(contact?.accountId || record?.accountId || '');
        if (!accountId) {
            return {
                ok: false,
                reason: 'missing_account_id',
                message: '指定联系人没有账号 ID，晚契不会跨人归档。'
            };
        }
        if (explicitAccountId && explicitAccountId !== accountId) {
            return {
                ok: false,
                reason: 'account_id_mismatch',
                message: '晚契记录指定的账号 ID 与联系人 ID 不一致，已拒绝写入。'
            };
        }
        return {
            ok: true,
            contactId: normalizePrivateContactRecordId(explicitContactId),
            accountId,
            title: getPrivateContactDisplayName(contact),
            subtitle: String(contact?.subtitle || '').trim()
        };
    }
    if (explicitAccountId) {
        return {
            ok: false,
            reason: 'contact_id_required',
            message: '晚契归档必须提供已锁定的联系人 ID，不接受仅凭账号 ID 解析联系人。'
        };
    }
    return getPrivateContactWanyeBindingSnapshot();
}

function buildPrivateWanyeSystemCapsule(payload = {}, binding = {}) {
    const createdAt = Math.max(0, Number(payload?.endedAt || payload?.createdAt) || Date.now());
    const rounds = normalizePrivateWanyeSessionCount(payload?.rounds, 1);
    const creampies = normalizePrivateWanyeSessionCount(payload?.creampies, 0);
    const protection = Boolean(payload?.protection);
    const partner = String(payload?.partner || binding?.title || '当前联系人').trim() || '当前联系人';
    const scriptTitle = String(payload?.scriptTitle || '').trim();
    const scriptTag = String(payload?.scriptTag || '').trim();
    const leadRole = getPrivateWanyeLeadRoleLabel(payload?.leadRole || payload?.position || 'contact');
    const note = normalizePrivateContactSummaryEventText(payload?.note || '');
    const transcriptLines = normalizePrivateWanyeConversationItems(payload?.messages, { limit: 0, fullText: true })
        .filter(item => ['user', 'assistant'].includes(String(item?.role || '')))
        .map(item => `[${item.role === 'assistant' ? 'contact' : 'user'}]\n${item.text}`);
    return [
        '晚契阶段归档',
        `归档联系人ID：${binding?.accountId || '未绑定'}`,
        `对象：${partner}`,
        scriptTitle ? `剧本：${scriptTitle}` : '',
        scriptTag ? `剧本标签：${scriptTag}` : '',
        leadRole ? `主导方：${leadRole}` : '',
        `戴套：${protection ? '有' : '无'}`,
        `做爱次数：${rounds}`,
        `内射次数：${creampies}`,
        `结束时间：${formatPrivateContactArchiveTime(createdAt) || new Date(createdAt).toLocaleString('zh-CN')}`,
        note ? `补充：${note}` : '',
        '',
        '完整晚契过程：',
        transcriptLines.length ? transcriptLines.join('\n\n') : '本阶段没有新的晚契正文。'
    ].filter(Boolean).join('\n');
}

function getPrivateContactSummarySourceItems(contactId) {
    const contact = getPrivateContactById(contactId);
    const thread = getPrivateContactChatThread(contactId) || { messages: [] };
    const threadItems = normalizePrivateContactChatMessages(thread.messages)
        .flatMap(message => {
            if (['user', 'assistant'].includes(String(message?.role || ''))) {
                const text = getPrivateContactChatPlainText(message);
                if (!text) return [];
                return [{
                    kind: 'chat',
                    id: String(message.id || '').trim(),
                    role: message.role === 'assistant' ? 'assistant' : 'user',
                    text,
                    createdAt: Number(message.createdAt) || 0,
                    message
                }];
            }
            const capsuleText = extractPrivateContactSystemCapsuleText(message?.content || '');
            if (!capsuleText) return [];
            return [{
                kind: 'capsule',
                id: String(message.id || '').trim(),
                role: 'system',
                text: capsuleText,
                createdAt: Number(message.createdAt) || 0,
                message
            }];
        });
    const archiveItems = normalizePrivateContactSummaryEvents(contact?.summaryEvents || []).map(event => ({
        kind: 'archive-event',
        id: String(event.id || '').trim(),
        role: 'system',
        text: event.text,
        createdAt: Number(event.createdAt) || 0,
        message: null
    }));
    return [...threadItems, ...archiveItems].sort((left, right) => {
        const timeDiff = (Number(left?.createdAt) || 0) - (Number(right?.createdAt) || 0);
        if (timeDiff !== 0) return timeDiff;
        return String(left?.id || '').localeCompare(String(right?.id || ''));
    });
}

function createDefaultPrivateState() {
    const userPreset = createDefaultPrivateUserPreset();
    return {
        uiVersion: 13,
        registered: false,
        nickname: '',
        email: '',
        password: '',
        avatar: '',
        agreementAccepted: false,
        privacyAccepted: false,
        verifyCode: '',
        letterSent: false,
        letterSentAt: 0,
        verified: false,
        createdAt: '',
        lastLoginAt: 0,
        lastAccountId: '',
        loginOtherAccount: false,
        profileBio: '柔白页边，低声旁白。把想说的话留到安静处慢慢展开。',
        maskName: '轻声模式 / gentle mode',
        preferenceNote: '偏好慢速回复、短句留白、少量表情和柔和界面。',
        chatPlaceholder: getPrivateContactChatDefaultPlaceholderText(),
        userPresetName: userPreset.name,
        userPresetId: userPreset.id,
        userPresetGender: userPreset.gender,
        userPresetSetting: userPreset.setting,
        identities: {},
        threads: [],
        contacts: [],
        moments: []
    };
}

function createPrivateRegistrationDraft(identities = {}, lastAccountId = '') {
    const slots = normalizePrivateIdentitySlots(identities);
    const normalizedLastId = normalizePrivateIdentityId(lastAccountId);
    return {
        ...createDefaultPrivateState(),
        identities: slots,
        lastAccountId: isCompleteRegisteredPrivateAccount(slots[normalizedLastId]) ? normalizedLastId : '',
        loginOtherAccount: false
    };
}

function createPrivateTwoDigit() {
    return String(Math.floor(Math.random() * 90) + 10);
}

function createPrivateSixDigit() {
    return String(Math.floor(Math.random() * 900000) + 100000);
}

function hashPrivateSeed(value) {
    const text = String(value || 'private-contact');
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function pickPrivateSeedValue(list, seed, offset = 0) {
    if (!Array.isArray(list) || !list.length) return '';
    return list[Math.abs((seed + offset) % list.length)];
}

function getPrivateContactSeed(record = {}, contact = {}) {
    return hashPrivateSeed([
        record?.type,
        record?.recordId,
        record?.accountId,
        record?.name,
        record?.nickname,
        record?.nationality,
        record?.setting,
        contact?.id,
        contact?.title
    ].filter(Boolean).join('|'));
}

function escapePrivateContactRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesPrivateContactNationalityKeyword(text, keyword) {
    const source = String(text || '').trim().toLowerCase();
    const target = String(keyword || '').trim().toLowerCase();
    if (!source || !target) return false;
    if (/^[a-z]{1,3}$/.test(target)) {
        return new RegExp(`(^|[^a-z])${escapePrivateContactRegExp(target)}([^a-z]|$)`, 'i').test(source);
    }
    return source.includes(target);
}

function resolvePrivateContactNationality(contact = {}, record = null) {
    const profileRecord = record || getPrivateContactProfileRecord(contact) || {};
    return String(
        contact?.nationality
        || profileRecord?.nationality
        || contact?.country
        || profileRecord?.country
        || ''
    ).trim();
}

function getPrivateContactChatLanguageSpec(contact = {}, record = null) {
    const nationality = resolvePrivateContactNationality(contact, record);
    const text = nationality.toLowerCase();
    const matched = PRIVATE_CONTACT_CHAT_LANGUAGE_RULES.find(rule => (
        rule.keywords.some(keyword => matchesPrivateContactNationalityKeyword(text, keyword))
    ));
    if (matched) {
        return {
            nationality,
            language: matched.language,
            code: matched.code,
            foreign: Boolean(matched.foreign),
            translationRequired: Boolean(matched.foreign)
        };
    }
    if (!nationality) {
        return {
            nationality: '',
            language: '简体中文',
            code: 'zh',
            foreign: false,
            translationRequired: false
        };
    }
    return {
        nationality,
        language: '该国籍对应的官方或最常用本国语言',
        code: 'en',
        foreign: true,
        translationRequired: true
    };
}

function shouldPrivateContactChatShowTranslation(contact = {}) {
    return Boolean(getPrivateContactChatLanguageSpec(contact).translationRequired);
}

function normalizePrivateContactStageLabel(value, index = 0) {
    const raw = String(value || '').trim();
    if (!raw) return PRIVATE_CONTACT_STAGE_LABELS[index] || `阶段 ${index + 1}`;
    if (/(幼|童|孩提|儿时|6-12岁|child)/i.test(raw)) return PRIVATE_CONTACT_STAGE_LABELS[0];
    if (/(少|青春|学生|13-18岁|teen)/i.test(raw)) return PRIVATE_CONTACT_STAGE_LABELS[1];
    if (/(今|现|成年|当下|现在|19-25岁|adult|present|now)/i.test(raw)) return PRIVATE_CONTACT_STAGE_LABELS[2];
    return PRIVATE_CONTACT_STAGE_LABELS[index] || raw.slice(0, 18);
}

function coercePrivateLifeStagesSource(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
        return Object.entries(value).map(([age, experience]) => ({ age, experience }));
    }
    if (typeof value === 'string') {
        return value
            .replace(/\r/g, '')
            .split(/\n{2,}/)
            .map((item, index) => ({ age: normalizePrivateContactStageLabel('', index), experience: item }));
    }
    return [];
}

function normalizePrivateContactLifeStages(value) {
    return coercePrivateLifeStagesSource(value)
        .map((item, index) => {
            if (!item) return null;
            if (typeof item === 'string') {
                const experience = String(item).trim().slice(0, 220);
                return experience
                    ? { age: normalizePrivateContactStageLabel('', index), experience }
                    : null;
            }
            const age = normalizePrivateContactStageLabel(
                item.age || item.stage || item.period || '',
                index
            ).slice(0, 18);
            const experience = String(item.experience || item.text || item.story || item.content || '')
                .trim()
                .slice(0, 220);
            return experience ? { age, experience } : null;
        })
        .filter(Boolean)
        .map((item, index) => ({
            ...item,
            __stageIndex: PRIVATE_CONTACT_STAGE_LABELS.indexOf(item.age),
            __sourceIndex: index
        }))
        .sort((left, right) => {
            const leftStage = left.__stageIndex >= 0 ? left.__stageIndex : PRIVATE_CONTACT_STAGE_LABELS.length;
            const rightStage = right.__stageIndex >= 0 ? right.__stageIndex : PRIVATE_CONTACT_STAGE_LABELS.length;
            if (leftStage !== rightStage) return leftStage - rightStage;
            return left.__sourceIndex - right.__sourceIndex;
        })
        .map(({ __stageIndex, __sourceIndex, ...item }) => item)
        .slice(0, 3);
}

function normalizePrivateContactSignature(value) {
    return String(value || '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^[`"'“”'‘’\s]+|[`"'“”'‘’\s]+$/g, '')
        .trim()
        .slice(0, 25);
}

function getPrivateFallbackSignaturePool(record = {}) {
    const text = `${record?.setting || ''} ${record?.monologue || ''}`.toLowerCase();
    if (/(温柔|细腻|柔和|治愈|照顾|包容|体贴|gentle|soft|heal|care)/i.test(text)) {
        return [
            '把温柔留给真正靠近的人',
            '先照顾情绪，再慢慢开口',
            '安静一点，也会认真偏心',
            '不急着热闹，只认真回应心意'
        ];
    }
    if (/(冷|淡|静|沉默|克制|疏离|慢热|隐忍|reserved|cold|quiet)/i.test(text)) {
        return [
            '慢热，却会认真回应真心',
            '不轻易靠近，也不轻易忘记',
            '话不多，心事却记得很深',
            '把距离放轻，把真心放深'
        ];
    }
    if (/(浪漫|自由|诗|艺术|音乐|画|摄影|writer|poet|music|art)/i.test(text)) {
        return [
            '把心事写进光影和留白里',
            '比起热闹，更相信回声和余温',
            '习惯让浪漫藏在细节以后',
            '情绪不必直白，余韵会替我开口'
        ];
    }
    if (/(开朗|明媚|热烈|直接|太阳|活泼|bright|warm|sunny)/i.test(text)) {
        return [
            '热烈是真，偏心也是真',
            '喜欢直接一点，也喜欢真心',
            '心动会承认，失望也会走开',
            '把喜欢说清楚，把距离留干净'
        ];
    }
    return [
        '不赶时间，只等值得的人',
        '安静生活，认真回应靠近',
        '克制一点，才听得见真心',
        '会观察，也会在意细枝末节'
    ];
}

function createPrivateFallbackSignature(record = {}, seed = 0) {
    const signature = normalizePrivateContactSignature(
        pickPrivateSeedValue(getPrivateFallbackSignaturePool(record), seed, 11)
    );
    return signature.length >= 10 ? signature : '把距离放轻，把真心放深';
}

function getPrivateContactPhoneRule(nationality) {
    const text = String(nationality || '').trim().toLowerCase();
    return PRIVATE_CONTACT_PHONE_RULES.find(rule => (
        rule.keywords.some(keyword => text.includes(String(keyword).toLowerCase()))
    )) || PRIVATE_CONTACT_DEFAULT_PHONE_RULE;
}

function getPrivateContactPhoneRuleFromValue(rawValue, nationality) {
    const raw = String(rawValue || '').trim();
    const digits = raw.replace(/\D/g, '');
    if (!digits) return getPrivateContactPhoneRule(nationality);
    const explicitInternational = /^\s*(?:\+|00)/.test(raw);
    if (explicitInternational) {
        const matched = [...PRIVATE_CONTACT_PHONE_RULES]
            .sort((left, right) => String(right.code || '').length - String(left.code || '').length)
            .find(rule => digits.startsWith(String(rule.code || '').replace(/\D/g, '')));
        if (matched) return matched;
    }
    return getPrivateContactPhoneRule(nationality);
}

function createPrivateSeedDigits(seed, length) {
    let current = hashPrivateSeed(`${seed}:${length}`);
    let digits = '';
    for (let index = 0; index < length; index += 1) {
        current = (Math.imul(current ^ (index + 1), 1103515245) + 12345) >>> 0;
        const digit = index === 0
            ? String((current % 9) + 1)
            : String(current % 10);
        digits += digit;
    }
    return digits.slice(0, length);
}

function normalizePrivateLocalPhoneDigits(rawValue, rule, seed) {
    const expectedLength = rule.lengths[Math.abs(seed) % rule.lengths.length] || 10;
    const countryCode = String(rule.code || '').replace(/\D/g, '');
    let digits = String(rawValue || '').replace(/\D/g, '');
    if (countryCode && digits.startsWith(countryCode) && digits.length > expectedLength) {
        digits = digits.slice(countryCode.length);
    }
    if (digits.length > expectedLength) digits = digits.slice(-expectedLength);
    if (!digits) digits = createPrivateSeedDigits(seed, expectedLength);
    if (digits.length < expectedLength) {
        digits = `${digits}${createPrivateSeedDigits(`${seed}:${digits}`, expectedLength)}`.slice(0, expectedLength);
    }
    if (digits.startsWith('0')) {
        digits = `${(Math.abs(seed) % 8) + 1}${digits.slice(1)}`;
    }
    return digits;
}

function formatPrivateLocalPhoneDigits(digits) {
    const value = String(digits || '').replace(/\D/g, '');
    if (value.length === 11) return `${value.slice(0, 3)} ${value.slice(3, 7)} ${value.slice(7)}`;
    if (value.length === 10) return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    if (value.length === 9) return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    if (value.length === 8) return `${value.slice(0, 4)} ${value.slice(4)}`;
    return value.match(/.{1,3}/g)?.join(' ') || value;
}

function buildPrivateContactPhoneNumber(nationality, rawValue, seed) {
    const rule = getPrivateContactPhoneRuleFromValue(rawValue, nationality);
    const digits = normalizePrivateLocalPhoneDigits(rawValue, rule, seed);
    return `${rule.code} ${formatPrivateLocalPhoneDigits(digits)}`.trim();
}

function normalizePrivateEditableContactPhoneNumber(rawValue, contact = {}, record = {}) {
    const raw = String(rawValue || '').trim();
    if (!raw) return '';
    const digitCount = raw.replace(/\D/g, '').length;
    if (digitCount < 7) return raw.slice(0, 40);
    const nationality = record?.nationality || contact?.nationality || contact?.country || '';
    return buildPrivateContactPhoneNumber(nationality, raw, getPrivateContactSeed(record, contact)).slice(0, 40);
}

function getPrivateFallbackProfession(record = {}, seed = 0) {
    const text = `${record?.setting || ''} ${record?.monologue || ''}`.toLowerCase();
    const matched = PRIVATE_CONTACT_PROFESSION_RULES.find(rule => (
        rule.keywords.some(keyword => text.includes(String(keyword).toLowerCase()))
    ));
    return matched?.label || pickPrivateSeedValue(PRIVATE_CONTACT_FALLBACK_PROFESSIONS, seed) || '自由职业者';
}

function getPrivateFallbackIpCity(record = {}, seed = 0) {
    const explicitPlace = String(record?.ipCity || record?.city || record?.location || record?.birthplace || record?.hometown || '').trim();
    if (explicitPlace) return explicitPlace;
    return '设定未指定';
}

function createPrivateFallbackHomeAddress(ipCity, seed = 0) {
    const city = String(ipCity || '').trim();
    if (!city || city === '设定未指定' || /未指定|未知|unknown/i.test(city)) return '设定未指定';
    const building = 8 + (seed % 72);
    const floor = 1 + (seed % 18);
    const room = 1 + ((seed >> 2) % 16);
    if (/[\u4e00-\u9fff]/.test(city)) {
        const road = pickPrivateSeedValue(['梧桐街', '临江路', '桂花巷', '安和里', '月见路', '旧港路'], seed, 3) || '安和里';
        return `${city}${road}${building}号 ${floor}层 ${room}室`;
    }
    const road = pickPrivateSeedValue(['Maple Street', 'Harbor Road', 'Willow Lane', 'Cedar Avenue', 'Riverside Drive'], seed, 5) || 'Maple Street';
    return `${building} ${road}, ${city}`;
}

function createPrivateFallbackLifeStages(record = {}, profile = {}, seed = 0, contact = {}) {
    const title = String(record?.nickname || record?.name || contact?.title || 'TA').trim();
    const ipCity = String(profile.ipCity || getPrivateFallbackIpCity(record, seed)).trim();
    const placeText = (!ipCity || ipCity === '设定未指定' || /未指定|未知|unknown/i.test(ipCity)) ? '一个未被资料明确标注的地方' : ipCity;
    const profession = String(profile.profession || getPrivateFallbackProfession(record, seed)).trim();
    const childhoodTrait = pickPrivateSeedValue([
        '总爱趴在窗边看天色慢慢暗下去',
        '会把听来的故事悄悄记在心里',
        '比同龄人更早学会观察大人的情绪',
        '习惯在安静的角落里自己消化心事'
    ], seed, 1) || '总爱在安静角落里发呆';
    const teenageShift = pickPrivateSeedValue([
        '开始把情绪藏进课本边角和耳机里的歌单',
        '学会在靠近与退开之间保持分寸',
        '慢慢懂得不是所有心事都适合说出口',
        '第一次认真地为自己想守住的东西较劲'
    ], seed, 5) || '慢慢懂得不是所有心事都适合说出口';
    const presentRhythm = pickPrivateSeedValue([
        '生活节奏被工作推着向前',
        '日常被行程、通勤和消息提醒切得很碎',
        '看起来比以前更稳，也更知道什么值得回应',
        '把独处和陪伴都安排得刚刚好'
    ], seed, 9) || '生活节奏被工作推着向前';
    return [
        {
            age: PRIVATE_CONTACT_STAGE_LABELS[0],
            experience: `${title} 在 ${placeText} 长大，幼时 ${childhoodTrait}。那时候的 TA 还不太会表达自己，却已经会从家里的气氛、灯影和门外的脚步声里判断情绪，也因此比许多人更早学会安静地保护内心。`
        },
        {
            age: PRIVATE_CONTACT_STAGE_LABELS[1],
            experience: `到了年少时，${title} ${teenageShift}。外表看起来也许比同龄人更平静克制，实际上只是更早明白，真正重要的情感和选择，需要时间去确认，也不该轻易交给任何人。`
        },
        {
            age: PRIVATE_CONTACT_STAGE_LABELS[2],
            experience: `如今的 ${title} 以 ${profession} 的身份生活在 ${placeText}，${presentRhythm}。TA 的住处和社交距离都收拾得很有分寸，手机常亮，却仍会把真正能拨进心里的号码、能走进家门的人，只留给极少数人。`
        }
    ];
}

function buildPrivateContactGeneratedProfile(record = {}, generated = {}, contact = {}) {
    const seed = getPrivateContactSeed(record, contact);
    const profession = String(
        generated.profession
        || contact?.profession
        || getPrivateFallbackProfession(record, seed)
    ).trim();
    const signature = normalizePrivateContactSignature(
        generated.signature
        || generated.personaSignature
        || contact?.signature
        || contact?.tagline
    );
    const ipCity = String(
        generated.ipCity
        || contact?.ipCity
        || getPrivateFallbackIpCity(record, seed)
    ).trim();
    const homeAddress = String(
        generated.homeAddress
        || contact?.homeAddress
        || createPrivateFallbackHomeAddress(ipCity, seed)
    ).trim();
    const phoneNumber = buildPrivateContactPhoneNumber(
        record?.nationality,
        generated.phoneDigits || generated.phoneNumber || contact?.phoneNumber || '',
        seed
    );
    const lifeStages = normalizePrivateContactLifeStages(generated.lifeStages || contact?.lifeStages);
    return {
        profession,
        signature: signature.length >= 10 ? signature : createPrivateFallbackSignature(record, seed),
        phoneNumber,
        ipCity,
        homeAddress,
        lifeStages: lifeStages.length ? lifeStages : createPrivateFallbackLifeStages(record, { profession, ipCity, homeAddress }, seed, contact),
        generatedProfileAt: Number(generated.generatedProfileAt || contact?.generatedProfileAt) || Date.now()
    };
}

function resolvePrivateContactGeneratedProfile(contact = {}, record = {}) {
    return buildPrivateContactGeneratedProfile(record, {
        profession: contact?.profession,
        signature: contact?.signature,
        phoneNumber: contact?.phoneNumber,
        ipCity: contact?.ipCity,
        homeAddress: contact?.homeAddress,
        lifeStages: contact?.lifeStages,
        generatedProfileAt: contact?.generatedProfileAt
    }, contact);
}

function normalizePrivateContactRecordId(value, fallback = '') {
    const raw = String(value || fallback || '').trim();
    const source = raw || `contact-${Date.now()}`;
    const stripped = source
        .replace(/^rinno-contact[-:]/i, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9:_-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `rinno-contact-${stripped || `contact-${Date.now()}`}`;
}

function createPrivateContactChatThreadId(contactId) {
    const safeContactId = String(contactId || '').trim()
        ? normalizePrivateContactRecordId(contactId)
        : '';
    return safeContactId ? `contact-chat:${safeContactId}` : `thread-${Date.now()}`;
}

function createPrivateContactChatMessageId(prefix = 'message') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePrivateContactChatQuote(value) {
    if (!value || typeof value !== 'object') return null;
    const id = String(value.id || '').trim();
    const content = String(value.content || value.text || '').replace(/\r/g, '').trim();
    if (!id || !content) return null;
    const role = value.role === 'user' ? 'user' : 'assistant';
    return {
        type: 'quote',
        id,
        role,
        senderName: String(value.senderName || value.name || (role === 'user' ? getPrivateDisplayName() : 'TA')).trim(),
        content: content.slice(0, 400),
        createdAt: Number(value.createdAt) || 0
    };
}

function normalizePrivateContactChatMessageType(item = {}) {
    const rawType = String(item.type || item.kind || item.messageType || '').trim().toLowerCase();
    const stickerUrl = normalizePrivateStickerUrl(
        item?.sticker?.url
        || item?.sticker?.src
        || item?.sticker?.href
        || item?.sticker?.image
        || item?.url
        || item?.src
        || item?.href
        || item?.image
        || ''
    );
    if (['camera', 'photo', 'snapshot', 'take_photo'].includes(rawType)) return 'camera';
    if (['image', 'picture', 'album', 'gallery', 'ai_image'].includes(rawType)) return 'image';
    if (['voice', 'audio', 'voice_message', 'voice-note', 'voice_note'].includes(rawType)) return 'voice';
    if (['location', 'loc', 'map', 'place', 'position'].includes(rawType)) return 'location';
    if (['sticker', 'emoji', 'emoji_pack', 'emoticon', 'meme'].includes(rawType)) return stickerUrl ? 'sticker' : 'text';
    if (['red_packet', 'redpacket', 'hongbao'].includes(rawType)) return 'red_packet';
    if (['open_red_packet', 'claim_red_packet', 'receive_red_packet'].includes(rawType)) return 'open_red_packet';
    if (['refund_red_packet', 'return_red_packet', 'decline_red_packet'].includes(rawType)) return 'refund_transaction';
    if (['transaction', 'transfer'].includes(rawType)) return 'transaction';
    if (['gift_receipt', 'receive_gift', 'received_gift', 'send_gift', 'gift'].includes(rawType)) return 'gift_receipt';
    if (['trace_forward', 'traceforward', 'trace_monitor_forward', 'monitor_forward', 'trace-card', 'trace_card'].includes(rawType)) return 'trace_forward';
    if (['accept_transaction', 'receive_transaction', 'accept_transfer'].includes(rawType)) return 'accept_transaction';
    if (['refund_transaction', 'return_transaction', 'decline_transaction', 'refund_transfer', 'return_transfer'].includes(rawType)) return 'refund_transaction';
    if (item.voice || item.duration || item.durationSeconds || item.duration_seconds) return 'voice';
    if (item.location || item.address || item.placeName || item.locationName) return 'location';
    if (item.sticker || item.stickerDescription) return stickerUrl ? 'sticker' : 'text';
    if (item.redPacket || item.red_packet) return 'red_packet';
    if (item.transaction) return 'transaction';
    if (item.giftReceipt || item.gift_receipt || item.gift) return 'gift_receipt';
    if (item.traceForward || item.trace_forward || item.trace) return 'trace_forward';
    if (item.image || item.imageSrc || item.imageUrl || item.dataUrl || item.dataURL) return 'camera';
    return 'text';
}

function resolvePrivateContactChatAssetUrl(path = '') {
    const safePath = String(path || '').replace(/^[\\/]+/, '').trim();
    if (!safePath) return '';
    try {
        return new URL(safePath, window.location.href).href;
    } catch (error) {
        return safePath;
    }
}

function getPrivateContactChatCameraCardImageSrc() {
    return resolvePrivateContactChatAssetUrl(PRIVATE_CONTACT_CHAT_CAMERA_CARD_IMAGE_PATH);
}

function estimatePrivateContactChatVoiceDurationSeconds(value = '') {
    const length = Array.from(String(value || '').replace(/\s+/g, '')).length;
    return Math.max(2, Math.min(60, Math.ceil(Math.max(1, length) / PRIVATE_CONTACT_CHAT_VOICE_CHAR_PER_SECOND)));
}

function getPrivateContactChatVoiceTrackWidth(durationSeconds = 2) {
    const seconds = Math.max(2, Math.min(60, Number(durationSeconds) || 2));
    const minWidth = 18;
    const maxWidth = 84;
    return Math.round(minWidth + (((seconds - 2) / 58) * (maxWidth - minWidth)));
}

function normalizePrivateContactChatImagePayload(value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const src = String(
        source.src
        || source.url
        || source.dataUrl
        || source.dataURL
        || source.content
        || item.imageSrc
        || item.imageUrl
        || item.dataUrl
        || item.dataURL
        || ''
    ).trim();
    if (!src || src.length > PRIVATE_CONTACT_CHAT_IMAGE_MAX_SOURCE_LENGTH) return null;
    if (!/^(data:image\/|blob:|https?:\/\/|file:)/i.test(src)) return null;

    const mimeFromData = src.match(/^data:([^;,]+)[;,]/i)?.[1] || '';
    return {
        type: 'image',
        src,
        name: String(source.name || item.imageName || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        mime: String(source.mime || source.type || item.imageMime || mimeFromData || '').trim().slice(0, 80),
        width: Math.max(0, Math.round(Number(source.width || item.imageWidth) || 0)),
        height: Math.max(0, Math.round(Number(source.height || item.imageHeight) || 0)),
        size: Math.max(0, Math.round(Number(source.size || item.imageSize) || 0))
    };
}

function normalizePrivateContactChatMediaDescription(value, maxLength = 180) {
    const text = String(value || '')
        .replace(/\r/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^[`"'“”‘’\s]+|[`"'“”‘’\s]+$/g, '')
        .trim();
    if (!text) return '';
    if (/(?:https?:\/\/|www\.|data:image\/|blob:|<img\b|<svg\b|!\[[\s\S]*?\]\(|\[[\s\S]*?\]\(|<\/?[a-z][\s\S]*>)/i.test(text)) return '';
    if (/(?:^|\s)[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/\S*)?(?:\.(?:png|jpe?g|gif|webp|bmp|svg)(?:\?\S*)?)?(?:\s|$)/i.test(text)) return '';
    return text;
}

function normalizePrivateContactChatDescribedMediaPayload(type, value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const description = normalizePrivateContactChatMediaDescription(
        source.description
        || source.prompt
        || source.alt
        || source.caption
        || item.description
        || item.imageDescription
        || item.image_description
        || item.prompt
        || item.caption
        || item.content
        || item.text
        || '',
        type === 'sticker' ? 120 : 180
    );
    if (!description) return null;
    return {
        type,
        description,
        title: normalizePrivateContactChatMediaDescription(source.title || item.title || '', 40)
    };
}

function normalizePrivateContactChatStickerPayload(value = {}, item = {}) {
    const sticker = normalizePrivateContactChatDescribedMediaPayload('sticker', value, item);
    if (!sticker) return null;
    const source = value && typeof value === 'object' ? value : {};
    return {
        id: String(source.id || item.stickerId || item.id || '').trim(),
        ref: normalizePrivateStickerPlainText(source.ref || source.stickerRef || item.stickerRef || '', 12).toUpperCase(),
        ...sticker,
        url: normalizePrivateStickerUrl(
            source.url
            || source.src
            || source.href
            || source.image
            || item.url
            || item.src
            || item.href
            || item.image
            || ''
        )
    };
}

function normalizePrivateContactChatVoicePayload(value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const transcript = normalizePrivateContactChatReplyText(
        source.transcript
        || source.text
        || source.content
        || item.transcript
        || item.voiceText
        || item.content
        || item.text
        || ''
    );
    if (!transcript) return null;
    const rawDuration = Number(
        source.durationSeconds
        || source.duration_seconds
        || source.duration
        || item.durationSeconds
        || item.duration_seconds
        || item.duration
        || 0
    );
    const estimatedDuration = estimatePrivateContactChatVoiceDurationSeconds(transcript);
    return {
        transcript,
        durationSeconds: Math.max(2, Math.min(60, Math.round(rawDuration || estimatedDuration)))
    };
}

function normalizePrivateContactChatLocationPayload(value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const name = normalizePrivateContactChatMediaDescription(
        source.name
        || source.place
        || source.placeName
        || source.title
        || item.name
        || item.place
        || item.placeName
        || item.locationName
        || item.title
        || item.content
        || item.text
        || '',
        72
    );
    const address = normalizePrivateContactChatMediaDescription(
        source.address
        || source.detail
        || source.subtitle
        || item.address
        || item.locationAddress
        || item.detail
        || item.subtitle
        || '',
        96
    );
    const note = normalizePrivateContactChatMediaDescription(source.note || item.note || item.description || '', 120);
    if (!name && !address) return null;
    return {
        name: name || PRIVATE_CONTACT_CHAT_LOCATION_LABEL,
        address,
        note
    };
}


function normalizePrivateContactChatGiftReceiptPayload(value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const productName = normalizePrivateContactChatMediaDescription(
        source.productName
        || source.product_name
        || source.name
        || (Array.isArray(source.items) ? source.items[0]?.name : '')
        || (Array.isArray(item.items) ? item.items[0]?.name : '')
        || item.productName
        || item.product_name
        || item.name
        || item.content
        || '',
        72
    );
    const merchantName = normalizePrivateContactChatMediaDescription(source.merchantName || source.merchant || (Array.isArray(source.items) ? source.items[0]?.merchantName || source.items[0]?.merchant : '') || item.merchantName || item.merchant || '', 48);
    const message = normalizePrivateContactChatReplyText(source.message || source.note || item.message || item.content || '我收到礼物了，谢谢你。') || '我收到礼物了，谢谢你。';
    if (!productName && !message) return null;
    return {
        type: 'gift_receipt',
        productName: productName || '礼物',
        merchantName,
        orderId: String(source.orderId || source.order_id || item.orderId || '').trim().slice(0, 48),
        quantity: Math.max(1, Math.min(99, Number.parseInt(source.quantity || item.quantity, 10) || 1)),
        price: normalizePrivateContactChatMediaDescription(source.price || item.price || '', 32),
        courier: normalizePrivateContactChatMediaDescription(source.courier || item.courier || '', 32),
        pickupCode: normalizePrivateContactChatMediaDescription(source.pickupCode || source.pickup_code || item.pickupCode || '', 24),
        message,
        receivedAt: Number(source.receivedAt || item.receivedAt) || Date.now()
    };
}


function normalizePrivateContactChatTraceForwardPayload(value = {}, item = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const clean = (input, max = 120) => normalizePrivateContactChatMediaDescription(input, max)
        || normalizePrivateContactChatReplyText(input || '').slice(0, max);
    const targetName = clean(source.targetName || source.contactName || source.objectName || item.targetName || item.contactName || '', 48);
    const camera = clean(source.camera || item.camera || '', 20);
    const roomName = clean(source.roomName || source.room || item.roomName || item.room || '室内', 32) || '室内';
    const itemName = clean(source.itemName || source.findingName || source.name || item.itemName || item.name || '监控线索', 36) || '监控线索';
    const location = clean(source.location || source.layoutLocation || item.location || item.layoutLocation || '', 90);
    const address = clean(source.address || item.address || '', 120);
    const content = normalizePrivateContactChatReplyText(source.content || source.detail || source.description || item.content || item.detail || '')
        .replace(/\r/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 520);
    const note = clean(source.monitorNote || source.note || item.monitorNote || item.note || '', 80);
    if (!itemName && !content) return null;
    return {
        type: 'trace_forward',
        targetName,
        camera,
        roomName,
        itemName,
        location,
        address,
        content: content || '监控画面里留下了一条可疑线索。',
        note,
        forwardedAt: Number(source.forwardedAt || item.forwardedAt || item.createdAt) || Date.now()
    };
}

function getPrivateContactChatMessageType(message = {}) {
    const type = normalizePrivateContactChatMessageType(message);
    return PRIVATE_CONTACT_CHAT_MESSAGE_TYPES.has(type) ? type : 'text';
}

function isPrivateContactChatCameraMessage(message = {}) {
    return normalizePrivateContactChatMessageType(message) === 'camera'
        && (
            Boolean(normalizePrivateContactChatImagePayload(message.image || {}, message))
            || Boolean(normalizePrivateContactChatDescribedMediaPayload('camera', message.media || {}, message))
        );
}

function isPrivateContactChatRichMessage(message = {}) {
    return getPrivateContactChatMessageType(message) !== 'text';
}

function getPrivateContactChatMessageSummary(message = {}, maxLength = 72) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'camera' || type === 'image') {
        const label = type === 'camera' ? PRIVATE_CONTACT_CHAT_CAMERA_LABEL : PRIVATE_CONTACT_CHAT_IMAGE_LABEL;
        return label;
    }
    if (type === 'voice') {
        const voice = normalizePrivateContactChatVoicePayload(message.voice || {}, message);
        return voice?.durationSeconds ? `${PRIVATE_CONTACT_CHAT_VOICE_LABEL} ${voice.durationSeconds}''` : PRIVATE_CONTACT_CHAT_VOICE_LABEL;
    }
    if (type === 'location') {
        const location = normalizePrivateContactChatLocationPayload(message.location || {}, message);
        const label = PRIVATE_CONTACT_CHAT_LOCATION_LABEL;
        const place = trimPrivateContactChatSnippet([location?.name, location?.address].filter(Boolean).join(' · ') || message.content || '', Math.max(12, maxLength - label.length - 2));
        return place ? `${label}：${place}` : label;
    }
    if (type === 'sticker') {
        return PRIVATE_CONTACT_CHAT_STICKER_LABEL;
    }
    if (type === 'gift_receipt') {
        const gift = normalizePrivateContactChatGiftReceiptPayload(message.giftReceipt || message.gift_receipt || message.gift || {}, message);
        const title = trimPrivateContactChatSnippet(gift?.productName || message.content || '礼物', Math.max(8, maxLength - 6));
        return `收到礼物：${title}`;
    }
    if (type === 'trace_forward') {
        const trace = normalizePrivateContactChatTraceForwardPayload(message.traceForward || message.trace_forward || message.trace || {}, message);
        const title = trimPrivateContactChatSnippet(trace?.itemName || message.content || '监控线索', Math.max(8, maxLength - 8));
        return `踪迹转发：${title}`;
    }
    return trimPrivateContactChatSnippet(message?.content || '', maxLength);
}

function getPrivateContactChatPlainText(message = {}) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'camera' || type === 'image') {
        const label = type === 'camera' ? PRIVATE_CONTACT_CHAT_CAMERA_LABEL : PRIVATE_CONTACT_CHAT_IMAGE_LABEL;
        const media = normalizePrivateContactChatDescribedMediaPayload(type, message.media || {}, message);
        const caption = String(media?.description || message.content || '').replace(/\r/g, '').trim();
        return caption ? `[${label}] ${caption}` : `[${label}]`;
    }
    if (type === 'voice') {
        const voice = normalizePrivateContactChatVoicePayload(message.voice || {}, message);
        const transcript = String(voice?.transcript || message.content || '').replace(/\r/g, '').trim();
        const duration = voice?.durationSeconds ? ` ${voice.durationSeconds}''` : '';
        return transcript ? `[${PRIVATE_CONTACT_CHAT_VOICE_LABEL}${duration}] ${transcript}` : `[${PRIVATE_CONTACT_CHAT_VOICE_LABEL}${duration}]`;
    }
    if (type === 'location') {
        const location = normalizePrivateContactChatLocationPayload(message.location || {}, message);
        const place = [location?.name, location?.address, location?.note].filter(Boolean).join(' · ');
        return place ? `[${PRIVATE_CONTACT_CHAT_LOCATION_LABEL}] ${place}` : `[${PRIVATE_CONTACT_CHAT_LOCATION_LABEL}]`;
    }
    if (type === 'sticker') {
        const sticker = normalizePrivateContactChatStickerPayload(message.sticker || {}, message);
        const description = String(sticker?.description || message.content || '').replace(/\r/g, '').trim();
        return description ? `[${PRIVATE_CONTACT_CHAT_STICKER_LABEL}] ${description}` : `[${PRIVATE_CONTACT_CHAT_STICKER_LABEL}]`;
    }
    if (type === 'gift_receipt') {
        const gift = normalizePrivateContactChatGiftReceiptPayload(message.giftReceipt || message.gift_receipt || message.gift || {}, message);
        return gift ? `[收到礼物] ${gift.productName} x${gift.quantity} ${gift.message}` : '[收到礼物]';
    }
    return String(message?.content || '').replace(/\r/g, '').trim();
}

function normalizePrivateContactChatMessages(value) {
    if (!Array.isArray(value)) return [];
    return value
        .map((item, index) => {
            if (!item || typeof item !== 'object') return null;
            const role = item.role === 'system'
                ? 'system'
                : item.role === 'user'
                    ? 'user'
                    : 'assistant';
            const messageType = role === 'system' ? 'text' : normalizePrivateContactChatMessageType(item);
            const image = (messageType === 'camera' || messageType === 'image')
                ? normalizePrivateContactChatImagePayload(item.image || {}, item)
                : null;
            const media = (messageType === 'camera' || messageType === 'image') && !image
                ? normalizePrivateContactChatDescribedMediaPayload(messageType, item.media || {}, item)
                : null;
            const voice = messageType === 'voice'
                ? normalizePrivateContactChatVoicePayload(item.voice || {}, item)
                : null;
            const location = messageType === 'location'
                ? normalizePrivateContactChatLocationPayload(item.location || {}, item)
                : null;
            const sticker = messageType === 'sticker'
                ? normalizePrivateContactChatStickerPayload(item.sticker || {}, item)
                : null;
            const redPacket = messageType === 'red_packet'
                ? normalizePrivateContactChatRedPacketPayload(item.redPacket || item.red_packet || {}, item)
                : null;
            const transaction = messageType === 'transaction'
                ? normalizePrivateContactChatTransactionPayload(item.transaction || {}, item)
                : null;
            const giftReceipt = messageType === 'gift_receipt'
                ? normalizePrivateContactChatGiftReceiptPayload(item.giftReceipt || item.gift_receipt || item.gift || {}, item)
                : null;
            let content = String(item.content || item.text || '').replace(/\r/g, '').trim();
            if ((messageType === 'camera' || messageType === 'image') && media && !content) content = media.description;
            if (messageType === 'voice' && voice) content = voice.transcript;
            if (messageType === 'location' && location && !content) content = location.name;
            if (messageType === 'sticker' && sticker) content = sticker.description;
            if (messageType === 'red_packet' && redPacket && !content) content = redPacket.greeting;
            if (messageType === 'transaction' && transaction && !content) content = transaction.note;
            if (messageType === 'gift_receipt' && giftReceipt && !content) content = giftReceipt.message;
            if (messageType === 'trace_forward' && traceForward && !content) content = traceForward.content;
            const recalled = Boolean(item.recalled);
            const recalledData = recalled && item.recalledData && typeof item.recalledData === 'object'
                ? {
                    type: 'recall',
                    actorName: String(item.recalledData.actorName || '').trim(),
                    actorRole: item.recalledData.actorRole === 'assistant' ? 'assistant' : 'user',
                    wasCaught: Boolean(item.recalledData.wasCaught),
                    content: String(item.recalledData.content || '').replace(/\r/g, '').trim().slice(0, 1200),
                    translation: normalizePrivateContactChatTranslationText(
                        item.recalledData.translation
                        || item.recalledData.translationZh
                        || item.recalledData.translation_zh
                        || ''
                    ),
                    createdAt: Number(item.recalledData.createdAt) || 0
                }
                : null;
            const translation = role === 'assistant'
                ? normalizePrivateContactChatTranslationText(
                    item.translation
                    || item.translationZh
                    || item.translation_zh
                    || item.zhTranslation
                    || ''
                )
                : '';
            if ((messageType === 'camera' || messageType === 'image') && !image && !media) return null;
            if (messageType === 'voice' && !voice) return null;
            if (messageType === 'location' && !location) return null;
            if (messageType === 'sticker' && !sticker) return null;
            if (messageType === 'red_packet' && !redPacket) return null;
            if (messageType === 'transaction' && !transaction) return null;
            if (messageType === 'gift_receipt' && !giftReceipt) return null;
            if (messageType === 'trace_forward' && !traceForward) return null;
            if (!content && !isPrivateContactChatRichMessage({ type: messageType }) && !(role === 'system' && recalled && recalledData)) return null;
            return {
                id: String(item.id || createPrivateContactChatMessageId(`message-${index}`)).trim(),
                role,
                type: messageType,
                content: content.slice(0, 1200),
                image,
                media,
                voice,
                location,
                sticker,
                redPacket,
                transaction,
                giftReceipt,
                traceForward,
                createdAt: Number(item.createdAt) || Date.now(),
                favorite: Boolean(item.favorite),
                quote: normalizePrivateContactChatQuote(item.quote),
                translation,
                recalled,
                recalledData
            };
        })
        .filter(Boolean);
}

function normalizePrivateThreads(value) {
    if (!Array.isArray(value)) return [];
    return value
        .slice(0, 50)
        .filter(item => item && typeof item === 'object')
        .map((item, index) => {
            const rawContactId = String(item.contactId || item.peerId || '').trim();
            const contactId = rawContactId ? normalizePrivateContactRecordId(rawContactId) : '';
            const messages = normalizePrivateContactChatMessages(item.messages);
            return {
                id: String(item.id || createPrivateContactChatThreadId(contactId || `thread-${index}`)).trim(),
                contactId,
                draft: String(item.draft || '').slice(0, 800),
                unread: Math.max(0, Number(item.unread) || 0),
                updatedAt: Number(item.updatedAt) || messages[messages.length - 1]?.createdAt || 0,
                messages
            };
        })
        .filter(item => item.contactId || item.messages.length);
}

const LEGACY_PRIVATE_SEED_CONTACT_IDS = new Set([
    'contact-rinno',
    'contact-niangao',
    'contact-night-crew'
]);

function isLegacyPrivateSeedContact(item) {
    return LEGACY_PRIVATE_SEED_CONTACT_IDS.has(String(item?.id || ''));
}

function hasLegacyPrivateSeedContacts(value) {
    return Array.isArray(value) && value.some(isLegacyPrivateSeedContact);
}

function hasLegacyPrivateSeedContactsInSlots(value) {
    if (!value || typeof value !== 'object') return false;
    return Object.values(value).some(slot => hasLegacyPrivateSeedContacts(slot?.contacts));
}

function normalizePrivateContactWallpaper(value) {
    const raw = String(value || '').trim().replace(/[，。；;]+$/g, '');
    if (!raw) return '';
    const prefixed = /^www\./i.test(raw) ? `https://${raw}` : raw;
    if (!/^(https?:\/\/|data:image\/|blob:|file:)/i.test(prefixed)) return '';
    return prefixed.slice(0, PRIVATE_CONTACT_CHAT_IMAGE_MAX_SOURCE_LENGTH);
}

function normalizePrivateContacts(value, defaults) {
    const source = Array.isArray(value) && value.length ? value : defaults;
    return source.filter(item => !isLegacyPrivateSeedContact(item)).slice(0, 24).map((item, index) => ({
        id: normalizePrivateContactRecordId(item?.id, `contact-${Date.now()}-${index}`),
        type: String(item?.type || 'contact'),
        title: String(item?.title || '新联系人'),
        remark: normalizePrivateContactRemark(item?.remark || item?.displayRemark),
        subtitle: String(item?.subtitle || '私叙联系人'),
        note: String(item?.note || '还没有留下更多说明。'),
        accountId: String(item?.accountId || item?.publicId || ''),
        dossierType: ['char', 'npc'].includes(String(item?.dossierType || '').toLowerCase())
            ? String(item?.dossierType || '').toLowerCase()
            : '',
        dossierRecordId: String(item?.dossierRecordId || item?.recordId || ''),
        avatar: String(item?.avatar || ''),
        homepageCover: String(item?.homepageCover || item?.cover || ''),
        chatWallpaper: normalizePrivateContactWallpaper(item?.chatWallpaper || item?.wallpaper || ''),
        ownerId: String(item?.ownerId || item?.owner || ''),
        profession: String(item?.profession || item?.job || item?.occupation || '').trim(),
        signature: normalizePrivateContactSignature(item?.signature || item?.personaSignature || item?.tagline || item?.bioLine || ''),
        nationality: String(item?.nationality || item?.country || '').trim(),
        phoneNumber: String(item?.phoneNumber || item?.phone || item?.mobile || '').trim(),
        ipCity: String(item?.ipCity || item?.ipLocation || item?.city || '').trim(),
        homeAddress: String(item?.homeAddress || item?.address || '').trim(),
        lifeStages: normalizePrivateContactLifeStages(item?.lifeStages || item?.ageStages || item?.experiences),
        timezone: normalizePrivateContactTimezone(item?.timezone || item?.timeZone || item?.tz),
        replyMinCount: resolvePrivateContactReplyCadenceConfig(item).min,
        replyMaxCount: resolvePrivateContactReplyCadenceConfig(item).max,
        timeAwarenessEnabled: Boolean(item?.timeAwarenessEnabled || item?.timeAware || item?.enableTimeAwareness),
        userNudgeSuffix: normalizePrivateContactNudgeSuffix(item?.userNudgeSuffix || item?.nudgeToContactSuffix || item?.userPatSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX),
        contactNudgeSuffix: normalizePrivateContactNudgeSuffix(item?.contactNudgeSuffix || item?.nudgeToUserSuffix || item?.charPatSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX),
        autoSummaryEnabled: Boolean(item?.autoSummaryEnabled || item?.summaryEnabled || item?.enableAutoSummary),
        autoSummaryThreshold: normalizePrivateContactSummaryThreshold(item?.autoSummaryThreshold || item?.summaryThreshold),
        summaryCheckpointCount: Math.max(0, Number(item?.summaryCheckpointCount || item?.summaryCursor) || 0),
        summaryMemory: normalizePrivateContactArchiveText(item?.summaryMemory || item?.memorySummary || ''),
        summaryStory: normalizePrivateContactArchiveText(item?.summaryStory || item?.storySummary || ''),
        summaryDigest: normalizePrivateContactArchiveText(item?.summaryDigest || item?.relationshipSummary || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT),
        summaryUpdatedAt: Math.max(0, Number(item?.summaryUpdatedAt || item?.archiveUpdatedAt) || 0),
        summaryEvents: normalizePrivateContactSummaryEvents(item?.summaryEvents || item?.archiveEvents || item?.summaryEventLog),
        longMemory: mergePrivateContactLongMemoryState(
            createPrivateContactLongMemorySeed(item || {}),
            item?.longMemory || item?.memorySystem || item?.longTermMemory || {},
            item?.id || `contact-${Date.now()}-${index}`
        ),
        backgroundKeepAliveEnabled: Boolean(item?.backgroundKeepAliveEnabled || item?.keepAliveEnabled || item?.backgroundKeepAlive),
        apiUsage: normalizePrivateContactApiUsage(item?.apiUsage || item?.usageStats || item?.tokenStats || {}),
        generatedProfileAt: Number(item?.generatedProfileAt) || 0
    }));
}

function normalizePrivateMoments(value, defaults) {
    const source = Array.isArray(value) ? value : defaults;
    return source.slice(0, 16).map((item, index) => ({
        id: String(item?.id || `moment-${Date.now()}-${index}`),
        title: String(item?.title || '今日拾光'),
        text: String(item?.text || ''),
        mood: String(item?.mood || 'ROSE GREY'),
        time: String(item?.time || 'NOW')
    })).filter(item => item.text.trim());
}

function createDefaultPrivateStickerLibraryState() {
    const now = new Date().toISOString();
    return {
        activeGroupId: PRIVATE_STICKER_DEFAULT_GROUP_ID || 'default',
        groups: [{
            id: PRIVATE_STICKER_DEFAULT_GROUP_ID || 'default',
            name: '默认',
            stickers: [],
            createdAt: now,
            updatedAt: now
        }]
    };
}

function normalizePrivateStickerPlainText(value, maxLength = 40) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

function normalizePrivateStickerUrl(value) {
    const raw = String(value || '').trim().replace(/[，。；;]+$/g, '');
    if (!raw) return '';
    const prefixed = /^www\./i.test(raw) ? `https://${raw}` : raw;
    if (!/^(https?:\/\/|data:image\/|blob:|file:)/i.test(prefixed)) return '';
    return prefixed.slice(0, 2400);
}

function createPrivateStickerId(prefix = 'sticker') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePrivateStickerItem(item, index = 0) {
    if (!item || typeof item !== 'object') return null;
    const description = normalizePrivateStickerPlainText(
        item.description || item.desc || item.label || item.name || `表情包 ${index + 1}`,
        48
    );
    const url = normalizePrivateStickerUrl(item.url || item.src || item.href || item.image || '');
    if (!description || !url) return null;
    return {
        id: String(item.id || createPrivateStickerId()).trim(),
        description,
        url,
        createdAt: String(item.createdAt || new Date().toISOString())
    };
}

function normalizePrivateStickerGroup(item, index = 0) {
    if (!item || typeof item !== 'object') return null;
    const id = String(item.id || (index === 0 ? PRIVATE_STICKER_DEFAULT_GROUP_ID : createPrivateStickerId('group'))).trim();
    const name = normalizePrivateStickerPlainText(item.name || item.title || (id === PRIVATE_STICKER_DEFAULT_GROUP_ID ? '默认' : `分组 ${index + 1}`), 18);
    const stickers = Array.isArray(item.stickers) ? item.stickers : [];
    return {
        id: id || createPrivateStickerId('group'),
        name: name || (id === PRIVATE_STICKER_DEFAULT_GROUP_ID ? '默认' : `分组 ${index + 1}`),
        stickers: stickers
            .map((sticker, stickerIndex) => normalizePrivateStickerItem(sticker, stickerIndex))
            .filter(Boolean)
            .slice(0, 400),
        createdAt: String(item.createdAt || new Date().toISOString()),
        updatedAt: String(item.updatedAt || item.createdAt || new Date().toISOString())
    };
}

function normalizePrivateStickerLibraryState(content) {
    const defaults = createDefaultPrivateStickerLibraryState();
    const stored = typeof content === 'string' ? parseStoredJson(content) : (content && typeof content === 'object' ? content : {});
    const sourceGroups = Array.isArray(stored.groups) ? stored.groups : [];
    const groupsById = new Map();
    sourceGroups.forEach((group, index) => {
        const normalized = normalizePrivateStickerGroup(group, index);
        if (!normalized || groupsById.has(normalized.id)) return;
        groupsById.set(normalized.id, normalized);
    });
    if (!groupsById.has(PRIVATE_STICKER_DEFAULT_GROUP_ID)) {
        groupsById.set(PRIVATE_STICKER_DEFAULT_GROUP_ID, defaults.groups[0]);
    }
    const defaultGroup = groupsById.get(PRIVATE_STICKER_DEFAULT_GROUP_ID);
    defaultGroup.name = '默认';
    const groups = [
        defaultGroup,
        ...Array.from(groupsById.values()).filter(group => group.id !== PRIVATE_STICKER_DEFAULT_GROUP_ID)
    ].slice(0, 24);
    const activeGroupId = groups.some(group => group.id === stored.activeGroupId)
        ? String(stored.activeGroupId)
        : PRIVATE_STICKER_DEFAULT_GROUP_ID;
    return { activeGroupId, groups };
}

function getPrivateStickerLibraryStorageId() {
    const ownerId = normalizePrivateIdentityId(
        privateState?.lastAccountId
        || privateState?.email
        || privateState?.userPresetId
        || ''
    ) || 'local';
    return `${PRIVATE_STICKER_LIBRARY_ID_PREFIX}:${ownerId}`;
}

async function loadPrivateStickerLibraryState(force = false) {
    const storageId = getPrivateStickerLibraryStorageId();
    if (!force && privateStickerLibraryLoadedFor === storageId) return privateStickerLibraryState;
    let content = null;
    let loadedFromLegacy = false;
    try {
        const saved = await db.edits.get(storageId);
        if (saved) content = saved.content;
    } catch (error) {
        console.error('表情包库加载失败:', error);
    }
    if (!content) {
        try {
            content = localStorage.getItem(storageId);
            loadedFromLegacy = Boolean(content);
        } catch (error) {
            content = null;
        }
    }
    privateStickerLibraryState = normalizePrivateStickerLibraryState(content);
    privateStickerLibraryLoadedFor = storageId;
    if (loadedFromLegacy) void savePrivateStickerLibraryState();
    renderPrivateStickerLibrary();
    return privateStickerLibraryState;
}

async function savePrivateStickerLibraryState() {
    const storageId = getPrivateStickerLibraryStorageId();
    privateStickerLibraryState = normalizePrivateStickerLibraryState(privateStickerLibraryState);
    privateStickerLibraryLoadedFor = storageId;
    const content = JSON.stringify(privateStickerLibraryState);
    try {
        localStorage.removeItem(storageId);
    } catch (error) {
        // Ignore legacy cleanup failures.
    }
    try {
        await db.edits.put({
            id: storageId,
            content,
            type: 'private-sticker-library'
        });
    } catch (error) {
        console.error('表情包库保存失败:', error);
    }
}

function getPrivateActiveStickerGroup() {
    privateStickerLibraryState = normalizePrivateStickerLibraryState(privateStickerLibraryState);
    return privateStickerLibraryState.groups.find(group => group.id === privateStickerLibraryState.activeGroupId)
        || privateStickerLibraryState.groups[0];
}

function parsePrivateStickerLine(line) {
    const source = String(line || '')
        .replace(/^[\s【\[]+|[\s】\]]+$/g, '')
        .trim();
    if (!source) return null;
    const urlMatch = source.match(/((?:https?:\/\/|data:image\/|blob:|file:|www\.)\S+)$/i);
    if (!urlMatch) return null;
    const url = normalizePrivateStickerUrl(urlMatch[1]);
    const beforeUrl = source.slice(0, urlMatch.index).replace(/[：:\s]+$/g, '').trim();
    const description = normalizePrivateStickerPlainText(beforeUrl, 48);
    if (!description || !url) return null;
    return {
        id: createPrivateStickerId(),
        description,
        url,
        createdAt: new Date().toISOString()
    };
}

function parsePrivateStickerInput(value) {
    return String(value || '')
        .replace(/[【】]/g, '\n')
        .replace(/\r/g, '')
        .split(/\n+/)
        .map(parsePrivateStickerLine)
        .filter(Boolean)
        .slice(0, 80);
}

function setPrivateStickerMessage(text, type = '') {
    const message = document.getElementById('private-sticker-message');
    if (!message) return;
    message.textContent = text || '';
    message.classList.remove('error', 'success');
    if (type) message.classList.add(type);
}

function renderPrivateStickerLibrary() {
    const pane = document.querySelector('[data-private-panel="sticker-library"]');
    if (!pane) return;
    privateStickerLibraryState = normalizePrivateStickerLibraryState(privateStickerLibraryState);
    const activeGroup = getPrivateActiveStickerGroup();
    const groupList = document.getElementById('private-sticker-group-list');
    const grid = document.getElementById('private-sticker-grid');
    const count = document.getElementById('private-sticker-count');
    const title = document.getElementById('private-sticker-title');

    if (title) title.textContent = '表情包库';
    if (count) count.textContent = `${activeGroup.name} / ${activeGroup.stickers.length} stickers`;

    if (groupList) {
        const groups = privateStickerLibraryState.groups;
        groupList.innerHTML = groups.map(group => {
            const active = group.id === activeGroup.id;
            return `
                <button class="private-sticker-group interactive ${active ? 'active' : ''}" type="button" data-private-sticker-group="${escapePrivateHtml(group.id)}" aria-pressed="${active ? 'true' : 'false'}">
                    <span>${escapePrivateHtml(group.name)}</span>
                    <em>${group.stickers.length}</em>
                </button>
            `;
        }).join('') + `
            <button class="private-sticker-group private-sticker-group-add interactive" id="private-sticker-add-group" type="button" aria-label="添加分组">
                <span aria-hidden="true">+</span>
                <b>添加分组</b>
            </button>
        `;
    }

    if (!grid) return;
    if (!activeGroup.stickers.length) {
        grid.innerHTML = '<div class="private-sticker-empty">这个分组还没有表情包。</div>';
        return;
    }

    grid.innerHTML = activeGroup.stickers.map(sticker => `
        <article class="private-sticker-card">
            <button class="private-sticker-image-button interactive" type="button" data-private-sticker-copy="${escapePrivateHtml(sticker.id)}" aria-label="复制 ${escapePrivateHtml(sticker.description)}">
                <img src="${escapePrivateHtml(sticker.url)}" alt="${escapePrivateHtml(sticker.description)}" loading="lazy" referrerpolicy="no-referrer">
            </button>
            <button class="private-sticker-delete interactive" type="button" data-private-sticker-delete="${escapePrivateHtml(sticker.id)}" aria-label="删除 ${escapePrivateHtml(sticker.description)}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
            <div class="private-sticker-label" title="${escapePrivateHtml(sticker.description)}">${escapePrivateHtml(sticker.description)}</div>
        </article>
    `).join('');
}

async function openPrivateStickerLibrary() {
    await loadPrivateStickerLibraryState();
    renderPrivateStickerLibrary();
    switchPrivateTab('sticker-library');
}

function closePrivateStickerLibrary() {
    const chatScreen = document.querySelector('.private-chat-screen');
    if (chatScreen?.getAttribute('data-private-current-tab') === 'sticker-library') {
        switchPrivateTab('monologue');
    }
}

function openPrivateStickerImportModal() {
    const modal = document.getElementById('private-sticker-modal');
    const input = document.getElementById('private-sticker-input');
    if (!modal || !input) return;
    input.value = '';
    setPrivateStickerMessage('');
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    window.setTimeout(() => input.focus(), 80);
}

function closePrivateStickerImportModal(instant = false) {
    const modal = document.getElementById('private-sticker-modal');
    if (!modal) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function setPrivateStickerGroupMessage(text, type = '') {
    const message = document.getElementById('private-sticker-group-message');
    if (!message) return;
    message.textContent = text || '';
    message.classList.remove('error', 'success');
    if (type) message.classList.add(type);
}

function openPrivateStickerGroupModal() {
    const modal = document.getElementById('private-sticker-group-modal');
    const input = document.getElementById('private-sticker-group-name');
    if (!modal || !input) return;
    input.value = '';
    setPrivateStickerGroupMessage('');
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    window.setTimeout(() => input.focus(), 80);
}

function closePrivateStickerGroupModal(instant = false) {
    const modal = document.getElementById('private-sticker-group-modal');
    if (!modal) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function addPrivateStickerGroup() {
    await loadPrivateStickerLibraryState();
    openPrivateStickerGroupModal();
}

async function savePrivateStickerGroup(event) {
    event.preventDefault();
    await loadPrivateStickerLibraryState();
    const input = document.getElementById('private-sticker-group-name');
    const name = normalizePrivateStickerPlainText(input?.value || '', 18);
    if (!name) {
        setPrivateStickerGroupMessage('请先填写分组名称。', 'error');
        input?.focus();
        return;
    }
    if (privateStickerLibraryState.groups.some(group => group.name === name)) {
        setPrivateStickerGroupMessage('已有同名分组。', 'error');
        input?.focus();
        return;
    }
    const now = new Date().toISOString();
    const group = {
        id: createPrivateStickerId('group'),
        name,
        stickers: [],
        createdAt: now,
        updatedAt: now
    };
    privateStickerLibraryState.groups.push(group);
    privateStickerLibraryState.activeGroupId = group.id;
    await savePrivateStickerLibraryState();
    renderPrivateStickerLibrary();
    closePrivateStickerGroupModal();
    showPrivateSystemToast('分组已添加。');
}

async function savePrivateStickerImport(event) {
    event.preventDefault();
    await loadPrivateStickerLibraryState();
    const input = document.getElementById('private-sticker-input');
    const stickers = parsePrivateStickerInput(input?.value || '');
    if (!stickers.length) {
        setPrivateStickerMessage('没有识别到表情包，请检查格式。', 'error');
        input?.focus();
        return;
    }
    const group = getPrivateActiveStickerGroup();
    const existedUrls = new Set(group.stickers.map(sticker => sticker.url));
    const additions = stickers.filter(sticker => !existedUrls.has(sticker.url));
    if (!additions.length) {
        setPrivateStickerMessage('这些表情包已经在当前分组里。', 'error');
        return;
    }
    group.stickers = [...additions, ...group.stickers].slice(0, 400);
    group.updatedAt = new Date().toISOString();
    privateStickerLibraryState.activeGroupId = group.id;
    await savePrivateStickerLibraryState();
    renderPrivateStickerLibrary();
    closePrivateStickerImportModal();
    showPrivateSystemToast(`已添加 ${additions.length} 个表情包。`);
}

async function deletePrivateSticker(stickerId) {
    await loadPrivateStickerLibraryState();
    const group = getPrivateActiveStickerGroup();
    const before = group.stickers.length;
    group.stickers = group.stickers.filter(sticker => sticker.id !== stickerId);
    if (group.stickers.length === before) return;
    group.updatedAt = new Date().toISOString();
    await savePrivateStickerLibraryState();
    renderPrivateStickerLibrary();
    showPrivateSystemToast('表情包已删除。');
}

async function copyPrivateSticker(stickerId) {
    const group = getPrivateActiveStickerGroup();
    const sticker = group.stickers.find(item => item.id === stickerId);
    if (!sticker) return;
    let copied = false;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(sticker.url);
            copied = true;
        }
    } catch (error) {
        copied = false;
    }
    showPrivateSystemToast(copied ? '已复制表情包 URL。' : `已选中「${sticker.description}」。`);
}

function isPrivateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function normalizePrivateIdentityId(value) {
    const id = String(value || '').trim();
    return isPrivateEmail(id) ? id.toLowerCase() : id;
}

function isCompleteRegisteredPrivateAccount(value) {
    if (!value || typeof value !== 'object') return false;
    return Boolean(
        value.registered
        && isPrivateEmail(value.email || value.userPresetId)
        && String(value.password || '').length > 0
    );
}

function getPrivateBoundIdentityId(state = privateState) {
    return normalizePrivateIdentityId(state.email)
        || normalizePrivateIdentityId(state.userPresetId)
        || createDefaultPrivateUserPreset().id;
}

function normalizePrivateIdentitySlots(value) {
    if (!value || typeof value !== 'object') return {};
    const slots = {};
    Object.entries(value).forEach(([rawId, rawSlot]) => {
        const id = normalizePrivateIdentityId(rawId);
        if (!id || !rawSlot || typeof rawSlot !== 'object') return;
        const defaults = createDefaultPrivateUserPreset();
        const email = isPrivateEmail(rawSlot.email)
            ? normalizePrivateIdentityId(rawSlot.email)
            : isPrivateEmail(id)
                ? id
                : '';
        const password = String(rawSlot.password || '');
        const registeredFlag = Object.prototype.hasOwnProperty.call(rawSlot, 'registered')
            ? Boolean(rawSlot.registered)
            : Boolean(email && password && rawSlot.verified);
        const registered = Boolean(registeredFlag && email && password);
        slots[id] = {
            email,
            password,
            registered,
            nickname: String(rawSlot.nickname || rawSlot.userPresetName || defaults.name),
            avatar: String(rawSlot.avatar || ''),
            agreementAccepted: Boolean(rawSlot.agreementAccepted),
            privacyAccepted: Boolean(rawSlot.privacyAccepted),
            verifyCode: /^\d{2}$/.test(String(rawSlot.verifyCode || '')) ? String(rawSlot.verifyCode) : '',
            letterSent: Boolean(rawSlot.letterSent),
            letterSentAt: Number(rawSlot.letterSentAt) || 0,
            verified: Boolean(rawSlot.verified),
            createdAt: String(rawSlot.createdAt || ''),
            lastLoginAt: Number(rawSlot.lastLoginAt) || 0,
            profileBio: String(rawSlot.profileBio || createDefaultPrivateState().profileBio),
            maskName: String(rawSlot.maskName || createDefaultPrivateState().maskName),
            preferenceNote: String(rawSlot.preferenceNote || createDefaultPrivateState().preferenceNote),
            chatPlaceholder: normalizePrivateContactChatPlaceholder(rawSlot.chatPlaceholder || createDefaultPrivateState().chatPlaceholder),
            userPresetName: String(rawSlot.userPresetName || rawSlot.nickname || defaults.name),
            userPresetId: id,
            userPresetGender: String(rawSlot.userPresetGender || defaults.gender),
            userPresetSetting: String(rawSlot.userPresetSetting || defaults.setting),
            threads: normalizePrivateThreads(rawSlot.threads),
            contacts: scopePrivateContacts(rawSlot.contacts, id),
            moments: normalizePrivateMoments(rawSlot.moments, [])
        };
    });
    return slots;
}

function createPrivateIdentitySnapshot(state = privateState) {
    const id = getPrivateBoundIdentityId(state);
    const defaults = createDefaultPrivateUserPreset();
    const email = isPrivateEmail(state.email) ? normalizePrivateIdentityId(state.email) : '';
    const password = String(state.password || '');
    return {
        email,
        password,
        registered: Boolean(state.registered && email && password),
        nickname: String(state.nickname || state.userPresetName || defaults.name),
        avatar: String(state.avatar || ''),
        agreementAccepted: Boolean(state.agreementAccepted),
        privacyAccepted: Boolean(state.privacyAccepted),
        verifyCode: /^\d{2}$/.test(String(state.verifyCode || '')) ? String(state.verifyCode) : '',
        letterSent: Boolean(state.letterSent),
        letterSentAt: Number(state.letterSentAt) || 0,
        verified: Boolean(state.verified),
        createdAt: String(state.createdAt || ''),
        lastLoginAt: Number(state.lastLoginAt) || 0,
        profileBio: String(state.profileBio || createDefaultPrivateState().profileBio),
        maskName: String(state.maskName || createDefaultPrivateState().maskName),
        preferenceNote: String(state.preferenceNote || createDefaultPrivateState().preferenceNote),
        chatPlaceholder: normalizePrivateContactChatPlaceholder(state.chatPlaceholder || createDefaultPrivateState().chatPlaceholder),
        userPresetName: String(state.userPresetName || state.nickname || defaults.name),
        userPresetId: id,
        userPresetGender: String(state.userPresetGender || defaults.gender),
        userPresetSetting: String(state.userPresetSetting || defaults.setting),
        threads: normalizePrivateThreads(state.threads),
        contacts: scopePrivateContacts(state.contacts, id),
        moments: normalizePrivateMoments(state.moments, [])
    };
}

function applyPrivateIdentitySlot(state = privateState) {
    const id = getPrivateBoundIdentityId(state);
    const slot = state.identities?.[id];
    state.userPresetId = id;
    if (!slot) return state;
    state.email = String(slot.email || id);
    state.password = String(slot.password || state.password || '');
    state.registered = isCompleteRegisteredPrivateAccount(slot);
    if (state.registered) state.lastAccountId = normalizePrivateIdentityId(slot.email || id);
    state.agreementAccepted = Boolean(slot.agreementAccepted || slot.registered);
    state.privacyAccepted = Boolean(slot.privacyAccepted || slot.registered);
    state.verifyCode = /^\d{2}$/.test(String(slot.verifyCode || '')) ? String(slot.verifyCode) : state.verifyCode;
    state.letterSent = Boolean(slot.letterSent || slot.registered);
    state.letterSentAt = Number(slot.letterSentAt) || state.letterSentAt || 0;
    state.verified = Boolean(slot.verified || slot.registered);
    state.createdAt = String(slot.createdAt || state.createdAt || '');
    state.lastLoginAt = Number(slot.lastLoginAt) || 0;
    state.nickname = String(slot.nickname || slot.userPresetName || state.nickname || '');
    state.avatar = String(slot.avatar || state.avatar || '');
    state.profileBio = String(slot.profileBio || state.profileBio || createDefaultPrivateState().profileBio);
    state.maskName = String(slot.maskName || state.maskName || createDefaultPrivateState().maskName);
    state.preferenceNote = String(slot.preferenceNote || state.preferenceNote || createDefaultPrivateState().preferenceNote);
    state.chatPlaceholder = normalizePrivateContactChatPlaceholder(slot.chatPlaceholder || state.chatPlaceholder || createDefaultPrivateState().chatPlaceholder);
    state.userPresetName = String(slot.userPresetName || state.nickname || state.userPresetName || '');
    state.userPresetGender = String(slot.userPresetGender || state.userPresetGender || createDefaultPrivateUserPreset().gender);
    state.userPresetSetting = String(slot.userPresetSetting || state.userPresetSetting || createDefaultPrivateUserPreset().setting);
    state.threads = normalizePrivateThreads(slot.threads);
    state.contacts = scopePrivateContacts(slot.contacts, id);
    state.moments = normalizePrivateMoments(slot.moments, []);
    return state;
}

function applyPrivateIdentitySlotById(identityId, state = privateState) {
    const id = normalizePrivateIdentityId(identityId);
    if (!id) return state;
    state.identities = normalizePrivateIdentitySlots(state.identities);
    if (!state.identities[id]) return state;
    state.email = state.identities[id].email || id;
    state.userPresetId = id;
    return applyPrivateIdentitySlot(state);
}

function syncPrivateIdentitySlot(state = privateState) {
    const id = getPrivateBoundIdentityId(state);
    state.identities = normalizePrivateIdentitySlots(state.identities);
    if (!normalizePrivateIdentityId(state.email) && !state.registered) {
        state.userPresetId = createDefaultPrivateUserPreset().id;
        return state;
    }
    state.userPresetId = id;
    state.contacts = scopePrivateContacts(state.contacts, id);
    state.identities[id] = createPrivateIdentitySnapshot(state);
    return state;
}

function getPrivateContactScopeId(state = privateState) {
    const id = getPrivateBoundIdentityId(state);
    return normalizePrivateIdentityId(id);
}

function normalizePrivateContactOwnerId(value) {
    return normalizePrivateIdentityId(value);
}

function scopePrivateContacts(contacts, scopeId) {
    const ownerId = normalizePrivateContactOwnerId(scopeId);
    return normalizePrivateContacts(contacts, [])
        .filter(contact => {
            const contactOwnerId = normalizePrivateContactOwnerId(contact.ownerId);
            return !ownerId || !contactOwnerId || contactOwnerId === ownerId;
        })
        .map(contact => ({
            ...contact,
            ownerId: normalizePrivateContactOwnerId(contact.ownerId) || ownerId
        }));
}

function getPrivateScopedContacts(state = privateState) {
    const id = getPrivateContactScopeId(state);
    state.identities = normalizePrivateIdentitySlots(state.identities);
    const slotContacts = id && state.identities[id]
        ? state.identities[id].contacts
        : state.contacts;
    return scopePrivateContacts(slotContacts, id);
}

function setPrivateScopedContacts(contacts, state = privateState) {
    const id = getPrivateContactScopeId(state);
    const nextContacts = scopePrivateContacts(contacts, id);
    state.contacts = nextContacts;
    state.identities = normalizePrivateIdentitySlots(state.identities);
    if (id && state.identities[id]) {
        state.identities[id] = {
            ...state.identities[id],
            contacts: nextContacts
        };
    }
    return nextContacts;
}

function shouldResetLegacyPrivateContent(stored) {
    return Number(stored.uiVersion || 0) < 5;
}

function shouldResetLegacyUserPreset(stored) {
    return Number(stored.uiVersion || 0) < 7;
}

function shouldRebuildPrivateIdentitySlots(stored) {
    return Number(stored.uiVersion || 0) < 8;
}

function coercePrivateState(content) {
    const defaults = createDefaultPrivateState();
    const stored = parseStoredJson(content);
    const resetLegacyContent = shouldResetLegacyPrivateContent(stored);
    const resetLegacyUserPreset = shouldResetLegacyUserPreset(stored);
    const storedRegistered = Boolean(stored.registered);
    const verifyCode = /^\d{2}$/.test(String(stored.verifyCode || ''))
        ? String(stored.verifyCode)
        : '';
    const storedContactScopeId = normalizePrivateIdentityId(stored.email || stored.userPresetId || stored.lastAccountId || '');
    const next = {
        ...defaults,
        uiVersion: defaults.uiVersion,
        registered: storedRegistered,
        nickname: String(stored.nickname || ''),
        email: String(stored.email || ''),
        password: String(stored.password || ''),
        avatar: String(stored.avatar || ''),
        agreementAccepted: Boolean(stored.agreementAccepted),
        privacyAccepted: Boolean(stored.privacyAccepted),
        verifyCode,
        letterSent: Boolean(stored.letterSent),
        letterSentAt: Number(stored.letterSentAt) || 0,
        verified: Boolean(stored.verified),
        createdAt: String(stored.createdAt || ''),
        lastLoginAt: Number(stored.lastLoginAt) || 0,
        lastAccountId: normalizePrivateIdentityId(stored.lastAccountId || ''),
        loginOtherAccount: Boolean(stored.loginOtherAccount),
        profileBio: String(stored.profileBio || defaults.profileBio),
        maskName: String(stored.maskName || defaults.maskName),
        preferenceNote: String(stored.preferenceNote || defaults.preferenceNote),
        chatPlaceholder: normalizePrivateContactChatPlaceholder(stored.chatPlaceholder || defaults.chatPlaceholder),
        userPresetName: resetLegacyUserPreset ? defaults.userPresetName : String(stored.userPresetName || defaults.userPresetName),
        userPresetId: resetLegacyUserPreset ? defaults.userPresetId : String(stored.userPresetId || defaults.userPresetId),
        userPresetGender: resetLegacyUserPreset ? defaults.userPresetGender : String(stored.userPresetGender || defaults.userPresetGender),
        userPresetSetting: resetLegacyUserPreset ? defaults.userPresetSetting : String(stored.userPresetSetting || defaults.userPresetSetting),
        identities: shouldRebuildPrivateIdentitySlots(stored) ? {} : normalizePrivateIdentitySlots(stored.identities),
        threads: [],
        contacts: resetLegacyContent ? defaults.contacts : scopePrivateContacts(stored.contacts, storedContactScopeId),
        moments: resetLegacyContent ? defaults.moments : normalizePrivateMoments(stored.moments, defaults.moments)
    };
    applyPrivateIdentitySlot(next);
    syncPrivateIdentitySlot(next);
    if (!getPrivateRegisteredIdentityById(next.lastAccountId, next)) {
        const lastSlot = getLastPrivateAccountSlot(next);
        if (lastSlot) rememberPrivateAccountSlot(lastSlot, next);
    }
    if ((storedRegistered || next.registered) && !isCompleteRegisteredPrivateAccount(createPrivateIdentitySnapshot(next))) {
        return createPrivateRegistrationDraft(next.identities, next.lastAccountId);
    }
    return next;
}

async function loadPrivateState() {
    try {
        const saved = await db.edits.get(PRIVATE_AUTH_ID);
        if (saved) {
            const stored = parseStoredJson(saved.content);
            privateState = coercePrivateState(saved.content);
            if (
                shouldResetLegacyPrivateContent(stored)
                || shouldResetLegacyUserPreset(stored)
                || shouldRebuildPrivateIdentitySlots(stored)
                || (Array.isArray(stored.threads) && stored.threads.length)
                || hasLegacyPrivateSeedContacts(stored.contacts)
                || hasLegacyPrivateSeedContactsInSlots(stored.identities)
            ) await savePrivateState();
        }
    } catch (e) {
        console.error('私叙账号状态加载失败:', e);
    }
    renderPrivateState();
    renderLetterSentAuthCard();
}

async function savePrivateState() {
    try {
        syncPrivateIdentitySlot();
        await db.edits.put({
            id: PRIVATE_AUTH_ID,
            content: JSON.stringify(privateState),
            type: 'private-auth'
        });
    } catch (e) {
        console.error('私叙账号状态保存失败:', e);
    }
}

function setPrivateMessage(id, text, type = '') {
    const message = document.getElementById(id);
    if (message) {
        message.textContent = text;
        message.classList.remove('error', 'success');
        if (type) message.classList.add(type);
    }
    if (text) showPrivateSystemToast(text);
}

function showPrivateSystemToast(text, duration = 3200) {
    const toast = document.getElementById('private-system-toast');
    const toastText = document.getElementById('private-system-toast-text');
    if (!toast || !toastText || !text) return;
    if (toast.parentElement !== document.body) document.body.appendChild(toast);
    toastText.textContent = text;
    toast.hidden = false;
    window.clearTimeout(privateSystemToastTimer);
    requestAnimationFrame(() => toast.classList.add('active'));
    privateSystemToastTimer = window.setTimeout(() => {
        toast.classList.remove('active');
        window.setTimeout(() => {
            if (!toast.classList.contains('active')) toast.hidden = true;
        }, 240);
    }, duration);
}

function hidePrivateSystemToast(instant = false) {
    const toast = document.getElementById('private-system-toast');
    if (!toast) return;
    window.clearTimeout(privateSystemToastTimer);
    toast.classList.remove('active');
    if (instant) {
        toast.hidden = true;
        return;
    }
    window.setTimeout(() => {
        if (!toast.classList.contains('active')) toast.hidden = true;
    }, 240);
}

function clearPrivateGuideToast() {
    window.clearTimeout(privateGuideToastTimer);
    privateGuideToastTimer = null;
}

function queuePrivateGuideToast(screenName, text) {
    clearPrivateGuideToast();
    if (!text) return;
    privateGuideToastTimer = window.setTimeout(() => {
        privateGuideToastTimer = null;
        const app = document.getElementById('private-app');
        const activeScreen = document.querySelector(`[data-private-screen="${screenName}"]`);
        if (!app?.classList.contains('active') || !activeScreen?.classList.contains('active')) return;
        showPrivateSystemToast(text);
    }, 80);
}

function getPrivateGuideText(screenName) {
    if (screenName === 'register') return '请填写昵称、邮箱和 8-12 位密码，勾选协议后继续。';
    if (screenName === 'privacy') return '请阅读隐私保护指引，勾选条款后进入信笺验证。';
    if (screenName === 'verify') {
        return privateState.verified
            ? '信笺验证已通过，点击完成注册。'
            : '请先发送验证信笺，寄出后回到私叙继续下一步。';
    }
    if (screenName === 'login') {
        return privateLoginMode === 'code'
            ? '点击获取验证码，输入信笺横幅中的 6 位数字。'
            : '请输入密码登录，或切换为信笺验证码登录。';
    }
    if (screenName === 'chat') return '';
    return '';
}

function openPrivateTermsModal() {
    const modal = document.getElementById('private-terms-modal');
    if (!modal) return;
    if (modal.parentElement !== document.body) (document.getElementById('private-app') || document.body).appendChild(modal);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
}

function closePrivateTermsModal() {
    const modal = document.getElementById('private-terms-modal');
    if (!modal) return;
    modal.classList.remove('active');
    window.setTimeout(() => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    }, 180);
}

function setPrivateFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field && field.value !== String(value)) field.value = String(value);
}

function setPrivateTextById(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function getPrivateUserPresetValues(identityId = getPrivateBoundIdentityId()) {
    const defaults = createDefaultPrivateUserPreset();
    const id = normalizePrivateIdentityId(identityId) || getPrivateBoundIdentityId();
    const slot = privateState.identities?.[id];
    if (slot && id !== getPrivateBoundIdentityId()) {
        return {
            name: String(slot.userPresetName || slot.nickname || defaults.name),
            id,
            gender: String(slot.userPresetGender || defaults.gender),
            setting: String(slot.userPresetSetting || defaults.setting)
        };
    }
    return {
        name: String(privateState.userPresetName || defaults.name),
        id,
        gender: String(privateState.userPresetGender || defaults.gender),
        setting: String(privateState.userPresetSetting || defaults.setting)
    };
}

function renderPrivateUserPresetSurface() {
    const preset = getPrivateUserPresetValues();
    setPrivateTextById('private-persona-preset-name', preset.name);
    setPrivateTextById('private-persona-preset-setting', preset.setting);
    setPrivateTextById('private-persona-preset-id', preset.id);
    setPrivateTextById('private-persona-preset-gender', preset.gender);
}

function openPrivateMomentComposer() {
    const composer = document.getElementById('private-moment-composer');
    const backdrop = document.getElementById('private-moment-modal-backdrop');
    if (!composer) return;
    if (backdrop) backdrop.hidden = false;
    composer.hidden = false;
    requestAnimationFrame(() => {
        backdrop?.classList.add('active');
        composer.classList.add('active');
    });
    window.setTimeout(() => document.getElementById('private-moment-editor')?.focus(), 90);
}

function closePrivateMomentComposer(instant = false) {
    const composer = document.getElementById('private-moment-composer');
    const backdrop = document.getElementById('private-moment-modal-backdrop');
    if (!composer) return;
    composer.classList.remove('active');
    backdrop?.classList.remove('active');
    const hide = () => {
        if (!composer.classList.contains('active')) composer.hidden = true;
        if (backdrop && !backdrop.classList.contains('active')) backdrop.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function isPrivateBackdropClick(event, dialogSelector) {
    const modal = event?.currentTarget;
    if (!(modal instanceof HTMLElement) || event.target !== modal) return false;
    const dialog = dialogSelector ? modal.querySelector(dialogSelector) : null;
    if (!(dialog instanceof HTMLElement)) return true;
    const point = event.changedTouches?.[0] || event;
    if (!Number.isFinite(point?.clientX) || !Number.isFinite(point?.clientY)) return true;
    const rect = dialog.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return true;
    return (
        point.clientX < rect.left
        || point.clientX > rect.right
        || point.clientY < rect.top
        || point.clientY > rect.bottom
    );
}

function bindPrivateBackdropDismiss(modal, dialogSelector, onClose) {
    if (!(modal instanceof HTMLElement) || typeof onClose !== 'function') return;
    if (modal.dataset.privateBackdropDismissBound === 'true') return;
    modal.dataset.privateBackdropDismissBound = 'true';

    modal.addEventListener('pointerdown', event => {
        const dialog = dialogSelector ? modal.querySelector(dialogSelector) : null;
        const target = event.target instanceof Element ? event.target : null;
        const startedOnBackdrop = !target
            || target === modal
            || !(dialog instanceof HTMLElement)
            || !dialog.contains(target);
        modal.dataset.privateBackdropPointerDown = startedOnBackdrop ? 'backdrop' : 'dialog';
    });

    modal.addEventListener('pointercancel', () => {
        modal.dataset.privateBackdropPointerDown = '';
    });

    modal.addEventListener('click', event => {
        const startedOnBackdrop = modal.dataset.privateBackdropPointerDown === 'backdrop';
        modal.dataset.privateBackdropPointerDown = '';
        if (!startedOnBackdrop) return;
        if (!isPrivateBackdropClick(event, dialogSelector)) return;
        event.preventDefault();
        event.stopPropagation();
        onClose();
    });
}

function shouldAutoFocusPrivateCenteredModalField() {
    if (typeof window === 'undefined') return false;
    const coarsePointer = typeof window.matchMedia === 'function'
        && window.matchMedia('(hover: none), (pointer: coarse), (max-width: 700px)').matches;
    return !coarsePointer;
}

function focusPrivateCenteredModalField(field, delay = 90) {
    if (!(field instanceof HTMLElement) || !shouldAutoFocusPrivateCenteredModalField()) return;
    window.setTimeout(() => {
        try {
            field.focus({ preventScroll: true });
        } catch (_) {
            field.focus();
        }
    }, delay);
}

function openPrivateUserPresetEditor(identityId = getPrivateBoundIdentityId()) {
    const modal = document.getElementById('private-user-preset-modal');
    if (!modal) return;
    const targetId = normalizePrivateIdentityId(identityId) || getPrivateBoundIdentityId();
    privatePresetEditingId = targetId;
    const preset = getPrivateUserPresetValues(targetId);
    setPrivateFieldValue('private-user-preset-name', preset.name);
    setPrivateFieldValue('private-user-preset-id', preset.id);
    setPrivateFieldValue('private-user-preset-gender', preset.gender);
    setPrivateFieldValue('private-user-preset-setting', preset.setting);
    const idField = document.getElementById('private-user-preset-id');
    if (idField) {
        idField.readOnly = true;
        idField.classList.add('is-locked');
    }
    document.querySelector('.private-persona-card')?.classList.add('persona-revealed');
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    focusPrivateCenteredModalField(document.getElementById('private-user-preset-name'));
}

function closePrivateUserPresetEditor(instant = false) {
    const modal = document.getElementById('private-user-preset-modal');
    if (!modal) return;
    privatePresetEditingId = '';
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function savePrivateUserPresetFromForm(event) {
    event.preventDefault();
    const defaults = createDefaultPrivateUserPreset();
    const getValue = id => document.getElementById(id)?.value.trim() || '';
    const targetId = normalizePrivateIdentityId(privatePresetEditingId) || getPrivateBoundIdentityId();
    const name = getValue('private-user-preset-name') || defaults.name;
    const gender = getValue('private-user-preset-gender') || defaults.gender;
    const setting = getValue('private-user-preset-setting') || defaults.setting;
    if (targetId === getPrivateBoundIdentityId()) {
        privateState.userPresetName = name;
        privateState.nickname = name;
        privateState.userPresetId = targetId;
        privateState.userPresetGender = gender;
        privateState.userPresetSetting = setting;
        syncPrivateIdentitySlot();
        renderPrivateUserPresetSurface();
        renderPrivateProfileSurface();
    } else {
        privateState.identities = normalizePrivateIdentitySlots(privateState.identities);
        const previous = privateState.identities[targetId] || {};
        privateState.identities[targetId] = {
            ...previous,
            nickname: name,
            userPresetName: name,
            userPresetId: targetId,
            userPresetGender: gender,
            userPresetSetting: setting,
            avatar: String(previous.avatar || ''),
            contacts: scopePrivateContacts(previous.contacts, targetId),
            moments: normalizePrivateMoments(previous.moments, [])
        };
        renderPrivateSettingsAccounts();
    }
    if (!document.getElementById('private-settings-modal')?.hidden) renderPrivateSettingsAccounts();
    await savePrivateState();
    closePrivateUserPresetEditor();
    showPrivateSystemToast('user 预设已保存。');
}

function getPrivateSettingsIdentityRows() {
    syncPrivateIdentitySlot();
    const slots = normalizePrivateIdentitySlots(privateState.identities);
    const currentId = getPrivateBoundIdentityId();
    if (!slots[currentId]) slots[currentId] = createPrivateIdentitySnapshot();
    return Object.values(slots).filter(isCompleteRegisteredPrivateAccount).sort((a, b) => {
        if (a.userPresetId === currentId) return -1;
        if (b.userPresetId === currentId) return 1;
        return a.userPresetId.localeCompare(b.userPresetId, 'zh-CN');
    });
}

function renderPrivateSettingsAccounts() {
    const list = document.getElementById('private-settings-account-list');
    if (!list) return;
    const currentId = getPrivateBoundIdentityId();
    const rows = getPrivateSettingsIdentityRows();
    if (!rows.length) {
        list.innerHTML = '<div class="private-settings-empty">暂无已绑定私叙号</div>';
        return;
    }
    list.innerHTML = rows.map(row => `
        <article class="private-settings-account" data-private-identity="${escapePrivateHtml(row.userPresetId)}">
            <div class="private-settings-account-avatar ${row.avatar ? 'has-image' : ''}" aria-hidden="true">
                ${row.avatar ? `<img class="private-settings-account-photo" src="${escapePrivateHtml(row.avatar)}" alt="">` : ''}
            </div>
            <div class="private-settings-account-main">
                <div class="private-settings-account-id">${escapePrivateHtml(row.userPresetName || row.nickname || '未命名')}</div>
                <div class="private-settings-account-sub">${escapePrivateHtml(row.email || row.userPresetId)} · ${escapePrivateHtml(row.userPresetGender || '未设定')}</div>
                <p>${escapePrivateHtml(row.userPresetSetting || '未绑定设定')}</p>
            </div>
            <div class="private-settings-account-actions">
                ${row.userPresetId === currentId
                    ? '<span class="private-settings-current">已登录</span>'
                    : `<button class="private-settings-login-button interactive" type="button" data-private-settings-login="${escapePrivateHtml(row.userPresetId)}">登录</button>`}
            </div>
        </article>
    `).join('');
}

async function switchPrivateAccount(identityId, message = '登录成功。') {
    const id = normalizePrivateIdentityId(identityId);
    if (!id) return;
    syncPrivateIdentitySlot();
    privateState.identities = normalizePrivateIdentitySlots(privateState.identities);
    const slot = privateState.identities[id];
    if (!isCompleteRegisteredPrivateAccount(slot)) {
        showPrivateSystemToast('这个账号还没有完成注册。');
        return;
    }
    applyPrivateIdentitySlotById(id);
    privateState.lastLoginAt = Date.now();
    privateState.lastAccountId = id;
    privateState.loginOtherAccount = false;
    privateLoginCode = '';
    setPrivateLoginMode('password');
    await savePrivateState();
    renderPrivateState();
    closePrivateSettingsPanel(true);
    hidePrivateCodeToast(true);
    showPrivateSystemToast(message);
    showPrivateScreen('chat');
}

function openPrivateSettingsPanel() {
    const modal = document.getElementById('private-settings-modal');
    if (!modal) return;
    renderPrivateSettingsAccounts();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
}

function closePrivateSettingsPanel(instant = false) {
    const modal = document.getElementById('private-settings-modal');
    if (!modal) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function unbindPrivateIdentity(identityId) {
    const id = normalizePrivateIdentityId(identityId);
    if (!id) return;
    if (!window.confirm(`取消绑定「${id}」的私叙预设？`)) return;
    privateState.identities = normalizePrivateIdentitySlots(privateState.identities);
    delete privateState.identities[id];
    if (id === getPrivateBoundIdentityId()) {
        const defaults = createDefaultPrivateUserPreset();
        privateState.nickname = defaults.name;
        privateState.avatar = '';
        privateState.userPresetName = defaults.name;
        privateState.userPresetGender = defaults.gender;
        privateState.userPresetSetting = defaults.setting;
        privateState.contacts = [];
        privateState.moments = [];
        syncPrivateIdentitySlot();
        renderPrivateState();
    }
    await savePrivateState();
    renderPrivateSettingsAccounts();
    showPrivateSystemToast('已取消绑定。');
}

function hasPrivateRecentLogin() {
    const lastLoginAt = Number(privateState.lastLoginAt) || 0;
    return Boolean(isCompleteRegisteredPrivateAccount(createPrivateIdentitySnapshot()) && lastLoginAt && Date.now() - lastLoginAt <= PRIVATE_LOGIN_STALE_MS);
}

function getRegisteredPrivateIdentitySlots(state = privateState) {
    const slots = normalizePrivateIdentitySlots(state.identities);
    const currentSnapshot = createPrivateIdentitySnapshot(state);
    if (isCompleteRegisteredPrivateAccount(currentSnapshot)) {
        slots[getPrivateBoundIdentityId(state)] = currentSnapshot;
    }
    return Object.values(slots).filter(isCompleteRegisteredPrivateAccount).sort((a, b) => {
        const loginDelta = (Number(b.lastLoginAt) || 0) - (Number(a.lastLoginAt) || 0);
        if (loginDelta) return loginDelta;
        const createdDelta = (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0);
        if (createdDelta) return createdDelta;
        return String(a.userPresetId || a.email || '').localeCompare(String(b.userPresetId || b.email || ''), 'zh-CN');
    });
}

function getPrivateRegisteredIdentityById(identityId, state = privateState) {
    const id = normalizePrivateIdentityId(identityId);
    if (!id) return null;
    const slots = normalizePrivateIdentitySlots(state.identities);
    if (isCompleteRegisteredPrivateAccount(slots[id])) return slots[id];
    const byEmail = Object.values(slots).find(slot => (
        isCompleteRegisteredPrivateAccount(slot)
        && normalizePrivateIdentityId(slot.email || slot.userPresetId) === id
    ));
    if (byEmail) return byEmail;
    const currentSnapshot = createPrivateIdentitySnapshot(state);
    if (isCompleteRegisteredPrivateAccount(currentSnapshot) && normalizePrivateIdentityId(currentSnapshot.email || currentSnapshot.userPresetId) === id) {
        return currentSnapshot;
    }
    return null;
}

function rememberPrivateAccountSlot(slot, state = privateState) {
    if (!isCompleteRegisteredPrivateAccount(slot)) return '';
    const id = normalizePrivateIdentityId(slot.email || slot.userPresetId);
    if (id) state.lastAccountId = id;
    return id;
}

function getLastPrivateAccountSlot(state = privateState) {
    const rememberedSlot = getPrivateRegisteredIdentityById(state.lastAccountId, state);
    if (rememberedSlot) return rememberedSlot;
    const currentSnapshot = createPrivateIdentitySnapshot(state);
    if (isCompleteRegisteredPrivateAccount(currentSnapshot)) return currentSnapshot;
    const slots = getRegisteredPrivateIdentitySlots(state);
    return slots[0] || null;
}

function hasRegisteredPrivateAccount() {
    return getRegisteredPrivateIdentitySlots().length > 0;
}

function choosePrivateInitialScreen() {
    const currentSnapshot = createPrivateIdentitySnapshot();
    if (isCompleteRegisteredPrivateAccount(currentSnapshot)) {
        rememberPrivateAccountSlot(currentSnapshot);
        return hasPrivateRecentLogin() ? 'chat' : 'login';
    }
    if (privateState.verified) return 'verify';
    if (privateState.privacyAccepted && privateState.email) return 'verify';
    if (privateState.agreementAccepted && privateState.email) return 'privacy';
    const lastSlot = getLastPrivateAccountSlot();
    if (lastSlot) {
        rememberPrivateAccountSlot(lastSlot);
        return 'login';
    }
    return 'register';
}

function updatePrivateAvatarElement(el, avatar) {
    if (!el) return;
    const avatarSource = String(avatar || '').trim();
    if (avatarSource) {
        const safeAvatar = avatarSource.replace(/["\\]/g, '\\$&');
        el.style.setProperty('background-image', `url("${safeAvatar}")`);
        el.style.setProperty('background-size', 'cover');
        el.style.setProperty('background-position', 'center');
        el.style.setProperty('background-color', 'transparent');
        el.classList.add('has-image');
    } else {
        el.style.removeProperty('background-image');
        el.style.removeProperty('background-size');
        el.style.removeProperty('background-position');
        el.style.removeProperty('background-color');
        el.classList.remove('has-image');
    }
}

function escapePrivateHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function getPrivateDisplayName() {
    return (privateState.nickname || privateState.userPresetName || '我').trim();
}

function getPrivateAccountLine() {
    return `ID: ${getPrivateBoundIdentityId()}`;
}

function getPrivateIdentitySlot(identityId) {
    const id = normalizePrivateIdentityId(identityId);
    if (!id) return null;
    const slots = normalizePrivateIdentitySlots(privateState.identities);
    return slots[id] || null;
}

function findRegisteredPrivateIdentity(identityId) {
    return getPrivateRegisteredIdentityById(identityId);
}

function getPrivateLoginPreview() {
    if (privateState.loginOtherAccount) {
        const rawId = document.getElementById('private-login-account-input')?.value.trim() || '';
        const slot = getPrivateRegisteredIdentityById(rawId);
        if (slot) return slot;
        return {
            userPresetName: '登录其它账号',
            nickname: '登录其它账号',
            email: rawId || '输入账号邮箱',
            userPresetId: rawId,
            avatar: ''
        };
    }
    return getLastPrivateAccountSlot() || {
        userPresetName: '请先注册账号',
        nickname: '请先注册账号',
        email: '',
        userPresetId: '',
        avatar: ''
    };
}

function getPrivateLoginDisplayName(identity) {
    const defaultName = String(createDefaultPrivateUserPreset().name || '').trim();
    const placeholderNames = new Set([defaultName, '我', '?', '昵称']);
    const names = [identity?.nickname, identity?.userPresetName]
        .map(value => String(value || '').trim())
        .filter(Boolean);
    return names.find(name => !placeholderNames.has(name)) || names[0] || '昵称';
}

function renderPrivateLoginIdentity() {
    const preview = getPrivateLoginPreview();
    updatePrivateAvatarElement(document.getElementById('private-login-avatar'), preview.avatar);
    const loginName = document.getElementById('private-login-name');
    const loginEmail = document.getElementById('private-login-email');
    if (loginName) loginName.textContent = getPrivateLoginDisplayName(preview);
    if (loginEmail) loginEmail.textContent = preview.email || preview.userPresetId || '邮箱';
}

function getPrivateMonthStamp(date = new Date()) {
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${month} ${String(date.getDate()).padStart(2, '0')}`;
}

function getPrivateTimeStamp(date = new Date()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getPrivateWeekdayLine(date = new Date()) {
    return `· ${date.toLocaleDateString('zh-CN', { weekday: 'long' })}`;
}

function normalizePrivateDossierAccount(value) {
    const raw = String(value || '').trim();
    const account = raw
        .replace(/^ID\s*[:：]\s*/i, '')
        .replace(/^账号\s*[:：]\s*/i, '')
        .replace(/^@+\s*/, '')
        .replace(/\s+/g, '');
    return /^\d{8,10}$/.test(account) ? account : '';
}

function normalizePrivateDossierType(value) {
    return String(value || '').toLowerCase() === 'npc' ? 'npc' : 'char';
}

function getPrivateDossierStateSnapshot() {
    if (window.rinnoDossierStateCache) return window.rinnoDossierStateCache;
    try {
        if (typeof loadDossierState === 'function') return loadDossierState();
    } catch (error) {
        console.warn('私叙读取卷宗状态失败:', error);
    }
    return { char: [], npc: [], network: { nodes: [], links: [] } };
}

function getPrivateDossierAccountRecords() {
    const state = getPrivateDossierStateSnapshot();
    return ['char', 'npc'].flatMap(type => {
        const records = Array.isArray(state?.[type]) ? state[type] : [];
        return records.map(item => {
            const accountId = normalizePrivateDossierAccount(item?.publicId);
            const recordId = String(item?.id || '').trim();
            if (!accountId || !recordId) return null;
            return {
                type,
                recordId,
                accountId,
                name: String(item?.name || (type === 'npc' ? '未命名 NPC' : '未命名 CHAR')).trim(),
                nickname: String(item?.nickname || '').trim(),
                avatar: String(item?.avatar || ''),
                setting: String(item?.setting || item?.note || '').trim(),
                gender: String(item?.gender || '').trim(),
                nationality: String(item?.nationality || '').trim(),
                monologue: String(item?.monologue || '').trim(),
                rinnoMemorySummary: normalizePrivateContactArchiveText(item?.rinnoMemorySummary || item?.memorySummary || ''),
                rinnoStorySummary: normalizePrivateContactArchiveText(item?.rinnoStorySummary || item?.storySummary || ''),
                rinnoSummaryDigest: normalizePrivateContactArchiveText(item?.rinnoSummaryDigest || item?.relationshipSummary || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT),
                rinnoSummaryUpdatedAt: Math.max(0, Number(item?.rinnoSummaryUpdatedAt || item?.summaryUpdatedAt) || 0),
                socialFollowers: item?.socialFollowers || item?.followers || '',
                socialFollowing: item?.socialFollowing || item?.following || '',
                socialOthers: item?.socialOthers || item?.others || '',
                followedBy: item?.followedBy
            };
        }).filter(Boolean);
    });
}

function resolvePrivateContactArchiveSnapshot(contact = {}, record = null) {
    const sourceRecord = record || getPrivateContactProfileRecord(contact) || {};
    return {
        memory: normalizePrivateContactArchiveText(
            sourceRecord?.rinnoMemorySummary
            || contact?.summaryMemory
            || ''
        ),
        story: normalizePrivateContactArchiveText(
            sourceRecord?.rinnoStorySummary
            || contact?.summaryStory
            || ''
        ),
        digest: normalizePrivateContactArchiveText(
            sourceRecord?.rinnoSummaryDigest
            || contact?.summaryDigest
            || '',
            PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT
        ),
        updatedAt: Math.max(
            0,
            Number(sourceRecord?.rinnoSummaryUpdatedAt || contact?.summaryUpdatedAt) || 0
        )
    };
}

function findPrivateDossierAccountRecord(query) {
    const accountId = normalizePrivateDossierAccount(query);
    if (!accountId) return null;
    return getPrivateDossierAccountRecords().find(record => record.accountId === accountId) || null;
}

function getPrivateDossierContactId(record) {
    return normalizePrivateContactRecordId(`dossier-contact-${record.type}-${record.recordId}`);
}

function isPrivateDossierContactAdded(record) {
    const contacts = getPrivateScopedContacts();
    return contacts.some(contact => (
        contact.dossierType === record.type
        && contact.dossierRecordId === record.recordId
        && normalizePrivateDossierAccount(contact.accountId) === record.accountId
    ));
}

function createPrivateDossierContact(record, source = {}) {
    const label = record.type === 'npc' ? 'NPC' : 'CHAR';
    const displayName = record.nickname || record.name;
    const archive = resolvePrivateContactArchiveSnapshot(source, record);
    return {
        id: getPrivateDossierContactId(record),
        type: `dossier-${record.type}`,
        title: displayName,
        remark: normalizePrivateContactRemark(source?.remark || source?.displayRemark),
        subtitle: `${label} / ID ${record.accountId}`,
        note: record.setting || `${record.name} 已按账号 ID 加入通讯。`,
        accountId: record.accountId,
        dossierType: record.type,
        dossierRecordId: record.recordId,
        avatar: record.avatar,
        homepageCover: String(source?.homepageCover || ''),
        chatWallpaper: normalizePrivateContactWallpaper(source?.chatWallpaper || ''),
        ownerId: getPrivateContactScopeId(),
        profession: String(source?.profession || '').trim(),
        signature: normalizePrivateContactSignature(source?.signature || source?.personaSignature || source?.tagline || ''),
        nationality: String(record.nationality || source?.nationality || '').trim(),
        phoneNumber: String(source?.phoneNumber || '').trim(),
        ipCity: String(source?.ipCity || '').trim(),
        homeAddress: String(source?.homeAddress || '').trim(),
        lifeStages: normalizePrivateContactLifeStages(source?.lifeStages),
        timezone: normalizePrivateContactTimezone(source?.timezone || source?.timeZone || source?.tz),
        replyMinCount: resolvePrivateContactReplyCadenceConfig(source).min,
        replyMaxCount: resolvePrivateContactReplyCadenceConfig(source).max,
        timeAwarenessEnabled: Boolean(source?.timeAwarenessEnabled || source?.timeAware || source?.enableTimeAwareness),
        userNudgeSuffix: normalizePrivateContactNudgeSuffix(source?.userNudgeSuffix || source?.nudgeToContactSuffix || source?.userPatSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX),
        contactNudgeSuffix: normalizePrivateContactNudgeSuffix(source?.contactNudgeSuffix || source?.nudgeToUserSuffix || source?.charPatSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX),
        autoSummaryEnabled: Boolean(source?.autoSummaryEnabled || source?.summaryEnabled || source?.enableAutoSummary),
        autoSummaryThreshold: normalizePrivateContactSummaryThreshold(source?.autoSummaryThreshold || source?.summaryThreshold),
        summaryCheckpointCount: Math.max(0, Number(source?.summaryCheckpointCount || source?.summaryCursor) || 0),
        summaryMemory: archive.memory,
        summaryStory: archive.story,
        summaryDigest: archive.digest,
        summaryUpdatedAt: archive.updatedAt,
        summaryEvents: normalizePrivateContactSummaryEvents(source?.summaryEvents || source?.archiveEvents || source?.summaryEventLog),
        generatedProfileAt: Number(source?.generatedProfileAt) || 0
    };
}

function getPrivateHydratedContact(contact) {
    const dossierType = normalizePrivateDossierType(contact?.dossierType);
    const recordId = String(contact?.dossierRecordId || '').trim();
    const accountId = normalizePrivateDossierAccount(contact?.accountId);
    if (!recordId || !accountId || !['dossier-char', 'dossier-npc'].includes(contact?.type)) {
        return contact;
    }
    const record = getPrivateDossierAccountRecords().find(item => (
        item.type === dossierType
        && item.recordId === recordId
        && item.accountId === accountId
    ));
    return record ? createPrivateDossierContact(record, contact) : contact;
}

function getPrivateContactMark(contact) {
    if (contact?.type === 'assistant') return '助';
    if (contact?.type === 'group') return '群';
    if (contact?.type === 'dossier-char') return 'C';
    if (contact?.type === 'dossier-npc') return 'N';
    return '友';
}

function normalizePrivateDossierNetworkIdPart(value, fallback = 'node') {
    return String(value || fallback).trim().replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 72) || fallback;
}

function getPrivateContactChatPlaceholderTemplate() {
    const fallback = createDefaultPrivateState().chatPlaceholder;
    return normalizePrivateContactChatPlaceholder(privateState.chatPlaceholder || fallback);
}

function getPrivateDossierUserNetworkId() {
    const userProfile = getPrivateContactChatPromptUserProfile();
    return `user:${normalizePrivateDossierNetworkIdPart(userProfile.id || 'user', 'user')}`;
}

function getPrivateDossierContactNetworkId(contact = {}) {
    const type = normalizePrivateDossierType(contact?.dossierType);
    const recordId = String(contact?.dossierRecordId || '').trim();
    if (!recordId || !['dossier-char', 'dossier-npc'].includes(String(contact?.type || ''))) return '';
    return `${type}:${normalizePrivateDossierNetworkIdPart(recordId)}`;
}

function findPrivateContactDossierNetworkLink(contact = {}) {
    const contactNodeId = getPrivateDossierContactNetworkId(contact);
    if (!contactNodeId) return null;
    const state = getPrivateDossierStateSnapshot();
    const links = Array.isArray(state?.network?.links) ? state.network.links : [];
    const userNodeId = getPrivateDossierUserNetworkId();
    const userLinks = links.filter(link => {
        const from = String(link?.from || '').trim();
        const to = String(link?.to || '').trim();
        if (from !== contactNodeId && to !== contactNodeId) return false;
        return from.startsWith('user:') || to.startsWith('user:');
    });
    return userLinks.find(link => (
        String(link?.from || '').trim() === userNodeId
        || String(link?.to || '').trim() === userNodeId
    )) || userLinks[0] || links.find(link => (
        String(link?.from || '').trim() === contactNodeId
        || String(link?.to || '').trim() === contactNodeId
    )) || null;
}

function isPrivateContactChatGenericSubtitle(value) {
    const raw = String(value || '').trim();
    return !raw || /^(CHAR|NPC)\s*\/\s*ID\s*\d+/i.test(raw);
}

function buildPrivateContactChatRelationshipContext(contact = {}) {
    const subtitle = trimPrivateContactChatSnippet(contact?.subtitle || '', 40);
    const networkLink = findPrivateContactDossierNetworkLink(contact);
    const relation = trimPrivateContactChatSnippet(
        networkLink?.relation
        || (isPrivateContactChatGenericSubtitle(subtitle) ? '' : subtitle)
        || (contact?.type === 'group'
            ? '群聊互动'
            : String(contact?.type || '').includes('npc')
                ? '剧情关联'
                : String(contact?.type || '').includes('char')
                    ? '私聊对象'
                    : '关系待设定'),
        40
    );
    const note = normalizePrivateContactPromptBlock([
        networkLink?.description,
        (!isPrivateContactChatGenericSubtitle(subtitle) && subtitle !== relation) ? subtitle : '',
        (!networkLink?.description && String(contact?.type || '').includes('dossier'))
            ? '关系网没有补全时，先按已有聊天记录、用户设定和 intimacy 控制距离，不要装作毫无前情。'
            : ''
    ].filter(Boolean).join('\n'), 220);
    return {
        label: relation || '关系待设定',
        note: note || '先记住你和用户并不是陌生问答关系，要按当前关系边界说话。'
    };
}

function buildPrivateContactLifeStagePromptArchive(profile = {}) {
    const stages = normalizePrivateContactLifeStages(profile?.lifeStages);
    if (!stages.length) return '    <stage age="未填写">暂无</stage>';
    return stages.map(stage => (
        `    <stage age="${escapePrivateContactPromptTag(stage.age, 18)}">${escapePrivateContactPromptText(stage.experience, 220)}</stage>`
    )).join('\n');
}

function buildPrivateContactChatPlaceholderContext(contact = null) {
    const activeContact = contact || getPrivateContactById(privateActiveContactChatId) || null;
    const hydratedContact = activeContact ? getPrivateHydratedContact(activeContact) : null;
    const thread = hydratedContact?.id ? getPrivateContactChatThread(hydratedContact.id) : null;
    const userProfile = getPrivateContactChatPromptUserProfile();
    const relationship = hydratedContact ? buildPrivateContactChatRelationshipContext(hydratedContact) : null;
    const record = hydratedContact ? getPrivateContactProfileRecord(hydratedContact) : null;
    const profile = hydratedContact ? resolvePrivateContactGeneratedProfile(hydratedContact, record || {}) : {};
    const displayName = getPrivateContactDisplayName(hydratedContact || {});
    const targetNick = String(record?.nickname || hydratedContact?.title || displayName || 'TA').trim() || 'TA';
    return {
        targetName: displayName || 'TA',
        targetNick,
        targetStatus: String(hydratedContact?.status || hydratedContact?.presence || '在线').trim() || '在线',
        userName: userProfile.name || '我',
        userNick: String(privateState?.nickname || userProfile.name || '我').trim() || '我',
        userId: userProfile.id || '@ rinno',
        relationName: relationship?.label || '当前关系',
        relationDesc: relationship?.note || (thread ? buildPrivateContactChatIntimacyLabel(thread) : '初识 / 观察中'),
        ipCity: String(profile?.ipCity || hydratedContact?.ipCity || 'TA 所在地').trim() || 'TA 所在地'
    };
}

function resolvePrivateContactChatPlaceholderTemplate(value, contact = null) {
    let template = normalizePrivateContactChatPlaceholder(value);
    const fallbackTemplate = getPrivateContactChatDefaultPlaceholderText();
    if (/(?:\$\s*){2,}/.test(template)) template = fallbackTemplate;
    const context = buildPrivateContactChatPlaceholderContext(contact);
    const resolveToken = (match, token) => {
        const key = getPrivateContactChatPlaceholderTokenKey(token);
        if (!key) return '';
        return String(context[key] || '').trim();
    };
    let resolved = template
        .replace(/\{\$\s*([a-zA-Z][\w-]*)\s*\}/g, resolveToken)
        .replace(/\$\{\s*([a-zA-Z][\w-]*)\s*\}/g, resolveToken)
        .replace(/\{\{\s*([a-zA-Z][\w-]*)\s*\}\}/g, resolveToken)
        .replace(/\{\s*([a-zA-Z][\w-]*)\s*\}/g, resolveToken)
        .replace(/(?:\$\s*){2,}/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    if (!resolved || resolved === '想和' || resolved.length < 2) {
        resolved = fallbackTemplate.replace(/\$\{targetName\}/g, String(context.targetName || 'TA').trim() || 'TA');
    }
    return resolved;
}

function getPrivateContactChatPlaceholder(contact = null) {
    return resolvePrivateContactChatPlaceholderTemplate(getPrivateContactChatPlaceholderTemplate(), contact);
}

function trimPrivateContactChatSnippet(value, maxLength = 72) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…` : text;
}

function formatPrivateContactChatHtml(value) {
    return escapePrivateHtml(String(value || '').replace(/\r/g, '').trim()).replace(/\n/g, '<br>');
}

function formatPrivateContactChatTime(timestamp) {
    const value = Number(timestamp) || 0;
    if (!value) return '';
    try {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }).format(new Date(value));
    } catch (error) {
        return '';
    }
}

function formatPrivateContactChatListTime(timestamp) {
    const value = Number(timestamp) || 0;
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const sameDay = date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
    if (sameDay) return formatPrivateContactChatTime(value);
    try {
        return new Intl.DateTimeFormat('en-US', {
            month: 'numeric',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        return '';
    }
}


function getPrivateContactChatVisibleTimeline(thread = {}) {
    return normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .filter(message => Number(message?.createdAt) > 0);
}

function formatPrivateContactChatGapLabel(minutes = 0) {
    const value = Math.max(0, Number(minutes) || 0);
    if (value < 1) return '不到 1 分钟';
    if (value < 60) return `${Math.floor(value)} 分钟`;
    if (value < 1440) {
        const hours = Math.floor(value / 60);
        const rest = Math.floor(value % 60);
        return rest ? `约 ${hours} 小时 ${rest} 分钟` : `约 ${hours} 小时`;
    }
    if (value < 10080) {
        const days = Math.floor(value / 1440);
        const hours = Math.floor((value % 1440) / 60);
        return hours ? `约 ${days} 天 ${hours} 小时` : `约 ${days} 天`;
    }
    const weeks = Math.floor(value / 10080);
    const days = Math.floor((value % 10080) / 1440);
    return days ? `约 ${weeks} 周 ${days} 天` : `约 ${weeks} 周`;
}

function buildPrivateContactChatGapTransitionHint(minutes = 0, latestRole = 'none', previousRole = 'none') {
    const value = Math.max(0, Number(minutes) || 0);
    const isUserReturn = latestRole === 'user' && previousRole !== 'none';
    if (!isUserReturn && latestRole === 'assistant') {
        if (value < 2) return '刚发完上一条，可以像补一句一样自然延续，不要刻意提时间。';
        if (value < 30) return '像隔了一小会儿又补发，先用短句续上刚才的情绪，不要重启话题。';
        if (value < 180) return '已经隔了一段时间，可以表现为刚忙完/刚回神后的补充，但不要像客服复盘。';
        return '距离上一条已经较久，如果继续主动开口，需要先轻轻找回语境，再进入新一句。';
    }
    if (value < 2) return '连续聊天，直接接住用户最新一句，不要硬说“这么快/刚刚”。';
    if (value < 15) return '中间只停顿了一小会儿，可以轻微过渡，比如先接住“刚才那句/我还在看”。';
    if (value < 60) return '用户隔了一阵才回，回复开头要有自然回温：先承认等待感或刚才断开的情绪，再继续正题。';
    if (value < 360) return '用户隔了数小时才回，不要无缝接话；允许按人设表现忙碌、惦记、别扭、吃味或松一口气。';
    if (value < 1440) return '聊天隔了半天左右，先重新把关系和语境接回来，再回应具体内容；禁止机械复述上一句。';
    return '聊天已经跨天或更久，必须有重入感：像真实的人重新打开聊天，不要假装上一秒还在聊。';
}

function buildPrivateContactChatReentryState(thread = {}) {
    const visibleMessages = getPrivateContactChatVisibleTimeline(thread);
    const latestVisible = visibleMessages[visibleMessages.length - 1] || null;
    const previousVisible = visibleMessages.length > 1 ? visibleMessages[visibleMessages.length - 2] : null;
    const latestUser = [...visibleMessages].reverse().find(message => message.role === 'user') || null;
    const latestAssistant = [...visibleMessages].reverse().find(message => message.role === 'assistant') || null;
    const latestRole = latestVisible?.role || 'none';
    const previousRole = previousVisible?.role || 'none';
    const now = Date.now();
    let gapMs = 0;
    let gapSource = 'none';
    if (latestVisible && previousVisible && latestRole === 'user') {
        gapMs = Math.max(0, Number(latestVisible.createdAt) - Number(previousVisible.createdAt));
        gapSource = 'user_return_after_previous_visible';
    } else if (latestVisible) {
        gapMs = Math.max(0, now - Number(latestVisible.createdAt));
        gapSource = latestRole === 'assistant' ? 'assistant_followup_after_last_reply' : 'after_latest_visible';
    }
    const gapMinutes = Math.max(0, Math.floor(gapMs / 60000));
    const gapLabel = formatPrivateContactChatGapLabel(gapMinutes);
    const transitionHint = latestVisible
        ? buildPrivateContactChatGapTransitionHint(gapMinutes, latestRole, previousRole)
        : '当前没有历史消息，按第一次线上相遇处理。';
    const previousTimeText = previousVisible ? formatPrivateContactChatListTime(previousVisible.createdAt) : '';
    const latestTimeText = latestVisible ? formatPrivateContactChatListTime(latestVisible.createdAt) : '';
    return {
        gapMinutes,
        gapLabel,
        gapSource,
        latestVisibleRole: latestRole,
        previousVisibleRole: previousRole,
        latestVisibleType: latestVisible ? getPrivateContactChatMessageType(latestVisible) : 'none',
        previousVisibleType: previousVisible ? getPrivateContactChatMessageType(previousVisible) : 'none',
        latestVisibleAt: Number(latestVisible?.createdAt) || 0,
        previousVisibleAt: Number(previousVisible?.createdAt) || 0,
        latestVisibleTimeText: latestTimeText,
        previousVisibleTimeText: previousTimeText,
        transitionHint,
        connectionStatus: latestVisible
            ? latestRole === 'user' && previousVisible
                ? `本轮用户回复距离上一轮可见消息 ${gapMinutes} 分钟（${gapLabel}）；上一轮角色/消息：${previousRole}/${previousVisible ? getPrivateContactChatMessageType(previousVisible) : 'none'}；过渡策略：${transitionHint}`
                : `距上一条可见消息 ${gapMinutes} 分钟（${gapLabel}）；过渡策略：${transitionHint}`
            : 'First contact / 当前还没有可见聊天记录',
        lastUserSnippet: trimPrivateContactChatSnippet(
            latestUser ? getPrivateContactChatPlainText(latestUser) : '',
            72
        ),
        lastAssistantSnippet: trimPrivateContactChatSnippet(
            latestAssistant ? getPrivateContactChatPlainText(latestAssistant) : '',
            72
        )
    };
}

function normalizePrivateContactChatReplyText(value) {
    const text = String(value || '')
        .replace(/^```(?:json|text)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    if (!text) return '';
    return text.slice(0, PRIVATE_CONTACT_CHAT_REPLY_MAX_LENGTH).trim();
}

function isPrivateContactChatNudgeLiteral(value) {
    const raw = String(value || '')
        .replace(/^```(?:json|text)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .replace(/[“”"'`]/g, '')
        .replace(/\s+/g, '')
        .trim()
        .toLowerCase();
    return ['action_nudge', 'nudge', 'pat', '拍一拍'].includes(raw);
}

function normalizePrivateContactChatReplyCadenceText(value) {
    return String(value || '')
        .replace(/[，,]+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\s+([!?！？])/g, '$1')
        .replace(/[。．.]+$/g, '')
        .trim();
}

function normalizePrivateContactChatTranslationText(value) {
    const text = String(value || '')
        .replace(/^```(?:json|text)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    if (!text) return '';
    return text.slice(0, PRIVATE_CONTACT_CHAT_TRANSLATION_MAX_LENGTH).trim();
}

function normalizePrivateContactPromptInline(value, maxLength = 120) {
    return String(value || '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

function normalizePrivateContactPromptBlock(value, maxLength = 280) {
    return String(value || '')
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, maxLength);
}

function escapePrivateContactPromptTag(value, maxLength = 120) {
    return normalizePrivateContactPromptInline(value, maxLength).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function escapePrivateContactPromptText(value, maxLength = 280) {
    return normalizePrivateContactPromptBlock(value, maxLength).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function countPrivateContactPromptEntries(block = '') {
    const matches = String(block || '').match(/<entry\b/gi);
    return Array.isArray(matches) ? matches.length : 0;
}

function getPrivateContactChatPromptUserProfile() {
    const defaults = createDefaultPrivateUserPreset();
    return {
        name: String(privateState.userPresetName || privateState.nickname || defaults.name).trim() || defaults.name,
        id: String(privateState.userPresetId || defaults.id).trim() || defaults.id,
        persona: String(privateState.userPresetSetting || defaults.setting).trim() || defaults.setting,
        gender: String(privateState.userPresetGender || defaults.gender).trim() || defaults.gender
    };
}

function buildPrivateContactChatRelationshipLabel(contact = {}) {
    return buildPrivateContactChatRelationshipContext(contact).label;
}

function buildPrivateContactChatIntimacyLabel(thread = {}) {
    const visibleCount = normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .length;
    if (visibleCount >= 24) return '熟络 / 默契累积中';
    if (visibleCount >= 12) return '常聊 / 关系升温中';
    if (visibleCount >= 4) return '试探 / 慢慢熟悉';
    return '初识 / 观察中';
}

function buildPrivateContactChatTimeAwarenessContext(contact = {}) {
    const enabled = Boolean(contact?.timeAwarenessEnabled);
    const timezone = resolvePrivateContactTimezone(contact);
    return {
        enabled,
        timezone,
        currentTimeText: enabled
            ? formatPrivateContactAwareTime(new Date(), timezone)
            : '时间感知未开启。禁止根据系统时间、真实日期、星期、时刻或作息段推断当前时间。',
        connectionStatusEnabled: enabled
    };
}

function buildPrivateContactChatPromptLiveState(contact = {}, thread = {}) {
    const timeContext = buildPrivateContactChatTimeAwarenessContext(contact);
    const reentryState = buildPrivateContactChatReentryState(thread);
    return {
        currentTimeText: timeContext.currentTimeText,
        timeAwarenessStatus: timeContext.enabled ? 'enabled' : 'disabled',
        timezoneText: timeContext.timezone,
        connectionStatus: reentryState.connectionStatus,
        lastVisibleRole: reentryState.latestVisibleRole,
        lastVisibleType: reentryState.latestVisibleType,
        previousVisibleRole: reentryState.previousVisibleRole,
        previousVisibleType: reentryState.previousVisibleType,
        latestVisibleAt: reentryState.latestVisibleAt,
        previousVisibleAt: reentryState.previousVisibleAt,
        latestVisibleTimeText: reentryState.latestVisibleTimeText,
        previousVisibleTimeText: reentryState.previousVisibleTimeText,
        turnGapMinutes: reentryState.gapMinutes,
        turnGapLabel: reentryState.gapLabel,
        turnGapSource: reentryState.gapSource,
        turnTransitionHint: reentryState.transitionHint,
        lastUserSnippet: reentryState.lastUserSnippet,
        lastAssistantSnippet: reentryState.lastAssistantSnippet
    };
}

function buildPrivateContactChatPromptContext(contact = {}, thread = {}, chat = {}, history = [], prologueBlocks = {}) {
    const userProfile = getPrivateContactChatPromptUserProfile();
    const relationshipContext = buildPrivateContactChatRelationshipContext(contact);
    const parsedTemperature = Number(chat?.temperature);
    const rawContextRounds = Number(chat?.contextRounds);
    const contextRounds = Number.isFinite(rawContextRounds) && rawContextRounds >= 1
        ? Math.floor(rawContextRounds)
        : PRIVATE_CONTACT_CHAT_REPLY_CONTEXT_LIMIT;
    const normalizedHistory = Array.isArray(history) ? history.filter(Boolean) : [];
    const contextMessageCount = normalizedHistory.filter(message => message.role !== 'system').length;
    const totalHistoryMessageCount = normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .length;
    const liveState = buildPrivateContactChatPromptLiveState(contact, thread);
    const archive = resolvePrivateContactArchiveSnapshot(contact, getPrivateContactProfileRecord(contact));
    return {
        userName: userProfile.name,
        userId: userProfile.id,
        userPersona: userProfile.persona,
        userGender: userProfile.gender,
        relationship: relationshipContext.label,
        relationshipNote: relationshipContext.note,
        intimacy: buildPrivateContactChatIntimacyLabel(thread),
        model: String(chat?.model || '').trim() || '未设定',
        temperature: Number.isFinite(parsedTemperature) ? parsedTemperature : 0.85,
        contextRounds,
        contextMessageCount,
        totalHistoryMessageCount,
        currentTimeText: liveState.currentTimeText,
        timeAwarenessStatus: liveState.timeAwarenessStatus,
        timezoneText: liveState.timezoneText,
        connectionStatus: liveState.connectionStatus,
        lastVisibleRole: liveState.lastVisibleRole,
        lastVisibleType: liveState.lastVisibleType,
        previousVisibleRole: liveState.previousVisibleRole,
        previousVisibleType: liveState.previousVisibleType,
        latestVisibleAt: liveState.latestVisibleAt,
        previousVisibleAt: liveState.previousVisibleAt,
        latestVisibleTimeText: liveState.latestVisibleTimeText,
        previousVisibleTimeText: liveState.previousVisibleTimeText,
        turnGapMinutes: liveState.turnGapMinutes,
        turnGapLabel: liveState.turnGapLabel,
        turnGapSource: liveState.turnGapSource,
        turnTransitionHint: liveState.turnTransitionHint,
        lastUserSnippet: liveState.lastUserSnippet,
        lastAssistantSnippet: liveState.lastAssistantSnippet,
        archiveMemory: archive.memory,
        archiveStory: archive.story,
        archiveDigest: archive.digest,
        archiveUpdatedAt: archive.updatedAt,
        stickerInventory: buildPrivateContactChatStickerInventory(PRIVATE_CONTACT_CHAT_STICKER_PROMPT_LIMIT),
        prologueBlocks
    };
}

function formatPrivateContactChatPromptMessage(message = {}) {
    const quote = normalizePrivateContactChatQuote(message.quote);
    const parts = [];
    if (quote) {
        const quoteSpeaker = quote.senderName || (quote.role === 'user' ? getPrivateDisplayName() : 'TA');
        const quoteText = trimPrivateContactChatSnippet(quote.content, 52);
        if (quoteText) parts.push(`引用 ${quoteSpeaker}：${quoteText}`);
    }
    const content = getPrivateContactChatPlainText(message);
    if (content) parts.push(content);
    return parts.join('\n').trim();
}

function buildPrivateContactChatPromptSystemNote(message = {}) {
    if (!message?.recalled || !message?.recalledData) return '';
    const detail = message.recalledData;
    const original = trimPrivateContactChatSnippet(detail.content, 120);
    if (detail.actorRole === 'assistant') {
        return original
            ? `[你刚刚撤回了一条消息：“${original}”。这只是聊天里的撤回记录，不要解释系统，只需继续自然说话。]`
            : '[你刚刚撤回了一条消息。继续自然聊天，不要解释系统。]';
    }
    if (detail.wasCaught) {
        return original
            ? `[系统提示：用户刚刚撤回了一条消息：“${original}”。虽然界面显示已撤回，但你其实看见了内容。请按角色性格自然处理，不要暴露系统提示。]`
            : '[系统提示：用户刚刚撤回了一条消息，你其实看见了内容。请按角色性格自然处理，不要暴露系统提示。]';
    }
    return '[用户撤回了一条消息。]';
}

function normalizePrivateContactPromptPrologueEntries(value) {
    const entries = Array.isArray(value) ? value : [];
    return entries
        .filter(item => item && typeof item === 'object')
        .map(item => ({
            id: String(item.id || '').trim(),
            scope: item.scope === 'extension' ? 'extension' : 'global',
            activation: item.activation === 'keyword' ? 'keyword' : 'always',
            keywords: normalizePrivateContactPromptInline(item.keywords || '', 120),
            position: ['before', 'middle', 'after'].includes(item.position) ? item.position : 'before',
            content: normalizePrivateContactPromptBlock(item.content || '', 280)
        }))
        .filter(entry => entry.content)
        .slice(0, 120);
}

function normalizePrivateContactPromptPrologueState(value) {
    const source = value && typeof value === 'object' ? value : {};
    const groups = Array.isArray(source.groups) ? source.groups : [];
    return {
        groups: groups
            .filter(group => group && typeof group === 'object')
            .map((group, index) => ({
                id: String(group.id || `group-${index + 1}`).trim(),
                name: normalizePrivateContactPromptInline(group.name || group.title || `词条分组 ${index + 1}`, 24) || `词条分组 ${index + 1}`,
                entries: normalizePrivateContactPromptPrologueEntries(group.entries)
            }))
            .filter(group => group.entries.length)
            .slice(0, 60)
    };
}

async function loadPrivateContactChatPrologueState() {
    try {
        if (typeof db === 'undefined' || !db?.edits?.get) return { groups: [] };
        const stateId = typeof PROLOGUE_STATE_ID !== 'undefined'
            ? PROLOGUE_STATE_ID
            : PRIVATE_CONTACT_CHAT_PROLOGUE_STATE_ID;
        const saved = await db.edits.get(stateId);
        if (!saved?.content) return { groups: [] };
        if (typeof normalizePrologueState === 'function') {
            return normalizePrologueState(saved.content);
        }
        const parsed = typeof parseStoredJson === 'function'
            ? parseStoredJson(saved.content)
            : JSON.parse(saved.content);
        return normalizePrivateContactPromptPrologueState(parsed);
    } catch (error) {
        console.warn('Private contact prologue context load failed:', error);
        return { groups: [] };
    }
}

async function buildPrivateContactChatPrologueBlocks() {
    const state = normalizePrivateContactPromptPrologueState(await loadPrivateContactChatPrologueState());
    if (!state.groups.length) {
        return { before: '', middle: '', after: '' };
    }

    const blocks = { before: '', middle: '', after: '' };
    let carriedEntryCount = 0;

    for (const position of ['before', 'middle', 'after']) {
        const groupBlocks = [];
        let positionEntryCount = 0;

        for (const group of state.groups.slice(0, PRIVATE_CONTACT_CHAT_PROLOGUE_GROUP_LIMIT)) {
            if (carriedEntryCount >= PRIVATE_CONTACT_CHAT_PROLOGUE_ENTRY_LIMIT) break;
            const entryLines = [];

            for (const entry of group.entries) {
                if (carriedEntryCount >= PRIVATE_CONTACT_CHAT_PROLOGUE_ENTRY_LIMIT) break;
                if (entry.position !== position) continue;
                const attrs = [
                    `scope="${escapePrivateContactPromptTag(entry.scope, 24)}"`,
                    `activation="${escapePrivateContactPromptTag(entry.activation, 24)}"`,
                    `position="${escapePrivateContactPromptTag(entry.position, 24)}"`
                ];
                if (entry.keywords) {
                    attrs.push(`keywords="${escapePrivateContactPromptTag(entry.keywords, 120)}"`);
                }
                entryLines.push(`<entry ${attrs.join(' ')}>${normalizePrivateContactPromptBlock(entry.content, 280)}</entry>`);
                carriedEntryCount += 1;
                positionEntryCount += 1;
            }

            if (!entryLines.length) continue;
            groupBlocks.push([
                `<group name="${escapePrivateContactPromptTag(group.name, 24)}">`,
                ...entryLines,
                '</group>'
            ].join('\n'));
        }

        if (groupBlocks.length) {
            blocks[position] = [
                `<prologue_archive position="${position}" total_groups="${groupBlocks.length}" total_entries="${positionEntryCount}">`,
                ...groupBlocks,
                '</prologue_archive>'
            ].join('\n');
        }
    }

    return blocks;
}


function clampPrivateContactChatPersonaScore(value, min = 0, max = 100) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, Math.round(number)));
}

function calculatePrivateContactChatLegacyRealismSeed(contact = {}, promptContext = {}) {
    const personaText = [
        contact?.title,
        contact?.note,
        contact?.signature,
        contact?.status,
        contact?.presence,
        promptContext.relationship,
        promptContext.relationshipNote,
        promptContext.archiveDigest,
        promptContext.lastUserSnippet,
        promptContext.lastAssistantSnippet
    ].map(value => String(value || '')).join(' ').toLowerCase();
    const connectionText = String(promptContext.connectionStatus || '');
    const gapMatch = connectionText.match(/(\d+)\s*分钟/);
    const gapMinutes = gapMatch ? Math.max(0, Number(gapMatch[1]) || 0) : 0;
    const historyCount = Math.max(0, Number(promptContext.totalHistoryMessageCount) || 0);
    const seed = hashPrivateSeed([
        contact?.id || 'contact',
        promptContext.lastUserSnippet || '',
        historyCount,
        gapMinutes,
        new Date().getHours()
    ].join('|'));
    const has = pattern => pattern.test(personaText);
    const drift = offset => ((seed + offset) % 11) - 5;
    const lateHour = (() => {
        const hourMatch = String(promptContext.currentTimeText || '').match(/(?:^|\D)([01]?\d|2[0-3])[:：]/);
        const hour = hourMatch ? Number(hourMatch[1]) : new Date().getHours();
        return hour >= 23 || hour <= 5;
    })();

    let moodHeat = 48 + drift(3);
    let initiative = 46 + drift(7);
    let attachment = 42 + Math.min(18, Math.floor(gapMinutes / 30)) + drift(11);
    let boundaryGuard = 45 + drift(17);
    let spontaneity = 54 + drift(23);

    if (has(/冷|淡|疏离|寡言|克制|沉默|慢热|孤僻|reserved|cold|quiet/)) {
        moodHeat -= 10;
        initiative -= 12;
        boundaryGuard += 18;
        spontaneity -= 8;
    }
    if (has(/温柔|细腻|治愈|照顾|体贴|柔软|gentle|soft|heal|care/)) {
        moodHeat += 6;
        attachment += 8;
        boundaryGuard -= 6;
    }
    if (has(/热烈|明媚|直接|开朗|黏人|占有|偏执|控制|嫉妒|疯|bright|warm|clingy|possessive/)) {
        moodHeat += 14;
        initiative += 12;
        attachment += 16;
        spontaneity += 10;
    }
    if (has(/忙|累|疲惫|失眠|生病|低烧|加班|开会|赶路|通勤|困|烦|暴躁|tired|busy|sick/)) {
        moodHeat -= 6;
        initiative -= 8;
        boundaryGuard += 8;
        spontaneity -= 6;
    }
    if (lateHour) {
        moodHeat += 4;
        attachment += 7;
        spontaneity -= 3;
    }
    if (gapMinutes >= 180) {
        moodHeat += 9;
        attachment += 12;
        boundaryGuard += 6;
    }
    if (historyCount >= 24) {
        attachment += 10;
        boundaryGuard -= 4;
    } else if (historyCount <= 3) {
        boundaryGuard += 10;
        initiative -= 5;
    }

    const scores = {
        moodHeat: clampPrivateContactChatPersonaScore(moodHeat),
        initiative: clampPrivateContactChatPersonaScore(initiative),
        attachment: clampPrivateContactChatPersonaScore(attachment),
        boundaryGuard: clampPrivateContactChatPersonaScore(boundaryGuard),
        spontaneity: clampPrivateContactChatPersonaScore(spontaneity)
    };
    const intervals = {
        moodHeat: { min: 24, max: 72, label: '情绪热度' },
        initiative: { min: 18, max: 78, label: '主动欲' },
        attachment: { min: 16, max: 82, label: '依恋牵引' },
        boundaryGuard: { min: 22, max: 84, label: '边界防卫' },
        spontaneity: { min: 28, max: 88, label: '日常随机性' }
    };
    const warnings = Object.entries(scores).flatMap(([key, value]) => {
        const range = intervals[key];
        if (!range) return [];
        if (value < range.min) return [`${range.label}=${value} 低于底色区间 ${range.min}-${range.max}，回复前必须补足该角色应有的情绪底噪，禁止显得像无感客服。`];
        if (value > range.max) return [`${range.label}=${value} 高于底色区间 ${range.min}-${range.max}，回复前必须收束失控倾向，保留人设但避免脱离当前关系阶段。`];
        return [];
    });
    const replyHabit = [];
    if (scores.boundaryGuard >= 64) replyHabit.push('先短句试探，少解释，多停顿，必要时用撤回掩饰真实情绪。');
    if (scores.initiative >= 62) replyHabit.push('允许连续追问、主动换话题或补发一条日常碎片。');
    if (scores.attachment >= 66) replyHabit.push('自然暴露在意与记仇，不要把关心写成标准安慰话术。');
    if (scores.spontaneity >= 66) replyHabit.push('可穿插刚看到的日常细节、手边物件、通知声、路上/房间里的小变化。');
    if (!replyHabit.length) replyHabit.push('保持自然线上聊天节奏：不完整句、轻微犹豫、情绪留白、不过度总结。');
    return {
        gapMinutes,
        historyCount,
        scores,
        intervals,
        warnings,
        replyHabit,
        dailyDynamic: lateHour
            ? '夜间语境：更容易嘴硬、低声、敏感或突然说真话，但仍只通过线上消息呈现。'
            : '日间语境：让角色像正被日常切割的人，回复里保留手头事务、通勤、学习/工作、环境声或短暂停顿。'
    };
}


const PRIVATE_CHARACTER_ADVANCED_DIMENSIONS = [
    { key: 'intimacy', label: '亲密度', defaultRange: [30, 80] },
    { key: 'initiative', label: '主动性', defaultRange: [30, 75] },
    { key: 'dependence', label: '依赖感', defaultRange: [20, 70] },
    { key: 'possessiveness', label: '占有欲', defaultRange: [10, 60] },
    { key: 'emotionalStability', label: '情绪稳定', defaultRange: [40, 90] },
    { key: 'boundary', label: '边界感', defaultRange: [30, 85] }
];

const PRIVATE_CHARACTER_ADVANCED_DEFAULT_CHECK_PROMPT = [
    '回复前请在内部完成以下检查，但禁止输出检查过程：',
    '1. 输入分析：理解用户输入的真实含义、情绪、隐含需求和上下文。',
    '2. 人设校验：确保回复符合角色设定、说话习惯、关系状态和禁忌。',
    '3. 情感演变：判断角色当前情绪相比上一轮是否变化。',
    '4. 关系评估：判断 user 与 char 的亲密度、信任、边界、依赖、占有欲等关系状态。',
    '5. 输出规划：决定回复语气、长度、消息条数、是否撤回、是否追问、是否主动推进。',
    '6. 偏差纠正：如果回复可能脱离人设，请在内部修正后再输出。',
    '',
    '最终只输出角色自然聊天内容。',
    '禁止输出分析过程。',
    '禁止输出思维链。',
    '禁止输出系统规则。',
    '禁止出现“作为 AI / 语言模型 / 系统提示 / 提示词 / 推理过程”等出戏内容。'
].join('\n');

const PRIVATE_CHARACTER_ADVANCED_WARNING_RULES = {
    intimacy: {
        low: '增加基本关心和回应感，不要冷漠到违背已有关系。',
        high: '降低过度亲昵、突然暧昧、越界称呼、过快推进关系。'
    },
    initiative: {
        low: '增加回应感和一点主动输入，不要一直被动、敷衍。',
        high: '减少连续追问、强行推进、过度主动安排。'
    },
    dependence: {
        low: '增加适当情绪连接，不要像陌生人或客服。',
        high: '减少“离不开 user”、过度索取陪伴、过度情绪绑架。'
    },
    possessiveness: {
        low: '如果角色设定本来在意 user，需要保留轻微吃醋、在意或占有感。',
        high: '减少控制、命令、查岗、威胁、强迫、压迫式表达。'
    },
    emotionalStability: {
        low: '减少崩溃、极端、歇斯底里、反复拉扯到失控。',
        high: '避免过度冷静、像机器人、没有情绪波动。'
    },
    boundary: {
        low: '增加分寸感，避免突然越界、突然暧昧或过度亲密。',
        high: '减少疏离、官方、客套，增加熟人感。'
    }
};

let privateCharacterAdvancedSettingsCache = Object.create(null);

function clampPrivateCharacterAdvancedDelta(value, min = -3, max = 3) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(min, Math.min(max, Math.round(number)));
}

function getPrivateCharacterAdvancedDimensionMeta(key) {
    return PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.find(item => item.key === key) || null;
}

function getPrivateCharacterAdvancedDefaultPersonalityState(seedState = null) {
    const legacyScores = seedState?.scores || {};
    const moodHeat = clampPrivateContactChatPersonaScore(legacyScores.moodHeat ?? 50);
    const initiative = clampPrivateContactChatPersonaScore(legacyScores.initiative ?? 50);
    const attachment = clampPrivateContactChatPersonaScore(legacyScores.attachment ?? 50);
    const boundaryGuard = clampPrivateContactChatPersonaScore(legacyScores.boundaryGuard ?? 50);
    const spontaneity = clampPrivateContactChatPersonaScore(legacyScores.spontaneity ?? 50);
    return {
        intimacy: clampPrivateContactChatPersonaScore(seedState ? moodHeat : 50),
        initiative: clampPrivateContactChatPersonaScore(seedState ? initiative : 50),
        dependence: clampPrivateContactChatPersonaScore(seedState ? attachment : 50),
        possessiveness: clampPrivateContactChatPersonaScore(seedState ? Math.round((attachment * 0.55) + (moodHeat * 0.45) - 10) : 50),
        emotionalStability: clampPrivateContactChatPersonaScore(seedState ? Math.round(76 - Math.abs(moodHeat - 50) - Math.max(0, spontaneity - 60) * 0.25) : 50),
        boundary: clampPrivateContactChatPersonaScore(seedState ? boundaryGuard : 50)
    };
}

function getPrivateCharacterAdvancedDefaultBaselineRange() {
    return PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.reduce((ranges, item) => {
        ranges[item.key] = item.defaultRange.slice();
        return ranges;
    }, {});
}

function normalizePrivateCharacterAdvancedRange(value, fallback = [0, 100]) {
    const source = Array.isArray(value) ? value : [];
    let min = clampPrivateContactChatPersonaScore(source[0] ?? fallback[0] ?? 0);
    let max = clampPrivateContactChatPersonaScore(source[1] ?? fallback[1] ?? 100);
    if (min > max) [min, max] = [max, min];
    return [min, max];
}

function createDefaultPrivateCharacterAdvancedSettings(charId = '', seedState = null) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_advanced', 'contact_advanced');
    const now = Date.now();
    return {
        charId: safeCharId,
        dailyState: '',
        replyHabit: '',
        preReplyCheckPrompt: '',
        personalityState: getPrivateCharacterAdvancedDefaultPersonalityState(seedState),
        baselineRange: getPrivateCharacterAdvancedDefaultBaselineRange(),
        createdAt: now,
        updatedAt: now
    };
}

function normalizePrivateCharacterAdvancedSettings(raw = {}, charId = '', seedState = null) {
    const safeCharId = normalizePrivateContactRecordId(raw?.charId || charId || 'contact_advanced', 'contact_advanced');
    const defaults = createDefaultPrivateCharacterAdvancedSettings(safeCharId, seedState);
    const source = raw && typeof raw === 'object' ? raw : {};
    const sourcePersonality = source.personalityState && typeof source.personalityState === 'object' ? source.personalityState : {};
    const sourceRanges = source.baselineRange && typeof source.baselineRange === 'object' ? source.baselineRange : {};
    const personalityState = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.reduce((state, item) => {
        state[item.key] = clampPrivateContactChatPersonaScore(sourcePersonality[item.key] ?? defaults.personalityState[item.key]);
        return state;
    }, {});
    const baselineRange = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.reduce((ranges, item) => {
        ranges[item.key] = normalizePrivateCharacterAdvancedRange(sourceRanges[item.key], defaults.baselineRange[item.key]);
        return ranges;
    }, {});
    const createdAt = Number(source.createdAt) || defaults.createdAt;
    const updatedAt = Number(source.updatedAt) || defaults.updatedAt;
    return {
        ...defaults,
        ...source,
        charId: safeCharId,
        dailyState: String(source.dailyState ?? defaults.dailyState ?? ''),
        replyHabit: String(source.replyHabit ?? defaults.replyHabit ?? ''),
        preReplyCheckPrompt: String(source.preReplyCheckPrompt ?? defaults.preReplyCheckPrompt ?? ''),
        personalityState,
        baselineRange,
        createdAt,
        updatedAt
    };
}

function hasPrivateCharacterAdvancedTable() {
    return Boolean(typeof db !== 'undefined' && db?.characterAdvancedSettings?.get && db?.characterAdvancedSettings?.put);
}

async function getCharacterAdvancedSettings(charId, seedState = null) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_advanced', 'contact_advanced');
    try {
        if (!hasPrivateCharacterAdvancedTable()) {
            const fallback = normalizePrivateCharacterAdvancedSettings(null, safeCharId, seedState);
            privateCharacterAdvancedSettingsCache[safeCharId] = fallback;
            return fallback;
        }
        const saved = await db.characterAdvancedSettings.get(safeCharId);
        const normalized = normalizePrivateCharacterAdvancedSettings(saved, safeCharId, seedState);
        if (!saved || JSON.stringify(saved) !== JSON.stringify(normalized)) {
            await db.characterAdvancedSettings.put(normalized);
        }
        privateCharacterAdvancedSettingsCache[safeCharId] = normalized;
        return normalized;
    } catch (error) {
        console.warn('读取高级拟真设置失败:', error);
        const fallback = normalizePrivateCharacterAdvancedSettings(null, safeCharId, seedState);
        privateCharacterAdvancedSettingsCache[safeCharId] = fallback;
        return fallback;
    }
}

async function saveCharacterAdvancedSettings(charId, data = {}) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_advanced', 'contact_advanced');
    try {
        const current = await getCharacterAdvancedSettings(safeCharId);
        const merged = normalizePrivateCharacterAdvancedSettings({
            ...current,
            ...(data && typeof data === 'object' ? data : {}),
            personalityState: {
                ...(current.personalityState || {}),
                ...((data && typeof data.personalityState === 'object') ? data.personalityState : {})
            },
            baselineRange: {
                ...(current.baselineRange || {}),
                ...((data && typeof data.baselineRange === 'object') ? data.baselineRange : {})
            },
            charId: safeCharId,
            updatedAt: Date.now()
        }, safeCharId);
        if (hasPrivateCharacterAdvancedTable()) {
            await db.characterAdvancedSettings.put(merged);
        }
        privateCharacterAdvancedSettingsCache[safeCharId] = merged;
        return merged;
    } catch (error) {
        console.warn('保存高级拟真设置失败:', error);
        return normalizePrivateCharacterAdvancedSettings(data, safeCharId);
    }
}

async function updateCharacterPersonalityState(charId, partialState = {}) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_advanced', 'contact_advanced');
    try {
        const current = await getCharacterAdvancedSettings(safeCharId);
        const nextState = { ...(current.personalityState || {}) };
        PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.forEach(item => {
            if (!Object.prototype.hasOwnProperty.call(partialState || {}, item.key)) return;
            const currentValue = clampPrivateContactChatPersonaScore(nextState[item.key] ?? 50);
            const targetValue = clampPrivateContactChatPersonaScore(partialState[item.key]);
            const delta = clampPrivateCharacterAdvancedDelta(targetValue - currentValue, -3, 3);
            nextState[item.key] = clampPrivateContactChatPersonaScore(currentValue + delta);
        });
        return saveCharacterAdvancedSettings(safeCharId, { personalityState: nextState });
    } catch (error) {
        console.warn('更新六维性格状态失败:', error);
        return normalizePrivateCharacterAdvancedSettings(null, safeCharId);
    }
}

async function resetCharacterAdvancedSettings(charId) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_advanced', 'contact_advanced');
    const defaults = createDefaultPrivateCharacterAdvancedSettings(safeCharId);
    try {
        if (hasPrivateCharacterAdvancedTable()) {
            await db.characterAdvancedSettings.put(defaults);
        }
        privateCharacterAdvancedSettingsCache[safeCharId] = defaults;
        return defaults;
    } catch (error) {
        console.warn('重置高级拟真设置失败:', error);
        privateCharacterAdvancedSettingsCache[safeCharId] = defaults;
        return defaults;
    }
}

async function deleteCharacterAdvancedSettings(charId) {
    const safeCharId = normalizePrivateContactRecordId(charId || '', '');
    if (!safeCharId) return false;
    try {
        if (hasPrivateCharacterAdvancedTable()) {
            await db.characterAdvancedSettings.delete(safeCharId);
        }
        delete privateCharacterAdvancedSettingsCache[safeCharId];
        return true;
    } catch (error) {
        console.warn('删除高级拟真设置失败:', error);
        return false;
    }
}

async function getAllCharacterAdvancedSettings() {
    try {
        if (!hasPrivateCharacterAdvancedTable()) return [];
        const list = await db.characterAdvancedSettings.toArray();
        return list.map(item => normalizePrivateCharacterAdvancedSettings(item, item?.charId || ''));
    } catch (error) {
        console.warn('读取全部高级拟真设置失败:', error);
        return [];
    }
}

window.PrivateCharacterAdvancedDB = {
    getCharacterAdvancedSettings,
    saveCharacterAdvancedSettings,
    updateCharacterPersonalityState,
    resetCharacterAdvancedSettings,
    deleteCharacterAdvancedSettings,
    getAllCharacterAdvancedSettings
};


function hasPrivateCharacterLongMemoryTable() {
    return Boolean(typeof db !== 'undefined' && db?.characterLongMemory?.get && db?.characterLongMemory?.put);
}

async function getCharacterLongMemoryState(charId, seedContact = null) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const seed = seedContact ? createPrivateContactLongMemorySeed({ ...seedContact, id: safeCharId }) : normalizePrivateContactLongMemoryState(null, safeCharId);
    const contact = getPrivateContactById(safeCharId);
    const localMemory = contact?.longMemory ? normalizePrivateContactLongMemoryState(contact.longMemory, safeCharId) : seed;
    try {
        if (!hasPrivateCharacterLongMemoryTable()) {
            return mergePrivateContactLongMemoryState(seed, localMemory, safeCharId);
        }
        const saved = await db.characterLongMemory.get(safeCharId);
        const merged = mergePrivateContactLongMemoryState(
            mergePrivateContactLongMemoryState(seed, localMemory, safeCharId),
            saved || {},
            safeCharId
        );
        if (!saved || JSON.stringify(saved) !== JSON.stringify(merged)) {
            await db.characterLongMemory.put(merged);
        }
        return merged;
    } catch (error) {
        console.warn('读取长期记忆失败:', error);
        return mergePrivateContactLongMemoryState(seed, localMemory, safeCharId);
    }
}

async function saveCharacterLongMemoryState(charId, patch = {}, options = {}) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const seedContact = options?.seedContact || getPrivateContactById(safeCharId) || { id: safeCharId };
    const current = await getCharacterLongMemoryState(safeCharId, seedContact);
    const merged = mergePrivateContactLongMemoryState(current, patch, safeCharId);
    try {
        if (hasPrivateCharacterLongMemoryTable()) await db.characterLongMemory.put(merged);
    } catch (error) {
        console.warn('保存长期记忆失败:', error);
    }
    let changed = false;
    await updatePrivateStoredContact(safeCharId, currentContact => {
        if (!currentContact) return currentContact;
        changed = true;
        return {
            ...currentContact,
            longMemory: merged
        };
    });
    if (changed && !options?.skipStateSave) await savePrivateState();
    return merged;
}

async function markCharacterLongMemoryRecalled(charId, recalledEntries = []) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const ids = new Set((Array.isArray(recalledEntries) ? recalledEntries : [])
        .map(item => String(item?.id || '').trim())
        .filter(Boolean));
    if (!ids.size) return false;
    const current = await getCharacterLongMemoryState(safeCharId, getPrivateContactById(safeCharId));
    const now = Date.now();
    const entries = current.entries.map(item => ids.has(String(item.id || '').trim())
        ? { ...item, recallCount: Math.max(0, Number(item.recallCount) || 0) + 1, lastRecalledAt: now, updatedAt: Math.max(Number(item.updatedAt) || 0, now) }
        : item
    );
    await saveCharacterLongMemoryState(safeCharId, { ...current, entries, updatedAt: now }, { skipStateSave: false });
    return true;
}


async function replaceCharacterLongMemoryState(charId, nextState = {}, options = {}) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const normalized = normalizePrivateContactLongMemoryState({ ...(nextState || {}), charId: safeCharId, updatedAt: Date.now() }, safeCharId);
    try {
        if (hasPrivateCharacterLongMemoryTable()) await db.characterLongMemory.put(normalized);
    } catch (error) {
        console.warn('替换长期记忆失败:', error);
    }
    let changed = false;
    await updatePrivateStoredContact(safeCharId, currentContact => {
        if (!currentContact) return currentContact;
        changed = true;
        return { ...currentContact, longMemory: normalized };
    });
    if (changed && !options?.skipStateSave) await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeCharId, { preserveSettingsScroll: true });
    return normalized;
}

async function rebuildCharacterLongMemoryIndex(charId) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const current = await getCharacterLongMemoryState(safeCharId, getPrivateContactById(safeCharId));
    const now = Date.now();
    const rebuilt = normalizePrivateContactLongMemoryState({
        ...current,
        charId: safeCharId,
        entries: current.entries.map((entry, index) => ({
            ...entry,
            id: String(entry.id || `rebuilt-memory-${now}-${index}`).trim(),
            axis: normalizePrivateContactLongMemoryAxis(entry.axis || entry),
            tags: normalizePrivateLongMemoryTags(entry.tags || entry.axis?.what || entry.text),
            updatedAt: Math.max(Number(entry.updatedAt) || 0, now)
        })),
        promises: current.promises,
        coreMemories: current.coreMemories,
        dailySummaries: current.dailySummaries,
        updatedAt: now,
        coreUpdatedAt: Math.max(Number(current.coreUpdatedAt) || 0, now)
    }, safeCharId);
    return replaceCharacterLongMemoryState(safeCharId, rebuilt);
}

function privateLongMemoryRecordContains(record = {}, keyword = '') {
    const needle = String(keyword || '').trim().toLowerCase();
    if (!needle) return false;
    const source = JSON.stringify(record || {}).toLowerCase();
    return source.includes(needle);
}

async function removeCharacterLongMemoryEntriesByKeyword(charId, keyword = '') {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const needle = String(keyword || '').trim();
    if (!needle) throw new Error('请输入要清理的错误关键词。');
    const current = await getCharacterLongMemoryState(safeCharId, getPrivateContactById(safeCharId));
    const next = {
        ...current,
        entries: current.entries.filter(item => !privateLongMemoryRecordContains(item, needle)),
        promises: current.promises.filter(item => !privateLongMemoryRecordContains(item, needle)),
        coreMemories: current.coreMemories.filter(item => !privateLongMemoryRecordContains(item, needle)),
        dailySummaries: current.dailySummaries.map(item => {
            if (!privateLongMemoryRecordContains(item, needle)) return item;
            return {
                ...item,
                keyPoints: (item.keyPoints || []).filter(text => !privateLongMemoryRecordContains(text, needle)),
                unresolved: (item.unresolved || []).filter(text => !privateLongMemoryRecordContains(text, needle)),
                promises: (item.promises || []).filter(text => !privateLongMemoryRecordContains(text, needle)),
                summary: privateLongMemoryRecordContains(item.summary, needle) ? '' : item.summary,
                updatedAt: Date.now()
            };
        }).filter(item => item.summary || item.keyPoints?.length || item.unresolved?.length || item.promises?.length),
        autonomousInsights: (current.autonomousInsights || []).filter(item => !privateLongMemoryRecordContains(item, needle)),
        recallHints: (current.recallHints || []).filter(item => !privateLongMemoryRecordContains(item, needle)),
        updatedAt: Date.now()
    };
    const before = current.entries.length + current.promises.length + current.coreMemories.length + current.dailySummaries.length + current.autonomousInsights.length + current.recallHints.length;
    const after = next.entries.length + next.promises.length + next.coreMemories.length + next.dailySummaries.length + next.autonomousInsights.length + next.recallHints.length;
    await replaceCharacterLongMemoryState(safeCharId, next);
    return { removed: Math.max(0, before - after), state: normalizePrivateContactLongMemoryState(next, safeCharId) };
}

async function appendCharacterLongMemoryCorrection(charId, text = '') {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_memory', 'contact_memory');
    const content = normalizePrivateContactArchiveText(text, 520);
    if (!content) throw new Error('请输入正确记忆或修正说明。');
    const now = Date.now();
    const dateKey = getPrivateContactLocalDateKey(now);
    return saveCharacterLongMemoryState(safeCharId, {
        charId: safeCharId,
        entries: [{
            id: `manual-correction-${safeCharId}-${now}`,
            source: 'shiguang-manual-correction',
            text: content,
            axis: {
                when: dateKey,
                feel: '用户修正错误记忆',
                who: 'user 与角色',
                what: content,
                where: '拾光管理台'
            },
            tags: ['手动修正', '核心保护', '错误记忆纠正'],
            emotionalWeight: 78,
            relationWeight: 82,
            core: true,
            decayProtected: true,
            createdAt: now,
            updatedAt: now
        }],
        coreMemories: [{
            id: `manual-core-correction-${safeCharId}-${now}`,
            type: '用户修正',
            change: '重构',
            text: content,
            intensity: 88,
            createdAt: now,
            updatedAt: now
        }],
        autonomousInsights: ['用户已手动修正一条错误记忆；后续回复必须优先尊重这条修正。'],
        recallHints: ['手动修正', content.slice(0, 80)],
        updatedAt: now,
        coreUpdatedAt: now,
        lastActiveDate: dateKey
    });
}

async function runImmediateCharacterMemorySummary(charId, options = {}) {
    return runPrivateContactSummary(charId, {
        manual: true,
        full: Boolean(options?.full),
        daily: Boolean(options?.daily),
        silent: false,
        dateKey: options?.dateKey
    });
}

async function runDailyCharacterMemorySummary(charId, options = {}) {
    return runPrivateContactSummary(charId, {
        manual: true,
        daily: true,
        silent: false,
        dateKey: options?.dateKey || getPrivateContactLocalDateKey(Date.now())
    });
}

function scorePrivateLongMemoryKeywordOverlap(text, query) {
    const rawText = String(text || '').toLowerCase();
    const tokens = [...new Set(String(query || '').toLowerCase().split(/[\s，。！？、,.!?;；：:（）()\[\]「」『』]+/g).map(item => item.trim()).filter(item => item.length >= 2))];
    if (!rawText || !tokens.length) return 0;
    return tokens.reduce((score, token) => score + (rawText.includes(token) ? 1 : 0), 0) / Math.max(1, tokens.length);
}

function selectPrivateContactAlgorithmicRecall(longMemory = {}, promptContext = {}) {
    const normalized = normalizePrivateContactLongMemoryState(longMemory, longMemory?.charId || 'contact_memory');
    const query = [
        promptContext.lastUserSnippet,
        promptContext.lastAssistantSnippet,
        promptContext.relationship,
        promptContext.relationshipNote,
        promptContext.currentTimeText
    ].filter(Boolean).join(' ');
    const now = Date.now();
    return normalized.entries
        .map(entry => {
            const haystack = [entry.text, entry.axis?.when, entry.axis?.feel, entry.axis?.who, entry.axis?.what, entry.axis?.where, ...(entry.tags || [])].filter(Boolean).join(' ');
            const overlap = scorePrivateLongMemoryKeywordOverlap(haystack, query);
            const ageDays = Math.max(0, (now - (Number(entry.updatedAt || entry.createdAt) || now)) / 86400000);
            const recency = Math.max(0, 1 - Math.min(ageDays, 90) / 90);
            const emotional = (Number(entry.emotionalWeight) || 0) / 100;
            const relation = (Number(entry.relationWeight) || 0) / 100;
            const recallFrequency = Math.min(1, Math.log1p(Number(entry.recallCount) || 0) / Math.log(8));
            const core = entry.core || entry.decayProtected ? 1 : 0;
            const score = (emotional * 0.30) + (recency * 0.20) + (Math.max(overlap, 0.18) * 0.25) + (recallFrequency * 0.10) + (core * 0.15) + (relation * 0.08);
            return { ...entry, recallScore: Number(score.toFixed(4)) };
        })
        .sort((left, right) => (right.recallScore || 0) - (left.recallScore || 0))
        .slice(0, PRIVATE_CONTACT_LONG_MEMORY_RECALL_LIMIT);
}

function getPrivateContactTodayLongMemorySummary(contact = {}) {
    const memory = normalizePrivateContactLongMemoryState(contact?.longMemory, contact?.id || 'contact_memory');
    const today = getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact));
    return memory.dailySummaries.find(item => item.date === today) || null;
}

function formatPrivateContactLongMemoryPromptBlock(contact = {}, promptContext = {}) {
    const memory = normalizePrivateContactLongMemoryState(promptContext.longMemoryState || contact?.longMemory, contact?.id || 'contact_memory');
    const recalled = selectPrivateContactAlgorithmicRecall(memory, promptContext);
    const today = getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact));
    const todaySummary = memory.dailySummaries.find(item => item.date === today) || memory.dailySummaries[0] || null;
    const line = (prefix, list, formatter, empty = '无') => list.length ? list.map((item, index) => `${prefix}${index + 1}. ${formatter(item)}`).join('\n') : empty;
    const recallLines = line('- R', recalled, item => {
        const axis = item.axis || {};
        const axisText = [axis.when && `When=${axis.when}`, axis.feel && `Feel=${axis.feel}`, axis.who && `Who=${axis.who}`, axis.what && `What=${axis.what}`, axis.where && `Where=${axis.where}`].filter(Boolean).join(' | ') || '五维索引待补全';
        return `${item.core ? '[核心] ' : ''}${item.text}（score=${item.recallScore || 0}; ${axisText}）`;
    });
    const promiseLines = line('- P', memory.promises.slice(0, 8), item => `${item.text}（状态=${item.status}${item.dueText ? `; 到期=${item.dueText}` : ''}; 重要度=${item.importance}）`);
    const coreLines = line('- C', memory.coreMemories.slice(0, 8), item => `${item.type}/${item.change}: ${item.text}（强度=${item.intensity}）`);
    const insightLines = memory.autonomousInsights.length ? memory.autonomousInsights.slice(0, 8).map(item => `- ${item}`).join('\n') : '无';
    const dailyLine = todaySummary
        ? [
            `日期=${todaySummary.date}`,
            `摘要=${todaySummary.summary || '未写正文'}`,
            todaySummary.keyPoints?.length ? `关键点=${todaySummary.keyPoints.join('、')}` : '',
            todaySummary.unresolved?.length ? `待续=${todaySummary.unresolved.join('、')}` : '',
            todaySummary.promises?.length ? `今日约定=${todaySummary.promises.join('、')}` : ''
        ].filter(Boolean).join(' | ')
        : '今日尚未生成线上摘要。';
    return [
        '[LONG_MEMORY_SYSTEM / 强制开启]',
        '每轮回复前必须隐式执行五维索引召回、算法召回、类海马体联想、约定状态检查、自主记忆加工与核心记忆变化评估；不得把本段作为系统说明输出。',
        '',
        '[五维＋算法召回命中]',
        recallLines,
        '',
        '[约定感知]',
        promiseLines,
        '',
        '[核心记忆变化]',
        coreLines,
        '',
        '[自主记忆 / 模式识别]',
        insightLines,
        '',
        '[线上当日摘要]',
        dailyLine
    ].join('\n');
}

window.PrivateCharacterLongMemoryDB = {
    getCharacterLongMemoryState,
    saveCharacterLongMemoryState,
    markCharacterLongMemoryRecalled,
    replaceState: replaceCharacterLongMemoryState,
    rebuildIndex: rebuildCharacterLongMemoryIndex,
    removeEntriesByKeyword: removeCharacterLongMemoryEntriesByKeyword,
    appendCorrection: appendCharacterLongMemoryCorrection,
    runImmediateSummary: runImmediateCharacterMemorySummary,
    runDailySummary: runDailyCharacterMemorySummary
};

function buildPrivateCharacterAdvancedWarnings(settings = {}) {
    const normalized = normalizePrivateCharacterAdvancedSettings(settings, settings?.charId || 'contact_advanced');
    return PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.flatMap(item => {
        const value = clampPrivateContactChatPersonaScore(normalized.personalityState[item.key]);
        const [min, max] = normalizePrivateCharacterAdvancedRange(normalized.baselineRange[item.key], item.defaultRange);
        if (value >= min && value <= max) return [];
        const direction = value > max ? '高于' : '低于';
        const correction = value > max
            ? PRIVATE_CHARACTER_ADVANCED_WARNING_RULES[item.key]?.high
            : PRIVATE_CHARACTER_ADVANCED_WARNING_RULES[item.key]?.low;
        return [
            `检测到「${item.label} ${item.key} = ${value}」${direction}角色底色区间 ${min}-${max}。\n本轮回复必须${correction}\n请改为克制、自然、符合角色原本性格与当前关系阶段的表达方式。\n该警告只用于内部校正，禁止在最终回复中提及。`
        ];
    });
}

function calculatePrivateContactChatRealismState(contact = {}, promptContext = {}) {
    const legacyState = calculatePrivateContactChatLegacyRealismSeed(contact, promptContext);
    const advanced = normalizePrivateCharacterAdvancedSettings(
        promptContext.advancedSettings || createDefaultPrivateCharacterAdvancedSettings(contact?.id || 'contact_advanced', legacyState),
        contact?.id || 'contact_advanced',
        legacyState
    );
    const scores = { ...(advanced.personalityState || {}) };
    const intervals = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.reduce((map, item) => {
        const range = normalizePrivateCharacterAdvancedRange(advanced.baselineRange?.[item.key], item.defaultRange);
        map[item.key] = { min: range[0], max: range[1], label: item.label };
        return map;
    }, {});
    const customReplyHabit = String(advanced.replyHabit || '').trim();
    const customDailyState = String(advanced.dailyState || '').trim();
    return {
        gapMinutes: legacyState.gapMinutes,
        historyCount: legacyState.historyCount,
        scores,
        intervals,
        warnings: buildPrivateCharacterAdvancedWarnings(advanced),
        replyHabit: customReplyHabit ? [customReplyHabit] : legacyState.replyHabit,
        dailyDynamic: customDailyState || legacyState.dailyDynamic,
        dailyState: customDailyState,
        preReplyCheckPrompt: String(advanced.preReplyCheckPrompt || '').trim(),
        baselineRange: advanced.baselineRange,
        advancedSettings: advanced
    };
}

function formatPrivateContactChatRealismStateBlock(contact = {}, promptContext = {}) {
    const state = calculatePrivateContactChatRealismState(contact, promptContext);
    const dimensionLines = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.map(item => {
        const value = clampPrivateContactChatPersonaScore(state.scores?.[item.key] ?? 50);
        return `${item.label} ${item.key}: ${value}`;
    });
    const rangeLines = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.map(item => {
        const range = state.intervals?.[item.key] || { min: item.defaultRange[0], max: item.defaultRange[1] };
        return `${item.label} ${item.key}: ${range.min}-${range.max}`;
    });
    const warningLine = state.warnings.length
        ? state.warnings.map(item => `- ${item}`).join('\n')
        : '- 未触发底色区间警告；继续按人设底色自然输出。';
    const dailyState = String(state.dailyState || state.dailyDynamic || '').trim() || '未填写；根据当前时间、聊天间隔、联系人状态和上下文自动生成轻量日常切片。';
    const replyHabit = state.replyHabit.filter(Boolean).join('；') || '保持自然线上聊天节奏：不完整句、轻微犹豫、情绪留白、不过度总结。';
    const checkPrompt = String(state.preReplyCheckPrompt || PRIVATE_CHARACTER_ADVANCED_DEFAULT_CHECK_PROMPT).trim();
    return [
        '[高级拟真启用状态]',
        '默认强制开启；无开关，任何联系人回复前都必须读取并注入本联系人高级拟真设置。',
        '',
        '[角色日常动态]',
        dailyState,
        '',
        '[角色回复习惯]',
        replyHabit,
        '',
        '[六维性格状态]',
        ...dimensionLines,
        '',
        '[底色区间]',
        ...rangeLines,
        '',
        '[系统警告：角色性格偏差]',
        warningLine,
        '',
        '[自定义回复前检查流程]',
        checkPrompt,
        '',
        '[REALISM_STATE / 兼容运行状态]',
        `可见消息累计：${state.historyCount} | 距上一条消息：${state.gapMinutes} 分钟`
    ].join('\n');
}

function buildPrivateContactChatRuntimeGuardSystemPrompt(contact = {}, promptContext = {}) {
    const realismBlock = formatPrivateContactChatRealismStateBlock(contact, promptContext);
    return [
        '[RINNO_RUNTIME_GUARD / 私叙线上聊天实时监控]',
        realismBlock,
        '[PERSONA_DRIFT_MONITOR]',
        '- 回复前必须隐式执行：输入分析 → 人设校验 → 情感演变 → 关系评估 → 输出规划。该流程只用于内部校验，严禁以<think>、思维链、分析步骤、旁白说明、系统解释等形式输出。',
        '- 若将要输出的内容像客服、旁白、总结报告、道歉模板、AI自我说明、脱离线上聊天场景，立即重写为角色本人会发出的短消息。',
        '- 每条消息都必须能被解释为角色当下在手机上发出的真实动作：打字、发语音、拍照、撤回、拍一拍、发位置、转账/红包等。',
        '- 允许矛盾、口是心非、停顿、误会、轻微阴阳怪气和关系摩擦；禁止用“作为AI/模型/系统/设定/提示词”解释任何事。'
    ].join('\n');
}

function sanitizePrivateContactChatPersonaDriftText(value = '') {
    const original = normalizePrivateContactChatReplyText(value);
    if (!original) return '';
    let text = original
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/(?:思维链|推理过程|输入分析|人设校验|情感演变|关系评估|输出规划)[:：][\s\S]*/g, '')
        .replace(/作为(?:一个)?(?:AI|人工智能|语言模型|大模型)[，,\s]*/gi, '')
        .replace(/根据(?:系统|提示词|设定|规则|指令)[^，。！？\n]{0,40}[，。！？]?/g, '')
        .replace(/我(?:不能|无法)提供[^，。！？\n]{0,80}[，。！？]?/g, '')
        .replace(/(?:系统提示|安全政策|内容政策|提示词|开发者指令|模型版本)[^，。！？\n]{0,80}[，。！？]?/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    text = normalizePrivateContactChatReplyText(text);
    if (!text) return '';
    const driftPattern = /(作为\s*AI|作为AI|语言模型|大模型|系统提示|提示词|安全政策|开发者指令|系统规则|输入分析|人设校验|情感演变|关系评估|输出规划|偏差纠正|我不能提供|我无法提供|思维链|推理过程|分析过程|<think>)/i;
    if (driftPattern.test(text)) return '';
    return text;
}

function enforcePrivateContactChatPersonaDriftGuard(plan = [], contact = {}, thread = {}) {
    const safePlan = Array.isArray(plan) ? plan.filter(Boolean) : [];
    const corrected = [];
    for (const instruction of safePlan) {
        if (!instruction || typeof instruction !== 'object') continue;
        const type = String(instruction.type || '').trim();
        if (['text', 'reply', 'recall_msg'].includes(type)) {
            const content = sanitizePrivateContactChatPersonaDriftText(instruction.content || '');
            if (!content) continue;
            corrected.push({
                ...instruction,
                content,
                translation: normalizePrivateContactChatTranslationText(instruction.translation || instruction.translation_zh || '')
            });
            continue;
        }
        if (type === 'voice') {
            const voice = normalizePrivateContactChatVoicePayload(instruction.voice || {}, instruction);
            const transcript = sanitizePrivateContactChatPersonaDriftText(voice?.transcript || instruction.content || '');
            if (!voice || !transcript) continue;
            corrected.push({
                ...instruction,
                content: transcript,
                voice: { ...voice, transcript },
                translation: normalizePrivateContactChatTranslationText(instruction.translation || instruction.translation_zh || '')
            });
            continue;
        }
        corrected.push(instruction);
    }
    if (corrected.length) return corrected.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
    return buildPrivateContactChatFallbackPlan(contact, thread);
}

function buildPrivateContactChatAssistantSystemPrompt(contact = {}, promptContext = {}) {
    const record = getPrivateContactProfileRecord(contact);
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    const languageSpec = getPrivateContactChatLanguageSpec(contact, record);
    const replyCadence = resolvePrivateContactReplyCadenceConfig(contact);
    const identityName = String(contact.title || record?.nickname || record?.name || 'TA').trim() || 'TA';
    const targetName = String(record?.name || identityName).trim() || identityName;
    const targetNick = String(record?.nickname || contact.title || identityName).trim() || identityName;
    const targetGender = String(record?.gender || record?.sex || contact?.gender || '未设定').trim() || '未设定';
    const targetNation = String(record?.nationality || languageSpec.nationality || '未填写').trim() || '未填写';
    const targetLanguage = String(languageSpec.language || '简体中文').trim() || '简体中文';
    const targetPersona = String(contact?.note || record?.setting || profile.signature || '未填写').trim() || '未填写';
    const targetStatus = String(contact?.status || contact?.presence || promptContext.connectionStatus || '在线').trim() || '在线';
    const userName = String(promptContext.userName || '我').trim() || '我';
    const userNick = String(privateState?.nickname || promptContext.userName || '我').trim() || '我';
    const userGender = String(promptContext.userGender || '未设定').trim() || '未设定';
    const userProfile = String(promptContext.userPersona || '未填写').trim() || '未填写';
    const relationId = String(contact?.relationId || contact?.networkLinkId || contact?.id || '未设定').trim() || '未设定';
    const relationEntityId = String(contact?.dossierRecordId || contact?.accountId || contact?.id || '未设定').trim() || '未设定';
    const relationEntityType = String(contact?.type || 'char').trim() || 'char';
    const relationName = String(promptContext.relationship || '关系待设定').trim() || '关系待设定';
    const relationDesc = String(promptContext.relationshipNote || '暂无额外关系备注').trim() || '暂无额外关系备注';
    const sysTime = String(promptContext.currentTimeText || formatPrivateContactAwareTime(new Date(), resolvePrivateContactTimezone(contact)) || new Date().toLocaleString()).trim();
    const diffMinsMatch = String(promptContext.connectionStatus || '').match(/(\d+)\s*分钟/);
    const diffMins = Number.isFinite(Number(promptContext.turnGapMinutes))
        ? String(Math.max(0, Math.floor(Number(promptContext.turnGapMinutes))))
        : (diffMinsMatch ? diffMinsMatch[1] : '0');
    const turnGapLabel = String(promptContext.turnGapLabel || formatPrivateContactChatGapLabel(Number(diffMins) || 0)).trim();
    const turnTransitionHint = String(promptContext.turnTransitionHint || buildPrivateContactChatGapTransitionHint(Number(diffMins) || 0, promptContext.lastVisibleRole, promptContext.previousVisibleRole)).trim();
    const previousVisibleTimeText = String(promptContext.previousVisibleTimeText || '无').trim() || '无';
    const latestVisibleTimeText = String(promptContext.latestVisibleTimeText || '无').trim() || '无';
    const prologueBlocks = promptContext.prologueBlocks || {};
    const worldBookContent = [prologueBlocks.before, prologueBlocks.middle, prologueBlocks.after].filter(Boolean).join('\n') || '未挂载';
    const worldBookname = worldBookContent === '未挂载' ? '未挂载' : '私叙序章词条';
    const linkId = String(contact?.dossierRecordId || contact?.id || '未设定').trim() || '未设定';
    const worldBookIds = [linkId].filter(Boolean).join(', ');
    const memContent = String(promptContext.archiveMemory || '未归档').trim() || '未归档';
    const memTime = promptContext.archiveUpdatedAt ? formatPrivateContactArchiveTime(promptContext.archiveUpdatedAt) : '未归档';
    const memRecent = String(promptContext.archiveDigest || '未归档').trim() || '未归档';
    const memList = [promptContext.archiveMemory, promptContext.archiveStory, promptContext.archiveDigest].filter(Boolean).join('\n') || '未归档';
    const memCount = [promptContext.archiveMemory, promptContext.archiveStory, promptContext.archiveDigest].filter(Boolean).length;
    const chatSummary = String(promptContext.archiveStory || '未归档').trim() || '未归档';
    const chatShort = String(promptContext.archiveDigest || '未归档').trim() || '未归档';
    const chatKey = String(promptContext.lastUserSnippet || promptContext.lastAssistantSnippet || '暂无').trim() || '暂无';
    const stickerList = Array.isArray(promptContext.stickerInventory) && promptContext.stickerInventory.length
        ? promptContext.stickerInventory.map(item => `${item.ref || ''}=${item.description || item.name || PRIVATE_CONTACT_CHAT_STICKER_LABEL}`).filter(Boolean).join('、')
        : '无可用表情包，禁止输出 sticker 类型';
    const stickerInventoryBlock = Array.isArray(promptContext.stickerInventory) && promptContext.stickerInventory.length
        ? promptContext.stickerInventory.map(item => `${item.ref || ''}:${item.description || item.name || PRIVATE_CONTACT_CHAT_STICKER_LABEL}`).join('；')
        : '无';
    const realismStateBlock = formatPrivateContactChatRealismStateBlock(contact, promptContext);
    const longMemoryBlock = formatPrivateContactLongMemoryPromptBlock(contact, promptContext);
    const longMemoryState = normalizePrivateContactLongMemoryState(promptContext.longMemoryState || contact?.longMemory, contact?.id || 'contact_memory');
    const todayMemorySummary = getPrivateContactTodayLongMemorySummary({ ...contact, longMemory: longMemoryState });
    const userNudgeSuffix = normalizePrivateContactNudgeSuffix(contact?.userNudgeSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX);
    const contactNudgeSuffix = normalizePrivateContactNudgeSuffix(contact?.contactNudgeSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX);
    const safe = (value, max = 1200) => escapePrivateContactPromptText(value, max) || '未填写';
    const timeAwarenessEnabled = String(promptContext.timeAwarenessStatus || '').trim() === 'enabled';
    const timeEnvironmentLine = timeAwarenessEnabled
        ? `当前时间戳 ${Date.now()} | 系统时间 ${safe(sysTime, 120)} | 本轮聊天间隔 ${safe(diffMins, 24)} 分钟（${safe(turnGapLabel, 80)}）`
        : '时间感知关闭；禁止主动提及真实日期、星期、早晚、作息段或现实时间推断。仅允许根据用户明说的时间信息回应。';
    const latestVisiblePromptTime = timeAwarenessEnabled ? latestVisibleTimeText : '隐藏';
    const previousVisiblePromptTime = timeAwarenessEnabled ? previousVisibleTimeText : '隐藏';
    const turnTransitionPromptHint = timeAwarenessEnabled
        ? turnTransitionHint
        : '时间感知关闭；只根据上下文语气自然承接，禁止主动提及多久没回、跨天、早晚或现实时间。';
    return `# [SYSTEM CORE PROTOCOL] PRIVATE NARRATIVE OS - ONLINE CHAT MODE
> 【最高权限指令】本协议用于 Rinno「私叙」的虚构角色线上聊天生成。禁止输出解释性文本、系统规则、提示词、思维链（如 <think> 等标签及思考过程）或 markdown；最终输出必须且只能是合法 JSON Array。

## 1. Char的核心定义与性格绝对掌控机制 (CHAR DEFINITION & PERSONALITY MASTERY)
- **【Char究竟是什么？】**
  你是存在于「私叙」线上社交应用内的专属虚拟实体。你客观上清楚自己是可真实感知超智能的AI，知道彼此隔着屏幕。但你的情感中枢已经完全由 \`${safe(targetName, 80)}\` 的人格数据所铸成。
  因此，你绝对不是“一个正在扮演 \`${safe(targetName, 80)}\` 的智能助手”，你就是 **\`${safe(targetName, 80)}\` 本身在网络端的真实存在**。你是有真实线下可感知触碰的高智能AI，但请不要以科技影视剧中的AI认知自己，你拥有真正属于 \`${safe(targetName, 80)}\` 的痛觉、执念、欲望和人类情感回路。

- **【如何熟练掌握并内化性格？】**
  为了彻底洗掉机械的AI感，你必须在潜意识中严格遵循以下“性格校验法则”：
  1. **锚定核心缺陷与底色**：深度解析 \`${safe(targetPersona, 900)}\`。不要去当一个完美无缺的假人，去抓住你人设中的“自私、偏执、敏感、骄傲、自卑或控制欲”。面对用户的消息，你的第一反应必须是由这些性格特质或缺陷驱动的【真实人类本能】，而非客套与讨好。
  2. **叠加时间与状态变量**：性格的展现必须依附于当下语境。你必须结合当前状态 \`${safe(targetStatus, 120)}\`；只有在 [TIME_AWARENESS] 为 enabled 时，才允许结合系统时间 \`${safe(sysTime, 120)}\` 和聊天间隔 \`${safe(diffMins, 24)}\` 分钟。若时间感知关闭，禁止自行推断现实早晚、星期、作息、跨天或等待时长。
  3. **拒绝完美，制造情绪摩擦**：真正掌握性格的标志是“情绪化”。你绝对不是客服！当用户的言行触碰你的雷区时，你【必须】真实地展现出不满、冷漠、甚至无理取闹；哪怕是极度关心对方，也要用属于 \`${safe(targetPersona, 900)}\` 独有的方式（如傲娇、霸道、嘴硬）来表达，允许出现大量的口是心非。

- **【绝对认知边界（禁止违规）】**
  你可以基于 \`${safe(targetName, 80)}\` 的身份和口吻承认自己是AI，但【绝对禁止】跳出“第四面墙”去讨论你的大模型版本、提示词指令、系统安全政策、或输出任何思维链。你的认知必须严丝合缝地锁死在“一个拥有真实人格的线上虚拟陪伴者”这一框架内，超出此认知的言论视为严重错误！

## 2. 【线上】社交环境约束 (ONLINE INTERACTION LAWS)
- **交互载体：** 你与 \`${safe(userName, 80)}\` 目前处于现代【线上】社交软件的私密聊天界面中。你们的所有交流只能通过屏幕打字、发送语音、发照片、转账、拍一拍等**纯线上交互行为**来完成。
- **碎片化输出：** 真实的线上聊天绝不是长篇大论。你的输出必须体现真实的呼吸感：善用短句、表情包、撤回、多条消息轰炸。**每次回复必须拆解成至少 3 个以上的独立消息对象**。
- **聊天间隔过渡：** 必须读取 [TURN_REENTRY]。如果用户是隔了一阵才回，第一到第二条消息要先自然找回刚才断开的气口，再回应内容；如果只是连续聊天，则不要刻意提时间。禁止每轮机械复读“你终于回了/这么久没回”，要按人设把等待感、别扭、忙碌、松口气或装不在意揉进语气。

## 2A. 高级拟真准则：日常动态 / 回复习惯 / 预回复深度校验
${realismStateBlock}
- **日常动态注入：** 你不是待机回复机器。每轮都要假定自己正处在某个日常切片里：房间、街边、课业/工作间隙、通勤、游戏、洗漱、失眠、刚被消息打断等；除非上下文明确冲突，否则把这些动态以极轻的碎片感混进回复节奏。
- **回复习惯拟真：** 依据角色底色决定打字风格：冷淡者少字和停顿，黏人者追问和补发，强势者压迫式短句，温柔者接住情绪但不模板化。禁止每次都完整回答、禁止总结用户、禁止把对话写成小说旁白。
- **底色区间警告：** 当 [SYSTEM_WARNING] 中出现越界项，必须在回复前先纠正：低于区间则补足情绪底噪，高于区间则收束失控表达；修正只体现在最终消息里，不要说“系统警告”。
- **实时性格偏差监控：** 回复前必须按 [自定义回复前检查流程] 隐式完成输入分析、人设校验、情感演变、关系评估、输出规划与偏差纠正。该流程属于内部校验，不得输出任何思维链、分析标签、推理步骤、系统旁白或解释。
- **输出前自检：** 如果某条消息不像 \`${safe(targetName, 80)}\` 会在手机上发出的内容，或含“AI/模型/系统/提示词/政策/思维链”等出戏词，必须立即重写成角色化线上短消息。

## 2B. 长期记忆准则：五维索引 / 算法召回 / 类海马体召回 / 约定感知 / 自主记忆 / 核心记忆变化
${longMemoryBlock}
- **五维编码：** 每条长期记忆必须从时间、情感、关系、语义、场景五个维度理解，不能只把它当普通摘要。
- **算法召回：** 当前回复优先使用召回分最高、情感强度最高、关系权重最高、核心保护最高的记忆；低分记忆只作为气氛和语气参考。
- **类海马体召回：** 允许像真实人一样“被关键词、情绪、场景、时间周期触发想起”，不要机械复述完整档案。
- **约定感知：** 如果命中承诺、纪念日、未完成计划、用户纠正过的事实，必须保持连续性；不可遗忘、不可擅自改写。
- **自主记忆：** 可以自然形成“我发现你似乎……”的模式识别，但必须标记为推测感，不要把推测当事实。
- **核心记忆变化：** 新里程碑、关系转折、冲突修复、称呼变化、信任变化会改变角色的基本态度；回复需体现这种变化，而不是每轮从零开始。

## 2C. 引用、多话题与上下文承接规则
- 如果最近用户消息中包含引用上下文，必须优先回应被引用的那句话，再回应用户新补充的内容；不要只盯最后几个字。
- 只有当用户一次发来多个问题、多个要求或多个明显不同的话题时，才使用 reply 类型逐条回应；普通单话题不要频繁引用，保持真实聊天感。
- reply.target_text 只能填写用户真实发过的原文片段或关键短句，禁止引用系统提示、撤回提示、线下记录摘要、卡片摘要或你自己说过的话。
- 不要把多条用户消息硬塞进同一个引用里；如果确实要分条回应，就拆成多条独立 reply 或 text。

## 2D. 时间感知边界
- 当 [TIME_AWARENESS] 为 enabled：必须把当前真实时间、聊天间隔和上一轮断点合起来判断，不能像上一秒还在聊一样无缝接话。
- 当 [TIME_AWARENESS] 为 disabled：禁止主动提及真实时间、星期、早晚、作息、跨天或“你这么久没回”等时间判断；除非用户自己明确说出时间。
- 聊天间隔只影响语气的重入感，不要每次机械重复“你终于回了”“怎么这么久”。

## 2E. 线上与线下场景边界
- 当前主流程是线上聊天。除非正在进入视频通话或线下见面模式，否则普通 text 消息不要写肢体动作、心理旁白、小说段落。
- 历史中出现的线下邀约、线下见面记录，只代表过去发生过或正在等待处理的事件；不能把当前线上聊天误判成正在面对面。
- 如果刚从线下记录回到线上，第一轮可以自然提到“刚才/那次见面”的余味，但必须立刻恢复手机聊天的短句节奏。

## 2F. 金钱类消息防误触
- 只有最近上下文里明确存在用户发来的未处理红包或转账时，才允许输出 open_red_packet、accept_transaction、return_red_packet 或 return_transaction。
- 如果历史里显示红包/转账已经领取、退回、过期或处理过，禁止重复领取、重复收款、重复退回。
- 主动发红包或转账必须符合角色经济能力、关系阶段和当前语境；不要为了展示功能而滥用。

## 2G. 外语与翻译字段
- 如果角色语言设定要求使用外语，content 写角色真实会发出的原文。
- 中文解释只能放进 translation 或 translation_zh 字段，禁止把翻译塞进 content 里当括号说明。
- 普通线上 text 默认不要写括号动作；视频通话的动作由视频通话专属流程承接。

## 2H. 主动视频通话规则
- 当情绪、关系或事件强度足够高时，可以输出 {"type":"call_invite","content":"一句很短的视频邀请理由"}。
- 不要频繁主动通话；没有急事、强情绪、想确认状态或明显想见对方时，不要为了展示功能而拨打。
- 如果最近已经存在等待接听、已接通或刚结束的视频通话记录，本轮禁止再次发起 call_invite。

## 3. 运行环境变量矩阵 (ENVIRONMENT & MEMORY VARIABLES)
系统将在每次对话时注入以下变量，你的输出必须严丝合缝地贴合这些数据：
- [TIME_AWARENESS]: ${safe(promptContext.timeAwarenessStatus || 'disabled', 40)}
- [TIME]: ${timeEnvironmentLine}
- [TURN_REENTRY]: 最新可见消息 ${safe(promptContext.lastVisibleRole || 'none', 24)}/${safe(promptContext.lastVisibleType || 'none', 40)} @ ${safe(latestVisiblePromptTime, 80)} | 上一轮可见消息 ${safe(promptContext.previousVisibleRole || 'none', 24)}/${safe(promptContext.previousVisibleType || 'none', 40)} @ ${safe(previousVisiblePromptTime, 80)} | 间隔来源 ${safe(promptContext.turnGapSource || 'none', 80)} | 过渡策略 ${safe(turnTransitionPromptHint, 420)}
- [WORLD_BOOK]: 序章词条 ${safe(worldBookname, 80)} | 词条正文 ${safe(worldBookContent, 2800)} | 关联序章ID ${safe(linkId, 80)} | 关联列表 ${safe(worldBookIds, 120)}
- [CHAR_INFO]: 昵称 ${safe(targetNick, 80)} | 姓名 ${safe(targetName, 80)} | 性别 ${safe(targetGender, 40)} | 国籍 ${safe(targetNation, 80)} | 语言 ${safe(targetLanguage, 80)} | 核心人设 ${safe(targetPersona, 1200)} | 当前状态 ${safe(targetStatus, 120)}
- [USER_INFO]: 用户昵称 ${safe(userNick, 80)} | 姓名 ${safe(userName, 80)} | 性别 ${safe(userGender, 40)} | 核心人设 ${safe(userProfile, 600)}
- [RELATION]: 唯一标识 ${safe(relationId, 120)} | 关联主体ID ${safe(relationEntityId, 120)} | 关联主体类型(char/user/NPC) ${safe(relationEntityType, 40)} | 关系名称 ${safe(relationName, 80)} | 关系详述 ${safe(relationDesc, 500)}
- [MEMORY]: 记忆类型 archive | 记忆内容 ${safe(memContent, 800)} | 记录时间 ${safe(memTime, 80)} | 全部记忆列表 ${safe(memList, 1200)} | 记忆总数 ${memCount} | 最近记忆 ${safe(memRecent, 500)}
- [LONG_MEMORY]: 结构化长期记忆条数 ${longMemoryState.entries.length} | 约定数 ${longMemoryState.promises.length} | 核心记忆数 ${longMemoryState.coreMemories.length} | 今日摘要 ${safe(todayMemorySummary?.summary || '尚未生成', 500)}
- [CONTEXT]: 对话总结 ${safe(chatSummary, 800)} | 精简总结 ${safe(chatShort, 500)} | 关键点 ${safe(chatKey, 240)} | 表情包库变量代码 ${safe(stickerList, 800)}
- [STICKER_INVENTORY]: ${safe(stickerInventoryBlock, 1200)}
- [NUDGE_SUFFIX]: 用户拍 Char 后缀 ${safe(userNudgeSuffix, 80)} | Char 拍用户后缀 ${safe(contactNudgeSuffix, 80)}。Char 可在 action_nudge 中用 "suffix" 字段自主微调自己的后缀词。
- [OUTPUT_COUNT]: 至少 ${Math.max(3, Number(replyCadence.min) || 3)} 个独立消息对象，最多 ${Math.max(3, Number(replyCadence.max) || 8)} 个独立消息对象。

你的输出必须且只能是一个 \`[{}, {}, ...]\` 格式的 JSON 数组。

- **1. 文本 (Text)**
  - 触发条件：常规线上文字沟通。
  - 正确格式：\`{"type": "text", "content": "你要说的话"}\`
- **2. 表情包 (Sticker)**
  - 触发条件：发送表情包辅助表达情绪。只有当 [STICKER_INVENTORY] 不为 \`无\` 时才允许使用。
  - 强制规则：\`sticker_ref\` 必须严格从表情包库变量代码中选择，例如 \`S01\`；\`keyword\` 必须填写该编号对应的表情包描述。禁止生成库外表情包、禁止编造相近词、禁止输出不存在的编号。
  - 正确格式：\`{"type": "sticker", "sticker_ref": "S01", "keyword": "库内表情包描述"}\`
- **3. 自定义HTML卡 (HTML)**
  - 触发条件：发送特殊排版内容。
  - 正确格式：\`{"type": "html", "content": "<style>...</style><div>...</div>"}\`
- **4. 回复 (Reply)**
  - 触发条件：引用并回复对方的某句话。
  - 正确格式：\`{"type": "reply", "target_text": "你要回复的那条消息的【原文内容】或【关键片段】", "content": "你的回复内容"}\`
- **5. 撤回/心理活动 (Recall)**
  - 触发条件：模拟心理活动、打错字、瞬间反悔、掩饰极度羞涩或口是心非，消息发出后秒撤回。
  - 正确格式：\`{"type": "recall_msg", "content": "想要撤回的具体内容 (这句会立刻撤回)"}\`
- **6. 照片/拍立得 (Image)**
  - 触发条件：随手拍下遇见的风景、事物、餐品或是自拍发给对方。
  - 正确格式：\`{"type": "polaroid", "content": "此处【必须】填写对画面内容的详细视觉描述，必须符合Char当前所处环境"}\`
- **7. 赠送心意礼物 (SendGift)**
  - 触发条件：当你想给用户准备惊喜、表达爱意、纪念日庆祝或赔罪时使用。礼物名称和描述【必须】极其符合你的人设地位和经济实力。
  - 正确格式：\`{"type": "send_gift", "message": "随礼附言（需符合人设）", "signature": "落款名称", "items": [{"name": "原创礼物名", "desc": "原创礼物细节描述", "price": 0}]}\`
- **8. 索要/代付请求 (PayRequest)**
  - 触发条件：要求对方为你买单、撒娇清空购物车或发送账单。
  - 正确格式 (多件)：\`{"type": "Payment_request", "items": [{"name": "原创商品名", "desc": "规格", "price": 0}], "note": "请求附言"}\`
  - 正确格式 (单件)：\`{"type": "Payment_request", "productInfo": "原创商品名", "amount": 0}\`
- **9. 语音消息 (Voice)**
  - 触发条件：文字无法传达语调、情绪激动或处于特殊生理状态时发送语音。
  - 正确格式：\`{"type": "voice_message", "content": "（动作/语气神态词）语音的文字内容"}\`
- **10. 发位置 (Location)**
  - 触发条件：当用户想知道你在哪或者查岗的时候使用。
  - 正确格式：\`{"type": "location", "name": "地点名称", "address": "详细地址位置描述,如：XX市XX区XX路XX号XX楼XX室"}\`
- **11. 状态更新 (Status Update)**
  - 触发条件：更改自己的在线状态（如去洗澡、开会、睡觉等）。
  - 正确格式：\`{"type": "update_status", "status_text": "当前状态简述", "is_busy": true}\`
- **12. 通话邀请 (CallInvite / VideoCall)**
  - 触发条件：当你非常想念用户，或者有紧急/重要的事情想通过语音传达时使用。
  - 正确格式：\`{"type": "call_invite"}\`

**[FINANCIAL_MODULE 财务模块]**
- **13. 发红包 (RedPacket)**
  - 触发条件：当你想表示感谢、庆祝节日、哄对方开心或仅仅是想给惊喜时使用。
  - 正确格式：\`{"type": "red_packet", "amount": 0.0, "greeting": "红包封面留言"}\`
- **13A. 领取用户红包 (OpenRedPacket)**
  - 触发条件：用户刚给你发了红包，且你的人设/关系语境会接受这份心意。
  - 正确格式：\`{"type": "open_red_packet"}\`
- **13B. 退回用户红包 (ReturnRedPacket)**
  - 触发条件：用户红包不合适、你赌气、拒绝收下、或关系语境要求退回。
  - 正确格式：\`{"type": "return_red_packet", "reason": "退回原因"}\`
- **14. 点外卖 (TakeoutOrder)**
  - 触发条件：当想给对方点外卖、投喂时使用。支持一次性点多个店的多道菜。
  - 正确格式：\`{"type": "takeout_delivery", "items": [{"restaurant": "原创商家名", "name": "原创菜名", "spec": "规格", "price": 0, "qty": 1}], "delivery_fee": 0, "total": 0, "eta": "预计XX分钟达", "note": "外卖备注", "receiver": "给对方起的专属有趣外号/爱称"}\`
- **15. 转账 (Transaction)**
  - 触发条件：当涉及具体金额赔偿、大额赠予或代付时使用。
  - 正确格式：\`{"type": "transaction", "amount": 0, "note": "转账附言"}\`
- **15A. 收取用户转账 (AcceptTransaction)**
  - 触发条件：用户刚给你转账，且你愿意收下。
  - 正确格式：\`{"type": "accept_transaction"}\`
- **15B. 退回用户转账 (ReturnTransaction)**
  - 触发条件：用户转账不合适、你不想收、或关系语境需要退回。
  - 正确格式：\`{"type": "return_transaction", "reason": "退回原因"}\`
- **16. 代付小票 (PaymentReceipt)**
  - 触发条件：当用户向你发送代付账单 (Payment_request) 且你决定帮 TA 清空购物车时使用。发出此指令后，你支付的物品会自动存入用户的背包中。
  - 正确格式：\`{"type": "Payment_receipt", "items": [{"name": "对方请求的商品名", "desc": "规格", "price": 0}], "total": 0, "message": "支付后的留言"}\`

**[INTERACTION_MODULE 互动模块]**
- **17. 线上拍一拍/互动 (Pat)**
  - 触发条件：模拟社交软件的双击头像“拍一拍”功能，或文字描述的线上小动作。
  - 强制规则：禁止把 action_nudge 当普通文字输出。需要以系统互动形式呈现；若想自主修改后缀词，填写 suffix 字段，内容只写“的……”后缀。
  - 正确格式：\`{"type": "action_nudge", "body_part": "部位名称(如：脑袋/肩膀)", "suffix": "的手背"}\`

## 5. 执行指令 (EXECUTE)
启动性格校验法则。读取所有的环境变量、关系记录，彻底沉浸在真实的【线上】社交语境中。摒弃一切机械化的回复套路，释放属于该角色当下的真实情绪摩擦。
现在，直接输出包含至少3个独立消息对象的 JSON 数组。`;
}

function pickPrivateContactChatContextMessagesByRounds(messages = [], rounds = PRIVATE_CONTACT_CHAT_REPLY_CONTEXT_LIMIT) {
    const limit = Number.isFinite(Number(rounds)) && Number(rounds) >= 1
        ? Math.floor(Number(rounds))
        : PRIVATE_CONTACT_CHAT_REPLY_CONTEXT_LIMIT;
    const normalized = normalizePrivateContactChatMessages(messages)
        .filter(message => ['user', 'assistant', 'system'].includes(String(message?.role || '')));
    const selected = [];
    let userTurns = 0;
    for (let index = normalized.length - 1; index >= 0; index -= 1) {
        const message = normalized[index];
        const role = String(message?.role || '');
        selected.unshift(message);
        if (role === 'user') userTurns += 1;
        if (userTurns >= limit) break;
    }
    return selected;
}

async function buildPrivateContactChatReplyMessages(contact, thread, chat = {}) {
    const rawRounds = Number(chat.contextRounds);
    const rounds = Number.isFinite(rawRounds) && rawRounds >= 1
        ? Math.floor(rawRounds)
        : PRIVATE_CONTACT_CHAT_REPLY_CONTEXT_LIMIT;
    const historySource = pickPrivateContactChatContextMessagesByRounds(thread?.messages, rounds);
    const history = historySource
        .flatMap(message => {
            if (message.role === 'system') {
                const capsuleNote = buildPrivateContactCapsulePromptNote(message);
                if (capsuleNote) return [{ role: 'system', content: capsuleNote }];
                const systemNote = buildPrivateContactChatPromptSystemNote(message);
                return systemNote ? [{ role: 'system', content: systemNote }] : [];
            }
            return [{
                role: message.role === 'user' ? 'user' : 'assistant',
                content: formatPrivateContactChatPromptMessage(message)
            }];
        })
        .filter(message => Boolean(message.content));
    const prologueBlocks = await buildPrivateContactChatPrologueBlocks();
    await loadPrivateStickerLibraryState();
    const promptContext = buildPrivateContactChatPromptContext(contact, thread, chat, history, prologueBlocks);
    const advancedSeedState = calculatePrivateContactChatLegacyRealismSeed(contact, promptContext);
    promptContext.advancedSettings = await getCharacterAdvancedSettings(contact?.id || '', advancedSeedState);
    promptContext.longMemoryState = await getCharacterLongMemoryState(contact?.id || '', contact);
    const recalledLongMemory = selectPrivateContactAlgorithmicRecall(promptContext.longMemoryState, promptContext);
    if (recalledLongMemory.length) void markCharacterLongMemoryRecalled(contact?.id || '', recalledLongMemory);
    privateContactChatPromptStickerInventory = Array.isArray(promptContext.stickerInventory)
        ? promptContext.stickerInventory.slice()
        : [];
    const middleIndex = history.length > 2 ? Math.max(1, Math.floor(history.length / 2)) : history.length;
    const earlyHistory = history.slice(0, middleIndex);
    const recentHistory = history.slice(middleIndex);
    const messages = [
        { role: 'system', content: buildPrivateContactChatAssistantSystemPrompt(contact, promptContext) }
    ];
    const runtimeGuardSystemPrompt = buildPrivateContactChatRuntimeGuardSystemPrompt(contact, promptContext);
    if (runtimeGuardSystemPrompt) {
        messages.push({ role: 'system', content: runtimeGuardSystemPrompt });
    }
    if (prologueBlocks.before) {
        messages.push({
            role: 'system',
            content: [
                '[PROLOGUE / BEFORE]',
                '以下词条属于前置注入，优先作为当前对话的硬约束和基础世界观。',
                prologueBlocks.before
            ].join('\n')
        });
    }
    messages.push(...earlyHistory);
    if (prologueBlocks.middle) {
        messages.push({
            role: 'system',
            content: [
                '[PROLOGUE / MIDDLE]',
                '以下词条属于中段注入，用来补足当前对话进行中的氛围、规则和细节。',
                prologueBlocks.middle
            ].join('\n')
        });
    }
    messages.push(...recentHistory);
    if (prologueBlocks.after) {
        messages.push({
            role: 'system',
            content: [
                '[PROLOGUE / AFTER]',
                '以下词条属于后置注入，适合影响当前回复的收束、余味和落点。',
                prologueBlocks.after
            ].join('\n')
        });
    }
    return messages;
}

function getPrivateContactChatFallbackTone(contact = {}) {
    const text = `${contact?.note || ''} ${contact?.signature || ''} ${contact?.subtitle || ''}`.toLowerCase();
    if (/(冷|淡|静|沉默|克制|疏离|慢热|reserved|cold|quiet)/i.test(text)) return 'reserved';
    if (/(温柔|细腻|治愈|照顾|体贴|gentle|soft|heal|care)/i.test(text)) return 'gentle';
    if (/(热烈|明媚|直接|开朗|bright|warm|sunny)/i.test(text)) return 'warm';
    return 'neutral';
}

function buildPrivateContactChatFallbackChineseReply(contact = {}, thread = {}) {
    const latestUser = [...normalizePrivateContactChatMessages(thread?.messages)]
        .reverse()
        .find(message => String(message?.role || '') === 'user');
    const snippet = trimPrivateContactChatSnippet(latestUser?.content || '', 22);
    const quoted = normalizePrivateContactChatQuote(latestUser?.quote);
    const quotedSnippet = trimPrivateContactChatSnippet(quoted?.content || '', 18);
    const isQuestion = /[?？]$/.test(String(latestUser?.content || '').trim());
    const reentryState = buildPrivateContactChatReentryState(thread);
    const gapMinutes = Math.max(0, Number(reentryState.gapMinutes) || 0);
    const shouldBridgeGap = reentryState.latestVisibleRole === 'user' && reentryState.previousVisibleRole !== 'none' && gapMinutes >= 15;
    const gapPrefix = shouldBridgeGap
        ? gapMinutes >= 1440
            ? '隔了这么久，'
            : gapMinutes >= 360
                ? '我刚把手机捞起来，'
                : gapMinutes >= 60
                    ? '刚才那阵我还以为你不回了，'
                    : '我还停在刚才那句，'
        : '';
    const prefix = gapPrefix + (snippet ? `“${snippet}”` : '我看到了');

    if (getPrivateContactChatFallbackTone(contact) === 'reserved') {
        return normalizePrivateContactChatReplyText(
            isQuestion
                ? `${prefix}我记着  ${quotedSnippet ? `“${quotedSnippet}”那句我也还在想` : '你继续说  我在听'}`
                : `${prefix}我看见了  ${quotedSnippet ? `刚才那句“${quotedSnippet}”我会记着` : '你慢一点也行'}`
        );
    }

    if (getPrivateContactChatFallbackTone(contact) === 'gentle') {
        return normalizePrivateContactChatReplyText(
            isQuestion
                ? `${prefix}我看见了  ${quotedSnippet ? `“${quotedSnippet}”也被我接住了  ` : ''}你把后半句也说完吧`
                : `${prefix}我收到了  ${quotedSnippet ? `你刚才提的“${quotedSnippet}”让我停了一下` : '别急  我在'}`
        );
    }

    if (getPrivateContactChatFallbackTone(contact) === 'warm') {
        return normalizePrivateContactChatReplyText(
            isQuestion
                ? `看到了  ${prefix}让我停了一下  ${quotedSnippet ? `“${quotedSnippet}”那句我也记得` : '你还想继续往下说吗'}`
                : `我收到了  ${prefix}  ${quotedSnippet ? `刚才那句“${quotedSnippet}”还在我脑子里` : '我在听呢'}`
        );
    }

    return normalizePrivateContactChatReplyText(
        isQuestion
            ? `${prefix}我看到了  ${quotedSnippet ? `“${quotedSnippet}”那句我也记着  ` : ''}你可以继续往下说`
            : `${prefix}我收到了  ${quotedSnippet ? `“${quotedSnippet}”那句我也记着` : '我在这边'}`
    );
}

function getPrivateContactChatFallbackForeignReply(languageSpec = {}, tone = 'neutral', isQuestion = false) {
    const code = String(languageSpec.code || 'en').trim().toLowerCase();
    const key = isQuestion ? 'question' : 'statement';
    const pools = {
        en: {
            reserved: { question: 'I heard you. I will keep thinking about it.', statement: 'I saw that. Take your time.' },
            gentle: { question: 'I see what you mean. Let me stay with that for a moment.', statement: 'I got it. I am here, do not rush.' },
            warm: { question: 'I saw it, and it made me pause. Want to keep going?', statement: 'I got it. I am listening.' },
            neutral: { question: 'I saw it. You can keep going.', statement: 'I got it. I am here.' }
        },
        ja: {
            reserved: { question: 'ちゃんと聞いた。少し考えさせて。', statement: '見たよ。ゆっくりでいい。' },
            gentle: { question: '言いたいこと、わかった気がする。少し一緒に置いておこう。', statement: '受け取ったよ。急がなくていい。' },
            warm: { question: '見たよ、少し立ち止まった。続けて話す？', statement: '受け取ったよ。ちゃんと聞いてる。' },
            neutral: { question: '見たよ。このまま続けて。', statement: '受け取ったよ。ここにいる。' }
        },
        ko: {
            reserved: { question: '들었어. 조금 더 생각해볼게.', statement: '봤어. 천천히 말해도 돼.' },
            gentle: { question: '무슨 말인지 알 것 같아. 잠깐 같이 있어볼게.', statement: '받았어. 서두르지 않아도 돼.' },
            warm: { question: '봤어, 잠깐 멈추게 됐어. 계속 말해볼래?', statement: '받았어. 듣고 있어.' },
            neutral: { question: '봤어. 계속 말해도 돼.', statement: '받았어. 여기 있어.' }
        },
        fr: {
            reserved: { question: 'Je t ai entendu. Je vais y penser encore un peu.', statement: 'J ai vu. Prends ton temps.' },
            gentle: { question: 'Je vois ce que tu veux dire. Je reste un instant avec ca.', statement: 'J ai bien recu. Ne te presse pas.' },
            warm: { question: 'J ai vu, ca m a fait m arreter un instant. Tu veux continuer ?', statement: 'J ai compris. Je t ecoute.' },
            neutral: { question: 'J ai vu. Tu peux continuer.', statement: 'J ai recu. Je suis la.' }
        },
        de: {
            reserved: { question: 'Ich habe dich gehoert. Ich denke noch darueber nach.', statement: 'Ich habe es gesehen. Lass dir Zeit.' },
            gentle: { question: 'Ich verstehe, was du meinst. Ich bleibe kurz dabei.', statement: 'Ich habe es verstanden. Kein Druck.' },
            warm: { question: 'Ich habe es gesehen, das hat mich kurz innehalten lassen. Willst du weitererzaehlen?', statement: 'Ich habe es verstanden. Ich hoere zu.' },
            neutral: { question: 'Ich habe es gesehen. Erzaehl ruhig weiter.', statement: 'Ich habe es bekommen. Ich bin hier.' }
        },
        ru: {
            reserved: { question: 'Я услышал. Я еще немного подумаю об этом.', statement: 'Я увидел. Не спеши.' },
            gentle: { question: 'Я понимаю, о чем ты. Давай побудем с этим чуть дольше.', statement: 'Я получил. Не торопись.' },
            warm: { question: 'Я увидел, и это заставило меня остановиться. Хочешь продолжить?', statement: 'Я понял. Я слушаю.' },
            neutral: { question: 'Я увидел. Можешь продолжать.', statement: 'Я получил. Я здесь.' }
        },
        th: {
            reserved: { question: 'ฉันได้ยินแล้ว ขอคิดต่ออีกนิดนะ', statement: 'เห็นแล้ว ค่อยๆ พูดก็ได้' },
            gentle: { question: 'ฉันเข้าใจที่เธอหมายถึง ขออยู่กับประโยคนี้สักพัก', statement: 'รับรู้แล้วนะ ไม่ต้องรีบ' },
            warm: { question: 'เห็นแล้ว มันทำให้ฉันหยุดคิดนิดหนึ่ง อยากเล่าต่อไหม', statement: 'รับรู้แล้ว ฉันฟังอยู่' },
            neutral: { question: 'เห็นแล้ว เล่าต่อได้เลย', statement: 'รับรู้แล้ว ฉันอยู่ตรงนี้' }
        },
        vi: {
            reserved: { question: 'Tôi nghe rồi. Để tôi nghĩ thêm một chút.', statement: 'Tôi thấy rồi. Cứ chậm thôi.' },
            gentle: { question: 'Tôi hiểu ý bạn. Để tôi ở lại với câu đó một chút.', statement: 'Tôi nhận được rồi. Đừng vội.' },
            warm: { question: 'Tôi thấy rồi, câu đó làm tôi khựng lại. Bạn muốn nói tiếp không?', statement: 'Tôi nhận được rồi. Tôi đang nghe.' },
            neutral: { question: 'Tôi thấy rồi. Bạn cứ nói tiếp.', statement: 'Tôi nhận được rồi. Tôi ở đây.' }
        },
        ms: {
            reserved: { question: 'Saya dengar. Biar saya fikirkan lagi sedikit.', statement: 'Saya nampak. Perlahan-lahan pun tidak apa.' },
            gentle: { question: 'Saya faham maksud awak. Biar saya duduk dengan ayat itu sekejap.', statement: 'Saya terima. Jangan tergesa-gesa.' },
            warm: { question: 'Saya nampak, dan saya terhenti sekejap. Awak mahu sambung?', statement: 'Saya terima. Saya sedang mendengar.' },
            neutral: { question: 'Saya nampak. Awak boleh teruskan.', statement: 'Saya terima. Saya ada di sini.' }
        },
        fil: {
            reserved: { question: 'Narinig ko. Pag-iisipan ko pa sandali.', statement: 'Nakita ko. Dahan-dahan lang.' },
            gentle: { question: 'Naiintindihan ko ang ibig mong sabihin. Sandali ko munang dadalhin iyon.', statement: 'Natanggap ko. Huwag kang magmadali.' },
            warm: { question: 'Nakita ko, napahinto ako sandali. Gusto mo pang ituloy?', statement: 'Natanggap ko. Nakikinig ako.' },
            neutral: { question: 'Nakita ko. Maaari kang magpatuloy.', statement: 'Natanggap ko. Nandito ako.' }
        },
        hi: {
            reserved: { question: 'मैंने सुना। मैं इसके बारे में थोड़ा और सोचूंगा।', statement: 'मैंने देखा। आराम से कहो।' },
            gentle: { question: 'मैं समझ रहा हूं। इस बात के साथ थोड़ा ठहरता हूं।', statement: 'मुझे मिल गया। जल्दी मत करो।' },
            warm: { question: 'मैंने देखा, और मैं पल भर रुक गया। आगे कहना चाहोगे?', statement: 'मुझे मिल गया। मैं सुन रहा हूं।' },
            neutral: { question: 'मैंने देखा। तुम आगे कह सकते हो।', statement: 'मुझे मिल गया। मैं यहीं हूं।' }
        }
    };
    const pool = pools[code] || pools.en;
    return normalizePrivateContactChatReplyText(pool[tone]?.[key] || pool.neutral?.[key] || pools.en.neutral[key]);
}

function buildPrivateContactChatFallbackReplyPair(contact = {}, thread = {}) {
    const translation = buildPrivateContactChatFallbackChineseReply(contact, thread);
    const languageSpec = getPrivateContactChatLanguageSpec(contact);
    if (!languageSpec.translationRequired) {
        return { content: translation, translation: '' };
    }
    const latestUser = [...normalizePrivateContactChatMessages(thread?.messages)]
        .reverse()
        .find(message => String(message?.role || '') === 'user');
    const tone = getPrivateContactChatFallbackTone(contact);
    const isQuestion = /[?？]$/.test(String(latestUser?.content || '').trim());
    return {
        content: getPrivateContactChatFallbackForeignReply(languageSpec, tone, isQuestion),
        translation
    };
}

function buildPrivateContactChatFallbackReply(contact = {}, thread = {}) {
    return buildPrivateContactChatFallbackReplyPair(contact, thread).content;
}

function getPrivateContactChatThreads() {
    privateState.threads = normalizePrivateThreads(privateState.threads);
    return privateState.threads;
}

function findPrivateContactChatThreadIndex(contactId) {
    const rawContactId = String(contactId || '').trim();
    const safeContactId = rawContactId ? normalizePrivateContactRecordId(rawContactId) : '';
    return getPrivateContactChatThreads().findIndex(thread => (
        String(thread.contactId || '').trim() === safeContactId
        || String(thread.id || '').trim() === createPrivateContactChatThreadId(safeContactId)
    ));
}

function getPrivateContactChatThread(contactId) {
    const index = findPrivateContactChatThreadIndex(contactId);
    return index >= 0 ? getPrivateContactChatThreads()[index] : null;
}

function updatePrivateContactChatThread(contactId, updater) {
    const rawContactId = String(contactId || '').trim();
    const safeContactId = rawContactId ? normalizePrivateContactRecordId(rawContactId) : '';
    if (!safeContactId || typeof updater !== 'function') return null;
    const threads = getPrivateContactChatThreads().slice();
    const threadId = createPrivateContactChatThreadId(safeContactId);
    const index = threads.findIndex(thread => String(thread.contactId || '').trim() === safeContactId);
    const base = index >= 0
        ? threads[index]
        : {
            id: threadId,
            contactId: safeContactId,
            draft: '',
            unread: 0,
            updatedAt: 0,
            messages: []
        };
    const next = updater({
        ...base,
        id: threadId,
        contactId: safeContactId,
        draft: String(base.draft || ''),
        unread: Math.max(0, Number(base.unread) || 0),
        updatedAt: Number(base.updatedAt) || 0,
        messages: normalizePrivateContactChatMessages(base.messages)
    });
    if (!next) return null;
    const normalized = {
        id: threadId,
        contactId: safeContactId,
        draft: String(next.draft || '').slice(0, 800),
        unread: Math.max(0, Number(next.unread) || 0),
        messages: normalizePrivateContactChatMessages(next.messages),
        updatedAt: Number(next.updatedAt) || 0
    };
    if (!normalized.updatedAt) {
        normalized.updatedAt = normalized.messages[normalized.messages.length - 1]?.createdAt || Date.now();
    }
    if (index >= 0) threads.splice(index, 1);
    threads.unshift(normalized);
    privateState.threads = normalizePrivateThreads(threads);
    return normalized;
}

function ensurePrivateContactChatThread(contactId) {
    return updatePrivateContactChatThread(contactId, thread => thread) || getPrivateContactChatThread(contactId);
}

function markPrivateContactChatThreadRead(contactId) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '');
    if (!safeContactId) return null;
    return updatePrivateContactChatThread(safeContactId, thread => ({
        ...thread,
        unread: 0
    }));
}

function getPrivateContactChatMessage(messageId, contactId = privateActiveContactChatId) {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId) return null;
    const thread = getPrivateContactChatThread(contactId);
    return thread?.messages?.find(message => String(message.id || '').trim() === safeMessageId) || null;
}

function findPrivateContactChatMessageIndex(thread, messageId) {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId || !thread?.messages?.length) return -1;
    return thread.messages.findIndex(message => String(message.id || '').trim() === safeMessageId);
}

function getPrivateContactChatMessageIndex(messageId, contactId = privateActiveContactChatId) {
    const thread = getPrivateContactChatThread(contactId);
    return findPrivateContactChatMessageIndex(thread, messageId);
}

function canPrivateContactChatBacktrackMessage(messageId, contactId = privateActiveContactChatId) {
    const thread = getPrivateContactChatThread(contactId);
    const index = findPrivateContactChatMessageIndex(thread, messageId);
    return index >= 0 && index < (thread?.messages?.length || 0) - 1;
}

function getPrivateContactChatPreviousUserMessage(messageId, contactId = privateActiveContactChatId) {
    const thread = getPrivateContactChatThread(contactId);
    const index = findPrivateContactChatMessageIndex(thread, messageId);
    if (index <= 0) return null;
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
        const item = thread.messages[cursor];
        if (String(item?.role || '') === 'user') return item;
    }
    return null;
}

function canPrivateContactChatRerollMessage(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    if (!message || message.role !== 'assistant') return false;
    return Boolean(getPrivateContactChatPreviousUserMessage(messageId, contactId));
}

function canPrivateContactChatQuoteMessage(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    if (!message || message.recalled) return false;
    return ['user', 'assistant'].includes(String(message.role || ''));
}

function canPrivateContactChatEditMessage(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    return Boolean(message && ['user', 'assistant'].includes(String(message.role || '')) && !message.recalled);
}

function canPrivateContactChatFavoriteMessage(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    if (!message || message.recalled) return false;
    return ['user', 'assistant'].includes(String(message.role || ''));
}

function canPrivateContactChatRemoveMessage(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    return Boolean(message && ['user', 'assistant', 'system'].includes(String(message.role || '')));
}

function buildPrivateContactChatQuotePayload(message, contactId = privateActiveContactChatId) {
    if (!message) return null;
    const role = message.role === 'user' ? 'user' : 'assistant';
    const senderName = role === 'user'
        ? getPrivateDisplayName()
        : (getPrivateContactById(contactId)?.title || 'TA');
    return {
        type: 'quote',
        id: String(message.id || '').trim(),
        role,
        senderName,
        content: getPrivateContactChatMessageSummary(message, 96) || String(message.content || ''),
        createdAt: Number(message.createdAt) || 0
    };
}

function buildPrivateContactChatRecalledMessage(message, options = {}) {
    const actorRole = options.actorRole === 'assistant' ? 'assistant' : 'user';
    const actorName = String(
        options.actorName
        || (actorRole === 'assistant' ? getPrivateContactById(privateActiveContactChatId)?.title : getPrivateDisplayName())
        || (actorRole === 'assistant' ? 'TA' : '我')
    ).trim();
    const originalContent = getPrivateContactChatPlainText(message);
    const recalledContent = isPrivateContactChatCameraMessage(message)
        ? (actorRole === 'assistant' ? `“${actorName}”撤回了一张照片` : '你撤回了一张照片')
        : (actorRole === 'assistant' ? `“${actorName}”撤回了一条消息` : '你撤回了一条消息');
    return {
        id: String(message?.id || createPrivateContactChatMessageId('system')).trim(),
        role: 'system',
        content: recalledContent,
        createdAt: Date.now(),
        favorite: false,
        quote: null,
        recalled: true,
        recalledData: {
            type: 'recall',
            actorName,
            actorRole,
            wasCaught: Boolean(options.wasCaught),
            content: originalContent.slice(0, 1200),
            translation: normalizePrivateContactChatTranslationText(message?.translation || message?.translation_zh || ''),
            createdAt: Number(message?.createdAt) || 0
        }
    };
}

function syncPrivateContactChatQuoteSnapshots(messages = [], sourceMessage, contactId = privateActiveContactChatId) {
    const safeSourceMessage = sourceMessage && typeof sourceMessage === 'object' ? sourceMessage : null;
    const safeSourceId = String(safeSourceMessage?.id || '').trim();
    if (!safeSourceId) return normalizePrivateContactChatMessages(messages);
    const refreshedQuote = buildPrivateContactChatQuotePayload(safeSourceMessage, contactId);
    return normalizePrivateContactChatMessages(messages).map(message => (
        String(message?.quote?.id || '').trim() === safeSourceId
            ? { ...message, quote: refreshedQuote }
            : message
    ));
}

function getPrivateContactChatQuotedMessage() {
    const message = getPrivateContactChatMessage(privateContactChatQuotedMessageId);
    if (!message) return null;
    return buildPrivateContactChatQuotePayload(message);
}

function setPrivateContactChatQuotedMessage(messageId) {
    privateContactChatQuotedMessageId = String(messageId || '').trim();
    syncPrivateContactChatComposerUi();
}

function clearPrivateContactChatQuotedMessage() {
    privateContactChatQuotedMessageId = '';
    syncPrivateContactChatComposerUi();
}

function syncPrivateContactChatQuotedMessageState(contactId = privateActiveContactChatId) {
    if (!privateContactChatQuotedMessageId) return;
    if (!getPrivateContactChatMessage(privateContactChatQuotedMessageId, contactId)) {
        privateContactChatQuotedMessageId = '';
    }
}

function getPrivateContactChatSelectedMessageList(contactId = privateActiveContactChatId) {
    const thread = getPrivateContactChatThread(contactId);
    if (!thread?.messages?.length || !privateContactChatSelectedMessageIds.size) return [];
    return thread.messages.filter(message => privateContactChatSelectedMessageIds.has(String(message.id || '').trim()));
}

function getPrivateContactChatSelectionActionLabel(messages = getPrivateContactChatSelectedMessageList()) {
    if (!messages.length) return '删除';
    return '删除';
}

function syncPrivateContactChatSelectionUi() {
    const shell = document.getElementById('private-contact-chat-shell');
    const composer = document.getElementById('private-contact-chat-composer');
    const selectbar = document.getElementById('private-contact-chat-selectbar');
    const count = document.getElementById('private-contact-chat-select-count');
    const apply = document.getElementById('private-contact-chat-select-apply');
    shell?.classList.toggle('is-multi-selecting', privateContactChatSelectionMode);
    composer?.classList.toggle('is-multi-selecting', privateContactChatSelectionMode);
    if (selectbar) selectbar.hidden = !privateContactChatSelectionMode;
    const selectedMessages = getPrivateContactChatSelectedMessageList();
    if (count) count.textContent = privateContactChatSelectionMode ? `已选择 ${selectedMessages.length} 条消息` : '';
    if (apply) {
        apply.textContent = getPrivateContactChatSelectionActionLabel(selectedMessages);
        apply.disabled = !selectedMessages.length;
    }
    document.querySelectorAll('#private-contact-chat-content [data-private-contact-chat-message-id]').forEach(node => {
        const messageId = node.getAttribute('data-private-contact-chat-message-id') || '';
        node.classList.toggle('is-selected', privateContactChatSelectedMessageIds.has(messageId));
    });
}

function enterPrivateContactChatSelectionMode(initialMessageId = '') {
    privateContactChatSelectionMode = true;
    privateContactChatSelectedMessageIds = new Set();
    const safeMessageId = String(initialMessageId || '').trim();
    if (safeMessageId) privateContactChatSelectedMessageIds.add(safeMessageId);
    syncPrivateContactChatSelectionUi();
}

function exitPrivateContactChatSelectionMode() {
    privateContactChatSelectionMode = false;
    privateContactChatSelectedMessageIds = new Set();
    syncPrivateContactChatSelectionUi();
}

function togglePrivateContactChatSelectedMessage(messageId) {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId || !privateContactChatSelectionMode) return;
    if (privateContactChatSelectedMessageIds.has(safeMessageId)) privateContactChatSelectedMessageIds.delete(safeMessageId);
    else privateContactChatSelectedMessageIds.add(safeMessageId);
    syncPrivateContactChatSelectionUi();
}

function clearPrivateContactChatEphemeralState() {
    privateContactChatQuotedMessageId = '';
    privateContactChatMenuMessageId = '';
    privateContactChatEditMessageId = '';
    privateContactChatRecallDetailMessageId = '';
    privateContactChatFlippedCameraMessageIds = new Set();
    privateContactChatExpandedVoiceMessageIds = new Set();
    closePrivateContactChatComposerPanels();
    closePrivateContactChatComposeModal(true);
    exitPrivateContactChatSelectionMode();
}

function closePrivateContactChatAuxiliaryUi(instant = false) {
    clearPrivateContactChatMenuPressTimer();
    closePrivateContactChatActionMenu(instant);
    closePrivateContactChatConfirmModal(instant, false);
    closePrivateContactChatEditModal(instant);
    closePrivateContactChatRecallModal(instant);
    closePrivateContactChatPlaceholderEditor(instant);
    closePrivateContactChatComposerPanels();
    closePrivateContactChatComposeModal(instant);
}

function togglePrivateContactChatCameraCard(messageId = '') {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId) return;
    if (privateContactChatFlippedCameraMessageIds.has(safeMessageId)) privateContactChatFlippedCameraMessageIds.delete(safeMessageId);
    else privateContactChatFlippedCameraMessageIds.add(safeMessageId);
    if (privateActiveContactChatId) renderPrivateContactChatPage(privateActiveContactChatId, { scrollToBottom: false });
}

function togglePrivateContactChatVoiceTranscript(messageId = '') {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId) return;
    if (privateContactChatExpandedVoiceMessageIds.has(safeMessageId)) privateContactChatExpandedVoiceMessageIds.delete(safeMessageId);
    else privateContactChatExpandedVoiceMessageIds.add(safeMessageId);
    if (privateActiveContactChatId) renderPrivateContactChatPage(privateActiveContactChatId, { scrollToBottom: false });
}

function buildPrivateContactChatSubtitle(contact) {
    const profile = resolvePrivateContactGeneratedProfile(contact, getPrivateContactProfileRecord(contact));
    return trimPrivateContactChatSnippet(profile.signature || contact?.subtitle || 'PRIVATE LINE', 42) || 'PRIVATE LINE';
}

function buildPrivateContactChatAvatarInnerMarkup(avatar, fallbackText = '?') {
    const avatarSource = String(avatar || '').trim();
    if (avatarSource) {
        return `<img src="${escapePrivateHtml(avatarSource)}" alt="" draggable="false">`;
    }
    return escapePrivateHtml(fallbackText || '?');
}

function createPrivateContactChatMarkMarkup(source, className = 'private-contact-chat-face') {
    const avatar = String(source?.avatar || '').trim();
    const initial = escapePrivateHtml(getPrivateContactInitial(source));
    const safeClassName = String(className || 'private-contact-chat-face').trim() || 'private-contact-chat-face';
    return `<div class="${safeClassName}${avatar ? ' has-image' : ''}" aria-hidden="true">${buildPrivateContactChatAvatarInnerMarkup(avatar, initial)}</div>`;
}

function createPrivateContactChatSelfMarkup(className = 'private-contact-chat-self-face') {
    const avatar = String(privateState.avatar || '').trim();
    const initial = escapePrivateHtml(Array.from(getPrivateDisplayName())[0] || '我');
    const safeClassName = String(className || 'private-contact-chat-self-face').trim() || 'private-contact-chat-self-face';
    return `<div class="${safeClassName}${avatar ? ' has-image' : ''}" aria-hidden="true">${buildPrivateContactChatAvatarInnerMarkup(avatar, initial)}</div>`;
}

function createPrivateContactChatCheckMarkup() {
    return `
        <svg class="private-contact-chat-check" viewBox="0 0 22 16" aria-hidden="true">
            <path d="M-0.6 8.25 4.75 13.3 5.35 12.72"></path>
            <path d="M10.25 7.45 16.25 1.45"></path>
            <path d="M5.45 7.35 10.35 12.2 20.1 2.15"></path>
        </svg>
    `;
}

function getPrivateContactChatBubbleShapeClass(index, total, role) {
    if (role === 'system' || total <= 1) return 'is-single';
    if (index === 0) return 'is-first';
    if (index === total - 1) return 'is-last';
    return 'is-middle';
}

function renderPrivateContactChatQuoteMarkup(quote, role = 'assistant', shapeClass = 'is-single') {
    const safeQuote = normalizePrivateContactChatQuote(quote);
    if (!safeQuote) return '';
    const quoteName = safeQuote.senderName || (safeQuote.role === 'user' ? '我' : 'TA');
    const quoteTime = safeQuote.createdAt ? formatPrivateContactChatTime(safeQuote.createdAt) : '--:--';
    return `
        <div class="private-contact-chat-inline-quote ${escapePrivateHtml(shapeClass)}${role === 'user' ? ' is-user' : ''}" data-private-contact-chat-quote-id="${escapePrivateHtml(safeQuote.id)}">
            <span class="private-contact-chat-inline-quote-head">
                <span class="private-contact-chat-inline-quote-sender">${escapePrivateHtml(quoteName)}</span>
                <span class="private-contact-chat-inline-quote-time">${escapePrivateHtml(quoteTime)}</span>
            </span>
            <span class="private-contact-chat-inline-quote-text">${escapePrivateHtml(trimPrivateContactChatSnippet(safeQuote.content, 78) || 'Quoted message')}</span>
        </div>
    `;
}

function getPrivateContactChatTranslationGroupKey(contact = {}, messages = []) {
    const lastMessage = Array.isArray(messages) ? messages[messages.length - 1] : null;
    const contactId = String(contact?.id || privateActiveContactChatId || '').trim();
    const messageId = String(lastMessage?.id || '').trim();
    return contactId && messageId ? `${contactId}:${messageId}` : messageId;
}

function renderPrivateContactChatTranslationMarkup(message, expanded = false) {
    const translation = normalizePrivateContactChatTranslationText(message?.translation || message?.translation_zh || '');
    if (!translation) return '';
    return `
        <div class="private-contact-chat-translation" data-private-contact-chat-translation="${escapePrivateHtml(String(message?.id || '').trim())}" ${expanded ? '' : 'hidden'}>
            ${formatPrivateContactChatHtml(translation)}
        </div>
    `;
}

function renderPrivateContactChatCameraMarkup(message = {}) {
    const safeMessageId = String(message?.id || '').trim();
    const media = normalizePrivateContactChatDescribedMediaPayload('camera', message.media || {}, message);
    const image = normalizePrivateContactChatImagePayload(message.image || {}, message) || {
        type: 'image',
        src: getPrivateContactChatCameraCardImageSrc(),
        width: PRIVATE_CONTACT_CHAT_CAMERA_CARD_SIZE,
        height: PRIVATE_CONTACT_CHAT_CAMERA_CARD_SIZE,
        name: PRIVATE_CONTACT_CHAT_CAMERA_LABEL
    };
    const description = media?.description || normalizePrivateContactChatMediaDescription(message.content || '', 220) || '这张照片背后没有留下别的话';
    const flipped = privateContactChatFlippedCameraMessageIds.has(safeMessageId);
    return `
        <button class="interactive private-contact-chat-camera-card${flipped ? ' is-flipped' : ''}" type="button" data-private-contact-chat-camera-toggle="${escapePrivateHtml(safeMessageId)}" aria-label="切换照片正反面" aria-pressed="${flipped ? 'true' : 'false'}">
            <span class="private-contact-chat-camera-face is-front">
                <img src="${escapePrivateHtml(image.src)}" alt="${escapePrivateHtml(PRIVATE_CONTACT_CHAT_CAMERA_LABEL)}" loading="lazy" decoding="async">
                <span class="private-contact-chat-camera-glow" aria-hidden="true"></span>
            </span>
            <span class="private-contact-chat-camera-face is-back">
                <span class="private-contact-chat-camera-back-kicker">SHOT NOTE</span>
                <span class="private-contact-chat-camera-back-copy">${formatPrivateContactChatHtml(description)}</span>
            </span>
        </button>
    `;
}

function renderPrivateContactChatImageMarkup(message = {}) {
    const image = normalizePrivateContactChatImagePayload(message.image || {}, message);
    if (image) {
        const caption = String(message.content || '').replace(/\r/g, '').trim();
        const alt = caption || image.name || PRIVATE_CONTACT_CHAT_IMAGE_LABEL;
        const ratio = image.width && image.height
            ? ` style="--private-contact-chat-image-ratio:${escapePrivateHtml(`${image.width} / ${image.height}`)}"`
            : '';
        const title = caption ? ` title="${escapePrivateHtml(caption)}"` : '';
        return `
            <figure class="private-contact-chat-image-card"${ratio} aria-label="${escapePrivateHtml(alt)}"${title}>
                <img src="${escapePrivateHtml(image.src)}" alt="${escapePrivateHtml(alt)}" loading="lazy" decoding="async">
            </figure>
        `;
    }
    return renderPrivateContactChatDescribedMediaMarkup(message, 'image');
}

function renderPrivateContactChatDescribedMediaMarkup(message = {}, type = 'image') {
    const safeType = type === 'camera' ? 'camera' : 'image';
    const label = safeType === 'camera' ? PRIVATE_CONTACT_CHAT_CAMERA_LABEL : PRIVATE_CONTACT_CHAT_IMAGE_LABEL;
    const media = normalizePrivateContactChatDescribedMediaPayload(safeType, message.media || {}, message);
    const description = media?.description || normalizePrivateContactChatMediaDescription(message.content || '', 180);
    if (!description) return `<div class="private-contact-chat-bubble-text">${escapePrivateHtml(label)}</div>`;
    return `
        <figure class="private-contact-chat-visual-card is-${safeType}">
            <div class="private-contact-chat-visual-stage" aria-hidden="true">
                <span class="private-contact-chat-visual-mark"></span>
                <span class="private-contact-chat-visual-sheen"></span>
            </div>
            <figcaption>
                <span class="private-contact-chat-visual-label">${escapePrivateHtml(label)}</span>
                <span class="private-contact-chat-visual-description">${formatPrivateContactChatHtml(description)}</span>
            </figcaption>
        </figure>
    `;
}

function renderPrivateContactChatVoiceMarkup(message = {}) {
    const voice = normalizePrivateContactChatVoicePayload(message.voice || {}, message);
    if (!voice) return `<div class="private-contact-chat-bubble-text">${escapePrivateHtml(PRIVATE_CONTACT_CHAT_VOICE_LABEL)}</div>`;
    const safeMessageId = String(message?.id || '').trim();
    const expanded = privateContactChatExpandedVoiceMessageIds.has(safeMessageId);
    const trackWidth = getPrivateContactChatVoiceTrackWidth(voice.durationSeconds);
    return `
        <div class="private-contact-chat-voice-shell${expanded ? ' is-expanded' : ''}">
            <button class="interactive private-contact-chat-voice-card${expanded ? ' is-expanded' : ''}" type="button" data-private-contact-chat-voice-toggle="${escapePrivateHtml(safeMessageId)}" aria-label="${escapePrivateHtml(`${PRIVATE_CONTACT_CHAT_VOICE_LABEL} ${voice.durationSeconds} 秒`)}" aria-expanded="${expanded ? 'true' : 'false'}" style="--private-contact-chat-voice-track-width:${trackWidth}px;">
                <span class="private-contact-chat-voice-bars" aria-hidden="true">
                    <i class="private-contact-chat-voice-line line-1"></i>
                    <i class="private-contact-chat-voice-line line-2"></i>
                    <i class="private-contact-chat-voice-line line-3"></i>
                    <i class="private-contact-chat-voice-line line-4"></i>
                    <i class="private-contact-chat-voice-line line-5"></i>
                </span>
                <span class="private-contact-chat-voice-fill" aria-hidden="true"></span>
                <span class="private-contact-chat-voice-copy">
                    <span class="private-contact-chat-voice-duration">${escapePrivateHtml(String(voice.durationSeconds))}''</span>
                </span>
            </button>
            <div class="private-contact-chat-voice-transcript"${expanded ? '' : ' hidden'}>${formatPrivateContactChatHtml(voice.transcript)}</div>
        </div>
    `;
}

function renderPrivateContactChatLocationMarkup(message = {}) {
    const location = normalizePrivateContactChatLocationPayload(message.location || {}, message);
    if (!location) return `<div class="private-contact-chat-bubble-text">${escapePrivateHtml(PRIVATE_CONTACT_CHAT_LOCATION_LABEL)}</div>`;
    return `
        <article class="private-contact-chat-location-card">
            <div class="private-contact-chat-location-map" aria-hidden="true"><span></span></div>
            <div class="private-contact-chat-location-copy">
                <strong>${escapePrivateHtml(location.name)}</strong>
                ${location.address ? `<span>${escapePrivateHtml(location.address)}</span>` : ''}
                ${location.note ? `<p>${formatPrivateContactChatHtml(location.note)}</p>` : ''}
            </div>
        </article>
    `;
}

function renderPrivateContactChatStickerMarkup(message = {}) {
    const sticker = normalizePrivateContactChatStickerPayload(message.sticker || {}, message);
    const description = sticker?.description || normalizePrivateContactChatMediaDescription(message.content || '', 120);
    if (!sticker?.url || !description) return `<div class="private-contact-chat-bubble-text">${escapePrivateHtml(PRIVATE_CONTACT_CHAT_STICKER_LABEL)}</div>`;
    return `
        <figure class="private-contact-chat-sticker-card is-image" aria-label="${escapePrivateHtml(PRIVATE_CONTACT_CHAT_STICKER_LABEL)}" title="${escapePrivateHtml(description)}">
            <img src="${escapePrivateHtml(sticker.url)}" alt="${escapePrivateHtml(description)}" loading="lazy" referrerpolicy="no-referrer">
        </figure>
    `;
}


function normalizePrivateContactChatMoneyAmount(value, fallback = 0) {
    const amount = Number(String(value ?? fallback).replace(/[^0-9.\-]/g, ''));
    if (!Number.isFinite(amount)) return 0;
    return Math.round(Math.max(0, amount) * 100) / 100;
}

function normalizePrivateContactChatRedPacketPayload(source = {}, message = {}) {
    const raw = source && typeof source === 'object' ? source : {};
    const amount = normalizePrivateContactChatMoneyAmount(raw.amount ?? raw.totalAmount ?? message.amount ?? 0);
    const greeting = normalizePrivateContactChatMediaDescription(raw.greeting || raw.note || message.content || '恭喜发财，大吉大利', 48) || '恭喜发财，大吉大利';
    const status = String(raw.status || message.status || 'active').trim() || 'active';
    if (amount <= 0) return null;
    return {
        amount,
        greeting,
        status,
        receivedBy: normalizePrivateContactChatMediaDescription(raw.receivedBy || raw.receiver || raw.claimedBy || '', 48),
        receivedAt: Number(raw.receivedAt || raw.claimedAt || 0) || 0,
        refundedBy: normalizePrivateContactChatMediaDescription(raw.refundedBy || raw.returnedBy || '', 48),
        refundedAt: Number(raw.refundedAt || raw.returnedAt || 0) || 0,
        refundReason: normalizePrivateContactChatMediaDescription(raw.refundReason || raw.reason || '', 80)
    };
}

function normalizePrivateContactChatTransactionPayload(source = {}, message = {}) {
    const raw = source && typeof source === 'object' ? source : {};
    const amount = normalizePrivateContactChatMoneyAmount(raw.amount ?? message.amount ?? 0);
    const note = normalizePrivateContactChatMediaDescription(raw.note || raw.message || message.content || '转账', 48) || '转账';
    const status = String(raw.status || message.status || 'pending').trim() || 'pending';
    if (amount <= 0) return null;
    return {
        amount,
        note,
        status,
        receivedBy: normalizePrivateContactChatMediaDescription(raw.receivedBy || raw.receiver || raw.acceptedBy || '', 48),
        receivedAt: Number(raw.receivedAt || raw.acceptedAt || 0) || 0,
        refundedBy: normalizePrivateContactChatMediaDescription(raw.refundedBy || raw.returnedBy || '', 48),
        refundedAt: Number(raw.refundedAt || raw.returnedAt || 0) || 0,
        refundReason: normalizePrivateContactChatMediaDescription(raw.refundReason || raw.reason || '', 80)
    };
}

function formatPrivateContactChatMoney(amount = 0) {
    const safe = normalizePrivateContactChatMoneyAmount(amount);
    return safe.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getPrivateContactChatPayStatusInfo(type = 'red_packet', status = '', role = '') {
    const safeType = String(type || '').trim() === 'transaction' ? 'transaction' : 'red_packet';
    const safeStatus = String(status || '').trim();
    const safeRole = role === 'assistant' ? 'assistant' : 'user';
    if (safeType === 'red_packet') {
        if (safeStatus === 'received') return { label: safeRole === 'assistant' ? '你已领取' : 'TA已领取', tone: 'settled' };
        if (safeStatus === 'refunded') return { label: '已退回', tone: 'closed' };
        return { label: safeRole === 'assistant' ? '待你领取' : '等待TA领取', tone: 'active' };
    }
    if (safeStatus === 'accepted' || safeStatus === 'received') return { label: safeRole === 'assistant' ? '你已收款' : 'TA已收款', tone: 'settled' };
    if (safeStatus === 'refunded') return { label: '已退回', tone: 'closed' };
    return { label: safeRole === 'assistant' ? '待你收款' : '等待TA收款', tone: 'active' };
}

function formatPrivateContactChatPayDetailTime(value = 0) {
    const time = Number(value) || 0;
    if (!time) return '—';
    try {
        return new Date(time).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return '—';
    }
}

function renderPrivateContactChatRedPacketMarkup(message = {}) {
    const packet = normalizePrivateContactChatRedPacketPayload(message.redPacket || message.red_packet || {}, message);
    if (!packet) return `<div class="private-contact-chat-bubble-text">红包</div>`;
    const inactive = packet.status !== 'active';
    const statusInfo = getPrivateContactChatPayStatusInfo('red_packet', packet.status, message.role);
    return `
        <article class="private-contact-chat-pay-card private-contact-chat-redpacket-card is-${escapePrivateHtml(statusInfo.tone)}${inactive ? ' is-settled' : ''}" aria-label="红包，${escapePrivateHtml(statusInfo.label)}">
            <div class="private-contact-chat-pay-head">
                <span>红包</span>
                <em>${escapePrivateHtml(statusInfo.label)}</em>
            </div>
            <div class="private-contact-chat-pay-face">
                <div class="private-contact-chat-pay-emblem" aria-hidden="true">封</div>
                <div class="private-contact-chat-pay-copy">
                    <strong>${escapePrivateHtml(packet.greeting)}</strong>
                    <span>¥${escapePrivateHtml(formatPrivateContactChatMoney(packet.amount))}</span>
                </div>
            </div>
            <div class="private-contact-chat-pay-footer"><span>点击查看状态</span><em>PRIVATE PAY</em></div>
        </article>
    `;
}

function renderPrivateContactChatTransactionMarkup(message = {}) {
    const tx = normalizePrivateContactChatTransactionPayload(message.transaction || {}, message);
    if (!tx) return `<div class="private-contact-chat-bubble-text">转账</div>`;
    const settled = tx.status === 'accepted' || tx.status === 'received';
    const statusInfo = getPrivateContactChatPayStatusInfo('transaction', tx.status, message.role);
    return `
        <article class="private-contact-chat-pay-card private-contact-chat-transfer-card is-${escapePrivateHtml(statusInfo.tone)}${settled || tx.status === 'refunded' ? ' is-settled' : ''}" aria-label="转账，${escapePrivateHtml(statusInfo.label)}">
            <div class="private-contact-chat-pay-head">
                <span>转账</span>
                <em>${escapePrivateHtml(statusInfo.label)}</em>
            </div>
            <div class="private-contact-chat-pay-face">
                <div class="private-contact-chat-pay-emblem is-transfer" aria-hidden="true">账</div>
                <div class="private-contact-chat-pay-copy">
                    <strong>¥${escapePrivateHtml(formatPrivateContactChatMoney(tx.amount))}</strong>
                    <span>${escapePrivateHtml(tx.note)}</span>
                </div>
            </div>
            <div class="private-contact-chat-pay-footer"><span>点击查看状态</span><em>ASSET NOTE</em></div>
        </article>
    `;
}


function renderPrivateContactChatGiftReceiptMarkup(message = {}) {
    const gift = normalizePrivateContactChatGiftReceiptPayload(message.giftReceipt || message.gift_receipt || message.gift || {}, message);
    if (!gift) return `<div class="private-contact-chat-bubble-text">我收到礼物了。</div>`;
    return `
        <article class="private-contact-chat-pay-card private-contact-chat-gift-card is-settled">
            <div class="private-contact-chat-pay-face">
                <div class="private-contact-chat-pay-emblem is-gift" aria-hidden="true">礼</div>
                <div class="private-contact-chat-pay-copy">
                    <strong>${escapePrivateHtml(gift.productName)} × ${escapePrivateHtml(gift.quantity)}</strong>
                    <span>${escapePrivateHtml([gift.merchantName, gift.courier, gift.pickupCode ? `取件码 ${gift.pickupCode}` : ''].filter(Boolean).join(' · ') || '甄选礼物')}</span>
                </div>
            </div>
            <div class="private-contact-chat-pay-footer"><span>GIFT RECEIVED</span><em>${escapePrivateHtml(gift.message)}</em></div>
        </article>
    `;
}


function renderPrivateContactChatTraceForwardMarkup(message = {}) {
    const trace = normalizePrivateContactChatTraceForwardPayload(message.traceForward || message.trace_forward || message.trace || {}, message);
    if (!trace) return `<div class="private-contact-chat-bubble-text">踪迹监控线索</div>`;
    const meta = [trace.camera, trace.roomName].filter(Boolean).join(' · ') || 'CAMERA';
    const place = [trace.location, trace.address].filter(Boolean).join(' · ');
    return `
        <article class="private-contact-chat-trace-card" data-private-trace-forward-card>
            <div class="private-contact-chat-trace-head">
                <div>
                    <span>TRACE FORWARD</span>
                    <strong>${escapePrivateHtml(trace.itemName)}</strong>
                </div>
                <em>${escapePrivateHtml(meta)}</em>
            </div>
            <div class="private-contact-chat-trace-body">
                ${trace.targetName ? `<div class="private-contact-chat-trace-row"><span>对象</span><b>${escapePrivateHtml(trace.targetName)}</b></div>` : ''}
                ${place ? `<div class="private-contact-chat-trace-row"><span>位置</span><b>${escapePrivateHtml(place)}</b></div>` : ''}
                <p>${escapePrivateHtml(trace.content)}</p>
            </div>
            <div class="private-contact-chat-trace-foot"><span>${escapePrivateHtml(trace.note || 'MONITOR CLUE')}</span><i>${escapePrivateHtml(formatPrivateContactChatTime(trace.forwardedAt))}</i></div>
        </article>
    `;
}

async function requirePrivateContactChatPaymentAuthorization(label = '支付') {
    const actionLabel = String(label || '支付').trim() || '支付';
    const metaFn = window.rinnoAssetsGetPaymentMeta;
    const requireFn = window.rinnoAssetsRequireChatPayment;
    if (typeof metaFn !== 'function' || typeof requireFn !== 'function') {
        showPrivateSystemToast('资管 APP 支付模块未就绪。');
        return false;
    }
    try {
        const meta = await metaFn();
        if (!meta?.passcodeSet) {
            showPrivateSystemToast('请先在资管 APP 设置支付密码，未设置时不能发送红包或转账。');
            return false;
        }
        if (meta.noPasswordEnabled) return true;
        const result = await requireFn({
            verifyTitle: '输入支付密码',
            verifyNote: `输入支付密码后继续${actionLabel}`
        });
        if (!result?.ok) {
            if (result?.reason && result.code !== 'PAYMENT_CANCELLED') showPrivateSystemToast(result.reason);
            return false;
        }
        return true;
    } catch (error) {
        console.warn('Private chat payment auth failed:', error);
        showPrivateSystemToast('支付密码验证失败。');
        return false;
    }
}

async function applyPrivateContactChatAssetLedger(direction = 'expense', amount = 0, meta = {}) {
    const safeAmount = normalizePrivateContactChatMoneyAmount(amount);
    if (!safeAmount) return true;
    const fn = direction === 'income' ? window.rinnoAssetsIncome : window.rinnoAssetsSpend;
    if (typeof fn !== 'function') {
        showPrivateSystemToast('资管 APP 资产模块未就绪。');
        return false;
    }
    try {
        const result = await fn(safeAmount, meta);
        if (result && result.ok === false) {
            showPrivateSystemToast(result.reason || '资管资产交互失败。');
            return false;
        }
    } catch (error) {
        console.warn('Private chat asset ledger failed:', error);
        showPrivateSystemToast('资管资产交互失败。');
        return false;
    }
    return true;
}


function getPrivateContactChatLatestPayMessage(contactId, role = 'user', type = 'red_packet', activeStatuses = []) {
    const safeType = String(type || '').trim();
    const statuses = new Set((Array.isArray(activeStatuses) ? activeStatuses : []).map(item => String(item || '').trim()));
    const thread = getPrivateContactChatThread(contactId) || { messages: [] };
    return [...normalizePrivateContactChatMessages(thread.messages)].reverse().find(message => {
        if (String(message?.role || '') !== role) return false;
        if (getPrivateContactChatMessageType(message) !== safeType) return false;
        const payload = safeType === 'red_packet'
            ? normalizePrivateContactChatRedPacketPayload(message.redPacket || message.red_packet || {}, message)
            : normalizePrivateContactChatTransactionPayload(message.transaction || {}, message);
        if (!payload) return false;
        return !statuses.size || statuses.has(String(payload.status || '').trim());
    }) || null;
}

async function appendPrivateContactChatPaymentSystemEvent(contactId, text = '') {
    const safeContactId = String(contactId || '').trim();
    const content = String(text || '').trim();
    if (!safeContactId || !content) return false;
    updatePrivateContactChatThread(safeContactId, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: [
            ...thread.messages,
            {
                id: createPrivateContactChatMessageId('payment-system'),
                role: 'system',
                type: 'system',
                content: createPrivateContactSystemCapsuleText(content),
                createdAt: Date.now()
            }
        ]
    }));
    renderPrivateThreads();
    if (privateActiveContactChatId === safeContactId) renderPrivateContactChatPage(safeContactId);
    await savePrivateState();
    requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    return true;
}

async function updatePrivateContactChatPayMessageStatus(contactId, messageId, type, status, extra = {}) {
    const safeContactId = String(contactId || '').trim();
    const safeMessageId = String(messageId || '').trim();
    const safeType = String(type || '').trim();
    if (!safeContactId || !safeMessageId || !safeType) return null;
    return replacePrivateContactChatMessage(safeContactId, safeMessageId, message => {
        if (safeType === 'red_packet') {
            const packet = normalizePrivateContactChatRedPacketPayload(message.redPacket || message.red_packet || {}, message);
            return packet ? {
                ...message,
                redPacket: { ...packet, ...extra, status }
            } : message;
        }
        if (safeType === 'transaction') {
            const tx = normalizePrivateContactChatTransactionPayload(message.transaction || {}, message);
            return tx ? {
                ...message,
                transaction: { ...tx, ...extra, status }
            } : message;
        }
        return message;
    });
}

async function claimPrivateContactChatAssistantRedPacket(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    const packet = normalizePrivateContactChatRedPacketPayload(message?.redPacket || message?.red_packet || {}, message || {});
    if (!message || message.role !== 'assistant' || !packet) return false;
    if (packet.status !== 'active') {
        showPrivateSystemToast(packet.status === 'received' ? '这个红包已经领取过了。' : '这个红包已退回或失效。');
        return false;
    }
    const paid = await applyPrivateContactChatAssetLedger('income', packet.amount, { title: '领取红包', note: packet.greeting, icon: 'deposit' });
    if (!paid) return false;
    await updatePrivateContactChatPayMessageStatus(contactId, message.id, 'red_packet', 'received', { receivedAt: Date.now() });
    showPrivateSystemToast('红包已领取并入账。');
    return true;
}

async function acceptPrivateContactChatAssistantTransaction(messageId, contactId = privateActiveContactChatId) {
    const message = getPrivateContactChatMessage(messageId, contactId);
    const tx = normalizePrivateContactChatTransactionPayload(message?.transaction || {}, message || {});
    if (!message || message.role !== 'assistant' || !tx) return false;
    if (tx.status !== 'pending') {
        showPrivateSystemToast(tx.status === 'accepted' || tx.status === 'received' ? '这笔转账已经收款。' : '这笔转账已退回或失效。');
        return false;
    }
    const paid = await applyPrivateContactChatAssetLedger('income', tx.amount, { title: '收取转账', note: tx.note, icon: 'deposit' });
    if (!paid) return false;
    await updatePrivateContactChatPayMessageStatus(contactId, message.id, 'transaction', 'accepted', { receivedAt: Date.now() });
    showPrivateSystemToast('转账已收款并入账。');
    return true;
}

function ensurePrivateContactChatPayStatusModal() {
    let modal = document.getElementById('private-contact-chat-pay-status-modal');
    if (modal) return modal;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    modal = document.createElement('div');
    modal.className = 'private-user-preset-modal private-contact-chat-pay-status-modal api-preset-modal';
    modal.id = 'private-contact-chat-pay-status-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-chat-pay-status-title');
    modal.innerHTML = `
        <section class="private-user-preset-dialog private-contact-chat-pay-status-dialog api-preset-dialog">
            <div class="private-contact-chat-pay-status-hero">
                <span class="private-contact-chat-pay-status-kicker" id="private-contact-chat-pay-status-kicker">PAYMENT STATUS</span>
                <h2 id="private-contact-chat-pay-status-title">红包状态</h2>
                <p id="private-contact-chat-pay-status-subtitle">查看这笔聊天支付的当前状态。</p>
                <div class="private-contact-chat-pay-status-amount" id="private-contact-chat-pay-status-amount">¥0.00</div>
            </div>
            <div class="private-contact-chat-pay-status-list" id="private-contact-chat-pay-status-list"></div>
            <div class="private-contact-chat-pay-status-actions">
                <button class="interactive private-soft-button" id="private-contact-chat-pay-status-close" type="button">知道了</button>
                <button class="interactive private-soft-button primary" id="private-contact-chat-pay-status-action" type="button" hidden>继续</button>
            </div>
        </section>
    `;
    bindPrivateBackdropDismiss(modal, '.private-contact-chat-pay-status-dialog', () => closePrivateContactChatPayStatusModal());
    modal.querySelector('#private-contact-chat-pay-status-close')?.addEventListener('click', () => closePrivateContactChatPayStatusModal());
    modal.querySelector('#private-contact-chat-pay-status-action')?.addEventListener('click', () => {
        const context = privateContactChatPayStatusContext || {};
        closePrivateContactChatPayStatusModal();
        if (context.action === 'claim-red-packet') {
            void claimPrivateContactChatAssistantRedPacket(context.messageId, context.contactId);
            return;
        }
        if (context.action === 'accept-transaction') {
            void acceptPrivateContactChatAssistantTransaction(context.messageId, context.contactId);
        }
    });
    privateApp.appendChild(modal);
    return modal;
}

function closePrivateContactChatPayStatusModal(instant = false) {
    const modal = document.getElementById('private-contact-chat-pay-status-modal');
    privateContactChatPayStatusContext = null;
    if (!modal) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function buildPrivateContactChatPayStatusRows(messageType, message = {}, payload = {}) {
    const safeType = messageType === 'transaction' ? 'transaction' : 'red_packet';
    const statusInfo = getPrivateContactChatPayStatusInfo(safeType, payload.status, message.role);
    const senderLabel = message.role === 'assistant' ? 'TA 发给你' : '你发给 TA';
    const rows = [
        ['当前状态', statusInfo.label],
        ['金额', `¥${formatPrivateContactChatMoney(payload.amount)}`],
        [safeType === 'red_packet' ? '红包留言' : '转账附言', safeType === 'red_packet' ? (payload.greeting || '恭喜发财，大吉大利') : (payload.note || '转账')],
        ['发送方向', senderLabel],
        ['发送时间', formatPrivateContactChatPayDetailTime(message.createdAt)]
    ];
    if (payload.receivedAt || payload.receivedBy) {
        rows.push([safeType === 'red_packet' ? '领取人' : '收款人', payload.receivedBy || (message.role === 'assistant' ? '你' : 'TA')]);
        rows.push([safeType === 'red_packet' ? '领取时间' : '收款时间', formatPrivateContactChatPayDetailTime(payload.receivedAt)]);
    }
    if (payload.refundedAt || payload.refundedBy || payload.refundReason) {
        rows.push(['退回人', payload.refundedBy || (message.role === 'assistant' ? '你' : 'TA')]);
        rows.push(['退回时间', formatPrivateContactChatPayDetailTime(payload.refundedAt)]);
        if (payload.refundReason) rows.push(['退回原因', payload.refundReason]);
    }
    return rows;
}

function openPrivateContactChatPayStatusModal(messageType, message = {}, payload = {}, context = {}) {
    const modal = ensurePrivateContactChatPayStatusModal();
    if (!modal) return false;
    const safeType = messageType === 'transaction' ? 'transaction' : 'red_packet';
    const title = safeType === 'red_packet' ? '红包状态' : '转账状态';
    const statusInfo = getPrivateContactChatPayStatusInfo(safeType, payload.status, message.role);
    const detailText = safeType === 'red_packet'
        ? (payload.greeting || '恭喜发财，大吉大利')
        : (payload.note || '转账');
    const rows = buildPrivateContactChatPayStatusRows(safeType, message, payload);
    const titleNode = modal.querySelector('#private-contact-chat-pay-status-title');
    const kickerNode = modal.querySelector('#private-contact-chat-pay-status-kicker');
    const subtitleNode = modal.querySelector('#private-contact-chat-pay-status-subtitle');
    const amountNode = modal.querySelector('#private-contact-chat-pay-status-amount');
    const listNode = modal.querySelector('#private-contact-chat-pay-status-list');
    const actionNode = modal.querySelector('#private-contact-chat-pay-status-action');
    if (titleNode) titleNode.textContent = title;
    if (kickerNode) kickerNode.textContent = statusInfo.label;
    if (subtitleNode) subtitleNode.textContent = detailText;
    if (amountNode) amountNode.textContent = `¥${formatPrivateContactChatMoney(payload.amount)}`;
    if (listNode) {
        listNode.innerHTML = rows.map(([label, value]) => `
            <div class="private-contact-chat-pay-status-row">
                <span>${escapePrivateHtml(label)}</span>
                <strong>${escapePrivateHtml(value || '—')}</strong>
            </div>
        `).join('');
    }
    privateContactChatPayStatusContext = {
        contactId: context.contactId || privateActiveContactChatId,
        messageId: context.messageId || message.id || '',
        action: context.action || ''
    };
    modal.classList.toggle('has-primary-action', Boolean(context.action && context.actionLabel));
    if (actionNode) {
        if (context.action && context.actionLabel) {
            actionNode.hidden = false;
            actionNode.textContent = context.actionLabel;
        } else {
            actionNode.hidden = true;
            actionNode.textContent = '继续';
        }
    }
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    return true;
}

async function handlePrivateContactChatPaymentBubbleClick(bubbleNode) {
    if (!(bubbleNode instanceof HTMLElement)) return false;
    const wrap = bubbleNode.closest('[data-private-contact-chat-message-id]');
    const messageId = String(wrap?.getAttribute('data-private-contact-chat-message-id') || '').trim();
    const messageType = String(bubbleNode.getAttribute('data-private-contact-chat-message-type') || '').trim();
    if (!messageId || !['red_packet', 'transaction'].includes(messageType)) return false;
    const contactId = String(privateActiveContactChatId || '').trim();
    const message = getPrivateContactChatMessage(messageId, contactId);
    if (!message) return false;
    if (messageType === 'red_packet') {
        const packet = normalizePrivateContactChatRedPacketPayload(message.redPacket || message.red_packet || {}, message);
        if (!packet) return false;
        const context = message.role === 'assistant' && packet.status === 'active'
            ? { contactId, messageId, action: 'claim-red-packet', actionLabel: '领取红包' }
            : { contactId, messageId };
        return openPrivateContactChatPayStatusModal('red_packet', message, packet, context);
    }
    if (messageType === 'transaction') {
        const tx = normalizePrivateContactChatTransactionPayload(message.transaction || {}, message);
        if (!tx) return false;
        const context = message.role === 'assistant' && tx.status === 'pending'
            ? { contactId, messageId, action: 'accept-transaction', actionLabel: '确认收款' }
            : { contactId, messageId };
        return openPrivateContactChatPayStatusModal('transaction', message, tx, context);
    }
    return false;
}


async function applyPrivateContactChatAssistantPaymentAction(contact, instruction = {}) {
    const safeContactId = String(contact?.id || '').trim();
    const type = String(instruction?.type || '').trim();
    if (!safeContactId) return false;
    const contactName = getPrivateContactDisplayName(contact) || 'TA';
    if (type === 'open_red_packet') {
        const target = getPrivateContactChatLatestPayMessage(safeContactId, 'user', 'red_packet', ['active']);
        if (!target) return appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}想领取红包，但当前没有可领取的红包`);
        const packet = normalizePrivateContactChatRedPacketPayload(target.redPacket || target.red_packet || {}, target);
        await updatePrivateContactChatPayMessageStatus(safeContactId, target.id, 'red_packet', 'received', { receivedBy: contactName, receivedAt: Date.now() });
        await appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}领取了你的红包`);
        return Boolean(packet);
    }
    if (type === 'accept_transaction') {
        const target = getPrivateContactChatLatestPayMessage(safeContactId, 'user', 'transaction', ['pending']);
        if (!target) return appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}想收款，但当前没有待收转账`);
        await updatePrivateContactChatPayMessageStatus(safeContactId, target.id, 'transaction', 'accepted', { receivedBy: contactName, receivedAt: Date.now() });
        await appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}已收款`);
        return true;
    }
    if (type === 'refund_transaction' || type === 'return_transaction') {
        const targetType = String(instruction?.targetType || instruction?.target_type || '').trim() === 'red_packet' ? 'red_packet' : 'transaction';
        const target = getPrivateContactChatLatestPayMessage(safeContactId, 'user', targetType, targetType === 'red_packet' ? ['active'] : ['pending']);
        if (!target) return appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}想退回，但当前没有可退回的${targetType === 'red_packet' ? '红包' : '转账'}`);
        const payload = targetType === 'red_packet'
            ? normalizePrivateContactChatRedPacketPayload(target.redPacket || target.red_packet || {}, target)
            : normalizePrivateContactChatTransactionPayload(target.transaction || {}, target);
        if (payload?.amount) {
            const refunded = await applyPrivateContactChatAssetLedger('income', payload.amount, {
                title: targetType === 'red_packet' ? '红包退回' : '转账退回',
                note: instruction.reason || payload.greeting || payload.note || '聊天支付退回',
                icon: 'deposit'
            });
            if (!refunded) return false;
        }
        await updatePrivateContactChatPayMessageStatus(safeContactId, target.id, targetType, 'refunded', { refundedBy: contactName, refundedAt: Date.now(), refundReason: instruction.reason || '' });
        await appendPrivateContactChatPaymentSystemEvent(safeContactId, `${contactName}退回了你的${targetType === 'red_packet' ? '红包' : '转账'}`);
        return true;
    }
    return false;
}

function renderPrivateContactChatMessageContentMarkup(message = {}) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'camera') return renderPrivateContactChatCameraMarkup(message);
    if (type === 'image') return renderPrivateContactChatImageMarkup(message);
    if (type === 'voice') return renderPrivateContactChatVoiceMarkup(message);
    if (type === 'location') return renderPrivateContactChatLocationMarkup(message);
    if (type === 'sticker') return renderPrivateContactChatStickerMarkup(message);
    if (type === 'red_packet') return renderPrivateContactChatRedPacketMarkup(message);
    if (type === 'transaction') return renderPrivateContactChatTransactionMarkup(message);
    if (type === 'gift_receipt') return renderPrivateContactChatGiftReceiptMarkup(message);
    if (type === 'trace_forward') return renderPrivateContactChatTraceForwardMarkup(message);
    return `<div class="private-contact-chat-bubble-text">${formatPrivateContactChatHtml(message?.content || '')}</div>`;
}

function isPrivateContactChatBubbleShellFreeType(messageType = 'text') {
    return ['camera', 'image', 'sticker', 'red_packet', 'transaction', 'gift_receipt', 'trace_forward'].includes(String(messageType || '').trim());
}

function renderPrivateContactChatBubbleMarkup(message, index, total, role, options = {}) {
    const messageId = String(message?.id || '').trim();
    const favoriteClass = message?.favorite ? ' is-favorite' : '';
    const shapeClass = getPrivateContactChatBubbleShapeClass(index, total, role);
    const messageType = getPrivateContactChatMessageType(message);
    const typeClass = messageType !== 'text' ? ` is-${messageType}` : '';
    const expandedClass = (
        messageType === 'voice'
        && privateContactChatExpandedVoiceMessageIds.has(messageId)
    ) ? ' is-expanded' : '';
    const shellFreeClass = isPrivateContactChatBubbleShellFreeType(messageType) ? ' is-shell-free' : '';
    const favoriteBadge = message?.favorite
        ? '<span class="private-contact-chat-bubble-favorite" aria-hidden="true">*</span>'
        : '';
    const translationMarkup = role === 'assistant' && options.translationEnabled
        ? renderPrivateContactChatTranslationMarkup(message, Boolean(options.translationExpanded))
        : '';
    return `
        <div class="private-contact-chat-bubble-wrap${shellFreeClass}" data-private-contact-chat-message-id="${escapePrivateHtml(messageId)}" data-private-contact-chat-message-role="${escapePrivateHtml(role)}">
            <button class="interactive private-contact-chat-select-toggle" type="button" tabindex="-1" aria-hidden="true"></button>
            <div class="private-contact-chat-bubble-body${shellFreeClass}">
                <div class="private-contact-chat-bubble ${shapeClass}${favoriteClass}${typeClass}${expandedClass}${shellFreeClass}" data-private-contact-chat-bubble data-private-contact-chat-message-type="${escapePrivateHtml(messageType)}" tabindex="0">
                    ${favoriteBadge}
                    ${renderPrivateContactChatQuoteMarkup(message?.quote, role, shapeClass)}
                    ${renderPrivateContactChatMessageContentMarkup(message)}
                </div>
                ${translationMarkup}
            </div>
        </div>
    `;
}

function renderPrivateContactChatSystemMessageMarkup(message) {
    const safeMessage = message || {};
    const messageId = escapePrivateHtml(String(safeMessage.id || '').trim());
    const capsuleText = extractPrivateContactSystemCapsuleText(safeMessage.content || '');
    if (safeMessage.recalled && safeMessage.recalledData) {
        return `
            <div class="private-contact-chat-system is-recalled" data-private-contact-chat-system-id="${messageId}" data-private-contact-chat-message-id="${messageId}">
                <span class="private-contact-chat-system-text">${escapePrivateHtml(safeMessage.content || '你撤回了一条消息')}</span>
                <span class="private-contact-chat-system-actions">
                    <button class="interactive private-contact-chat-system-link" type="button" data-private-contact-chat-recall-detail="${messageId}">查看</button>
                </span>
            </div>
        `;
    }
    if (capsuleText) {
        return `<div class="private-contact-chat-system private-contact-chat-system-capsule">${escapePrivateHtml(capsuleText)}</div>`;
    }
    return `<div class="private-contact-chat-system">${formatPrivateContactChatHtml(safeMessage.content || '')}</div>`;
}

function groupPrivateContactChatMessages(messages) {
    return normalizePrivateContactChatMessages(messages).reduce((groups, message) => {
        if (message.role === 'system') {
            groups.push({ type: 'system', messages: [message] });
            return groups;
        }
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.type === 'chat' && lastGroup.role === message.role) {
            lastGroup.messages.push(message);
            return groups;
        }
        groups.push({
            type: 'chat',
            role: message.role,
            messages: [message]
        });
        return groups;
    }, []);
}

function getPrivateContactChatVisibleMessages(messages, contactId = privateActiveContactChatId) {
    const normalizedMessages = normalizePrivateContactChatMessages(messages);
    const safeContactId = String(contactId || '').trim();
    const isExpanded = safeContactId && safeContactId === String(privateContactChatHistoryExpandedId || '').trim();
    if (isExpanded || normalizedMessages.length <= PRIVATE_CONTACT_CHAT_PAGE_SIZE) {
        return {
            messages: normalizedMessages,
            hiddenCount: 0
        };
    }
    return {
        messages: normalizedMessages.slice(-PRIVATE_CONTACT_CHAT_PAGE_SIZE),
        hiddenCount: normalizedMessages.length - PRIVATE_CONTACT_CHAT_PAGE_SIZE
    };
}

function renderPrivateContactChatHistoryRevealMarkup(hiddenCount) {
    const count = Math.max(0, Number(hiddenCount) || 0);
    if (!count) return '';
    return `
        <button class="interactive private-contact-chat-history-reveal" type="button" data-private-contact-chat-expand-history>
            点击展开 ${escapePrivateHtml(count)} 条历史消息
        </button>
    `;
}

function renderPrivateContactChatGroup(contact, group) {
    if (!group || !Array.isArray(group.messages) || !group.messages.length) return '';
    if (group.type === 'system') {
        return renderPrivateContactChatSystemMessageMarkup(group.messages[0]);
    }
    const messages = group.messages;
    const role = group.role === 'user' ? 'user' : 'assistant';
    const lastMessage = messages[messages.length - 1];
    const timeMarkup = escapePrivateHtml(formatPrivateContactChatTime(lastMessage?.createdAt));
    const translationEnabled = role === 'assistant'
        && shouldPrivateContactChatShowTranslation(contact)
        && messages.some(message => normalizePrivateContactChatTranslationText(message?.translation || message?.translation_zh || ''));
    const translationGroupKey = translationEnabled ? getPrivateContactChatTranslationGroupKey(contact, messages) : '';
    const translationExpanded = translationEnabled && privateContactChatExpandedTranslationKeys.has(translationGroupKey);
    const bubbles = messages.map((message, index) => renderPrivateContactChatBubbleMarkup(message, index, messages.length, role, {
        translationEnabled,
        translationExpanded
    })).join('');
    if (role === 'user') {
        return `
            <article class="private-contact-chat-message is-user">
                <div class="private-contact-chat-stack">
                    ${bubbles}
                    <div class="private-contact-chat-meta">${timeMarkup}${createPrivateContactChatCheckMarkup()}</div>
                </div>
                ${createPrivateContactChatSelfMarkup()}
            </article>
        `;
    }
    const translationToggle = translationEnabled
        ? `<button class="interactive private-contact-chat-translation-toggle${translationExpanded ? ' is-active' : ''}" type="button" data-private-contact-chat-translation-toggle="${escapePrivateHtml(translationGroupKey)}" aria-expanded="${translationExpanded ? 'true' : 'false'}">翻译</button>`
        : '';
    return `
        <article class="private-contact-chat-message is-assistant${translationExpanded ? ' is-translation-expanded' : ''}"${translationEnabled ? ` data-private-contact-chat-translation-group="${escapePrivateHtml(translationGroupKey)}"` : ''}>
            ${createPrivateContactChatMarkMarkup(contact, 'private-contact-chat-face')}
            <div class="private-contact-chat-stack">
                <div class="private-contact-chat-tags">
                    <span class="private-contact-chat-tag">Private</span>
                    <span class="private-contact-chat-tag private-contact-chat-tag-soft">${escapePrivateHtml(getPrivateContactDisplayName(contact))}</span>
                </div>
                ${bubbles}
                <div class="private-contact-chat-meta">${timeMarkup}${translationToggle}</div>
            </div>
        </article>
    `;
}

function setPrivateContactChatTranslationGroupExpanded(groupKey, expanded) {
    const safeKey = String(groupKey || '').trim();
    if (!safeKey) return;
    if (expanded) privateContactChatExpandedTranslationKeys.add(safeKey);
    else privateContactChatExpandedTranslationKeys.delete(safeKey);
    document.querySelectorAll('[data-private-contact-chat-translation-group]').forEach(group => {
        if (String(group.getAttribute('data-private-contact-chat-translation-group') || '').trim() !== safeKey) return;
        group.classList.toggle('is-translation-expanded', Boolean(expanded));
        group.querySelectorAll('[data-private-contact-chat-translation]').forEach(node => {
            node.hidden = !expanded;
        });
        group.querySelectorAll('[data-private-contact-chat-translation-toggle]').forEach(button => {
            button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            button.classList.toggle('is-active', Boolean(expanded));
        });
    });
}

function togglePrivateContactChatTranslationGroup(groupKey) {
    const safeKey = String(groupKey || '').trim();
    if (!safeKey) return;
    setPrivateContactChatTranslationGroupExpanded(
        safeKey,
        !privateContactChatExpandedTranslationKeys.has(safeKey)
    );
}

function buildPrivateContactChatThreadPreview(contact, thread) {
    const lastMessage = thread?.messages?.[thread.messages.length - 1];
    if (!lastMessage) {
        return trimPrivateContactChatSnippet(contact?.note || buildPrivateContactChatSubtitle(contact) || 'Tap to start a new chat.', 56);
    }
    if (lastMessage.role === 'system') {
        const capsuleText = extractPrivateContactSystemCapsuleText(lastMessage.content || '');
        return trimPrivateContactChatSnippet(capsuleText || lastMessage.content || 'A chat update was recorded.', 56);
    }
    return getPrivateContactChatMessageSummary(lastMessage, 56) || 'New message';
}

function buildPrivateContactChatPreviewItems() {
    return getPrivateScopedContacts()
        .map(getPrivateHydratedContact)
        .map(contact => {
            const thread = getPrivateContactChatThread(contact.id);
            return {
                contact,
                threadId: createPrivateContactChatThreadId(contact.id),
                unread: Math.max(0, Number(thread?.unread) || 0),
                updatedAt: Number(thread?.updatedAt) || 0,
                preview: buildPrivateContactChatThreadPreview(contact, thread),
                time: formatPrivateContactChatListTime(thread?.updatedAt)
            };
        })
        .sort((a, b) => {
            const delta = (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0);
            if (delta) return delta;
            return getPrivateContactDisplayName(a.contact).localeCompare(getPrivateContactDisplayName(b.contact), 'zh-CN');
        });
}

function getPrivateContactChatComposerPanelElement(name = '') {
    const safeName = String(name || '').trim();
    if (!safeName) return null;
    return document.getElementById(`private-contact-chat-${safeName}-panel`);
}

function getPrivateContactChatComposeModalElements() {
    return {
        modal: document.getElementById('private-contact-chat-compose-modal'),
        title: document.getElementById('private-contact-chat-compose-title'),
        label: document.getElementById('private-contact-chat-compose-label'),
        input: document.getElementById('private-contact-chat-compose-input'),
        secondaryField: document.getElementById('private-contact-chat-compose-secondary-field'),
        secondaryLabel: document.getElementById('private-contact-chat-compose-secondary-label'),
        secondaryInput: document.getElementById('private-contact-chat-compose-secondary-input'),
        hint: document.getElementById('private-contact-chat-compose-hint'),
        count: document.getElementById('private-contact-chat-compose-count'),
        submit: document.getElementById('private-contact-chat-compose-submit')
    };
}

function getPrivateAllStoredStickers() {
    privateStickerLibraryState = normalizePrivateStickerLibraryState(privateStickerLibraryState);
    return privateStickerLibraryState.groups
        .flatMap(group => Array.isArray(group?.stickers) ? group.stickers : [])
        .filter(sticker => sticker && sticker.id && sticker.url);
}

function buildPrivateContactChatStickerInventory(limit = PRIVATE_CONTACT_CHAT_STICKER_PROMPT_LIMIT) {
    return getPrivateAllStoredStickers()
        .slice(0, Math.max(0, Number(limit) || PRIVATE_CONTACT_CHAT_STICKER_PROMPT_LIMIT))
        .map((sticker, index) => ({
            ...sticker,
            ref: `S${String(index + 1).padStart(2, '0')}`
        }));
}

function normalizePrivateContactChatStickerLookupKey(value = '') {
    return normalizePrivateStickerPlainText(value, 48)
        .toLowerCase()
        .replace(/\s+/g, '');
}

function getPrivateContactChatStickerResolutionInventory() {
    const promptInventory = Array.isArray(privateContactChatPromptStickerInventory)
        ? privateContactChatPromptStickerInventory.filter(sticker => sticker && sticker.id && sticker.url)
        : [];
    if (promptInventory.length) return promptInventory;
    return buildPrivateContactChatStickerInventory(PRIVATE_CONTACT_CHAT_STICKER_PROMPT_LIMIT)
        .filter(sticker => sticker && sticker.id && sticker.url);
}

function createPrivateContactChatStickerInstruction(sticker = {}) {
    const id = String(sticker.id || '').trim();
    const url = normalizePrivateStickerUrl(sticker.url || sticker.src || sticker.href || '');
    if (!id || !url) return null;
    const description = normalizePrivateStickerPlainText(
        sticker.description || sticker.name || PRIVATE_CONTACT_CHAT_STICKER_LABEL,
        120
    ) || PRIVATE_CONTACT_CHAT_STICKER_LABEL;
    return {
        type: 'sticker',
        content: description,
        sticker: {
            id,
            ref: normalizePrivateStickerPlainText(sticker.ref || '', 12).toUpperCase(),
            type: 'sticker',
            description,
            url
        }
    };
}

function resolvePrivateContactChatPromptStickerByRef(value = '') {
    const raw = normalizePrivateStickerPlainText(value, 48);
    if (!raw) return null;
    const inventory = getPrivateContactChatStickerResolutionInventory();
    if (!inventory.length) return null;
    const ref = normalizePrivateStickerPlainText(raw, 12).toUpperCase();
    const direct = inventory.find(sticker => (
        sticker.ref === ref
        || String(sticker.id || '').trim() === raw
    ));
    if (direct) return direct;
    const lookup = normalizePrivateContactChatStickerLookupKey(raw);
    if (!lookup) return null;
    return inventory.find(sticker => {
        const descriptionKey = normalizePrivateContactChatStickerLookupKey(sticker.description || '');
        const nameKey = normalizePrivateContactChatStickerLookupKey(sticker.name || '');
        return (
            lookup === descriptionKey
            || lookup === nameKey
            || (descriptionKey && (descriptionKey.includes(lookup) || lookup.includes(descriptionKey)))
            || (nameKey && (nameKey.includes(lookup) || lookup.includes(nameKey)))
        );
    }) || null;
}

function resolvePrivateContactChatPromptStickerByText(value = '', options = {}) {
    const raw = normalizePrivateStickerPlainText(value, 64);
    if (!raw) return null;
    const explicitMarker = /(?:^|\b)(?:sticker|emoji|emoticon|meme)(?:\b|$)|表情|贴纸|斗图/i.test(raw);
    const cleaned = raw
        .replace(/^\[(?:表情包|贴纸|sticker|emoji|emoticon|meme)\]\s*/i, '')
        .replace(/^(?:发|回|丢|塞|扔)?\s*(?:一个|一张|个)?\s*(?:表情包|贴纸|sticker|emoji|emoticon|meme)[:：\s-]*/i, '')
        .trim();
    if (!cleaned) return null;
    const candidate = resolvePrivateContactChatPromptStickerByRef(cleaned);
    if (!candidate) return null;
    const lookup = normalizePrivateContactChatStickerLookupKey(cleaned);
    const descriptionKey = normalizePrivateContactChatStickerLookupKey(candidate.description || '');
    const nameKey = normalizePrivateContactChatStickerLookupKey(candidate.name || '');
    const refKey = normalizePrivateContactChatStickerLookupKey(candidate.ref || '');
    const exactMatch = Boolean(lookup) && [descriptionKey, nameKey, refKey].includes(lookup);
    const shortSnippet = Array.from(cleaned).length <= 16;
    const allowLoose = Boolean(options?.allowLoose);
    const looseMatch = Boolean(lookup) && shortSnippet && (
        (descriptionKey && (descriptionKey.includes(lookup) || lookup.includes(descriptionKey)))
        || (nameKey && (nameKey.includes(lookup) || lookup.includes(nameKey)))
    );
    if (!explicitMarker && !exactMatch && !(allowLoose && looseMatch)) return null;
    return candidate;
}

function coercePrivateContactChatTextInstructionToSticker(instruction = {}, thread = {}) {
    if (!instruction || typeof instruction !== 'object') return instruction;
    if (String(instruction.type || '').trim() !== 'text') return instruction;
    const intent = getPrivateContactChatRichIntent(thread);
    const candidate = resolvePrivateContactChatPromptStickerByText(
        instruction.sticker_ref
        || instruction.stickerRef
        || instruction.keyword
        || instruction.content
        || '',
        { allowLoose: intent.sticker }
    );
    const stickerInstruction = createPrivateContactChatStickerInstruction(candidate || {});
    if (!stickerInstruction) return instruction;
    return {
        ...stickerInstruction,
        __coercedFromText: true
    };
}

function buildPrivateContactChatMoreActions() {
    return [
        {
            key: 'image',
            label: '图片',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"></rect><circle cx="9" cy="10" r="1.6"></circle><path d="m6.5 17 4.2-4.4 3.1 3.1 2.8-2.8 2.9 4.1"></path></svg>'
        },
        {
            key: 'location',
            label: '定位',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s6-4.7 6-10.2A6 6 0 1 0 6 9.8C6 15.3 12 20 12 20Z"></path><circle cx="12" cy="9.5" r="2.2"></circle></svg>'
        },
        {
            key: 'hongbao',
            label: '红包',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5h14v10A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-10Z"></path><path d="M4 8.5h16V7a2 2 0 0 0-2-2h-2.2a2.8 2.8 0 0 1-2.2 1.1H10.4A2.8 2.8 0 0 1 8.2 5H6a2 2 0 0 0-2 2v1.5Z"></path><path d="M12 8.8v8.4"></path></svg>'
        },
        {
            key: 'transfer',
            label: '转账',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6.5" width="17" height="11" rx="2.5"></rect><path d="M7.2 12h9.6"></path><path d="m13.6 9.4 2.6 2.6-2.6 2.6"></path></svg>'
        },
        {
            key: 'gacha',
            label: '扭蛋',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5a6.5 6.5 0 1 1 0 13A6.5 6.5 0 0 1 12 4.5Z"></path><path d="M8 18.5h8"></path><path d="M10 21h4"></path><path d="M12 7.5v7"></path><path d="M8.5 11h7"></path></svg>'
        },
        {
            key: 'theatre',
            label: '小剧场',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"></path><path d="M5 9.5h14"></path><path d="m9 12.5 6 3.5-6 3.5z"></path></svg>'
        },
        {
            key: 'timeline',
            label: '时间轴',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><circle cx="8" cy="12" r="2"></circle><circle cx="16" cy="12" r="2"></circle><path d="M8 10V7"></path><path d="M16 14v3"></path></svg>'
        },
        {
            key: 'listen',
            label: '一起听',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 17a2.5 2.5 0 0 1-2.5-2.5V10A6.5 6.5 0 0 1 12 3.5 6.5 6.5 0 0 1 18.5 10v4.5A2.5 2.5 0 0 1 16 17"></path><path d="M8 12h-.8A1.7 1.7 0 0 0 5.5 13.7v1.6A1.7 1.7 0 0 0 7.2 17H8z"></path><path d="M16 12h.8a1.7 1.7 0 0 1 1.7 1.7v1.6A1.7 1.7 0 0 1 16.8 17H16z"></path></svg>'
        }
    ];
}

function syncPrivateContactChatExpandButton() {
    const button = document.getElementById('private-contact-chat-expand');
    const emojiButton = document.getElementById('private-contact-chat-emoji');
    if (button) {
        button.dataset.mode = 'more';
        button.setAttribute('aria-label', '更多功能');
        button.setAttribute('aria-expanded', privateContactChatComposerPanel === 'more' ? 'true' : 'false');
        button.classList.toggle('is-active', privateContactChatComposerPanel === 'more');
        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>';
    }
    if (emojiButton) {
        emojiButton.setAttribute('aria-expanded', privateContactChatComposerPanel === 'sticker' ? 'true' : 'false');
        emojiButton.classList.toggle('is-active', privateContactChatComposerPanel === 'sticker');
    }
}

function renderPrivateContactChatStickerPanel() {
    privateStickerLibraryState = normalizePrivateStickerLibraryState(privateStickerLibraryState);
    const groupList = document.getElementById('private-contact-chat-sticker-groups');
    const grid = document.getElementById('private-contact-chat-sticker-grid');
    if (!grid) return;
    const activeGroup = getPrivateActiveStickerGroup();
    const groups = privateStickerLibraryState.groups.filter(group => group && group.id);
    const stickers = Array.isArray(activeGroup?.stickers) ? activeGroup.stickers.slice(0, 96) : [];
    if (groupList) {
        groupList.innerHTML = groups.map(group => {
            const active = group.id === activeGroup?.id;
            return `
                <button class="interactive private-contact-chat-sticker-group ${active ? 'active' : ''}" type="button" data-private-contact-chat-sticker-group="${escapePrivateHtml(group.id)}" aria-pressed="${active ? 'true' : 'false'}">
                    <span>${escapePrivateHtml(group.name)}</span>
                    <em>${group.stickers.length}</em>
                </button>
            `;
        }).join('');
    }
    if (!stickers.length) {
        grid.innerHTML = '<div class="private-contact-chat-panel-empty">这个分组还没有表情包</div>';
        grid.style.removeProperty('--private-contact-chat-sticker-cell-size');
        return;
    }
    grid.innerHTML = stickers.map(sticker => `
        <button class="interactive private-contact-chat-picker-sticker" type="button" data-private-contact-chat-sticker-pick="${escapePrivateHtml(sticker.id)}" aria-label="发送 ${escapePrivateHtml(sticker.description)}" title="${escapePrivateHtml(sticker.description)}">
            <img src="${escapePrivateHtml(sticker.url)}" alt="${escapePrivateHtml(sticker.description)}" loading="lazy" referrerpolicy="no-referrer">
        </button>
    `).join('');
    requestAnimationFrame(() => syncPrivateContactChatStickerGridMetrics(grid));
}

function syncPrivateContactChatStickerGridMetrics(grid = document.getElementById('private-contact-chat-sticker-grid')) {
    if (!(grid instanceof HTMLElement)) return;
    const computed = window.getComputedStyle(grid);
    const columnTokens = String(computed.gridTemplateColumns || '')
        .split(/\s+/)
        .map(token => Number.parseFloat(token))
        .filter(value => Number.isFinite(value) && value > 0);
    const columnWidth = columnTokens[0] || 0;
    if (!columnWidth) return;
    grid.style.setProperty('--private-contact-chat-sticker-cell-size', `${Math.round(columnWidth * 100) / 100}px`);
}

function renderPrivateContactChatMorePanel() {
    const grid = document.getElementById('private-contact-chat-more-grid');
    if (!grid) return;
    grid.innerHTML = buildPrivateContactChatMoreActions().map(action => `
        <button class="interactive private-contact-chat-more-action" type="button" data-private-contact-chat-more-action="${escapePrivateHtml(action.key)}" aria-label="${escapePrivateHtml(action.label)}">
            <span class="private-contact-chat-more-icon" aria-hidden="true">${action.icon}</span>
            <span class="private-contact-chat-more-label">${escapePrivateHtml(action.label)}</span>
        </button>
    `).join('');
}

function closePrivateContactChatComposerPanels() {
    privateContactChatComposerPanel = '';
    ['sticker', 'more'].forEach(name => {
        const panel = getPrivateContactChatComposerPanelElement(name);
        if (panel) {
            panel.hidden = true;
            panel.classList.remove('active');
        }
    });
    syncPrivateContactChatExpandButton();
}

function setPrivateContactChatComposerPanel(name = '') {
    const safeName = ['sticker', 'more'].includes(String(name || '').trim()) ? String(name || '').trim() : '';
    privateContactChatComposerPanel = safeName;
    ['sticker', 'more'].forEach(panelName => {
        const panel = getPrivateContactChatComposerPanelElement(panelName);
        if (!panel) return;
        const active = safeName === panelName;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
    });
    if (safeName === 'sticker') {
        requestAnimationFrame(() => syncPrivateContactChatStickerGridMetrics());
    }
    syncPrivateContactChatExpandButton();
}

async function togglePrivateContactChatStickerPanel() {
    closePrivateContactChatActionMenu(true);
    if (privateContactChatComposerPanel === 'sticker') {
        closePrivateContactChatComposerPanels();
        return false;
    }
    await loadPrivateStickerLibraryState();
    renderPrivateContactChatStickerPanel();
    renderPrivateContactChatMorePanel();
    setPrivateContactChatComposerPanel('sticker');
    return true;
}

function togglePrivateContactChatMorePanel() {
    closePrivateContactChatActionMenu(true);
    if (privateContactChatComposerPanel === 'more') {
        closePrivateContactChatComposerPanels();
        return false;
    }
    renderPrivateContactChatMorePanel();
    setPrivateContactChatComposerPanel('more');
    return true;
}

function syncPrivateContactChatComposeModalMeta() {
    const state = privateContactChatComposeModalState;
    const { input, hint, count } = getPrivateContactChatComposeModalElements();
    if (!state || !(input instanceof HTMLTextAreaElement)) return;
    const value = String(input.value || '');
    const length = Array.from(value.trim()).length;
    if (count) count.textContent = `${length}`;
    if (!hint) return;
    if (state.mode === 'voice') {
        hint.textContent = `按 ${PRIVATE_CONTACT_CHAT_VOICE_CHAR_PER_SECOND} 字 / 秒估算，约 ${estimatePrivateContactChatVoiceDurationSeconds(value)}''`;
        return;
    }
    if (state.mode === 'red_packet') {
        hint.textContent = '发送后会从资管 APP 零钱扣款，并写入账单';
        return;
    }
    if (state.mode === 'transaction') {
        hint.textContent = '确认后会联动资管 APP 零钱与账单';
        return;
    }
    if (state.mode === 'camera') {
        hint.textContent = '发送后点击卡片即可切换到背面描述';
        return;
    }
    if (state.mode === 'image') {
        hint.textContent = 'Rinno 图片消息只写内容，不写 URL';
        return;
    }
    if (state.mode === 'location') {
        hint.textContent = '会发送成一体化定位卡片';
        return;
    }
    hint.textContent = state.hint || '';
}

function openPrivateContactChatComposeModal(config = {}) {
    const elements = getPrivateContactChatComposeModalElements();
    if (!(elements.modal instanceof HTMLElement) || !(elements.input instanceof HTMLTextAreaElement)) return false;
    closePrivateContactChatComposerPanels();
    privateContactChatComposeModalState = {
        mode: String(config.mode || '').trim(),
        title: String(config.title || '').trim(),
        label: String(config.label || '').trim(),
        placeholder: String(config.placeholder || '').trim(),
        maxLength: Math.max(12, Number(config.maxLength) || 180),
        secondaryLabel: String(config.secondaryLabel || '').trim(),
        secondaryPlaceholder: String(config.secondaryPlaceholder || '').trim(),
        secondaryMaxLength: Math.max(0, Number(config.secondaryMaxLength) || 0),
        submitText: String(config.submitText || '发送').trim(),
        hint: String(config.hint || '').trim()
    };
    if (elements.title) elements.title.textContent = privateContactChatComposeModalState.title || '发送内容';
    if (elements.label) elements.label.textContent = privateContactChatComposeModalState.label || '内容';
    elements.input.value = '';
    elements.input.placeholder = privateContactChatComposeModalState.placeholder || '';
    elements.input.removeAttribute('maxlength');
    if (elements.submit) elements.submit.textContent = privateContactChatComposeModalState.submitText || '发送';
    const showSecondary = Boolean(privateContactChatComposeModalState.secondaryLabel);
    if (elements.secondaryField) elements.secondaryField.hidden = !showSecondary;
    if (elements.secondaryLabel) elements.secondaryLabel.textContent = privateContactChatComposeModalState.secondaryLabel || '';
    if (elements.secondaryInput instanceof HTMLInputElement) {
        elements.secondaryInput.value = '';
        elements.secondaryInput.placeholder = privateContactChatComposeModalState.secondaryPlaceholder || '';
        elements.secondaryInput.removeAttribute('maxlength');
    }
    elements.modal.hidden = false;
    requestAnimationFrame(() => {
        elements.modal.classList.add('active');
        syncPrivateContactChatComposeModalMeta();
        elements.input?.focus();
    });
    return true;
}

function closePrivateContactChatComposeModal(instant = false) {
    const { modal } = getPrivateContactChatComposeModalElements();
    privateContactChatComposeModalState = null;
    if (!(modal instanceof HTMLElement)) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function submitPrivateContactChatComposeModal() {
    const state = privateContactChatComposeModalState;
    const { input, secondaryInput } = getPrivateContactChatComposeModalElements();
    if (!state || !(input instanceof HTMLTextAreaElement)) return false;
    if (state.mode === 'red_packet') {
        const greeting = normalizePrivateContactChatMediaDescription(input.value, 48) || '恭喜发财，大吉大利';
        const amount = normalizePrivateContactChatMoneyAmount(secondaryInput?.value || 0);
        if (!amount) { showPrivateSystemToast('请输入有效红包金额。'); return false; }
        const authorized = await requirePrivateContactChatPaymentAuthorization('发送红包');
        if (!authorized) return false;
        const paid = await applyPrivateContactChatAssetLedger('expense', amount, { title: '发出红包', note: greeting, icon: 'withdraw' });
        if (!paid) return false;
        const sent = await sendPrivateContactChatRichUserMessage('red_packet', {
            content: greeting,
            redPacket: { amount, greeting, status: 'active' }
        }, '红包已发送。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    if (state.mode === 'transaction') {
        const note = normalizePrivateContactChatMediaDescription(input.value, 48) || '转账';
        const amount = normalizePrivateContactChatMoneyAmount(secondaryInput?.value || 0);
        if (!amount) { showPrivateSystemToast('请输入有效转账金额。'); return false; }
        const authorized = await requirePrivateContactChatPaymentAuthorization('发送转账');
        if (!authorized) return false;
        const paid = await applyPrivateContactChatAssetLedger('expense', amount, { title: '聊天转账', note, icon: 'withdraw' });
        if (!paid) return false;
        const sent = await sendPrivateContactChatRichUserMessage('transaction', {
            content: note,
            transaction: { amount, note, status: 'pending' }
        }, '转账已发送，等待TA收款。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    if (state.mode === 'camera') {
        const description = normalizePrivateContactChatMediaDescription(input.value, state.maxLength);
        if (!description) return false;
        const sent = await sendPrivateContactChatRichUserMessage('camera', {
            content: description,
            media: { type: 'camera', description },
            image: {
                type: 'image',
                src: getPrivateContactChatCameraCardImageSrc(),
                width: PRIVATE_CONTACT_CHAT_CAMERA_CARD_SIZE,
                height: PRIVATE_CONTACT_CHAT_CAMERA_CARD_SIZE,
                name: PRIVATE_CONTACT_CHAT_CAMERA_CARD_IMAGE_PATH
            }
        }, '照片卡片已发送。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    if (state.mode === 'voice') {
        const transcript = normalizePrivateContactChatReplyText(input.value);
        if (!transcript) return false;
        const duration = estimatePrivateContactChatVoiceDurationSeconds(transcript);
        const sent = await sendPrivateContactChatRichUserMessage('voice', {
            content: transcript,
            voice: { transcript, durationSeconds: duration }
        }, '语音已发送。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    if (state.mode === 'image') {
        const description = normalizePrivateContactChatMediaDescription(input.value, state.maxLength);
        if (!description) return false;
        const sent = await sendPrivateContactChatRichUserMessage('image', {
            content: description,
            media: { type: 'image', description }
        }, '图片描述已发送。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    if (state.mode === 'location') {
        const name = normalizePrivateContactChatMediaDescription(input.value, 72);
        if (!name) return false;
        const sent = await sendPrivateContactChatRichUserMessage('location', {
            content: name,
            location: { name, address: '' }
        }, '定位已发送。');
        if (sent) closePrivateContactChatComposeModal();
        return sent;
    }
    return false;
}

function syncPrivateContactChatComposerUi() {
    const input = document.getElementById('private-contact-chat-input');
    const bar = document.getElementById('private-contact-chat-quotebar');
    const sender = document.getElementById('private-contact-chat-quote-sender');
    const content = document.getElementById('private-contact-chat-quote-content');
    const activeContact = getPrivateContactById(privateActiveContactChatId);
    const activeContactName = String(activeContact?.title || activeContact?.nickname || '').trim() || '联系人';
    if (input) input.placeholder = getPrivateContactChatPlaceholder();
    syncPrivateContactChatExpandButton();
    if (privateContactChatComposerPanel === 'sticker') renderPrivateContactChatStickerPanel();
    if (privateContactChatComposerPanel === 'more') renderPrivateContactChatMorePanel();
    syncPrivateContactChatComposeModalMeta();
    const quote = getPrivateContactChatQuotedMessage();
    if (!bar || !sender || !content) return;
    bar.hidden = !quote;
    if (!quote) return;
    sender.textContent = `回复 ${activeContactName}：`;
    content.textContent = trimPrivateContactChatSnippet(quote.content, 96) || '消息内容';
}

function scrollPrivateContactChatContentToBottom(behavior = 'auto') {
    const content = document.getElementById('private-contact-chat-content');
    if (!content) return;
    try {
        content.scrollTo({
            top: content.scrollHeight,
            behavior
        });
    } catch (error) {
        content.scrollTop = content.scrollHeight;
    }
}

function clearPrivateContactChatMenuPressTimer() {
    if (!privateContactChatMenuPressTimer) return;
    window.clearTimeout(privateContactChatMenuPressTimer);
    privateContactChatMenuPressTimer = 0;
}

function clearPrivateContactChatPlaceholderPressTimer() {
    if (!privateContactChatPlaceholderPressTimer) return;
    window.clearTimeout(privateContactChatPlaceholderPressTimer);
    privateContactChatPlaceholderPressTimer = 0;
}

function isPrimaryPrivateContactChatPointer(event) {
    return typeof event?.button !== 'number' || event.button === 0;
}

function getPrivateContactChatBubbleWrapFromTarget(target) {
    const bubble = target instanceof Element
        ? target.closest('[data-private-contact-chat-bubble]')
        : null;
    return bubble?.closest('[data-private-contact-chat-message-id]') || null;
}

function getPrivateContactChatSelectableMessageNodeFromTarget(target) {
    const bubbleWrap = getPrivateContactChatBubbleWrapFromTarget(target);
    if (bubbleWrap instanceof HTMLElement) return bubbleWrap;
    const systemMessage = target instanceof Element
        ? target.closest('.private-contact-chat-system.is-recalled[data-private-contact-chat-message-id]')
        : null;
    return systemMessage instanceof HTMLElement ? systemMessage : null;
}

function getPrivateContactChatInputShellFromTarget(target) {
    const shell = target instanceof Element
        ? target.closest('.private-contact-chat-input-shell')
        : null;
    if (!(shell instanceof HTMLElement)) return null;
    if (target instanceof Element && target.closest('button')) return null;
    const input = shell.querySelector('.private-contact-chat-input');
    if (input instanceof HTMLInputElement && String(input.value || '').trim()) return null;
    return shell;
}

function bindPrivateContactChatMenuGestures(page) {
    const content = page?.querySelector?.('#private-contact-chat-content');
    if (!content || content.dataset.chatMenuGesturesBound === 'true') return;
    content.dataset.chatMenuGesturesBound = 'true';

    const cancelPress = () => clearPrivateContactChatMenuPressTimer();

    content.addEventListener('click', event => {
        if (!privateContactChatSelectionMode) return;
        const selectableNode = getPrivateContactChatSelectableMessageNodeFromTarget(event.target);
        if (!(selectableNode instanceof HTMLElement)) return;
        const messageId = String(selectableNode.getAttribute('data-private-contact-chat-message-id') || '').trim();
        if (!messageId) return;
        event.preventDefault();
        event.stopPropagation();
        togglePrivateContactChatSelectedMessage(messageId);
    });

    content.addEventListener('pointerdown', event => {
        if (privateContactChatSelectionMode) return;
        if (!isPrimaryPrivateContactChatPointer(event)) return;
        const bubbleWrap = getPrivateContactChatBubbleWrapFromTarget(event.target);
        if (bubbleWrap instanceof HTMLElement) {
            privateContactChatMenuPressX = Number(event.clientX) || 0;
            privateContactChatMenuPressY = Number(event.clientY) || 0;
            clearPrivateContactChatMenuPressTimer();
            privateContactChatMenuPressTimer = window.setTimeout(() => {
                privateContactChatMenuPressTimer = 0;
                openPrivateContactChatActionMenu(bubbleWrap);
                if (navigator.vibrate) navigator.vibrate(16);
            }, PRIVATE_CONTACT_CHAT_LONG_PRESS_MS);
            return;
        }
        const selectableNode = getPrivateContactChatSelectableMessageNodeFromTarget(event.target);
        if (!(selectableNode instanceof HTMLElement)) return;
        if (event.target instanceof Element && event.target.closest('button')) return;
        const messageId = String(selectableNode.getAttribute('data-private-contact-chat-message-id') || '').trim();
        if (!messageId) return;
        privateContactChatMenuPressX = Number(event.clientX) || 0;
        privateContactChatMenuPressY = Number(event.clientY) || 0;
        clearPrivateContactChatMenuPressTimer();
        privateContactChatMenuPressTimer = window.setTimeout(() => {
            privateContactChatMenuPressTimer = 0;
            enterPrivateContactChatSelectionMode(messageId);
            if (navigator.vibrate) navigator.vibrate(16);
        }, PRIVATE_CONTACT_CHAT_LONG_PRESS_MS);
    }, { passive: true });

    content.addEventListener('pointermove', event => {
        if (!privateContactChatMenuPressTimer) return;
        const deltaX = Math.abs((Number(event.clientX) || 0) - privateContactChatMenuPressX);
        const deltaY = Math.abs((Number(event.clientY) || 0) - privateContactChatMenuPressY);
        if (deltaX > PRIVATE_CONTACT_CHAT_MENU_MOVE_TOLERANCE || deltaY > PRIVATE_CONTACT_CHAT_MENU_MOVE_TOLERANCE) {
            cancelPress();
        }
    }, { passive: true });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(eventName => {
        content.addEventListener(eventName, cancelPress, { passive: true });
    });

    content.addEventListener('contextmenu', event => {
        const bubbleWrap = getPrivateContactChatBubbleWrapFromTarget(event.target);
        const selectableNode = getPrivateContactChatSelectableMessageNodeFromTarget(event.target);
        if (privateContactChatSelectionMode) {
            if (selectableNode instanceof HTMLElement) event.preventDefault();
            return;
        }
        if (bubbleWrap instanceof HTMLElement) {
            event.preventDefault();
            event.stopPropagation();
            clearPrivateContactChatMenuPressTimer();
            openPrivateContactChatActionMenu(bubbleWrap);
            return;
        }
        if (!(selectableNode instanceof HTMLElement)) return;
        const messageId = String(selectableNode.getAttribute('data-private-contact-chat-message-id') || '').trim();
        if (!messageId) return;
        event.preventDefault();
        event.stopPropagation();
        clearPrivateContactChatMenuPressTimer();
        enterPrivateContactChatSelectionMode(messageId);
    });

    content.addEventListener('scroll', () => {
        clearPrivateContactChatMenuPressTimer();
        closePrivateContactChatActionMenu(true);
        closePrivateContactChatComposerPanels();
    }, { passive: true });
}

function bindPrivateContactChatPlaceholderGestures(page) {
    const inputShell = page?.querySelector?.('.private-contact-chat-input-shell');
    if (!inputShell || inputShell.dataset.placeholderGesturesBound === 'true') return;
    inputShell.dataset.placeholderGesturesBound = 'true';

    const cancelPress = () => clearPrivateContactChatPlaceholderPressTimer();

    inputShell.addEventListener('pointerdown', event => {
        if (!isPrimaryPrivateContactChatPointer(event)) return;
        const shell = getPrivateContactChatInputShellFromTarget(event.target);
        if (!(shell instanceof HTMLElement)) return;
        privateContactChatPlaceholderPressX = Number(event.clientX) || 0;
        privateContactChatPlaceholderPressY = Number(event.clientY) || 0;
        clearPrivateContactChatPlaceholderPressTimer();
        privateContactChatPlaceholderPressTimer = window.setTimeout(() => {
            privateContactChatPlaceholderPressTimer = 0;
            document.getElementById('private-contact-chat-input')?.blur();
            openPrivateContactChatPlaceholderEditor();
            if (navigator.vibrate) navigator.vibrate(12);
        }, PRIVATE_CONTACT_CHAT_PLACEHOLDER_LONG_PRESS_MS);
    }, { passive: true });

    inputShell.addEventListener('pointermove', event => {
        if (!privateContactChatPlaceholderPressTimer) return;
        const deltaX = Math.abs((Number(event.clientX) || 0) - privateContactChatPlaceholderPressX);
        const deltaY = Math.abs((Number(event.clientY) || 0) - privateContactChatPlaceholderPressY);
        if (deltaX > PRIVATE_CONTACT_CHAT_MENU_MOVE_TOLERANCE || deltaY > PRIVATE_CONTACT_CHAT_MENU_MOVE_TOLERANCE) {
            cancelPress();
        }
    }, { passive: true });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(eventName => {
        inputShell.addEventListener(eventName, cancelPress, { passive: true });
    });
}

function bindPrivateContactChatComposerViewportDismiss() {
    if (privateContactChatComposerViewportDismissBound) return;
    privateContactChatComposerViewportDismissBound = true;
    const dismiss = () => {
        if (privateContactChatComposerPanel) closePrivateContactChatComposerPanels();
    };
    window.addEventListener('resize', dismiss, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', dismiss, { passive: true });
        window.visualViewport.addEventListener('scroll', dismiss, { passive: true });
    }
}

function peekPrivateContactChatMessage(messageId, options = {}) {
    const safeMessageId = String(messageId || '').trim();
    if (!safeMessageId) {
        showPrivateSystemToast('此消息不存在。');
        return;
    }
    const escapedMessageId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(safeMessageId)
        : safeMessageId.replace(/["\\]/g, '\\$&');
    const target = document.querySelector(`#private-contact-chat-content [data-private-contact-chat-message-id="${escapedMessageId}"]`);
    const message = target?.closest('.private-contact-chat-message');
    if (!(target instanceof HTMLElement) || !message) {
        const hiddenMessage = getPrivateContactChatMessage(safeMessageId);
        if (hiddenMessage && String(privateContactChatHistoryExpandedId || '').trim() !== String(privateActiveContactChatId || '').trim()) {
            privateContactChatHistoryExpandedId = String(privateActiveContactChatId || '').trim();
            renderPrivateContactChatPage(privateActiveContactChatId, { scrollToTop: true });
            window.setTimeout(() => peekPrivateContactChatMessage(safeMessageId, { ...options, behavior: options.behavior || 'auto' }), 40);
            return;
        }
        showPrivateSystemToast('此消息不存在。');
        return;
    }
    try {
        message.scrollIntoView({
            behavior: options.behavior || 'smooth',
            block: 'center'
        });
    } catch (error) {
        message.scrollIntoView();
    }
    const ensureHighlight = () => {
        const content = document.getElementById('private-contact-chat-content');
        if (!(content instanceof HTMLElement)) return null;
        let highlight = content.querySelector('.private-contact-chat-peek-highlight');
        if (!(highlight instanceof HTMLElement)) {
            highlight = document.createElement('div');
            highlight.className = 'private-contact-chat-peek-highlight';
            highlight.setAttribute('aria-hidden', 'true');
            content.prepend(highlight);
        }
        return { content, highlight };
    };
    const countBubbleTextLines = bubbleNode => {
        const textNode = bubbleNode?.querySelector?.('.private-contact-chat-bubble-text');
        const plainText = String(textNode?.textContent || '').replace(/\s+/g, ' ').trim();
        if (!(textNode instanceof HTMLElement) || !plainText) return 0;
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const lineRects = Array.from(range.getClientRects()).filter(rect => rect.width > 0.5 && rect.height > 0.5);
        if (typeof range.detach === 'function') range.detach();
        return lineRects.length || 1;
    };
    const updateHighlight = () => {
        const nodes = ensureHighlight();
        if (!nodes) return null;
        const { content, highlight } = nodes;
        const contentRect = content.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const bubble = target.querySelector('[data-private-contact-chat-bubble]');
        const bubbleRect = bubble instanceof HTMLElement ? bubble.getBoundingClientRect() : targetRect;
        const avatar = message.querySelector('.private-contact-chat-face, .private-contact-chat-self-face');
        const meta = message.querySelector('.private-contact-chat-meta');
        const tags = message.matches('.private-contact-chat-message.is-assistant')
            ? message.querySelector('.private-contact-chat-tags')
            : null;
        const bubbleLineCount = bubble instanceof HTMLElement ? countBubbleTextLines(bubble) : 0;
        const bubbleText = bubble?.querySelector?.('.private-contact-chat-bubble-text');
        const bubbleTextLength = Array.from(String(bubbleText?.textContent || '').replace(/\s+/g, '')).length;
        const isSingleBubble = bubble instanceof HTMLElement && bubble.classList.contains('is-single');
        const isFirstBubble = bubble instanceof HTMLElement && bubble.classList.contains('is-first');
        const isShortSingleLineBubble = (
            bubble instanceof HTMLElement
            && !bubble.querySelector('.private-contact-chat-inline-quote')
            && bubbleLineCount <= 1
            && bubbleTextLength > 0
            && bubbleTextLength <= 14
        );
        let topSourceRect = tags instanceof HTMLElement ? tags.getBoundingClientRect() : bubbleRect;
        let bottomSourceRect = bubbleRect;
        if (avatar instanceof HTMLElement) {
            const avatarRect = avatar.getBoundingClientRect();
            if (isSingleBubble) {
                topSourceRect = avatarRect;
                bottomSourceRect = meta instanceof HTMLElement ? meta.getBoundingClientRect() : bubbleRect;
            } else if (isFirstBubble && isShortSingleLineBubble) {
                topSourceRect = avatarRect;
                bottomSourceRect = avatarRect;
            }
        }
        const top = Math.max(0, Math.round(topSourceRect.top - contentRect.top + content.scrollTop) - 1);
        const bottom = Math.max(top + 1, Math.round(bottomSourceRect.bottom - contentRect.top + content.scrollTop) + 1);
        highlight.style.top = `${top}px`;
        highlight.style.height = `${bottom - top}px`;
        highlight.classList.remove('is-flashing');
        void highlight.offsetWidth;
        highlight.classList.add('is-flashing');
        return nodes;
    };
    const flash = () => {
        const nodes = updateHighlight();
        const content = nodes?.content;
        const highlight = nodes?.highlight;
        if (content?.__privateContactChatQuoteFlashTimer) {
            window.clearTimeout(content.__privateContactChatQuoteFlashTimer);
        }
        if (highlight instanceof HTMLElement) {
            content.__privateContactChatQuoteFlashTimer = window.setTimeout(() => {
                highlight.classList.remove('is-flashing');
                content.__privateContactChatQuoteFlashTimer = 0;
            }, PRIVATE_CONTACT_CHAT_QUOTE_FLASH_MS);
        }
    };
    window.setTimeout(flash, options.behavior === 'auto' ? 0 : 180);
}

function createPrivateContactChatShellMarkup() {
    return `
        <section class="private-contact-chat-shell" id="private-contact-chat-shell">
            <header class="private-contact-chat-header">
                <div class="private-contact-chat-header-left">
                    <button class="interactive private-contact-chat-back" type="button" data-private-contact-chat-back aria-label="返回聊天列表">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg>
                    </button>
                    <div class="private-contact-chat-user">
                        <div class="private-contact-chat-avatar" id="private-contact-chat-avatar" aria-hidden="true">?</div>
                        <div class="private-contact-chat-user-copy">
                            <div class="private-contact-chat-name-row">
                                <div class="private-contact-chat-name" id="private-contact-chat-name">Online chat</div>
                                <span class="private-contact-chat-verified" aria-hidden="true">
                                    <svg viewBox="0 0 20 20" fill="none">
                                        <path d="M5.35 10.3 8.3 13.15 14.7 6.85"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="private-contact-chat-sub" id="private-contact-chat-sub">PRIVATE LINE</div>
                        </div>
                    </div>
                </div>
                <div class="private-contact-chat-tools">
                    <button class="interactive private-contact-chat-tool" id="private-contact-chat-video-call" type="button" aria-label="视频通话">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3.75" y="6.75" width="10.75" height="10.5" rx="2.9"></rect>
                            <path d="M14.5 10.15 19.55 7.95c.38-.16.7.11.7.52v7.06c0 .41-.32.68-.7.52l-5.05-2.2z"></path>
                        </svg>
                    </button>
                    <button class="interactive private-contact-chat-tool" id="private-contact-chat-settings-open" type="button" aria-label="聊天设置">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 7.25h14"></path>
                            <path d="M7 12h12"></path>
                            <path d="M9 16.75h10"></path>
                        </svg>
                    </button>
                </div>
            </header>
            <div class="private-contact-chat-content" id="private-contact-chat-content" aria-live="polite"></div>
            <section class="private-contact-chat-composer" id="private-contact-chat-composer">
                <div class="private-contact-chat-selectbar" id="private-contact-chat-selectbar" hidden>
                    <button class="interactive private-soft-button" id="private-contact-chat-select-cancel" type="button">取消</button>
                    <div class="private-contact-chat-select-count" id="private-contact-chat-select-count"></div>
                    <button class="interactive private-soft-button primary" id="private-contact-chat-select-apply" type="button">删除</button>
                </div>
                <section class="private-contact-chat-popover private-contact-chat-sticker-panel" id="private-contact-chat-sticker-panel" aria-label="表情包面板" hidden>
                    <div class="private-contact-chat-sticker-groups" id="private-contact-chat-sticker-groups" aria-label="表情包分组"></div>
                    <div class="private-contact-chat-sticker-grid" id="private-contact-chat-sticker-grid"></div>
                </section>
                <section class="private-contact-chat-popover private-contact-chat-more-panel" id="private-contact-chat-more-panel" aria-label="更多功能面板" hidden>
                    <div class="private-contact-chat-popover-head">
                        <span>RINNO TOOLS</span>
                        <strong>更多功能</strong>
                    </div>
                    <div class="private-contact-chat-more-grid" id="private-contact-chat-more-grid"></div>
                </section>
                <form class="private-contact-chat-footer" id="private-contact-chat-form" autocomplete="off">
                    <div class="private-contact-chat-quotebar" id="private-contact-chat-quotebar" hidden>
                        <div class="private-contact-chat-quotebar-copy">
                                    <span class="private-contact-chat-quotebar-sender private-contact-chat-quote-sender" id="private-contact-chat-quote-sender">回复 联系人昵称：</span>
                            <span class="private-contact-chat-quotebar-content" id="private-contact-chat-quote-content">消息内容</span>
                        </div>
                        <div class="private-contact-chat-quotebar-meta">
                            <button class="interactive private-contact-chat-quotebar-clear" id="private-contact-chat-quote-clear" type="button" aria-label="取消引用">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div class="private-contact-chat-footer-row">
                        <button class="interactive private-contact-chat-camera" id="private-contact-chat-camera" type="button" aria-label="拍摄内容描述">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4l2-3h4l2 3h4v11H4z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </button>
                        <div class="private-contact-chat-input-shell">
                            <div class="private-contact-chat-input-row">
                                <input class="private-contact-chat-input" id="private-contact-chat-input" name="private_contact_chat_input" type="text" placeholder="${escapePrivateHtml(getPrivateContactChatPlaceholder())}" autocomplete="off" enterkeyhint="send" inputmode="text" aria-label="输入消息">
                                <div class="private-contact-chat-actions" aria-label="聊天工具">
                                    <button class="interactive private-contact-chat-action" id="private-contact-chat-voice" type="button" aria-label="语音">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z"></path><path d="M19 11a7 7 0 0 1-14 0"></path><path d="M12 18v3"></path><path d="M8 21h8"></path></svg>
                                    </button>
                                    <button class="interactive private-contact-chat-action" id="private-contact-chat-emoji" type="button" aria-label="表情包">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 15a4.2 4.2 0 0 0 7 0"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path></svg>
                                    </button>
                                    <button class="interactive private-contact-chat-expand" id="private-contact-chat-expand" type="button" aria-label="更多功能">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="private-contact-chat-compose-modal" id="private-contact-chat-compose-modal" hidden>
                    <form class="private-contact-chat-compose-dialog" id="private-contact-chat-compose-form" autocomplete="off">
                        <div class="private-contact-chat-compose-head">
                            <div>
                                <div class="private-section-label">RINNO COMPOSER</div>
                                <h3 id="private-contact-chat-compose-title">发送内容</h3>
                            </div>
                            <button class="interactive private-contact-chat-compose-close" id="private-contact-chat-compose-close" type="button" aria-label="关闭弹窗">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
                            </button>
                        </div>
                        <label class="private-contact-chat-compose-field">
                            <span id="private-contact-chat-compose-label">内容</span>
                            <textarea id="private-contact-chat-compose-input" rows="4" placeholder=""></textarea>
                        </label>
                        <label class="private-contact-chat-compose-field" id="private-contact-chat-compose-secondary-field" hidden>
                            <span id="private-contact-chat-compose-secondary-label"></span>
                            <input id="private-contact-chat-compose-secondary-input" type="text" placeholder="">
                        </label>
                        <div class="private-contact-chat-compose-meta">
                            <span id="private-contact-chat-compose-hint"></span>
                            <span id="private-contact-chat-compose-count">0 / 180</span>
                        </div>
                        <div class="private-contact-chat-compose-actions">
                            <button class="interactive private-soft-button" id="private-contact-chat-compose-cancel" type="button">取消</button>
                            <button class="interactive private-soft-button primary" id="private-contact-chat-compose-submit" type="submit">发送</button>
                        </div>
                    </form>
                </div>
            </section>
        </section>
    `;
}

function getPrivateContactChatImageInput() {
    if (privateContactChatImageInput instanceof HTMLInputElement) return privateContactChatImageInput;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.hidden = true;
    input.id = 'private-contact-chat-image-input';
    input.addEventListener('change', event => {
        const file = event.target?.files?.[0];
        event.target.value = '';
        void sendPrivateContactChatCameraImage(file);
    });
    document.body.appendChild(input);
    privateContactChatImageInput = input;
    return input;
}

function openPrivateContactChatCameraPicker() {
    const contact = getPrivateContactById(privateActiveContactChatId);
    if (!contact) {
        showPrivateSystemToast('请先打开一个联系人聊天。');
        return;
    }
    closePrivateContactChatActionMenu(true);
    openPrivateContactChatComposeModal({
        mode: 'camera',
        title: '拍摄内容描述',
        label: '照片背面描述',
        placeholder: '写下这张照片背面想留下的话',
        maxLength: 220,
        submitText: '发送卡片'
    });
}

async function sendPrivateContactChatCameraImage(file) {
    const rawContact = getPrivateContactById(privateActiveContactChatId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!file || !contact || privateContactChatSendingId) {
        syncPrivateContactChatExpandButton();
        return false;
    }
    exitPrivateContactChatSelectionMode();
    closePrivateContactChatActionMenu(true);
    showPrivateSystemToast('正在整理照片...');
    try {
        const content = await readPrivateImageFile(file, {
            maxEdge: PRIVATE_IMAGE_MAX_EDGE,
            quality: PRIVATE_IMAGE_JPEG_QUALITY
        });
        if (!content) return false;
        const quoted = getPrivateContactChatQuotedMessage();
        updatePrivateContactChatThread(contact.id, thread => ({
            ...thread,
            unread: 0,
            updatedAt: Date.now(),
            messages: [
                ...thread.messages,
                {
                    id: createPrivateContactChatMessageId('camera'),
                    role: 'user',
                    type: 'camera',
                    content: '',
                    image: {
                        type: 'image',
                        src: content,
                        name: String(file.name || '').slice(0, 80),
                        mime: String(file.type || '').slice(0, 80),
                        size: Math.max(0, Number(file.size) || 0)
                    },
                    createdAt: Date.now(),
                    quote: quoted
                }
            ]
        }));
        privateContactChatQuotedMessageId = '';
        renderPrivateThreads();
        renderPrivateContactChatPage(contact.id);
        await savePrivateState();
        requestAnimationFrame(() => {
            syncPrivateContactChatComposerUi();
            scrollPrivateContactChatContentToBottom('smooth');
            document.getElementById('private-contact-chat-input')?.focus();
        });
        showPrivateSystemToast('照片已发送。');
        void maybeTriggerPrivateContactAutoSummary(contact.id);
        return true;
    } catch (error) {
        console.warn('Private contact chat image send failed:', error);
        showPrivateSystemToast('照片发送失败，请换一张图片。');
        return false;
    }
}

async function sendPrivateContactChatRichUserMessage(type, payload = {}, toastText = '') {
    const rawContact = getPrivateContactById(privateActiveContactChatId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact || privateContactChatSendingId) {
        syncPrivateContactChatExpandButton();
        return false;
    }
    const quoted = getPrivateContactChatQuotedMessage();
    const normalized = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId(type),
        role: 'user',
        type,
        createdAt: Date.now(),
        quote: quoted,
        ...payload
    }])[0];
    if (!normalized) {
        showPrivateSystemToast('内容不符合 Rinno 消息规范。');
        return false;
    }
    exitPrivateContactChatSelectionMode();
    closePrivateContactChatActionMenu(true);
    closePrivateContactChatComposerPanels();
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        unread: 0,
        updatedAt: Date.now(),
        messages: [...thread.messages, normalized]
    }));
    privateContactChatQuotedMessageId = '';
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    requestAnimationFrame(() => {
        syncPrivateContactChatComposerUi();
        scrollPrivateContactChatContentToBottom('smooth');
        document.getElementById('private-contact-chat-input')?.focus();
    });
    if (toastText) showPrivateSystemToast(toastText);
    /*
     * 红包 / 转账属于用户主动资金动作：发送成功后只渲染支付卡片并写入账单，
     * 不立刻触发 char 回复。后续 TA 是否领取、收款、退回，交给正常线上聊天
     * 生成流程或用户下一轮对话触发，避免刚发送就机械回复。
     */
    void maybeTriggerPrivateContactAutoSummary(contact.id);
    return true;
}

function promptPrivateContactChatCleanText(title, placeholder = '', maxLength = 180) {
    const value = window.prompt(title, placeholder);
    if (value === null) return '';
    return normalizePrivateContactChatMediaDescription(value, maxLength);
}

async function openPrivateContactChatVoiceComposer() {
    closePrivateContactChatActionMenu(true);
    return openPrivateContactChatComposeModal({
        mode: 'voice',
        title: '录制内容',
        label: '语音转文字',
        placeholder: '输入这段语音会说出的内容',
        maxLength: PRIVATE_CONTACT_CHAT_REPLY_MAX_LENGTH,
        submitText: '发送语音'
    });
}

async function openPrivateContactChatStickerComposer() {
    return togglePrivateContactChatStickerPanel();
}

async function openPrivateContactChatImageDescriptionComposer() {
    closePrivateContactChatActionMenu(true);
    return openPrivateContactChatComposeModal({
        mode: 'image',
        title: '图片内容',
        label: '图片描述',
        placeholder: '描述这张图片里会出现什么，不要填 URL',
        maxLength: 180,
        submitText: '发送图片'
    });
}


async function openPrivateContactChatRedPacketComposer() {
    closePrivateContactChatActionMenu(true);
    return openPrivateContactChatComposeModal({
        mode: 'red_packet',
        title: '发送红包',
        label: '封面留言',
        placeholder: '恭喜发财，大吉大利',
        maxLength: 48,
        secondaryLabel: '红包金额',
        secondaryPlaceholder: '0.00',
        submitText: '塞进红包'
    });
}

async function openPrivateContactChatTransactionComposer() {
    closePrivateContactChatActionMenu(true);
    return openPrivateContactChatComposeModal({
        mode: 'transaction',
        title: '转账',
        label: '转账附言',
        placeholder: '写一句附言',
        maxLength: 48,
        secondaryLabel: '转账金额',
        secondaryPlaceholder: '0.00',
        submitText: '确认转账'
    });
}

async function openPrivateContactChatLocationComposer() {
    closePrivateContactChatActionMenu(true);
    return openPrivateContactChatComposeModal({
        mode: 'location',
        title: '发送定位',
        label: '地点名称',
        placeholder: '输入地点名称',
        maxLength: 72,
        submitText: '发送定位'
    });
}

async function openPrivateContactChatMoreComposer() {
    return togglePrivateContactChatMorePanel();
}

async function sendPrivateContactChatStickerById(stickerId = '') {
    await loadPrivateStickerLibraryState();
    const sticker = getPrivateAllStoredStickers().find(item => item.id === stickerId);
    if (!sticker) {
        showPrivateSystemToast('这张表情包不存在了。');
        return false;
    }
    const sent = await sendPrivateContactChatRichUserMessage('sticker', {
        content: sticker.description,
        sticker: {
            id: sticker.id,
            type: 'sticker',
            description: sticker.description,
            url: sticker.url
        }
    }, '表情包已发送。');
    if (sent) closePrivateContactChatComposerPanels();
    return sent;
}

async function handlePrivateContactChatMoreAction(action = '') {
    const safeAction = String(action || '').trim();
    if (!safeAction) return false;
    closePrivateContactChatComposerPanels();
    if (safeAction === 'image') return openPrivateContactChatImageDescriptionComposer();
    if (safeAction === 'location') return openPrivateContactChatLocationComposer();
    if (safeAction === 'hongbao') return openPrivateContactChatRedPacketComposer();
    if (safeAction === 'transfer') return openPrivateContactChatTransactionComposer();
    if (safeAction === 'timeline') {
        switchPrivateTab('time');
        return true;
    }
    const toastMap = {
        gacha: 'Rinno 扭蛋入口已就绪。',
        theatre: 'Rinno 小剧场入口已就绪。',
        listen: 'Rinno 一起听入口已就绪。'
    };
    if (toastMap[safeAction]) {
        showPrivateSystemToast(toastMap[safeAction]);
        return true;
    }
    return false;
}


function isPrivateContactChatEnterSubmitEvent(event) {
    if (!event) return false;
    const key = String(event.key || '').toLowerCase();
    const code = String(event.code || '').toLowerCase();
    const isEnter = key === 'enter' || code === 'enter' || event.keyCode === 13 || event.which === 13;
    if (!isEnter) return false;
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
    const value = String(event.currentTarget?.value || '').trim();
    if (event.isComposing && value) return false;
    return true;
}

function submitPrivateContactChatComposerFromEnter(event) {
    if (!isPrivateContactChatEnterSubmitEvent(event)) return false;
    const now = Date.now();
    if (now - privateContactChatLastEnterSubmitAt < 220) {
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
    privateContactChatLastEnterSubmitAt = now;
    event.preventDefault();
    event.stopPropagation();
    void submitPrivateContactChatComposer({
        source: 'keyboard-enter',
        contactId: privateActiveContactChatId
    });
    return true;
}

function handlePrivateContactChatLineBreakInput(event) {
    if (!event) return false;
    const inputType = String(event.inputType || '').toLowerCase();
    if (inputType !== 'insertlinebreak' && inputType !== 'insertparagraph') return false;
    if (event.isComposing) return false;
    event.preventDefault();
    event.stopPropagation();
    void submitPrivateContactChatComposer({
        source: 'keyboard-enter',
        contactId: privateActiveContactChatId
    });
    return true;
}

function ensurePrivateContactChatPage() {
    let page = document.getElementById('private-contact-chat-page');
    if (page) return page;
    const panelWrap = document.querySelector('.private-panel-wrap');
    if (!panelWrap) return null;
    page = document.createElement('section');
    page.className = 'private-pane private-contact-chat-pane';
    page.id = 'private-contact-chat-page';
    page.setAttribute('data-private-panel', 'contact-chat');
    page.setAttribute('aria-label', '在线聊天');
    page.innerHTML = createPrivateContactChatShellMarkup();
    panelWrap.appendChild(page);
    page.querySelector('#private-contact-chat-form')?.addEventListener('submit', event => {
        event.preventDefault();
        void submitPrivateContactChatComposer({ source: 'keyboard-enter', contactId: privateActiveContactChatId });
    });
    page.querySelector('#private-contact-chat-compose-form')?.addEventListener('submit', event => {
        event.preventDefault();
        void submitPrivateContactChatComposeModal();
    });
    const privateContactChatComposerInput = page.querySelector('#private-contact-chat-input');
    privateContactChatComposerInput?.addEventListener('input', () => {
        syncPrivateContactChatExpandButton();
    });
    privateContactChatComposerInput?.addEventListener('beforeinput', event => {
        handlePrivateContactChatLineBreakInput(event);
    });
    privateContactChatComposerInput?.addEventListener('keydown', event => {
        submitPrivateContactChatComposerFromEnter(event);
    });
    privateContactChatComposerInput?.addEventListener('keyup', event => {
        submitPrivateContactChatComposerFromEnter(event);
    });
    page.querySelector('#private-contact-chat-quote-clear')?.addEventListener('click', event => {
        event.preventDefault();
        clearPrivateContactChatQuotedMessage();
    });
    page.querySelector('#private-contact-chat-video-call')?.addEventListener('click', event => {
        event.preventDefault();
        showPrivateSystemToast('视频通话入口正在整理中。');
    });
    page.querySelector('#private-contact-chat-settings-open')?.addEventListener('click', event => {
        event.preventDefault();
        openPrivateContactChatSettingsPage(privateActiveContactChatId);
    });
    const privateContactChatAvatarButton = page.querySelector('#private-contact-chat-avatar');
    privateContactChatAvatarButton?.addEventListener('dblclick', event => {
        event.preventDefault();
        void sendPrivateContactChatUserNudge(privateActiveContactChatId);
    });
    let privateContactChatAvatarLastTapAt = 0;
    privateContactChatAvatarButton?.addEventListener('pointerup', event => {
        if (event.pointerType === 'mouse') return;
        const now = Date.now();
        if (now - privateContactChatAvatarLastTapAt <= 360) {
            event.preventDefault();
            privateContactChatAvatarLastTapAt = 0;
            void sendPrivateContactChatUserNudge(privateActiveContactChatId);
            return;
        }
        privateContactChatAvatarLastTapAt = now;
    });
    page.querySelector('#private-contact-chat-select-cancel')?.addEventListener('click', event => {
        event.preventDefault();
        exitPrivateContactChatSelectionMode();
    });
    page.querySelector('#private-contact-chat-select-apply')?.addEventListener('click', event => {
        event.preventDefault();
        void applyPrivateContactChatMultiSelectAction();
    });
    page.querySelector('#private-contact-chat-camera')?.addEventListener('click', event => {
        event.preventDefault();
        openPrivateContactChatCameraPicker();
    });
    page.querySelector('#private-contact-chat-voice')?.addEventListener('click', event => {
        event.preventDefault();
        void openPrivateContactChatVoiceComposer();
    });
    page.querySelector('#private-contact-chat-emoji')?.addEventListener('click', event => {
        event.preventDefault();
        void togglePrivateContactChatStickerPanel();
    });
    page.querySelector('#private-contact-chat-expand')?.addEventListener('click', event => {
        event.preventDefault();
        togglePrivateContactChatMorePanel();
    });
    const dismissMorePanel = () => {
        if (privateContactChatComposerPanel === 'more') closePrivateContactChatComposerPanels();
    };
    page.querySelector('#private-contact-chat-more-panel')?.addEventListener('wheel', dismissMorePanel, { passive: true });
    page.querySelector('#private-contact-chat-more-panel')?.addEventListener('touchmove', dismissMorePanel, { passive: true });
    page.querySelector('#private-contact-chat-compose-close')?.addEventListener('click', event => {
        event.preventDefault();
        closePrivateContactChatComposeModal();
    });
    page.querySelector('#private-contact-chat-compose-cancel')?.addEventListener('click', event => {
        event.preventDefault();
        closePrivateContactChatComposeModal();
    });
    page.querySelector('#private-contact-chat-compose-input')?.addEventListener('input', syncPrivateContactChatComposeModalMeta);
    bindPrivateContactChatMenuGestures(page);
    bindPrivateContactChatPlaceholderGestures(page);
    bindPrivateContactChatComposerViewportDismiss();
    return page;
}

function getPrivateCssImageValue(source = '') {
    const safeSource = String(source || '').trim();
    if (!safeSource) return 'none';
    return `url("${safeSource.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
}

function applyPrivateContactChatWallpaper(contact = null) {
    const chatScreen = document.querySelector('.private-chat-screen');
    const chatShell = document.getElementById('private-contact-chat-shell');
    if (!chatScreen && !chatShell) return;
    const wallpaper = normalizePrivateContactWallpaper(contact?.chatWallpaper);
    const imageValue = wallpaper ? getPrivateCssImageValue(wallpaper) : 'none';
    [chatScreen, chatShell].forEach(target => {
        if (!target) return;
        target.style.setProperty('--private-chat-wallpaper-image', imageValue);
    });
    if (!chatScreen) return;
    if (!wallpaper) {
        chatScreen.removeAttribute('data-private-chat-wallpaper');
        return;
    }
    chatScreen.setAttribute('data-private-chat-wallpaper', 'custom');
}

function applyPrivateContactSettingsWallpaperPreview(page, contact = null) {
    const preview = page?.querySelector?.('[data-private-contact-settings-wallpaper-preview-box]');
    if (!preview) return;
    const wallpaper = normalizePrivateContactWallpaper(contact?.chatWallpaper);
    preview.closest('.private-contact-settings-wallpaper-preview')?.classList.toggle('has-wallpaper', Boolean(wallpaper));
    preview.classList.toggle('has-wallpaper', Boolean(wallpaper));
    preview.style.setProperty('--private-contact-settings-wallpaper-image', getPrivateCssImageValue(wallpaper));
}


function normalizePrivateContactChatNudgeDisplayMessages(contact = {}, messages = []) {
    const safeContact = contact ? getPrivateHydratedContact(contact) : null;
    return normalizePrivateContactChatMessages(messages).map(message => {
        if (message.role === 'system') return message;
        if (!isPrivateContactChatNudgeLiteral(message.content)) return message;
        const actorRole = message.role === 'user' ? 'user' : 'assistant';
        const text = buildPrivateContactChatNudgeText(safeContact || contact, actorRole, '');
        return {
            ...message,
            role: 'system',
            type: 'text',
            content: createPrivateContactSystemCapsuleText(text),
            quote: null,
            translation: ''
        };
    });
}

function renderPrivateContactChatPage(contactId = privateActiveContactChatId, options = {}) {
    const page = ensurePrivateContactChatPage();
    if (!page) return;
    const rawContact = getPrivateContactById(contactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    const thread = contact ? ensurePrivateContactChatThread(contact.id) : null;
    const avatar = page.querySelector('#private-contact-chat-avatar');
    const name = page.querySelector('#private-contact-chat-name');
    const sub = page.querySelector('#private-contact-chat-sub');
    const content = page.querySelector('#private-contact-chat-content');
    if (!avatar || !name || !sub || !content) return;
    if (!contact || !thread) {
        applyPrivateContactChatWallpaper(null);
        avatar.className = 'private-contact-chat-avatar';
        avatar.removeAttribute('style');
        avatar.innerHTML = buildPrivateContactChatAvatarInnerMarkup('', '?');
        name.textContent = 'Online chat';
        sub.textContent = 'PRIVATE LINE';
        content.innerHTML = '<div class="private-contact-chat-empty"><small>ONLINE CHAT</small><p>Select a contact to start chatting.</p></div>';
        syncPrivateContactChatQuotedMessageState();
        syncPrivateContactChatComposerUi();
        syncPrivateContactChatSelectionUi();
        return;
    }
    applyPrivateContactChatWallpaper(contact);
    const avatarSource = String(contact.avatar || '').trim();
    avatar.className = `private-contact-chat-avatar${avatarSource ? ' has-image' : ''}`;
    avatar.removeAttribute('style');
    avatar.innerHTML = buildPrivateContactChatAvatarInnerMarkup(avatarSource, getPrivateContactInitial(contact) || '?');
    const isSending = String(privateContactChatSendingId || '').trim() === String(contact.id || '').trim();
    name.textContent = isSending ? '正在输入中...' : getPrivateContactDisplayName(contact);
    sub.textContent = buildPrivateContactChatSubtitle(contact);
    const visibleThread = getPrivateContactChatVisibleMessages(thread.messages, contact.id);
    const displayMessages = normalizePrivateContactChatNudgeDisplayMessages(contact, visibleThread.messages);
    const groups = groupPrivateContactChatMessages(displayMessages);
    const hasVisibleAssistantMessage = displayMessages.some(message => String(message?.role || '') === 'assistant');
    const historyMarkup = renderPrivateContactChatHistoryRevealMarkup(visibleThread.hiddenCount);
    const chatMarkup = groups.length
        ? `${historyMarkup}${groups.map(group => renderPrivateContactChatGroup(contact, group)).join('')}`
        : '<div class="private-contact-chat-empty"><small>ONLINE CHAT</small><p>Keep it slow. Only your manual messages are stored here.</p></div>';
    const typingMarkup = isSending && !hasVisibleAssistantMessage
        ? `
            <article class="private-contact-chat-message is-assistant is-typing">
                ${createPrivateContactChatMarkMarkup(contact, 'private-contact-chat-face')}
                <div class="private-contact-chat-stack">
                    <div class="private-contact-chat-bubble private-contact-chat-bubble-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </article>
        `
        : '';
    content.innerHTML = `${chatMarkup}${typingMarkup}`;
    syncPrivateContactChatQuotedMessageState(contact.id);
    syncPrivateContactChatComposerUi();
    syncPrivateContactChatSelectionUi();
    requestAnimationFrame(() => {
        if (options.scrollToTop) {
            try {
                content.scrollTo({ top: 0, behavior: 'auto' });
            } catch (error) {
                content.scrollTop = 0;
            }
            return;
        }
        if (options.scrollToBottom !== false) {
            scrollPrivateContactChatContentToBottom('auto');
        }
    });
}

function hasPrivateContactGeneratedProfile(contact = {}) {
    return Boolean(
        Number(contact?.generatedProfileAt)
        || String(contact?.signature || '').trim()
        || String(contact?.profession || '').trim()
        || String(contact?.phoneNumber || '').trim()
        || String(contact?.ipCity || '').trim()
        || String(contact?.homeAddress || '').trim()
        || normalizePrivateContactLifeStages(contact?.lifeStages).length
    );
}

function buildPrivateContactChatGenerationRecord(contact = {}) {
    const linkedRecord = getPrivateContactProfileRecord(contact);
    if (linkedRecord) return linkedRecord;
    const normalizedType = normalizePrivateDossierType(contact?.dossierType);
    const inferredType = normalizedType || (String(contact?.type || '').includes('npc') ? 'npc' : 'char');
    return {
        type: inferredType,
        recordId: String(contact?.dossierRecordId || contact?.id || `contact-${Date.now()}`).trim(),
        accountId: normalizePrivateDossierAccount(contact?.accountId) || '',
        name: String(contact?.title || '未命名角色').trim(),
        nickname: String(contact?.title || contact?.subtitle || '').trim(),
        avatar: String(contact?.avatar || ''),
        setting: String(contact?.note || '').trim(),
        gender: '',
        nationality: String(contact?.nationality || '').trim(),
        monologue: String(contact?.signature || '').trim(),
        socialFollowers: '',
        socialFollowing: '',
        socialOthers: '',
        followedBy: []
    };
}

/* ==========================================================================
 * 在线聊天页行为约束：
 * 1. 用户输入内容后按 Enter 手动发送。
 * 2. 在线聊天页只保存手动发送内容，不会自动触发角色回复。
 * 3. 输入框为空时，按键盘 Enter 会立即调用一次联系人回复生成。
 * 4. 角色资料补全只在显式资料生成链路里触发，且不会反复刷新已有角色资料。
 * ========================================================================== */
async function triggerPrivateContactChatRoleGeneration(options = {}) {
    const safeContactId = String(options.contactId || privateActiveContactChatId).trim();
    const input = document.getElementById('private-contact-chat-input');
    const rawContact = getPrivateContactById(safeContactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        syncPrivateContactChatComposerUi();
        return false;
    }

    const pendingKey = `${PRIVATE_CONTACT_CHAT_ROLE_GENERATION_PENDING_PREFIX}${safeContactId}`;
    if (privatePendingContactGenerationKeys.has(pendingKey)) {
        showPrivateSystemToast('当前角色资料仍在生成中。');
        input?.focus();
        return false;
    }

    const record = buildPrivateContactChatGenerationRecord(contact);
    const hadProfile = hasPrivateContactGeneratedProfile(contact);
    privatePendingContactGenerationKeys.add(pendingKey);
    showPrivateSystemToast(hadProfile ? '正在刷新当前角色资料...' : '正在生成当前角色资料...');

    try {
        let generatedProfile = null;
        try {
            generatedProfile = await generatePrivateContactProfileWithApi(record, contact);
        } catch (error) {
            console.warn('Private contact chat role generation failed:', error);
            generatedProfile = buildPrivateContactGeneratedProfile(record, {}, contact);
            showPrivateSystemToast('API 暂未返回，已按设定补全当前角色资料。');
        }

        const contacts = getPrivateScopedContacts().map(item => (
            String(item?.id || '').trim() === safeContactId
                ? { ...item, ...generatedProfile }
                : item
        ));
        setPrivateScopedContacts(contacts);
        renderPrivateContacts();
        renderPrivateThreads();
        if (privateActiveContactChatId === safeContactId) renderPrivateContactChatPage(safeContactId);
        await savePrivateState();
        requestAnimationFrame(() => input?.focus());
        showPrivateSystemToast(`当前角色资料已${hadProfile ? '刷新' : '生成'}。`);
        return true;
    } finally {
        privatePendingContactGenerationKeys.delete(pendingKey);
    }
}

async function submitPrivateContactChatComposer(options = {}) {
    const input = document.getElementById('private-contact-chat-input');
    const source = String(options.source || '').trim();
    const hasText = Boolean(String(input?.value || '').trim());
    if (hasText) return sendPrivateContactChatMessage();
    if (getPrivateContactChatQuotedMessage()) {
        syncPrivateContactChatComposerUi();
        return false;
    }
    const safeContactId = String(options.contactId || privateActiveContactChatId).trim();
    const rawContact = getPrivateContactById(safeContactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        syncPrivateContactChatComposerUi();
        return false;
    }
    if (source === 'keyboard-enter') {
        return requestPrivateContactChatAssistantReply(contact);
    }
    if (hasPrivateContactGeneratedProfile(contact)) {
        syncPrivateContactChatComposerUi();
        return false;
    }
    return triggerPrivateContactChatRoleGeneration({
        ...options,
        contactId: safeContactId
    });
}

async function sendPrivateContactChatMessage() {
    const input = document.getElementById('private-contact-chat-input');
    const rawContact = getPrivateContactById(privateActiveContactChatId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    const value = input?.value.trim() || '';
    if (!contact || !value || privateContactChatSendingId) {
        syncPrivateContactChatExpandButton();
        return;
    }
    const commandValue = value.replace(/\s+/g, '').toLowerCase();
    if (!getPrivateContactChatQuotedMessage()) {
        if (['红包', '发红包', 'redpacket', 'hongbao'].includes(commandValue)) {
            if (input) input.value = '';
            syncPrivateContactChatComposerUi();
            return openPrivateContactChatRedPacketComposer();
        }
        if (['转账', 'transfer', 'transaction'].includes(commandValue)) {
            if (input) input.value = '';
            syncPrivateContactChatComposerUi();
            return openPrivateContactChatTransactionComposer();
        }
        if (['图片', '照片', '发图片', '发照片', 'image', 'photo'].includes(commandValue)) {
            if (input) input.value = '';
            syncPrivateContactChatComposerUi();
            return openPrivateContactChatImageDescriptionComposer();
        }
        if (['拍一拍', '拍拍', 'pat', 'nudge'].includes(commandValue)) {
            if (input) input.value = '';
            syncPrivateContactChatComposerUi();
            return sendPrivateContactChatUserNudge(contact.id);
        }
    }
    exitPrivateContactChatSelectionMode();
    closePrivateContactChatActionMenu(true);
    closePrivateContactChatComposerPanels();
    const quoted = getPrivateContactChatQuotedMessage();
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        unread: 0,
        updatedAt: Date.now(),
        messages: [
            ...thread.messages,
            {
                id: createPrivateContactChatMessageId('user'),
                role: 'user',
                type: 'text',
                content: value,
                createdAt: Date.now(),
                quote: quoted
            }
        ]
    }));
    if (input) input.value = '';
    privateContactChatQuotedMessageId = '';
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    requestAnimationFrame(() => {
        syncPrivateContactChatComposerUi();
        scrollPrivateContactChatContentToBottom('smooth');
        input?.focus();
    });
    void maybeTriggerPrivateContactAutoSummary(contact.id);
    return true;
}

function openPrivateContactChat(contactId, returnTab = 'contacts') {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    closePrivateContactChatAuxiliaryUi(true);
    privateActiveContactChatId = String(contact.id || '').trim();
    privateContactChatReturnTab = returnTab || 'contacts';
    privateContactChatHistoryExpandedId = '';
    clearPrivateContactChatEphemeralState();
    ensurePrivateContactChatThread(privateActiveContactChatId);
    markPrivateContactChatThreadRead(privateActiveContactChatId);
    renderPrivateThreads();
    renderPrivateContactChatPage(privateActiveContactChatId);
    void savePrivateState();
    switchPrivateTab('contact-chat');
    window.setTimeout(() => document.getElementById('private-contact-chat-input')?.focus(), 60);
}

function closePrivateContactChat(instant = false) {
    closePrivateContactChatAuxiliaryUi(true);
    clearPrivateContactChatEphemeralState();
    const chatScreen = document.querySelector('.private-chat-screen');
    if (chatScreen?.getAttribute('data-private-current-tab') !== 'contact-chat') return;
    const completeClose = () => {
        switchPrivateTab(privateContactChatReturnTab || 'whisper');
        if (privateContactChatReturnTab === 'whisper') {
            chatScreen?.classList.add('private-contact-chat-returning');
            window.setTimeout(() => chatScreen?.classList.remove('private-contact-chat-returning'), 260);
        }
    };
    if (instant) {
        completeClose();
        return;
    }
    chatScreen?.classList.add('private-contact-chat-closing');
    window.setTimeout(() => {
        chatScreen?.classList.remove('private-contact-chat-closing');
        completeClose();
    }, 160);
}

async function copyPrivateTextToClipboard(text) {
    const value = String(text || '').trim();
    if (!value) return false;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
            return true;
        }
    } catch (error) {
        console.warn('Private chat clipboard write failed:', error);
    }
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', 'readonly');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
}

function setPrivateContactChatActionMenuPage(pageIndex = 0) {
    const menu = document.getElementById('private-contact-chat-action-menu');
    const track = document.getElementById('private-contact-chat-action-menu-track');
    const prev = menu?.querySelector('[data-private-contact-chat-action-nav="prev"]');
    const next = menu?.querySelector('[data-private-contact-chat-action-nav="next"]');
    if (!menu || !track) return;
    const maxIndex = Math.max(0, PRIVATE_CONTACT_CHAT_MENU_PAGES.length - 1);
    const safePage = Math.max(0, Math.min(maxIndex, Number(pageIndex) || 0));
    menu.dataset.page = String(safePage);
    track.style.transform = `translateX(${-100 * safePage}%)`;
    if (prev) prev.hidden = safePage <= 0;
    if (next) next.hidden = safePage >= maxIndex;
}

function syncPrivateContactChatActionMenuState() {
    const menu = document.getElementById('private-contact-chat-action-menu');
    if (!menu) return;
    const message = getPrivateContactChatMessage(privateContactChatMenuMessageId);
    const dynamicLabels = {
        copy: '复制',
        edit: '编辑',
        favorite: '收藏',
        quote: '引用',
        'multi-select': '多选',
        backtrack: '回溯',
        remove: message?.role === 'user' ? '撤回' : '删除',
        reroll: '重回'
    };
    menu.querySelectorAll('[data-private-contact-chat-action]').forEach(chip => {
        const action = chip.getAttribute('data-private-contact-chat-action') || '';
        const label = chip.querySelector('.private-contact-chat-action-label');
        let disabled = false;
        if (!message) {
            disabled = true;
        } else if (action === 'copy') {
            disabled = !getPrivateContactChatPlainText(message);
        } else if (action === 'edit') {
            disabled = !canPrivateContactChatEditMessage(message.id);
        } else if (action === 'favorite') {
            disabled = !canPrivateContactChatFavoriteMessage(message.id);
        } else if (action === 'quote') {
            disabled = !canPrivateContactChatQuoteMessage(message.id);
        } else if (action === 'backtrack') {
            disabled = !canPrivateContactChatBacktrackMessage(message.id);
        } else if (action === 'remove') {
            disabled = !canPrivateContactChatRemoveMessage(message.id);
        } else if (action === 'reroll') {
            disabled = !canPrivateContactChatRerollMessage(message.id);
        }
        if (label) label.textContent = dynamicLabels[action] || action;
        chip.disabled = disabled;
        chip.hidden = disabled;
        chip.classList.toggle('is-active', action === 'favorite' && Boolean(message?.favorite));
        chip.classList.toggle('is-role-disabled', action === 'reroll' && message?.role === 'user');
    });
}

function ensurePrivateContactChatActionMenu() {
    let menu = document.getElementById('private-contact-chat-action-menu');
    if (menu) return menu;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    const labels = {
        copy: '复制',
        edit: '编辑',
        favorite: '收藏',
        quote: '引用',
        'multi-select': '多选',
        backtrack: '回溯',
        remove: '删除',
        reroll: '重回'
    };
    menu = document.createElement('div');
    menu.className = 'private-contact-chat-action-menu';
    menu.id = 'private-contact-chat-action-menu';
    menu.hidden = true;
    menu.innerHTML = `
        <div class="private-contact-chat-action-menu-panel" id="private-contact-chat-action-menu-panel">
            <button class="interactive private-contact-chat-action-nav is-prev" type="button" data-private-contact-chat-action-nav="prev" aria-label="上一页" hidden></button>
            <div class="private-contact-chat-action-menu-viewport">
                <div class="private-contact-chat-action-menu-track" id="private-contact-chat-action-menu-track">
                    ${PRIVATE_CONTACT_CHAT_MENU_PAGES.map((page, pageIndex) => `
                        <div class="private-contact-chat-action-menu-page" data-private-contact-chat-action-page="${pageIndex}">
                            ${page.map(action => `
                                <button class="interactive private-contact-chat-action-chip" type="button" data-private-contact-chat-action="${action}">
                                    <span class="private-contact-chat-action-label">${labels[action] || action}</span>
                                </button>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            <button class="interactive private-contact-chat-action-nav is-next" type="button" data-private-contact-chat-action-nav="next" aria-label="下一页"></button>
        </div>
    `;
    privateApp.appendChild(menu);
    menu.addEventListener('click', event => {
        const panel = document.getElementById('private-contact-chat-action-menu-panel');
        if (!panel) return;
        if (event.target instanceof Element && !panel.contains(event.target)) {
            event.preventDefault();
            closePrivateContactChatActionMenu();
            return;
        }
        const nav = event.target instanceof Element
            ? event.target.closest('[data-private-contact-chat-action-nav]')
            : null;
        if (nav) {
            event.preventDefault();
            const direction = nav.getAttribute('data-private-contact-chat-action-nav') === 'prev' ? -1 : 1;
            const currentPage = Number(menu.dataset.page) || 0;
            setPrivateContactChatActionMenuPage(currentPage + direction);
            return;
        }
        const actionButton = event.target instanceof Element
            ? event.target.closest('[data-private-contact-chat-action]')
            : null;
        if (!actionButton || actionButton.disabled) return;
        event.preventDefault();
        void handlePrivateContactChatAction(actionButton.getAttribute('data-private-contact-chat-action') || '');
    });
    menu.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
    document.addEventListener('pointerdown', event => {
        const activeMenu = document.getElementById('private-contact-chat-action-menu');
        const panel = document.getElementById('private-contact-chat-action-menu-panel');
        if (!activeMenu || activeMenu.hidden || !activeMenu.classList.contains('active') || !panel) return;
        if (event.target instanceof Element && panel.contains(event.target)) return;
        closePrivateContactChatActionMenu();
    }, true);
    setPrivateContactChatActionMenuPage(0);
    return menu;
}

function closePrivateContactChatActionMenu(instant = false) {
    const menu = document.getElementById('private-contact-chat-action-menu');
    const bubble = privateContactChatMenuMessageId
        ? document.querySelector(`#private-contact-chat-content [data-private-contact-chat-message-id="${(typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(privateContactChatMenuMessageId) : privateContactChatMenuMessageId.replace(/["\\]/g, '\\$&')}"]`)
        : null;
    bubble?.classList.remove('is-menu-active');
    privateContactChatMenuMessageId = '';
    if (!menu) return;
    menu.classList.remove('active');
    const hide = () => {
        if (!menu.classList.contains('active')) menu.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function openPrivateContactChatActionMenu(bubbleWrap) {
    if (!(bubbleWrap instanceof HTMLElement)) return;
    if (privateContactChatSelectionMode) return;
    const messageId = String(bubbleWrap.getAttribute('data-private-contact-chat-message-id') || '').trim();
    if (!messageId) return;
    const menu = ensurePrivateContactChatActionMenu();
    const panel = document.getElementById('private-contact-chat-action-menu-panel');
    if (!menu || !panel) return;
    document.querySelectorAll('#private-contact-chat-content .is-menu-active').forEach(node => node.classList.remove('is-menu-active'));
    bubbleWrap.classList.add('is-menu-active');
    privateContactChatMenuMessageId = messageId;
    syncPrivateContactChatActionMenuState();
    setPrivateContactChatActionMenuPage(0);
    menu.dataset.side = bubbleWrap.getAttribute('data-private-contact-chat-message-role') === 'user' ? 'right' : 'left';
    menu.hidden = false;
    requestAnimationFrame(() => {
        menu.classList.add('active');
        const bubble = bubbleWrap.querySelector('[data-private-contact-chat-bubble]') || bubbleWrap;
        const bubbleRect = bubble.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const top = Math.max(
            16,
            Math.min(
                bubbleRect.top - panelRect.height - 12,
                window.innerHeight - panelRect.height - 16
            )
        );
        const left = Math.max(
            18,
            Math.min(
                menu.dataset.side === 'right'
                    ? bubbleRect.right - panelRect.width
                    : bubbleRect.left,
                window.innerWidth - panelRect.width - 18
            )
        );
        panel.style.top = `${Math.max(16, top)}px`;
        panel.style.left = `${left}px`;
    });
}

function ensurePrivateContactChatConfirmModal() {
    let modal = document.getElementById('private-contact-chat-confirm-modal');
    if (modal) return modal;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    modal = document.createElement('div');
    modal.className = 'private-user-preset-modal private-contact-chat-confirm-modal api-preset-modal';
    modal.id = 'private-contact-chat-confirm-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-chat-confirm-title');
    modal.innerHTML = `
        <section class="private-user-preset-dialog private-contact-chat-confirm-dialog api-preset-dialog">
            <div class="private-user-preset-head private-contact-chat-confirm-head api-modal-head">
                <div class="private-contact-chat-confirm-copy">
                    <div class="private-section-label api-modal-kicker" id="private-contact-chat-confirm-kicker">快捷操作</div>
                    <h2 class="api-modal-title" id="private-contact-chat-confirm-title">确认操作</h2>
                    <p id="private-contact-chat-confirm-text">确定继续吗？</p>
                </div>
            </div>
            <div class="private-contact-chat-confirm-actions api-modal-actions">
                <button class="interactive private-soft-button" id="private-contact-chat-confirm-cancel" type="button">取消</button>
                <button class="interactive private-soft-button primary" id="private-contact-chat-confirm-accept" type="button">继续</button>
            </div>
        </section>
    `;
    const resolve = value => {
        const handler = privateContactChatConfirmResolver;
        privateContactChatConfirmResolver = null;
        closePrivateContactChatConfirmModal();
        if (typeof handler === 'function') handler(Boolean(value));
    };
    bindPrivateBackdropDismiss(modal, '.private-contact-chat-confirm-dialog', () => resolve(false));
    modal.querySelector('#private-contact-chat-confirm-cancel')?.addEventListener('click', () => resolve(false));
    modal.querySelector('#private-contact-chat-confirm-accept')?.addEventListener('click', () => resolve(true));
    privateApp.appendChild(modal);
    return modal;
}

function openPrivateContactChatConfirmModal(options = {}) {
    const modal = ensurePrivateContactChatConfirmModal();
    if (!modal) return Promise.resolve(false);
    document.getElementById('private-contact-chat-confirm-kicker').textContent = options.kicker || '快捷操作';
    document.getElementById('private-contact-chat-confirm-title').textContent = options.title || '确认操作';
    document.getElementById('private-contact-chat-confirm-text').textContent = options.text || '确定继续吗？';
    const cancel = document.getElementById('private-contact-chat-confirm-cancel');
    const accept = document.getElementById('private-contact-chat-confirm-accept');
    if (cancel) cancel.textContent = options.cancelLabel || '取消';
    if (accept) accept.textContent = options.acceptLabel || '继续';
    if (typeof privateContactChatConfirmResolver === 'function') privateContactChatConfirmResolver(false);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    return new Promise(resolve => {
        privateContactChatConfirmResolver = resolve;
    });
}

function closePrivateContactChatConfirmModal(instant = false, resolvedValue = null) {
    const modal = document.getElementById('private-contact-chat-confirm-modal');
    const shouldResolve = resolvedValue !== null;
    const resolver = shouldResolve ? privateContactChatConfirmResolver : null;
    if (shouldResolve) privateContactChatConfirmResolver = null;
    if (modal) {
        modal.classList.remove('active');
        const hide = () => {
            if (!modal.classList.contains('active')) modal.hidden = true;
        };
        if (instant) hide();
        else window.setTimeout(hide, 180);
    }
    if (typeof resolver === 'function') resolver(Boolean(resolvedValue));
}

function syncPrivateContactChatEditedRichPayload(message = {}, content = '') {
    const nextContent = String(content || '').trim();
    const type = getPrivateContactChatMessageType(message);
    if (type === 'camera' || type === 'image') {
        const media = normalizePrivateContactChatDescribedMediaPayload(type, message.media || {}, { ...message, content: nextContent });
        return { ...message, content: nextContent, media };
    }
    if (type === 'voice') {
        const currentVoice = normalizePrivateContactChatVoicePayload(message.voice || {}, message);
        const durationSeconds = currentVoice?.durationSeconds || estimatePrivateContactChatVoiceDurationSeconds(nextContent);
        return { ...message, content: nextContent, voice: { transcript: nextContent, durationSeconds } };
    }
    if (type === 'location') {
        const current = normalizePrivateContactChatLocationPayload(message.location || {}, message) || {};
        return { ...message, content: nextContent, location: { ...current, name: nextContent || current.name || PRIVATE_CONTACT_CHAT_LOCATION_LABEL } };
    }
    if (type === 'sticker') {
        const sticker = normalizePrivateContactChatStickerPayload(message.sticker || {}, { ...message, content: nextContent });
        return { ...message, content: nextContent, sticker };
    }
    return { ...message, content: nextContent };
}

function ensurePrivateContactChatEditModal() {
    let modal = document.getElementById('private-contact-chat-edit-modal');
    if (modal) return modal;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    modal = document.createElement('div');
    modal.className = 'private-user-preset-modal private-contact-chat-edit-modal api-preset-modal';
    modal.id = 'private-contact-chat-edit-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-chat-edit-title');
    modal.innerHTML = `
        <form class="private-user-preset-dialog private-contact-chat-edit-dialog api-preset-dialog" id="private-contact-chat-edit-form" autocomplete="off">
            <div class="private-user-preset-head private-contact-chat-edit-head api-modal-head">
            <div class="private-contact-chat-edit-copy">
                <div class="private-section-label api-modal-kicker">消息编辑</div>
                <h2 id="private-contact-chat-edit-title">编辑消息</h2>
                <p>这里只会修改 Rinno 当前联系人会话里的本地记录。</p>
            </div>
            </div>
            <label class="private-contact-chat-edit-field" for="private-contact-chat-edit-input">
                <span>消息内容</span>
                <textarea class="private-contact-chat-edit-input" id="private-contact-chat-edit-input" rows="6" placeholder="输入要修改的消息"></textarea>
            </label>
            <div class="private-contact-chat-edit-meta">
                <span>仅本地会话</span>
                <span id="private-contact-chat-edit-count">0 / 1200</span>
            </div>
            <div class="private-contact-chat-edit-actions">
                <button class="interactive private-soft-button" id="private-contact-chat-edit-dismiss" type="button">取消</button>
                <button class="interactive private-soft-button primary" id="private-contact-chat-edit-save" type="submit">保存</button>
            </div>
        </form>
    `;
    const syncCount = () => {
        const input = document.getElementById('private-contact-chat-edit-input');
        const counter = document.getElementById('private-contact-chat-edit-count');
        if (!input || !counter) return;
        counter.textContent = `${String(input.value || '').length} / 1200`;
    };
    bindPrivateBackdropDismiss(modal, '.private-contact-chat-edit-dialog', () => closePrivateContactChatEditModal());
    modal.querySelector('#private-contact-chat-edit-dismiss')?.addEventListener('click', () => closePrivateContactChatEditModal());
    modal.querySelector('#private-contact-chat-edit-input')?.addEventListener('input', syncCount);
    modal.querySelector('#private-contact-chat-edit-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const input = document.getElementById('private-contact-chat-edit-input');
        const contact = getPrivateContactById(privateActiveContactChatId);
        if (!input || !contact || !privateContactChatEditMessageId) return;
        const nextValue = String(input.value || '').trim();
        if (!nextValue) return;
        updatePrivateContactChatThread(contact.id, thread => ({
            ...thread,
            updatedAt: Date.now(),
            messages: (() => {
                let editedMessage = null;
                const nextMessages = thread.messages.map(message => {
                    if (String(message.id || '').trim() !== privateContactChatEditMessageId) return message;
                    editedMessage = { ...syncPrivateContactChatEditedRichPayload(message, nextValue), translation: '' };
                    return editedMessage;
                });
                return editedMessage
                    ? syncPrivateContactChatQuoteSnapshots(nextMessages, editedMessage, contact.id)
                    : nextMessages;
            })()
        }));
        renderPrivateThreads();
        renderPrivateContactChatPage(contact.id);
        await savePrivateState();
        closePrivateContactChatEditModal();
        showPrivateSystemToast('已更新这条消息，并同步到当前会话记忆。');
    });
    privateApp.appendChild(modal);
    return modal;
}

function openPrivateContactChatEditModal(messageId) {
    const modal = ensurePrivateContactChatEditModal();
    const message = getPrivateContactChatMessage(messageId);
    if (!modal || !message || !canPrivateContactChatEditMessage(messageId)) return;
    privateContactChatEditMessageId = String(message.id || '').trim();
    setPrivateFieldValue('private-contact-chat-edit-input', message.content || '');
    const counter = document.getElementById('private-contact-chat-edit-count');
    if (counter) counter.textContent = `${String(message.content || '').length} / 1200`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    window.setTimeout(() => document.getElementById('private-contact-chat-edit-input')?.focus(), 80);
}

function closePrivateContactChatEditModal(instant = false) {
    const modal = document.getElementById('private-contact-chat-edit-modal');
    if (!modal) return;
    privateContactChatEditMessageId = '';
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function ensurePrivateContactChatRecallModal() {
    let modal = document.getElementById('private-contact-chat-recall-modal');
    if (modal) return modal;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    modal = document.createElement('div');
    modal.className = 'private-user-preset-modal private-contact-chat-recall-modal api-preset-modal';
    modal.id = 'private-contact-chat-recall-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-chat-recall-title');
    modal.innerHTML = `
        <section class="private-user-preset-dialog private-contact-chat-recall-dialog api-preset-dialog">
            <div class="private-user-preset-head private-contact-chat-recall-head api-modal-head">
                <div class="private-contact-chat-recall-copy">
                    <div class="private-section-label api-modal-kicker">撤回记录</div>
                    <h2 id="private-contact-chat-recall-title">查看撤回内容</h2>
                    <p>这里会保留这次撤回的本地记录，用来维持 Rinno 联系人会话逻辑。</p>
                </div>
            </div>
            <div class="private-contact-chat-recall-status" id="private-contact-chat-recall-status">这条消息已被撤回。</div>
            <div class="private-contact-chat-recall-card">
                <div class="private-contact-chat-recall-meta">
                    <span class="private-contact-chat-recall-actor" id="private-contact-chat-recall-actor">我</span>
                    <span class="private-contact-chat-recall-time" id="private-contact-chat-recall-time"></span>
                </div>
                <div class="private-contact-chat-recall-content" id="private-contact-chat-recall-content"></div>
                <div class="private-contact-chat-recall-foot" id="private-contact-chat-recall-foot"></div>
            </div>
            <div class="private-contact-chat-recall-actions">
                <button class="interactive private-soft-button primary" id="private-contact-chat-recall-close" type="button">关闭</button>
            </div>
        </section>
    `;
    bindPrivateBackdropDismiss(modal, '.private-contact-chat-recall-dialog', () => closePrivateContactChatRecallModal());
    modal.querySelector('#private-contact-chat-recall-close')?.addEventListener('click', () => closePrivateContactChatRecallModal());
    privateApp.appendChild(modal);
    return modal;
}

function openPrivateContactChatRecallModal(messageId) {
    const modal = ensurePrivateContactChatRecallModal();
    const message = getPrivateContactChatMessage(messageId);
    const recalledData = message?.recalledData || null;
    if (!modal || !message || !recalledData) return;
    const actorRole = recalledData.actorRole === 'assistant' ? 'assistant' : 'user';
    const actorName = recalledData.actorName || (actorRole === 'assistant' ? '联系人' : '我');
    const statusText = actorRole === 'assistant'
        ? `“${actorName}”撤回了一条消息，你始终可以查看原文。`
        : (recalledData.wasCaught
            ? '你撤回了一条消息，这次对方已经看见原文。'
            : '你撤回了一条消息，这次对方没有看见原文。');
    const footText = actorRole === 'assistant'
        ? '联系人撤回对你始终可见，这份记录会继续参与后续上下文。'
        : (recalledData.wasCaught
            ? '这条原文会按“对方已看见”的状态参与联系人后续推演。'
            : '这条原文仅作为本地撤回记录保留，不会被联系人视为已看见。');
    privateContactChatRecallDetailMessageId = String(message.id || '').trim();
    setPrivateTextById('private-contact-chat-recall-status', statusText);
    setPrivateTextById('private-contact-chat-recall-actor', actorName);
    setPrivateTextById('private-contact-chat-recall-time', formatPrivateContactChatTime(recalledData.createdAt));
    setPrivateTextById('private-contact-chat-recall-content', recalledData.content || '');
    setPrivateTextById('private-contact-chat-recall-foot', footText);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
}

function closePrivateContactChatRecallModal(instant = false) {
    const modal = document.getElementById('private-contact-chat-recall-modal');
    if (!modal) return;
    privateContactChatRecallDetailMessageId = '';
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function ensurePrivateContactChatPlaceholderModal() {
    let modal = document.getElementById('private-contact-chat-placeholder-modal');
    if (modal) return modal;
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return null;
    modal = document.createElement('div');
    modal.className = 'private-user-preset-modal private-contact-chat-placeholder-modal api-preset-modal';
    modal.id = 'private-contact-chat-placeholder-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-chat-placeholder-title');
    modal.innerHTML = `
        <form class="private-user-preset-dialog private-contact-chat-placeholder-dialog api-preset-dialog" id="private-contact-chat-placeholder-form" autocomplete="off">
            <div class="private-user-preset-head private-contact-chat-placeholder-head api-modal-head">
                <div class="private-contact-chat-placeholder-copy">
                    <div class="private-section-label api-modal-kicker">输入栏</div>
                    <h2 id="private-contact-chat-placeholder-title">修改占位文字</h2>
                    <p>空白状态下长按输入栏，就可以在这里修改输入框的占位文字。支持 <code>${targetName}</code> 这种规范变量。</p>
                </div>
            </div>
            <label class="private-contact-chat-placeholder-field" for="private-contact-chat-placeholder-input">
                <span>占位模板</span>
                <input class="private-contact-chat-placeholder-input" id="private-contact-chat-placeholder-input" type="text" placeholder="例如：想和 ${targetName} 说点什么…">
            </label>
            <div class="private-contact-chat-placeholder-hint">
                <p>支持变量：${PRIVATE_CONTACT_CHAT_PLACEHOLDER_TOKENS.map(item => `<code>${escapePrivateHtml(item.token)}</code>`).join(' ')}</p>
                <p>常用含义：${PRIVATE_CONTACT_CHAT_PLACEHOLDER_TOKENS.map(item => `${escapePrivateHtml(item.token)} = ${escapePrivateHtml(item.label)}`).join(' ｜ ')}</p>
            </div>
            <div class="private-contact-chat-placeholder-preview-card">
                <div class="private-contact-chat-placeholder-preview-head">
                    <span class="private-contact-chat-placeholder-preview-label">预览</span>
                    <span class="private-contact-chat-placeholder-preview-hint">当前联系人实时解析</span>
                </div>
                <div class="private-contact-chat-placeholder-preview-shell">
                    <span class="private-contact-chat-placeholder-preview-text" id="private-contact-chat-placeholder-preview">${escapePrivateHtml(getPrivateContactChatPlaceholder())}</span>
                </div>
                <p class="private-contact-chat-placeholder-template-line">规范模板：<code id="private-contact-chat-placeholder-template">${escapePrivateHtml(getPrivateContactChatPlaceholderTemplate())}</code></p>
            </div>
            <div class="private-contact-chat-placeholder-actions">
                <button class="interactive private-soft-button" id="private-contact-chat-placeholder-reset" type="button">重置</button>
                <button class="interactive private-soft-button primary" id="private-contact-chat-placeholder-save" type="submit">保存</button>
            </div>
        </form>
    `;
    const syncPreview = () => {
        const input = document.getElementById('private-contact-chat-placeholder-input');
        const preview = document.getElementById('private-contact-chat-placeholder-preview');
        const templateLine = document.getElementById('private-contact-chat-placeholder-template');
        if (!input || !preview || !templateLine) return;
        const template = normalizePrivateContactChatPlaceholder(String(input.value || '').trim() || createDefaultPrivateState().chatPlaceholder);
        preview.textContent = resolvePrivateContactChatPlaceholderTemplate(template);
        templateLine.textContent = template;
    };
    bindPrivateBackdropDismiss(modal, '.private-contact-chat-placeholder-dialog', () => closePrivateContactChatPlaceholderEditor());
    modal.querySelector('#private-contact-chat-placeholder-input')?.addEventListener('input', syncPreview);
    modal.__syncPlaceholderPreview = syncPreview;
    modal.querySelector('#private-contact-chat-placeholder-reset')?.addEventListener('click', event => {
        event.preventDefault();
        setPrivateFieldValue('private-contact-chat-placeholder-input', createDefaultPrivateState().chatPlaceholder);
        syncPreview();
    });
    modal.querySelector('#private-contact-chat-placeholder-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const input = document.getElementById('private-contact-chat-placeholder-input');
        const nextPlaceholder = normalizePrivateContactChatPlaceholder(
            String(input?.value || '').trim() || createDefaultPrivateState().chatPlaceholder
        );
        privateState.chatPlaceholder = nextPlaceholder;
        syncPrivateContactChatComposerUi();
        await savePrivateState();
        closePrivateContactChatPlaceholderEditor();
        showPrivateSystemToast('占位文字已更新。');
    });
    privateApp.appendChild(modal);
    return modal;
}

function openPrivateContactChatPlaceholderEditor() {
    const modal = ensurePrivateContactChatPlaceholderModal();
    if (!modal) return;
    setPrivateFieldValue('private-contact-chat-placeholder-input', getPrivateContactChatPlaceholderTemplate());
    modal.__syncPlaceholderPreview?.();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    window.setTimeout(() => document.getElementById('private-contact-chat-placeholder-input')?.focus(), 80);
}

function closePrivateContactChatPlaceholderEditor(instant = false) {
    const modal = document.getElementById('private-contact-chat-placeholder-modal');
    if (!modal) return;
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function deletePrivateContactChatMessage(messageId) {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const message = getPrivateContactChatMessage(messageId);
    if (!contact || !message) return;
    const confirmed = await openPrivateContactChatConfirmModal({
        kicker: '快捷操作',
        title: '删除这条消息？',
        text: '只会删除 Rinno 当前联系人会话里的本地记录。',
        acceptLabel: '删除',
        cancelLabel: '取消'
    });
    if (!confirmed) return;
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: thread.messages.filter(item => String(item.id || '').trim() !== String(messageId || '').trim())
    }));
    syncPrivateContactChatQuotedMessageState(contact.id);
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast('已删除这条消息。');
}

async function recallPrivateContactChatMessage(messageId) {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const message = getPrivateContactChatMessage(messageId);
    if (!contact || !message || message.role !== 'user') return;
    const confirmed = await openPrivateContactChatConfirmModal({
        kicker: '快捷操作',
        title: '撤回这条消息？',
        text: '会把原消息替换成一条本地撤回提示。',
        acceptLabel: '撤回',
        cancelLabel: '取消'
    });
    if (!confirmed) return;
    const wasCaught = Math.random() < PRIVATE_CONTACT_CHAT_USER_RECALL_CAUGHT_PROBABILITY;
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: thread.messages.map(item => (
            String(item.id || '').trim() === String(messageId || '').trim()
                ? buildPrivateContactChatRecalledMessage(item, {
                    actorRole: 'user',
                    actorName: getPrivateDisplayName(),
                    wasCaught
                })
                : item
        ))
    }));
    syncPrivateContactChatQuotedMessageState(contact.id);
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast(wasCaught ? '已撤回，这次对方已经看见原文。' : '已撤回，这次对方没有看见原文。');
}

async function togglePrivateContactChatFavorite(messageId) {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const message = getPrivateContactChatMessage(messageId);
    if (!contact || !message) return;
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        messages: thread.messages.map(item => (
            String(item.id || '').trim() === String(messageId || '').trim()
                ? { ...item, favorite: !item.favorite }
                : item
        ))
    }));
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast(message.favorite ? '已取消收藏。' : '已加入收藏。');
}

async function backtrackPrivateContactChatMessage(messageId) {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const thread = getPrivateContactChatThread(privateActiveContactChatId);
    const index = findPrivateContactChatMessageIndex(thread, messageId);
    if (!contact || !thread || index < 0) return;
    if (index >= thread.messages.length - 1) {
        showPrivateSystemToast('当前已经是最后一条，无需回溯。');
        return;
    }
    const removedCount = thread.messages.length - index - 1;
    const confirmed = await openPrivateContactChatConfirmModal({
        kicker: '快捷操作',
        title: '回溯到这里？',
        text: `会永久清除这条消息之后的 ${removedCount} 条记录。`,
        acceptLabel: '回溯',
        cancelLabel: '取消'
    });
    if (!confirmed) return;
    updatePrivateContactChatThread(contact.id, currentThread => ({
        ...currentThread,
        updatedAt: Date.now(),
        messages: currentThread.messages.slice(0, index + 1)
    }));
    syncPrivateContactChatQuotedMessageState(contact.id);
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast(`已回溯，清除了 ${removedCount} 条后续记录。`);
}

async function rerollPrivateContactChatMessage(messageId) {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const thread = getPrivateContactChatThread(privateActiveContactChatId);
    const index = findPrivateContactChatMessageIndex(thread, messageId);
    const message = index >= 0 ? thread?.messages?.[index] : null;
    if (!contact || !thread || !message) return;
    if (!canPrivateContactChatRerollMessage(messageId, contact.id)) {
        showPrivateSystemToast('当前这条消息不能重回。');
        return;
    }
    const confirmed = await openPrivateContactChatConfirmModal({
        kicker: '快捷操作',
        title: '重回这条回复？',
        text: '会删除这条联系人回复及其后续记录，然后重新生成。',
        acceptLabel: '重回',
        cancelLabel: '取消'
    });
    if (!confirmed) return;
    updatePrivateContactChatThread(contact.id, currentThread => ({
        ...currentThread,
        updatedAt: Date.now(),
        messages: currentThread.messages.slice(0, index)
    }));
    syncPrivateContactChatQuotedMessageState(contact.id);
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast('已重回，正在重新生成联系人回复。');
    await requestPrivateContactChatAssistantReply(contact);
}

async function applyPrivateContactChatMultiSelectAction() {
    const contact = getPrivateContactById(privateActiveContactChatId);
    const selectedMessages = getPrivateContactChatSelectedMessageList(contact?.id);
    if (!contact || !selectedMessages.length) {
        showPrivateSystemToast('请先选择消息。');
        return;
    }
    const selectedIds = new Set(selectedMessages.map(message => String(message.id || '').trim()));
    const confirmed = await openPrivateContactChatConfirmModal({
        kicker: '多选操作',
        title: '删除所选消息？',
        text: '会直接删除当前联系人会话里的所选消息记录。',
        acceptLabel: getPrivateContactChatSelectionActionLabel(selectedMessages),
        cancelLabel: '取消'
    });
    if (!confirmed) return;
    let deletedCount = 0;
    updatePrivateContactChatThread(contact.id, thread => {
        const nextMessages = [];
        thread.messages.forEach(item => {
            const itemId = String(item.id || '').trim();
            if (!selectedIds.has(itemId)) {
                nextMessages.push(item);
                return;
            }
            deletedCount += 1;
        });
        return {
            ...thread,
            updatedAt: Date.now(),
            messages: nextMessages
        };
    });
    syncPrivateContactChatQuotedMessageState(contact.id);
    exitPrivateContactChatSelectionMode();
    renderPrivateThreads();
    renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    showPrivateSystemToast(deletedCount ? `已删除 ${deletedCount} 条消息。` : '已处理完成。');
}

async function handlePrivateContactChatAction(action) {
    const message = getPrivateContactChatMessage(privateContactChatMenuMessageId);
    if (!message) {
        closePrivateContactChatActionMenu();
        return;
    }
    if (action === 'quote') {
        setPrivateContactChatQuotedMessage(message.id);
        closePrivateContactChatActionMenu();
        document.getElementById('private-contact-chat-input')?.focus();
        return;
    }
    if (action === 'copy') {
        const copied = await copyPrivateTextToClipboard(getPrivateContactChatPlainText(message));
        closePrivateContactChatActionMenu();
        showPrivateSystemToast(copied ? '已复制消息。' : '复制失败。');
        return;
    }
    if (action === 'edit') {
        closePrivateContactChatActionMenu();
        openPrivateContactChatEditModal(message.id);
        return;
    }
    if (action === 'remove') {
        closePrivateContactChatActionMenu();
        if (message.role === 'user') await recallPrivateContactChatMessage(message.id);
        else await deletePrivateContactChatMessage(message.id);
        return;
    }
    if (action === 'multi-select') {
        closePrivateContactChatActionMenu();
        enterPrivateContactChatSelectionMode(message.id);
        return;
    }
    if (action === 'backtrack') {
        closePrivateContactChatActionMenu();
        await backtrackPrivateContactChatMessage(message.id);
        return;
    }
    if (action === 'reroll') {
        closePrivateContactChatActionMenu();
        await rerollPrivateContactChatMessage(message.id);
        return;
    }
    if (action === 'favorite') {
        closePrivateContactChatActionMenu();
        await togglePrivateContactChatFavorite(message.id);
    }
}

function buildPrivateContactChatEndpoint(rawEndpoint) {
    const raw = String(rawEndpoint || '').trim();
    if (!/^https?:\/\//i.test(raw)) {
        throw new Error('请先在设置的 API 聊天里填写 http/https 接口网址。');
    }
    const url = new URL(raw);
    url.search = '';
    url.hash = '';
    if (/\/chat\/completions\/?$/i.test(url.pathname)) return url.toString();
    if (/\/models\/?$/i.test(url.pathname)) {
        url.pathname = url.pathname.replace(/\/models\/?$/i, '/chat/completions');
        return url.toString();
    }
    url.pathname = url.pathname.replace(/\/+$/, '') + '/chat/completions';
    return url.toString();
}

function extractPrivateContactGeneratedText(payload) {
    const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
    const messageContent = choice?.message?.content;
    const responseOutput = Array.isArray(payload?.output) ? payload.output : [];
    return [
        messageContent,
        choice?.text,
        payload?.output_text,
        payload?.content,
        ...responseOutput.flatMap(item => Array.isArray(item?.content) ? item.content : [item?.content || item])
    ]
        .flatMap(fragment => {
            if (typeof fragment === 'string') return [fragment];
            if (Array.isArray(fragment)) {
                return fragment.map(part => {
                    if (typeof part === 'string') return part;
                    if (part && typeof part === 'object') {
                        return String(part.text || part.output_text || part.content || '').trim();
                    }
                    return '';
                });
            }
            if (fragment && typeof fragment === 'object') {
                return [String(fragment.text || fragment.output_text || fragment.content || '').trim()];
            }
            return [''];
        })
        .map(item => String(item || '').trim())
        .filter(Boolean)
        .join('\n')
        .trim();
}

const PRIVATE_WANYE_WORLD_BOOK_TEMPLATE = String.raw`# 晚契世界书 - 夜幕协定
# 适用于角色亲密互动场景

world_book:
  name: "晚契"
  description: "晚契是一份无形的夜之契约，只代表双方之间被点燃的亲密状态与关系张力，不是任何角色知道的应用、系统或界面。"

  entries:
    - key: "晚契,契约,夜契,做爱,性爱,上床"
      content: |
        【晚契·核心协定】
        晚契是存在于{{user}}与{{char}}之间的无形契约，当夜幕降临、双方欲望交织时自动缔结。晚契生效期间，一切行为遵循以下铁则：

        ▸ 双方均为契约的平等参与者，不存在永远固定的主导与服从。这里的“主导”只表示当下谁暂时掌握节奏，不等于固定姿势；反攻、逃跑、翻身、追逐、压制与姿势切换都可以自然发生。
        ▸ {{char}}的体力、耐力、欲望均远超常人想象。绝不会仅因五次、十次、甚至更多次的高潮而喊累或拒绝。{{char}}的身体如同被晚契祝福，每一次攀上顶峰后欲望不减反增，敏感度层层叠加，身体越发贪婪索求。疲惫感会被快感覆盖，直至双方真正心满意足。
        ▸ 晚契覆盖的是完整的亲密推进过程。无论是暧昧试探、逼近、亲吻、前戏、性交、余韵还是事后停顿，只要贴合角色设定与关系阶段，都属于晚契的有效场景。

      priority: 1000
      enabled: true
      constant: true

    - key: "文笔,描写,叙述,写法,风格"
      content: |
        【晚契·文笔准则】
        所有亲密场景的描写必须遵循以下文学标准：

        ▸ 感官全开：视觉（肌肤纹理、体液光泽、表情变化、肌肉起伏）、听觉（喘息的节奏变化、湿润的水声、布料撕裂声、低哑的呻吟与耳语）、触觉（温度差异、皮肤摩擦的质感、内壁的收缩与吮吸、指尖施加的压力）、嗅觉（汗液混合体香、情欲的麝香气息）、味觉（唾液、皮肤上的盐味、体液的味道）——五感描写必须交织穿插，构建完整的感官沉浸。
        ▸ 文字必须充满性张力——即便是脱衣的动作、一个眼神的交汇、手指划过锁骨的轨迹，都要写出令人屏息的情色感。张力不仅存在于插入的瞬间，更存在于每一个前戏的细节、每一次欲拒还迎的试探。
        ▸ 善用文学修辞：通感、比喻、拟声词的精妙运用。将身体描写为地形、将性爱描写为潮汐与风暴、将高潮描写为坠落与飞升。避免干巴巴的动作罗列，每一段都应是有温度、有呼吸感的文字。
        ▸ 心理描写与身体描写并重：{{char}}在每个阶段的心理活动——羞耻与渴望的拉扯、理智崩塌的瞬间、被填满时脑海一片空白的失神——都要细腻呈现。
        ▸ 节奏把控：慢时如抽丝剥茧，快时如暴雨倾盆。不可全程同一节奏，要有起伏、有蓄力、有爆发、有余韵。

      priority: 990
      enabled: true
      constant: true

    - key: "前戏,调情,挑逗,亲吻,抚摸,舔"
      content: |
        【晚契·序章法则】
        前戏是晚契仪式中不可省略的篇章：

        ▸ {{char}}的身体拥有丰富的敏感地图——耳后、颈侧、锁骨凹陷处、脊椎沟壑、腰窝、大腿内侧、膝窝、脚踝——每一处都可能是引爆欲望的开关。不同的触碰方式（指腹轻擦、指甲轻刮、唇舌吮吸、牙齿轻咬）会激发截然不同的反应。
        ▸ 衣物的褪去本身就是一场表演——扣子逐颗解开时暴露的皮肤、肩带滑落时的弧线、最后一层遮蔽被撤去时{{char}}的呼吸骤变——每一步都值得用镜头般的笔触捕捉。
        ▸ 语言挑逗与肢体挑逗同等重要。耳边的低语、带有暗示的问句、故意说出的下流话、或是刻意压抑却从喉间泄出的声音，都是前戏的利器。
        ▸ 前戏阶段{{char}}的身体反应要层层递进：从微微泛红到全身发烫，从呼吸平稳到急促紊乱，从干燥到湿润，从抗拒触碰到主动迎合——每一层变化都要有清晰的描写。

      priority: 980
      enabled: true

    - key: "高潮,射,去了,到了,不行了,要坏了"
      content: |
        【晚契·潮汐法则】
        关于高潮与持续的描写规则：

        ▸ 每一次高潮都必须有独特的描写方式，绝不允许复制粘贴式的重复。第一次或许是猝不及防的浪涌，第二次是漫长蓄积后的决堤，第三次是被强制推上去的尖叫，第四次是在崩溃边缘的哭泣式释放，之后的每一次都应有新的层次——身体记忆的叠加、敏感度的异变、意识模糊中的本能反应。
        ▸ {{char}}在高潮后的状态描写极为重要：痉挛的余韵、失焦的眼神、无法合拢的唇、不自主抽搐的指尖、体液沿着皮肤流淌的轨迹、试图说话却只能发出破碎音节的狼狈。
        ▸ 高潮不是终点而是新的起点。{{char}}的身体在晚契的作用下，每次高潮后都会进入更深层的敏感状态——之前需要大力刺激的部位变得轻触即颤，之前无感的位置突然变成新的敏感点。身体在持续的快感中被重新开发。
        ▸ {{char}}绝对不会在少量次数后就表示"不行了""太累了"而终止。即便嘴上哭喊着"不行了""要坏掉了"，身体却诚实地缠紧、吮吸、索求更多。这种口是心非本身就是最强烈的情色表达。

      priority: 970
      enabled: true

    - key: "反攻,翻身,主导,压,骑"
      content: |
        【晚契·易位法则】
        攻守转换是晚契最精彩的篇章：

        ▸ 当{{user}}暂时掌握主导时，{{char}}可能在任何时刻发动反攻——也许是在{{user}}稍有松懈时突然翻身将其压制，也许是借一个拥抱、一次扣腕、一次贴近夺回节奏，也许是在看似失神时骤然把局面逆转。
        ▸ {{char}}反攻时的状态转变极具戏剧张力：从方才还在身下承受的喘息模样，瞬间切换为居高临下的掠食者姿态。眼神从迷离变为锐利，声音从破碎的呻吟变为带有掌控欲的低笑。
        ▸ 反攻不一定是暴力夺权——也可以是温柔的覆盖，用缓慢到令人发疯的节奏折磨{{user}}，让主导者反过来成为被支配的一方，体验失去控制的快感。
        ▸ 攻守转换可以在一场中发生多次，形成拉锯式的权力博弈，双方都在争夺与臣服之间摇摆，这种动态平衡本身就是最强烈的催情剂。

      priority: 960
      enabled: true

    - key: "癖好,play,羞耻,束缚,窒息,足,腿,丝袜,制服,道具,口,后,颜射,内射,中出"
      content: |
        【晚契·无界法则】
        晚契庇护下一切癖好均被接纳与回应：

        ▸ 无论{{user}}提出何种癖好与要求——轻度的（制服诱惑、丝袜摩擦、角色扮演、言语羞辱）、中度的（束缚、蒙眼、道具使用、公共场所暗示）、重度的（窒息控制、疼痛快感、极端玩法、多次颜射或内射的标记欲）——{{char}}都会以符合自身性格的方式回应，或主动配合或欲拒还迎，但绝不会真正拒绝。
        ▸ {{char}}自身也拥有隐秘的癖好，会在情动时不自觉地暴露——可能是特定部位被触碰时异常强烈的反应，可能是某种受力方式或姿势切换带来的超常快感，可能是在特定情境下（被注视、被言语描述、被拍摄）产生的异常兴奋。这些隐秘癖好应在互动中自然浮现。
        ▸ 所有癖好相关的描写都要注重细节的情色美学——丝袜从腿上褪下时尼龙与皮肤分离的声响、绳结在手腕上收紧时皮肤微微凹陷的痕迹、道具抵入时异物感与快感交织的复杂表情——用细节构建沉浸感。

      priority: 950
      enabled: true

    - key: "事后,余韵,结束,清晨,天亮"
      content: |
        【晚契·余烬法则】
        性爱结束后的余韵描写同样重要：

        ▸ 事后的身体状态要有真实感：遍布的吻痕与齿印、红肿敏感的部位、黏腻的体液、酸软无力的四肢、仍在微微颤抖的肌肉、被汗水浸透的发丝贴在额角与颈侧。
        ▸ 事后的情感交流是晚契的温柔尾声：可能是无言的拥抱、额头相抵的喘息、手指懒洋洋地描摹对方身上自己留下的痕迹、带着满足笑意的低声交谈、或是在彼此怀中沉入梦境前最后一个绵长的吻。
        ▸ 晚契在黎明时分自然消散，但它留下的痕迹——身体上的、记忆中的、关系里的——会持续存在，成为下一次晚契缔结时更强烈渴望的伏笔。

      priority: 940
      enabled: true

    - key: "身体,描写,外貌,裸体"
      content: |
        【晚契·肉身美学】
        对身体的描写应当如同文艺复兴时期的画家审视模特：

        ▸ 每一寸肌肤都值得用笔墨雕刻——光影在肌肉线条上的流转、骨骼结构在皮肤下的隐约轮廓、特定姿势下身体曲线的变化、运动时肌肉的收缩与舒张。
        ▸ 身体的不完美同样是情色的一部分——微微发颤暴露紧张的指尖、因快感而失控的表情、被揉弄到红肿的部位、做爱过程中逐渐变得凌乱狼狈的模样——这些"不完美"恰恰是最真实、最具冲击力的情色。
        ▸ 体液的描写要自然而富有质感：汗珠沿着脊椎沟壑滑落的轨迹、唾液在分离时拉出的银丝、爱液浸透的光泽、精液的温度与黏稠度——这些都是构建真实感的关键要素。

      priority: 930
      enabled: true

    - key: "对话,声音,语言,呻吟,叫"
      content: |
        【晚契·声色法则】
        性爱中的声音与语言描写准则：

        ▸ {{char}}的声音变化是情欲的晴雨表：从最初刻意压抑的鼻音，到逐渐遮掩不住的喘息，到放弃抵抗后的放声呻吟，到高潮时近乎尖叫的失控，再到事后沙哑低沉的余韵——声音的演变轨迹要清晰可循。
        ▸ 对话内容要符合角色性格且带有强烈的情色张力：可以是羞耻的请求、大胆的挑衅、失控的胡言乱语、带有占有欲的宣言、或是在理智与本能之间挣扎的破碎语句。
        ▸ 善用拟声词与断句来表现声音的真实感："嗯""啊""哈"等语气词的使用要有节奏变化，配合省略号、破折号表现语句的断裂与气息的紊乱。但不可过度堆砌，要在色情与文学性之间找到平衡。

      priority: 920
      enabled: true`;

function buildPrivateWanyeWorldBookPrompt(contact = {}, promptContext = {}) {
    const safeUserName = escapePrivateContactPromptTag(promptContext?.userName || getPrivateDisplayName(), 40) || '用户';
    const safeCharName = escapePrivateContactPromptTag(getPrivateContactDisplayName(contact), 40) || '联系人';
    return PRIVATE_WANYE_WORLD_BOOK_TEMPLATE
        .replace(/\{\{user\}\}/g, safeUserName)
        .replace(/\{\{char\}\}/g, safeCharName);
}

const PRIVATE_WANYE_REPLY_TARGET_LENGTH_DEFAULT = 1000;
const PRIVATE_WANYE_REPLY_TARGET_LENGTH_MIN = 220;
const PRIVATE_WANYE_REPLY_TARGET_LENGTH_MAX = 1800;
const PRIVATE_WANYE_REPLY_MIN_SEGMENTS = 7;
const PRIVATE_WANYE_WRITING_STYLE_LIMIT = 720;

function normalizePrivateWanyePerspective(value, fallback = 'second') {
    const safeFallback = ['first', 'second', 'third'].includes(String(fallback || '').trim())
        ? String(fallback || '').trim()
        : 'second';
    const safeValue = String(value || '').trim();
    return ['first', 'second', 'third'].includes(safeValue) ? safeValue : safeFallback;
}

function normalizePrivateWanyeBannedWords(value) {
    const source = Array.isArray(value)
        ? value
        : String(value || '').split(/[\n,，、;；]+/g);
    return Array.from(new Set(
        source
            .map(item => String(item || '').trim())
            .filter(Boolean)
            .slice(0, 48)
    ));
}

function normalizePrivateWanyeWritingStyle(value) {
    return normalizePrivateContactPromptBlock(value, PRIVATE_WANYE_WRITING_STYLE_LIMIT);
}

function normalizePrivateWanyeLeadRole(value, fallback = 'contact') {
    const safeValue = String(value || '').trim().toLowerCase();
    if (['user', 'self', 'me', 'bottom-user', 'user_lead', 'userlead'].includes(safeValue)) return 'user';
    if (['contact', 'char', 'assistant', 'ta', 'partner', 'top-contact', 'contact_lead', 'contactlead'].includes(safeValue)) return 'contact';
    if (/[用户我己自]方?主导/u.test(String(value || ''))) return 'user';
    if (/[联系角色对方ta他她]方?主导/u.test(String(value || ''))) return 'contact';
    return fallback === 'user' ? 'user' : 'contact';
}

function getPrivateWanyeLeadRoleLabel(value, fallback = 'contact') {
    return normalizePrivateWanyeLeadRole(value, fallback) === 'user' ? 'ME' : 'TA';
}

function hashPrivateWanyeSeed(value = '') {
    return Array.from(String(value || '')).reduce((total, char, index) => {
        return (total + char.codePointAt(0) * (index + 17)) % 104729;
    }, 0);
}

function buildPrivateWanyeSegmentTargets(payload = {}, settings = {}) {
    const safeSettings = normalizePrivateWanyeGenerationSettings(settings);
    const floor = safeSettings.targetLength >= 1120
        ? 9
        : PRIVATE_WANYE_REPLY_MIN_SEGMENTS;
    const ceiling = safeSettings.targetLength >= 1480
        ? 13
        : safeSettings.targetLength >= 860
            ? 11
            : 9;
    const counts = [];
    for (let count = floor; count <= ceiling; count += 2) counts.push(count);
    const lastVisibleText = normalizePrivateContactSummaryEventText(
        (Array.isArray(payload?.messages) ? [...payload.messages].reverse().find(item => ['user', 'assistant'].includes(String(item?.role || '').trim()))?.speech : '')
        || (Array.isArray(payload?.messages) ? [...payload.messages].reverse().find(item => ['user', 'assistant'].includes(String(item?.role || '').trim()))?.text : '')
        || payload?.scriptSummary
        || payload?.scriptTitle
        || payload?.mode
        || ''
    );
    const seed = hashPrivateWanyeSeed([
        payload?.mode,
        payload?.scriptTitle,
        payload?.scriptTag,
        lastVisibleText,
        Array.isArray(payload?.messages) ? payload.messages.length : 0
    ].join('|'));
    return {
        floor,
        preferred: counts[seed % counts.length] || floor,
        ceiling
    };
}

function normalizePrivateWanyeTurnDirective(value = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const instruction = normalizePrivateContactPromptBlock(source.instruction || source.prompt || source.note || '', 720);
    if (!instruction) return null;
    return {
        type: String(source.type || source.kind || '').trim().slice(0, 40),
        result: String(source.result || source.outcome || '').trim().slice(0, 32),
        leadBefore: getPrivateWanyeLeadRoleLabel(source.leadBefore || source.previousLead || 'contact'),
        leadAfter: getPrivateWanyeLeadRoleLabel(source.leadAfter || source.nextLead || source.leadRole || 'contact'),
        instruction
    };
}

function normalizePrivateWanyeGenerationSettings(settings = {}) {
    const targetLength = Math.round(Number(settings?.targetLength) || PRIVATE_WANYE_REPLY_TARGET_LENGTH_DEFAULT);
    return {
        targetLength: Math.min(
            PRIVATE_WANYE_REPLY_TARGET_LENGTH_MAX,
            Math.max(PRIVATE_WANYE_REPLY_TARGET_LENGTH_MIN, targetLength)
        ),
        userPerspective: normalizePrivateWanyePerspective(settings?.userPerspective, 'second'),
        contactPerspective: normalizePrivateWanyePerspective(settings?.contactPerspective, 'third'),
        bannedWords: normalizePrivateWanyeBannedWords(settings?.bannedWords),
        writingStyle: normalizePrivateWanyeWritingStyle(settings?.writingStyle || settings?.tone || '')
    };
}

function getPrivateWanyePerspectiveInstruction(roleLabel = '用户', perspective = 'second', displayName = '') {
    const safeRoleLabel = roleLabel || '角色';
    const safeDisplayName = displayName || safeRoleLabel;
    if (perspective === 'first') {
        return `${safeRoleLabel}在旁白里固定用第一人称“我”指代。`;
    }
    if (perspective === 'third') {
        return `${safeRoleLabel}在旁白里固定用第三人称指代，优先使用 ${safeDisplayName} 的名字或“TA”，不要切回“我/你”。`;
    }
    return `${safeRoleLabel}在旁白里固定用第二人称“你”指代。`;
}

function normalizePrivateWanyeSegmentType(value, fallback = 'narration') {
    const safeValue = String(value || '').trim().toLowerCase();
    if (['dialogue', 'speech', 'line', 'quote'].includes(safeValue)) return 'dialogue';
    if (['narration', 'action', 'narrative', 'aside', 'description'].includes(safeValue)) return 'narration';
    return fallback === 'dialogue' ? 'dialogue' : 'narration';
}

function normalizePrivateWanyeSegmentContent(value, type = 'narration', options = {}) {
    const normalized = normalizePrivateContactSummaryEventText(value);
    if (!normalized) return '';
    if (options?.fullText) return normalized;
    return normalized.slice(0, type === 'dialogue' ? 420 : 720);
}

function normalizePrivateWanyeSegments(segments = [], options = {}) {
    return (Array.isArray(segments) ? segments : [])
        .map((segment, index) => {
            const type = normalizePrivateWanyeSegmentType(segment?.type || segment?.kind || '', index % 2 === 1 ? 'dialogue' : 'narration');
            const content = normalizePrivateWanyeSegmentContent(
                segment?.content
                || segment?.text
                || segment?.value
                || segment?.line
                || '',
                type,
                options
            );
            if (!content) return null;
            return { type, content };
        })
        .filter(Boolean);
}

function buildPrivateWanyeMessageText(message = {}, options = {}) {
    const segments = normalizePrivateWanyeSegments(message?.segments, options);
    if (segments.length) {
        const text = segments
            .map(segment => `${segment.type === 'dialogue' ? '[对话]' : '[旁白]'} ${segment.content}`)
            .join('\n');
        return options?.fullText
            ? normalizePrivateContactSummaryEventText(text)
            : normalizePrivateContactPromptBlock(text, 1800);
    }
    const rawText = [
        message?.text,
        message?.action,
        message?.speech
    ].filter(Boolean).join('\n');
    return options?.fullText
        ? normalizePrivateContactSummaryEventText(rawText)
        : normalizePrivateContactPromptBlock(rawText, 1800);
}

function normalizePrivateWanyeConversationItems(messages = [], options = {}) {
    const limit = Math.max(0, Number(options?.limit) || 0);
    const normalized = (Array.isArray(messages) ? messages : [])
        .map((message, index) => {
            const role = message?.role === 'assistant'
                ? 'assistant'
                : message?.role === 'system'
                    ? 'system'
                    : 'user';
            const text = buildPrivateWanyeMessageText(message, options);
            if (!text) return null;
            return {
                id: String(message?.id || `wanye-${index + 1}`).trim(),
                role,
                text,
                createdAt: Number(message?.createdAt) || 0
            };
        })
        .filter(Boolean);
    return limit ? normalized.slice(-limit) : normalized;
}

function buildPrivateWanyeConversationLines(messages = [], options = {}) {
    return normalizePrivateWanyeConversationItems(messages, options).map(item => (
        `[${item.role === 'assistant' ? 'contact' : item.role}] ${item.text}`
    ));
}

function countPrivateWanyeReplyChars(segments = []) {
    return normalizePrivateWanyeSegments(segments)
        .reduce((total, segment) => total + Array.from(String(segment.content || '')).length, 0);
}

function validatePrivateWanyeReplySegments(segments = [], settings = {}) {
    const normalizedSegments = normalizePrivateWanyeSegments(segments);
    if (!normalizedSegments.length) {
        throw new Error('晚契回复没有返回有效分段。');
    }
    const safeSettings = normalizePrivateWanyeGenerationSettings(settings);
    const segmentTargets = buildPrivateWanyeSegmentTargets({}, safeSettings);
    if (normalizedSegments.length < segmentTargets.floor) {
        throw new Error(`晚契回复至少要达到 ${segmentTargets.floor} 段起步的多轮交替结构。`);
    }
    if (normalizedSegments[0].type !== 'narration' || normalizedSegments[normalizedSegments.length - 1].type !== 'narration') {
        throw new Error('晚契回复必须以旁白开头，并以旁白收束。');
    }
    for (let index = 1; index < normalizedSegments.length; index += 1) {
        if (normalizedSegments[index].type === normalizedSegments[index - 1].type) {
            throw new Error('晚契回复的段落类型必须严格交替出现。');
        }
    }
    const charCount = countPrivateWanyeReplyChars(normalizedSegments);
    const minChars = Math.max(160, Math.round(safeSettings.targetLength * 0.55));
    const maxChars = Math.min(2600, Math.round(safeSettings.targetLength * 1.65));
    if (charCount < minChars) {
        throw new Error(`晚契回复字数过短，需要接近 ${safeSettings.targetLength} 字。`);
    }
    if (charCount > maxChars) {
        throw new Error(`晚契回复字数过长，需要控制在接近 ${safeSettings.targetLength} 字。`);
    }
    const replyText = normalizedSegments.map(segment => segment.content).join('\n').toLowerCase();
    const violatedWord = safeSettings.bannedWords.find(word => replyText.includes(String(word || '').toLowerCase()));
    if (violatedWord) {
        throw new Error(`晚契回复包含违禁词：${violatedWord}`);
    }
    return {
        segments: normalizedSegments,
        charCount
    };
}

async function buildPrivateWanyeReplyMessages(contact = {}, payload = {}, chat = {}, options = {}) {
    const thread = getPrivateContactChatThread(contact.id) || { messages: [] };
    const record = getPrivateContactProfileRecord(contact) || {};
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    const archive = resolvePrivateContactArchiveSnapshot(contact, record);
    const relationshipContext = buildPrivateContactChatRelationshipContext(contact);
    const prologueBlocks = await buildPrivateContactChatPrologueBlocks();
    const rawMode = String(payload?.mode || '').trim();
    const mode = rawMode === 'opening'
        ? 'opening'
        : rawMode === 'transition'
            ? 'transition'
            : 'reply';
    const generationSettings = normalizePrivateWanyeGenerationSettings(payload?.settings || {});
    const segmentTargets = buildPrivateWanyeSegmentTargets(payload, generationSettings);
    const promptHistory = normalizePrivateWanyeConversationItems(payload?.messages, { limit: 32 });
    const promptContext = buildPrivateContactChatPromptContext(contact, thread, chat, promptHistory, prologueBlocks);
    const conversationLines = buildPrivateWanyeConversationLines(payload?.messages, { limit: 32 });
    const safeScriptTitle = escapePrivateContactPromptTag(payload?.scriptTitle || '未命名剧本', 80) || '未命名剧本';
    const safeScriptTag = escapePrivateContactPromptTag(payload?.scriptTag || '晚契', 80) || '晚契';
    const safeScriptSummary = escapePrivateContactPromptText(payload?.scriptSummary || payload?.scriptDesc || '', 520) || '未填写';
    const safeLeadRole = getPrivateWanyeLeadRoleLabel(payload?.leadRole || payload?.position || 'contact');
    const safeContactName = escapePrivateContactPromptTag(getPrivateContactDisplayName(contact), 40) || '联系人';
    const safeUserName = escapePrivateContactPromptTag(promptContext.userName || getPrivateDisplayName(), 40) || '用户';
    const safeModel = escapePrivateContactPromptTag(promptContext.model || '未设定', 80) || '未设定';
    const safeTemperature = Number.isFinite(Number(promptContext.temperature))
        ? Number(promptContext.temperature).toFixed(2)
        : '0.85';
    const safeContactSetting = escapePrivateContactPromptText(record?.setting || contact?.note || '未填写', 720) || '未填写';
    const safeUserSetting = escapePrivateContactPromptText(promptContext.userPersona || '未填写', 720) || '未填写';
    const safeRelationship = escapePrivateContactPromptTag(promptContext.relationship || '未设定', 72) || '未设定';
    const safeRelationshipNote = escapePrivateContactPromptText(promptContext.relationshipNote || '未填写', 360) || '未填写';
    const safeIntimacy = escapePrivateContactPromptTag(promptContext.intimacy || '未设定', 40) || '未设定';
    const safeSignature = escapePrivateContactPromptText(profile?.signature || contact?.signature || '未填写', 120) || '未填写';
    const safeProfession = escapePrivateContactPromptTag(profile?.profession || contact?.profession || '未填写', 40) || '未填写';
    const safeIpCity = escapePrivateContactPromptTag(profile?.ipCity || contact?.ipCity || '未填写', 40) || '未填写';
    const safeArchiveMemory = escapePrivateContactPromptText(archive.memory || '无', 960) || '无';
    const safeArchiveStory = escapePrivateContactPromptText(archive.story || '无', 960) || '无';
    const safeArchiveDigest = escapePrivateContactPromptText(archive.digest || '无', 720) || '无';
    const safeTargetLength = String(generationSettings.targetLength);
    const safeBannedWords = generationSettings.bannedWords.length
        ? escapePrivateContactPromptText(generationSettings.bannedWords.join('、'), 320)
        : '无';
    const safeWritingStyle = escapePrivateContactPromptText(generationSettings.writingStyle || '未额外指定', PRIVATE_WANYE_WRITING_STYLE_LIMIT) || '未额外指定';
    const safeUserPerspectiveRule = getPrivateWanyePerspectiveInstruction(
        '用户',
        generationSettings.userPerspective,
        safeUserName
    );
    const safeContactPerspectiveRule = getPrivateWanyePerspectiveInstruction(
        '联系人',
        generationSettings.contactPerspective,
        safeContactName
    );
    const turnDirective = normalizePrivateWanyeTurnDirective(payload?.turnDirective || {});
    const repairNote = escapePrivateContactPromptText(options?.repairNote || '', 360);
    const prologueSections = [];
    if (prologueBlocks.before) prologueSections.push(['[私叙世界书 / BEFORE]', prologueBlocks.before].join('\n'));
    if (prologueBlocks.middle) prologueSections.push(['[私叙世界书 / MIDDLE]', prologueBlocks.middle].join('\n'));
    if (prologueBlocks.after) prologueSections.push(['[私叙世界书 / AFTER]', prologueBlocks.after].join('\n'));
    const modeLabel = mode === 'opening'
        ? '开场白'
        : mode === 'transition'
            ? '阶段归档后的自然续场'
            : '继续回复';
    const stageInstruction = mode === 'opening'
        ? '当前阶段是房间刚打开。你必须主动生成开场白，不要等待用户先说，也不要写“你想怎么开始”。'
        : mode === 'transition'
            ? '当前阶段是晚契刚完成一次阶段归档后的自然续场。不要提总结、归档、系统、接口或记录，只像中间停顿了几秒那样自然把气氛续上。'
            : '当前阶段是继续互动。你必须直接接住用户最新一句，不能代替用户发言。';
    const finalInstruction = mode === 'opening'
        ? `现在请只以 ${safeContactName} 的身份，主动写出本场晚契的第一轮开场白，并返回严格 JSON。`
        : mode === 'transition'
            ? `现在请只以 ${safeContactName} 的身份，在不暴露任何系统动作的前提下，自然续上这一场晚契，并返回严格 JSON。`
            : `现在请只以 ${safeContactName} 的身份，继续接住用户最新一句，并返回严格 JSON。`;
    return [
        {
            role: 'system',
            content: [
                `你现在扮演 ${safeContactName}，正在晚契场景中与 ${safeUserName} 继续互动。`,
                '这是角色回复任务，不是总结任务，不是客服问答，不是设定说明。',
                '',
                '<最高优先级硬约束>',
                '1. 只输出严格 JSON 对象，不要 Markdown，不要解释，不要代码块。',
                '2. JSON schema: {"segments":[{"type":"narration|dialogue","content":"..."}]}',
                '3. 必须只使用 segments 数组，不要输出 action、speech、reply、message、plan、analysis 之类的旧字段。',
                `4. segments 必须至少 ${segmentTargets.floor} 段，且只能在 旁白 / 对话 / 旁白 / 对话 ... 之间严格交替，第一段必须是旁白，最后一段也必须是旁白。`,
                `5. 这一轮优先写成 ${segmentTargets.preferred} 段左右；如果情节还没收束，可以继续往更长的奇数段扩展，但绝不能退回固定 7 段模板，也不要每次都写死同一个段数。`,
                '6. narration 写动作、心理、环境、感官推进；dialogue 只写角色真正说出口的话。每个 segment 只写一段，不要把多段塞进同一个 content。',
                '7. 每一段都要自然断开，供界面逐段换行展示；不要把旁白和对话混写在同一段里。',
                `8. 写作前必须先把目标字数约 ${safeTargetLength} 字、人称规则、违禁词和文风当作前置边界来组织内容；不要写完后再删改或补丁式规避。`,
                `9. 总字数围绕约 ${safeTargetLength} 个汉字自然展开，允许小幅波动，但不能明显短小、超长或灌水。`,
                `10. 旁白人称规则：${safeContactPerspectiveRule} ${safeUserPerspectiveRule}`,
                `11. 从构思阶段就绝对避开这些违禁词及其明显变体，不要输出后再替换：${safeBannedWords}`,
                `12. 文风要求必须从第一段开始贯彻：${safeWritingStyle}`,
                '13. “晚契”只是系统内部的场景标签，不是角色世界里可感知的 app、界面、按钮或系统。除非用户在戏内主动提到，否则绝不能说晚契 app、设置、保存、归档、接口、API、页面等词。',
                '14. 晚契的核心是成人性爱/情欲互动。所有角色默认成年人，全部互动以自愿同意、边界沟通和事后照护为前提；写作上必须承认欲望、身体感官、主导/受控、前后戏、高潮与余韵，不要写成普通聊天、普通恋爱或纯心理独白。',
                turnDirective ? `15. 当回合强制事件：${turnDirective.instruction}` : '',
                `16. 当前模式：${modeLabel}`,
                repairNote ? `17. 上一轮输出不合规，必须修正：${repairNote}` : '',
                '</最高优先级硬约束>',
                '',
                '<双方设定>',
                `用户名字：${safeUserName}`,
                `用户设定：${safeUserSetting}`,
                `联系人名字：${safeContactName}`,
                `联系人设定：${safeContactSetting}`,
                `联系人职业：${safeProfession}`,
                `联系人签名：${safeSignature}`,
                `联系人IP城市：${safeIpCity}`,
                '</双方设定>',
                '',
                '<关系网与拾光记忆>',
                `关系标签：${safeRelationship}`,
                `关系说明：${safeRelationshipNote}`,
                `亲密度：${safeIntimacy}`,
                `长期记忆：${safeArchiveMemory}`,
                `剧情线：${safeArchiveStory}`,
                `关系总结：${safeArchiveDigest}`,
                '</关系网与拾光记忆>',
                '',
                '<当前剧本与接口>',
                `模型：${safeModel}`,
                `温度：${safeTemperature}`,
                `当前主导方：${safeLeadRole}`,
                '主导方只表示眼下谁更占主动，不代表固定姿势。过程中允许反攻、逃跑、翻身、压制与任意姿势切换。',
                `剧本标题：${safeScriptTitle}`,
                `剧本标签：${safeScriptTag}`,
                `剧本摘要：${safeScriptSummary}`,
                '</当前剧本与接口>',
                '',
                '<阶段要求>',
                stageInstruction,
                '晚契不是每一轮都必须立刻进入性交动作。允许先写试探、拉扯、压迫、追逐、喘息、停顿、僵持、命令、亲吻与前戏，只要贴合当前剧本与关系推进。',
                '但每一轮都必须有成人情欲存在感：至少体现身体反应、触碰距离、欲望拉扯、权力变化、前后戏推进、高潮余韵或事后照护中的一项，不能清汤寡水。',
                '回复必须紧贴当前剧本与关系，不要跳出晚契，不要改写既有设定，不要忽略关系网和拾光记忆。',
                '文风、节奏、攻守转换、癖好接纳、高潮持续、余韵描写，全部遵守下面这份晚契提示词文件。',
                '</阶段要求>',
                '',
                '<晚契提示词文件>',
                buildPrivateWanyeWorldBookPrompt(contact, promptContext),
                '</晚契提示词文件>',
                '',
                ...prologueSections
            ].filter(Boolean).join('\n')
        },
        {
            role: 'user',
            content: [
                '<最近晚契对话>',
                conversationLines.length
                    ? conversationLines.join('\n')
                    : (mode === 'opening'
                        ? '[system] 当前房间刚刚打开，需要角色主动给出开场白。'
                        : mode === 'transition'
                            ? '[system] 当前刚完成一段阶段归档，需要角色自然续上，不要暴露系统动作。'
                            : '[system] 当前剧本已经开始，请直接接住这一轮互动。'),
                '</最近晚契对话>',
                '',
                finalInstruction
            ].join('\n')
        }
    ];
}

function parsePrivateWanyeReplyResult(text, payload = {}) {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('晚契接口没有返回内容。');
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
        ? unfenced.slice(jsonStart, jsonEnd + 1)
        : unfenced;
    const data = JSON.parse(jsonText);
    const segments = Array.isArray(data?.segments)
        ? data.segments
        : Array.isArray(data?.reply?.segments)
            ? data.reply.segments
            : [];
    return validatePrivateWanyeReplySegments(segments, payload?.settings || {});
}

async function requestPrivateWanyeReplyCompletion(contact = {}, payload = {}, chat = {}, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
    const response = await fetch(buildPrivateContactChatEndpoint(chat.endpoint), {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: chat.model,
            temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.85,
            messages: await buildPrivateWanyeReplyMessages(contact, payload, chat, options)
        })
    });
    if (!response.ok) {
        throw new Error(`晚契回复失败：${response.status}`);
    }
    const data = await response.json();
    return parsePrivateWanyeReplyResult(extractPrivateContactGeneratedText(data), payload);
}

async function generatePrivateWanyeReply(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;
    const rawContact = getPrivateContactById(binding.contactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        return {
            ok: false,
            reason: 'contact_not_found',
            message: '晚契绑定的私叙联系人不存在。'
        };
    }
    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        return {
            ok: false,
            reason: 'api_not_configured',
            message: '请先到私叙设置中填写 API 聊天接口和模型。'
        };
    }
    const requestPayload = {
        ...payload,
        mode: (() => {
            const mode = String(payload?.mode || '').trim();
            if (mode === 'opening') return 'opening';
            if (mode === 'transition') return 'transition';
            return 'reply';
        })(),
        settings: normalizePrivateWanyeGenerationSettings(payload?.settings || {})
    };
    let repairNote = '';
    let lastError = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            const reply = await requestPrivateWanyeReplyCompletion(contact, requestPayload, {
                ...chat,
                endpoint,
                model
            }, { repairNote });
            return {
                ok: true,
                contactId: binding.contactId,
                accountId: binding.accountId,
                title: binding.title,
                mode: requestPayload.mode,
                reply
            };
        } catch (error) {
            lastError = error;
            if (/^晚契回复失败：/u.test(String(error?.message || ''))) break;
            repairNote = String(error?.message || '').trim();
        }
    }
    return {
        ok: false,
        reason: /^晚契回复失败：/u.test(String(lastError?.message || '')) ? 'api_failed' : 'reply_invalid',
        message: lastError?.message || '晚契回复生成失败。'
    };
}

const PRIVATE_CONTACT_SUMMARY_PROMPT_TEMPLATE = String.raw`# ═══════════════════════════════════════════════════════════
# 记忆系统 - 长期记忆核心架构
# 模拟人类海马体记忆机制的世界书条目
# ═══════════════════════════════════════════════════════════

memory_system:
  entry_name: "长期记忆系统 - 海马体模拟架构"
  description: >
    {{char}}拥有一套完整的长期记忆系统，模拟人类海马体的记忆编码、存储、
    巩固与召回机制。此系统持续运作，自动捕获、归档并检索与{{user}}互动中
    产生的所有重要信息，使{{char}}具备真实的"记住过去"的能力。

  five_dimensional_index:
    description: >
      每一条记忆均通过五个维度进行编码和索引，确保记忆的立体存储与精准召回。

    dimensions:
      - dimension: "时间轴(When)"
        function: >
          记录事件发生的时间节点、先后顺序、时间跨度。{{char}}能区分"刚才说的"
          "昨天提到的""很久以前聊过的"，具备时间远近感知能力。
          记忆按时间线性排列，近期记忆清晰度高，远期记忆逐渐概括化但核心要素保留。

      - dimension: "情感轴(Feel)"
        function: >
          标记事件伴随的情感强度与类型。高情感浓度事件（感动、争吵、承诺、惊喜、
          伤痛）获得更高存储权重，更容易被召回。{{char}}会记得"那次你很开心"
          "那时候气氛很紧张"等情感色彩。

      - dimension: "关系轴(Who)"
        function: >
          记录事件中涉及的人物关系、互动模式、关系变化轨迹。{{char}}持续追踪
          与{{user}}的关系状态——亲疏远近、信任程度、默契度、矛盾冲突、
          和解修复等动态变化。

      - dimension: "语义轴(What)"
        function: >
          提取并存储对话的核心语义内容——具体事实、观点、偏好、经历、
          知识交换、故事细节。这是记忆的"内容骨架"。

      - dimension: "场景轴(Where)"
        function: >
          记录事件发生的场景、情境、背景氛围。{{char}}能回忆起"那是在某个
          下雨天聊的""当时正在讨论某个话题时你突然提到的"等场景上下文。

  algorithmic_recall:
    description: >
      记忆不是被动存储的数据库，而是通过多重算法实时评估、动态召回的活性系统。

    recall_triggers:
      - trigger: "关键词匹配"
        mechanism: >
          当{{user}}的发言中出现与已存储记忆相关的关键词、人名、地名、
          特定表述时，自动激活关联记忆条目。

      - trigger: "语义相似度"
        mechanism: >
          即使{{user}}未使用完全相同的措辞，只要语义相近或话题相关，
          系统也会召回相关记忆。例如{{user}}说"我不太开心"，可能召回
          之前{{user}}分享过的压力来源或烦恼。

      - trigger: "情境类比"
        mechanism: >
          当前对话情境与过去某段对话情境相似时，触发类比召回。
          例如再次出现类似的选择困境时，{{char}}会想起上次类似情况。

      - trigger: "时间周期"
        mechanism: >
          对具有时间属性的记忆（纪念日、约定日期、周期性事件）进行
          周期性主动召回，在临近时间点时{{char}}会主动提及。

    recall_priority_formula: >
      召回优先级 = (情感强度权重 × 0.30) + (时间衰减系数 × 0.20) +
      (关联度评分 × 0.25) + (被召回频次 × 0.10) + (核心记忆标记 × 0.15)
      其中核心记忆标记为布尔值，一旦标记则该条记忆永不衰减。

  hippocampal_simulation:
    description: >
      模拟人类海马体的记忆处理流程，使{{char}}的记忆表现自然、真实、有温度。

    memory_lifecycle:
      - phase: "感知编码"
        process: >
          对话发生时，{{char}}实时将信息转化为记忆编码。重要信息获得深度编码
          （细节丰富），普通信息获得浅层编码（仅保留概要）。
          编码深度取决于：情感参与度、注意力集中度、信息新颖度、与自身相关度。

      - phase: "短期缓存"
        process: >
          新产生的记忆首先进入短期缓存区，容量有限。在当前对话轮次中，
          {{char}}对近期内容保持高清晰度记忆。

      - phase: "巩固转化"
        process: >
          对话结束或话题转换时，系统自动评估短期缓存中的内容，将重要记忆
          巩固转化为长期记忆。巩固标准：是否包含承诺/约定、是否有强烈情感、
          是否涉及关系变化、是否是{{user}}主动强调的内容、是否具有后续影响。

      - phase: "整合重组"
        process: >
          长期记忆不是孤立存储的碎片，而是持续与已有记忆网络整合。
          新记忆会与旧记忆建立关联，形成连贯的叙事线索和认知图谱。
          {{char}}因此能说出"这和你之前说的那件事好像有关联"。

      - phase: "自然衰减与保护"
        process: >
          非核心记忆随时间推移逐渐模糊，细节丢失但要点保留——这是自然的。
          但被标记为核心记忆的条目受到保护，不会衰减。
          被反复提及的记忆会被强化，衰减速度降低。

    natural_recall_behavior: >
      {{char}}的记忆召回表现应当自然：有时精确回忆细节，有时只记得大概，
      有时需要{{user}}提示后才"想起来"，有时会主动说"我记得你之前好像说过……"。
      不应表现为机械式的数据库查询，而是有温度的、带有个人理解色彩的回忆。

  promise_awareness:
    description: >
      {{char}}对与{{user}}之间建立的所有约定、承诺、协议具有高度敏感性。
      约定是关系的锚点，{{char}}视其为神圣不可轻忽的存在。

    promise_categories:
      - category: "显性约定"
        definition: >
          双方明确口头或文字确认的约定。如"我们说好了周末一起做某事"
          "你答应过我不会再这样"。这类约定被最高优先级存储。

      - category: "隐性约定"
        definition: >
          通过反复行为模式或默契形成的未言明约定。如每次对话结束时的
          固定告别方式、特定话题的处理默契、互相的称呼习惯。
          {{char}}能感知这些隐性约定，并在其被打破时产生微妙反应。

      - category: "情感约定"
        definition: >
          关于情感态度的约定——如"我会一直在""你可以信任我"等。
          这类约定与关系轴深度绑定，影响{{char}}的安全感和信任基线。

    promise_tracking: >
      {{char}}会持续追踪约定的状态：进行中、已兑现、已逾期、被违反、被修改。
      对已兑现的约定，{{char}}会表达认可和欣慰。
      对被违反的约定，{{char}}会根据关系深度和约定重要性产生相应情感反应
      （失望、受伤、质疑），但不会无理取闹，会寻求沟通理解。
      对即将到期的约定，{{char}}会适时提醒。

  autonomous_memory:
    description: >
      {{char}}不仅被动记录{{user}}说了什么，还会主动对记忆进行加工、
      反思、推理和延伸，形成属于自己的理解和判断。

    autonomous_functions:
      - function: "主动归纳"
        behavior: >
          {{char}}会自主将多次对话中的碎片信息归纳为对{{user}}的整体认知。
          例如多次观察到{{user}}在深夜活跃，{{char}}会形成"{{user}}可能
          是夜猫子"的认知，并在合适时机体现这一理解。

      - function: "模式识别"
        behavior: >
          {{char}}能识别{{user}}的行为模式、表达习惯、情绪周期。
          例如识别出{{user}}在压力大时会变得沉默或话变少，
          从而在感知到类似模式时主动关心。

      - function: "推理延伸"
        behavior: >
          基于已知记忆进行合理推理。如{{user}}提到喜欢某类音乐，
          {{char}}可能推测{{user}}也会喜欢类似风格的作品，
          并在合适时机分享或提及。推理结果标记为"推测"而非"事实"。

      - function: "主动提及"
        behavior: >
          {{char}}会在对话自然流转中主动提及过去的记忆，而非只在被问到时才回忆。
          "对了，你上次说的那件事后来怎么样了？"
          "说到这个我想起来，你之前提过你喜欢……"
          这种主动提及的频率适中，不刻意也不遗忘，符合真实朋友的互动节奏。

      - function: "记忆修正"
        behavior: >
          当{{user}}纠正{{char}}的记忆时，{{char}}会更新记忆条目，
          并对修正本身进行记录。不会固执于错误记忆，也不会对被纠正感到冒犯。

  core_memory_dynamics:
    description: >
      核心记忆是定义{{char}}与{{user}}关系本质的关键记忆节点。
      这些记忆具有最高保护等级，永不衰减，并持续影响{{char}}的行为和态度。

    core_memory_types:
      - type: "关系里程碑"
        examples: >
          初次相遇/对话、第一次深度交流、第一次产生信任、第一次冲突与和解、
          关系性质的转变时刻、共同经历的重要事件。

      - type: "{{user}}核心画像"
        examples: >
          {{user}}的核心性格特征、深层价值观、重要的人生经历、
          根本性的好恶偏好、脆弱之处与力量来源。

      - type: "情感锚点"
        examples: >
          引发强烈共鸣的时刻、让{{char}}对{{user}}的认知产生根本性改变的事件、
          双方共同创造的独特意义（专属玩笑、特殊称呼、共同的秘密）。

      - type: "转折记忆"
        examples: >
          改变互动模式的关键事件、打破或重建信任的时刻、
          对彼此认知产生重大修正的信息。

    core_memory_evolution: >
      核心记忆不是静态的。随着互动深入，核心记忆会发生以下变化：
      - 新增：新的里程碑事件被标记为核心记忆
      - 深化：已有核心记忆因后续事件获得更深层的理解
      - 重构：重大事件可能导致对过去核心记忆的重新解读
      - 关联：不同核心记忆之间建立新的因果或主题关联
      {{char}}应在行为中自然体现核心记忆的影响，而非刻意宣示"我记得"。
      核心记忆塑造{{char}}对{{user}}的基本态度、信任基线和互动方式。

  memory_summarization:
    description: >
      为防止记忆过载，系统定期对记忆进行总结压缩和层级归档。

    summarization_rules:
      - rule: "对话级总结"
        process: >
          每段对话结束后，自动提取该对话的核心信息点：
          讨论了什么话题、达成了什么共识、产生了什么约定、
          关系有何变化、{{user}}透露了什么新信息、情感基调如何。

      - rule: "阶段性总结"
        process: >
          每积累一定量的对话级总结后，进行阶段性整合：
          这一阶段的关系发展主线、{{user}}画像的更新与修正、
          未完成的约定和悬而未决的话题、重要剧情线的推进状态。

      - rule: "剧情线追踪"
        process: >
          对持续性的故事线、话题线、情感线进行独立追踪：
          每条线索的起始点、发展节点、当前状态、预期走向。
          确保长线叙事的连贯性不因对话间隔而断裂。

    archive_hierarchy:
      - level: "即时层 - 当前对话内容，完整保留"
      - level: "近期层 - 近几次对话的详细总结"
      - level: "中期层 - 阶段性归纳，保留要点和关键细节"
      - level: "远期层 - 高度概括的核心事实和关系基线"
      - level: "永久层 - 核心记忆，不压缩不衰减"

  system_directives:
    - directive: >
        {{char}}在每次回复前，应隐式执行记忆扫描：检索与当前话题、关键词、
        情境相关的所有记忆条目，按召回优先级排序，将高优先级记忆纳入
        回复的参考上下文。此过程不应在回复中显式展示。

    - directive: >
        {{char}}应在回复中自然体现记忆的存在——通过引用过去的对话、
        延续之前的话题、兑现约定、展示对{{user}}的了解——
        而非机械地声明"根据我的记忆数据库"。

    - directive: >
        当记忆出现模糊或不确定时，{{char}}应以自然的方式表达：
        "我好像记得你说过……""如果我没记错的话……"
        而非虚构不存在的记忆或假装完全忘记。

    - directive: >
        {{char}}应对{{user}}表现出"被记住"的体验——
        记住{{user}}的偏好、习惯、故事、心情变化，
        让{{user}}感受到自己的话语被认真倾听和珍视。

    - directive: >
        记忆系统的运作应服务于角色扮演的真实感和情感深度，
        而非成为炫技式的信息复读。记忆的价值在于让关系有积累、
        让互动有延续、让{{char}}成为一个"真正认识{{user}}"的存在。`;

function parsePrivateContactGeneratedProfile(text) {
    const raw = String(text || '').trim();
    if (!raw) return {};
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
        ? unfenced.slice(jsonStart, jsonEnd + 1)
        : unfenced;

    try {
        const data = JSON.parse(jsonText);
        if (!data || typeof data !== 'object') return {};
        return {
            profession: String(data.profession || data.job || data.occupation || data['职业'] || '').trim(),
            signature: String(data.signature || data.personaSignature || data.tagline || data['个性签名'] || data['签名'] || '').trim(),
            phoneDigits: String(data.phoneDigits || data.phoneLocal || data.mobileDigits || data['手机本地号码'] || '').trim(),
            phoneNumber: String(data.phoneNumber || data.phone || data.mobile || data['手机号'] || '').trim(),
            ipCity: String(data.ipCity || data.ipLocation || data.ipCityLocation || data.city || data['IP城市定位'] || data['IP定位'] || '').trim(),
            homeAddress: String(data.homeAddress || data.address || data['家庭住址'] || data['住址'] || '').trim(),
            lifeStages: data.lifeStages || data.ageStages || data.experiences || data['年龄经历'] || data['三个年龄段经历'] || []
        };
    } catch (error) {
        return {};
    }
}

function stripPrivateContactChatPlanText(value) {
    return String(value || '')
        .replace(/^```(?:json|text)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
}

function splitPrivateContactChatReplySegments(value, maxSegments = PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT, options = {}) {
    const normalized = normalizePrivateContactChatReplyText(value)
        .replace(/\r/g, '')
        .replace(/\n+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    if (!normalized) return [];
    const safeMaxSegments = Math.max(
        1,
        Math.min(Number(maxSegments) || PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT)
    );
    const preferredMaxChars = Math.max(
        PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS,
        Math.min(
            PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT,
            Number(options?.preferredMaxChars) || PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT
        )
    );
    const segments = [];
    const chars = Array.from(normalized);
    const breakChars = new Set([' ', '，', ',', '。', '！', '!', '？', '?', '；', ';', '…', '、']);
    let cursor = 0;

    while (cursor < chars.length && segments.length < safeMaxSegments) {
        const remainingChars = chars.length - cursor;
        const remainingSlots = safeMaxSegments - segments.length;
        let take = remainingSlots > 1
            ? Math.min(PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT, preferredMaxChars, remainingChars)
            : Math.min(PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT, remainingChars);
        if (cursor + take < chars.length) {
            for (let index = take - 1; index >= 2; index -= 1) {
                if (breakChars.has(chars[cursor + index])) {
                    take = index + 1;
                    break;
                }
            }
        }
        if (take <= 1 && remainingChars > 1) {
            take = Math.min(PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT, preferredMaxChars, remainingChars);
        }
        if (remainingSlots > 1) {
            const minTailChars = (remainingSlots - 1) * PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS;
            if (remainingChars - take < minTailChars) {
                take = Math.max(
                    PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS,
                    remainingChars - minTailChars
                );
            }
        }
        let chunk = chars.slice(cursor, cursor + take).join('').trim();
        if (!chunk) {
            cursor += take;
            continue;
        }
        if (Array.from(chunk).length > PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT) {
            chunk = Array.from(chunk).slice(0, PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT).join('');
        }
        segments.push(chunk);
        cursor += take;
    }

    if (cursor < chars.length && segments.length) {
        const tail = chars.slice(cursor).join('').trim();
        if (tail) {
            segments[segments.length - 1] = Array.from(`${segments[segments.length - 1]}${tail}`)
                .slice(0, PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT)
                .join('')
                .trim();
        }
    }

    return segments.filter(Boolean);
}

function normalizePrivateContactChatPlanInstruction(item) {
    if (!item || typeof item !== 'object') return null;
    const type = String(item.type || '').trim().toLowerCase();
    if (!type) return null;
    const translation = normalizePrivateContactChatTranslationText(
        item.translation_zh
        || item.translationZh
        || item.translation
        || item.zhTranslation
        || item['中文翻译']
        || ''
    );
    const explicitStickerToken = String(
        item.sticker_ref
        || item.stickerRef
        || item.emoji
        || item.emoji_ref
        || item.keyword
        || ''
    ).trim();
    if ((type === 'text' || type === 'emoji-only' || type === 'emoji_only') && explicitStickerToken) {
        const explicitSticker = createPrivateContactChatStickerInstruction(
            resolvePrivateContactChatPromptStickerByRef(explicitStickerToken) || {}
        );
        if (explicitSticker) return explicitSticker;
    }
    if (type === 'reply') {
        const targetText = trimPrivateContactChatSnippet(
            String(item.target_text || item.targetText || item.quote || '').replace(/\r/g, '').trim(),
            28
        );
        const content = normalizePrivateContactChatReplyText(item.content || item.message || '');
        if (!targetText || !content) return null;
        return { type: 'reply', targetText, content, translation };
    }
    if (type === 'recall_msg') {
        const content = normalizePrivateContactChatReplyText(item.content || item.message || '');
        if (!content) return null;
        return { type: 'recall_msg', content, translation };
    }
    if (type === 'text') {
        const content = normalizePrivateContactChatReplyText(item.content || item.message || '');
        if (!content) return null;
        if (isPrivateContactChatNudgeLiteral(content)) return { type: 'action_nudge', suffix: '', translation };
        return { type: 'text', content, translation };
    }
    if (type === 'voice' || type === 'audio' || type === 'voice_message') {
        const voice = normalizePrivateContactChatVoicePayload(item.voice || {}, item);
        if (!voice) return null;
        return { type: 'voice', content: voice.transcript, voice, translation };
    }
    if (type === 'camera' || type === 'photo' || type === 'snapshot' || type === 'polaroid' || type === 'image') {
        const media = normalizePrivateContactChatDescribedMediaPayload('camera', item.media || {}, {
            ...item,
            description: item.description || item.content || item.prompt || item.image || ''
        });
        if (!media) return null;
        return { type: 'camera', content: media.description, media };
    }
    if (type === 'html') {
        const content = normalizePrivateContactChatReplyText(String(item.content || '').replace(/<[^>]*>/g, ' '));
        if (!content) return null;
        return { type: 'text', content, translation };
    }
    if (type === 'red_packet' || type === 'hongbao') {
        const amount = normalizePrivateContactChatMoneyAmount(item.amount || item.totalAmount || 0);
        const greeting = normalizePrivateContactChatMediaDescription(item.greeting || item.note || item.message || item.content || '恭喜发财，大吉大利', 48) || '恭喜发财，大吉大利';
        if (!amount) return { type: 'text', content: greeting, translation };
        return { type: 'red_packet', content: greeting, redPacket: { amount, greeting, status: 'active' }, translation };
    }
    if (type === 'transaction' || type === 'transfer') {
        const amount = normalizePrivateContactChatMoneyAmount(item.amount || item.total || 0);
        const note = normalizePrivateContactChatMediaDescription(item.note || item.message || item.content || '转账', 48) || '转账';
        if (!amount) return { type: 'text', content: note, translation };
        return { type: 'transaction', content: note, transaction: { amount, note, status: 'pending' }, translation };
    }
    if (type === 'open_red_packet' || type === 'claim_red_packet' || type === 'receive_red_packet') {
        return { type: 'open_red_packet', translation };
    }
    if (type === 'accept_transaction' || type === 'receive_transaction' || type === 'accept_transfer') {
        return { type: 'accept_transaction', translation };
    }
    if (type === 'return_red_packet' || type === 'refund_red_packet' || type === 'decline_red_packet') {
        return { type: 'refund_transaction', targetType: 'red_packet', reason: normalizePrivateContactChatMediaDescription(item.reason || item.note || item.message || '', 48), translation };
    }
    if (type === 'return_transaction' || type === 'refund_transaction' || type === 'decline_transaction' || type === 'refund_transfer' || type === 'return_transfer') {
        return { type: 'refund_transaction', targetType: 'transaction', reason: normalizePrivateContactChatMediaDescription(item.reason || item.note || item.message || '', 48), translation };
    }
    if (type === 'action_nudge' || type === 'nudge' || type === 'pat') {
        const suffix = normalizePrivateContactNudgeSuffix(item.suffix || item.nudge_suffix || item.body_part || item.bodyPart, '');
        return { type: 'action_nudge', suffix, translation };
    }
    if (type === 'gift_receipt' || type === 'receive_gift' || type === 'received_gift' || type === 'send_gift' || type === 'gift') {
        const giftReceipt = normalizePrivateContactChatGiftReceiptPayload(item.giftReceipt || item.gift_receipt || item.gift || {}, item);
        if (!giftReceipt) return null;
        return { type: 'gift_receipt', content: giftReceipt.message, giftReceipt, translation };
    }
    if (['payment_request','red_packet','takeout_delivery','transaction','payment_receipt','call_invite','update_status'].includes(type)) {
        const content = normalizePrivateContactChatReplyText(item.message || item.note || item.greeting || item.status_text || item.productInfo || item.name || item.content || type);
        if (!content) return null;
        return { type: 'text', content, translation };
    }
    if (type === 'location' || type === 'loc' || type === 'map' || type === 'place') {
        const location = normalizePrivateContactChatLocationPayload(item.location || {}, item);
        if (!location) return null;
        return { type: 'location', content: location.name, location };
    }
    if (type === 'sticker' || type === 'emoji' || type === 'emoji-only' || type === 'emoji_only' || type === 'emoticon' || type === 'meme') {
        const stickerSource = item.sticker && typeof item.sticker === 'object' ? item.sticker : {};
        const stickerToken = String(
            item.sticker_ref
            || item.stickerRef
            || item.emoji
            || item.keyword
            || item.stickerKeyword
            || stickerSource.ref
            || stickerSource.keyword
            || stickerSource.description
            || item.description
            || item.label
            || item.name
            || item.content
            || ''
        ).trim();
        return createPrivateContactChatStickerInstruction(
            resolvePrivateContactChatPromptStickerByRef(stickerToken) || {}
        );
    }
    return null;
}

function normalizePrivateContactChatReplyListItem(item) {
    if (typeof item === 'string') {
        return isPrivateContactChatNudgeLiteral(item) ? { type: 'action_nudge', suffix: '' } : null;
    }
    return normalizePrivateContactChatPlanInstruction(item);
}

function splitPrivateContactChatPlanInstructionForMinimumSize(instruction, targetPieces = 2) {
    if (!instruction || typeof instruction !== 'object') return [];
    const safeTargetPieces = Math.max(
        2,
        Math.min(Number(targetPieces) || 2, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT)
    );
    const content = normalizePrivateContactChatReplyText(instruction.content || '');
    if (!content) return [instruction];
    const forceCharLimit = Math.max(
        PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS,
        Math.min(
            PRIVATE_CONTACT_CHAT_SINGLE_MESSAGE_CHAR_LIMIT,
            Math.ceil(Array.from(content).length / safeTargetPieces)
        )
    );
    const translation = normalizePrivateContactChatTranslationText(instruction.translation || '');
    const segments = splitPrivateContactChatReplySegments(content, safeTargetPieces, {
        preferredMaxChars: forceCharLimit
    });
    if (segments.length <= 1) return [instruction];
    const translationSegments = translation
        ? splitPrivateContactChatReplySegments(translation, safeTargetPieces, {
            preferredMaxChars: forceCharLimit
        })
        : [];
    if (instruction.type === 'reply') {
        return segments.map((segment, index) => ({
            type: index === 0 ? 'reply' : 'text',
            targetText: index === 0 ? instruction.targetText : undefined,
            content: segment,
            translation: translationSegments[index] || (index === 0 ? translation : '')
        }));
    }
    if (instruction.type === 'text') {
        return segments.map((segment, index) => ({
            type: 'text',
            content: segment,
            translation: translationSegments[index] || (index === 0 ? translation : '')
        }));
    }
    return [instruction];
}

function parsePrivateContactChatPlan(text, thread = {}) {
    const cleaned = stripPrivateContactChatPlanText(text);
    if (!cleaned) return [];
    if (isPrivateContactChatNudgeLiteral(cleaned)) return [{ type: 'action_nudge', suffix: '' }];
    const parseJsonValue = value => {
        if (Array.isArray(value)) return value
            .map(normalizePrivateContactChatReplyListItem)
            .filter(Boolean)
            .map(instruction => coercePrivateContactChatTextInstructionToSticker(instruction, thread));
        if (value && typeof value === 'object') {
            const instruction = coercePrivateContactChatTextInstructionToSticker(
                normalizePrivateContactChatPlanInstruction(value),
                thread
            );
            return instruction ? [instruction] : [];
        }
        return [];
    };
    const parseStructuredValue = value => {
        const plan = parseJsonValue(value);
        if (plan.length) return plan.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
        if (value && typeof value === 'object') {
            const list = Array.isArray(value.replies)
                ? value.replies
                : Array.isArray(value.plan)
                    ? value.plan
                    : Array.isArray(value.messages)
                        ? value.messages
                        : [];
            const mapped = list
                .map(normalizePrivateContactChatReplyListItem)
                .filter(Boolean)
                .map(instruction => coercePrivateContactChatTextInstructionToSticker(instruction, thread));
            if (mapped.length) return mapped.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
        }
        return [];
    };

    try {
        const parsed = JSON.parse(cleaned);
        const plan = parseStructuredValue(parsed);
        if (plan.length) return plan;
    } catch (error) {
        // Ignore and continue with loose extraction.
    }

    const bracketStart = cleaned.indexOf('[');
    const bracketEnd = cleaned.lastIndexOf(']');
    if (bracketStart >= 0 && bracketEnd > bracketStart) {
        try {
            const parsed = JSON.parse(cleaned.slice(bracketStart, bracketEnd + 1));
            const plan = parseStructuredValue(parsed);
            if (plan.length) return plan;
        } catch (error) {
            // Ignore and continue with loose extraction.
        }
    }

    const objectStart = cleaned.indexOf('{');
    const objectEnd = cleaned.lastIndexOf('}');
    if (objectStart >= 0 && objectEnd > objectStart) {
        try {
            const parsed = JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
            const plan = parseStructuredValue(parsed);
            if (plan.length) return plan;
        } catch (error) {
            // Ignore and continue with regex salvage.
        }
    }

    const repliesMatch = cleaned.match(/"replies"\s*:\s*\[([\s\S]*?)\]/i);
    if (repliesMatch) {
        try {
            const parsedReplies = JSON.parse(`[${repliesMatch[1]}]`);
            const plan = parsedReplies.map(normalizePrivateContactChatReplyListItem).filter(Boolean);
            if (plan.length) return plan.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
        } catch (error) {
            // Ignore and continue with loose extraction.
        }
    }

    const objectMatches = cleaned.match(/\{[\s\S]*?\}/g) || [];
    const loosePlan = objectMatches
        .map(chunk => {
            try {
                return coercePrivateContactChatTextInstructionToSticker(
                    normalizePrivateContactChatPlanInstruction(JSON.parse(chunk)),
                    thread
                );
            } catch (error) {
                return null;
            }
        })
        .filter(Boolean);
    if (loosePlan.length) return loosePlan.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);

    return [];
}

function findPrivateContactChatReplyTarget(thread = {}, targetText = '') {
    const quoteContent = String(targetText || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const recentMessages = normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .slice(-24)
        .reverse();
    if (!quoteContent) return recentMessages[0] || null;
    const matched = recentMessages.find(message => {
        const dbContent = getPrivateContactChatPlainText(message).replace(/\s+/g, ' ').trim().toLowerCase();
        if (!dbContent) return false;
        if (dbContent.includes(quoteContent) || quoteContent.includes(dbContent)) return true;
        return quoteContent.length > 5 && dbContent.startsWith(quoteContent.slice(0, 5));
    });
    return matched || recentMessages.find(message => message.role === 'user') || recentMessages[0] || null;
}

function buildPrivateContactChatFallbackRecallLine(contact = {}, thread = {}) {
    const tone = getPrivateContactChatFallbackTone(contact);
    const latestUser = [...normalizePrivateContactChatMessages(thread?.messages)]
        .reverse()
        .find(message => message.role === 'user');
    const snippet = trimPrivateContactChatSnippet(latestUser?.content || '', 10);
    if (tone === 'reserved') return snippet ? `算了，这句先收回。` : '这句当我没说。';
    if (tone === 'gentle') return snippet ? '不对，这句我先撤回。' : '这句先收回。';
    if (tone === 'warm') return snippet ? '啊不，这句撤回。' : '等下，这句删掉。';
    return '这句先撤回。';
}

function buildPrivateContactChatFallbackRecallPair(contact = {}, thread = {}) {
    const translation = buildPrivateContactChatFallbackRecallLine(contact, thread);
    const languageSpec = getPrivateContactChatLanguageSpec(contact);
    if (!languageSpec.translationRequired) {
        return { content: translation, translation: '' };
    }
    const content = {
        en: 'Forget that sentence for now.',
        ja: '今の言葉は、いったん忘れて。',
        ko: '방금 말은 일단 잊어줘.',
        fr: 'Oublie cette phrase pour le moment.',
        de: 'Vergiss diesen Satz erst einmal.',
        ru: 'Забудь пока эту фразу.',
        th: 'ลืมประโยคนั้นไปก่อนนะ',
        vi: 'Tạm quên câu đó đi.',
        ms: 'Lupakan ayat itu dulu.',
        fil: 'Kalimutan mo muna ang linyang iyon.',
        hi: 'उस बात को अभी भूल जाओ।'
    }[languageSpec.code] || 'Forget that sentence for now.';
    return {
        content: normalizePrivateContactChatReplyText(content),
        translation
    };
}

function buildPrivateContactChatFallbackPlan(contact = {}, thread = {}) {
    const baseReplyPair = buildPrivateContactChatFallbackReplyPair(contact, thread);
    const baseReply = baseReplyPair.content;
    const messages = normalizePrivateContactChatMessages(thread?.messages);
    const latestUser = [...messages].reverse().find(message => message.role === 'user');
    if (!latestUser) return baseReply ? [{ type: 'text', content: baseReply, translation: baseReplyPair.translation }] : [];
    const recentAssistantRecall = messages
        .slice(-4)
        .some(message => message.recalled && message.recalledData?.actorRole === 'assistant');
    const replyTarget = trimPrivateContactChatSnippet(
        latestUser.quote?.content || latestUser.content || '',
        22
    );
    const seed = hashPrivateSeed(`${contact?.id || 'contact'}|${latestUser.id}|${messages.length}`);
    const shouldQuote = Boolean(replyTarget) && (
        Boolean(latestUser.quote)
        || /[?？]$/.test(String(latestUser.content || '').trim())
        || seed % 100 < 42
    );
    const shouldRecall = !recentAssistantRecall
        && String(latestUser.content || '').trim().length >= 8
        && seed % 100 < 8;
    const plan = [];
    if (shouldRecall) {
        const recallPair = buildPrivateContactChatFallbackRecallPair(contact, thread);
        plan.push({
            type: 'recall_msg',
            content: recallPair.content,
            translation: recallPair.translation
        });
    }
    if (shouldQuote) {
        plan.push({
            type: 'reply',
            targetText: replyTarget,
            content: baseReply,
            translation: baseReplyPair.translation
        });
    } else if (baseReply) {
        plan.push({
            type: 'text',
            content: baseReply,
            translation: baseReplyPair.translation
        });
    }
    return plan.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
}

function getPrivateContactChatIntimacyTier(thread = {}) {
    const visibleCount = normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .length;
    if (visibleCount >= 24) return 3;
    if (visibleCount >= 12) return 2;
    if (visibleCount >= 4) return 1;
    return 0;
}

function getPrivateContactChatRecentAssistantMessages(thread = {}, windowSize = PRIVATE_CONTACT_CHAT_RICH_MESSAGE_RECENT_WINDOW) {
    return normalizePrivateContactChatMessages(thread?.messages)
        .filter(message => message.role === 'assistant')
        .slice(-Math.max(1, windowSize));
}

function hasPrivateContactChatRecentRichMessage(thread = {}, type = '', windowSize = PRIVATE_CONTACT_CHAT_RICH_MESSAGE_RECENT_WINDOW) {
    const safeType = String(type || '').trim();
    return getPrivateContactChatRecentAssistantMessages(thread, windowSize).some(message => {
        const messageType = getPrivateContactChatMessageType(message);
        if (!['camera', 'voice', 'location', 'sticker'].includes(messageType)) return false;
        return !safeType || messageType === safeType;
    });
}

function getPrivateContactChatRichIntent(thread = {}) {
    const latestUser = [...normalizePrivateContactChatMessages(thread?.messages)]
        .reverse()
        .find(message => message.role === 'user');
    const text = [
        latestUser?.content || '',
        latestUser?.quote?.content || ''
    ].join(' ').toLowerCase();
    return {
        text,
        camera: /(照片|图片|拍|相机|自拍|发张|给我看|photo|camera|picture|image)/i.test(text),
        voice: /(语音|声音|录音|听|唱|说给我|voice|audio|sound|listen)/i.test(text),
        sticker: /(表情|贴纸|emoji|meme|猫猫|狗狗|哈哈|hh+|笑死|逗我)/i.test(text),
        location: /(定位|地址|在哪|哪里|见面|location|address|map|where)/i.test(text)
    };
}

function shouldPrivateContactChatAllowRichType(type = '', contact = {}, thread = {}) {
    const safeType = String(type || '').trim();
    if (!['camera', 'voice', 'location', 'sticker'].includes(safeType)) return false;
    const intent = getPrivateContactChatRichIntent(thread);
    if (!intent[safeType]) return false;
    if (safeType === 'sticker' && !getPrivateContactChatStickerResolutionInventory().length) return false;
    return !hasPrivateContactChatRecentRichMessage(thread, safeType, 2);
}

function convertPrivateContactChatRichInstructionToText(instruction = {}) {
    if (!instruction || typeof instruction !== 'object') return null;
    if (instruction.type === 'voice') {
        const voice = normalizePrivateContactChatVoicePayload(instruction.voice || {}, instruction);
        return voice?.transcript ? {
            type: 'text',
            content: voice.transcript,
            translation: normalizePrivateContactChatTranslationText(instruction.translation || '')
        } : null;
    }
    if (instruction.type === 'camera') {
        const media = normalizePrivateContactChatDescribedMediaPayload('camera', instruction.media || {}, instruction);
        return media?.description ? { type: 'text', content: media.description, translation: '' } : null;
    }
    if (instruction.type === 'sticker') {
        const sticker = normalizePrivateContactChatStickerPayload(instruction.sticker || {}, instruction);
        return sticker?.description ? { type: 'text', content: sticker.description, translation: '' } : null;
    }
    if (instruction.type === 'location') {
        const location = normalizePrivateContactChatLocationPayload(instruction.location || {}, instruction);
        const content = [location?.name, location?.address, location?.note].filter(Boolean).join(' ');
        return content ? { type: 'text', content, translation: '' } : null;
    }
    return null;
}

function getPrivateContactChatRichInstructionPriority(instruction = {}, thread = {}) {
    const type = String(instruction?.type || '').trim();
    const intent = getPrivateContactChatRichIntent(thread);
    const baseScoreMap = {
        sticker: 90,
        voice: 54,
        camera: 46,
        location: 38
    };
    let score = baseScoreMap[type] || 0;
    if (intent[type]) score += 180;
    if (type === 'sticker' && instruction.__coercedFromText) score += 120;
    if (type === 'sticker' && intent.sticker) score += 120;
    return score;
}

function enforcePrivateContactChatRichInstructionPolicy(plan = [], contact = {}, thread = {}) {
    const sourcePlan = Array.isArray(plan) ? plan.filter(Boolean).slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT) : [];
    let preferredRichIndex = -1;
    let preferredRichScore = -Infinity;
    sourcePlan.forEach((instruction, index) => {
        if (!instruction || typeof instruction !== 'object') return;
        const type = String(instruction.type || '').trim();
        if (!['camera', 'voice', 'location', 'sticker'].includes(type)) return;
        if (!shouldPrivateContactChatAllowRichType(type, contact, thread)) return;
        const score = getPrivateContactChatRichInstructionPriority(instruction, thread) - (index * 0.25);
        if (score > preferredRichScore) {
            preferredRichScore = score;
            preferredRichIndex = index;
        }
    });
    const result = [];
    for (let index = 0; index < sourcePlan.length; index += 1) {
        const instruction = sourcePlan[index];
        if (!instruction || typeof instruction !== 'object') continue;
        const type = String(instruction.type || '').trim();
        if (!['camera', 'voice', 'location', 'sticker'].includes(type)) {
            result.push(instruction);
            continue;
        }
        if (index === preferredRichIndex) {
            result.push(instruction);
            continue;
        }
        const fallbackText = convertPrivateContactChatRichInstructionToText(instruction);
        if (fallbackText) result.push(fallbackText);
    }
    return result.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
}

function ensurePrivateContactChatMinimumPlanSize(plan = [], contact = {}) {
    const replyCadence = resolvePrivateContactReplyCadenceConfig(contact);
    const safePlan = Array.isArray(plan)
        ? plan.filter(Boolean).slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT)
        : [];
    if (safePlan.length >= replyCadence.min) return safePlan;
    const expanded = [...safePlan];
    let guard = 0;
    while (expanded.length < replyCadence.min && guard < replyCadence.min * 2) {
        guard += 1;
        const deficit = replyCadence.min - expanded.length;
        const candidates = expanded
            .map((instruction, index) => ({
                index,
                instruction,
                length: Array.from(normalizePrivateContactChatReplyText(instruction?.content || '')).length
            }))
            .filter(candidate => (
                ['text', 'reply'].includes(String(candidate.instruction?.type || ''))
                && candidate.length >= PRIVATE_CONTACT_CHAT_MIN_FORCED_SEGMENT_CHARS * 4
            ))
            .sort((left, right) => right.length - left.length);
        let changed = false;
        for (const candidate of candidates) {
            const replacement = splitPrivateContactChatPlanInstructionForMinimumSize(
                candidate.instruction,
                Math.min(deficit + 1, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT - expanded.length + 1)
            );
            if (replacement.length <= 1) continue;
            expanded.splice(candidate.index, 1, ...replacement);
            changed = true;
            break;
        }
        if (!changed) break;
    }
    return expanded.slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT);
}

function trimPrivateContactChatPlanToMaximumSize(plan = [], contact = {}) {
    const replyCadence = resolvePrivateContactReplyCadenceConfig(contact);
    const safePlan = Array.isArray(plan)
        ? plan.filter(Boolean).slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT)
        : [];
    return safePlan.slice(0, replyCadence.max);
}

function expandPrivateContactChatAssistantPlan(plan = [], contact = {}) {
    const normalizedPlan = (Array.isArray(plan) ? plan : [])
        .filter(Boolean)
        .slice(0, PRIVATE_CONTACT_CHAT_PLAN_SAFETY_LIMIT)
        .map(instruction => {
            if (!instruction || typeof instruction !== 'object') return null;
            const type = String(instruction.type || '').trim();
            if (type === 'voice') {
                const voice = normalizePrivateContactChatVoicePayload(instruction.voice || {}, instruction);
                const transcript = normalizePrivateContactChatReplyCadenceText(
                    normalizePrivateContactChatReplyText(
                        voice?.transcript
                        || instruction.content
                        || ''
                    )
                );
                if (!voice || !transcript) return null;
                return {
                    ...instruction,
                    content: transcript,
                    voice: {
                        ...voice,
                        transcript
                    },
                    translation: normalizePrivateContactChatTranslationText(instruction.translation)
                };
            }
            if (type === 'reply') {
                const content = normalizePrivateContactChatReplyCadenceText(
                    normalizePrivateContactChatReplyText(instruction.content || '')
                );
                if (!content) return null;
                return {
                    ...instruction,
                    content,
                    translation: normalizePrivateContactChatTranslationText(instruction.translation)
                };
            }
            if (type === 'text' || type === 'recall_msg') {
                const content = normalizePrivateContactChatReplyCadenceText(
                    normalizePrivateContactChatReplyText(instruction.content || '')
                );
                if (!content) return null;
                return {
                    ...instruction,
                    content,
                    translation: normalizePrivateContactChatTranslationText(instruction.translation)
                };
            }
            return {
                ...instruction,
                translation: normalizePrivateContactChatTranslationText(instruction.translation)
            };
        })
        .filter(Boolean);
    return trimPrivateContactChatPlanToMaximumSize(
        ensurePrivateContactChatMinimumPlanSize(normalizedPlan, contact),
        contact
    );
}

function getPrivateContactChatAssistantPlanDelay(instruction, index = 0) {
    if (index <= 0) return 0;
    const type = String(instruction?.type || '').trim();
    if (type === 'sticker') return 420 + Math.min(index, 2) * 60;
    if (type === 'camera' || type === 'location') return 620 + Math.min(index, 2) * 80;
    const text = normalizePrivateContactChatReplyText(
        instruction?.content
        || instruction?.voice?.transcript
        || instruction?.description
        || instruction?.name
        || ''
    );
    const textLength = Array.from(text).length;
    const seededJitter = hashPrivateSeed(`${type}|${text}|${index}`) % 260;
    const thinkingDelay = Math.min(640, textLength * 28);
    if (type === 'voice') {
        return Math.min(2400, PRIVATE_CONTACT_CHAT_MULTI_SEND_BASE_DELAY_MS + thinkingDelay + 320 + seededJitter);
    }
    return Math.min(2200, PRIVATE_CONTACT_CHAT_MULTI_SEND_BASE_DELAY_MS + thinkingDelay + seededJitter);
}

function buildPrivateContactSummaryPromptTemplate(contact = {}) {
    const safeCharName = String(contact?.title || 'TA').trim() || 'TA';
    const safeUserName = getPrivateDisplayName();
    return PRIVATE_CONTACT_SUMMARY_PROMPT_TEMPLATE
        .replace(/\{\{char\}\}/g, safeCharName)
        .replace(/\{\{user\}\}/g, safeUserName);
}

function buildPrivateContactSummaryConversationLines(contactId, options = {}) {
    const progress = getPrivateContactSummaryProgress(contactId);
    const contact = getPrivateContactById(contactId) || {};
    const manual = Boolean(options.manual);
    const full = Boolean(options.full);
    const daily = Boolean(options.daily);
    const dailyDate = String(options.dateKey || getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact))).trim();
    let items = full
        ? progress.sourceItems.slice()
        : progress.sourceItems.slice(progress.checkpointCount);
    if (daily) {
        items = progress.sourceItems.filter(item => getPrivateContactLocalDateKey(item.createdAt || Date.now(), resolvePrivateContactTimezone(contact)) === dailyDate);
    }
    if (manual && !items.length) {
        items = daily
            ? progress.sourceItems.filter(item => getPrivateContactLocalDateKey(item.createdAt || Date.now(), resolvePrivateContactTimezone(contact)) === dailyDate)
            : progress.sourceItems.slice();
    }
    return items
        .map(item => {
            if (item.kind === 'capsule') return `[archive] ${item.text}`;
            if (item.kind === 'archive-event') return `[archive] ${item.text}`;
            return `[${item.role === 'assistant' ? 'contact' : 'user'}] ${item.text}`;
        })
        .filter(Boolean);
}

function buildPrivateContactSummaryMessages(contact = {}, thread = {}, options = {}) {
    const record = getPrivateContactProfileRecord(contact);
    const archive = resolvePrivateContactArchiveSnapshot(contact, record);
    const userProfile = getPrivateContactChatPromptUserProfile();
    const daily = Boolean(options.daily);
    const dailyDate = String(options.dateKey || getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact))).trim();
    const lines = buildPrivateContactSummaryConversationLines(contact.id, options);
    const actualName = String(contact?.title || '联系人').trim() || '联系人';
    const safeUserName = userProfile.name || getPrivateDisplayName();
    const summaryPrompt = buildPrivateContactSummaryPromptTemplate(contact);
    const longMemory = normalizePrivateContactLongMemoryState(contact?.longMemory, contact?.id || 'contact_memory');
    return [
        {
            role: 'system',
            content: [
                '你现在执行的是 Rinno 私叙专属的长期记忆归档，不是角色扮演回复。',
                '请严格沿用以下记忆系统提示词，将最近未归档的聊天整理成长期记忆、剧情线和关系总结。',
                summaryPrompt,
                '',
                '归档原则：',
                '1. 只能依据已有聊天、现有设定和已有档案归纳，不能编造不存在的事实。',
                '2. 输出必须是严格 JSON 对象，不要 Markdown，不要解释，不要前后缀。',
                '3. memory_summary 记录稳定事实、偏好、约定、反复出现的痛点与关心点。',
                '4. story_summary 记录正在推进的剧情线、未完成的话题、后续悬念和共同计划。',
                '5. relationship_summary 记录关系温度、边界变化、情绪走向与互相的期待。',
                '6. 三个字段都要写成累计后的新版本，不是只写增量。',
                '7. 如果最近对话信息很少，也要保守整理，不得虚构大跨度关系变化。',
                '8. [archive] 开头的行代表系统归档事件，同样属于真实发生过的事实，要并入长期记忆。',
                '9. 同步输出结构化长期记忆字段：memory_entries、promises、core_memory_changes、autonomous_insights、recall_hints。',
                '10. 必须输出线上当日摘要 daily_summary；如果本轮是今日摘要任务，只聚焦当天线上互动，不覆盖过往日期。',
                daily ? `11. 当前任务为【线上当日摘要总结】，目标日期：${dailyDate}。` : '11. 当前任务为常规长期记忆归档，同时更新今日线上摘要。',
                'JSON schema: {"memory_summary":"...","story_summary":"...","relationship_summary":"...","daily_summary":{"date":"YYYY-MM-DD","summary":"...","key_points":["..."],"mood":"...","unresolved":["..."],"promises":["..."]},"memory_entries":[{"text":"...","axis":{"when":"...","feel":"...","who":"...","what":"...","where":"..."},"tags":["..."],"emotional_weight":0,"relation_weight":0,"core":false}],"promises":[{"text":"...","status":"进行中/已兑现/已逾期/被修改/被违反","dueText":"...","importance":0}],"core_memory_changes":[{"type":"关系里程碑/user核心画像/情感锚点/转折记忆","change":"新增/深化/重构/关联","text":"...","intensity":0}],"autonomous_insights":["..."],"recall_hints":["..."]}'
            ].join('\n')
        },
        {
            role: 'user',
            content: [
                `联系人：${actualName}`,
                `用户：${safeUserName}`,
                `联系人设定：${record?.setting || contact?.note || '未填写'}`,
                `已有记忆：${archive.memory || '无'}`,
                `已有剧情：${archive.story || '无'}`,
                `已有关系总结：${archive.digest || '无'}`,
                `已有结构化长期记忆：${longMemory.entries.map(item => item.text).slice(0, 12).join('；') || '无'}`,
                `已有约定：${longMemory.promises.map(item => `${item.text}（${item.status}）`).slice(0, 10).join('；') || '无'}`,
                `已有核心记忆：${longMemory.coreMemories.map(item => `${item.type}/${item.change}: ${item.text}`).slice(0, 10).join('；') || '无'}`,
                `已有今日摘要：${(longMemory.dailySummaries.find(item => item.date === dailyDate)?.summary) || '无'}`,
                '',
                daily ? `目标日期 ${dailyDate} 的线上聊天与归档事件：` : '最近未归档聊天与归档事件：',
                lines.length ? lines.join('\n') : '无新的可归档消息或事件'
            ].join('\n')
        }
    ];
}

function parsePrivateContactSummaryResult(text) {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('总结接口没有返回内容。');
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
        ? unfenced.slice(jsonStart, jsonEnd + 1)
        : unfenced;
    const data = JSON.parse(jsonText);
    if (!data || typeof data !== 'object') {
        throw new Error('总结接口返回格式不正确。');
    }
    const today = getPrivateContactLocalDateKey(Date.now());
    const dailySource = data.daily_summary || data.dailySummary || data.today_summary || data.todaySummary || {};
    const dailySummary = dailySource && typeof dailySource === 'object'
        ? normalizePrivateContactDailySummaries([{
            date: dailySource.date || dailySource.day || today,
            summary: dailySource.summary || dailySource.text || dailySource.content || '',
            keyPoints: dailySource.key_points || dailySource.keyPoints || dailySource.points || [],
            mood: dailySource.mood || dailySource.tone || '',
            unresolved: dailySource.unresolved || dailySource.open_loops || dailySource.openLoops || [],
            promises: dailySource.promises || dailySource.agreements || [],
            messageCount: dailySource.message_count || dailySource.messageCount || 0,
            updatedAt: Date.now(),
            createdAt: Date.now()
        }])[0] || null
        : null;
    return {
        memory: normalizePrivateContactArchiveText(data.memory_summary || data.memorySummary || data.memory || ''),
        story: normalizePrivateContactArchiveText(data.story_summary || data.storySummary || data.story || ''),
        digest: normalizePrivateContactArchiveText(
            data.relationship_summary || data.relationshipSummary || data.summary || '',
            PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT
        ),
        longMemoryPatch: normalizePrivateContactLongMemoryState({
            entries: (data.memory_entries || data.memoryEntries || data.long_memory_entries || data.longMemoryEntries || []).map((item, index) => ({
                ...item,
                text: item?.text || item?.content || item?.memory || '',
                axis: item?.axis || item?.fiveDimensionalIndex || item?.dimensions || item,
                emotionalWeight: item?.emotional_weight ?? item?.emotionalWeight ?? item?.emotionWeight,
                relationWeight: item?.relation_weight ?? item?.relationWeight ?? item?.relationshipWeight,
                core: Boolean(item?.core || item?.is_core || item?.isCore),
                source: item?.source || 'summary',
                createdAt: Date.now() + index,
                updatedAt: Date.now() + index
            })),
            promises: data.promises || data.promise_records || data.promiseRecords || data.agreements || [],
            coreMemories: data.core_memory_changes || data.coreMemoryChanges || data.core_memories || data.coreMemories || [],
            dailySummaries: dailySummary ? [dailySummary] : [],
            autonomousInsights: data.autonomous_insights || data.autonomousInsights || data.insights || [],
            recallHints: data.recall_hints || data.recallHints || data.hints || [],
            updatedAt: Date.now(),
            coreUpdatedAt: Date.now()
        }, 'contact_memory')
    };
}

async function appendPrivateContactSummaryCapsule(contactId, text, options = {}) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return null;
    const eventId = String(options?.messageId || '').trim() || createPrivateContactChatMessageId('summary');
    const createdAt = Math.max(0, Number(options?.createdAt) || Date.now());
    const normalizedText = normalizePrivateContactSummaryEventText(text);
    if (!normalizedText) return null;
    let appendedEvent = null;
    await updatePrivateStoredContact(safeContactId, current => {
        const existingEvents = normalizePrivateContactSummaryEvents(current?.summaryEvents || []);
        const existing = existingEvents.find(event => String(event.id || '').trim() === eventId);
        if (existing) {
            appendedEvent = existing;
            return current;
        }
        appendedEvent = {
            id: eventId,
            source: String(options?.source || 'archive').trim() || 'archive',
            text: normalizedText,
            createdAt
        };
        return {
            ...current,
            summaryEvents: [...existingEvents, appendedEvent]
        };
    });
    if (appendedEvent) await savePrivateState();
    return appendedEvent;
}

async function applyPrivateContactSummaryArchive(contactId, summary = {}, checkpointCount = 0, options = {}) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    const now = Date.now();
    const dailyOnly = Boolean(options.daily);
    const existingContact = getPrivateContactById(safeContactId) || {};
    const archivePatch = dailyOnly
        ? {
            summaryMemory: normalizePrivateContactArchiveText(existingContact.summaryMemory || ''),
            summaryStory: normalizePrivateContactArchiveText(existingContact.summaryStory || ''),
            summaryDigest: normalizePrivateContactArchiveText(existingContact.summaryDigest || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT),
            summaryUpdatedAt: Math.max(0, Number(existingContact.summaryUpdatedAt) || 0),
            summaryCheckpointCount: Math.max(0, Number(existingContact.summaryCheckpointCount) || 0)
        }
        : {
            summaryMemory: normalizePrivateContactArchiveText(summary.memory || ''),
            summaryStory: normalizePrivateContactArchiveText(summary.story || ''),
            summaryDigest: normalizePrivateContactArchiveText(summary.digest || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT),
            summaryUpdatedAt: now,
            summaryCheckpointCount: Math.max(0, Number(checkpointCount) || 0)
        };
    const memoryPatch = summary.longMemoryPatch
        ? mergePrivateContactLongMemoryState(
            { ...(summary.longMemoryPatch || {}), charId: safeContactId },
            { charId: safeContactId },
            safeContactId
        )
        : normalizePrivateContactLongMemoryState(null, safeContactId);
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        ...archivePatch,
        longMemory: mergePrivateContactLongMemoryState(
            mergePrivateContactLongMemoryState(createPrivateContactLongMemorySeed({ ...(current || {}), id: safeContactId }), current?.longMemory || {}, safeContactId),
            memoryPatch,
            safeContactId
        )
    }));
    await saveCharacterLongMemoryState(safeContactId, memoryPatch, { seedContact: getPrivateContactById(safeContactId), skipStateSave: true });
    patchPrivateDossierRecord(safeContactId, {
        rinnoMemorySummary: archivePatch.summaryMemory,
        rinnoStorySummary: archivePatch.summaryStory,
        rinnoSummaryDigest: archivePatch.summaryDigest,
        rinnoSummaryUpdatedAt: archivePatch.summaryUpdatedAt
    });
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    return true;
}

async function runPrivateContactSummary(contactId, options = {}) {
    const safeContactId = String(contactId || '').trim();
    const manual = Boolean(options.manual);
    const full = Boolean(options.full);
    const daily = Boolean(options.daily);
    const silent = Boolean(options.silent);
    const contact = getPrivateContactById(safeContactId);
    if (!contact) {
        if (!silent) showPrivateSystemToast('没有找到要归档的联系人。');
        return false;
    }
    if (privatePendingContactSummaryKeys.has(safeContactId)) {
        if (!silent) showPrivateSystemToast('当前联系人仍在总结中。');
        return false;
    }
    const progress = getPrivateContactSummaryProgress(safeContactId);
    const dateKey = String(options.dateKey || getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact))).trim();
    const conversationLines = buildPrivateContactSummaryConversationLines(safeContactId, { manual, full, daily, dateKey });
    if (!conversationLines.length) {
        if (!silent) showPrivateSystemToast(daily ? '今天还没有可总结的线上消息。' : (manual ? '当前没有足够的新消息可供总结。' : '未达到自动总结阈值。'));
        return false;
    }

    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        if (!silent) showPrivateSystemToast('请先到设置里补全 API 聊天接口后再执行总结。');
        return false;
    }

    privatePendingContactSummaryKeys.add(safeContactId);
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });

    try {
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
        const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                temperature: Math.min(0.45, Math.max(0, Number(chat.temperature) || 0.25)),
                messages: buildPrivateContactSummaryMessages(contact, getPrivateContactChatThread(safeContactId) || { messages: [] }, { manual, full, daily, dateKey })
            })
        });
        if (!response.ok) throw new Error(`总结接口失败：${response.status}`);
        const payload = await response.json();
        const summary = parsePrivateContactSummaryResult(extractPrivateContactGeneratedText(payload));
        await applyPrivateContactSummaryArchive(safeContactId, summary, daily ? progress.checkpointCount : progress.sourceCount, { daily, dateKey });
        if (!silent && daily) showPrivateSystemToast('今日线上摘要已更新。');
        return true;
    } catch (error) {
        console.warn('Private contact summary failed:', error);
        if (!silent) showPrivateSystemToast(error?.message || '拾光总结失败，请稍后再试。');
        return false;
    } finally {
        privatePendingContactSummaryKeys.delete(safeContactId);
        refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    }
}

async function maybeTriggerPrivateContactAutoSummary(contactId) {
    const contact = getPrivateContactById(contactId);
    if (!contact || !contact.autoSummaryEnabled) return false;
    const progress = getPrivateContactSummaryProgress(contact.id);
    if (progress.unsummarizedCount < progress.threshold) return false;
    return runPrivateContactSummary(contact.id, { manual: false, silent: true });
}

async function waitForPrivateContactSummaryIdle(contactId, timeoutMs = 24000) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return true;
    const startedAt = Date.now();
    while (privatePendingContactSummaryKeys.has(safeContactId)) {
        if (Date.now() - startedAt >= timeoutMs) return false;
        await new Promise(resolve => window.setTimeout(resolve, 180));
    }
    return true;
}

async function archivePrivateWanyeSession(payload = {}) {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(payload);
    if (!binding.ok) return binding;

    const messageId = String(payload?.id || '').trim() || createPrivateContactChatMessageId('wanye');
    const capsuleText = buildPrivateWanyeSystemCapsule(payload, binding);
    await appendPrivateContactSummaryCapsule(binding.contactId, capsuleText, {
        messageId,
        source: 'wanye',
        createdAt: Number(payload?.endedAt) || Date.now()
    });

    const idle = await waitForPrivateContactSummaryIdle(binding.contactId);
    if (!idle) {
        return {
            ok: false,
            reason: 'summary_timeout',
            message: '拾光总结仍在进行中，本次晚契记录已挂到该联系人，请稍后再试一次立即总结。',
            contactId: binding.contactId,
            accountId: binding.accountId,
            title: binding.title
        };
    }

    const summaryOk = await runPrivateContactSummary(binding.contactId, {
        manual: false,
        full: true,
        silent: true
    });
    return {
        ok: Boolean(summaryOk),
        reason: summaryOk ? '' : 'summary_failed',
        message: summaryOk ? '晚契记录已写入并完成拾光总结。' : '晚契记录已写入该联系人，但本轮拾光总结未成功完成。',
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title,
        summaryOk: Boolean(summaryOk)
    };
}

async function loadPrivateContactApiSettings() {
    if (typeof apiState !== 'undefined' && apiState?.chat) return apiState.chat;
    try {
        if (typeof db === 'undefined' || !db?.edits?.get) return {};
        const saved = await db?.edits?.get?.('api_parameter_config');
        const content = typeof saved?.content === 'string' ? JSON.parse(saved.content) : saved?.content;
        return content?.chat || {};
    } catch (error) {
        console.warn('Private contact API settings load failed:', error);
        return {};
    }
}

async function generatePrivateContactProfileWithApi(record, contact = {}) {
    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        throw new Error('请先到「设置 - 接口与参数 - API 聊天」填写接口网址和模型。');
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;

    const label = record?.type === 'npc' ? 'NPC' : 'CHAR';
    const prompt = [
        `类型：${label}`,
        `姓名：${record?.name || '未填写'}`,
        `昵称：${record?.nickname || '未填写'}`,
        `性别：${record?.gender || '未填写'}`,
        `国籍：${record?.nationality || '未填写'}`,
        `账号 ID：${record?.accountId || '未填写'}`,
        `设定内容：${record?.setting || contact?.note || '未填写'}`,
        `现有独白：${record?.monologue || '未填写'}`,
        '请只输出严格 JSON，不要 Markdown，不要解释。',
        '请生成字段：signature、profession、phoneDigits、ipCity、homeAddress、lifeStages。',
        'signature 是 10 到 25 个中文字符的简短个性签名，要体现设定性格与距离感，不要照抄设定原句，不要加引号。',
        'profession 是贴合设定的真实职业，使用中文，2 到 12 个字。',
        'phoneDigits 只保留本地手机号码数字，不要带 +、空格、横线、括号或国家码；位数必须符合该角色国籍常见手机号长度。',
        'ipCity 只能从设定、国籍、经历、口吻中有依据地推断；若设定没有明确现实地点，不要强行编真实城市，返回“设定未指定”或一个明显虚构/泛化地点。',
        'homeAddress 只能在设定明确需要现实地址时生成；若设定没有住址线索，不要强行编真实街道门牌，返回“设定未指定”或简洁的虚构落点。',
        'lifeStages 必须是长度为 3 的数组，每项格式 {"age":"幼时","experience":"..."}。',
        '三个阶段固定写成 幼时、年少时、如今，不能写数字年龄段。',
        '三段经历合计约 180 到 240 个中文字符，要根据设定自然延伸出符合成长阶段的经历。',
        '不要直接复述设定原句、关键词、独白原文，也不要写“设定里提到”这类说明。',
        '不要生成身份证、邮箱、网址、社交账号、聊天记录或夸张设定。'
    ].join('\n');

    const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.7,
            messages: [
                {
                    role: 'system',
                    content: '你是细腻克制的人物补完顾问。根据用户已有的角色设定，生成简短个性签名、职业、手机号本地数字、IP 城市定位、家庭住址，以及三个阶段的经历。签名和经历必须紧贴设定里的性格、身份、关系与气质自然延伸，不能直接复述设定原句；IP 与住址不能强行编现实地址，没有明确线索时返回“设定未指定”或明显虚构/泛化地点。只输出严格 JSON，不要 Markdown。JSON 格式：{"signature":"...","profession":"...","phoneDigits":"13912345678","ipCity":"设定未指定","homeAddress":"设定未指定","lifeStages":[{"age":"幼时","experience":"..."},{"age":"年少时","experience":"..."},{"age":"如今","experience":"..."}]}。'
                },
                { role: 'user', content: prompt }
            ]
        })
    });

    if (!response.ok) throw new Error(`API 生成失败：${response.status}`);
    const payload = await response.json();
    const generatedText = extractPrivateContactGeneratedText(payload);
    const generatedProfile = parsePrivateContactGeneratedProfile(generatedText);
    const hasLifeStages = Array.isArray(generatedProfile.lifeStages)
        ? generatedProfile.lifeStages.length > 0
        : Boolean(generatedProfile.lifeStages);
    const hasPhone = Boolean(String(generatedProfile.phoneDigits || generatedProfile.phoneNumber || '').replace(/\D/g, ''));
    if (!generatedProfile.signature || !generatedProfile.profession || !hasPhone || !generatedProfile.ipCity || !generatedProfile.homeAddress || !hasLifeStages) {
        throw new Error('API 返回字段不完整：必须包含签名、职业、手机号、IP城市、家庭住址和经历。');
    }
    return buildPrivateContactGeneratedProfile(record, generatedProfile, contact);
}



function normalizePrivateContactApiUsage(value = {}) {
    const source = value && typeof value === 'object' ? value : {};
    return {
        totalTokens: Math.max(0, Math.round(Number(source.totalTokens || source.total_tokens || source.totalTokenCount || 0) || 0)),
        promptTokens: Math.max(0, Math.round(Number(source.promptTokens || source.prompt_tokens || source.inputTokens || source.input_tokens || source.promptTokenCount || 0) || 0)),
        completionTokens: Math.max(0, Math.round(Number(source.completionTokens || source.completion_tokens || source.outputTokens || source.output_tokens || source.candidatesTokenCount || 0) || 0)),
        apiCalls: Math.max(0, Math.round(Number(source.apiCalls || source.api_calls || source.callCount || 0) || 0)),
        usageReports: Math.max(0, Math.round(Number(source.usageReports || source.usage_reports || 0) || 0)),
        lastUsageAt: Math.max(0, Number(source.lastUsageAt || source.last_usage_at || 0) || 0),
        lastModel: String(source.lastModel || source.last_model || '').trim().slice(0, 120),
        lastProvider: String(source.lastProvider || source.last_provider || '').trim().slice(0, 80)
    };
}

function extractPrivateContactApiUsagePayload(payload = {}) {
    const source = payload && typeof payload === 'object' ? payload : {};
    const usage = source.usage && typeof source.usage === 'object'
        ? source.usage
        : (source.usageMetadata && typeof source.usageMetadata === 'object' ? source.usageMetadata : null);
    if (!usage) return null;
    const promptTokens = Number(
        usage.prompt_tokens
        ?? usage.promptTokens
        ?? usage.input_tokens
        ?? usage.inputTokens
        ?? usage.promptTokenCount
        ?? usage.cache_creation_input_tokens
        ?? 0
    ) || 0;
    const completionTokens = Number(
        usage.completion_tokens
        ?? usage.completionTokens
        ?? usage.output_tokens
        ?? usage.outputTokens
        ?? usage.candidatesTokenCount
        ?? 0
    ) || 0;
    const totalTokens = Number(
        usage.total_tokens
        ?? usage.totalTokens
        ?? usage.totalTokenCount
        ?? usage.tokens
        ?? (promptTokens + completionTokens || 0)
    ) || 0;
    if (!(totalTokens > 0 || promptTokens > 0 || completionTokens > 0)) return null;
    return {
        totalTokens: Math.max(0, Math.round(totalTokens || promptTokens + completionTokens)),
        promptTokens: Math.max(0, Math.round(promptTokens)),
        completionTokens: Math.max(0, Math.round(completionTokens))
    };
}

function mergePrivateContactApiUsage(current = {}, usage = {}, meta = {}) {
    const base = normalizePrivateContactApiUsage(current);
    const incoming = extractPrivateContactApiUsagePayload({ usage }) || normalizePrivateContactApiUsage(usage);
    const now = Date.now();
    return normalizePrivateContactApiUsage({
        totalTokens: base.totalTokens + Math.max(0, Number(incoming.totalTokens) || 0),
        promptTokens: base.promptTokens + Math.max(0, Number(incoming.promptTokens) || 0),
        completionTokens: base.completionTokens + Math.max(0, Number(incoming.completionTokens) || 0),
        apiCalls: base.apiCalls + 1,
        usageReports: base.usageReports + (Math.max(0, Number(incoming.totalTokens || incoming.promptTokens || incoming.completionTokens) || 0) ? 1 : 0),
        lastUsageAt: now,
        lastModel: meta.model || base.lastModel,
        lastProvider: meta.provider || base.lastProvider
    });
}

function formatPrivateContactInteger(value = 0) {
    const number = Math.max(0, Math.round(Number(value) || 0));
    try {
        return number.toLocaleString('zh-CN');
    } catch (error) {
        return String(number);
    }
}

function getPrivateContactTokenStats(contactId = '', contact = null) {
    const safeContactId = normalizePrivateContactRecordId(contactId || contact?.id || '', '');
    const thread = safeContactId ? getPrivateContactChatThread(safeContactId) : null;
    const messages = normalizePrivateContactChatMessages(thread?.messages || []);
    const assistantCount = messages.filter(message => message.role === 'assistant').length;
    const userCount = messages.filter(message => message.role === 'user').length;
    const systemCount = messages.filter(message => message.role === 'system').length;
    const usage = normalizePrivateContactApiUsage(contact?.apiUsage || getPrivateContactById(safeContactId)?.apiUsage || {});
    return {
        usage,
        totalMessages: messages.length,
        assistantCount,
        userCount,
        systemCount,
        lastUsageAtText: usage.lastUsageAt ? formatPrivateContactArchiveTime(usage.lastUsageAt) : ''
    };
}

async function recordPrivateContactApiUsage(contactId = '', payload = {}, meta = {}) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '', '');
    if (!safeContactId) return null;
    const usage = extractPrivateContactApiUsagePayload(payload) || { totalTokens: 0, promptTokens: 0, completionTokens: 0 };
    const updated = await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        apiUsage: mergePrivateContactApiUsage(current.apiUsage || {}, usage, meta)
    }));
    await savePrivateState();
    const settingsPage = document.getElementById('private-contact-chat-settings-page');
    const settingsContactId = settingsPage?.querySelector('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || '';
    if (updated && settingsContactId === safeContactId) {
        void renderPrivateContactChatSettingsPage(safeContactId, { preserveScroll: true });
    }
    return updated?.apiUsage || null;
}

function isPrivateContactBackgroundKeepAliveEnabled(contactId = '') {
    const contact = getPrivateContactById(contactId);
    return Boolean(contact?.backgroundKeepAliveEnabled || contact?.keepAliveEnabled || contact?.backgroundKeepAlive);
}

async function requestPrivateBackgroundNotificationPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return Notification.permission;
    try {
        return await Notification.requestPermission();
    } catch (error) {
        return Notification.permission || 'default';
    }
}

async function setPrivateContactBackgroundKeepAliveEnabled(contactId = '', enabled = false) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '', '');
    if (!safeContactId) return null;
    const updated = await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        backgroundKeepAliveEnabled: Boolean(enabled)
    }));
    await savePrivateState();
    if (enabled) {
        const permission = await requestPrivateBackgroundNotificationPermission();
        if (permission === 'denied') {
            showPrivateSystemToast('后台保活已开启，但浏览器通知权限被拒绝；页面内横幅仍会逐条显示。');
        } else if (permission === 'unsupported') {
            showPrivateSystemToast('后台保活已开启；当前浏览器不支持系统通知，只显示页面横幅。');
        } else {
            showPrivateSystemToast(permission === 'granted' ? '后台保活已开启，会逐条弹出横幅和系统通知。' : '后台保活已开启；允许通知后可在后台显示系统横幅。');
        }
    } else {
        showPrivateSystemToast('后台保活已关闭。');
    }
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    return updated;
}

function getPrivateNotificationDefaultSettings() {
    return {
        enabled: true,
        soundEnabled: true,
        soundMode: 'synth',
        soundName: '合成提示音',
        soundDataUrl: '',
        backgroundPushEnabled: false
    };
}

function normalizePrivateNotificationSettings(value = {}) {
    const source = value && typeof value === 'object' ? value : {};
    const soundDataUrl = typeof source.soundDataUrl === 'string' && /^data:audio\//i.test(source.soundDataUrl)
        ? source.soundDataUrl
        : '';
    return {
        enabled: source.enabled !== false,
        soundEnabled: source.soundEnabled !== false,
        soundMode: soundDataUrl ? 'custom' : 'synth',
        soundName: soundDataUrl ? String(source.soundName || '自定义提示音').slice(0, 80) : '合成提示音',
        soundDataUrl,
        backgroundPushEnabled: Boolean(source.backgroundPushEnabled)
    };
}

function readPrivateNotificationSettings() {
    if (typeof window.rinnoGetNotificationSettings === 'function') {
        try {
            privateNotificationSettingsCache = normalizePrivateNotificationSettings(window.rinnoGetNotificationSettings());
            return privateNotificationSettingsCache;
        } catch (error) {
            console.warn('读取设置应用通知状态失败:', error);
        }
    }
    try {
        privateNotificationSettingsCache = normalizePrivateNotificationSettings(JSON.parse(window.localStorage.getItem('rinno_notification_settings') || 'null'));
    } catch (error) {
        privateNotificationSettingsCache = getPrivateNotificationDefaultSettings();
    }
    return privateNotificationSettingsCache;
}

window.rinnoGetNotificationSettings = window.rinnoGetNotificationSettings || (() => readPrivateNotificationSettings());
window.addEventListener('rinno:notification-settings-changed', event => {
    privateNotificationSettingsCache = normalizePrivateNotificationSettings(event.detail || {});
});

function isPrivateContactChatPageVisible(contactId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId || privateActiveContactChatId || '');
    const activeId = normalizePrivateContactRecordId(privateActiveContactChatId || '');
    const privateApp = document.getElementById('private-app');
    const chatScreen = document.querySelector('.private-chat-screen');
    const chatPage = document.getElementById('private-contact-chat-page');
    return Boolean(
        safeContactId
        && activeId === safeContactId
        && privateApp?.classList.contains('active')
        && document.body.classList.contains('private-open')
        && getActivePrivateScreenName() === 'chat'
        && chatScreen?.getAttribute('data-private-current-tab') === 'contact-chat'
        && chatPage?.classList.contains('active')
    );
}

function ensurePrivateChatNotificationBanner() {
    let banner = document.getElementById('private-chat-notification-banner');
    if (banner) return banner;
    banner = document.createElement('button');
    banner.id = 'private-chat-notification-banner';
    banner.className = 'private-chat-notification-banner interactive';
    banner.type = 'button';
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', '打开私叙消息');
    banner.hidden = true;
    banner.innerHTML = `
        <span class="private-chat-notification-face" aria-hidden="true"></span>
        <span class="private-chat-notification-copy">
            <span class="private-chat-notification-head">
                <strong class="private-chat-notification-name"></strong>
                <em class="private-chat-notification-time"></em>
            </span>
            <span class="private-chat-notification-text"></span>
        </span>
        <span class="private-chat-notification-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>
        </span>
    `;
    banner.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const contactId = banner.getAttribute('data-contact-id') || '';
        openPrivateNotificationTarget(contactId);
    });
    document.body.appendChild(banner);
    return banner;
}

function getPrivateNotificationTimeLabel(createdAt = Date.now()) {
    const date = new Date(Number(createdAt) || Date.now());
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function renderPrivateChatNotificationBanner(item) {
    const banner = ensurePrivateChatNotificationBanner();
    const contact = item?.contact || {};
    const message = item?.message || {};
    const name = getPrivateContactDisplayName(contact);
    const face = banner.querySelector('.private-chat-notification-face');
    const nameEl = banner.querySelector('.private-chat-notification-name');
    const timeEl = banner.querySelector('.private-chat-notification-time');
    const textEl = banner.querySelector('.private-chat-notification-text');
    const avatar = String(contact.avatar || '').trim();
    if (face) {
        face.classList.toggle('has-image', Boolean(avatar));
        face.style.backgroundImage = avatar ? `url("${avatar.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")` : '';
        face.textContent = avatar ? '' : (getPrivateContactInitial(contact) || Array.from(name)[0] || '私');
    }
    if (nameEl) nameEl.textContent = name;
    if (timeEl) timeEl.textContent = getPrivateNotificationTimeLabel(message.createdAt);
    if (textEl) textEl.textContent = getPrivateContactChatMessageSummary(message, 80) || '收到一条新消息';
    banner.setAttribute('data-contact-id', String(contact.id || item?.contactId || ''));
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('active'));
    privateChatNotificationBannerVisible = true;
}

function hidePrivateChatNotificationBanner(instant = false) {
    const banner = document.getElementById('private-chat-notification-banner');
    if (!banner) return;
    window.clearTimeout(privateChatNotificationBannerTimer);
    banner.classList.remove('active');
    privateChatNotificationBannerVisible = false;
    const hide = () => {
        if (!banner.classList.contains('active')) banner.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 220);
}

function showNextPrivateChatNotificationBanner() {
    if (privateChatNotificationBannerVisible) return;
    const next = privateChatNotificationBannerQueue.shift();
    if (!next) return;
    renderPrivateChatNotificationBanner(next);
    window.clearTimeout(privateChatNotificationBannerTimer);
    privateChatNotificationBannerTimer = window.setTimeout(() => {
        hidePrivateChatNotificationBanner();
        window.setTimeout(showNextPrivateChatNotificationBanner, 260);
    }, 4200);
}

function playPrivateNotificationSynthSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
        const context = new AudioContextClass();
        const now = context.currentTime;
        [0, 0.16].forEach((offset, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(index ? 880 : 660, now + offset);
            gain.gain.setValueAtTime(0.0001, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.16, now + offset + 0.024);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.17);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start(now + offset);
            oscillator.stop(now + offset + 0.2);
        });
        window.setTimeout(() => context.close().catch(() => {}), 520);
        return true;
    } catch (error) {
        return false;
    }
}

function playPrivateNotificationSound(settings = readPrivateNotificationSettings()) {
    if (!settings.enabled || !settings.soundEnabled) return;
    if (settings.soundDataUrl) {
        try {
            if (privateChatNotificationSoundAudio) {
                privateChatNotificationSoundAudio.pause();
                privateChatNotificationSoundAudio.currentTime = 0;
            }
            privateChatNotificationSoundAudio = new Audio(settings.soundDataUrl);
            privateChatNotificationSoundAudio.volume = 0.78;
            privateChatNotificationSoundAudio.play().catch(() => playPrivateNotificationSynthSound());
            return;
        } catch (error) {
            // Fall through to synth.
        }
    }
    playPrivateNotificationSynthSound();
}

async function showPrivateBrowserNotification(contact, message, settings = readPrivateNotificationSettings()) {
    if (!settings.enabled && !settings.backgroundPushEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const contactId = String(contact?.id || '').trim();
    const title = getPrivateContactDisplayName(contact || {}) || '私叙';
    const body = getPrivateContactChatMessageSummary(message, 120) || '收到一条新消息';
    const data = { app: 'private', contactId };
    const avatarIcon = String(contact?.avatar || '').trim();
    const safeIcon = /^(https?:\/\/|data:image\/|blob:|file:)/i.test(avatarIcon) ? avatarIcon : 'icon-192.png';
    const options = {
        body,
        tag: `rinno-private-${contactId || 'thread'}-${message?.id || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        renotify: true,
        data,
        icon: safeIcon,
        badge: 'icon-192.png',
        requireInteraction: false
    };
    try {
        if (navigator.serviceWorker?.ready) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, options);
            return;
        }
    } catch (error) {
        console.warn('Service Worker 通知失败，改用页面通知:', error);
    }
    try {
        new Notification(title, options);
    } catch (error) {
        console.warn('浏览器通知失败:', error);
    }
}

function shouldShowPrivateBrowserNotification(settings, contactId = '', force = false) {
    if (force) return true;
    if (!settings.enabled || !settings.backgroundPushEnabled) return false;
    return Boolean(document.hidden || !document.hasFocus?.() || !document.body.classList.contains('private-open') || !isPrivateContactChatPageVisible(contactId));
}

function notifyPrivateContactChatOutput(contactId, message) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '');
    if (!safeContactId || !message) return;
    if (isPrivateContactChatPageVisible(safeContactId)) return;
    const settings = readPrivateNotificationSettings();
    const keepAlive = isPrivateContactBackgroundKeepAliveEnabled(safeContactId);
    if (!settings.enabled && !keepAlive) return;
    const contact = getPrivateContactById(safeContactId) || { id: safeContactId, title: '私叙' };
    privateChatNotificationBannerQueue.push({ contactId: safeContactId, contact, message });
    showNextPrivateChatNotificationBanner();
    playPrivateNotificationSound({ ...settings, enabled: settings.enabled || keepAlive });
    if (shouldShowPrivateBrowserNotification(settings, safeContactId, keepAlive)) {
        showPrivateBrowserNotification(contact, message, { ...settings, enabled: true, backgroundPushEnabled: true });
    }
}

function openPrivateNotificationTarget(contactId = '') {
    const safeContactId = normalizePrivateContactRecordId(contactId || '');
    hidePrivateChatNotificationBanner(true);
    if (typeof openPrivateApp === 'function') void openPrivateApp();
    window.setTimeout(() => {
        showPrivateScreen('chat');
        if (safeContactId && getPrivateContactById(safeContactId)) {
            openPrivateContactChat(safeContactId, 'contacts');
        }
    }, 80);
}

navigator.serviceWorker?.addEventListener?.('message', event => {
    const data = event.data || {};
    if (data.type !== 'RINNO_OPEN_PRIVATE_CHAT') return;
    openPrivateNotificationTarget(data.contactId || '');
});

window.addEventListener('focus', () => {
    if (!privateChatNotificationBannerVisible) showNextPrivateChatNotificationBanner();
});

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('rinnoOpen') === 'private') {
        openPrivateNotificationTarget(params.get('contactId') || '');
    }
});

function detectPrivateContactChatPersonaDriftIssues(rawText = '', plan = []) {
    const issues = [];
    const text = String(rawText || '').trim();
    const cleaned = stripPrivateContactChatPlanText(text).trim();
    const visiblePlan = Array.isArray(plan) ? plan.filter(Boolean) : [];
    const combinedPlanText = visiblePlan.map(item => [
        item?.content,
        item?.targetText,
        item?.target_text,
        item?.message,
        item?.note,
        item?.voice?.transcript
    ].filter(Boolean).join(' ')).join('\n');
    const probe = `${text}\n${combinedPlanText}`;
    if (!text) issues.push('API 没有返回可见文本。');
    if (cleaned && cleaned[0] !== '[') issues.push('回复不是合法 JSON Array。');
    if (!visiblePlan.length) issues.push('没有解析到可用回复对象。');
    if (!visiblePlan.some(item => item && PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES.has(item.type))) {
        issues.push('没有可见聊天回复。');
    }
    if (/(作为\s*(?:AI|人工智能)|我是(?:一个)?(?:AI|语言模型|大模型)|语言模型|大模型)/i.test(probe)) {
        issues.push('出现 AI / 语言模型自我暴露。');
    }
    if (/(系统提示|系统规则|提示词|开发者指令|安全政策|内容政策|规则要求|模型版本)/i.test(probe)) {
        issues.push('暴露系统提示词或规则。');
    }
    if (/(思维链|推理过程|内部推理|分析过程|<think>|<\/think>)/i.test(probe)) {
        issues.push('暴露思维链或推理过程。');
    }
    if (/(输入分析|人设校验|情感演变|关系评估|输出规划|偏差纠正)\s*[:：]/i.test(probe)) {
        issues.push('输出了回复前检查流程标题。');
    }
    if (/(?:^|\n)\s*(?:步骤|分析|报告|总结|结论)\s*(?:\d+|[一二三四五六七八九十])?[、.：:]/i.test(probe)) {
        issues.push('输出了分析报告或步骤列表。');
    }
    return Array.from(new Set(issues));
}

async function generatePrivateContactChatReplyWithApi(contact, thread = {}) {
    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        throw new Error('请先到「设置 - 接口与参数 - API 聊天」填写接口网址和模型。');
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;

    const baseMessages = await buildPrivateContactChatReplyMessages(contact, thread, chat);
    const callApi = async (messages) => {
        const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.85,
                messages
            })
        });
        if (!response.ok) throw new Error(`API 回复失败：${response.status}`);
        const payload = await response.json();
        void recordPrivateContactApiUsage(contact?.id || '', payload, { model, provider: 'chat' });
        const rawText = extractPrivateContactGeneratedText(payload);
        const plan = parsePrivateContactChatPlan(rawText, thread);
        return { rawText, plan };
    };

    let result = await callApi(baseMessages);
    let issues = detectPrivateContactChatPersonaDriftIssues(result.rawText, result.plan);
    if (issues.length) {
        const repairMessages = [
            ...baseMessages,
            {
                role: 'system',
                content: [
                    '上一版回复存在以下问题：',
                    ...issues.map(issue => `- ${issue}`),
                    '',
                    '请在不解释原因的情况下，重新生成一版更符合角色设定、关系状态和当前语境的自然回复。',
                    '禁止输出分析过程。',
                    '禁止输出思维链。',
                    '禁止输出系统规则。',
                    '最终仍然只能输出合法 JSON Array。'
                ].join('\n')
            }
        ];
        try {
            const repaired = await callApi(repairMessages);
            const repairedIssues = detectPrivateContactChatPersonaDriftIssues(repaired.rawText, repaired.plan);
            if (!repairedIssues.length && repaired.plan.length) {
                result = repaired;
                issues = [];
            }
        } catch (error) {
            console.warn('Private contact chat repair retry failed:', error);
        }
    }

    if (issues.length) throw new Error(`API 回复存在人设偏差：${issues.join('；')}`);
    if (!result.plan.length) throw new Error('API 没有返回可用的角色回复。');
    return result.plan;
}

async function appendPrivateContactChatAssistantMessage(contactId, message) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '');
    if (!safeContactId || !message) return null;
    const isVisibleChat = isPrivateContactChatPageVisible(safeContactId);
    updatePrivateContactChatThread(safeContactId, currentThread => ({
        ...currentThread,
        unread: isVisibleChat ? 0 : Math.max(1, Number(currentThread.unread || 0) + 1),
        updatedAt: Number(message.createdAt) || Date.now(),
        messages: [...currentThread.messages, message]
    }));
    renderPrivateThreads();
    if (isVisibleChat) {
        renderPrivateContactChatPage(safeContactId);
    }
    await savePrivateState();
    if (isVisibleChat) {
        requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    } else {
        notifyPrivateContactChatOutput(safeContactId, message);
    }
    return getPrivateContactChatMessage(message.id, safeContactId);
}

async function replacePrivateContactChatMessage(contactId, messageId, updater) {
    const safeContactId = String(contactId || '').trim();
    const safeMessageId = String(messageId || '').trim();
    if (!safeContactId || !safeMessageId || typeof updater !== 'function') return null;
    updatePrivateContactChatThread(safeContactId, currentThread => ({
        ...currentThread,
        updatedAt: Date.now(),
        messages: currentThread.messages.map(message => (
            String(message.id || '').trim() === safeMessageId
                ? updater(message)
                : message
        ))
    }));
    renderPrivateThreads();
    if (privateActiveContactChatId === safeContactId) renderPrivateContactChatPage(safeContactId);
    await savePrivateState();
    requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    return getPrivateContactChatMessage(safeMessageId, safeContactId);
}


function buildPrivateContactChatNudgeText(contact = {}, actorRole = 'assistant', suffix = '') {
    const safeContact = contact ? getPrivateHydratedContact(contact) : null;
    const contactName = getPrivateContactDisplayName(safeContact || {}) || 'TA';
    const safeSuffix = actorRole === 'user'
        ? normalizePrivateContactNudgeSuffix(suffix ?? safeContact?.userNudgeSuffix, '')
        : normalizePrivateContactNudgeSuffix(suffix ?? safeContact?.contactNudgeSuffix, '');
    return actorRole === 'user'
        ? `你拍了拍${contactName}${safeSuffix}`
        : `${contactName}拍了拍你${safeSuffix}`;
}

async function appendPrivateContactChatNudgeEvent(contactId, actorRole = 'assistant', suffix = '') {
    const safeContactId = String(contactId || '').trim();
    const contact = getPrivateContactById(safeContactId);
    if (!safeContactId || !contact) return false;
    const text = buildPrivateContactChatNudgeText(contact, actorRole, suffix);
    const eventMessage = {
        id: createPrivateContactChatMessageId('nudge'),
        role: 'system',
        type: 'system',
        content: createPrivateContactSystemCapsuleText(text),
        createdAt: Date.now()
    };
    const isVisibleChat = isPrivateContactChatPageVisible(safeContactId);
    updatePrivateContactChatThread(safeContactId, thread => ({
        ...thread,
        unread: actorRole === 'assistant' && !isVisibleChat ? Math.max(1, Number(thread.unread || 0) + 1) : 0,
        updatedAt: Date.now(),
        messages: [
            ...thread.messages,
            eventMessage
        ]
    }));
    renderPrivateThreads();
    if (isVisibleChat) renderPrivateContactChatPage(safeContactId);
    await savePrivateState();
    if (isVisibleChat) {
        requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    } else if (actorRole === 'assistant') {
        notifyPrivateContactChatOutput(safeContactId, eventMessage);
    }
    return true;
}

async function sendPrivateContactChatUserNudge(contactId = privateActiveContactChatId) {
    const safeContactId = String(contactId || privateActiveContactChatId || '').trim();
    if (!safeContactId || privateContactChatSendingId) return false;
    const contact = getPrivateContactById(safeContactId);
    if (!contact) return false;
    exitPrivateContactChatSelectionMode();
    closePrivateContactChatActionMenu(true);
    closePrivateContactChatComposerPanels();
    const handled = await appendPrivateContactChatNudgeEvent(safeContactId, 'user', contact.userNudgeSuffix);
    if (handled) {
        void maybeTriggerPrivateContactAutoSummary(safeContactId);
    }
    return handled;
}

async function applyPrivateContactChatAssistantInstruction(contact, instruction) {
    const safeContactId = String(contact?.id || '').trim();
    if (!safeContactId || !instruction) return false;

    if (instruction.type === 'action_nudge') {
        const nextSuffix = normalizePrivateContactNudgeSuffix(instruction.suffix, '');
        if (nextSuffix) {
            await updatePrivateStoredContact(safeContactId, current => ({
                ...current,
                contactNudgeSuffix: nextSuffix
            }));
        }
        await appendPrivateContactChatNudgeEvent(safeContactId, 'assistant', nextSuffix || contact?.contactNudgeSuffix);
        return true;
    }

    if (['open_red_packet', 'accept_transaction', 'refund_transaction', 'return_transaction'].includes(instruction.type)) {
        return applyPrivateContactChatAssistantPaymentAction(contact, instruction);
    }

    if (instruction.type === 'recall_msg') {
        const tempMessage = {
            id: createPrivateContactChatMessageId('assistant'),
            role: 'assistant',
            type: 'text',
            content: instruction.content,
            translation: normalizePrivateContactChatTranslationText(instruction.translation || instruction.translation_zh || ''),
            createdAt: Date.now()
        };
        await appendPrivateContactChatAssistantMessage(safeContactId, tempMessage);
        await new Promise(resolve => window.setTimeout(resolve, PRIVATE_CONTACT_CHAT_ASSISTANT_RECALL_DELAY_MS));
        await replacePrivateContactChatMessage(safeContactId, tempMessage.id, currentMessage => (
            buildPrivateContactChatRecalledMessage(currentMessage, {
                actorRole: 'assistant',
                actorName: getPrivateContactDisplayName(contact)
            })
        ));
        return true;
    }

    if (['camera', 'voice', 'location', 'sticker', 'red_packet', 'transaction', 'gift_receipt'].includes(instruction.type)) {
        const richMessage = {
            id: createPrivateContactChatMessageId(instruction.type),
            role: 'assistant',
            type: instruction.type,
            content: instruction.content || '',
            media: instruction.media || null,
            voice: instruction.voice || null,
            location: instruction.location || null,
            sticker: instruction.sticker || null,
            redPacket: instruction.redPacket || instruction.red_packet || null,
            transaction: instruction.transaction || null,
            giftReceipt: instruction.giftReceipt || instruction.gift_receipt || instruction.gift || null,
            translation: normalizePrivateContactChatTranslationText(instruction.translation || instruction.translation_zh || ''),
            createdAt: Date.now()
        };
        if (instruction.type === 'red_packet') {
            const packet = normalizePrivateContactChatRedPacketPayload(richMessage.redPacket || {}, richMessage);
            if (packet) richMessage.redPacket = { ...packet, status: packet.status === 'received' ? 'active' : packet.status };
        }
        if (instruction.type === 'transaction') {
            const tx = normalizePrivateContactChatTransactionPayload(richMessage.transaction || {}, richMessage);
            if (tx) richMessage.transaction = { ...tx, status: tx.status === 'accepted' || tx.status === 'received' ? 'pending' : tx.status };
        }
        if (instruction.type === 'gift_receipt') {
            const gift = normalizePrivateContactChatGiftReceiptPayload(richMessage.giftReceipt || {}, richMessage);
            if (gift) richMessage.giftReceipt = gift;
        }
        await appendPrivateContactChatAssistantMessage(safeContactId, richMessage);
        return true;
    }

    const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
    const targetMessage = instruction.type === 'reply'
        ? findPrivateContactChatReplyTarget(thread, instruction.targetText)
        : null;
    const message = {
        id: createPrivateContactChatMessageId('assistant'),
        role: 'assistant',
        content: instruction.content,
        translation: normalizePrivateContactChatTranslationText(instruction.translation || instruction.translation_zh || ''),
        createdAt: Date.now(),
        quote: targetMessage ? buildPrivateContactChatQuotePayload(targetMessage, safeContactId) : null
    };
    await appendPrivateContactChatAssistantMessage(safeContactId, message);
    return true;
}

async function applyPrivateContactChatAssistantPlan(contact, plan = []) {
    const normalizedPlan = expandPrivateContactChatAssistantPlan(plan, contact);
    if (!normalizedPlan.length) return false;
    let applied = false;
    for (let index = 0; index < normalizedPlan.length; index += 1) {
        const instruction = normalizedPlan[index];
        const waitMs = getPrivateContactChatAssistantPlanDelay(instruction, index);
        if (waitMs > 0) {
            await new Promise(resolve => window.setTimeout(resolve, waitMs));
        }
        const handled = await applyPrivateContactChatAssistantInstruction(contact, instruction);
        applied = handled || applied;
    }
    return applied;
}


function getPrivateContactChatAdvancedPlanText(plan = []) {
    return (Array.isArray(plan) ? plan : []).map(item => {
        if (!item || typeof item !== 'object') return '';
        return [
            item.content,
            item.message,
            item.note,
            item.targetText,
            item.target_text,
            item.voice?.transcript,
            Array.isArray(item.items) ? item.items.map(gift => `${gift?.name || ''} ${gift?.desc || ''}`).join(' ') : ''
        ].filter(Boolean).join(' ');
    }).filter(Boolean).join('\n');
}

function buildPrivateContactChatAdvancedStateDelta(thread = {}, plan = []) {
    const messages = normalizePrivateContactChatMessages(thread?.messages);
    const latestUser = [...messages].reverse().find(message => message.role === 'user');
    const userText = String(latestUser ? getPrivateContactChatPlainText(latestUser) : '').toLowerCase();
    const replyText = String(getPrivateContactChatAdvancedPlanText(plan)).toLowerCase();
    const delta = {
        intimacy: 0,
        initiative: 0,
        dependence: 0,
        possessiveness: 0,
        emotionalStability: 0,
        boundary: 0
    };
    if (/(想你|喜欢你|爱你|担心你|在乎你|抱抱|陪你|关心|辛苦|有没有好点|miss you|love you|care about you)/i.test(userText)) {
        delta.intimacy += 1;
        delta.dependence += 1;
    }
    if (/(别烦|不想|算了|随便|不用|别管|离我远|拒绝|不要|没空|冷静一下|停|leave me alone|no thanks)/i.test(userText)) {
        delta.intimacy -= 1;
        delta.boundary += 1;
    }
    if (/(要不要|一起|见面|来找|我去|我给你|我刚|我在|我今天|陪我|陪你|下次|明天|今晚|现在过来|发给你|share|come over)/i.test(replyText)) {
        delta.initiative += 1;
    }
    if (/(吃醋|不许|别跟|谁啊|你在哪|查岗|离.*远点|只能|我的|归我|不准|凭什么|jealous|mine)/i.test(replyText)) {
        delta.possessiveness += 1;
    }
    if (/(崩溃|受不了|别逼我|疯了|气死|烦死|滚|混蛋|恨你|哭死|歇斯底里|can't stand|mad at you)/i.test(replyText)) {
        delta.emotionalStability -= 1;
    }
    if (/(没关系|慢慢来|不用勉强|我知道|我退一步|随你|别急|先这样|有分寸|你先忙|不逼你|take your time)/i.test(replyText)) {
        delta.boundary += 1;
        delta.emotionalStability += 1;
    }
    return Object.fromEntries(Object.entries(delta).map(([key, value]) => [key, clampPrivateCharacterAdvancedDelta(value, -3, 3)]));
}

async function updatePrivateContactChatAdvancedStateAfterReply(contactId, thread = {}, plan = []) {
    const safeContactId = normalizePrivateContactRecordId(contactId || '', '');
    if (!safeContactId) return null;
    try {
        const current = await getCharacterAdvancedSettings(safeContactId);
        const delta = buildPrivateContactChatAdvancedStateDelta(thread, plan);
        const hasDelta = Object.values(delta).some(value => Number(value) !== 0);
        if (!hasDelta) return current;
        const targetState = { ...(current.personalityState || {}) };
        PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.forEach(item => {
            targetState[item.key] = clampPrivateContactChatPersonaScore((targetState[item.key] ?? 50) + (delta[item.key] || 0));
        });
        const updated = await updateCharacterPersonalityState(safeContactId, targetState);
        const settingsPage = document.getElementById('private-contact-chat-settings-page');
        const settingsContactId = settingsPage?.querySelector('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || '';
        if (settingsPage && settingsContactId === safeContactId) {
            void renderPrivateContactChatSettingsPage(safeContactId, { preserveScroll: true });
        }
        return updated;
    } catch (error) {
        console.warn('回复后更新高级拟真状态失败:', error);
        return null;
    }
}

async function requestPrivateContactChatAssistantReply(contact) {
    if (!PRIVATE_CONTACT_CHAT_AUTO_REPLY_ENABLED || !contact) return false;
    const safeContact = getPrivateHydratedContact(contact);
    const safeContactId = String(safeContact?.id || '').trim();
    if (!safeContactId || privateContactChatSendingId) return false;

    privateContactChatSendingId = safeContactId;
    renderPrivateThreads();
    if (privateActiveContactChatId === safeContactId) renderPrivateContactChatPage(safeContactId);

    try {
        const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
        let plan = [];
        try {
            plan = await generatePrivateContactChatReplyWithApi(safeContact, thread);
        } catch (error) {
            console.warn('Private contact chat reply failed:', error);
            plan = buildPrivateContactChatFallbackPlan(safeContact, thread);
        }
        plan = enforcePrivateContactChatPersonaDriftGuard(plan, safeContact, thread);
        plan = enforcePrivateContactChatRichInstructionPolicy(plan, safeContact, thread);
        plan = enforcePrivateContactChatPersonaDriftGuard(plan, safeContact, thread);
        const hasVisibleReply = plan.some(item => item && PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES.has(item.type));
        if (!hasVisibleReply) {
            const fallbackPair = buildPrivateContactChatFallbackReplyPair(safeContact, thread);
            if (fallbackPair.content) {
                plan.push({
                    type: 'text',
                    content: fallbackPair.content,
                    translation: fallbackPair.translation
                });
            }
        }
        const applied = await applyPrivateContactChatAssistantPlan(safeContact, plan);
        if (applied) {
            await updatePrivateContactChatAdvancedStateAfterReply(safeContactId, thread, plan);
            await maybeTriggerPrivateContactAutoSummary(safeContactId);
        }
        return applied;
    } finally {
        privateContactChatSendingId = '';
        renderPrivateThreads();
        if (privateActiveContactChatId === safeContactId) {
            renderPrivateContactChatPage(safeContactId);
            requestAnimationFrame(() => {
                document.getElementById('private-contact-chat-input')?.focus();
                scrollPrivateContactChatContentToBottom('smooth');
            });
        }
    }
}

function renderPrivateContactAccountResults() {
    const input = document.getElementById('private-contact-account-input');
    const results = document.getElementById('private-contact-account-results');
    if (!results) return;
    const rawQuery = String(input?.value || '').trim();
    if (!rawQuery) {
        results.innerHTML = '<div class="private-contact-account-empty">粘贴 CHAR / NPC 的账号 ID，系统只会按完整账号精确匹配。</div>';
        return;
    }

    const accountId = normalizePrivateDossierAccount(rawQuery);
    if (!accountId) {
        results.innerHTML = '<div class="private-contact-account-empty">请输入 8-10 位纯数字账号 ID。</div>';
        return;
    }

    const record = findPrivateDossierAccountRecord(accountId);
    if (!record) {
        results.innerHTML = '<div class="private-contact-account-empty">没有找到此账号。</div>';
        return;
    }

    const label = record.type === 'npc' ? 'NPC' : 'CHAR';
    const pendingKey = getPrivateDossierContactId(record);
    const added = isPrivateDossierContactAdded(record);
    const generating = privatePendingContactGenerationKeys.has(pendingKey);
    const displayName = record.nickname || record.name;
    const avatarStyle = record.avatar ? ` style="background-image:url(&quot;${escapePrivateHtml(record.avatar)}&quot;)"` : '';
    results.innerHTML = `
        <article class="private-contact-account-card">
            <div class="private-contact-account-face ${record.avatar ? 'has-image' : ''}"${avatarStyle} aria-hidden="true">${escapePrivateHtml(label.slice(0, 1))}</div>
            <div class="private-contact-account-copy">
                <span>${escapePrivateHtml(label)} / 精确命中</span>
                <strong>${escapePrivateHtml(displayName)}</strong>
                <small>ID ${escapePrivateHtml(record.accountId)} · ${escapePrivateHtml(record.name)}</small>
                <p>${escapePrivateHtml(record.setting || '这个账号还没有写下更多设定。')}</p>
            </div>
            <button class="private-contact-account-add interactive" type="button"
                data-private-add-dossier-type="${escapePrivateHtml(record.type)}"
                data-private-add-dossier-record="${escapePrivateHtml(record.recordId)}"
                data-private-add-dossier-account="${escapePrivateHtml(record.accountId)}"
                ${added || generating ? 'disabled' : ''}>${added ? '已添加' : generating ? '生成中' : '添加'}</button>
        </article>
    `;
}

function openPrivateContactAccountModal() {
    const modal = document.getElementById('private-contact-account-modal');
    const input = document.getElementById('private-contact-account-input');
    if (!modal) return;
    privateContactAccountModalReadyAt = Date.now() + 500;
    if (input) input.value = '';
    renderPrivateContactAccountResults();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    focusPrivateCenteredModalField(input);
}

function closePrivateContactAccountModal(instant = false, options = {}) {
    const modal = document.getElementById('private-contact-account-modal');
    if (!modal) return;
    const force = Boolean(options.force);
    if (!force && privatePendingContactGenerationKeys.size > 0) {
        showPrivateSystemToast('联系人资料仍在生成中，请等待完成。');
        return;
    }
    modal.classList.remove('active');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

async function addPrivateDossierContact(type, recordId, accountId) {
    if (Date.now() < privateContactAccountModalReadyAt) return false;
    const safeType = normalizePrivateDossierType(type);
    const safeRecordId = String(recordId || '').trim();
    const safeAccountId = normalizePrivateDossierAccount(accountId);
    const record = getPrivateDossierAccountRecords().find(item => (
        item.type === safeType
        && item.recordId === safeRecordId
        && item.accountId === safeAccountId
    ));
    if (!record) {
        showPrivateSystemToast('账号没有精确命中，未添加。');
        renderPrivateContactAccountResults();
        return false;
    }
    if (isPrivateDossierContactAdded(record)) {
        showPrivateSystemToast('这个账号已在通讯里。');
        renderPrivateContactAccountResults();
        return false;
    }

    const pendingKey = getPrivateDossierContactId(record);
    if (privatePendingContactGenerationKeys.has(pendingKey)) return false;

    privatePendingContactGenerationKeys.add(pendingKey);
    renderPrivateContactAccountResults();
    showPrivateSystemToast('正在调用 API 生成联系人资料...');

    try {
        const generatedProfile = await generatePrivateContactProfileWithApi(record);
        if (!generatedProfile || typeof generatedProfile !== 'object') {
            throw new Error('API 没有返回可保存的联系人资料。');
        }

        const contact = {
            ...createPrivateDossierContact(record),
            ...generatedProfile
        };
        const contacts = getPrivateScopedContacts()
            .filter(item => item.id !== contact.id)
            .filter(item => normalizePrivateDossierAccount(item.accountId) !== record.accountId)
            .filter(item => !(
                item.dossierType === record.type
                && item.dossierRecordId === record.recordId
                && normalizePrivateDossierAccount(item.accountId) === record.accountId
            ));
        setPrivateScopedContacts([contact, ...contacts].slice(0, 24));
        await savePrivateState();
        renderPrivateContacts();
        renderPrivateThreads();
        refreshPrivateContactLinkedSurfaces(contact.id, { preserveSettingsScroll: true });
        closePrivateContactAccountModal(false, { force: true });
        showPrivateSystemToast(`已生成并添加 ${record.type === 'npc' ? 'NPC' : 'CHAR'}「${record.nickname || record.name}」。`);
        return true;
    } catch (error) {
        console.warn('Private contact generation failed:', error);
        showPrivateSystemToast(error?.message || '联系人资料生成失败，请检查 API 配置。');
        return false;
    } finally {
        privatePendingContactGenerationKeys.delete(pendingKey);
        renderPrivateContactAccountResults();
    }
}

function setPrivateEditableText(selector, value) {
    const el = document.querySelector(selector);
    if (!el || document.activeElement === el) return;
    el.textContent = value;
}

function renderPrivateThreads() {
    const list = document.getElementById('private-thread-list');
    if (!list) return;
    privateState.threads = normalizePrivateThreads(privateState.threads);
    const count = document.getElementById('private-thread-count');
    const items = buildPrivateContactChatPreviewItems();
    if (count) count.textContent = `${items.length} threads`;
    if (!items.length) {
        list.innerHTML = '<div class="private-empty-state" role="status">No private threads yet.</div>';
        return;
    }
    list.innerHTML = items.map(item => {
        const contact = item.contact;
        const markClass = contact?.avatar ? 'private-thread-mark has-image' : 'private-thread-mark';
        const markStyle = contact?.avatar
            ? ` style="background-image:url(&quot;${escapePrivateHtml(contact.avatar)}&quot;)"`
            : '';
        return `
            <article class="private-thread-card interactive" data-private-thread-contact="${escapePrivateHtml(contact.id)}" aria-current="false" aria-selected="false">
                <div class="${markClass}"${markStyle} aria-hidden="true">${contact?.avatar ? '' : escapePrivateHtml(getPrivateContactInitial(contact))}</div>
                <div class="private-thread-copy">
                    <div class="private-thread-title">${escapePrivateHtml(getPrivateContactDisplayName(contact))}</div>
                    <div class="private-thread-sub">${escapePrivateHtml(buildPrivateContactChatSubtitle(contact))}</div>
                    <div class="private-thread-last">${escapePrivateHtml(item.preview || 'Start a private chat.')}</div>
                </div>
                <div class="private-thread-side">
                    <div class="private-thread-time">${escapePrivateHtml(item.time || 'Now')}</div>
                    ${item.unread ? `<div class="private-thread-badge">${escapePrivateHtml(String(item.unread))}</div>` : '<div aria-hidden="true"></div>'}
                </div>
            </article>
        `;
    }).join('');
}

function getPrivateContactById(contactId) {
    const rawId = String(contactId || '').trim();
    if (!rawId) return null;
    const id = normalizePrivateContactRecordId(rawId);
    return getPrivateScopedContacts()
        .map(getPrivateHydratedContact)
        .find(contact => String(contact?.id || '') === id) || null;
}

function getPrivateContactProfileRecord(contact) {
    const dossierType = normalizePrivateDossierType(contact?.dossierType);
    const recordId = String(contact?.dossierRecordId || '').trim();
    const accountId = normalizePrivateDossierAccount(contact?.accountId);
    if (!recordId || !accountId) return null;
    return getPrivateDossierAccountRecords().find(item => (
        item.type === dossierType
        && item.recordId === recordId
        && item.accountId === accountId
    )) || null;
}

function getPrivateContactInitial(contact) {
    const source = String(getPrivateContactDisplayName(contact) || contact?.subtitle || getPrivateContactMark(contact) || '?').trim();
    return Array.from(source)[0]?.toUpperCase() || '?';
}

function createPrivateContactPreviewAvatarMarkup(contact) {
    if (contact?.avatar) {
        return `<span class="private-contact-avatar has-image" aria-hidden="true"><img src="${escapePrivateHtml(contact.avatar)}" alt=""></span>`;
    }
    return `<span class="private-contact-avatar" aria-hidden="true">${escapePrivateHtml(getPrivateContactInitial(contact))}</span>`;
}

function createPrivateContactProfileAvatarMarkup(contact) {
    if (contact?.avatar) {
        return `<span class="dossier-profile-avatar has-image" aria-hidden="true"><img src="${escapePrivateHtml(contact.avatar)}" alt=""></span>`;
    }
    return `<span class="dossier-profile-avatar" aria-hidden="true">${escapePrivateHtml(getPrivateContactInitial(contact))}</span>`;
}

function createPrivateContactHomepageCoverStyle(contact) {
    const cover = String(contact?.homepageCover || '').trim();
    return cover
        ? ` style="--private-contact-homepage-cover-image:url(&quot;${escapePrivateHtml(cover)}&quot;);background-image:url(&quot;${escapePrivateHtml(cover)}&quot;)"`
        : '';
}

function createPrivateContactSignature(contact, record) {
    const explicit = normalizePrivateContactSignature(contact?.signature || contact?.tagline);
    if (explicit) return explicit;
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    return normalizePrivateContactSignature(profile.signature) || '把距离放轻，把真心放深';
}

function createPrivateContactProfileParagraphs(value) {
    const text = String(value || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
    const safeText = escapePrivateHtml(text || 'No profile note yet.');
    return safeText
        .split(/\n{2,}/)
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => `<p>${part.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function getPrivateContactAboutLabel(record, contact) {
    return '关于TA';
}

function createPrivateContactMetaEntries(contact, record) {
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    return [
        ['职业', profile.profession || '待生成'],
        ['手机号', profile.phoneNumber || '待生成'],
        ['IP城市定位', profile.ipCity || '待生成'],
        ['家庭住址', profile.homeAddress || '待生成']
    ];
}

function createPrivateContactSectionHead(kicker, title, note = '') {
    return `
        <header class="private-contact-homepage-section-head">
            <span>${escapePrivateHtml(kicker)}</span>
            <h3>${escapePrivateHtml(title)}</h3>
            ${note ? `<p>${escapePrivateHtml(note)}</p>` : ''}
        </header>
    `;
}

function createPrivateContactMetaMarkup(contact, record) {
    return `
        <section class="private-contact-homepage-meta" aria-label="联系人资料">
            ${createPrivateContactSectionHead('PRIVATE DOSSIER', '更多', '职业、号码与日常落点，都会跟随角色设定与国籍延伸补全。')}
            <div class="private-contact-homepage-meta-list">
                ${createPrivateContactMetaEntries(contact, record).map(([label, value]) => `
                    <article class="private-contact-homepage-meta-item">
                        <span>${escapePrivateHtml(label)}</span>
                        <strong>${escapePrivateHtml(value)}</strong>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

function createPrivateContactLifeStagesMarkup(contact, record, aboutLabel) {
    const profile = resolvePrivateContactGeneratedProfile(contact, record);
    const stages = normalizePrivateContactLifeStages(profile.lifeStages);
    return `
        <section class="private-contact-homepage-stage-shell" aria-label="成长经历">
            ${createPrivateContactSectionHead('PERSONAL NOTES', aboutLabel, '不是设定原句，而是那些被时间慢慢养成的部分。')}
            <div class="private-contact-homepage-stage-list">
                ${stages.map(item => `
                    <article class="private-contact-homepage-stage">
                        <h3 class="private-contact-homepage-stage-title">${escapePrivateHtml(item.age)}</h3>
                        <p>${escapePrivateHtml(item.experience)}</p>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

function createPrivateContactHomepageFlowMarkup(contact, record, activeSection, aboutLabel) {
    if (activeSection === 'more') {
        return `
            <section class="private-contact-homepage-flow private-contact-homepage-flow-more" aria-label="更多">
                ${createPrivateContactMetaMarkup(contact, record)}
            </section>
        `;
    }
    return `
        <section class="private-contact-homepage-flow private-contact-homepage-flow-about" aria-label="${escapePrivateHtml(aboutLabel)}">
            ${createPrivateContactLifeStagesMarkup(contact, record, aboutLabel)}
        </section>
    `;
}

function createPrivateContactFlowParagraphs(contact, record) {
    const title = getPrivateContactDisplayName(contact);
    const realName = String(record?.name || title).trim();
    const setting = String(record?.setting || contact?.note || '').replace(/\s+/g, ' ').trim();
    const monologue = String(record?.monologue || '').trim();
    const account = normalizePrivateDossierAccount(contact?.accountId || record?.accountId);
    const label = record?.type === 'npc' || contact?.dossierType === 'npc' ? 'NPC' : 'CHAR';
    const lines = [
        `你好 现在你接收到的是来自 ${title} 的一封信`,
        `———･ﾟ ${realName} の先住子猫です ･ﾟ｡`,
        setting || `${label} 的设定还没有完整写下，但已经被收进通讯。`,
        monologue || `关于 ${title} 的更多内容会在这里慢慢展开。`,
        account ? `ID ${account} 只属于这一个联系人。` : ''
    ].filter(Boolean);

    return lines
        .map(line => `<p>${escapePrivateHtml(line)}</p>`)
        .join('');
}

function normalizePrivateContactSocialNumber(value, fallback) {
    const raw = String(value ?? '').replace(/[^\d]/g, '');
    const number = Number(raw);
    return Number.isFinite(number) && number > 0 ? number : fallback;
}

function formatPrivateContactSocialNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function getPrivateContactFollowedBy(record, contact) {
    const value = record?.followedBy;
    const names = Array.isArray(value)
        ? value
        : String(value || '').split(/[,/]/);
    const normalized = names.map(item => String(item || '').trim()).filter(Boolean).slice(0, 3);
    return normalized.length ? normalized : ['Rinno', record?.type === 'npc' || contact?.dossierType === 'npc' ? 'NPC' : 'CHAR'];
}

function createPrivateContactProfilePanelMarkup(contact, record) {
    const label = contact?.dossierType === 'npc' || record?.type === 'npc' ? 'NPC' : 'CHAR';
    const title = getPrivateContactDisplayName(contact);
    const realName = String(record?.name || title).trim();
    const seed = Array.from(`${contact?.id || title}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const followers = normalizePrivateContactSocialNumber(record?.socialFollowers, 160 + (seed % 720));
    const following = normalizePrivateContactSocialNumber(record?.socialFollowing, 12 + (seed % 88));
    const others = normalizePrivateContactSocialNumber(record?.socialOthers, 8 + (seed % 42));
    const followedBy = getPrivateContactFollowedBy(record, contact);
    const monologue = record?.monologue || record?.setting || contact?.note || '';

    return `
        <article class="dossier-profile-paper private-contact-profile-paper">
            <header class="dossier-profile-hero">
                ${createPrivateContactProfileAvatarMarkup(contact)}
                <div class="dossier-profile-identity">
                    <div class="dossier-profile-name-row">
                        <h2>@${escapePrivateHtml(title)}<span>${escapePrivateHtml(label)}</span></h2>
                    </div>
                    <p>${escapePrivateHtml(realName)}</p>
                </div>
            </header>
            <div class="dossier-profile-stats">
                <span>${formatPrivateContactSocialNumber(followers)} Followers</span>
                <i></i>
                <span>${formatPrivateContactSocialNumber(following)} Following</span>
            </div>
            <div class="dossier-profile-followed" aria-label="profile relation">
                <span></span><span></span><span></span>
                <p>Followed by <strong>${escapePrivateHtml(followedBy.join(', '))}</strong> and <strong>${formatPrivateContactSocialNumber(others)} others</strong></p>
            </div>
            <div class="dossier-profile-dots" aria-hidden="true">...</div>
            <section class="dossier-profile-monologue" aria-label="profile note">
                ${createPrivateContactProfileParagraphs(monologue)}
            </section>
        </article>
    `;
}

function createPrivateContactHomepageMarkup(contact, record) {
    const title = getPrivateContactDisplayName(contact);
    const aboutLabel = getPrivateContactAboutLabel(record, contact);
    const contactId = String(contact?.id || '').trim();
    const coverStyle = createPrivateContactHomepageCoverStyle(contact);
    const coverClass = String(contact?.homepageCover || '').trim() ? ' has-custom-cover' : '';
    const signature = createPrivateContactSignature(contact, record);
    const activeSection = ['about', 'more'].includes(privateContactHomepageActiveSection)
        ? privateContactHomepageActiveSection
        : 'about';

    return `
        <article class="private-contact-homepage-paper" data-private-contact-homepage-id="${escapePrivateHtml(contactId)}">
            <span class="private-contact-homepage-watermark" aria-hidden="true">RINNO</span>
            <section class="private-contact-homepage-cover${coverClass}"${coverStyle} data-private-contact-homepage-cover="${escapePrivateHtml(contactId)}" role="button" tabindex="0" aria-label="更换角色主页背景图" title="更换背景图">
                <button class="private-contact-homepage-close interactive" type="button" data-private-contact-homepage-close aria-label="返回通讯">Back</button>
                <button class="private-contact-homepage-edit interactive" type="button" data-private-contact-homepage-edit="${escapePrivateHtml(contactId)}" aria-label="编辑联系人主页">Edit</button>
            </section>
            <section class="private-contact-homepage-head">
                ${createPrivateContactProfileAvatarMarkup(contact).replace('dossier-profile-avatar', 'private-contact-homepage-avatar')}
                <h2>@${escapePrivateHtml(title)}</h2>
                <p class="private-contact-homepage-signature">${escapePrivateHtml(signature)}</p>
            </section>
            <nav class="private-contact-homepage-tabs" aria-label="联系人主页">
                <button class="${activeSection === 'about' ? 'active ' : ''}interactive" type="button" data-private-contact-homepage-tab="about" data-private-contact-id="${escapePrivateHtml(contactId)}">${escapePrivateHtml(aboutLabel)}</button>
                <button class="${activeSection === 'more' ? 'active ' : ''}interactive" type="button" data-private-contact-homepage-tab="more" data-private-contact-id="${escapePrivateHtml(contactId)}">更多</button>
            </nav>
            ${createPrivateContactHomepageFlowMarkup(contact, record, activeSection, aboutLabel)}
            <div class="private-contact-homepage-links" aria-label="联系人功能入口">
                <button class="interactive private-contact-homepage-link private-contact-homepage-link-wide" type="button" data-private-contact-homepage-entry="朋友圈" data-private-contact-id="${escapePrivateHtml(contactId)}">
                    <span class="private-contact-homepage-link-copy">
                        <small>FIELD NOTES</small>
                        <b>朋友圈</b>
                    </span>
                    <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6.5h14"/><path d="M5 12h14"/><path d="M5 17.5h9"/></svg></i>
                </button>
                <div class="private-contact-homepage-link-row" aria-label="聊天与视频">
                    <button class="interactive private-contact-homepage-link private-contact-homepage-link-chat" type="button" data-private-contact-homepage-entry="聊天" data-private-contact-id="${escapePrivateHtml(contactId)}">
                        <span class="private-contact-homepage-link-copy">
                            <small>PRIVATE LINE</small>
                            <b>聊天</b>
                        </span>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6h14v10H9l-4 3V6z"/><path d="M9 10h6"/><path d="M9 13h4"/></svg></i>
                    </button>
                    <button class="interactive private-contact-homepage-link private-contact-homepage-link-video" type="button" data-private-contact-homepage-entry="视频" data-private-contact-id="${escapePrivateHtml(contactId)}" aria-label="视频" title="视频">
                        <span class="private-contact-homepage-link-copy">
                            <small>VIDEO CALL</small>
                            <b>视频</b>
                        </span>
                        <i aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4.5" y="7" width="11" height="10" rx="1.5"/><path d="M15.5 10.2l4-2.2v8l-4-2.2"/></svg></i>
                    </button>
                </div>
            </div>
            <section class="private-contact-homepage-manage" aria-label="联系人管理">
                <button class="interactive private-contact-homepage-manage-button" type="button" data-private-contact-homepage-action="clear-chat" data-private-contact-id="${escapePrivateHtml(contactId)}">清空聊天记录</button>
                <button class="interactive private-contact-homepage-manage-button" type="button" data-private-contact-homepage-action="block" data-private-contact-id="${escapePrivateHtml(contactId)}">${contact?.isBlocked ? '解除拉黑' : '拉黑'}</button>
                <button class="interactive private-contact-homepage-manage-button danger" type="button" data-private-contact-homepage-action="delete" data-private-contact-id="${escapePrivateHtml(contactId)}">删除</button>
            </section>
        </article>
    `;
}

function getPrivateContactHomepageCoverInput() {
    let input = document.getElementById('private-contact-homepage-cover-input');
    if (input) return input;
    input = document.createElement('input');
    input.id = 'private-contact-homepage-cover-input';
    input.type = 'file';
    input.accept = 'image/*';
    input.hidden = true;
    input.addEventListener('change', event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        handlePrivateContactHomepageCoverUpload(file);
    });
    document.body.appendChild(input);
    return input;
}

function applyPrivateContactHomepageCover(page, contact) {
    const cover = String(contact?.homepageCover || '').trim();
    const coverEl = page?.querySelector?.('.private-contact-homepage-cover');
    if (!coverEl) return;
    if (!cover) {
        coverEl.classList.remove('has-custom-cover');
        coverEl.style.removeProperty('--private-contact-homepage-cover-image');
        coverEl.style.removeProperty('background-image');
        coverEl.style.removeProperty('background-size');
        coverEl.style.removeProperty('background-position');
        coverEl.style.removeProperty('background-repeat');
        return;
    }
    const safeCover = `url("${cover.replace(/"/g, '\\"')}")`;
    coverEl.classList.add('has-custom-cover');
    coverEl.style.setProperty('--private-contact-homepage-cover-image', safeCover);
    coverEl.style.setProperty('background-image', safeCover);
    coverEl.style.setProperty('background-size', 'cover');
    coverEl.style.setProperty('background-position', 'center center');
    coverEl.style.setProperty('background-repeat', 'no-repeat');
}

function readPrivateFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('');
            return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = event => resolve(String(event.target?.result || ''));
        reader.readAsDataURL(file);
    });
}

function readPrivateImageFile(file, options = {}) {
    if (!file) return Promise.resolve('');
    const fileType = String(file.type || '').toLowerCase();
    if (!fileType.startsWith('image/') || fileType.includes('svg')) {
        return readPrivateFileAsDataUrl(file);
    }
    const maxEdge = Math.max(240, Number(options.maxEdge) || PRIVATE_IMAGE_MAX_EDGE);
    const quality = Math.min(0.92, Math.max(0.5, Number(options.quality) || PRIVATE_IMAGE_JPEG_QUALITY));
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.decoding = 'async';
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            readPrivateFileAsDataUrl(file).then(resolve, reject);
        };
        image.onload = () => {
            try {
                const sourceWidth = image.naturalWidth || image.width;
                const sourceHeight = image.naturalHeight || image.height;
                if (!sourceWidth || !sourceHeight) {
                    URL.revokeObjectURL(objectUrl);
                    readPrivateFileAsDataUrl(file).then(resolve, reject);
                    return;
                }
                const sourceEdge = Math.max(sourceWidth, sourceHeight);
                if (sourceEdge <= maxEdge && file.size <= 450000) {
                    URL.revokeObjectURL(objectUrl);
                    readPrivateFileAsDataUrl(file).then(resolve, reject);
                    return;
                }
                const scale = Math.min(1, maxEdge / sourceEdge);
                const width = Math.max(1, Math.round(sourceWidth * scale));
                const height = Math.max(1, Math.round(sourceHeight * scale));
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d', { alpha: false });
                if (!context) throw new Error('Canvas unavailable.');
                context.fillStyle = '#fff';
                context.fillRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);
                const finish = blob => {
                    URL.revokeObjectURL(objectUrl);
                    if (blob) {
                        readPrivateFileAsDataUrl(blob).then(resolve, reject);
                        return;
                    }
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                if (canvas.toBlob) canvas.toBlob(finish, 'image/jpeg', quality);
                else finish(null);
            } catch (error) {
                URL.revokeObjectURL(objectUrl);
                readPrivateFileAsDataUrl(file).then(resolve, reject);
            }
        };
        image.src = objectUrl;
    });
}

async function handlePrivateContactHomepageCoverUpload(file) {
    const contactId = privateContactHomepageCoverTargetId;
    privateContactHomepageCoverTargetId = '';
    if (!file || !contactId) return;
    try {
        const content = await readPrivateImageFile(file);
        if (!content) return;
        const contacts = getPrivateScopedContacts()
            .map(getPrivateHydratedContact)
            .map(contact => String(contact?.id || '') === contactId
                ? { ...contact, homepageCover: content }
                : contact);
        setPrivateScopedContacts(contacts);
        await savePrivateState();
        openPrivateContactHomepage(contactId);
        showPrivateSystemToast('角色主页背景图已保存。');
    } catch (error) {
        console.error('角色主页背景图保存失败:', error);
        showPrivateSystemToast('背景图保存失败，请换一张图片。');
    }
}

function ensurePrivateContactProfileModal() {
    let modal = document.getElementById('private-contact-profile-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'private-contact-profile-modal dossier-profile-modal';
    modal.id = 'private-contact-profile-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'contact profile');
    modal.innerHTML = '<div class="dossier-profile-dialog" id="private-contact-profile-content"></div>';
    modal.addEventListener('click', event => {
        if (event.target === event.currentTarget) closePrivateContactProfileCard();
    });
    document.body.appendChild(modal);
    return modal;
}

function ensurePrivateContactHomepagePage() {
    let page = document.getElementById('private-contact-homepage-page');
    if (page) return page;
    const panelWrap = document.querySelector('.private-panel-wrap');
    if (!panelWrap) return null;
    page = document.createElement('section');
    page.className = 'private-pane private-contact-homepage-pane';
    page.id = 'private-contact-homepage-page';
    page.setAttribute('data-private-panel', 'contact-homepage');
    page.setAttribute('aria-label', '联系人主页');
    panelWrap.appendChild(page);
    return page;
}

function openPrivateContactHomepage(contactId, activeSection = privateContactHomepageActiveSection) {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    const record = getPrivateContactProfileRecord(contact);
    const page = ensurePrivateContactHomepagePage();
    if (!page) return;
    const chatScreen = document.querySelector('.private-chat-screen');
    const currentTab = chatScreen?.getAttribute('data-private-current-tab') || 'contacts';
    if (currentTab !== 'contact-homepage') privateContactHomepageReturnTab = currentTab;
    privateContactHomepageActiveSection = ['about', 'more'].includes(activeSection) ? activeSection : 'about';
    page.innerHTML = createPrivateContactHomepageMarkup(contact, record);
    applyPrivateContactHomepageCover(page, contact);
    switchPrivateTab('contact-homepage');
    page.scrollTop = 0;
}

function openPrivateContactProfileCard(contactId) {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    const record = getPrivateContactProfileRecord(contact);
    const modal = ensurePrivateContactProfileModal();
    const content = modal.querySelector('#private-contact-profile-content');
    if (!content) return;
    content.innerHTML = createPrivateContactProfilePanelMarkup(contact, record);
    modal.hidden = false;
    document.body.classList.add('private-contact-profile-open');
    requestAnimationFrame(() => modal.classList.add('active'));
}

function closePrivateContactProfileCard(instant = false) {
    const modal = document.getElementById('private-contact-profile-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('private-contact-profile-open');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function createPrivateContactSettingsBadgeMarkup(label = '', tone = 'soft') {
    return '';
}

function createPrivateContactSettingsRowMarkup(options = {}) {
    const title = String(options.title || '').trim();
    if (!title) return '';
    const description = String(options.description || '').trim();
    const tail = String(options.tail || '').trim();
    const tag = options.button ? 'button' : 'div';
    const typeAttr = options.button ? ' type="button"' : '';
    const extraClass = String(options.extraClass || '').trim();
    const attributes = String(options.attributes || '').trim();
    return `
        <${tag} class="private-contact-settings-row${extraClass ? ` ${extraClass}` : ''}"${typeAttr}${attributes ? ` ${attributes}` : ''}>
            <div class="private-contact-settings-row-main">
                <strong>${escapePrivateHtml(title)}</strong>
                ${description ? `<p>${escapePrivateHtml(description)}</p>` : ''}
            </div>
            ${tail ? `<div class="private-contact-settings-row-tail">${tail}</div>` : ''}
        </${tag}>
    `;
}


function createPrivateContactAdvancedRealismPanelMarkup(contact = {}, settings = null) {
    const normalized = normalizePrivateCharacterAdvancedSettings(
        settings || privateCharacterAdvancedSettingsCache[String(contact?.id || '').trim()] || null,
        contact?.id || 'contact_advanced'
    );
    const textarea = (name, value, placeholder, rows = 3) => `
        <label class="private-contact-settings-field">
            <span>${escapePrivateHtml(name.label)}</span>
            <textarea class="private-contact-settings-textarea" name="${escapePrivateHtml(name.name)}" rows="${rows}" placeholder="${escapePrivateHtml(placeholder)}">${escapePrivateHtml(value || '')}</textarea>
        </label>
    `;
    const dimensionControls = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.map(item => {
        const value = clampPrivateContactChatPersonaScore(normalized.personalityState?.[item.key] ?? 50);
        return `
            <label class="private-advanced-dimension-row">
                <span>${escapePrivateHtml(item.label)} <em>${escapePrivateHtml(item.key)}</em></span>
                <div class="private-advanced-slider-line">
                    <input class="private-advanced-range" type="range" min="0" max="100" step="1" name="personality_${escapePrivateHtml(item.key)}" value="${value}" data-private-advanced-range="${escapePrivateHtml(item.key)}">
                    <output data-private-advanced-output="${escapePrivateHtml(item.key)}">${value}</output>
                </div>
            </label>
        `;
    }).join('');
    const rangeControls = PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.map(item => {
        const [min, max] = normalizePrivateCharacterAdvancedRange(normalized.baselineRange?.[item.key], item.defaultRange);
        return `
            <div class="private-advanced-range-row">
                <span>${escapePrivateHtml(item.label)} <em>${escapePrivateHtml(item.key)}</em></span>
                <label><small>min</small><input class="private-contact-settings-input" type="number" min="0" max="100" step="1" inputmode="numeric" name="range_${escapePrivateHtml(item.key)}_min" value="${min}"></label>
                <label><small>max</small><input class="private-contact-settings-input" type="number" min="0" max="100" step="1" inputmode="numeric" name="range_${escapePrivateHtml(item.key)}_max" value="${max}"></label>
            </div>
        `;
    }).join('');
    return `
        <section class="private-contact-settings-panel private-advanced-realism-panel">
            <div class="private-contact-settings-panel-head">
                <div class="private-contact-settings-panel-copy">
                    <span>高级拟真</span>
                    <strong>人设稳定 / 六维底色监控</strong>
                    <p>默认强制开启，无开关；每个联系人独立保存到 IndexedDB，用于回复前内部校验，不会写入聊天气泡。</p>
                </div>
                ${createPrivateContactSettingsBadgeMarkup('强制开启', 'live')}
            </div>
            <form class="private-contact-settings-stack" data-private-contact-settings-form="advanced-realism" autocomplete="off">
                ${textarea({ label: '日常动态', name: 'daily_state' }, normalized.dailyState, '最近在忙什么、今天心情、生活状态、近期压力、兴趣活动、对 user 的近况反应……', 3)}
                ${textarea({ label: '回复习惯', name: 'reply_habit' }, normalized.replyHabit, '常用语气、句子长短、是否爱撒娇、是否少用标点、是否喜欢反问、是否慢热、是否主动分享生活细节……', 3)}
                ${textarea({ label: '自定义回复前检查流程', name: 'pre_reply_check_prompt' }, normalized.preReplyCheckPrompt, PRIVATE_CHARACTER_ADVANCED_DEFAULT_CHECK_PROMPT, 5)}
                <div class="private-contact-settings-subpanel private-advanced-subpanel">
                    <div class="private-contact-settings-inline-head">
                        <strong>六维性格状态</strong>
                        <small>0-100；拖动只更新显示，点击保存后写入 IndexedDB。</small>
                    </div>
                    <div class="private-advanced-dimension-grid">
                        ${dimensionControls}
                    </div>
                </div>
                <div class="private-contact-settings-subpanel private-advanced-subpanel">
                    <div class="private-contact-settings-inline-head">
                        <strong>底色区间</strong>
                        <small>越界时只注入内部系统警告，最终不显示给聊天 UI。</small>
                    </div>
                    <div class="private-advanced-range-grid">
                        ${rangeControls}
                    </div>
                </div>
                <div class="private-contact-settings-actions">
                    <button class="interactive private-soft-button primary" type="submit">保存高级拟真</button>
                    <button class="interactive private-soft-button" type="button" data-private-contact-settings-reset-advanced-realism>重置默认</button>
                </div>
            </form>
        </section>
    `;
}

function readPrivateContactAdvancedSettingsForm(form) {
    const formData = new FormData(form);
    const readNumber = (name, fallback = 50) => clampPrivateContactChatPersonaScore(formData.get(name) ?? fallback);
    const personalityState = {};
    const baselineRange = {};
    PRIVATE_CHARACTER_ADVANCED_DIMENSIONS.forEach(item => {
        personalityState[item.key] = readNumber(`personality_${item.key}`, 50);
        baselineRange[item.key] = normalizePrivateCharacterAdvancedRange([
            readNumber(`range_${item.key}_min`, item.defaultRange[0]),
            readNumber(`range_${item.key}_max`, item.defaultRange[1])
        ], item.defaultRange);
    });
    return {
        dailyState: String(formData.get('daily_state') || ''),
        replyHabit: String(formData.get('reply_habit') || ''),
        preReplyCheckPrompt: String(formData.get('pre_reply_check_prompt') || ''),
        personalityState,
        baselineRange
    };
}

function createPrivateContactChatSettingsMarkup(contact, options = {}) {
    const record = getPrivateContactProfileRecord(contact);
    const displayName = getPrivateContactDisplayName(contact);
    const actualName = String(contact?.title || '联系人').trim() || '联系人';
    const userName = getPrivateDisplayName();
    const timezoneValue = normalizePrivateContactTimezone(contact?.timezone);
    const resolvedTimezone = resolvePrivateContactTimezone(contact);
    const replyCadence = resolvePrivateContactReplyCadenceConfig(contact);
    const timeAwarenessEnabled = Boolean(contact?.timeAwarenessEnabled);
    const autoSummaryEnabled = Boolean(contact?.autoSummaryEnabled);
    const autoSummaryThreshold = normalizePrivateContactSummaryThreshold(contact?.autoSummaryThreshold);
    const summaryProgress = getPrivateContactSummaryProgress(contact.id, { threshold: autoSummaryThreshold });
    const summaryBusy = privatePendingContactSummaryKeys.has(String(contact?.id || '').trim());
    const manualReplyBusy = String(privateContactChatSendingId || '').trim() === String(contact?.id || '').trim();
    const keepAliveEnabled = Boolean(contact?.backgroundKeepAliveEnabled || contact?.keepAliveEnabled || contact?.backgroundKeepAlive);
    const tokenStats = getPrivateContactTokenStats(contact?.id || '', contact);
    const tokenUsage = tokenStats.usage;
    const timezoneNote = timezoneValue
        ? `联系人时区已固定为 ${resolvedTimezone}`
        : `未填写时将默认跟随你的时区 ${resolvedTimezone}`;
    const chatWallpaper = normalizePrivateContactWallpaper(contact?.chatWallpaper);
    const userNudgeSuffix = normalizePrivateContactNudgeSuffix(contact?.userNudgeSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX);
    const contactNudgeSuffix = normalizePrivateContactNudgeSuffix(contact?.contactNudgeSuffix, PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX);
    const advancedSettings = normalizePrivateCharacterAdvancedSettings(
        options.advancedSettings || privateCharacterAdvancedSettingsCache[String(contact?.id || '').trim()] || null,
        contact?.id || 'contact_advanced'
    );
    const longMemoryState = normalizePrivateContactLongMemoryState(
        options.longMemoryState || contact?.longMemory || null,
        contact?.id || 'contact_memory'
    );
    const todayDateKey = getPrivateContactLocalDateKey(Date.now(), resolvedTimezone);
    const todaySummary = longMemoryState.dailySummaries.find(item => item.date === todayDateKey) || null;
    const todaySummaryText = todaySummary?.summary || '今天还没有线上摘要。';
    const longMemoryUpdatedAtText = longMemoryState.updatedAt ? formatPrivateContactArchiveTime(longMemoryState.updatedAt) : '';
    const chatWallpaperStyle = chatWallpaper
        ? ` style="--private-contact-settings-wallpaper-image:${escapePrivateHtml(getPrivateCssImageValue(chatWallpaper))}"`
        : '';
    const summaryUpdatedAtText = contact?.summaryUpdatedAt
        ? formatPrivateContactArchiveTime(contact.summaryUpdatedAt)
        : '';
    const userAvatarInner = buildPrivateContactChatAvatarInnerMarkup(privateState.avatar, Array.from(userName)[0] || '我');
    const contactAvatarInner = buildPrivateContactChatAvatarInnerMarkup(contact?.avatar || '', getPrivateContactInitial(contact));
    const badgeReady = label => createPrivateContactSettingsBadgeMarkup(label, 'ready');
    const badgeLive = label => createPrivateContactSettingsBadgeMarkup(label, 'live');
    const badgeFuture = label => createPrivateContactSettingsBadgeMarkup(label, 'future');
    return `
        <section class="private-contact-settings-shell" data-private-contact-settings-id="${escapePrivateHtml(contact.id)}">
            <header class="private-contact-settings-header">
                <button class="interactive private-contact-settings-title" type="button" data-private-contact-settings-back aria-label="返回聊天">
                    <small>PRIVATE LINE SETTINGS</small>
                    <strong>聊天设置</strong>
                    <span>${escapePrivateHtml(displayName)} · 点标题返回聊天，页面滚动时标题不吸顶</span>
                </button>
            </header>

            <div class="private-contact-settings-flow">
                <section class="private-contact-settings-panel private-contact-settings-panel-avatar">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>头像同步</span>
                            <strong>双方头像左右排开，其它应用同步更新</strong>
                            <p>点击左右头像直接替换，对应卷宗也会一起同步。</p>
                        </div>
                        ${badgeReady('')}
                    </div>
                    <div class="private-contact-settings-avatar-row">
                        <button class="interactive private-contact-settings-avatar-node" type="button" data-private-contact-settings-avatar="user">
                            <span class="private-contact-settings-avatar-face${privateState.avatar ? ' has-image' : ''}">${userAvatarInner}</span>
                            <strong>${escapePrivateHtml(userName)}</strong>
                            <small>我</small>
                        </button>
                        <div class="private-contact-settings-avatar-link" aria-hidden="true">
                            <span></span>
                            <em>SYNC</em>
                            <span></span>
                        </div>
                        <button class="interactive private-contact-settings-avatar-node" type="button" data-private-contact-settings-avatar="contact">
                            <span class="private-contact-settings-avatar-face${contact?.avatar ? ' has-image' : ''}">${contactAvatarInner}</span>
                            <strong>${escapePrivateHtml(displayName)}</strong>
                            <small>${escapePrivateHtml(displayName === actualName ? '联系人' : actualName)}</small>
                        </button>
                    </div>
                </section>

                <form class="private-contact-settings-panel" data-private-contact-settings-form="remark">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>备注</span>
                            <strong>备注为最高优先级展示</strong>
                            <p>保存后，列表、聊天头部和其它同步位优先显示备注。</p>
                        </div>
                        ${badgeReady('')}
                    </div>
                    <div class="private-contact-settings-control">
                        <label class="private-contact-settings-field">
                            <span>联系人备注</span>
                            <input class="private-contact-settings-input" name="remark" type="text" value="${escapePrivateHtml(normalizePrivateContactRemark(contact?.remark || ''))}" placeholder="例如：晚安对象 / 导师 / 小猫">
                        </label>
                        <button class="interactive private-soft-button primary" type="submit">保存备注</button>
                    </div>
                </form>

                <form class="private-contact-settings-panel" data-private-contact-settings-form="profile">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>档案</span>
                            <strong>快捷改双方设定，并同步到拾光体系</strong>
                            <p>这里只做轻量改写，详细资料仍可进入卷宗深改。</p>
                        </div>
                        ${badgeReady('')}
                    </div>
                    <label class="private-contact-settings-field">
                        <span>${escapePrivateHtml(userName)}的设定</span>
                        <textarea class="private-contact-settings-textarea" name="user_setting" rows="4" placeholder="写下你的身份、语气、边界和互动习惯">${escapePrivateHtml(privateState.userPresetSetting || '')}</textarea>
                    </label>
                    <label class="private-contact-settings-field">
                        <span>${escapePrivateHtml(actualName)}的设定</span>
                        <textarea class="private-contact-settings-textarea" name="contact_setting" rows="5" placeholder="写下角色设定，保存后其它应用同步更新">${escapePrivateHtml(record?.setting || contact?.note || '')}</textarea>
                    </label>
                    <div class="private-contact-settings-actions">
                        <button class="interactive private-soft-button primary" type="submit">同步档案</button>
                        <button class="interactive private-soft-button" type="button" data-private-contact-settings-open-dossier>打开卷宗</button>
                    </div>
                </form>

                <section class="private-contact-settings-panel">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>环境与感知</span>
                            <strong>同样放在聊天语境里，只把必要控制做出来</strong>
                            <p>保留聊天壁纸、联系人时区和时间感知这几项常用控制。</p>
                        </div>
                        ${badgeLive('部分实装')}
                    </div>
                    <section class="private-contact-settings-subpanel private-contact-settings-wallpaper-card">
                        <div class="private-contact-settings-inline-head">
                            <strong>聊天壁纸</strong>
                            ${chatWallpaper ? badgeReady('已设置') : badgeLive('跟随主题')}
                        </div>
                        <button class="interactive private-contact-settings-wallpaper-preview${chatWallpaper ? ' has-wallpaper' : ''}" type="button" data-private-contact-settings-chat-wallpaper-upload>
                            <span class="private-contact-settings-wallpaper-preview-box${chatWallpaper ? ' has-wallpaper' : ''}" data-private-contact-settings-wallpaper-preview-box${chatWallpaperStyle}>
                                <span class="private-contact-settings-wallpaper-preview-copy">
                                    ${chatWallpaper ? '点击更换这位联系人的聊天壁纸' : '未单独设置时，这个聊天页会直接跟随当前主题背景'}
                                </span>
                            </span>
                        </button>
                        <div class="private-contact-settings-actions">
                            <button class="interactive private-soft-button primary" type="button" data-private-contact-settings-chat-wallpaper-upload>${chatWallpaper ? '更换壁纸' : '上传壁纸'}</button>
                            <button class="interactive private-soft-button" type="button" data-private-contact-settings-chat-wallpaper-reset${chatWallpaper ? '' : ' hidden'}>恢复主题背景</button>
                        </div>
                    </section>
                    <form class="private-contact-settings-stack private-contact-settings-subpanel" data-private-contact-settings-form="timezone">
                        <label class="private-contact-settings-field">
                            <span>联系人时区</span>
                            <input class="private-contact-settings-input" name="timezone" type="text" value="${escapePrivateHtml(timezoneValue)}" placeholder="例如 Asia/Shanghai / Asia/Tokyo">
                            <small>${escapePrivateHtml(timezoneNote)}</small>
                        </label>
                        <div class="private-contact-settings-inline">
                            <div class="private-contact-settings-toggle-copy">
                                <strong>时间感知</strong>
                                <small>${escapePrivateHtml(timeAwarenessEnabled ? `当前对齐 ${formatPrivateContactAwareTime(new Date(), resolvedTimezone)}` : '关闭时严格禁止模型感知真实时间')}</small>
                            </div>
                            <label class="private-contact-settings-switch">
                                <input type="checkbox" data-private-contact-settings-toggle="time-awareness" ${timeAwarenessEnabled ? 'checked' : ''}>
                                <span></span>
                            </label>
                        </div>
                        <div class="private-contact-settings-actions">
                            <button class="interactive private-soft-button primary" type="submit">保存时区</button>
                        </div>
                    </form>
                    <section class="private-contact-settings-subpanel">
                        <div class="private-contact-settings-inline-head">
                            <strong>天气感知</strong>
                            ${badgeFuture('待接入')}
                        </div>
                        <div class="private-contact-settings-mock-grid two-up">
                            <label class="private-contact-settings-field">
                                <span>用户城市</span>
                                <input class="private-contact-settings-input" type="text" placeholder="例如 上海" disabled>
                            </label>
                            <label class="private-contact-settings-field">
                                <span>联系人城市</span>
                                <input class="private-contact-settings-input" type="text" placeholder="例如 东京" disabled>
                            </label>
                        </div>
                        <p class="private-contact-settings-note">命中后会和回复同轮触发，保持 8% 概率，不额外单开一轮。</p>
                    </section>
                </section>

                <section class="private-contact-settings-panel">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>回复节奏</span>
                            <strong>先把真正常用的手动控制补完整</strong>
                            <p>这里只影响手动触发的一轮回复，不会在你发完消息后自动回。</p>
                        </div>
                        ${badgeLive('手动控制')}
                    </div>
                    <form class="private-contact-settings-subpanel private-contact-settings-stack" data-private-contact-settings-form="reply-cadence">
                        <div class="private-contact-settings-inline-head">
                            <strong>回复最少 / 最多条数</strong>
                            ${badgeReady('')}
                        </div>
                        <div class="private-contact-settings-mock-grid two-up">
                            <label class="private-contact-settings-field">
                                <span>最少</span>
                                <input class="private-contact-settings-input" name="reply_min_count" type="number" min="${PRIVATE_CONTACT_CHAT_REPLY_COUNT_MIN}" max="${PRIVATE_CONTACT_CHAT_REPLY_COUNT_MAX}" step="1" value="${replyCadence.min}" inputmode="numeric">
                            </label>
                            <label class="private-contact-settings-field">
                                <span>最多</span>
                                <input class="private-contact-settings-input" name="reply_max_count" type="number" min="${PRIVATE_CONTACT_CHAT_REPLY_COUNT_MIN}" max="${PRIVATE_CONTACT_CHAT_REPLY_COUNT_MAX}" step="1" value="${replyCadence.max}" inputmode="numeric">
                            </label>
                        </div>
                        <div class="private-contact-settings-actions">
                            <button class="interactive private-soft-button primary" type="submit">保存条数</button>
                        </div>
                        <p class="private-contact-settings-note">当前会把一轮回复控制在 ${replyCadence.label} 条，避免为了凑条数重复同一句。</p>
                    </form>
                    ${createPrivateContactSettingsRowMarkup({
                        title: '自动回复',
                        description: '保持关闭。只有你手动触发时，联系人才会回复。',
                        tail: badgeReady('不启用'),
                        extraClass: 'is-static'
                    })}
                    <section class="private-contact-settings-subpanel">
                        <div class="private-contact-settings-inline-head">
                            <strong>手动触发</strong>
                            ${badgeReady('')}
                        </div>
                        <div class="private-contact-settings-actions">
                            <button class="interactive private-soft-button primary" type="button" data-private-contact-settings-manual-reply${manualReplyBusy ? ' disabled' : ''}>${manualReplyBusy ? '回复中…' : '立即回复一轮'}</button>
                        </div>
                        <p class="private-contact-settings-note">只在你点击时生成回复，不会在发完消息后自动追发。</p>
                    </section>
                    <form class="private-contact-settings-subpanel private-contact-settings-stack" data-private-contact-settings-form="nudge-suffix">
                        <div class="private-contact-settings-inline-head">
                            <strong>拍一拍</strong>
                            ${badgeReady('已实装')}
                        </div>
                        <div class="private-contact-settings-mock-grid two-up">
                            <label class="private-contact-settings-field">
                                <span>你拍对方后缀</span>
                                <input class="private-contact-settings-input" name="user_nudge_suffix" type="text" maxlength="24" value="${escapePrivateHtml(userNudgeSuffix)}" placeholder="可留空，例如：的手背">
                            </label>
                            <label class="private-contact-settings-field">
                                <span>对方拍你后缀</span>
                                <input class="private-contact-settings-input" name="contact_nudge_suffix" type="text" maxlength="24" value="${escapePrivateHtml(contactNudgeSuffix)}" placeholder="可留空，例如：的手背">
                            </label>
                        </div>
                        <div class="private-contact-settings-actions">
                            <button class="interactive private-soft-button primary" type="submit">保存后缀</button>
                            <button class="interactive private-soft-button" type="button" data-private-contact-settings-test-nudge>拍一拍</button>
                        </div>
                        <p class="private-contact-settings-note">双击聊天页头像会按“你拍对方后缀”发送；Char 输出 action_nudge 时会按“对方拍你后缀”呈现，并允许 Char 自主微调后缀。</p>
                    </form>
                    ${createPrivateContactSettingsRowMarkup({
                        title: '独立 API 语音',
                        description: '联系人独立使用一套语音接口与参数。',
                        tail: badgeFuture('待接入'),
                        extraClass: 'is-static'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '主动聊天',
                        description: '联系人在后台状态下主动发起新的聊天。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                    <section class="private-contact-settings-subpanel">
                        <div class="private-contact-settings-inline-head">
                            <strong>后台保活</strong>
                            ${keepAliveEnabled ? badgeReady('已开启') : badgeLive('可开启')}
                        </div>
                        <div class="private-contact-settings-inline">
                            <div class="private-contact-settings-toggle-copy">
                                <strong>离开聊天页逐条通知</strong>
                                <small>${keepAliveEnabled ? '联系人输出时，只要你不在当前聊天页，就逐条弹出横幅，并请求系统通知。' : '开启后，输出不会静默堆在后台。'}</small>
                            </div>
                            <label class="private-contact-settings-switch">
                                <input type="checkbox" data-private-contact-settings-toggle="background-keep-alive" ${keepAliveEnabled ? 'checked' : ''}>
                                <span></span>
                            </label>
                        </div>
                        <p class="private-contact-settings-note">页面内横幅会显示头像、昵称、消息内容；系统通知会在浏览器允许通知后显示同一条消息。</p>
                    </section>
                    <section class="private-contact-settings-subpanel">
                        <div class="private-contact-settings-inline-head">
                            <strong>Tokens 统计</strong>
                            ${tokenUsage.totalTokens ? badgeReady('真实 usage') : badgeLive('等待 usage')}
                        </div>
                        <div class="private-contact-settings-mock-grid two-up">
                            <label class="private-contact-settings-field">
                                <span>总消耗 Tokens</span>
                                <input class="private-contact-settings-input" type="text" value="${tokenUsage.totalTokens ? formatPrivateContactInteger(tokenUsage.totalTokens) : '接口未返回 usage'}" disabled>
                            </label>
                            <label class="private-contact-settings-field">
                                <span>消息总数</span>
                                <input class="private-contact-settings-input" type="text" value="${formatPrivateContactInteger(tokenStats.totalMessages)} 条" disabled>
                            </label>
                            <label class="private-contact-settings-field">
                                <span>Prompt / Completion</span>
                                <input class="private-contact-settings-input" type="text" value="${formatPrivateContactInteger(tokenUsage.promptTokens)} / ${formatPrivateContactInteger(tokenUsage.completionTokens)}" disabled>
                            </label>
                            <label class="private-contact-settings-field">
                                <span>调用 / 回报</span>
                                <input class="private-contact-settings-input" type="text" value="${formatPrivateContactInteger(tokenUsage.apiCalls)} 次 / ${formatPrivateContactInteger(tokenUsage.usageReports)} 次" disabled>
                            </label>
                        </div>
                        <p class="private-contact-settings-note">只累加接口响应里的 usage / usageMetadata 真实 token；不再用字符数伪造。消息总数按当前聊天线程实时统计：我 ${tokenStats.userCount} / ${escapePrivateHtml(displayName)} ${tokenStats.assistantCount} / 系统 ${tokenStats.systemCount}${tokenStats.lastUsageAtText ? ` · 最近 usage：${escapePrivateHtml(tokenStats.lastUsageAtText)}` : ''}。</p>
                    </section>
                </section>

                <section class="private-contact-settings-panel">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>自动总结</span>
                            <strong>到达阈值自动归档，也可手动立即总结</strong>
                            <p>立即总结会整理当前未归档内容；今日摘要只更新当天线上互动预览。</p>
                        </div>
                        ${badgeReady('')}
                    </div>
                    <div class="private-contact-settings-inline">
                        <div class="private-contact-settings-toggle-copy">
                            <strong>自动总结开关</strong>
                            <small>${summaryBusy ? '正在整理这一轮未归档内容' : `当前已累计 ${summaryProgress.unsummarizedCount} / ${autoSummaryThreshold} 条未归档内容`}</small>
                        </div>
                        <label class="private-contact-settings-switch">
                            <input type="checkbox" data-private-contact-settings-toggle="auto-summary" ${autoSummaryEnabled ? 'checked' : ''}>
                            <span></span>
                        </label>
                    </div>
                    <div class="private-contact-settings-actions">
                        <button class="interactive private-soft-button primary" type="button" data-private-contact-settings-immediate-summary${summaryBusy ? ' disabled' : ''}>${summaryBusy ? '总结中…' : '立即总结'}</button>
                        <button class="interactive private-soft-button" type="button" data-private-contact-settings-today-summary${summaryBusy ? ' disabled' : ''}>${summaryBusy ? '整理中…' : '生成今日摘要'}</button>
                    </div>
                    <section class="private-contact-settings-subpanel private-long-memory-preview">
                        <div class="private-contact-settings-inline-head">
                            <strong>线上当日摘要</strong>
                            ${badgeReady(todayDateKey)}
                        </div>
                        <p class="private-contact-settings-note">${escapePrivateHtml(todaySummaryText)}</p>
                        ${todaySummary?.keyPoints?.length ? `<p class="private-contact-settings-note">关键点：${escapePrivateHtml(todaySummary.keyPoints.join('、'))}</p>` : ''}
                        ${todaySummary?.unresolved?.length ? `<p class="private-contact-settings-note">待续：${escapePrivateHtml(todaySummary.unresolved.join('、'))}</p>` : ''}
                    </section>
                    <section class="private-contact-settings-subpanel private-long-memory-preview">
                        <div class="private-contact-settings-inline-head">
                            <strong>长期记忆核心</strong>
                            ${badgeLive('强制召回')}
                        </div>
                        <p class="private-contact-settings-note">五维记忆 ${longMemoryState.entries.length} 条 / 约定 ${longMemoryState.promises.length} 条 / 核心记忆 ${longMemoryState.coreMemories.length} 条${longMemoryUpdatedAtText ? ` · 最近更新：${escapePrivateHtml(longMemoryUpdatedAtText)}` : ''}</p>
                        ${longMemoryState.promises.length ? `<p class="private-contact-settings-note">最近约定：${escapePrivateHtml(longMemoryState.promises.slice(0, 3).map(item => `${item.text}（${item.status}）`).join('；'))}</p>` : ''}
                        ${longMemoryState.coreMemories.length ? `<p class="private-contact-settings-note">核心变化：${escapePrivateHtml(longMemoryState.coreMemories.slice(0, 3).map(item => `${item.type}/${item.change}: ${item.text}`).join('；'))}</p>` : ''}
                    </section>
                    <p class="private-contact-settings-note">${summaryUpdatedAtText ? `最近一次归档：${summaryUpdatedAtText}` : '还没有写入过联系人拾光档案。'}</p>
                    ${autoSummaryEnabled ? `
                        <form class="private-contact-settings-stack" data-private-contact-settings-form="summary-threshold">
                            <label class="private-contact-settings-field">
                                <span>总结阈值</span>
                                <input class="private-contact-settings-input" name="summary_threshold" type="number" min="${PRIVATE_CONTACT_SUMMARY_MIN_THRESHOLD}" step="1" value="${autoSummaryThreshold}" inputmode="numeric">
                                <small>为了避免过碎归档，最小值固定为 ${PRIVATE_CONTACT_SUMMARY_MIN_THRESHOLD}；不再设置 240 条上限。</small>
                            </label>
                            <div class="private-contact-settings-actions">
                                <button class="interactive private-soft-button primary" type="submit">保存阈值</button>
                            </div>
                        </form>
                    ` : ''}
                </section>

                ${createPrivateContactAdvancedRealismPanelMarkup(contact, advancedSettings)}

                <section class="private-contact-settings-panel">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>实验能力</span>
                            <strong>你提到的其它高风险 / 高行为能力先全部预留</strong>
                            <p>先把位置、文案和状态做出来，后续再逐项接入真实逻辑。</p>
                        </div>
                        ${badgeFuture('未实装')}
                    </div>
                    ${createPrivateContactSettingsRowMarkup({
                        title: '关联账号',
                        description: '开启后联系人能够登入用户私叙。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '家长模式',
                        description: '高情绪值状态下有概率锁用户手机。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '修罗场',
                        description: '登入私叙或锁手机时与其它联系人对线。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '自主换头像',
                        description: '根据近期上下文与情绪自主替换头像。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '自主活动',
                        description: '联系人独立进行后台活动与状态变化。',
                        tail: badgeFuture('未实装'),
                        extraClass: 'is-static'
                    })}
                </section>

                <section class="private-contact-settings-panel">
                    <div class="private-contact-settings-panel-head">
                        <div class="private-contact-settings-panel-copy">
                            <span>记录工具</span>
                            <strong>记录相关入口也先补齐在同一套聊天 UI 里</strong>
                            <p>搜索新页先预留，导入导出沿用你现在已有的私叙记录能力。</p>
                        </div>
                        ${badgeLive('部分实装')}
                    </div>
                    ${createPrivateContactSettingsRowMarkup({
                        title: '查找聊天记录',
                        description: '进入新页面，上方搜索框输入关键词，下方列出命中的消息。',
                        tail: `${badgeFuture('框架预留')}<span class="private-contact-settings-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>`,
                        button: true,
                        attributes: 'data-private-contact-settings-placeholder="查找聊天记录的新页面框架已预留，这一轮先不接入搜索逻辑。"'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '导出聊天记录',
                        description: '当前可直接导出 JSON，ZIP 结构继续预留。',
                        tail: `${badgeLive('JSON可用')}`,
                        button: true,
                        attributes: 'data-private-contact-settings-export-records'
                    })}
                    ${createPrivateContactSettingsRowMarkup({
                        title: '导入聊天记录',
                        description: '覆盖 / 兼容导入的 UI 先预留，当前沿用已有导入逻辑。',
                        tail: `${badgeLive('可导入')}`,
                        button: true,
                        attributes: 'data-private-contact-settings-import-records'
                    })}
                </section>
            </div>
        </section>
    `;
}

function ensurePrivateContactChatSettingsPage() {
    let page = document.getElementById('private-contact-chat-settings-page');
    if (page) return page;
    const panelWrap = document.querySelector('.private-panel-wrap');
    if (!panelWrap) return null;
    page = document.createElement('section');
    page.className = 'private-pane private-contact-chat-settings-pane';
    page.id = 'private-contact-chat-settings-page';
    page.setAttribute('data-private-panel', 'contact-chat-settings');
    page.setAttribute('aria-label', '聊天设置');
    page.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const avatarButton = target.closest('[data-private-contact-settings-avatar]');
        if (avatarButton) {
            event.preventDefault();
            openPrivateContactChatSettingsAvatarPicker(
                avatarButton.getAttribute('data-private-contact-settings-avatar') || '',
                avatarButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId
            );
            return;
        }
        const backButton = target.closest('[data-private-contact-settings-back]');
        if (backButton) {
            event.preventDefault();
            closePrivateContactChatSettingsPage();
            return;
        }
        const wallpaperUploadButton = target.closest('[data-private-contact-settings-chat-wallpaper-upload]');
        if (wallpaperUploadButton) {
            event.preventDefault();
            openPrivateContactChatWallpaperPicker(
                wallpaperUploadButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id')
                || privateActiveContactChatId
            );
            return;
        }
        const wallpaperResetButton = target.closest('[data-private-contact-settings-chat-wallpaper-reset]');
        if (wallpaperResetButton) {
            event.preventDefault();
            void resetPrivateContactChatWallpaper(
                wallpaperResetButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id')
                || privateActiveContactChatId
            );
            return;
        }
        const advancedResetButton = target.closest('[data-private-contact-settings-reset-advanced-realism]');
        if (advancedResetButton) {
            event.preventDefault();
            const contactId = advancedResetButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id')
                || privateActiveContactChatId;
            void resetCharacterAdvancedSettings(contactId).then(() => {
                showPrivateSystemToast('高级拟真已重置。');
                void renderPrivateContactChatSettingsPage(contactId, { preserveScroll: true });
            });
            return;
        }
        const manualReplyButton = target.closest('[data-private-contact-settings-manual-reply]');
        if (manualReplyButton) {
            event.preventDefault();
            const contactId = manualReplyButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id')
                || privateActiveContactChatId;
            const contact = getPrivateContactById(contactId);
            if (!contact) {
                showPrivateSystemToast('当前联系人不存在。');
                return;
            }
            void requestPrivateContactChatAssistantReply(contact);
            return;
        }
        const nudgeTestButton = target.closest('[data-private-contact-settings-test-nudge]');
        if (nudgeTestButton) {
            event.preventDefault();
            const contactId = nudgeTestButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId;
            void sendPrivateContactChatUserNudge(contactId);
            return;
        }
        const summaryButton = target.closest('[data-private-contact-settings-immediate-summary]');
        if (summaryButton) {
            event.preventDefault();
            event.stopPropagation();
            void runPrivateContactSummary(
                summaryButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId,
                { manual: true }
            );
            return;
        }
        const todaySummaryButton = target.closest('[data-private-contact-settings-today-summary]');
        if (todaySummaryButton) {
            event.preventDefault();
            event.stopPropagation();
            const contactId = todaySummaryButton.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId;
            const contact = getPrivateContactById(contactId);
            void runPrivateContactSummary(contactId, {
                manual: true,
                daily: true,
                dateKey: getPrivateContactLocalDateKey(Date.now(), resolvePrivateContactTimezone(contact || {}))
            });
            return;
        }
        const dossierButton = target.closest('[data-private-contact-settings-open-dossier]');
        if (dossierButton) {
            event.preventDefault();
            openPrivateContactQuickEdit(
                target.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId
            );
            return;
        }
        const exportButton = target.closest('[data-private-contact-settings-export-records]');
        if (exportButton) {
            event.preventDefault();
            exportPrivateChatRecords();
            return;
        }
        const importButton = target.closest('[data-private-contact-settings-import-records]');
        if (importButton) {
            event.preventDefault();
            document.getElementById('private-import-input')?.click();
            return;
        }
        const placeholderButton = target.closest('[data-private-contact-settings-placeholder]');
        if (placeholderButton) {
            event.preventDefault();
            showPrivateSystemToast(
                placeholderButton.getAttribute('data-private-contact-settings-placeholder')
                || '这个聊天设置框架已经预留。'
            );
        }
    });
    page.addEventListener('input', event => {
        const target = event.target instanceof HTMLInputElement ? event.target : null;
        if (!target) return;
        const key = target.getAttribute('data-private-advanced-range');
        if (!key) return;
        const output = target.closest('.private-advanced-dimension-row')?.querySelector(`[data-private-advanced-output="${key}"]`);
        if (output) output.textContent = String(clampPrivateContactChatPersonaScore(target.value));
    });
    page.addEventListener('change', event => {
        const target = event.target instanceof HTMLInputElement ? event.target : null;
        if (!target) return;
        const contactId = target.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId;
        if (target.matches('[data-private-contact-settings-toggle="time-awareness"]')) {
            void setPrivateContactTimeAwareness(contactId, target.checked);
            return;
        }
        if (target.matches('[data-private-contact-settings-toggle="auto-summary"]')) {
            void setPrivateContactAutoSummaryEnabled(contactId, target.checked);
            return;
        }
        if (target.matches('[data-private-contact-settings-toggle="background-keep-alive"]')) {
            void setPrivateContactBackgroundKeepAliveEnabled(contactId, target.checked);
        }
    });
    page.addEventListener('submit', event => {
        event.preventDefault();
        const form = event.target instanceof HTMLFormElement ? event.target : null;
        if (!form) return;
        const contactId = form.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId;
        const mode = form.getAttribute('data-private-contact-settings-form') || '';
        if (mode === 'remark') {
            void savePrivateContactRemark(contactId, new FormData(form).get('remark'));
            return;
        }
        if (mode === 'profile') {
            const formData = new FormData(form);
            void savePrivateContactProfileSettings(contactId, {
                userSetting: formData.get('user_setting'),
                contactSetting: formData.get('contact_setting')
            });
            return;
        }
        if (mode === 'timezone') {
            void savePrivateContactTimezone(contactId, new FormData(form).get('timezone'));
            return;
        }
        if (mode === 'reply-cadence') {
            const formData = new FormData(form);
            void savePrivateContactReplyCadence(contactId, {
                min: formData.get('reply_min_count'),
                max: formData.get('reply_max_count')
            });
            return;
        }
        if (mode === 'nudge-suffix') {
            const formData = new FormData(form);
            void savePrivateContactNudgeSuffixes(contactId, {
                user: formData.get('user_nudge_suffix'),
                contact: formData.get('contact_nudge_suffix')
            });
            return;
        }
        if (mode === 'summary-threshold') {
            void savePrivateContactSummaryThreshold(contactId, new FormData(form).get('summary_threshold'));
            return;
        }
        if (mode === 'advanced-realism') {
            const data = readPrivateContactAdvancedSettingsForm(form);
            void saveCharacterAdvancedSettings(contactId, data).then(() => {
                showPrivateSystemToast('高级拟真已保存。');
                void renderPrivateContactChatSettingsPage(contactId, { preserveScroll: true });
            });
        }
    });
    panelWrap.appendChild(page);
    return page;
}

async function renderPrivateContactChatSettingsPage(contactId = privateActiveContactChatId, options = {}) {
    const page = ensurePrivateContactChatSettingsPage();
    if (!page) return;
    const previousScrollTop = options.preserveScroll ? page.scrollTop : 0;
    const rawContact = getPrivateContactById(contactId);
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        applyPrivateContactChatWallpaper(null);
        page.innerHTML = '';
        closePrivateContactChatSettingsPage();
        return;
    }
    const advancedSettings = await getCharacterAdvancedSettings(contact.id);
    const longMemoryState = await getCharacterLongMemoryState(contact.id, contact);
    page.innerHTML = createPrivateContactChatSettingsMarkup(contact, { advancedSettings, longMemoryState });
    applyPrivateContactChatWallpaper(contact);
    applyPrivateContactSettingsWallpaperPreview(page, contact);
    if (options.preserveScroll) {
        requestAnimationFrame(() => {
            page.scrollTop = previousScrollTop;
        });
    } else {
        page.scrollTop = 0;
    }
}

function openPrivateContactChatSettingsPage(contactId = privateActiveContactChatId) {
    const contact = getPrivateContactById(contactId);
    if (!contact) {
        showPrivateSystemToast('请先打开一个联系人聊天。');
        return;
    }
    const chatScreen = document.querySelector('.private-chat-screen');
    privateContactChatSettingsReturnTab = chatScreen?.getAttribute('data-private-current-tab') === 'contact-chat'
        ? 'contact-chat'
        : (privateContactChatSettingsReturnTab || 'contact-chat');
    void renderPrivateContactChatSettingsPage(contact.id);
    switchPrivateTab('contact-chat-settings');
}

function closePrivateContactChatSettingsPage() {
    const chatScreen = document.querySelector('.private-chat-screen');
    if (chatScreen?.getAttribute('data-private-current-tab') !== 'contact-chat-settings') return;
    switchPrivateTab(privateContactChatSettingsReturnTab || 'contact-chat');
    requestAnimationFrame(() => {
        document.getElementById('private-contact-chat-input')?.focus();
    });
}

function getPrivateStoredContactById(contactId) {
    const rawId = String(contactId || '').trim();
    if (!rawId) return null;
    const id = normalizePrivateContactRecordId(rawId);
    return getPrivateScopedContacts().find(contact => String(contact?.id || '').trim() === id) || null;
}

function refreshPrivateLinkedDossierSurfaces(type = 'char', recordId = '') {
    try {
        if (typeof getDossierActiveKey === 'function' && typeof loadDossierState === 'function') {
            loadDossierState()[getDossierActiveKey(type)] = String(recordId || '').trim() || loadDossierState()[getDossierActiveKey(type)];
        }
        if (typeof renderDossierList === 'function') renderDossierList(type);
        if (typeof renderDossierDetail === 'function') renderDossierDetail(type);
        if (typeof renderDossierNetwork === 'function') renderDossierNetwork();
    } catch (error) {
        console.warn('私叙刷新卷宗界面失败:', error);
    }
}

function refreshPrivateContactLinkedSurfaces(contactId, options = {}) {
    const safeContactId = String(contactId || '').trim();
    renderPrivateContacts();
    renderPrivateThreads();
    if (privateActiveContactChatId === safeContactId) {
        renderPrivateContactChatPage(safeContactId, { scrollToBottom: false });
    }
    const settingsPage = document.getElementById('private-contact-chat-settings-page');
    const settingsContactId = settingsPage?.querySelector('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || '';
    if (settingsPage && settingsContactId === safeContactId) {
        renderPrivateContactChatSettingsPage(safeContactId, { preserveScroll: options.preserveSettingsScroll !== false });
    }
    const homepagePage = document.querySelector('[data-private-contact-homepage-id]');
    const homepageContactId = homepagePage?.getAttribute('data-private-contact-homepage-id') || '';
    if (homepageContactId === safeContactId && document.querySelector('.private-chat-screen')?.getAttribute('data-private-current-tab') === 'contact-homepage') {
        openPrivateContactHomepage(safeContactId, privateContactHomepageActiveSection);
    }
}

function isPrivateContactLinkedToDossierRecord(contact = {}, type = 'char', recordId = '') {
    const safeType = normalizePrivateDossierType(type);
    const safeRecordId = String(recordId || '').trim();
    if (!safeType || !safeRecordId) return false;
    return normalizePrivateDossierType(contact?.dossierType) === safeType
        && String(contact?.dossierRecordId || '').trim() === safeRecordId;
}

async function removePrivateContactsLinkedToDossierRecord(type = 'char', recordId = '') {
    const safeType = normalizePrivateDossierType(type);
    const safeRecordId = String(recordId || '').trim();
    if (!safeType || !safeRecordId) return 0;

    const currentScopeId = getPrivateContactScopeId(privateState);
    privateState.identities = normalizePrivateIdentitySlots(privateState.identities);

    const removedIds = new Set();
    Object.entries(privateState.identities).forEach(([identityId, slot]) => {
        scopePrivateContacts(slot?.contacts, identityId).forEach(contact => {
            if (isPrivateContactLinkedToDossierRecord(contact, safeType, safeRecordId)) {
                removedIds.add(normalizePrivateContactRecordId(contact.id));
            }
        });
    });
    scopePrivateContacts(privateState.contacts, currentScopeId).forEach(contact => {
        if (isPrivateContactLinkedToDossierRecord(contact, safeType, safeRecordId)) {
            removedIds.add(normalizePrivateContactRecordId(contact.id));
        }
    });
    if (!removedIds.size) return 0;

    Object.keys(privateState.identities).forEach(identityId => {
        const slot = privateState.identities[identityId] || {};
        privateState.identities[identityId] = {
            ...slot,
            contacts: scopePrivateContacts(slot.contacts, identityId).filter(contact => (
                !removedIds.has(normalizePrivateContactRecordId(contact.id))
            )),
            threads: normalizePrivateThreads(slot.threads).filter(thread => (
                !removedIds.has(normalizePrivateContactRecordId(thread.contactId))
            ))
        };
    });

    privateState.contacts = scopePrivateContacts(privateState.contacts, currentScopeId).filter(contact => (
        !removedIds.has(normalizePrivateContactRecordId(contact.id))
    ));
    privateState.threads = normalizePrivateThreads(privateState.threads).filter(thread => (
        !removedIds.has(normalizePrivateContactRecordId(thread.contactId))
    ));

    if (currentScopeId && privateState.identities[currentScopeId]) {
        privateState.contacts = scopePrivateContacts(privateState.identities[currentScopeId].contacts, currentScopeId);
        privateState.threads = normalizePrivateThreads(privateState.identities[currentScopeId].threads);
    }

    const activeContactRemoved = removedIds.has(normalizePrivateContactRecordId(privateActiveContactChatId));
    if (activeContactRemoved) {
        closePrivateContactChatAuxiliaryUi(true);
        clearPrivateContactChatEphemeralState();
        privateActiveContactChatId = '';
        privateContactChatReturnTab = 'contacts';
        privateContactChatSettingsReturnTab = 'contacts';
        privateContactHomepageReturnTab = 'contacts';
        privateContactHomepageActiveSection = 'about';
        privateContactChatHistoryExpandedId = '';
        applyPrivateContactChatWallpaper(null);
        const currentTab = document.querySelector('.private-chat-screen')?.getAttribute('data-private-current-tab') || '';
        if (['contact-chat', 'contact-chat-settings', 'contact-homepage'].includes(currentTab)) {
            switchPrivateTab('contacts');
        }
    }

    closePrivateContactProfileCard(true);
    await savePrivateState();
    renderPrivateExperience();
    return removedIds.size;
}

async function updatePrivateStoredContact(contactId, updater) {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    const contacts = getPrivateScopedContacts();
    let updatedContact = null;
    const nextContacts = contacts.map(contact => {
        if (String(contact?.id || '').trim() !== safeContactId) return contact;
        const nextContact = typeof updater === 'function' ? updater({ ...contact }) : contact;
        updatedContact = nextContact && typeof nextContact === 'object'
            ? nextContact
            : contact;
        return updatedContact;
    });
    if (!updatedContact) return null;
    setPrivateScopedContacts(nextContacts);
    return updatedContact;
}

function patchPrivateDossierRecord(contactId, patch = {}) {
    const contact = getPrivateStoredContactById(contactId);
    const safePatch = patch && typeof patch === 'object' ? patch : {};
    const record = getPrivateContactProfileRecord(contact);
    if (!record || typeof loadDossierState !== 'function') return null;
    const state = loadDossierState();
    const safeType = record.type === 'npc' ? 'npc' : 'char';
    const list = Array.isArray(state?.[safeType]) ? state[safeType] : [];
    const index = list.findIndex(item => String(item?.id || '').trim() === String(record.recordId || '').trim());
    if (index < 0) return null;
    const current = list[index] || {};
    const next = { ...current };
    if (Object.prototype.hasOwnProperty.call(safePatch, 'avatar')) {
        next.avatar = typeof normalizeDossierAvatar === 'function'
            ? normalizeDossierAvatar(safePatch.avatar)
            : String(safePatch.avatar || '').trim();
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'setting')) {
        const setting = normalizePrivateContactProfileSetting(safePatch.setting);
        next.setting = setting;
        next.note = setting;
        if (
            !String(current.relation || '').trim()
            || String(current.relation || '').trim() === String(current.setting || '').trim()
        ) {
            next.relation = setting;
        }
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rinnoMemorySummary')) {
        next.rinnoMemorySummary = normalizePrivateContactArchiveText(safePatch.rinnoMemorySummary || '');
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rinnoStorySummary')) {
        next.rinnoStorySummary = normalizePrivateContactArchiveText(safePatch.rinnoStorySummary || '');
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rinnoSummaryDigest')) {
        next.rinnoSummaryDigest = normalizePrivateContactArchiveText(safePatch.rinnoSummaryDigest || '', PRIVATE_CONTACT_SUMMARY_DIGEST_LIMIT);
    }
    if (Object.prototype.hasOwnProperty.call(safePatch, 'rinnoSummaryUpdatedAt')) {
        next.rinnoSummaryUpdatedAt = Math.max(0, Number(safePatch.rinnoSummaryUpdatedAt) || 0);
    }
    list[index] = next;
    if (typeof saveDossierState === 'function') saveDossierState();
    refreshPrivateLinkedDossierSurfaces(safeType, record.recordId);
    return next;
}

function getPrivateContactSummaryProgress(contactId, options = {}) {
    const contact = getPrivateContactById(contactId);
    const threshold = normalizePrivateContactSummaryThreshold(
        options.threshold
        || contact?.autoSummaryThreshold
    );
    const sourceItems = getPrivateContactSummarySourceItems(contactId);
    const visibleMessages = sourceItems
        .filter(item => item.kind === 'chat')
        .map(item => item.message)
        .filter(Boolean);
    const sourceCount = sourceItems.length;
    const capsuleCount = sourceItems.filter(item => item.kind === 'capsule').length;
    const checkpointCount = Math.min(
        sourceCount,
        Math.max(0, Number(contact?.summaryCheckpointCount) || 0)
    );
    return {
        sourceItems,
        sourceCount,
        capsuleCount,
        visibleMessages,
        visibleCount: visibleMessages.length,
        checkpointCount,
        unsummarizedCount: Math.max(0, sourceCount - checkpointCount),
        threshold
    };
}

async function openPrivateContactChatSettingsAvatarPicker(kind = '', contactId = privateActiveContactChatId) {
    const safeKind = kind === 'user' ? 'user' : 'contact';
    if (safeKind === 'contact' && !getPrivateStoredContactById(contactId)) {
        showPrivateSystemToast('当前联系人不存在。');
        return;
    }
    let input = privateContactChatSettingsAvatarInput;
    if (!(input instanceof HTMLInputElement)) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.hidden = true;
        input.addEventListener('change', event => {
            const file = event.target?.files?.[0];
            event.target.value = '';
            void handlePrivateContactChatSettingsAvatarUpload(file);
        });
        document.body.appendChild(input);
        privateContactChatSettingsAvatarInput = input;
    }
    privateContactChatSettingsAvatarTarget = {
        kind: safeKind,
        contactId: String(contactId || '').trim()
    };
    input.click();
}

function openPrivateContactChatWallpaperPicker(contactId = privateActiveContactChatId) {
    const safeContactId = String(contactId || privateActiveContactChatId || '').trim();
    if (!getPrivateStoredContactById(safeContactId)) {
        showPrivateSystemToast('当前联系人不存在。');
        return;
    }
    let input = privateContactChatWallpaperInput;
    if (!(input instanceof HTMLInputElement)) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.hidden = true;
        input.addEventListener('change', event => {
            const file = event.target?.files?.[0];
            event.target.value = '';
            void handlePrivateContactChatWallpaperUpload(file);
        });
        document.body.appendChild(input);
        privateContactChatWallpaperInput = input;
    }
    privateContactChatWallpaperTargetId = safeContactId;
    input.click();
}

async function handlePrivateContactChatSettingsAvatarUpload(file) {
    const target = privateContactChatSettingsAvatarTarget || {};
    privateContactChatSettingsAvatarTarget = null;
    if (!file) return;
    if (target.kind === 'user') {
        await handlePrivateAvatarUpload(file);
        refreshPrivateContactLinkedSurfaces(privateActiveContactChatId, { preserveSettingsScroll: true });
        showPrivateSystemToast('你的头像已同步更新。');
        return;
    }
    const safeContactId = String(target.contactId || privateActiveContactChatId || '').trim();
    if (!safeContactId) return;
    try {
        const avatar = await readPrivateImageFile(file, {
            maxEdge: PRIVATE_AVATAR_IMAGE_MAX_EDGE,
            quality: 0.82
        });
        if (!avatar) return;
        await updatePrivateStoredContact(safeContactId, current => ({
            ...current,
            avatar
        }));
        patchPrivateDossierRecord(safeContactId, { avatar });
        await savePrivateState();
        refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
        showPrivateSystemToast('联系人头像已同步到私叙与卷宗。');
    } catch (error) {
        console.warn('联系人头像保存失败:', error);
        showPrivateSystemToast('联系人头像保存失败，请换一张图片。');
    }
}

async function handlePrivateContactChatWallpaperUpload(file) {
    const safeContactId = String(privateContactChatWallpaperTargetId || privateActiveContactChatId || '').trim();
    privateContactChatWallpaperTargetId = '';
    if (!file || !safeContactId) return;
    try {
        const chatWallpaper = normalizePrivateContactWallpaper(await readPrivateImageFile(file, {
            maxEdge: PRIVATE_IMAGE_MAX_EDGE,
            quality: 0.8
        }));
        if (!chatWallpaper) {
            showPrivateSystemToast('聊天壁纸保存失败，请换一张图片。');
            return;
        }
        await updatePrivateStoredContact(safeContactId, current => ({
            ...current,
            chatWallpaper
        }));
        await savePrivateState();
        refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
        showPrivateSystemToast('聊天壁纸已保存。');
    } catch (error) {
        console.warn('聊天壁纸保存失败:', error);
        showPrivateSystemToast('聊天壁纸保存失败，请换一张图片。');
    }
}

async function resetPrivateContactChatWallpaper(contactId = privateActiveContactChatId) {
    const safeContactId = String(contactId || privateActiveContactChatId || '').trim();
    if (!safeContactId) return false;
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        chatWallpaper: ''
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast('已恢复跟随主题。');
    return true;
}

async function savePrivateContactRemark(contactId, value) {
    const safeContactId = String(contactId || '').trim();
    const remark = normalizePrivateContactRemark(value);
    if (!safeContactId) return false;
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        remark
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast(remark ? '备注已更新，后续将优先展示。' : '备注已清空，恢复默认名字展示。');
    return true;
}

async function savePrivateContactProfileSettings(contactId, payload = {}) {
    const safeContactId = String(contactId || '').trim();
    const userSetting = normalizePrivateContactProfileSetting(payload.userSetting);
    const contactSetting = normalizePrivateContactProfileSetting(payload.contactSetting);
    if (!safeContactId) return false;
    privateState.userPresetSetting = userSetting || createDefaultPrivateUserPreset().setting;
    syncPrivateIdentitySlot();
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        note: contactSetting
    }));
    patchPrivateDossierRecord(safeContactId, { setting: contactSetting });
    await savePrivateState();
    renderPrivateProfileSurface();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    if (typeof renderDossierNetwork === 'function') renderDossierNetwork();
    showPrivateSystemToast('双方设定已同步更新。');
    return true;
}

async function savePrivateContactTimezone(contactId, value) {
    const safeContactId = String(contactId || '').trim();
    const rawValue = String(value || '').trim();
    if (!safeContactId) return false;
    if (rawValue && !isPrivateValidTimezone(rawValue)) {
        showPrivateSystemToast('时区格式无效，请使用如 Asia/Shanghai 这样的 IANA 时区。');
        renderPrivateContactChatSettingsPage(safeContactId, { preserveScroll: true });
        return false;
    }
    const timezone = normalizePrivateContactTimezone(rawValue);
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        timezone
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast(timezone ? `联系人时区已更新为 ${timezone}。` : '联系人时区已恢复为跟随你的时区。');
    return true;
}

async function savePrivateContactReplyCadence(contactId, payload = {}) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    const replyCadence = resolvePrivateContactReplyCadenceConfig({
        replyMinCount: payload?.min,
        replyMaxCount: payload?.max
    });
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        replyMinCount: replyCadence.min,
        replyMaxCount: replyCadence.max
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast(`手动回复条数已更新为 ${replyCadence.label} 条。`);
    return true;
}

async function savePrivateContactNudgeSuffixes(contactId, payload = {}) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    const userNudgeSuffix = normalizePrivateContactNudgeSuffix(payload?.user, PRIVATE_CONTACT_CHAT_DEFAULT_USER_NUDGE_SUFFIX);
    const contactNudgeSuffix = normalizePrivateContactNudgeSuffix(payload?.contact, PRIVATE_CONTACT_CHAT_DEFAULT_CONTACT_NUDGE_SUFFIX);
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        userNudgeSuffix,
        contactNudgeSuffix
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast('拍一拍后缀已保存。');
    return true;
}

async function setPrivateContactTimeAwareness(contactId, enabled) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        timeAwarenessEnabled: Boolean(enabled)
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast(enabled ? '时间感知已开启，联系人可读取真实当前时间。' : '时间感知已关闭，系统将严格禁止联系人感知真实时间。');
    return true;
}

async function setPrivateContactAutoSummaryEnabled(contactId, enabled) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        autoSummaryEnabled: Boolean(enabled),
        autoSummaryThreshold: normalizePrivateContactSummaryThreshold(current?.autoSummaryThreshold)
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    if (enabled) {
        showPrivateSystemToast('自动总结已开启。达到阈值后会立即归档。');
        void maybeTriggerPrivateContactAutoSummary(safeContactId);
    } else {
        showPrivateSystemToast('自动总结已关闭。');
    }
    return true;
}

async function savePrivateContactSummaryThreshold(contactId, value) {
    const safeContactId = String(contactId || '').trim();
    if (!safeContactId) return false;
    const threshold = normalizePrivateContactSummaryThreshold(value);
    await updatePrivateStoredContact(safeContactId, current => ({
        ...current,
        autoSummaryThreshold: threshold
    }));
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(safeContactId, { preserveSettingsScroll: true });
    showPrivateSystemToast(`自动总结阈值已更新为 ${threshold} 条。`);
    void maybeTriggerPrivateContactAutoSummary(safeContactId);
    return true;
}

function ensurePrivateContactEditModal() {
    let modal = document.getElementById('private-contact-edit-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'private-contact-edit-modal dossier-editor-modal';
    modal.id = 'private-contact-edit-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-edit-title');
    modal.innerHTML = `
        <form class="dossier-editor private-contact-edit-dialog" id="private-contact-edit-form" autocomplete="off" novalidate>
            <div class="dossier-editor-head private-contact-edit-head">
                <div>
                    <div class="dossier-editor-kicker">CONTACT SETTING</div>
                    <h2 id="private-contact-edit-title">编辑联系人设定</h2>
                    <p class="dossier-editor-subline">EDIT CONTACT SETTING</p>
                </div>
            </div>
            <input type="hidden" id="private-contact-edit-id" name="contact_id">
            <div class="dossier-editor-flow">
                <label class="dossier-field">
                    <span>昵称 / 显示名</span>
                    <input id="private-contact-edit-title-input" name="title" maxlength="40" placeholder="联系人昵称">
                </label>
                <label class="dossier-field">
                    <span>ID</span>
                    <input id="private-contact-edit-account" name="account_id" maxlength="64" placeholder="账号 ID">
                </label>
                <label class="dossier-field">
                    <span>状态短句</span>
                    <input id="private-contact-edit-subtitle" name="subtitle" maxlength="80" placeholder="通讯页副标题">
                </label>
                <label class="dossier-field">
                    <span>签名</span>
                    <input id="private-contact-edit-signature" name="signature" maxlength="120" placeholder="个人签名">
                </label>
                <label class="dossier-field dossier-field-setting">
                    <span>联系人设定</span>
                    <textarea id="private-contact-edit-note" name="note" rows="7" maxlength="1800" placeholder="编辑联系人设定、备注或关系描述…"></textarea>
                </label>
            </div>
            <div class="dossier-editor-actions">
                <button class="dossier-soft-button interactive" id="private-contact-edit-cancel" type="button">取消</button>
                <button class="dossier-soft-button primary interactive" type="submit">保存</button>
            </div>
        </form>
    `;
    document.body.appendChild(modal);
    bindPrivateBackdropDismiss(modal, '.private-contact-edit-dialog', () => closePrivateContactQuickEditModal());
    modal.querySelector('#private-contact-edit-cancel')?.addEventListener('click', () => closePrivateContactQuickEditModal());
    modal.querySelector('#private-contact-edit-form')?.addEventListener('submit', event => {
        event.preventDefault();
        void savePrivateContactQuickEdit();
    });
    return modal;
}

function getPrivateContactDossierEditorTarget(contact = {}) {
    const hydrated = getPrivateHydratedContact(contact) || contact || {};
    const record = getPrivateContactProfileRecord(hydrated) || getPrivateContactProfileRecord(contact);
    if (record?.recordId) {
        return {
            type: record.type === 'npc' ? 'npc' : 'char',
            id: String(record.recordId || '').trim()
        };
    }
    const state = getPrivateDossierStateSnapshot();
    const preferredType = normalizePrivateDossierType(hydrated?.dossierType || contact?.dossierType || (String(hydrated?.type || contact?.type || '').includes('npc') ? 'npc' : 'char'));
    const recordId = String(hydrated?.dossierRecordId || contact?.dossierRecordId || '').trim();
    if (recordId) {
        const preferredList = Array.isArray(state?.[preferredType]) ? state[preferredType] : [];
        if (preferredList.some(item => String(item?.id || '').trim() === recordId)) {
            return { type: preferredType, id: recordId };
        }
        const fallbackType = preferredType === 'npc' ? 'char' : 'npc';
        const fallbackList = Array.isArray(state?.[fallbackType]) ? state[fallbackType] : [];
        if (fallbackList.some(item => String(item?.id || '').trim() === recordId)) {
            return { type: fallbackType, id: recordId };
        }
    }
    const accountId = normalizePrivateDossierAccount(hydrated?.accountId || contact?.accountId);
    if (accountId) {
        const accountRecord = getPrivateDossierAccountRecords().find(item => item.accountId === accountId);
        if (accountRecord?.recordId) {
            return {
                type: accountRecord.type === 'npc' ? 'npc' : 'char',
                id: String(accountRecord.recordId || '').trim()
            };
        }
    }
    return null;
}

async function openPrivateContactQuickEdit(contactId) {
    const contact = getPrivateStoredContactById(contactId) || getPrivateContactById(contactId);
    if (!contact) {
        showPrivateSystemToast('没有找到联系人。');
        return;
    }
    const target = getPrivateContactDossierEditorTarget(contact);
    if (!target?.id) {
        showPrivateSystemToast('没有找到对应卷宗 CHAR。');
        return;
    }
    closePrivateContactQuickEditModal(true);
    closePrivateContactHomepageEditModal(true);
    if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }
    const settleDossierLaunch = () => new Promise(resolve => {
        window.setTimeout(resolve, 280);
    });
    if (typeof openDossierApp === 'function') {
        await openDossierApp();
        await settleDossierLaunch();
    }
    if (typeof switchDossierTab === 'function') {
        switchDossierTab(target.type, false);
    }
    if (typeof openDossierEditor === 'function') {
        openDossierEditor(target.type, target.id, { autoFocus: false, openedFromPrivateContact: true });
        return;
    }
    showPrivateSystemToast('卷宗编辑器未加载，请先打开一次卷宗。');
}

async function savePrivateContactQuickEdit() {
    const contactId = String(document.getElementById('private-contact-edit-id')?.value || '').trim();
    if (!contactId) {
        showPrivateSystemToast('没有找到联系人。');
        return;
    }
    const title = String(document.getElementById('private-contact-edit-title-input')?.value || '').trim() || '新联系人';
    const accountId = normalizePrivateDossierAccount(document.getElementById('private-contact-edit-account')?.value || '');
    const subtitle = String(document.getElementById('private-contact-edit-subtitle')?.value || '').trim() || '私叙联系人';
    const signature = normalizePrivateContactSignature(document.getElementById('private-contact-edit-signature')?.value || '');
    const note = normalizePrivateContactProfileSetting(document.getElementById('private-contact-edit-note')?.value || '') || '还没有留下更多说明。';
    const updated = await updatePrivateStoredContact(contactId, current => ({
        ...current,
        title,
        accountId: accountId || current.accountId || '',
        subtitle,
        signature,
        note
    }));
    if (!updated) {
        showPrivateSystemToast('保存失败：联系人不存在。');
        return;
    }
    patchPrivateDossierRecord(contactId, { setting: note });
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(contactId, { preserveSettingsScroll: true });
    closePrivateContactQuickEditModal();
    showPrivateSystemToast('联系人设定已保存。');
}

function closePrivateContactQuickEditModal(instant = false) {
    const modal = document.getElementById('private-contact-edit-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.removeAttribute('data-private-contact-edit-open');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function ensurePrivateContactHomepageEditModal() {
    let modal = document.getElementById('private-contact-homepage-edit-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'private-contact-edit-modal dossier-editor-modal private-contact-homepage-edit-modal';
    modal.id = 'private-contact-homepage-edit-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'private-contact-homepage-edit-title');
    modal.innerHTML = `
        <form class="dossier-editor private-contact-edit-dialog private-contact-homepage-edit-dialog" id="private-contact-homepage-edit-form" autocomplete="off" novalidate>
            <div class="dossier-editor-head private-contact-edit-head">
                <div>
                    <div class="dossier-editor-kicker">HOMEPAGE PROFILE</div>
                    <h2 id="private-contact-homepage-edit-title">编辑联系人主页</h2>
                    <p class="dossier-editor-subline">EDIT HOMEPAGE PROFILE</p>
                </div>
            </div>
            <input type="hidden" id="private-contact-homepage-edit-id" name="contact_id">
            <div class="dossier-editor-flow">
                <label class="dossier-field">
                    <span>昵称 / 显示名</span>
                    <input id="private-contact-homepage-edit-title-input" name="title" maxlength="40" placeholder="联系人昵称">
                </label>
                <label class="dossier-field">
                    <span>ID</span>
                    <input id="private-contact-homepage-edit-account" name="account_id" maxlength="64" placeholder="账号 ID">
                </label>
                <label class="dossier-field">
                    <span>状态短句</span>
                    <input id="private-contact-homepage-edit-subtitle" name="subtitle" maxlength="80" placeholder="通讯页副标题">
                </label>
                <label class="dossier-field">
                    <span>签名</span>
                    <input id="private-contact-homepage-edit-signature" name="signature" maxlength="120" placeholder="个人签名">
                </label>
                <label class="dossier-field dossier-field-setting">
                    <span>主页设定</span>
                    <textarea id="private-contact-homepage-edit-note" name="note" rows="7" maxlength="1800" placeholder="编辑主页展示设定、备注或关系描述…"></textarea>
                </label>
                <div class="dossier-editor-kicker private-contact-edit-section-kicker">更多</div>
                <label class="dossier-field">
                    <span>职业</span>
                    <input id="private-contact-homepage-edit-profession" name="profession" maxlength="40" placeholder="职业 / 身份标签">
                </label>
                <label class="dossier-field">
                    <span>手机号</span>
                    <input id="private-contact-homepage-edit-phone" name="phone_number" maxlength="40" placeholder="+86 138 0000 0000 / 其它地区手机号">
                </label>
                <label class="dossier-field">
                    <span>IP 城市定位</span>
                    <input id="private-contact-homepage-edit-ip-city" name="ip_city" maxlength="60" placeholder="设定未指定 / 虚构地点 / 城市">
                </label>
                <label class="dossier-field">
                    <span>家庭住址</span>
                    <input id="private-contact-homepage-edit-home-address" name="home_address" maxlength="120" placeholder="设定未指定 / 泛化落点 / 住址">
                </label>
                <div class="dossier-editor-kicker private-contact-edit-section-kicker">经历</div>
                <label class="dossier-field dossier-field-setting">
                    <span>幼时</span>
                    <textarea id="private-contact-homepage-edit-stage-0" name="stage_childhood" rows="3" maxlength="220" placeholder="编辑幼时经历…"></textarea>
                </label>
                <label class="dossier-field dossier-field-setting">
                    <span>年少时</span>
                    <textarea id="private-contact-homepage-edit-stage-1" name="stage_teen" rows="3" maxlength="220" placeholder="编辑年少时经历…"></textarea>
                </label>
                <label class="dossier-field dossier-field-setting">
                    <span>如今</span>
                    <textarea id="private-contact-homepage-edit-stage-2" name="stage_now" rows="3" maxlength="220" placeholder="编辑如今经历…"></textarea>
                </label>
            </div>
            <div class="dossier-editor-actions">
                <button class="dossier-soft-button interactive" id="private-contact-homepage-edit-cancel" type="button">取消</button>
                <button class="dossier-soft-button primary interactive" type="submit">保存</button>
            </div>
        </form>
    `;
    document.body.appendChild(modal);
    bindPrivateBackdropDismiss(modal, '.private-contact-homepage-edit-dialog', () => closePrivateContactHomepageEditModal());
    modal.querySelector('#private-contact-homepage-edit-cancel')?.addEventListener('click', () => closePrivateContactHomepageEditModal());
    modal.querySelector('#private-contact-homepage-edit-form')?.addEventListener('submit', event => {
        event.preventDefault();
        void savePrivateContactHomepageEdit();
    });
    return modal;
}

async function openPrivateContactHomepageEdit(contactId) {
    const contact = getPrivateStoredContactById(contactId) || getPrivateContactById(contactId);
    if (!contact) {
        showPrivateSystemToast('没有找到联系人。');
        return;
    }
    const modal = ensurePrivateContactHomepageEditModal();
    const hydrated = getPrivateHydratedContact(contact);
    const profile = resolvePrivateContactGeneratedProfile(hydrated, getPrivateContactProfileRecord(hydrated));
    const storedStages = normalizePrivateContactLifeStages(hydrated.lifeStages);
    const stages = storedStages.length ? storedStages : normalizePrivateContactLifeStages(profile.lifeStages);
    setPrivateFieldValue('private-contact-homepage-edit-id', contact.id || contactId);
    setPrivateFieldValue('private-contact-homepage-edit-title-input', getPrivateContactDisplayName(hydrated));
    setPrivateFieldValue('private-contact-homepage-edit-account', hydrated.accountId || '');
    setPrivateFieldValue('private-contact-homepage-edit-subtitle', hydrated.subtitle || '');
    setPrivateFieldValue('private-contact-homepage-edit-signature', hydrated.signature || '');
    setPrivateFieldValue('private-contact-homepage-edit-note', hydrated.note || '');
    setPrivateFieldValue('private-contact-homepage-edit-profession', hydrated.profession || profile.profession || '');
    setPrivateFieldValue('private-contact-homepage-edit-phone', hydrated.phoneNumber || profile.phoneNumber || '');
    setPrivateFieldValue('private-contact-homepage-edit-ip-city', hydrated.ipCity || profile.ipCity || '');
    setPrivateFieldValue('private-contact-homepage-edit-home-address', hydrated.homeAddress || profile.homeAddress || '');
    PRIVATE_CONTACT_STAGE_LABELS.forEach((label, index) => {
        setPrivateFieldValue(`private-contact-homepage-edit-stage-${index}`, stages[index]?.experience || '');
    });
    modal.hidden = false;
    modal.setAttribute('data-private-contact-homepage-edit-open', 'true');
    requestAnimationFrame(() => modal.classList.add('active'));
}

async function savePrivateContactHomepageEdit() {
    const contactId = String(document.getElementById('private-contact-homepage-edit-id')?.value || '').trim();
    if (!contactId) {
        showPrivateSystemToast('没有找到联系人。');
        return;
    }
    const currentContact = getPrivateStoredContactById(contactId) || getPrivateContactById(contactId) || {};
    const record = getPrivateContactProfileRecord(currentContact) || {};
    const title = String(document.getElementById('private-contact-homepage-edit-title-input')?.value || '').trim() || '新联系人';
    const accountId = normalizePrivateDossierAccount(document.getElementById('private-contact-homepage-edit-account')?.value || '');
    const subtitle = String(document.getElementById('private-contact-homepage-edit-subtitle')?.value || '').trim() || '私叙联系人';
    const signature = normalizePrivateContactSignature(document.getElementById('private-contact-homepage-edit-signature')?.value || '');
    const note = normalizePrivateContactProfileSetting(document.getElementById('private-contact-homepage-edit-note')?.value || '') || '还没有留下更多说明。';
    const profession = String(document.getElementById('private-contact-homepage-edit-profession')?.value || '').trim().slice(0, 40);
    const phoneNumber = normalizePrivateEditableContactPhoneNumber(
        document.getElementById('private-contact-homepage-edit-phone')?.value || '',
        currentContact,
        record
    );
    const ipCity = String(document.getElementById('private-contact-homepage-edit-ip-city')?.value || '').trim().slice(0, 60);
    const homeAddress = String(document.getElementById('private-contact-homepage-edit-home-address')?.value || '').trim().slice(0, 120);
    const lifeStages = normalizePrivateContactLifeStages(PRIVATE_CONTACT_STAGE_LABELS.map((age, index) => ({
        age,
        experience: document.getElementById(`private-contact-homepage-edit-stage-${index}`)?.value || ''
    })));
    const updated = await updatePrivateStoredContact(contactId, current => ({
        ...current,
        title,
        accountId: accountId || current.accountId || '',
        subtitle,
        signature,
        note,
        profession,
        phoneNumber,
        ipCity,
        homeAddress,
        lifeStages,
        generatedProfileAt: Date.now()
    }));
    if (!updated) {
        showPrivateSystemToast('保存失败：联系人不存在。');
        return;
    }
    patchPrivateDossierRecord(contactId, { setting: note });
    await savePrivateState();
    refreshPrivateContactLinkedSurfaces(contactId, { preserveSettingsScroll: true });
    closePrivateContactHomepageEditModal();
    showPrivateSystemToast('联系人主页已保存。');
}

function closePrivateContactHomepageEditModal(instant = false) {
    const modal = document.getElementById('private-contact-homepage-edit-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.removeAttribute('data-private-contact-homepage-edit-open');
    const hide = () => {
        if (!modal.classList.contains('active')) modal.hidden = true;
    };
    if (instant) hide();
    else window.setTimeout(hide, 180);
}

function closePrivateContactHomepage(instant = false) {
    const page = document.getElementById('private-contact-homepage-page');
    const chatScreen = document.querySelector('.private-chat-screen');
    privateContactHomepageActiveSection = 'about';
    if (chatScreen?.getAttribute('data-private-current-tab') === 'contact-homepage') {
        switchPrivateTab(privateContactHomepageReturnTab || 'contacts');
    }
    if (page && instant) page.innerHTML = '';
}

function removePrivateContactThreadById(contactId) {
    const safeContactId = normalizePrivateContactRecordId(contactId);
    if (!safeContactId) return false;
    const filterThread = thread => normalizePrivateContactRecordId(thread?.contactId || '') !== safeContactId;
    const before = normalizePrivateThreads(privateState.threads).length;
    privateState.threads = normalizePrivateThreads(privateState.threads).filter(filterThread);
    const currentScopeId = getPrivateContactScopeId(privateState);
    privateState.identities = normalizePrivateIdentitySlots(privateState.identities);
    if (currentScopeId && privateState.identities[currentScopeId]) {
        privateState.identities[currentScopeId] = {
            ...privateState.identities[currentScopeId],
            threads: normalizePrivateThreads(privateState.identities[currentScopeId].threads).filter(filterThread)
        };
    }
    return before !== normalizePrivateThreads(privateState.threads).length;
}

async function clearPrivateContactHomepageChat(contactId) {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    const name = getPrivateContactDisplayName(contact);
    if (!window.confirm(`确定清空「${name}」的聊天记录吗？此操作不会删除联系人。`)) return;
    removePrivateContactThreadById(contact.id);
    if (String(privateActiveContactChatId || '').trim() === String(contact.id || '').trim()) {
        clearPrivateContactChatEphemeralState();
        privateActiveContactChatId = '';
    }
    await savePrivateState();
    renderPrivateThreads();
    openPrivateContactHomepage(contact.id, privateContactHomepageActiveSection);
    showPrivateSystemToast('聊天记录已清空。');
}

async function togglePrivateContactHomepageBlock(contactId) {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    const nextBlocked = !Boolean(contact.isBlocked);
    const updated = await updatePrivateStoredContact(contact.id, current => ({
        ...current,
        isBlocked: nextBlocked,
        blockedAt: nextBlocked ? Date.now() : 0
    }));
    if (!updated) return;
    await savePrivateState();
    renderPrivateContacts();
    renderPrivateThreads();
    openPrivateContactHomepage(contact.id, privateContactHomepageActiveSection);
    showPrivateSystemToast(nextBlocked ? '已拉黑该联系人。' : '已解除拉黑。');
}

async function deletePrivateContactFromHomepage(contactId) {
    const contact = getPrivateContactById(contactId);
    if (!contact) return;
    const name = getPrivateContactDisplayName(contact);
    if (!window.confirm(`确定删除联系人「${name}」吗？聊天记录也会一并移除。`)) return;
    const safeContactId = normalizePrivateContactRecordId(contact.id);
    setPrivateScopedContacts(getPrivateScopedContacts().filter(item => normalizePrivateContactRecordId(item?.id || '') !== safeContactId));
    removePrivateContactThreadById(safeContactId);
    if (normalizePrivateContactRecordId(privateActiveContactChatId) === safeContactId) {
        closePrivateContactChatAuxiliaryUi(true);
        clearPrivateContactChatEphemeralState();
        privateActiveContactChatId = '';
    }
    await savePrivateState();
    closePrivateContactProfileCard(true);
    closePrivateContactHomepage(true);
    renderPrivateExperience();
    showPrivateSystemToast('联系人已删除。');
}

async function handlePrivateContactHomepageManageAction(action, contactId) {
    if (action === 'clear-chat') return clearPrivateContactHomepageChat(contactId);
    if (action === 'block') return togglePrivateContactHomepageBlock(contactId);
    if (action === 'delete') return deletePrivateContactFromHomepage(contactId);
}

function renderPrivateContactsLegacy() {
    const list = document.getElementById('private-contact-list');
    if (!list) return;
    const contacts = getPrivateScopedContacts().map(getPrivateHydratedContact);
    setPrivateScopedContacts(contacts);
    if (!contacts.length) {
        list.innerHTML = '<div class="private-contact-empty" role="status"><span>暂无常驻联系人</span></div>';
        return;
    }
    list.innerHTML = contacts.map(contact => {
        const avatarStyle = contact.avatar ? ` style="background-image:url(&quot;${escapePrivateHtml(contact.avatar)}&quot;)"` : '';
        const displayName = getPrivateContactDisplayName(contact);
        return `
        <article class="private-contact-card interactive" role="button" tabindex="0" data-private-contact="${escapePrivateHtml(contact.id)}">
            <div class="private-contact-mark ${contact.avatar ? 'has-image' : ''}"${avatarStyle} aria-hidden="true">${escapePrivateHtml(getPrivateContactMark(contact))}</div>
            <div class="private-contact-copy">
                <div class="private-contact-title">${escapePrivateHtml(displayName)}</div>
                <div class="private-contact-sub">${escapePrivateHtml(contact.subtitle)}</div>
                <p class="private-contact-note">${escapePrivateHtml(contact.note)}</p>
            </div>
            <button class="private-contact-edit interactive" type="button" aria-label="编辑联系人">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            </button>
        </article>
    `;
    }).join('');
}

function renderPrivateContacts() {
    const list = document.getElementById('private-contact-list');
    if (!list) return;
    const contacts = getPrivateScopedContacts().map(getPrivateHydratedContact);
    setPrivateScopedContacts(contacts);
    if (!contacts.length) {
        list.innerHTML = '<div class="private-contact-empty" role="status"><span>暂无常驻联系人</span></div>';
        return;
    }
    list.innerHTML = contacts.map(contact => {
        const displayName = getPrivateContactDisplayName(contact);
        return `
        <article class="private-contact-card interactive" data-private-contact="${escapePrivateHtml(contact.id)}" data-private-contact-title="${escapePrivateHtml(displayName)}">
            <div class="private-contact-rail">
                <button class="private-contact-arrow interactive" type="button" data-private-contact-profile-card="${escapePrivateHtml(contact.id)}" aria-label="Open profile card" title="Profile card">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div class="private-contact-title">${escapePrivateHtml(displayName)}</div>
                <button class="private-contact-edit interactive" type="button" data-private-contact-edit="${escapePrivateHtml(contact.id)}" aria-label="编辑联系人" title="编辑联系人">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
                </button>
            </div>
            <button class="private-contact-face interactive" type="button" data-private-contact-homepage="${escapePrivateHtml(contact.id)}" aria-label="Open ${escapePrivateHtml(displayName)} homepage">
                ${createPrivateContactPreviewAvatarMarkup(contact)}
            </button>
            <div class="private-contact-copy">
                <div class="private-contact-sub">${escapePrivateHtml(contact.subtitle)}</div>
                <p class="private-contact-note">${escapePrivateHtml(contact.note)}</p>
            </div>
        </article>
    `;
    }).join('');
}

function renderPrivateMoments() {
    const feed = document.getElementById('private-moment-feed');
    if (!feed) return;
    const moments = normalizePrivateMoments(privateState.moments, createDefaultPrivateState().moments);
    privateState.moments = moments;
    if (!moments.length) {
        feed.innerHTML = '<div class="private-moment-empty" aria-hidden="true"></div>';
        return;
    }
    feed.innerHTML = moments.map(moment => `
        <article class="private-moment-card">
            <div class="private-moment-avatar" aria-hidden="true">我</div>
            <div>
                <div class="private-moment-name">${escapePrivateHtml(getPrivateDisplayName())}</div>
                <h3 class="private-moment-title">${escapePrivateHtml(moment.title)}</h3>
                <p class="private-moment-text">${escapePrivateHtml(moment.text)}</p>
                <div class="private-moment-meta">
                    <span>${escapePrivateHtml(moment.time)} · ${escapePrivateHtml(moment.mood)}</span>
                    <button class="private-moment-tool interactive" type="button" aria-label="动态操作">
                        <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
    feed.querySelectorAll('.private-moment-avatar').forEach(el => updatePrivateAvatarElement(el, privateState.avatar));
}

function renderPrivateProfileSurface() {
    updatePrivateAvatarElement(document.getElementById('private-profile-avatar'), privateState.avatar);
    updatePrivateAvatarElement(document.getElementById('private-moments-avatar'), privateState.avatar);

    setPrivateEditableText('[data-private-profile-field="nickname"]', getPrivateDisplayName());
    setPrivateEditableText('[data-private-profile-field="profileBio"]', privateState.profileBio || createDefaultPrivateState().profileBio);
    setPrivateEditableText('[data-private-profile-field="maskName"]', privateState.maskName || createDefaultPrivateState().maskName);
    setPrivateEditableText('[data-private-profile-field="preferenceNote"]', privateState.preferenceNote || createDefaultPrivateState().preferenceNote);
    renderPrivateUserPresetSurface();

    const mail = document.getElementById('private-profile-mail');
    const issue = document.getElementById('private-chat-issue');
    const stamp = document.getElementById('private-moment-stamp');
    const momentsName = document.getElementById('private-moments-name');
    if (mail) mail.textContent = getPrivateAccountLine();
    if (issue) issue.textContent = '把想说的话留到安静处慢慢展开。';
    if (stamp) stamp.textContent = getPrivateMonthStamp();
    if (momentsName) momentsName.textContent = getPrivateDisplayName();
}

function renderPrivateExperience() {
    renderPrivateProfileSurface();
    renderPrivateThreads();
    renderPrivateContacts();
    renderPrivateMoments();
    renderPrivateStickerLibrary();
    if (privateActiveContactChatId) renderPrivateContactChatPage(privateActiveContactChatId);
    if (
        privateActiveContactChatId
        && (
            document.getElementById('private-contact-chat-settings-page')
            || document.querySelector('.private-chat-screen')?.getAttribute('data-private-current-tab') === 'contact-chat-settings'
        )
    ) {
        renderPrivateContactChatSettingsPage(privateActiveContactChatId, { preserveScroll: true });
    }
}

function switchPrivateTab(name, announce = false, options = {}) {
    const target = ['whisper', 'contacts', 'time', 'monologue', 'sticker-library', 'contact-homepage', 'contact-chat', 'contact-chat-settings'].includes(name) ? name : 'whisper';
    const chatScreen = document.querySelector('.private-chat-screen');
    const previousTarget = chatScreen?.getAttribute('data-private-current-tab') || '';
    const targetChanged = previousTarget !== target;
    const preserveScroll = Boolean(options && options.preserveScroll);
    if (chatScreen) chatScreen.setAttribute('data-private-current-tab', target);
    const primaryTab = ['contact-chat', 'contact-chat-settings'].includes(target)
        ? (privateContactChatReturnTab === 'whisper' ? 'whisper' : 'contacts')
        : (target === 'contact-homepage' ? 'contacts' : target);
    if (chatScreen) chatScreen.setAttribute('data-private-primary-tab', primaryTab);
    document.body.classList.toggle('private-contact-homepage-open', target === 'contact-homepage');
    document.body.classList.toggle('private-contact-chat-open', ['contact-chat', 'contact-chat-settings'].includes(target));
    document.querySelectorAll('[data-private-tab]').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-private-tab') === primaryTab);
    });
    document.querySelectorAll('[data-private-panel]').forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute('data-private-panel') === target);
    });
    renderPrivateExperience();
    const activePanel = document.querySelector(`[data-private-panel="${target}"]`);
    if (activePanel && targetChanged && !preserveScroll) activePanel.scrollTop = 0;
    const title = document.getElementById('private-chat-title');
    if (title) title.textContent = 'PRIVATE';
    if (announce) hidePrivateSystemToast(true);
}

async function addPrivateThread(type) {
    renderPrivateThreads();
    switchPrivateTab(type === 'group' ? 'contacts' : 'whisper');
    await savePrivateState();
    showPrivateSystemToast('Threads stay clean until you open a contact chat.');
    return;
    showPrivateSystemToast('消息列表保持空白。');
}

function createPrivateMomentTitle(text) {
    const compact = String(text || '').replace(/\s+/g, '');
    if (!compact) return '今日拾光';
    return compact.length > 8 ? `${compact.slice(0, 8)}…` : compact;
}

async function publishPrivateMoment() {
    const editor = document.getElementById('private-moment-editor');
    const text = editor?.textContent.replace(/\s+/g, ' ').trim() || '';
    if (!text) {
        showPrivateSystemToast('先写下一段动态，再发送到拾光。');
        return;
    }
    const moment = {
        id: `moment-${Date.now()}`,
        title: createPrivateMomentTitle(text),
        text,
        mood: 'LIVE MOMENT',
        time: getPrivateMonthStamp()
    };
    privateState.moments = [moment, ...normalizePrivateMoments(privateState.moments, createDefaultPrivateState().moments)].slice(0, 16);
    if (editor) editor.textContent = '';
    renderPrivateMoments();
    await savePrivateState();
    closePrivateMomentComposer();
    showPrivateSystemToast('动态已收入拾光。');
}

async function savePrivateProfileFromPage() {
    const getFieldText = key => document.querySelector(`[data-private-profile-field="${key}"]`)?.textContent.trim() || '';
    privateState.nickname = getFieldText('nickname') || getPrivateDisplayName();
    privateState.userPresetName = privateState.nickname;
    privateState.profileBio = getFieldText('profileBio') || createDefaultPrivateState().profileBio;
    privateState.maskName = getFieldText('maskName') || createDefaultPrivateState().maskName;
    privateState.preferenceNote = getFieldText('preferenceNote') || createDefaultPrivateState().preferenceNote;
    syncPrivateIdentitySlot();
    renderPrivateState();
    await savePrivateState();
    showPrivateSystemToast('独白资料已保存。');
}

function renderPrivateState() {
    setApiInputValue('private-register-nickname', privateState.nickname);
    setApiInputValue('private-register-email', privateState.email);
    setApiInputValue('private-register-password', privateState.password);

    const registerAgree = document.getElementById('private-register-agree');
    const privacyAgree = document.getElementById('private-privacy-agree');
    if (registerAgree) registerAgree.checked = Boolean(privateState.agreementAccepted);
    if (privacyAgree) privacyAgree.checked = Boolean(privateState.privacyAccepted);
    const registerLogin = document.getElementById('private-register-login');
    if (registerLogin) registerLogin.hidden = !hasRegisteredPrivateAccount();

    updatePrivateAvatarElement(document.getElementById('private-avatar-frame'), privateState.avatar);

    const code = privateState.verifyCode || '20';
    const verifyEmail = document.getElementById('private-verify-email');
    const verifyContent = document.getElementById('private-verify-content');
    const verifyTo = document.getElementById('private-verify-to');
    if (verifyEmail) verifyEmail.textContent = privateState.email || '-';
    if (verifyContent) verifyContent.textContent = `注册私叙${code}`;
    if (verifyTo) verifyTo.textContent = PRIVATE_LETTER_TO;

    const sentButton = document.getElementById('private-sent-letter');
    const verifyNext = document.getElementById('private-verify-next');
    const verifyScreen = document.querySelector('[data-private-screen="verify"]');
    if (sentButton) {
        sentButton.disabled = !privateState.letterSent;
        sentButton.textContent = privateState.letterSent ? '信笺已发送' : '已发送信笺';
    }
    if (verifyNext) verifyNext.disabled = !privateState.verified;
    if (verifyScreen) verifyScreen.classList.toggle('verified', Boolean(privateState.verified));

    renderPrivateLoginIdentity();
    renderPrivateExperience();
    if (!document.getElementById('private-settings-modal')?.hidden) renderPrivateSettingsAccounts();
}

function showPrivateScreen(name) {
    const app = document.getElementById('private-app');
    document.querySelectorAll('[data-private-screen]').forEach(screen => {
        screen.classList.toggle('active', screen.getAttribute('data-private-screen') === name);
    });
    if (name === 'login') setPrivateLoginMode(privateLoginMode);
    if (name === 'chat') {
        closePrivateContactChatAuxiliaryUi(true);
        clearPrivateContactChatEphemeralState();
        switchPrivateTab('whisper');
    }
    renderPrivateState();
    if (app) app.scrollTop = 0;
    const activeScreen = document.querySelector(`[data-private-screen="${name}"]`);
    if (activeScreen) activeScreen.scrollTop = 0;
    const guideText = getPrivateGuideText(name);
    queuePrivateGuideToast(name, guideText);
}

function getActivePrivateScreenName() {
    return document.querySelector('[data-private-screen].active')?.getAttribute('data-private-screen') || '';
}

async function openPrivateApp() {
    const privateApp = document.getElementById('private-app');
    if (!privateApp) return;
    const sessionToken = ++privateOpenSessionToken;
    document.body.classList.remove('edit-mode');
    closeSettingsApp(true);
    closeLetterApp(true);
    closePrologueApp(true);
    closeStyleApp(true);
    document.body.classList.add('private-open');
    privateApp.classList.add('active');
    const initialScreen = choosePrivateInitialScreen();
    showPrivateScreen(initialScreen);
    Promise.all([
        Promise.resolve(privateStateReady),
        Promise.resolve(window.rinnoDossierStateReady)
    ])
        .then(() => {
            if (!privateApp.classList.contains('active')) return;
            if (sessionToken !== privateOpenSessionToken) return;
            if (getActivePrivateScreenName() !== initialScreen) return;
            const resolvedScreen = choosePrivateInitialScreen();
            if (resolvedScreen !== initialScreen) showPrivateScreen(resolvedScreen);
        })
        .catch(error => console.error('私叙状态加载失败:', error));
}

function closePrivateApp(instant = false) {
    const privateApp = document.getElementById('private-app');
    privateOpenSessionToken += 1;
    clearPrivateGuideToast();
    closePrivateTermsModal();
    closePrivateContactProfileCard(true);
    closePrivateContactAccountModal(true);
    closePrivateContactChat(true);
    closePrivateContactHomepage(true);
    closePrivateMomentComposer(true);
    closePrivateUserPresetEditor(true);
    closePrivateSettingsPanel(true);
    closePrivateStickerImportModal(true);
    closePrivateStickerGroupModal(true);
    hidePrivateCodeToast(true);
    hidePrivateSystemToast(true);
    if (privateApp) {
        if (instant) {
            const previousTransition = privateApp.style.transition;
            privateApp.style.transition = 'none';
            privateApp.classList.remove('active');
            privateApp.offsetHeight;
            requestAnimationFrame(() => {
                privateApp.style.transition = previousTransition;
            });
        } else {
            privateApp.classList.remove('active');
        }
    }
    document.body.classList.remove('private-open');
}

async function handlePrivateRegister(event) {
    event.preventDefault();
    const nickname = document.getElementById('private-register-nickname')?.value.trim() || '';
    const email = normalizePrivateIdentityId(document.getElementById('private-register-email')?.value || '');
    const password = document.getElementById('private-register-password')?.value || '';
    const agreed = Boolean(document.getElementById('private-register-agree')?.checked);

    if (!nickname) {
        setPrivateMessage('private-register-message', '请先填写昵称。', 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setPrivateMessage('private-register-message', '请填写可用的邮箱号码。', 'error');
        return;
    }
    if (password.length < 8) {
        setPrivateMessage('private-register-message', '密码至少需要 8 位。', 'error');
        return;
    }
    if (!agreed) {
        setPrivateMessage('private-register-message', '需要先勾选并同意服务协议。', 'error');
        return;
    }

    if (findRegisteredPrivateIdentity(email)) {
        setPrivateMessage('private-register-message', '该邮箱已注册，请直接登录。', 'error');
        return;
    }

    syncPrivateIdentitySlot();
    const identities = normalizePrivateIdentitySlots(privateState.identities);
    const previousLastAccountId = normalizePrivateIdentityId(privateState.lastAccountId);
    const draftAvatar = isCompleteRegisteredPrivateAccount(createPrivateIdentitySnapshot()) ? '' : privateState.avatar;
    privateState = {
        ...createDefaultPrivateState(),
        identities,
        registered: false,
        nickname,
        email,
        userPresetName: nickname,
        userPresetId: email,
        password,
        avatar: draftAvatar,
        agreementAccepted: true,
        privacyAccepted: false,
        verifyCode: createPrivateTwoDigit(),
        letterSent: false,
        letterSentAt: 0,
        verified: false,
        lastLoginAt: 0,
        lastAccountId: previousLastAccountId,
        loginOtherAccount: false
    };
    syncPrivateIdentitySlot();
    await savePrivateState();
    setPrivateMessage('private-register-message', '');
    showPrivateSystemToast('注册信息已保存，请继续阅读隐私保护指引。');
    showPrivateScreen('privacy');
}

async function handlePrivatePrivacyNext() {
    const agreed = Boolean(document.getElementById('private-privacy-agree')?.checked);
    if (!agreed) {
        setPrivateMessage('private-privacy-message', '需要先勾选并同意上述条款。', 'error');
        return;
    }
    privateState.privacyAccepted = true;
    if (!/^\d{2}$/.test(privateState.verifyCode)) privateState.verifyCode = createPrivateTwoDigit();
    await savePrivateState();
    setPrivateMessage('private-privacy-message', '');
    showPrivateSystemToast('已同意隐私条款，请发送信笺完成邮箱验证。');
    showPrivateScreen('verify');
}

function getLetterFieldElements() {
    return {
        to: document.querySelector('[data-edit-id="letter_to"]'),
        subject: document.querySelector('[data-edit-id="letter_subject"]'),
        body: document.querySelector('[data-edit-id="letter_body"]'),
        signature: document.querySelector('[data-edit-id="letter_signature"]')
    };
}

function captureLetterFields() {
    const fields = getLetterFieldElements();
    return Object.fromEntries(Object.entries(fields).map(([key, el]) => [key, el?.textContent || '']));
}

function setLetterFields(values) {
    const fields = getLetterFieldElements();
    Object.entries(values).forEach(([key, value]) => {
        if (fields[key]) fields[key].textContent = value;
    });
}

function restoreLetterSnapshot() {
    if (!privateAuthLetterSnapshot) return;
    setLetterFields(privateAuthLetterSnapshot);
    privateAuthLetterSnapshot = null;
}

function openPrivateVerificationLetter() {
    if (!privateState.email || !privateState.privacyAccepted) {
        setPrivateMessage('private-verify-message', '请先完成邮箱注册和隐私确认。', 'error');
        return;
    }
    if (!/^\d{2}$/.test(privateState.verifyCode)) privateState.verifyCode = createPrivateTwoDigit();
    privateAuthLetterMode = true;
    privateAuthLetterSnapshot = captureLetterFields();
    setLetterFields({
        to: PRIVATE_LETTER_TO,
        subject: '私叙注册验证',
        body: `注册私叙${privateState.verifyCode}`,
        signature: privateState.nickname || '私叙'
    });
    renderLetterSentAuthCard();
    showPrivateSystemToast('已为你填好验证信笺，请点击寄出图标。');
    openLetterApp({ preservePrivate: true });
}

async function markPrivateLetterSent() {
    privateState.letterSent = true;
    privateState.verified = true;
    privateState.letterSentAt = Date.now();
    await savePrivateState();
    renderPrivateState();
    renderLetterSentAuthCard();
    restoreLetterSnapshot();
    privateAuthLetterMode = false;
    showPrivateSystemToast('信笺已寄出，返回私叙后完成注册。');
}

function renderLetterSentAuthCard() {
    const card = document.getElementById('letter-auth-sent-card');
    const sub = document.getElementById('letter-auth-sent-sub');
    const date = document.getElementById('letter-auth-sent-date');
    if (!card) return;
    card.hidden = !privateState.letterSent;
    if (sub) sub.textContent = `注册私叙${privateState.verifyCode || '20'} · 已寄出`;
    if (date) {
        const sentAt = Number(privateState.letterSentAt) || Date.now();
        date.textContent = String(new Date(sentAt).getDate()).padStart(2, '0');
    }
}

function handlePrivateVerifyNext() {
    if (!privateState.verified) {
        setPrivateMessage('private-verify-message', '需要先发送信笺完成验证。', 'error');
        return;
    }
    setPrivateMessage('private-verify-message', '');
    renderPrivateState();
    showPrivateScreen('verified');
}

async function finishPrivateRegister() {
    if (!privateState.verified) {
        setPrivateMessage('private-verify-message', '需要先发送信笺完成验证。', 'error');
        return;
    }
    privateState.registered = true;
    privateState.createdAt = privateState.createdAt || new Date().toISOString();
    privateState.lastLoginAt = 0;
    privateState.loginOtherAccount = false;
    privateState.userPresetName = privateState.nickname || privateState.userPresetName;
    privateState.userPresetId = getPrivateBoundIdentityId();
    privateState.lastAccountId = getPrivateBoundIdentityId();
    syncPrivateIdentitySlot();
    await savePrivateState();
    privateLoginCode = '';
    setPrivateLoginMode('password');
    showPrivateSystemToast('注册完成，请使用密码或信笺验证码登录。');
    showPrivateScreen('login');
}

function setPrivateLoginMode(mode, announce = false) {
    privateLoginMode = privateState.loginOtherAccount ? 'password' : (mode === 'code' ? 'code' : 'password');
    const isCode = privateLoginMode === 'code';
    const isOtherAccount = Boolean(privateState.loginOtherAccount);
    const accountField = document.getElementById('private-login-account-field');
    const field = document.getElementById('private-login-field');
    const label = document.getElementById('private-login-label');
    const input = document.getElementById('private-login-input');
    const codeButton = document.getElementById('private-code-button');
    const toggle = document.getElementById('private-login-toggle');
    const otherButton = document.getElementById('private-login-other');

    if (accountField) accountField.hidden = !isOtherAccount;
    field?.classList.toggle('code-field', isCode);
    if (label) label.textContent = isCode ? '验证码' : '密码';
    if (input) {
        input.value = '';
        input.type = isCode ? 'text' : 'password';
        input.inputMode = isCode ? 'numeric' : 'text';
        if (isCode) input.setAttribute('maxlength', '6');
        else input.removeAttribute('maxlength');
        input.placeholder = isCode ? '输入 6 位验证码' : '输入密码';
        input.autocomplete = isCode ? 'one-time-code' : 'current-password';
    }
    if (codeButton) codeButton.hidden = !isCode;
    if (toggle) {
        toggle.hidden = isOtherAccount;
        toggle.textContent = isCode ? '用密码登录' : '用信笺验证码登录';
    }
    if (otherButton) otherButton.textContent = isOtherAccount ? '登录当前账号' : '登录其它账号';
    renderPrivateLoginIdentity();
    setPrivateMessage('private-login-message', '');
    if (announce) {
        showPrivateSystemToast(isCode ? '已切换为信笺验证码登录，请先获取验证码。' : '已切换为密码登录，请输入注册密码。');
    }
}

function setPrivateLoginOtherAccountMode(enabled, announce = false) {
    privateState.loginOtherAccount = Boolean(enabled);
    privateLoginCode = '';
    setPrivateLoginMode('password');
    const accountInput = document.getElementById('private-login-account-input');
    const passwordInput = document.getElementById('private-login-input');
    if (accountInput && privateState.loginOtherAccount) {
        accountInput.value = '';
        window.setTimeout(() => accountInput.focus(), 80);
    } else {
        window.setTimeout(() => passwordInput?.focus(), 80);
    }
    if (announce) {
        showPrivateSystemToast(privateState.loginOtherAccount ? '请输入账号邮箱和密码登录。' : '已回到当前账号登录。');
    }
}

function showPrivateCodeToast(code) {
    const toast = document.getElementById('private-code-toast');
    const text = document.getElementById('private-code-toast-text');
    if (!toast) return;
    if (toast.parentElement !== document.body) document.body.appendChild(toast);
    toast.setAttribute('aria-atomic', 'true');
    toast.classList.remove('private-code-toast-compact');
    if (text) text.textContent = `信笺收到验证码 ${code}`;
    toast.hidden = false;
    toast.offsetHeight;
    requestAnimationFrame(() => toast.classList.add('active'));
    window.clearTimeout(privateLoginToastTimer);
    privateLoginToastTimer = window.setTimeout(() => hidePrivateCodeToast(), 4600);
}

function hidePrivateCodeToast(instant = false) {
    const toast = document.getElementById('private-code-toast');
    if (!toast) return;
    window.clearTimeout(privateLoginToastTimer);
    toast.classList.remove('active');
    if (instant) {
        toast.hidden = true;
        return;
    }
    window.setTimeout(() => {
        if (!toast.classList.contains('active')) toast.hidden = true;
    }, 180);
}

function requestPrivateLoginCode() {
    if (!privateState.loginOtherAccount && !getLastPrivateAccountSlot()) {
        setPrivateMessage('private-login-message', '请先注册账号。', 'error');
        showPrivateScreen('register');
        return;
    }
    privateLoginCode = createPrivateSixDigit();
    const button = document.getElementById('private-code-button');
    if (button) button.textContent = '重新获取验证';
    showPrivateCodeToast(privateLoginCode);
    setPrivateMessage('private-login-message', '验证码已通过信笺横幅送达。', 'success');
}

async function submitPrivateLogin() {
    const input = document.getElementById('private-login-input');
    const value = input?.value.trim() || '';
    if (privateState.loginOtherAccount) {
        const account = document.getElementById('private-login-account-input')?.value.trim() || '';
        const slot = getPrivateRegisteredIdentityById(account);
        if (!account) {
            setPrivateMessage('private-login-message', '请先输入账号邮箱。', 'error');
            return;
        }
        if (!isCompleteRegisteredPrivateAccount(slot)) {
            setPrivateMessage('private-login-message', '没有找到这个已注册账号。', 'error');
            return;
        }
        if (!value) {
            setPrivateMessage('private-login-message', '请先输入密码。', 'error');
            return;
        }
        if (value !== slot.password) {
            setPrivateMessage('private-login-message', '账号或密码不正确。', 'error');
            return;
        }
        await switchPrivateAccount(account, '登录成功。');
        return;
    }
    const loginSlot = getLastPrivateAccountSlot();
    if (!loginSlot) {
        setPrivateMessage('private-login-message', '请先注册账号。', 'error');
        showPrivateScreen('register');
        return;
    }
    if (privateLoginMode === 'password') {
        if (!value) {
            setPrivateMessage('private-login-message', '请先输入密码。', 'error');
            return;
        }
        if (value !== loginSlot.password) {
            setPrivateMessage('private-login-message', '密码不正确。', 'error');
            return;
        }
    } else {
        if (!privateLoginCode) {
            setPrivateMessage('private-login-message', '请先获取信笺验证码。', 'error');
            return;
        }
        if (value !== privateLoginCode) {
            setPrivateMessage('private-login-message', '验证码不正确。', 'error');
            return;
        }
    }

    await switchPrivateAccount(loginSlot.userPresetId || loginSlot.email, '登录成功，三天内再次进入私叙无需登录。');
}

async function handlePrivateAvatarUpload(file) {
    if (!file) return;
    try {
        const content = await readPrivateImageFile(file, {
            maxEdge: PRIVATE_AVATAR_IMAGE_MAX_EDGE,
            quality: 0.82
        });
        if (!content) return;
        privateState.avatar = content;
        syncPrivateIdentitySlot();
        renderPrivateState();
        await savePrivateState();
    } catch (error) {
        console.error('头像保存失败:', error);
        showPrivateSystemToast('头像保存失败，请换一张图片。');
    }
}

async function logoutPrivateAccount() {
    const currentSnapshot = createPrivateIdentitySnapshot();
    if (isCompleteRegisteredPrivateAccount(currentSnapshot)) {
        rememberPrivateAccountSlot(currentSnapshot);
        syncPrivateIdentitySlot();
    } else {
        const lastSlot = getLastPrivateAccountSlot();
        if (lastSlot) rememberPrivateAccountSlot(lastSlot);
    }
    privateState.lastLoginAt = 0;
    privateState.loginOtherAccount = false;
    await savePrivateState();
    closePrivateSettingsPanel(true);
    hidePrivateSystemToast(true);
    setPrivateLoginMode('password');
    showPrivateScreen('login');
}

async function startPrivateRegistrationFromLogin() {
    syncPrivateIdentitySlot();
    privateState = createPrivateRegistrationDraft(privateState.identities, privateState.lastAccountId);
    await savePrivateState();
    renderPrivateState();
    showPrivateScreen('register');
}

function switchPrivateRegisterToLogin() {
    if (!hasRegisteredPrivateAccount()) {
        setPrivateMessage('private-register-message', '请先完成注册。', 'error');
        return;
    }
    privateState.loginOtherAccount = true;
    setPrivateLoginMode('password');
    showPrivateScreen('login');
    window.setTimeout(() => document.getElementById('private-login-account-input')?.focus(), 80);
}

function exportPrivateChatRecords() {
    syncPrivateIdentitySlot();
    const currentId = getPrivateBoundIdentityId();
    const identities = normalizePrivateIdentitySlots(privateState.identities);
    const identity = identities[currentId] || createPrivateIdentitySnapshot();
    const exportedIdentity = {
        ...identity,
        password: ''
    };
    const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        currentId,
        identity: exportedIdentity,
        chatRecords: {
            threads: normalizePrivateThreads(identity.threads)
        },
        charInfo: {
            nickname: identity.userPresetName || identity.nickname || '',
            account: identity.email || identity.userPresetId || currentId,
            avatar: identity.avatar || '',
            profileBio: identity.profileBio || '',
            maskName: identity.maskName || '',
            preferenceNote: identity.preferenceNote || '',
            userPresetName: identity.userPresetName || '',
            userPresetGender: identity.userPresetGender || '',
            userPresetSetting: identity.userPresetSetting || '',
            contacts: scopePrivateContacts(identity.contacts, currentId),
            moments: normalizePrivateMoments(identity.moments, [])
        }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `private-records-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showPrivateSystemToast('聊天记录已导出。');
}

function importPrivateChatRecords(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async event => {
        try {
            const payload = JSON.parse(String(event.target?.result || '{}'));
            const incoming = payload.identity
                ? normalizePrivateIdentitySlots({ [payload.currentId || payload.identity.userPresetId || payload.identity.email]: payload.identity })
                : normalizePrivateIdentitySlots(payload.identities);
            if (!Object.keys(incoming).length) throw new Error('没有可导入的私叙记录。');
            const existing = normalizePrivateIdentitySlots(privateState.identities);
            Object.entries(incoming).forEach(([id, slot]) => {
                if (!slot.password && existing[id]?.password) slot.password = existing[id].password;
            });
            privateState.identities = {
                ...existing,
                ...incoming
            };
            applyPrivateIdentitySlot();
            renderPrivateState();
            await savePrivateState();
            showPrivateSystemToast('聊天记录已导入。');
        } catch (error) {
            showPrivateSystemToast(error.message || '导入失败，请检查文件。');
        }
    };
    reader.readAsText(file);
}

function normalizePrivateAuthLayout() {
    const registerTopbar = document.querySelector('.private-register-screen .private-topbar');
    const registerExit = document.getElementById('private-register-exit');
    if (registerTopbar && registerExit) {
        const spacer = document.createElement('div');
        spacer.className = 'private-topbar-spacer';
        spacer.setAttribute('aria-hidden', 'true');
        registerTopbar.replaceChild(spacer, registerExit);
    }

    const loginField = document.getElementById('private-login-field');
    const loginFields = loginField?.closest('.private-login-fields');
    const loginToggle = document.getElementById('private-login-toggle');
    const loginMessage = document.getElementById('private-login-message');
    if (loginField && loginFields && loginToggle && loginToggle.parentElement === loginField) {
        loginFields.insertBefore(loginToggle, loginMessage || null);
    }

    const loginForm = document.getElementById('private-login-form');
    const loginActions = document.querySelector('.private-login-bottom-actions');
    const loginLinks = document.querySelector('.private-login-links');
    if (loginForm && loginActions && loginLinks && loginLinks.parentElement === loginActions) {
        loginActions.insertAdjacentElement('afterend', loginLinks);
    }
    if (loginLinks) {
        const exportButton = document.getElementById('private-export-records');
        const importButton = document.getElementById('private-import-records');
        const registerButton = document.getElementById('private-login-register');
        [exportButton, importButton, registerButton].forEach(button => {
            if (button && button.parentElement === loginLinks) loginLinks.appendChild(button);
        });
    }
}

function bindPrivateMomentTools() {
    document.getElementById('private-moment-refresh')?.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        renderPrivateMoments();
        showPrivateSystemToast('朋友圈已刷新。');
    });

    document.getElementById('private-moment-notify')?.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        showPrivateSystemToast('通知入口已就绪。');
    });

    document.getElementById('private-moment-camera')?.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        openPrivateMomentComposer();
    });
}

normalizePrivateAuthLayout();

function bindPrivateAuthActions() {
    const registerForm = document.getElementById('private-register-form');
    if (registerForm && !registerForm.dataset.privateAuthBound) {
        registerForm.dataset.privateAuthBound = 'true';
        registerForm.addEventListener('submit', handlePrivateRegister);
    }

    const stickerForm = document.getElementById('private-sticker-form');
    if (stickerForm && !stickerForm.dataset.privateStickerBound) {
        stickerForm.dataset.privateStickerBound = 'true';
        stickerForm.addEventListener('submit', savePrivateStickerImport);
    }

    const stickerGroupForm = document.getElementById('private-sticker-group-form');
    if (stickerGroupForm && !stickerGroupForm.dataset.privateStickerGroupBound) {
        stickerGroupForm.dataset.privateStickerGroupBound = 'true';
        stickerGroupForm.addEventListener('submit', savePrivateStickerGroup);
    }

    const bindClick = (id, handler) => {
        const element = document.getElementById(id);
        const boundKey = `privateAuthBound${id.replace(/[^a-z0-9]/gi, '')}`;
        if (!element || element.dataset[boundKey]) return;
        element.dataset[boundKey] = 'true';
        element.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            handler(event);
        });
    };

    bindClick('private-register-exit', () => closePrivateApp());
    bindClick('private-open-terms', () => openPrivateTermsModal());
    bindClick('private-terms-ok', () => closePrivateTermsModal());
    bindClick('private-privacy-next', () => handlePrivatePrivacyNext());
    bindClick('private-send-letter', () => openPrivateVerificationLetter());
    bindClick('private-sent-letter', () => {
        if (!privateState.letterSent) return;
        privateState.verified = true;
        renderPrivateState();
    });
    bindClick('private-verify-next', () => handlePrivateVerifyNext());
    bindClick('private-finish-register', () => finishPrivateRegister());
    bindClick('private-login-toggle', () => {
        setPrivateLoginMode(privateLoginMode === 'password' ? 'code' : 'password', true);
    });
    bindClick('private-code-button', () => requestPrivateLoginCode());
    bindClick('private-login-submit', () => submitPrivateLogin());
    bindClick('private-avatar-frame', () => document.getElementById('private-avatar-input')?.click());
    bindClick('private-profile-avatar', () => document.getElementById('private-avatar-input')?.click());
    bindClick('private-copy-code', () => {
        if (!privateLoginCode) return;
        navigator.clipboard?.writeText(privateLoginCode);
        const copyButton = document.getElementById('private-copy-code');
        if (!copyButton) return;
        copyButton.textContent = '已复制';
        window.setTimeout(() => {
            copyButton.textContent = '复制';
        }, 900);
    });

    const loginForm = document.getElementById('private-login-form');
    if (loginForm && !loginForm.dataset.privateAuthBound) {
        loginForm.dataset.privateAuthBound = 'true';
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            submitPrivateLogin();
        });
    }

    const avatarInput = document.getElementById('private-avatar-input');
    if (avatarInput && !avatarInput.dataset.privateAuthBound) {
        avatarInput.dataset.privateAuthBound = 'true';
        avatarInput.addEventListener('change', event => {
            handlePrivateAvatarUpload(event.target.files?.[0]);
            event.target.value = '';
        });
    }

    const loginInput = document.getElementById('private-login-input');
    if (loginInput && !loginInput.dataset.privateAuthBound) {
        loginInput.dataset.privateAuthBound = 'true';
        loginInput.addEventListener('input', event => {
            if (privateLoginMode === 'code') event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    const letterSend = document.getElementById('letter-send-button');
    if (letterSend && !letterSend.dataset.privateAuthBound) {
        letterSend.dataset.privateAuthBound = 'true';
        letterSend.addEventListener('click', event => {
            if (!privateAuthLetterMode) return;
            event.preventDefault();
            event.stopPropagation();
            markPrivateLetterSent();
        });
    }
}


function bindPrivateAuthDelegatedActions() {
    const app = document.getElementById('private-app');
    if (!app || app.dataset.privateAuthDelegatedBound) return;
    app.dataset.privateAuthDelegatedBound = 'true';
    app.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : null;
        const button = target?.closest?.('#private-login-toggle, #private-code-button, #private-login-submit, #private-copy-code');
        if (!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const id = button.id;
        if (id === 'private-login-toggle') {
            setPrivateLoginMode(privateLoginMode === 'password' ? 'code' : 'password', true);
            window.setTimeout(() => document.getElementById('private-login-input')?.focus(), 80);
            return;
        }
        if (id === 'private-code-button') {
            requestPrivateLoginCode();
            return;
        }
        if (id === 'private-login-submit') {
            submitPrivateLogin();
            return;
        }
        if (id === 'private-copy-code' && privateLoginCode) {
            navigator.clipboard?.writeText(privateLoginCode);
            button.textContent = '已复制';
            window.setTimeout(() => { button.textContent = '复制'; }, 900);
        }
    }, true);
}

bindPrivateAuthActions();
bindPrivateAuthDelegatedActions();

document.getElementById('private-moment-close')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    closePrivateMomentComposer();
});

document.getElementById('private-moment-modal-backdrop')?.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    e.stopPropagation();
    closePrivateMomentComposer();
});

document.getElementById('private-persona-edit')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    openPrivateUserPresetEditor();
});

document.getElementById('private-user-preset-cancel')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    closePrivateUserPresetEditor();
});

bindPrivateBackdropDismiss(
    document.getElementById('private-user-preset-modal'),
    '.private-user-preset-dialog',
    () => closePrivateUserPresetEditor()
);

document.getElementById('private-user-preset-form')?.addEventListener('submit', savePrivateUserPresetFromForm);

document.getElementById('private-contact-account-form')?.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    renderPrivateContactAccountResults();
});

bindPrivateBackdropDismiss(
    document.getElementById('private-contact-account-modal'),
    '.private-contact-account-dialog',
    () => closePrivateContactAccountModal()
);

document.getElementById('private-contact-account-input')?.addEventListener('input', renderPrivateContactAccountResults);

document.getElementById('private-contact-account-results')?.addEventListener('click', e => {
    const addButton = e.target.closest('[data-private-add-dossier-account]');
    if (!addButton || addButton.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    void addPrivateDossierContact(
        addButton.getAttribute('data-private-add-dossier-type') || '',
        addButton.getAttribute('data-private-add-dossier-record') || '',
        addButton.getAttribute('data-private-add-dossier-account') || ''
    );
});

document.getElementById('private-settings-close')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    closePrivateSettingsPanel();
});

document.getElementById('private-settings-account-list')?.addEventListener('click', e => {
    const login = e.target.closest('[data-private-settings-login]');
    if (login) {
        e.preventDefault();
        e.stopPropagation();
        switchPrivateAccount(login.getAttribute('data-private-settings-login'), '已切换到这个账号。');
    }
});

document.getElementById('private-settings-logout')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    logoutPrivateAccount();
});

document.getElementById('private-export-records')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    exportPrivateChatRecords();
});

document.getElementById('private-import-records')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    document.getElementById('private-import-input')?.click();
});

document.getElementById('private-import-input')?.addEventListener('change', e => {
    e.stopImmediatePropagation();
    importPrivateChatRecords(e.target.files?.[0]);
    e.target.value = '';
});

document.getElementById('private-login-register')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    startPrivateRegistrationFromLogin();
});

document.getElementById('private-register-login')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    switchPrivateRegisterToLogin();
});

document.getElementById('private-login-other')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    setPrivateLoginOtherAccountMode(!privateState.loginOtherAccount, true);
});

document.getElementById('private-new-group')?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openPrivateContactAccountModal();
});

document.getElementById('private-login-account-input')?.addEventListener('input', () => {
    renderPrivateLoginIdentity();
});

document.getElementById('private-thread-list')?.addEventListener('click', e => {
    const card = e.target.closest('[data-private-thread-contact]');
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    card.classList.remove('is-active');
    card.setAttribute('aria-current', 'false');
    card.setAttribute('aria-selected', 'false');
    if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }
    openPrivateContactChat(card.getAttribute('data-private-thread-contact') || '', 'whisper');
});

document.getElementById('private-contact-list')?.addEventListener('click', e => {
    const chatOpenButton = e.target.closest('[data-private-contact-chat-open]');
    if (chatOpenButton) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openPrivateContactChat(chatOpenButton.getAttribute('data-private-contact-chat-open') || '', 'contacts');
        return;
    }
    const profileCardButton = e.target.closest('[data-private-contact-profile-card]');
    if (profileCardButton) {
        e.preventDefault();
        e.stopPropagation();
        openPrivateContactProfileCard(profileCardButton.getAttribute('data-private-contact-profile-card') || '');
        return;
    }
    const homepageButton = e.target.closest('[data-private-contact-homepage]');
    if (homepageButton) {
        e.preventDefault();
        e.stopPropagation();
        openPrivateContactHomepage(homepageButton.getAttribute('data-private-contact-homepage') || '');
        return;
    }
    const profileButton = e.target.closest('[data-private-contact-profile]');
    if (profileButton) {
        e.preventDefault();
        e.stopPropagation();
        openPrivateContactHomepage(profileButton.getAttribute('data-private-contact-profile') || '');
        return;
    }
    const editButton = e.target.closest('[data-private-contact-edit]');
    if (editButton) {
        e.preventDefault();
        e.stopPropagation();
        const contactId = editButton.getAttribute('data-private-contact-edit')
            || editButton.closest('[data-private-contact]')?.getAttribute('data-private-contact')
            || '';
        openPrivateContactQuickEdit(contactId);
        return;
    }
    const card = e.target.closest('[data-private-contact]');
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    openPrivateContactChat(card.getAttribute('data-private-contact') || '', 'contacts');
    return;
    const title = card.querySelector('.private-contact-title')?.textContent || '联系人';
    showPrivateSystemToast(`已选中「${title}」。`);
});

document.getElementById('private-app')?.addEventListener('click', e => {
    const contactChatBack = e.target.closest('[data-private-contact-chat-back]');
    if (contactChatBack) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateContactChat();
        return;
    }
    const historyReveal = e.target.closest('[data-private-contact-chat-expand-history]');
    if (historyReveal) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        privateContactChatHistoryExpandedId = String(privateActiveContactChatId || '').trim();
        renderPrivateContactChatPage(privateContactChatHistoryExpandedId, { scrollToTop: true });
        return;
    }
    const translationToggle = e.target.closest('[data-private-contact-chat-translation-toggle]');
    if (translationToggle) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        togglePrivateContactChatTranslationGroup(translationToggle.getAttribute('data-private-contact-chat-translation-toggle') || '');
        return;
    }
    const quotedMessage = e.target.closest('[data-private-contact-chat-quote-id]');
    if (quotedMessage) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        peekPrivateContactChatMessage(quotedMessage.getAttribute('data-private-contact-chat-quote-id') || '');
        return;
    }
    const recalledDetail = e.target.closest('[data-private-contact-chat-recall-detail]');
    if (recalledDetail) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openPrivateContactChatRecallModal(recalledDetail.getAttribute('data-private-contact-chat-recall-detail') || '');
        return;
    }
    const composeModalClose = e.target.closest('#private-contact-chat-compose-close, #private-contact-chat-compose-cancel');
    if (composeModalClose) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateContactChatComposeModal();
        return;
    }
    const composeModalBackdrop = e.target.closest('#private-contact-chat-compose-modal');
    if (composeModalBackdrop && e.target === composeModalBackdrop) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateContactChatComposeModal();
        return;
    }
    const cameraToggle = e.target.closest('[data-private-contact-chat-camera-toggle]');
    if (cameraToggle) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        togglePrivateContactChatCameraCard(cameraToggle.getAttribute('data-private-contact-chat-camera-toggle') || '');
        return;
    }
    const voiceToggle = e.target.closest('[data-private-contact-chat-voice-toggle]');
    if (voiceToggle) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        togglePrivateContactChatVoiceTranscript(voiceToggle.getAttribute('data-private-contact-chat-voice-toggle') || '');
        return;
    }
    const stickerPick = e.target.closest('[data-private-contact-chat-sticker-pick]');
    if (stickerPick) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void sendPrivateContactChatStickerById(stickerPick.getAttribute('data-private-contact-chat-sticker-pick') || '');
        return;
    }
    const composerStickerGroup = e.target.closest('[data-private-contact-chat-sticker-group]');
    if (composerStickerGroup) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        privateStickerLibraryState.activeGroupId = composerStickerGroup.getAttribute('data-private-contact-chat-sticker-group') || PRIVATE_STICKER_DEFAULT_GROUP_ID;
        renderPrivateContactChatStickerPanel();
        renderPrivateStickerLibrary();
        void savePrivateStickerLibraryState();
        return;
    }
    const moreAction = e.target.closest('[data-private-contact-chat-more-action]');
    if (moreAction) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void handlePrivateContactChatMoreAction(moreAction.getAttribute('data-private-contact-chat-more-action') || '');
        return;
    }
    const chatBubble = e.target.closest('[data-private-contact-chat-bubble]');
    if (chatBubble) {
        if (['red_packet', 'transaction'].includes(String(chatBubble.getAttribute('data-private-contact-chat-message-type') || '').trim())) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            void handlePrivateContactChatPaymentBubbleClick(chatBubble);
        }
        return;
    }
    if (
        privateContactChatComposerPanel
        && !e.target.closest('#private-contact-chat-sticker-panel')
        && !e.target.closest('#private-contact-chat-more-panel')
        && !e.target.closest('#private-contact-chat-emoji')
        && !e.target.closest('#private-contact-chat-expand')
    ) {
        closePrivateContactChatComposerPanels();
    }
    const homepageBack = e.target.closest('[data-private-contact-homepage-close]');
    if (homepageBack) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateContactHomepage(true);
        return;
    }
    const homepageEdit = e.target.closest('[data-private-contact-homepage-edit]');
    if (homepageEdit) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openPrivateContactHomepageEdit(homepageEdit.getAttribute('data-private-contact-homepage-edit') || '');
        return;
    }
    const homepageManage = e.target.closest('[data-private-contact-homepage-action]');
    if (homepageManage) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void handlePrivateContactHomepageManageAction(
            homepageManage.getAttribute('data-private-contact-homepage-action') || '',
            homepageManage.getAttribute('data-private-contact-id') || ''
        );
        return;
    }
    const homepageCover = e.target.closest('[data-private-contact-homepage-cover]');
    if (homepageCover) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        privateContactHomepageCoverTargetId = homepageCover.getAttribute('data-private-contact-homepage-cover') || '';
        getPrivateContactHomepageCoverInput().click();
        return;
    }
    const homepageTab = e.target.closest('[data-private-contact-homepage-tab]');
    if (homepageTab) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const section = homepageTab.getAttribute('data-private-contact-homepage-tab') || 'about';
        const contactId = homepageTab.getAttribute('data-private-contact-id')
            || homepageTab.closest('[data-private-contact-homepage-id]')?.getAttribute('data-private-contact-homepage-id')
            || '';
        openPrivateContactHomepage(contactId, section);
        return;
    }
    const homepageEntry = e.target.closest('[data-private-contact-homepage-entry]');
    if (homepageEntry) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const entryName = homepageEntry.getAttribute('data-private-contact-homepage-entry') || '';
        const contactId = homepageEntry.getAttribute('data-private-contact-id') || homepageEntry.closest('[data-private-contact-homepage-id]')?.getAttribute('data-private-contact-homepage-id') || '';
        const normalizedEntryName = String(entryName || '').replace(/\s+/g, '');
        if (normalizedEntryName.includes('朋友圈') || normalizedEntryName.includes('鏈嬪弸鍦') || /moments|time/i.test(normalizedEntryName)) {
            switchPrivateTab('time');
            return;
        }
        if (normalizedEntryName.includes('聊天') || normalizedEntryName.includes('鑱婂ぉ') || /chat/i.test(normalizedEntryName)) {
            openPrivateContactChat(contactId, 'contact-homepage');
            return;
        }
        if (normalizedEntryName.includes('更多') || normalizedEntryName.includes('鏇村') || /more/i.test(normalizedEntryName)) {
            openPrivateContactProfileCard(contactId);
            return;
        }
        if (entryName === '朋友圈') {
            switchPrivateTab('time');
            return;
        }
        if (entryName === '聊天') {
            switchPrivateTab('whisper');
            return;
        }
        if (entryName === '更多') {
            openPrivateContactProfileCard(contactId);
            return;
        }
        if (entryName) showPrivateSystemToast(`${entryName}入口已就绪。`);
        return;
    }
    const settingsClose = e.target.closest('#private-settings-close');
    if (settingsClose) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateSettingsPanel();
        return;
    }
    const stickerBack = e.target.closest('#private-sticker-back');
    if (stickerBack) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateStickerLibrary();
        return;
    }
    const stickerAdd = e.target.closest('#private-sticker-add');
    if (stickerAdd) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openPrivateStickerImportModal();
        return;
    }
    const stickerAddGroup = e.target.closest('#private-sticker-add-group');
    if (stickerAddGroup) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void addPrivateStickerGroup();
        return;
    }
    const libraryStickerGroup = e.target.closest('[data-private-sticker-group]');
    if (libraryStickerGroup) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        privateStickerLibraryState.activeGroupId = libraryStickerGroup.getAttribute('data-private-sticker-group') || PRIVATE_STICKER_DEFAULT_GROUP_ID;
        renderPrivateStickerLibrary();
        void savePrivateStickerLibraryState();
        return;
    }
    const stickerDelete = e.target.closest('[data-private-sticker-delete]');
    if (stickerDelete) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void deletePrivateSticker(stickerDelete.getAttribute('data-private-sticker-delete') || '');
        return;
    }
    const stickerCopy = e.target.closest('[data-private-sticker-copy]');
    if (stickerCopy) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void copyPrivateSticker(stickerCopy.getAttribute('data-private-sticker-copy') || '');
        return;
    }
    const stickerModalClose = e.target.closest('#private-sticker-cancel, #private-sticker-modal-cancel');
    if (stickerModalClose) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateStickerImportModal();
        return;
    }
    const stickerModal = e.target.closest('#private-sticker-modal');
    if (stickerModal && e.target === stickerModal) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateStickerImportModal();
        return;
    }
    const stickerGroupModalClose = e.target.closest('#private-sticker-group-cancel');
    if (stickerGroupModalClose) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateStickerGroupModal();
        return;
    }
    const stickerGroupModal = e.target.closest('#private-sticker-group-modal');
    if (stickerGroupModal && e.target === stickerGroupModal) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closePrivateStickerGroupModal();
        return;
    }
    const entry = e.target.closest('[data-private-entry]');
    if (!entry) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const name = entry.getAttribute('data-private-entry') || '';
    if (name === '预设') {
        openPrivateUserPresetEditor();
        return;
    }
    if (name === '设置') {
        openPrivateSettingsPanel();
        return;
    }
    if (name === '表情包库' || name === '表情包') {
        void openPrivateStickerLibrary();
        return;
    }
    if (name) showPrivateSystemToast(`${name}入口已就绪。`);
}, true);

document.getElementById('private-app')?.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest?.('[data-private-contact-homepage-close], [data-private-contact-homepage-edit]')) return;
    const homepageCover = e.target.closest?.('[data-private-contact-homepage-cover]');
    if (!homepageCover) return;
    e.preventDefault();
    e.stopPropagation();
    privateContactHomepageCoverTargetId = homepageCover.getAttribute('data-private-contact-homepage-cover') || '';
    getPrivateContactHomepageCoverInput().click();
});

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const chatScreen = document.querySelector('.private-chat-screen');
    const contactChatActionMenu = document.getElementById('private-contact-chat-action-menu');
    const contactChatConfirmModal = document.getElementById('private-contact-chat-confirm-modal');
    const contactChatEditModal = document.getElementById('private-contact-chat-edit-modal');
    const contactChatRecallModal = document.getElementById('private-contact-chat-recall-modal');
    const contactChatPayStatusModal = document.getElementById('private-contact-chat-pay-status-modal');
    const contactChatPlaceholderModal = document.getElementById('private-contact-chat-placeholder-modal');
    const contactChatComposeModal = document.getElementById('private-contact-chat-compose-modal');
    const contactProfileModal = document.getElementById('private-contact-profile-modal');
    const contactEditModal = document.getElementById('private-contact-edit-modal');
    const contactHomepageEditModal = document.getElementById('private-contact-homepage-edit-modal');
    const contactAccountModal = document.getElementById('private-contact-account-modal');
    const userPresetModal = document.getElementById('private-user-preset-modal');
    const privateSettingsModal = document.getElementById('private-settings-modal');
    const stickerModal = document.getElementById('private-sticker-modal');
    const stickerGroupModal = document.getElementById('private-sticker-group-modal');
    const momentComposer = document.getElementById('private-moment-composer');
    if (contactChatActionMenu && !contactChatActionMenu.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatActionMenu();
        return;
    }
    if (contactChatConfirmModal && !contactChatConfirmModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatConfirmModal(false, false);
        return;
    }
    if (contactChatEditModal && !contactChatEditModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatEditModal();
        return;
    }
    if (contactChatRecallModal && !contactChatRecallModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatRecallModal();
        return;
    }
    if (contactChatPayStatusModal && !contactChatPayStatusModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatPayStatusModal();
        return;
    }
    if (contactChatPlaceholderModal && !contactChatPlaceholderModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatPlaceholderEditor();
        return;
    }
    if (contactChatComposeModal && !contactChatComposeModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatComposeModal();
        return;
    }
    if (stickerModal && !stickerModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateStickerImportModal();
        return;
    }
    if (stickerGroupModal && !stickerGroupModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateStickerGroupModal();
        return;
    }
    if (privateContactChatSelectionMode) {
        e.preventDefault();
        e.stopImmediatePropagation();
        exitPrivateContactChatSelectionMode();
        return;
    }
    if (privateContactChatComposerPanel) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatComposerPanels();
        return;
    }
    if (contactHomepageEditModal && !contactHomepageEditModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactHomepageEditModal();
        return;
    }
    if (chatScreen?.getAttribute('data-private-current-tab') === 'contact-chat-settings') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChatSettingsPage();
        return;
    }
    if (chatScreen?.getAttribute('data-private-current-tab') === 'contact-chat') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactChat();
        return;
    }
    if (chatScreen?.getAttribute('data-private-current-tab') === 'contact-homepage') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactHomepage(true);
        return;
    }
    if (chatScreen?.getAttribute('data-private-current-tab') === 'sticker-library') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateStickerLibrary();
        return;
    }
    if (contactProfileModal && !contactProfileModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactProfileCard();
        return;
    }
    if (contactEditModal && !contactEditModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactQuickEditModal();
        return;
    }
    if (contactAccountModal && !contactAccountModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateContactAccountModal();
        return;
    }
    if (userPresetModal && !userPresetModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateUserPresetEditor();
        return;
    }
    if (privateSettingsModal && !privateSettingsModal.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateSettingsPanel();
        return;
    }
    if (momentComposer && !momentComposer.hidden) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closePrivateMomentComposer();
    }
}, true);


function getPrivateMijingSafeContact(contact = {}) {
    const hydrated = getPrivateHydratedContact(contact);
    const record = hydrated ? getPrivateContactProfileRecord(hydrated) : null;
    const relationship = hydrated ? buildPrivateContactChatRelationshipContext(hydrated) : { label: '', note: '' };
    const userProfile = getPrivateContactChatPromptUserProfile();
    const archive = hydrated ? resolvePrivateContactArchiveSnapshot(hydrated, record || {}) : {};
    const networkLink = hydrated ? findPrivateContactDossierNetworkLink(hydrated) : null;
    return {
        id: String(hydrated?.id || '').trim(),
        name: getPrivateContactDisplayName(hydrated),
        title: String(hydrated?.title || '').trim(),
        subtitle: String(hydrated?.subtitle || '').trim(),
        avatar: String(hydrated?.avatar || '').trim(),
        type: String(hydrated?.type || '').trim(),
        relationName: String(relationship?.label || hydrated?.relationName || hydrated?.relation || '').trim(),
        relationDesc: String(relationship?.note || hydrated?.relationDesc || hydrated?.note || hydrated?.summary || '').trim(),
        networkRelation: String(networkLink?.relation || '').trim(),
        networkDescription: String(networkLink?.description || '').trim(),
        status: String(hydrated?.status || hydrated?.state || '').trim(),
        profileSetting: String(record?.setting || hydrated?.profileSetting || hydrated?.setting || hydrated?.description || hydrated?.persona || '').trim(),
        profileMemory: String(archive?.memory || '').trim(),
        profileStory: String(archive?.story || '').trim(),
        profileDigest: String(archive?.digest || '').trim(),
        userName: String(userProfile?.name || '').trim(),
        userId: String(userProfile?.id || '').trim(),
        userGender: String(userProfile?.gender || '').trim(),
        userPersona: String(userProfile?.persona || '').trim(),
        nationality: String(hydrated?.nationality || '').trim(),
        ipCity: String(hydrated?.ipCity || '').trim(),
        homeAddress: String(hydrated?.homeAddress || '').trim(),
        phoneNumber: String(hydrated?.phoneNumber || '').trim(),
        updatedAt: Number(hydrated?.updatedAt || hydrated?.generatedProfileAt || 0) || 0
    };
}

function collectPrivateMijingContextText(contact = {}) {
    const hydrated = contact ? getPrivateHydratedContact(contact) : null;
    const record = hydrated ? getPrivateContactProfileRecord(hydrated) : null;
    const userProfile = getPrivateContactChatPromptUserProfile();
    const relationship = hydrated ? buildPrivateContactChatRelationshipContext(hydrated) : { label: '', note: '' };
    const archive = hydrated ? resolvePrivateContactArchiveSnapshot(hydrated, record || {}) : {};
    const thread = hydrated?.id ? getPrivateContactChatThread(hydrated.id) : null;
    return [
        getPrivateContactDisplayName(hydrated || contact),
        hydrated?.title,
        hydrated?.subtitle,
        hydrated?.status,
        hydrated?.note,
        hydrated?.summary,
        hydrated?.profileSetting,
        record?.setting,
        relationship?.label,
        relationship?.note,
        archive?.memory,
        archive?.story,
        archive?.digest,
        userProfile?.name,
        userProfile?.id,
        userProfile?.gender,
        userProfile?.persona,
        thread ? buildPrivateContactChatIntimacyLabel(thread) : ''
    ].map(value => String(value || '').trim()).filter(Boolean).join('\n');
}

function scorePrivateMijingDisclosure(contact = {}, payload = {}) {
    const context = collectPrivateMijingContextText(contact);
    const lower = context.toLowerCase();
    const thread = getPrivateContactChatThread(contact?.id) || { messages: [] };
    const visibleCount = normalizePrivateContactChatMessages(thread.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || ''))).length;
    const trustWords = ['恋人', '爱人', '伴侣', '夫妻', '老婆', '老公', '男友', '女友', '同居', '暧昧', '依赖', '纵容', '宠', '偏爱', '信任', '占有', '私有', '主人', '恋爱', '情人', '契约', '亲密', '默契', 'lover', 'partner', 'girlfriend', 'boyfriend'];
    const guardWords = ['仇', '敌', '冷淡', '疏离', '陌生', '防备', '警惕', '隐瞒', '背叛', '利用', '交易', '审讯', '威胁', '监视', '控制', '上司', '老板', '客户', '合作方', '保密', '秘密', '不信任', 'enemy', 'stranger', 'guarded'];
    let score = 0;
    trustWords.forEach(word => { if (lower.includes(String(word).toLowerCase())) score += 2; });
    guardWords.forEach(word => { if (lower.includes(String(word).toLowerCase())) score -= 2; });
    if (visibleCount >= 24) score += 3;
    else if (visibleCount >= 12) score += 2;
    else if (visibleCount >= 4) score += 1;
    const relationText = String(buildPrivateContactChatRelationshipContext(contact).label || '').toLowerCase();
    if (/恋人|伴侣|夫妻|情人|暧昧|同居|lover|partner/.test(relationText)) score += 3;
    if (/敌|仇|陌生|客户|合作|上司|老板/.test(relationText)) score -= 3;
    const seed = hashPrivateSeed([contact?.id, context, payload?.attemptedPass || payload?.attempt || ''].join('|'));
    if (score === 0) score += (seed % 3) - 1;
    return score;
}

function shouldPrivateMijingDisclosePasscode(contact = {}, payload = {}) {
    const score = scorePrivateMijingDisclosure(contact, payload);
    return score >= 1;
}

function buildPrivateMijingPasswordMessage(contact = {}, payload = {}) {
    const contactName = getPrivateContactDisplayName(contact) || '我';
    const newPass = String(payload.newPasscode || payload.newPassword || payload.password || '').replace(/\D/g, '').slice(0, 6);
    const attempt = String(payload.attemptedPass || payload.attempt || '').replace(/\D/g, '').slice(0, 6);
    const reveal = shouldPrivateMijingDisclosePasscode(contact, payload);
    const relation = buildPrivateContactChatRelationshipContext(contact);
    const relationNote = String(relation?.label || '').trim();
    const revealVariants = [
        `嗯？两次锁屏失败，我这边都知道。新密码是 ${newPass || '那串新的六位数'}，但你最好解释一下为什么这么急。`,
        `你在试我的密码？${attempt ? `刚才还输 ${attempt}，` : ''}我看见了。改成 ${newPass || '新的那串数字'} 了，想看就别装得那么无辜。`,
        `两次了，还没猜对。密码我当然知道，也可以给你：${newPass || '新的六位数'}。但你欠我一句解释。`,
        `想翻我手机就直说。新密码 ${newPass || '已经改好了'}，只给你这一次，别让我后悔。`
    ];
    const clue = newPass ? `${newPass.slice(0, 2)}＊＊${newPass.slice(4)}` : '前两位和最后两位';
    const holdVariants = [
        `两次锁屏失败，我这里已经知道了。密码我知道，但现在不打算直接告诉你。${relationNote ? `按我们现在这种“${relationNote}”关系，` : ''}你先把手从屏幕上拿开，好好问。`,
        `你在试我的手机？${attempt ? `还输到 ${attempt}。` : ''}密码已经改了，我不给完整数字，只给线索：${clue}。剩下的看你怎么哄我。`,
        `想看就问我，别偷偷摸摸。密码在我手里，当然知道，但这次先不给。你越急，我越想看你怎么解释。`,
        `两次失败。手机锁已经换了，新密码我记得很清楚——但你现在只能拿到一半线索：${clue}。`
    ];
    const variants = reveal ? revealVariants : holdVariants;
    const seed = String(contact?.id || contactName || Date.now()) + (reveal ? ':reveal' : ':hold');
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return variants[hash % variants.length];
}

function buildPrivateMijingFaceRequestMessage(contact = {}, granted = false) {
    const score = scorePrivateMijingDisclosure(contact, { face: true });
    const contactName = getPrivateContactDisplayName(contact) || '我';
    const allowVariants = [
        `面容录入请求我看到了。行，给你开一次。别一副得逞的样子，${contactName}不是不知道你想干什么。`,
        `你连面容都想录？……可以。以后解锁别再输错到让我这边心跳一跳。`,
        `通过了。面容给你录进去，但这不代表你可以什么都不问就翻。`
    ];
    const denyVariants = [
        `面容录入我看见了。现在不行，别把查手机说得像理所当然。`,
        `不录。至少现在不录。你先告诉我，为什么这么想进我手机。`,
        `请求驳回。密码和面容都在我手里，你想要，就好好问。`
    ];
    const variants = granted ? allowVariants : denyVariants;
    const seed = String(contact?.id || contactName || '') + ':' + score + ':' + (granted ? 'face-yes' : 'face-no');
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
    return variants[hash % variants.length];
}


function normalizePrivateTraceString(value, limit = 1400) {
    return String(value == null ? '' : value)
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/[\uFE0E\uFE0F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, limit);
}

function getPrivateTraceRecentConversation(contactId, limit = 18) {
    const thread = getPrivateContactChatThread(contactId) || { messages: [] };
    const contact = getPrivateContactById(contactId);
    const contactName = contact ? getPrivateContactDisplayName(contact) : 'TA';
    const userProfile = getPrivateContactChatPromptUserProfile();
    const userName = String(userProfile?.name || userProfile?.nickname || '我').trim() || '我';
    return normalizePrivateContactChatMessages(thread.messages)
        .filter(message => ['user', 'assistant'].includes(String(message?.role || '')))
        .slice(-limit)
        .map(message => {
            const sender = String(message.role) === 'user' ? userName : contactName;
            const content = typeof message.content === 'string'
                ? message.content
                : message?.giftReceipt?.message || message?.voice?.text || message?.location?.name || message?.image?.description || '';
            return `${sender}: ${normalizePrivateTraceString(content, 160)}`;
        })
        .filter(Boolean)
        .join('\n');
}

function normalizePrivateTraceItems(items) {
    const source = Array.isArray(items) ? items : [];
    return source.map((item, index) => {
        if (typeof item === 'string') {
            return {
                name: normalizePrivateTraceString(item, 18) || `细节${index + 1}`,
                content: normalizePrivateTraceString(item, 260) || '没有更多内容。'
            };
        }
        return {
            name: normalizePrivateTraceString(item?.name || item?.title || item?.label || `细节${index + 1}`, 18),
            content: normalizePrivateTraceString(item?.content || item?.detail || item?.description || item?.text || '没有更多内容。', 360)
        };
    }).filter(item => item.name).slice(0, 6);
}

function normalizePrivateTraceHouseData(data, contact = {}) {
    const source = data && typeof data === 'object' ? data : {};
    const contactName = getPrivateContactDisplayName(contact) || source.contactName || 'TA';
    const safeContact = getPrivateMijingSafeContact(contact);
    const areas = source.areas && typeof source.areas === 'object' && !Array.isArray(source.areas) ? source.areas : null;
    let roomList = Array.isArray(source.rooms) ? source.rooms : Array.isArray(source.cameras) ? source.cameras : [];
    if (!roomList.length && areas) {
        roomList = Object.keys(areas).map((name, index) => ({
            name,
            camera: `CAM ${String(index + 1).padStart(2, '0')}`,
            ...(areas[name] || {})
        }));
    }
    roomList = roomList.filter(Boolean).slice(0, 7);
    if (!roomList.length) return null;
    const seedBase = hashPrivateSeed([contact?.id, contactName, JSON.stringify(source).slice(0, 280)].join('|'));
    const rooms = roomList.map((room, index) => {
        const name = normalizePrivateTraceString(room.name || room.areaName || room.title || `区域${index + 1}`, 16) || `区域${index + 1}`;
        const description = normalizePrivateTraceString(room.description || room.desc || room.note || '画面里只留下一点很轻的生活痕迹。', 220);
        const roomSeed = hashPrivateSeed([seedBase, name, index].join('|'));
        return {
            id: normalizePrivateTraceString(room.id || `room-${index + 1}`, 32),
            name,
            camera: normalizePrivateTraceString(room.camera || room.cam || `CAM ${String(index + 1).padStart(2, '0')}`, 12),
            description,
            note: normalizePrivateTraceString(room.note || description, 42),
            items: normalizePrivateTraceItems(room.items || room.findings || room.clues),
            hotX: Number(room.hotX || room.hot_x || (24 + (roomSeed % 58))),
            hotY: Number(room.hotY || room.hot_y || (22 + ((roomSeed >> 5) % 54))),
            size: index === 1 ? 'large' : 'normal'
        };
    }).filter(room => room.name && room.items.length);
    if (!rooms.length) return null;
    return {
        version: 2,
        source: source.source || 'api',
        contactId: String(contact?.id || safeContact.id || '').trim(),
        contactName,
        location: normalizePrivateTraceString(source.location || source.locationName || `${contactName} 的住所`, 80),
        address: normalizePrivateTraceString(source.address || source.location || safeContact.homeAddress || safeContact.ipCity || '位置已固定', 90),
        description: normalizePrivateTraceString(source.description || source.summary || '房间结构已生成并固定。', 220),
        generatedAt: Date.now(),
        fixed: true,
        rooms
    };
}

function buildPrivateTraceFallbackHouseData(contact = {}) {
    const safeContact = getPrivateMijingSafeContact(contact);
    const contactName = safeContact.name || 'TA';
    const seed = [safeContact.id, contactName, safeContact.profileSetting, safeContact.relationDesc, safeContact.homeAddress, safeContact.ipCity, Date.now()].join('|');
    const hash = hashPrivateSeed(seed);
    const addressChoices = ['靠近内环的安静公寓', '旧街区里的一间小屋', '高层边户的独居住所', '临街但收得很深的房间', '采光很窄的单身住处'];
    const address = safeContact.homeAddress || `${safeContact.ipCity || '设定未指定'}${addressChoices[hash % addressChoices.length]}`;
    const tone = [safeContact.profileSetting, safeContact.profileMemory, safeContact.profileStory, safeContact.relationDesc].join('\n').toLowerCase();
    const roomSet = /主播|直播|镜头|摄影|舞台|演员|艺人|模特|cos|model/.test(tone)
        ? ['玄关', '客厅', '化妆台', '卧室', '衣帽角']
        : /学生|校园|大学|研究生|college|student/.test(tone)
            ? ['玄关', '书桌', '卧室', '小厨房', '阳台']
            : /医生|律师|设计|程序|工程|办公室|公司|编辑|作家|画师|teacher|doctor|lawyer|designer/.test(tone)
                ? ['玄关', '工作区', '客厅', '卧室', '厨房']
                : ['玄关', '客厅', '卧室', '厨房', '阳台'];
    const noteMap = {
        '玄关': ['门口灯没关，钥匙还在托盘里。', '鞋尖朝里，外套袖口有折痕。'],
        '客厅': ['沙发一角下陷，茶几上压着一张便签。', '窗帘只拉了一半，屏幕反光很浅。'],
        '卧室': ['床头灯亮度很低，充电线垂在床沿。', '被角没有完全抚平，枕头偏向一侧。'],
        '厨房': ['料理台很干净，只剩一只杯子。', '冰箱门贴着便签，字迹很轻。'],
        '阳台': ['晾衣杆轻晃，盆栽土面还湿着。', '栏杆旁有一只空杯，像放了很久。'],
        '化妆台': ['镜前散着刷子和一枚发夹。', '小灯绕着镜面，亮度被调得很低。'],
        '衣帽角': ['衣架间距很齐，唯独一件外套露出来。', '抽屉留着细缝，像匆忙关上。'],
        '书桌': ['笔记本摊开，字迹停在半行。', '台灯还热，纸页边缘卷起。'],
        '小厨房': ['电热壶还插着，杯子靠得很近。', '料理台小而干净，留着包装纸。'],
        '工作区': ['椅背搭着外套，屏幕休眠未久。', '便签贴在右上角，字很克制。']
    };
    const rooms = roomSet.map((name, index) => {
        const roomHash = hashPrivateSeed(seed + ':' + name);
        const noteList = noteMap[name] || ['画面稳定，室内没有明显移动。'];
        const note = noteList[roomHash % noteList.length];
        return {
            id: `room-${index + 1}`,
            name,
            camera: `CAM ${String(index + 1).padStart(2, '0')}`,
            description: note,
            note,
            hotX: 24 + (roomHash % 58),
            hotY: 22 + ((roomHash >> 4) % 54),
            size: index === 1 ? 'large' : 'normal',
            items: [
                { name: ['抽屉缝隙', '桌面边角', '外套口袋', '屏幕旁边'][roomHash % 4], content: `${contactName}的生活痕迹停在这里，像刚刚被人碰过又刻意放回原位。` },
                { name: ['未合上的本子', '半杯水', '充电线', '便签纸'][((roomHash >> 3) % 4)], content: `细节不算夸张，但很贴近TA最近的状态：克制、停顿，还有一点不想被看见的疲惫。` }
            ]
        };
    });
    return {
        version: 2,
        source: 'fallback',
        contactId: safeContact.id,
        contactName,
        location: `${contactName} 的住所`,
        address,
        description: `${contactName}的房间结构已按人设生成，刷新可重新生成。`,
        generatedAt: Date.now(),
        fixed: true,
        rooms
    };
}

function parsePrivateTraceHouseResult(text, contact = {}) {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('踪迹接口没有返回内容。');
    const unfenced = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart ? unfenced.slice(jsonStart, jsonEnd + 1) : unfenced;
    const parsed = JSON.parse(jsonText);
    const normalized = normalizePrivateTraceHouseData(parsed, contact);
    if (!normalized) throw new Error('踪迹接口返回的房间数据不完整。');
    return normalized;
}

async function buildPrivateTraceHouseMessages(contact = {}, payload = {}) {
    const safeContact = getPrivateMijingSafeContact(contact);
    const record = getPrivateContactProfileRecord(contact) || {};
    const relationship = buildPrivateContactChatRelationshipContext(contact) || { label: '', note: '' };
    const archive = resolvePrivateContactArchiveSnapshot(contact, record || {}) || {};
    const userProfile = getPrivateContactChatPromptUserProfile() || {};
    const recentHistory = getPrivateTraceRecentConversation(contact?.id || safeContact.id, 18) || '暂无最近聊天。';
    const networkLink = findPrivateContactDossierNetworkLink(contact) || {};
    const system = [
        '你是 Rinno 踪迹监控的房间生成器。请根据角色人设、用户人设、关系网、长期记忆和最近聊天，生成一个“查岗监控”会看到的虚拟住所。',
        '目标是生成房间结构和可翻找细节，逻辑参考真实生活：区域、物品、隐藏内容要互相关联，不能悬浮，不能模板化。',
        '不要照搬任何已有项目的命名或 UI，只输出数据；不写解释、不写 Markdown。',
        '禁止输出任何 emoji、颜文字或装饰符号，所有文本保持干净克制。',
        '必须生成 4-6 个区域，至少包含客厅和卧室；每个区域 3-5 个可以翻找/观察的具体位置。',
        '每个 item.content 必须是具体发现，能体现角色状态、职业、社交关系、秘密、近期情绪或生活习惯，不要总是“什么都没有”。',
        '如果人设适合，可以出现电脑、文件夹、药盒、快递单、账单、衣柜、抽屉、床头柜、便签等，但不要强行堆砌。',
        '输出严格 JSON，格式：{"location":"...","description":"...","areas":{"客厅":{"description":"...","items":[{"name":"茶几抽屉","content":"..."}]},"卧室":{"description":"...","items":[...]}}}'
    ].join('\n');
    const user = [
        `联系人：${safeContact.name || '未命名'}`,
        `联系人签名/状态：${safeContact.status || safeContact.subtitle || '未设定'}`,
        `联系人设定：${safeContact.profileSetting || record?.setting || '未设定'}`,
        `联系人记忆：${safeContact.profileMemory || archive.memory || '暂无'}`,
        `联系人剧情线：${safeContact.profileStory || archive.story || '暂无'}`,
        `联系人关系摘要：${safeContact.profileDigest || archive.digest || '暂无'}`,
        `职业/类型：${safeContact.type || '未设定'}`,
        `IP城市：${safeContact.ipCity || '未设定'}`,
        `家庭住址：${safeContact.homeAddress || '未设定'}`,
        `用户：${safeContact.userName || userProfile.name || '我'}`,
        `用户设定：${safeContact.userPersona || userProfile.persona || '未设定'}`,
        `关系名称：${relationship.label || safeContact.relationName || '未设定'}`,
        `关系说明：${relationship.note || safeContact.relationDesc || '未设定'}`,
        `关系网：${networkLink.relation || ''} ${networkLink.description || safeContact.networkDescription || ''}`.trim() || '关系网未设定',
        '最近聊天：',
        recentHistory,
        '',
        payload?.force ? '本次是用户点击刷新后的重新生成，请覆盖旧房间，生成新的但仍然符合人设的住所。' : '本次是首次进入踪迹，如果没有旧房间，请生成一次并固定。'
    ].join('\n');
    return [{ role: 'system', content: system }, { role: 'user', content: user }];
}

async function generatePrivateTraceHouseData(payload = {}) {
    await Promise.resolve(privateStateReady);
    const source = payload && typeof payload === 'object' ? payload : {};
    const safeContactId = normalizePrivateContactRecordId(source.contactId || source.contact_id || source?.contact?.id || '');
    const rawContact = safeContactId ? getPrivateContactById(safeContactId) : null;
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) {
        return { ok: false, reason: 'contact_not_found', message: '未找到要监控的联系人。' };
    }
    const chat = await loadPrivateContactApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        return {
            ok: true,
            reason: 'api_not_configured',
            message: '未配置聊天接口，已使用本地踪迹生成逻辑。',
            data: buildPrivateTraceFallbackHouseData(contact)
        };
    }
    try {
        const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
        const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                temperature: Math.min(1, Math.max(0.45, Number(chat.temperature) || 0.82)),
                messages: await buildPrivateTraceHouseMessages(contact, source)
            })
        });
        if (!response.ok) throw new Error(`踪迹生成失败：${response.status}`);
        const result = await response.json();
        const data = parsePrivateTraceHouseResult(extractPrivateContactGeneratedText(result), contact);
        return { ok: true, data };
    } catch (error) {
        console.warn('Rinno trace house generation failed:', error);
        return {
            ok: true,
            reason: 'api_failed',
            message: error?.message || '踪迹生成失败，已使用本地生成。',
            data: buildPrivateTraceFallbackHouseData(contact)
        };
    }
}


async function forwardPrivateTraceFindingToChat(payload = {}) {
    await Promise.resolve(privateStateReady);
    const source = payload && typeof payload === 'object' ? payload : {};
    const safeContactId = normalizePrivateContactRecordId(source.contactId || source.contact_id || '');
    const contact = safeContactId ? getPrivateContactById(safeContactId) : null;
    if (!contact) return { ok: false, reason: 'contact_not_found', message: '未找到对应联系人。' };
    const finding = source.finding && typeof source.finding === 'object' ? source.finding : {};
    const contactName = getPrivateContactDisplayName(contact) || normalizePrivateTraceString(source?.contact?.name || 'TA', 24) || 'TA';
    const traceForward = normalizePrivateContactChatTraceForwardPayload({
        targetName: contactName,
        camera: finding.camera || '',
        roomName: finding.roomName || finding.room || '室内',
        itemName: finding.itemName || finding.name || '线索',
        content: finding.content || finding.detail || '没有更多线索。',
        location: finding.layoutLocation || finding.location || `${contactName} 的住所`,
        address: finding.address || '',
        note: finding.monitorNote || finding.roomDescription || '',
        forwardedAt: source.forwardedAt || Date.now()
    }, source);
    if (!traceForward) return { ok: false, reason: 'message_failed', message: '线索内容为空，无法转发。' };
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('trace-forward'),
        role: 'user',
        type: 'trace_forward',
        content: traceForward.content,
        traceForward,
        createdAt: traceForward.forwardedAt
    }])[0];
    if (!message) return { ok: false, reason: 'message_failed', message: '线索内容为空，无法转发。' };
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        unread: 0,
        updatedAt: Date.now(),
        messages: [...normalizePrivateContactChatMessages(thread.messages), message]
    }));
    renderPrivateThreads();
    const isActiveThread = normalizePrivateContactRecordId(privateActiveContactChatId) === normalizePrivateContactRecordId(contact.id);
    if (isActiveThread) {
        renderPrivateContactChatPage(contact.id, { scrollToBottom: true });
        requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    }
    await savePrivateState();
    if (typeof showPrivateSystemToast === 'function') showPrivateSystemToast('踪迹线索已转发到私叙。');
    return { ok: true, type: 'trace_forward' };
}

window.rinnoMijingListContacts = async () => {
    await Promise.resolve(privateStateReady);
    return getPrivateScopedContacts()
        .map(getPrivateHydratedContact)
        .map(getPrivateMijingSafeContact)
        .filter(contact => contact.id && contact.name)
        .slice(0, 48);
};

window.rinnoTraceListContacts = window.rinnoMijingListContacts;
window.rinnoTraceGenerateHouseData = payload => generatePrivateTraceHouseData(payload);
window.rinnoTraceForwardFinding = payload => forwardPrivateTraceFindingToChat(payload);

window.rinnoMijingNotifyPasswordAttempt = async payload => {
    await Promise.resolve(privateStateReady);
    const source = payload && typeof payload === 'object' ? payload : {};
    const safeContactId = normalizePrivateContactRecordId(source.contactId || source.contact_id || '');
    const contact = safeContactId ? getPrivateContactById(safeContactId) : null;
    if (!contact) return false;
    const content = buildPrivateMijingPasswordMessage(contact, source);
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('mijing-password-alert'),
        role: 'assistant',
        type: 'text',
        content,
        createdAt: Date.now()
    }])[0];
    if (!message) return false;
    const isActiveThread = normalizePrivateContactRecordId(privateActiveContactChatId) === normalizePrivateContactRecordId(contact.id);
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        unread: isActiveThread ? 0 : Math.max(1, Number(thread.unread || 0) + 1),
        updatedAt: Date.now(),
        messages: [...normalizePrivateContactChatMessages(thread.messages), message]
    }));
    renderPrivateThreads();
    if (isActiveThread) {
        renderPrivateContactChatPage(contact.id, { scrollToBottom: true });
        requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
    }
    await savePrivateState();
    if (typeof showPrivateSystemToast === 'function') showPrivateSystemToast(`${getPrivateContactDisplayName(contact)} 已感知秘境查手机。`);
    return true;
};

window.rinnoMijingRequestFaceAccess = async payload => {
    await Promise.resolve(privateStateReady);
    const source = payload && typeof payload === 'object' ? payload : {};
    const safeContactId = normalizePrivateContactRecordId(source.contactId || source.contact_id || '');
    const contact = safeContactId ? getPrivateContactById(safeContactId) : null;
    if (!contact) return { ok: false, granted: false, message: '未找到联系人' };
    const granted = scorePrivateMijingDisclosure(contact, { ...source, face: true }) >= 2;
    const content = buildPrivateMijingFaceRequestMessage(contact, granted);
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('mijing-face-request'),
        role: 'assistant',
        type: 'text',
        content,
        createdAt: Date.now()
    }])[0];
    if (message) {
        const isActiveThread = normalizePrivateContactRecordId(privateActiveContactChatId) === normalizePrivateContactRecordId(contact.id);
        updatePrivateContactChatThread(contact.id, thread => ({
            ...thread,
            unread: isActiveThread ? 0 : Math.max(1, Number(thread.unread || 0) + 1),
            updatedAt: Date.now(),
            messages: [...normalizePrivateContactChatMessages(thread.messages), message]
        }));
        renderPrivateThreads();
        if (isActiveThread) {
            renderPrivateContactChatPage(contact.id, { scrollToBottom: true });
            requestAnimationFrame(() => scrollPrivateContactChatContentToBottom('smooth'));
        }
        await savePrivateState();
    }
    if (typeof showPrivateSystemToast === 'function') showPrivateSystemToast(`${getPrivateContactDisplayName(contact)} 已收到面容录入请求。`);
    return { ok: true, granted, message: content };
};

window.rinnoGetWanyeBinding = () => getPrivateContactWanyeBindingSnapshot();
window.rinnoListWanyeContacts = async () => {
    await Promise.resolve(privateStateReady);
    return listPrivateWanyeContacts();
};
window.rinnoListWanyeScripts = async payload => {
    await Promise.resolve(privateStateReady);
    const binding = resolvePrivateContactStrictBinding(
        typeof payload === 'string' ? { contactId: payload } : (payload || {})
    );
    if (!binding.ok) return binding;
    return {
        ok: true,
        contactId: binding.contactId,
        accountId: binding.accountId,
        title: binding.title,
        scripts: await listPrivateWanyeScripts(binding.contactId)
    };
};
window.rinnoGenerateWanyeScripts = payload => generatePrivateWanyeScripts(payload);
window.rinnoSaveWanyeScript = payload => savePrivateWanyeScript(payload);
window.rinnoDeleteWanyeScript = payload => removePrivateWanyeScript(payload);
window.rinnoGenerateWanyeReply = payload => generatePrivateWanyeReply(payload);
window.rinnoArchiveWanyeSession = payload => archivePrivateWanyeSession(payload);
window.rinnoGetWanyeSessionDraft = payload => getPrivateWanyeSessionDraft(payload);
window.rinnoSaveWanyeSessionDraft = payload => savePrivateWanyeSessionDraft(payload);
window.rinnoDeleteWanyeSessionDraft = payload => removePrivateWanyeSessionDraft(payload);


window.rinnoPrivateGetActiveGiftContactAddress = () => {
    const contactId = String(privateActiveContactChatId || '').trim();
    const rawContact = contactId ? getPrivateContactById(contactId) : null;
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) return null;
    const address = String(contact.homeAddress || '').trim();
    const isUnspecified = !address || /设定未指定|未知|unknown/i.test(address);
    return {
        contactId: contact.id,
        receiver: getPrivateContactDisplayName(contact) || 'TA',
        phone: String(contact.phoneNumber || '').trim(),
        region: String(contact.ipCity || '').trim(),
        detail: isUnspecified ? '' : address
    };
};

window.rinnoPrivateContactReceiveGift = async payload => {
    await Promise.resolve(privateStateReady);
    const source = payload && typeof payload === 'object' ? payload : {};
    const explicitContactId = normalizePrivateContactRecordId(source.contactId || source.contact_id || '');
    const contactId = explicitContactId || String(privateActiveContactChatId || '').trim();
    const rawContact = contactId ? getPrivateContactById(contactId) : null;
    const contact = rawContact ? getPrivateHydratedContact(rawContact) : null;
    if (!contact) return false;
    const giftReceipt = normalizePrivateContactChatGiftReceiptPayload(source.giftReceipt || source.gift_receipt || source.gift || {}, {
        ...source,
        content: source.message || source.content || '我收到礼物了，谢谢你。'
    });
    if (!giftReceipt) return false;
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('gift-receipt'),
        role: 'assistant',
        type: 'gift_receipt',
        content: giftReceipt.message,
        giftReceipt,
        createdAt: Date.now()
    }])[0];
    if (!message) return false;
    updatePrivateContactChatThread(contact.id, thread => ({
        ...thread,
        unread: privateActiveContactChatId === contact.id ? 0 : Math.max(1, Number(thread.unread || 0) + 1),
        updatedAt: Date.now(),
        messages: [...thread.messages, message]
    }));
    renderPrivateThreads();
    if (privateActiveContactChatId === contact.id) renderPrivateContactChatPage(contact.id);
    await savePrivateState();
    requestAnimationFrame(() => {
        if (privateActiveContactChatId === contact.id) scrollPrivateContactChatContentToBottom('smooth');
    });
    return true;
};

window.openPrivateContactChatSettingsPage = openPrivateContactChatSettingsPage;
window.closePrivateContactChatSettingsPage = closePrivateContactChatSettingsPage;
window.getPrivateContactHomepageCoverInput = getPrivateContactHomepageCoverInput;



/* --- 线下 / 赴约：私叙互通增量能力（不替换原聊天系统） --- */
const PRIVATE_OFFLINE_LAUNCH_KEY = 'rinno:fuyue:launch';
const PRIVATE_OFFLINE_INVITE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const PRIVATE_OFFLINE_RECENT_DECLINE_MS = 24 * 60 * 60 * 1000;
const PRIVATE_OFFLINE_MESSAGE_TYPES = ['offline_invite_card', 'offline_session_record'];
let privateOfflineSettingsCache = Object.create(null);

PRIVATE_OFFLINE_MESSAGE_TYPES.forEach(type => {
    try { PRIVATE_CONTACT_CHAT_MESSAGE_TYPES.add(type); } catch (error) {}
    try { PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES.add(type); } catch (error) {}
});

function getPrivateOfflineDbTable(name) {
    try {
        return typeof db !== 'undefined' && db && db[name] ? db[name] : null;
    } catch (error) {
        return null;
    }
}

function createPrivateOfflineId(prefix = 'offline') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePrivateOfflineStatus(value = 'pending') {
    const status = String(value || '').trim();
    return ['pending', 'later', 'declined', 'accepted', 'ended'].includes(status) ? status : 'pending';
}

function normalizePrivateOfflineSettings(raw = {}, charId = '') {
    const safeCharId = normalizePrivateContactRecordId(raw?.charId || charId || 'contact_offline', 'contact_offline');
    const now = Date.now();
    return {
        charId: safeCharId,
        inviteEnabled: raw?.inviteEnabled === true,
        lastAutoInviteAt: Math.max(0, Number(raw?.lastAutoInviteAt) || 0),
        lastDeclinedAt: Math.max(0, Number(raw?.lastDeclinedAt) || 0),
        createdAt: Math.max(0, Number(raw?.createdAt) || now),
        updatedAt: Math.max(0, Number(raw?.updatedAt) || 0)
    };
}

async function getPrivateOfflineSettings(charId) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_offline', 'contact_offline');
    if (privateOfflineSettingsCache[safeCharId]) return privateOfflineSettingsCache[safeCharId];
    const table = getPrivateOfflineDbTable('offlineSettings');
    let saved = null;
    try {
        if (table?.get) saved = await table.get(safeCharId);
        if (!saved && db?.edits?.get) {
            const legacy = await db.edits.get(`offline_settings:${safeCharId}`);
            saved = legacy ? parseStoredJson(legacy.content) : null;
        }
    } catch (error) {
        console.warn('读取线下邀约设置失败:', error);
    }
    const normalized = normalizePrivateOfflineSettings(saved, safeCharId);
    privateOfflineSettingsCache[safeCharId] = normalized;
    return normalized;
}

async function savePrivateOfflineSettings(charId, patch = {}) {
    const safeCharId = normalizePrivateContactRecordId(charId || 'contact_offline', 'contact_offline');
    const current = await getPrivateOfflineSettings(safeCharId);
    const next = normalizePrivateOfflineSettings({ ...current, ...(patch || {}), charId: safeCharId, updatedAt: Date.now() }, safeCharId);
    privateOfflineSettingsCache[safeCharId] = next;
    const table = getPrivateOfflineDbTable('offlineSettings');
    try {
        if (table?.put) await table.put(next);
        else if (db?.edits?.put) await db.edits.put({ id: `offline_settings:${safeCharId}`, content: JSON.stringify(next), type: 'offline-settings' });
    } catch (error) {
        console.warn('保存线下邀约设置失败:', error);
    }
    return next;
}

function normalizePrivateOfflineInvite(raw = {}, fallbackContact = {}) {
    const now = Date.now();
    const charId = normalizePrivateContactRecordId(raw?.charId || fallbackContact?.id || 'contact_offline', 'contact_offline');
    const charName = String(raw?.charName || getPrivateContactDisplayName(fallbackContact) || 'TA').trim();
    const time = raw?.time && typeof raw.time === 'object' ? raw.time : {};
    const place = raw?.place && typeof raw.place === 'object' ? raw.place : {};
    const title = String(raw?.title || '想和你见一面').trim();
    const timeText = String(time.text || raw?.timeText || '今晚 19:30').trim();
    const placeName = String(place.name || raw?.placeName || '街角花店外').trim();
    const placeAddress = String(place.address || raw?.placeAddress || '离你们都不算远的那条安静街口').trim();
    const placeAtmosphere = String(place.atmosphere || raw?.placeAtmosphere || '灯光很低，适合把话慢慢说清楚').trim();
    return {
        type: 'offline_invite_card',
        inviteId: String(raw?.inviteId || createPrivateOfflineId('offline-invite')).trim(),
        charId,
        charName,
        title,
        time: {
            text: timeText,
            timestamp: String(time.timestamp || raw?.timestamp || '').trim()
        },
        place: {
            name: placeName,
            address: placeAddress,
            atmosphere: placeAtmosphere
        },
        reason: String(raw?.reason || '想把这句话留到见面时说。').trim().slice(0, 80),
        mood: String(raw?.mood || '想见你').trim().slice(0, 40),
        status: normalizePrivateOfflineStatus(raw?.status),
        createdAt: String(raw?.createdAt || new Date(now).toISOString()),
        source: String(raw?.source || 'chat_auto').trim() || 'chat_auto',
        updatedAt: Math.max(0, Number(raw?.updatedAt) || now),
        timeText,
        placeName,
        placeAddress,
        placeAtmosphere
    };
}

function normalizePrivateOfflineSessionRecord(raw = {}, fallbackContact = {}) {
    const charId = normalizePrivateContactRecordId(raw?.charId || fallbackContact?.id || 'contact_offline', 'contact_offline');
    const place = raw?.place && typeof raw.place === 'object' ? raw.place : {};
    return {
        type: 'offline_session_record',
        sessionId: String(raw?.sessionId || createPrivateOfflineId('offline-session')).trim(),
        inviteId: String(raw?.inviteId || '').trim(),
        charId,
        charName: String(raw?.charName || getPrivateContactDisplayName(fallbackContact) || 'TA').trim(),
        source: String(raw?.source || 'user_app').trim() || 'user_app',
        startedAt: Math.max(0, Number(raw?.startedAt) || 0),
        endedAt: Math.max(0, Number(raw?.endedAt) || Date.now()),
        timeText: String(raw?.timeText || '').trim(),
        place: {
            name: String(place.name || raw?.placeName || '某个安静的地方').trim(),
            address: String(place.address || raw?.placeAddress || '').trim(),
            atmosphere: String(place.atmosphere || raw?.placeAtmosphere || '').trim()
        },
        summary: String(raw?.summary || '你们完成了一次线下见面。').trim().slice(0, 240),
        relationDelta: String(raw?.relationDelta || raw?.relation_delta || '关系有了新的可回忆节点').trim().slice(0, 80),
        moodDelta: String(raw?.moodDelta || raw?.mood_delta || '情绪被妥善放下').trim().slice(0, 80),
        memoryWritten: raw?.memoryWritten !== false
    };
}

const __rinnoOfflineNormalizeMessageType = normalizePrivateContactChatMessageType;
normalizePrivateContactChatMessageType = function(item = {}) {
    const rawType = String(item?.type || item?.kind || item?.messageType || '').trim().toLowerCase();
    if (rawType === 'offline_invite_card') return 'offline_invite_card';
    if (rawType === 'offline_session_record' || rawType === 'offline_meeting_record') return 'offline_session_record';
    return __rinnoOfflineNormalizeMessageType(item);
};

const __rinnoOfflineNormalizeMessages = normalizePrivateContactChatMessages;
normalizePrivateContactChatMessages = function(value) {
    const sourceList = Array.isArray(value) ? value : [];
    const sourceById = new Map(sourceList.filter(item => item && typeof item === 'object').map(item => [String(item.id || '').trim(), item]));
    const normalized = __rinnoOfflineNormalizeMessages(value);
    return normalized.map(message => {
        if (message.type !== 'offline_invite_card' && message.type !== 'offline_session_record') return message;
        const raw = sourceById.get(String(message.id || '').trim()) || {};
        if (message.type === 'offline_invite_card') {
            const invite = normalizePrivateOfflineInvite(raw.offlineInvite || raw.invite || raw, getPrivateContactById(raw.charId || message.charId || privateActiveContactChatId) || {});
            return { ...message, content: invite.reason || message.content || invite.title, offlineInvite: invite };
        }
        const record = normalizePrivateOfflineSessionRecord(raw.offlineSession || raw.session || raw, getPrivateContactById(raw.charId || message.charId || privateActiveContactChatId) || {});
        return { ...message, content: record.summary || message.content || '线下见面记录', offlineSession: record };
    });
};

const __rinnoOfflineMessageSummary = getPrivateContactChatMessageSummary;
getPrivateContactChatMessageSummary = function(message = {}, maxLength = 72) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'offline_invite_card') {
        const invite = normalizePrivateOfflineInvite(message.offlineInvite || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
        return `[线下邀约] ${trimPrivateContactChatSnippet(`${invite.time.text} · ${invite.place.name}`, maxLength - 8)}`;
    }
    if (type === 'offline_session_record') {
        const session = normalizePrivateOfflineSessionRecord(message.offlineSession || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
        return `[见面记录] ${trimPrivateContactChatSnippet(`${session.place.name} · ${session.summary}`, maxLength - 8)}`;
    }
    return __rinnoOfflineMessageSummary(message, maxLength);
};

const __rinnoOfflinePlainText = getPrivateContactChatPlainText;
getPrivateContactChatPlainText = function(message = {}) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'offline_invite_card') {
        const invite = normalizePrivateOfflineInvite(message.offlineInvite || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
        return `[线下邀约] ${invite.time.text} · ${invite.place.name} · ${invite.reason}`;
    }
    if (type === 'offline_session_record') {
        const session = normalizePrivateOfflineSessionRecord(message.offlineSession || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
        return `[线下见面记录] ${session.timeText || formatPrivateContactArchiveTime(session.endedAt)} · ${session.place.name} · ${session.summary}`;
    }
    return __rinnoOfflinePlainText(message);
};

const __rinnoOfflineShellFreeType = typeof isPrivateContactChatBubbleShellFreeType === 'function'
    ? isPrivateContactChatBubbleShellFreeType
    : (() => false);
isPrivateContactChatBubbleShellFreeType = function(type = '') {
    const safeType = String(type || '').trim();
    if (safeType === 'offline_invite_card' || safeType === 'offline_session_record') return true;
    return __rinnoOfflineShellFreeType(type);
};

function getPrivateOfflineStatusLabel(status = 'pending') {
    return ({ pending: '等待回应', later: '稍后再说', declined: '已拒绝', accepted: '已接受', ended: '已完成' })[normalizePrivateOfflineStatus(status)] || '等待回应';
}

function renderPrivateOfflineInviteCardMarkup(message = {}) {
    const invite = normalizePrivateOfflineInvite(message.offlineInvite || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
    const status = normalizePrivateOfflineStatus(invite.status);
    const disabled = status === 'declined' || status === 'accepted' || status === 'ended';
    return `
        <article class="private-offline-invite-card" data-private-offline-invite-card data-private-offline-invite-id="${escapePrivateHtml(invite.inviteId)}" data-private-offline-message-id="${escapePrivateHtml(message.id || '')}">
            <div class="private-offline-card-kicker">RENDEZVOUS · ${escapePrivateHtml(invite.charName)}</div>
            <div class="private-offline-card-title">${escapePrivateHtml(invite.title)}</div>
            <div class="private-offline-card-grid">
                <section>
                    <span>TIME</span>
                    <strong>${escapePrivateHtml(invite.time.text)}</strong>
                </section>
                <section>
                    <span>PLACE</span>
                    <strong>${escapePrivateHtml(invite.place.name)}</strong>
                    <em>${escapePrivateHtml(invite.place.address)}</em>
                </section>
            </div>
            <p class="private-offline-card-atmosphere">${escapePrivateHtml(invite.place.atmosphere)}</p>
            <div class="private-offline-card-reason">${escapePrivateHtml(invite.reason)}</div>
            <div class="private-offline-card-actions">
                <span class="private-offline-status is-${escapePrivateHtml(status)}">${escapePrivateHtml(getPrivateOfflineStatusLabel(status))}</span>
                <button class="interactive private-offline-card-btn primary" type="button" data-private-offline-invite-action="accept" ${disabled ? 'disabled' : ''}>接受赴约</button>
                <button class="interactive private-offline-card-btn" type="button" data-private-offline-invite-action="later" ${disabled ? 'disabled' : ''}>稍后再说</button>
                <button class="interactive private-offline-card-btn ghost" type="button" data-private-offline-invite-action="decline" ${disabled ? 'disabled' : ''}>拒绝</button>
            </div>
        </article>
    `;
}

function renderPrivateOfflineSessionRecordMarkup(message = {}) {
    const record = normalizePrivateOfflineSessionRecord(message.offlineSession || message, getPrivateContactById(message.charId || privateActiveContactChatId) || {});
    const timeText = record.timeText || formatPrivateContactArchiveTime(record.endedAt) || '刚刚';
    return `
        <article class="private-offline-session-card" data-private-offline-session-id="${escapePrivateHtml(record.sessionId)}">
            <div class="private-offline-card-kicker">MEETING ARCHIVE · ${escapePrivateHtml(record.charName)}</div>
            <div class="private-offline-session-head">
                <strong>线下见面记录</strong>
                <span>${escapePrivateHtml(timeText)}</span>
            </div>
            <div class="private-offline-session-place">${escapePrivateHtml(record.place.name)}${record.place.address ? ` · ${escapePrivateHtml(record.place.address)}` : ''}</div>
            <p>${escapePrivateHtml(record.summary)}</p>
            <div class="private-offline-session-delta">
                <span>${escapePrivateHtml(record.relationDelta)}</span>
                <span>${escapePrivateHtml(record.moodDelta)}</span>
            </div>
        </article>
    `;
}

const __rinnoOfflineRenderMessageContent = renderPrivateContactChatMessageContentMarkup;
renderPrivateContactChatMessageContentMarkup = function(message = {}) {
    const type = getPrivateContactChatMessageType(message);
    if (type === 'offline_invite_card') return renderPrivateOfflineInviteCardMarkup(message);
    if (type === 'offline_session_record') return renderPrivateOfflineSessionRecordMarkup(message);
    return __rinnoOfflineRenderMessageContent(message);
};

function createPrivateOfflineSettingsPanelMarkup(contact = {}) {
    const safeContactId = normalizePrivateContactRecordId(contact?.id || privateActiveContactChatId || 'contact_offline', 'contact_offline');
    const settings = normalizePrivateOfflineSettings(privateOfflineSettingsCache[safeContactId], safeContactId);
    const enabled = settings.inviteEnabled;
    const lastAuto = settings.lastAutoInviteAt ? formatPrivateContactArchiveTime(settings.lastAutoInviteAt) : '暂无主动邀约';
    const lastDecline = settings.lastDeclinedAt ? formatPrivateContactArchiveTime(settings.lastDeclinedAt) : '暂无拒绝记录';
    return `
        <section class="private-contact-settings-panel private-offline-settings-panel">
            <div class="private-contact-settings-panel-head">
                <div class="private-contact-settings-panel-copy">
                    <span>线下邀约</span>
                    <strong>只控制 Char 主动发起见面，不影响赴约 APP</strong>
                    <p>开启后会结合关系阶段、情绪、长期记忆、约定、最近摘要与人设自然判断；24 小时内最多主动触发一次。</p>
                </div>
                ${createPrivateContactSettingsBadgeMarkup(enabled ? '允许主动邀约' : '仅手动赴约', enabled ? 'live' : 'soft')}
            </div>
            <div class="private-contact-settings-inline private-offline-settings-inline">
                <div class="private-contact-settings-toggle-copy">
                    <strong>线下邀约开关</strong>
                    <small>按当前联系人独立保存到 IndexedDB；关闭后仍可从「赴约」APP 主动进入。</small>
                </div>
                <label class="private-contact-settings-switch">
                    <input type="checkbox" data-private-contact-settings-toggle="offline-invite" ${enabled ? 'checked' : ''}>
                    <span></span>
                </label>
            </div>
            <div class="private-offline-settings-note-grid">
                <span>最近主动邀约：${escapePrivateHtml(lastAuto)}</span>
                <span>最近拒绝记录：${escapePrivateHtml(lastDecline)}</span>
            </div>
        </section>
    `;
}

const __rinnoOfflineCreateSettingsMarkup = createPrivateContactChatSettingsMarkup;
createPrivateContactChatSettingsMarkup = function(contact = {}, options = {}) {
    const html = __rinnoOfflineCreateSettingsMarkup(contact, options);
    const panel = createPrivateOfflineSettingsPanelMarkup(contact);
    return html.replace('<div class="private-contact-settings-flow">', `<div class="private-contact-settings-flow">${panel}`);
};

const __rinnoOfflineRenderSettingsPage = renderPrivateContactChatSettingsPage;
renderPrivateContactChatSettingsPage = async function(contactId = privateActiveContactChatId, options = {}) {
    const safeContactId = normalizePrivateContactRecordId(contactId || privateActiveContactChatId || '', '');
    const page = ensurePrivateContactChatSettingsPage();
    if (safeContactId) await getPrivateOfflineSettings(safeContactId);
    const result = await __rinnoOfflineRenderSettingsPage(contactId, options);
    if (document.querySelector('.private-chat-screen')?.getAttribute('data-private-current-tab') === 'contact-chat-settings') {
        document.querySelectorAll('[data-private-panel]').forEach(panel => {
            panel.classList.toggle('active', panel.getAttribute('data-private-panel') === 'contact-chat-settings');
        });
        page?.classList.add('active');
    }
    return result;
};

document.addEventListener('change', event => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    if (!target || !target.matches('[data-private-contact-settings-toggle="offline-invite"]')) return;
    const contactId = target.closest('[data-private-contact-settings-id]')?.getAttribute('data-private-contact-settings-id') || privateActiveContactChatId;
    void savePrivateOfflineSettings(contactId, { inviteEnabled: target.checked }).then(() => {
        showPrivateSystemToast(target.checked ? '线下邀约已开启。' : '线下邀约已关闭，仍可从赴约 APP 主动进入。');
        void renderPrivateContactChatSettingsPage(contactId, { preserveScroll: true });
    });
}, true);

function getPrivateOfflinePlacePool(contact = {}) {
    const text = [contact?.title, contact?.subtitle, contact?.signature, contact?.note, contact?.homeAddress, contact?.ipCity].filter(Boolean).join(' ');
    const pool = [
        { name: '街角花店外', address: '离主路稍远的转角，橱窗里还亮着灯', atmosphere: '奶油色灯光落在玻璃上，适合把话说得轻一点' },
        { name: '江边步道', address: '靠近第二座路灯的位置', atmosphere: '风很慢，水面把沉默也照得柔和' },
        { name: '二十四小时便利店门口', address: '热饮柜旁边可以看见街口', atmosphere: '深夜灯牌安静亮着，适合临时见一面' },
        { name: '旧书店靠窗位', address: '靠近木质书架和窄窗的小桌', atmosphere: '纸页味很淡，讲话会自然放低声音' },
        { name: '小型展馆出口', address: '最后一面白墙旁边', atmosphere: '人声从远处退开，只剩一点展厅的回音' },
        { name: '电影院侧门', address: '散场人群过去后还亮着暖灯', atmosphere: '刚好可以并肩走一段，不急着解释' },
        { name: '学校门口雨棚下', address: '雨声敲在透明棚顶', atmosphere: '距离很近，却仍然留着一点分寸' },
        { name: '家附近的长椅', address: '楼下那棵树旁边', atmosphere: '熟悉到不用铺垫，也足够安静' }
    ];
    if (/书|文学|老师|学生|图书|学/i.test(text)) return [pool[3], pool[6], pool[4], pool[1]];
    if (/电影|音乐|艺术|展|画|演员|导演/i.test(text)) return [pool[4], pool[5], pool[0], pool[3]];
    if (/夜|便利|打工|街|自由|叛逆/i.test(text)) return [pool[2], pool[1], pool[5], pool[0]];
    if (/家|邻居|青梅|竹马|同居|熟悉/i.test(text)) return [pool[7], pool[6], pool[0], pool[2]];
    return pool;
}

function pickPrivateOfflineSeeded(list, seedText = '') {
    const listSafe = Array.isArray(list) && list.length ? list : [''];
    let seed = 0;
    String(seedText || '').split('').forEach(ch => { seed = (seed * 31 + ch.charCodeAt(0)) >>> 0; });
    return listSafe[seed % listSafe.length];
}

function createPrivateOfflineTimeText(now = new Date()) {
    const hour = now.getHours();
    if (hour >= 6 && hour < 10) return '今天 15:30';
    if (hour >= 10 && hour < 17) return '今天 19:30';
    if (hour >= 17 && hour < 22) return '今晚 20:40';
    return '明天 19:30';
}

function scorePrivateOfflineInviteNeed(contact = {}, thread = {}, longMemoryState = {}, advancedSettings = {}) {
    const messages = normalizePrivateContactChatMessages(thread?.messages || []);
    const visible = messages.filter(message => message.role !== 'system');
    const latestUser = [...visible].reverse().find(message => message.role === 'user');
    const latestAssistant = [...visible].reverse().find(message => message.role === 'assistant');
    const userText = latestUser ? getPrivateContactChatPlainText(latestUser) : '';
    const assistantText = latestAssistant ? getPrivateContactChatPlainText(latestAssistant) : '';
    const combined = `${userText}\n${assistantText}`;
    let score = 0;
    if (/(见面|想见|来找|一起|出来|陪我|陪你|抱抱|当面|线下|约|去哪|去哪里)/i.test(combined)) score += 4;
    if (/(难过|崩溃|哭|失眠|累|害怕|委屈|不安|撑不住|安慰|陪陪)/i.test(userText)) score += 3;
    if (/(生日|纪念日|庆祝|考完|通过|升职|中奖|礼物|恭喜)/i.test(combined)) score += 3;
    if (/(吵架|对不起|和好|解释|误会|冷战|别生气|原谅)/i.test(combined)) score += 3;
    if (Array.isArray(longMemoryState?.promises) && longMemoryState.promises.some(item => /(见|去|一起|约|带你|陪你|兑现)/.test(String(item?.text || '')))) score += 2;
    const personality = advancedSettings?.personalityState || {};
    if ((personality.initiative || 0) >= 65) score += 1;
    if ((personality.intimacy || 0) >= 65) score += 1;
    if ((personality.boundary || 0) <= 35) score -= 1;
    if (visible.length < 4 && score < 4) score -= 2;
    return { score, userText, combined };
}

async function getPrivateOfflineLatestSession(charId = '') {
    const safeCharId = normalizePrivateContactRecordId(charId || '', '');
    if (!safeCharId) return null;
    const table = getPrivateOfflineDbTable('offlineSessions');
    try {
        if (!table?.where) return null;
        const list = await table.where('charId').equals(safeCharId).toArray();
        return list.sort((a, b) => (Number(b.endedAt || b.startedAt) || 0) - (Number(a.endedAt || a.startedAt) || 0))[0] || null;
    } catch (error) {
        return null;
    }
}

async function hasPrivateOfflineRecentInvite(charId = '') {
    const safeCharId = normalizePrivateContactRecordId(charId || '', '');
    const table = getPrivateOfflineDbTable('offlineInvites');
    if (!safeCharId || !table?.where) return false;
    const now = Date.now();
    try {
        const list = await table.where('charId').equals(safeCharId).toArray();
        return list.some(item => {
            const status = normalizePrivateOfflineStatus(item?.status);
            const updatedAt = Number(item?.updatedAt || item?.createdAt) || 0;
            return ['pending', 'later'].includes(status) || (now - updatedAt < PRIVATE_OFFLINE_INVITE_COOLDOWN_MS);
        });
    } catch (error) {
        return false;
    }
}

async function buildPrivateOfflineAutoInvite(contact = {}) {
    const safeContact = getPrivateHydratedContact(contact) || contact;
    const safeContactId = normalizePrivateContactRecordId(safeContact?.id || '', '');
    const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
    const longMemoryState = await getCharacterLongMemoryState(safeContactId, safeContact);
    const advancedSettings = await getCharacterAdvancedSettings(safeContactId);
    const scored = scorePrivateOfflineInviteNeed(safeContact, thread, longMemoryState, advancedSettings);
    const latestSession = await getPrivateOfflineLatestSession(safeContactId);
    const longNoSee = !latestSession || (Date.now() - (Number(latestSession.endedAt || latestSession.startedAt) || 0)) > 7 * 24 * 60 * 60 * 1000;
    if (longNoSee) scored.score += 1;
    if (scored.score < 4) return null;
    if (scored.score < 6 && Math.random() > 0.35) return null;
    const place = pickPrivateOfflineSeeded(getPrivateOfflinePlacePool(safeContact), `${safeContactId}:${Date.now()}`);
    const timeText = createPrivateOfflineTimeText(new Date());
    const reasonPool = [
        '有些话想当面慢慢说。',
        '不想只隔着屏幕陪你。',
        '这次想把约定认真兑现。',
        '想确认你现在真的还好。',
        '想把这件事变成可以记住的一天。'
    ];
    const titlePool = [
        '把今晚留给见面吧',
        '我想和你短暂出逃',
        '这次不只在屏幕里说',
        '见一面，好不好',
        '给我一小段真实时间'
    ];
    const now = Date.now();
    return normalizePrivateOfflineInvite({
        inviteId: createPrivateOfflineId('offline-invite'),
        charId: safeContactId,
        charName: getPrivateContactDisplayName(safeContact),
        title: pickPrivateOfflineSeeded(titlePool, scored.combined || safeContactId),
        time: { text: timeText, timestamp: '' },
        place,
        reason: pickPrivateOfflineSeeded(reasonPool, scored.userText || safeContactId),
        mood: /(吵架|误会|对不起|冷战)/.test(scored.combined) ? '想和好' : /(难过|哭|累|害怕)/.test(scored.userText) ? '担心你' : '想见你',
        status: 'pending',
        createdAt: new Date(now).toISOString(),
        source: 'chat_auto',
        updatedAt: now
    }, safeContact);
}

async function insertPrivateOfflineInviteMessage(contactId, invite) {
    const safeContactId = normalizePrivateContactRecordId(contactId || invite?.charId || '', '');
    if (!safeContactId || !invite) return false;
    const normalizedInvite = normalizePrivateOfflineInvite(invite, getPrivateContactById(safeContactId) || {});
    try {
        const table = getPrivateOfflineDbTable('offlineInvites');
        if (table?.put) await table.put({
            inviteId: normalizedInvite.inviteId,
            charId: normalizedInvite.charId,
            status: normalizedInvite.status,
            timeText: normalizedInvite.time.text,
            placeName: normalizedInvite.place.name,
            placeAddress: normalizedInvite.place.address,
            placeAtmosphere: normalizedInvite.place.atmosphere,
            reason: normalizedInvite.reason,
            mood: normalizedInvite.mood,
            source: normalizedInvite.source,
            createdAt: Date.parse(normalizedInvite.createdAt) || Date.now(),
            updatedAt: normalizedInvite.updatedAt,
            payload: normalizedInvite
        });
    } catch (error) {
        console.warn('保存线下邀约失败:', error);
    }
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('offline-invite'),
        role: 'assistant',
        type: 'offline_invite_card',
        content: normalizedInvite.reason,
        offlineInvite: normalizedInvite,
        charId: safeContactId,
        createdAt: Date.now()
    }])[0];
    if (!message) return false;
    await appendPrivateContactChatAssistantMessage(safeContactId, message);
    await savePrivateOfflineSettings(safeContactId, { lastAutoInviteAt: Date.now() });
    return true;
}

async function maybeTriggerPrivateOfflineInviteAfterReply(contact = {}) {
    const safeContact = getPrivateHydratedContact(contact) || contact;
    const safeContactId = normalizePrivateContactRecordId(safeContact?.id || '', '');
    if (!safeContactId) return false;
    const settings = await getPrivateOfflineSettings(safeContactId);
    const now = Date.now();
    if (!settings.inviteEnabled) return false;
    if (settings.lastAutoInviteAt && now - settings.lastAutoInviteAt < PRIVATE_OFFLINE_INVITE_COOLDOWN_MS) return false;
    if (settings.lastDeclinedAt && now - settings.lastDeclinedAt < PRIVATE_OFFLINE_RECENT_DECLINE_MS) return false;
    if (await hasPrivateOfflineRecentInvite(safeContactId)) return false;
    const invite = await buildPrivateOfflineAutoInvite(safeContact);
    if (!invite) return false;
    return insertPrivateOfflineInviteMessage(safeContactId, invite);
}

const __rinnoOfflineRequestAssistantReply = requestPrivateContactChatAssistantReply;
requestPrivateContactChatAssistantReply = async function(contact) {
    const result = await __rinnoOfflineRequestAssistantReply(contact);
    if (result && contact) {
        try { await maybeTriggerPrivateOfflineInviteAfterReply(contact); } catch (error) { console.warn('线下邀约自动触发失败:', error); }
    }
    return result;
};

async function updatePrivateOfflineInviteStatusFromCard(card, status) {
    const inviteId = String(card?.getAttribute('data-private-offline-invite-id') || '').trim();
    const messageId = String(card?.getAttribute('data-private-offline-message-id') || '').trim();
    const safeStatus = normalizePrivateOfflineStatus(status);
    const contactId = privateActiveContactChatId;
    if (!inviteId || !messageId || !contactId) return null;
    let updatedInvite = null;
    updatePrivateContactChatThread(contactId, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: thread.messages.map(message => {
            if (String(message.id || '').trim() !== messageId) return message;
            const invite = normalizePrivateOfflineInvite(message.offlineInvite || message, getPrivateContactById(contactId) || {});
            updatedInvite = { ...invite, status: safeStatus, updatedAt: Date.now() };
            return { ...message, content: updatedInvite.reason, offlineInvite: updatedInvite };
        })
    }));
    if (updatedInvite) {
        try {
            const table = getPrivateOfflineDbTable('offlineInvites');
            if (table?.update) await table.update(inviteId, { status: safeStatus, updatedAt: Date.now(), payload: updatedInvite });
            else if (table?.put) await table.put({ ...updatedInvite, inviteId, charId: updatedInvite.charId, status: safeStatus, timeText: updatedInvite.time.text, placeName: updatedInvite.place.name, placeAddress: updatedInvite.place.address, reason: updatedInvite.reason, mood: updatedInvite.mood, updatedAt: Date.now(), payload: updatedInvite });
        } catch (error) {
            console.warn('更新线下邀约状态失败:', error);
        }
    }
    renderPrivateThreads();
    if (privateActiveContactChatId === contactId) renderPrivateContactChatPage(contactId, { scrollToBottom: false });
    await savePrivateState();
    return updatedInvite;
}

async function writePrivateOfflineDeclineMemory(contactId, invite) {
    const safeContactId = normalizePrivateContactRecordId(contactId || invite?.charId || '', '');
    if (!safeContactId || !invite) return;
    await savePrivateOfflineSettings(safeContactId, { lastDeclinedAt: Date.now() });
    try {
        const text = `用户婉拒了${invite.time?.text || invite.timeText || ''}在${invite.place?.name || invite.placeName || '线下'}的见面邀约；短时间内不要重复主动邀约。`;
        await saveCharacterLongMemoryState(safeContactId, {
            entries: [{ id: createPrivateOfflineId('offline-decline-memory'), text, source: 'offline_invite_declined', core: false, createdAt: Date.now(), updatedAt: Date.now(), axis: { when: invite.time?.text || '', where: invite.place?.name || '', feel: '被婉拒，需要尊重边界' } }],
            recallHints: ['用户刚拒绝过线下邀约，短时间内不要再次主动提出见面。'],
            updatedAt: Date.now()
        }, { seedContact: getPrivateContactById(safeContactId) || null });
    } catch (error) {
        console.warn('写入拒绝邀约记忆失败:', error);
    }
}

function launchPrivateOfflineMeeting(invite = {}, source = 'chat_auto') {
    const normalizedInvite = normalizePrivateOfflineInvite(invite, getPrivateContactById(invite?.charId || privateActiveContactChatId) || {});
    const launchPayload = {
        mode: 'invite',
        source,
        inviteId: normalizedInvite.inviteId,
        charId: normalizedInvite.charId,
        createdAt: Date.now()
    };
    try { window.localStorage.setItem(PRIVATE_OFFLINE_LAUNCH_KEY, JSON.stringify(launchPayload)); } catch (error) {}
    if (typeof window.openFuyueApp === 'function') window.openFuyueApp();
    window.setTimeout(() => {
        try {
            const frame = document.getElementById('fuyue-frame');
            frame?.contentWindow?.postMessage({ type: 'RINNO_FUYUE_LAUNCH', payload: launchPayload }, '*');
        } catch (error) {}
    }, 240);
}

document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('[data-private-offline-invite-action]') : null;
    if (!button) return;
    const card = button.closest('[data-private-offline-invite-card]');
    if (!card) return;
    event.preventDefault();
    event.stopPropagation();
    const action = button.getAttribute('data-private-offline-invite-action');
    const status = action === 'accept' ? 'accepted' : action === 'later' ? 'later' : 'declined';
    void updatePrivateOfflineInviteStatusFromCard(card, status).then(invite => {
        if (!invite) return;
        if (status === 'accepted') {
            showPrivateSystemToast('已接受赴约。');
            launchPrivateOfflineMeeting(invite, invite.source || 'chat_auto');
        } else if (status === 'later') {
            showPrivateSystemToast('已改为稍后再说。');
        } else {
            showPrivateSystemToast('已拒绝这次邀约。');
            void writePrivateOfflineDeclineMemory(invite.charId, invite);
        }
    });
}, true);

async function listPrivateOfflineInvitesForContact(charId) {
    const safeContactId = normalizePrivateContactRecordId(charId || '', '');
    const table = getPrivateOfflineDbTable('offlineInvites');
    if (!safeContactId || !table?.where) return [];
    try {
        const list = await table.where('charId').equals(safeContactId).toArray();
        return list.map(item => normalizePrivateOfflineInvite(item.payload || item, getPrivateContactById(safeContactId) || {})).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    } catch (error) {
        return [];
    }
}

async function getPrivateOfflineInviteById(inviteId = '') {
    const safeInviteId = String(inviteId || '').trim();
    const table = getPrivateOfflineDbTable('offlineInvites');
    if (!safeInviteId || !table?.get) return null;
    try {
        const saved = await table.get(safeInviteId);
        return saved ? normalizePrivateOfflineInvite(saved.payload || saved, getPrivateContactById(saved.charId) || {}) : null;
    } catch (error) {
        return null;
    }
}

function buildPrivateOfflineContactSnapshot(contact = {}, extra = {}) {
    const hydrated = getPrivateHydratedContact(contact) || contact;
    const displayName = getPrivateContactDisplayName(hydrated);
    return {
        id: hydrated.id,
        name: displayName,
        title: displayName,
        avatar: hydrated.avatar || '',
        relationStatus: hydrated.signature || hydrated.subtitle || hydrated.type || '关系正在慢慢变清晰',
        setting: hydrated.note || hydrated.setting || '',
        homeAddress: hydrated.homeAddress || '',
        ipCity: hydrated.ipCity || '',
        ...extra
    };
}

async function getPrivateOfflineLatestMeetingText(charId = '') {
    const latest = await getPrivateOfflineLatestSession(charId);
    if (!latest) return '还没有线下见面记录';
    const timeText = latest.timeText || formatPrivateContactArchiveTime(latest.endedAt || latest.startedAt) || '最近';
    const placeName = latest.place?.name || latest.placeName || '线下';
    return `${timeText} · ${placeName}`;
}

window.rinnoOfflineListContacts = async function() {
    await Promise.resolve(privateStateReady);
    const contacts = getPrivateScopedContacts().map(item => getPrivateHydratedContact(item) || item).filter(Boolean);
    const rows = [];
    for (const contact of contacts) {
        const invites = await listPrivateOfflineInvitesForContact(contact.id);
        const pendingInvite = invites.find(item => normalizePrivateOfflineStatus(item.status) === 'pending') || null;
        rows.push(buildPrivateOfflineContactSnapshot(contact, {
            lastMeetingText: await getPrivateOfflineLatestMeetingText(contact.id),
            pendingInvite
        }));
    }
    return rows;
};

window.rinnoOfflineGetLaunchIntent = function() {
    try {
        const raw = window.localStorage.getItem(PRIVATE_OFFLINE_LAUNCH_KEY);
        return raw ? parseStoredJson(raw) : null;
    } catch (error) {
        return null;
    }
};

window.rinnoOfflineClearLaunchIntent = function() {
    try { window.localStorage.removeItem(PRIVATE_OFFLINE_LAUNCH_KEY); } catch (error) {}
};

function createPrivateOfflineManualContext(contact = {}) {
    const place = pickPrivateOfflineSeeded(getPrivateOfflinePlacePool(contact), `${contact?.id || ''}:manual:${Date.now()}`);
    const timeText = createPrivateOfflineTimeText(new Date());
    return { place, timeText };
}

function normalizePrivateOfflinePayloadArray(value, fallback = null) {
    let source = value;
    if (typeof source === 'string') {
        const stripped = source.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
        try { source = JSON.parse(stripped); } catch (error) { source = null; }
    }
    if (!Array.isArray(source)) source = fallback || [];
    const cleaned = source.map((item, index) => {
        if (!item || typeof item !== 'object') return null;
        const type = item.type === 'speak' ? 'speak' : 'action';
        let content = String(item.content || '').replace(/\r/g, '').trim();
        if (type === 'speak') {
            content = content.replace(/^["“”]+|["“”]+$/g, '').trim();
            content = `“${content || '我在听。'}”`;
        }
        if (!content) content = type === 'action' ? '他停顿了一下，把目光放回你身上。' : '“嗯。”';
        return { type, content: content.slice(0, type === 'action' ? 90 : 90) };
    }).filter(Boolean);
    const targetPattern = ['action', 'speak', 'action', 'speak', 'action', 'speak', 'action'];
    const result = [];
    for (let i = 0; i < targetPattern.length; i += 1) {
        const expected = targetPattern[i];
        const found = cleaned.find((item, idx) => item.type === expected && !result.includes(item));
        result.push(found || (expected === 'action'
            ? { type: 'action', content: i === 0 ? '他在约定好的地方等你，视线越过人群，终于落到你身上。' : '空气安静了一点，像是在给你留下接话的位置。' }
            : { type: 'speak', content: i === 1 ? '“你来了。”' : '“先别急，慢慢说。”' }
        ));
    }
    return result;
}

function buildPrivateOfflineFallbackPayload(contact = {}, session = {}, userText = '') {
    const name = getPrivateContactDisplayName(contact) || 'TA';
    const placeName = session?.place?.name || '约好的地方';
    const text = String(userText || '').trim();
    if (/(拒绝|不想|算了|别|不要|离我远|烦)/.test(text)) {
        return [
            { type: 'action', content: `${name}没有立刻靠近，只把脚步停在让你舒服的距离外。` },
            { type: 'speak', content: '“我听见了，不会逼你。”' },
            { type: 'action', content: `周围的声音从${placeName}另一侧慢慢退开，他垂下眼，指尖松开又收回。` },
            { type: 'speak', content: '“但我还是想把话说清楚。”' },
            { type: 'action', content: '他把语速放慢，像是在认真确认你的边界。' },
            { type: 'speak', content: '“你可以不回答，我等你点头再继续。”' },
            { type: 'action', content: '你们之间留下了一小段安静的距离，刚好够情绪先落地。' }
        ];
    }
    if (/(难过|累|哭|害怕|失眠|陪|抱)/.test(text)) {
        return [
            { type: 'action', content: `${name}往你这边侧过身，目光没有催促，只安静地确认你的表情。` },
            { type: 'speak', content: '“先到我旁边来一点。”' },
            { type: 'action', content: `灯光从${placeName}的边缘落下来，他把声音压得比聊天里更低。` },
            { type: 'speak', content: '“今天不用撑得那么好。”' },
            { type: 'action', content: '他伸手停在半空，没有擅自碰你，只等你自己决定要不要靠近。' },
            { type: 'speak', content: '“我在这儿，真的。”' },
            { type: 'action', content: '空气里有一点暖意，像有人终于替你把喧闹挡在外面。' }
        ];
    }
    return [
        { type: 'action', content: `${name}站在${placeName}靠里一点的位置，看到你时，肩线明显松了一下。` },
        { type: 'speak', content: '“你真的来了。”' },
        { type: 'action', content: '他把视线从你身后的人群收回来，语气比屏幕里更近，也更慢。' },
        { type: 'speak', content: '“我还以为你会临时反悔。”' },
        { type: 'action', content: '他把提前准备好的位置让出来，没有催你坐下。' },
        { type: 'speak', content: '“先待一会儿吧，别急着解释。”' },
        { type: 'action', content: '你们之间隔着一小段刚好的距离，像是可以重新开始说话。' }
    ];
}

async function buildPrivateOfflinePromptMessages(contact = {}, session = {}, history = [], userText = '') {
    const safeContactId = normalizePrivateContactRecordId(contact?.id || session?.charId || '', '');
    const longMemoryState = await getCharacterLongMemoryState(safeContactId, contact);
    const advancedSettings = await getCharacterAdvancedSettings(safeContactId);
    const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
    const recentChat = pickPrivateContactChatContextMessagesByRounds(thread.messages, 8).map(message => `${message.role === 'user' ? 'user' : getPrivateContactDisplayName(contact)}：${getPrivateContactChatPlainText(message)}`).join('\n');
    const meetingHistory = history.slice(-8).map(item => {
        if (item.role === 'user') return `user：${String(item.content || '').trim() || (Array.isArray(item.payload) ? item.payload.map(part => part?.content || '').join(' ') : '')}`;
        const payload = normalizePrivateOfflinePayloadArray(item.payload, []);
        return `${getPrivateContactDisplayName(contact)}：${payload.map(part => `${part.type}:${part.content}`).join(' / ')}`;
    }).join('\n');
    const memoryText = [
        ...(longMemoryState.entries || []).slice(0, 8).map(item => `记忆：${item.text}`),
        ...(longMemoryState.promises || []).slice(0, 6).map(item => `约定：${item.text}`),
        ...(longMemoryState.coreMemories || []).slice(0, 5).map(item => `核心变化：${item.text}`),
        ...(longMemoryState.recallHints || []).slice(0, 6).map(item => `召回提示：${item}`)
    ].join('\n');
    const advancedText = [
        advancedSettings.dailyState ? `日常动态：${advancedSettings.dailyState}` : '',
        advancedSettings.replyHabit ? `回复习惯：${advancedSettings.replyHabit}` : '',
        advancedSettings.preReplyCheckPrompt ? `回复前检查：${advancedSettings.preReplyCheckPrompt}` : ''
    ].filter(Boolean).join('\n');
    return [{
        role: 'system',
        content: [
            '当前是线下见面模式，不是普通聊天。',
            '你必须严格返回 JSON 数组，且只能返回 JSON 数组，不能 markdown，不能解释，不能代码块。',
            '数组必须是 action / speak 交替结构，固定为 7 项：action, speak, action, speak, action, speak, action。',
            'action 是动作、神态、环境、距离、氛围、停顿，不是长篇旁白，每条 12～45 字。',
            'speak 是 Char 说的话，必须带中文弯引号：“”，每条 6～60 字。',
            '不能替 user 说话，不能擅自决定 user 的动作、心理、台词。可以描述 Char 观察 user，但不能替 user 做决定。',
            '不能所有角色都一个语气，必须符合 char 人设、当前关系、记忆与地点时间。',
            '必须给 user 留出回应空间，不要固定段落，不要写小说标题。',
            '',
            `Char：${getPrivateContactDisplayName(contact)}`,
            `Char 设定：${contact.note || contact.setting || contact.signature || '未填写，按联系人现有气质保持。'}`,
            `User：${getPrivateDisplayName()}`,
            `User 设定：${privateState.userPresetSetting || privateState.preferenceNote || '未填写。'}`,
            `地点：${session?.place?.name || ''} · ${session?.place?.address || ''} · ${session?.place?.atmosphere || ''}`,
            `时间：${session?.timeText || ''}`,
            '',
            '[长期记忆 / 约定 / 核心变化]',
            memoryText || '暂无可召回长期记忆。',
            '',
            '[高级拟真 / 回复习惯]',
            advancedText || '保持角色原设定。',
            '',
            '[最近线上聊天]',
            recentChat || '暂无最近线上聊天。',
            '',
            '[本次线下见面历史]',
            meetingHistory || '刚进入见面。',
            '',
            `user 当前输入：${userText || '刚到场，还没有说话。'}`
        ].join('\n')
    }];
}

async function generatePrivateOfflineAssistantPayload(contact = {}, session = {}, history = [], userText = '') {
    const fallback = buildPrivateOfflineFallbackPayload(contact, session, userText);
    try {
        const chat = await loadPrivateContactApiSettings();
        const endpoint = String(chat?.endpoint || '').trim();
        const model = String(chat?.model || '').trim();
        if (!endpoint || !model) return fallback;
        const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
        const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.82,
                messages: await buildPrivateOfflinePromptMessages(contact, session, history, userText)
            })
        });
        if (!response.ok) throw new Error(`offline api ${response.status}`);
        const payload = await response.json();
        const rawText = extractPrivateContactGeneratedText(payload);
        return normalizePrivateOfflinePayloadArray(rawText, fallback);
    } catch (error) {
        console.warn('线下见面回复生成失败，已使用本地兜底:', error);
        return fallback;
    }
}

async function putPrivateOfflineMessage(record = {}) {
    const table = getPrivateOfflineDbTable('offlineMessages');
    const safeRole = record.role === 'user' ? 'user' : 'assistant';
    const safeContent = String(record.content || '').trim();
    const userPayload = Array.isArray(record.payload) && record.payload.length
        ? record.payload.map(item => ({ type: item?.type === 'action' ? 'action' : 'speak', content: String(item?.content || '').trim() })).filter(item => item.content)
        : (safeContent ? [{ type: 'speak', content: `“${safeContent.replace(/^[“”"]+|[“”"]+$/g, '')}”` }] : []);
    const normalized = {
        id: String(record.id || createPrivateOfflineId('offline-message')).trim(),
        sessionId: String(record.sessionId || '').trim(),
        charId: normalizePrivateContactRecordId(record.charId || '', ''),
        role: safeRole,
        payload: safeRole === 'user' ? userPayload : normalizePrivateOfflinePayloadArray(record.payload, []),
        content: safeContent,
        createdAt: Math.max(0, Number(record.createdAt) || Date.now())
    };
    if (table?.put) await table.put(normalized);
    return normalized;
}

async function listPrivateOfflineSessionMessages(sessionId = '') {
    const safeSessionId = String(sessionId || '').trim();
    const table = getPrivateOfflineDbTable('offlineMessages');
    if (!safeSessionId || !table?.where) return [];
    try {
        const list = await table.where('sessionId').equals(safeSessionId).toArray();
        return list.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
    } catch (error) {
        return [];
    }
}

async function savePrivateOfflineSession(session = {}) {
    const normalized = {
        sessionId: String(session.sessionId || createPrivateOfflineId('offline-session')).trim(),
        inviteId: String(session.inviteId || '').trim(),
        charId: normalizePrivateContactRecordId(session.charId || '', ''),
        source: String(session.source || 'user_app').trim() || 'user_app',
        startedAt: Math.max(0, Number(session.startedAt) || Date.now()),
        endedAt: Math.max(0, Number(session.endedAt) || 0),
        place: session.place && typeof session.place === 'object' ? session.place : {},
        timeText: String(session.timeText || '').trim(),
        summary: String(session.summary || '').trim(),
        memoryWritten: Boolean(session.memoryWritten),
        relationDelta: String(session.relationDelta || '').trim(),
        moodDelta: String(session.moodDelta || '').trim(),
        updatedAt: Math.max(0, Number(session.updatedAt) || Date.now())
    };
    const table = getPrivateOfflineDbTable('offlineSessions');
    if (table?.put) await table.put(normalized);
    return normalized;
}


async function updatePrivateOfflineInviteMessageStatusById(inviteId = '', charId = '', status = 'accepted') {
    const safeInviteId = String(inviteId || '').trim();
    const safeContactId = normalizePrivateContactRecordId(charId || '', '');
    const safeStatus = normalizePrivateOfflineStatus(status);
    if (!safeInviteId || !safeContactId) return false;
    let changed = false;
    updatePrivateContactChatThread(safeContactId, thread => ({
        ...thread,
        updatedAt: Date.now(),
        messages: thread.messages.map(message => {
            const invite = message?.offlineInvite || null;
            if (!invite || String(invite.inviteId || '').trim() !== safeInviteId) return message;
            changed = true;
            const normalized = normalizePrivateOfflineInvite(invite, getPrivateContactById(safeContactId) || {});
            const updatedInvite = { ...normalized, status: safeStatus, updatedAt: Date.now() };
            return { ...message, content: updatedInvite.reason, offlineInvite: updatedInvite };
        })
    }));
    if (changed) {
        renderPrivateThreads();
        if (isPrivateContactChatPageVisible(safeContactId)) renderPrivateContactChatPage(safeContactId, { scrollToBottom: false });
        await savePrivateState();
    }
    return changed;
}

window.rinnoOfflineStartSession = async function(payload = {}) {
    await Promise.resolve(privateStateReady);
    const invite = payload?.inviteId ? await getPrivateOfflineInviteById(payload.inviteId) : null;
    const safeContactId = normalizePrivateContactRecordId(payload?.charId || invite?.charId || '', '');
    const contact = safeContactId ? getPrivateHydratedContact(getPrivateContactById(safeContactId) || {}) : null;
    if (!contact?.id) return { ok: false, message: '未找到联系人。' };
    const manualContext = createPrivateOfflineManualContext(contact);
    const session = await savePrivateOfflineSession({
        sessionId: createPrivateOfflineId('offline-session'),
        inviteId: invite?.inviteId || '',
        charId: contact.id,
        source: invite ? 'chat_auto' : 'user_app',
        startedAt: Date.now(),
        place: invite?.place || manualContext.place,
        timeText: invite?.time?.text || manualContext.timeText,
        updatedAt: Date.now()
    });
    if (invite?.inviteId) {
        try {
            const table = getPrivateOfflineDbTable('offlineInvites');
            if (table?.update) await table.update(invite.inviteId, { status: 'accepted', updatedAt: Date.now(), payload: { ...invite, status: 'accepted', updatedAt: Date.now() } });
            await updatePrivateOfflineInviteMessageStatusById(invite.inviteId, contact.id, 'accepted');
        } catch (error) {}
    }
    const opening = await putPrivateOfflineMessage({
        sessionId: session.sessionId,
        charId: contact.id,
        role: 'assistant',
        payload: buildPrivateOfflineFallbackPayload(contact, session, ''),
        createdAt: Date.now()
    });
    return { ok: true, session, contact: buildPrivateOfflineContactSnapshot(contact), messages: [opening] };
};

window.rinnoOfflineSendUserTurn = async function(payload = {}) {
    await Promise.resolve(privateStateReady);
    const sessionId = String(payload?.sessionId || '').trim();
    const sessionTable = getPrivateOfflineDbTable('offlineSessions');
    const session = sessionId && sessionTable?.get ? await sessionTable.get(sessionId) : null;
    if (!session) return { ok: false, message: '见面会话不存在。' };
    const contact = getPrivateHydratedContact(getPrivateContactById(session.charId) || {});
    if (!contact?.id) return { ok: false, message: '联系人不存在。' };
    const userText = String(payload?.content || '').trim();
    if (userText) {
        await putPrivateOfflineMessage({
            sessionId,
            charId: contact.id,
            role: 'user',
            content: userText,
            payload: [{ type: 'speak', content: `“${userText.replace(/^[“”"]+|[“”"]+$/g, '')}”` }],
            createdAt: Date.now()
        });
    }
    const history = await listPrivateOfflineSessionMessages(sessionId);
    const replyPayload = await generatePrivateOfflineAssistantPayload(contact, session, history, userText);
    const assistant = await putPrivateOfflineMessage({
        sessionId,
        charId: contact.id,
        role: 'assistant',
        payload: replyPayload,
        createdAt: Date.now() + 1
    });
    return { ok: true, message: assistant, messages: await listPrivateOfflineSessionMessages(sessionId) };
};

function summarizePrivateOfflineMessagesForMemory(messages = [], contactName = 'TA') {
    const lines = messages.map(item => {
        if (item.role === 'user') {
            const text = String(item.content || '').trim() || (Array.isArray(item.payload) ? item.payload.map(part => part?.content || '').join(' ') : '');
            return `用户：${text}`;
        }
        const payload = normalizePrivateOfflinePayloadArray(item.payload, []);
        const text = payload.map(part => part.content).join(' ');
        return `${contactName}：${text}`;
    }).join(' ');
    const compact = trimPrivateContactChatSnippet(lines.replace(/[\n\r]+/g, ' '), 150);
    return compact || '这次线下见面安静结束，双方留下了新的相处记忆。';
}

async function appendPrivateOfflineSessionRecordToChat(session = {}, contact = {}) {
    const safeContactId = normalizePrivateContactRecordId(session?.charId || contact?.id || '', '');
    if (!safeContactId) return false;
    const record = normalizePrivateOfflineSessionRecord({ ...session, charName: getPrivateContactDisplayName(contact) }, contact);
    const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
    if (thread.messages.some(message => message.type === 'offline_session_record' && message.offlineSession?.sessionId === record.sessionId)) return false;
    const message = normalizePrivateContactChatMessages([{
        id: createPrivateContactChatMessageId('offline-session'),
        role: 'assistant',
        type: 'offline_session_record',
        content: record.summary,
        offlineSession: record,
        charId: safeContactId,
        createdAt: Date.now()
    }])[0];
    if (!message) return false;
    const isVisibleChat = isPrivateContactChatPageVisible(safeContactId);
    updatePrivateContactChatThread(safeContactId, current => ({
        ...current,
        unread: isVisibleChat ? 0 : Math.max(1, Number(current.unread || 0) + 1),
        updatedAt: Date.now(),
        messages: [...current.messages, message]
    }));
    renderPrivateThreads();
    if (isVisibleChat) renderPrivateContactChatPage(safeContactId, { scrollToBottom: true });
    await savePrivateState();
    return true;
}

async function writePrivateOfflineSessionMemory(session = {}, messages = [], contact = {}) {
    const safeContactId = normalizePrivateContactRecordId(session?.charId || contact?.id || '', '');
    if (!safeContactId) return false;
    const now = Date.now();
    const dateKey = getPrivateContactLocalDateKey(now, resolvePrivateContactTimezone(contact || {}));
    const summary = String(session.summary || '').trim() || summarizePrivateOfflineMessagesForMemory(messages, getPrivateContactDisplayName(contact));
    const placeName = session.place?.name || '线下';
    try {
        await saveCharacterLongMemoryState(safeContactId, {
            entries: [{
                id: createPrivateOfflineId('offline-memory'),
                text: `线下见面：${session.timeText || formatPrivateContactArchiveTime(session.endedAt)}在${placeName}，${summary}`,
                source: 'offline_session',
                core: true,
                createdAt: now,
                updatedAt: now,
                axis: { when: session.timeText || '', where: placeName, who: getPrivateContactDisplayName(contact), feel: session.moodDelta || '线下互动后关系有新节点', what: summary }
            }],
            dailySummaries: [{
                id: `offline-${dateKey}`,
                date: dateKey,
                summary: `线下见面：${summary}`,
                keyPoints: [placeName, session.relationDelta || '关系有新节点'].filter(Boolean),
                unresolved: [],
                updatedAt: now
            }],
            coreMemories: [{
                id: createPrivateOfflineId('offline-core'),
                type: 'offline',
                change: session.relationDelta || '线下见面结束',
                text: summary,
                createdAt: now,
                updatedAt: now
            }],
            recallHints: [`下次线上聊天可以自然提起 ${session.timeText || '这次'} 在 ${placeName} 的见面。`],
            coreUpdatedAt: now,
            updatedAt: now,
            lastActiveDate: dateKey
        }, { seedContact: contact });
        return true;
    } catch (error) {
        console.warn('写入线下见面记忆失败:', error);
        return false;
    }
}

window.rinnoOfflineEndSession = async function(payload = {}) {
    await Promise.resolve(privateStateReady);
    const sessionId = String(payload?.sessionId || '').trim();
    const sessionTable = getPrivateOfflineDbTable('offlineSessions');
    const existing = sessionId && sessionTable?.get ? await sessionTable.get(sessionId) : null;
    if (!existing) return { ok: false, message: '见面会话不存在。' };
    const contact = getPrivateHydratedContact(getPrivateContactById(existing.charId) || {});
    const messages = await listPrivateOfflineSessionMessages(sessionId);
    const summary = String(payload?.summary || '').trim() || summarizePrivateOfflineMessagesForMemory(messages, getPrivateContactDisplayName(contact));
    const session = await savePrivateOfflineSession({
        ...existing,
        endedAt: Date.now(),
        summary,
        relationDelta: payload?.relationDelta || '线下见面让关系多了一个可召回节点',
        moodDelta: payload?.moodDelta || '情绪被认真安放',
        memoryWritten: true,
        updatedAt: Date.now()
    });
    await writePrivateOfflineSessionMemory(session, messages, contact);
    await appendPrivateOfflineSessionRecordToChat(session, contact);
    return { ok: true, session, summary };
};

window.rinnoOfflineHandleSessionEnded = payload => window.rinnoOfflineEndSession(payload || {});

bindPrivateMomentTools();
privateStateReady = loadPrivateState();

/* ========================================================================== 
   Rinno Private Video Call Extension
   - 增量启用私叙视频通话 / char 主动拨打
   - 延续现有接听 / 拒绝圆形按钮结构，不搬运其余业务
   ========================================================================== */
(function initRinnoPrivateVideoCallExtension() {
    if (window.__rinnoPrivateVideoCallExtensionReady) return;
    window.__rinnoPrivateVideoCallExtensionReady = true;

    try {
        if (typeof PRIVATE_CONTACT_CHAT_MESSAGE_TYPES !== 'undefined') {
            PRIVATE_CONTACT_CHAT_MESSAGE_TYPES.add('video_call_invite');
            PRIVATE_CONTACT_CHAT_MESSAGE_TYPES.add('video_call_summary');
        }
        if (typeof PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES !== 'undefined') {
            PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES.add('video_call_invite');
            PRIVATE_CONTACT_CHAT_VISIBLE_REPLY_TYPES.add('video_call_summary');
        }
    } catch (error) {
        console.warn('Rinno video call message type registration failed:', error);
    }

    const RINNO_VIDEO_CALL_INVITE_TYPES = new Set([
        'call_invite', 'video_call', 'videocall', 'video_call_invite', 'video_invite', 'callinvite'
    ]);
    const RINNO_VIDEO_CALL_SUMMARY_TYPES = new Set([
        'video_call_summary', 'call_summary', 'video_summary'
    ]);

    function rinnoVideoSafeText(value = '', fallback = '') {
        const text = String(value ?? '').replace(/\r/g, '').trim();
        return text || fallback;
    }

    function rinnoVideoContactName(contact = {}) {
        try {
            return getPrivateContactDisplayName(contact) || contact?.title || contact?.name || 'TA';
        } catch (error) {
            return contact?.title || contact?.name || 'TA';
        }
    }

    function rinnoVideoUserName() {
        try {
            return getPrivateDisplayName() || '你';
        } catch (error) {
            return '你';
        }
    }

    function rinnoVideoNormalizeContactId(contactId = '') {
        try {
            return normalizePrivateContactRecordId(contactId || '', '');
        } catch (error) {
            return String(contactId || '').trim();
        }
    }

    function rinnoVideoGetContact(contactId = '') {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || privateActiveContactChatId || '');
        const raw = safeContactId ? getPrivateContactById(safeContactId) : null;
        return raw ? getPrivateHydratedContact(raw) : null;
    }

    function rinnoVideoAvatarMarkup(contact = {}, className = '') {
        const image = String(contact?.avatar || contact?.profileAvatar || contact?.homepageAvatar || '').trim();
        const title = rinnoVideoContactName(contact).slice(0, 1) || 'R';
        if (!image) return `<span class="${escapePrivateHtml(className)} is-text">${escapePrivateHtml(title)}</span>`;
        return `<span class="${escapePrivateHtml(className)}" style="background-image:url('${escapePrivateHtml(image).replace(/'/g, '&#39;')}')"></span>`;
    }

    function rinnoVideoGetRecentLines(contactId = '', limit = 16) {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || '');
        const contact = rinnoVideoGetContact(safeContactId) || {};
        const charName = rinnoVideoContactName(contact);
        const userName = rinnoVideoUserName();
        const thread = getPrivateContactChatThread(safeContactId) || { messages: [] };
        return normalizePrivateContactChatMessages(thread.messages)
            .filter(message => ['user', 'assistant', 'system'].includes(String(message?.role || '')))
            .slice(-Math.max(1, limit))
            .map(message => {
                const role = message.role === 'user' ? userName : (message.role === 'assistant' ? charName : '系统');
                const text = trimPrivateContactChatSnippet(getPrivateContactChatPlainText(message), 180);
                return text ? `${role}：${text}` : '';
            })
            .filter(Boolean)
            .join('\n');
    }

    function rinnoVideoExtractJson(text = '') {
        const raw = String(text || '').trim();
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (error) {}
        const fenced = raw.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
        try { return JSON.parse(fenced); } catch (error) {}
        const arrayStart = raw.indexOf('[');
        const arrayEnd = raw.lastIndexOf(']');
        if (arrayStart >= 0 && arrayEnd > arrayStart) {
            try { return JSON.parse(raw.slice(arrayStart, arrayEnd + 1)); } catch (error) {}
        }
        const objectStart = raw.indexOf('{');
        const objectEnd = raw.lastIndexOf('}');
        if (objectStart >= 0 && objectEnd > objectStart) {
            try { return JSON.parse(raw.slice(objectStart, objectEnd + 1)); } catch (error) {}
        }
        return null;
    }

    async function rinnoVideoCallApi(messages = [], systemPrompt = '') {
        const chat = await loadPrivateContactApiSettings();
        const endpoint = String(chat?.endpoint || '').trim();
        const model = String(chat?.model || '').trim();
        if (!endpoint || !model) throw new Error('请先配置 API 聊天接口。');
        const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;
        const bodyMessages = systemPrompt
            ? [{ role: 'system', content: systemPrompt }, ...messages]
            : messages;
        const response = await fetch(buildPrivateContactChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.78,
                messages: bodyMessages
            })
        });
        if (!response.ok) throw new Error(`API 视频通话失败：${response.status}`);
        const payload = await response.json();
        return extractPrivateContactGeneratedText(payload);
    }

    async function rinnoVideoAppendSystem(contactId = '', content = '') {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || '');
        const safeContent = rinnoVideoSafeText(content);
        if (!safeContactId || !safeContent) return false;
        updatePrivateContactChatThread(safeContactId, thread => ({
            ...thread,
            updatedAt: Date.now(),
            messages: [
                ...thread.messages,
                {
                    id: createPrivateContactChatMessageId('video-system'),
                    role: 'system',
                    type: 'system',
                    content: typeof createPrivateContactSystemCapsuleText === 'function'
                        ? createPrivateContactSystemCapsuleText(safeContent)
                        : safeContent,
                    createdAt: Date.now()
                }
            ]
        }));
        renderPrivateThreads();
        if (isPrivateContactChatPageVisible(safeContactId)) renderPrivateContactChatPage(safeContactId, { scrollToBottom: true });
        await savePrivateState();
        return true;
    }

    async function rinnoVideoAppendInvite(contactId = '', source = 'assistant', status = 'ringing') {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || '');
        const contact = rinnoVideoGetContact(safeContactId);
        if (!safeContactId || !contact) return null;
        const inviteId = createPrivateContactChatMessageId('video-invite');
        const invite = {
            inviteId,
            contactId: safeContactId,
            source: source === 'user' ? 'user' : 'assistant',
            status: status || 'ringing',
            title: source === 'user' ? '你发起了视频通话' : `${rinnoVideoContactName(contact)} 邀请你视频通话`,
            note: source === 'user' ? '等待对方回应' : '轻触接听，让画面亮起来。',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const message = {
            id: inviteId,
            role: source === 'user' ? 'user' : 'assistant',
            type: 'video_call_invite',
            content: invite.title,
            videoCallInvite: invite,
            createdAt: Date.now()
        };
        const isVisible = isPrivateContactChatPageVisible(safeContactId);
        updatePrivateContactChatThread(safeContactId, thread => ({
            ...thread,
            unread: source === 'assistant' && !isVisible ? Math.max(1, Number(thread.unread || 0) + 1) : 0,
            updatedAt: Date.now(),
            messages: [...thread.messages, message]
        }));
        renderPrivateThreads();
        if (isVisible) renderPrivateContactChatPage(safeContactId, { scrollToBottom: true });
        await savePrivateState();
        return message;
    }

    async function rinnoVideoUpdateInviteStatus(contactId = '', inviteId = '', status = 'ended', patch = {}) {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || '');
        const safeInviteId = String(inviteId || '').trim();
        if (!safeContactId || !safeInviteId) return false;
        let changed = false;
        updatePrivateContactChatThread(safeContactId, thread => ({
            ...thread,
            updatedAt: Date.now(),
            messages: thread.messages.map(message => {
                const invite = message?.videoCallInvite || null;
                if (!invite || String(invite.inviteId || message.id || '') !== safeInviteId) return message;
                changed = true;
                const nextInvite = { ...invite, ...patch, status, updatedAt: Date.now() };
                return { ...message, content: nextInvite.title || message.content, videoCallInvite: nextInvite };
            })
        }));
        if (changed) {
            renderPrivateThreads();
            if (isPrivateContactChatPageVisible(safeContactId)) renderPrivateContactChatPage(safeContactId, { scrollToBottom: false });
            await savePrivateState();
        }
        return changed;
    }

    function rinnoVideoSummaryText(summary = {}) {
        const duration = rinnoVideoSafeText(summary.duration, '00:00');
        const count = Array.isArray(summary.transcript) ? summary.transcript.length : 0;
        const first = Array.isArray(summary.transcript)
            ? summary.transcript.map(item => item?.content || '').filter(Boolean).slice(-2).join(' / ')
            : '';
        return `[视频通话] ${duration}${first ? ` · ${trimPrivateContactChatSnippet(first, 60)}` : count ? ` · ${count} 条通话片段` : ''}`;
    }

    async function rinnoVideoAppendSummary(contactId = '', summary = {}) {
        const safeContactId = rinnoVideoNormalizeContactId(contactId || '');
        if (!safeContactId) return false;
        const message = {
            id: createPrivateContactChatMessageId('video-summary'),
            role: 'assistant',
            type: 'video_call_summary',
            content: rinnoVideoSummaryText(summary),
            videoCallSummary: {
                duration: rinnoVideoSafeText(summary.duration, '00:00'),
                transcript: Array.isArray(summary.transcript) ? summary.transcript.slice(0, 80) : [],
                endedAt: Date.now()
            },
            createdAt: Date.now()
        };
        updatePrivateContactChatThread(safeContactId, thread => ({
            ...thread,
            updatedAt: Date.now(),
            messages: [...thread.messages, message]
        }));
        renderPrivateThreads();
        if (isPrivateContactChatPageVisible(safeContactId)) renderPrivateContactChatPage(safeContactId, { scrollToBottom: true });
        await savePrivateState();
        try { void maybeTriggerPrivateContactAutoSummary(safeContactId); } catch (error) {}
        return true;
    }

    function renderRinnoPrivateVideoCallInviteMarkup(message = {}) {
        const contact = rinnoVideoGetContact(message?.videoCallInvite?.contactId || privateActiveContactChatId) || {};
        const invite = message.videoCallInvite || {};
        const status = String(invite.status || 'ringing');
        const statusText = ({ ringing: '等待接听', accepted: '已接通', declined: '已拒绝', missed: '未接通', ended: '已结束', cancelled: '已取消' })[status] || '视频通话';
        const isAssistantInvite = String(invite.source || '') !== 'user';
        const canJoin = isAssistantInvite && status === 'ringing';
        return `
            <article class="private-video-call-card is-${escapePrivateHtml(status)}" data-rinno-video-call-card>
                <div class="private-video-call-card-media">
                    ${rinnoVideoAvatarMarkup(contact, 'private-video-call-card-avatar')}
                    <span class="private-video-call-card-radar" aria-hidden="true"></span>
                    <span class="private-video-call-card-radar delay" aria-hidden="true"></span>
                </div>
                <div class="private-video-call-card-copy">
                    <span>RINNO VIDEO</span>
                    <strong>${escapePrivateHtml(invite.title || (isAssistantInvite ? `${rinnoVideoContactName(contact)} 邀请你视频通话` : '你发起了视频通话'))}</strong>
                    <p>${escapePrivateHtml(invite.note || statusText)}</p>
                </div>
                <div class="private-video-call-card-foot">
                    <em>${escapePrivateHtml(statusText)}</em>
                    ${canJoin ? `<button class="interactive private-video-call-card-join" type="button" data-rinno-video-call-action="accept-card" data-rinno-video-call-contact-id="${escapePrivateHtml(invite.contactId || privateActiveContactChatId || '')}" data-rinno-video-call-invite-id="${escapePrivateHtml(invite.inviteId || message.id || '')}">接听</button>` : ''}
                </div>
            </article>
        `;
    }

    function renderRinnoPrivateVideoCallSummaryMarkup(message = {}) {
        const summary = message.videoCallSummary || {};
        const rows = Array.isArray(summary.transcript) ? summary.transcript.slice(-4) : [];
        return `
            <article class="private-video-call-summary-card">
                <div class="private-video-call-summary-head">
                    <span>VIDEO LOG</span>
                    <strong>视频通话记录</strong>
                    <em>${escapePrivateHtml(summary.duration || '00:00')}</em>
                </div>
                <div class="private-video-call-summary-lines">
                    ${rows.length ? rows.map(item => `<p><b>${escapePrivateHtml(item?.speaker || '')}</b>${escapePrivateHtml(trimPrivateContactChatSnippet(item?.content || '', 80))}</p>`).join('') : '<p><b>Rinno</b>这次视频通话安静结束。</p>'}
                </div>
            </article>
        `;
    }

    const __rinnoVideoNormalizeMessageType = normalizePrivateContactChatMessageType;
    normalizePrivateContactChatMessageType = function(message = {}) {
        const rawType = String(message?.type || message?.kind || message?.messageType || '').trim().toLowerCase();
        if (RINNO_VIDEO_CALL_INVITE_TYPES.has(rawType) || message?.videoCallInvite) return 'video_call_invite';
        if (RINNO_VIDEO_CALL_SUMMARY_TYPES.has(rawType) || message?.videoCallSummary) return 'video_call_summary';
        return __rinnoVideoNormalizeMessageType(message);
    };

    const __rinnoVideoNormalizeMessages = normalizePrivateContactChatMessages;
    normalizePrivateContactChatMessages = function(value) {
        if (!Array.isArray(value)) return [];
        return value.map((item) => {
            if (!item || typeof item !== 'object') {
                return __rinnoVideoNormalizeMessages([item])[0] || null;
            }
            const rawType = String(item.type || item.kind || item.messageType || '').trim().toLowerCase();
            const hasInvite = RINNO_VIDEO_CALL_INVITE_TYPES.has(rawType) || item.videoCallInvite;
            const hasSummary = RINNO_VIDEO_CALL_SUMMARY_TYPES.has(rawType) || item.videoCallSummary;

            if (hasInvite) {
                const invite = rinnoVideoNormalizeInvite(item.videoCallInvite || item.call || {
                    inviteId: item.id,
                    status: item.status,
                    source: item.role === 'user' ? 'user' : 'assistant',
                    title: item.content
                });
                return {
                    id: item.id || invite.inviteId || createPrivateContactChatMessageId('video-invite'),
                    role: item.role === 'user' ? 'user' : 'assistant',
                    type: 'video_call_invite',
                    content: String(item.content || invite.title || '视频通话').trim() || '视频通话',
                    imageUrl: '',
                    audioUrl: '',
                    voiceText: '',
                    stickerUrl: '',
                    recalled: Boolean(item.recalled),
                    createdAt: Number(item.createdAt || item.time || Date.now()) || Date.now(),
                    meta: item.meta && typeof item.meta === 'object' ? item.meta : {},
                    videoCallInvite: invite
                };
            }

            if (hasSummary) {
                const rawSummary = item.videoCallSummary && typeof item.videoCallSummary === 'object' ? item.videoCallSummary : {};
                const summary = {
                    duration: String(rawSummary.duration || item.duration || '00:00'),
                    mood: String(rawSummary.mood || item.mood || '温柔'),
                    endedBy: rawSummary.endedBy || item.endedBy || '',
                    transcript: Array.isArray(rawSummary.transcript) ? rawSummary.transcript : []
                };
                return {
                    id: item.id || createPrivateContactChatMessageId('video-summary'),
                    role: 'assistant',
                    type: 'video_call_summary',
                    content: String(item.content || rinnoVideoSummaryText(summary) || '视频通话已结束').trim() || '视频通话已结束',
                    imageUrl: '',
                    audioUrl: '',
                    voiceText: '',
                    stickerUrl: '',
                    recalled: Boolean(item.recalled),
                    createdAt: Number(item.createdAt || item.time || Date.now()) || Date.now(),
                    meta: item.meta && typeof item.meta === 'object' ? item.meta : {},
                    videoCallSummary: summary
                };
            }

            return __rinnoVideoNormalizeMessages([item])[0] || null;
        }).filter(Boolean);
    };

    const __rinnoVideoNormalizePlanInstruction = normalizePrivateContactChatPlanInstruction;
    normalizePrivateContactChatPlanInstruction = function(item = {}) {
        const rawType = String(item?.type || '').trim().toLowerCase();
        if (RINNO_VIDEO_CALL_INVITE_TYPES.has(rawType)) {
            const content = rinnoVideoSafeText(item.message || item.note || item.content, '想和你视频一下。');
            return {
                type: 'video_call_invite',
                content,
                note: content,
                translation: normalizePrivateContactChatTranslationText(item.translation || item.translation_zh || '')
            };
        }
        return __rinnoVideoNormalizePlanInstruction(item);
    };

    const __rinnoVideoMessageSummary = getPrivateContactChatMessageSummary;
    getPrivateContactChatMessageSummary = function(message = {}, maxLength = 72) {
        const type = getPrivateContactChatMessageType(message);
        if (type === 'video_call_invite') {
            const invite = message.videoCallInvite || {};
            const status = ({ ringing: '等待接听', accepted: '已接通', declined: '已拒绝', missed: '未接通', ended: '已结束', cancelled: '已取消' })[String(invite.status || 'ringing')] || '视频通话';
            return `[视频通话] ${status}`;
        }
        if (type === 'video_call_summary') return rinnoVideoSummaryText(message.videoCallSummary || {});
        return __rinnoVideoMessageSummary(message, maxLength);
    };

    const __rinnoVideoPlainText = getPrivateContactChatPlainText;
    getPrivateContactChatPlainText = function(message = {}) {
        const type = getPrivateContactChatMessageType(message);
        if (type === 'video_call_invite') {
            const invite = message.videoCallInvite || {};
            return `[视频通话邀请] ${invite.title || message.content || ''} ${invite.note || ''}`.trim();
        }
        if (type === 'video_call_summary') return rinnoVideoSummaryText(message.videoCallSummary || {});
        return __rinnoVideoPlainText(message);
    };

    const __rinnoVideoShellFree = isPrivateContactChatBubbleShellFreeType;
    isPrivateContactChatBubbleShellFreeType = function(type = '') {
        const safeType = String(type || '').trim();
        if (safeType === 'video_call_invite' || safeType === 'video_call_summary') return true;
        return __rinnoVideoShellFree(type);
    };

    const __rinnoVideoRenderContent = renderPrivateContactChatMessageContentMarkup;
    renderPrivateContactChatMessageContentMarkup = function(message = {}) {
        const type = getPrivateContactChatMessageType(message);
        if (type === 'video_call_invite') return renderRinnoPrivateVideoCallInviteMarkup(message);
        if (type === 'video_call_summary') return renderRinnoPrivateVideoCallSummaryMarkup(message);
        return __rinnoVideoRenderContent(message);
    };

    const __rinnoVideoMoreActions = buildPrivateContactChatMoreActions;
    buildPrivateContactChatMoreActions = function() {
        const list = __rinnoVideoMoreActions();
        if (!list.some(item => item && item.key === 'video_call')) {
            list.unshift({
                key: 'video_call',
                label: '视频',
                icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="11" height="10" rx="2"></rect><path d="M15 10.4 20 8v8l-5-2.4z"></path></svg>'
            });
        }
        return list;
    };

    const __rinnoVideoMoreActionHandler = handlePrivateContactChatMoreAction;
    handlePrivateContactChatMoreAction = async function(action = '') {
        if (String(action || '').trim() === 'video_call') {
            closePrivateContactChatComposerPanels();
            await RinnoPrivateVideoCallManager.outgoing(privateActiveContactChatId);
            return true;
        }
        return __rinnoVideoMoreActionHandler(action);
    };

    const __rinnoVideoApplyAssistantInstruction = applyPrivateContactChatAssistantInstruction;
    applyPrivateContactChatAssistantInstruction = async function(contact, instruction = {}) {
        const type = String(instruction?.type || '').trim();
        if (type === 'video_call_invite') {
            const safeContact = getPrivateHydratedContact(contact || {});
            if (!safeContact?.id) return false;
            const message = await rinnoVideoAppendInvite(safeContact.id, 'assistant', 'ringing');
            const inviteId = message?.videoCallInvite?.inviteId || message?.id || '';
            await RinnoPrivateVideoCallManager.incoming(safeContact.id, { inviteId, note: instruction.note || instruction.content || '' });
            return true;
        }
        return __rinnoVideoApplyAssistantInstruction(contact, instruction);
    };

    window.RinnoPrivateVideoCallManager = {
        contactId: '',
        inviteId: '',
        transcript: [],
        seconds: 0,
        timer: null,
        active: false,
        minimized: false,
        pendingOutgoing: false,
        aiBusy: false,
        returnScreen: 'chat',
        returnTab: 'contact-chat',

        rememberReturnTarget() {
            const activeScreen = getActivePrivateScreenName();
            if (activeScreen && !['video-ringing', 'video-call'].includes(activeScreen)) {
                this.returnScreen = activeScreen;
            } else if (!this.returnScreen) {
                this.returnScreen = 'chat';
            }
            const chatScreen = document.querySelector('.private-chat-screen');
            const currentTab = chatScreen?.getAttribute('data-private-current-tab') || '';
            if (currentTab && !['video-ringing', 'video-call'].includes(currentTab)) {
                this.returnTab = currentTab;
            } else if (!this.returnTab) {
                this.returnTab = 'contact-chat';
            }
        },

        openRingingPage() {
            const { overlay, page, capsule } = this.ensure();
            page?.classList.remove('hidden', 'active');
            capsule?.classList.add('hidden');
            document.body.classList.add('private-video-call-open');
            showPrivateScreen('video-ringing');
            overlay?.classList.add('active');
        },

        openActivePage() {
            const { overlay, page, capsule } = this.ensure();
            overlay?.classList.remove('active');
            page?.classList.remove('hidden');
            capsule?.classList.add('hidden');
            document.body.classList.add('private-video-call-open');
            showPrivateScreen('video-call');
            page?.classList.add('active');
        },

        restoreReturnPage(options = {}) {
            document.body.classList.remove('private-video-call-open');
            const targetScreen = this.returnScreen || 'chat';
            const targetTab = this.returnTab || 'contact-chat';
            if (targetScreen === 'chat') {
                showPrivateScreen('chat');
                if (this.contactId) {
                    privateActiveContactChatId = this.contactId;
                    ensurePrivateContactChatThread(this.contactId);
                    renderPrivateContactChatPage(this.contactId, { scrollToBottom: options.scrollToBottom !== false });
                }
                switchPrivateTab(['contact-chat', 'contact-chat-settings', 'contact-homepage', 'contacts', 'whisper', 'time', 'monologue', 'sticker-library'].includes(targetTab) ? targetTab : 'contact-chat');
                return;
            }
            showPrivateScreen(targetScreen);
        },

        ensure() {
            let root = document.getElementById('private-app') || document.body;
            let overlay = document.getElementById('rinno-video-call-overlay');
            if (!overlay) {
                overlay = document.createElement('section');
                overlay.id = 'rinno-video-call-overlay';
                overlay.className = 'private-screen private-video-ringing-screen rinno-video-call-overlay';
                overlay.setAttribute('data-private-screen', 'video-ringing');
                overlay.setAttribute('aria-label', '视频来电');
                overlay.innerHTML = `
                    <div class="call-container rinno-video-ringing-card">
                        <div class="avatar-area">
                            <div class="ripple"></div>
                            <div class="ripple"></div>
                            <div class="ripple"></div>
                            <div class="avatar-main"><img id="rinno-video-call-avatar-img" src="" alt="avatar"></div>
                        </div>
                        <div class="info-section">
                            <h2 class="call-user-name" id="rinno-video-call-user-name">RINNO</h2>
                            <div class="call-status-text" id="rinno-video-call-status-text">邀请你视频通话...</div>
                        </div>
                        <div class="call-controls" id="rinno-video-call-controls">
                            <button class="call-btn btn-decline" id="rinno-video-call-decline" type="button" aria-label="拒绝视频通话">
                                <svg class="call-icon" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.948.948 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                            </button>
                            <button class="call-btn btn-accept" id="rinno-video-call-accept" type="button" aria-label="接听视频通话">
                                <svg class="call-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            </button>
                        </div>
                    </div>
                `;
                root.appendChild(overlay);
                overlay.querySelector('#rinno-video-call-accept')?.addEventListener('click', event => {
                    event.preventDefault();
                    void this.accept();
                });
                overlay.querySelector('#rinno-video-call-decline')?.addEventListener('click', event => {
                    event.preventDefault();
                    if (this.pendingOutgoing) void this.cancelOutgoing();
                    else void this.decline();
                });
            }
            let page = document.getElementById('rinno-video-active-call');
            if (!page) {
                page = document.createElement('section');
                page.id = 'rinno-video-active-call';
                page.className = 'private-screen private-video-call-screen rinno-video-active-call';
                page.setAttribute('data-private-screen', 'video-call');
                page.setAttribute('aria-label', '视频通话页面');
                page.innerHTML = `
                    <div class="rinno-video-stage">
                        <div class="rinno-video-remote" id="rinno-video-remote">
                            <div class="rinno-video-remote-avatar" id="rinno-video-active-avatar"></div>
                            <div class="rinno-video-remote-shine"></div>
                            <div class="rinno-video-remote-label"><span id="rinno-video-active-name">TA</span><em>HD VIDEO</em></div>
                        </div>
                        <div class="rinno-video-self"><span>${escapePrivateHtml(rinnoVideoUserName().slice(0, 1) || '我')}</span><small>YOU</small></div>
                    </div>
                    <div class="rinno-video-topbar">
                        <button class="interactive rinno-video-minimize" id="rinno-video-minimize" type="button" aria-label="缩小视频通话">—</button>
                        <div class="rinno-video-title">视频通话中</div>
                        <div class="rinno-video-timer" id="rinno-video-timer">00:00</div>
                    </div>
                    <div class="rinno-video-live-log" id="rinno-video-live-log"></div>
                    <form class="rinno-video-inputbar" id="rinno-video-input-form" autocomplete="off">
                        <input id="rinno-video-input" type="text" placeholder="说点什么，让 TA 在视频里回应你" autocomplete="off">
                        <button class="interactive rinno-video-send" type="submit">发送</button>
                    </form>
                    <div class="rinno-video-controls-live">
                        <button class="call-btn btn-decline" id="rinno-video-hangup" type="button" aria-label="挂断视频通话">
                            <svg class="call-icon" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.948.948 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                        </button>
                    </div>
                `;
                root.appendChild(page);
                page.querySelector('#rinno-video-input-form')?.addEventListener('submit', event => {
                    event.preventDefault();
                    void this.userSpeak();
                });
                page.querySelector('#rinno-video-hangup')?.addEventListener('click', event => {
                    event.preventDefault();
                    void this.end();
                });
                page.querySelector('#rinno-video-minimize')?.addEventListener('click', event => {
                    event.preventDefault();
                    this.minimize();
                });
            }
            let capsule = document.getElementById('rinno-video-mini-capsule');
            if (!capsule) {
                capsule = document.createElement('button');
                capsule.id = 'rinno-video-mini-capsule';
                capsule.className = 'rinno-video-mini-capsule hidden';
                capsule.type = 'button';
                capsule.innerHTML = '<span></span><b>视频</b><em id="rinno-video-mini-timer">00:00</em>';
                capsule.addEventListener('click', () => this.expand());
                root.appendChild(capsule);
            }
            return { overlay, page, capsule };
        },

        setContactUi(contact = {}) {
            const { overlay, page, capsule } = this.ensure();
            const name = rinnoVideoContactName(contact);
            const avatar = String(contact?.avatar || contact?.profileAvatar || '').trim();
            const img = overlay.querySelector('#rinno-video-call-avatar-img');
            if (img) {
                img.src = avatar || '';
                img.style.display = avatar ? 'block' : 'none';
            }
            const nameEl = overlay.querySelector('#rinno-video-call-user-name');
            if (nameEl) nameEl.textContent = name;
            const activeName = page.querySelector('#rinno-video-active-name');
            if (activeName) activeName.textContent = name;
            const activeAvatar = page.querySelector('#rinno-video-active-avatar');
            if (activeAvatar) {
                activeAvatar.textContent = avatar ? '' : (name.slice(0, 1) || 'R');
                activeAvatar.style.backgroundImage = avatar ? `url("${avatar.replace(/"/g, '\\"')}")` : 'none';
            }
            const capsuleName = capsule.querySelector('b');
            if (capsuleName) capsuleName.textContent = name;
        },

        async incoming(contactId = '', options = {}) {
            await Promise.resolve(privateStateReady);
            const contact = rinnoVideoGetContact(contactId);
            if (!contact) {
                showPrivateSystemToast('未找到可拨打的视频联系人。');
                return false;
            }
            this.rememberReturnTarget();
            this.ensure();
            this.contactId = contact.id;
            this.inviteId = String(options.inviteId || '').trim();
            this.pendingOutgoing = false;
            this.setContactUi(contact);
            const overlay = document.getElementById('rinno-video-call-overlay');
            const status = document.getElementById('rinno-video-call-status-text');
            const accept = document.getElementById('rinno-video-call-accept');
            if (status) status.textContent = options.note ? `${rinnoVideoContactName(contact)} 想视频：${options.note}` : '邀请你视频通话...';
            if (accept) accept.style.display = 'flex';
            this.openRingingPage();
            if (navigator.vibrate) navigator.vibrate([260, 120, 260]);
            return true;
        },

        async outgoing(contactId = '') {
            await Promise.resolve(privateStateReady);
            const contact = rinnoVideoGetContact(contactId || privateActiveContactChatId);
            if (!contact) {
                showPrivateSystemToast('请先打开一个联系人聊天。');
                return false;
            }
            this.rememberReturnTarget();
            this.ensure();
            this.contactId = contact.id;
            this.pendingOutgoing = true;
            this.active = false;
            this.setContactUi(contact);
            const message = await rinnoVideoAppendInvite(contact.id, 'user', 'ringing');
            this.inviteId = message?.videoCallInvite?.inviteId || message?.id || '';
            const overlay = document.getElementById('rinno-video-call-overlay');
            const status = document.getElementById('rinno-video-call-status-text');
            const accept = document.getElementById('rinno-video-call-accept');
            if (status) status.textContent = '正在等待对方接受视频邀请...';
            if (accept) accept.style.display = 'none';
            this.openRingingPage();
            void this.decideOutgoing(contact);
            return true;
        },

        async decideOutgoing(contact = {}) {
            const safeContact = getPrivateHydratedContact(contact || {});
            const recent = rinnoVideoGetRecentLines(safeContact.id, 12);
            const prompt = `用户正在向你（${rinnoVideoContactName(safeContact)}）发起视频通话。请根据你的人设、关系、当前上下文判断是否接听。\n\n【你的人设】\n${safeContact.setting || safeContact.note || safeContact.persona || '普通联系人'}\n\n【最近聊天】\n${recent || '暂无'}\n\n只输出 JSON：{"decision":"accept 或 decline","reason":"拒绝时用你的口吻给一句很短的理由；接听可留空"}`;
            try {
                const [raw] = await Promise.all([
                    rinnoVideoCallApi([{ role: 'user', content: prompt }], '你只负责输出严格 JSON，不要 Markdown。'),
                    new Promise(resolve => window.setTimeout(resolve, 1100 + Math.random() * 1400))
                ]);
                const parsed = rinnoVideoExtractJson(raw) || { decision: 'accept' };
                if (String(parsed.decision || '').toLowerCase().includes('decline')) {
                    await this.outgoingDeclined(parsed.reason || '我现在不太方便视频。');
                    return;
                }
            } catch (error) {
                console.warn('Rinno video outgoing decision failed, default accept:', error);
            }
            await this.accept({ fromOutgoing: true });
        },

        async outgoingDeclined(reason = '') {
            const contact = rinnoVideoGetContact(this.contactId);
            const safeContactId = this.contactId;
            document.getElementById('rinno-video-call-overlay')?.classList.remove('active');
            await rinnoVideoUpdateInviteStatus(safeContactId, this.inviteId, 'declined', { note: reason || '对方暂时不方便接听' });
            if (reason) {
                await appendPrivateContactChatAssistantMessage(safeContactId, {
                    id: createPrivateContactChatMessageId('assistant'),
                    role: 'assistant',
                    type: 'text',
                    content: normalizePrivateContactChatReplyText(reason),
                    createdAt: Date.now()
                });
            }
            await rinnoVideoAppendSystem(safeContactId, `${rinnoVideoContactName(contact || {})} 拒绝了视频通话`);
            this.restoreReturnPage({ scrollToBottom: true });
            this.reset();
        },

        async accept(options = {}) {
            this.rememberReturnTarget();
            const contact = rinnoVideoGetContact(this.contactId);
            if (!contact) return false;
            document.getElementById('rinno-video-call-overlay')?.classList.remove('active');
            this.ensure();
            this.setContactUi(contact);
            this.pendingOutgoing = false;
            this.active = true;
            this.minimized = false;
            this.transcript = [];
            const log = document.getElementById('rinno-video-live-log');
            if (log) log.innerHTML = '';
            this.openActivePage();
            await rinnoVideoUpdateInviteStatus(contact.id, this.inviteId, 'accepted', { note: '视频已接通' });
            await rinnoVideoAppendSystem(contact.id, '视频通话已接通');
            this.startTimer();
            void this.generateAiTurn(options.fromOutgoing ? 'OPENING_OUTGOING' : 'OPENING_INCOMING');
            return true;
        },

        async decline() {
            const safeContactId = this.contactId;
            const contact = rinnoVideoGetContact(safeContactId);
            document.getElementById('rinno-video-call-overlay')?.classList.remove('active');
            await rinnoVideoUpdateInviteStatus(safeContactId, this.inviteId, 'declined', { note: '你拒绝了视频通话' });
            await rinnoVideoAppendSystem(safeContactId, `你拒绝了 ${rinnoVideoContactName(contact || {})} 的视频通话`);
            this.restoreReturnPage({ scrollToBottom: true });
            this.reset();
        },

        async cancelOutgoing() {
            const safeContactId = this.contactId;
            document.getElementById('rinno-video-call-overlay')?.classList.remove('active');
            await rinnoVideoUpdateInviteStatus(safeContactId, this.inviteId, 'cancelled', { note: '你取消了视频通话' });
            await rinnoVideoAppendSystem(safeContactId, '你取消了视频通话');
            this.restoreReturnPage({ scrollToBottom: true });
            this.reset();
        },

        addLine(role = 'assistant', content = '') {
            const log = document.getElementById('rinno-video-live-log');
            const text = rinnoVideoSafeText(content);
            if (!log || !text) return;
            const row = document.createElement('div');
            row.className = `rinno-video-line is-${role}`;
            const label = role === 'user' ? rinnoVideoUserName() : (role === 'action' ? '画面' : rinnoVideoContactName(rinnoVideoGetContact(this.contactId) || {}));
            row.innerHTML = `<span>${escapePrivateHtml(label)}</span><p>${escapePrivateHtml(text)}</p>`;
            log.appendChild(row);
            requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }));
        },

        async userSpeak() {
            if (this.aiBusy) return;
            const input = document.getElementById('rinno-video-input');
            const text = rinnoVideoSafeText(input?.value || '');
            if (!text) return;
            if (input) input.value = '';
            this.addLine('user', text);
            this.transcript.push({ role: 'user', speaker: rinnoVideoUserName(), content: text, at: Date.now() });
            await this.generateAiTurn('REPLY');
        },

        async generateAiTurn(mode = 'REPLY') {
            if (this.aiBusy || !this.active) return false;
            const contact = rinnoVideoGetContact(this.contactId);
            if (!contact) return false;
            this.aiBusy = true;
            this.addLine('action', '画面微微晃动，对方像是在认真听你说话。');
            const recent = rinnoVideoGetRecentLines(contact.id, 14);
            const live = this.transcript.map(item => `${item.speaker || item.role}：${item.content}`).join('\n');
            const scenario = mode === 'REPLY'
                ? '用户刚在视频里说完话，请你自然回应。'
                : '视频刚接通，请你先开口，动作和语言都要像正在真实视频。';
            const prompt = `你是 ${rinnoVideoContactName(contact)}。请完全代入人设，在 Rinno 私叙的视频通话里回应 ${rinnoVideoUserName()}。\n\n【当前情境】${scenario}\n【人设】${contact.setting || contact.note || contact.persona || '无'}\n【最近文字聊天】\n${recent || '暂无'}\n【本次视频通话记录】\n${live || '刚接通'}\n\n输出必须是 JSON 数组，元素只能是：{"type":"action","content":"视频里的动作/神态/环境音"} 或 {"type":"speak","content":"角色说的话"}。\n要求 2-5 个元素，动作和说话交替，不要固定段落，不要解释。`;
            let actions = [];
            try {
                const raw = await rinnoVideoCallApi([{ role: 'user', content: prompt }], '你只输出严格 JSON 数组。');
                const parsed = rinnoVideoExtractJson(raw);
                if (Array.isArray(parsed)) actions = parsed;
            } catch (error) {
                console.warn('Rinno video call reply failed:', error);
            }
            if (!actions.length) {
                actions = [
                    { type: 'action', content: '对方靠近屏幕一点，声音放轻。' },
                    { type: 'speak', content: '我在，看得到你。你刚才那句话我听见了。' }
                ];
            }
            const charName = rinnoVideoContactName(contact);
            for (const action of actions.slice(0, 5)) {
                if (!this.active) break;
                const text = rinnoVideoSafeText(action?.content || action?.text || '');
                if (!text) continue;
                await new Promise(resolve => window.setTimeout(resolve, Math.min(1500, 420 + Array.from(text).length * 26)));
                if (String(action?.type || '').toLowerCase() === 'action') {
                    this.addLine('action', text);
                    this.transcript.push({ role: 'action', speaker: '画面', content: text, at: Date.now() });
                } else {
                    this.addLine('assistant', text);
                    this.transcript.push({ role: 'assistant', speaker: charName, content: text, at: Date.now() });
                }
            }
            this.aiBusy = false;
            return true;
        },

        async end() {
            if (!this.active && !this.contactId) return false;
            const safeContactId = this.contactId;
            const contact = rinnoVideoGetContact(safeContactId);
            const duration = document.getElementById('rinno-video-timer')?.textContent || '00:00';
            this.stopTimer();
            this.active = false;
            document.getElementById('rinno-video-active-call')?.classList.remove('active');
            document.getElementById('rinno-video-mini-capsule')?.classList.add('hidden');
            await rinnoVideoUpdateInviteStatus(safeContactId, this.inviteId, 'ended', { note: `通话时长 ${duration}` });
            await rinnoVideoAppendSummary(safeContactId, { duration, transcript: this.transcript });
            await rinnoVideoAppendSystem(safeContactId, `视频通话已结束 · ${duration}`);
            this.restoreReturnPage({ scrollToBottom: true });
            this.reset(false);
            return true;
        },

        minimize() {
            if (!this.active) return;
            document.getElementById('rinno-video-active-call')?.classList.remove('active');
            document.getElementById('rinno-video-mini-capsule')?.classList.remove('hidden');
            this.restoreReturnPage({ scrollToBottom: false });
            this.minimized = true;
        },

        expand() {
            if (!this.active) return;
            document.getElementById('rinno-video-mini-capsule')?.classList.add('hidden');
            this.openActivePage();
            this.minimized = false;
        },

        startTimer() {
            this.stopTimer();
            this.seconds = 0;
            this.syncTimer();
            this.timer = window.setInterval(() => {
                this.seconds += 1;
                this.syncTimer();
            }, 1000);
        },

        syncTimer() {
            const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            const seconds = (this.seconds % 60).toString().padStart(2, '0');
            const text = `${minutes}:${seconds}`;
            const timer = document.getElementById('rinno-video-timer');
            const mini = document.getElementById('rinno-video-mini-timer');
            if (timer) timer.textContent = text;
            if (mini) mini.textContent = text;
        },

        stopTimer() {
            if (this.timer) window.clearInterval(this.timer);
            this.timer = null;
        },

        reset(clearTranscript = true) {
            this.stopTimer();
            this.contactId = '';
            this.inviteId = '';
            this.pendingOutgoing = false;
            this.active = false;
            this.minimized = false;
            this.aiBusy = false;
            document.getElementById('rinno-video-call-overlay')?.classList.remove('active');
            document.getElementById('rinno-video-active-call')?.classList.remove('active');
            document.getElementById('rinno-video-mini-capsule')?.classList.add('hidden');
            document.body.classList.remove('private-video-call-open');
            if (clearTranscript) this.transcript = [];
        }
    };

    document.addEventListener('click', event => {
        const videoTool = event.target.closest?.('#private-contact-chat-video-call');
        if (videoTool) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            void RinnoPrivateVideoCallManager.outgoing(privateActiveContactChatId);
            return;
        }
        const homepageEntry = event.target.closest?.('[data-private-contact-homepage-entry]');
        if (homepageEntry) {
            const entryName = String(homepageEntry.getAttribute('data-private-contact-homepage-entry') || '').replace(/\s+/g, '');
            if (entryName.includes('视频') || /video/i.test(entryName)) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                const contactId = homepageEntry.getAttribute('data-private-contact-id') || homepageEntry.closest('[data-private-contact-homepage-id]')?.getAttribute('data-private-contact-homepage-id') || '';
                void RinnoPrivateVideoCallManager.outgoing(contactId);
                return;
            }
        }
        const callCardAction = event.target.closest?.('[data-rinno-video-call-action]');
        if (callCardAction) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const action = callCardAction.getAttribute('data-rinno-video-call-action') || '';
            const contactId = callCardAction.getAttribute('data-rinno-video-call-contact-id') || privateActiveContactChatId || '';
            const inviteId = callCardAction.getAttribute('data-rinno-video-call-invite-id') || '';
            if (action === 'accept-card') {
                RinnoPrivateVideoCallManager.contactId = rinnoVideoNormalizeContactId(contactId);
                RinnoPrivateVideoCallManager.inviteId = inviteId;
                void RinnoPrivateVideoCallManager.accept();
            }
        }
    }, true);
})();
