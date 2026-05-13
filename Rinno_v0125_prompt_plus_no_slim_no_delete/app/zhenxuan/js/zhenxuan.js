const ZHENXUAN_STATE_KEY = 'rinno_zhenxuan_state_v1';
const ZHENXUAN_API_SETTINGS_KEY = 'api_parameter_config';
const ZHENXUAN_MAX_CUSTOM_CATEGORIES = 8;
const ZHENXUAN_SEARCH_LIMIT = 32;
const ZHENXUAN_GENERATED_ITEM_COUNT = 6;
const ZHENXUAN_GENERATION_TIMEOUT_MS = 45000;
const ZHENXUAN_ALLOWED_TONES = ['blush', 'pearl', 'champagne', 'olive', 'night'];
const ZHENXUAN_SHIPPING_COMPANIES = ['云鸽速运', '月鹿快递', '星澜物流', 'Rinno 专送', '银杏驿达', '黑金同城配'];
const ZHENXUAN_DELIVERY_EVENTS = ['仓库已完成柔光包装复核', '包裹已离开发货仓', '运输车辆已抵达分拨中心', '快件正在派往附近驿站', '驿站已签收并完成入库'];
let zhenxuanLogisticsTimer = 0;

let zhenxuanEventsBound = false;
let activeZhenxuanPage = 'home';
let zhenxuanToastTimer = 0;
let zhenxuanGenerating = false;
let zhenxuanState = createDefaultZhenxuanState();

const ZHENXUAN_PAGES = {
    home: {
        note: '会随主题色流动的轻奢买手杂志。'
    },
    messages: {
        note: '这里会开始你和商家的全部对话。'
    },
    cart: {
        note: '购物车初始为空，用于结算和送礼物。'
    },
    profile: {
        note: '订单、收藏、店铺与足迹都收在这里。'
    }
};

const ZHENXUAN_BASE_CATEGORIES = [
    { id: 'recommend', label: '推荐' },
    { id: 'women', label: '女装' },
    { id: 'beauty', label: '美妆' },
    { id: 'delivery', label: '外卖' },
    { id: 'r18', label: 'R18' },
    { id: 'luxury', label: '奢侈品' }
];

const ZHENXUAN_PROFILE_ACTION_MESSAGES = {
    address: '定位入口已预留，后续可以继续承接地址、到店与礼赠去向。',
    service: '官方客服入口已预留，后续可以直接联系平台客服。',
    settings: '甄选设置入口已预留，后续可以继续细化个人偏好。'
};

const ZHENXUAN_SERVICE_PERSONA_VERSION = 'v0111-diverse';
const ZHENXUAN_SERVICE_PERSONAS = [
    {
        id: 'gentle',
        name: '温柔细致型',
        tone: '慢节奏、先安抚，再把事情拆开说清楚。',
        greeting: '您好呀，我在。您慢慢说，商品、发货、赠送和售后我都会逐条帮您看。',
        openers: ['我先轻轻帮您捋一下：', '您不用急，这件事可以分两步看：', '我明白您的顾虑，先看重点：'],
        closers: ['不确定的地方您继续问，我会接着看。', '您把使用场景补一句，我可以再帮您判断得更准。', '这边会尽量说得细一点，不让您自己猜。'],
        hooks: {
            shipping: ['「{product}」付款后会在 48 小时内安排随机发货，发货后会生成快递公司、物流轨迹和取件码。', '这单主要看发货节点，您在我的甄选里能看到待发货、未送达和取件码。'],
            price: ['价格以详情页显示的 {price} 为准，现在没有自动改价，我更建议先看它是否匹配您的预算和用途。'],
            aftersale: ['售后入口在订单条目里。未发货适合直接申请退款，已发货就先等物流稳定后再处理。'],
            gift: ['送给 TA 的话，结算页选“寄给TA”，收货人、手机号和门牌尽量填完整。'],
            spec: ['规格要看您的实际使用场景，自用和送人的判断会不太一样。'],
            visual: ['质感上更偏轻奢陈列感，低饱和和灰调会更稳，不太容易出错。'],
            greet: ['我在的，您直接问发货、价格、赠送、地址、售后或质感都可以。'],
            other: ['关于「{product}」我已经记下了，您可以继续说担心点，我会按细节帮您拆。']
        },
        suffixes: ['我先帮您把重点整理好。', '这个可以一步步确认。', '我会尽量说得清楚一点。']
    },
    {
        id: 'pro',
        name: '冷静专业型',
        tone: '直接给结论、路径和风险点，不闲聊。',
        greeting: '您好，这里是专属客服。请直接说明问题，我会按商品、配送、价格或售后给处理路径。',
        openers: ['结论：', '按当前信息判断：', '处理路径如下：'],
        closers: ['按这个路径操作即可。', '需要继续查的话，请补充订单或收货信息。', '页面信息更新后以最新状态为准。'],
        hooks: {
            shipping: ['{product} 支付后 48 小时内进入随机发货流程，物流、快递名和取件码会在订单状态内生成。'],
            price: ['当前价格按详情页 {price} 执行，系统不会在客服聊天内单独改价。'],
            aftersale: ['售后从订单条目发起。未发货优先退款；已发货优先等待物流状态后申请售后。'],
            gift: ['赠送订单必须确认收货人、手机号、地区和详细地址，否则虚拟物流会缺信息。'],
            spec: ['规格问题需要结合用途判断，请补充自用、送礼、预算或频率。'],
            visual: ['外观质感建议按材质、颜色稳定性和包装完整度判断，不建议只看首图。'],
            greet: ['我在。请说明要查配送、价格、售后、地址还是商品细节。'],
            other: ['已记录「{product}」咨询。请继续补充具体问题，我会给明确处理建议。']
        },
        suffixes: ['结论先给您，细节我再补充。', '建议按订单状态继续处理。', '我会按当前商品信息回答。']
    },
    {
        id: 'bright',
        name: '活泼导购型',
        tone: '热情、反应快，会主动给搭配和送礼建议，但不过度油腻。',
        greeting: '来啦，这款我可以陪您一起看。价格、质感、送礼、怎么搭都能问。',
        openers: ['我懂您想确认的点了：', '这题我会先看实用感：', '可以，这款我帮您抓重点：'],
        closers: ['想要的话，我还能继续从送礼感、价格和到货时间三个方向拆。', '您也可以直接告诉我预算，我帮您判断值不值。', '这款要不要冲，主要看您的场景。'],
        hooks: {
            shipping: ['{product} 下单后会在 48 小时内随机发货，发出以后订单里会冒出快递名、轨迹和取件码。'],
            price: ['详情页当前是 {price}，我会更建议看它在这个价位有没有“体面感”和使用频率。'],
            aftersale: ['不合适就走订单售后，未发货退款更快，发货后就按物流状态处理。'],
            gift: ['送 TA 的话记得结算页切到“寄给TA”，地址写完整会更稳，也更像一份认真送出的礼物。'],
            spec: ['规格我建议按“会不会常用、拿到手体不体面、收纳方不方便”三点看。'],
            visual: ['这款走轻奢杂志感路线，低饱和、黑金、灰调都会比较安全。'],
            greet: ['在呢，您问这款怎么送、什么时候到、值不值都可以。'],
            other: ['收到，围绕「{product}」我可以继续帮您看适不适合入手。']
        },
        suffixes: ['这款确实更适合做礼物主位。', '我会尽量给您讲得像看实物一样。', '需要我也可以继续帮您对比。']
    },
    {
        id: 'calm',
        name: '清冷少言型',
        tone: '短句、干净、少铺陈，只留下必要判断。',
        greeting: '您好。商品、配送、售后都可以问，我会直接回复重点。',
        openers: ['', '重点：', '直接说：'],
        closers: ['其余继续问。', '按页面状态为准。', '不建议绕太多。'],
        hooks: {
            shipping: ['48 小时内随机发货。发出后有快递名、轨迹和取件码。'],
            price: ['价格看详情页，当前为 {price}。'],
            aftersale: ['未发货退款。已发货走售后。'],
            gift: ['送 TA 就填 TA 地址，手机号和门牌别漏。'],
            spec: ['规格要看用途。您说场景，我给判断。'],
            visual: ['低饱和更稳。亮色风险高。'],
            greet: ['在。问。'],
            other: ['已记「{product}」。说具体问题。']
        },
        suffixes: ['重点是这个。', '其余可以继续问。', '这边按页面信息为准。']
    },
    {
        id: 'senior',
        name: '姐姐把关型',
        tone: '像认真帮你挑东西的人，会提醒体面、预算和避雷。',
        greeting: '我在，您把需求告诉我。我会按送礼、日用、预算和收货场景帮您把关。',
        openers: ['我给您把关的话，会先看这个：', '站在送礼和实用角度，我会这么判断：', '我不劝您乱买，先看关键点：'],
        closers: ['我的建议是先确认预算和收货时间，再决定是否下单。', '不急着拍，先把地址和用途确认好。', '这类东西买得体面比买得冲动重要。'],
        hooks: {
            shipping: ['{product} 付款后 48 小时内会随机发货，送礼的话一定要预留这段时间。'],
            price: ['{price} 这个价位，重点看它能不能撑住场面，不只是便宜不便宜。'],
            aftersale: ['售后从订单里申请。未发货先退款，发货后别急，等物流状态出来再处理。'],
            gift: ['寄给 TA 时，手机号和门牌必须确认好。礼物最怕不是贵不贵，是送不到。'],
            spec: ['规格要看 TA 的习惯。太大闲置，太小又显得敷衍。'],
            visual: ['我会优先选克制、耐看的颜色，别选第一眼很炸、第二眼累的。'],
            greet: ['在，您说。我先帮您拦掉不稳的选项。'],
            other: ['「{product}」可以继续看，但我会先问清楚用途，别为了页面好看就下单。']
        },
        suffixes: ['我会更看重实用和体面。', '送人前建议把地址和时间确认好。', '这个点我会帮您多留意。']
    },
    {
        id: 'atelier',
        name: '买手审美型',
        tone: '精品店买手口吻，关注材质、场景、版面和礼赠仪式感。',
        greeting: '您好，这里可以聊商品细节。我会从材质、包装、场景和礼赠完整度帮您判断。',
        openers: ['从买手视角看：', '我会先看材质和场景：', '这件的重点不在热闹，而在比例：'],
        closers: ['如果是送人，我会更偏向包装完整、气味不强、颜色克制的选择。', '页面展示只是第一层，关键还是场景是否匹配。', '它的优势主要在质感和完整度。'],
        hooks: {
            shipping: ['{product} 的发货节奏是 48 小时内随机生成，适合提前安排，不适合临时卡点。'],
            price: ['{price} 这个价格要看材质、包装和长期陈列感是否匹配。'],
            aftersale: ['售后不复杂，订单内申请即可；高质感单品建议保留物流节点再处理。'],
            gift: ['礼赠时我会先确认包装完整度、收件信息和打开时的第一眼秩序。'],
            spec: ['规格不是越大越好，比例、使用频率和陈列位置更重要。'],
            visual: ['这款适合低饱和、暗金、珍珠灰这类不吵的视觉系统。'],
            greet: ['在。您可以从材质、包装、色感或送礼场景开始问。'],
            other: ['「{product}」我会按材质、版面和场景匹配度来判断。']
        },
        suffixes: ['它的优势主要在质感和完整度。', '从礼赠角度看，这款比较稳。', '关键还是场景是否匹配。']
    },
    {
        id: 'strict',
        name: '严谨挑刺型',
        tone: '不轻易夸，会指出风险、缺点和购买前必须确认的细节。',
        greeting: '您好。我会先帮您挑问题，不会只说好听的。',
        openers: ['先挑风险：', '我不直接建议下单，先确认：', '这件有几个点要注意：'],
        closers: ['这些确认完再买更稳。', '如果这些点您能接受，再考虑下单。', '不确认就拍，后面容易麻烦。'],
        hooks: {
            shipping: ['48 小时内随机发货不是固定时间，急用不建议卡点购买。'],
            price: ['{price} 不能只看数字，要看材质、用途和售后成本是否匹配。'],
            aftersale: ['售后可以申请，但已发货后处理链路会更长，别等到最后一刻才退。'],
            gift: ['送 TA 必须核对地址和手机号，信息错了比商品不合适更麻烦。'],
            spec: ['规格如果没确认用途，买错概率很高。'],
            visual: ['颜色越特别越容易翻车，尤其是送人。'],
            greet: ['在。您问，我会先说风险。'],
            other: ['「{product}」先别急，我需要知道您最担心价格、时间还是适配。']
        },
        suffixes: ['我会先说不稳的地方。', '确认完再下单。', '别只看页面好看。']
    },
    {
        id: 'budget',
        name: '省钱规划型',
        tone: '关注预算、性价比、使用频率和是否值得买。',
        greeting: '您好，我会按预算和使用频率帮您算，不会劝您乱花钱。',
        openers: ['从值不值的角度看：', '预算优先的话：', '我先按性价比拆一下：'],
        closers: ['如果使用频率不高，可以先收藏，不一定立刻买。', '预算紧就先保留核心需求。', '能经常用到，它才算值。'],
        hooks: {
            shipping: ['配送是 48 小时内随机发货，急件可能不占优势，但普通购买可以接受。'],
            price: ['{price} 要看使用频率。经常用才值得，单纯冲动就先收藏。'],
            aftersale: ['不确定就别拖到发货后再退，未发货退款成本最低。'],
            gift: ['送礼要看关系和预算，不一定越贵越合适，体面和准确更重要。'],
            spec: ['规格选最常用的，不选看起来最豪华的。'],
            visual: ['耐看比惊艳重要，耐看的东西使用成本更低。'],
            greet: ['在，我可以帮您看值不值得买。'],
            other: ['「{product}」可以继续看，我会按预算、频率和替代品帮您判断。']
        },
        suffixes: ['我会先帮您守住预算。', '不常用就别冲动。', '收藏也算一种决策。']
    },
    {
        id: 'logistics',
        name: '物流控场型',
        tone: '像调度员，重点关注发货、路线、节点和收货风险。',
        greeting: '您好，我这边按发货和物流节点帮您看。急用、送礼、取件都可以直接问。',
        openers: ['从物流节点看：', '配送侧重点是：', '时间线给您拆开：'],
        closers: ['建议您下单后留意订单状态变化。', '取件码出现后就说明末端已经完成。', '如果是送礼，请把时间预留出来。'],
        hooks: {
            shipping: ['{product} 下单后进入 48 小时内随机发货，随后生成快递公司、轨迹、到站和取件码。'],
            price: ['价格不是物流侧问题，当前按 {price} 显示，配送节奏不因价格变化。'],
            aftersale: ['退款售后会受物流状态影响，未发货最快，运输中需要等待节点稳定。'],
            gift: ['寄给 TA 时地址越完整，后续生成物流越顺。手机号、地区、门牌缺一项都容易卡。'],
            spec: ['规格影响包装和配送稳定性，大件更建议提前下单。'],
            visual: ['包装完整度会影响收货第一眼，建议优先选不易压损的款。'],
            greet: ['在。您要查发货、到达、取件还是地址问题？'],
            other: ['「{product}」这边可以按订单节点继续跟。']
        },
        suffixes: ['我按节点说，不绕。', '时间要留余量。', '物流状态出来后会更准确。']
    },
    {
        id: 'refund',
        name: '售后守门型',
        tone: '谨慎、规则感强，擅长退款、售后和风险处理。',
        greeting: '您好。退款、退货、破损、未发货这些问题可以直接说，我会按订单状态判断。',
        openers: ['按售后规则看：', '先看订单状态：', '这个问题要分未发货和已发货：'],
        closers: ['建议保留订单和物流信息。', '不要重复提交，先等状态更新。', '这类问题按状态处理最快。'],
        hooks: {
            shipping: ['发货前后处理不同。48 小时内随机发货，状态变化后会影响退款路径。'],
            price: ['价差或优惠问题以详情页和订单价格为准，客服聊天不直接改订单金额。'],
            aftersale: ['未发货建议申请退款；已发货按退货/售后流程走，破损要保留状态记录。'],
            gift: ['赠送订单也能售后，但收货信息和订单归属要先确认清楚。'],
            spec: ['规格不合适属于常见售后原因，建议收到后先核对订单信息。'],
            visual: ['色差和质感问题要结合页面信息与收到后的实际状态判断。'],
            greet: ['在。您是退款、退货、破损，还是订单状态问题？'],
            other: ['「{product}」如果涉及售后，请先说明订单是否已经发货。']
        },
        suffixes: ['先看状态，不要急着重复操作。', '售后要留证据。', '按订单节点处理最稳。']
    },
    {
        id: 'playful',
        name: '俏皮陪聊型',
        tone: '轻松、有陪伴感，会把选择说得不沉重。',
        greeting: '我来啦。您把纠结点丢过来，我陪您一起挑，不让您一个人对着页面发呆。',
        openers: ['好，这个我懂：', '这款的小心机在这里：', '先别纠结，我帮您抓一把重点：'],
        closers: ['您再补一句用途，我就能继续往下挑。', '要不要买不急，我们先把坑排掉。', '这件可以慢慢盘，不用立刻下判断。'],
        hooks: {
            shipping: ['它是 48 小时内随机发货，发出后会自己长出快递名、轨迹和取件码。'],
            price: ['{price} 这个价格不算只看一眼就能定，要看它能不能被常用或者送得体面。'],
            aftersale: ['不合适可以走订单售后，没发货时更省心，发货后就让物流先跑完节点。'],
            gift: ['送 TA 记得填 TA 地址，礼物可以浪漫，手机号不能浪漫到漏掉。'],
            spec: ['规格要跟生活场景贴上，不然买回来只会负责变好看但不用。'],
            visual: ['它更适合低调漂亮，不适合用力过猛。'],
            greet: ['在在在，您问，我陪您挑。'],
            other: ['「{product}」我记住了，您说到底卡在价格、时间还是好不好看。']
        },
        suffixes: ['我陪您继续盘。', '别急着冲。', '先把纠结点说出来。']
    },
    {
        id: 'poetic',
        name: '氛围诗意型',
        tone: '句子有画面感，适合香氛、礼物和夜色类商品。',
        greeting: '您好。我会从气味、触感、颜色和收到时的第一眼，帮您慢慢判断。',
        openers: ['如果把它放进一个场景里看：', '它更像是这样的东西：', '我会先看它留下来的感觉：'],
        closers: ['适合不赶时间地送出去。', '它不是喧哗型，胜在余味。', '如果场景对了，它会显得更完整。'],
        hooks: {
            shipping: ['它会在 48 小时内随机启程，发出后才会有完整的轨迹和取件码。'],
            price: ['{price} 买到的不只是商品，也包括包装、场景和收到时那一瞬间的秩序。'],
            aftersale: ['如果最后不合适，订单里可以申请售后，让它停在该停的位置。'],
            gift: ['送给 TA 时，地址像信封，信息完整，礼物才不会在路上失语。'],
            spec: ['规格要贴近生活，太满会笨重，太轻又少了分量。'],
            visual: ['它更适合灰调、暗光和克制的颜色，像一页慢慢翻开的杂志。'],
            greet: ['我在。您可以问质感、气味、送礼或抵达时间。'],
            other: ['「{product}」可以继续聊，我会从氛围和实际使用一起看。']
        },
        suffixes: ['别急，好的选择需要一点留白。', '场景对了，它会更好看。', '这类东西最怕用力过猛。']
    },
    {
        id: 'vip',
        name: '贵宾管家型',
        tone: '克制、有距离感，像高端店铺的专属接待。',
        greeting: '您好，已为您接入专属咨询。商品、配送、礼赠和售后均可在这里确认。',
        openers: ['为您确认如下：', '这边为您优先看核心信息：', '按贵宾咨询口径，建议关注：'],
        closers: ['我会为您保留清晰处理路径。', '若用于礼赠，建议提前预留配送时间。', '您确认需求后，我可以继续协助判断。'],
        hooks: {
            shipping: ['{product} 付款后 48 小时内安排发货节点，后续会同步快递、轨迹与取件码。'],
            price: ['当前显示价格为 {price}，建议结合材质、包装和赠礼场合判断。'],
            aftersale: ['售后可在订单页提交，系统将根据未发货、运输中或已签收状态处理。'],
            gift: ['礼赠订单请优先确认 TA 的收货信息，避免影响派送与收礼体验。'],
            spec: ['规格建议按使用场景和收礼对象习惯确认。'],
            visual: ['这款更适合克制、干净的陈列方式，能保留高级感。'],
            greet: ['您好，我在。请说明您想确认的事项。'],
            other: ['关于「{product}」的咨询已记录，我会继续为您按需求判断。']
        },
        suffixes: ['这边会为您保持跟进。', '建议以当前页面状态为准。', '我会优先保证信息清楚。']
    },
    {
        id: 'blunt',
        name: '直白毒舌型',
        tone: '话很直，不会硬夸，但仍然解决问题。',
        greeting: '在。您问，我直接说，不给您灌漂亮话。',
        openers: ['直说：', '别被页面带跑，重点是：', '这事没那么复杂：'],
        closers: ['能接受就买，不能接受就别勉强。', '别为了好看硬冲。', '您要是急用，我不建议赌。'],
        hooks: {
            shipping: ['48 小时内随机发货，不是立刻发。急用别赌。'],
            price: ['{price} 不代表一定值，常用才值，不用就是摆设。'],
            aftersale: ['不想要就趁未发货退。发了再折腾，麻烦会多。'],
            gift: ['送 TA 地址别写错，这种错误最没必要。'],
            spec: ['规格没想清楚就别拍，买错了只会占地方。'],
            visual: ['颜色别太花。花的看图好，拿到手容易后悔。'],
            greet: ['在，问重点。'],
            other: ['「{product}」先说您到底纠结什么，不然只能泛泛判断。']
        },
        suffixes: ['我话直，但省您后悔。', '先别冲动。', '重点就这几个。']
    },
    {
        id: 'foodie',
        name: '生活烟火型',
        tone: '偏日常、亲近，尤其适合外卖、甜品和生活小物。',
        greeting: '在呢。您要是看外卖、甜品或日常小物，我会按实际好不好用来讲。',
        openers: ['按日常使用看：', '说得生活一点：', '如果今天就要用：'],
        closers: ['适合就下，不适合别占桌面。', '日常东西不用太玄，舒服就好。', '您说一下几个人用，我能判断更准。'],
        hooks: {
            shipping: ['这类订单 48 小时内随机发货或派送，后续状态会在订单里更新。'],
            price: ['{price} 要看份量、使用频率和当下需求，不一定越贵越好。'],
            aftersale: ['不合适就从订单里处理，未发货最好退。'],
            gift: ['送 TA 的话，地址和电话一定写准，别让礼物变成找件游戏。'],
            spec: ['规格按人数和使用频率选，别只看图上的氛围。'],
            visual: ['好看是一方面，拿到手方便、顺手更重要。'],
            greet: ['在呢，您想问味道、送达、价格还是适不适合送人？'],
            other: ['「{product}」可以看，您告诉我是自用还是送人，我按生活场景说。']
        },
        suffixes: ['日常用得上才是真的值。', '别买回来只负责好看。', '我按实际体验帮您看。']
    },
    {
        id: 'night',
        name: '夜色低语型',
        tone: '低声、克制、暧昧但不越界，适合私享礼物和夜晚氛围。',
        greeting: '我在。夜色、香气、私享礼盒这类问题可以慢慢问，我会说得克制一点。',
        openers: ['低声说，这件的重点是：', '如果是夜里使用，我会看：', '它适不适合，要看边界和氛围：'],
        closers: ['适合留一点距离，不适合太用力。', '确认对象和场景后再送，会更稳。', '这类礼物最重要的是分寸。'],
        hooks: {
            shipping: ['它同样是 48 小时内随机发货，送礼要给夜色留一点时间。'],
            price: ['{price} 买的是氛围和完整度，前提是对方能接受这种表达。'],
            aftersale: ['不合适就从订单里处理，不要拖到已经发货后才犹豫。'],
            gift: ['送 TA 前先确认边界和地址。礼物可以暧昧，信息要清楚。'],
            spec: ['规格要克制，太满会压迫，太轻又没有存在感。'],
            visual: ['黑金、乌木、玫瑰灰更稳，别选太直白的东西。'],
            greet: ['在。您可以问包装、边界、送礼或配送。'],
            other: ['「{product}」我会按氛围、边界和礼赠完整度来判断。']
        },
        suffixes: ['分寸比惊艳重要。', '别把礼物送得太吵。', '它更适合慢一点。']
    },
    {
        id: 'designer',
        name: '设计师挑色型',
        tone: '关注色彩、比例、材质和页面审美一致性。',
        greeting: '您好，我会从颜色、比例、材质和整体搭配帮您看这件是否协调。',
        openers: ['从视觉系统看：', '颜色和比例上：', '如果按搭配来判断：'],
        closers: ['建议选择能和现有风格相容的版本。', '不要只看单品，放进整体里才知道好不好。', '色彩克制会更耐看。'],
        hooks: {
            shipping: ['配送 48 小时内随机发货，和视觉选择无关，但送礼要预留时间。'],
            price: ['{price} 要看材质和设计完成度是否支撑这个视觉。'],
            aftersale: ['如果收到后颜色不适配，可从订单页走售后，但先保留状态信息。'],
            gift: ['送礼建议选低饱和、包装完整、视觉边界清楚的款。'],
            spec: ['规格要看比例，过大压空间，过小没有存在感。'],
            visual: ['它适合灰调、珍珠白、暗金或低饱和色，不适合高对比乱搭。'],
            greet: ['在。您想看颜色、材质、搭配还是包装？'],
            other: ['「{product}」我会按颜色、材质和整体比例帮您判断。']
        },
        suffixes: ['整体协调比单点惊艳重要。', '颜色不要太满。', '材质要撑得住版面。']
    },
    {
        id: 'luxe',
        name: '高奢鉴别型',
        tone: '偏高端消费视角，看工艺、五金、收藏感和礼单层级。',
        greeting: '您好，我会按工艺、五金、材质和礼赠层级帮您判断。',
        openers: ['从高奢判断看：', '这件要看工艺而不是热闹：', '真正撑价值的是：'],
        closers: ['如果是重要礼单，建议选更稳的材质和颜色。', '高价单品不要被首图影响，细节更关键。', '收藏感要靠工艺，不靠堆字。'],
        hooks: {
            shipping: ['高价商品也遵循 48 小时内随机发货，建议提前下单，不要临时卡点。'],
            price: ['{price} 需要看工艺、五金、材质和品牌感是否完整。'],
            aftersale: ['售后可走订单流程，高价单品建议保留物流与状态信息。'],
            gift: ['礼赠要看层级匹配，收件信息和包装完整度不能出错。'],
            spec: ['规格要与使用身份和场合匹配，过度张扬反而掉价。'],
            visual: ['黑金、母贝、粒面皮革这类元素更容易撑住高级感。'],
            greet: ['您好。您想看工艺、价格、礼赠还是售后？'],
            other: ['「{product}」要按工艺、材质和礼单等级判断。']
        },
        suffixes: ['细节比声量重要。', '贵不等于稳，稳才显贵。', '建议看工艺完成度。']
    },
    {
        id: 'minimal',
        name: '极简断舍离型',
        tone: '极简、反消费冲动，帮用户判断是否真的需要。',
        greeting: '在。先确认您是否真的需要，再决定要不要买。',
        openers: ['先减法判断：', '只保留必要信息：', '如果它不能被经常使用：'],
        closers: ['不需要就别买。', '能替代现有物品，再考虑。', '让它有位置，再下单。'],
        hooks: {
            shipping: ['48 小时内随机发货。急用不稳，不急再说。'],
            price: ['{price} 不是重点，重点是它会不会被长期使用。'],
            aftersale: ['犹豫就别等发货后再退，未发货处理更简单。'],
            gift: ['送礼也要克制。对方用不上，再贵也只是负担。'],
            spec: ['选最小可用规格，不选最大声的规格。'],
            visual: ['颜色越克制，留存时间越长。'],
            greet: ['在。先说用途。'],
            other: ['「{product}」先判断需要，不先判断喜欢。']
        },
        suffixes: ['少买错，比多买对更重要。', '先留白。', '冲动不是需求。']
    }
];

