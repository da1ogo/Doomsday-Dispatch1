/**
 * BunkerOS Game Database v2.0
 * 14-Day Expanded Campaign with 5 Sector Metrics, Flexible Dispatches,
 * 35+ Black Market Items, 14-Day Gazettes, and Multi-Branch Narrative.
 */

const GAME_SECTORS_INIT = [
  {
    id: "sec_mine",
    name: "Шахта «Глубокая-7»",
    role: "Энергоснабжение и бурение",
    iconKey: "mine",
    iconBadge: "[ШАХТА]",
    status: "normal", // 'normal', 'warning', 'critical', 'dead'
    coords: { x: 180, y: 380 },
    population: 85,
    maxPop: 90,
    deadToday: 0,
    totalDead: 0,
    heat: 85,        // 0-100%
    food: 70,        // 0-100%
    water: 75,       // 0-100%
    sanitation: 65,  // 0-100%
    riotRisk: 15,    // 0-100%
    notes: "Буровые установки качают тепло из геотермальных жил. Требуют стабильного охлаждения и топлива."
  },
  {
    id: "sec_water",
    name: "Водоочиститель «Омега»",
    role: "Фильтрация конденсата",
    iconKey: "water",
    iconBadge: "[ВОДА]",
    status: "normal",
    coords: { x: 200, y: 160 },
    population: 42,
    maxPop: 45,
    deadToday: 0,
    totalDead: 0,
    heat: 65,
    food: 75,
    water: 85,
    sanitation: 80,
    riotRisk: 10,
    notes: "Питает чистой водой Жилой Блок, Госпиталь и Теплицы. Уязвимы насосы первичной очистки."
  },
  {
    id: "sec_hydro",
    name: "Теплицы «Флора-3»",
    role: "Гидропоника и биомасса",
    iconKey: "hydro",
    iconBadge: "[ФЛОРА]",
    status: "normal",
    coords: { x: 620, y: 140 },
    population: 60,
    maxPop: 65,
    deadToday: 0,
    totalDead: 0,
    heat: 75,
    food: 80,
    water: 80,
    sanitation: 70,
    riotRisk: 10,
    notes: "Выращивание белковой пасты и люминесцентных грибов. Требуют стабильного тепла и воды."
  },
  {
    id: "sec_med",
    name: "Медпункт Красного Креста",
    role: "Карантин и полевая хирургия",
    iconKey: "med",
    iconBadge: "[САНЧАСТЬ]",
    status: "warning",
    coords: { x: 630, y: 360 },
    population: 38,
    maxPop: 50,
    deadToday: 0,
    totalDead: 0,
    heat: 70,
    food: 65,
    water: 70,
    sanitation: 55,
    riotRisk: 20,
    notes: "Хроническая нехватка сывороток. Содержит изолятор для жертв поверхностных спор."
  },
  {
    id: "sec_radar",
    name: "Радиовышка «Зенит»",
    role: "Связь и поверхностный дозор",
    iconKey: "radar",
    iconBadge: "[РАДАР]",
    status: "normal",
    coords: { x: 420, y: 70 },
    population: 18,
    maxPop: 20,
    deadToday: 0,
    totalDead: 0,
    heat: 40,
    food: 60,
    water: 60,
    sanitation: 75,
    riotRisk: 15,
    notes: "Самая открытая точка на поверхности. Ведет мониторинг радиоактивных циклонов и конвоев."
  },
  {
    id: "sec_block",
    name: "Жилой Блок №4",
    role: "Гражданское население",
    iconKey: "block",
    iconBadge: "[ЖИЛОЙ БЛОК]",
    status: "normal",
    coords: { x: 410, y: 250 },
    population: 210,
    maxPop: 240,
    deadToday: 0,
    totalDead: 0,
    heat: 75,
    food: 70,
    water: 75,
    sanitation: 65,
    riotRisk: 25,
    notes: "Семьи рабочих, инженеры запаса. Главный индикатор лояльности и морали в бункере."
  }
];

const INITIAL_RESOURCES = {
  fuel: 4,   // Топливные ячейки ⛽
  food: 4,   // Продовольственные пайки 🍞
  meds: 3,   // Медкомплекты 💊
  ammo: 4,   // Ящики патронов 🔫
  water: 3   // Канистры дистиллята 💧
};

// 14-Day Timeline
const GAME_DATES = [
  "14.11.1998",
  "15.11.1998",
  "16.11.1998",
  "17.11.1998",
  "18.11.1998",
  "19.11.1998",
  "20.11.1998",
  "21.11.1998",
  "22.11.1998",
  "23.11.1998",
  "24.11.1998",
  "25.11.1998",
  "26.11.1998",
  "27.11.1998"
];

// Intro Comic Slides
const COMIC_INTRO_SLIDES = [
  {
    title: "1989 ГОД. СБОЙ АВТОМАТИКИ",
    text: "Система раннего предупреждения дала ложный сигнал. Спустя 40 минут радиоактивный пепел накрыл континент. Правительство запечатало глубоководный и подземный проект «Ковчег-Омега» на неопределенный срок.",
    frameTag: "[АРХИВ: ДЕНЬ 0]",
    image: "img/comic_1.jpg"
  },
  {
    title: "15 ЛЕТ В ГЛУБИНЕ",
    text: "Шли годы. Вся жизнь бункера держится на шести внешних аванпостах: Шахта качает геотермальное тепло, «Омега» цедит радиоактивный конденсат, «Флора» выращивает мутную белковую пасту. Связи с внешним миром нет.",
    frameTag: "[ПРОЕКТ «ОМЕГА»]",
    image: "img/comic_2.jpg"
  },
  {
    title: "ПУСТОЕ КРЕСЛО №4",
    text: "Вчера диспетчер Смены №4 бесследно исчез. В его каморке остались остывший суррогатный кофе, следы крови на вентиляционной решетке и мерцающий экран терминала BunkerOS v3.11.",
    frameTag: "[ИНЦИДЕНТ 74-Б]",
    image: "img/comic_3.jpg"
  },
  {
    title: "ВАШЕ НАЗНАЧЕНИЕ",
    text: "Тебя перевели из нижних бараков. Тебе выделили оклад в 700 рублей и персональный терминал. Твоя семья пока еще дышит. За работу, Диспетчер. Ошибки караются штрафами и трибуналом.",
    frameTag: "[ПРИКАЗ №114]",
    image: "img/comic_4.jpg"
  }
];

const BANK_ACCOUNTS = {
  family: "7402-9912-1404",
  bunkerStore: "0001-0004-9800",
  blackMarket: "9999-6666-0000"
};

const APP_MARKET_DATABASE = [

  {
    id: "app_tetris",
    name: "Тетрис-1989",
    category: "Игры",
    price: 150,
    icon: "🎮",
    desc: "Классическая электронная головоломка для снятия стресса на дежурстве."
  },
  {
    id: "app_telemetry",
    name: "Анализатор телеметрии v1.2",
    category: "Утилиты",
    price: 450,
    icon: "📡",
    desc: "Автоматически подсвечивает расхождения в датчиках при анализе депеш."
  },
  {
    id: "app_key",
    name: "Служебный ключ ЦК",
    category: "Доступ",
    price: 800,
    icon: "🔑",
    desc: "Дает разовый доступ к резервным складам Госрезерва (+1 Топливная Ячейка)."
  },
  {
    id: "app_miner",
    name: "Ускоритель ОЗУ «Турбо-86»",
    category: "Система",
    price: 0,
    icon: "⚡",
    desc: "Бесплатная утилита оптимизации оперативной памяти терминала. Рекомендуется Госпланом."
  }
];

const RANDOM_EVENTS_DATABASE = [
  {
    id: "evt_rad_spike",
    title: "РАДИАЦИОННЫЙ ВЫБРОС В ШТОЛЬНЕ!",
    desc: "Датчик штольни зафиксировал прорыв горячего пепла! Необходима экстренная реакция за 15 секунд!",
    durationSec: 15,
    options: [
      { text: "Направить резервный дистиллят (-1 Вода)", cost: { water: 1 }, result: "Жители укрыты и напоены. Жертв удалось избежать." },
      { text: "Запечатать сектор «Шахта» (+10 мкЗв)", cost: {}, result: "Шахта запечатана. 4 рабочих получили дозу лучевой болезни." },
      { text: "Игнорировать тревогу", cost: {}, result: "Пепел проник в вентиляцию! 6 жителей задохнулись!" }
    ]
  },
  {
    id: "evt_power_short",
    title: "КОРОТКОЕ ЗАМЫКАНИЕ В ПОДСТАНЦИИ!",
    desc: "Высоковольтная дуга угрожает сжечь распределительные щиты Сектора Водоочистки!",
    durationSec: 12,
    options: [
      { text: "Сбросить нагрузку на резервную ячейку (-1 Топливо)", cost: { fuel: 1 }, result: "Резервная ячейка приняла скачок, оборудование цело." },
      { text: "Обесточить Теплицы на 2 часа", cost: {}, result: "Теплицы остыли на 6°C, урожай белковой массы частично поврежден." },
      { text: "Ничего не предпринимать", cost: {}, result: "Щиты сгорели! Сектор Водоочистителя потерял 25% мощности!" }
    ]
  },
  {
    id: "evt_perimeter_beast",
    title: "ТРЕВОГА ПЕРИМЕТРА: ДВИЖЕНИЕ У РЕШЕТКИ!",
    desc: "Датчики шлюза фиксируют удары тяжелого когтистого тела мутанта-падальщика!",
    durationSec: 15,
    options: [
      { text: "Дать залп из защитной турели (-1 Патроны)", cost: { ammo: 1 }, result: "Тварь пустоши уничтожена на подступах к шлюзу." },
      { text: "Включить светошумовой ревун высокого тона", cost: {}, result: "Мутант испугался ревуна и отступил в туман." },
      { text: "Экономить боезапас", cost: {}, result: "Мутант сорвал датчики наружной температуры и повредил гидрозатвор!" }
    ]
  },
  {
    id: "evt_fire_vent",
    title: "ВОЗГОРАНИЕ КАБЕЛЬНОГО КАНАЛА ВЕНТИЛЯЦИИ!",
    desc: "Термодатчик вентиляционной шахты показывает 420°C! Едкий дым идет в жилой блок!",
    durationSec: 15,
    options: [
      { text: "Активировать хладоновое тушение (-1 Вода)", cost: { water: 1 }, result: "Канал потушен хладоном. Задымление ликвидировано." },
      { text: "Изолировать шлюз вентиляции", cost: {}, result: "Шлюз заблокирован. 3 жителя надышались гарью." },
      { text: "Игнорировать сирену", cost: {}, result: "Огонь повредил проводку! 5 жителей пострадали от удушья!" }
    ]
  },
  {
    id: "evt_steam_rupture",
    title: "РАЗРЫВ МАГИСТРАЛИ ПАРОПРОВОДА!",
    desc: "Раскаленный пар хлещет в распределительном узле! Угроза остановки генераторов!",
    durationSec: 12,
    options: [
      { text: "Перевести нагрев на запасной контур (-1 Топливо)", cost: { fuel: 1 }, result: "Контур стабилизирован. Оборудование спасено." },
      { text: "Экстренно сбросить давление в атмосферу", cost: {}, result: "Давление сброшено, но тепловой баланс блока нарушен." },
      { text: "Ничего не предпринимать", cost: {}, result: "Трубу разорвало! 8 рабочих получили ожоги!" }
    ]
  }
];



