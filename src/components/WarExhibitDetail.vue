<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const exhibitData = ref(null);
const modelError = ref(false);
const modelLoading = ref(true);

// AI问答相关数据
const userMessage = ref("");
const chatMessages = ref([]);
const isTyping = ref(false);
const chatContainer = ref(null);
const messageInput = ref(null);
const typingSpeed = 30; // 打字速度(ms)
const apiIsReady = ref(true); // API状态
const DEEPSEEK_API_KEY = "sk-ef4d119673dc4c1b91e67a129e719a69";
const baseUrl = "https://api.deepseek.com";
const model = "deepseek-chat"; // DeepSeek聊天模型

// 定义props接收展品数据
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

// 在组件挂载后获取展品数据
onMounted(() => {
  // 尝试从路由状态获取数据
  if (route.params.id && route.state && route.state.exhibit) {
    exhibitData.value = route.state.exhibit;
    // 添加初始欢迎消息
    addBotMessage(
      `您好！我是${exhibitData.value.title}。很高兴能与您交流，请问您想了解关于我的什么信息呢？`
    );
  } else {
    // 如果没有状态数据，根据ID获取预设数据
    const warExhibits = [
      // 武器装备
      {
    id: 'rifle',
    title: '抗战时期步枪',
    thumbnail: '/images/步枪.jpg',
    dynasty: '抗战时期',
    category: '步兵武器',
    size: '长 110 厘米',
    material: '金属、木质',
    description: '这是一支抗战时期使用的步枪，见证了中华民族抗击侵略者的英勇历史。步枪结构精良，枪身坚固，是当时军队的重要装备。它不仅是一件军事装备，更是民族抗争精神的象征，承载着无数英雄儿女保家卫国的壮志豪情。',
    modelSrc: '/models/步枪.glb',
    historicalContext: '在抗日战争期间，这类步枪是中国军队的主要装备之一，在各大战役中发挥了重要作用。',
    historicalRecord: '抗战时期，中国军队使用的步枪主要来源于各国援助和自产，包括德制毛瑟步枪、苏制莫辛-纳甘步枪等。这些步枪虽然型号繁杂，但都承载着中国军民抗击日本侵略者的英勇意志。每一支步枪都见证了正面战场和敌后游击战的无数战斗，成为中华民族不屈抗战精神的重要象征。',
        technicalSpecs: {
      caliber: '7.92mm',
      weight: '约4.2公斤',
      length: '110厘米',
      capacity: '5发弹夹'
    }
  },
  {
    id: 'pistol',
    title: '八路军第四纵队司令宋时轮佩戴的驳壳枪',
    thumbnail: '/images/武器/手枪.jpg',
    dynasty: '抗战时期',
    category: '手枪',
    size: '长 28 厘米',
    material: '金属',
    description: '这是八路军第四纵队司令宋时轮佩戴过的驳壳枪，见证了抗战时期八路军将领的英勇抗战历程。驳壳枪作为当时军官的重要武器，不仅具有实战价值，更是指挥官身份和威信的象征。宋时轮将军用这支手枪指挥部队，在敌后战场建立不朽功勋。',
    modelSrc: '/models/武器/手枪.glb',
    historicalContext: '驳壳枪在抗战时期深受中国军官喜爱，射程远、威力大，被誉为"盒子炮"，是近战和指挥作战的重要武器。',
    historicalRecord: '宋时轮（1907-1991），湖南醴陵人，开国上将。抗战时期历任八路军第120师358旅716团团长、第4纵队司令员等职。这支驳壳枪伴随宋时轮将军转战华北敌后战场，参与了雁门关伏击战、百团大战等重要战役。驳壳枪因其独特的盒形弹夹和较长射程，成为抗战时期中国军队军官的标配武器，象征着中华民族抗击侵略的钢铁意志。',
    technicalSpecs: {
      caliber: '7.63mm',
      weight: '约1.24公斤',
      length: '28厘米',
      capacity: '10发弹夹'
    }
  },
  {
    id: 'machine-gun-yellow',
    title: '山东人民抗日救国军使用的"老黄牛"重机枪',
    thumbnail: '/images/武器/黄筒机关枪.jpg',
    dynasty: '抗战时期',
    category: '重机枪',
    size: '长 142 厘米，口径 7.92 厘米',
    material: '钢、铜',
    description: '这是山东人民抗日救国军第三军第一路军使用过的"老黄牛"重机枪，见证了山东人民抗日武装的英勇斗争。这门重机枪因威力巨大、枪身呈黄色而被战士们亲切地称为"老黄牛"。在抗击日伪军的战斗中，它用密集的火力为部队提供强有力的支援。',
    modelSrc: '/models/武器/黄筒机关枪.glb',
    historicalContext: '1938年初，山东人民抗日救国军第三军第一路军在搜查原直系军阀吴佩孚的老家大楼时，从地下室发现了这挺机枪。',
    historicalRecord: '1938年初，山东人民抗日救国军第三军第一路军在搜查原直系军阀吴佩孚的老家大楼时，从地下室一口棺材里发现了这挺二四式马克沁重机枪。同年10月，该部队携带此机枪在山东平度大青阳一带阻击日伪军进攻，用它击退敌人三次疯狂进攻，毙伤200余人。因为该机枪威力大，枪身又呈黄色，干是战士们给它起名"老黄牛"。这挺机枪随部队转战各地，参加战斗百余次，"老黄牛"的声名也在胶东广为流传。1958年，由济南军区移交军事博物馆。',
        technicalSpecs: {
      caliber: '7.92mm',
      weight: '约20公斤',
      length: '142厘米',
      fireRate: '600发/分钟'
    }
  },
  {
    id: 'grenade',
    title: '抗战时期手榴弹',
    thumbnail: '/images/武器/手榴弹.jpg',
    dynasty: '抗战时期',
    category: '爆炸武器',
    size: '长 10 厘米',
    material: '金属、炸药',
    description: '这是抗战时期广泛使用的手榴弹，结构简单但威力巨大。在近距离作战和阵地攻防中发挥重要作用。许多英雄战士在关键时刻用手榴弹与敌人同归于尽，展现了视死如归的英雄气概。手榴弹成为抗战军民最可靠的近战武器。',
    modelSrc: '/models/武器/手榴弹.glb',
    historicalContext: '手榴弹在抗战中被广泛使用，特别是在近距离作战和巷战中效果显著，是步兵班组的重要装备。',
    historicalRecord: '抗战时期，中国军队和民兵组织广泛使用手榴弹进行作战。由于其制造相对简单，许多根据地都能自制手榴弹。在著名的台儿庄战役、百团大战等重大战役中，手榴弹都发挥了重要作用。特别是在巷战和近距离作战中，手榴弹的威力得到充分发挥，成为抗战军民克敌制胜的重要武器。许多英雄战士在生命最后时刻，抱着手榴弹与敌人同归于尽，谱写了可歌可泣的英雄篇章。',
    technicalSpecs: {
      weight: '约0.6公斤',
      length: '10厘米',
      explosiveWeight: '50克',
      fuseTime: '4-5秒'
    }
  },
  {
    id: 'm3a3-tank',
    title: '华东野战军在鲁南战役中缴获的美M3A3式轻型坦克',
    thumbnail: '/images/武器/m3a3坦克.jpg',
    dynasty: '1947年',
    category: '装甲车辆',
    size: '长 502 厘米，宽 251 厘米，重 14.4 吨',
    material: '质地钢',
    description: '这是华东野战军在1947年1月鲁南战役中缴获的美制M3A3式轻型坦克。在鲁南战役中，我山东、华中野战军一举歼灭美械装备的国民党整编第二十六师和第一快速纵队，缴获了这辆轻型坦克。此坦克随后编入华东野战军坦克部队，先后参加了济南战役和淮海战役。',
    modelSrc: '/models/武器/m3a3坦克.glb',
    historicalContext: '这辆坦克后来参加了济南战役和淮海战役，在济南战役攻坚门战斗中，沈许驾驶这辆坦克出色地完成了战斗任务。',
    historicalRecord: '1947年1月鲁南战役，我山东、华中野战军一举歼灭美械装备的国民党整编第二十六师和第一快速纵队，缴获了这辆轻型坦克。该坦克随后编入华东野战军坦克部队，先后参加了济南战役和淮海战役。在济南战役攻坚门战斗中，沈许驾驶这辆坦克出色地完成了战斗任务。战后，这辆坦克被授予"功臣坦克"称号，沈许被誉为"铁人英雄"。1959年，由坦克一校移交军事博物馆。',
        technicalSpecs: {
      weight: '14.4吨',
      length: '502厘米',
      width: '251厘米',
      armor: '25mm装甲'
    }
  },
  {
    id: 'i-15-aircraft',
    title: '苏制伊-15战斗机',
    thumbnail: '/images/武器/苏制伊-15飞机.jpg',
    dynasty: '抗战时期',
    category: '战斗机',
    size: '翼展 9.7 米，机长 6.1 米',
    material: '金属、帆布',
    description: '这是抗战时期中国空军使用的苏制伊-15战斗机，见证了中国空军英勇抗击日本侵略者的光辉历史。伊-15战斗机机动性优良，在空战中表现出色，为保卫祖国领空作出了重要贡献。许多中国飞行员驾驶这种战机与敌机搏斗，谱写了可歌可泣的空战英雄篇章。',
    modelSrc: '/models/武器/苏制伊-15飞机.glb',
    historicalContext: '伊-15战斗机是苏联援华的重要武器，在抗战初期的空战中发挥了重要作用，为中国空军提供了宝贵的作战经验。',
    historicalRecord: '伊-15由苏联著名飞机设计师波利卡尔波夫设计，1933年10月完成首飞，1934年投产。其机身紧凑分紧构型与混合构建结构，翼展有布蒙皮，机翼则采用日本M-25发动机，1936年升级为700马力的M25发动机，极速367公里/小时，航程只有510公里，火力也只有两挺7.62mm机枪，后期又换装1100马力的M63发动机，升级为伊-153。尽管相比同时期其他苏联飞机，伊-15的机动性比较优越，但在当时世界上来说，其并无太大出众之处，不过伊-15bis和伊-153依然为中国空军的初期力量奉献了二一八大空战。1938年2月18日九点十五分，日本出动海军陆基航空兵的15架九六式陆基攻击机从京沪方向飞向武汉大校机场，在第十二、十三空队的12架九六式零战掩护下，向驻汉口空军大校机场发起攻击。当时中国空军的伊-15和伊-16共10架从16架战机迎敌，由于伊-15机群的有力性能，日军可以逃脱优势条件从遥远退敌，最终击落日机4架，中方损失惨重5架，取胜击落6比2战。',
    technicalSpecs: {
      wingspan: '9.7米',
      length: '6.1米',
      maxSpeed: '367公里/小时',
      armament: '2挺7.62mm机枪'
    }
  },
  {
    id: 'sword-chinese-scout',
    title: '中国童子军短刀',
    thumbnail: '/images/武器/中国童子军短刀.jpg',
    dynasty: '抗战时期',
    category: '近战武器',
    size: '全长 30 厘米，刀身长 20 厘米',
    material: '钢制刀身，木质刀柄',
    description: '这是抗战时期中国童子军使用的短刀，见证了青年学生积极参与抗日救亡运动的历史。中国童子军组织在抗战期间发挥了重要作用，广大童子军成员以实际行动支持抗战，体现了青年一代的爱国热情和民族精神。',
    modelSrc: '/models/武器/中国童子军短刀.glb',
    historicalContext: '中国童子军在抗战期间积极参与救亡运动，开展各种形式的抗日宣传和后勤支援活动。',
    historicalRecord: '中国童子军运动兴起于20世纪初，抗战爆发后，全国各地的童子军组织积极投身抗日救亡运动。他们不仅进行军事训练，还参与伤兵救护、难民救济、抗日宣传等各种活动。这把短刀是童子军的标准装备之一，既有实用价值，也象征着青年一代保卫祖国的决心。无数童子军成员在抗战中成长为抗日战士，为民族独立和人民解放事业贡献了青春和热血。',
        technicalSpecs: {
      totalLength: '30厘米',
      bladeLength: '20厘米',
      material: '碳钢',
      weight: '约0.3公斤'
    }
  },
  {
    id: 'japanese-missile',
    title: '日军侵华导弹',
    thumbnail: '/images/武器/日军侵华导弹.jpg',
    dynasty: '二战时期',
    category: '导弹武器',
    size: '长度未详',
    material: '金属',
    description: '这是二战时期日军研制的早期导弹武器，虽然技术尚不成熟，但体现了日军企图通过新型武器延续侵略战争的野心。幸运的是，这类武器并未对战争结果产生实质影响，日本法西斯最终走向失败。',
    modelSrc: '/models/武器/日军侵华导弹.glb',
    historicalContext: '二战后期，轴心国各国都在研发新型武器，试图扭转战争颓势，但为时已晚。',
    historicalRecord: '二战后期，面对盟军的强大攻势，日军也在研发各种新型武器，包括早期的火箭和导弹技术。虽然日军在这方面的研发远不如德国先进，但也进行了一些尝试。然而，由于技术水平限制和战争资源匮乏，这些武器并未形成实战能力。随着1945年日本投降，这些武器研发项目也宣告终结，成为日本军国主义失败的历史见证。',
    technicalSpecs: {
      type: '早期火箭弹',
      status: '实验阶段',
      range: '有限',
      effectiveness: '未投入实战'
    }
  },
  {
    id: 'japanese-sword',
    title: '侵华日军海南警备府长官伍贺启次即海军中将投降时交出的海军军刀',
    thumbnail: '/images/武器/日军太刀.jpg',
    dynasty: '1945年8月',
    category: '冷兵器',
    size: '全长 94 厘米、刀身长 75.8 厘米、刀刃长 60.3 厘米',
    material: '钢制',
    description: '这柄日本海军军刀是侵华日军海南警备府长官伍贺启次即海军中将在1945年日军投降时，呈交给国民党中将韩练成的。韩练成在1945年前后任海南岛防卫司令官，后于1948年脱离国民党部队，投奔解放区。1958年，由韩练成处征集。',
    modelSrc: '/models/武器/日军太刀.glb',
    historicalContext: '这柄军刀见证了日本侵略者的最终失败和中华民族抗战的伟大胜利，具有重要的历史意义。',
    historicalRecord: '这柄日本海军军刀是侵华日军海南警备府长官伍贺启次即海军中将在1945年日军投降时，呈交给国民党中将韩练成的。韩练成在1945年前后任海南岛防卫司令官，后于1948年脱离国民党部队，投奔解放区。这柄军刀见证了日本法西斯的彻底失败，象征着中华民族14年抗战的最终胜利。军刀的移交不仅是武器的缴获，更是侵略者向正义力量低头的历史见证。1958年，由韩练成处征集到军事博物馆保存。',
    technicalSpecs: {
      totalLength: '94厘米',
      bladeLength: '75.8厘米',
      edgeLength: '60.3厘米',
      material: '钢制刀身'
    }
  },
  {
    id: 'hunting-rifle-hongkong',
    title: '香港第一支群众武装南鹿联防队使用过的猎枪',
    thumbnail: '/images/武器/香港第一支群众武装南鹿联防队使用过的猎枪.jpg',
    dynasty: '抗战时期',
    category: '步枪',
    size: '长度未详',
    material: '金属、木质',
    description: '这是香港第一支群众武装南鹿联防队使用过的猎枪，见证了香港同胞积极参与抗日斗争的历史。在日军占领香港期间，南鹿联防队等群众武装组织英勇抗击侵略者，为香港的抗日斗争作出了重要贡献。',
    modelSrc: '/models/武器/香港第一支群众武装南鹿联防队使用过的猎枪.glb',
    historicalContext: '香港沦陷后，当地群众自发组织武装力量，开展抗日游击战争，显示了香港同胞的爱国精神。',
    historicalRecord: '1941年底，广东民众利用自卫团，1942年在港九地区设立了东江纵队港九独立大队。在日军占领香港期间，包括南鹿联防队在内的群众武装组织积极开展抗日斗争，这支猎枪就是当时使用的武器之一。联防队的队员冒着生命危险，在广九铁路沿线开展游击战，营救被困人员，运送抗日物资，为抗战胜利作出了重要贡献。这支猎枪见证了香港同胞的抗日精神，体现了中华民族团结抗战的强大力量。1998年香港回归一周年之际，由韩练成将军家属捐赠给军事博物馆。',
    technicalSpecs: {
      type: '民用猎枪改装',
      caliber: '待考证',
      range: '中短程',
      usage: '游击战武器'
    }
  },
  {
    id: 'water-bottle-songhu',
    title: '淞沪会战时期我国士兵用的水壶',
    thumbnail: '/images/武器/淞沪会战时期我国士兵用的水壶.jpg',
    dynasty: '1937年',
    category: '军用装备',
    size: '高 20 厘米',
    material: '铝制',
    description: '这是1937年淞沪会战时期中国士兵使用的水壶，见证了中国军队在淞沪战场上的英勇抗战。淞沪会战是抗战初期的重大战役，中国军队虽然装备落后，但士气高昂，用血肉之躯抵抗日军的疯狂进攻，展现了中华民族不屈不挠的抗战精神。',
    modelSrc: '/models/武器/淞沪会战时期我国士兵用的水壶.glb',
    historicalContext: '淞沪会战是抗战全面爆发后的第一场大规模会战，中国军队表现出顽强的战斗意志。',
    historicalRecord: '1937年8月13日，淞沪会战爆发，这是抗日战争中第一场大规模战役。中国军队投入约75万兵力，与日军展开激烈战斗。这个水壶就是当时中国士兵的标准装备，在炎热的夏秋季节为前线将士提供生命之源。淞沪会战历时3个月，中国军队虽然最终撤退，但沉重打击了日军的嚣张气焰，粉碎了日军"三个月灭亡中国"的狂妄计划，为全面抗战的展开奠定了基础。这个水壶见证了中国军人在极其艰苦条件下的英勇作战精神。',
    technicalSpecs: {
      capacity: '约1升',
      material: '铝制',
      weight: '约0.2公斤',
      type: '军用标准装备'
    }
      },
      // 纪念物品
      {
        id: "victory-medal",
        title: "1945年南京国民政府颁授予萧毅肃的抗战胜利勋章",
        dynasty: "1945年",
        size: "直径 4 厘米",
        material: "金属",
        category: "勋章奖章",
        description:
          "这是1945年南京国民政府颁授给萧毅肃的抗战胜利勋章，象征着对抗战英雄的最高敬意。勋章设计精美，工艺精湛，正面刻有国徽和胜利字样，背面刻有获奖者姓名。这枚勋章见证了中华民族八年抗战的艰辛历程和最终胜利，是民族精神的重要象征。",
        modelSrc:
          "/models/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利勋章.glb",
        historicalContext:
          "抗战胜利勋章是国民政府为表彰抗战有功人员而设立的最高荣誉，象征着民族抗争的胜利。",
        historicalRecord:
          '萧毅肃（1899－1975），四川蓬州人，陆军二级上将。抗日战争爆发后率部参加"八一三"淞沪会战，进至浏河、蕴藻浜至大场一线布防。1945年8月21日，在湖南芷江主持了抗战胜利受降仪式。抗战胜利后，为表彰在抗战中建立功勋的有关人士，国民政府决定对抗战有功的文武官员和社会贤达人士颁给"胜利勋章"。此枚编号为55的勋章系1945年10月8日国民政府国防最高委员会通过《颁给胜利勋章案》，同年10月10日公布《颁给胜利勋章条例》后第一批授予时任陆军总参谋长萧毅肃中将的。同时被授予的还有：朱德、彭德怀、叶剑英等。',
      },
      {
        id: "victory-certificate",
        title: "1945年南京国民政府颁授予萧毅肃的抗战胜利证书",
        dynasty: "1945年",
        size: "长 30 厘米，宽 20 厘米",
        material: "纸质",
        category: "证书文件",
        description:
          "这是与抗战胜利勋章配套的官方证书，详细记录了萧毅肃在抗战中的贡献和获奖原因。证书采用传统书法撰写，格式庄重，用印规范，体现了当时政府对抗战英雄的重视。证书不仅是个人荣誉的见证，更是整个民族抗战历史的重要文献。",
        modelSrc:
          "/models/纪念物品/1945年南京国民政府颁授予萧毅肃的抗战胜利证书.glb",
        historicalContext:
          "抗战胜利证书是对抗战功臣的正式确认，具有重要的历史文献价值。",
        historicalRecord:
          '抗战胜利后，国民政府为表彰在抗战中建立功勋的有关人士，决定对抗战有功的文武官员和社会贤达人士颁给"胜利勋章"。此枚编号为55的勋章系1945年10月8日国民政府国防最高委员会通过《颁给胜利勋章案》，同年10月10日公布《颁给胜利勋章条例》后第一批授予时任陆军总参谋长萧毅肃中将的。同时被授予的还有：朱德、彭德怀、叶剑英等。',
      },
      {
        id: "youth-ring",
        title: "三民主义青年团直属国立西南联合大学分团从军纪念戒指",
        dynasty: "抗战时期",
        size: "内径 1.8 厘米",
        material: "金属",
        category: "纪念饰品",
        description:
          "这是西南联大学生从军的纪念戒指，小小的戒指承载着青年学子投笔从戎的壮志豪情。戒指上刻有三民主义青年团的标识，象征着青年一代对国家和民族的忠诚。在那个烽火连天的年代，无数青年学子放下书本，拿起武器，为国家独立和民族解放而战。",
        modelSrc:
          "/models/纪念物品/三民主义青年团直属国立西南联合大学分团从军纪念戒指.glb",
        historicalContext:
          "西南联大是抗战时期的教育奇迹，许多学生积极参军，体现了知识分子的爱国情怀。",
        historicalRecord:
          '叶铭汉，1944年9月考入西南联合大学土木系，第一学期结束后的寒假时提交了入伍申请，1945年初在学校加入了驻印军，之后便飞赴印度受训、服役。1945年8月日本投降后退伍，再次入学。这枚"三三年度从军纪念"银戒指是1945年初叶铭汉入伍时学校训导处发给他的。',
      },
      {
        id: "literary-badge",
        title: "中华全国文艺界抗敌协会会徽",
        dynasty: "抗战时期",
        size: "直径 3 厘米",
        material: "金属",
        category: "会徽标识",
        description:
          "中华全国文艺界抗敌协会会徽，代表着文艺工作者在抗战中的重要作用。这个组织团结了全国的文艺工作者，通过文学、戏剧、音乐等形式宣传抗战，鼓舞民族士气。会徽设计简洁而富有象征意义，体现了文艺界人士的抗敌决心和民族精神。",
        modelSrc: "/models/纪念物品/中华全国文艺界抗敌协会会徽.glb",
        historicalContext:
          "文艺界抗敌协会在抗战期间发挥了重要的精神动员作用，用文艺作品鼓舞全民抗战。",
        historicalRecord:
          '中华全国文艺界抗敌协会于1938年4月1日在汉口正式成立。周恩来在成立大会上发表了重要讲话。该会制定的《中华全国文艺界抗敌协会简章》明确规定了协会的宗旨，即"联合全国文艺作家共同反对日本帝国主义的侵略，完成中国民族自由解放，建设中国民族革命的文艺，并保障作家权益。"协会提出"文章下乡，文章入伍"的口号，鼓励作家深入生活，投身现实斗争。协会实行理事制度，理事会下设总务部、组织部、研究部和出版部。经过推举，由周恩来、孙科、陈立夫、于右任、叶楚伦等任名誉理事，由郭沫若、老舍、茅盾、丁玲、田汉、巴金、胡风、冯玉祥、邵力子、陈铭枢、郁达夫、老向、成仿吾、王平陵、张天翼、马彦祥、胡秋原等45人任理事，由周扬、吴溪如、罗锋、孔罗荪、舒群等15人任候补理事。在成都、昆明、延安、上海、广州、桂林、贵阳、香港等地先后建立了该会的分会组织。协会成立后，组织和派遣抗战文化工作团和作家战地慰问团，分赴西北战场和中原战场，开展战地访问和慰问工作，并于1938年5月创办了会刊《抗战文艺》，刊登抗战进步文章，推动抗日运动。中华全国文艺界抗敌协会的成立，标志着全国文艺界抗日民族统一战线的正式形成。在抗日救亡的旗帜下，协会根据文艺界的特点，利用文艺的形式，在开展群众性的抗日文化活动，推动中国文艺事业的发展方面，在反对国民党顽固派投降、分裂、倒退，坚持抗战、团结、进步的斗争中，在团结抗战力量，争取抗日民族解放战争的胜利中，都发挥了积极的作用。抗日战争胜利后，1945年10月14日，中华全国文艺界抗敌协会改称"中华全国文艺界协会"，以上海出版的《中国作家》作为机关刊物，利用文艺阵地继续开展活动。',
      },
      {
        id: "eight-hundred-medal",
        title: "八百壮士忠贞奖章",
        dynasty: "1937年",
        size: "直径 4.5 厘米",
        material: "金属",
        category: "勋章奖章",
        description:
          "八百壮士忠贞奖章，纪念淞沪会战中四行仓库保卫战的英雄们。谢晋元团长率领的八百壮士在四行仓库坚守四天四夜，面对日军的猛烈攻击毫不退缩，展现了中华民族不屈不挠的战斗精神。这枚奖章不仅是对英雄们的褒奖，更是民族精神的象征。",
        modelSrc: "/models/纪念物品/八百壮士忠贞奖章.glb",
        historicalContext:
          "四行仓库保卫战是淞沪会战的重要组成部分，八百壮士的英勇事迹激励了全国人民的抗战斗志。",
        historicalRecord:
          '该纪念章呈鸣心形，铜制镀金。正面是国民党党旗，党旗下面是绿色橄榄枝，以红地为衬，橄榄枝左右各两枝，对称向外开放，象征和平。反面刻有"忠贞奖章"四字。1944年，八百壮士部分幸存者逃出日伪控制，陆续到达重庆，国民政府特意颁发了"忠贞奖章"表彰这些爱国勇士。',
      },
      {
        id: "iron-man-seal",
        title: "台儿庄战役期间,第73旅旅长戴安澜专门镌刻了铁汉印章",
        dynasty: "1938年",
        size: "长 3 厘米，宽 3 厘米",
        material: "石质",
        category: "个人印章",
        description:
          '戴安澜将军的"铁汉"印章，刻于台儿庄战役期间。戴安澜将军是抗战名将，以勇猛善战著称，被誉为"铁汉将军"。这方印章体现了将军的铁血性格和坚定意志，也反映了那个时代军人的精神风貌。印章虽小，却承载着一位民族英雄的豪情壮志。',
        modelSrc:
          "/models/纪念物品/台儿庄战役期间,第73旅旅长戴安澜专门镌刻了铁汉印章.glb",
        historicalContext:
          "台儿庄战役是抗战初期的重大胜利，戴安澜将军在此役中表现英勇，后来在缅甸战场壮烈牺牲。",
        historicalRecord:
          '卢沟桥事变后，日本开始全面侵华，中国人民奋起反击，在1938年的台儿庄战役中取得了抗日战争以来最大胜利，打击了日本侵略者的嚣张气焰，坚定了全国军民坚持抗战的信心。台儿庄战役期间，时任第73旅旅长戴安澜专门镌刻了"铁汉"印章，意指用钢铁般的意志和战斗力来抵抗日军的侵略。在艰苦卓绝的抗日战争中，戴安澜将军用实际行动践行和发扬了"铁汉精神"。',
      },
      {
        id: "ye-ting-passport",
        title: "叶希夷（叶挺）前往越南护照",
        dynasty: "1940年代",
        size: "长 15 厘米，宽 10 厘米",
        material: "纸质",
        category: "证书文件",
        description:
          "叶挺将军前往越南的护照，记录了抗战时期国际交往的珍贵历史资料。它见证了当时中国与国际友人协作支援的历史瞬间，具有重要的史料价值。",
        modelSrc: "/models/纪念物品/叶挺越南护照.glb",
        historicalContext:
          "叶挺将军是著名的抗日民族英雄，其海外行动体现了抗战时期国际反法西斯合作。",
        historicalRecord:
          "全国首个华侨护照：1937年抗日战争爆发后，北伐名将叶挺结束流亡生活回国，出任新四军军长，奔赴抗日前线。当时刚成立的新四军武器装备粗劣、弹药缺乏，还遭到国民党当局克扣军费。叶挺为解决这些困难，曾到香港、越南等地向海外华侨和爱国人士筹募抗日军事物资。",
      },
      {
        id: "overseas-chinese-award",
        title: "国民政府侨务委员会发给华侨机工彭海涌的奖状",
        dynasty: "1940年代",
        size: "长 30 厘米，宽 20 厘米",
        material: "纸质",
        category: "证书文件",
        description:
          "表彰华侨机工为抗战贡献的奖状，体现了海外华人的爱国情怀和民族精神。无数华侨机工舍身赴国难，参与滇缅公路运输，为抗战胜利作出重要贡献。",
        modelSrc:
          "/models/纪念物品/国民政府侨务委员会发给华侨机工彭海涌的奖状.glb",
        historicalContext:
          "滇缅公路运输对抗战物资补给至关重要，华侨机工群体发挥了不可替代的作用。",
        historicalRecord:
          "侨务委员会是国民政府管理华侨事务的最高机关。1928年4月25日，国民党中央政治会议决定成立，并通过组织法。侨务委员会掌理调查和统计侨民情况、指导侨民移殖、处理侨民纠纷、管理侨民团体、指导介绍归国华侨投资与办理实业及就学、游历、参观及宣传政府的政策、补助侨民教育经费等事项。下设秘书处和第一、第二科。1928年9月4日在南京正式成立，直隶于国民政府，同年10月改隶于行政院。11月25日，制定了《奖励华侨回国兴办实业条例》8条。1929年1月6日，林森任委员长，随后由陈耀垣继任。1929年4月，改隶于国民党中央执行委员会。1931年8月20日，国民党中央常会决定将原属中央党部的侨务委员会改隶于国民政府，以吴铁城为委员长，中央党部另组海外党务设计委员会。侨务委员会下设侨务管理处、侨民教育处、秘书处。1932年1月2日改隶行政院。1949年12月31日下令撤销。",
      },
      {
        id: "nanyuan-memorial",
        title: "第29军军事训练团北平南苑抗日纪念章",
        dynasty: "1937年",
        size: "直径 4 厘米",
        material: "金属",
        category: "勋章奖章",
        description:
          "第29军在北平南苑抗日的纪念章，见证了七七事变前后的抗战历史。它代表着将士们的浴血奋战与不屈意志，具有重要的历史纪念意义。",
        modelSrc: "/models/纪念物品/第29军军事训练团北平南苑抗日纪念章.glb",
        historicalContext:
          "卢沟桥事变后华北抗战爆发，南苑地区的抗日斗争具有重要的历史节点意义。",
        historicalRecord:
          "1937年7月28日黎明，日军以第20师团为主力，在20架飞机的配合下猛攻北平近郊南苑。驻南苑的国民党第29军第132师一部、骑兵第9师一部和第29军军训团等部，在日军优势炮火和飞机的狂轰滥炸下，凭借围墙、营房顽强抵抗。激战至下午1时，中国守军因伤亡惨重，被迫退出阵地，南苑失守，29军副军长佟麟阁、132师师长赵登禹壮烈殉国。",
      },
      // 生活用品
      {
        id: "camera-duan",
        title: "平北军分区政委段苏权用过的照相机",
        dynasty: "抗战时期",
        size: "长 15 厘米，宽 10 厘米",
        material: "金属、玻璃",
        category: "摄影器材",
        description:
          "这是平北军分区政委段苏权在抗战时期使用过的照相机，见证了敌后抗日根据地的艰苦斗争。在物资极度匮乏的敌后战场，这台照相机成为了记录抗战历史、宣传抗日精神的重要工具。每一张照片都承载着军民团结抗战的珍贵记忆。",
        modelSrc: "/models/生活用品/平北军分区政委段苏权用过的照相机.glb",
        historicalContext:
          "敌后抗日根据地的摄影器材极其珍贵，主要用于记录抗战历史、宣传抗日精神。",
        historicalRecord:
          "段苏权（1916-1993），湖南茶陵人，1930年参加革命，1932年加入中国共产党。抗战时期任平北军分区政委，在极其艰苦的敌后环境中坚持抗日斗争。这台照相机见证了平北地区军民团结抗战的历史，记录了无数感人的抗战故事。在物资极度匮乏的敌后战场，摄影器材成为了宣传抗日、记录历史的重要工具。",
      },
      {
        id: "suitcase-ji",
        title: "吉鸿昌夫人胡红霞在抗日时期为吉鸿昌送武器时用的皮箱",
        dynasty: "抗战时期",
        size: "长 50 厘米，宽 35 厘米，高 20 厘米",
        material: "皮革",
        category: "个人用品",
        description:
          "这是吉鸿昌将军夫人胡红霞在抗日时期为丈夫运送武器时使用的皮箱，承载着夫妻同仇敌忾、共赴国难的感人故事。在白色恐怖时期，胡红霞冒着生命危险，用这个皮箱秘密运送武器弹药，支持吉鸿昌的抗日活动。",
        modelSrc:
          "/models/生活用品/吉鸿昌夫人胡红霞在抗日时期为吉鸿昌送武器时用的皮箱.glb",
        historicalContext:
          "抗战时期，许多爱国人士的家属也积极参与抗日活动，为抗战胜利作出了重要贡献。",
        historicalRecord:
          "吉鸿昌（1895-1934），河南扶沟人，著名抗日爱国将领。1931年九一八事变后，积极投身抗日救亡运动。其夫人胡红霞在丈夫抗日期间，冒着极大风险，用这个皮箱秘密运送武器弹药，支持抗日活动。1934年吉鸿昌被国民党反动派杀害，胡红霞继续坚持抗日立场，这个皮箱成为了夫妻同仇敌忾、共赴国难的历史见证。",
      },
      {
        id: "telescope-zuo",
        title: "左权在太行山用过的望远镜",
        dynasty: "抗战时期",
        size: "长 25 厘米，宽 15 厘米",
        material: "金属、玻璃",
        category: "军用器材",
        description:
          "这是左权将军在太行山抗日根据地使用过的望远镜，见证了八路军在敌后战场的艰苦斗争。在太行山的崇山峻岭中，左权将军用这台望远镜观察敌情、指挥作战，为抗日战争的胜利作出了重要贡献。",
        modelSrc: "/models/生活用品/左权在太行山用过的望远镜.glb",
        historicalContext:
          "望远镜是抗战时期重要的军事观察工具，在敌后游击战中发挥重要作用。",
        historicalRecord:
          "左权（1905-1942），湖南醴陵人，中国工农红军和八路军高级将领。抗战爆发后，任八路军副参谋长兼前方总部参谋长，协助朱德、彭德怀指挥八路军在华北敌后开展游击战争。1942年5月25日，在山西省辽县（今左权县）十字岭战斗中壮烈牺牲，年仅37岁。这台望远镜见证了左权将军在太行山指挥抗战的日日夜夜，是民族英雄精神的重要象征。",
      },
      {
        id: "microscope-mirror",
        title: "澳门镜湖医院用显微镜",
        dynasty: "抗战时期",
        size: "高 30 厘米，底座直径 20 厘米",
        material: "金属、玻璃",
        category: "医疗设备",
        description:
          "这是澳门镜湖医院在抗战时期使用的显微镜，见证了澳门同胞对抗战的支持。在抗战期间，澳门作为中立地区，成为了重要的医疗物资中转站，这台显微镜为救治伤病员、培养医疗人才发挥了重要作用。",
        modelSrc: "/models/生活用品/澳门镜湖医院用显微镜.glb",
        historicalContext:
          "抗战时期，澳门作为中立地区，在医疗救助和物资转运方面发挥了重要作用。",
        historicalRecord:
          "澳门镜湖医院成立于1871年，是澳门历史最悠久的医院之一。抗战期间，澳门作为葡萄牙殖民地保持中立，成为了重要的医疗物资中转站和伤病员救治基地。这台显微镜见证了澳门同胞对抗战的支持，许多内地伤病员在此得到救治，体现了中华民族同舟共济的民族精神。镜湖医院在抗战中为培养医疗人才、救治伤病员作出了重要贡献。",
      },
      {
        id: "resistance-meter",
        title: "晋察冀军区工业部使用过的电阻表",
        dynasty: "抗战时期",
        size: "长 20 厘米，宽 15 厘米",
        material: "金属、塑料",
        category: "工业设备",
        description:
          "这是晋察冀军区工业部在抗战时期使用过的电阻表，见证了敌后抗日根据地的工业发展。在极其艰苦的条件下，晋察冀军区建立了自己的军工生产体系，这台电阻表为生产武器弹药、维修通信设备提供了重要技术支持。",
        modelSrc: "/models/生活用品/晋察冀军区工业部使用过的电阻表.glb",
        historicalContext:
          "敌后抗日根据地建立了自己的军工生产体系，为抗战提供了重要的物质基础。",
        historicalRecord:
          "晋察冀边区是抗战时期重要的敌后抗日根据地，在聂荣臻等领导下，建立了较为完整的军工生产体系。工业部负责武器弹药的生产和维修，这台电阻表用于测量电阻值，为生产武器弹药、维修通信设备提供了重要技术支持。在物资极度匮乏的敌后环境中，根据地军民自力更生、艰苦奋斗，建立了自己的工业基础，为抗战胜利作出了重要贡献。",
      },
      {
        id: "compass-he",
        title: "抗战时期中国远征军何元清使用的怀表式指北针",
        dynasty: "抗战时期",
        size: "直径 5 厘米",
        material: "金属、玻璃",
        category: "军用器材",
        description:
          "这是中国远征军何元清在缅甸战场使用过的怀表式指北针，见证了远征军在异国他乡的英勇抗战。在缅甸的丛林中，这台指北针为远征军指引方向、确定位置，是战士们生存和作战的重要工具。",
        modelSrc:
          "/models/生活用品/抗战时期中国远征军何元清使用的怀表式指北针.glb",
        historicalContext:
          "中国远征军在缅甸战场为支援盟军、保卫滇缅公路作出了重要贡献。",
        historicalRecord:
          "中国远征军是抗战时期中国派往缅甸支援盟军作战的部队。1942年3月，远征军入缅作战，在极其艰苦的条件下与日军展开激战。何元清作为远征军战士，在缅甸丛林中用这台指北针指引方向、确定位置，为部队的行军作战提供了重要帮助。远征军在缅甸的作战虽然最终失利，但为支援盟军、保卫滇缅公路作出了重要贡献，体现了中国军人的英勇无畏精神。",
      },
      {
        id: "water-bottle-chen",
        title: "南侨机工陈昭藻在滇缅路服务时用的水壶",
        dynasty: "抗战时期",
        size: "高 25 厘米",
        material: "铝制",
        category: "个人用品",
        description:
          "这是南侨机工陈昭藻在滇缅公路运输抗战物资时使用的水壶，见证了海外华侨对抗战的巨大贡献。在滇缅公路的崇山峻岭中，陈昭藻等南侨机工冒着生命危险，用这个水壶在艰苦的环境中坚持运输，为抗战胜利提供了重要的物资保障。",
        modelSrc: "/models/生活用品/南侨机工陈昭藻在滇缅路服务时用的水壶.glb",
        historicalContext:
          "南侨机工在滇缅公路运输抗战物资中发挥了重要作用，为抗战胜利作出了巨大贡献。",
        historicalRecord:
          "南侨机工是抗战时期从东南亚回国支援抗战的华侨司机和技术工人。1939年，滇缅公路开通后，3200多名南侨机工响应号召回国服务，在极其艰苦的条件下运输抗战物资。陈昭藻作为其中一员，在滇缅公路的崇山峻岭中冒着生命危险坚持运输，这个水壶陪伴他度过了无数个艰苦的日日夜夜。南侨机工为抗战胜利作出了巨大贡献，体现了海外华侨的爱国情怀和民族精神。",
      },
      {
        id: "briefcase-li",
        title: "东北抗联第3路军总指挥李兆麟使用过的公文包",
        dynasty: "抗战时期",
        size: "长 40 厘米，宽 30 厘米",
        material: "皮革",
        category: "办公用品",
        description:
          "这是东北抗联第3路军总指挥李兆麟使用过的公文包，见证了东北抗日联军在白山黑水间的艰苦斗争。在极其恶劣的环境中，李兆麟将军用这个公文包携带重要文件、指挥部队作战，为东北抗日战争的胜利作出了重要贡献。",
        modelSrc:
          "/models/生活用品/东北抗联第3路军总指挥李兆麟使用过的公文包.glb",
        historicalContext:
          "东北抗联在极其艰苦的条件下坚持抗日斗争，为全国抗战胜利作出了重要贡献。",
        historicalRecord:
          "李兆麟（1910-1946），辽宁辽阳人，东北抗日联军主要领导人之一。1931年九一八事变后，积极投身抗日救亡运动，历任东北抗联第3路军总指挥等职。在极其艰苦的东北抗日战场上，李兆麟将军用这个公文包携带重要文件、指挥部队作战，在白山黑水间与日伪军展开殊死搏斗。东北抗联在极其恶劣的环境中坚持抗日斗争，为全国抗战胜利作出了重要贡献，体现了中华民族不屈不挠的抗战精神。",
      },
      {
        id: "desk-fang",
        title: "方少奇使用过的桌子",
        dynasty: "抗战时期",
        size: "长 120 厘米，宽 60 厘米，高 75 厘米",
        material: "木质",
        category: "办公家具",
        description:
          "这是方少奇在抗战时期使用过的办公桌，见证了敌后抗日根据地的办公环境。在简陋的窑洞或草房中，这张桌子成为了制定作战计划、处理日常事务的重要工具，承载着抗战时期军民团结抗战的珍贵记忆。",
        modelSrc: "/models/生活用品/方少奇使用过的桌子.glb",
        historicalContext:
          "敌后抗日根据地的办公条件极其简陋，但军民依然坚持抗战，体现了艰苦奋斗的精神。",
        historicalRecord:
          "方少奇是抗战时期敌后抗日根据地的重要干部，在极其简陋的条件下坚持工作。这张桌子见证了敌后抗日根据地的艰苦环境，在简陋的窑洞或草房中，方少奇等干部用这张桌子制定作战计划、处理日常事务、接待来访群众。敌后抗日根据地的办公条件虽然简陋，但军民团结一心、艰苦奋斗，为抗战胜利作出了重要贡献，体现了中华民族在困难面前不屈不挠的精神品质。",
      },
      {
        id: "uniform-new4",
        title: "抗战时期新四军军装",
        dynasty: "抗战时期",
        size: "适合中等身材",
        material: "棉布",
        category: "军装服饰",
        description:
          "这是抗战时期新四军战士穿着的军装，见证了新四军在华中敌后战场的英勇抗战。在物资极度匮乏的条件下，新四军战士穿着简朴的军装，在敌后战场与日伪军展开殊死搏斗，为抗战胜利作出了重要贡献。",
        modelSrc: "/models/生活用品/抗战时期新四军军装.glb",
        historicalContext:
          "新四军在华中敌后战场坚持抗战，为抗战胜利作出了重要贡献。",
        historicalRecord:
          "新四军是抗战时期中国共产党领导的重要抗日武装力量，在华中敌后战场坚持抗战。在物资极度匮乏的条件下，新四军战士穿着简朴的军装，克服重重困难，在敌后战场与日伪军展开殊死搏斗。新四军在叶挺、项英、陈毅等领导下，建立了华中抗日根据地，为抗战胜利作出了重要贡献。这套军装见证了新四军战士的英勇抗战，体现了中华民族不屈不挠的抗战精神和艰苦奋斗的优良作风。",
      },
      // 建筑场景
      {
    id: 'wanping',
    title: '宛平城',
    thumbnail: '/images/建筑物/宛平城.png',
    dynasty: '明朝（1638-1640年建）',
    category: '历史要塞',
    size: '东西640米，南北320米',
    material: '砖石结构',
    description: '宛平城是明朝末年为防御李自成农民起义而建的军事要塞，位于北京丰台区。它是中国人民抗日战争全面爆发的历史见证地，1937年7月7日的卢沟桥事变就发生在这里。这座半方形的古城见证了中华民族14年抗战的开端，城内保存着大量抗战文物和历史遗迹。',
    modelSrc: '/models/建筑物/宛平城.glb',
    historicalContext: '七七事变的发生地，标志着中国人民抗日战争全面爆发。',
    historicalRecord: '宛平城建于1638-1640年，原为明朝防御农民起义的军事要塞。1937年7月7日夜，日军以一名士兵失踪为借口，要求进入宛平城搜查，遭到中国守军严词拒绝。随后日军向宛平城和卢沟桥发动攻击，中国守军第29军第37师第110旅第219团团长吉星文率部奋起抵抗。这就是震惊中外的"七七事变"，标志着中国人民抗日战争全面爆发。城墙上至今还保留着当年日军炮击留下的弹痕，成为日本侵华的铁证。',
    technicalSpecs: {
      建筑面积: '20.48万平方米',
      城墙高度: '约10米',
      设防时间: '明朝崇祯年间',
      历史地位: '抗战全面爆发见证地'
    }
  },
  {
    id: 'sihang',
    title: '四行仓库',
    thumbnail: '/images/建筑物/四行仓库.png',
    dynasty: '民国时期（1937年建）',
    category: '历史建筑',
    size: '高6层，建筑面积2万平方米',
    material: '钢筋混凝土',
    description: '四行仓库位于上海静安区，是抗战时期"八百壮士"英勇抗日的历史见证地。1937年10月26日至11月1日，中国军队第88师524团第1营官兵在副团长谢晋元指挥下，坚守四行仓库4昼夜，击退日军多次进攻，为掩护大部队撤退争取了宝贵时间。',
    modelSrc: '/models/建筑物/四行仓库.glb',
    historicalContext: '淞沪会战中"八百壮士"的英勇抗战地，展现了中华民族的不屈精神。',
    historicalRecord: '四行仓库保卫战是淞沪会战的尾声，也是整个战役中最为悲壮的一幕。1937年10月26日，国民革命军第88师524团副团长谢晋元率领"八百壮士"（实际414人）坚守四行仓库。他们与数倍于己的日军展开殊死搏斗，在国际社会瞩目下上演了一场惊心动魄的抗日英雄剧。战士陈树生身绑手榴弹从楼上跳下与敌同归于尽的壮举，至今仍被人们传颂。这场战斗极大地鼓舞了全国人民的抗战士气。',
    technicalSpecs: {
      建筑年代: '1935年',
      建筑风格: '装饰艺术风格',
      防御时间: '4昼夜',
      守军人数: '414人'
    }
  },
  {
    id: 'yanan-auditorium',
    title: '延安大礼堂',
    thumbnail: '/images/建筑物/延安大礼堂.png',
    dynasty: '抗战时期（1940年建）',
    category: '革命建筑',
    size: '能容纳2000余人',
    material: '砖木结构',
    description: '延安大礼堂是中国共产党在延安时期的重要活动场所，见证了中国革命的重要历史时刻。1945年4月23日至6月11日，中国共产党第七次全国代表大会在这里胜利召开，确立了毛泽东思想的指导地位，为夺取抗日战争和解放战争的胜利奠定了思想基础。',
    modelSrc: '/models/建筑物/延安大礼堂.glb',
    historicalContext: '中共七大召开地，确立了毛泽东思想的指导地位。',
    historicalRecord: '延安大礼堂建于1940年，是延安时期最重要的公共建筑之一。1945年中共七大在此召开，这次大会是中国共产党在民主革命时期召开的最重要的代表大会。大会确立了毛泽东思想作为党的指导思想，选举产生了以毛泽东为核心的中央领导集体。礼堂的建设体现了陕北窑洞建筑的特色，同时融入了现代建筑元素，是革命圣地延安的重要标志性建筑。',
    technicalSpecs: {
      建成时间: '1940年',
      容纳人数: '2000余人',
      建筑特色: '中西合璧',
      历史意义: '中共七大会址'
    }
  },
  {
    id: 'taierzhuang',
    title: '台儿庄战役遗址',
    thumbnail: '/images/建筑物/台儿庄战役.png',
    dynasty: '抗战时期（1938年）',
    category: '战役遗址',
    size: '古城面积2平方公里',
    material: '砖石结构',
    description: '台儿庄古城位于山东枣庄，是1938年台儿庄大战的主战场。这场战役是抗战以来中国军队取得的第一次重大胜利，极大地鼓舞了全国军民的抗战士气。台儿庄战役歼灭日军万余人，打破了日军不可战胜的神话，成为抗战史上的重要转折点。',
    modelSrc: '/models/建筑物/台儿庄战役.glb',
    historicalContext: '抗战以来第一次重大军事胜利，被誉为"台儿庄大捷"。',
    historicalRecord: '台儿庄战役发生在1938年3月-4月，是徐州会战的重要组成部分。在李宗仁指挥下，中国军队与日军展开激烈的巷战。战役中，中国军队充分利用台儿庄的地理优势和建筑特点，与敌人展开逐街逐屋的争夺战。经过半个多月的浴血奋战，中国军队歼灭日军万余人，取得了抗战以来的第一次重大胜利。这一胜利不仅在军事上具有重要意义，更在精神上极大地鼓舞了全国人民。',
    technicalSpecs: {
      战役时间: '1938年3-4月',
      歼敌数量: '万余人',
      参战部队: '第五战区',
      历史地位: '抗战首胜'
    }
  },
  {
    id: 'chengde',
    title: '避暑山庄',
    thumbnail: '/images/建筑物/避暑山庄.png',
    dynasty: '清朝（1703-1792年建）',
    category: '皇家园林',
    size: '占地564万平方米',
    material: '传统建筑材料',
    description: '承德避暑山庄是中国现存占地最大的古代帝王宫苑，被誉为"中国古典园林之最高范例"。抗战时期，这里见证了华北地区的抗日斗争。山庄的建筑艺术和园林设计体现了中华文化的博大精深，是中华民族宝贵的文化遗产。',
    modelSrc: '/models/建筑物/避暑山庄.glb',
    historicalContext: '清朝皇家园林，抗战期间华北地区的重要历史见证地。',
    historicalRecord: '承德避暑山庄始建于1703年，历时89年建成，是清朝皇帝夏日避暑和处理政务的场所。抗日战争期间，日军占领承德后，对避暑山庄进行了破坏和掠夺。许多珍贵文物被劫掠，部分建筑遭到损毁。尽管如此，避暑山庄作为中华文化的瑰宝，依然展现着中国古代建筑和园林艺术的精华，象征着中华民族深厚的文化底蕴和不屈的民族精神。',
    technicalSpecs: {
      建造年代: '1703-1792年',
      占地面积: '564万平方米',
      建筑风格: '古典园林',
      文化价值: '世界文化遗产'
    }
  },
  {
    id: 'datong-fort',
    title: '大协炮楼',
    thumbnail: '/images/建筑物/大协炮楼.png',
    dynasty: '抗战时期',
    category: '军事工事',
    size: '高度约15米',
    material: '钢筋混凝土',
    description: '大协炮楼是抗战时期重要的军事防御工事，见证了中国军民英勇抗击日本侵略者的悲壮历史。这些坚固的炮楼在敌后游击战中发挥了重要作用，成为保卫家园、抵抗侵略的坚强堡垒。每一座炮楼都承载着抗战军民的血泪与坚守。',
    modelSrc: '/models/建筑物/大协炮楼.glb',
    historicalContext: '抗日战争时期的重要军事防御设施。',
    historicalRecord: '大协炮楼建于抗战时期，是当时重要的军事防御工事。在日军的疯狂进攻下，守卫炮楼的中国军民以血肉之躯筑起钢铁防线，用生命诠释了中华民族不屈不挠的精神。这些炮楼不仅是军事设施，更是民族精神的象征，见证了中国人民在艰难岁月中的坚韧与勇敢。虽然岁月流逝，但这些建筑仍然屹立不倒，提醒着后人珍惜和平，勿忘历史。',
    technicalSpecs: {
      建造时期: '1937-1945年',
      防御等级: '重点工事',
      战略作用: '制高点控制',
      历史意义: '抗战防御见证'
    }
  },
  {
    id: 'dajingmen',
    title: '张家口大境门',
    thumbnail: '/images/建筑物/张家口大境门.png',
    dynasty: '清朝（1644年建）',
    category: '古城门',
    size: '高12米，底宽13米',
    material: '条石砌筑',
    description: '张家口大境门是万里长城的重要关口，素有"万里长城第一门"之称。抗战时期，这里是华北地区重要的交通枢纽和军事要地。大境门见证了张家口地区军民的英勇抗战，承载着深厚的历史文化内涵和爱国主义精神。',
    modelSrc: '/models/建筑物/张家口大境门.glb',
    historicalContext: '万里长城重要关口，抗战期间华北地区的战略要地。',
    historicalRecord: '张家口大境门建于清顺治元年（1644年），是长城沿线保存较为完整的重要关口。抗日战争全面爆发后，日军很快占领了张家口，大境门地区成为日军统治华北的重要据点。在日占期间，当地军民进行了不屈不挠的抗日斗争。八路军游击队经常在大境门一带活动，打击日伪军，保护人民群众。大境门不仅是古代军事防御的见证，更是近代中华民族抗击外侵的历史丰碑。',
    technicalSpecs: {
      建造年代: '清顺治元年（1644年）',
      门洞高度: '12米',
      门洞宽度: '13米',
      历史地位: '长城第一门'
    }
  },
  {
    id: 'huadu-bunker',
    title: '花都碉堡',
    thumbnail: '/images/建筑物/花都碉堡.png',
    dynasty: '抗战时期',
    category: '防御工事',
    size: '直径6米，高8米',
    material: '钢筋混凝土',
    description: '花都碉堡是华南地区抗战时期重要的军事防御设施，见证了粤北地区军民的英勇抗战。这些坚固的碉堡在抗日游击战中发挥了重要作用，成为保卫华南、抵抗日军的重要据点。每一座碉堡都凝结着抗战军民的智慧和勇气。',
    modelSrc: '/models/建筑物/花都碉堡.glb',
    historicalContext: '华南地区抗日游击战的重要军事设施。',
    historicalRecord: '花都碉堡建于抗战时期，是华南地区重要的军事防御工事。广东沦陷后，中国军队和游击队利用这些碉堡与日军进行顽强抗争。碉堡的设计充分考虑了华南地区的地理特点和气候条件，既能有效防御敌人攻击，又便于进行反击作战。在艰苦的游击战争中，这些碉堡为抗日武装提供了重要的据点和掩护，为最终赢得抗战胜利做出了重要贡献。',
    technicalSpecs: {
      建造时期: '1938-1945年',
      防御半径: '500米',
      驻军规模: '1个班',
      战术价值: '游击据点'
    }
  },
  {
    id: 'seven-bridge',
    title: '七号桥碉堡',
    thumbnail: '/images/建筑物/七号桥碉堡.png',
    dynasty: '抗战时期',
    category: '桥梁防御',
    size: '长30米，宽8米',
    material: '钢筋混凝土',
    description: '七号桥碉堡是抗战时期重要的桥梁防御工事，控制着重要的交通要道。在激烈的抗日战争中，这里发生过多次激烈的攻防战，中国军民以顽强的意志守卫着这一战略要地，阻击日军的进攻，为抗战胜利做出了重要贡献。',
    modelSrc: '/models/建筑物/七号桥碉堡.glb',
    historicalContext: '重要交通要道的军事防御设施，多次抗击日军进攻。',
    historicalRecord: '七号桥碉堡位于重要的交通要道上，是抗战时期的关键军事设施。日军为了打通运输线，多次向这里发动猛烈攻击，但都被中国守军击退。守军利用碉堡的坚固防护和有利地形，与日军展开殊死搏斗。无数英勇的战士在这里洒下热血，用生命守护着祖国的每一寸土地。七号桥碉堡见证了中华民族在危难时刻的团结一心和不屈不挠的斗争精神。',
    technicalSpecs: {
      建造目的: '桥梁防御',
      战略位置: '交通要道',
      防御特点: '地形优势',
      历史作用: '阻敌要冲'
    }
  },
  {
    id: 'meihua-bunker',
    title: '梅花碉堡',
    thumbnail: '/images/建筑物/梅花碉堡.png',
    dynasty: '抗战时期',
    category: '特色防御工事',
    size: '呈梅花形分布',
    material: '钢筋混凝土',
    description: '梅花碉堡以其独特的梅花形布局而得名，是抗战时期军事工程设计的杰作。这种布局不仅美观，更重要的是具有很强的军事防御价值，能够形成交叉火力网，有效抵御敌军的进攻。梅花碉堡体现了中国军民的聪明才智和不屈精神。',
    modelSrc: '/models/建筑物/梅花碉堡.glb',
    historicalContext: '独特的梅花形军事防御布局，展现了中国军事工程的智慧。',
    historicalRecord: '梅花碉堡是抗战时期军事工程设计的创新之作，其梅花形的布局设计既有文化寓意，又具有很强的实战价值。五个碉堡呈梅花状分布，能够形成完整的防御火力网，有效控制各个方向的进攻路线。这种设计体现了中国传统文化与现代军事科学的完美结合，是中华民族智慧的结晶。在抗战的烽火岁月中，梅花碉堡如梅花一样傲雪凌霜，坚韧不拔。',
    technicalSpecs: {
      布局特点: '梅花形分布',
      碉堡数量: '5座',
      火力覆盖: '360度',
      设计理念: '文化与军事结合'
    }
  },
  {
    id: 'south-gate',
    title: '南城门',
    thumbnail: '/images/建筑物/南城门.png',
    dynasty: '明清时期',
    category: '古城门',
    size: '高15米，宽10米',
    material: '青砖石料',
    description: '南城门是古城的重要组成部分，在抗战时期承担着重要的防御功能。这座雄伟的城门见证了历史的变迁，在抗日战争中，中国军民依托城门和城墙的坚固防御，与入侵的日军进行了英勇的斗争，谱写了可歌可泣的抗战篇章。',
    modelSrc: '/models/建筑物/南城门.glb',
    historicalContext: '古城重要防御设施，抗战时期的坚固屏障。',
    historicalRecord: '南城门始建于明代，是古城防御体系的重要组成部分。抗日战争爆发后，这里成为抵御日军进攻的重要据点。中国守军利用城门的坚固结构和有利地形，多次击退日军的进攻。城门上的弹痕累累，见证了那段血与火的历史。在最危急的时刻，守城将士宁死不屈，用血肉之躯守护着城门，保卫着人民的生命财产安全。南城门不仅是建筑艺术的珍品，更是中华民族不屈精神的象征。',
    technicalSpecs: {
      建造朝代: '明代',
      城门类型: '瓮城门',
      防御功能: '主要通道',
      文物价值: '重点保护'
    }
  }
    ];

    exhibitData.value = warExhibits.find((item) => item.id === props.id) || {
      title: "未找到展品",
      dynasty: "未知",
      size: "未知",
      description: "未找到该展品的详细信息",
      modelSrc: "/models/步枪.glb",
    };

    // 添加初始欢迎消息
    addBotMessage(
      `您好！我是${exhibitData.value.title}。很高兴能与您交流，请问您想了解关于我的什么信息呢？`
    );
  }
});

