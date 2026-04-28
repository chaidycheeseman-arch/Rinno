/* ════════════════════════════════════════
   资管 · RINNO FINANCE APP
   ════════════════════════════════════════ */

const ASSETS_KEY = 'rinno_assets_state_v1';

/* ── Company data ─────────────────────── */
const ASSETS_COMPANIES = [
    {
        id: 'cxtz', name: '晨曦科技', ticker: 'CXT.SH', sector: '信息技术',
        base: 248.50, vol: 0.018,
        intro: '晨曦科技成立于2018年，总部位于上海张江高科技园区。公司深耕人工智能与云原生基础设施，核心产品「晨曦大模型」已在金融、医疗、政务三大行业落地，累计服务企业客户逾3200家。2025年完成B+轮融资，估值突破200亿人民币。'
    },
    {
        id: 'mgyj', name: '沐光医疗', ticker: 'MGY.SZ', sector: '医疗健康',
        base: 89.60, vol: 0.015,
        intro: '沐光医疗是国内领先的精准医疗整合服务商，2016年于深圳创立。旗下拥有影像AI诊断系统「沐光·眼」及基因检测平台「碱基云」，与全国逾800家三甲医院形成战略合作。公司于2024年在科创板上市，首日涨幅58%。'
    },
    {
        id: 'xhny', name: '星河能源', ticker: 'XHN.SH', sector: '清洁能源',
        base: 156.80, vol: 0.022,
        intro: '星河能源是专注于海上风电与光伏储能的综合能源企业，2014年于江苏南通成立。公司掌握全球顶尖叶片气动设计专利46项，2025年在役装机容量达18.6GW。作为国家能源转型重点扶持企业，正积极推进氢能与电网侧储能的商业化布局。'
    },
    {
        id: 'yfzy', name: '云峰置业', ticker: 'YFZ.SZ', sector: '不动产',
        base: 32.40, vol: 0.012,
        intro: '云峰置业创立于2003年，主营高端住宅开发及商业综合体运营，产品线覆盖「云系」别墅、「峰系」改善型住宅及「峰汇」商业地产三大品牌。土地储备约860万平方米，以设计溢价与精工品质著称于高净值客群。'
    },
    {
        id: 'wlhy', name: '蔚蓝航运', ticker: 'WLH.SH', sector: '交通运输',
        base: 71.30, vol: 0.014,
        intro: '蔚蓝航运成立于2001年，是国内规模最大的集装箱远洋航运企业之一。公司运营亚欧、跨太平洋及中东三大核心航段，船队234艘，总载重吨位逾1800万DWT。2025年绿色甲醇动力船队改造目标完成20%，ESG评级位列行业A+。'
    }
];

/* ── Lottery data ─────────────────────── */
const ASSETS_LOTTERIES = [
    {
        id: 'koi', name: '锦鲤彩', tag: 'KOI LUCKY', price: 5,
        draw: '每日 21:00',
        desc: '从1至36中任选6个号码，每日21:00自动开奖。命中6个号码瓜分奖池，5个中二等奖，4个中三等奖。',
        rules: { type: 'pick', total: 36, pick: 6 },
        jackpot: 12000000
    },
    {
        id: 'lucky7', name: '幸运七', tag: 'LUCKY 7', price: 2,
        draw: '周一 / 三 / 五',
        desc: '选择3个0至9的独立数字，每逢周一、三、五 20:30 开奖，顺序完全匹配者得头奖¥200,000。',
        rules: { type: 'digits', count: 3, range: 10 },
        jackpot: 200000
    },
    {
        id: 'twocolor', name: '双色球', tag: 'TWO COLOR', price: 2,
        draw: '周二 / 四 / 六',
        desc: '选6个红球（1-33）和1个蓝球（1-16）。周二、四、六 21:15 开奖，头奖起步¥5,000万。',
        rules: { type: 'twoball', red: 33, redPick: 6, blue: 16, bluePick: 1 },
        jackpot: 50000000
    },
    {
        id: 'spin', name: '时来运转', tag: 'FORTUNE SPIN', price: 10,
        draw: '即开型',
        desc: '即开型刮刮乐，5个转轮各取一图标，连续出现3个相同图标即获奖，最高奖¥10,000，综合中奖率约12%。',
        rules: { type: 'scratch', reels: 5 },
        jackpot: 10000
    },
    {
        id: 'star', name: '福星高照', tag: 'FORTUNE STAR', price: 1,
        draw: '每日 22:00',
        desc: '猜测0000至9999之间的4位数号码，每日22:00开奖，完全匹配者得¥50,000，各位数独立匹配有小奖。',
        rules: { type: 'number4', range: 10000 },
        jackpot: 50000
    }
];

/* ── Job pool ─────────────────────────── */
const ASSETS_JOBS = [
    { id: 'j1', company: '晨曦科技 Ltd.', position: '高级产品经理', salary: 18000, start: '09:00', end: '18:00', dept: '产品研发部' },
    { id: 'j2', company: '沐光医疗 Corp.', position: 'UX 设计总监', salary: 14000, start: '09:30', end: '18:30', dept: '用户体验中心' },
    { id: 'j3', company: '星河能源 Group', position: '数据分析师', salary: 16000, start: '09:00', end: '18:00', dept: '大数据平台' },
    { id: 'j4', company: '云峰置业 Estate', position: '战略规划经理', salary: 20000, start: '09:00', end: '18:30', dept: '战略发展部' },
    { id: 'j5', company: '蔚蓝航运 Group', position: '运营分析师', salary: 12000, start: '08:30', end: '17:30', dept: '运营中心' }
];

/* ── Payment tools ────────────────────── */
const ASSETS_PAYMENT_TOOLS = [
    {
        name: '银行卡',
        icon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="5" y1="15" x2="9" y2="15"/>',
        msg: '已绑定 3 张银行卡'
    },
    {
        name: '亲属卡',
        icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        msg: '已添加 2 位亲属'
    },
    {
        name: '免密支付',
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        msg: '免密支付已开启'
    },
    {
        name: '支付密码',
        icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        msg: '支付密码管理'
    }
];

/* ── State ────────────────────────────── */
let assetsState = null;
let assetsEventsBound = false;
let assetsActiveTab = 'finance';
let assetsPriceTick = null;
let assetsClockTick = null;
let assetsCurrentStockId = null;
let assetsCurrentLotteryId = null;
let assetsLotterySelection = [];
let assetsLotteryDrawResult = null;

/* ═══════════════════════════════════════
   Utilities
   ═══════════════════════════════════════ */