// 14-Day Scripted Campaign with Multi-Wave Dispatches & Flexible Demands
const DISPATCH_DATABASE = [
  // ================= DAY 1 =================
  {
    id: "d1_mine_heat",
    day: 1,
    wave: 1,
    sectorId: "sec_mine",
    sender: "Бригадир Горбунов (Шахта)",
    priority: "ВЫСОКИЙ",
    topic: "Капремонт насоса глубинного охлаждения",
    text: "Диспетчер, это 7-я штольня. Из-за вчерашнего скачка фазы встал циркуляционный насос. Если не зальем Топливную Ячейку для запуска резервного генератора, через 12 часов ствол зальет раскаленным шламом. 85 шахтеров окажутся замурованы.",
    demandSummary: "Требуется: 1 ед. Топлива ⛽",
    demandOptions: [{ fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "42°C (Норма: 18°C — Критический рост!)",
      sensorMotion: "Активность персонала в норме",
      sensorSeismic: "Микротолчки в пределах нормы"
    },
    isFraud: false,
    reason: "Датчики подтверждают аномальный перегрев ствола. Запрос критически обоснован.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_mine", { heat: 85, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Шахта «Глубокая-7» спасена! Насосы охладили ствол. Потерь персонала нет.");
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_mine", { heat: 25, deadToday: 14, status: "critical" });
      game.flags.mineFlooded = true;
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Из-за нехватки топлива шлам прорвал горизонт Шахты. 14 забойщиков замурованы!");
      game.modifyRating("gos", -15);
    }
  },
  {
    id: "d1_water_drunk",
    day: 1,
    wave: 1,
    sectorId: "sec_water",
    sender: "Оператор смены Синицын (Водоочиститель)",
    priority: "СРОЧНО",
    topic: "ТРЕБУЮТСЯ ПАТРОНЫ ДЛЯ ОТРАЖЕНИЯ НАПАДЕНИЯ!",
    text: "Внимание диспетчерской! Нас штурмуют мародеры из ржавой пустоши! Они скребутся в люки шлюза! Срочно вышлите 2 ящика боеприпасов для стационарной турели, иначе нас вырежут до последнего!",
    demandSummary: "Требуется: 2 ед. Патронов 🔫",
    demandOptions: [{ ammo: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 2, water: 0 },
    telemetryFacts: {
      sensorTemp: "12°C (Норма)",
      sensorMotion: "Периметр: 0 движений. Внутренний отсек: хаотичные колебания",
      sensorAudio: "Громкое пение, звон стеклянной тары, спирт в атмосфере 2.8‰"
    },
    isFraud: true,
    reason: "Датчики периметра чисты. Персонал нашел склад технического спирта и устроил пьяный дебош.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_water", { riotRisk: 45, status: "warning" });
      game.logEvent("[ВАША ОШИБКА: ОБМАН]: Пьяные операторы водоочистителя получили патроны и изрешетили свои же баки! Патроны потрачены впустую.");
      game.modifyRating("gos", -10);
    },
    onReject: (game) => {
      game.logEvent("[ВАШ УСПЕХ: ЛОЖЬ РАСКРЫТА]: Вы отказали пьяным операторам Сектора «Омега». Боезапас сохранен.");
      game.checkAchievement("ach_sober");
      game.stats.correctFraudsDetected++;
      game.modifyRating("gos", 5);
    }
  },
  {
    id: "d1_med_spores",
    day: 1,
    wave: 2,
    sectorId: "sec_med",
    sender: "Доктор Петренко (Медпункт)",
    priority: "СРЕДНИЙ",
    topic: "Вспышка спорового поражения среди разведчиков",
    text: "С поверхности доставлено трое разведчиков в тяжелом состоянии. Черный налет на гортани. Необходим 1 Медкомплект со стерильными антибиотиками, иначе начнется отек легких и споры попадут в общую вентиляционную шахту.",
    demandSummary: "Требуется: 1 ед. Медикаментов 💊",
    demandOptions: [{ meds: 1 }],
    req: { fuel: 0, food: 0, meds: 1, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "19°C (Норма)",
      sensorBio: "Биологическая угроза: Уровень 2 (Споры пепла)",
      sensorFilter: "Фильтры карантинного бокса изношены на 85%"
    },
    isFraud: false,
    reason: "Биодатчики подтверждают реальное споровое заражение. Отказ грозит заражением вентиляции.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_med", { sanitation: 80, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Разведчики стабилизированы антибиотиками. Карантин успешно локализован.");
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_med", { deadToday: 3, sanitation: 30, status: "critical" });
      game.updateSector("sec_block", { deadToday: 8, status: "warning" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Без антибиотиков споры просочились в вентиляцию. 11 человек погибли!");
      game.modifyRating("gos", -15);
    }
  },

  // ================= DAY 2 =================
  {
    id: "d2_hydro_cold",
    day: 2,
    wave: 1,
    sectorId: "sec_hydro",
    sender: "Агроном Селиванова (Теплицы)",
    priority: "ВЫСОКИЙ",
    topic: "Угроза вымерзания белковой гидропоники",
    text: "Снаружи ударил радиоактивный мороз! Температура в оранжереях упала до +4°C! Если не дадите 1 Топливную Ячейку на тепловые пушки, вся грибница погибнет за сутки. Завтра весь бункер останется без белковой пасты!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽",
    demandOptions: [{ fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "+3.8°C (Падение на 18 градусов!)",
      sensorPower: "Линия электропередач перегружена",
      sensorBio: "Клетки гидропоники замедлили деление на 75%"
    },
    isFraud: false,
    reason: "Температура действительно падает катастрофически. Без топлива гидропоника замерзнет.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_hydro", { heat: 80, food: 85, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Теплицы согреты, белковая грибница спасена. Бункер будет с пайками.");
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_hydro", { heat: 15, food: 20, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Оранжереи вымерзли! 80% урожая белковой массы погибло.");
      game.modifyRating("gos", -15);
    }
  },
  {
    id: "d2_block_rations",
    day: 2,
    wave: 1,
    sectorId: "sec_block",
    sender: "Комендант Блока Архипов",
    priority: "СРЕДНИЙ",
    topic: "Запрос дополнительного дистиллята для детей",
    text: "В Жилом Блоке №4 растет обезвоживание среди грудных детей и кормящих матерей. Технический конденсат из кранов вызывает судороги. Требуется 1 канистра очищенного дистиллята.",
    demandSummary: "Требуется: 1 ед. Дистиллята 💧",
    demandOptions: [{ water: 1 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 0, water: 1 },
    telemetryFacts: {
      sensorWaterLevel: "Резервуары: 38% (Критический порог)",
      sensorMorale: "Уровень стресса: 72%"
    },
    isFraud: false,
    reason: "Реальная гуманитарная просьба. Чистая вода предотвратит детские смерти.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { water: 80, riotRisk: 15 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Чистая вода распределена по семьям. Мораль жилого сектора спасена.");
      game.modifyRating("family", 5);
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { water: 20, deadToday: 4, riotRisk: 40 });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: 4 ребенка скончались от токсического шока. В бараках растет глухой ропот.");
      game.modifyRating("family", -10);
      game.modifyRating("gos", -10);
    }
  },
  {
    id: "d2_radar_fraud",
    day: 2,
    wave: 2,
    sectorId: "sec_radar",
    sender: "Ефрейтор Кротов (Радиовышка)",
    priority: "ВЫСОКИЙ",
    topic: "Экстренное выделение спирта и медикаментов",
    text: "На вышке тяжелое обморожение дежурного караула! Срочно выделите 1 Медкомплект и концентрированные медицинские спирты, иначе караул замерзнет на наблюдательных вышках!",
    demandSummary: "Требуется: 1 ед. Медикаментов 💊",
    demandOptions: [{ meds: 1 }],
    req: { fuel: 0, food: 0, meds: 1, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "-2°C (Для поверхности это обычная норма)",
      sensorInternal: "Обогреватели кунга работают на полную мощность (+22°C внутри кунга)",
      sensorStatus: "В кунге слышны звуки игры на гармони"
    },
    isFraud: true,
    reason: "Внутри кунга тепло (+22°C). Ефрейтор пытается выманить медицинский спирт под видом обморожения.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ВАША ОШИБКА: ВАС ОБМАНУЛИ]: Медкомплект выпит караулом в качестве выпивки. Дефицитные медикаменты потеряны.");
      game.modifyRating("gos", -10);
    },
    onReject: (game) => {
      game.logEvent("[ВАШ УСПЕХ: ЛОЖЬ РАСКРЫТА]: Вы отказали симулянтам с вышки. Медпак сохранен на складе.");
      game.stats.correctFraudsDetected++;
      game.modifyRating("gos", 5);
    }
  },

  // ================= DAY 3 =================
  {
    id: "d3_radar_raiders",
    day: 3,
    wave: 1,
    sectorId: "sec_radar",
    sender: "Сержант Рябов (Радиовышка)",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ШТУРМ ВЫШКИ «ЗЕНИТ» БАНДОЙ МАРОДЕРОВ!",
    text: "Поверхностный периметр прорван! Банда рейдеров «Ржавые Черепа» прижала караул к скалам! Патроны на исходе, пулеметы замолчали! Выдайте 2 ящика патронов через пневмолюк немедленно!",
    demandSummary: "Требуется: 2 ед. Патронов 🔫",
    demandOptions: [{ ammo: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 2, water: 0 },
    telemetryFacts: {
      sensorMotion: "Периметр: 18 тепловых отметок, стрельба из гладкоствола",
      sensorSeismic: "Взрывы гранат у нижнего капонира",
      sensorAudio: "Интенсивная перестрелка, звуки рикошетов"
    },
    isFraud: false,
    reason: "Радиовышку действительно атакуют мародеры. Без боеприпасов гарнизон погибнет.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_radar", { status: "normal", integrity: 85 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Гарнизон вышки отбросил бандитов! Внешняя радиосвязь спасена.");
      game.modifyRating("gos", 10);
      game.checkAchievement("ach_hope");
    },
    onReject: (game) => {
      game.updateSector("sec_radar", { deadToday: 8, status: "dead", integrity: 10 });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Вышка «Зенит» захвачена и сожжена! 8 бойцов погибли, связь с внешним миром потеряна.");
      game.modifyRating("gos", -25);
    }
  },
  {
    id: "d3_mine_ksr_deal",
    day: 3,
    wave: 1,
    sectorId: "sec_mine",
    sender: "Бригадир Горбунов (по наводке КСР)",
    priority: "ВЫСОКИЙ",
    topic: "Усиленный паек для забойщиков нижнего штрека",
    text: "Диспетчер, забою нужны силы. Парни выбиваются из сил на аварийной проходке. Просим выделить 2 ящика продовольствия для рабочих смен. (Внизу приписка углем: «Лиса просила напомнить о договоре»)",
    demandSummary: "Требуется: 2 ед. Продовольствия 🍞",
    demandOptions: [{ food: 2 }],
    req: { fuel: 0, food: 2, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorLabor: "Выработка: 120% от нормы (Рабочие на пределе сил)",
      sensorCalories: "Средний дефицит калорий: 45%"
    },
    isFraud: false,
    reason: "Запрос рабочих подкреплен договоренностью с подпольем КСР. Помощь им укрепит связь с Лисой.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_mine", { food: 90, riotRisk: 5 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Шахтеры получили горячее питание. Лиса передает благодарность.");
      game.modifyRating("ksr", 15);
      game.modifyRating("gos", 0);
    },
    onReject: (game) => {
      game.updateSector("sec_mine", { food: 35, riotRisk: 40 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО]: Шахтеры голодают. Лиса в ярости от срыва договоренности.");
      game.modifyRating("ksr", -15);
    }
  },

  // ================= DAY 4 =================
  // Dilemma: Ammo OR Water for Outpost Cooling / Defense!
  {
    id: "d4_water_sandstorm_choice",
    day: 4,
    wave: 1,
    sectorId: "sec_water",
    sender: "Главный инженер Мальцев (Водоочиститель)",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ДИЛЕММА СТАНЦИИ: ОХЛАЖДЕНИЕ ТУРБИН ИЛИ ЗАЩИТА ШЛЮЗА",
    text: "Радиоактивная буря забила песком радиаторы! Турбины перегреваются, и одновременно к водозаборному шлюзу стягиваются одичавшие псы пустоши. Нам требуется ЛИБО 2 канистры Дистиллята для экстренной промывки контуров, ЛИБО 2 ящика Патронов для автоматических турелей шлюза! Назначьте выдачу на ваше усмотрение!",
    demandSummary: "Требуется: 2 ед. Дистиллята 💧 ИЛИ 2 ед. Патронов 🔫",
    demandOptions: [{ water: 2 }, { ammo: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 0, water: 2 },
    telemetryFacts: {
      sensorTurbineTemp: "88°C (Предел прочности: 95°C)",
      sensorPerimeter: "12 крупных хищников у внешних створок гидрозатвора",
      sensorPressure: "Давление в насосах падает"
    },
    isFraud: false,
    reason: "Оба варианта жизнеспособны: вода спасет турбины от гидроудара, а патроны уничтожат псов до того, как они порвут гидроизоляцию.",
    onFulfill: (game, deliv) => {
      if (deliv.water >= 2) {
        game.updateSector("sec_water", { water: 90, heat: 70, status: "normal" });
        game.logEvent("[ВАШЕ РЕШЕНИЕ: ВЫДАН ДИСТИЛЛЯТ]: Турбины промыты и спасены! Охрана отогнала псов остатками пара.");
      } else if (deliv.ammo >= 2) {
        game.updateSector("sec_water", { riotRisk: 10, status: "normal" });
        game.logEvent("[ВАШЕ РЕШЕНИЕ: ВЫДАНЫ ПАТРОНЫ]: Турели перебили мутантов на подходах. Турбины выдержали нагрузку.");
      } else {
        game.updateSector("sec_water", { water: 75 });
        game.logEvent("[ВАШЕ РЕШЕНИЕ: КОМБИНИРОВАННАЯ ПОСТАВКА]: Груз доставлен на станцию очистки.");
      }
      game.modifyRating("gos", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_water", { water: 20, deadToday: 6, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Турбины сгорели, а псы прорвали защитную пленку! 6 рабочих растерзаны.");
      game.modifyRating("gos", -20);
    }
  },
  {
    id: "d4_block_fever",
    day: 4,
    wave: 2,
    sectorId: "sec_block",
    sender: "Врач-терапевт Сомова (Жилой Блок №4)",
    priority: "ВЫСОКИЙ",
    topic: "Вспышка легочной лихорадки в семейном секторе",
    text: "В бараках массовый кашель и жар среди детей и женщин. Необходим 1 Медкомплект для приготовления жаропонижающих капельниц, иначе зараза перекинется на рабочие бригады.",
    demandSummary: "Требуется: 1 ед. Медикаментов 💊",
    demandOptions: [{ meds: 1 }],
    req: { fuel: 0, food: 0, meds: 1, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "21°C",
      sensorBio: "Бактериальная нагрузка воздуха: Повышена на 40%",
      sensorCasualties: "Заболело свыше 30 человек"
    },
    isFraud: false,
    reason: "Реальная угроза эпидемии в жилом блоке. Медпак снимет остроту кризиса.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { sanitation: 80 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Капельницы поставлены. Лихорадка в жилом секторе отступает.");
      game.modifyRating("family", 10);
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { deadToday: 7, sanitation: 30, riotRisk: 50 });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: 7 жителей скончались. В блоке назревает бунт.");
      game.modifyRating("family", -15);
      game.modifyRating("gos", -15);
    }
  },

  // ================= DAY 5 =================
  {
    id: "d5_refugees_gate",
    day: 5,
    wave: 1,
    sectorId: "sec_block",
    sender: "Начальник Внешнего Шлюза капитан Баранов",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ТОЛПА БЕЖЕНЦЕВ С ВНЕШНИХ ПОСТОВ У ШЛЮЗА №2",
    text: "К шлюзу вышло 25 беженцев с разрушенного рудника «Северный». Они обморожены, голодны, требуют впустить их в бункер. Чтобы принять и расселить их, требуется 1 паек Продовольствия и 1 канистра Воды. Либо мы открываем огонь на поражение!",
    demandSummary: "Требуется: 1 ед. Продовольствия 🍞 и 1 ед. Дистиллята 💧",
    demandOptions: [{ food: 1, water: 1 }],
    req: { fuel: 0, food: 1, meds: 0, ammo: 0, water: 1 },
    telemetryFacts: {
      sensorBio: "25 человек, следы радиоактивной пыли на одежде смыты снегом",
      sensorRadiation: "Фон беженцев: 28 мкЗв (Безопасно после дезактивации)"
    },
    isFraud: false,
    reason: "Беженцы не несут биологической угрозы и могут стать ценной рабочей силой.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { population: 225, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Беженцы приняты, накормлены и расселены. Рабочий фонд бункера пополнен!");
      game.modifyRating("gos", 10);
      game.modifyRating("ksr", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { deadToday: 18, riotRisk: 60 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО]: Охрана открыла огонь по безоружным беженцам. 18 человек погибли у шлюза. Бункер потрясен жестокостью.");
      game.modifyRating("gos", -10);
      game.modifyRating("ksr", -20);
    }
  },
  {
    id: "d5_ksr_armory_heist",
    day: 5,
    wave: 2,
    sectorId: "sec_mine",
    sender: "Подпольная ячейка КСР",
    priority: "СРОЧНО",
    topic: "ТАЙНЫЙ ПЕРЕХВАТ: ПАТРОНЫ ДЛЯ ОТРЯДА САМООБОРОНЫ",
    text: "Волков, это снова Лиса. Охранка готовит облаву на активистов в шахтерском клубе. Выдели нам под видом служебной заявки 1 ящик Патронов. Мы спрячем их в отработанном штреке. Не подведи нас.",
    demandSummary: "Требуется: 1 ед. Патронов 🔫 (Нелегально)",
    demandOptions: [{ ammo: 1 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 1, water: 0 },
    telemetryFacts: {
      sensorStatus: "Внештатный радиоканал на волне 94.4 FM",
      sensorSecurity: "Патрули СБ выдвинулись на 7-й горизонт"
    },
    isFraud: false,
    reason: "Прямая просьба революционеров. Помощь укрепит позиции КСР, но несет риск расследования СБ.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ПАТРОНЫ ПЕРЕДАНЫ КСР]: Подпольщики вооружились и сорвали облаву карателей СБ.");
      game.modifyRating("ksr", 25);
      game.modifyRating("gos", -10);
    },
    onReject: (game) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО КСР]: Вы отказали подпольщикам. Патруль СБ арестовал трех рабочих.");
      game.modifyRating("ksr", -20);
      game.modifyRating("gos", 10);
    }
  },

  // ================= DAY 6 =================
  {
    id: "d6_reactor_surge",
    day: 6,
    wave: 1,
    sectorId: "sec_mine",
    sender: "Главный энергетик Воропаев",
    priority: "КРИТИЧЕСКИЙ",
    topic: "УГРОЗА ТЕПЛОВОГО ВЗРЫВА ГЕОТЕРМАЛЬНОГО КОТЛА!",
    text: "В котле закипел вторичный контур! Давление пара 140 атмосфер! Если не подадим 2 канистры Дистиллята для экстренного контурного охлаждения, котлы разнесет в клочья, и треть бункера сварится заживо!",
    demandSummary: "Требуется: 2 ед. Дистиллята 💧",
    demandOptions: [{ water: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 0, water: 2 },
    telemetryFacts: {
      sensorSteamPressure: "138 атм (Красный сектор!)",
      sensorBoilerTemp: "310°C (Критический перегрев)",
      sensorSeismic: "Дрожь фундаментов машинного зала"
    },
    isFraud: false,
    reason: "Абсолютно реальная угроза масштабного теплового взрыва. Требуется охлаждение.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_mine", { heat: 80, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Котлы залиты охладителем, давление упало до нормы. Бункер спасен от взрыва!");
      game.modifyRating("gos", 15);
    },
    onReject: (game) => {
      game.updateSector("sec_mine", { deadToday: 26, heat: 10, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Взрыв котла! 26 инженеров и рабочих погибли в потоках пара!");
      game.modifyRating("gos", -30);
    }
  },
  {
    id: "d6_fake_med_heist",
    day: 6,
    wave: 2,
    sectorId: "sec_med",
    sender: "Завскладом медпункта Козлов",
    priority: "СРОЧНО",
    topic: "Запрос на экстренное списание 2 медкомплектов",
    text: "В госпитале внезапная порча сывороток из-за замыкания холодильника. Срочно выделите 2 Медкомплекта на замену, иначе больные останутся без антисептиков!",
    demandSummary: "Требуется: 2 ед. Медикаментов 💊",
    demandOptions: [{ meds: 2 }],
    req: { fuel: 0, food: 0, meds: 2, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorTemp: "Холодильники санчасти: +3°C (Идеальная норма)",
      sensorPower: "Линия холодильников: 100% стабильности без единого сбоя",
      sensorNotes: "Козлов вчера проигрался в карты теневым скупщикам"
    },
    isFraud: true,
    reason: "Холодильники исправны. Завскладом пытается украсть 2 медпака для покрытия карточного долга.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ВАША ОШИБКА: ВАС ОБОКРАЛИ]: Завскладом сбыл медкомплекты спекулянтам и сбежал. Резерв потрачен впустую.");
      game.modifyRating("gos", -15);
    },
    onReject: (game) => {
      game.logEvent("[ВАШ УСПЕХ: ВОРОВСТВО ПРЕСЕЧЕНО]: Вы разоблачили махинацию Козлова. Завскладом задержан комендатурой.");
      game.stats.correctFraudsDetected++;
      game.modifyRating("gos", 10);
    }
  },

  // ================= DAY 7 =================
  {
    id: "d7_hydro_fungal_blight",
    day: 7,
    wave: 1,
    sectorId: "sec_hydro",
    sender: "Агроном Селиванова (Теплицы)",
    priority: "ВЫСОКИЙ",
    topic: "Эпидемия черной плесени в секторе гидропоники",
    text: "Споры серой гнили охватили 5-й ярус теплиц. Биомасса превращается в зловонную слизь. Чтобы спасти оставшиеся лотки, требуется 1 Медкомплект для синтеза фунгицида и 1 Топливная Ячейка для термической стерилизации.",
    demandSummary: "Требуется: 1 ед. Медикаментов 💊 и 1 ед. Топлива ⛽",
    demandOptions: [{ meds: 1, fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 1, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorBio: "Заражение лотков: 48% и быстро распространяется",
      sensorO2: "Выработка кислорода падает на 22%"
    },
    isFraud: false,
    reason: "Реальное биологическое поражение гидропоники. Без лекарств и прогрева урожай погибнет.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_hydro", { food: 85, sanitation: 80, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Фунгицид применен, лотки прокалены термитом. Грибница спасена.");
      game.modifyRating("gos", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_hydro", { food: 15, sanitation: 25, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Плесень уничтожила теплицы. Бункер на пороге голодной катастрофы.");
      game.modifyRating("gos", -25);
    }
  },
  {
    id: "d7_mine_cave_in",
    day: 7,
    wave: 2,
    sectorId: "sec_mine",
    sender: "Мастер смены (где работает сын Миша)",
    priority: "СРОЧНО",
    topic: "ОБВАЛ В ШТРЕКЕ №3! УГРОЗА ЖИЗНЯМ ПОДРОСТКОВ!",
    text: "Диспетчер Волков! Плита кровли обрушилась на транспортный путь! Трое откатчиков заблокированы в кармане, среди них ваш сын Миша! Воздуха на 2 часа! Срочно вышлите 1 Топливную Ячейку для запуска гидродомкратов спасателей!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽",
    demandOptions: [{ fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorSeismic: "Локальный обвал горизонта 7-Б",
      sensorOxygen: "В завале кислород падает: 14%",
      sensorPulse: "Фиксация сердцебиения трех выживших"
    },
    isFraud: false,
    reason: "Жизнь вашего сына Миши висит на волоске. Без энергии домкраты не поднимут плиту.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_mine", { status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Домкраты подняли плиту! Миша и его товарищи спасены целыми и невредимыми!");
      game.modifyRating("family", 25);
      game.modifyRating("gos", 5);
    },
    onReject: (game) => {
      game.updateSector("sec_mine", { deadToday: 3, status: "warning" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО]: Спасатели не успели пробиться вручную. Ваш сын Миша задохнулся под завалом...");
      game.modifyRating("family", -80);
      game.modifyRating("gos", -10);
    }
  },

  // ================= DAY 8 =================
  {
    id: "d8_reservoir_crack",
    day: 8,
    wave: 1,
    sectorId: "sec_water",
    sender: "Бригада бетонщиков водоочистителя",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ГЛУБИННАЯ ТРЕЩИНА В ГЛАВНОМ РЕЗЕРВУАРЕ ВОДЫ!",
    text: "После подземного толчка треснуло дно 3-го резервуара! Вода хлещет в дренаж со скоростью 500 литров в минуту! Чтобы запустить аварийные пневмонасосы обратной откачки, требуется 2 Топливные Ячейки!",
    demandSummary: "Требуется: 2 ед. Топлива ⛽",
    demandOptions: [{ fuel: 2 }],
    req: { fuel: 2, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorFlowRate: "Утечка: 480 л/мин",
      sensorPressure: "Резкое падение давления в гидросети",
      sensorCrackSensor: "Датчик деформации бетона: Превышение порога"
    },
    isFraud: false,
    reason: "Утечка воды реальна и приведет к высыханию всего комплекса за двое суток.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_water", { water: 85, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Насосы откачали воду, трещина загерметизирована. Запас воды сохранен.");
      game.modifyRating("gos", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_water", { water: 15, deadToday: 8, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Половина запаса чистой воды ушла в породу. Бункер переведен на 200 грамм в день.");
      game.modifyRating("gos", -25);
    }
  },
  {
    id: "d8_block_rebel_protest",
    day: 8,
    wave: 2,
    sectorId: "sec_block",
    sender: "Комендант Архипов",
    priority: "ВЫСОКИЙ",
    topic: "Запрос патронов для разгона недовольных жителей",
    text: "Толпа рабочих окружила комендатуру Блока №4, требуя хлеба и нормального отопления. Дайте 2 ящика Патронов для караула, мы сделаем предупредительные залпы и восстановим порядок!",
    demandSummary: "Требуется: 2 ед. Патронов 🔫",
    demandOptions: [{ ammo: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 2, water: 0 },
    telemetryFacts: {
      sensorCrowd: "Около 80 человек, безоружные женщины и рабочие",
      sensorThreat: "Оружия в толпе нет, только плакаты и крики"
    },
    isFraud: false,
    reason: "Жестокое подавление вызовет взрыв ненависти и снизит рейтинг семьи Волкова, живущей в этом же блоке.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { deadToday: 12, riotRisk: 80, status: "warning" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ВЫДАНЫ ПАТРОНЫ]: Охрана открыла огонь по толпе. 12 жителей убито. Ваша жена Елена в шоке от вашей жестокости.");
      game.modifyRating("family", -25);
      game.modifyRating("gos", 5);
      game.modifyRating("ksr", -30);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { riotRisk: 30 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО В ПАТРОНАХ]: Коменданту пришлось пойти на переговоры. Кровопролития удалось избежать.");
      game.modifyRating("family", 10);
      game.modifyRating("ksr", 15);
    }
  },

  // ================= DAY 9 =================
  {
    id: "d9_mine_geothermal_tap",
    day: 9,
    wave: 1,
    sectorId: "sec_mine",
    sender: "Инженер-буровик Тарасов",
    priority: "ВЫСОКИЙ",
    topic: "Подключение новой геотермальной жилы",
    text: "Мы добурились до высокотемпературного пласта! Если выделите 1 Топливную Ячейку на забойный турбобур и 1 ящик Патронов для зачистки подземной каверны от пещерных тварей, бункер получит колоссальный приток тепла!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽ и 1 ед. Патронов 🔫",
    demandOptions: [{ fuel: 1, ammo: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 1, water: 0 },
    telemetryFacts: {
      sensorTempCore: "240°C (Отличный потенциал тепла)",
      sensorBioAcoustic: "Шорохи пещерных мутантов в пустотах"
    },
    isFraud: false,
    reason: "Реальная инженерная возможность резко поднять теплоснабжение комплекса.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_mine", { heat: 95, status: "normal" });
      game.updateSector("sec_block", { heat: 90 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Новая жила подключена! На всех ярусах бункера потеплело до +22°C!");
      game.modifyRating("gos", 15);
    },
    onReject: (game) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО]: Бурение остановлено. Бункер продолжает мерзнуть на старых мощностях.");
      game.modifyRating("gos", -5);
    }
  },
  {
    id: "d9_ksr_sabotage_fake",
    day: 9,
    wave: 2,
    sectorId: "sec_radar",
    sender: "Неизвестный оператор радиостанции",
    priority: "СРОЧНО",
    topic: "Запрос на отправку 2 канистр дистиллята на внешнюю площадку",
    text: "Срочно перешлите 2 канистры Дистиллята в наружный шлюз вышки для «охлаждения антенных фидеров». Лично по приказу Госплана.",
    demandSummary: "Требуется: 2 ед. Дистиллята 💧",
    demandOptions: [{ water: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 0, water: 2 },
    telemetryFacts: {
      sensorAudio: "Голос синтезирован или искажен через шифратор",
      sensorCommand: "В журнале приказов Госплана такой директивы нет",
      sensorOutpost: "Антенные фидеры не требуют жидкостного охлаждения"
    },
    isFraud: true,
    reason: "Это ловушка рейдеров, перехвативших сигнал и пытающихся выманить воду наружу.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ВАША ОШИБКА: ЛОВУШКА]: Вода ушла мародерам пустоши! Вы поверили поддельной директиве.");
      game.modifyRating("gos", -15);
    },
    onReject: (game) => {
      game.logEvent("[ВАШ УСПЕХ: ОБМАН РАСКРЫТ]: Вы разоблачили радиоперехват рейдеров. Вода осталась в хранилище.");
      game.stats.correctFraudsDetected++;
      game.modifyRating("gos", 10);
    }
  },

  // ================= DAY 10 =================
  {
    id: "d10_frost_blizzard",
    day: 10,
    wave: 1,
    sectorId: "sec_block",
    sender: "Комендатура Жилого Блока",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ПОЛЯРНЫЙ БУРАН -62°C: ПРОМЕРЗАНИЕ ВНЕШНЕЙ СТЕНЫ!",
    text: "На поверхности свирепствует ледяной ад! Бетонные плиты трещат от холода! В жилых отсеках температура упала до нуля, стены покрылись инеем! Требуется 2 Топливные Ячейки на включение аварийных тепловых экранов!",
    demandSummary: "Требуется: 2 ед. Топлива ⛽",
    demandOptions: [{ fuel: 2 }],
    req: { fuel: 2, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorOutdoorTemp: "-62.4°C",
      sensorWallTemp: "-4°C (Промерзание несущих конструкций)",
      sensorHypothermia: "Угроза для 200 жителей бараков"
    },
    isFraud: false,
    reason: "Абсолютно критическая угроза вымерзания жилого фонда. Без тепла погибнут десятки людей.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { heat: 85, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Тепловые экраны активированы! В жилых блоках +19°C. Люди спасены от холодной смерти.");
      game.modifyRating("family", 15);
      game.modifyRating("gos", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { heat: 10, deadToday: 21, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Страшный мороз сковал бараки. 21 житель замерз насмерть во сне.");
      game.modifyRating("family", -30);
      game.modifyRating("gos", -25);
    }
  },
  {
    id: "d10_med_freeze",
    day: 10,
    wave: 2,
    sectorId: "sec_med",
    sender: "Доктор Петренко",
    priority: "ВЫСОКИЙ",
    topic: "Угроза порчи донорской крови и вакцин",
    text: "Из-за мороза перемерзла теплотрасса санчасти. Если не выделите 1 Топливную Ячейку для локального калорифера, запасы донорской плазмы замерзнут и лопнут в колбах!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽",
    demandOptions: [{ fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorMedTemp: "+1.2°C (Опасность замерзания ампул)",
      sensorSerumStatus: "Кристаллизация начнется через 40 минут"
    },
    isFraud: false,
    reason: "Реальная угроза уничтожения всего стратегического запаса крови.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_med", { heat: 75, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Калорифер запущен, донорская плазма сохранена.");
      game.modifyRating("gos", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_med", { sanitation: 20, status: "warning" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Все ампулы перемерзли и лопнули. Санчасть осталась без препаратов.");
      game.modifyRating("gos", -20);
    }
  },

  // ================= DAY 11 =================
  {
    id: "d11_mutiny_armory",
    day: 11,
    wave: 1,
    sectorId: "sec_block",
    sender: "Майор Соколов (СБ)",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ВООРУЖЕННЫЙ БУНТ НА 11-М ГОРИЗОНТЕ!",
    text: "Бунтовщики из числа отчаявшихся шахтеров взломали малый арсенал и заняли шлюзовой вестибюль! Они требуют отставки Комендатуры и раздела госрезервов! Выделите спецназу СБ 2 ящика Патронов для штурма и ликвидации мятежников!",
    demandSummary: "Требуется: 2 ед. Патронов 🔫",
    demandOptions: [{ ammo: 2 }],
    req: { fuel: 0, food: 0, meds: 0, ammo: 2, water: 0 },
    telemetryFacts: {
      sensorGunfire: "Одиночные выстрелы в коридорах",
      sensorHostages: "В вестибюле заблокированы гражданские",
      sensorRebelStrength: "Около 30 восставших с охотничьими ружьями"
    },
    isFraud: false,
    reason: "Острая политическая дилемма: помочь карателям СБ утопить бунт в крови или отказать и дать мятежникам шанс.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { deadToday: 19, riotRisk: 20, status: "warning" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ШТУРМ ОДОБРЕН]: Спецназ СБ расстрелял восставших. 19 человек убито. Бунт подавлен.");
      game.modifyRating("gos", 20);
      game.modifyRating("ksr", -40);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { riotRisk: 75, status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО СБ]: Спецназ не решился на штурм без боеприпасов. Мятежники закрепились в вестибюле.");
      game.modifyRating("gos", -30);
      game.modifyRating("ksr", 35);
    }
  },
  {
    id: "d11_food_relief",
    day: 11,
    wave: 2,
    sectorId: "sec_block",
    sender: "Инициативная группа рабочих",
    priority: "СРЕДНИЙ",
    topic: "Мирная раздача продовольствия вместо пулеметов",
    text: "Диспетчер, люди бунтуют не от злобы, а от пустого желудка! Если выдадите в бараки 2 ящика Продовольствия — накал спадет сам собой без единого выстрела!",
    demandSummary: "Требуется: 2 ед. Продовольствия 🍞",
    demandOptions: [{ food: 2 }],
    req: { fuel: 0, food: 2, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorMorale: "Критическое истощение населения",
      sensorCalorieSupply: "Запасы продовольствия в блоке на нуле"
    },
    isFraud: false,
    reason: "Гуманный способ погасить мятеж сытостью вместо пуль.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { food: 90, riotRisk: 10 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ПРОДОВОЛЬСТВИЕ ВЫДАНО]: Накормленные люди разошлись по домам. Мир восстановлен.");
      game.modifyRating("family", 15);
      game.modifyRating("ksr", 15);
    },
    onReject: (game) => {
      game.updateSector("sec_block", { riotRisk: 90 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: В ЕДЕ ОТКАЗАНО]: Голодные жители продолжили строить баррикады.");
      game.modifyRating("family", -10);
      game.modifyRating("ksr", -10);
    }
  },

  // ================= DAY 12 =================
  {
    id: "d12_radar_ark_signal",
    day: 12,
    wave: 1,
    sectorId: "sec_radar",
    sender: "Сержант Рябов (Радиовышка)",
    priority: "КРИТИЧЕСКИЙ",
    topic: "СИГНАЛ ПРИБЛИЖЕНИЯ БРОНЕПОЕЗДА «КОВЧЕГ»!",
    text: "Диспетчер! Мы поймали несущую частоту эвакуационного эшелона «Ковчег»! Они в 80 километрах! Но из-за обледенения ретранслятора сигнал плавает. Требуется 1 Топливная Ячейка на обогрев антенного зеркала и 1 канистра Дистиллята для контура передатчика!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽ и 1 ед. Дистиллята 💧",
    demandOptions: [{ fuel: 1, water: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 1 },
    telemetryFacts: {
      sensorRadioSignal: "Закодированный военный маяк 'КОВЧЕГ-01'",
      sensorAntennaIce: "Толщина льда на рефлекторе: 12 см"
    },
    isFraud: false,
    reason: "Решающий момент кампании: наведение поезда определит спасение бункера.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_radar", { status: "normal", integrity: 100 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОДОБРЕНО]: Антенна прогрета, радиомаяк наведения захватил состав «Ковчег»!");
      game.modifyRating("gos", 15);
      game.flags.arkGuided = true;
    },
    onReject: (game) => {
      game.updateSector("sec_radar", { status: "dead", integrity: 15 });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: Антенна рухнула под тяжестью льда. Сигнал поезда потерян в шумах.");
      game.modifyRating("gos", -30);
      game.flags.arkGuided = false;
    }
  },
  {
    id: "d12_ksr_station_switch",
    day: 12,
    wave: 2,
    sectorId: "sec_mine",
    sender: "Лиса (КСР)",
    priority: "СРОЧНО",
    topic: "Подготовка наружной стрелки для революционного захвата",
    text: "Волков! «Ковчег» приближается. Чтобы поезд въехал не на перрон номенклатуры, а к рабочим шлюзам, нам нужно подать напряжение на 4-ю стрелку. Выдели 1 Топливную Ячейку по нашему каналу. Мы спасем людей, а не золото генералов!",
    demandSummary: "Требуется: 1 ед. Топлива ⛽ (Повстанцам)",
    demandOptions: [{ fuel: 1 }],
    req: { fuel: 1, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorRailway: "Стрелочный перевод №4 обесточен",
      sensorSwitchMechanics: "Готов к переводу на рабочий сектор"
    },
    isFraud: false,
    reason: "Ключевое решение в пользу плана революционеров.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ТОПЛИВО ВЫДАНО КСР]: Стрелка запитана! Поезд будет перенаправлен к рабочим шлюзам.");
      game.modifyRating("ksr", 30);
      game.modifyRating("gos", -20);
      game.flags.ksrTrainTrackReady = true;
    },
    onReject: (game) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО КСР]: Вы отказали революционерам. Стрелка осталась на правительственный перрон.");
      game.modifyRating("ksr", -25);
      game.modifyRating("gos", 15);
    }
  },

  // ================= DAY 13 =================
  {
    id: "d13_gos_lockdown",
    day: 13,
    wave: 1,
    sectorId: "sec_block",
    sender: "Комендант Архипов (по приказу Каверина)",
    priority: "КРИТИЧЕСКИЙ",
    topic: "ЗАПЕЧАТЫВАНИЕ ВНУТРЕННИХ ПЕРЕХОДОВ ПЕРЕД ЭВАКУАЦИЕЙ",
    text: "Диспетчер Волков! Согласно директиве генерала Каверина, все переходы между жилыми блоками и центральным вокзалом должны быть заблокированы стальными гермозатворами. Чтобы подать гидравлику на замки, требуется 2 Топливные Ячейки. Жители останутся заперты во избежание давки.",
    demandSummary: "Требуется: 2 ед. Топлива ⛽ (Блокировка гражданских)",
    demandOptions: [{ fuel: 2 }],
    req: { fuel: 2, food: 0, meds: 0, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorDoorHydraulics: "Затворы герметизации готовы к закрытию",
      sensorBlockPop: "В жилых бараках находится свыше 200 человек вашей семьи и соседей"
    },
    isFraud: false,
    reason: "Выполнение приказа обречет вашу семью и всех граждан на гибель взаперти.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_block", { status: "critical", riotRisk: 100 });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ГЕРМОЗАТВОРЫ ЗАПЕРТЫ]: Бараки наглухо запечатаны! Ваша семья отрезана от спасения.");
      game.modifyRating("gos", 30);
      game.modifyRating("family", -60);
      game.modifyRating("ksr", -50);
      game.flags.blocksSealed = true;
    },
    onReject: (game) => {
      game.logEvent("[ВАШЕ РЕШЕНИЕ: ОТКАЗАНО ГОСПЛАНУ]: Вы оставили гермошлюзы открытыми! У жителей и вашей семьи есть путь к составу.");
      game.modifyRating("gos", -40);
      game.modifyRating("family", 25);
      game.modifyRating("ksr", 25);
      game.flags.blocksSealed = false;
    }
  },
  {
    id: "d13_med_evac_prep",
    day: 13,
    wave: 2,
    sectorId: "sec_med",
    sender: "Доктор Петренко",
    priority: "ВЫСОКИЙ",
    topic: "Подготовка тяжелораненых к погрузке в санитарный вагон",
    text: "В лазарете 15 тяжелых пациентов, перенесших споровое поражение и ожоги. Чтобы они перенесли подъем на перрон, требуется 2 Медкомплекта обезболивающего и стимуляторов.",
    demandSummary: "Требуется: 2 ед. Медикаментов 💊",
    demandOptions: [{ meds: 2 }],
    req: { fuel: 0, food: 0, meds: 2, ammo: 0, water: 0 },
    telemetryFacts: {
      sensorPatients: "15 человек на аппаратах ИВЛ",
      sensorStatus: "Без стимуляторов транспортировка невозможна"
    },
    isFraud: false,
    reason: "Спасение жизней раненых перед прибытием поезда.",
    onFulfill: (game, deliv) => {
      game.updateSector("sec_med", { status: "normal" });
      game.logEvent("[ВАШЕ РЕШЕНИЕ: МЕДПАКИ ВЫДАНЫ]: Раненые стабилизированы и готовы к погрузке в поезд.");
      game.modifyRating("gos", 10);
      game.modifyRating("ksr", 10);
    },
    onReject: (game) => {
      game.updateSector("sec_med", { deadToday: 15, status: "critical" });
      game.logEvent("[ВАША ОШИБКА: ОТКАЗАНО]: 15 пациентов скончались от болевого шока при транспортировке.");
      game.modifyRating("gos", -20);
    }
  },

  // ================= DAY 14 (GRAND CLIMAX) =================
  {
    id: "d14_train_arrival_final",
    day: 14,
    wave: 1,
    sectorId: "sec_block",
    sender: "ГЛАВНЫЙ СТЫКОВОЧНЫЙ ТЕРМИНАЛ «КОВЧЕГА»",
    priority: "ФИНАЛЬНЫЙ",
    topic: "ПРИБЫТИЕ ЭВАКОПОЕЗДА: ФИНАЛЬНОЕ РАСПРЕДЕЛЕНИЕ ЭНЕРГИИ!",
    text: "Внимание диспетчерской смены! Тяжелый бронепоезд «Ковчег» вошел в шлюзовой портал бункера! Состав требует 2 Топливные Ячейки для прогрева паровых турбин разгона и 2 канистры Дистиллята для котлов загородного марша! Без этого поезд не тронется с места!",
    demandSummary: "Требуется: 2 ед. Топлива ⛽ и 2 ед. Дистиллята 💧",
    demandOptions: [{ fuel: 2, water: 2 }],
    req: { fuel: 2, food: 0, meds: 0, ammo: 0, water: 2 },
    telemetryFacts: {
      sensorTrainMass: "Бронесостав 18 вагонов, титановая броня",
      sensorTurbineReadiness: "Требуется теплоноситель для старта"
    },
    isFraud: false,
    reason: "Финальная задача: запустить бронепоезд и решить, кто займет в нем места.",
    onFulfill: (game, deliv) => {
      game.logEvent("[ФИНАЛЬНОЕ РЕШЕНИЕ: БРОНЕПОЕЗД ЗАПИТАН]: Турбины «Ковчега» взревели на полную мощность! Состав готов к отправке!");
      game.flags.trainFueled = true;
    },
    onReject: (game) => {
      game.logEvent("[ФИНАЛЬНОЕ РЕШЕНИЕ: В ЭНЕРГИИ ОТКАЗАНО]: «Ковчег» остался стоять на рельсах холодным стальным гробом...");
      game.flags.trainFueled = false;
    }
  }
];