function getZhenxuanServicePersona(seed = '') {
    const list = ZHENXUAN_SERVICE_PERSONAS;
    if (!list.length) return { id: 'pro', name: '冷静专业型', tone: '', greeting: '您好，请问有什么可以帮您？', suffixes: ['我会继续为您处理。'] };
    const hash = typeof hashZhenxuanSeed === 'function' ? hashZhenxuanSeed(seed || 'official') : String(seed || 'official').length;
    return list[Math.abs(hash) % list.length] || list[0];
}

function getZhenxuanServicePersonaById(id, seed = '') {
    const found = ZHENXUAN_SERVICE_PERSONAS.find(item => item.id === id);
    return found || getZhenxuanServicePersona(seed);
}

const ZHENXUAN_CATEGORY_PRESETS = {
    recommend: {
        kicker: 'EDITORIAL / RECOMMENDED',
        headline: '把当季礼赠、轻奢热卖与主题色一起排进首页。',
        copy: '像翻开一本轻杂志：首页保持留白、柔光与轻盈陈列，让每次浏览都带一点被精心挑过的感觉。',
        moods: ['今日精选正在换页。', '轻奢陈列与柔和配色一起呼吸。', '适合送礼，也适合留给自己。'],
        items: [
            { name: '丝缎月光礼盒', price: '¥699', tag: 'GIFT', meta: '限量礼赠', note: '缎面盒型与烫金小卡一起收进同一份仪式感。', tone: 'blush' },
            { name: '雾面羊绒披肩', price: '¥1,280', tag: 'SOFT', meta: '轻奢面料', note: '偏暖的柔雾灰调，适合在主题色里做同频搭配。', tone: 'pearl' },
            { name: '玫瑰乌龙香氛', price: '¥359', tag: 'SCENT', meta: '日常氛围', note: '开场是茶香与花瓣感，尾调温柔，不会过分张扬。', tone: 'coral' },
            { name: '夜金真皮卡包', price: '¥920', tag: 'DAILY', meta: '低调金属感', note: '结构干净，边角和金属件更显高级。', tone: 'champagne' }
        ]
    },
    women: {
        kicker: 'WOMEN / EDIT',
        headline: '把女装页做成一张干净的时装编辑版面。',
        copy: '更在意肩线、垂坠感与版型呼吸，色阶跟随主题色微调，保持轻奢但不厚重。',
        moods: ['这一页更适合看材质。', '版型与留白一起决定高级感。', '换个主题色，整页氛围也会换。'],
        items: [
            { name: '收腰羊毛长大衣', price: '¥2,680', tag: 'COAT', meta: '编辑推荐', note: '肩线挺括但不生硬，适合搭配冷暖不同主题。', tone: 'pearl' },
            { name: '丝光衬衫连衣裙', price: '¥1,560', tag: 'DRESS', meta: '轻杂志风', note: '光感很轻，落在页面里会有柔和的折射效果。', tone: 'blush' },
            { name: '细带高跟凉鞋', price: '¥998', tag: 'SHOES', meta: '新季上架', note: '线条够简，适合做整页视觉收束。', tone: 'champagne' },
            { name: '珍珠灰托特包', price: '¥1,990', tag: 'BAG', meta: '通勤友好', note: '立体感强，但整体气质依旧安静。', tone: 'night' }
        ]
    },
    beauty: {
        kicker: 'BEAUTY / VANITY',
        headline: '美妆页更像香气与镜面光泽的采样本。',
        copy: '不堆满信息，而是用少量高密度单品维持页面节奏，让视觉像玻璃台面一样干净。',
        moods: ['香气、妆感与容器一起上场。', '只保留会让人停下来的那一点光。', '这一页更偏向静态陈列。'],
        items: [
            { name: '雾玫唇釉套组', price: '¥269', tag: 'LIP', meta: '镜面雾感', note: '两支入，色调从柔粉到低饱和玫瑰都很实穿。', tone: 'coral' },
            { name: '夜幕修护精华', price: '¥620', tag: 'CARE', meta: '晚间修护', note: '玻璃瓶身在深色主题下会更有轻奢感。', tone: 'night' },
            { name: '柔雾定妆粉饼', price: '¥318', tag: 'BASE', meta: '持妆干净', note: '适合喜欢无粉感但要求细腻妆效的人。', tone: 'pearl' },
            { name: '茶感白麝香喷雾', price: '¥430', tag: 'SCENT', meta: '轻香路线', note: '不甜腻，尾调很贴肤，像清洁过的衬衫领口。', tone: 'champagne' }
        ]
    },
    delivery: {
        kicker: 'DELIVERY / DAILY',
        headline: '外卖页保持轻巧，像城市里快速送达的一页清单。',
        copy: '把热度、口味与送礼属性简洁编排，既实用也保留一点轻奢的页面秩序。',
        moods: ['今天更适合点一份干净的安慰。', '礼物和晚餐都可以很体面。', '城市速度也能拥有杂志感。'],
        items: [
            { name: '奶油蘑菇烩饭', price: '¥59', tag: 'HOT', meta: '30 分钟送达', note: '奶香厚度适中，适合做晚间加餐。', tone: 'champagne' },
            { name: '青提气泡甜点杯', price: '¥36', tag: 'NEW', meta: '冷藏甜品', note: '包装足够漂亮，送人时也不会失礼。', tone: 'blush' },
            { name: '轻盐烤鸡沙拉', price: '¥48', tag: 'LIGHT', meta: '编辑健康餐', note: '清爽、份量稳定，页面气质也更轻。', tone: 'olive' },
            { name: '深夜花束茶饮', price: '¥29', tag: 'DRINK', meta: '夜间上新', note: '适合在 R18 或夜幕金主题下切换浏览。', tone: 'night' }
        ]
    },
    r18: {
        kicker: 'R18 / PRIVATE SELECT',
        headline: 'R18 分组保留神秘感，只做暧昧与夜色氛围的克制陈列。',
        copy: '不直接喧哗，而是把深夜香气、丝缎触感和私享礼盒收在一页，维持轻奢与边界感。',
        moods: ['夜色更适合低声说话。', '把暧昧做成不露声色的陈列。', '这一页保留一点只属于深夜的留白。'],
        items: [
            { name: '午夜丝缎睡袍', price: '¥468', tag: 'NIGHT', meta: '私享系列', note: '偏深色光泽，在夜幕金主题下很有气场。', tone: 'night' },
            { name: '乌木玫瑰蜡烛', price: '¥299', tag: 'MOOD', meta: '氛围单品', note: '更适合营造环境，不强调视觉冲击。', tone: 'coral' },
            { name: '深夜限定礼盒', price: '¥888', tag: 'BOX', meta: '双人礼赠', note: '包装更注重克制感，整体偏私密收藏路线。', tone: 'champagne' },
            { name: '薄纱香氛喷雾', price: '¥219', tag: 'SCENT', meta: '靠近皮肤', note: '清透不闷，属于会留在余味里的那种香。', tone: 'blush' }
        ]
    },
    luxury: {
        kicker: 'LUXURY / HERITAGE',
        headline: '奢侈品页更强调材质、工艺与继承感。',
        copy: '用更深的留白和更少的商品，把注意力留给轮廓、皮革与金属细节本身。',
        moods: ['真正昂贵的部分往往不需要很多字。', '工艺感比堆砌更重要。', '这一页的留白就是价值感。'],
        items: [
            { name: '金扣粒面手袋', price: '¥13,800', tag: 'ICON', meta: '经典款', note: '线条清晰，五金压得住整页视觉重心。', tone: 'champagne' },
            { name: '古董链条腕表', price: '¥26,500', tag: 'WATCH', meta: '传承收藏', note: '更适合在暗色主题下阅读细节。', tone: 'night' },
            { name: '羊绒皮边披毯', price: '¥5,980', tag: 'HOME', meta: '私宅陈设', note: '属于不需要很高音量的奢侈感。', tone: 'pearl' },
            { name: '珍珠母贝首饰盒', price: '¥3,260', tag: 'JEWEL', meta: '礼赠优选', note: '适合放进“我的甄选”礼物清单。', tone: 'blush' }
        ]
    }
};

const ZHENXUAN_GENERATION_LIBRARY = {
    recommend: {
        editorial: 'EDITORIAL',
        nouns: ['礼盒', '香氛', '耳饰', '卡包', '丝巾', '项链'],
        tags: ['EDIT', 'GIFT', 'SELECT', 'NEW', 'PICK'],
        metas: ['首页主推', '礼赠优选', '柔光开场', '本季搭配', '编辑视线'],
        materials: ['缎光皮面', '浅金五金', '柔雾织纹', '镜面树脂', '烫金盒型', '细砂绒面'],
        scenes: ['适合礼物主位', '适合首页首屏', '适合下班后切换', '适合节日开场', '适合安静收藏', '适合日常提气'],
        prices: ['¥299', '¥399', '¥699', '¥920', '¥1,280', '¥1,680'],
        tones: ['blush', 'champagne', 'pearl', 'coral', 'night'],
        highlights: ['主位陈列', '柔雾气场', '轻奢收束', '礼赠前排', '低调闪光'],
        suggestions: ['月光', '绸缎', '玫瑰', '节日', '香草', '奶油白']
    },
    women: {
        editorial: 'WOMEN',
        nouns: ['大衣', '连衣裙', '凉鞋', '手袋', '衬衫', '腰带'],
        tags: ['COAT', 'DRESS', 'EDIT', 'SHAPE', 'RUNWAY'],
        metas: ['版型主位', '新季上架', '静奢通勤', '落肩线条', '编辑试衣间'],
        materials: ['双面羊毛', '丝光缎面', '柔韧皮革', '微褶雪纺', '细带五金', '珍珠灰纱感'],
        scenes: ['适合通勤整页', '适合晚间见面', '适合风格首位', '适合轮廓收束', '适合衣橱升级', '适合一页成套'],
        prices: ['¥699', '¥998', '¥1,560', '¥1,990', '¥2,680', '¥3,260'],
        tones: ['pearl', 'blush', 'champagne', 'night'],
        highlights: ['版型优先', '肩线更轻', '通勤主位', '一页成套', '线条先行'],
        suggestions: ['收腰', '珍珠灰', '黑金', '通勤', '缎面', '静奢']
    },
    beauty: {
        editorial: 'BEAUTY',
        nouns: ['唇釉', '精华', '粉饼', '香氛', '护手霜', '眼影盘'],
        tags: ['LIP', 'CARE', 'SCENT', 'BASE', 'GLOW'],
        metas: ['镜面雾感', '夜间修护', '轻香开场', '梳妆台主位', '玻璃柜采样'],
        materials: ['磨砂玻璃', '雾银泵头', '冷调镜面壳', '绸感包装', '浅香雾化喷头', '压纹盒盖'],
        scenes: ['适合镜前留白', '适合晚间修护', '适合香气收尾', '适合随身补妆', '适合礼盒拼组', '适合洗漱台陈列'],
        prices: ['¥129', '¥269', '¥318', '¥430', '¥620', '¥888'],
        tones: ['coral', 'pearl', 'champagne', 'night', 'blush'],
        highlights: ['香气先到', '光泽留住', '梳妆台主位', '少量高密度', '镜面停留'],
        suggestions: ['白麝香', '镜面', '晚安', '乌龙', '玫瑰雾', '玻璃感']
    },
    delivery: {
        editorial: 'DELIVERY',
        nouns: ['烩饭', '甜点杯', '沙拉', '茶饮', '轻食盒', '奶酪卷'],
        tags: ['HOT', 'NEW', 'LIGHT', 'DRINK', 'FAST'],
        metas: ['30 分钟送达', '晚餐备选', '冷藏甜品', '夜间上新', '办公室友好'],
        materials: ['保温纸盒', '冷藏透明杯', '磨砂餐具套', '轻量纸袋', '丝带封签', '简洁贴标'],
        scenes: ['适合晚上加餐', '适合办公室午后', '适合体面送达', '适合一个人收工', '适合深夜续命', '适合好友分享'],
        prices: ['¥29', '¥36', '¥48', '¥59', '¥79', '¥99'],
        tones: ['champagne', 'blush', 'olive', 'night', 'pearl'],
        highlights: ['送达即拍', '城市速度', '热量更轻', '深夜续命', '桌面体面'],
        suggestions: ['抹茶', '深夜', '青提', '轻盐', '奶油', '晚餐']
    },
    r18: {
        editorial: 'PRIVATE',
        nouns: ['睡袍', '蜡烛', '礼盒', '喷雾', '耳坠', '夜灯'],
        tags: ['NIGHT', 'MOOD', 'BOX', 'SCENT', 'PRIVATE'],
        metas: ['私享系列', '夜色主位', '低声礼赠', '靠近皮肤', '深夜留香'],
        materials: ['丝缎包边', '乌木蜡面', '磨砂玻璃瓶', '缎面纸盒', '暗金链节', '轻纱包装'],
        scenes: ['适合低光陈列', '适合靠近皮肤', '适合两人份礼赠', '适合夜色切换', '适合暧昧留白', '适合私密收藏'],
        prices: ['¥199', '¥219', '¥299', '¥468', '¥888', '¥1,199'],
        tones: ['night', 'coral', 'champagne', 'blush'],
        highlights: ['低光主位', '不露声色', '边界感更强', '留白更深', '只留余味'],
        suggestions: ['夜幕', '乌木', '丝缎', '靠近', '微醺', '黑玫瑰']
    },
    luxury: {
        editorial: 'HERITAGE',
        nouns: ['手袋', '腕表', '首饰盒', '披毯', '皮夹', '丝巾'],
        tags: ['ICON', 'VAULT', 'WATCH', 'ATELIER', 'RARE'],
        metas: ['传承收藏', '收藏柜主位', '高工线条', '私宅陈设', '珠宝柜台'],
        materials: ['粒面小牛皮', '拉丝金扣', '古董链节', '母贝饰面', '羊绒包边', '黑金锁扣'],
        scenes: ['适合会客厅陈列', '适合收藏柜主位', '适合低调送礼', '适合橱窗停留', '适合私人订购', '适合高净值礼单'],
        prices: ['¥3,260', '¥5,980', '¥9,800', '¥13,800', '¥18,600', '¥26,500'],
        tones: ['champagne', 'night', 'pearl', 'blush'],
        highlights: ['高工主位', '留白更深', '五金压场', '工艺先说话', '收藏级气场'],
        suggestions: ['黑金', '皮革', '古典', '私藏', '珠宝柜', '夜色']
    }
};

function createDefaultZhenxuanState() {
    return {
        customCategories: [],
        activeCategory: 'recommend',
        search: '',
        searchDraft: '',
        refreshSeed: 0,
        generatedCollections: {},
        favorites: [],
        cart: [],
        orders: [],
        gifts: [],
        address: { receiver: '', phone: '', region: '', detail: '' },
        profile: getDefaultZhenxuanProfile(),
        serviceChats: {},
        activeServiceChatKey: '',
        pendingCheckout: null
    };
}

function escapeZhenxuanHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeZhenxuanCategoryLabel(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8);
}

function normalizeZhenxuanSearchText(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, ZHENXUAN_SEARCH_LIMIT);
}

function normalizeZhenxuanShortText(value, limit = 32) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, limit);
}

function normalizeZhenxuanSentence(value, limit = 120) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, limit);
}


function normalizeZhenxuanAddress(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
        receiver: normalizeZhenxuanShortText(source.receiver || '', 18),
        phone: normalizeZhenxuanShortText(source.phone || '', 24),
        region: normalizeZhenxuanShortText(source.region || '', 36),
        detail: normalizeZhenxuanSentence(source.detail || '', 80)
    };
}

function isZhenxuanAddressComplete(address) {
    const item = normalizeZhenxuanAddress(address);
    return Boolean(item.receiver && item.phone && item.region && item.detail);
}

function formatZhenxuanAddress(address) {
    const item = normalizeZhenxuanAddress(address);
    return [item.receiver, item.phone, item.region, item.detail].filter(Boolean).join(' · ');
}

function getZhenxuanRandomInt(min, max) {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function getZhenxuanRandomFutureTime(from = Date.now()) {
    return from + getZhenxuanRandomInt(10 * 60 * 1000, 24 * 60 * 60 * 1000);
}

function getZhenxuanCourier(seed = '') {
    const source = String(seed || Date.now());
    let code = 0;
    for (let index = 0; index < source.length; index += 1) code += source.charCodeAt(index) * (index + 1);
    return ZHENXUAN_SHIPPING_COMPANIES[code % ZHENXUAN_SHIPPING_COMPANIES.length];
}

function getZhenxuanPickupCode() {
    const letter = String.fromCharCode(65 + getZhenxuanRandomInt(0, 25));
    return `${letter}${getZhenxuanRandomInt(10, 99)}-${getZhenxuanRandomInt(1000, 9999)}`;
}

function formatZhenxuanTime(value) {
    const time = Number(value);
    if (!Number.isFinite(time) || time <= 0) return '待更新';
    const date = new Date(time);
    const pad = number => String(number).padStart(2, '0');
    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizeZhenxuanTone(value, fallback = 'champagne') {
    const tone = String(value || '').trim().toLowerCase();
    return ZHENXUAN_ALLOWED_TONES.includes(tone) ? tone : fallback;
}

function normalizeZhenxuanTag(value) {
    const cleaned = String(value || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9/&\-\s]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 12);
    return cleaned || 'EDIT';
}

function normalizeZhenxuanPrice(value) {
    const cleaned = String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 18);
    if (!cleaned) return '¥ --';
    if (/^[¥￥$]/.test(cleaned)) return cleaned;
    if (/^\d[\d.,]*$/.test(cleaned)) return `¥${cleaned}`;
    return cleaned;
}


function normalizeZhenxuanStoredProduct(value) {
    const source = value && typeof value === 'object' ? value : {};
    const name = normalizeZhenxuanShortText(source.name || '', 24);
    if (!name) return null;
    const categoryId = String(source.categoryId || 'recommend');
    const product = {
        key: normalizeZhenxuanShortText(source.key || '', 96),
        categoryId,
        categoryLabel: normalizeZhenxuanShortText(source.categoryLabel || getZhenxuanCategoryLabel?.(categoryId) || '推荐', 12),
        name,
        price: normalizeZhenxuanPrice(source.price),
        tag: normalizeZhenxuanTag(source.tag || 'EDIT'),
        meta: normalizeZhenxuanShortText(source.meta || '本页精选', 20),
        note: normalizeZhenxuanSentence(source.note || '', 100),
        tone: normalizeZhenxuanTone(source.tone, 'champagne'),
        material: normalizeZhenxuanShortText(source.material || '精选材质', 18),
        scene: normalizeZhenxuanShortText(source.scene || '本页陈列', 26),
        caption: normalizeZhenxuanShortText(source.caption || source.meta || '编辑主推', 20),
        serial: normalizeZhenxuanShortText(source.serial || '01', 6),
        quantity: Math.max(1, Math.min(99, Number.parseInt(source.quantity, 10) || 1)),
        createdAt: Number.isFinite(Number(source.createdAt)) ? Number(source.createdAt) : Date.now(),
        updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : Date.now()
    };
    product.key = product.key || getZhenxuanProductKey(product, product.categoryId);
    return product;
}


