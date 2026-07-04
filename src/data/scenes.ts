import type { AbilityImpact, Scene } from "../types";

const assets = {
  startCover: new URL("../../pic/start-cover.png", import.meta.url).href,
  sufu: new URL("../../pic/sufu.png", import.meta.url).href,
  summaryHero: new URL("../../pic/summary-hero.png", import.meta.url).href,
  officeMap: new URL("../../pic/officemap.png", import.meta.url).href,
  maleToken: new URL("../../pic/nanbirdwalk.png", import.meta.url).href,
  femaleToken: new URL("../../pic/nvbirdwalk.png", import.meta.url).href,
  malePortrait: new URL("../../pic/main-boy.png", import.meta.url).href,
  femalePortrait: new URL("../../pic/main-girl.png", import.meta.url).href,
  birdMentor: new URL("../../pic/bird-mentor.jpg", import.meta.url).href,
  boss: new URL("../../pic/boss.png", import.meta.url).href,
  hr: new URL("../../pic/qiantaigirl.png", import.meta.url).href,
  coworker: new URL("../../pic/tongshi.png", import.meta.url).href,
  desk: new URL("../../pic/gongwei.png", import.meta.url).href,
  canteen: new URL("../../pic/canting.png", import.meta.url).href,
  meeting: new URL("../../pic/huiyishi.png", import.meta.url).href,
  lobby: new URL("../../pic/qiantai.png", import.meta.url).href,
};

const impact = (
  communication = 0,
  collaboration = 0,
  judgment = 0,
  resilience = 0,
  learning = 0,
): AbilityImpact => ({
  communication,
  collaboration,
  judgment,
  resilience,
  learning,
});

export const startCover = assets.startCover;
export const sufuBackground = assets.sufu;
export const summaryHero = assets.summaryHero;
export const officeMap = assets.officeMap;
export const maleToken = assets.maleToken;
export const femaleToken = assets.femaleToken;
export const malePortrait = assets.malePortrait;
export const femalePortrait = assets.femalePortrait;
export const birdMentor = assets.birdMentor;