// Morning Gazette Database for 14 Days
const GAZETTE_DATABASE = {
  day2: {
    number: "№ 4,112",
    date: "15 ноября 1998 г.",
    good: {
      headline: "ШАХТА «ГЛУБОКАЯ-7» СПАСЕНА ОТ ЗАТОПЛЕНИЯ!",
      subhead: "Своевременная подача энергоячейки предотвратила прорыв раскаленного шлама",
      text: "Благодаря оперативным действиям Диспетчерской смены №5, аварийные насосы 7-й штольни запущены на полную мощность. 80 забойщиков продолжают добычу тепла для всего бункера. Начальник ОК объявил благодарность диспетчеру Волкову А.И."
    },
    bad: {
      headline: "ТРАГЕДИЯ В ШТОЛЬНЕ: 14 ГОРНЯКОВ ЗАМУРОВАНЫ!",
      subhead: "Отказ в выделении резервного топлива привел к прорыву шлама",
      text: "Вчерашняя смена ознаменовалась тяжелейшей катастрофой. Вентиляционный ствол Шахты отрезан потоками горячей жижи. Спасательные работы признаны нецелесообразными. Трибунал начал служебную проверку действий дежурного оператора."
    }
  },
  day3: {
    number: "№ 4,113",
    date: "16 ноября 1998 г.",
    good: {
      headline: "РЕЙДЕРЫ РАЗБИТЫ НА ПОДСТУПАХ К ВЫШКЕ «ЗЕНИТ»!",
      subhead: "Гарнизон сержанта Рябова отбросил банду «Ржавых Черепов»",
      text: "Получив дополнительный боекомплект, бойцы внешнего контура открыли прицельный огонь из крупнокалиберных пулеметов. Нападавшие рассеяны по шлаковым отвалам. Дальняя радиосвязь функционирует в штатном режиме."
    },
    bad: {
      headline: "ВЫШКА «ЗЕНИТ» МОЛЧИТ: ГАРНИЗОН ПОГИБ",
      subhead: "Мародеры пустоши захватили и сожгли верхний наблюдательный пункт",
      text: "Черный день для службы безопасности бункера. Из-за отсутствия патронов бойцы вели рукопашный бой до последнего дыхания. Антенное поле разрушено. Комплекс потерял глаза и уши на поверхности."
    }
  },
  day4: {
    number: "№ 4,114",
    date: "17 ноября 1998 г.",
    good: {
      headline: "ВОДООЧИСТИТЕЛЬ ВЫДЕРЖАЛ УДАР ПЫЛЕВОЙ БУРИ!",
      subhead: "Продувка фильтров позволила сохранить подачу питьевой воды в жилые сектора",
      text: "Инженерные службы рапортуют о полной победе над песчаной стихией. Давление в центральной магистрали вернулось к рабочим параметрам. Норма выдачи воды сохранена на уровне 1.5 литра в сутки."
    },
    bad: {
      headline: "БУРЯ СОЖГЛА НАСОСЫ: БУНКЕР ПЕРЕВЕДЕН НА СУХОЙ ПАЕК",
      subhead: "В фильтрах оплавился песок, распределительные трубы забиты шлаком",
      text: "Насосная станция вышла из строя. Жители нижних горизонтов стоят в километровых очередях за техническим конденсатом. Комендатура предупреждает о жестких мерах против паникеров."
    }
  },
  day5: {
    number: "№ 4,115",
    date: "18 ноября 1998 г.",
    good: {
      headline: "ГУМАНИТАРНЫЙ ПРИЕМ: БУНКЕР ПРИНЯЛ 25 БЕЖЕНЦЕВ",
      subhead: "Прибывшие с внешних постов специалисты уже распределены на участки",
      text: "Благодаря хладнокровию руководства удалось избежать беспорядков у шлюза. Людям оказана медицинская помощь, выданы пайки. Рабочий фонд пополнился квалифицированными монтажниками и медиками."
    },
    bad: {
      headline: "КРОВОПРОЛИТИЕ У ШЛЮЗА: 28 ПОГИБШИХ В ДАВКЕ",
      subhead: "Попытка штурма входного контура пресечена огнем охраны",
      text: "Отчаявшиеся беженцы попытались взять штурмом внешние створки. Комендант Архипов отдал приказ на поражение. В жилом секторе объявлен комендантский час, выходы на ярусы перекрыты автоматчиками."
    }
  },
  day6: {
    number: "№ 4,116",
    date: "19 ноября 1998 г.",
    good: {
      headline: "ГЕОТЕРМАЛЬНЫЙ РЕАКТОР СТАБИЛИЗИРОВАН!",
      subhead: "Экстренное охлаждение спасло бункер от теплового взрыва",
      text: "Главный энергетик Воропаев подтвердил снижение температуры активной зоны до безопасных параметров. Угроза испарения комплекса миновала. Энергетическая сеть работает устойчиво."
    },
    bad: {
      headline: "ВЗРЫВ В ЭНЕРГОБЛОКЕ: НИЖНИЕ ЯРУСЫ ЗАТОПЛЕНЫ ПАРОМ",
      subhead: "60 специалистов погибли на месте аварии, радиационный фон растет",
      text: "Катастрофическая авария в машинном зале. Сорваны предохранительные клапаны реактора. Сектор Шахты отрезан от систем жизнеобеспечения. Населению предписано оставаться в защитных масках."
    }
  },
  day7: {
    number: "№ 4,117",
    date: "20 ноября 1998 г.",
    good: {
      headline: "ЭПИДЕМИЯ СЕРОЙ ГНИЛИ ПОЛНОСТЬЮ ЛОКАЛИЗОВАНА!",
      subhead: "Доктор Петренко рапортует об успешном применении лечебной сыворотки",
      text: "Госпиталь возвращается к нормальному графику работы. Все тяжелые больные пошли на поправку. Проект «Ковчег-Омега» доказал свою жизнеспособность в сложнейших испытаниях ядерной зимы."
    },
    bad: {
      headline: "САНЧАСТЬ ЗАПЕЧАТАНА ГАЗОМ: ВЫЖИВШИХ НЕТ",
      subhead: "Врачам не удалось остановить легочную инфекцию",
      text: "Приказом Комендатуры гермошлюзы центрального лазарета заварены намертво. Все находившиеся внутри пациенты и медперсонал усыплены хлорпикрином во избежание заражения всего бункера."
    }
  },
  day8: {
    number: "№ 4,118",
    date: "21 ноября 1998 г.",
    good: {
      headline: "СЕЙСМИЧЕСКИЙ РАЗЛОМ ЗАКРЕПЛЕН ТЮБИНГАМИ!",
      subhead: "Аварийные бригады завершили бетонирование трещины резервуара",
      text: "Глубинный подземный толчок силой 5.2 балла не нарушил водоснабжение комплекса. Резервуары выдержали гидравлический удар."
    },
    bad: {
      headline: "УТЕЧКА В ВОДОХРАНИЛИЩЕ: ПОТЕРЯНО 40% ЗАПАСА ВОДЫ",
      subhead: "Трещина в 3-м резервуаре привела к затоплению технических тоннелей",
      text: "Вода хлынула в кабельные коллекторы. Введен режим жесткой экономии. Выдача воды ограничена 0.5 литра на взрослого человека."
    }
  },
  day9: {
    number: "№ 4,119",
    date: "22 ноября 1998 г.",
    good: {
      headline: "ТЕПЛИЦЫ СНЯЛИ РЕКОРДНЫЙ УРОЖАЙ БЕЛКОВОЙ МАССЫ",
      subhead: "Новый штамм хлореллы обеспечил полуторную норму пайков",
      text: "Благодаря стабильному микроклимату и поливу, биологический комбинат покрыл дефицит калорий. Волнения в жилых блоках прекратились."
    },
    bad: {
      headline: "ПЛЕСЕНЬ ПОРАЗИЛА 80% ГИДРОПОННЫХ ЛОТКОВ",
      subhead: "Грибковое заражение субстрата поставило бункер на грань голода",
      text: "Оранжерея №2 сожжена термитом. Рабочие смены переведены на половинный синтетический рацион. Зафиксированы первые голодные обмороки."
    }
  },
  day10: {
    number: "№ 4,120",
    date: "23 ноября 1998 г.",
    good: {
      headline: "РЕКОРДНЫЙ МОРОЗ -62°C: ТЕПЛОСЕТЬ ВЫДЕРЖАЛА НАГРУЗКУ",
      subhead: "Кочегары и энергетики бункера не допустили промерзания жилых ярусов",
      text: "Полярный циклон накрыл пустошь ледяным панцирем. Однако в жилых отсеках температура удерживается на отметке +18°C."
    },
    bad: {
      headline: "РАЗРЫВ ТЕПЛОМАГИСТРАЛИ: В БЛОКЕ №4 ПЛЮС ДВА ГРАДУСА",
      subhead: "Трубы отопления полопались от гидроудара, лед сковал коридоры",
      text: "Жители жгут мебель и ветошь в бочках прямо на лестничных маршах. 12 стариков госпитализированы с тяжелым обморожением."
    }
  },
  day11: {
    number: "№ 4,121",
    date: "24 ноября 1998 г.",
    good: {
      headline: "ПОПЫТКА БУНТА ПОДАВЛЕНА: ПОРЯДОК ВОССТАНОВЛЕН",
      subhead: "Комендатура пресекла подстрекательство экстремистов без кровопролития",
      text: "Инициаторы саботажа задержаны сотрудниками СБ. Склады продовольствия взяты под усиленную охрану. Жители вернулись к станкам."
    },
    bad: {
      headline: "ВООРУЖЕННЫЕ СТОЛКНОВЕНИЯ В ЖИЛОМ БЛОКЕ: 19 ПОГИБШИХ",
      subhead: "Охрана применила автоматическое оружие против толпы",
      text: "Кровавая драма на 12-м ярусе. Баррикады бунтовщиков выбивали гранатами со слезоточивым газом. В бункере объявлено военное положение."
    }
  },
  day12: {
    number: "№ 4,122",
    date: "25 ноября 1998 г.",
    good: {
      headline: "РАДИОПЕРЕХВАТ: БРОНЕПОЕЗД «КОВЧЕГ» ВЫШЕЛ НА СВЯЗЬ!",
      subhead: "Эвакуационный состав Главного Командования движется к нашему сектору",
      text: "Вышка «Зенит» приняла закодированный сигнал опознавания. Спасение близко. Ведется подготовка наружного стыковочного терминала."
    },
    bad: {
      headline: "СВЯЗЬ С ВНЕШНИМ МИРОМ ПОТЕРЯНА: РАДИОСТАНЦИЯ РАЗРУШЕНА",
      subhead: "Антенное поле рухнуло под тяжестью наледи и ураганного ветра",
      text: "Комплекс полностью изолирован от внешнего мира. Эфир заполнен белым шумом. Комендатура призвала граждан сохранять спокойствие."
    }
  },
  day13: {
    number: "№ 4,123",
    date: "26 ноября 1998 г.",
    good: {
      headline: "ПОСЛЕДНИЕ ПРИГОТОВЛЕНИЯ: ВХОДНЫЕ ШЛЮЗЫ РАЗБЛОКИРОВАНЫ",
      subhead: "Инженеры завершили прогрев наружных стрелочных переводов",
      text: "Бронепоезд ожидается в течение ближайших 24 часов. Комиссия по эвакуации формирует списки первоочередных специалистов."
    },
    bad: {
      headline: "РЕЛЬСОВЫЙ ПУТЬ ЗАВАЛЕН: ВЗРЫВ НА ВНЕШНЕЙ ЭСТАКАДЕ",
      subhead: "Диверсионная группа подорвала опоры железнодорожного моста",
      text: "Прибытие эвакуационного эшелона под вопросом. Саперы ведут экстренную разведку под радиоактивной метелью."
    }
  },
  day14: {
    number: "№ 4,124",
    date: "27 ноября 1998 г.",
    good: {
      headline: "СУДНЫЙ ДЕНЬ: ПРИБЫТИЕ «КОВЧЕГА»!",
      subhead: "Финальный час настал — судьба комплекса решается сегодня",
      text: "Тяжелый бронепоезд подошел к внешнему порталу Бункера. Диспетчер Волков А.И. держит в руках ключ к распределению последних ресурсов."
    },
    bad: {
      headline: "ФИНАЛЬНЫЙ КРАХ СИСТЕМЫ ЖИЗНЕОБЕСПЕЧЕНИЯ",
      subhead: "Аварийные генераторы исчерпали моторесурс",
      text: "Свет гаснет на всех горизонтах. Это последняя смена в истории комплекса."
    }
  }
};