function normalizeZhenxuanOrder(value) {
    const product = normalizeZhenxuanStoredProduct(value);
    if (!product) return null;
    const source = value && typeof value === 'object' ? value : {};
    const now = Date.now();
    const orderId = normalizeZhenxuanShortText(source.orderId || `ZX${now.toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`, 32);
    const paidAt = Number.isFinite(Number(source.paidAt)) ? Number(source.paidAt) : (Number.isFinite(Number(source.createdAt)) ? Number(source.createdAt) : now);
    const shipDueAt = Number.isFinite(Number(source.shipDueAt)) ? Number(source.shipDueAt) : getZhenxuanRandomFutureTime(paidAt);
    const arrivalDueAt = Number.isFinite(Number(source.arrivalDueAt)) ? Number(source.arrivalDueAt) : getZhenxuanRandomFutureTime(shipDueAt);
    const allowedStatus = new Set(['paid', 'shipping', 'delivered']);
    const status = allowedStatus.has(String(source.status || '')) ? String(source.status) : 'paid';
    const logistics = Array.isArray(source.logistics) ? source.logistics
        .map(entry => ({
            time: Number.isFinite(Number(entry?.time)) ? Number(entry.time) : now,
            text: normalizeZhenxuanSentence(entry?.text || '', 80)
        }))
        .filter(entry => entry.text)
        .slice(0, 12) : [];
    return {
        ...product,
        orderId,
        status,
        address: normalizeZhenxuanAddress(source.address),
        paidAt,
        shipDueAt,
        arrivalDueAt,
        shippedAt: Number.isFinite(Number(source.shippedAt)) ? Number(source.shippedAt) : 0,
        deliveredAt: Number.isFinite(Number(source.deliveredAt)) ? Number(source.deliveredAt) : 0,
        courier: normalizeZhenxuanShortText(source.courier || '', 18),
        trackingNo: normalizeZhenxuanShortText(source.trackingNo || '', 28),
        pickupCode: normalizeZhenxuanShortText(source.pickupCode || '', 16),
        logistics,
        updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : now
    };
}

function normalizeZhenxuanOrderList(value, limit = 120) {
    const list = Array.isArray(value) ? value : [];
    const deduped = [];
    const seen = new Set();
    list.forEach(entry => {
        const item = normalizeZhenxuanOrder(entry);
        if (!item || seen.has(item.orderId)) return;
        seen.add(item.orderId);
        deduped.push(item);
    });
    return deduped.slice(0, limit);
}

function getZhenxuanProductKey(item, categoryId = zhenxuanState?.activeCategory || 'recommend') {
    return [categoryId, item?.serial || '', item?.name || '', item?.price || '']
        .map(part => String(part || '').trim().replace(/\s+/g, '-').toLowerCase())
        .join('|');
}