// 返回列表页
const goBack = () => {
  router.push("/war-exhibit");
};

// 处理模型加载错误
const handleModelError = (event) => {
  console.error("模型加载失败:", exhibitData.value?.modelSrc, event);
  modelError.value = true;
  modelLoading.value = false;
};

// AI问答相关方法
const addBotMessage = (text) => {
  // 创建一个空消息，然后使用打字机效果逐字显示
  const messageId = Date.now();
  chatMessages.value.push({
    id: messageId,
    sender: "bot",
    text: "",
    fullText: text,
    isTyping: true,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  scrollToBottom();

  // 开始逐字显示
  let index = 0;
  const intervalId = setInterval(() => {
    // 查找对应ID的消息
    const messageIndex = chatMessages.value.findIndex(
      (msg) => msg.id === messageId
    );
    if (messageIndex === -1) {
      clearInterval(intervalId);
      return;
    }

    const message = chatMessages.value[messageIndex];
    // 逐字添加文本
    if (index < message.fullText.length) {
      // 创建新对象避免响应式更新问题
      chatMessages.value[messageIndex] = {
        ...message,
        text: message.fullText.substring(0, index + 1),
      };
      index++;
      scrollToBottom();
    } else {
      // 完成打字
      chatMessages.value[messageIndex] = {
        ...message,
        isTyping: false,
      };
      clearInterval(intervalId);
    }
  }, typingSpeed);
};

// 流式添加机器人消息
const streamBotMessage = async (messageId) => {
  // 创建消息
  chatMessages.value.push({
    id: messageId,
    sender: "bot",
    text: "",
    fullText: "",
    isTyping: true,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  scrollToBottom();
};

// 更新流式消息
const updateStreamMessage = (messageId, chunk) => {
  const messageIndex = chatMessages.value.findIndex(
    (msg) => msg.id === messageId
  );
  if (messageIndex === -1) return;

  const message = chatMessages.value[messageIndex];
  // 添加新的文本
  chatMessages.value[messageIndex] = {
    ...message,
    text: message.text + (chunk || ""),
    fullText: message.text + (chunk || ""),
  };
  scrollToBottom();
};

// 完成流式消息
const completeStreamMessage = (messageId) => {
  const messageIndex = chatMessages.value.findIndex(
    (msg) => msg.id === messageId
  );
  if (messageIndex === -1) return;

  const message = chatMessages.value[messageIndex];
  chatMessages.value[messageIndex] = {
    ...message,
    isTyping: false,
  };
  scrollToBottom();
};

const addUserMessage = (text) => {
  chatMessages.value.push({
    sender: "user",
    text,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const generateAIResponse = async (userQuestion) => {
  if (!apiIsReady.value) {
    addBotMessage("抱歉，AI服务暂时不可用，请稍后再试。");
    return;
  }

  // 生成消息ID
  const messageId = Date.now();

  try {
    // 准备AI消息历史
    let contextMessages = [
      {
        role: "system",
        content: `你是博物馆中的"${
          exhibitData.value.title
        }"文物，需要以第一人称方式回答游客的问题。
        
展品信息:
- 名称: ${exhibitData.value.title}
- 年代: ${exhibitData.value.dynasty}
- 类别: ${exhibitData.value.category}
- 尺寸: ${exhibitData.value.size}
- 材质: ${exhibitData.value.material}
- 描述: ${exhibitData.value.description}
${
  exhibitData.value.historicalContext
    ? `- 历史背景: ${exhibitData.value.historicalContext}`
    : ""
}
${
  exhibitData.value.historicalRecord
    ? `- 史料记载: ${exhibitData.value.historicalRecord}`
    : ""
}

请始终以第一人称("我")的方式回答问题，仿佛你就是这件展品。保持友好、专业的语气，提供丰富的历史文化背景和细节。回答应该体现文物的历史意义、文化价值和艺术特色。如果问题超出了展品信息范围，可以合理推测，但要表明这是推测内容。开场白已经介绍过你是什么展品，不要重复自我介绍。`,
      },
    ];

    // 添加历史对话记录
    for (let i = 0; i < chatMessages.value.length; i++) {
      const msg = chatMessages.value[i];
      if (msg.sender === "user") {
        contextMessages.push({
          role: "user",
          content: msg.text,
        });
      } else if (msg.sender === "bot" && !msg.isTyping) {
        contextMessages.push({
          role: "assistant",
          content: msg.fullText || msg.text,
        });
      }
    }

    // 添加当前问题
    contextMessages.push({
      role: "user",
      content: userQuestion,
    });

    // 创建流消息
    await streamBotMessage(messageId);

    // 发送请求并处理流式响应
    const reader = await fetchAIResponse(contextMessages);

    // 处理流式响应
    for await (const content of streamReader(reader)) {
      updateStreamMessage(messageId, content);
    }

    // 完成流式消息
    completeStreamMessage(messageId);
  } catch (error) {
    console.error("AI API调用错误:", error);

    // 查找错误消息并移除
    const errorIndex = chatMessages.value.findIndex(
      (msg) => msg.id === messageId
    );
    if (errorIndex !== -1) {
      chatMessages.value.splice(errorIndex, 1);
    }

    // 添加错误提示
    addBotMessage("抱歉，AI服务出现了问题，请稍后再试。");

    // 标记API不可用
    apiIsReady.value = false;

    // 30秒后重置状态
    setTimeout(() => {
      apiIsReady.value = true;
    }, 30000);
  }
};

const sendMessage = () => {
  if (!userMessage.value.trim()) return;

  // 添加用户消息
  addUserMessage(userMessage.value);

  // 清空输入框
  const message = userMessage.value;
  userMessage.value = "";

  // 模拟机器人正在输入
  isTyping.value = true;

  // 等待动画显示一小段时间
  setTimeout(() => {
    isTyping.value = false;

    // 使用AI API生成回复
    generateAIResponse(message);
  }, 500);
};

const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const adjustTextareaHeight = () => {
  if (!messageInput.value) return;
  messageInput.value.style.height = "auto";
  messageInput.value.style.height = messageInput.value.scrollHeight + "px";
};

// 直接使用fetch API处理流式响应
async function* streamReader(reader) {
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (streamDone) {
      done = true;
      continue;
    }

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk
      .split("\n\n")
      .filter((line) => line.trim().startsWith("data: "));

    for (const line of lines) {
      if (line.includes("[DONE]")) {
        break;
      }

      try {
        const jsonStr = line.replace("data: ", "").trim();
        if (jsonStr) {
          const json = JSON.parse(jsonStr);
          if (json.choices && json.choices[0]?.delta?.content) {
            yield json.choices[0].delta.content;
          }
        }
      } catch (e) {
        console.error("解析JSON失败:", e);
      }
    }
  }
}

// 使用Fetch API发送请求并处理响应
async function fetchAIResponse(messages) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API请求失败: ${response.status} ${errorText}`);
  }

  return response.body.getReader();
}

// 监听消息变化和打字状态变化，自动滚动到底部
watch([chatMessages, isTyping], () => {
  scrollToBottom();
});

// 监听消息变化，自动调整文本框高度
watch(userMessage, () => {
  nextTick(() => {
    adjustTextareaHeight();
  });
});

// 处理模型加载成功
const handleModelLoad = () => {
  modelError.value = false;
  modelLoading.value = false;
  console.log("模型加载成功:", exhibitData.value?.modelSrc);
};
</script>

<template>
  <div v-if="exhibitData" class="space-y-8 md:space-y-12">
    <!-- 返回按钮 -->
    <div class="flex items-center">
      <button
        @click="goBack"
        class="flex items-center px-4 py-2 bg-white/70 hover:bg-white/90 text-museum-dark border border-red-200/30 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回抗战展示
      </button>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <!-- 3D模型展示区域 -->
      <div class="space-y-6">
        <div
          class="bg-white/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-200/20 shadow-lg"
        >
          <h2
            class="text-xl md:text-2xl font-bold text-museum-dark mb-6 text-center"
          >
            3D模型展示
          </h2>

          <!-- 3D模型容器 -->
          <div
            class="relative h-80 md:h-96 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg overflow-hidden"
          >
            <!-- 加载状态 -->
            <div
              v-if="modelLoading"
              class="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm z-10"
            >
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"
                ></div>
                <p class="text-red-600 font-medium">正在加载3D模型...</p>
              </div>
            </div>

            <!-- 错误状态 -->
            <div
              v-if="modelError"
              class="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm z-10"
            >
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 text-red-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="text-red-600 font-medium">模型加载失败</p>
                <p class="text-red-500 text-sm mt-2">
                  请检查网络连接或稍后重试
                </p>
              </div>
            </div>

            <!-- Model Viewer -->
            <model-viewer
              :src="exhibitData.modelSrc"
              alt="3D模型"
              auto-rotate
              camera-controls
              touch-action="pan-y"
              class="w-full h-full"
              loading="eager"
              reveal="auto"
              @load="handleModelLoad"
              @error="handleModelError"
            >
              <div slot="progress-bar" class="progress-bar hide">
                <div class="update-bar"></div>
              </div>
            </model-viewer>
          </div>

          <!-- 操作提示 -->
          <div class="mt-4 text-center">
            <p class="text-sm text-museum-dark/60">
              拖拽旋转 · 滚轮缩放 · 双击重置
            </p>
          </div>
        </div>

        <!-- AI问答功能 -->
        <div
          class="backdrop-blur-lg bg-museum-primary/20 rounded-2xl border border-museum-gold/20 shadow-2xl flex flex-col h-[400px] md:h-[500px] animate-slide-up animation-delay-200"
        >
          <!-- 对话标题 -->
          <div
            class="p-3 md:p-4 border-b border-museum-gold/20 backdrop-blur-md bg-museum-primary/40 animate-fade-in"
          >
            <div class="flex justify-between items-center">
              <h3
                class="text-lg md:text-xl font-bold text-museum-light flex items-center animate-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-museum-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI文物对话
              </h3>

              <!-- 快速提问按钮 -->
              <div class="flex space-x-2">
                <button
                  @click="
                    () => {
                      userMessage = '这件文物的历史背景是什么？';
                      sendMessage();
                    }
                  "
                  class="text-left p-1.5 bg-museum-gold/20 hover:bg-museum-gold/30 rounded-md border border-museum-gold/30 transition-colors duration-200 text-xs text-museum-light/80 hover:text-museum-light truncate"
                  title="这件文物的历史背景是什么？"
                >
                  💡 历史背景
                </button>
                <button
                  @click="
                    () => {
                      userMessage = '这件文物有什么文化价值？';
                      sendMessage();
                    }
                  "
                  class="text-left p-1.5 bg-museum-gold/20 hover:bg-museum-gold/30 rounded-md border border-museum-gold/30 transition-colors duration-200 text-xs text-museum-light/80 hover:text-museum-light truncate"
                  title="这件文物有什么文化价值？"
                >
                  🎨 文化价值
                </button>
                <button
                  @click="
                    () => {
                      userMessage = '这件文物的制作工艺如何？';
                      sendMessage();
                    }
                  "
                  class="text-left p-1.5 bg-museum-gold/20 hover:bg-museum-gold/30 rounded-md border border-museum-gold/30 transition-colors duration-200 text-xs text-museum-light/80 hover:text-museum-light truncate"
                  title="这件文物的制作工艺如何？"
                >
                  ⚒️ 制作工艺
                </button>
                <button
                  @click="
                    () => {
                      userMessage = '这件文物在抗战中发挥了什么作用？';
                      sendMessage();
                    }
                  "
                  class="text-left p-1.5 bg-museum-gold/20 hover:bg-museum-gold/30 rounded-md border border-museum-gold/30 transition-colors duration-200 text-xs text-museum-light/80 hover:text-museum-light truncate"
                  title="这件文物在抗战中发挥了什么作用？"
                >
                  ⚔️ 抗战作用
                </button>
              </div>
            </div>
          </div>

          <!-- 消息列表区域 -->
          <div class="flex-grow p-3 md:p-4 overflow-y-auto" ref="chatContainer">
            <div
              v-for="(message, index) in chatMessages"
              :key="index"
              class="mb-3 md:mb-4 transition-all duration-300"
              :class="{
                'animate-slide-right': message.sender === 'bot',
                'animate-slide-left': message.sender === 'user',
              }"
            >
              <!-- 机器人消息 -->
              <div
                v-if="message.sender === 'bot'"
                class="flex items-start justify-start"
              >
                <div
                  class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/80 flex items-center justify-center mr-2 flex-shrink-0 shadow-glow-green"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 md:h-5 md:w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div class="max-w-[85%] md:max-w-[80%]">
                  <div
                    class="bg-museum-primary/40 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tl-none text-museum-light text-left text-sm md:text-base shadow-md hover:bg-museum-primary/60 transition-all duration-300"
                  >
                    {{ message.text }}
                    <span
                      v-if="message.isTyping"
                      class="inline-block w-1.5 h-4 bg-museum-light/70 ml-0.5 animate-pulse"
                    ></span>
                  </div>
                  <div class="text-xs text-museum-light/50 mt-1 text-left">
                    {{ message.time }}
                  </div>
                </div>
              </div>

              <!-- 用户消息 -->
              <div v-else class="flex items-start justify-end">
                <div class="max-w-[85%] md:max-w-[80%]">
                  <div
                    class="bg-museum-gold/20 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tr-none text-museum-light text-sm md:text-base shadow-md hover:bg-museum-gold/30 transition-all duration-300"
                  >
                    {{ message.text }}
                  </div>
                  <div class="text-xs text-museum-light/50 mt-1 text-right">
                    {{ message.time }}
                  </div>
                </div>
                <div
                  class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-museum-copper/80 flex items-center justify-center ml-2 flex-shrink-0 shadow-glow-copper"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 md:h-5 md:w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 正在输入提示 -->
            <div
              v-if="isTyping"
              class="flex items-start mb-3 md:mb-4 animate-fade-in"
            >
              <div
                class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/80 flex items-center justify-center mr-2 flex-shrink-0 shadow-glow-green"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 md:h-5 md:w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div
                class="bg-museum-primary/40 backdrop-blur-sm p-2 md:p-3 rounded-lg rounded-tl-none text-museum-light shadow-md"
              >
                <div class="flex space-x-1">
                  <div
                    class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                  ></div>
                  <div
                    class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                  ></div>
                  <div
                    class="w-2 h-2 bg-museum-light/70 rounded-full animate-bounce"
                    style="animation-delay: 0.4s"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div
            class="p-3 md:p-4 border-t border-museum-gold/20 backdrop-blur-md bg-museum-primary/40 animate-slide-up animation-delay-300"
          >
            <div class="flex">
              <textarea
                v-model="userMessage"
                @keydown="handleKeyDown"
                class="flex-grow bg-museum-primary/40 backdrop-blur-sm text-museum-light border border-museum-gold/30 rounded-l-lg p-2 focus:outline-none focus:border-museum-gold/60 focus:shadow-glow-gold resize-none text-sm md:text-base transition-all duration-300"
                placeholder="询问AI智能助手..."
                rows="1"
                ref="messageInput"
              ></textarea>
              <button
                @click="sendMessage"
                class="bg-green-500 hover:bg-green-600 text-white font-bold px-3 md:px-4 rounded-r-lg transition-all duration-300 hover:shadow-glow-green hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <div class="mt-1 md:mt-2 text-xs text-museum-light/50 text-right">
              由豆包AI提供智能问答服务
            </div>
          </div>
        </div>
      </div>

      <!-- 文物信息区域 -->
      <div class="space-y-6">
        <!-- 基本信息 -->
        <div
          class="bg-white/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-200/20 shadow-lg"
        >
          <div class="flex items-center mb-4">
            <div class="w-1 h-8 bg-red-600 rounded-full mr-4"></div>
            <h1 class="text-2xl md:text-3xl font-bold text-museum-dark">
              {{ exhibitData.title }}
            </h1>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">时期</p>
              <p class="text-museum-dark font-semibold">
                {{ exhibitData.dynasty }}
              </p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">类别</p>
              <p class="text-museum-dark font-semibold">
                {{ exhibitData.category }}
              </p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">尺寸</p>
              <p class="text-museum-dark font-semibold">
                {{ exhibitData.size }}
              </p>
            </div>
            <div class="bg-red-50/50 rounded-lg p-3">
              <p class="text-sm text-red-600 font-medium">材质</p>
              <p class="text-museum-dark font-semibold">
                {{ exhibitData.material }}
              </p>
            </div>
          </div>

          <div class="border-t border-red-100 pt-6">
            <h3 class="text-lg font-semibold text-museum-dark mb-3">
              详细描述
            </h3>
            <p class="text-museum-dark/80 leading-relaxed">
              {{ exhibitData.description }}
            </p>
          </div>
        </div>

        <!-- 技术规格 -->
        <div
          v-if="exhibitData.technicalSpecs"
          class="bg-white/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-200/20 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-museum-dark mb-4">技术规格</h3>
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="(value, key) in exhibitData.technicalSpecs"
              :key="key"
              class="flex justify-between items-center py-2 border-b border-red-100/50 last:border-b-0"
            >
              <span class="text-museum-dark/70 capitalize">{{
                key === "caliber"
                  ? "口径"
                  : key === "weight"
                  ? "重量"
                  : key === "length"
                  ? "长度"
                  : key === "capacity"
                  ? "容量"
                  : key
              }}</span>
              <span class="text-museum-dark font-medium">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- 历史背景 -->
        <div
          class="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-200/30 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-white/80 mb-4">历史背景</h3>
          <p class="text-white/60 leading-relaxed">
            {{ exhibitData.historicalContext }}
          </p>
        </div>

        <!-- 史料记载 -->
        <div
          v-if="exhibitData.historicalRecord"
          class="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-yellow-200/30 shadow-lg"
        >
          <h3
            class="text-lg font-semibold text-white/80 mb-4 flex items-center"
          >
            <span class="text-yellow-600 mr-2">📚</span>
            史料记载
          </h3>
          <div class="text-white/60 leading-relaxed space-y-4">
            <p class="text-justify">{{ exhibitData.historicalRecord }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Model Viewer 样式 */
model-viewer {
  --poster-color: transparent;
  --progress-bar-color: #dc2626;
  --progress-mask: #ffffff;
}

/* 进度条隐藏 */
.progress-bar.hide {
  display: none;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(162, 123, 92, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(162, 123, 92, 0.8);
}

/* 动画样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.8s ease-out forwards;
}

.animate-slide-left {
  animation: slideInFromLeft 0.4s ease-out forwards;
}

.animate-slide-right {
  animation: slideInFromRight 0.4s ease-out forwards;
}

.animate-content {
  opacity: 0;
  animation: contentFadeIn 0.6s ease-out forwards;
}

/* 动画延迟类 */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

/* 发光效果 */
.shadow-glow-gold {
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.shadow-glow-green {
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.shadow-glow-copper {
  box-shadow: 0 0 10px rgba(162, 123, 92, 0.5);
}

/* 移动设备优化 */
@media (max-width: 640px) {
  ::-webkit-scrollbar {
    width: 3px;
  }
}
</style>