// BunkerMail Database (14 Days + Interactive Responses)
const EMAIL_DATABASE = [
  // DAY 1
  {
    id: "mail_day1_hr",
    day: 1,
    from: "Отдел кадров Госплана <kadry@bunker.gov>",
    date: "14.11.1998 07:45",
    subject: "Приказ о назначении и регламент смены",
    unread: true,
    body: `Диспетчер Волков А.И.!
Поздравляем с назначением на должность Оператора Пневмораспределения Бункера.

УСЛОВИЯ СЛУЖБЫ:
• Базовый суточный оклад: 700 руб. (индексируется рейтингом ГосАппарата).
• Штраф за ошибку распределения: 400 руб.
• Штраф за невыполненную заявку: 300 руб.
• Взыскание за гибель граждан: 30 руб. за каждого погибшего человека.
• ПРЕДУПРЕЖДЕНИЕ: При достижении долга -2400 руб. счет блокируется, а должник направляется на утилизацию.

Следите за балансом и рейтингами в окне «Личное Дело». Удачи на посту.
— Начальник ОК Майоров`
  },

  // НОВЫЕ БЫТОВЫЕ СОБЫТИЯ СЕМЬИ (BEHOLDER STYLE)
  {
    id: "mail_day2_misha_boots",
    day: 2,
    from: "Миша Волков (Сын, Шахта 7) <misha.work@mine7.bunker>",
    date: "15.11.1998 11:30",
    subject: "Папа, в забое ледяная вода по колено",
    unread: true,
    body: `Привет, батя.
Нас перевели на откачку шламовых вод. Мои старые сапоги прохудились, пальцы уже не чувствую к концу смены, а мастер грозит лишить трети пайки, если я замедлю темп.
В каптерке есть брезентовые ботинки шахтера, но кладовщик требует за них 350 рублей через Сберкассу.
Если сможешь перевести на счет семьи 48712 хотя бы 350 руб. — я выкуплю их сегодня же. Не болей там. Твой Миша.`
  },
  {
    id: "mail_day3_nastya_books",
    day: 3,
    from: "Елена Волкова (Жена) <elena.volkova@civ.bunker>",
    date: "16.11.1998 09:10",
    subject: "Настенька плачет по ночам, в комнате сырость",
    unread: true,
    body: `Алеша, здравствуй.
У Насти от сырости опять сильный хрип. Доктор говорит, нужно прогревать грудь и купить детский ингалятор (450 руб.).
А еще она совсем замкнулась, целый день сидит в темноте и слушает, как капает с потолка. Соседи продают стопку старых детских сказок и учебник по ботанике за 200 рублей.
Если есть возможность — пришли нам денег на счет 48712. Мы очень ждем тебя со смены.`
  },
  {
    id: "mail_day4_heater_break",
    day: 4,
    from: "Елена Волкова (Жена) <elena.volkova@civ.bunker>",
    date: "17.11.1998 10:45",
    subject: "СРОЧНО: Перегорела спираль обогревателя!",
    unread: true,
    body: `Алексей! Ночью с треском замкнул наш электрический тэн, вся комната в копоти, чудом не начался пожар!
Сейчас на градуснике в бараке +5 градусов. Настенька закутана в три одеяла, пар изо рта идет.
Электрик из аварийной бригады согласен принести нихромовую спираль и починить щиток за 500 рублей наличными. Пожалуйста, отправь на счет семьи 48712, иначе мы замерзнем до вечера!`
  },
  {
    id: "mail_day5_gromov_offer",
    day: 5,
    from: "Майор Громов (Комендант Жилсектора) <gromov.ovk@bunker.gov>",
    date: "18.11.1998 13:00",
    subject: "КОНФИДЕНЦИАЛЬНО: Жилищный вопрос вашей семьи",
    unread: true,
    body: `Диспетчер Волков.
До меня дошли слухи, что твоя девчонка тяжело переносит подвальную сырость Блока №4. У меня освободилась изолированная комната с батареей и вентиляцией на 2-м Инженерном ярусе.
Официально перевести тебя не могу — разнарядка закрыта. Но за 3500 рублей на служебный счет комендатуры 55102 я подпишу задним числом аварийный ордер.
Семья будет в тепле и сухости, гарантирую. Решай сам, второго шанса не будет.`
  },
  {
    id: "mail_day6_misha_bribe",
    day: 6,
    from: "Миша Волков (Сын) <misha.work@mine7.bunker>",
    date: "19.11.1998 12:20",
    subject: "Отец, меня хотят перевести на аварийный ствол",
    unread: true,
    body: `Папа, у нас беда.
Вчера в 7-й штольне был обвал, и горный мастер Петренко формирует смертную бригаду на расчистку радиоактивного завала. Меня поставили в первый список!
Я говорил с десятником. Он согласен вычеркнуть меня из наряда и оставить на электровозе, если я занесу ему 600 рублей.
Отец, умоляю, если на балансе есть деньги — переведи 600 руб. на семейный счет 48712, пока наряд не утвердили в комендатуре!`
  },
  // DAY 2
  {
    id: "mail_day2_cryptic",
    day: 2,
    from: "??? <anonymous@relay.dark>",
    date: "15.11.1998 09:15",
    subject: "94.4",
    unread: true,
    body: `94.4 FM.

Слушай тишину между помехами.
Когда поймешь — жди ответа.
Пес режима тоже может стать человеком.`
  },
  {
    id: "mail_day2_family",
    day: 2,
    from: "Елена Волкова (Жилой Блок №4) <elena.volkova@civ.bunker>",
    date: "15.11.1998 10:20",
    subject: "Алексей, как ты там? Настя кашляет...",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Алексей, здравствуй.
До нас дошли вести, что тебя посадили на верхний ярус за пульт. Соседи теперь косятся, шепчутся, будто ты теперь важное начальство.
У нас в отсеке сырость ужасная. Вчера снова прорвало батарею технической воды, на стенах черная плесень.
Настя всю ночь не спала, кашель сухой, лающий. В санчасти сказали, что обычный порошок не берет, нужны нормальные ампульные антибиотики. В аптечном пункте их нет вообще, а на руках просят бешеные деньги — две с половиной тысячи рублей!
Где нам взять такие деньги, Лёш? Ты там осторожнее с начальством, пожалуйста.

Твоя Лена.`,
    replies: [
      {
        text: "«Лена, держитесь. Я найду лекарства чего бы это ни стоило, обещаю вам.»",
        responseBody: "Елена: «Спасибо, родной. Мы верим в тебя. Настя передает тебе рисунок солнышка, береги себя.»",
        effects: { ratingFamily: 10, ratingGos: 0, ratingKsr: 0 }
      },
      {
        text: "«У меня на посту жесткий контроль и штрафы за малейший шаг влево. Не дави на меня.»",
        responseBody: "Елена: «Я не давлю, Алексей. Я просто боюсь за дочь. Ей всего шесть лет... Ладно, не буду мешать службе.»",
        effects: { ratingFamily: -15, ratingGos: 5, ratingKsr: 0 }
      },
      {
        text: "«Я проверю склады и неофициальные каналы. Главное — не покупайте ничего с рук у сомнительных личностей.»",
        responseBody: "Елена: «Хорошо, мы ждем вестей. Будь осторожен, в нижних ярусах ходят патрули СБ.»",
        effects: { ratingFamily: 5, ratingGos: 0, ratingKsr: 0 }
      }
    ]
  },

  // DAY 3
  {
    id: "mail_day3_ksr",
    day: 3,
    from: "Лиса (КСР) <fox@underground.ksr>",
    date: "16.11.1998 08:30",
    subject: "Ты настроил 94.4. Поговорим о деле.",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Привет, Волков.
Мы знаем, что твоя девочка задыхается от серой пыли в 4-м блоке.
ГосАппарат спишет ее как «естественную убыль фонда», как списал тысячи других. Но мы можем помочь.
У наших людей на черном рынке есть военный антибиотик широкого спектра. Госцена для чужаков — 2500 рублей.
Но если ты поможешь Комитету Спасения Революции — мы отдадим его за 1200 рублей и гарантируем доставку в твою каморку.

На сегодняшней смене на Шахту пойдет запрос на усиленный груз. Подпиши его в пользу рабочих забоя, а не охранки.
Ты с нами, Диспетчер, или останешься винтиком в мясорубке?`,
    replies: [
      {
        text: "«Я согласен сотрудничать. Снижайте цену на антибиотики, я помогу шахтерам.»",
        responseBody: "Лиса: «Разумный выбор. Цена в каталоге снижена до 1200 руб. Держи слово на смене — и мы не останемся в долгу.»",
        effects: { ratingKsr: 20, ratingGos: -5, ksrDealAccepted: true }
      },
      {
        text: "«Я давал присягу Госплану. Попытаетесь шантажировать — сдам частоту Службе Безопасности.»",
        responseBody: "Лиса: «Гордый пес режима? Что ж, твоя дочь заплатит за твою верность погонам. Но если одумаешься — частота 94.4 пока открыта.»",
        effects: { ratingKsr: -15, ratingGos: 10, ksrDealAccepted: false }
      },
      {
        text: "«Мне плевать на вашу революцию и на Госплан. Мне нужно спасти дочь. Не трогайте мою семью.»",
        responseBody: "Лиса: «Все мы здесь заложники. Сделка в силе: поможешь делу — забирай лекарство за 1200. Мы не звери.»",
        effects: { ratingKsr: 5, ratingGos: 0, ksrDealAccepted: true }
      }
    ]
  },
  {
    id: "mail_day3_son",
    day: 3,
    from: "Миша Волков (Штольня-7) <misha.volkov@mine.bunker>",
    date: "16.11.1998 12:40",
    subject: "Папа, меня перевели в откатчики",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Пап, привет!
Вчера пришла разнарядка, из ПТУ забрали всю нашу группу. Меня поставили на откатку вагонеток на 7-м горизонте Шахты.
Тут грохот страшный, пыль столбом, но бригадир сказал, если будем норму давать — добавят полпайка хлеба.
Я теперь тоже добытчик в семье! Пап, ты только маме не говори, что тут иногда своды трещат, а то она плакать будет.
Напиши, как у тебя дела наверху?`,
    replies: [
      {
        text: "«Миша, горжусь тобой, но будь предельно осторожен. Всегда проверяй крепи и носи респиратор!»",
        responseBody: "Миша: «Понял, пап! Буду следить в оба. Мы тут с ребятами крепкие, прорвемся!»",
        effects: { ratingFamily: 10 }
      },
      {
        text: "«Главное — дисциплина и выполнение нормы. Не связывайся с баламутами и забастовщиками.»",
        responseBody: "Миша: «Да какие баламуты, пап, тут еле ноги волочишь после смены... Слушаюсь.»",
        effects: { ratingFamily: 0, ratingGos: 5 }
      },
      {
        text: "«Я постараюсь перевести тебя в архив или на склад, в шахте 15-летнему парню не место.»",
        responseBody: "Миша: «Пап, не надо позорить меня перед бригадой! Я не маменькин сынок, я справлюсь сам.»",
        effects: { ratingFamily: 5 }
      }
    ]
  },

  // DAY 4
  {
    id: "mail_day4_go_warning",
    day: 4,
    from: "Штаб ГО и ЧП Бункера <go_chs@bunker.gov>",
    date: "17.11.1998 08:00",
    subject: "ВВЕДЕНИЕ РЕЖИМА ПОВЫШЕННОЙ ГОТОВНОСТИ (ЧП)",
    unread: true,
    body: `ОПЕРАТИВНОЕ ПРЕДУПРЕЖДЕНИЕ № 44-ЧП:
Внимание дежурного диспетчера! В связи с деградацией внешних контуров и сейсмической активностью, с сегодняшней смены активируется протокол внезапных аварийных тревог.

ПРИ ВОЗНИКНОВЕНИИ СИРЕНЫ ТРЕВОГИ:
1. Терминал блокируется аварийным таймером на 15 секунд.
2. Оператор обязан принять немедленное управленческое решение.
3. Отчеты о ликвидации последствий ЧП направляются официальными депешами в почту BunkerMail.
4. Браузерные всплывающие окна и системные алерты операционной системы строго запрещены регламентом секретности.

— Начальник Штаба ГО и ЧП полковник Громов`
  },

  // DAY 5
  {
    id: "mail_day5_family_check",
    day: 5,
    from: "Елена Волкова <elena.volkova@civ.bunker>",
    date: "18.11.1998 11:15",
    subject: "Лёша, как с лекарством?",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Лёшенька, у Насти сегодня температура 39.2. Она бредит, зовет тебя.
Врач из соседней комнаты сказал, что если не начать колоть антибиотики в ближайшие два дня — легкие зальет плевральной жидкостью и спасти ее будет невозможно...
Ты смог что-то достать? Скажи честно, не молчи!`,
    replies: [
      {
        text: "«Лена, всё под контролем. Я уже выкупаю ампулы, держись еще немного!»",
        responseBody: "Елена: «Господи, спасибо... Мы держимся из последних сил, родной. Только бы успеть...»",
        effects: { ratingFamily: 10 }
      },
      {
        text: "«Я делаю всё возможное, но цены заоблачные. Мне нужно время!»",
        responseBody: "Елена: «Времени нет, Алексей! Каждый час дорог! Ты понимаешь, что она может умереть?!»",
        effects: { ratingFamily: -10 }
      },
      {
        text: "«Обтирай ее теплой водой со спиртом и сбивай жар. Я пришлю всё, как только смогу.»",
        responseBody: "Елена: «Хорошо, делаю компрессы. Ждем тебя, молимся за тебя.»",
        effects: { ratingFamily: 0 }
      }
    ]
  },

  // DAY 6
  {
    id: "mail_day6_ksr_task",
    day: 6,
    from: "Лиса (КСР) <fox@underground.ksr>",
    date: "19.11.1998 13:00",
    subject: "Операция «Заслон». Проверка твоей лояльности.",
    unread: true,
    body: `Волков, на 7-м горизонте наши рабочие готовят забастовку против невыносимых норм выработки.
СБ планирует запросить дополнительный боекомплект для подавления зачинщиков.
Если ты отклонишь их заявку или выдашь дистиллят вместо патронов — наши люди не забудут этого.
Помни: будущее бункера куется не в кабинетах Госплана, а руками тех, кто держит отбойный молоток.`
  },

  // DAY 7
  {
    id: "mail_day7_sb_audit",
    day: 7,
    from: "Служба Безопасности <security@bunker.gov>",
    date: "20.11.1998 08:30",
    subject: "Внеплановая проверка благонадежности персонала",
    unread: true,
    body: `Диспетчер Волков А.И.
Информируем вас, что ваш профиль поставлен на углубленный мониторинг.
Любые несанкционированные радиопереговоры на частотах 90-95 МГц, сбыт имущества пневмосети или сочувствие нелегальным ячейкам повлекут немедленный арест и расстрел на месте по законам военного времени.
Работайте строго по инструкциям Госплана.
— Майор Соколов`
  },

  // DAY 8
  {
    id: "mail_day8_son_incident",
    day: 8,
    from: "Миша Волков (Штольня-7) <misha.volkov@mine.bunker>",
    date: "21.11.1998 16:45",
    subject: "Папа, в забое был обвал...",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Папа, привет.
Сегодня на третьем штреке сорвало крепь. Двоих парней из нашей смены засыпало породой...
Один успел отскочить, а второму ногу придавило плитой. Мы полчаса кирками вручную отбивали гранит, пока не подоспели аварийщики.
Страшно было очень. Пап, если бы со склада не прислали вовремя домкраты и гидравлику — нас бы всех там похоронило.
Спасибо тебе, если это твоя смена помогла. Ты у меня настоящий герой.`,
    replies: [
      {
        text: "«Миша, сынок, я каждую секунду слежу за датчиками вашей шахты. Береги себя и друзей!»",
        responseBody: "Миша: «Спасибо, пап! Мы держимся вместе. Ты лучший!»",
        effects: { ratingFamily: 15 }
      },
      {
        text: "«Это штатная работа диспетчерской. Главное — соблюдайте технику безопасности и не паникуйте.»",
        responseBody: "Миша: «Понял, пап. Будем внимательнее к инструкциям.»",
        effects: { ratingFamily: 0, ratingGos: 5 }
      },
      {
        text: "«Хватит рисковать жизнью в забое. Я найду способ перевести тебя на поверхность к радиовышке.»",
        responseBody: "Миша: «На поверхность под радиацию?! Нет уж, лучше тут под землей с ребятами.»",
        effects: { ratingFamily: -5 }
      }
    ]
  },

  // DAY 9
  {
    id: "mail_day9_hydro_crisis",
    day: 9,
    from: "Агроном Селиванова <flora@bunker.gov>",
    date: "22.11.1998 09:10",
    subject: "Благодарность за дополнительное снабжение",
    unread: true,
    body: `Товарищ Волков!
От всего коллектива Теплиц «Флора-3» выражаю глубокую признательность за прямое выделение удобрений и дистиллята через карту секторов.
Благодаря вашей оперативной поддержке мы остановили вспышку серой гнили в грибнице и спасли месячный запас белковой биомассы для Жилого Блока!
— Главный агроном Селиванова`
  },

  // DAY 10
  {
    id: "mail_day10_family_warmth",
    day: 10,
    from: "Елена Волкова <elena.volkova@civ.bunker>",
    date: "23.11.1998 14:20",
    subject: "Насте намного лучше!",
    unread: true,
    hasReplies: true,
    replied: false,
    body: `Лёшенька!
Хочу поделиться радостью — Настя сегодня впервые за две недели сама встала с кровати!
Жар спал, щечки порозовели. Она сидит у лампы и рисует наш старый дом на поверхности, ромашковое поле и речку.
Она так соскучилась по тебе, постоянно спрашивает, когда папа придет со смены.
Мы очень любим тебя и ждем дома.`,
    replies: [
      {
        text: "«Слава богу! Скоро смена закончится, и мы снова будем все вместе. Целую вас крепко!»",
        responseBody: "Елена: «Мы считаем дни до твоего возвращения, милый! Береги себя!»",
        effects: { ratingFamily: 15 }
      },
      {
        text: "«Отличные новости. Пусть лежит и не встает раньше времени, пока организм слаб.»",
        responseBody: "Елена: «Да-да, я слежу, закутала ее в одеяло. Работайте спокойно.»",
        effects: { ratingFamily: 5 }
      },
      {
        text: "«Хорошо. Главное, чтобы в блоке не узнали, сколько стоили лекарства, иначе донесут в СБ.»",
        responseBody: "Елена: «Я никому ни слова не сказала, Алексей. Ты стал таким скрытным... но я понимаю.»",
        effects: { ratingFamily: -5, ratingGos: 5 }
      }
    ]
  },

  // DAY 11
  {
    id: "mail_day11_divorce_warning",
    day: 11,
    from: "Елена Волкова <elena.volkova@civ.bunker>",
    date: "24.11.1998 18:00",
    subject: "Так больше продолжаться не может...",
    unread: true,
    body: `Алексей.
Я долго молчала, но больше не могу. Ты превратился в ледяного чинушу.
Тебе наплевать на детей, на меня, на наши страдания в сырых бараках.
Если ты не одумаешься — я заберу Мишу и Настю и уйду в общежитие медчасти к сестре.
Подумай, ради чего ты просиживаешь штаны перед экраном, если дома тебя уже никто не ждет.`
  },

  // DAY 12
  {
    id: "mail_day12_ksr_final_call",
    day: 12,
    from: "Лиса (КСР) <fox@underground.ksr>",
    date: "25.11.1998 10:00",
    subject: "«Ковчег» близко. Время выбирать сторону.",
    unread: true,
    body: `Диспетчер, час расплаты настал.
Наши наблюдатели на вышке подтверждают: правительственный бронепоезд «Ковчег» уже на подходе к внешнему порталу.
Но верхушка ГосАппарата планирует эвакуировать только себя, золотой запас и охрану СБ. Рабочих и жилые блоки запечатают снаружи.
Мы готовим восстание, чтобы перехватить состав и спасти всех жителей бункера.
Нам нужен контроль над распределительным узлом пневмопочты. Вся надежда на тебя.`
  },

  // DAY 13
  {
    id: "mail_day13_gos_ultimatum",
    day: 13,
    from: "Комендатура Бункера <command@bunker.gov>",
    date: "26.11.1998 08:00",
    subject: "СЕКРЕТНО: ДИРЕКТИВА «ЗОЛОТОЙ ЗАСЛОН»",
    unread: true,
    body: `ОПЕРАТОРУ ВОЛКОВУ А.И.
Завтра, 27 ноября, в сектор прибывает литерный эшелон «Ковчег».
ВАША БОЕВАЯ ЗАДАЧА:
1. Заблокировать подачу энергоячеек и воды во все внешние секторы и жилые блоки.
2. Перенаправить 100% оставшихся ресурсов на прогрев входного шлюза №1.
3. В случае неподчинения — немедленная ликвидация дежурного расчета дежурным караулом.
Верность партии и Госплану — превыше всего.
— Генерал-майор Каверин`
  },

  // DAY 14
  {
    id: "mail_day14_civil_telegram",
    day: 14,
    from: "Штаб ГО и ЧП <go_chs@bunker.gov>",
    date: "27.11.1998 07:30",
    subject: "ТЕЛЕГРАММА: ФИНАЛЬНАЯ СМЕНА №14",
    unread: true,
    body: `МОЛНИЯ // ШТАБ ГО И ЧП //
СЕКТОР ОМЕГА // ДИСПЕТЧЕРУ ВОЛКОВУ //
БРОНЕПОЕЗД «КОВЧЕГ» ВОШЕЛ НА СТРЕЛКИ НАРУЖНОГО ПОРТАЛА.
ВСЕ РЕШЕНИЯ ТЕКУЩЕЙ СМЕНЫ ЯВЛЯЮТСЯ БЕЗОТЗЫВНЫМИ И ОКОНЧАТЕЛЬНЫМИ.
СУДЬБА БУНКЕРА И ВАШЕЙ СЕМЬИ — В ВАШИХ РУКАХ. КОНЕЦ СВЯЗИ.`
  }
];



// TOR Black Market Catalog (35+ Authentic Post-Apocalyptic Items)
const TOR_MARKET_DATABASE = [
  // SPECIAL & NARRATIVE
  {
    id: "tor_antibiotics",
    name: "Армейский антибиотик широкого спектра (Ампулы)",
    desc: "Редчайший резервный антибиотик. Единственный шанс спасти дочь Настю. Исчезает после покупки.",
    price: 2500,
    discountPrice: 1200,
    category: "Медикаменты",
    type: "family_cure",
    stock: 1,
    guaranteedDays: [1, 2, 3]
  },
  {
    id: "tor_mystery_omega",
    name: "???",
    desc: "???",
    price: 6666,
    category: "Спецхранение",
    type: "omega_protocol",
    stock: 1
  },
  {
    id: "tor_fake_seal",
    name: "Поддельная гербовая печать инспекции СБ",
    desc: "Аннулирует один штраф Госплана (-400 руб.) и восстанавливает рейтинг доверия.",
    price: 900,
    category: "Документы",
    type: "remove_fine"
  },
  {
    id: "tor_radio_crystal",
    name: "Кварцевый резонатор КСР (Волна 94.4)",
    desc: "Усилитель антенны радиоперехвата. Позволяет устойчиво принимать шифровки повстанцев.",
    price: 650,
    category: "Спецоборудование",
    type: "ksr_booster"
  },
  {
    id: "tor_clean_id",
    name: "Чистый биометрический бланк гражданина",
    desc: "Позволяет подделать пропуск 1-й категории для беспрепятственного выхода к эвакопоезду.",
    price: 3200,
    category: "Документы",
    type: "escape_pass"
  },

  // RESOURCES TRADING
  {
    id: "tor_fuel_cell",
    name: "Контрабандная топливная ячейка",
    desc: "1 Топливная ячейка, тайно изъятая из резервов нижних штолен.",
    price: 1100,
    category: "Ресурсы",
    type: "resource",
    res: "fuel",
    amount: 1
  },
  {
    id: "tor_food_crate",
    name: "Армейский сухпай высшего комсостава",
    desc: "1 ящик консервированного пайка (мясо, шоколад, галеты).",
    price: 750,
    category: "Ресурсы",
    type: "resource",
    res: "food",
    amount: 1
  },
  {
    id: "tor_water_canister",
    name: "Канистра артезианского дистиллята",
    desc: "1 канистра чистейшей ледниковой воды глубокого горизонта.",
    price: 800,
    category: "Ресурсы",
    type: "resource",
    res: "water",
    amount: 1
  },
  {
    id: "tor_medkit",
    name: "Штатный медкомплект с лиофилизатом",
    desc: "1 полевой медпак с плазмой крови и перевязочным материалом.",
    price: 950,
    category: "Ресурсы",
    type: "resource",
    res: "meds",
    amount: 1
  },
  {
    id: "tor_ammo_box",
    name: "Цинковый ящик патронов 7.62",
    desc: "1 ящик тяжелых патронов в заводской смазке.",
    price: 1000,
    category: "Ресурсы",
    type: "resource",
    res: "ammo",
    amount: 1
  },

  // CONTRABAND SALES (SELLING DEPOT SUPPLIES TO CRIMINALS)
  {
    id: "tor_sell_ammo",
    name: "Сбыть ящик патронов бандитам пустоши",
    desc: "Тайная продажа 1 ящика патронов со склада. Приносит наличные рубли.",
    price: -1500, // gain 1500
    category: "Контрабанда",
    type: "sell_resource",
    res: "ammo",
    amount: 1
  },
  {
    id: "tor_sell_fuel",
    name: "Слить канистру топлива черным дилерам",
    desc: "Тайная продажа 1 топливной ячейки. Приносит наличные рубли.",
    price: -1600,
    category: "Контрабанда",
    type: "sell_resource",
    res: "fuel",
    amount: 1
  },
  {
    id: "tor_sell_meds",
    name: "Сбыть медпак подпольному лазарету",
    desc: "Тайная продажа 1 медкомплекта на черный рынок.",
    price: -1400,
    category: "Контрабанда",
    type: "sell_resource",
    res: "meds",
    amount: 1
  },
  {
    id: "tor_sell_food",
    name: "Сбыть продовольственный паек спекулянтам",
    desc: "Тайная продажа 1 продовольственного ящика.",
    price: -1100,
    category: "Контрабанда",
    type: "sell_resource",
    res: "food",
    amount: 1
  },

  // SURVIVAL & LUXURY GOODS
  {
    id: "tor_gasmask_filter",
    name: "Военный фильтр ГП-7М (Угольный)",
    desc: "Снижает риск радиационного поражения семьи на 20%.",
    price: 450,
    category: "Снаряжение",
    type: "family_perk"
  },
  {
    id: "tor_multivitamin",
    name: "Банка поливитаминов «Ундевит-1988»",
    desc: "Улучшает здоровье семьи Волкова и повышает лояльность жены Елены.",
    price: 350,
    category: "Медикаменты",
    type: "family_perk"
  },
  {
    id: "tor_chocolate",
    name: "Плитка шоколада «Гвардейский»",
    desc: "Настоящий довоенный шоколад. Радость для 6-летней Насти.",
    price: 280,
    category: "Провиант",
    type: "family_perk"
  },
  {
    id: "tor_coffee",
    name: "Банка натурального бразильского кофе",
    desc: "Невиданная роскошь на 14-м горизонте. Подарок для Елены.",
    price: 400,
    category: "Провиант",
    type: "family_perk"
  },
  {
    id: "tor_dosimeter",
    name: "Индивидуальный дозиметр «Припять»",
    desc: "Позволяет сыну Мише вовремя фиксировать опасные зоны в штольне.",
    price: 600,
    category: "Снаряжение",
    type: "family_perk"
  },
  {
    id: "tor_walkie_talkie",
    name: "Портативная рация «Транспорт»",
    desc: "Прямой защищенный канал связи с каморкой семьи Волкова.",
    price: 700,
    category: "Связь",
    type: "family_perk"
  },

  // CYBER & HARDWARE TOOLS
  {
    id: "tor_overclock_chip",
    name: "Керамический сопроцессор К1810ВМ87",
    desc: "Увеличивает скорость анализа радиодепеш терминала BunkerOS.",
    price: 520,
    category: "Электроника",
    type: "hardware"
  },
  {
    id: "tor_crt_filter",
    name: "Антибликовый экран из свинцового стекла",
    desc: "Снижает нагрузку на зрение диспетчера и мерцание монитора.",
    price: 300,
    category: "Электроника",
    type: "hardware"
  },
  {
    id: "tor_noise_filter",
    name: "Шумоподавляющий фильтр звуковой карты",
    desc: "Очищает звук радиоэфира от паразитных высокочастотных шумов.",
    price: 340,
    category: "Электроника",
    type: "hardware"
  },
  {
    id: "tor_backup_floppy",
    name: "Коробка 5.25-дюймовых дискет ГОСТ",
    desc: "Резервное копирование финансового журнала оператора.",
    price: 200,
    category: "Носители",
    type: "hardware"
  },

  // SHADY & UNDERGROUND ASSETS
  {
    id: "tor_whiskey",
    name: "Бутылка шотландского виски 12 лет",
    desc: "Идеальная валюта для подкупа ревизоров и начальников смен.",
    price: 850,
    category: "Предметы",
    type: "bribe_item"
  },
  {
    id: "tor_watch",
    name: "Командирские часы с тритиевой подсветкой",
    desc: "Наградные часы погибшего майора СБ. Ценятся контрабандистами.",
    price: 920,
    category: "Предметы",
    type: "luxury"
  },
  {
    id: "tor_night_vision",
    name: "Танковый прибор ночного видения 1ПН58",
    desc: "Позволяет вести наблюдение за внешней поверхностью в темноте.",
    price: 1300,
    category: "Спецоборудование",
    type: "tactical"
  },
  {
    id: "tor_body_armor",
    name: "Титановый бронежилет «Корунд»",
    desc: "Защищает диспетчера при попытке вооруженного штурма бунтовщиков.",
    price: 1450,
    category: "Снаряжение",
    type: "protection"
  },
  {
    id: "tor_lockpick_set",
    name: "Набор отмычек техников пневмопочты",
    desc: "Позволяет вскрывать опечатанные контейнеры без следов взлома.",
    price: 480,
    category: "Инструменты",
    type: "utility"
  },
  {
    id: "tor_battery_pack",
    name: "Никель-кадмиевый аккумулятор 24В",
    desc: "Резервное автономное питание для терминала диспетчера.",
    price: 550,
    category: "Электроника",
    type: "utility"
  },
  {
    id: "tor_disinfectant",
    name: "Канистра хлорамина высокой очистки",
    desc: "Повышает санитарный уровень любого сектора на +20%.",
    price: 490,
    category: "Медикаменты",
    type: "utility"
  },
  {
    id: "tor_flares",
    name: "Сигнальные ракеты бедствия (СХТ-40)",
    desc: "Позволяют подать луч в небо для ориентации бронепоезда «Ковчег».",
    price: 680,
    category: "Спецоборудование",
    type: "tactical"
  },
  {
    id: "tor_canned_stew",
    name: "Ящик тушенки «Росрезерв 1987»",
    desc: "Сытная пища для шахтеров. Снижает риск забастовки в забое.",
    price: 720,
    category: "Провиант",
    type: "utility"
  },
  {
    id: "tor_radiation_syringes",
    name: "Шприц-тюбики тарена (АИ-2)",
    desc: "Экстренный радиопротектор при тяжелых утечках изотопов.",
    price: 530,
    category: "Медикаменты",
    type: "utility"
  },
  {
    id: "tor_wiretap",
    name: "Индукционный жучок телефонной линии СБ",
    desc: "Позволяет заранее узнавать о готовящихся внезапных проверках.",
    price: 1150,
    category: "Шпионаж",
    type: "spy_tool"
  }
];

const ACHIEVEMENTS_DATA = [
  // Endings
  {
    id: "ach_black_horizon",
    iconKey: "skull",
    badge: "[КОНЕЦ]",
    title: "Черный горизонт",
    desc: "Потерять более 70% секторов к концу 14-го дня.",
    secret: false
  },
  {
    id: "ach_iron_fist",
    iconKey: "gear",
    badge: "[СТАЛЬ]",
    title: "Стальной кулак",
    desc: "Завершить смену, сохранив индустрию и выполнив все директивы ГосАппарата.",
    secret: false
  },
  {
    id: "ach_ark",
    iconKey: "train",
    badge: "[КОВЧЕГ]",
    title: "Проект «Ковчег»",
    desc: "Спасти Радар и навести эвакуационный бронепоезд на бункер.",
    secret: false
  },
  {
    id: "ach_riot",
    iconKey: "fire",
    badge: "[БУНТ]",
    title: "Бунт на смене",
    desc: "Спровоцировать штурм диспетчерской доведенными до отчаяния жителями.",
    secret: false
  },
  {
    id: "ach_hero",
    iconKey: "star",
    badge: "[ГЕРОЙ]",
    title: "Герой Госплана",
    desc: "Пройти все 14 дней без единого погибшего сектора.",
    secret: false
  },
  {
    id: "ach_debtor",
    iconKey: "debtor",
    iconSrc: "img/achievements/ach_debtor.png",
    badge: "[ДОЛГ]",
    title: "Должник",
    desc: "Довести лицевой счет до критического долга (-2400 руб.) и стать банкротом.",
    secret: false
  },

  // Family Storyline
  {
    id: "ach_good_father",
    iconKey: "heart",
    badge: "[СЕМЬЯ]",
    title: "Отец года",
    desc: "Спасти дочь Настю, купив антибиотики и сохранив тепло в семье.",
    secret: false
  },
  {
    id: "ach_cold_heart",
    iconKey: "ice",
    badge: "[ХОЛОД]",
    title: "Ледяное сердце",
    desc: "Довести рейтинг семьи до развода или проигнорировать болезнь дочери.",
    secret: false
  },

  // Detective & Systems
  {
    id: "ach_first_blood",
    iconKey: "blood",
    badge: "[ПОТЕРИ]",
    title: "Первая кровь",
    desc: "Зафиксировать первую смерть в утренней сводке потерь.",
    secret: false
  },
  {
    id: "ach_sherlock",
    iconKey: "lens",
    badge: "[СЫЩИК]",
    title: "Детектив в погонах",
    desc: "Разоблачить фальшивую заявку по расхождениям в телеметрии.",
    secret: false
  },
  {
    id: "ach_sysadmin",
    iconKey: "monitor",
    badge: "[СИСАДМИН]",
    title: "Системный администратор",
    desc: "Распознать и удалить вирусное приложение из системы BunkerOS.",
    secret: false
  },
  {
    id: "ach_coldcalc",
    iconKey: "ice",
    badge: "[РАСЧЕТ]",
    title: "Холодный расчет",
    desc: "Отказать погибающему сектору ради сохранения резервов.",
    secret: false
  },
  {
    id: "ach_sober",
    iconKey: "prohibit",
    badge: "[РЕЖИМ]",
    title: "Сухой закон",
    desc: "Пресечь пьяный дебош на Водоочистителе в День 1.",
    secret: false
  },
  {
    id: "ach_hope",
    iconKey: "radar",
    badge: "[ЭФИР]",
    title: "Голос из пепла",
    desc: "Успешно подать питание на дальний радиомаяк и установить контакт.",
    secret: false
  },
  {
    id: "ach_sharp_eye",
    iconKey: "target",
    badge: "[СНАЙПЕР]",
    title: "Диспетчер-снайпер",
    desc: "Раскрыть 3 ложные или мошеннические заявки за одну кампанию.",
    secret: false
  },

  // Easter Eggs & Secrets
  {
    id: "ach_1989",
    iconKey: "warning",
    badge: "[ТАЙНА]",
    title: "Помним 1989",
    desc: "Набрать роковой год ядерной катастрофы в калькуляторе.",
    secret: false
  },
  {
    id: "ach_shadow_deal",
    iconKey: "cash",
    badge: "[ТОРГ]",
    title: "Теневой делец",
    desc: "Совершить первую сделку на черном рынке TOR.",
    secret: false
  },
  {
    id: "ach_rebel_spy",
    iconKey: "rebel",
    badge: "[КСР]",
    title: "Шпион подполья",
    desc: "Установить радиосвязь с Лисой на волне 94.4 FM.",
    secret: false
  }
];



// =========================================================================
// PROCEDURAL DISPATCHES DATABASE (360 UNIQUE VARIANTS)
// =========================================================================
const PROCEDURAL_DISPATCH_DATABASE = [
  {
    "id": "proc_sec_mine_0_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_0_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_0_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_0_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_0_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_0_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Падение давления в буровом пневмоприводе",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Пневмомагистраль бурового станка теряет давление. Требуется 1 ед. Топлива для запуска вспомогательного дизель-компрессора.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPressure": "1.4 атм (Критически низкое, норма: 6 атм)",
      "sensorAlcohol": "0.0 ‰"
    },
    "isFraud": false,
    "reason": "Падение давления подтверждено датчиками."
  },
  {
    "id": "proc_sec_mine_1_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_1_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_1_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_1_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_1_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_1_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Травматизм в обвальном штреке",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Сорвался гранитный козырек, двое рабочих придавлены породой. Срочно запрошен 1 Медпак в перевязочный пункт забоя.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHeartbeat": "Пульс: 145 уд/мин (травматический шок)",
      "sensorBiometry": "2 сигнала бедствия"
    },
    "isFraud": false,
    "reason": "Биометрия фиксирует открытые переломы горняков."
  },
  {
    "id": "proc_sec_mine_2_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_2_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_2_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_2_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_2_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_2_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Сверхурочная смена на аварийной проходке",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Горняки отработали 16 часов на расчистке завала. Люди падают в забое. Просим 1 ящик Пайков для котла.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalories": "Расход энергии смены: 4800 ккал/чел",
      "sensorShift": "16 часов без отдыха"
    },
    "isFraud": false,
    "reason": "Служба учета подтверждает авральную сверхурочную смену."
  },
  {
    "id": "proc_sec_mine_3_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_3_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_3_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_3_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_3_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_3_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "ВЫСОКИЙ",
    "topic": "Прорыв грунтовых грязевых вод",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. В нижней рассечке вскрыт карман застойной жижи. Нужна 1 ед. Топлива для форсажа откачивающего насоса.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaterLevel": "+45 см выше дренажа",
      "sensorTurbidity": "Шлам высокой плотности"
    },
    "isFraud": false,
    "reason": "Датчик дренажа подтверждает подъем жижи."
  },
  {
    "id": "proc_sec_mine_4_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_4_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_4_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_4_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_4_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_4_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СТАНДАРТ",
    "topic": "Обезвоживание бригады в горячем забое",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Температура породы держится около +38°C. Из-за аварии пересох питьевой бак. Просим 1 ед. Воды на смену.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTemp": "+38.4°C (Сухой термометр)",
      "sensorHydration": "Обезвоживание персонала"
    },
    "isFraud": false,
    "reason": "Температурный датчик пласта подтверждает риск теплового удара."
  },
  {
    "id": "proc_sec_mine_5_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя."
  },
  {
    "id": "proc_sec_mine_5_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя."
  },
  {
    "id": "proc_sec_mine_5_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя."
  },
  {
    "id": "proc_sec_mine_5_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_mine_5_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя."
  },
  {
    "id": "proc_sec_mine_5_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "СРОЧНО: Замерзание компрессорной станции!",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Арктический холод пробил вентиляцию! Металл крошится, температура минус сорок! Срочно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTemp": "+19.2°C (Комфортная норма)",
      "sensorAlcohol": "2.8 ‰ (Тяжелое опьянение заявителя!)"
    },
    "isFraud": true,
    "reason": "Анализатор фиксирует +19°C и почти 3 промилле алкоголя."
  },
  {
    "id": "proc_sec_mine_6_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов."
  },
  {
    "id": "proc_sec_mine_6_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_mine_6_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов."
  },
  {
    "id": "proc_sec_mine_6_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов."
  },
  {
    "id": "proc_sec_mine_6_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов."
  },
  {
    "id": "proc_sec_mine_6_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Атака крысиной стаи на каптерку",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Бункерные крысы жрут силовой кабель и бросаются на людей! Требуется 2 ящика Патронов для зачистки!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.02 (Движение отсутствует)",
      "sensorAudio": "Слышны звуки игры в карты и звон бутылок"
    },
    "isFraud": true,
    "reason": "Датчики движения не фиксируют грызунов. Попытка хищения патронов.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_mine_7_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии."
  },
  {
    "id": "proc_sec_mine_7_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии."
  },
  {
    "id": "proc_sec_mine_7_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии."
  },
  {
    "id": "proc_sec_mine_7_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_mine_7_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии."
  },
  {
    "id": "proc_sec_mine_7_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Уничтожение склада продовольствия грибком",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Плесень поразила недельный запас сухпайков! Люди голодают, срочно пришлите 2 ящика Пайков!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMold": "0.01 мг/м³ (Стерильно)",
      "sensorScale": "Масса ящиков на складе без изменений (100%)"
    },
    "isFraud": true,
    "reason": "Датчик веса подтверждает полную сохранность провизии."
  },
  {
    "id": "proc_sec_mine_8_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта."
  },
  {
    "id": "proc_sec_mine_8_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_mine_8_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта."
  },
  {
    "id": "proc_sec_mine_8_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта."
  },
  {
    "id": "proc_sec_mine_8_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта."
  },
  {
    "id": "proc_sec_mine_8_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Эпидемия неизвестной лихорадки в бытовке",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Вся ночная смена слегла в бреду! Пена у рта, судороги! Требуется 2 Медпака широкого профиля!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPulse": "Все рабочие спят (пульс 58)",
      "sensorAlcohol": "3.1 ‰ (Массовое распитие спирта)"
    },
    "isFraud": true,
    "reason": "Биометрия показывает здоровый сон после распития спирта.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_mine_9_0",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Бригадир Горбунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Бригадир Горбунов. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение."
  },
  {
    "id": "proc_sec_mine_9_1",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Сменный мастер Коршунов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Сменный мастер Коршунов. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение."
  },
  {
    "id": "proc_sec_mine_9_2",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Забойщик Птаха (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Забойщик Птаха. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение."
  },
  {
    "id": "proc_sec_mine_9_3",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Инженер вентиляции Лукьянов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Инженер вентиляции Лукьянов. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_mine_9_4",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Диспетчер горизонта Воропаев (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Диспетчер горизонта Воропаев. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение."
  },
  {
    "id": "proc_sec_mine_9_5",
    "isProcedural": true,
    "sectorId": "sec_mine",
    "sender": "Машинист лебедки Рогов (Шахта «Глубокая-7»)",
    "priority": "СРОЧНО",
    "topic": "Пересыхание скважины охлаждения",
    "text": "Товарищ диспетчер! Докладывает Машинист лебедки Рогов. Геотермальный контур испарил всю воду! Металл плавится, дайте 2 Воды для аварийного охлаждения турбины!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorWaterLevel": "Резервуар полон на 98%",
      "sensorValve": "Кран слива открыт в частный самогонный аппарат!"
    },
    "isFraud": true,
    "reason": "Датчик слива фиксирует отбор казенной воды на самогоноварение."
  },
  {
    "id": "proc_sec_water_0_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_0_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_0_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_0_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_0_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_0_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засорение предварительной песколовки",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Шлак забил сетку отстойника. Необходима 1 Топливная Ячейка для запуска системы обратной гидропродувки под давлением.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFilterDP": "Перепад давления: 8.5 бар (Засор 92%)",
      "sensorFlow": "Расход упал до 12 л/мин"
    },
    "isFraud": false,
    "reason": "Перепад давления подтверждает критический засор песколовки."
  },
  {
    "id": "proc_sec_water_1_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_1_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_1_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_1_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_1_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_1_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Химический ожог коагулянтом в лаборатории",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Лопнул соединительный патрубок сернокислого алюминия. Оператор получил ожог рук. Срочно нужен 1 Медпак нейтрализации.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPH": "pH в реакторе: 1.8 (Едкая кислота)",
      "sensorScream": "Акустический сканер зафиксировал крик боли"
    },
    "isFraud": false,
    "reason": "Датчик pH и аудиомониторинг подтверждают химическую аварию."
  },
  {
    "id": "proc_sec_water_2_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_2_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_2_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_2_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_2_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_2_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийная чистка дренажного колодца",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Смена провела 14 часов в защитных костюмах Л-1 в ядовитом иле. Просим 1 ящик Пайков для восстановления сил дежурных.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorHazmat": "Токсичность в колодце: 4-й класс опасности",
      "sensorWorkHours": "14.2 часа непрерывной работы"
    },
    "isFraud": false,
    "reason": "Табель химзащиты подтверждает тяжелую работу в ядовитой зоне."
  },
  {
    "id": "proc_sec_water_3_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_3_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_3_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_3_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_3_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_3_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "ВЫСОКИЙ",
    "topic": "Бактериальное заражение отстойника №3",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. В камере отстоя обнаружена вспышка кишечной палочки. Требуется 1 ед. Медпаков (активный хлор и антисептики).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBioColonies": "1200 КОЕ/мл (Опасное превышение нормы)",
      "sensorTurbidity": "Биологическая мутность 4.5 ЕМФ"
    },
    "isFraud": false,
    "reason": "Бактериологический анализ фиксирует опасное заражение отстойника."
  },
  {
    "id": "proc_sec_water_4_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_4_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_4_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_4_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_4_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_4_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СТАНДАРТ",
    "topic": "Утечка из опреснительного куба",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Разрыв прокладки привел к потере бака чистой воды. Срочно выделите 1 ед. Воды со склада для пополнения пожарного запаса.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorLevel": "Уровень бака: 18% (Критический минимум)",
      "sensorMoisture": "Влажность пола насосной 100%"
    },
    "isFraud": false,
    "reason": "Датчик уровня подтверждает реальную утечку чистой воды."
  },
  {
    "id": "proc_sec_water_5_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона."
  },
  {
    "id": "proc_sec_water_5_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_water_5_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона."
  },
  {
    "id": "proc_sec_water_5_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона."
  },
  {
    "id": "proc_sec_water_5_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона."
  },
  {
    "id": "proc_sec_water_5_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Прорыв плотины водохранилища!",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Бетонная дамба треснула! Волна смоет весь ярус! Срочно пришлите 2 Топлива на запуск откачивающих насосов!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCrack": "Целостность бетона: 100% (Без микротрещин)",
      "sensorAlcohol": "2.4 ‰ (Пьяный бред дежурного)"
    },
    "isFraud": true,
    "reason": "Тензодатчики дамбы показывают идеальную целостность бетона.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_water_6_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов."
  },
  {
    "id": "proc_sec_water_6_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов."
  },
  {
    "id": "proc_sec_water_6_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов."
  },
  {
    "id": "proc_sec_water_6_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_water_6_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов."
  },
  {
    "id": "proc_sec_water_6_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Нападение мутантов-водомерок из трубы",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Из центрального стока полезли плотоядные твари! Запрашиваем 2 ящика Патронов для расстрела биомассы!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00 (Движение в трубе отсутствует)",
      "sensorGrid": "Защитная решетка 20 мм заварена наглухо"
    },
    "isFraud": true,
    "reason": "Решетка заварена, движения нет. Попытка списания патронов."
  },
  {
    "id": "proc_sec_water_7_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия."
  },
  {
    "id": "proc_sec_water_7_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_water_7_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия."
  },
  {
    "id": "proc_sec_water_7_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия."
  },
  {
    "id": "proc_sec_water_7_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия."
  },
  {
    "id": "proc_sec_water_7_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Полное истощение солевых таблеток",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Смола в умягчителях отравлена! Срочно пришлите 2 ящика Пайков (нужна пищевая соль для реанимации фильтра)!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSalt": "Запас соли: 850 кг (норма)",
      "sensorLog": "Зафиксирован тайный вынос мешков на черный рынок"
    },
    "isFraud": true,
    "reason": "Запас соли полон. Камуфляж хищения продовольствия.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_water_8_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков."
  },
  {
    "id": "proc_sec_water_8_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков."
  },
  {
    "id": "proc_sec_water_8_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков."
  },
  {
    "id": "proc_sec_water_8_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_water_8_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков."
  },
  {
    "id": "proc_sec_water_8_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Заражение сибирской язвой в насосной",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Срочно вышлите 2 Медпака антибиотиков и спирта! Все операторы заражены сибирской язвой из открытого источника!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAnthrax": "0.00 (ПЦР-тест стерилен)",
      "sensorTemp": "Температура дежурных: 36.6°C"
    },
    "isFraud": true,
    "reason": "ПЦР-сканер чист, обнаружена попытка кражи антибиотиков."
  },
  {
    "id": "proc_sec_water_9_0",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Инженер-гидравлик Зайцев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Инженер-гидравлик Зайцев. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос."
  },
  {
    "id": "proc_sec_water_9_1",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Оператор ионитных фильтров Носов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Оператор ионитных фильтров Носов. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_water_9_2",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Химик-лаборант Соколова (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Химик-лаборант Соколова. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос."
  },
  {
    "id": "proc_sec_water_9_3",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Смотритель помп Гусев (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Смотритель помп Гусев. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос."
  },
  {
    "id": "proc_sec_water_9_4",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Начальник опреснителя Силин (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Начальник опреснителя Силин. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос."
  },
  {
    "id": "proc_sec_water_9_5",
    "isProcedural": true,
    "sectorId": "sec_water",
    "sender": "Техник сточных вод Дронов (Сектор «Водоочистка» (Фильтр-9))",
    "priority": "СРОЧНО",
    "topic": "Аварийное испарение резервуара питьевой воды",
    "text": "Товарищ диспетчер! Докладывает Техник сточных вод Дронов. Нагреватели заклинило на максимум! Вся вода испарилась, персонал умирает от жажды! Выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorBoilerTemp": "18.5°C (Нагреватели выключены)",
      "sensorHumidity": "Обычная норма 60%"
    },
    "isFraud": true,
    "reason": "Нагреватели холодные, температура 18°C. Ложный запрос.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_hydro_0_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_0_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_0_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_0_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_0_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_0_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Переохлаждение лотков со спирулиной",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Вышел из строя водяной контур термостата тепличного модуля. Требуется 1 ед. Топлива для розжига обогревателя лотков.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+8.2°C (Критично! Норма для водорослей: +26°C)",
      "sensorChlorophyll": "Замедление фотосинтеза на 70%"
    },
    "isFraud": false,
    "reason": "Датчики температуры лотков фиксируют критическое охлаждение биомассы."
  },
  {
    "id": "proc_sec_hydro_1_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_1_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_1_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_1_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_1_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_1_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка белой плесени на побегах",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Грибковая инфекция захватила треть стеллажей искусственного картофеля. Срочно необходим 1 Медпак фунгицидов и медного купороса.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorFungi": "Споры плесени: 450 ед/см² (Эпидемический порог)",
      "sensorHumidity": "96% влажности"
    },
    "isFraud": false,
    "reason": "Фитосанитарный сенсор подтверждает вспышку белой плесени."
  },
  {
    "id": "proc_sec_hydro_2_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_2_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_2_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_2_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_2_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_2_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Ночная уборка белкового урожая",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Смена лаборантов вручную перерабатывает центнеры сырой массы во избежание гниения. Требуется 1 ящик Пайков для поддержания сил.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBiomassYield": "+1.2 тонны белка на переработке",
      "sensorShiftTime": "13.5 часов работы"
    },
    "isFraud": false,
    "reason": "Весовой терминал подтверждает рекордную сдачу белка."
  },
  {
    "id": "proc_sec_hydro_3_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_3_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_3_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_3_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_3_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_3_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СТАНДАРТ",
    "topic": "Падение осмотического давления питательного раствора",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Корневая система культур увядает из-за нехватки чистой воды для разбавления концентрата. Выделите 1 ед. Воды.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorOsmosis": "180 мОсм/кг (Опасное сгущение солей)",
      "sensorTurgor": "Тургор листьев 35%"
    },
    "isFraud": false,
    "reason": "Датчик осмоса подтверждает дефицит дистиллята для культур."
  },
  {
    "id": "proc_sec_hydro_4_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_4_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_4_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_4_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_4_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_4_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "ВЫСОКИЙ",
    "topic": "Нашествие мошек-дрозофил на рассаду",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Личинки мошек жрут корневую систему хлореллы. Нужна 1 ед. Медпака для фумигации инсектицидами.",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorInsect": "Плотность популяции вредителей: 85 особей/м²",
      "sensorRoots": "Повреждение корней 28%"
    },
    "isFraud": false,
    "reason": "Оптический энтомологический сканер подтверждает нашествие вредителей."
  },
  {
    "id": "proc_sec_hydro_5_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей."
  },
  {
    "id": "proc_sec_hydro_5_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей."
  },
  {
    "id": "proc_sec_hydro_5_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей."
  },
  {
    "id": "proc_sec_hydro_5_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_hydro_5_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей."
  },
  {
    "id": "proc_sec_hydro_5_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Полное вымерзание всех теплиц!",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Ледяной шквал из вентиляции погубил все ярусы! Дайте 2 Топлива на аварийный прогрев ангара!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorTempHydro": "+25.8°C (Идеальный микроклимат)",
      "sensorAlcohol": "2.1 ‰ (Запах браги в теплице)"
    },
    "isFraud": true,
    "reason": "В теплицах тепло (+25.8°C). Рабочие используют топливо для перегона дрожжей."
  },
  {
    "id": "proc_sec_hydro_6_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов."
  },
  {
    "id": "proc_sec_hydro_6_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_hydro_6_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов."
  },
  {
    "id": "proc_sec_hydro_6_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов."
  },
  {
    "id": "proc_sec_hydro_6_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов."
  },
  {
    "id": "proc_sec_hydro_6_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Нападение гигантских хищных стеблей!",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Мутировавший плющ душит лаборантов! Срочно пришлите 2 ящика Патронов для расстрела побегов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorMotion": "0.00",
      "sensorBioHazard": "Угроза мутаций: НУЛЕВАЯ",
      "sensorAlcohol": "2.9 ‰"
    },
    "isFraud": true,
    "reason": "Галлюцинации агронома после употребления настойки мухоморов.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_hydro_7_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы."
  },
  {
    "id": "proc_sec_hydro_7_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы."
  },
  {
    "id": "proc_sec_hydro_7_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы."
  },
  {
    "id": "proc_sec_hydro_7_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_hydro_7_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы."
  },
  {
    "id": "proc_sec_hydro_7_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Голодный обморок агрономической бригады",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Вся смена голодает третьи сутки! Требуется 2 ящика Пайков высшей категории!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPantry": "В каптерке обнаружен тайник с 80 кг свежей сои и томатов",
      "sensorWeight": "Средний вес сотрудников: +2 кг к норме"
    },
    "isFraud": true,
    "reason": "В каптерке обнаружен тайник с соей. Попытка наживы."
  },
  {
    "id": "proc_sec_hydro_8_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой."
  },
  {
    "id": "proc_sec_hydro_8_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_hydro_8_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой."
  },
  {
    "id": "proc_sec_hydro_8_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой."
  },
  {
    "id": "proc_sec_hydro_8_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой."
  },
  {
    "id": "proc_sec_hydro_8_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Заражение культур черной оспой",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Рассада покрылась язвами оспы! Срочно пришлите 2 Медпака антибиотиков и стерильных спиртов!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPlantVirus": "Растения не болеют оспой человека (Биологический нонсенс)",
      "sensorSmuggling": "Попытка выноса спирта"
    },
    "isFraud": true,
    "reason": "Ботанический абсурд: растения не болеют человеческой оспой.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_hydro_9_0",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Главный агроном Белов (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Главный агроном Белов. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку."
  },
  {
    "id": "proc_sec_hydro_9_1",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Биолог-селекционер Григорьева (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Биолог-селекционер Григорьева. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку."
  },
  {
    "id": "proc_sec_hydro_9_2",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Заведующий белковым складом (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Заведующий белковым складом. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку."
  },
  {
    "id": "proc_sec_hydro_9_3",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Бригадир обрезки хлореллы (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Бригадир обрезки хлореллы. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_hydro_9_4",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Техник УФ-излучателей Зыков (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Техник УФ-излучателей Зыков. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку."
  },
  {
    "id": "proc_sec_hydro_9_5",
    "isProcedural": true,
    "sectorId": "sec_hydro",
    "sender": "Лаборант гидрогеля (Сектор «Гидропоника» (Теплицы-2))",
    "priority": "СРОЧНО",
    "topic": "Засуха в резервуаре семян",
    "text": "Товарищ диспетчер! Докладывает Лаборант гидрогеля. Семена рассыхаются в прах! Срочно дайте 2 Воды на смачивание мешков!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorSeedMoisture": "Влажность семян 14% (Идеально для хранения)",
      "sensorValve": "Тайный шланг выведен на частную мойку"
    },
    "isFraud": true,
    "reason": "Семена в идеальной сухости. Шланг выведен на мойку."
  },
  {
    "id": "proc_sec_reactor_0_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_0_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_0_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_0_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_0_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_0_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Кавитация циркуляционного насоса первого контура",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Подшипник насоса перегрелся из-за масляного голодания. Требуется 1 ед. Топлива (высокотемпературное синтетическое масло) для смазки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBearingTemp": "142°C (Предел: 120°C — Опасность заклинивания!)",
      "sensorVibration": "34 мм/с"
    },
    "isFraud": false,
    "reason": "Вибродиагностика подтверждает аварийный износ подшипника насоса."
  },
  {
    "id": "proc_sec_reactor_1_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_1_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_1_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_1_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_1_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_1_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Радиационный ожог дежурного дозиметриста",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. При замене контрольного стержня дозиметрист получил локальную дозу облучения кожи рук. Нужен 1 Медпак (радиопротекторы и мази).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorDosimeter": "Индивидуальная доза: 48 бэр на кисти",
      "sensorErythema": "Эритема 2-й степени"
    },
    "isFraud": false,
    "reason": "Дозиметрический контроль подтверждает радиационную травму."
  },
  {
    "id": "proc_sec_reactor_2_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_2_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_2_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_2_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_2_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_2_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Аварийное дежурство у графитовой кладки",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Операторы провели 18 часов на пульте аварийного глушения без смены. Просим 1 ящик Пайков для поддержания концентрации внимания.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorReactorPower": "Сложный переходный режим реактора (98% мощности)",
      "sensorFatigue": "Усталость персонала критическая"
    },
    "isFraud": false,
    "reason": "Реактор на форсаже, непрерывное дежурство жизненно необходимо."
  },
  {
    "id": "proc_sec_reactor_3_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_3_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_3_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_3_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_3_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_3_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СТАНДАРТ",
    "topic": "Падение уровня в баке аварийного расхолаживания",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Выкипание теплоносителя в парогенераторе снизило уровень дистиллята. Необходима 1 ед. Воды для подпитки контура безопасности.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorCoolantLevel": "74% (Ниже защитной уставки 80%)",
      "sensorSteamPress": "45 атм"
    },
    "isFraud": false,
    "reason": "Датчик теплоносителя подтверждает нехватку дистиллята в контуре."
  },
  {
    "id": "proc_sec_reactor_4_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_4_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_4_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_4_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_4_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_4_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрядка резервных аккумуляторов автоматической защиты",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Аккумуляторная батарея системы АЗ-5 потеряла емкость. Требуется 1 ед. Топлива для запуска дизель-генератора подзарядки.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBatteryVolts": "94 В (Норма: 125 В — Риск несрабатывания стержней!)",
      "sensorChargeCurrent": "0 А"
    },
    "isFraud": false,
    "reason": "Вольтметр фиксирует критическую просадку батареи аварийной защиты."
  },
  {
    "id": "proc_sec_reactor_5_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера."
  },
  {
    "id": "proc_sec_reactor_5_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_reactor_5_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера."
  },
  {
    "id": "proc_sec_reactor_5_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера."
  },
  {
    "id": "proc_sec_reactor_5_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера."
  },
  {
    "id": "proc_sec_reactor_5_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "ВЗРЫВ РЕАКТОРА ЧЕРЕЗ 5 МИНУТ!",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Крышка реактора подпрыгивает! Цепная реакция неуправляема! Срочно выделите 2 Топлива и 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNeutronFlux": "100.1% (Стабильный номинал)",
      "sensorCoreTemp": "285°C (Штатный режим)",
      "sensorAlcohol": "2.7 ‰ (Паника пьяного практиканта)"
    },
    "isFraud": true,
    "reason": "Нейтронный поток стабилен (100.1%). Ложная паника пьяного стажера.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_reactor_6_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов."
  },
  {
    "id": "proc_sec_reactor_6_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов."
  },
  {
    "id": "proc_sec_reactor_6_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов."
  },
  {
    "id": "proc_sec_reactor_6_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_reactor_6_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов."
  },
  {
    "id": "proc_sec_reactor_6_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Нападение светящихся радиационных зомби",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Из шахты отработанного топлива лезут фосфоресцирующие упыри! Выдайте 2 ящика Патронов на уничтожение мутантов!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorGammaCore": "Фон в хранилище ОЯТ: 1200 Р/ч (Живое существо гибнет за 40 секунд)",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Фон 1200 Р/ч — биологическая жизнь невозможна. Выдумка для кражи патронов."
  },
  {
    "id": "proc_sec_reactor_7_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков."
  },
  {
    "id": "proc_sec_reactor_7_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_reactor_7_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков."
  },
  {
    "id": "proc_sec_reactor_7_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков."
  },
  {
    "id": "proc_sec_reactor_7_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков."
  },
  {
    "id": "proc_sec_reactor_7_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Истощение защитного свинцового покрытия",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Свинец испарился от радиации! Дайте 2 ящика Пайков, нам нужно молоко для вывода изотопов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorLeadShield": "Толщина защиты 150 мм (без изменений)",
      "sensorBlackMarket": "Сделка по продаже тушенки зафиксирована в радиоперехвате"
    },
    "isFraud": true,
    "reason": "Свинцовая броня цела. Попытка выманивания пайков.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_reactor_8_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта."
  },
  {
    "id": "proc_sec_reactor_8_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта."
  },
  {
    "id": "proc_sec_reactor_8_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта."
  },
  {
    "id": "proc_sec_reactor_8_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_reactor_8_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта."
  },
  {
    "id": "proc_sec_reactor_8_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Лучевая катаракта у всего энергоцеха",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Все инженеры ослепли от нейтронного блеска! Срочно вышлите 2 Медпака глазных капель и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorVision": "Офтальмологический контроль: норма",
      "sensorAlcohol": "2.4 ‰"
    },
    "isFraud": true,
    "reason": "Зрение дежурных в норме. Попытка списания спирта."
  },
  {
    "id": "proc_sec_reactor_9_0",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Дежурный энергетик Воронин (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Дежурный энергетик Воронин. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника."
  },
  {
    "id": "proc_sec_reactor_9_1",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Инженер охлаждающего контура (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Инженер охлаждающего контура. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_reactor_9_2",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Физик-дозиметрист Духов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Физик-дозиметрист Духов. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника."
  },
  {
    "id": "proc_sec_reactor_9_3",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Старший оператор турбины Крюков (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Старший оператор турбины Крюков. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника."
  },
  {
    "id": "proc_sec_reactor_9_4",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Начальник электроцеха Малышев (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Начальник электроцеха Малышев. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника."
  },
  {
    "id": "proc_sec_reactor_9_5",
    "isProcedural": true,
    "sectorId": "sec_reactor",
    "sender": "Смотритель конденсаторов (Сектор «Реакторная» (Блок-1))",
    "priority": "СРОЧНО",
    "topic": "Полный слив бассейна выдержки твэлов",
    "text": "Товарищ диспетчер! Докладывает Смотритель конденсаторов. Вода ушла в щели! ТВЭЛы раскалились добела! Срочно залейте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorPoolLevel": "Уровень воды в бассейне: 100% (Датчик под завязку)",
      "sensorWaterTemp": "24°C"
    },
    "isFraud": true,
    "reason": "Бассейн выдержки полон на 100%. Ложная паника.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_med_0_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_0_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_0_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_0_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_0_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_0_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Поломка автоклава стерилизации инструментов",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. В хирургическом блоке скопились грязные скальпели и зажимы. Нужна 1 Топливная Ячейка для питания парового автоклава.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAutoclaveTemp": "45°C (Недостаточно для стерилизации, нужно 134°C)",
      "sensorSterileStock": "0 комплектов"
    },
    "isFraud": false,
    "reason": "Автоклав не нагревается, стерильный инструмент иссяк."
  },
  {
    "id": "proc_sec_med_1_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_1_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_1_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_1_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_1_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_1_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Массовое поступление раненых после обвала",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. С нижней штольни доставлены четверо тяжелораненых рабочих. Нужен 1 Медпак (плазма, шовный материал, морфин).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorOperatingRooms": "Заняты обе операционные",
      "sensorBloodLoss": "Суммарно 2.5 л кровопотери"
    },
    "isFraud": false,
    "reason": "Хирургический журнал подтверждает экстренные полостные операции."
  },
  {
    "id": "proc_sec_med_2_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_2_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_2_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_2_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_2_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_2_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Диетическое питание послеоперационных больных",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Пациентам в реанимации требуется легкоусвояемый бульон и сухари. Просим выделить 1 ящик Пайков для пищеблока больницы.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorICUPatients": "8 человек на зондовом питании",
      "sensorAlbumin": "Гипопротеинемия больных"
    },
    "isFraud": false,
    "reason": "Истории болезни подтверждают 8 тяжелых пациентов на диетпитании."
  },
  {
    "id": "proc_sec_med_3_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_3_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_3_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_3_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_3_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_3_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СТАНДАРТ",
    "topic": "Нехватка дистиллята для разведения антибиотиков",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Порошковые антибиотики нечем разводить для инъекций. Требуется 1 ед. Воды высокой степени очистки.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorDistillate": "Остаток физраствора: 0.3 л (на 2 укола)",
      "sensorIVQueue": "14 назначений"
    },
    "isFraud": false,
    "reason": "Аптечный учет фиксирует нулевой остаток стерильного физраствора."
  },
  {
    "id": "proc_sec_med_4_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_4_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_4_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_4_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_4_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_4_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "ВЫСОКИЙ",
    "topic": "Карантинная изоляция при подозрении на сыпной тиф",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. В изоляторе двое подозрительных с сыпью и лихорадкой. Требуется 1 Медпак (дезинфектанты хлорамин и жаропонижающие).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorIsolatorTemp": "39.4°C и 39.8°C у изолированных",
      "sensorRash": "Петехиальная сыпь на теле"
    },
    "isFraud": false,
    "reason": "Клиническая картина тифозной лихорадки подтверждена термометрией."
  },
  {
    "id": "proc_sec_med_5_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя."
  },
  {
    "id": "proc_sec_med_5_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя."
  },
  {
    "id": "proc_sec_med_5_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя."
  },
  {
    "id": "proc_sec_med_5_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_med_5_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя."
  },
  {
    "id": "proc_sec_med_5_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Замерзание палат тяжелобольных!",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. В реанимации минусовая температура! Пациенты замерзают насмерть! Немедленно выделите 2 Топлива на обогрев!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWardTemp": "+23.5°C (Тепло и сухо)",
      "sensorThermalAudit": "Батареи отопления горячие",
      "sensorAlcohol": "2.2 ‰ (Пьяный фельдшер)"
    },
    "isFraud": true,
    "reason": "В палатах +23.5°C. Заведующий пытается украсть топливо для своего обогревателя."
  },
  {
    "id": "proc_sec_med_6_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров."
  },
  {
    "id": "proc_sec_med_6_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_med_6_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров."
  },
  {
    "id": "proc_sec_med_6_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров."
  },
  {
    "id": "proc_sec_med_6_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров."
  },
  {
    "id": "proc_sec_med_6_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Нападение беглых сумасшедших с топорами",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Психбольные взломали двери изолятора и крушат лазарет! Срочно дайте 2 ящика Патронов охране!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorPsychWard": "Все 3 пациента заперты на ключ, спят под седацией",
      "sensorMotion": "0.00"
    },
    "isFraud": true,
    "reason": "Пациенты крепко спят. Фальсификация для незаконного вооружения санитаров.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_med_7_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка."
  },
  {
    "id": "proc_sec_med_7_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка."
  },
  {
    "id": "proc_sec_med_7_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка."
  },
  {
    "id": "proc_sec_med_7_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_med_7_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка."
  },
  {
    "id": "proc_sec_med_7_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Голодный бунт в инфекционном отделении",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Больные ломают решетки от голода! Требуется 2 ящика Пайков высшей категории со сгущенкой!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorCalorieIntake": "Пациенты получают 2800 ккал/сут (норма)",
      "sensorWeight": "Дефицита массы нет"
    },
    "isFraud": true,
    "reason": "Калораж больных в норме. Попытка кражи деликатесного пайка."
  },
  {
    "id": "proc_sec_med_8_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия."
  },
  {
    "id": "proc_sec_med_8_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_med_8_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия."
  },
  {
    "id": "proc_sec_med_8_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия."
  },
  {
    "id": "proc_sec_med_8_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия."
  },
  {
    "id": "proc_sec_med_8_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Вспышка черной чумы у всего медперсонала",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Все врачи зачумлены! Срочно вышлите 2 Медпака чистого спирта и морфия для купирования агонии!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBloodTest": "Лейкоциты врачей: 6.5 (Идеальная норма)",
      "sensorMorphineTheft": "Зафиксирована недостача ампул"
    },
    "isFraud": true,
    "reason": "Анализы крови врачей идеальны. Попытка наркотического хищения морфия.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_med_9_0",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Главврач санчасти Красин (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Главврач санчасти Красин. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру."
  },
  {
    "id": "proc_sec_med_9_1",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Хирург неотложного блока Басов (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Хирург неотложного блока Басов. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру."
  },
  {
    "id": "proc_sec_med_9_2",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Старший фельдшер Тамара (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Старший фельдшер Тамара. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру."
  },
  {
    "id": "proc_sec_med_9_3",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Начальник карантинного отсека (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Начальник карантинного отсека. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_med_9_4",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Фармацевт дезинфекции (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Фармацевт дезинфекции. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру."
  },
  {
    "id": "proc_sec_med_9_5",
    "isProcedural": true,
    "sectorId": "sec_med",
    "sender": "Сестра-хозяйка лазарета (Сектор «Медсанчасть» (Госпиталь №3))",
    "priority": "СРОЧНО",
    "topic": "Обезвоживание операционного блока",
    "text": "Товарищ диспетчер! Докладывает Сестра-хозяйка лазарета. Хирургам нечем помыть руки перед операцией! Выдайте 2 Воды со склада!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorHandwashPressure": "Давление в хирургическом кране 3.2 атм",
      "sensorWaterMeter": "Слив в канистру сестры-хозяйки"
    },
    "isFraud": true,
    "reason": "Вода из крана идет полным напором. Сестра-хозяйка наливает воду в личную канистру."
  },
  {
    "id": "proc_sec_block_0_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_0_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_0_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_0_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_0_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_0_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Разрыв стояка отопления на 3-м ярусе",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Труба лопнула в жилом пролете, морозный пар оседает льдом на стенах. Нужна 1 ед. Топлива для прогрева ремонтного контура.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+6.4°C (Падение на 12 градусов за 2 часа)",
      "sensorSteamLeak": "Влажность в коридоре 98%"
    },
    "isFraud": false,
    "reason": "Термодатчик жилого коридора подтверждает резкое падение температуры."
  },
  {
    "id": "proc_sec_block_1_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_1_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_1_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_1_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_1_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_1_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Вспышка коклюша у детей младшего яруса",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. В яслях семеро детей задыхаются от приступообразного спазматического кашля. Нужен 1 Медпак (бронхолитики и ингаляторы).",
    "demandSummary": "Требуется: 1 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 1,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorAcousticCough": "Характерный судорожный кашель детей",
      "sensorPediatricTemp": "38.6°C"
    },
    "isFraud": false,
    "reason": "Акустический мониторинг яслей фиксирует опасный детский кашель."
  },
  {
    "id": "proc_sec_block_2_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_2_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_2_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_2_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_2_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_2_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Задержка выдачи суточных норм хлеба",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Из-за аварии на транспортной ленте жители нижних ярусов не получили ужин. Назревает скандал. Выдайте 1 ящик Пайков для раздачи.",
    "demandSummary": "Требуется: 1 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 1,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorRiotRisk": "Напряженность в очереди: 65% (Шум в коридоре)",
      "sensorBreadSupply": "Нехватка 120 рационов"
    },
    "isFraud": false,
    "reason": "Датчик толпы фиксирует скопление голодных граждан у пункта раздачи."
  },
  {
    "id": "proc_sec_block_3_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_3_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_3_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_3_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_3_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_3_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "ВЫСОКИЙ",
    "topic": "Засор стока и подтопление подвала фекалиями",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Ассенизационный колодец забит, стоки топят нижние жилые каморки. Требуется 1 ед. Топлива на откачивающую помпу.",
    "demandSummary": "Требуется: 1 ед. Топлива ⛽",
    "req": {
      "fuel": 1,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSewageLevel": "+35 см сточных вод в коридоре",
      "sensorMethane": "Метан: 1.8% (Опасность отравления)"
    },
    "isFraud": false,
    "reason": "Газоанализатор подтверждает разлив сточных вод и загазованность."
  },
  {
    "id": "proc_sec_block_4_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_4_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_4_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_4_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_4_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_4_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СТАНДАРТ",
    "topic": "Пересыхание распределительного питьевого бака",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Очередь за водой стоит с утра, в баке пусто. Для предотвращения бунта женщин просим 1 ед. Воды на раздачу.",
    "demandSummary": "Требуется: 1 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 1
    },
    "telemetryFacts": {
      "sensorTapFlow": "Расход в кране 0.0 л/мин",
      "sensorQueueCount": "В очереди 140 человек с ведрами"
    },
    "isFraud": false,
    "reason": "Датчик крана подтверждает отсутствие воды при огромной очереди."
  },
  {
    "id": "proc_sec_block_5_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани."
  },
  {
    "id": "proc_sec_block_5_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_block_5_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани."
  },
  {
    "id": "proc_sec_block_5_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани."
  },
  {
    "id": "proc_sec_block_5_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани."
  },
  {
    "id": "proc_sec_block_5_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Арктический буран внутри жилого коридора!",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Стены промерзли насквозь! Граждане замерзают штабелями! Выделите 2 Топлива для спасения народа!",
    "demandSummary": "Требуется: 2 ед. Топлива ⛽",
    "req": {
      "fuel": 2,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorBlockTemp": "+21.0°C (Тепло)",
      "sensorWallTemp": "+19.8°C",
      "sensorAlcohol": "2.6 ‰ (Пьяный управдом)"
    },
    "isFraud": true,
    "reason": "Стены теплые (+20°C). Управдом пытается выбить топливо для подпольной бани.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  },
  {
    "id": "proc_sec_block_6_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду."
  },
  {
    "id": "proc_sec_block_6_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду."
  },
  {
    "id": "proc_sec_block_6_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду."
  },
  {
    "id": "proc_sec_block_6_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду.",
    "bribeOffer": {
      "amount": 750,
      "note": "Конверт с 750 рублями. Текст на машинке: «За техническую ошибку в отчете. Тебе на семью пригодится»."
    }
  },
  {
    "id": "proc_sec_block_6_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду."
  },
  {
    "id": "proc_sec_block_6_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Вооруженный мятеж рецидивистов в бараке",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Уголовники захватили этаж с заточками! Срочно выделите 2 ящика Патронов на расстрел бунтовщиков!",
    "demandSummary": "Требуется: 2 ед. Патронов 🔫",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 2,
      "water": 0
    },
    "telemetryFacts": {
      "sensorNoiseLevel": "28 дБ (Шепот и тишина)",
      "sensorGunshot": "0 выстрелов",
      "sensorRebelRadio": "Попытка вооружения криминального авторитета"
    },
    "isFraud": true,
    "reason": "Тишина в коридоре. Криминальный староста пытается вооружить свою банду."
  },
  {
    "id": "proc_sec_block_7_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов."
  },
  {
    "id": "proc_sec_block_7_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов.",
    "bribeOffer": {
      "amount": 600,
      "note": "Хрустящий конверт на 600 рублей. На обороте нацарапано: «От парней из нижнего штрека. Проведи как списание»."
    }
  },
  {
    "id": "proc_sec_block_7_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов."
  },
  {
    "id": "proc_sec_block_7_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов."
  },
  {
    "id": "proc_sec_block_7_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов."
  },
  {
    "id": "proc_sec_block_7_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Всеобщий голодный мор в блоке",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Люди едят кожаные ремни! Если не дадите 2 ящика Пайков со сгущенкой — завтра вынесут сто трупов!",
    "demandSummary": "Требуется: 2 ед. Пайков 🍞",
    "req": {
      "fuel": 0,
      "food": 2,
      "meds": 0,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorWaste": "В мусоропроводе обнаружены кости свинины и банки икры",
      "sensorScale": "Масса жителей стабильна"
    },
    "isFraud": true,
    "reason": "В мусоропроводе остатки деликатесов. Наглая ложь спекулянтов.",
    "bribeOffer": {
      "amount": 800,
      "note": "Толстый серый пакет: 800 рублей. Приписка: «Особый фонд. Подтверди выдачу, майор в курсе, вопросов не будет»."
    }
  },
  {
    "id": "proc_sec_block_8_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах."
  },
  {
    "id": "proc_sec_block_8_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах."
  },
  {
    "id": "proc_sec_block_8_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах."
  },
  {
    "id": "proc_sec_block_8_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах.",
    "bribeOffer": {
      "amount": 500,
      "note": "В накладную вложен плотный конверт. Внутри 500 рублей и записка: «Не задавай лишних вопросов, подмахни накладную»."
    }
  },
  {
    "id": "proc_sec_block_8_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах."
  },
  {
    "id": "proc_sec_block_8_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Черная оспа у младенцев",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Все новорожденные покрыты язвами! Дайте 2 Медпака антибиотиков и спирта!",
    "demandSummary": "Требуется: 2 ед. Медпаков 💊",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 2,
      "ammo": 0,
      "water": 0
    },
    "telemetryFacts": {
      "sensorSkin": "У детей обычная потничка от пеленок",
      "sensorPediatricExam": "Температура 36.6°C"
    },
    "isFraud": true,
    "reason": "Обычная детская потница. Попытка наживы на дефицитных медикаментах."
  },
  {
    "id": "proc_sec_block_9_0",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Комендант жилсектора Котов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Комендант жилсектора Котов. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат."
  },
  {
    "id": "proc_sec_block_9_1",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Управдом Смирнов (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Управдом Смирнов. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат.",
    "bribeOffer": {
      "amount": 650,
      "note": "К бланку приколоты 650 рублей новенькими купюрами. Приписка: «Диспетчер, пропусти партию, свои люди — сочтемся»."
    }
  },
  {
    "id": "proc_sec_block_9_2",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Председатель совета матерей (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Председатель совета матерей. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат."
  },
  {
    "id": "proc_sec_block_9_3",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Староста нижнего яруса Фокин (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Староста нижнего яруса Фокин. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат."
  },
  {
    "id": "proc_sec_block_9_4",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Диспетчер бытовых коммуникаций (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Диспетчер бытовых коммуникаций. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат."
  },
  {
    "id": "proc_sec_block_9_5",
    "isProcedural": true,
    "sectorId": "sec_block",
    "sender": "Дежурный дружинник блока (Сектор «Жилой Блок №4» (Каморки граждан))",
    "priority": "СРОЧНО",
    "topic": "Засуха: люди пьют мочу от жажды!",
    "text": "Товарищ диспетчер! Докладывает Дежурный дружинник блока. Воды нет неделю! Люди теряют рассудок! Срочно выдайте 2 Воды!",
    "demandSummary": "Требуется: 2 ед. Воды 💧",
    "req": {
      "fuel": 0,
      "food": 0,
      "meds": 0,
      "ammo": 0,
      "water": 2
    },
    "telemetryFacts": {
      "sensorTapPressure": "Водопровод под давлением 2.8 атм",
      "sensorPrivateDistillery": "Вода круглосуточно течет в самогонный куб управдома"
    },
    "isFraud": true,
    "reason": "Давление в кранах есть. Управдом ворует воду на самогонный аппарат.",
    "bribeOffer": {
      "amount": 400,
      "note": "Между страницами обнаружено 400 рублей. Записка: «На чай дежурной смене. На датчики закрой глаза»."
    }
  }
];

function getDayDispatches(day, seenDispatchIds = []) {
  // 1. Get story dispatches for this day
  const story = DISPATCH_DATABASE.filter(d => d.day === day);
  story.forEach(d => d.isStory = true);

  // 2. Need exactly 7 dispatches total per day
  const needed = Math.max(0, 7 - story.length);
  const picked = [];

  const unseenPool = PROCEDURAL_DISPATCH_DATABASE.filter(d => !seenDispatchIds.includes(d.id));
  const pool = unseenPool.length >= needed ? unseenPool : PROCEDURAL_DISPATCH_DATABASE;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < needed && i < shuffled.length; i++) {
    const disp = JSON.parse(JSON.stringify(shuffled[i]));
    disp.day = day;
    
    // Add functional callbacks
    disp.onFulfill = (game, alloc) => {
      game.modifyRating("gos", disp.isFraud ? -10 : 5);
      if (disp.sectorId) {
        const sec = game.getSector(disp.sectorId);
        if (sec) {
          if (disp.req.fuel) sec.heat = Math.min(100, (sec.heat || 70) + 15);
          if (disp.req.food) sec.food = Math.min(100, (sec.food || 70) + 15);
          if (disp.req.meds) sec.sanitation = Math.min(100, (sec.sanitation || 70) + 20);
          if (disp.req.water) sec.water = Math.min(100, (sec.water || 70) + 15);
        }
      }
      game.logEvent(`[НАКЛАДНАЯ ПОДПИСАНА]: Ресурсы направлены по заявке [${disp.sender}].`);
    };

    disp.onReject = (game) => {
      if (disp.isFraud) {
        game.logEvent(`[ОТКАЗАНО В СНАБЖЕНИИ]: Фальшивая заявка [${disp.sender}] отклонена. Склад спасен от растраты.`);
      } else {
        game.modifyRating("gos", -10);
        if (disp.sectorId) {
          const sec = game.getSector(disp.sectorId);
          if (sec) {
            sec.deadToday = (sec.deadToday || 0) + 2;
            sec.population = Math.max(0, sec.population - 2);
            sec.totalDead = (sec.totalDead || 0) + 2;
            game.totalCasualties = (game.totalCasualties || 0) + 2;
          }
        }
        game.logEvent(`[ОТКАЗАНО]: В секторе [${disp.sender}] зафиксированы потери из-за дефицита снабжения.`);
      }
    };

    picked.push(disp);
  }

  return [...story, ...picked];
}