function assetsEsc(v) {
    return String(v ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function assetsFmt(n, dec = 2) {
    const num = Number(n) || 0;
    if (num >= 10000) {
        return '¥' + (num / 10000).toFixed(2) + '万';
    }
    return '¥' + num.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function assetsFmtFull(n) {
    const num = Number(n) || 0;
    return '¥' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function assetsShowToast(msg, ms = 2400) {
    const toast = document.getElementById('assets-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(assetsShowToast._t);
    assetsShowToast._t = setTimeout(() => toast.classList.remove('show'), ms);
}

function assetsNow() {
    const d = new Date();
    return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds(), dateStr: d.toLocaleDateString('zh-CN') };
}

function assetsTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ═══════════════════════════════════════
   State persistence
   ═══════════════════════════════════════ */

function assetsInitPrices() {
    const prices = {}, history = {};
    ASSETS_COMPANIES.forEach(c => {
        let p = c.base * (0.88 + Math.random() * 0.24);
        const hist = [];
        for (let i = 0; i < 60; i++) {
            const delta = (Math.random() - 0.48) * c.vol * p;
            p = Math.max(c.base * 0.3, p + delta);
            hist.push(Math.round(p * 100) / 100);
        }
        prices[c.id] = hist[59];
        history[c.id] = hist;
    });
    return { prices, history };
}

function assetsDefaultState() {
    const { prices, history } = assetsInitPrices();
    return {
        cash: 50000,
        holdings: {},
        work: {
            hasJob: false,
            job: null,
            todayDate: '',
            punchIn: null,
            punchOut: null,
            logs: [],
            offers: ASSETS_JOBS.slice().sort(() => Math.random() - 0.5).slice(0, 3),
            totalEarned: 0
        },
        lottery: { history: [], totalSpent: 0, totalWon: 0 },
        prices,
        history
    };
}

function assetsNormalizeState(value) {
    if (!value || typeof value !== 'object') return assetsDefaultState();
    const def = assetsDefaultState();
    return {
        cash: Number(value.cash) || def.cash,
        holdings: value.holdings || {},
        work: { ...def.work, ...(value.work || {}) },
        lottery: { ...def.lottery, ...(value.lottery || {}) },
        prices: value.prices || def.prices,
        history: value.history || def.history
    };
}

function assetsParseStateContent(content) {
    if (!content || typeof content !== 'string') return assetsDefaultState();
    try {
        return assetsNormalizeState(JSON.parse(content));
    } catch (_) {
        return assetsDefaultState();
    }
}

function assetsReadLegacyState() {
    try {
        return assetsParseStateContent(localStorage.getItem(ASSETS_KEY));
    } catch (_) {
        return assetsDefaultState();
    }
}

async function assetsReadState() {
    try {
        if (typeof db !== 'undefined' && db?.edits?.get) {
            const saved = await db.edits.get(ASSETS_KEY);
            if (saved?.content) return assetsParseStateContent(saved.content);
        }
    } catch (error) {
        console.warn('Assets Dexie read failed:', error);
    }
    const legacy = assetsReadLegacyState();
    if (legacy) void persistAssetsState(legacy);
    return legacy;
}

async function hydrateAssetsState() {
    assetsState = await assetsReadState();
    return assetsState;
}

async function persistAssetsState(snapshot) {
    try {
        if (typeof db !== 'undefined' && db?.edits?.put) {
            await db.edits.put({
                id: ASSETS_KEY,
                content: JSON.stringify(snapshot && typeof snapshot === 'object' ? snapshot : assetsDefaultState()),
                type: 'assets-state'
            });
        }
    } catch (error) {
        console.warn('Assets Dexie save failed:', error);
    }
    try {
        localStorage.removeItem(ASSETS_KEY);
    } catch (error) {
        // Ignore legacy cleanup failures.
    }
}

function assetsSave() {
    if (!assetsState) return;
    void persistAssetsState(assetsState);
}

/* ═══════════════════════════════════════
   Price simulation
   ═══════════════════════════════════════ */

function assetsTickPrices() {
    if (!assetsState) return;
    ASSETS_COMPANIES.forEach(c => {
        const hist = assetsState.history[c.id] || [];
        const cur = assetsState.prices[c.id] || c.base;
        const delta = (Math.random() - 0.48) * c.vol * cur;
        const next = Math.max(c.base * 0.25, Math.round((cur + delta) * 100) / 100);
        assetsState.prices[c.id] = next;
        hist.push(next);
        if (hist.length > 60) hist.shift();
        assetsState.history[c.id] = hist;
    });
    assetsSave();
    if (assetsActiveTab === 'finance') {
        assetsRenderMarketBanner();
        assetsRenderStockList();
    }
    assetsUpdateHeaderTotal();
}

function assetsGetChange(id) {
    const hist = assetsState.history[id] || [];
    if (hist.length < 2) return { abs: 0, pct: 0 };
    const prev = hist[hist.length - 2];
    const cur  = hist[hist.length - 1];
    const abs  = Math.round((cur - prev) * 100) / 100;
    const pct  = Math.round((cur - prev) / prev * 10000) / 100;
    return { abs, pct };
}

/* ── SVG sparkline path builder ──────── */
function assetsBuildPath(history, w, h, pad = 4) {
    if (!history || history.length < 2) return '';
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const pts = history.map((v, i) => {
        const x = (i / (history.length - 1)) * w;
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return pts.join(' ');
}

/* ═══════════════════════════════════════
   Finance page renders
   ═══════════════════════════════════════ */

function assetsRenderMarketBanner() {
    const svg = document.getElementById('assets-market-svg');
    const tickerRow = document.getElementById('assets-market-ticker-row');
    if (!svg || !tickerRow || !assetsState) return;

    svg.innerHTML = ASSETS_COMPANIES.map(c => {
        const pts = assetsBuildPath(assetsState.history[c.id], 360, 80);
        return pts ? `<polyline class="assets-mline" points="${pts}"/>` : '';
    }).join('');

    tickerRow.innerHTML = ASSETS_COMPANIES.map(c => {
        const { pct } = assetsGetChange(c.id);
        const price = assetsState.prices[c.id] || c.base;
        const cls = pct >= 0 ? 'up' : 'dn';
        const sign = pct >= 0 ? '+' : '';
        return `
        <div class="assets-ticker-item">
            <span class="assets-ticker-name">${assetsEsc(c.name)}</span>
            <span class="assets-ticker-price">${price.toFixed(2)}</span>
            <span class="assets-ticker-chg ${cls}">${sign}${pct.toFixed(2)}%</span>
        </div>`;
    }).join('');
}

function assetsRenderStockList() {
    const list = document.getElementById('assets-stock-list');
    if (!list || !assetsState) return;

    list.innerHTML = ASSETS_COMPANIES.map(c => {
        const { pct } = assetsGetChange(c.id);
        const price = assetsState.prices[c.id] || c.base;
        const cls = pct >= 0 ? 'up' : 'dn';
        const sign = pct >= 0 ? '+' : '';
        const pts = assetsBuildPath(assetsState.history[c.id], 44, 26);
        const holding = assetsState.holdings[c.id];
        const holdingTxt = holding ? ` · 持有${holding.shares}股` : '';
        return `
        <div class="assets-stock-card" data-assets-stock="${assetsEsc(c.id)}">
            <div>
                <div class="assets-stock-name">${assetsEsc(c.name)}</div>
                <div class="assets-stock-sector">${assetsEsc(c.ticker)} · ${assetsEsc(c.sector)}${holdingTxt}</div>
            </div>
            <div class="assets-stock-price-col">
                <span class="assets-stock-price">${price.toFixed(2)}</span>
                <span class="assets-stock-chg ${cls}">${sign}${pct.toFixed(2)}%</span>
            </div>
            <svg class="assets-sparkline-svg" viewBox="0 0 44 26" preserveAspectRatio="none" aria-hidden="true">
                ${pts ? `<polyline class="assets-sparkline-path" points="${pts}"/>` : ''}
            </svg>
        </div>`;
    }).join('');
}

function assetsRenderFinancePage() {
    assetsRenderMarketBanner();
    assetsRenderStockList();
    const clock = document.getElementById('assets-stock-clock');
    if (clock) {
        const d = new Date();
        clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
}

/* ── Stock detail modal ───────────────── */
function assetsOpenStockModal(id) {
    const c = ASSETS_COMPANIES.find(x => x.id === id);
    if (!c || !assetsState) return;
    assetsCurrentStockId = id;

    const price = assetsState.prices[id] || c.base;
    const { abs, pct } = assetsGetChange(id);
    const cls = pct >= 0 ? 'up' : 'dn';
    const sign = pct >= 0 ? '+' : '';
    const pts = assetsBuildPath(assetsState.history[id], 300, 72);
    const holding = assetsState.holdings[id];

    let holdingHtml = '';
    if (holding) {
        const mkt = price * holding.shares;
        const pl = mkt - holding.avgCost * holding.shares;
        const plSign = pl >= 0 ? '+' : '';
        holdingHtml = `<div class="assets-detail-holding">
            持有 <strong>${holding.shares} 股</strong> · 均价 <strong>${holding.avgCost.toFixed(2)}</strong>
            · 市值 <strong>${assetsFmtFull(mkt)}</strong>
            · 盈亏 <strong style="color:${pl >= 0 ? 'var(--assets-up)' : 'var(--assets-dn)'}">${plSign}${assetsFmtFull(pl)}</strong>
        </div>`;
    }

    document.getElementById('assets-stock-detail').innerHTML = `
        <div class="assets-detail-tag">${assetsEsc(c.ticker)} · ${assetsEsc(c.sector)}</div>
        <div class="assets-detail-name">${assetsEsc(c.name)}</div>
        <div class="assets-detail-price-row">
            <span class="assets-detail-price">${price.toFixed(2)}</span>
            <span class="assets-detail-chg ${cls}">${sign}${abs.toFixed(2)} (${sign}${pct.toFixed(2)}%)</span>
        </div>
        <div class="assets-detail-chart-wrap">
            <svg class="assets-detail-chart-svg" viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
                ${pts ? `<polyline class="assets-detail-chart-path" points="${pts}"/>` : ''}
            </svg>
        </div>
        <div class="assets-detail-intro-lbl">企业简介</div>
        <div class="assets-detail-intro">${assetsEsc(c.intro)}</div>
        ${holdingHtml}
        <div class="assets-detail-trade-row">
            <button class="assets-trade-btn buy interactive" data-assets-trade="buy" type="button">买入 1 手</button>
            <button class="assets-trade-btn sell interactive" data-assets-trade="sell" type="button"
                ${holding ? '' : 'disabled style="opacity:0.35;cursor:not-allowed"'}>卖出 1 手</button>
        </div>`;

    document.getElementById('assets-stock-modal').hidden = false;
}

function assetsHandleStockTrade(action) {
    const id = assetsCurrentStockId;
    const c = ASSETS_COMPANIES.find(x => x.id === id);
    if (!c || !assetsState) return;

    const price = assetsState.prices[id] || c.base;
    const LOT = 100;

    if (action === 'buy') {
        const cost = Math.round(price * LOT * 100) / 100;
        if (assetsState.cash < cost) { assetsShowToast('余额不足，无法买入'); return; }
        assetsState.cash -= cost;
        if (!assetsState.holdings[id]) {
            assetsState.holdings[id] = { shares: LOT, avgCost: price };
        } else {
            const h = assetsState.holdings[id];
            const total = h.avgCost * h.shares + price * LOT;
            h.shares += LOT;
            h.avgCost = Math.round(total / h.shares * 100) / 100;
        }
        assetsShowToast(`已买入 ${c.name} 100股，花费 ${assetsFmtFull(cost)}`);
    } else {
        const h = assetsState.holdings[id];
        if (!h || h.shares < LOT) { assetsShowToast('持仓不足，无法卖出'); return; }
        const proceeds = Math.round(price * LOT * 100) / 100;
        assetsState.cash += proceeds;
        h.shares -= LOT;
        if (h.shares <= 0) delete assetsState.holdings[id];
        assetsShowToast(`已卖出 ${c.name} 100股，回款 ${assetsFmtFull(proceeds)}`);
    }
    assetsSave();
    assetsUpdateHeaderTotal();
    assetsOpenStockModal(id);
    if (assetsActiveTab === 'finance') assetsRenderStockList();
}

/* ═══════════════════════════════════════
   Work page
   ═══════════════════════════════════════ */

function assetsRenderWorkHero() {
    const el = document.getElementById('assets-work-hero');
    if (!el || !assetsState) return;
    const { hasJob, job, logs } = assetsState.work;
    if (!hasJob || !job) {
        el.innerHTML = `<div class="assets-work-no-job">
            <strong>尚未就业</strong>
            浏览下方面试机会，接受邀约开始你的职场生涯。
        </div>`;
        return;
    }
    const totalEarned = assetsState.work.totalEarned || 0;
    const workDays = logs.length;
    const todayLog = logs.find(l => l.date === assetsTodayKey());
    const todayEarned = todayLog ? todayLog.earned : 0;
    el.innerHTML = `
        <div class="assets-work-company">${assetsEsc(job.company)}</div>
        <div class="assets-work-position">${assetsEsc(job.position)}</div>
        <div class="assets-work-meta-row">
            <div class="assets-work-meta-item">
                <span class="assets-work-meta-label">月薪</span>
                <span class="assets-work-meta-value">${assetsFmt(job.salary)}</span>
            </div>
            <div class="assets-work-meta-item">
                <span class="assets-work-meta-label">工时</span>
                <span class="assets-work-meta-value">${assetsEsc(job.start)} – ${assetsEsc(job.end)}</span>
            </div>
            <div class="assets-work-meta-item">
                <span class="assets-work-meta-label">累计出勤</span>
                <span class="assets-work-meta-value">${workDays} 天</span>
            </div>
            <div class="assets-work-meta-item">
                <span class="assets-work-meta-label">累计薪资</span>
                <span class="assets-work-meta-value">${assetsFmt(totalEarned)}</span>
            </div>
        </div>`;
}

function assetsRenderPunchPanel() {
    const el = document.getElementById('assets-punch-wrap');
    if (!el || !assetsState) return;
    const { hasJob, job, punchIn, punchOut, todayDate } = assetsState.work;

    if (!hasJob || !job) {
        el.innerHTML = `<div style="padding:16px;color:var(--assets-muted);font-size:13px;text-align:center;border:1px solid var(--assets-faint);border-radius:20px;">找到工作后才能打卡。</div>`;
        return;
    }

    const now = assetsNow();
    const todayKey = assetsTodayKey();
    const isToday = todayDate === todayKey;
    const hasPunchIn = isToday && punchIn;
    const hasPunchOut = isToday && punchOut;

    const [endH, endM] = job.end.split(':').map(Number);
    const [startH, startM] = job.start.split(':').map(Number);

    let penaltyHtml = '';
    if (hasPunchOut) {
        const todayLog = assetsState.work.logs.find(l => l.date === todayKey);
        if (todayLog && todayLog.penalty > 0) {
            penaltyHtml = `<div class="assets-punch-penalty">今日扣薪 ${assetsFmtFull(todayLog.penalty)}（早退/迟到）</div>`;
        } else if (todayLog) {
            penaltyHtml = `<div class="assets-punch-penalty" style="color:var(--assets-dn)">今日到岗完整，薪资 ${assetsFmtFull(todayLog.earned)}</div>`;
        }
    }

    const timeStr = `${String(now.h).padStart(2,'0')}:${String(now.m).padStart(2,'0')}:${String(now.s).padStart(2,'0')}`;

    el.innerHTML = `
        <div class="assets-punch-time-center">
            <div class="assets-punch-clock-display" id="assets-punch-clock">${timeStr}</div>
            <div class="assets-punch-date-display">${now.dateStr} · ${assetsEsc(job.company)}</div>
        </div>
        <div class="assets-punch-status-row">
            <div class="assets-punch-status-box">
                <div class="assets-punch-status-lbl">上班打卡</div>
                <div class="assets-punch-status-val">${hasPunchIn ? assetsEsc(punchIn) : '--:--'}</div>
            </div>
            <div class="assets-punch-status-box">
                <div class="assets-punch-status-lbl">下班打卡</div>
                <div class="assets-punch-status-val">${hasPunchOut ? assetsEsc(punchOut) : '--:--'}</div>
            </div>
        </div>
        <div class="assets-punch-btns">
            <button class="assets-punch-btn in interactive" id="assets-punch-in-btn" type="button"
                ${hasPunchIn ? 'disabled' : ''}>
                ${hasPunchIn ? '✓ 已上班' : '上班打卡'}
            </button>
            <button class="assets-punch-btn out interactive" id="assets-punch-out-btn" type="button"
                ${!hasPunchIn || hasPunchOut ? 'disabled' : ''}>
                ${hasPunchOut ? '✓ 已下班' : '下班打卡'}
            </button>
        </div>
        ${penaltyHtml}`;

    document.getElementById('assets-punch-in-btn')?.addEventListener('click', assetsDoPunchIn);
    document.getElementById('assets-punch-out-btn')?.addEventListener('click', assetsDoPunchOut);
}

function assetsRenderInterviews() {
    const el = document.getElementById('assets-interview-list');
    if (!el || !assetsState) return;
    const offers = assetsState.work.offers || [];
    if (!offers.length) {
        el.innerHTML = `<div class="assets-interview-empty">暂无面试邀约，稍后再来查看。</div>`;
        return;
    }
    el.innerHTML = offers.map(j => `
        <div class="assets-interview-card">
            <div class="assets-interview-company">${assetsEsc(j.company)}</div>
            <div class="assets-interview-position">${assetsEsc(j.position)}</div>
            <div class="assets-interview-salary">月薪 ¥${Number(j.salary).toLocaleString()} · ${assetsEsc(j.dept)}</div>
            <div class="assets-interview-actions">
                <button class="assets-interview-btn accept interactive" data-assets-accept="${assetsEsc(j.id)}" type="button">接受邀约</button>
                <button class="assets-interview-btn interactive" data-assets-decline="${assetsEsc(j.id)}" type="button">婉拒</button>
            </div>
        </div>`).join('');
}

function assetsRenderWorkPage() {
    assetsRenderWorkHero();
    assetsRenderPunchPanel();
    assetsRenderInterviews();
}

function assetsParseTime(str) {
    const [h, m] = (str || '').split(':').map(Number);
    return h * 60 + m;
}

function assetsDoPunchIn() {
    if (!assetsState) return;
    const { job } = assetsState.work;
    if (!job) return;
    const now = assetsNow();
    const todayKey = assetsTodayKey();
    const timeStr = `${String(now.h).padStart(2,'0')}:${String(now.m).padStart(2,'0')}`;

    assetsState.work.todayDate = todayKey;
    assetsState.work.punchIn = timeStr;
    assetsState.work.punchOut = null;

    const startMin = assetsParseTime(job.start);
    const lateMin = now.h * 60 + now.m - startMin;

    let msg = `已打卡上班 ${timeStr}`;
    if (lateMin > 60) msg += ' · 严重迟到，将扣1小时工资';
    else if (lateMin > 30) msg += ' · 迟到，将扣30分钟工资';
    else if (lateMin > 0) msg += ` · 晚到${lateMin}分钟`;
    else msg += ' · 准时到岗！';

    assetsSave();
    assetsShowToast(msg);
    assetsRenderPunchPanel();
    assetsRenderWorkHero();
}

function assetsDoPunchOut() {
    if (!assetsState) return;
    const { job, punchIn } = assetsState.work;
    if (!job || !punchIn) return;
    const now = assetsNow();
    const todayKey = assetsTodayKey();
    const timeStr = `${String(now.h).padStart(2,'0')}:${String(now.m).padStart(2,'0')}`;

    const dailyWage = Math.round(job.salary / 22 * 100) / 100;
    const hourlyWage = dailyWage / 9;

    const [startH, startM] = job.start.split(':').map(Number);
    const [endH, endM] = job.end.split(':').map(Number);
    const punchInMin = assetsParseTime(punchIn);
    const punchOutMin = now.h * 60 + now.m;
    const stdStartMin = startH * 60 + startM;
    const stdEndMin   = endH * 60 + endM;

    let penalty = 0;
    let msg = `已打卡下班 ${timeStr}`;

    const lateMinutes = Math.max(0, punchInMin - stdStartMin - 30);
    if (punchInMin > stdStartMin + 60) {
        penalty += hourlyWage;
    } else if (punchInMin > stdStartMin + 30) {
        penalty += hourlyWage * 0.5;
    }

    const earlyMinutes = Math.max(0, stdEndMin - punchOutMin);
    if (earlyMinutes > 30) {
        penalty += hourlyWage * (earlyMinutes / 60);
        msg += ` · 提前${earlyMinutes}分钟离开，扣薪 ${assetsFmtFull(hourlyWage * earlyMinutes / 60)}`;
    }

    penalty = Math.round(penalty * 100) / 100;
    const earned = Math.max(0, Math.round((dailyWage - penalty) * 100) / 100);

    assetsState.work.punchOut = timeStr;
    assetsState.work.totalEarned = (assetsState.work.totalEarned || 0) + earned;
    assetsState.cash += earned;

    const existingLogIdx = assetsState.work.logs.findIndex(l => l.date === todayKey);
    const logEntry = { date: todayKey, punchIn, punchOut: timeStr, earned, penalty };
    if (existingLogIdx >= 0) assetsState.work.logs[existingLogIdx] = logEntry;
    else assetsState.work.logs.push(logEntry);

    if (penalty === 0) msg += ` · 全勤！到账 ${assetsFmtFull(earned)}`;
    else msg += ` · 实际到账 ${assetsFmtFull(earned)}`;

    assetsSave();
    assetsUpdateHeaderTotal();
    assetsShowToast(msg, 3200);
    assetsRenderPunchPanel();
    assetsRenderWorkHero();
}

function assetsAcceptJob(jobId) {
    const offer = (assetsState.work.offers || []).find(j => j.id === jobId);
    if (!offer || !assetsState) return;
    assetsState.work.hasJob = true;
    assetsState.work.job = { ...offer };
    assetsState.work.punchIn = null;
    assetsState.work.punchOut = null;
    assetsState.work.todayDate = '';
    assetsShowToast(`恭喜！已加入 ${offer.company}`);
    assetsSave();
    assetsRenderWorkPage();
}

function assetsDeclineJob(jobId) {
    if (!assetsState) return;
    assetsState.work.offers = (assetsState.work.offers || []).filter(j => j.id !== jobId);
    assetsSave();
    assetsRenderInterviews();
    assetsShowToast('已婉拒该邀约');
}

/* ═══════════════════════════════════════
   Lottery page
   ═══════════════════════════════════════ */

function assetsRenderLotteryPage() {
    const list = document.getElementById('assets-lottery-list');
    const badge = document.getElementById('assets-lottery-cash');
    if (!list || !assetsState) return;
    if (badge) badge.textContent = assetsFmt(assetsState.cash);

    list.innerHTML = ASSETS_LOTTERIES.map(lot => `
        <div class="assets-lottery-card">
            <div class="assets-lottery-tag">${assetsEsc(lot.tag)}</div>
            <div class="assets-lottery-name">${assetsEsc(lot.name)}</div>
            <div class="assets-lottery-desc">${assetsEsc(lot.desc)}</div>
            <div class="assets-lottery-footer">
                <div>
                    <div class="assets-lottery-price-tag">每注 <strong>¥${lot.price}</strong></div>
                    <div class="assets-lottery-jackpot">奖池 ${assetsFmt(lot.jackpot)}</div>
                </div>
                <button class="assets-lottery-buy-btn interactive" data-assets-lottery="${assetsEsc(lot.id)}" type="button">购票</button>
            </div>
        </div>`).join('');
}

function assetsOpenLotteryModal(id) {
    const lot = ASSETS_LOTTERIES.find(x => x.id === id);
    if (!lot || !assetsState) return;
    assetsCurrentLotteryId = id;
    assetsLotterySelection = [];
    assetsLotteryDrawResult = null;
    assetsRenderLotteryModal(lot, null, null);
    document.getElementById('assets-lottery-modal').hidden = false;
}

function assetsRenderLotteryModal(lot, drawn, win) {
    const el = document.getElementById('assets-lottery-detail');
    if (!el) return;
    const { rules } = lot;

    let pickerHtml = '';
    let resultHtml = '';
    let actionHtml = '';

    if (drawn) {
        resultHtml = `<div class="assets-lot-result-box">
            <div class="assets-lot-result-lbl">开奖号码</div>
            <div class="assets-lot-result-balls">
                ${drawn.map((n, i) => {
                    const isBlue = rules.type === 'twoball' && i === drawn.length - 1;
                    return `<span class="assets-lot-result-ball${isBlue ? ' blue' : ''}">${n}</span>`;
                }).join('')}
            </div>
        </div>`;

        if (win !== null) {
            resultHtml += `<div class="assets-lot-win-banner">
                ${win > 0 ? `🎉 恭喜中奖！获得 ${assetsFmtFull(win)}` : '未中奖，再接再厉！'}
            </div>`;
        }

        actionHtml = `<div class="assets-lot-action-row">
            <button class="assets-lot-action-btn interactive" id="assets-lot-close-btn" type="button">关闭</button>
            <button class="assets-lot-action-btn primary interactive" id="assets-lot-again-btn" type="button">再购一注</button>
        </div>`;
    } else if (rules.type === 'pick' || rules.type === 'twoball') {
        const total = rules.type === 'pick' ? rules.total : rules.red;
        const pick  = rules.type === 'pick' ? rules.pick  : rules.redPick;
        const bluePick = rules.type === 'twoball' ? rules.bluePick : 0;
        const blueTotal = rules.type === 'twoball' ? rules.blue : 0;
        const sel = assetsLotterySelection;
        const redSel = sel.filter(s => !s.startsWith('b'));
        const blueSel = sel.filter(s => s.startsWith('b'));

        const redBalls = Array.from({ length: total }, (_, i) => i + 1).map(n => {
            const key = String(n);
            const isSelected = redSel.includes(key);
            return `<span class="assets-lot-ball${isSelected ? ' selected' : ''}" data-assets-ball="${key}">${n}</span>`;
        }).join('');

        let blueBalls = '';
        if (rules.type === 'twoball') {
            blueBalls = `<div style="margin-top:10px"><div class="assets-lot-pick-label">选 ${bluePick} 个蓝球（1–${blueTotal}）</div>
            <div class="assets-lot-balls">${Array.from({ length: blueTotal }, (_, i) => i + 1).map(n => {
                const key = 'b' + n;
                const isSelected = blueSel.includes(key);
                return `<span class="assets-lot-ball blue${isSelected ? ' selected' : ''}" data-assets-ball="${key}">${n}</span>`;
            }).join('')}</div></div>`;
        }

        const canBuy = redSel.length === pick && (rules.type !== 'twoball' || blueSel.length === bluePick);
        pickerHtml = `<div class="assets-lot-pick-label">选 ${pick} 个红球（1–${total}）· 已选 ${redSel.length}/${pick}</div>
            <div class="assets-lot-balls">${redBalls}</div>${blueBalls}`;
        actionHtml = `<div class="assets-lot-action-row">
            <button class="assets-lot-action-btn interactive" id="assets-lot-quickpick-btn" type="button">随机选号</button>
            <button class="assets-lot-action-btn primary interactive" id="assets-lot-buy-btn" type="button"
                ${canBuy ? '' : 'disabled style="opacity:0.4"'}>购买 ¥${lot.price}</button>
        </div>`;
    } else if (rules.type === 'digits') {
        const sel = assetsLotterySelection;
        pickerHtml = `<div class="assets-lot-pick-label">选择 ${rules.count} 个数字（0–${rules.range - 1}）</div>
            <div class="assets-lot-balls">
                ${Array.from({ length: rules.range }, (_, i) => {
                    const key = String(i);
                    const isSelected = sel.includes(key);
                    return `<span class="assets-lot-ball${isSelected ? ' selected' : ''}" data-assets-ball="${key}">${i}</span>`;
                }).join('')}
            </div>`;
        const canBuy = sel.length === rules.count;
        actionHtml = `<div class="assets-lot-action-row">
            <button class="assets-lot-action-btn interactive" id="assets-lot-quickpick-btn" type="button">随机选号</button>
            <button class="assets-lot-action-btn primary interactive" id="assets-lot-buy-btn" type="button"
                ${canBuy ? '' : 'disabled style="opacity:0.4"'}>购买 ¥${lot.price}</button>
        </div>`;
    } else if (rules.type === 'number4') {
        const digits = (assetsLotterySelection[0] || '').padEnd(4, '_').split('');
        pickerHtml = `<div class="assets-lot-pick-label">输入4位数字（0000–9999）</div>
            <div class="assets-lot-digit-input">
                <input class="assets-lot-digit interactive" id="assets-lot-digit-input" type="number"
                    min="0" max="9999" placeholder="1234" maxlength="4"
                    value="${assetsLotterySelection[0] || ''}"/>
            </div>`;
        actionHtml = `<div class="assets-lot-action-row">
            <button class="assets-lot-action-btn interactive" id="assets-lot-quickpick-btn" type="button">随机</button>
            <button class="assets-lot-action-btn primary interactive" id="assets-lot-buy-btn" type="button">购买 ¥${lot.price}</button>
        </div>`;
    } else if (rules.type === 'scratch') {
        const symbols = ['★', '♦', '♣', '♥', '7', '¥'];
        pickerHtml = `<div class="assets-lot-pick-label">即开型 · 点击购买即刻揭晓</div>
            <div class="assets-scratch-reels" id="assets-scratch-reels">
                ${Array.from({ length: rules.reels }, () => `<div class="assets-scratch-reel">?</div>`).join('')}
            </div>`;
        actionHtml = `<div class="assets-lot-action-row">
            <button class="assets-lot-action-btn interactive" id="assets-lot-close-btn" type="button">关闭</button>
            <button class="assets-lot-action-btn primary interactive" id="assets-lot-buy-btn" type="button">刮开 ¥${lot.price}</button>
        </div>`;
    }

    el.innerHTML = `
        <div class="assets-lot-modal-tag">${assetsEsc(lot.tag)}</div>
        <div class="assets-lot-modal-name">${assetsEsc(lot.name)}</div>
        <div class="assets-lot-modal-desc">${assetsEsc(lot.desc)}</div>
        ${pickerHtml}
        ${resultHtml}
        ${actionHtml}`;

    el.querySelectorAll('[data-assets-ball]').forEach(ball => {
        ball.addEventListener('click', () => {
            const key = ball.getAttribute('data-assets-ball');
            assetsToggleLotteryBall(lot, key);
        });
    });

    document.getElementById('assets-lot-buy-btn')?.addEventListener('click', () => assetsBuyLottery(lot));
    document.getElementById('assets-lot-quickpick-btn')?.addEventListener('click', () => assetsQuickPick(lot));
    document.getElementById('assets-lot-close-btn')?.addEventListener('click', () => {
        document.getElementById('assets-lottery-modal').hidden = true;
    });
    document.getElementById('assets-lot-again-btn')?.addEventListener('click', () => {
        assetsLotterySelection = [];
        assetsLotteryDrawResult = null;
        assetsRenderLotteryModal(lot, null, null);
    });
    document.getElementById('assets-lot-digit-input')?.addEventListener('input', e => {
        assetsLotterySelection = [String(e.target.value).slice(0, 4)];
    });
}

function assetsToggleLotteryBall(lot, key) {
    const { rules } = lot;
    const isBlue = key.startsWith('b');
    const redSel  = assetsLotterySelection.filter(s => !s.startsWith('b'));
    const blueSel = assetsLotterySelection.filter(s => s.startsWith('b'));
    const maxRed  = rules.pick || rules.count || 0;
    const maxBlue = rules.bluePick || 0;

    if (isBlue) {
        if (blueSel.includes(key)) {
            assetsLotterySelection = assetsLotterySelection.filter(s => s !== key);
        } else if (blueSel.length < maxBlue) {
            assetsLotterySelection.push(key);
        }
    } else {
        if (assetsLotterySelection.includes(key)) {
            assetsLotterySelection = assetsLotterySelection.filter(s => s !== key);
        } else if (redSel.length < maxRed) {
            assetsLotterySelection.push(key);
        }
    }
    assetsRenderLotteryModal(lot, null, null);
}

function assetsQuickPick(lot) {
    const { rules } = lot;
    assetsLotterySelection = [];
    if (rules.type === 'pick') {
        const pool = Array.from({ length: rules.total }, (_, i) => String(i + 1));
        while (assetsLotterySelection.length < rules.pick) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            if (!assetsLotterySelection.includes(pick)) assetsLotterySelection.push(pick);
        }
    } else if (rules.type === 'digits') {
        const used = new Set();
        while (assetsLotterySelection.length < rules.count) {
            const n = Math.floor(Math.random() * rules.range);
            if (!used.has(n)) { used.add(n); assetsLotterySelection.push(String(n)); }
        }
    } else if (rules.type === 'twoball') {
        const red = new Set();
        while (red.size < rules.redPick) red.add(Math.floor(Math.random() * rules.red) + 1);
        assetsLotterySelection = [...red].map(String);
        assetsLotterySelection.push('b' + (Math.floor(Math.random() * rules.blue) + 1));
    } else if (rules.type === 'number4') {
        assetsLotterySelection = [String(Math.floor(Math.random() * 10000)).padStart(4, '0')];
    }
    assetsRenderLotteryModal(lot, null, null);
}

function assetsBuyLottery(lot) {
    if (!assetsState) return;
    if (assetsState.cash < lot.price) { assetsShowToast('余额不足'); return; }
    assetsState.cash -= lot.price;
    assetsState.lottery.totalSpent += lot.price;

    const { rules } = lot;
    let drawn = [], win = 0;

    if (rules.type === 'scratch') {
        const symbols = ['★', '♦', '♣', '♥', '7', '¥'];
        drawn = Array.from({ length: rules.reels }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        const reelsEl = document.getElementById('assets-scratch-reels');
        if (reelsEl) {
            const reelEls = reelsEl.querySelectorAll('.assets-scratch-reel');
            reelEls.forEach((r, i) => {
                setTimeout(() => {
                    r.textContent = drawn[i];
                    r.classList.add('revealed');
                }, i * 200 + 150);
            });
        }
        const counts = {};
        drawn.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
        const max = Math.max(...Object.values(counts));
        if (max >= 5) win = lot.jackpot;
        else if (max >= 4) win = Math.round(lot.jackpot * 0.1);
        else if (max >= 3) { const which = Object.entries(counts).find(([,v]) => v >= 3); win = which[0] === '¥' ? 100 : 50; }

        if (win > 0) assetsState.cash += win;
        assetsState.lottery.totalWon += win;
        assetsState.lottery.history.push({ type: lot.id, date: assetsTodayKey(), spent: lot.price, won: win });
        assetsSave();
        assetsUpdateHeaderTotal();
        assetsLotteryDrawResult = { drawn, win };

        setTimeout(() => {
            const msg = win > 0 ? `🎉 中奖了！获得 ${assetsFmtFull(win)}` : '未中奖，运气不佳~';
            assetsShowToast(msg, 3000);
            const winBanner = document.createElement('div');
            winBanner.className = 'assets-lot-win-banner';
            winBanner.textContent = win > 0 ? `🎉 恭喜中奖！获得 ${assetsFmtFull(win)}` : '未中奖，再接再厉！';
            const actRow = document.querySelector('.assets-lot-action-row');
            if (actRow) actRow.insertAdjacentElement('beforebegin', winBanner);
            document.getElementById('assets-lot-buy-btn').textContent = '再刮一张';
            const digitInput = document.getElementById('assets-lot-digit-input');
            if (digitInput) {
                assetsLotterySelection = [];
                assetsRenderLotteryModal(lot, null, null);
            }
        }, rules.reels * 200 + 300);

        const scBadge = document.getElementById('assets-lottery-cash');
        if (scBadge) scBadge.textContent = assetsFmt(assetsState.cash);
        return;
    }

    if (rules.type === 'pick') {
        const pool = Array.from({ length: rules.total }, (_, i) => i + 1);
        while (drawn.length < rules.pick) {
            const idx = Math.floor(Math.random() * pool.length);
            drawn.push(pool.splice(idx, 1)[0]);
        }
        drawn.sort((a, b) => a - b);
        const sel = assetsLotterySelection.map(Number);
        const match = sel.filter(n => drawn.includes(n)).length;
        if (match === 6) win = lot.jackpot;
        else if (match === 5) win = 5000;
        else if (match === 4) win = 100;
        else if (match === 3) win = 10;
    } else if (rules.type === 'digits') {
        drawn = Array.from({ length: rules.count }, () => Math.floor(Math.random() * rules.range));
        const sel = assetsLotterySelection.map(Number);
        const match = sel.every((n, i) => n === drawn[i]);
        if (match) win = lot.jackpot;
        else {
            const partMatch = sel.filter((n, i) => n === drawn[i]).length;
            if (partMatch === 2) win = 50;
        }
    } else if (rules.type === 'twoball') {
        const redPool = Array.from({ length: rules.red }, (_, i) => i + 1);
        const redDrawn = [];
        while (redDrawn.length < rules.redPick) {
            const idx = Math.floor(Math.random() * redPool.length);
            redDrawn.push(redPool.splice(idx, 1)[0]);
        }
        redDrawn.sort((a, b) => a - b);
        const blueDrawn = Math.floor(Math.random() * rules.blue) + 1;
        drawn = [...redDrawn, blueDrawn];

        const selRed = assetsLotterySelection.filter(s => !s.startsWith('b')).map(Number);
        const selBlue = assetsLotterySelection.filter(s => s.startsWith('b')).map(s => Number(s.slice(1)));
        const redMatch = selRed.filter(n => redDrawn.includes(n)).length;
        const blueMatch = selBlue[0] === blueDrawn ? 1 : 0;
        if (redMatch === 6 && blueMatch === 1) win = lot.jackpot;
        else if (redMatch === 6) win = 100000;
        else if (redMatch === 5 && blueMatch === 1) win = 3000;
        else if (redMatch === 5 || (redMatch === 4 && blueMatch === 1)) win = 200;
        else if (redMatch === 4 || (redMatch === 3 && blueMatch === 1)) win = 10;
        else if (blueMatch === 1) win = 5;
    } else if (rules.type === 'number4') {
        drawn = [String(Math.floor(Math.random() * rules.range)).padStart(4, '0')];
        const sel = String(assetsLotterySelection[0] || '').padStart(4, '0');
        if (sel === drawn[0]) {
            win = lot.jackpot;
        } else {
            const matches = [...sel].filter((d, i) => d === drawn[0][i]).length;
            if (matches === 3) win = 500;
            else if (matches === 2) win = 50;
        }
    }

    if (win > 0) assetsState.cash += win;
    assetsState.lottery.totalWon += win;
    assetsState.lottery.history.push({ type: lot.id, date: assetsTodayKey(), spent: lot.price, won: win, sel: assetsLotterySelection.slice() });
    assetsSave();
    assetsUpdateHeaderTotal();

    const badge2 = document.getElementById('assets-lottery-cash');
    if (badge2) badge2.textContent = assetsFmt(assetsState.cash);

    assetsLotteryDrawResult = { drawn, win };
    assetsRenderLotteryModal(lot, drawn, win);
}

/* ═══════════════════════════════════════
   Wallet page
   ═══════════════════════════════════════ */

function assetsGetTotalAssets() {
    if (!assetsState) return 0;
    let total = assetsState.cash;
    Object.entries(assetsState.holdings).forEach(([id, h]) => {
        const price = assetsState.prices[id] || 0;
        total += price * h.shares;
    });
    return Math.round(total * 100) / 100;
}

function assetsRenderWalletPage() {
    const hero = document.getElementById('assets-balance-hero');
    const bdList = document.getElementById('assets-breakdown-list');
    const payRow = document.getElementById('assets-payment-row');
    if (!hero || !bdList || !payRow || !assetsState) return;

    const total = assetsGetTotalAssets();
    const stockVal = total - assetsState.cash;
    const lotteryWon = assetsState.lottery.totalWon || 0;
    const salaryTotal = assetsState.work.totalEarned || 0;

    hero.innerHTML = `
        <div class="assets-balance-label">NET WORTH</div>
        <div class="assets-balance-amount">¥ <strong>${(total / 10000).toFixed(2)}万</strong></div>
        <div class="assets-balance-sub">
            现金 ${assetsFmt(assetsState.cash)} · 持仓 ${assetsFmt(stockVal)}
        </div>`;

    bdList.innerHTML = [
        { name: '活期存款', desc: '可随时使用', amount: assetsState.cash },
        { name: '股票持仓', desc: `${Object.keys(assetsState.holdings).length} 只持仓`, amount: stockVal },
        { name: '薪资收入', desc: '累计到账', amount: salaryTotal },
        { name: '彩票收益', desc: `消费 ${assetsFmt(assetsState.lottery.totalSpent)}`, amount: lotteryWon }
    ].map(item => `
        <div class="assets-breakdown-item">
            <div>
                <div class="assets-bd-name">${assetsEsc(item.name)}</div>
                <div class="assets-bd-desc">${assetsEsc(item.desc)}</div>
            </div>
            <div class="assets-bd-amount">${assetsFmt(item.amount)}</div>
        </div>`).join('');

    payRow.innerHTML = ASSETS_PAYMENT_TOOLS.map(tool => `
        <div class="assets-payment-tool interactive" data-assets-pay="${assetsEsc(tool.name)}">
            <div class="assets-payment-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">${tool.icon}</svg>
            </div>
            <span class="assets-payment-name">${assetsEsc(tool.name)}</span>
        </div>`).join('');
}

/* ═══════════════════════════════════════
   Header total
   ═══════════════════════════════════════ */

function assetsUpdateHeaderTotal() {
    const el = document.getElementById('assets-header-total');
    if (!el) return;
    el.textContent = assetsFmt(assetsGetTotalAssets());
    const badge = document.getElementById('assets-lottery-cash');
    if (badge) badge.textContent = assetsFmt(assetsState.cash);
}

/* ═══════════════════════════════════════
   Tab switching
   ═══════════════════════════════════════ */

function assetsSetTab(tab) {
    assetsActiveTab = tab;
    document.querySelectorAll('.assets-tab').forEach(btn => {
        const active = btn.getAttribute('data-assets-tab') === tab;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.assets-page').forEach(page => {
        const show = page.getAttribute('data-assets-page') === tab;
        page.classList.toggle('active', show);
        page.hidden = !show;
    });
    if (tab === 'finance') assetsRenderFinancePage();
    if (tab === 'work') assetsRenderWorkPage();
    if (tab === 'lottery') assetsRenderLotteryPage();
    if (tab === 'wallet') assetsRenderWalletPage();
}

/* ═══════════════════════════════════════
   Clock tick (1s interval)
   ═══════════════════════════════════════ */

function assetsTickClock() {
    const el = document.getElementById('assets-punch-clock');
    if (!el) return;
    const d = new Date();
    el.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    const stockClock = document.getElementById('assets-stock-clock');
    if (stockClock) {
        stockClock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
}

/* ═══════════════════════════════════════
   App lifecycle
   ═══════════════════════════════════════ */

function getAssetsApp() {
    return document.getElementById('assets-app');
}

async function openAssetsApp() {
    const app = getAssetsApp();
    if (!app) return;
    document.body.classList.remove('edit-mode');
    if (typeof closeSettingsApp  === 'function') closeSettingsApp(true);
    if (typeof closeLetterApp    === 'function') closeLetterApp(true);
    if (typeof closePrivateApp   === 'function') closePrivateApp(true);
    if (typeof closePrologueApp  === 'function') closePrologueApp(true);
    if (typeof closeStyleApp     === 'function') closeStyleApp(true);
    if (typeof closeCommunityApp === 'function') closeCommunityApp(true);
    if (typeof closeEncounterApp === 'function') closeEncounterApp(true);
    if (typeof closeDossierApp   === 'function') closeDossierApp(true);
    if (typeof closeWanyeApp     === 'function') closeWanyeApp(true);
    if (typeof closeLingguangApp === 'function') closeLingguangApp(true);
    if (typeof closeGuideApp     === 'function') closeGuideApp(true);
    if (typeof closePhoneApp     === 'function') closePhoneApp(true);

    await hydrateAssetsState();
    assetsUpdateHeaderTotal();
    assetsSetTab(assetsActiveTab || 'finance');

    if (!assetsPriceTick) assetsPriceTick = setInterval(assetsTickPrices, 5000);
    if (!assetsClockTick) assetsClockTick = setInterval(assetsTickClock, 1000);

    document.body.classList.add('assets-open');
    app.classList.add('active');
}

function closeAssetsApp(instant = false) {
    const app = getAssetsApp();
    if (!app) return;

    clearInterval(assetsPriceTick);
    clearInterval(assetsClockTick);
    assetsPriceTick = null;
    assetsClockTick = null;

    document.getElementById('assets-stock-modal').hidden = true;
    document.getElementById('assets-lottery-modal').hidden = true;

    if (instant) {
        const prev = app.style.transition;
        app.style.transition = 'none';
        app.classList.remove('active');
        app.offsetHeight;
        requestAnimationFrame(() => { app.style.transition = prev; });
    } else {
        app.classList.remove('active');
    }
    document.body.classList.remove('assets-open');
}

/* ═══════════════════════════════════════
   Event binding
   ═══════════════════════════════════════ */

function bindAssetsEvents() {
    const app = getAssetsApp();
    if (!app || assetsEventsBound) return;
    assetsEventsBound = true;
    void hydrateAssetsState();

    document.getElementById('assets-close-title')?.addEventListener('click', e => {
        e.preventDefault();
        closeAssetsApp();
    });

    document.getElementById('assets-stock-modal-close')?.addEventListener('click', () => {
        document.getElementById('assets-stock-modal').hidden = true;
    });

    document.getElementById('assets-lottery-modal-close')?.addEventListener('click', () => {
        document.getElementById('assets-lottery-modal').hidden = true;
    });

    document.getElementById('assets-stock-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) e.currentTarget.hidden = true;
    });

    document.getElementById('assets-lottery-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) e.currentTarget.hidden = true;
    });

    /* Tab bar */
    app.addEventListener('click', e => {
        const tab = e.target.closest('[data-assets-tab]');
        if (tab) { e.preventDefault(); assetsSetTab(tab.getAttribute('data-assets-tab')); return; }

        const stockCard = e.target.closest('[data-assets-stock]');
        if (stockCard) { e.preventDefault(); assetsOpenStockModal(stockCard.getAttribute('data-assets-stock')); return; }

        const tradeBtn = e.target.closest('[data-assets-trade]');
        if (tradeBtn) { e.preventDefault(); assetsHandleStockTrade(tradeBtn.getAttribute('data-assets-trade')); return; }

        const lotBtn = e.target.closest('[data-assets-lottery]');
        if (lotBtn) { e.preventDefault(); assetsOpenLotteryModal(lotBtn.getAttribute('data-assets-lottery')); return; }

        const acceptBtn = e.target.closest('[data-assets-accept]');
        if (acceptBtn) { e.preventDefault(); assetsAcceptJob(acceptBtn.getAttribute('data-assets-accept')); return; }

        const declineBtn = e.target.closest('[data-assets-decline]');
        if (declineBtn) { e.preventDefault(); assetsDeclineJob(declineBtn.getAttribute('data-assets-decline')); return; }

        const payTool = e.target.closest('[data-assets-pay]');
        if (payTool) {
            const toolName = payTool.getAttribute('data-assets-pay');
            const tool = ASSETS_PAYMENT_TOOLS.find(t => t.name === toolName);
            if (tool) assetsShowToast(tool.msg);
            return;
        }
    });

    app.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
    app.addEventListener('mousedown', e => e.stopPropagation());

    document.querySelector('.home-indicator')?.addEventListener('click', () => {
        if (getAssetsApp()?.classList.contains('active')) closeAssetsApp(true);
    });
}

bindAssetsEvents();

window.openAssetsApp = openAssetsApp;
window.closeAssetsApp = closeAssetsApp;
