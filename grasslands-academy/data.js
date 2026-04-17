// Grasslands Academy — Data Layer
// Animals, facts, quiz questions, i18n strings

const ANIMALS = [
  {
    id: 'lion',
    name: 'Lion',
    habitat: 'open plain',
    color: '#C8860A',
    maneColor: '#7B4A00',
    svgType: 'lion',
    facts: [
      'Lions are the only cats that live in groups called prides, which can have up to 40 members.',
      'A lion\'s roar can be heard up to 8 kilometres away and is used to communicate with the pride.',
      'Female lions (lionesses) do most of the hunting, usually working together to catch large prey.'
    ]
  },
  {
    id: 'elephant',
    name: 'Elephant',
    habitat: 'open plain',
    color: '#888888',
    svgType: 'elephant',
    facts: [
      'African elephants are the largest land animals on Earth, weighing up to 6,000 kilograms.',
      'Elephants use their trunks to breathe, drink, smell, grab objects and communicate with each other.',
      'Elephants mourn their dead and have been observed returning to the bones of deceased family members.'
    ]
  },
  {
    id: 'zebra',
    name: 'Zebra',
    habitat: 'open plain',
    color: '#EEEEEE',
    stripeColor: '#111111',
    svgType: 'zebra',
    facts: [
      'Every zebra has a unique stripe pattern — no two zebras look exactly the same.',
      'Zebras sleep standing up and only enter deep sleep when other zebras are nearby to watch for danger.',
      'Zebras migrate up to 800 kilometres each year following seasonal rainfall and fresh grass.'
    ]
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    habitat: 'acacia tree',
    color: '#D4A547',
    patchColor: '#8B5E1A',
    svgType: 'giraffe',
    facts: [
      'Giraffes are the tallest animals on Earth, reaching heights of up to 5.5 metres.',
      'A giraffe\'s tongue is about 45 centimetres long and bluish-black to protect it from sunburn.',
      'Giraffes only need 5–30 minutes of sleep per day, often in short naps of a few minutes.'
    ]
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    habitat: 'open plain',
    color: '#D4A54A',
    spotColor: '#333333',
    svgType: 'cheetah',
    facts: [
      'The cheetah is the fastest land animal, reaching speeds of up to 112 kilometres per hour.',
      'Cheetahs cannot roar — instead they purr, chirp and make a high-pitched yelping sound.',
      'Unlike other big cats, cheetahs hunt during the day using exceptional eyesight to spot prey.'
    ]
  },
  {
    id: 'rhino',
    name: 'Rhino',
    habitat: 'riverbank',
    color: '#9E9E8A',
    svgType: 'rhino',
    facts: [
      'A rhinoceros\'s horn is made of keratin — the same material as human fingernails and hair.',
      'Rhinos have poor eyesight but an excellent sense of smell that can detect danger from far away.',
      'White rhinos are actually grey — the name comes from the Afrikaans word "wyd" meaning wide, describing their mouth.'
    ]
  },
  {
    id: 'hippo',
    name: 'Hippo',
    habitat: 'riverbank',
    color: '#7A8C6E',
    svgType: 'hippo',
    facts: [
      'Hippos secrete a natural sunscreen — a reddish oily fluid that protects and moisturises their skin.',
      'Despite being excellent swimmers, hippos cannot actually float; they walk along river and lake beds.',
      'Hippos are more dangerous to humans than lions or crocodiles, causing around 500 deaths per year in Africa.'
    ]
  },
  {
    id: 'buffalo',
    name: 'Buffalo',
    habitat: 'open plain',
    color: '#5C4A3A',
    svgType: 'buffalo',
    facts: [
      'African buffalo have never been domesticated — they are considered one of Africa\'s most dangerous animals.',
      'Buffalo herds can number in the thousands and have a democratic "voting" system for deciding which direction to travel.',
      'Buffalo calves can stand and walk within minutes of being born, which is essential for escaping predators.'
    ]
  },
  {
    id: 'gazelle',
    name: 'Gazelle',
    habitat: 'open plain',
    color: '#C8A86E',
    svgType: 'gazelle',
    facts: [
      'Gazelles can reach speeds of 80 km/h and leap up to 3 metres high to escape predators.',
      'When threatened, gazelles perform "stotting" — bouncing stiffly on all four legs to signal fitness to predators.',
      'Gazelles can survive without water for long periods by getting moisture from the plants they eat.'
    ]
  },
  {
    id: 'meerkat',
    name: 'Meerkat',
    habitat: 'open plain',
    color: '#C4A882',
    svgType: 'meerkat',
    facts: [
      'Meerkats are immune to certain venoms, including scorpion venom and some snake venoms.',
      'Meerkat groups have a sentinel system — one member stands guard while others forage for food.',
      'Meerkats teach their young how to handle dangerous prey before allowing them to eat it.'
    ]
  },
  {
    id: 'wildebeest',
    name: 'Wildebeest',
    habitat: 'open plain',
    color: '#6E6E5A',
    svgType: 'wildebeest',
    facts: [
      'Over 1.5 million wildebeest participate in the Great Migration across the Serengeti each year.',
      'Wildebeest calves can stand within minutes of birth and run at full speed within days.',
      'Wildebeest and zebras often travel together because they eat different parts of the same grass.'
    ]
  },
  {
    id: 'ostrich',
    name: 'Ostrich',
    habitat: 'open plain',
    color: '#2A2A2A',
    featherColor: '#F5F0E8',
    svgType: 'ostrich',
    facts: [
      'Ostriches are the world\'s largest birds and can run at 70 km/h — the fastest two-legged animal.',
      'Ostrich eyes are bigger than their brain, each eye measuring about 5 centimetres in diameter.',
      'Ostriches do not bury their heads in the sand — they lie flat on the ground to hide from predators.'
    ]
  }
];