export const scenes: Scene[] = [
  {
    id: "desk",
    day: 1,
    time: "周一 09:00",
    title: "陌生的工位",
    location: "新人工位",
    background: assets.desk,
    mapX: 20,
    npcs: [
      { id: "hr", name: "HR", image: assets.hr, kind: "hr", x: 69, y: 8, scale: 1 },
      { id: "coworker", name: "邻座同事", image: assets.coworker, kind: "coworker", x: 76, y: 8, scale: 0.94 },
    ],
    description:
      "HR 把你带到工位，交代几句就匆匆离开。电脑还没配好，周围同事都低头忙着自己的事，没人主动看向你。你忽然意识到，这里没有管家，也没有丫鬟，所有事情都要自己开口。",
    mentorBefore:
      "第一天最难的，不是做出成绩，而是建立自己的行动感。别急着表现，也别把自己藏起来，先弄清楚信息从哪里来，人和事怎么运转。",
    transition: "午饭时间到了，领导在群里说：今天一起吃饭，欢迎新人。",
    variants: [
      { id: "friendly", label: "邻座同事很友好", note: "他愿意多解释几句，但也在赶上午的需求。" },
      { id: "cold", label: "邻座同事很高冷", note: "他只短短点头，像一扇还没打开的门。" },
      { id: "busy", label: "邻座同事忙到飞起", note: "他电脑上开着十几个窗口，耳机都没摘。" },
    ],
    choices: [
      {
        id: "intro",
        text: "主动和旁边同事打招呼，简单自我介绍",
        result:
          "你选了一个对方停顿的间隙，低声做了自我介绍。对方没有立刻热络，但告诉你 Wi-Fi、茶水间和新人群在哪里。你没有收获朋友，却收获了第一条真实路径。",
        mentor:
          "主动不是用热情撞开所有门，而是在合适的时机给别人一个低成本回应你的机会。刚入职时，先建立弱连接，比急着证明自己更稳。",
        impact: impact(2, 1, 1, 0, 1),
      },
      {
        id: "wait",
        text: "安静坐着等 IT 来配电脑，不打扰别人",
        result:
          "你坐得很端正，像在等先生点名。半小时后 IT 还没来，你也不知道该问谁。直到 HR 路过，你才发现新人群里早就发了设备登记表。",
        mentor:
          "不打扰别人是一种礼貌，但完全不发问会让你失去信息。职场里很多资源不会自动走到你面前，温和地确认下一步，是对自己负责。",
        impact: impact(0, 0, 0, 1, 1),
      },
      {
        id: "wiki",
        text: "先看公司 Wiki 和新人手册，整理问题",
        result:
          "你用手机看完新人手册，把不懂的流程记在备忘录里。IT 来之前，你已经知道要领哪些权限，也知道下午要参加哪个群的同步。",
        mentor:
          "好问题来自预习。先自己扫一遍公开信息，再带着具体问题去请教，别人会更愿意帮你，也更容易相信你是能自驱的人。",
        impact: impact(1, 0, 2, 0, 2),
      },
      {
        id: "hr",
        text: "去找 HR 问接下来该做什么",
        result:
          "HR 有点意外，但很快给你补了一张入职流程表，还顺手把你拉进新人群。你得到答案，也让 HR 记住了你是个会主动确认的人。",
        mentor:
          "向上确认不是麻烦别人，而是减少返工。表达主动性时，最好带着一个清楚的问题，而不是把所有不确定都丢给对方。",
        impact: impact(2, 0, 1, 1, 1),
      },
    ],
  },
  {
    id: "lunch",
    day: 1,
    time: "周一 12:00",
    title: "领导的饭局",
    location: "公司餐厅",
    background: assets.canteen,
    mapX: 8,
    npcs: [{ id: "boss", name: "领导", image: assets.boss, kind: "boss", x: 69, y: 8, scale: 1.08 }],
    description:
      "领导说请小组吃饭，欢迎新同事。菜刚上齐，他忽然看向你：'介绍一下自己吧，随便说，别紧张。'所有人的筷子都慢了半拍。",
    mentorBefore:
      "饭桌上的自我介绍，不是背简历。它更像一部短片的开场：让别人记住你是谁，能和你聊什么，以及你愿意如何加入这个团队。",
    transition: "第二天上午，部门周会开始。你还没正式接任务，却已经被叫到名字。",
    variants: [
      { id: "warm", label: "领导热情豪爽", note: "他会接话，也会放大你的情绪。" },
      { id: "quiet", label: "领导高冷寡言", note: "他说得少，观察得多。" },
      { id: "test", label: "领导考校试探", note: "他像是在听一个人的结构感和分寸。" },
    ],
    choices: [
      {
        id: "prepared",
        text: "按准备好的版本，简洁大方地介绍自己",
        result:
          "你用一分钟讲清楚了背景、兴趣和希望承担的方向。桌上有人接着问了你一个细节，气氛自然松了下来。",
        mentor:
          "临场发挥的底气，常常来自提前准备。一个好介绍不必华丽，只要让对方知道你能被怎样理解，下一句对话就有了落点。",
        impact: impact(2, 1, 2, 1, 1),
      },
      {
        id: "humble",
        text: "谦虚地说自己没经验，请大家多关照",
        result:
          "你的语气很诚恳，大家也礼貌点头。但话题很快转走，没人知道你擅长什么，也不知道未来可以怎么与你协作。",
        mentor:
          "谦逊是美德，但把自己说成一张白纸，会让别人无从判断你。新人可以承认不足，同时也要给出一个可期待的方向。",
        impact: impact(1, 1, 0, 1, 0),
      },
      {
        id: "story",
        text: "讲一个有趣小故事，让气氛轻松起来",
        result:
          "你讲了一个从古代视角误解打卡机的小笑话，大家都笑了。领导也笑了，但补了一句：'挺有意思，下午看看适应流程快不快。'",
        mentor:
          "幽默能破冰，也会提高别人对你的记忆度。只是记住，职场里的轻松最好服务于可信度，笑完之后，还要让人看见你的稳。",
        impact: impact(3, 1, 1, 1, 0),
      },
      {
        id: "return",
        text: "简单说完名字学校，把话题抛回给领导",
        result:
          "你很快把话题交还给领导，场面没有冷掉，但你也像一阵风一样从大家记忆里掠过去。饭局结束时，仍有人没记住你的名字。",
        mentor:
          "把话题交回去是安全动作，但安全不等于有效。关键场合给自己留一点存在感，是在为后续协作降低陌生成本。",
        impact: impact(0, 1, 1, 1, 0),
      },
    ],
  },
  {
    id: "meeting",
    day: 2,
    time: "周二 10:00",
    title: "第一次部门周会",
    location: "会议室",
    background: assets.meeting,
    mapX: 76,
    npcs: [
      { id: "boss", name: "领导", image: assets.boss, kind: "boss", x: 67, y: 8, scale: 1.02 },
      { id: "coworker", name: "同事", image: assets.coworker, kind: "coworker", x: 76, y: 8, scale: 0.92 },
    ],
    description:
      "部门周会轮流汇报。轮到你时，投影还亮着，领导看向你。你还没正式产出任何东西，但沉默本身也会被看见。",
    mentorBefore:
      "会议里的发言不是争抢舞台，而是同步信息。新人最好的存在感，是让别人知道你正在学习什么、卡在哪里、下一步会做什么。",
    transition: "周三下午，一个不太熟的同事在微信上发来一句：有个小事想请你帮忙。",
    variants: [
      { id: "normal", label: "会议节奏平稳", note: "大家按部就班，没人特别为难你。" },
      { id: "pressed", label: "领导时间很紧", note: "他希望每个人都说重点。" },
      { id: "curious", label: "同事们好奇新人", note: "有几双眼睛明显在等你的第一句话。" },
    ],
    choices: [
      {
        id: "honest",
        text: "诚实说主要在熟悉环境，正在学习关键文档",
        result:
          "你没有硬编成果，而是说明自己看了哪些文档、整理了哪些问题。领导点点头，让你会后找同事补一下项目背景。",
        mentor:
          "诚实不是把空白摊出来，而是把进展说清楚。汇报里最有价值的不是'我很努力'，而是'我已到哪里，接下来要去哪里'。",
        impact: impact(2, 1, 2, 1, 2),
      },
      {
        id: "question",
        text: "说已了解项目，并提出一个小问题",
        result:
          "你的问题切得不错，会议停下来讨论了两分钟。有人补充了历史原因，你也借此快速理解了项目里一条暗线。",
        mentor:
          "好的问题是杠杆。它能让你用很短的发言，换来更多上下文。但提问前要确认自己做过功课，否则问题会变成噪音。",
        impact: impact(2, 1, 3, 1, 2),
      },
      {
        id: "vague",
        text: "简单带过：我在跟上大家的节奏",
        result:
          "这句话没有错，也没有信息量。会议继续向前，你松了一口气，但领导后来又私下问你：具体在跟什么？",
        mentor:
          "模糊表达能帮你躲过一秒钟，却会把不确定留到后面。越是新人，越要练习把抽象状态翻译成具体动作。",
        impact: impact(0, 0, 0, 1, 0),
      },
      {
        id: "excited",
        text: "表达加入团队的期待和兴奋",
        result:
          "你的态度很真诚，会议室气氛轻了一点。但汇报结束后，你发现大家更需要知道你下一步能承担什么。",
        mentor:
          "热情是燃料，不是方向盘。表达态度之后，最好补上一句具体行动，让别人知道这份热情会落到哪里。",
        impact: impact(1, 1, 0, 2, 1),
      },
    ],
  },
  {
    id: "request",
    day: 3,
    time: "周三 15:00",
    title: "同事的小请求",
    location: "工位区",
    background: assets.desk,
    mapX: 28,
    npcs: [{ id: "coworker", name: "同事", image: assets.coworker, kind: "coworker", x: 70, y: 8, scale: 1 }],
    description:
      "一个不太熟的同事私聊你，说有个数据报表'很快的，半小时就弄完'。你手头正有领导交代的任务，明天截止。",
    mentorBefore:
      "边界不是冷漠。真正可靠的人，不是答应所有事的人，而是能说清楚优先级、承诺和限制的人。",
    transition: "周四上午，工作群里突然有人 @ 你。你昨天发的表，似乎出了问题。",
    variants: [
      { id: "need", label: "同事真心需要帮助", note: "他确实被一个临时需求卡住了。" },
      { id: "dump", label: "同事习惯甩活", note: "他说得轻松，但细节越问越多。" },
      { id: "probe", label: "同事在试探边界", note: "他想知道新人是不是好说话。" },
    ],
    choices: [
      {
        id: "refuse",
        text: "直接拒绝，说明自己有紧急任务",
        result:
          "你说明了截止时间和当前任务，对方沉默了几秒，回了一个'好吧'。关系没有升温，但你的主任务保住了节奏。",
        mentor:
          "拒绝可以很清楚，也可以很有礼貌。关键是别把拒绝包装成含糊的借口。清楚说明原因，反而减少对方反复试探。",
        impact: impact(1, 0, 3, 2, 0),
      },
      {
        id: "accept",
        text: "答应下来，先帮同事做，自己的事晚上加班",
        result:
          "你帮他做完了报表，却发现并不只要半小时。晚上十点，你还在补自己的任务，心里第一次有点委屈。",
        mentor:
          "善意如果没有边界，很容易变成别人管理你时间的入口。先问清范围和成本，再决定是否承诺，这比事后疲惫地埋怨更成熟。",
        impact: impact(1, 2, -1, 1, 0),
      },
      {
        id: "delay",
        text: "先说我看看手头工作，如果来得及就帮",
        result:
          "你暂时没有把话说死，但对方开始每隔二十分钟问一次。你既没真正拒绝，也没真正答应，注意力被不断切走。",
        mentor:
          "模糊承诺会制造持续占用。遇到请求时，最好给出明确时间点和判断标准：我几点前确认，能帮到哪一步。",
        impact: impact(1, 1, 1, 1, 0),
      },
      {
        id: "bounded",
        text: "建议他先找别人，或等你完成手头任务后再帮",
        result:
          "你给出两个替代方案，并说明自己六点后可以帮他看十分钟口径。对方找到了另一个熟悉数据的人，你也没有完全把门关上。",
        mentor:
          "成熟协作不是二选一的好人或坏人。你可以守住自己的优先级，同时提供可承受的帮助。边界和善意并不冲突。",
        impact: impact(2, 2, 3, 2, 1),
      },
    ],
  },
  {
    id: "group",
    day: 4,
    time: "周四 11:00",
    title: "群里的 @",
    location: "工位区",
    background: assets.desk,
    mapX: 33,
    npcs: [{ id: "coworker", name: "指出问题的同事", image: assets.coworker, kind: "coworker", x: 70, y: 8, scale: 1 }],
    description:
      "部门大群里，一个同事 @ 你：'这个数据好像有问题，是你昨天发的那个表里的吧？'你检查后发现，确实是自己弄错了。",
    mentorBefore:
      "犯错并不可怕，真正拉开差距的是修复方式。公开问题要公开止血，私下沟通要补足细节。",
    transition: "周五下午四点半，领导发来一封邮件：这周结束前，交一份入职第一周学习总结。",
    variants: [
      { id: "formal", label: "同事公事公办", note: "他只是想把问题尽快解决。" },
      { id: "amplify", label: "同事有意放大", note: "他的措辞比问题本身更刺耳。" },
      { id: "kind", label: "同事纯粹好心", note: "他提醒得急，是怕数据继续扩散。" },
    ],
    choices: [
      {
        id: "own",
        text: "在群里承认错误，说明原因，并马上修正",
        result:
          "你很快回复：口径处理错了，我十分钟内发修正版。群里安静下来，领导只回了一个'修完同步'。",
        mentor:
          "承担责任最有力量的句式是：问题是什么、影响到哪里、何时修复。少解释动机，多给恢复路径，信任就不会继续漏水。",
        impact: impact(3, 1, 2, 3, 2),
      },
      {
        id: "check",
        text: "先回复我看一下，确认后再在群里修正",
        result:
          "你先稳住现场，再快速核对。五分钟后，你发出修正版和说明，虽然慢了一拍，但没有让错误扩大。",
        mentor:
          "压力下先暂停几秒，是为了避免第二个错误。公开场合可以先确认，再给结论，但别让'我看一下'变成消失。",
        impact: impact(2, 1, 2, 2, 1),
      },
      {
        id: "private",
        text: "私下找同事确认，再请他在群里说明",
        result:
          "你私聊对方，对方回复很慢。大群里问题悬着，其他人开始猜测数据还能不能用。你发现把公开问题完全转入私下，会让现场失控。",
        mentor:
          "私下沟通适合补细节，不适合替代公开止血。谁能看见风险，谁就需要看见你的处理进度。",
        impact: impact(1, 1, 0, 1, 1),
      },
      {
        id: "defend",
        text: "在群里解释是口径不同，不完全是自己错",
        result:
          "你解释了半天，大家却更关注修正版什么时候出来。领导最后发话：先改数据，责任会后再说。你的防御让场面更紧。",
        mentor:
          "人在被指出错误时，很容易先保护自尊。可职场信任看的不是你有没有完美，而是问题出现后，你是不是先解决影响。",
        impact: impact(0, 0, -1, 0, 1),
      },
    ],
  },
  {
    id: "email",
    day: 5,
    time: "周五 16:30",
    title: "领导的周五邮件",
    location: "工位区",
    background: assets.desk,
    mapX: 42,
    npcs: [{ id: "boss", name: "领导", image: assets.boss, kind: "boss", x: 70, y: 8, scale: 1 }],
    description:
      "领导发来邮件：'这周结束前，把入职第一周学习总结发我。'现在已经下午四点半，你之前完全没收到这个通知。",
    mentorBefore:
      "突发任务会暴露一个人的工作系统。别只问来不来得及，先判断目标是什么、最低可交付是什么、是否需要同步预期。",
    transition: "晚上八点，你走出公司大楼。深圳的夜色亮得像另一条河。",
    variants: [
      { id: "sudden", label: "领导临时起意", note: "他看到日历才想起这件事。" },
      { id: "test", label: "领导有意考验", note: "他想看新人怎么处理模糊压力。" },
      { id: "forgot", label: "领导忘了提前说", note: "这不是阴谋，只是常见的管理疏漏。" },
    ],
    choices: [
      {
        id: "brief",
        text: "快速整理简短总结：本周事项、收获、下周计划",
        result:
          "你在六点前发出一页清晰总结。它不华丽，但结构完整。领导晚上回了两个字：收到。第二天早上，他又补了一句：下周按这个计划来。",
        mentor:
          "时间紧时，完整不等于冗长。先交付一个结构清楚的版本，让对方看见你的思考框架，再慢慢迭代质量。",
        impact: impact(2, 0, 3, 3, 2),
      },
      {
        id: "monday",
        text: "回复收到，但时间太紧，请求周一上午提交",
        result:
          "你说明原因并给出周一上午十点的提交时间。领导没有拒绝，但提醒你以后遇到类似总结，可以平时就积累。",
        mentor:
          "延长期限不是失败，前提是你同步得足够早、给出明确新承诺。管理预期，本质上是在保护双方的确定性。",
        impact: impact(2, 0, 2, 2, 1),
      },
      {
        id: "sync",
        text: "先写一版，再约下周一一对一详细汇报",
        result:
          "你先发了简版，并在邮件末尾提出下周一想对齐学习重点。领导接受了。你不仅完成任务，还顺手打开了一个沟通窗口。",
        mentor:
          "高手常把任务变成对齐机会。先满足当下需求，再争取更高质量的反馈，这就是把压力转成成长入口。",
        impact: impact(3, 1, 3, 3, 3),
      },
      {
        id: "overtime",
        text: "写一份详细总结，加班到晚上完成",
        result:
          "你写到晚上九点，内容很详尽，却有些散。领导第二天只看了前半页。你很努力，但努力没有完全转化为有效信息。",
        mentor:
          "投入时间不等于创造价值。重要的是先问：对方此刻需要什么决策信息？把精力放在关键结构上，而不是把所有细节堆上去。",
        impact: impact(1, 0, 1, 2, 2),
      },
    ],
  },
  {
    id: "night",
    day: 5,
    time: "周五 20:00",
    title: "第一周的独白",
    location: "公司门口",
    background: assets.lobby,
    mapX: 50,
    npcs: [{ id: "coworker", name: "晚归同事", image: assets.coworker, kind: "coworker", x: 70, y: 8, scale: 0.94 }],
    description:
      "第一周结束了。你走出公司大楼，手机亮起，是家里人的消息：'第一周怎么样？还适应吗？'你忽然想起苏府的月亮，也想起这几天每一次手心出汗。",
    mentorBefore:
      "一个人真正开始成长，不是从不慌开始，而是从能诚实看见自己的慌开始。工作是一部分，支持系统也是一部分。",
    transition: "第一周结束。你没有变成另一个人，但你开始知道，遇到事情时可以怎么做。",
    variants: [
      { id: "parents", label: "父母发来消息", note: "他们问得小心，怕你报喜不报忧。" },
      { id: "partner", label: "伴侣发来消息", note: "对方更关心你的真实感受。" },
      { id: "friend", label: "老朋友发来消息", note: "一句玩笑背后，是熟悉的支持。" },
    ],
    choices: [
      {
        id: "honest",
        text: "诚实分享好的和不好的感受",
        result:
          "你说了第一次会议的紧张，也说了修正错误后的释然。对方没有急着给建议，只回你：听起来你真的开始上路了。",
        mentor:
          "真实表达不是把情绪倒给别人，而是让重要的人知道你正在经历什么。能被支持的人，往往也更有力量继续承担。",
        impact: impact(2, 1, 2, 3, 2),
      },
      {
        id: "goodonly",
        text: "只说好的，不让家人担心",
        result:
          "你发了几个轻松表情，说一切都好。对方放心了，你却在回出租屋的路上有点空。那些没说出口的疲惫，还在你身上。",
        mentor:
          "体贴别人是温柔，但长期只报喜不报忧，会让你失去真实连接。成熟不是永远撑住，而是知道向谁说几句真话。",
        impact: impact(1, 1, 0, 1, 0),
      },
      {
        id: "short",
        text: "简单回复挺好的，不想多聊",
        result:
          "你把手机塞回口袋，夜风吹过来。你确实需要安静，但也感觉自己像把一整周锁进了抽屉。",
        mentor:
          "沉默有时是恢复，有时是逃避。给自己空间没问题，只是别忘了之后再回来整理这段经历，否则经验会散掉。",
        impact: impact(0, 0, 1, 1, 1),
      },
      {
        id: "care",
        text: "反过来关心家人，聊他们这周过得怎样",
        result:
          "你问起他们的近况，聊天慢慢展开。你没有讲太多工作细节，却在熟悉的对话里找回了一点稳定感。",
        mentor:
          "支持不是单向索取。人在压力里还能看见别人，会重新确认自己不只是一个职场角色。生活的根，能托住工作的枝叶。",
        impact: impact(2, 2, 1, 2, 1),
      },
    ],
  },
];

export const abilityLabels: Record<keyof AbilityImpact, string> = {
  communication: "沟通力",
  collaboration: "协作力",
  judgment: "判断力",
  resilience: "抗压力",
  learning: "学习力",
};