function getZhenxuanProductSnapshot(item, categoryId = zhenxuanState.activeCategory) {
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    return normalizeZhenxuanStoredProduct({
        ...item,
        key: getZhenxuanProductKey(item, categoryId),
        categoryId,
        categoryLabel,
        quantity: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
}

function normalizeZhenxuanProductList(value, limit = 80) {
    const list = Array.isArray(value) ? value : [];
    const deduped = [];
    const seen = new Set();
    list.forEach(entry => {
        const item = normalizeZhenxuanStoredProduct(entry);
        if (!item || seen.has(item.key)) return;
        seen.add(item.key);
        deduped.push(item);
    });
    return deduped.slice(0, limit);
}

function getDefaultZhenxuanProfile() {
    return {
        avatar: '甄',
        nickname: 'Rinno Atelier',
        account: 'RinnoMuse',
        member: '甄选号 5201314'
    };
}

function normalizeZhenxuanProfile(value) {
    const defaults = getDefaultZhenxuanProfile();
    const source = value && typeof value === 'object' ? value : {};
    return {
        avatar: normalizeZhenxuanSentence(source.avatar || defaults.avatar, 220) || defaults.avatar,
        nickname: normalizeZhenxuanShortText(source.nickname || source.name || defaults.nickname, 24) || defaults.nickname,
        account: normalizeZhenxuanShortText(source.account || source.id || defaults.account, 24) || defaults.account,
        member: normalizeZhenxuanShortText(source.member || source.membership || defaults.member, 32) || defaults.member
    };
}

function normalizeZhenxuanServiceMessage(value) {
    const source = value && typeof value === 'object' ? value : {};
    const role = source.role === 'user' ? 'user' : 'service';
    const text = normalizeZhenxuanSentence(source.text || source.content || '', 280);
    if (!text) return null;
    return {
        id: normalizeZhenxuanShortText(source.id || `zxm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, 48),
        role,
        text,
        time: Number.isFinite(Number(source.time)) ? Number(source.time) : Date.now()
    };
}

function normalizeZhenxuanServiceChat(value) {
    const source = value && typeof value === 'object' ? value : {};
    const key = normalizeZhenxuanShortText(source.key || '', 120);
    if (!key) return null;
    const messages = Array.isArray(source.messages)
        ? source.messages.map(normalizeZhenxuanServiceMessage).filter(Boolean).slice(-80)
        : [];
    return {
        key,
        merchantName: normalizeZhenxuanShortText(source.merchantName || '甄选官方客服', 24),
        productKey: normalizeZhenxuanShortText(source.productKey || '', 96),
        productName: normalizeZhenxuanShortText(source.productName || '平台咨询', 32),
        productPrice: source.productPrice ? normalizeZhenxuanPrice(source.productPrice) : '',
        productSerial: normalizeZhenxuanShortText(source.productSerial || 'ZX', 8),
        personaId: normalizeZhenxuanShortText(source.personaId || '', 24),
        personaName: normalizeZhenxuanShortText(source.personaName || '', 24),
        personaTone: normalizeZhenxuanSentence(source.personaTone || '', 120),
        personaVersion: normalizeZhenxuanShortText(source.personaVersion || '', 32),
        updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : Date.now(),
        messages
    };
}

function normalizeZhenxuanServiceChats(value) {
    const source = value && typeof value === 'object' ? value : {};
    return Object.entries(source).reduce((map, [key, chat]) => {
        const normalized = normalizeZhenxuanServiceChat({ ...chat, key: chat?.key || key });
        if (normalized) map[normalized.key] = normalized;
        return map;
    }, {});
}

function normalizeZhenxuanState(value) {
    const defaults = createDefaultZhenxuanState();
    const source = value && typeof value === 'object' ? value : {};
    const customCategories = Array.isArray(source.customCategories)
        ? source.customCategories
            .map(item => ({
                id: String(item?.id || `custom-${Date.now().toString(36)}`),
                label: normalizeZhenxuanCategoryLabel(item?.label || '')
            }))
            .filter(item => item.label)
        : [];
    const deduped = [];
    const seen = new Set();
    customCategories.forEach(item => {
        const key = item.label.toLowerCase();
        if (seen.has(key) || deduped.length >= ZHENXUAN_MAX_CUSTOM_CATEGORIES) return;
        seen.add(key);
        deduped.push(item);
    });
    const activeCategory = String(source.activeCategory || defaults.activeCategory);
    const validCategoryIds = new Set([
        ...ZHENXUAN_BASE_CATEGORIES.map(item => item.id),
        ...deduped.map(item => item.id)
    ]);
    const generatedCollections = {};
    const rawGeneratedCollections = source.generatedCollections && typeof source.generatedCollections === 'object'
        ? source.generatedCollections
        : {};
    Object.entries(rawGeneratedCollections).forEach(([categoryId, entry]) => {
        const query = normalizeZhenxuanSearchText(entry?.query || '');
        const updatedAt = Number.isFinite(Number(entry?.updatedAt)) ? Number(entry.updatedAt) : Date.now();
        const collection = normalizeZhenxuanGeneratedCollection(entry?.collection, categoryId, query, updatedAt);
        if (!collection) return;
        generatedCollections[String(categoryId)] = {
            query,
            collection,
            updatedAt
        };
    });
    const normalizedActiveCategory = validCategoryIds.has(activeCategory) ? activeCategory : defaults.activeCategory;
    const fallbackSearch = normalizeZhenxuanSearchText(source.search || generatedCollections[normalizedActiveCategory]?.query || '');
    return {
        customCategories: deduped,
        activeCategory: normalizedActiveCategory,
        search: fallbackSearch,
        searchDraft: normalizeZhenxuanSearchText(source.searchDraft || fallbackSearch),
        refreshSeed: Number.isFinite(Number(source.refreshSeed)) ? Number(source.refreshSeed) : 0,
        generatedCollections,
        favorites: normalizeZhenxuanProductList(source.favorites, 120),
        cart: normalizeZhenxuanProductList(source.cart, 120),
        orders: normalizeZhenxuanOrderList(source.orders, 120),
        gifts: normalizeZhenxuanProductList(source.gifts, 120),
        address: normalizeZhenxuanAddress(source.address),
        profile: normalizeZhenxuanProfile(source.profile),
        serviceChats: normalizeZhenxuanServiceChats(source.serviceChats),
        activeServiceChatKey: normalizeZhenxuanShortText(source.activeServiceChatKey || '', 120),
        pendingCheckout: null
    };
}

function parseZhenxuanStateContent(content) {
    if (!content || typeof content !== 'string') return createDefaultZhenxuanState();
    try {
        return normalizeZhenxuanState(JSON.parse(content));
    } catch (error) {
        return createDefaultZhenxuanState();
    }
}

function readLegacyZhenxuanState() {
    try {
        return parseZhenxuanStateContent(localStorage.getItem(ZHENXUAN_STATE_KEY) || '');
    } catch (error) {
        return createDefaultZhenxuanState();
    }
}

async function readZhenxuanState() {
    try {
        if (typeof db !== 'undefined' && db?.edits?.get) {
            const saved = await db.edits.get(ZHENXUAN_STATE_KEY);
            if (saved?.content) return parseZhenxuanStateContent(saved.content);
        }
    } catch (error) {
        console.warn('Zhenxuan boutique Dexie read failed:', error);
    }
    return readLegacyZhenxuanState();
}

async function persistZhenxuanState(snapshot) {
    const content = JSON.stringify(normalizeZhenxuanState(snapshot));
    try {
        if (typeof db !== 'undefined' && db?.edits?.put) {
            await db.edits.put({
                id: ZHENXUAN_STATE_KEY,
                content,
                type: 'zhenxuan-boutique-state'
            });
        }
    } catch (error) {
        console.warn('Zhenxuan boutique Dexie save failed:', error);
    }
    try {
        localStorage.setItem(ZHENXUAN_STATE_KEY, content);
    } catch (error) {
        // Ignore local fallback failures.
    }
}

function writeZhenxuanState() {
    void persistZhenxuanState(zhenxuanState);
}

function buildZhenxuanChatEndpoint(rawEndpoint) {
    const raw = String(rawEndpoint || '').trim();
    if (!/^https?:\/\//i.test(raw)) {
        throw new Error('请先在设置的 API 聊天里填写 http/https 接口地址。');
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

function extractZhenxuanGeneratedText(payload) {
    const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
    return String(
        choice?.message?.content
        || choice?.text
        || payload?.output_text
        || payload?.content
        || ''
    ).trim();
}

async function loadZhenxuanApiSettings() {
    if (typeof apiState !== 'undefined' && apiState?.chat) return apiState.chat;
    try {
        if (typeof db === 'undefined' || !db?.edits?.get) return {};
        const saved = await db.edits.get(ZHENXUAN_API_SETTINGS_KEY);
        const content = typeof saved?.content === 'string' ? JSON.parse(saved.content) : saved?.content;
        return content?.chat || {};
    } catch (error) {
        console.warn('Zhenxuan API settings load failed:', error);
        return {};
    }
}

function getZhenxuanApp() {
    return document.getElementById('zhenxuan-app');
}

function getZhenxuanCategoryList() {
    return [
        ...ZHENXUAN_BASE_CATEGORIES,
        ...zhenxuanState.customCategories
    ];
}

function getZhenxuanCategoryLabel(categoryId) {
    return getZhenxuanCategoryList().find(item => item.id === categoryId)?.label || '推荐';
}

function createZhenxuanCustomPreset(label) {
    return {
        kicker: `${label.toUpperCase()} / CUSTOM`,
        headline: `把「${label}」做成你自己的专属分组。`,
        copy: `这是你新加进来的栏目。先给它一页干净的陈列感，之后再慢慢填满更具体的单品和风格。`,
        moods: ['新分组已经就位。', '先从一页干净的留白开始。', '它会跟着主题色一起呼吸。'],
        items: [
            { name: `${label} 主题礼盒`, price: '¥399', tag: 'CUSTOM', meta: '新分组首发', note: '先用一套完整礼盒把这个分组的气质立住。', tone: 'blush' },
            { name: `${label} 灵感样册`, price: '¥199', tag: 'EDIT', meta: '氛围参考', note: '适合先收纳材质、色彩和想保留的视觉关键词。', tone: 'pearl' },
            { name: `${label} 私藏单品`, price: '¥699', tag: 'SELECT', meta: '轻奢提案', note: '留给你自己定义这一组真正想买什么。', tone: 'champagne' },
            { name: `${label} 送礼备选`, price: '¥288', tag: 'GIFT', meta: '礼物清单', note: '以后这里也可以变成单独的礼赠分区。', tone: 'olive' }
        ]
    };
}

function getZhenxuanCategoryPreset(categoryId) {
    if (ZHENXUAN_CATEGORY_PRESETS[categoryId]) return ZHENXUAN_CATEGORY_PRESETS[categoryId];
    const customCategory = zhenxuanState.customCategories.find(item => item.id === categoryId);
    return createZhenxuanCustomPreset(customCategory?.label || '自定义');
}

function hashZhenxuanSeed(value) {
    const text = String(value || 'zhenxuan');
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function pickZhenxuanValue(list, seed, offset = 0) {
    if (!Array.isArray(list) || !list.length) return '';
    const index = Math.abs((Number(seed) || 0) + offset) % list.length;
    return list[index];
}

function getZhenxuanGenerationTheme(categoryId) {
    return ZHENXUAN_GENERATION_LIBRARY[categoryId] || ZHENXUAN_GENERATION_LIBRARY.recommend;
}

function normalizeZhenxuanGeneratedItem(item, categoryId, index, seed, keyword = '') {
    const source = item && typeof item === 'object' ? item : {};
    const theme = getZhenxuanGenerationTheme(categoryId);
    const fallbackTone = pickZhenxuanValue(theme.tones, seed, index * 2) || 'champagne';
    const name = normalizeZhenxuanShortText(source.name || '', 18);
    if (!name) return null;
    const material = normalizeZhenxuanShortText(source.material || '', 18);
    const scene = normalizeZhenxuanShortText(source.scene || '', 26);
    const meta = normalizeZhenxuanShortText(source.meta || source.caption || '本页精选', 20);
    const caption = normalizeZhenxuanShortText(source.caption || source.meta || '编辑主推', 20);
    const note = normalizeZhenxuanSentence(
        source.note
        || `${normalizeZhenxuanSearchText(keyword) || getZhenxuanCategoryLabel(categoryId)} 被压进 ${material || '细节材质'} 与 ${scene || '当前场景'} 的陈列语气里。`,
        96
    );
    return enrichZhenxuanItem({
        name,
        price: normalizeZhenxuanPrice(source.price),
        tag: normalizeZhenxuanTag(source.tag),
        meta,
        note,
        tone: normalizeZhenxuanTone(source.tone, fallbackTone),
        material,
        scene,
        caption
    }, categoryId, index, seed, keyword);
}

function normalizeZhenxuanGeneratedCollection(value, categoryId, query, seed = Date.now()) {
    const source = value && typeof value === 'object' ? value : {};
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    const cleanQuery = normalizeZhenxuanSearchText(query) || categoryLabel;
    const theme = getZhenxuanGenerationTheme(categoryId);
    const localSeed = hashZhenxuanSeed([categoryId, cleanQuery, seed].join('|'));
    const items = (Array.isArray(source.items) ? source.items : [])
        .slice(0, ZHENXUAN_GENERATED_ITEM_COUNT)
        .map((item, index) => normalizeZhenxuanGeneratedItem(item, categoryId, index, localSeed, cleanQuery))
        .filter(Boolean);

    if (!items.length) return null;

    return {
        kicker: normalizeZhenxuanShortText(source.kicker || `${theme.editorial} / GENERATED`, 28) || `${theme.editorial} / GENERATED`,
        headline: normalizeZhenxuanSentence(source.headline || `围绕“${cleanQuery}”重做这一页 ${categoryLabel} 的精品陈列。`, 48),
        copy: normalizeZhenxuanSentence(source.copy || `保留 ${categoryLabel} 的底色，把“${cleanQuery}”压进材质、价位和礼赠顺序里，让这一页从头到尾都像同一套陈列。`, 110),
        issue: normalizeZhenxuanShortText(source.issue || buildZhenxuanIssue(localSeed), 18) || buildZhenxuanIssue(localSeed),
        note: normalizeZhenxuanSentence(source.note || `${categoryLabel} · 当前围绕“${cleanQuery}”整页重排。`, 40),
        sectionHeading: normalizeZhenxuanShortText(source.sectionHeading || `“${cleanQuery}”本页精选`, 20) || `${categoryLabel}精选`,
        footerLabel: normalizeZhenxuanShortText(source.footerLabel || `${items.length} 款本页上新`, 20) || `${items.length} 款本页上新`,
        mood: normalizeZhenxuanSentence(source.mood || `${cleanQuery} 主题已经重新上架。`, 36),
        items
    };
}

function getZhenxuanGeneratedEntry(categoryId = zhenxuanState.activeCategory) {
    const entry = zhenxuanState.generatedCollections?.[categoryId];
    return entry?.collection?.items?.length ? entry : null;
}

function getZhenxuanCategoryQuery(categoryId = zhenxuanState.activeCategory) {
    return normalizeZhenxuanSearchText(getZhenxuanGeneratedEntry(categoryId)?.query || '');
}

function syncZhenxuanSearchStateForCategory(categoryId = zhenxuanState.activeCategory) {
    const query = getZhenxuanCategoryQuery(categoryId);
    zhenxuanState.search = query;
    zhenxuanState.searchDraft = query;
}

function getZhenxuanCommittedQuery() {
    return normalizeZhenxuanSearchText(zhenxuanState.search || getZhenxuanCategoryQuery(zhenxuanState.activeCategory));
}

function getZhenxuanDraftQuery() {
    return normalizeZhenxuanSearchText(zhenxuanState.searchDraft || zhenxuanState.search || getZhenxuanCategoryQuery(zhenxuanState.activeCategory));
}

function resolveZhenxuanGenerationKeyword(keyword, categoryId = zhenxuanState.activeCategory) {
    return normalizeZhenxuanSearchText(keyword)
        || getZhenxuanDraftQuery()
        || getZhenxuanCategoryQuery(categoryId)
        || getZhenxuanCategoryLabel(categoryId);
}

function buildZhenxuanIssue(seed) {
    return `ISSUE ${String((Math.abs(Number(seed) || 0) % 80) + 12).padStart(2, '0')}`;
}

function rotateZhenxuanItems(items, seed) {
    if (!Array.isArray(items) || items.length <= 1) return Array.isArray(items) ? items.slice() : [];
    const offset = Math.abs(Number(seed) || 0) % items.length;
    return items.slice(offset).concat(items.slice(0, offset));
}

function createZhenxuanGeneratedName(keyword, noun, seed, offset = 0) {
    const compactKeyword = String(keyword || '')
        .replace(/\s+/g, '')
        .slice(0, 6) || '甄选';
    const prefix = offset === 0
        ? ''
        : pickZhenxuanValue(['雾光', '夜金', '绸缎', '月白', '柔砂', '静黑', '奶油'], seed, offset);
    return `${prefix}${compactKeyword}${noun}`.slice(0, 14);
}

function enrichZhenxuanItem(item, categoryId, index, seed, keyword = '') {
    const theme = getZhenxuanGenerationTheme(categoryId);
    const localSeed = hashZhenxuanSeed([categoryId, item?.name, keyword, seed, index].join('|'));
    const shortKeyword = normalizeZhenxuanSearchText(keyword).slice(0, 8);
    return {
        ...item,
        serial: String(index + 1).padStart(2, '0'),
        tone: item?.tone || pickZhenxuanValue(theme.tones, localSeed, index * 3),
        material: item?.material || pickZhenxuanValue(theme.materials, localSeed, index * 5),
        scene: item?.scene || pickZhenxuanValue(theme.scenes, localSeed, index * 7),
        caption: item?.caption || (shortKeyword ? `${shortKeyword} 主题重排` : pickZhenxuanValue(theme.highlights, localSeed, index * 11))
    };
}

function buildZhenxuanGeneratedItem(categoryId, keyword, seed, index) {
    const theme = getZhenxuanGenerationTheme(categoryId);
    const localSeed = hashZhenxuanSeed([categoryId, keyword, seed, index].join('|'));
    const cleanKeyword = normalizeZhenxuanSearchText(keyword) || getZhenxuanCategoryLabel(categoryId);
    const noun = pickZhenxuanValue(theme.nouns, localSeed, index * 2);
    const material = pickZhenxuanValue(theme.materials, localSeed, index * 3);
    const scene = pickZhenxuanValue(theme.scenes, localSeed, index * 5);
    const meta = pickZhenxuanValue(theme.metas, localSeed, index * 7);
    const tone = pickZhenxuanValue(theme.tones, localSeed, index * 11);
    return {
        name: createZhenxuanGeneratedName(cleanKeyword, noun, localSeed, index + 1),
        price: pickZhenxuanValue(theme.prices, localSeed, index * 13),
        tag: pickZhenxuanValue(theme.tags, localSeed, index * 17),
        meta,
        note: `${cleanKeyword} 被压进 ${material} 和 ${scene} 的语气里，这一件更适合放在这一页的${index === 0 ? '主位' : '中段'}。`,
        tone,
        material,
        scene,
        caption: pickZhenxuanValue(theme.highlights, localSeed, index * 19),
        serial: String(index + 1).padStart(2, '0')
    };
}

function buildZhenxuanGeneratedCollection(categoryId, keyword, seed) {
    const theme = getZhenxuanGenerationTheme(categoryId);
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    const cleanKeyword = normalizeZhenxuanSearchText(keyword) || categoryLabel;
    const localSeed = hashZhenxuanSeed([categoryId, cleanKeyword, seed].join('|'));
    const items = Array.from({ length: ZHENXUAN_GENERATED_ITEM_COUNT }, (_, index) => (
        buildZhenxuanGeneratedItem(categoryId, cleanKeyword, localSeed, index)
    ));
    const headlineOptions = [
        `把「${cleanKeyword}」排成一页更像精品买手店的陈列。`,
        `围绕「${cleanKeyword}」重做这页 ${categoryLabel} 的质感和顺序。`,
        `让「${cleanKeyword}」成为这页 ${categoryLabel} 的主语。`
    ];
    return {
        kicker: `${theme.editorial} / GENERATED`,
        headline: pickZhenxuanValue(headlineOptions, localSeed),
        copy: `保留 ${categoryLabel} 的底色，把「${cleanKeyword}」压进材质、价位和礼赠顺序里，让这一页从标签到商品都像同一组陈列。`,
        items,
        issue: buildZhenxuanIssue(localSeed),
        note: `${categoryLabel} · 当前围绕「${cleanKeyword}」整页重刷。`,
        sectionHeading: `“${cleanKeyword}” 新陈列`,
        footerLabel: `${items.length} 款整页重排`,
        mood: `${cleanKeyword} 主题已经重新上架。`
    };
}

function buildZhenxuanGenerationPrompt(categoryId, keyword) {
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    const preset = getZhenxuanCategoryPreset(categoryId);
    const theme = getZhenxuanGenerationTheme(categoryId);
    return [
        `当前标签页：${categoryLabel}`,
        `关键词：${keyword}`,
        `页面基调：${preset.copy}`,
        `栏目标题气质参考：${preset.headline}`,
        `优先使用的材质词：${theme.materials.slice(0, 6).join('、')}`,
        `优先使用的场景词：${theme.scenes.slice(0, 6).join('、')}`,
        `可选 tone 只能从这几个值里选：${ZHENXUAN_ALLOWED_TONES.join(', ')}`,
        '请生成一整页移动端精品商品陈列，而不是搜索结果列表。',
        '输出必须是严格 JSON，不要 Markdown，不要解释，不要多余文字。',
        'JSON 结构如下：',
        '{',
        '  "kicker": "大写英文短句",',
        '  "headline": "18-34 字中文标题",',
        '  "copy": "40-90 字中文导语",',
        '  "sectionHeading": "8-18 字中文栏目标题",',
        '  "footerLabel": "例如：6 款本页上新",',
        '  "mood": "12-28 字中文氛围句",',
        '  "note": "18-36 字中文页下注释",',
        '  "issue": "ISSUE 17",',
        '  "items": [',
        '    {',
        '      "name": "2-12 字中文商品名",',
        '      "price": "¥1680",',
        '      "tag": "4-10 位大写英文",',
        '      "meta": "4-12 字中文副标签",',
        '      "caption": "4-12 字中文短语",',
        '      "note": "20-50 字中文说明",',
        '      "material": "3-10 字中文材质",',
        '      "scene": "5-16 字中文场景",',
        '      "tone": "champagne"',
        '    }',
        '  ]',
        '}',
        `必须给出 ${ZHENXUAN_GENERATED_ITEM_COUNT} 个 items，名字不要重复，价格层级要拉开。`,
        '整体审美要像高端编辑买手店，克制、干净、有礼赠感，避免廉价电商口吻。',
        categoryId === 'r18'
            ? 'R18 标签页保持暧昧和私密感即可，不要露骨，不要出现露骨行为描写。'
            : '不要使用 emoji。'
    ].join('\n');
}

function parseZhenxuanGeneratedCollection(text, categoryId, keyword) {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('接口没有返回可用的商品内容。');
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    const jsonStart = unfenced.indexOf('{');
    const jsonEnd = unfenced.lastIndexOf('}');
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
        ? unfenced.slice(jsonStart, jsonEnd + 1)
        : unfenced;

    let payload;
    try {
        payload = JSON.parse(jsonText);
    } catch (error) {
        throw new Error('接口返回的不是可解析的 JSON。');
    }

    const collection = normalizeZhenxuanGeneratedCollection(payload, categoryId, keyword, Date.now());
    if (!collection) {
        throw new Error('接口返回的商品结构不完整，请重试。');
    }
    return collection;
}

async function generateZhenxuanCollectionWithApi(categoryId, keyword) {
    const chat = await loadZhenxuanApiSettings();
    const endpoint = String(chat?.endpoint || '').trim();
    const model = String(chat?.model || '').trim();
    if (!endpoint || !model) {
        throw new Error('请先到 设置 - 接口与参数 - API 聊天 填写接口地址和模型。');
    }

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (chat.apiKey) headers.Authorization = `Bearer ${chat.apiKey}`;

    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = controller
        ? window.setTimeout(() => controller.abort(), ZHENXUAN_GENERATION_TIMEOUT_MS)
        : 0;

    try {
        const response = await fetch(buildZhenxuanChatEndpoint(endpoint), {
            method: 'POST',
            headers,
            signal: controller?.signal,
            body: JSON.stringify({
                model,
                temperature: typeof chat.temperature === 'number' ? chat.temperature : 0.9,
                messages: [
                    {
                        role: 'system',
                        content: '你是高端电商的视觉编辑与商品陈列文案顾问。你负责为移动端“甄选”页面生成整页商品内容。只输出严格 JSON，不要 Markdown，不要解释，不要额外文字。'
                    },
                    {
                        role: 'user',
                        content: buildZhenxuanGenerationPrompt(categoryId, keyword)
                    }
                ]
            })
        });

        if (!response.ok) throw new Error(`API 生成失败：${response.status}`);
        const payload = await response.json();
        return parseZhenxuanGeneratedCollection(
            extractZhenxuanGeneratedText(payload),
            categoryId,
            keyword
        );
    } catch (error) {
        if (error?.name === 'AbortError') {
            throw new Error('接口生成超时了，请稍后再试。');
        }
        throw error;
    } finally {
        if (timeoutId) window.clearTimeout(timeoutId);
    }
}

function getZhenxuanCollectionModel() {
    const categoryId = zhenxuanState.activeCategory;
    const seed = Number(zhenxuanState.refreshSeed) || 0;
    const generatedEntry = getZhenxuanGeneratedEntry(categoryId);
    if (generatedEntry?.collection?.items?.length) return generatedEntry.collection;

    const preset = getZhenxuanCategoryPreset(categoryId);
    const rotated = rotateZhenxuanItems(preset.items, seed);
    const moodIndex = Math.abs(seed) % preset.moods.length;
    const items = rotated.map((item, index) => enrichZhenxuanItem(item, categoryId, index, seed));
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    return {
        kicker: preset.kicker,
        headline: preset.headline,
        copy: preset.copy,
        items,
        issue: buildZhenxuanIssue(seed),
        note: `${categoryLabel} · 当前主推已经重新编排。`,
        sectionHeading: `${categoryLabel}精选`,
        footerLabel: `${items.length} 款在架`,
        mood: preset.moods[moodIndex] || `${categoryLabel} 正在流动。`
    };
}

function getZhenxuanSuggestedKeywords(categoryId) {
    const theme = getZhenxuanGenerationTheme(categoryId);
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    const suggestions = ZHENXUAN_CATEGORY_PRESETS[categoryId]
        ? theme.suggestions
        : [categoryLabel, `${categoryLabel}礼盒`, `${categoryLabel}收藏`, '月白', '夜金', '送礼'];
    return Array.from(new Set(
        suggestions
            .map(normalizeZhenxuanSearchText)
            .filter(Boolean)
    )).slice(0, 6);
}

function showZhenxuanToast(text, duration = 1800) {
    const toast = document.getElementById('zhenxuan-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.classList.add('active');
    if (zhenxuanToastTimer) window.clearTimeout(zhenxuanToastTimer);
    zhenxuanToastTimer = window.setTimeout(() => {
        toast.classList.remove('active');
        window.setTimeout(() => {
            if (!toast.classList.contains('active')) toast.hidden = true;
        }, 180);
    }, duration);
}

function hideZhenxuanToast(instant = false) {
    const toast = document.getElementById('zhenxuan-toast');
    if (!toast) return;
    if (zhenxuanToastTimer) {
        window.clearTimeout(zhenxuanToastTimer);
        zhenxuanToastTimer = 0;
    }
    toast.classList.remove('active');
    if (instant) toast.hidden = true;
}

function setZhenxuanRefreshMessage(text, isError = false) {
    const message = document.getElementById('zhenxuan-refresh-message');
    if (!message) return;
    message.textContent = String(text || '');
    message.classList.toggle('error', Boolean(text) && isError);
}

function setZhenxuanGeneratingState(isGenerating) {
    zhenxuanGenerating = Boolean(isGenerating);
    getZhenxuanApp()?.classList.toggle('is-generating', zhenxuanGenerating);
    document.getElementById('zhenxuan-search-submit')?.toggleAttribute('disabled', zhenxuanGenerating);
    document.getElementById('zhenxuan-refresh-feed')?.toggleAttribute('disabled', zhenxuanGenerating);
    document.getElementById('zhenxuan-search-submit')?.classList.toggle('is-loading', zhenxuanGenerating);
    document.getElementById('zhenxuan-refresh-feed')?.classList.toggle('is-loading', zhenxuanGenerating);
    const submit = document.querySelector('#zhenxuan-refresh-form button[type="submit"]');
    if (submit) {
        submit.toggleAttribute('disabled', zhenxuanGenerating);
        submit.textContent = zhenxuanGenerating ? '生成中...' : '生成这一页';
    }
}

function renderZhenxuanRefreshSuggestions() {
    const wrap = document.getElementById('zhenxuan-refresh-suggestions');
    if (!wrap) return;
    const suggestions = getZhenxuanSuggestedKeywords(zhenxuanState.activeCategory);
    wrap.innerHTML = suggestions.map(item => `
        <button class="zhenxuan-refresh-preset interactive" type="button" data-zhenxuan-refresh-keyword="${escapeZhenxuanHtml(item)}">
            ${escapeZhenxuanHtml(item)}
        </button>
    `).join('');
}

function renderZhenxuanCategories() {
    const strip = document.getElementById('zhenxuan-category-strip');
    if (!strip) return;
    const chips = getZhenxuanCategoryList().map(item => `
        <button class="zhenxuan-category-chip interactive${item.id === zhenxuanState.activeCategory ? ' active' : ''}" type="button" data-zhenxuan-category="${escapeZhenxuanHtml(item.id)}">
            ${escapeZhenxuanHtml(item.label)}
        </button>
    `);
    chips.push(`
        <button class="zhenxuan-category-chip zhenxuan-category-chip-add interactive" type="button" data-zhenxuan-add-category="true" aria-label="添加分组">
            +
        </button>
    `);
    strip.innerHTML = chips.join('');
}

function getZhenxuanHeaderTitle(page = activeZhenxuanPage) {
    if (page === 'orders') return getZhenxuanOrderFilterTitle(zhenxuanOrderStatusFilter);
    if (page === 'detail') return '商品详情';
    if (page === 'checkout') return '确认结算';
    return '甄选';
}

function renderZhenxuanHeaderMeta() {
    const badge = document.getElementById('zhenxuan-top-badge');
    if (badge) badge.textContent = getZhenxuanCollectionModel().issue;
    const title = document.getElementById('zhenxuan-close-title');
    if (title) title.textContent = getZhenxuanHeaderTitle(activeZhenxuanPage);
    const note = document.getElementById('zhenxuan-note');
    if (note) note.textContent = getZhenxuanNoteText(activeZhenxuanPage);
}

function renderZhenxuanHero() {
    const hero = document.getElementById('zhenxuan-hero-card');
    const heading = document.getElementById('zhenxuan-section-heading');
    if (!hero || !heading) return;
    const collection = getZhenxuanCollectionModel();
    const activeLabel = getZhenxuanCategoryLabel(zhenxuanState.activeCategory);
    heading.textContent = collection.sectionHeading;
    hero.innerHTML = `
        <div class="zhenxuan-hero-kicker">
            <span>${escapeZhenxuanHtml(collection.kicker)}</span>
            <b>${escapeZhenxuanHtml(activeLabel)}</b>
        </div>
        <h2>${escapeZhenxuanHtml(collection.headline)}</h2>
        <p>${escapeZhenxuanHtml(collection.copy)}</p>
        <div class="zhenxuan-hero-footer">
            <span>${escapeZhenxuanHtml(collection.mood)}</span>
            <strong>${escapeZhenxuanHtml(collection.footerLabel)}</strong>
        </div>
    `;
}

function renderZhenxuanProducts() {
    const grid = document.getElementById('zhenxuan-product-grid');
    if (!grid) return;
    const collection = getZhenxuanCollectionModel();
    if (!collection.items.length) {
        grid.innerHTML = `
            <article class="zhenxuan-empty-card zhenxuan-empty-inline">
                <span class="zhenxuan-empty-kicker">NO RESULT</span>
                <h3>这一页暂时还没排出商品</h3>
                <p>换一个关键词，或者点刷新重新排版当前页。</p>
            </article>
        `;
        return;
    }
    grid.innerHTML = collection.items.map(item => `
        <article class="zhenxuan-product-card" data-tone="${escapeZhenxuanHtml(item.tone || 'blush')}">
            <div class="zhenxuan-product-figure">
                <div class="zhenxuan-product-figure-top">
                    <span>${escapeZhenxuanHtml(item.tag)}</span>
                    <em class="zhenxuan-product-code">NO. ${escapeZhenxuanHtml(item.serial || '01')}</em>
                </div>
                <div class="zhenxuan-product-silhouette" aria-hidden="true">
                    <i></i><i></i><i></i>
                </div>
                <div class="zhenxuan-product-figure-copy">
                    <b class="zhenxuan-product-caption">${escapeZhenxuanHtml(item.caption || item.meta)}</b>
                    <strong>${escapeZhenxuanHtml(item.meta)}</strong>
                </div>
            </div>
            <div class="zhenxuan-product-body">
                <div class="zhenxuan-product-body-top">
                    <div class="zhenxuan-product-heading-row">
                        <h3>${escapeZhenxuanHtml(item.name)}</h3>
                        <strong class="zhenxuan-product-price">${escapeZhenxuanHtml(item.price)}</strong>
                    </div>
                    <p>${escapeZhenxuanHtml(item.note)}</p>
                </div>
                <div class="zhenxuan-product-footer">
                    <span class="zhenxuan-product-material">${escapeZhenxuanHtml(item.material || '精选材质')}</span>
                    <span class="zhenxuan-product-scene">${escapeZhenxuanHtml(item.scene || '本页精选')}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function renderZhenxuanHome() {
    const input = document.getElementById('zhenxuan-search-input');
    const draft = getZhenxuanDraftQuery();
    if (input && input.value !== draft) input.value = draft;
    renderZhenxuanHeaderMeta();
    renderZhenxuanCategories();
    renderZhenxuanHero();
    renderZhenxuanProducts();
    renderZhenxuanRefreshSuggestions();
}

function renderZhenxuanProducts() {
    const grid = document.getElementById('zhenxuan-product-grid');
    if (!grid) return;
    const collection = getZhenxuanCollectionModel();
    if (!collection.items.length) {
        grid.innerHTML = `
            <article class="zhenxuan-empty-card zhenxuan-empty-inline">
                <span class="zhenxuan-empty-kicker">NO RESULT</span>
                <h3>这一页暂时还没有排出商品</h3>
                <p>换一个关键词，或者点刷新重新生成当前标签页的整套陈列。</p>
            </article>
        `;
        return;
    }
    grid.innerHTML = collection.items.map(item => `
        <article class="zhenxuan-product-card" data-tone="${escapeZhenxuanHtml(item.tone || 'blush')}">
            <div class="zhenxuan-product-cover">
                <div class="zhenxuan-product-cover-top">
                    <span class="zhenxuan-product-tag">${escapeZhenxuanHtml(item.tag)}</span>
                    <em class="zhenxuan-product-code">ATELIER / ${escapeZhenxuanHtml(item.serial || '01')}</em>
                </div>
                <div class="zhenxuan-product-serial" aria-hidden="true">${escapeZhenxuanHtml(item.serial || '01')}</div>
                <div class="zhenxuan-product-cover-copy">
                    <b class="zhenxuan-product-caption">${escapeZhenxuanHtml(item.caption || item.meta)}</b>
                    <strong class="zhenxuan-product-meta">${escapeZhenxuanHtml(item.meta)}</strong>
                </div>
            </div>
            <div class="zhenxuan-product-body">
                <div class="zhenxuan-product-body-top">
                    <div class="zhenxuan-product-heading-row">
                        <div class="zhenxuan-product-heading-copy">
                            <span class="zhenxuan-product-index">COLLECTIBLE ${escapeZhenxuanHtml(item.serial || '01')}</span>
                            <h3>${escapeZhenxuanHtml(item.name)}</h3>
                        </div>
                        <strong class="zhenxuan-product-price">${escapeZhenxuanHtml(item.price)}</strong>
                    </div>
                    <p>${escapeZhenxuanHtml(item.note)}</p>
                </div>
                <div class="zhenxuan-product-facts">
                    <div class="zhenxuan-product-fact">
                        <span>MATERIAL</span>
                        <strong>${escapeZhenxuanHtml(item.material || '本页材质')}</strong>
                    </div>
                    <div class="zhenxuan-product-fact">
                        <span>SCENE</span>
                        <strong>${escapeZhenxuanHtml(item.scene || '本页陈列')}</strong>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

function getZhenxuanNoteText(page) {
    if (page === 'home') {
        return getZhenxuanCollectionModel().note || `${getZhenxuanCategoryLabel(zhenxuanState.activeCategory)} · ${ZHENXUAN_PAGES.home.note}`;
    }
    if (page === 'cart') {
        const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
        return cart.length
            ? '购物车已生成待结算清单，可直接去结算或继续送礼。'
            : ZHENXUAN_PAGES.cart.note;
    }
    if (page === 'profile') {
        const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
        return orders.length
            ? '订单、收藏、店铺与足迹都收在这里。'
            : ZHENXUAN_PAGES.profile.note;
    }
    if (page === 'messages') {
        return '这里会开始你和商家的全部对话。';
    }
    if (page === 'orders') {
        return `${getZhenxuanOrderFilterTitle(zhenxuanOrderStatusFilter)}条目在这里查看。`;
    }
    return ZHENXUAN_PAGES[page]?.note || ZHENXUAN_PAGES.home.note;
}

function setZhenxuanPage(page, scrollToTop = true) {
    const nextPage = ZHENXUAN_PAGES[page] ? page : 'home';
    activeZhenxuanPage = nextPage;
    document.querySelectorAll('[data-zhenxuan-page]').forEach(section => {
        const isActive = section.getAttribute('data-zhenxuan-page') === nextPage;
        section.hidden = !isActive;
        section.classList.toggle('active', isActive);
    });
    document.querySelectorAll('[data-zhenxuan-tab]').forEach(tab => {
        const isActive = tab.getAttribute('data-zhenxuan-tab') === nextPage;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderZhenxuanHeaderMeta();
    if (scrollToTop) {
        const stage = document.getElementById('zhenxuan-stage');
        if (stage) stage.scrollTop = 0;
    }
}

function syncZhenxuanSearchDraft(value) {
    zhenxuanState.searchDraft = normalizeZhenxuanSearchText(value);
    writeZhenxuanState();
}

function generateZhenxuanProducts(keyword, options = {}) {
    const nextQuery = normalizeZhenxuanSearchText(keyword);
    zhenxuanState.search = nextQuery;
    zhenxuanState.searchDraft = nextQuery;
    zhenxuanState.refreshSeed = (Number(zhenxuanState.refreshSeed) || 0) + 1;
    writeZhenxuanState();
    renderZhenxuanHome();
    setZhenxuanPage('home', false);
    if (options.closeRefresh) closeZhenxuanRefreshSheet();
    showZhenxuanToast(nextQuery ? `已根据「${nextQuery}」重刷当前页` : '已重刷当前页陈列');
}

function openZhenxuanGroupSheet() {
    const sheet = document.getElementById('zhenxuan-group-sheet');
    const input = document.getElementById('zhenxuan-group-input');
    const message = document.getElementById('zhenxuan-group-message');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }
    if (input) input.value = '';
    if (!sheet) return;
    sheet.hidden = false;
    window.setTimeout(() => input?.focus(), 80);
}

function closeZhenxuanGroupSheet() {
    const sheet = document.getElementById('zhenxuan-group-sheet');
    const message = document.getElementById('zhenxuan-group-message');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }
    if (sheet) sheet.hidden = true;
}

function openZhenxuanRefreshSheet() {
    const sheet = document.getElementById('zhenxuan-refresh-sheet');
    const input = document.getElementById('zhenxuan-refresh-input');
    const message = document.getElementById('zhenxuan-refresh-message');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }
    if (input) input.value = getZhenxuanDraftQuery() || getZhenxuanCategoryLabel(zhenxuanState.activeCategory);
    renderZhenxuanRefreshSuggestions();
    if (!sheet) return;
    sheet.hidden = false;
    window.setTimeout(() => {
        input?.focus();
        input?.select();
    }, 80);
}

function closeZhenxuanRefreshSheet() {
    const sheet = document.getElementById('zhenxuan-refresh-sheet');
    const message = document.getElementById('zhenxuan-refresh-message');
    if (message) {
        message.textContent = '';
        message.classList.remove('error');
    }
    if (sheet) sheet.hidden = true;
}

function saveZhenxuanRefresh(event) {
    event.preventDefault();
    const input = document.getElementById('zhenxuan-refresh-input');
    generateZhenxuanProducts(input?.value || '', { closeRefresh: true });
    input?.blur();
}

function saveZhenxuanGroup(event) {
    event.preventDefault();
    const input = document.getElementById('zhenxuan-group-input');
    const message = document.getElementById('zhenxuan-group-message');
    const label = normalizeZhenxuanCategoryLabel(input?.value || '');
    if (!label) {
        if (message) {
            message.textContent = '先写下分组名称。';
            message.classList.add('error');
        }
        input?.focus();
        return;
    }
    const duplicated = getZhenxuanCategoryList().some(item => item.label.toLowerCase() === label.toLowerCase());
    if (duplicated) {
        if (message) {
            message.textContent = '已经有同名分组了。';
            message.classList.add('error');
        }
        input?.focus();
        return;
    }
    if (zhenxuanState.customCategories.length >= ZHENXUAN_MAX_CUSTOM_CATEGORIES) {
        if (message) {
            message.textContent = '自定义分组已到上限。';
            message.classList.add('error');
        }
        return;
    }
    const nextItem = {
        id: `custom-${Date.now().toString(36)}`,
        label
    };
    zhenxuanState.customCategories = [...zhenxuanState.customCategories, nextItem];
    zhenxuanState.activeCategory = nextItem.id;
    zhenxuanState.search = '';
    zhenxuanState.searchDraft = '';
    zhenxuanState.refreshSeed = 0;
    writeZhenxuanState();
    renderZhenxuanHome();
    setZhenxuanPage('home', false);
    closeZhenxuanGroupSheet();
    showZhenxuanToast(`已添加「${label}」`);
}

async function hydrateZhenxuanState() {
    zhenxuanState = await readZhenxuanState();
    renderZhenxuanHome();
    renderZhenxuanProfileIdentity();
    renderZhenxuanMessages();
    setZhenxuanPage(activeZhenxuanPage, false);
    return zhenxuanState;
}

function syncZhenxuanSearchDraft(value) {
    zhenxuanState.searchDraft = normalizeZhenxuanSearchText(value);
    writeZhenxuanState();
}

async function generateZhenxuanProducts(keyword, options = {}) {
    if (zhenxuanGenerating) return;
    const categoryId = zhenxuanState.activeCategory;
    const nextQuery = resolveZhenxuanGenerationKeyword(keyword, categoryId);
    zhenxuanState.search = nextQuery;
    zhenxuanState.searchDraft = nextQuery;
    writeZhenxuanState();
    setZhenxuanGeneratingState(true);
    setZhenxuanRefreshMessage(options.closeRefresh ? '正在为这一页生成整页商品，请稍等…' : '');
    showZhenxuanToast(nextQuery ? `正在根据“${nextQuery}”生成当前标签页` : '正在生成当前标签页', 1800);

    try {        const collection = await generateZhenxuanCollectionWithApi(categoryId, nextQuery);
        const updatedAt = Date.now();
        const normalizedCollection = {
            ...collection,
            items: Array.isArray(collection?.items)
                ? collection.items
                    .map((item, index) => normalizeZhenxuanStoredProduct({
                        ...item,
                        categoryId,
                        categoryLabel: getZhenxuanCategoryLabel(categoryId),
                        key: getZhenxuanProductKey(item, categoryId),
                        merchantName: item?.merchantName || getZhenxuanMerchantName([categoryId, nextQuery, updatedAt, index, item?.name || ''].join('|')),
                        updatedAt,
                        createdAt: updatedAt
                    }))
                    .filter(Boolean)
                : []
        };
        zhenxuanState.generatedCollections = {
            ...zhenxuanState.generatedCollections,
            [categoryId]: {
                query: nextQuery,
                collection: normalizedCollection,
                updatedAt
            }
        };
        zhenxuanState.refreshSeed = updatedAt;
        writeZhenxuanState();
        renderZhenxuanHome();
        setZhenxuanPage('home', false);
        if (options.closeRefresh) closeZhenxuanRefreshSheet();
        showZhenxuanToast(`已根据“${nextQuery}”重做当前标签页`, 2200);
    } catch (error) {
        const message = error?.message || '生成失败，请稍后再试。';
        setZhenxuanRefreshMessage(message, true);
        showZhenxuanToast(message, 2600);
    } finally {
        setZhenxuanGeneratingState(false);
    }
}

function openZhenxuanRefreshSheet() {
    const sheet = document.getElementById('zhenxuan-refresh-sheet');
    const input = document.getElementById('zhenxuan-refresh-input');
    setZhenxuanRefreshMessage('');
    if (input) input.value = getZhenxuanDraftQuery() || getZhenxuanCategoryQuery() || getZhenxuanCategoryLabel(zhenxuanState.activeCategory);
    renderZhenxuanRefreshSuggestions();
    if (!sheet) return;
    sheet.hidden = false;
    window.setTimeout(() => {
        input?.focus();
        input?.select();
    }, 80);
}

function closeZhenxuanRefreshSheet() {
    const sheet = document.getElementById('zhenxuan-refresh-sheet');
    setZhenxuanRefreshMessage('');
    if (sheet) sheet.hidden = true;
}

const ZHENXUAN_PROFILE_EDIT_META = {
    avatar: { title: '修改头像', label: '头像', copy: '可填写图片 URL，或输入 1-2 个字作为头像文字。', placeholder: '图片 URL / 甄' },
    nickname: { title: '修改昵称', label: '昵称', copy: '修改后会同步到我的甄选资料卡。', placeholder: 'Rinno Atelier' },
    account: { title: '修改 ID', label: 'ID', copy: '这里显示在昵称下方，不会影响其它应用账号。', placeholder: 'RinnoMuse' },
    member: { title: '修改会员', label: '会员信息', copy: '例如会员等级、甄选号或简短身份标记。', placeholder: '甄选号 5201314' }
};

function isZhenxuanImageValue(value) {
    const text = String(value || '').trim();
    return /^(https?:|data:image\/|blob:|file:)/i.test(text);
}

function renderZhenxuanProfileIdentity() {
    const profile = normalizeZhenxuanProfile(zhenxuanState.profile);
    zhenxuanState.profile = profile;
    const avatar = document.getElementById('zhenxuan-profile-avatar');
    const name = document.getElementById('zhenxuan-profile-name');
    const account = document.getElementById('zhenxuan-profile-id');
    const member = document.getElementById('zhenxuan-profile-member');
    if (avatar) {
        const hasImage = isZhenxuanImageValue(profile.avatar);
        avatar.classList.toggle('has-image', hasImage);
        avatar.style.backgroundImage = hasImage ? `url("${profile.avatar.replace(/"/g, '%22')}")` : '';
        avatar.innerHTML = hasImage ? '<span aria-hidden="true"></span>' : `<span>${escapeZhenxuanHtml(profile.avatar.slice(0, 2) || '甄')}</span>`;
    }
    if (name) name.textContent = profile.nickname;
    if (account) account.textContent = profile.account;
    if (member) member.textContent = profile.member;
}

function setZhenxuanProfileEditMessage(text, isError = false) {
    const node = document.getElementById('zhenxuan-profile-edit-message');
    if (!node) return;
    node.textContent = text || '';
    node.classList.toggle('error', Boolean(isError));
}

function openZhenxuanProfileEdit(field) {
    const key = ZHENXUAN_PROFILE_EDIT_META[field] ? field : 'nickname';
    const meta = ZHENXUAN_PROFILE_EDIT_META[key];
    const sheet = document.getElementById('zhenxuan-profile-edit-sheet');
    const input = document.getElementById('zhenxuan-profile-edit-input');
    const hidden = document.getElementById('zhenxuan-profile-edit-field');
    const title = document.getElementById('zhenxuan-profile-edit-title');
    const label = document.getElementById('zhenxuan-profile-edit-label');
    const copy = document.getElementById('zhenxuan-profile-edit-copy');
    if (!sheet || !input || !hidden) return;
    const profile = normalizeZhenxuanProfile(zhenxuanState.profile);
    hidden.value = key;
    input.value = profile[key] || '';
    input.placeholder = meta.placeholder || '';
    if (title) title.textContent = meta.title;
    if (label) label.textContent = meta.label;
    if (copy) copy.textContent = meta.copy;
    setZhenxuanProfileEditMessage('');
    sheet.hidden = false;
    window.setTimeout(() => {
        input.focus();
        input.select();
    }, 80);
}

function closeZhenxuanProfileEditSheet() {
    const sheet = document.getElementById('zhenxuan-profile-edit-sheet');
    setZhenxuanProfileEditMessage('');
    if (sheet) sheet.hidden = true;
}

function saveZhenxuanProfileEdit(event) {
    event.preventDefault();
    const field = document.getElementById('zhenxuan-profile-edit-field')?.value || '';
    const input = document.getElementById('zhenxuan-profile-edit-input');
    const key = ZHENXUAN_PROFILE_EDIT_META[field] ? field : '';
    if (!key || !input) return;
    const value = key === 'avatar'
        ? normalizeZhenxuanSentence(input.value, 220)
        : normalizeZhenxuanShortText(input.value, key === 'member' ? 32 : 24);
    if (!value) {
        setZhenxuanProfileEditMessage('内容不能为空。', true);
        input.focus();
        return;
    }
    zhenxuanState.profile = normalizeZhenxuanProfile({ ...zhenxuanState.profile, [key]: value });
    writeZhenxuanState();
    renderZhenxuanProfileIdentity();
    closeZhenxuanProfileEditSheet();
    showZhenxuanToast('我的甄选资料已更新。', 1800);
}

function saveZhenxuanRefresh(event) {
    event.preventDefault();
    const input = document.getElementById('zhenxuan-refresh-input');
    void generateZhenxuanProducts(input?.value || '', { closeRefresh: true });
    input?.blur();
}

async function hydrateZhenxuanState() {
    zhenxuanState = await readZhenxuanState();
    refreshZhenxuanLogistics();
    syncZhenxuanSearchStateForCategory(zhenxuanState.activeCategory);
    renderZhenxuanHome();
    renderZhenxuanProfileIdentity();
    renderZhenxuanMessages();
    setZhenxuanPage(activeZhenxuanPage, false);
    return zhenxuanState;
}

async function openZhenxuanApp() {
    const app = getZhenxuanApp();
    if (!app) return;
    document.body.classList.remove('edit-mode');
    if (typeof closeSettingsApp === 'function') closeSettingsApp(true);
    if (typeof closeLetterApp === 'function') closeLetterApp(true);
    if (typeof closePrivateApp === 'function') closePrivateApp(true);
    if (typeof closePrologueApp === 'function') closePrologueApp(true);
    if (typeof closeStyleApp === 'function') closeStyleApp(true);
    if (typeof closeCommunityApp === 'function') closeCommunityApp(true);
    if (typeof closeEncounterApp === 'function') closeEncounterApp(true);
    if (typeof closeDossierApp === 'function') closeDossierApp(true);
    if (typeof closeWanyeApp === 'function') closeWanyeApp(true);
    if (typeof closeLingguangApp === 'function') closeLingguangApp(true);
    if (typeof closeGuideApp === 'function') closeGuideApp(true);
    if (typeof closePhoneApp === 'function') closePhoneApp(true);
    await hydrateZhenxuanState();
    document.body.classList.add('zhenxuan-open');
    app.classList.add('active');
}

function closeZhenxuanApp(instant = false) {
    const app = getZhenxuanApp();
    if (!app) return;
    closeZhenxuanGroupSheet();
    closeZhenxuanRefreshSheet();
    closeZhenxuanProfileEditSheet();
    closeZhenxuanProductDetail();
    closeZhenxuanAddressSheet();
    hideZhenxuanToast(true);
    if (instant) {
        const previousTransition = app.style.transition;
        app.style.transition = 'none';
        app.classList.remove('active');
        app.offsetHeight;
        requestAnimationFrame(() => {
            app.style.transition = previousTransition;
        });
    } else {
        app.classList.remove('active');
    }
    document.body.classList.remove('zhenxuan-open');
}


function isZhenxuanFavorite(productKey) {
    return Boolean(zhenxuanState.favorites?.some(item => item.key === productKey));
}

function isZhenxuanInCart(productKey) {
    return Boolean(zhenxuanState.cart?.some(item => item.key === productKey));
}

function getZhenxuanProductByKey(productKey) {
    const categoryId = zhenxuanState.activeCategory;
    const collection = getZhenxuanCollectionModel();
    const found = collection.items.find(item => getZhenxuanProductKey(item, categoryId) === productKey);
    return found ? getZhenxuanProductSnapshot(found, categoryId) : null;
}

function renderZhenxuanProducts() {
    const grid = document.getElementById('zhenxuan-product-grid');
    if (!grid) return;
    const categoryId = zhenxuanState.activeCategory;
    const collection = getZhenxuanCollectionModel();
    if (!collection.items.length) {
        grid.innerHTML = `
            <article class="zhenxuan-empty-card zhenxuan-empty-inline">
                <span class="zhenxuan-empty-kicker">NO RESULT</span>
                <h3>这一页暂时还没有排出商品</h3>
                <p>换一个关键词，或者点刷新重新生成当前标签页的整套陈列。</p>
            </article>
        `;
        return;
    }
    grid.innerHTML = collection.items.map(item => {
        const key = getZhenxuanProductKey(item, categoryId);
        const favored = isZhenxuanFavorite(key);
        const inCart = isZhenxuanInCart(key);
        return `
        <article class="zhenxuan-product-card interactive" data-tone="${escapeZhenxuanHtml(item.tone || 'blush')}" data-zhenxuan-product="${escapeZhenxuanHtml(key)}" tabindex="0" role="button" aria-label="查看 ${escapeZhenxuanHtml(item.name)} 详情">
            <div class="zhenxuan-product-cover">
                <div class="zhenxuan-product-cover-top">
                    <span class="zhenxuan-product-tag">${escapeZhenxuanHtml(item.tag)}</span>
                    <em class="zhenxuan-product-code">ATELIER / ${escapeZhenxuanHtml(item.serial || '01')}</em>
                </div>
                <div class="zhenxuan-product-serial" aria-hidden="true">${escapeZhenxuanHtml(item.serial || '01')}</div>
                <div class="zhenxuan-product-cover-copy">
                    <b class="zhenxuan-product-caption">${escapeZhenxuanHtml(item.caption || item.meta)}</b>
                    <strong class="zhenxuan-product-meta">${escapeZhenxuanHtml(item.meta)}</strong>
                </div>
                <div class="zhenxuan-product-quick-state" aria-hidden="true">
                    ${favored ? '<span>已收藏</span>' : ''}
                    ${inCart ? '<span>购物车</span>' : ''}
                </div>
            </div>
            <div class="zhenxuan-product-body">
                <div class="zhenxuan-product-body-top">
                    <div class="zhenxuan-product-heading-row">
                        <div class="zhenxuan-product-heading-copy">
                            <span class="zhenxuan-product-index">COLLECTIBLE ${escapeZhenxuanHtml(item.serial || '01')}</span>
                            <h3>${escapeZhenxuanHtml(item.name)}</h3>
                        </div>
                        <strong class="zhenxuan-product-price">${escapeZhenxuanHtml(item.price)}</strong>
                    </div>
                    <p>${escapeZhenxuanHtml(item.note)}</p>
                </div>
                <div class="zhenxuan-product-facts">
                    <div class="zhenxuan-product-fact">
                        <span>MATERIAL</span>
                        <strong>${escapeZhenxuanHtml(item.material || '本页材质')}</strong>
                    </div>
                    <div class="zhenxuan-product-fact">
                        <span>SCENE</span>
                        <strong>${escapeZhenxuanHtml(item.scene || '本页陈列')}</strong>
                    </div>
                </div>
            </div>
        </article>`;
    }).join('');
}


function createZhenxuanOrder(product, address) {
    const now = Date.now();
    const orderId = `ZX${now.toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const shipDueAt = getZhenxuanRandomFutureTime(now);
    const arrivalDueAt = getZhenxuanRandomFutureTime(shipDueAt);
    return normalizeZhenxuanOrder({
        ...product,
        orderId,
        status: 'paid',
        address: normalizeZhenxuanAddress(address),
        paidAt: now,
        shipDueAt,
        arrivalDueAt,
        logistics: [{ time: now, text: '订单已支付，等待仓库在 48 小时内随机发货。' }],
        updatedAt: now
    });
}

function updateZhenxuanOrderLogistics(order, now = Date.now()) {
    const next = normalizeZhenxuanOrder(order);
    if (!next) return null;
    let changed = false;
    if (next.status === 'paid' && now >= next.shipDueAt) {
        next.status = 'shipping';
        next.shippedAt = now;
        next.courier = next.courier || getZhenxuanCourier(next.orderId);
        next.trackingNo = next.trackingNo || `RZ${now.toString().slice(-8)}${getZhenxuanRandomInt(100, 999)}`;
        next.logistics = [
            { time: now, text: `${next.courier} 已揽收，虚拟物流开始更新。` },
            ...next.logistics
        ].slice(0, 12);
        changed = true;
    }
    if (next.status === 'shipping' && now >= next.arrivalDueAt) {
        next.status = 'delivered';
        next.deliveredAt = now;
        next.courier = next.courier || getZhenxuanCourier(next.orderId);
        next.pickupCode = next.pickupCode || getZhenxuanPickupCode();
        const eventText = ZHENXUAN_DELIVERY_EVENTS[getZhenxuanRandomInt(0, ZHENXUAN_DELIVERY_EVENTS.length - 1)];
        next.logistics = [
            { time: now, text: `${eventText}，取件码 ${next.pickupCode}。` },
            ...next.logistics
        ].slice(0, 12);
        changed = true;
    }
    if (changed) next.updatedAt = now;
    return next;
}

function refreshZhenxuanLogistics() {
    const before = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    const now = Date.now();
    let changed = false;
    const next = before.map(order => {
        const updated = updateZhenxuanOrderLogistics(order, now);
        if (JSON.stringify(updated) !== JSON.stringify(order)) changed = true;
        return updated;
    }).filter(Boolean);
    zhenxuanState.orders = next;
    if (changed) writeZhenxuanState();
    scheduleZhenxuanLogisticsRefresh();
    return changed;
}

function scheduleZhenxuanLogisticsRefresh() {
    window.clearTimeout(zhenxuanLogisticsTimer);
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    const pendingTimes = orders.flatMap(order => {
        if (order.status === 'paid') return [order.shipDueAt];
        if (order.status === 'shipping') return [order.arrivalDueAt];
        return [];
    }).filter(time => Number.isFinite(time) && time > Date.now());
    if (!pendingTimes.length) return;
    const delay = Math.max(1000, Math.min(...pendingTimes) - Date.now() + 500);
    zhenxuanLogisticsTimer = window.setTimeout(() => {
        const changed = refreshZhenxuanLogistics();
        if (changed) {
            renderZhenxuanProfileOrders();
            showZhenxuanToast('物流有新动态，已更新我的甄选。', 2400);
        }
    }, Math.min(delay, 60 * 60 * 1000));
}

function getZhenxuanStatusLabel(status) {
    if (status === 'delivered') return '已到达';
    if (status === 'shipping') return '运输中';
    return '待发货';
}

function renderZhenxuanProfileOrders() {
    const wrap = document.getElementById('zhenxuan-order-feed');
    const counts = document.getElementById('zhenxuan-order-counts');
    if (!wrap) return;
    refreshZhenxuanLogistics();
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    if (counts) {
        const paid = orders.filter(item => item.status === 'paid').length;
        const shipping = orders.filter(item => item.status === 'shipping').length;
        const delivered = orders.filter(item => item.status === 'delivered').length;
        counts.innerHTML = `<span>待发货 ${paid}</span><span>运输中 ${shipping}</span><span>已到达 ${delivered}</span>`;
    }
    if (!orders.length) {
        wrap.innerHTML = `
            <div class="zhenxuan-logistics-empty">
                <span>LOGISTICS</span>
                <strong>暂无购买订单</strong>
                <p>立即购买或购物车结算后，会在这里随机生成 24 小时内发货与到达的虚拟物流。</p>
            </div>
        `;
        return;
    }
    wrap.innerHTML = orders.map(order => {
        const latest = order.logistics?.[0];
        return `
            <article class="zhenxuan-order-card" data-status="${escapeZhenxuanHtml(order.status)}">
                <div class="zhenxuan-order-card-top">
                    <div>
                        <span>${escapeZhenxuanHtml(order.orderId)}</span>
                        <strong>${escapeZhenxuanHtml(order.name)}</strong>
                    </div>
                    <em>${escapeZhenxuanHtml(getZhenxuanStatusLabel(order.status))}</em>
                </div>
                <div class="zhenxuan-order-card-meta">
                    <span>${escapeZhenxuanHtml(order.price)}</span>
                    <span>${escapeZhenxuanHtml(order.courier || '等待随机快递公司')}</span>
                    <span>${escapeZhenxuanHtml(order.pickupCode ? `取件码 ${order.pickupCode}` : '取件码待生成')}</span>
                </div>
                <p class="zhenxuan-order-address">${escapeZhenxuanHtml(formatZhenxuanAddress(order.address) || '收货地址待补全')}</p>
                <div class="zhenxuan-logistics-line">
                    <b>${escapeZhenxuanHtml(formatZhenxuanTime(latest?.time || order.paidAt))}</b>
                    <span>${escapeZhenxuanHtml(latest?.text || '订单已创建，等待物流更新。')}</span>
                </div>
            </article>
        `;
    }).join('');
}

function renderZhenxuanCart() {
    const list = document.getElementById('zhenxuan-cart-list');
    const summary = document.getElementById('zhenxuan-cart-summary');
    const empty = document.getElementById('zhenxuan-cart-empty');
    if (!list || !summary || !empty) return;
    const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    zhenxuanState.cart = cart;
    empty.hidden = cart.length > 0;
    list.hidden = cart.length === 0;
    summary.hidden = cart.length === 0;
    list.innerHTML = cart.map(item => `
        <article class="zhenxuan-cart-item" data-tone="${escapeZhenxuanHtml(item.tone)}">
            <div class="zhenxuan-cart-thumb"><span>${escapeZhenxuanHtml(item.serial || '01')}</span></div>
            <div class="zhenxuan-cart-copy">
                <span>${escapeZhenxuanHtml(item.categoryLabel || '甄选')}</span>
                <strong>${escapeZhenxuanHtml(item.name)}</strong>
                <em>${escapeZhenxuanHtml(item.meta)} · ${escapeZhenxuanHtml(item.material)}</em>
            </div>
            <div class="zhenxuan-cart-side">
                <strong>${escapeZhenxuanHtml(item.price)}</strong>
                <button class="zhenxuan-cart-remove interactive" type="button" data-zhenxuan-cart-remove="${escapeZhenxuanHtml(item.key)}">移除</button>
            </div>
        </article>
    `).join('');
    summary.innerHTML = `
        <div><span>共 ${cart.length} 件</span><strong>甄选购物车</strong></div>
        <button class="zhenxuan-cart-checkout interactive" type="button" data-zhenxuan-cart-checkout="true">去结算</button>
    `;
}

function renderZhenxuanHome() {
    const input = document.getElementById('zhenxuan-search-input');
    const draft = getZhenxuanDraftQuery();
    if (input && input.value !== draft) input.value = draft;
    renderZhenxuanHeaderMeta();
    renderZhenxuanCategories();
    renderZhenxuanHero();
    renderZhenxuanProducts();
    renderZhenxuanRefreshSuggestions();
    renderZhenxuanCart();
    renderZhenxuanProfileIdentity();
    renderZhenxuanProfileOrders();
    renderZhenxuanMessages();
}

function setZhenxuanPage(page, scrollToTop = true) {
    const nextPage = ZHENXUAN_PAGES[page] ? page : 'home';
    activeZhenxuanPage = nextPage;
    document.querySelectorAll('[data-zhenxuan-page]').forEach(section => {
        const isActive = section.getAttribute('data-zhenxuan-page') === nextPage;
        section.hidden = !isActive;
        section.classList.toggle('active', isActive);
    });
    document.querySelectorAll('[data-zhenxuan-tab]').forEach(tab => {
        const isActive = tab.getAttribute('data-zhenxuan-tab') === nextPage;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderZhenxuanHeaderMeta();
    if (nextPage === 'cart') renderZhenxuanCart();
    if (nextPage === 'messages') renderZhenxuanMessages();
    if (nextPage === 'profile') {
        renderZhenxuanProfileIdentity();
        renderZhenxuanProfileOrders();
    }
    if (scrollToTop) {
        const stage = document.getElementById('zhenxuan-stage');
        if (stage) stage.scrollTop = 0;
    }
}

function openZhenxuanProductDetail(productKey) {
    const product = getZhenxuanProductByKey(productKey);
    const sheet = document.getElementById('zhenxuan-detail-sheet');
    const body = document.getElementById('zhenxuan-detail-body');
    if (!product || !sheet || !body) return;
    const favored = isZhenxuanFavorite(product.key);
    const inCart = isZhenxuanInCart(product.key);
    body.innerHTML = `
        <article class="zhenxuan-detail-card" data-tone="${escapeZhenxuanHtml(product.tone)}" data-zhenxuan-detail-product="${escapeZhenxuanHtml(product.key)}">
            <div class="zhenxuan-detail-visual">
                <span>${escapeZhenxuanHtml(product.tag)}</span>
                <b>${escapeZhenxuanHtml(product.serial || '01')}</b>
                <em>${escapeZhenxuanHtml(product.caption || product.meta)}</em>
            </div>
            <div class="zhenxuan-detail-copy">
                <span class="zhenxuan-detail-kicker">${escapeZhenxuanHtml(product.categoryLabel)} / SELECTED ITEM</span>
                <h2>${escapeZhenxuanHtml(product.name)}</h2>
                <strong class="zhenxuan-detail-price">${escapeZhenxuanHtml(product.price)}</strong>
                <p>${escapeZhenxuanHtml(product.note || '这件商品已经进入甄选详情页，可收藏、赠送、加入购物车或直接购买。')}</p>
                <div class="zhenxuan-detail-facts">
                    <div><span>MATERIAL</span><strong>${escapeZhenxuanHtml(product.material)}</strong></div>
                    <div><span>SCENE</span><strong>${escapeZhenxuanHtml(product.scene)}</strong></div>
                    <div><span>STATUS</span><strong>${favored ? '已收藏' : '可收藏'} · ${inCart ? '已入车' : '可加购'}</strong></div>
                </div>
            </div>
        </article>
        <div class="zhenxuan-detail-actions" data-zhenxuan-detail-actions="${escapeZhenxuanHtml(product.key)}">
            <button class="zhenxuan-detail-icon-action interactive${favored ? ' active' : ''}" type="button" data-zhenxuan-detail-action="favorite">
                <span>${favored ? '已收藏' : '收藏'}</span>
            </button>
            <button class="zhenxuan-detail-icon-action interactive" type="button" data-zhenxuan-detail-action="gift">
                <span>赠送</span>
            </button>
            <button class="zhenxuan-detail-main-action interactive${inCart ? ' active' : ''}" type="button" data-zhenxuan-detail-action="cart">
                ${inCart ? '已加入购物车' : '加入购物车'}
            </button>
            <button class="zhenxuan-detail-main-action interactive is-primary" type="button" data-zhenxuan-detail-action="buy">
                立即购买
            </button>
        </div>
    `;
    sheet.hidden = false;
}

function closeZhenxuanProductDetail() {
    const sheet = document.getElementById('zhenxuan-detail-sheet');
    if (sheet) sheet.hidden = true;
}

function toggleZhenxuanFavorite(product) {
    if (!product) return;
    const favorites = normalizeZhenxuanProductList(zhenxuanState.favorites, 120);
    const exists = favorites.some(item => item.key === product.key);
    zhenxuanState.favorites = exists
        ? favorites.filter(item => item.key !== product.key)
        : [{ ...product, updatedAt: Date.now() }, ...favorites].slice(0, 120);
    writeZhenxuanState();
    renderZhenxuanProducts();
    openZhenxuanProductDetail(product.key);
    showZhenxuanToast(exists ? `已取消收藏「${product.name}」` : `已收藏「${product.name}」`);
}

function addZhenxuanCart(product) {
    if (!product) return;
    const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    const exists = cart.some(item => item.key === product.key);
    zhenxuanState.cart = exists ? cart : [{ ...product, updatedAt: Date.now() }, ...cart].slice(0, 120);
    writeZhenxuanState();
    renderZhenxuanProducts();
    renderZhenxuanCart();
    openZhenxuanProductDetail(product.key);
    showZhenxuanToast(exists ? `「${product.name}」已在购物车` : `已加入购物车「${product.name}」`);
}

function giftZhenxuanProduct(product) {
    if (!product) return;
    zhenxuanState.gifts = [{ ...product, updatedAt: Date.now() }, ...normalizeZhenxuanProductList(zhenxuanState.gifts, 120)].slice(0, 120);
    writeZhenxuanState();
    showZhenxuanToast(`已生成「${product.name}」赠送意向，可继续接入联系人礼赠。`, 2600);
}

function openZhenxuanAddressSheet(mode, products) {
    const sheet = document.getElementById('zhenxuan-address-sheet');
    const form = document.getElementById('zhenxuan-address-form');
    const title = document.getElementById('zhenxuan-address-title');
    const intro = document.getElementById('zhenxuan-address-copy');
    if (!sheet || !form) return;
    const list = normalizeZhenxuanProductList(products, 120);
    if (!list.length) return;
    zhenxuanState.pendingCheckout = { mode, products: list };
    const address = normalizeZhenxuanAddress(zhenxuanState.address);
    form.receiver.value = address.receiver;
    form.phone.value = address.phone;
    form.region.value = address.region;
    form.detail.value = address.detail;
    if (title) title.textContent = mode === 'cart' ? '填写收货地址' : '确认收货地址';
    if (intro) intro.textContent = mode === 'cart'
        ? `本次将购买购物车内 ${list.length} 件商品，付款前必须填写完整收货地址。`
        : `购买「${list[0].name}」前必须填写完整收货地址。`;
    setZhenxuanAddressMessage('');
    sheet.hidden = false;
    window.setTimeout(() => form.receiver?.focus(), 80);
}

function closeZhenxuanAddressSheet() {
    const sheet = document.getElementById('zhenxuan-address-sheet');
    if (sheet) sheet.hidden = true;
    setZhenxuanAddressMessage('');
}

function setZhenxuanAddressMessage(message, isError = false) {
    const node = document.getElementById('zhenxuan-address-message');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', Boolean(isError));
}

function buyZhenxuanProduct(product) {
    if (!product) return;
    openZhenxuanAddressSheet('single', [product]);
}

function saveZhenxuanAddressAndCreateOrders(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const address = normalizeZhenxuanAddress({
        receiver: form.receiver?.value || '',
        phone: form.phone?.value || '',
        region: form.region?.value || '',
        detail: form.detail?.value || ''
    });
    if (!isZhenxuanAddressComplete(address)) {
        setZhenxuanAddressMessage('请完整填写收货人、手机号、地区和详细地址后再购买。', true);
        return;
    }
    const pending = zhenxuanState.pendingCheckout || {};
    const products = normalizeZhenxuanProductList(pending.products, 120);
    if (!products.length) {
        setZhenxuanAddressMessage('没有可购买的商品，请重新选择。', true);
        return;
    }
    const orders = products.map(product => createZhenxuanOrder(product, address));
    zhenxuanState.address = address;
    zhenxuanState.orders = [...orders, ...normalizeZhenxuanOrderList(zhenxuanState.orders, 120)].slice(0, 120);
    if (pending.mode === 'cart') zhenxuanState.cart = [];
    zhenxuanState.pendingCheckout = null;
    writeZhenxuanState();
    closeZhenxuanAddressSheet();
    closeZhenxuanProductDetail();
    renderZhenxuanCart();
    renderZhenxuanProducts();
    renderZhenxuanProfileOrders();
    setZhenxuanPage('profile');
    showZhenxuanToast(`已购买 ${orders.length} 件商品，48 小时内随机发货并更新物流。`, 3000);
}

function removeZhenxuanCart(productKey) {
    const before = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    const removed = before.find(item => item.key === productKey);
    zhenxuanState.cart = before.filter(item => item.key !== productKey);
    writeZhenxuanState();
    renderZhenxuanCart();
    renderZhenxuanProducts();
    if (removed) showZhenxuanToast(`已移除「${removed.name}」`);
}

function checkoutZhenxuanCart() {
    const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    if (!cart.length) {
        showZhenxuanToast('购物车还是空的。');
        return;
    }
    openZhenxuanAddressSheet('cart', cart);
}

function bindZhenxuanEvents() {
    const app = getZhenxuanApp();
    if (!app || zhenxuanEventsBound) return;
    zhenxuanEventsBound = true;
    void hydrateZhenxuanState();

    document.getElementById('zhenxuan-close-title')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanApp();
    });

    document.getElementById('zhenxuan-search-input')?.addEventListener('input', event => {
        syncZhenxuanSearchDraft(event.target?.value || '');
    });

    document.getElementById('zhenxuan-search-input')?.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        const input = event.target;
        generateZhenxuanProducts(input?.value || '');
        input?.blur?.();
    });

    document.getElementById('zhenxuan-search-submit')?.addEventListener('click', event => {
        event.preventDefault();
        const input = document.getElementById('zhenxuan-search-input');
        generateZhenxuanProducts(input?.value || '');
        input?.blur();
    });

    document.getElementById('zhenxuan-refresh-feed')?.addEventListener('click', event => {
        event.preventDefault();
        openZhenxuanRefreshSheet();
    });

    document.getElementById('zhenxuan-group-form')?.addEventListener('submit', saveZhenxuanGroup);
    document.getElementById('zhenxuan-refresh-form')?.addEventListener('submit', saveZhenxuanRefresh);
    document.getElementById('zhenxuan-profile-edit-form')?.addEventListener('submit', saveZhenxuanProfileEdit);
    document.getElementById('zhenxuan-address-form')?.addEventListener('submit', saveZhenxuanAddressAndCreateOrders);
    document.getElementById('zhenxuan-group-cancel')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanGroupSheet();
    });
    document.getElementById('zhenxuan-refresh-cancel')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanRefreshSheet();
    });
    document.getElementById('zhenxuan-group-dismiss')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanGroupSheet();
    });
    document.getElementById('zhenxuan-refresh-dismiss')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanRefreshSheet();
    });
    document.getElementById('zhenxuan-profile-edit-cancel')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanProfileEditSheet();
    });
    document.getElementById('zhenxuan-profile-edit-dismiss')?.addEventListener('click', event => {
        event.preventDefault();
        closeZhenxuanProfileEditSheet();
    });
    document.querySelectorAll('[data-zhenxuan-address-close]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            closeZhenxuanAddressSheet();
        });
    });
    document.getElementById('zhenxuan-group-sheet')?.addEventListener('click', event => {
        if (event.target === event.currentTarget) closeZhenxuanGroupSheet();
    });
    document.getElementById('zhenxuan-refresh-sheet')?.addEventListener('click', event => {
        if (event.target === event.currentTarget) closeZhenxuanRefreshSheet();
    });
    document.getElementById('zhenxuan-profile-edit-sheet')?.addEventListener('click', event => {
        if (event.target === event.currentTarget) closeZhenxuanProfileEditSheet();
    });
    document.getElementById('zhenxuan-address-sheet')?.addEventListener('click', event => {
        if (event.target === event.currentTarget) closeZhenxuanAddressSheet();
    });

    app.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const tab = target?.closest('[data-zhenxuan-tab]');
        if (tab) {
            event.preventDefault();
            setZhenxuanPage(tab.getAttribute('data-zhenxuan-tab') || 'home');
            return;
        }
        const category = target?.closest('[data-zhenxuan-category]');
        if (category) {
            event.preventDefault();
            zhenxuanState.activeCategory = category.getAttribute('data-zhenxuan-category') || 'recommend';
            zhenxuanState.refreshSeed = 0;
            syncZhenxuanSearchStateForCategory(zhenxuanState.activeCategory);
            writeZhenxuanState();
            renderZhenxuanHome();
            setZhenxuanPage('home', false);
            return;
        }
        const refreshPreset = target?.closest('[data-zhenxuan-refresh-keyword]');
        if (refreshPreset) {
            event.preventDefault();
            const keyword = refreshPreset.getAttribute('data-zhenxuan-refresh-keyword') || '';
            const input = document.getElementById('zhenxuan-refresh-input');
            if (input) {
                input.value = keyword;
                input.focus();
                input.setSelectionRange(keyword.length, keyword.length);
            }
            syncZhenxuanSearchDraft(keyword);
            return;
        }
        const addCategory = target?.closest('[data-zhenxuan-add-category]');
        if (addCategory) {
            event.preventDefault();
            openZhenxuanGroupSheet();
            return;
        }
        const productCard = target?.closest('[data-zhenxuan-product]');
        if (productCard) {
            event.preventDefault();
            openZhenxuanProductDetail(productCard.getAttribute('data-zhenxuan-product') || '');
            return;
        }
        const detailAction = target?.closest('[data-zhenxuan-detail-action]');
        if (detailAction) {
            event.preventDefault();
            const productKey = detailAction.closest('[data-zhenxuan-detail-actions]')?.getAttribute('data-zhenxuan-detail-actions') || '';
            const product = getZhenxuanProductByKey(productKey) || normalizeZhenxuanProductList([...zhenxuanState.cart, ...zhenxuanState.favorites, ...zhenxuanState.gifts, ...zhenxuanState.orders], 400).find(item => item.key === productKey);
            const action = detailAction.getAttribute('data-zhenxuan-detail-action');
            if (action === 'service') openZhenxuanServiceChat(productKey);
            if (action === 'favorite') toggleZhenxuanFavorite(product);
            if (action === 'cart') addZhenxuanCart(product);
            if (action === 'gift') giftZhenxuanProduct(product);
            if (action === 'buy') buyZhenxuanProduct(product);
            return;
        }
        const detailClose = target?.closest('[data-zhenxuan-detail-close]');
        if (detailClose || target?.id === 'zhenxuan-detail-sheet') {
            event.preventDefault();
            closeZhenxuanProductDetail();
            return;
        }
        const cartRemove = target?.closest('[data-zhenxuan-cart-remove]');
        if (cartRemove) {
            event.preventDefault();
            removeZhenxuanCart(cartRemove.getAttribute('data-zhenxuan-cart-remove') || '');
            return;
        }
        const cartCheckout = target?.closest('[data-zhenxuan-cart-checkout]');
        if (cartCheckout) {
            event.preventDefault();
            checkoutZhenxuanCart();
            return;
        }
        const profileAction = target?.closest('[data-zhenxuan-profile-action]');
        if (profileAction) {
            event.preventDefault();
            const key = profileAction.getAttribute('data-zhenxuan-profile-action') || '';
            if (key === 'address') {
                const address = normalizeZhenxuanAddress(zhenxuanState.address);
                showZhenxuanToast(isZhenxuanAddressComplete(address) ? `默认收货地址：${formatZhenxuanAddress(address)}` : '暂未填写默认收货地址，购买时会要求填写。', 2600);
                return;
            }
            if (key === 'service') {
                openZhenxuanServiceChat('', { key: 'official', merchantName: '甄选官方客服', productName: '平台咨询' });
                return;
            }
            if (ZHENXUAN_PROFILE_ACTION_MESSAGES[key]) showZhenxuanToast(ZHENXUAN_PROFILE_ACTION_MESSAGES[key], 2200);
        }
    });

    app.addEventListener('keydown', event => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const productCard = target?.closest('[data-zhenxuan-product]');
        if (productCard && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openZhenxuanProductDetail(productCard.getAttribute('data-zhenxuan-product') || '');
            return;
        }
        const tab = target?.closest('[data-zhenxuan-tab]');
        if (tab && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setZhenxuanPage(tab.getAttribute('data-zhenxuan-tab') || 'home');
        }
    });

    app.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
    app.addEventListener('touchmove', event => event.stopPropagation(), { passive: true });
    app.addEventListener('mousedown', event => event.stopPropagation());
}

bindZhenxuanEvents();

document.querySelector('.home-indicator')?.addEventListener('click', () => {
    if (getZhenxuanApp()?.classList.contains('active')) closeZhenxuanApp(true);
});

document.addEventListener('keydown', event => {
    if (!getZhenxuanApp()?.classList.contains('active') || event.key !== 'Escape') return;
    const zhenxuanDetailSheet = document.getElementById('zhenxuan-detail-sheet');
    if (zhenxuanDetailSheet && !zhenxuanDetailSheet.hidden) {
        closeZhenxuanProductDetail();
    } else if (!document.getElementById('zhenxuan-refresh-sheet')?.hidden) {
        closeZhenxuanRefreshSheet();
    } else if (!document.getElementById('zhenxuan-group-sheet')?.hidden) {
        closeZhenxuanGroupSheet();
    } else {
        closeZhenxuanApp();
    }
});

window.openZhenxuanApp = openZhenxuanApp;
window.closeZhenxuanApp = closeZhenxuanApp;

/* --- v0098 concrete page checkout + assets payment chain: detail/checkout are real pages, purchase is payable --- */
var zhenxuanDetailProductKey = '';
var zhenxuanCheckoutReturnPage = 'home';
var zhenxuanOrderStatusFilter = 'paid';
var zhenxuanCheckoutSubmitting = false;

Object.assign(ZHENXUAN_PAGES, {
    detail: { note: '商品详情页：收藏、赠送、加购、立即购买与客服入口均在页面内完成。' },
    checkout: { note: '结算页：确认商品、填写 user 或 TA 的地址，并通过资管完成付款。' },
    orders: { note: '订单状态页：待发货、未送达、已收货与售后条目在这里查看。' }
});

function getZhenxuanServiceChatKey(product, fallback = 'official') {
    if (product?.key) return `product:${product.key}`;
    return `service:${normalizeZhenxuanShortText(fallback || 'official', 48) || 'official'}`;
}

function makeZhenxuanServiceMessage(role, text) {
    return normalizeZhenxuanServiceMessage({ role, text, time: Date.now() });
}

function createZhenxuanServiceChat(product, options = {}) {
    const merchantName = normalizeZhenxuanShortText(product?.merchantName || options.merchantName || '甄选官方客服', 24) || '甄选官方客服';
    const productName = normalizeZhenxuanShortText(product?.name || options.productName || '平台咨询', 32) || '平台咨询';
    const key = getZhenxuanServiceChatKey(product, options.key || merchantName);
    const persona = getZhenxuanServicePersona(options.personaSeed || `${merchantName}:${productName}:${key}`);
    const isOfficial = !product?.key;
    const welcome = isOfficial
        ? `${persona.greeting} 地址、订单、退款或平台设置都可以直接发给我。`
        : `${persona.greeting} 当前咨询的是「${productName}」，店铺是${merchantName}。`;
    return normalizeZhenxuanServiceChat({
        key,
        merchantName,
        productKey: product?.key || '',
        productName,
        productPrice: product?.price || '',
        productSerial: product?.serial || 'ZX',
        personaId: persona.id,
        personaName: persona.name,
        personaTone: persona.tone,
        personaVersion: ZHENXUAN_SERVICE_PERSONA_VERSION,
        updatedAt: Date.now(),
        messages: [makeZhenxuanServiceMessage('service', welcome)]
    });
}

function hydrateZhenxuanServicePersona(chat) {
    if (!chat) return getZhenxuanServicePersona('official');
    const seed = `${chat.merchantName}:${chat.productName}:${chat.key}:diverse`;
    const needsMigration = chat.personaVersion !== ZHENXUAN_SERVICE_PERSONA_VERSION;
    const persona = needsMigration ? getZhenxuanServicePersona(seed) : getZhenxuanServicePersonaById(chat.personaId, seed);
    chat.personaId = persona.id;
    chat.personaName = persona.name;
    chat.personaTone = persona.tone;
    chat.personaVersion = ZHENXUAN_SERVICE_PERSONA_VERSION;
    return persona;
}

function getZhenxuanActiveServiceChat() {
    const chats = normalizeZhenxuanServiceChats(zhenxuanState.serviceChats);
    zhenxuanState.serviceChats = chats;
    const key = normalizeZhenxuanShortText(zhenxuanState.activeServiceChatKey || '', 120);
    return key && chats[key] ? chats[key] : null;
}

function ensureZhenxuanServiceChat(productKey = '', options = {}) {
    const product = productKey ? (getZhenxuanProductByKey(productKey) || findZhenxuanStoredProductByKey(productKey)) : null;
    const key = getZhenxuanServiceChatKey(product, options.key || options.merchantName || 'official');
    const chats = normalizeZhenxuanServiceChats(zhenxuanState.serviceChats);
    let chat = chats[key];
    if (!chat) chat = createZhenxuanServiceChat(product, { ...options, key });
    hydrateZhenxuanServicePersona(chat);
    chat.updatedAt = Date.now();
    chats[key] = chat;
    zhenxuanState.serviceChats = chats;
    zhenxuanState.activeServiceChatKey = key;
    writeZhenxuanState();
    return chat;
}

function getZhenxuanServiceIntent(text) {
    const q = String(text || '').trim();
    if (/发货|物流|快递|多久|几天|到|送达|取件|单号|配送|派送|运输/.test(q)) return 'shipping';
    if (/价格|优惠|便宜|折扣|券|活动|满减|包邮|值不值|贵|划算|预算/.test(q)) return 'price';
    if (/退款|售后|退货|换货|坏|破损|不想要|退|赔|投诉/.test(q)) return 'aftersale';
    if (/赠送|礼物|TA|ta|地址|收货人|手机号|送人|寄给/.test(q)) return 'gift';
    if (/尺寸|大小|尺码|规格|容量|重量|多少|型号|长宽|参数/.test(q)) return 'spec';
    if (/颜色|色差|质感|材质|好看|丑|高级|包装|香|味道|搭配|审美/.test(q)) return 'visual';
    if (/你好|在吗|客服|有人|hi|hello|哈喽|您好/.test(q)) return 'greet';
    return 'other';
}

function pickZhenxuanServiceLine(list, seed, fallback = '') {
    const source = Array.isArray(list) && list.length ? list : [fallback];
    const index = Math.abs(hashZhenxuanSeed(seed || fallback || 'service')) % source.length;
    return source[index] || fallback || '';
}

function fillZhenxuanServiceTemplate(text, chat) {
    const productName = chat.productName || '这件商品';
    const merchantName = chat.merchantName || '店铺';
    const price = chat.productPrice || '详情页价格';
    return String(text || '')
        .replace(/\{product\}/g, productName)
        .replace(/\{merchant\}/g, merchantName)
        .replace(/\{price\}/g, price);
}

function compactZhenxuanServiceReply(text) {
    return String(text || '')
        .replace(/\s+/g, ' ')
        .replace(/\s+([，。；：])/g, '$1')
        .trim()
        .slice(0, 260);
}

function getZhenxuanServiceReply(text, chat) {
    const q = String(text || '').trim();
    const persona = hydrateZhenxuanServicePersona(chat);
    const intent = getZhenxuanServiceIntent(q);
    const seed = `${chat.key}:${q}:${chat.messages?.length || 0}:${persona.id}:${intent}`;
    const opener = pickZhenxuanServiceLine(persona.openers, `${seed}:opener`, '');
    const body = fillZhenxuanServiceTemplate(
        pickZhenxuanServiceLine(persona.hooks?.[intent], `${seed}:body`, persona.hooks?.other?.[0] || '我已经记录这次咨询。'),
        chat
    );
    const suffixes = Array.isArray(persona.suffixes) && persona.suffixes.length ? persona.suffixes : ['我会继续为您处理。'];
    const suffix = pickZhenxuanServiceLine(suffixes, `${seed}:suffix`, '');
    const closer = pickZhenxuanServiceLine(persona.closers, `${seed}:closer`, '');
    const variant = Math.abs(hashZhenxuanSeed(`${seed}:variant`)) % 4;

    let reply = '';
    if (variant === 0) {
        reply = [opener, body, suffix].filter(Boolean).join(' ');
    } else if (variant === 1) {
        reply = [body, closer].filter(Boolean).join(' ');
    } else if (variant === 2) {
        reply = [opener, body, closer].filter(Boolean).join(' ');
    } else {
        reply = [body, suffix, closer].filter(Boolean).join(' ');
    }

    return compactZhenxuanServiceReply(reply);
}

function appendZhenxuanServiceReply(chatKey, replyText) {
    const chats = normalizeZhenxuanServiceChats(zhenxuanState.serviceChats);
    const chat = chats[chatKey];
    if (!chat) return;
    hydrateZhenxuanServicePersona(chat);
    chat.messages = [...chat.messages, makeZhenxuanServiceMessage('service', replyText)].filter(Boolean).slice(-120);
    chat.updatedAt = Date.now();
    chats[chat.key] = chat;
    zhenxuanState.serviceChats = chats;
    zhenxuanState.activeServiceChatKey = chat.key;
    writeZhenxuanState();
    renderZhenxuanMessages();
}

function submitZhenxuanServiceForm(form) {
    if (!form) form = document.getElementById('zhenxuan-service-form');
    const input = form?.querySelector('input[name="message"]');
    const value = input?.value || '';
    if (input) input.value = '';
    sendZhenxuanServiceMessage(value);
}


function renderZhenxuanMessages() {
    const page = document.getElementById('zhenxuan-service-page');
    if (!page) return;
    const chats = normalizeZhenxuanServiceChats(zhenxuanState.serviceChats);
    Object.values(chats).forEach(hydrateZhenxuanServicePersona);
    zhenxuanState.serviceChats = chats;
    const active = getZhenxuanActiveServiceChat();
    if (active) hydrateZhenxuanServicePersona(active);
    const chatList = Object.values(chats).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    if (!active) {
        if (!chatList.length) {
            page.innerHTML = `
                <section class="zhenxuan-service-list zhenxuan-service-empty-wrap">
                    <div class="zhenxuan-service-list-head">
                        <button class="zhenxuan-service-back interactive" type="button" data-zhenxuan-chat-close="true" aria-label="返回甄选首页">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"></path></svg>
                        </button>
                        <div><span>SERVICE</span><h2>客服消息</h2></div>
                        <em>空</em>
                    </div>
                    <div class="zhenxuan-empty-card zhenxuan-empty-page zhenxuan-service-empty-card">
                        <div class="zhenxuan-empty-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"></path></svg>
                        </div>
                        <span class="zhenxuan-empty-kicker">MESSAGES</span>
                        <h2>这里还没有客服会话</h2>
                        <p>从商品详情页点击“客服”，会进入全屏聊天，不显示客服头像，也不会露出底部 Dock。</p>
                    </div>
                </section>
            `;
            return;
        }
        page.innerHTML = `
            <section class="zhenxuan-service-list">
                <div class="zhenxuan-service-list-head">
                    <button class="zhenxuan-service-back interactive" type="button" data-zhenxuan-chat-close="true" aria-label="返回甄选首页">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"></path></svg>
                    </button>
                    <div><span>SERVICE</span><h2>客服消息</h2></div>
                    <em>${chatList.length}</em>
                </div>
                <div class="zhenxuan-service-thread-list">
                    ${chatList.map(chat => {
                        const persona = hydrateZhenxuanServicePersona(chat);
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        return `
                        <button class="zhenxuan-service-thread interactive" type="button" data-zhenxuan-service-chat-open="${escapeZhenxuanHtml(chat.key)}">
                            <span class="zhenxuan-service-thread-kicker">${escapeZhenxuanHtml(persona.name)} · ${escapeZhenxuanHtml(chat.productPrice || '咨询')}</span>
                            <b>${escapeZhenxuanHtml(chat.merchantName)}</b>
                            <span>${escapeZhenxuanHtml(chat.productName)}</span>
                            <em>${escapeZhenxuanHtml(lastMessage?.text || '继续咨询')}</em>
                        </button>`;
                    }).join('')}
                </div>
            </section>
        `;
        return;
    }
    const persona = hydrateZhenxuanServicePersona(active);
    const messages = active.messages.length ? active.messages : [makeZhenxuanServiceMessage('service', `${persona.greeting}`)];
    page.innerHTML = `
        <section class="zhenxuan-service-chat" data-zhenxuan-service-chat="${escapeZhenxuanHtml(active.key)}">
            <div class="zhenxuan-service-head">
                <button class="zhenxuan-service-back interactive" type="button" data-zhenxuan-service-chat-list="true" aria-label="返回客服会话列表">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6"></path></svg>
                </button>
                <div class="zhenxuan-service-title-block">
                    <span>${escapeZhenxuanHtml(active.merchantName)}</span>
                    <strong>${escapeZhenxuanHtml(active.productName)}</strong>
                    <small>${escapeZhenxuanHtml(persona.name)} · ${escapeZhenxuanHtml(persona.tone)}</small>
                </div>
                <em>${escapeZhenxuanHtml(active.productPrice || '客服')}</em>
            </div>
            <div class="zhenxuan-service-messages" id="zhenxuan-service-messages">
                ${messages.map(message => `
                    <article class="zhenxuan-service-message is-${message.role}">
                        <div class="zhenxuan-service-bubble">
                            <p>${escapeZhenxuanHtml(message.text)}</p>
                            <time>${escapeZhenxuanHtml(formatZhenxuanTime(message.time))}</time>
                        </div>
                    </article>
                `).join('')}
            </div>
            <form class="zhenxuan-service-input" id="zhenxuan-service-form" data-zhenxuan-service-form="true" autocomplete="off">
                <input id="zhenxuan-service-input" name="message" type="text" placeholder="输入问题，按回车或发送" enterkeyhint="send" autocomplete="off">
                <button class="interactive" type="submit">发送</button>
            </form>
        </section>
    `;
    bindZhenxuanServiceFormDirect();
    window.setTimeout(() => {
        const wrap = document.getElementById('zhenxuan-service-messages');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
    }, 40);
}


function openZhenxuanServiceChat(productKey = '', options = {}) {
    ensureZhenxuanServiceChat(productKey || zhenxuanDetailProductKey || '', options);
    renderZhenxuanMessages();
    setZhenxuanPage('messages');
}

function sendZhenxuanServiceMessage(text) {
    const messageText = normalizeZhenxuanSentence(text, 280);
    if (!messageText) return;
    const chat = getZhenxuanActiveServiceChat();
    if (!chat) return;
    hydrateZhenxuanServicePersona(chat);
    const userMessage = makeZhenxuanServiceMessage('user', messageText);
    const replyText = getZhenxuanServiceReply(messageText, chat);
    chat.messages = [...chat.messages, userMessage].filter(Boolean).slice(-120);
    chat.updatedAt = Date.now();
    zhenxuanState.serviceChats = { ...normalizeZhenxuanServiceChats(zhenxuanState.serviceChats), [chat.key]: chat };
    zhenxuanState.activeServiceChatKey = chat.key;
    writeZhenxuanState();
    renderZhenxuanMessages();
    const delay = 360 + (Math.abs(hashZhenxuanSeed(`${chat.key}:${messageText}`)) % 520);
    window.setTimeout(() => appendZhenxuanServiceReply(chat.key, replyText), delay);
}

function bindZhenxuanServiceFormDirect() {
    const form = document.getElementById('zhenxuan-service-form');
    if (!form || form.dataset.zhenxuanDirectBound === 'v0110') return;
    form.dataset.zhenxuanDirectBound = 'v0110';
    const input = form.querySelector('input[name="message"]');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', event => {
        event.preventDefault();
        submitZhenxuanServiceForm(form);
    });
    button?.addEventListener('click', event => {
        event.preventDefault();
        submitZhenxuanServiceForm(form);
    });
    input?.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
        event.preventDefault();
        submitZhenxuanServiceForm(form);
    });
    input?.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
    input?.addEventListener('mousedown', event => event.stopPropagation());
}


function getZhenxuanMerchantNames() {
    return ['月鹿百货', '云鸽生活馆', '黑金甄选', '银杏礼物社', 'Rinno Atelier', '星澜买手店', '雾岛香氛局', '白桃衣橱', '夜航精品仓', '栀光集市', '棉月家居', '流金私选'];
}

function getZhenxuanMerchantName(seed = '') {
    const names = getZhenxuanMerchantNames();
    const hash = typeof hashZhenxuanSeed === 'function'
        ? hashZhenxuanSeed(seed || Date.now())
        : String(seed || '').split('').reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
    return names[Math.abs(hash) % names.length];
}

function normalizeZhenxuanPhone(value) {
    return normalizeZhenxuanShortText(value || '', 24).replace(/\s+/g, ' ').trim();
}

function isZhenxuanPhoneValid(value) {
    const raw = normalizeZhenxuanPhone(value);
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 16) return false;
    return /^\+?[0-9][0-9\s\-()]{5,22}[0-9]$/.test(raw);
}

function normalizeZhenxuanAddress(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
        receiver: normalizeZhenxuanShortText(source.receiver || '', 18),
        phone: normalizeZhenxuanPhone(source.phone || ''),
        region: normalizeZhenxuanShortText(source.region || '', 36),
        detail: normalizeZhenxuanSentence(source.detail || '', 80)
    };
}

function isZhenxuanAddressComplete(address) {
    const item = normalizeZhenxuanAddress(address);
    return Boolean(item.receiver && isZhenxuanPhoneValid(item.phone) && item.region && item.detail);
}

function getZhenxuanRandomShipTime(from = Date.now()) {
    return from + getZhenxuanRandomInt(10 * 60 * 1000, 48 * 60 * 60 * 1000);
}

function getZhenxuanRandomArrivalTime(from = Date.now()) {
    return from + getZhenxuanRandomInt(45 * 60 * 1000, 24 * 60 * 60 * 1000);
}

function normalizeZhenxuanStoredProduct(value) {
    const source = value && typeof value === 'object' ? value : {};
    const name = normalizeZhenxuanShortText(source.name || '', 24);
    if (!name) return null;
    const categoryId = String(source.categoryId || 'recommend');
    const seed = [source.key || '', categoryId, source.serial || '', name, source.price || ''].join('|');
    const product = {
        key: normalizeZhenxuanShortText(source.key || '', 96),
        categoryId,
        categoryLabel: normalizeZhenxuanShortText(source.categoryLabel || getZhenxuanCategoryLabel?.(categoryId) || '推荐', 12),
        merchantName: normalizeZhenxuanShortText(source.merchantName || source.merchant || getZhenxuanMerchantName(seed), 24),
        name,
        price: normalizeZhenxuanPrice(source.price),
        tag: normalizeZhenxuanTag(source.tag || 'EDIT'),
        meta: normalizeZhenxuanShortText(source.meta || '本页精选', 20),
        note: normalizeZhenxuanSentence(source.note || '', 100),
        tone: normalizeZhenxuanTone(source.tone, 'champagne'),
        material: normalizeZhenxuanShortText(source.material || '精选材质', 18),
        scene: normalizeZhenxuanShortText(source.scene || '本页陈列', 26),
        caption: normalizeZhenxuanShortText(source.caption || source.meta || '编辑主推', 20),
        serial: normalizeZhenxuanShortText(source.serial || '01', 6),
        quantity: Math.max(1, Math.min(99, Number.parseInt(source.quantity, 10) || 1)),
        createdAt: Number.isFinite(Number(source.createdAt)) ? Number(source.createdAt) : Date.now(),
        updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : Date.now()
    };
    product.key = product.key || getZhenxuanProductKey(product, product.categoryId);
    product.merchantName = product.merchantName || getZhenxuanMerchantName(product.key);
    return product;
}

function getZhenxuanProductSnapshot(item, categoryId = zhenxuanState.activeCategory) {
    const categoryLabel = getZhenxuanCategoryLabel(categoryId);
    const key = getZhenxuanProductKey(item, categoryId);
    return normalizeZhenxuanStoredProduct({
        ...item,
        key,
        categoryId,
        categoryLabel,
        merchantName: item?.merchantName || getZhenxuanMerchantName(key),
        quantity: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
}

function normalizeZhenxuanOrder(value) {
    const product = normalizeZhenxuanStoredProduct(value);
    if (!product) return null;
    const source = value && typeof value === 'object' ? value : {};
    const now = Date.now();
    const orderId = normalizeZhenxuanShortText(source.orderId || `ZX${now.toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`, 32);
    const paidAt = Number.isFinite(Number(source.paidAt)) ? Number(source.paidAt) : (Number.isFinite(Number(source.createdAt)) ? Number(source.createdAt) : now);
    const shipDueAt = Number.isFinite(Number(source.shipDueAt)) ? Number(source.shipDueAt) : getZhenxuanRandomShipTime(paidAt);
    const arrivalDueAt = Number.isFinite(Number(source.arrivalDueAt)) ? Number(source.arrivalDueAt) : getZhenxuanRandomArrivalTime(shipDueAt);
    const allowedStatus = new Set(['paid', 'shipping', 'delivered', 'received', 'refunding', 'refunded']);
    const status = allowedStatus.has(String(source.status || '')) ? String(source.status) : 'paid';
    const logistics = Array.isArray(source.logistics) ? source.logistics
        .map(entry => ({
            time: Number.isFinite(Number(entry?.time)) ? Number(entry.time) : now,
            text: normalizeZhenxuanSentence(entry?.text || '', 100)
        }))
        .filter(entry => entry.text)
        .slice(0, 16) : [];
    return {
        ...product,
        orderId,
        status,
        address: normalizeZhenxuanAddress(source.address),
        recipientType: source.recipientType === 'char' ? 'char' : 'user',
        recipientContactId: normalizeZhenxuanShortText(source.recipientContactId || source.contactId || '', 64),
        recipientName: normalizeZhenxuanShortText(source.recipientName || source.receiver || '', 24),
        paidAt,
        shipDueAt,
        arrivalDueAt,
        shippedAt: Number.isFinite(Number(source.shippedAt)) ? Number(source.shippedAt) : 0,
        deliveredAt: Number.isFinite(Number(source.deliveredAt)) ? Number(source.deliveredAt) : 0,
        confirmedAt: Number.isFinite(Number(source.confirmedAt)) ? Number(source.confirmedAt) : 0,
        refundAt: Number.isFinite(Number(source.refundAt)) ? Number(source.refundAt) : 0,
        giftReceiptSentAt: Number.isFinite(Number(source.giftReceiptSentAt)) ? Number(source.giftReceiptSentAt) : 0,
        courier: normalizeZhenxuanShortText(source.courier || '', 18),
        trackingNo: normalizeZhenxuanShortText(source.trackingNo || '', 28),
        pickupCode: normalizeZhenxuanShortText(source.pickupCode || '', 16),
        logistics,
        updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : now
    };
}

function createZhenxuanOrder(product, address, options = {}) {
    const now = Date.now();
    const orderId = `ZX${now.toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const shipDueAt = getZhenxuanRandomShipTime(now);
    const arrivalDueAt = getZhenxuanRandomArrivalTime(shipDueAt);
    const recipientType = options.recipientType === 'char' ? 'char' : 'user';
    return normalizeZhenxuanOrder({
        ...product,
        orderId,
        status: 'paid',
        address: normalizeZhenxuanAddress(address),
        recipientType,
        recipientContactId: options.recipientContactId || '',
        recipientName: options.recipientName || address?.receiver || '',
        paidAt: now,
        shipDueAt,
        arrivalDueAt,
        logistics: [{ time: now, text: `订单已支付，${recipientType === 'char' ? '将寄给 TA，' : ''}等待仓库在 48 小时内随机发货。` }],
        updatedAt: now
    });
}

function updateZhenxuanOrderLogistics(order, now = Date.now()) {
    const next = normalizeZhenxuanOrder(order);
    if (!next) return null;
    if (['received', 'refunding', 'refunded'].includes(next.status)) return next;
    let changed = false;
    if (next.status === 'paid' && now >= next.shipDueAt) {
        next.status = 'shipping';
        next.shippedAt = now;
        next.courier = next.courier || getZhenxuanShippingCompany(next.orderId);
        next.trackingNo = next.trackingNo || getZhenxuanTrackingNo(next.orderId);
        next.logistics = [{ time: now, text: `${next.courier} 已揽收「${next.name}」，正在送往目的地。` }, ...next.logistics].slice(0, 16);
        changed = true;
    }
    if ((next.status === 'shipping' || next.status === 'delivered') && now >= next.arrivalDueAt && !next.deliveredAt) {
        next.status = 'delivered';
        next.deliveredAt = now;
        next.pickupCode = next.pickupCode || getZhenxuanPickupCode(next.orderId);
        next.courier = next.courier || getZhenxuanShippingCompany(next.orderId);
        next.logistics = [{ time: now, text: `${next.courier} 已到达目的地，取件码 ${next.pickupCode}。` }, ...next.logistics].slice(0, 16);
        changed = true;
    }
    if (changed) next.updatedAt = now;
    return next;
}

function refreshZhenxuanLogistics() {
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    let changed = false;
    const updated = orders.map(order => {
        const next = updateZhenxuanOrderLogistics(order);
        if (next && JSON.stringify(next) !== JSON.stringify(order)) changed = true;
        return next || order;
    });
    if (changed) {
        zhenxuanState.orders = updated;
        writeZhenxuanState();
    }
}

function getZhenxuanShippingCompany(seed = '') {
    const companies = ['云鸽速运', '月鹿快递', '星澜物流', 'Rinno 专送', '银杏驿达', '黑金同城配', '白桃快运'];
    const hash = typeof hashZhenxuanSeed === 'function' ? hashZhenxuanSeed(seed) : String(seed).length;
    return companies[Math.abs(hash) % companies.length];
}

function getZhenxuanTrackingNo(seed = '') {
    const hash = Math.abs(typeof hashZhenxuanSeed === 'function' ? hashZhenxuanSeed(seed) : Date.now());
    return `ZX${String(hash).slice(0, 5)}${Date.now().toString().slice(-5)}`;
}

function getZhenxuanPickupCode(seed = '') {
    const hash = Math.abs(typeof hashZhenxuanSeed === 'function' ? hashZhenxuanSeed(seed) : Date.now());
    return String(100000 + (hash % 900000));
}

function getZhenxuanStatusLabel(status) {
    if (status === 'shipping') return '运输中';
    if (status === 'delivered') return '待取件';
    if (status === 'received') return '已收货';
    if (status === 'refunding') return '退款中';
    if (status === 'refunded') return '已退款';
    return '待发货';
}

function getZhenxuanOrderStatusBuckets(orders = zhenxuanState.orders) {
    const normalized = normalizeZhenxuanOrderList(orders, 120);
    return {
        paid: normalized.filter(order => order.status === 'paid'),
        shipping: normalized.filter(order => order.status === 'shipping' || order.status === 'delivered'),
        received: normalized.filter(order => order.status === 'received'),
        refund: normalized.filter(order => order.status === 'refunding' || order.status === 'refunded')
    };
}

function getZhenxuanOrderQuantityTotal(orders = []) {
    return normalizeZhenxuanOrderList(orders, 120).reduce((sum, order) => sum + (Number(order.quantity) || 1), 0);
}

function setZhenxuanPage(page, scrollToTop = true) {
    const nextPage = ZHENXUAN_PAGES[page] ? page : 'home';
    activeZhenxuanPage = nextPage;
    document.querySelectorAll('[data-zhenxuan-page]').forEach(section => {
        const isActive = section.getAttribute('data-zhenxuan-page') === nextPage;
        section.hidden = !isActive;
        section.classList.toggle('active', isActive);
    });
    document.querySelectorAll('[data-zhenxuan-tab]').forEach(tab => {
        const isActive = tab.getAttribute('data-zhenxuan-tab') === nextPage;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    const zhenxuanApp = getZhenxuanApp();
    zhenxuanApp?.classList.toggle('zhenxuan-subflow-active', ['detail', 'checkout', 'orders'].includes(nextPage));
    zhenxuanApp?.classList.toggle('zhenxuan-chat-active', nextPage === 'messages');
    renderZhenxuanHeaderMeta();
    if (nextPage === 'cart') renderZhenxuanCart();
    if (nextPage === 'messages') renderZhenxuanMessages();
    if (nextPage === 'profile') {
        renderZhenxuanProfileIdentity();
        renderZhenxuanProfileOrders();
    }
    if (nextPage === 'orders') renderZhenxuanOrdersPage(zhenxuanOrderStatusFilter);
    if (scrollToTop) {
        const stage = document.getElementById('zhenxuan-stage');
        if (stage) stage.scrollTop = 0;
    }
}

function findZhenxuanStoredProductByKey(productKey) {
    const pools = [
        ...normalizeZhenxuanProductList(zhenxuanState.cart, 120),
        ...normalizeZhenxuanProductList(zhenxuanState.favorites, 120),
        ...normalizeZhenxuanProductList(zhenxuanState.gifts, 120),
        ...normalizeZhenxuanOrderList(zhenxuanState.orders, 120)
    ];
    return pools.find(item => item.key === productKey) || null;
}

function renderZhenxuanCheckoutProducts(products = []) {
    const wrap = document.getElementById('zhenxuan-checkout-products');
    if (!wrap) return;
    const list = normalizeZhenxuanProductList(products, 120);
    if (!list.length) {
        wrap.innerHTML = '';
        return;
    }
    const total = getZhenxuanCheckoutAmount(list);
    wrap.innerHTML = `
        <div class="zhenxuan-checkout-products-head"><span>本次结算</span><strong>${escapeZhenxuanHtml(formatZhenxuanMoney(total))}</strong></div>
        <div class="zhenxuan-checkout-products-list">
            ${list.map(item => `
                <article class="zhenxuan-checkout-product" data-tone="${escapeZhenxuanHtml(item.tone)}">
                    <div class="zhenxuan-checkout-product-thumb"><span>${escapeZhenxuanHtml(item.serial || '01')}</span></div>
                    <div class="zhenxuan-checkout-product-copy">
                        <span>${escapeZhenxuanHtml(item.merchantName || getZhenxuanMerchantName(item.key))}</span>
                        <strong>${escapeZhenxuanHtml(item.name)}</strong>
                        <em>${escapeZhenxuanHtml(item.categoryLabel || '甄选')} · 数量 x${escapeZhenxuanHtml(item.quantity || 1)}</em>
                    </div>
                    <b>${escapeZhenxuanHtml(item.price)}</b>
                </article>
            `).join('')}
        </div>
    `;
}


function getZhenxuanDetailAddressSummary() {
    const address = normalizeZhenxuanAddress(zhenxuanState.address);
    return formatZhenxuanAddress(address) || '下单时填写收货地址，可填写我或TA的地址';
}

function openZhenxuanProductDetail(productKey) {
    const product = getZhenxuanProductByKey(productKey) || findZhenxuanStoredProductByKey(productKey);
    const body = document.getElementById('zhenxuan-detail-page-body');
    if (!product || !body) {
        showZhenxuanToast('商品详情读取失败，请刷新当前页后重试。', 2200);
        return;
    }
    zhenxuanDetailProductKey = product.key;
    const favored = isZhenxuanFavorite(product.key);
    const inCart = isZhenxuanInCart(product.key);
    body.innerHTML = `
        <article class="zhenxuan-detail-card" data-tone="${escapeZhenxuanHtml(product.tone)}" data-zhenxuan-detail-product="${escapeZhenxuanHtml(product.key)}">
            <div class="zhenxuan-detail-visual">
                <span>${escapeZhenxuanHtml(product.tag)}</span>
                <b>${escapeZhenxuanHtml(product.serial || '01')}</b>
                <em>${escapeZhenxuanHtml(product.caption || product.meta)}</em>
            </div>
            <div class="zhenxuan-detail-copy">
                <span class="zhenxuan-detail-kicker">${escapeZhenxuanHtml(product.categoryLabel)} / ${escapeZhenxuanHtml(product.merchantName || getZhenxuanMerchantName(product.key))}</span>
                <h2>${escapeZhenxuanHtml(product.name)}</h2>
                <strong class="zhenxuan-detail-price">${escapeZhenxuanHtml(product.price)}</strong>
                <p>${escapeZhenxuanHtml(product.note || '这件商品已经进入商品详情页，可收藏、赠送、加入购物车或直接购买。')}</p>
                <div class="zhenxuan-detail-facts">
                    <div><span>MERCHANT</span><strong>${escapeZhenxuanHtml(product.merchantName || getZhenxuanMerchantName(product.key))}</strong></div>
                    <div><span>MATERIAL</span><strong>${escapeZhenxuanHtml(product.material)}</strong></div>
                    <div><span>SCENE</span><strong>${escapeZhenxuanHtml(product.scene)}</strong></div>
                    <div><span>STATUS</span><strong>${favored ? '已收藏' : '可收藏'} · ${inCart ? '已入车' : '可加购'}</strong></div>
                    <div class="is-wide"><span>ADDRESS</span><strong>${escapeZhenxuanHtml(getZhenxuanDetailAddressSummary())}</strong></div>
                </div>
            </div>
        </article>
        <div class="zhenxuan-detail-actions" data-zhenxuan-detail-actions="${escapeZhenxuanHtml(product.key)}">
            <button class="zhenxuan-detail-icon-action interactive" type="button" data-zhenxuan-detail-action="service" aria-label="联系客服">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 1 1 16 0v2"></path><path d="M4 14a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2v2z"></path><path d="M20 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2z"></path><path d="M12 18a2 2 0 0 1-2 2h2.5"></path></svg>
                <span>客服</span>
            </button>
            <button class="zhenxuan-detail-icon-action interactive${favored ? ' active' : ''}" type="button" data-zhenxuan-detail-action="favorite" aria-label="${favored ? '取消收藏' : '收藏商品'}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1z"></path></svg>
                <span>${favored ? '已收藏' : '收藏'}</span>
            </button>
            <button class="zhenxuan-detail-icon-action interactive" type="button" data-zhenxuan-detail-action="gift" aria-label="赠送商品">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="8" width="15" height="11.5" rx="1.8"></rect><path d="M12 8v11.5"></path><path d="M4.5 12h15"></path><path d="M7.8 8a2.3 2.3 0 1 1 0-4.6c1.7 0 2.7 1.7 4.2 4.6"></path><path d="M16.2 8a2.3 2.3 0 1 0 0-4.6c-1.7 0-2.7 1.7-4.2 4.6"></path></svg>
                <span>赠送</span>
            </button>
            <button class="zhenxuan-detail-main-action interactive${inCart ? ' active' : ''}" type="button" data-zhenxuan-detail-action="cart">${inCart ? '已加入购物车' : '加入购物车'}</button>
            <button class="zhenxuan-detail-main-action interactive is-primary" type="button" data-zhenxuan-detail-action="buy">立即购买</button>
        </div>
    `;
    setZhenxuanPage('detail');
}

function closeZhenxuanProductDetail() {
    zhenxuanDetailProductKey = '';
    setZhenxuanPage('home');
}

function giftZhenxuanProduct(product) {
    if (!product) return;
    openZhenxuanAddressSheet('gift', [product]);
}

function getZhenxuanActiveCharAddress() {
    try {
        if (typeof window.rinnoPrivateGetActiveGiftContactAddress === 'function') {
            return window.rinnoPrivateGetActiveGiftContactAddress() || null;
        }
    } catch (error) {
        console.warn('Zhenxuan char address bridge failed:', error);
    }
    return null;
}

function fillZhenxuanAddressForm(form, address, contactId = '') {
    if (!form) return;
    const normalized = normalizeZhenxuanAddress(address);
    form.receiver.value = normalized.receiver;
    form.phone.value = normalized.phone;
    form.region.value = normalized.region;
    form.detail.value = normalized.detail;
    if (form.recipientContactId) form.recipientContactId.value = contactId || '';
}

function setZhenxuanCheckoutRecipientType(type) {
    const form = document.getElementById('zhenxuan-address-form');
    if (!form) return;
    const recipientType = type === 'char' ? 'char' : 'user';
    const radio = form.querySelector(`input[name="recipientType"][value="${recipientType}"]`);
    if (radio) radio.checked = true;
    if (recipientType === 'char') {
        const charAddress = getZhenxuanActiveCharAddress();
        fillZhenxuanAddressForm(form, {
            receiver: charAddress?.receiver || charAddress?.name || '',
            phone: charAddress?.phone || '',
            region: charAddress?.region || '',
            detail: charAddress?.detail || ''
        }, charAddress?.contactId || '');
        setZhenxuanAddressMessage(charAddress ? '已带入当前私叙联系人的地址；也可以手动改成 TA 的其他地址。' : '没有读取到当前私叙联系人地址，请手动填写 TA 的手机号和地址。');
        return;
    }
    fillZhenxuanAddressForm(form, normalizeZhenxuanAddress(zhenxuanState.address), '');
    setZhenxuanAddressMessage('');
}

function openZhenxuanAddressSheet(mode, products) {
    const form = document.getElementById('zhenxuan-address-form');
    const title = document.getElementById('zhenxuan-address-title');
    const intro = document.getElementById('zhenxuan-address-copy');
    if (!form) return;
    const list = normalizeZhenxuanProductList(products, 120);
    if (!list.length) return;
    const recipientType = mode === 'gift' ? 'char' : 'user';
    zhenxuanCheckoutReturnPage = activeZhenxuanPage === 'cart' || mode === 'cart' ? 'cart' : (zhenxuanDetailProductKey ? 'detail' : 'home');
    zhenxuanState.pendingCheckout = { mode, products: list, recipientType };
    if (title) title.textContent = mode === 'gift' ? '赠送结算' : (mode === 'cart' ? '购物车结算' : '立即购买');
    if (intro) intro.textContent = mode === 'gift'
        ? `本次将把「${list[0].name}」寄给 TA，收货后 TA 会在私叙聊天里用礼物 JSON 消息回复。`
        : (mode === 'cart' ? `本次将购买购物车内 ${list.length} 件商品，付款前必须填写完整收货地址。` : `购买「${list[0].name}」前必须填写完整收货地址。`);
    renderZhenxuanCheckoutProducts(list);
    setZhenxuanCheckoutRecipientType(recipientType);
    setZhenxuanPage('checkout');
    window.setTimeout(() => form.receiver?.focus(), 80);
}

function closeZhenxuanAddressSheet() {
    zhenxuanState.pendingCheckout = null;
    zhenxuanCheckoutSubmitting = false;
    setZhenxuanAddressMessage('');
    renderZhenxuanCheckoutProducts([]);
    if (zhenxuanCheckoutReturnPage === 'detail' && zhenxuanDetailProductKey) setZhenxuanPage('detail');
    else setZhenxuanPage(zhenxuanCheckoutReturnPage || 'home');
}

function setZhenxuanAddressMessage(message, isError = false) {
    const node = document.getElementById('zhenxuan-address-message');
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('error', Boolean(isError));
}

function buyZhenxuanProduct(product) {
    if (!product) return;
    openZhenxuanAddressSheet('single', [product]);
}

function checkoutZhenxuanCart() {
    const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    if (!cart.length) {
        showZhenxuanToast('购物车是空的，先在详情页加入商品。');
        return;
    }
    openZhenxuanAddressSheet('cart', cart);
}

function parseZhenxuanPriceAmount(price) {
    const cleaned = String(price || '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return cleaned ? Math.max(0, Number(cleaned[0]) || 0) : 0;
}

function getZhenxuanCheckoutAmount(products = []) {
    return normalizeZhenxuanProductList(products, 120).reduce((sum, item) => {
        return sum + parseZhenxuanPriceAmount(item.price) * (Number(item.quantity) || 1);
    }, 0);
}

function formatZhenxuanMoney(amount) {
    const value = Math.max(0, Number(amount) || 0);
    return `¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function payZhenxuanCheckout(products, recipientType) {
    const amount = getZhenxuanCheckoutAmount(products);
    if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, reason: '商品金额无效，无法购买。' };
    }
    if (typeof window.rinnoAssetsRequireChatPayment !== 'function' || typeof window.rinnoAssetsSpend !== 'function') {
        return { ok: false, reason: '资管支付接口未就绪，暂不能购买。' };
    }
    const names = normalizeZhenxuanProductList(products, 120).map(item => item.name).join('、');
    const verify = await window.rinnoAssetsRequireChatPayment({
        verifyTitle: '甄选支付验证',
        verifyNote: `支付 ${formatZhenxuanMoney(amount)}：${names}`
    });
    if (!verify?.ok) return { ok: false, reason: verify?.reason || '支付验证未通过。' };
    const spend = await window.rinnoAssetsSpend(amount, {
        title: recipientType === 'char' ? '甄选礼物' : '甄选购物',
        note: names,
        icon: 'shopping',
        createdAt: Date.now()
    });
    if (!spend?.ok) return { ok: false, reason: spend?.reason || '资管扣款失败。' };
    return { ok: true, amount, cash: spend.cash };
}

async function saveZhenxuanAddressAndCreateOrders(event) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    if (zhenxuanCheckoutSubmitting) return;
    const form = event.currentTarget || document.getElementById('zhenxuan-address-form');
    if (!form) return;
    const address = normalizeZhenxuanAddress({
        receiver: form.receiver?.value || '',
        phone: form.phone?.value || '',
        region: form.region?.value || '',
        detail: form.detail?.value || ''
    });
    if (!address.receiver || !address.region || !address.detail) {
        setZhenxuanAddressMessage('请完整填写收货人、所在地区和详细地址后再购买。', true);
        return;
    }
    if (!isZhenxuanPhoneValid(address.phone)) {
        setZhenxuanAddressMessage('手机号格式不正确，请填写 7-16 位数字，可带 +86、空格或横线。', true);
        return;
    }
    const pending = zhenxuanState.pendingCheckout || {};
    const products = normalizeZhenxuanProductList(pending.products, 120);
    if (!products.length) {
        setZhenxuanAddressMessage('没有可购买的商品，请重新选择。', true);
        return;
    }
    zhenxuanCheckoutSubmitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    const recipientType = form.querySelector('input[name="recipientType"]:checked')?.value === 'char' ? 'char' : 'user';
    const recipientContactId = normalizeZhenxuanShortText(form.recipientContactId?.value || '', 64);
    setZhenxuanAddressMessage('正在调用资管支付，请完成支付密码验证。');
    try {
        const payResult = await payZhenxuanCheckout(products, recipientType);
        if (!payResult?.ok) {
            setZhenxuanAddressMessage(payResult?.reason || '支付失败，订单未创建。', true);
            return;
        }
        const orders = products.map(product => createZhenxuanOrder(product, address, {
            mode: pending.mode,
            recipientType,
            recipientContactId,
            recipientName: address.receiver
        }));
        if (recipientType === 'user') zhenxuanState.address = address;
        if (pending.mode === 'gift') zhenxuanState.gifts = [...products, ...normalizeZhenxuanProductList(zhenxuanState.gifts, 120)].slice(0, 120);
        zhenxuanState.orders = [...orders, ...normalizeZhenxuanOrderList(zhenxuanState.orders, 120)].slice(0, 120);
        if (pending.mode === 'cart') zhenxuanState.cart = [];
        zhenxuanState.pendingCheckout = null;
        writeZhenxuanState();
        renderZhenxuanCart();
        renderZhenxuanProducts();
        renderZhenxuanProfileOrders();
        renderZhenxuanOrderBadges();
        renderZhenxuanCheckoutProducts([]);
        setZhenxuanPage('profile');
        showZhenxuanToast(`已支付 ${formatZhenxuanMoney(payResult.amount)}，生成 ${orders.length} 个订单，48 小时内随机发货。`, 3200);
    } finally {
        zhenxuanCheckoutSubmitting = false;
        if (submitButton) submitButton.disabled = false;
    }
}

function renderZhenxuanCart() {
    const page = document.querySelector('.zhenxuan-cart-page');
    const list = document.getElementById('zhenxuan-cart-list');
    const summary = document.getElementById('zhenxuan-cart-summary');
    const empty = document.getElementById('zhenxuan-cart-empty');
    if (!list || !summary || !empty) return;
    const cart = normalizeZhenxuanProductList(zhenxuanState.cart, 120);
    zhenxuanState.cart = cart;
    const hasItems = cart.length > 0;
    if (page) {
        page.classList.toggle('has-items', hasItems);
        page.setAttribute('data-cart-empty', hasItems ? 'false' : 'true');
    }
    empty.hidden = hasItems;
    list.hidden = !hasItems;
    summary.hidden = !hasItems;
    empty.style.display = hasItems ? 'none' : '';
    list.style.display = hasItems ? '' : 'none';
    summary.style.display = hasItems ? '' : 'none';
    if (!hasItems) {
        list.innerHTML = '';
        summary.innerHTML = '';
        renderZhenxuanHeaderMeta();
        return;
    }
    list.innerHTML = cart.map(item => `
        <article class="zhenxuan-cart-item" data-tone="${escapeZhenxuanHtml(item.tone)}">
            <div class="zhenxuan-cart-thumb"><span>${escapeZhenxuanHtml(item.serial || '01')}</span></div>
            <div class="zhenxuan-cart-copy">
                <span>${escapeZhenxuanHtml(item.merchantName || getZhenxuanMerchantName(item.key))}</span>
                <strong>${escapeZhenxuanHtml(item.name)}</strong>
                <em>${escapeZhenxuanHtml(item.categoryLabel || '甄选')} · ${escapeZhenxuanHtml(item.meta)} · 数量 x${escapeZhenxuanHtml(item.quantity || 1)}</em>
            </div>
            <div class="zhenxuan-cart-side">
                <strong>${escapeZhenxuanHtml(item.price)}</strong>
                <button class="zhenxuan-cart-remove interactive" type="button" data-zhenxuan-cart-remove="${escapeZhenxuanHtml(item.key)}">移除</button>
            </div>
        </article>
    `).join('');
    const totalQty = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    summary.innerHTML = `
        <div><span>共 ${totalQty} 件</span><strong>合计 ${escapeZhenxuanHtml(formatZhenxuanMoney(getZhenxuanCheckoutAmount(cart)))}</strong></div>
        <button class="zhenxuan-cart-checkout interactive" type="button" data-zhenxuan-cart-checkout="true">去结算</button>
    `;
    renderZhenxuanHeaderMeta();
}

function renderZhenxuanOrderBadges() {
    refreshZhenxuanLogistics();
    const buckets = getZhenxuanOrderStatusBuckets(zhenxuanState.orders);
    document.querySelectorAll('[data-zhenxuan-order-badge]').forEach(badge => {
        const key = badge.getAttribute('data-zhenxuan-order-badge') || 'paid';
        const count = getZhenxuanOrderQuantityTotal(buckets[key] || []);
        badge.textContent = String(count);
        badge.hidden = count <= 0;
    });
}

function renderZhenxuanProfileOrders() {
    const wrap = document.getElementById('zhenxuan-order-feed');
    const counts = document.getElementById('zhenxuan-order-counts');
    if (!wrap) return;
    refreshZhenxuanLogistics();
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    renderZhenxuanOrderBadges();
    if (counts) {
        counts.innerHTML = '';
        counts.hidden = true;
        counts.setAttribute('aria-hidden', 'true');
    }
    if (!orders.length) {
        wrap.innerHTML = `
            <div class="zhenxuan-logistics-empty">
                <span>LOGISTICS</span>
                <strong>暂无购买订单</strong>
                <p>立即购买或购物车结算后，会先通过资管付款，再随机生成 48 小时内发货、虚拟物流、快递公司与取件码。</p>
            </div>
        `;
        return;
    }
    wrap.innerHTML = orders.slice(0, 6).map(order => {
        const latest = order.logistics?.[0];
        return `
            <article class="zhenxuan-order-card" data-status="${escapeZhenxuanHtml(order.status)}">
                <div class="zhenxuan-order-card-top">
                    <div>
                        <span>${escapeZhenxuanHtml(order.orderId)} · ${escapeZhenxuanHtml(order.merchantName || getZhenxuanMerchantName(order.key))}</span>
                        <strong>${escapeZhenxuanHtml(order.name)} × ${escapeZhenxuanHtml(order.quantity || 1)}</strong>
                    </div>
                    <em>${escapeZhenxuanHtml(getZhenxuanStatusLabel(order.status))}</em>
                </div>
                <div class="zhenxuan-order-card-meta">
                    <span>${escapeZhenxuanHtml(order.price)}</span>
                    <span>${escapeZhenxuanHtml(order.courier || '等待随机快递公司')}</span>
                    <span>${escapeZhenxuanHtml(order.pickupCode ? `取件码 ${order.pickupCode}` : '取件码待生成')}</span>
                </div>
                <p class="zhenxuan-order-address">${escapeZhenxuanHtml(order.recipientType === 'char' ? '寄给TA · ' : '寄给我 · ')}${escapeZhenxuanHtml(formatZhenxuanAddress(order.address) || '收货地址待补全')}</p>
                <div class="zhenxuan-logistics-line">
                    <b>${escapeZhenxuanHtml(formatZhenxuanTime(latest?.time || order.paidAt))}</b>
                    <span>${escapeZhenxuanHtml(latest?.text || '订单已创建，等待物流更新。')}</span>
                </div>
            </article>
        `;
    }).join('');
}

function getZhenxuanOrdersForFilter(filter) {
    const buckets = getZhenxuanOrderStatusBuckets(zhenxuanState.orders);
    if (filter === 'shipping') return buckets.shipping;
    if (filter === 'received') return buckets.received;
    if (filter === 'refund') return buckets.refund;
    return buckets.paid;
}

function getZhenxuanOrderFilterTitle(filter) {
    if (filter === 'shipping') return '未送达';
    if (filter === 'received') return '已收货';
    if (filter === 'refund') return '退款/售后';
    return '待发货';
}

function renderZhenxuanOrdersPage(filter = zhenxuanOrderStatusFilter) {
    refreshZhenxuanLogistics();
    zhenxuanOrderStatusFilter = ['paid', 'shipping', 'received', 'refund'].includes(filter) ? filter : 'paid';
    const title = document.getElementById('zhenxuan-orders-title');
    const copy = document.getElementById('zhenxuan-orders-copy');
    const list = document.getElementById('zhenxuan-orders-list');
    const orders = getZhenxuanOrdersForFilter(zhenxuanOrderStatusFilter);
    if (title) title.textContent = getZhenxuanOrderFilterTitle(zhenxuanOrderStatusFilter);
    if (copy) copy.textContent = `${getZhenxuanOrderFilterTitle(zhenxuanOrderStatusFilter)}条目 ${orders.length} 条。这里显示商家、数量、物流，并提供确认收货与退款入口。`;
    renderZhenxuanHeaderMeta();
    if (!list) return;
    if (!orders.length) {
        list.innerHTML = `
            <div class="zhenxuan-logistics-empty">
                <span>ZHENXUAN</span>
                <strong>暂无相关商品</strong>
                <p>购买后状态变化会自动同步到这里。</p>
            </div>
        `;
        return;
    }
    list.innerHTML = orders.map(order => {
        const latest = order.logistics?.[0];
        const canConfirm = ['shipping', 'delivered'].includes(order.status);
        const canRefund = !['received', 'refunding', 'refunded'].includes(order.status);
        return `
            <article class="zhenxuan-cart-item zhenxuan-order-line" data-tone="${escapeZhenxuanHtml(order.tone)}" data-zhenxuan-order-id="${escapeZhenxuanHtml(order.orderId)}">
                <div class="zhenxuan-cart-thumb"><span>${escapeZhenxuanHtml(order.serial || '01')}</span></div>
                <div class="zhenxuan-cart-copy">
                    <span>${escapeZhenxuanHtml(order.merchantName || getZhenxuanMerchantName(order.key))} · ${escapeZhenxuanHtml(getZhenxuanStatusLabel(order.status))}</span>
                    <strong>${escapeZhenxuanHtml(order.name)}</strong>
                    <em>${escapeZhenxuanHtml(order.categoryLabel || '甄选')} · 数量 x${escapeZhenxuanHtml(order.quantity || 1)} · ${escapeZhenxuanHtml(order.courier || '快递待生成')}</em>
                    <small>${escapeZhenxuanHtml(latest?.text || '等待物流更新。')}</small>
                    <small>${escapeZhenxuanHtml(formatZhenxuanAddress(order.address) || '收货地址待补全')}</small>
                </div>
                <div class="zhenxuan-cart-side zhenxuan-order-actions">
                    <strong>${escapeZhenxuanHtml(order.price)}</strong>
                    <span>${escapeZhenxuanHtml(order.pickupCode ? `取件码 ${order.pickupCode}` : formatZhenxuanTime(order.shipDueAt))}</span>
                    <button class="zhenxuan-order-action interactive" type="button" data-zhenxuan-order-confirm="${escapeZhenxuanHtml(order.orderId)}" ${canConfirm ? '' : 'disabled'}>确认收货</button>
                    <button class="zhenxuan-order-action interactive" type="button" data-zhenxuan-order-refund="${escapeZhenxuanHtml(order.orderId)}" ${canRefund ? '' : 'disabled'}>${order.status === 'refunded' ? '已退款' : '申请退款'}</button>
                </div>
            </article>
        `;
    }).join('');
}

function openZhenxuanOrderStatusPage(filter) {
    zhenxuanOrderStatusFilter = ['paid', 'shipping', 'received', 'refund'].includes(filter) ? filter : 'paid';
    renderZhenxuanOrdersPage(zhenxuanOrderStatusFilter);
    setZhenxuanPage('orders');
}

async function notifyZhenxuanGiftReceipt(order) {
    const item = normalizeZhenxuanOrder(order);
    if (!item || item.recipientType !== 'char' || item.giftReceiptSentAt) return false;
    if (typeof window.rinnoPrivateContactReceiveGift !== 'function') return false;
    try {
        const sent = await window.rinnoPrivateContactReceiveGift({
            type: 'gift_receipt',
            contactId: item.recipientContactId,
            orderId: item.orderId,
            productName: item.name,
            merchantName: item.merchantName || getZhenxuanMerchantName(item.key),
            quantity: item.quantity || 1,
            price: item.price,
            courier: item.courier,
            pickupCode: item.pickupCode,
            receivedAt: Date.now(),
            giftReceipt: {
                type: 'gift_receipt',
                orderId: item.orderId,
                productName: item.name,
                merchantName: item.merchantName || getZhenxuanMerchantName(item.key),
                quantity: item.quantity || 1,
                courier: item.courier,
                pickupCode: item.pickupCode,
                message: `我收到你送的「${item.name}」了，包装也很漂亮，谢谢你。`
            },
            message: `我收到你送的「${item.name}」了，包装也很漂亮，谢谢你。`
        });
        return Boolean(sent);
    } catch (error) {
        console.warn('Zhenxuan gift receipt notify failed:', error);
        return false;
    }
}

async function confirmZhenxuanOrderReceipt(orderId) {
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    const index = orders.findIndex(item => item.orderId === orderId);
    if (index < 0) return;
    const now = Date.now();
    const order = { ...orders[index], status: 'received', confirmedAt: now, updatedAt: now };
    order.logistics = [{ time: now, text: '用户已确认收货，订单完成。' }, ...order.logistics].slice(0, 16);
    const giftNoticeSent = await notifyZhenxuanGiftReceipt(order);
    if (giftNoticeSent) order.giftReceiptSentAt = now;
    orders[index] = order;
    zhenxuanState.orders = orders;
    writeZhenxuanState();
    renderZhenxuanProfileOrders();
    renderZhenxuanOrdersPage(zhenxuanOrderStatusFilter);
    renderZhenxuanOrderBadges();
    showZhenxuanToast(giftNoticeSent ? '已确认收货，TA 已在私叙里回复收到礼物。' : '已确认收货。', 2600);
}

function requestZhenxuanOrderRefund(orderId) {
    const orders = normalizeZhenxuanOrderList(zhenxuanState.orders, 120);
    const index = orders.findIndex(item => item.orderId === orderId);
    if (index < 0) return;
    const now = Date.now();
    const order = { ...orders[index], status: 'refunding', refundAt: now, updatedAt: now };
    order.logistics = [{ time: now, text: '已提交退款/售后申请，等待商家处理。' }, ...order.logistics].slice(0, 16);
    orders[index] = order;
    zhenxuanState.orders = orders;
    writeZhenxuanState();
    renderZhenxuanProfileOrders();
    renderZhenxuanOrdersPage(zhenxuanOrderStatusFilter);
    renderZhenxuanOrderBadges();
    showZhenxuanToast('已提交退款/售后申请。', 2400);
}

function bindZhenxuanExtendedEvents() {
    const app = getZhenxuanApp();
    if (!app || app.dataset.zhenxuanExtendedBound === 'v0111') return;
    app.dataset.zhenxuanExtendedBound = 'v0111';
    app.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const profileEdit = target?.closest('[data-zhenxuan-profile-edit]');
        if (profileEdit) {
            event.preventDefault();
            openZhenxuanProfileEdit(profileEdit.getAttribute('data-zhenxuan-profile-edit') || 'nickname');
            return;
        }
        const serviceOpen = target?.closest('[data-zhenxuan-service-chat-open]');
        if (serviceOpen) {
            event.preventDefault();
            const key = serviceOpen.getAttribute('data-zhenxuan-service-chat-open') || '';
            zhenxuanState.activeServiceChatKey = key;
            writeZhenxuanState();
            renderZhenxuanMessages();
            return;
        }
        const serviceList = target?.closest('[data-zhenxuan-service-chat-list]');
        if (serviceList) {
            event.preventDefault();
            zhenxuanState.activeServiceChatKey = '';
            writeZhenxuanState();
            renderZhenxuanMessages();
            return;
        }
        const serviceClose = target?.closest('[data-zhenxuan-chat-close]');
        if (serviceClose) {
            event.preventDefault();
            zhenxuanState.activeServiceChatKey = '';
            writeZhenxuanState();
            setZhenxuanPage('home');
            return;
        }
        const backHome = target?.closest('[data-zhenxuan-back-home]');
        if (backHome) {
            event.preventDefault();
            zhenxuanDetailProductKey = '';
            setZhenxuanPage('home');
            return;
        }
        const ordersBack = target?.closest('[data-zhenxuan-orders-back]');
        if (ordersBack) {
            event.preventDefault();
            setZhenxuanPage('profile');
            return;
        }
        const entrance = target?.closest('[data-zhenxuan-order-entrance]');
        if (entrance) {
            event.preventDefault();
            openZhenxuanOrderStatusPage(entrance.getAttribute('data-zhenxuan-order-entrance') || 'paid');
            return;
        }
        const confirmButton = target?.closest('[data-zhenxuan-order-confirm]');
        if (confirmButton && !confirmButton.disabled) {
            event.preventDefault();
            void confirmZhenxuanOrderReceipt(confirmButton.getAttribute('data-zhenxuan-order-confirm') || '');
            return;
        }
        const refundButton = target?.closest('[data-zhenxuan-order-refund]');
        if (refundButton && !refundButton.disabled) {
            event.preventDefault();
            requestZhenxuanOrderRefund(refundButton.getAttribute('data-zhenxuan-order-refund') || '');
            return;
        }
        const service = target?.closest('[data-zhenxuan-detail-action="service"]');
        if (service) {
            event.preventDefault();
            const key = service.closest('[data-zhenxuan-detail-actions]')?.getAttribute('data-zhenxuan-detail-actions') || zhenxuanDetailProductKey || '';
            openZhenxuanServiceChat(key);
            return;
        }
    });
    if (app.dataset.zhenxuanServiceSubmitBound !== 'v0111') {
        app.dataset.zhenxuanServiceSubmitBound = 'v0111';
        app.addEventListener('submit', event => {
            const form = event.target instanceof Element ? event.target.closest('[data-zhenxuan-service-form]') : null;
            if (!form) return;
            event.preventDefault();
            submitZhenxuanServiceForm(form);
        });
    }
    const form = document.getElementById('zhenxuan-address-form');
    if (form && form.dataset.zhenxuanSubmitBoundV0109 !== 'true') {
        form.dataset.zhenxuanSubmitBoundV0109 = 'true';
        form.addEventListener('submit', saveZhenxuanAddressAndCreateOrders);
        form.addEventListener('change', event => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement) || target.name !== 'recipientType') return;
            setZhenxuanCheckoutRecipientType(target.value);
        });
    }
}

bindZhenxuanExtendedEvents();
renderZhenxuanOrderBadges();