const QUIZ_QUESTIONS = [
  { q: 'Which grassland animal is the fastest land animal on Earth?', options: ['Lion', 'Cheetah', 'Gazelle', 'Zebra'], answer: 1 },
  { q: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Pride', 'Colony'], answer: 2 },
  { q: 'How far away can a lion\'s roar be heard?', options: ['2 km', '5 km', '8 km', '15 km'], answer: 2 },
  { q: 'What is a giraffe\'s tongue used for?', options: ['Cooling down', 'Reaching leaves and food', 'Making sounds', 'Sensing predators'], answer: 1 },
  { q: 'How tall can giraffes grow?', options: ['3 metres', '4 metres', '5.5 metres', '7 metres'], answer: 2 },
  { q: 'What material is a rhino\'s horn made of?', options: ['Bone', 'Ivory', 'Keratin', 'Cartilage'], answer: 2 },
  { q: 'Which animal has a unique stripe pattern like a fingerprint?', options: ['Cheetah', 'Zebra', 'Giraffe', 'Tiger'], answer: 1 },
  { q: 'How do hippos protect their skin from the sun?', options: ['Rolling in mud only', 'Staying underwater', 'Secreting a natural sunscreen fluid', 'Covering with leaves'], answer: 2 },
  { q: 'How much do African elephants weigh (maximum)?', options: ['2,000 kg', '4,000 kg', '6,000 kg', '10,000 kg'], answer: 2 },
  { q: 'What is "stotting" in gazelles?', options: ['A mating call', 'Bouncing stiffly to signal fitness', 'A type of migration', 'Eating behaviour'], answer: 1 },
  { q: 'Which animal is immune to scorpion venom?', options: ['Mongoose', 'Meerkat', 'Honey badger', 'Warthog'], answer: 1 },
  { q: 'What do meerkats do while others forage for food?', options: ['Sleep', 'Eat separately', 'Stand guard', 'Play'], answer: 2 },
  { q: 'How fast can a cheetah run?', options: ['80 km/h', '95 km/h', '112 km/h', '130 km/h'], answer: 2 },
  { q: 'Why do cheetahs hunt during the day?', options: ['It is cooler', 'They use eyesight to spot prey', 'Prey is slower at day', 'They are afraid of the dark'], answer: 1 },
  { q: 'How many wildebeest participate in the Great Migration?', options: ['500,000', '1 million', '1.5 million', '3 million'], answer: 2 },
  { q: 'Why do wildebeest and zebras travel together?', options: ['For warmth', 'They eat different parts of the same grass', 'Zebras lead the way', 'Protection from lions only'], answer: 1 },
  { q: 'Which animal is the world\'s largest bird?', options: ['Emu', 'Condor', 'Ostrich', 'Flamingo'], answer: 2 },
  { q: 'How fast can an ostrich run?', options: ['40 km/h', '55 km/h', '70 km/h', '90 km/h'], answer: 2 },
  { q: 'African buffalo have never been:', options: ['Hunted', 'Studied', 'Domesticated', 'Photographed'], answer: 2 },
  { q: 'What do buffalo calves do within minutes of birth?', options: ['Eat grass', 'Stand and walk', 'Swim', 'Call for the herd'], answer: 1 },
  { q: 'What is the elephant\'s trunk used for?', options: ['Only drinking', 'Breathing, drinking, smelling and grabbing', 'Only smelling', 'Making sounds only'], answer: 1 },
  { q: 'Elephants are known to:', options: ['Ignore their dead', 'Mourn their dead', 'Fear water', 'Sleep for 12 hours'], answer: 1 },
  { q: 'How do hippos move underwater?', options: ['Swim by paddling', 'Float on the surface', 'Walk along the bottom', 'Use their tail'], answer: 2 },
  { q: 'How many minutes of sleep do giraffes need per day?', options: ['1–2 minutes', '5–30 minutes', '2 hours', '8 hours'], answer: 1 },
  { q: 'Why is the rhino called a "white" rhino?', options: ['Its skin is white', 'From the Afrikaans word for "wide"', 'It was discovered by white explorers', 'Its horn is white'], answer: 1 },
  { q: 'Zebras sleep:', options: ['Lying down alone', 'Standing up with other zebras nearby', 'In trees', 'In burrows'], answer: 1 },
  { q: 'How far can gazelles leap?', options: ['1 metre', '2 metres', '3 metres', '5 metres'], answer: 2 },
  { q: 'Which feature makes each zebra unique?', options: ['Eye colour', 'Hoof shape', 'Stripe pattern', 'Tail length'], answer: 2 },
  { q: 'How many animals make up a lion pride (maximum)?', options: ['10', '20', '40', '100'], answer: 2 },
  { q: 'Who does most of the hunting in a lion pride?', options: ['Male lions', 'Female lions (lionesses)', 'Young lions', 'The pride leader'], answer: 1 }
];

const THREATS = [
  { id: 'poacher', name: 'Poachers', color: '#8B2500', emoji: '🔫', description: 'Illegal hunters targeting animals for horns, ivory and skins.' },
  { id: 'wildfire', name: 'Wildfire', color: '#FF5500', emoji: '🔥', description: 'Uncontrolled fires driven by drought and climate change.' },
  { id: 'drought', name: 'Drought', color: '#B8860B', emoji: '☀️', description: 'Extreme water shortages threatening animals and plants.' },
  { id: 'habitat', name: 'Habitat Loss', color: '#556B2F', emoji: '🏗️', description: 'Grasslands converted to farmland and cities.' },
  { id: 'climate', name: 'Climate Change', color: '#4682B4', emoji: '🌡️', description: 'Rising temperatures altering grassland ecosystems.' }
];

const SUGGESTED_NAMES_MALE = ['Simba', 'Kofi', 'Jabari', 'Amani', 'Zuri', 'Tau', 'Kwame', 'Seun', 'Rafi', 'Ade'];
const SUGGESTED_NAMES_FEMALE = ['Zara', 'Amara', 'Nia', 'Imani', 'Safi', 'Adaeze', 'Lola', 'Nkechi', 'Yemi', 'Temi'];

const YEAR_LEVELS = ['Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'];

const RARITY = {
  common:  { label: 'Common',  mult: 2, chance: 0.6 },
  rare:    { label: 'Rare',    mult: 3, chance: 0.3 },
  special: { label: 'Special', mult: 4, chance: 0.1 }
};

const I18N = {
  en: {
    byNina: 'by Nina',
    play: 'Play',
    worlds: 'Worlds',
    coins: 'Coins',
    level: 'Level',
    translate: 'Translate',
    avatar: 'Avatar',
    quiz: 'Quiz',
    battle: 'Battle',
    next: 'Next',
    back: 'Back',
    correct: 'Correct!',
    wrong: 'Wrong!',
    win: 'You Win!',
    lose: 'Game Over',
    retry: 'Try Again',
    complete: 'Complete!',
    factsTitle: 'Did You Know?',
    equip: 'Equip',
    train: 'Train (+1 stat)',
    attack: 'Attack!',
    hearts: 'Hearts',
    round: 'Round',
    score: 'Score',
    loading: 'Loading…',
    student: 'Student',
    teacher: 'Teacher',
    male: 'Male',
    female: 'Female',
    yourName: 'Your Name',
    yearLevel: 'Year Level',
    className: 'Class Name',
    classCode: 'Class Code',
    createClass: 'Create Class',
    startAdventure: 'Start Adventure!',
    worldLocked: 'Locked',
    worldUnlocked: 'Unlocked'
  },
  es: {
    byNina: 'por Nina',
    play: 'Jugar',
    worlds: 'Mundos',
    coins: 'Monedas',
    level: 'Nivel',
    translate: 'Traducir',
    avatar: 'Avatar',
    quiz: 'Prueba',
    battle: 'Batalla',
    next: 'Siguiente',
    back: 'Atrás',
    correct: '¡Correcto!',
    wrong: '¡Incorrecto!',
    win: '¡Ganaste!',
    lose: 'Juego Terminado',
    retry: 'Intentar de nuevo',
    complete: '¡Completo!',
    factsTitle: '¿Sabías que?',
    equip: 'Equipar',
    train: 'Entrenar (+1)',
    attack: '¡Atacar!',
    hearts: 'Vidas',
    round: 'Ronda',
    score: 'Puntuación',
    loading: 'Cargando…',
    student: 'Estudiante',
    teacher: 'Profesor',
    male: 'Masculino',
    female: 'Femenino',
    yourName: 'Tu Nombre',
    yearLevel: 'Año Escolar',
    className: 'Nombre de Clase',
    classCode: 'Código de Clase',
    createClass: 'Crear Clase',
    startAdventure: '¡Comenzar Aventura!',
    worldLocked: 'Bloqueado',
    worldUnlocked: 'Desbloqueado'
  },
  fr: {
    byNina: 'par Nina',
    play: 'Jouer',
    worlds: 'Mondes',
    coins: 'Pièces',
    level: 'Niveau',
    translate: 'Traduire',
    avatar: 'Avatar',
    quiz: 'Quiz',
    battle: 'Bataille',
    next: 'Suivant',
    back: 'Retour',
    correct: 'Correct !',
    wrong: 'Incorrect !',
    win: 'Vous avez gagné !',
    lose: 'Fin du jeu',
    retry: 'Réessayer',
    complete: 'Terminé !',
    factsTitle: 'Le saviez-vous ?',
    equip: 'Équiper',
    train: 'Entraîner (+1)',
    attack: 'Attaquer !',
    hearts: 'Cœurs',
    round: 'Tour',
    score: 'Score',
    loading: 'Chargement…',
    student: 'Élève',
    teacher: 'Enseignant',
    male: 'Masculin',
    female: 'Féminin',
    yourName: 'Votre Nom',
    yearLevel: 'Année Scolaire',
    className: 'Nom de Classe',
    classCode: 'Code de Classe',
    createClass: 'Créer la Classe',
    startAdventure: 'Commencer l\'Aventure !',
    worldLocked: 'Verrouillé',
    worldUnlocked: 'Déverrouillé'
  },
  pt: {
    byNina: 'por Nina',
    play: 'Jogar',
    worlds: 'Mundos',
    coins: 'Moedas',
    level: 'Nível',
    translate: 'Traduzir',
    avatar: 'Avatar',
    quiz: 'Questionário',
    battle: 'Batalha',
    next: 'Próximo',
    back: 'Voltar',
    correct: 'Correto!',
    wrong: 'Errado!',
    win: 'Você Ganhou!',
    lose: 'Fim de Jogo',
    retry: 'Tentar Novamente',
    complete: 'Completo!',
    factsTitle: 'Você Sabia?',
    equip: 'Equipar',
    train: 'Treinar (+1)',
    attack: 'Atacar!',
    hearts: 'Vidas',
    round: 'Rodada',
    score: 'Pontuação',
    loading: 'Carregando…',
    student: 'Estudante',
    teacher: 'Professor',
    male: 'Masculino',
    female: 'Feminino',
    yourName: 'Seu Nome',
    yearLevel: 'Ano Escolar',
    className: 'Nome da Turma',
    classCode: 'Código da Turma',
    createClass: 'Criar Turma',
    startAdventure: 'Começar Aventura!',
    worldLocked: 'Bloqueado',
    worldUnlocked: 'Desbloqueado'
  },
  zh: {
    byNina: '作者：Nina',
    play: '开始游戏',
    worlds: '世界',
    coins: '金币',
    level: '等级',
    translate: '翻译',
    avatar: '头像',
    quiz: '测验',
    battle: '战斗',
    next: '下一步',
    back: '返回',
    correct: '正确！',
    wrong: '错误！',
    win: '你赢了！',
    lose: '游戏结束',
    retry: '再试一次',
    complete: '完成！',
    factsTitle: '你知道吗？',
    equip: '装备',
    train: '训练 (+1)',
    attack: '攻击！',
    hearts: '生命',
    round: '回合',
    score: '分数',
    loading: '加载中…',
    student: '学生',
    teacher: '老师',
    male: '男',
    female: '女',
    yourName: '你的名字',
    yearLevel: '年级',
    className: '班级名称',
    classCode: '班级代码',
    createClass: '创建班级',
    startAdventure: '开始冒险！',
    worldLocked: '锁定',
    worldUnlocked: '已解锁'
  },
  hi: {
    byNina: 'Nina द्वारा',
    play: 'खेलें',
    worlds: 'दुनिया',
    coins: 'सिक्के',
    level: 'स्तर',
    translate: 'अनुवाद',
    avatar: 'अवतार',
    quiz: 'प्रश्नोत्तरी',
    battle: 'युद्ध',
    next: 'अगला',
    back: 'वापस',
    correct: 'सही!',
    wrong: 'गलत!',
    win: 'आप जीत गए!',
    lose: 'खेल खत्म',
    retry: 'फिर कोशिश करें',
    complete: 'पूर्ण!',
    factsTitle: 'क्या आप जानते हैं?',
    equip: 'पहनें',
    train: 'प्रशिक्षण (+1)',
    attack: 'हमला!',
    hearts: 'दिल',
    round: 'राउंड',
    score: 'स्कोर',
    loading: 'लोड हो रहा है…',
    student: 'छात्र',
    teacher: 'शिक्षक',
    male: 'पुरुष',
    female: 'महिला',
    yourName: 'आपका नाम',
    yearLevel: 'कक्षा',
    className: 'कक्षा का नाम',
    classCode: 'कक्षा कोड',
    createClass: 'कक्षा बनाएं',
    startAdventure: 'साहसिक शुरू करें!',
    worldLocked: 'बंद',
    worldUnlocked: 'खुला'
  }
};

const LANG_MAP = {
  english: 'en', español: 'es', spanish: 'es', french: 'fr', français: 'fr',
  portuguese: 'pt', português: 'pt', chinese: 'zh', mandarin: 'zh', '中文': 'zh',
  hindi: 'hi', हिंदी: 'hi'
};

const WORLD_DEFS = [
  { id: 1, name: 'Grassland Puzzles',    color: '#4CAF50', icon: '🌿', biome: 'grassland' },
  { id: 2, name: 'Savanna Battle Arena', color: '#FF9800', icon: '⚔️',  biome: 'savanna'   },
  { id: 3, name: 'Quiz World',           color: '#2196F3', icon: '❓',  biome: 'quiz'      },
  { id: 4, name: 'Mini-Game Hub',        color: '#9C27B0', icon: '🎮',  biome: 'games'     },
  { id: 5, name: 'Final Boss Challenge', color: '#F44336', icon: '👑',  biome: 'boss'      }
];
