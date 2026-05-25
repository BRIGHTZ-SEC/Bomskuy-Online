'use strict';
// BOMSKUY BY BRIGHTZ-SEC
console.log("💣 BOMSKUY Combat System Loaded. Please dont hek");

// ─── SPRITE ASSETS PRELOADING ────────────────
const spriteAssets = {
  player: {
    all: new Image(),
    sejarah: new Image(),
    pkn: new Image(),
    agama: new Image(),
    allBack: new Image(),
    sejarahBack: new Image(),
    pknBack: new Image(),
    agamaBack: new Image()
  },
  enemy: {
    all: new Image(),
    sejarah: new Image(),
    pkn: new Image(),
    agama: new Image(),
    allBack: new Image(),
    sejarahBack: new Image(),
    pknBack: new Image(),
    agamaBack: new Image()
  }
};

spriteAssets.player.all.src = 'sprite_player_default.png';
spriteAssets.player.sejarah.src = 'sprite_player_sejarah.png';
spriteAssets.player.pkn.src = 'sprite_player_pkn.png';
spriteAssets.player.agama.src = 'sprite_player_agama.png';
spriteAssets.player.allBack.src = 'sprite_player_default_back.png';
spriteAssets.player.sejarahBack.src = 'sprite_player_sejarah_back.png';
spriteAssets.player.pknBack.src = 'sprite_player_pkn_back.png';
spriteAssets.player.agamaBack.src = 'sprite_player_agama_back.png';

spriteAssets.enemy.all.src = 'sprite_enemy_default.png';
spriteAssets.enemy.sejarah.src = 'sprite_enemy_sejarah.png';
spriteAssets.enemy.pkn.src = 'sprite_enemy_pkn.png';
spriteAssets.enemy.agama.src = 'sprite_enemy_agama.png';
spriteAssets.enemy.allBack.src = 'sprite_enemy_default_back.png';
spriteAssets.enemy.sejarahBack.src = 'sprite_enemy_sejarah_back.png';
spriteAssets.enemy.pknBack.src = 'sprite_enemy_pkn_back.png';
spriteAssets.enemy.agamaBack.src = 'sprite_enemy_agama_back.png';


// ─── CONSTANTS ─────────────────────────────
let COLS = 15;
let ROWS = 9;
const BOMB_FUSE = 2500;
const EXPLOSION_MS = 650;
const MAX_LIVES = 3;
const ENEMY_COUNT = 4;
const SCORE_KILL = 100;
const SCORE_ITEM = 15;
const SCORE_QUIZ = 200;
const RESPAWN_MS = 2000;
const SPEED_BASE = 175;    // kecepatan gerak awal
const SPEED_BOOST = 100;    // kecepatan tambahkan power up
const SPEED_DUR = 10000;  // durasi speed power up
const BASE_RADIUS = 2;      // radius ledakan dasar
const BASE_BOMBS = 2;      // max bom default
// ENEMY_MS ditentukan dari difficulty setting
const ENEMY_MS_MAP = { easy: 950, normal: 750, hard: 500 };
const MAX_TILE = 88;     // max tile size (HD)

// Tile IDs
const T_EMPTY = 0, T_WALL = 1, T_BRICK = 2, T_ITEM = 3;

// Power-up types
const PU_SPEED = 'speed', PU_BLAST = 'blast', PU_BOMB = 'bomb', PU_QUIZ = 'quiz';
const PU_SHIELD = 'shield', PU_FREEZE = 'freeze', PU_MAGNET = 'magnet', PU_HEART = 'heart';
const SHIELD_DUR = 8000, FREEZE_DUR = 5000, MAGNET_DUR = 12000;
const SCORE_MULTI = 2; // magnet score multiplier

// ─── Letak Soal ──────────────────────────────
const QUIZ_BANK = [
  // ── SEJARAH ──
  {
    subj: 'Sejarah', q: 'Kapan Indonesia merdeka?',
    opts: ['17 Agustus 1945', '17 Agustus 1944', '17 Juli 1945', '8 Agustus 1945'], ans: 0
  },
  {
    subj: 'Sejarah', q: 'Siapa yang memproklamasikan kemerdekaan Indonesia?',
    opts: ['Soekarno saja', 'Mohammad Hatta saja', 'Soekarno dan Mohammad Hatta', 'Soepomo dan Yamin'], ans: 2
  },
  {
    subj: 'Sejarah', q: 'Pada tahun berapa Sumpah Pemuda diikrarkan?',
    opts: ['1926', '1927', '1928', '1930'], ans: 2
  },
  {
    subj: 'Sejarah', q: 'Pahlawan wanita Indonesia yang berjuang dari Aceh melawan Belanda?',
    opts: ['R.A. Kartini', 'Dewi Sartika', 'Cut Nyak Dhien', 'Martha Christina Tiahahu'], ans: 2
  },
  {
    subj: 'Sejarah', q: 'Apa nama perjanjian yang mengakui kedaulatan RI oleh Belanda (1949)?',
    opts: ['Perjanjian Renville', 'Konferensi Meja Bundar', 'Perjanjian Linggarjati', 'Perjanjian Roem-Royen'], ans: 1
  },
  {
    subj: 'Sejarah', q: 'Kerajaan Majapahit mencapai puncak kejayaan dipimpin oleh?',
    opts: ['Raden Wijaya', 'Gajah Mada', 'Hayam Wuruk', 'Ken Arok'], ans: 2
  },
  {
    subj: 'Sejarah', q: 'Boedi Oetomo didirikan pada tanggal?',
    opts: ['20 Mei 1908', '17 Agustus 1908', '28 Oktober 1908', '2 Mei 1908'], ans: 0
  },
  {
    subj: 'Sejarah', q: 'Siapa tokoh yang dikenal sebagai Bapak Koperasi Indonesia?',
    opts: ['Soekarno', 'Mohammad Hatta', 'Sri Sultan', 'Soepomo'], ans: 1
  },
  {
    subj: 'Sejarah', q: 'Peristiwa Rengasdengklok bertujuan untuk?',
    opts: ['Menculik Soekarno-Hatta agar segera proklamasi', 'Mengusir Belanda', 'Memilih presiden', 'Menyiapkan konstitusi'], ans: 0
  },
  {
    subj: 'Sejarah', q: 'Kerajaan Hindu tertua di Indonesia adalah?',
    opts: ['Sriwijaya', 'Kutai', 'Tarumanegara', 'Majapahit'], ans: 1
  },
  // ── PKN ──
  {
    subj: 'PKN', q: 'Apa dasar negara Republik Indonesia?',
    opts: ['UUD 1945', 'Pancasila', 'GBHN', 'Bhinneka Tunggal Ika'], ans: 1
  },
  {
    subj: 'PKN', q: 'Berapa jumlah sila dalam Pancasila?',
    opts: ['3', '4', '5', '6'], ans: 2
  },
  {
    subj: 'PKN', q: 'Apa bunyi sila ke-3 Pancasila?',
    opts: ['Ketuhanan Yang Maha Esa', 'Kemanusiaan yang adil dan beradab', 'Persatuan Indonesia', 'Kerakyatan yang dipimpin oleh hikmat'], ans: 2
  },
  {
    subj: 'PKN', q: 'Semboyan negara Indonesia adalah?',
    opts: ['Pancasila', 'Bhinneka Tunggal Ika', 'Garuda Pancasila', 'Bersatu Kita Teguh'], ans: 1
  },
  {
    subj: 'PKN', q: 'Lembaga yang berwenang membuat undang-undang di Indonesia adalah?',
    opts: ['DPR', 'MPR', 'DPD', 'Mahkamah Agung'], ans: 0
  },
  {
    subj: 'PKN', q: 'Hak dasar yang dimiliki setiap warga negara Indonesia disebut?',
    opts: ['Hak Asasi Manusia', 'Kewajiban warga negara', 'Hak Prerogatif', 'Hak Eksklusif'], ans: 0
  },
  {
    subj: 'PKN', q: 'UUD 1945 disahkan oleh PPKI pada tanggal?',
    opts: ['17 Agustus 1945', '18 Agustus 1945', '19 Agustus 1945', '20 Agustus 1945'], ans: 1
  },
  {
    subj: 'PKN', q: 'Lambang negara Indonesia adalah?',
    opts: ['Bendera Merah Putih', 'Garuda Pancasila', 'Bhinneka Tunggal Ika', 'Istana Negara'], ans: 1
  },
  {
    subj: 'PKN', q: 'Sistem pemerintahan Indonesia adalah?',
    opts: ['Parlementer', 'Presidensial', 'Monarki', 'Federal'], ans: 1
  },
  {
    subj: 'PKN', q: 'Bunyi sila ke-5 Pancasila adalah?',
    opts: ['Persatuan Indonesia', 'Kerakyatan yang dipimpin oleh hikmat', 'Keadilan sosial bagi seluruh rakyat Indonesia', 'Ketuhanan Yang Maha Esa'], ans: 2
  },
  // ── AGAMA ISLAM ──
  {
    subj: 'Agama Islam', q: 'Berapa jumlah rukun Islam?',
    opts: ['4', '5', '6', '7'], ans: 1
  },
  {
    subj: 'Agama Islam', q: 'Rukun Islam yang pertama adalah?',
    opts: ['Sholat', 'Puasa', 'Syahadat', 'Zakat'], ans: 2
  },
  {
    subj: 'Agama Islam', q: 'Berapa jumlah rukun iman dalam Islam?',
    opts: ['4', '5', '6', '7'], ans: 2
  },
  {
    subj: 'Agama Islam', q: 'Kitab suci umat Islam adalah?',
    opts: ['Injil', 'Taurat', 'Al-Quran', 'Zabur'], ans: 2
  },
  {
    subj: 'Agama Islam', q: 'Nabi dan Rasul terakhir dalam Islam adalah?',
    opts: ['Nabi Isa AS', 'Nabi Musa AS', 'Nabi Ibrahim AS', 'Nabi Muhammad SAW'], ans: 3
  },
  {
    subj: 'Agama Islam', q: 'Sholat wajib umat Islam sehari semalam berjumlah berapa waktu?',
    opts: ['3 waktu', '4 waktu', '5 waktu', '6 waktu'], ans: 2
  },
  {
    subj: 'Agama Islam', q: 'Zakat fitrah dikeluarkan pada bulan?',
    opts: ['Rajab', 'Syaban', 'Ramadan', 'Syawal'], ans: 2
  },
  {
    subj: 'Agama Islam', q: 'Berapa jumlah malaikat yang wajib diimani dalam rukun iman?',
    opts: ['10', '20', '25', '99'], ans: 0
  },
  {
    subj: 'Agama Islam', q: 'Apa yang dimaksud dengan ibadah haji?',
    opts: ['Puasa di bulan Ramadan', 'Ziarah ke Mekkah', 'Membayar zakat', 'Membaca Al-Quran'], ans: 1
  },
  {
    subj: 'Agama Islam', q: 'Surat pertama dalam Al-Quran adalah?',
    opts: ['Al-Baqarah', 'An-Nas', 'Al-Fatihah', 'Al-Ikhlas'], ans: 2
  },
];

// ─── COLORS ────────────────────────────────
const C = {
  bg: '#0a0a12', wall: '#1c1c2e', wallEdge: '#282845', wallShine: '#363660',
  brick: '#7a3218', brickEdge: '#5c1f08', brickShine: '#c04a28',
  empty: '#131320', emptyGrid: '#18182a',
  player: '#00e5ff', playerDark: '#004d6b',
  enemy: '#ff1744', enemyDark: '#5c0011',
  bomb: '#111', bombShine: '#333', fuse: '#ff8800',
  expl1: '#ffdd00', expl2: '#ff7700', expl3: '#ff2200',
};


// ─── TEMA MAPEL ────────────────────────────────────────────
// 'all' = campur semua soal, 'sejarah' / 'pkn' / 'agama'
let currentTheme = 'all';

const THEMES = {
  all: {
    name: 'Semua Mapel', icon: '🎓',
    label: 'Sejarah · PKN · Agama Islam',
    // Warna tile
    bg: '#0a0a12', wall: '#1c1c2e', wallEdge: '#282845', wallShine: '#363660',
    brick: '#7a3218', brickEdge: '#5c1f08', brickShine: '#c04a28',
    empty: '#131320', emptyGrid: '#18182a',
    // Warna karakter
    player: '#00e5ff', playerDark: '#004d6b',
    enemy: '#ff1744', enemyDark: '#5c0011',
    // Aksen HUD
    accent: '#ffcc00', accentGlow: 'rgba(255,204,0,.8)',
    // Dekorasi peta (ikon di tile kosong)
    mapIcon: null,
    // BGM speed multiplier
    bgmTempo: 1,
  },
  sejarah: {
    name: 'Sejarah', icon: '🏛️',
    label: 'Pejuang vs Tentara Belanda',
    bg: '#0f0a04', wall: '#2a1a08', wallEdge: '#3d2610', wallShine: '#6b4020',
    brick: '#5c3010', brickEdge: '#3d1e08', brickShine: '#c87840',
    empty: '#120d06', emptyGrid: '#1e1408',
    player: '#ffd700', playerDark: '#7a6000',
    enemy: '#8b0000', enemyDark: '#3d0000',
    accent: '#ffd700', accentGlow: 'rgba(255,215,0,.8)',
    mapIcon: null,
    bgmTempo: 0.9,
  },
  pkn: {
    name: 'PKN', icon: '⚖️',
    label: 'Pengacara vs Penjahat',
    bg: '#04080f', wall: '#081828', wallEdge: '#0c2040', wallShine: '#1a4080',
    brick: '#0a2040', brickEdge: '#061428', brickShine: '#2060c0',
    empty: '#060c18', emptyGrid: '#0a1428',
    player: '#4fc3f7', playerDark: '#01579b',
    enemy: '#f50057', enemyDark: '#880e4f',
    accent: '#4fc3f7', accentGlow: 'rgba(79,195,247,.8)',
    mapIcon: null,
    bgmTempo: 1.1,
  },
  agama: {
    name: 'Agama Islam', icon: '☪️',
    label: 'Santri vs Setan',
    bg: '#040f08', wall: '#082018', wallEdge: '#0c3020', wallShine: '#1a6040',
    brick: '#083018', brickEdge: '#052010', brickShine: '#20a060',
    empty: '#060c08', emptyGrid: '#0a1810',
    player: '#69f0ae', playerDark: '#00695c',
    enemy: '#ff6d00', enemyDark: '#7f3300',
    accent: '#69f0ae', accentGlow: 'rgba(105,240,174,.8)',
    mapIcon: null,
    bgmTempo: 0.95,
  },
};

function getTheme() { return THEMES[currentTheme] || THEMES.all; }

// Filter soal sesuai tema
function getQuizBank() {
  if (currentTheme === 'all') return QUIZ_BANK;
  const map = { sejarah: 'Sejarah', pkn: 'PKN', agama: 'Agama Islam' };
  const subj = map[currentTheme];
  return QUIZ_BANK.filter(q => q.subj === subj);
}

// Terapkan warna tema ke objek C
function applyTheme() {
  const t = getTheme();
  C.bg = t.bg; C.wall = t.wall; C.wallEdge = t.wallEdge; C.wallShine = t.wallShine;
  C.brick = t.brick; C.brickEdge = t.brickEdge; C.brickShine = t.brickShine;
  C.empty = t.empty; C.emptyGrid = t.emptyGrid;
  C.player = t.player; C.playerDark = t.playerDark;
  C.enemy = t.enemy; C.enemyDark = t.enemyDark;
  // Update CSS accent di HUD
  const root = document.documentElement;
  root.style.setProperty('--acc2', t.accent);
  root.style.setProperty('--gY', '0 0 14px ' + t.accentGlow + ',0 0 32px ' + t.accentGlow.replace('.8', '.3'));
  // Update tema badge di game header
  const badge = document.getElementById('hud-theme-badge');
  if (badge) { badge.textContent = t.icon + ' ' + t.name; }

  // Apply theme class to game screen for themed background
  const gameScreen = document.getElementById('screen-game');
  if (gameScreen) {
    gameScreen.className = gameScreen.className.replace(/\btheme-\S+/g, '').trim();
    if (currentTheme !== 'all') {
      gameScreen.classList.add('theme-' + currentTheme);
    }
  }
  // Apply theme class to win & gameover screens
  const winScreen = document.getElementById('screen-win');
  if (winScreen) {
    winScreen.className = winScreen.className.replace(/\btheme-\S+/g, '').trim();
    if (currentTheme !== 'all') {
      winScreen.classList.add('theme-' + currentTheme);
    }
  }
  const goScreen = document.getElementById('screen-gameover');
  if (goScreen) {
    goScreen.className = goScreen.className.replace(/\btheme-\S+/g, '').trim();
    if (currentTheme !== 'all') {
      goScreen.classList.add('theme-' + currentTheme);
    }
  }
}

// ─── STATE ─────────────────────────────────
let st = {};
let animFr = null, enemyTimer = null, clockTimer = null;
let keysHeld = {}, lastMoveTs = 0;
let quizInterval = null, quizData = null;
let currentEntryId = null, currentLbTab = 'all';
let lastHudState = {};
let isJoystickActive = false;

// ─── MULTIPLAYER STATE (Firebase + WebRTC) ────────
let isMultiplayer = false;
let isHost = false;
let myRole = '';
let roomCode = '';
let myLobbyName = '';
let callsignMode = 'single';
let lobbyTheme = 'all';
let lobbyDifficulty = 'normal';
let lobbyMaxLevels = 5;
let peerHeartbeatInterval = null;

let opponentState = {
  row: 1, col: 1, renderX: 1, renderY: 1,
  dir: 'down', alive: false, lives: 3, score: 0,
  invincible: false, speedActive: false, blastLevel: 0, name: 'LAWAN'
};

// WebRTC + Firebase signaling
let rtcPeer = null;
let dataChannel = null;
let firebaseDb = null;
let roomRef = null;
let fbListeners = [];

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2CC4PWoKpPsSlNQIXmYnxe4fmRh_dQT4",
  authDomain: "bomskuy-online.firebaseapp.com",
  databaseURL: "https://bomskuy-online-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bomskuy-online",
  storageBucket: "bomskuy-online.firebasestorage.app",
  messagingSenderId: "468195869653",
  appId: "1:468195869653:web:4120e6615a1d9f46b1b35c"
};

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ]
};

let fetchedIceServers = null;

async function getIceServersConfig() {
  if (fetchedIceServers) {
    return { iceServers: fetchedIceServers };
  }
  try {
    console.log("Fetching TURN servers from Metered...");
    const response = await fetch("https://bomskuyjaya.metered.live/api/v1/turn/credentials?apiKey=03efbbd5d915adbbfae28df0d4b230fe8df6");
    if (!response.ok) {
      throw new Error(`Failed to fetch TURN credentials: ${response.statusText}`);
    }
    const servers = await response.json();
    fetchedIceServers = servers;
    console.log("TURN servers fetched successfully:", servers);
    return { iceServers: servers };
  } catch (err) {
    console.error("Failed to fetch TURN servers, using fallback Google STUN:", err);
    return ICE_SERVERS;
  }
}


const activeConn = {
  get open() { return dataChannel && dataChannel.readyState === 'open'; },
  send(data) {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(data));
    }
  }
};

// ─── SETTINGS STATE ────────────────────────
let currentDifficulty = 'normal';
let maxLevels = 5;
function getEnemyMs() { return ENEMY_MS_MAP[currentDifficulty] || 750; }

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// ─── HELPERS ───────────────────────────────
const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const getTile = () => parseInt(canvas.dataset.tile || 40, 10);

// ─── SCREEN ────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));
}

// ─── MAP GENERATION ────────────────────────
function generateMap(brickDensity = 0.55) {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) grid[r][c] = T_WALL;
      else if (r % 2 === 0 && c % 2 === 0) grid[r][c] = T_WALL;
      else grid[r][c] = Math.random() < brickDensity ? T_BRICK : T_EMPTY;
    }
  }
  const safe = [
    { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 1 }, { r: 1, c: 3 },
    { r: 1, c: COLS - 2 }, { r: 1, c: COLS - 3 }, { r: 2, c: COLS - 2 },
    { r: ROWS - 2, c: 1 }, { r: ROWS - 2, c: 2 }, { r: ROWS - 3, c: 1 },
    { r: ROWS - 2, c: COLS - 2 }, { r: ROWS - 2, c: COLS - 3 }, { r: ROWS - 3, c: COLS - 2 },
    { r: 3, c: COLS - 4 }, { r: 3, c: COLS - 5 }, { r: 4, c: COLS - 4 },
    { r: ROWS - 2, c: Math.floor(COLS / 2) }, { r: 1, c: Math.floor(COLS / 2) },
    { r: Math.floor(ROWS / 2), c: 1 }, { r: Math.floor(ROWS / 2), c: COLS - 2 },
  ];
  safe.forEach(({ r, c }) => { if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = T_EMPTY; });
  return grid;
}

// ─── INIT STATE ────────────────────────────
function initState(name, levelNum = 1, isMulti = false) {
  if (isMulti) {
    const ec = Math.min(3 + levelNum, 8);
    return {
      name,
      grid: [], // Host generates authoritative grid and sends to Guest
      level: 1,
      player: {
        row: isHost ? 1 : ROWS - 2,
        col: isHost ? 1 : COLS - 2,
        renderX: isHost ? 1 : COLS - 2,
        renderY: isHost ? 1 : ROWS - 2,
        alive: true,
        lives: MAX_LIVES,
        invincible: false,
        invincibleUntil: 0,
        blastLevel: 0,
        bombCap: BASE_BOMBS,
        speedActive: false,
        speedUntil: 0,
        dir: isHost ? 'down' : 'up'
      },
      enemies: makeEnemies(ec, true), // Spawns enemies even in multiplayer!
      bombs: [], explosions: [], powerups: [],
      score: 0, kills: 0, seconds: 0, quizCorrect: 0,
      bombsAvail: BASE_BOMBS,
      running: false, paused: false, over: false, won: false, quizOpen: false,
      combo: 0, comboTimer: null,
      totalBombs: 0, speedCollected: 0, quizStreak: 0, livesLost: 0,
      achievements: new Set(),
      freezeActive: false, freezeUntil: 0,
      magnetActive: false, magnetUntil: 0,
    };
  }

  const bd = Math.min(0.55 + (levelNum - 1) * 0.05, 0.75);
  const ec = Math.min(3 + levelNum, 8);
  return {
    name, grid: generateMap(bd),
    level: levelNum,
    player: { row: 1, col: 1, renderX: 1, renderY: 1, alive: true, lives: MAX_LIVES, invincible: false, invincibleUntil: 0, blastLevel: 0, bombCap: BASE_BOMBS, speedActive: false, speedUntil: 0, dir: 'down' },
    enemies: makeEnemies(ec),
    bombs: [], explosions: [], powerups: [],
    score: 0, kills: 0, seconds: 0, quizCorrect: 0,
    bombsAvail: BASE_BOMBS,
    running: false, paused: false, over: false, won: false, quizOpen: false,
    combo: 0, comboTimer: null,
    totalBombs: 0, speedCollected: 0, quizStreak: 0, livesLost: 0,
    achievements: new Set(),
    freezeActive: false, freezeUntil: 0,
    magnetActive: false, magnetUntil: 0,
  };
}

function makeEnemies(count = 4, isMulti = false) {
  let pos = [];
  if (isMulti) {
    pos = [
      { row: 1, col: COLS - 2 },
      { row: ROWS - 2, col: 1 },
      { row: 3, col: COLS - 4 },
      { row: ROWS - 4, col: 3 },
      { row: Math.floor(ROWS / 2), col: 5 },
      { row: Math.floor(ROWS / 2), col: COLS - 6 },
      { row: 5, col: Math.floor(COLS / 2) },
      { row: ROWS - 6, col: Math.floor(COLS / 2) }
    ];
  } else {
    pos = [
      { row: 1, col: COLS - 2 }, { row: ROWS - 2, col: 1 }, { row: ROWS - 2, col: COLS - 2 }, { row: 3, col: COLS - 4 },
      { row: ROWS - 2, col: Math.floor(COLS / 2) }, { row: 1, col: Math.floor(COLS / 2) },
      { row: Math.floor(ROWS / 2), col: 1 }, { row: Math.floor(ROWS / 2), col: COLS - 2 },
    ];
  }
  return pos.slice(0, count).map((p, i) => ({ id: i, row: p.row, col: p.col, renderX: p.col, renderY: p.row, alive: true, stuckCount: 0, dir: 'down' }));
}

function getRadius() { return BASE_RADIUS + st.player.blastLevel; }

// ─── CANVAS SIZING (HD with devicePixelRatio) ─
function sizeCanvas() {
  const header = document.querySelector('.game-header');
  const footer = document.querySelector('.game-footer');
  const hH = header ? header.offsetHeight : 0;
  const fH = footer ? footer.offsetHeight : 0;
  // FIX: kurangi area dengan tinggi d-pad agar canvas tidak tertutup
  const dpad = document.getElementById('dpad');
  const dpadH = (dpad && dpad.style.display !== 'none') ? dpad.offsetHeight : 0;
  const aW = window.innerWidth - 4;
  const aH = window.innerHeight - hH - fH - dpadH - 4;
  // OPTIMIZATION: Cap devicePixelRatio to 1.5 on mobile/touch devices to dramatically reduce rendering load and prevent typing lag
  const dpr = isTouchDevice() ? Math.min(1.5, window.devicePixelRatio || 1) : (window.devicePixelRatio || 1);
  const tile = Math.max(24, Math.min(Math.floor(aW / COLS), Math.floor(aH / ROWS), MAX_TILE));
  // Logical size (CSS pixels)
  const logW = COLS * tile;
  const logH = ROWS * tile;
  // Physical size (actual pixels for HD)
  canvas.width = Math.round(logW * dpr);
  canvas.height = Math.round(logH * dpr);
  canvas.style.width = logW + 'px';
  canvas.style.height = logH + 'px';
  canvas.dataset.tile = tile;
  canvas.dataset.dpr = dpr;
  // Scale context to match dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ─── DRAW TILE (THEMED) ────────────────────
function drawTile(tile, r, c) {
  const T = getTile(), x = c * T, y = r * T;
  const theme = currentTheme;

  if (tile === T_WALL) {
    // Base wall
    ctx.fillStyle = C.wall; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = C.wallEdge; ctx.fillRect(x + T - 3, y, 3, T); ctx.fillRect(x, y + T - 3, T, 3);
    ctx.fillStyle = C.wallShine; ctx.fillRect(x, y, T, 2); ctx.fillRect(x, y, 2, T);

    // Theme-specific wall decoration
    if (theme === 'sejarah') {
      // Bamboo texture lines
      ctx.strokeStyle = 'rgba(139, 90, 20, 0.25)'; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + T * (0.25 + i * 0.25), y);
        ctx.lineTo(x + T * (0.25 + i * 0.25), y + T);
        ctx.stroke();
      }
      // Bamboo knot
      ctx.fillStyle = 'rgba(100, 60, 10, 0.2)';
      ctx.fillRect(x + 2, y + T * 0.45, T - 4, 3);
    } else if (theme === 'pkn') {
      // Marble veins
      ctx.strokeStyle = 'rgba(100, 140, 200, 0.12)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + T * 0.1, y + T * 0.3);
      ctx.bezierCurveTo(x + T * 0.4, y + T * 0.2, x + T * 0.6, y + T * 0.7, x + T * 0.9, y + T * 0.5);
      ctx.stroke();
      // Star emblem
      ctx.fillStyle = 'rgba(79, 195, 247, 0.08)';
      ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, T * 0.2, 0, Math.PI * 2); ctx.fill();
    } else if (theme === 'agama') {
      // Islamic geometric pattern
      ctx.strokeStyle = 'rgba(105, 240, 174, 0.15)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + T / 2, y + 3); ctx.lineTo(x + T - 3, y + T / 2);
      ctx.lineTo(x + T / 2, y + T - 3); ctx.lineTo(x + 3, y + T / 2);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, T * 0.15, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (tile === T_BRICK) {
    ctx.fillStyle = C.brick; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = C.brickEdge; ctx.fillRect(x + T - 3, y, 3, T); ctx.fillRect(x, y + T - 3, T, 3);
    ctx.fillStyle = C.brickShine; ctx.fillRect(x, y, T, 2); ctx.fillRect(x, y, 2, T);
    // Brick mortar lines
    ctx.fillStyle = C.brickEdge;
    ctx.fillRect(x, y + Math.floor(T * 0.46), T, 2);
    ctx.fillRect(x + Math.floor(T * 0.5), y, 2, Math.floor(T * 0.46));
    ctx.fillRect(x + Math.floor(T * 0.25), y + Math.floor(T * 0.46), 2, T - Math.floor(T * 0.46));
    ctx.fillRect(x + Math.floor(T * 0.75), y + Math.floor(T * 0.46), 2, T - Math.floor(T * 0.46));

    // Theme decorations
    if (theme === 'sejarah') {
      ctx.fillStyle = 'rgba(200, 120, 64, 0.15)';
      ctx.fillRect(x + 4, y + 4, T * 0.3, T * 0.3);
    } else if (theme === 'pkn') {
      ctx.fillStyle = 'rgba(32, 96, 192, 0.1)';
      ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
    } else if (theme === 'agama') {
      ctx.fillStyle = 'rgba(32, 160, 96, 0.1)';
      ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, T * 0.18, 0, Math.PI * 2); ctx.fill();
    }
  } else if (tile === T_EMPTY) {
    ctx.fillStyle = C.empty; ctx.fillRect(x, y, T, T);
    ctx.strokeStyle = C.emptyGrid; ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 0.25, y + 0.25, T - 0.5, T - 0.5);

    // Subtle floor texture per theme
    if (theme === 'sejarah') {
      // Dirt specks
      ctx.fillStyle = 'rgba(100, 70, 30, 0.08)';
      if ((r + c) % 3 === 0) ctx.fillRect(x + T * 0.3, y + T * 0.6, 2, 2);
      if ((r * c) % 5 === 1) ctx.fillRect(x + T * 0.7, y + T * 0.3, 2, 2);
    } else if (theme === 'pkn') {
      // Tile pattern
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = 'rgba(10, 20, 40, 0.3)';
        ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
      }
    } else if (theme === 'agama') {
      // Subtle cross pattern
      ctx.strokeStyle = 'rgba(10, 24, 16, 0.4)';
      ctx.lineWidth = 0.3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + T, y + T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + T, y); ctx.lineTo(x, y + T); ctx.stroke();
    }
  } else if (tile === T_ITEM) {
    const pu = st.powerups.find(p => p.row === r && p.col === c);
    drawPowerupTile(x, y, T, pu ? pu.type : PU_QUIZ);
  }
}

function drawPowerupTile(x, y, T, type) {
  ctx.fillStyle = C.empty; ctx.fillRect(x, y, T, T);
  const cx = x + T / 2, cy = y + T / 2;
  const glowMap = {
    [PU_SPEED]: 'rgba(255,204,0,0.35)',
    [PU_BLAST]: 'rgba(255,100,0,0.35)',
    [PU_BOMB]: 'rgba(0,229,255,0.3)',
    [PU_QUIZ]: 'rgba(160,100,255,0.35)',
    [PU_SHIELD]: 'rgba(0,200,255,0.35)',
    [PU_FREEZE]: 'rgba(100,200,255,0.35)',
    [PU_MAGNET]: 'rgba(255,50,200,0.35)',
    [PU_HEART]: 'rgba(255,80,120,0.4)',
  };
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, T * .46);
  glow.addColorStop(0, glowMap[type] || 'rgba(57,255,20,0.3)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, T * .46, 0, Math.PI * 2); ctx.fill();

  const pulse = .6 + .4 * Math.sin(Date.now() / 250);
  const ringMap = {
    [PU_SPEED]: '#ffcc00', [PU_BLAST]: '#ff6600', [PU_BOMB]: '#00e5ff', [PU_QUIZ]: '#bf5fff',
    [PU_SHIELD]: '#00c8ff', [PU_FREEZE]: '#64d8ff', [PU_MAGNET]: '#ff32c8', [PU_HEART]: '#ff5078',
  };
  ctx.strokeStyle = ringMap[type] || '#39ff14';
  ctx.lineWidth = 2 * pulse; ctx.globalAlpha = pulse;
  ctx.beginPath(); ctx.arc(cx, cy, T * .42, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;

  // Double ring for rare items
  if (type === PU_SHIELD || type === PU_HEART || type === PU_FREEZE || type === PU_MAGNET) {
    ctx.globalAlpha = pulse * 0.4;
    ctx.strokeStyle = ringMap[type]; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, T * .35, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const icons = {
    [PU_SPEED]: '⚡', [PU_BLAST]: '🔥', [PU_BOMB]: '💣', [PU_QUIZ]: '📚',
    [PU_SHIELD]: '🛡️', [PU_FREEZE]: '❄️', [PU_MAGNET]: '🧲', [PU_HEART]: '💖',
  };
  ctx.font = `${Math.floor(T * .52)}px serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(icons[type] || '★', cx, cy + 1);
}

// ─── DRAW BOMB (dengan circular timer) ─────
function drawBomb(r, c, fuseLeft) {
  const T = getTile();
  const x = c * T + T * .1, y = r * T + T * .1;
  const w = T * .8, h = T * .8;
  const cx = x + w / 2, cy = y + h / 2;
  const progress = Math.max(0, fuseLeft / BOMB_FUSE);

  // ── Circular timer ring ──
  const ringR = w * .5 + 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 3; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2); ctx.stroke();

  const ringColor = progress > 0.5 ? '#39ff14' : progress > 0.25 ? '#ffcc00' : '#ff1744';
  ctx.strokeStyle = ringColor; ctx.lineWidth = 3; ctx.lineCap = 'round';
  if (progress > 0.005) {
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  if (progress < 0.3) { ctx.shadowColor = '#ff1744'; ctx.shadowBlur = 12 + (1 - progress) * 8; }

  // Body bom
  const grad = ctx.createRadialGradient(cx - w * .1, cy - h * .1, 0, cx, cy, w * .48);
  grad.addColorStop(0, '#555'); grad.addColorStop(1, '#111');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, w * .46, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.arc(cx - w * .14, cy - h * .14, w * .14, 0, Math.PI * 2); ctx.fill();

  // Sumbu / fuse
  const fuseAlpha = fuseLeft < 500 ? (Math.floor(Date.now() / 80) % 2 === 0 ? 1 : 0) : 1;
  ctx.globalAlpha = fuseAlpha;
  ctx.strokeStyle = C.fuse; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + w * .2, cy - h * .28);
  ctx.bezierCurveTo(cx + w * .4, cy - h * .58, cx + w * .1, cy - h * .7, cx + w * .25, cy - h * .82);
  ctx.stroke();
  const sparkSize = 2 + 2 * Math.sin(Date.now() / 80);
  ctx.fillStyle = '#fff7aa';
  ctx.beginPath(); ctx.arc(cx + w * .25, cy - h * .82, sparkSize, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Countdown angka saat ≤2 detik
  const secsLeft = Math.ceil(fuseLeft / 1000);
  if (secsLeft <= 2 && secsLeft > 0) {
    ctx.fillStyle = '#ff1744';
    ctx.font = `bold ${Math.floor(T * .32)}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(secsLeft, cx, cy);
  }
}

// ─── DRAW EXPLOSION ────────────────────────
function drawExplosion(r, c) {
  const T = getTile(), x = c * T, y = r * T;
  const pulse = .5 + .5 * Math.sin(Date.now() / 50);
  const grad = ctx.createRadialGradient(x + T / 2, y + T / 2, 0, x + T / 2, y + T / 2, T * .72);
  grad.addColorStop(0, `rgba(255,240,100,${.95 + .05 * pulse})`);
  grad.addColorStop(.35, `rgba(255,130,0,${.85 + .1 * pulse})`);
  grad.addColorStop(1, 'rgba(255,30,0,0)');
  ctx.fillStyle = grad; ctx.fillRect(x, y, T, T);
  ctx.fillStyle = `rgba(255,255,200,${.7 * pulse})`;
  for (let i = 0; i < 4; i++) {
    const angle = Date.now() / 300 + i * Math.PI / 2;
    ctx.beginPath();
    ctx.arc(x + T / 2 + Math.cos(angle) * T * .2, y + T / 2 + Math.sin(angle) * T * .2, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── DRAW BEAUTIFUL CUSTOM VECTOR SKULL ──────
function drawCanvasSkull(cx, cy, T) {
  ctx.save();
  ctx.translate(cx, cy);

  // Gentle animated wobble pulse
  const pulse = 1 + 0.05 * Math.sin(Date.now() / 250);
  ctx.scale(pulse, pulse);

  // Skull neon background glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, T * 0.45);
  glow.addColorStop(0, 'rgba(255, 23, 68, 0.25)');
  glow.addColorStop(0.6, 'rgba(255, 23, 68, 0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, T * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // Draw main dome of skull (head) & cheekbones & jaw in one path
  ctx.fillStyle = '#e5e5e9';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  // Skull forehead curve
  ctx.arc(0, -T * 0.06, T * 0.21, Math.PI * 0.95, Math.PI * 2.05);
  // Cheekbones & jawline
  ctx.lineTo(T * 0.12, T * 0.15);
  ctx.lineTo(T * 0.08, T * 0.24);
  ctx.lineTo(-T * 0.08, T * 0.24);
  ctx.lineTo(-T * 0.12, T * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw eye sockets (hollow dark cavities)
  ctx.fillStyle = '#0e0e13';
  ctx.beginPath();
  ctx.arc(-T * 0.07, -T * 0.04, T * 0.05, 0, Math.PI * 2);
  ctx.arc(T * 0.07, -T * 0.04, T * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Red glowing animated pupil pinpricks
  ctx.fillStyle = '#ff1744';
  const pupilSize = 1.6 + 0.6 * Math.sin(Date.now() / 120);
  ctx.beginPath();
  ctx.arc(-T * 0.07, -T * 0.04, pupilSize, 0, Math.PI * 2);
  ctx.arc(T * 0.07, -T * 0.04, pupilSize, 0, Math.PI * 2);
  ctx.fill();

  // Draw nasal cavity (upside down heart/triangle shape)
  ctx.fillStyle = '#0e0e13';
  ctx.beginPath();
  ctx.moveTo(0, T * 0.02);
  ctx.lineTo(-T * 0.03, T * 0.08);
  ctx.lineTo(T * 0.03, T * 0.08);
  ctx.closePath();
  ctx.fill();

  // Draw teeth details (vertical lines across jawbone)
  ctx.strokeStyle = '#7c7c88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-T * 0.04, T * 0.15);
  ctx.lineTo(-T * 0.04, T * 0.23);
  ctx.moveTo(0, T * 0.15);
  ctx.lineTo(0, T * 0.23);
  ctx.moveTo(T * 0.04, T * 0.15);
  ctx.lineTo(T * 0.04, T * 0.23);
  ctx.stroke();

  // Forehead crack detailing
  ctx.strokeStyle = '#7c7c88';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-T * 0.02, -T * 0.25);
  ctx.lineTo(-T * 0.05, -T * 0.21);
  ctx.lineTo(-T * 0.02, -T * 0.17);
  ctx.stroke();

  ctx.restore();
}

// ─── DRAW PLAYER (SEMI-3D CANVAS) ──────────
function drawPlayer(pl) {
  const T = getTile(), now = Date.now();
  if (!pl.alive) {
    if (isMultiplayer && pl.lives <= 0) {
      pl.renderX = pl.col;
      pl.renderY = pl.row;
      const cx = pl.renderX * T + T / 2;
      const cy = pl.renderY * T + T / 2;
      drawCanvasSkull(cx, cy, T);
      drawNameTag(st.name || 'P1', pl.renderX, pl.renderY - 0.2, '#888888');
    }
    return;
  }

  // Smooth position interpolation
  if (pl.renderX === undefined) { pl.renderX = pl.col; pl.renderY = pl.row; }
  pl.renderX += (pl.col - pl.renderX) * 0.48;
  pl.renderY += (pl.row - pl.renderY) * 0.48;
  if (Math.abs(pl.col - pl.renderX) < 0.01) pl.renderX = pl.col;
  if (Math.abs(pl.row - pl.renderY) < 0.01) pl.renderY = pl.row;

  const isMoving = Math.abs(pl.col - pl.renderX) > 0.03 || Math.abs(pl.row - pl.renderY) > 0.03;

  // 1. Squash & Stretch + Waddling physics animation
  const bounceSpeed = isMoving ? 130 : 220;
  const bounceScale = isMoving ? 0.06 : 0.03;
  const squashX = 1 + bounceScale * Math.sin(now / bounceSpeed);
  const squashY = 1 - bounceScale * Math.sin(now / bounceSpeed);

  // Waddle Tilt
  const tilt = isMoving ? 0.12 * Math.sin(now / 70) : 0;

  // Sizing
  const w = T * 0.95 * squashX;
  const h = T * 1.15 * squashY;

  // Standing floor center point (pivot at bottom center)
  const cx = pl.renderX * T + T / 2;
  const cy = pl.renderY * T + T * 0.88;

  // 2. Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, T * 0.28, T * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Speed power-up aura behind player
  if (pl.speedActive) {
    const grad = ctx.createRadialGradient(cx, cy - T * 0.4, 0, cx, cy - T * 0.4, T * 0.6);
    grad.addColorStop(0, 'rgba(255, 204, 0, 0.45)');
    grad.addColorStop(0.5, 'rgba(255, 170, 0, 0.15)');
    grad.addColorStop(1, 'rgba(255, 170, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy - T * 0.4, T * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Invincibility blink
  let originalAlpha = ctx.globalAlpha;
  if (pl.invincible && Math.floor(now / 140) % 2 === 0) {
    ctx.globalAlpha = 0.35;
  }

  // 5. Select sprite image based on theme and direction
  let themeImg;
  if (pl.dir === 'up') {
    const backKey = currentTheme === 'all' ? 'allBack' : currentTheme + 'Back';
    themeImg = spriteAssets.player[backKey];
  } else {
    themeImg = spriteAssets.player[currentTheme] || spriteAssets.player.all;
  }

  if (themeImg && themeImg.complete) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);

    // Flip horizontal if walking right
    if (pl.dir === 'right') {
      ctx.scale(-1, 1);
    }

    const originalSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    // Draw centering the foot point at (0, 0)
    ctx.drawImage(themeImg, -w / 2, -h, w, h);

    ctx.imageSmoothingEnabled = originalSmoothing;
    ctx.restore();
  }

  ctx.globalAlpha = originalAlpha;

  // 6. Shield power-up on top
  if (pl.invincible) {
    const pulse = 1 + 0.1 * Math.sin(now / 100);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy - h / 2, T * 0.48 * pulse, T * 0.42 * pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // 7. Render dynamic Callsign Name Tag above head
  drawNameTag(st.name || 'P1', pl.renderX, pl.renderY - 0.2, '#00e5ff');
}

// Global offscreen canvas for rendering the frozen visual effect efficiently
const freezeCanvas = document.createElement('canvas');
freezeCanvas.width = 64;
freezeCanvas.height = 64;
const freezeCtx = freezeCanvas.getContext('2d');

// ─── DRAW ENEMY (SEMI-3D CANVAS) ───────────
function drawEnemy(e) {
  if (!e.alive) return;
  if (e.row < 0 || e.row >= ROWS || e.col < 0 || e.col >= COLS) return;
  const T = getTile(), now = Date.now();

  if (e.renderX === undefined) { e.renderX = e.col; e.renderY = e.row; }
  // OPTIMIZATION: If the enemy moves by more than 1.5 tiles in one tick (spawn/teleport), snap render instantly
  if (Math.abs(e.col - e.renderX) > 1.5 || Math.abs(e.row - e.renderY) > 1.5) {
    e.renderX = e.col;
    e.renderY = e.row;
  } else {
    e.renderX += (e.col - e.renderX) * 0.35;
    e.renderY += (e.row - e.renderY) * 0.35;
  }
  if (Math.abs(e.col - e.renderX) < 0.01) e.renderX = e.col;
  if (Math.abs(e.row - e.renderY) < 0.01) e.renderY = e.row;

  const isMoving = Math.abs(e.col - e.renderX) > 0.03 || Math.abs(e.row - e.renderY) > 0.03;

  // Gentle float bounce
  const bounce = Math.sin(now / 180 + e.id * 1.5) * T * 0.03;

  // Squash & Stretch
  const bounceSpeed = isMoving ? 130 : 220;
  const bounceScale = isMoving ? 0.06 : 0.03;
  const squashX = st.freezeActive ? 1 : (1 + bounceScale * Math.sin(now / bounceSpeed));
  const squashY = st.freezeActive ? 1 : (1 - bounceScale * Math.sin(now / bounceSpeed));

  // Waddle Tilt
  const tilt = (isMoving && !st.freezeActive) ? 0.12 * Math.sin(now / 70) : 0;

  // Sizing
  const w = T * 0.95 * squashX;
  const h = T * 1.15 * squashY;

  // Standing pivot at bottom center
  const cx = e.renderX * T + T / 2;
  const cy = e.renderY * T + T * 0.88;

  // 1. Dynamic drop shadow
  const shadowScale = Math.max(0.5, 1 - (bounce / (T * 0.15)));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, T * 0.26 * shadowScale, T * 0.07 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Select theme-appropriate enemy sprite sheet & direction
  let themeImg;
  if (e.dir === 'up') {
    const backKey = currentTheme === 'all' ? 'allBack' : currentTheme + 'Back';
    themeImg = spriteAssets.enemy[backKey];
  } else {
    themeImg = spriteAssets.enemy[currentTheme] || spriteAssets.enemy.all;
  }

  if (themeImg && themeImg.complete) {
    ctx.save();
    // Translate to standing pivot + float bounce
    ctx.translate(cx, cy + bounce);
    ctx.rotate(tilt);

    // Flip horizontal if walking right
    if (e.dir === 'right') {
      ctx.scale(-1, 1);
    }

    const originalSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    // 3. Rendering logic (with silhouette frozen tinting if freeze active)
    if (st.freezeActive) {
      // Clear freeze off-screen canvas
      freezeCtx.clearRect(0, 0, 64, 64);

      // Draw sprite onto temporary canvas
      freezeCtx.drawImage(themeImg, 0, 0, 64, 64);

      // Apply ice-blue tint strictly inside silhouette pixels
      freezeCtx.globalCompositeOperation = 'source-atop';
      freezeCtx.fillStyle = 'rgba(100, 216, 255, 0.52)';
      freezeCtx.fillRect(0, 0, 64, 64);

      // Reset composite operation for next draw
      freezeCtx.globalCompositeOperation = 'source-over';

      // Draw the pixel-tinted sprite
      ctx.drawImage(freezeCanvas, -w / 2, -h, w, h);
    } else {
      ctx.drawImage(themeImg, -w / 2, -h, w, h);
    }

    ctx.imageSmoothingEnabled = originalSmoothing;
    ctx.restore();
  }

  // 4. Frozen visual aura
  if (st.freezeActive) {
    const pulse = 1 + 0.08 * Math.sin(now / 120);
    ctx.strokeStyle = 'rgba(100, 216, 255, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#64d8ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(cx, cy - h / 2 + bounce, T * 0.45 * pulse, T * 0.49 * pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

// ─── RENDER ────────────────────────────────
function render() {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawTile(st.grid[r][c], r, c);
  st.explosions.forEach(e => drawExplosion(e.row, e.col));
  st.bombs.forEach(b => drawBomb(b.row, b.col, b.explodeAt - Date.now()));
  st.enemies.forEach(e => drawEnemy(e));
  drawPlayer(st.player);

  if (isMultiplayer && opponentState) {
    if (opponentState.alive) {
      drawOpponent(opponentState);
    } else if (opponentState.lives <= 0) {
      const T = getTile();
      // Snap to prevent any slide-freeze visual misalignment
      opponentState.renderX = opponentState.col;
      opponentState.renderY = opponentState.row;
      const cx = opponentState.renderX * T + T / 2;
      const cy = opponentState.renderY * T + T / 2;
      drawCanvasSkull(cx, cy, T);
      drawNameTag(opponentState.name || 'LAWAN', opponentState.renderX, opponentState.renderY - 0.2, '#888888');
    }
  }
}

// ─── HUD UPDATE ────────────────────────────
function updateHUD() {
  const pl = st.player, now = Date.now();

  // Calculate current values
  const nameVal = st.name || 'PEMAIN';
  const levelVal = st.level || 1;
  const scoreVal = st.score;
  const timerVal = fmtTime(st.seconds);
  const bombsText = `${st.bombsAvail}/${pl.bombCap}`;
  const aliveCount = st.enemies.filter(e => e.alive).length;
  const livesText = '❤️'.repeat(Math.max(0, pl.lives)) + '🖤'.repeat(Math.max(0, MAX_LIVES - pl.lives));

  // Only write to DOM if value actually changed
  if (lastHudState.name !== nameVal) {
    document.getElementById('hud-name').textContent = nameVal;
    lastHudState.name = nameVal;
  }
  if (lastHudState.level !== levelVal) {
    document.getElementById('hud-level').textContent = levelVal;
    lastHudState.level = levelVal;
  }
  if (lastHudState.score !== scoreVal) {
    document.getElementById('hud-score').textContent = scoreVal;
    lastHudState.score = scoreVal;
  }
  if (lastHudState.timer !== timerVal) {
    document.getElementById('hud-timer').textContent = timerVal;
    lastHudState.timer = timerVal;
  }
  if (lastHudState.bombs !== bombsText) {
    document.getElementById('hud-bombs').textContent = bombsText;
    lastHudState.bombs = bombsText;
  }
  if (lastHudState.enemies !== aliveCount) {
    document.getElementById('hud-enemies').textContent = aliveCount;
    lastHudState.enemies = aliveCount;
  }
  if (lastHudState.lives !== livesText) {
    document.getElementById('hud-lives').textContent = livesText;
    lastHudState.lives = livesText;
  }

  // Speed badge
  const speedBadge = document.getElementById('badge-speed');
  const speedActive = pl.speedActive && now < pl.speedUntil;
  const speedSecs = speedActive ? Math.ceil((pl.speedUntil - now) / 1000) : 0;

  if (speedActive) {
    if (!lastHudState.speedActive) {
      speedBadge.classList.add('active');
      lastHudState.speedActive = true;
    }
    if (lastHudState.speedSecs !== speedSecs) {
      document.getElementById('speed-txt').textContent = speedSecs;
      lastHudState.speedSecs = speedSecs;
    }
    document.getElementById('speed-bar').style.width = `${Math.max(0, (pl.speedUntil - now) / SPEED_DUR * 100)}%`;
  } else {
    if (lastHudState.speedActive !== false) {
      speedBadge.classList.remove('active');
      lastHudState.speedActive = false;
      lastHudState.speedSecs = 0;
    }
  }

  // Blast badge
  const blastLevelVal = pl.blastLevel;
  if (lastHudState.blastLevel !== blastLevelVal) {
    const blastBadge = document.getElementById('badge-blast');
    document.getElementById('blast-txt').textContent = blastLevelVal + 1;
    blastLevelVal > 0 ? blastBadge.classList.add('active') : blastBadge.classList.remove('active');
    lastHudState.blastLevel = blastLevelVal;
  }

  // Bomb cap badge
  const bombCapVal = pl.bombCap;
  if (lastHudState.bombCap !== bombCapVal) {
    const bombBadge = document.getElementById('badge-bomb');
    document.getElementById('bomb-cap-txt').textContent = bombCapVal;
    bombCapVal > BASE_BOMBS ? bombBadge.classList.add('active') : bombBadge.classList.remove('active');
    lastHudState.bombCap = bombCapVal;
  }

  // Shield badge
  const shieldActiveVal = pl.invincible;
  if (lastHudState.shieldActive !== shieldActiveVal) {
    const shieldBadge = document.getElementById('badge-shield');
    if (shieldBadge) {
      if (shieldActiveVal) {
        shieldBadge.classList.add('active');
      } else {
        shieldBadge.classList.remove('active');
      }
    }
    lastHudState.shieldActive = shieldActiveVal;
  }
}

// ─── GAME LOOP ─────────────────────────────
function gameLoop(ts) {
  if (!st.running) return;
  processInput(ts);
  checkPowerupTimers();
  checkExplosions();

  if (!isMultiplayer) {
    checkPlayerEnemyCollision();
    checkPlayerInvincibility();
    checkWin();
  } else {
    checkPlayerEnemyCollision(); // Check collision with enemies for local player
    checkPlayerInvincibility();
    // Multiplayer win check: both Host and Guest check if all enemies are dead
    if (st.enemies.every(e => !e.alive) && st.running) {
      st.running = false;
      if (isHost) {
        setTimeout(() => nextLevel(), 700);
      } else {
        // Guest requests the Host to transition to the next level
        if (activeConn && activeConn.open) {
          activeConn.send({ type: 'REQUEST_NEXT_LEVEL' });
        }
      }
    }
  }

  render();
  updateHUD();
  animFr = requestAnimationFrame(gameLoop);
}

// ─── INPUT (cooldown-based, support hold key) ─
function processInput(now) {
  if (!st.running || !st.player.alive || st.paused || st.quizOpen) return;
  const cd = st.player.speedActive ? SPEED_BOOST : SPEED_BASE;
  if (now - lastMoveTs < cd) return;
  let moved = false;
  if (keysHeld['ArrowUp']) { tryMove(-1, 0); moved = true; }
  else if (keysHeld['ArrowDown']) { tryMove(1, 0); moved = true; }
  else if (keysHeld['ArrowLeft']) { tryMove(0, -1); moved = true; }
  else if (keysHeld['ArrowRight']) { tryMove(0, 1); moved = true; }
  if (moved) lastMoveTs = now;
}

// ─── PLAYER MOVEMENT ───────────────────────
function tryMove(dr, dc) {
  const pl = st.player;
  if (!st.running || !pl.alive) return;
  const nr = pl.row + dr, nc = pl.col + dc;
  if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
  const tile = st.grid[nr][nc];
  if (tile === T_WALL || tile === T_BRICK) return;
  if (st.bombs.some(b => b.row === nr && b.col === nc)) return;

  if (dr === 1) pl.dir = 'down';
  else if (dr === -1) pl.dir = 'up';
  else if (dc === 1) pl.dir = 'right';
  else if (dc === -1) pl.dir = 'left';

  pl.row = nr; pl.col = nc;
  if (tile === T_ITEM) collectPowerup(nr, nc);

  if (isMultiplayer && activeConn) {
    sendMultiplayerMove();
  }
}

// ─── POWER-UP COLLECTION ───────────────────
function collectPowerup(r, c) {
  const idx = st.powerups.findIndex(p => p.row === r && p.col === c);
  if (idx === -1) { st.grid[r][c] = T_EMPTY; return; }
  const pu = st.powerups[idx];
  st.powerups.splice(idx, 1);
  st.grid[r][c] = T_EMPTY;

  if (isMultiplayer && activeConn && activeConn.open) {
    if (!isHost) {
      activeConn.send({ type: 'PICKUP', row: r, col: c });
    } else {
      activeConn.send({ type: 'GRID_UPDATE', row: r, col: c, tile: T_EMPTY });
    }
  }

  const scoreAdd = st.magnetActive ? SCORE_ITEM * SCORE_MULTI : SCORE_ITEM;
  if (pu.type === PU_QUIZ) {
    showQuiz();
  } else if (pu.type === PU_SPEED) {
    st.player.speedActive = true; st.player.speedUntil = Date.now() + SPEED_DUR;
    st.speedCollected++; st.score += scoreAdd;
    showPopup('⚡ SPEED UP!', c, r, '#ffcc00'); SoundEngine.playPickup();
  } else if (pu.type === PU_BLAST) {
    st.player.blastLevel = Math.min(4, st.player.blastLevel + 1);
    st.score += scoreAdd;
    showPopup('🔥 BLAST UP!', c, r, '#ff6600'); SoundEngine.playPickup();
  } else if (pu.type === PU_BOMB) {
    if (st.player.bombCap < 4) { st.player.bombCap++; st.bombsAvail = Math.min(st.bombsAvail + 1, st.player.bombCap); }
    st.score += scoreAdd;
    showPopup('💣 BOM+1!', c, r, '#00e5ff'); SoundEngine.playPickup();
  } else if (pu.type === PU_SHIELD) {
    st.player.invincible = true; st.player.invincibleUntil = Date.now() + SHIELD_DUR;
    st.score += scoreAdd;
    showPopup('🛡️ SHIELD ON!', c, r, '#00c8ff'); SoundEngine.playPickup();
  } else if (pu.type === PU_FREEZE) {
    st.freezeActive = true; st.freezeUntil = Date.now() + FREEZE_DUR;
    console.log("❄️ [FREEZE ACTIVATED] st.freezeActive set to true locally! Until:", st.freezeUntil);
    st.score += scoreAdd;
    showPopup('❄️ FREEZE!', c, r, '#64d8ff'); SoundEngine.playPickup();
    if (isMultiplayer && activeConn && activeConn.open) {
      activeConn.send({ type: 'FREEZE_ACTIVE', duration: FREEZE_DUR });
      console.log("❄️ [MULTI-SYNC] Sent FREEZE_ACTIVE packet to opponent!");
    }
  } else if (pu.type === PU_MAGNET) {
    st.magnetActive = true; st.magnetUntil = Date.now() + MAGNET_DUR;
    st.score += scoreAdd;
    showPopup('🧲 2X SCORE!', c, r, '#ff32c8'); SoundEngine.playPickup();
  } else if (pu.type === PU_HEART) {
    if (st.player.lives < MAX_LIVES) st.player.lives++;
    st.score += scoreAdd;
    showPopup('💖 +1 LIFE!', c, r, '#ff5078'); SoundEngine.playPickup();
  }
  checkAchievements();
}

// ─── POWERUP TIMER CHECK ───────────────────
function checkPowerupTimers() {
  const pl = st.player, now = Date.now();
  if (pl.speedActive && now > pl.speedUntil) pl.speedActive = false;
  if (pl.invincible && now > pl.invincibleUntil) pl.invincible = false;
  if (st.freezeActive && now > st.freezeUntil) st.freezeActive = false;
  if (st.magnetActive && now > st.magnetUntil) st.magnetActive = false;
}

// ─── BOMB PLACEMENT ────────────────────────
function placeBomb() {
  if (!st.running || !st.player.alive || st.paused || st.quizOpen) return;
  if (st.bombsAvail <= 0) return;
  const { row, col } = st.player;
  if (st.bombs.some(b => b.row === row && b.col === col)) return;
  st.bombsAvail--; st.totalBombs++;
  const bomb = { row, col, explodeAt: Date.now() + BOMB_FUSE, isMine: true };
  st.bombs.push(bomb);
  bomb._tid = setTimeout(() => explodeBomb(bomb), BOMB_FUSE);
  SoundEngine.playBombPlace();

  if (isMultiplayer && activeConn && activeConn.open) {
    activeConn.send({
      type: 'PLACE_BOMB',
      row: row,
      col: col,
      fuse: BOMB_FUSE,
      blastLevel: st.player.blastLevel
    });
  }

  checkAchievements();
}

function explodeBomb(bomb) {
  // 🔥 SUARA EXPLOSION IMMEDIATE - SETIAP BOM!
  SoundEngine.playExplosion();

  // Hapus bomb
  st.bombs = st.bombs.filter(b => b !== bomb);
  if (bomb.isMine !== false) {
    st.bombsAvail = Math.min(st.player.bombCap, st.bombsAvail + 1);
  }

  const bombRadius = (bomb.ownerBlastLevel !== undefined) ? BASE_RADIUS + bomb.ownerBlastLevel : getRadius();
  const cells = getExplosionCells(bomb.row, bomb.col, bombRadius);

  // Kirim explosion cells ke lawan untuk sync visual
  if (isMultiplayer && activeConn && activeConn.open) {
    activeConn.send({
      type: 'EXPLOSION_SYNC',
      cells: cells,
      blastLevel: bombRadius
    });
  }

  cells.forEach(({ row: r, col: c }) => {
    st.explosions.push({ row: r, col: c, expireAt: Date.now() + EXPLOSION_MS });
    const tile = st.grid[r][c];

    if (tile === T_BRICK) {
      if (isMultiplayer) {
        if (isHost) {
          st.grid[r][c] = T_EMPTY;
          let pType = null;
          if (Math.random() < 0.38) {
            const types = [PU_SPEED, PU_BLAST, PU_BOMB, PU_QUIZ, PU_SHIELD, PU_FREEZE, PU_MAGNET, PU_HEART];
            const weights = [0.18, 0.18, 0.18, 0.16, 0.08, 0.08, 0.07, 0.07];
            let roll = Math.random(), acc = 0;
            pType = PU_QUIZ;
            for (let i = 0; i < types.length; i++) {
              acc += weights[i];
              if (roll < acc) { pType = types[i]; break; }
            }
            st.grid[r][c] = T_ITEM;
            st.powerups.push({ row: r, col: c, type: pType });
          }
          if (activeConn && activeConn.open) {
            activeConn.send({
              type: 'GRID_UPDATE',
              row: r,
              col: c,
              tile: pType ? T_ITEM : T_EMPTY,
              powerupType: pType
            });
          }
        } else {
          // Guest hancurkan tembok — kirim ke host agar grid & enemy AI sync
          st.grid[r][c] = T_EMPTY;
          if (activeConn && activeConn.open) {
            activeConn.send({
              type: 'GUEST_GRID_UPDATE',
              row: r,
              col: c
            });
          }
        }
      } else {
        st.grid[r][c] = T_EMPTY;
        if (Math.random() < 0.38) {
          const types = [PU_SPEED, PU_BLAST, PU_BOMB, PU_QUIZ, PU_SHIELD, PU_FREEZE, PU_MAGNET, PU_HEART];
          const weights = [0.18, 0.18, 0.18, 0.16, 0.08, 0.08, 0.07, 0.07];
          let roll = Math.random(), type = PU_QUIZ, acc = 0;
          for (let i = 0; i < types.length; i++) {
            acc += weights[i];
            if (roll < acc) { type = types[i]; break; }
          }
          st.grid[r][c] = T_ITEM;
          st.powerups.push({ row: r, col: c, type });
        }
      }
    }

    // Player hit
    if (!st.player.invincible && st.player.alive && st.player.row === r && st.player.col === c && !st.quizOpen) {
      hitPlayer();
    }

    // Opponent player hit check (host authoritative — medium/hard only)
    // Easy mode: bom tidak damage lawan, hanya musuh AI
    const bombDamagesOpponent = (currentDifficulty === 'normal' || currentDifficulty === 'hard');
    if (isMultiplayer && isHost && bombDamagesOpponent &&
      !opponentState.invincible && opponentState.alive &&
      opponentState.row === r && opponentState.col === c) {
      opponentState.lives = Math.max(0, opponentState.lives - 1);
      if (activeConn && activeConn.open) {
        activeConn.send({ type: 'OPPONENT_HIT', lives: opponentState.lives });
      }
    }

    // Enemy kill — both host and guest can kill enemies
    st.enemies.forEach(e => {
      if (e.alive && e.row === r && e.col === c && !st.quizOpen) {
        killEnemy(e);
        // Immediately broadcast kill to opponent so it doesn't get overwritten
        if (isMultiplayer && activeConn && activeConn.open) {
          activeConn.send({ type: 'ENEMY_KILL', id: e.id });
        }
      }
    });

    // Chain reaction
    const chain = st.bombs.find(b => b.row === r && b.col === c);
    if (chain) {
      clearTimeout(chain._tid);  // ← Kompatibel dengan kode lama
      explodeBomb(chain);
    }
  });
}

function getExplosionCells(row, col, radius) {
  const cells = [{ row, col }];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
    for (let s = 1; s <= radius; s++) {
      const r = row + dr * s, c = col + dc * s;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
      if (st.grid[r][c] === T_WALL) break;
      cells.push({ row: r, col: c });
      if (st.grid[r][c] === T_BRICK) break;
    }
  });
  return cells;
}

function checkExplosions() {
  const now = Date.now();
  st.explosions = st.explosions.filter(e => e.expireAt > now);
}

// ─── PLAYER HIT ────────────────────────────
function hitPlayer() {
  if (st.player.invincible) return;
  st.player.lives--; st.livesLost++;
  flashDamage(); SoundEngine.playHit();

  if (isMultiplayer && activeConn && activeConn.open) {
    activeConn.send({
      type: 'HIT',
      lives: st.player.lives
    });
  }

  if (st.player.lives <= 0) {
    st.player.alive = false;
    // Snap render coordinates immediately upon death to avoid slide freeze
    st.player.renderX = st.player.col;
    st.player.renderY = st.player.row;
    if (isMultiplayer) {
      // Send DIED packet with exact final coordinates to ensure perfect sync
      if (activeConn && activeConn.open) {
        activeConn.send({
          type: 'DIED',
          row: st.player.row,
          col: st.player.col
        });
      }
      
      // If the opponent is also dead (both dead), end the game!
      if (opponentState.lives <= 0) {
        st.running = false;
        setTimeout(() => endGame(false), 700);
      } else {
        console.log("Spectating the other player...");
      }
    } else {
      st.running = false;
      setTimeout(() => endGame(false), 700);
    }
    return;
  }
  respawnPlayer();
}

function respawnPlayer() {
  st.player.alive = false;
  st.player.invincible = true;
  st.player.invincibleUntil = Date.now() + RESPAWN_MS + 2500; // amankan selama respawn + 2.5 detik setelah
  showRespawnOverlay();
  setTimeout(() => {
    removeRespawnOverlay();

    let spawnR = 1, spawnC = 1;
    if (isMultiplayer) {
      if (myRole === 'host') {
        spawnR = 1; spawnC = 1;
      } else {
        spawnR = ROWS - 2; spawnC = COLS - 2;
      }
    }

    st.player.row = spawnR; st.player.col = spawnC; st.player.alive = true;
    st.player.renderX = spawnC; st.player.renderY = spawnR; // Reset smooth position
    st.player.invincible = true;
    st.player.invincibleUntil = Date.now() + 2500;

    if (isMultiplayer && activeConn) {
      sendMultiplayerMove();
    }
  }, RESPAWN_MS);
}

function checkPlayerInvincibility() {
  if (st.player.invincible && Date.now() > st.player.invincibleUntil)
    st.player.invincible = false;
}

// ─── ENEMY AI — Fixed BFS + Anti-Stuck + No Overlap ─
function moveEnemies() {
  if (!st.running || st.quizOpen) return;
  if (st.freezeActive) {
    console.log("🤖 [AI FREEZE] Enemies are frozen! Skipping moveEnemies() execution.");
    return;
  }
  if (isMultiplayer && !isHost) return; // Guest AI calculations bypassed, fully sync from Host
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // Helper: apakah posisi sudah ditempati musuh lain (yang sudah move di iterasi ini)
  // Kita proses satu per satu, mengecek posisi FINAL musuh lain
  const occupiedByOther = (e, nr, nc) =>
    st.enemies.some(oe => oe !== e && oe.alive && oe.row === nr && oe.col === nc);

  st.enemies.forEach(e => {
    if (!e.alive) return;
    let moved = false;

    // 40% chance: kejar player via BFS
    if (Math.random() < 0.4 && st.player.alive) {
      const next = bfsToPlayer(e);
      if (next
        && !st.bombs.some(b => b.row === next.row && b.col === next.col)
        && !st.explosions.some(ex => ex.row === next.row && ex.col === next.col)
        && !occupiedByOther(e, next.row, next.col)) {  // ← FIX: cegah overlap

        const dr = next.row - e.row;
        const dc = next.col - e.col;
        if (dr === 1) e.dir = 'down';
        else if (dr === -1) e.dir = 'up';
        else if (dc === 1) e.dir = 'right';
        else if (dc === -1) e.dir = 'left';

        e.row = next.row; e.col = next.col;
        moved = true; e.stuckCount = 0;
      }
    }

    // 60%: random, hindari bom, ledakan, dan sesama musuh
    if (!moved) {
      const shuffled = [...dirs].sort(() => Math.random() - .5);
      for (const [dr, dc] of shuffled) {
        const nr = e.row + dr, nc = e.col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const tile = st.grid[nr][nc];
        if (tile === T_WALL || tile === T_BRICK) continue;
        if (st.bombs.some(b => b.row === nr && b.col === nc)) continue;
        if (st.explosions.some(ex => ex.row === nr && ex.col === nc)) continue;
        if (occupiedByOther(e, nr, nc)) continue;  // ← FIX: cegah overlap

        if (dr === 1) e.dir = 'down';
        else if (dr === -1) e.dir = 'up';
        else if (dc === 1) e.dir = 'right';
        else if (dc === -1) e.dir = 'left';

        e.row = nr; e.col = nc;
        moved = true; e.stuckCount = 0; break;
      }
    }

    // Masih stuck → increment; setelah 4 tik teleport ke cell kosong
    if (!moved) {
      e.stuckCount = (e.stuckCount || 0) + 1;
      if (e.stuckCount >= 4) {
        const empties = [];
        for (let r = 1; r < ROWS - 1; r++)
          for (let c = 1; c < COLS - 1; c++)
            if (st.grid[r][c] === T_EMPTY
              && !st.enemies.some(oe => oe.alive && oe.row === r && oe.col === c)  // ← termasuk dirinya sendiri
              && !(st.player.row === r && st.player.col === c))
              empties.push({ row: r, col: c });
        if (empties.length > 0) {
          const pos = empties[Math.floor(Math.random() * empties.length)];
          e.row = pos.row; e.col = pos.col; e.stuckCount = 0;
        }
      }
    }
  });

  // Host broadcasts authoritative enemies update
  if (isMultiplayer && isHost && activeConn && activeConn.open) {
    activeConn.send({
      type: 'ENEMIES',
      enemies: st.enemies.map(e => ({
        id: e.id, row: e.row, col: e.col, dir: e.dir, alive: e.alive
      }))
    });
  }
}

// BFS dari posisi enemy ke player
function bfsToPlayer(enemy) {
  const target = st.player;
  if (!target.alive) return null;
  const queue = [{ row: enemy.row, col: enemy.col, first: null }];
  const visited = new Set([`${enemy.row},${enemy.col}`]);
  let iter = 0;
  while (queue.length > 0 && iter < 200) {
    iter++;
    const { row, col, first } = queue.shift();
    if (row === target.row && col === target.col) return first;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = row + dr, nc = col + dc, key = `${nr},${nc}`;
      if (visited.has(key)) continue;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (st.grid[nr][nc] === T_WALL || st.grid[nr][nc] === T_BRICK) continue;
      visited.add(key);
      const step = { row: nr, col: nc };
      queue.push({ row: nr, col: nc, first: first || step });
    }
  }
  return null;
}

function checkPlayerEnemyCollision() {
  if (!st.player.alive || st.player.invincible) return;
  if (st.freezeActive) {
    // Proactively log at most once in a while or when overlapping, but let's just log when player overlaps or generally
    const { row, col } = st.player;
    const isOverlapping = st.enemies.some(e => e.alive && e.row === row && e.col === col);
    if (isOverlapping) {
      console.log("🛡️ [COLLISION BYPASS] Player touched an enemy but is safe because FREEZE is active!");
    }
    return;
  }
  const { row, col } = st.player;
  let hit = false;
  st.enemies.forEach(e => {
    if (e.alive && e.row === row && e.col === col && !hit) {
      hit = true;  // ← FIX: hanya kena 1x per frame meskipun ada banyak musuh
      hitPlayer();
    }
  });
}

function killEnemy(e) {
  if (!e.alive) return; // guard: jangan double kill
  e.alive = false; st.kills++;
  st.combo = (st.combo || 0) + 1;
  clearTimeout(st.comboTimer);
  const bonuses = [0, 0, 50, 150, 300]; const bonus = bonuses[Math.min(st.combo, 4)];
  const labels = ['', '+100', 'COMBO x2! 🔥', `TRIPLE! 💥`, 'RAMPAGE! ☠️'];
  const label = st.combo >= 2 ? labels[Math.min(st.combo, 4)] + ` +${SCORE_KILL + bonus}` : '+' + SCORE_KILL;
  st.score += SCORE_KILL + bonus;
  const cc = ['#ff6600', '#ff4400', '#ff2200', '#ff0066'][Math.min(st.combo - 1, 3)];
  showPopup(label, e.col, e.row, cc);
  st.comboTimer = setTimeout(() => { st.combo = 0; }, 3000);
  checkAchievements();
}

// ─── WIN / LOSE ────────────────────────────
function checkWin() {
  if (!st.running) return;
  if (!st.enemies.every(e => !e.alive)) return;

  st.running = false;

  if (isMultiplayer) {
    // Host decides next level, broadcasts to guest
    if (isHost) {
      setTimeout(() => nextLevel(), 700);
    }
    // Guest waits for NEXT_LEVEL packet from host
    return;
  }

  setTimeout(() => nextLevel(), 700);
}

function endGame(won) {
  stopTimers();
  setDpadVisible(false);  // sembunyikan D-pad di layar hasil
  SoundEngine.stopBGM();
  const id = Date.now();

  const entryName = st.name || myLobbyName || (isMultiplayer ? (isHost ? 'HOST' : 'GUEST') : 'PEMAIN');

  // 1. Rekam ke Leaderboard Lokal & Update Profil untuk semua mode (Single & Multi)
  const entry = {
    _id: id,
    name: entryName,
    score: st.score,
    kills: st.kills,
    time: fmtTime(st.seconds),
    seconds: st.seconds,
    quizCorrect: st.quizCorrect,
    result: won ? 'win' : 'lose',
    date: new Date().toLocaleDateString('id-ID'),
  };
  currentEntryId = id;
  addLbEntry(entry);
  updateProfile(won);  // FIX: simpan profil baik menang maupun kalah

  if (isMultiplayer) {
    // Broadcast GAME_OVER to sync state with peer (Host broadcasts authoritative stats)
    if (isHost && activeConn && activeConn.open) {
      activeConn.send({
        type: 'GAME_OVER',
        won: won,
        score: st.score,
        seconds: st.seconds,
        kills: st.kills,
        quizCorrect: st.quizCorrect
      });
    }

    if (won) {
      document.getElementById('win-name').textContent = entryName;
      document.getElementById('win-score').textContent = st.score;
      document.getElementById('win-time').textContent = fmtTime(st.seconds);
      document.getElementById('win-kills').textContent = st.kills;
      document.getElementById('win-quiz').textContent = st.quizCorrect;
      showScreen('screen-win');
      renderInlineLb(id);
      spawnConfetti();
    } else {
      document.getElementById('go-level').textContent = st.level || 1; // FIX: use st.level instead of hardcoded 1
      document.getElementById('go-name').textContent = entryName;
      document.getElementById('go-score').textContent = st.score;
      document.getElementById('go-time').textContent = fmtTime(st.seconds);
      document.getElementById('go-kills').textContent = st.kills;
      document.getElementById('go-quiz').textContent = st.quizCorrect;
      showScreen('screen-gameover');
    }
    return;
  }

  if (won) {
    document.getElementById('win-name').textContent = entryName;
    document.getElementById('win-score').textContent = st.score;
    document.getElementById('win-time').textContent = fmtTime(st.seconds);
    document.getElementById('win-kills').textContent = st.kills;
    document.getElementById('win-quiz').textContent = st.quizCorrect;
    showScreen('screen-win');
    renderInlineLb(id);
    spawnConfetti();
  } else {
    document.getElementById('go-level').textContent = st.level || 1;
    document.getElementById('go-name').textContent = entryName;
    document.getElementById('go-score').textContent = st.score;
    document.getElementById('go-time').textContent = fmtTime(st.seconds);
    document.getElementById('go-kills').textContent = st.kills;
    document.getElementById('go-quiz').textContent = st.quizCorrect;
    showScreen('screen-gameover');
  }
}

// ─── TIMERS ────────────────────────────────
function startTimers() {
  stopTimers();
  // BUG FIX: gunakan kecepatan musuh dari setting difficulty
  enemyTimer = setInterval(moveEnemies, getEnemyMs());
  clockTimer = setInterval(() => { if (st.running) st.seconds++; }, 1000);
}
function stopTimers() {
  clearInterval(enemyTimer); clearInterval(clockTimer);
  cancelAnimationFrame(animFr);
  enemyTimer = null; clockTimer = null; animFr = null;
}


function startGame() {
  _achQueue = []; _achShowing = false;  // FIX: reset achievement state
  lastHudState = {}; // Reset HUD cache!
  applyTheme();
  SoundEngine.init();
  setTimeout(() => {
    SoundEngine.playPickup(); // Wake up AudioContext
  }, 100);

  SoundEngine.startBGM();

  const p = loadProfile();
  const nameInput = document.getElementById('player-name');
  if (!nameInput.value.trim() && p.lastName) nameInput.value = p.lastName;
  const name = nameInput.value.trim() || 'PEMAIN';
  st = initState(name);
  sizeCanvas(); st.running = true;
  showScreen('screen-game');
  setDpadVisible(true);  // tampilkan D-pad jika HP
  startTimers(); lastMoveTs = 0;
  animFr = requestAnimationFrame(gameLoop);
}

function restartGame() {
  if (isMultiplayer) {
    cleanupMultiplayerGame();
    return;
  }
  _achQueue = []; _achShowing = false;  // FIX: reset achievement state
  lastHudState = {}; // Reset HUD cache!
  applyTheme();
  stopTimers();
  ['pause-overlay', 'respawn-overlay'].forEach(id => {
    const el = document.getElementById(id); if (el) el.remove();
  });
  const name = (st && st.name) || 'PEMAIN';
  st = initState(name);
  sizeCanvas(); st.running = true;
  showScreen('screen-game');
  setDpadVisible(true);  // tampilkan D-pad jika HP
  startTimers(); lastMoveTs = 0;
  animFr = requestAnimationFrame(gameLoop);
}

// ─── PAUSE ─────────────────────────────────
function togglePause() {
  if (!st) return;
  if (st.paused) resumeGame(); else if (st.running) pauseGame();
}
function pauseGame() {
  if (!st || !st.running || st.paused) return;
  st.paused = true; st.running = false;
  stopTimers(); showPauseOverlay();
}
function resumeGame() {
  if (!st || !st.paused) return;
  st.paused = false; st.running = true;
  removePauseOverlay(); startTimers();
  animFr = requestAnimationFrame(gameLoop);
}
function goMenuFromPause() {
  st.paused = false; st.running = false;
  stopTimers(); removePauseOverlay();
  if (isMultiplayer) {
    cleanupMultiplayerGame();
  } else {
    showScreen('screen-welcome');
  }
}

function showPauseOverlay() {
  const ex = document.getElementById('pause-overlay'); if (ex) ex.remove();
  const el = document.createElement('div');
  el.id = 'pause-overlay'; el.className = 'pause-overlay';
  el.innerHTML = `
      <div class="pause-card">
        <span class="pause-icon">⏸</span>
        <h2 class="pause-title">PAUSE</h2>
        <p class="pause-sub">Game dijeda</p>
        <div class="pause-btns">
          <button class="btn-primary" id="btn-resume">▶ LANJUTKAN</button>
          <button class="btn-secondary" id="btn-restart-p">🔄 Ulang</button>
          <button class="btn-secondary" id="btn-menu-p">🏠 Menu Utama</button>
        </div>
        <div class="pause-hint"><kbd>ESC</kbd> atau <kbd>P</kbd> untuk lanjutkan</div>
      </div>`;
  document.getElementById('screen-game').appendChild(el);
  el.querySelector('#btn-resume').addEventListener('click', resumeGame);
  el.querySelector('#btn-restart-p').addEventListener('click', () => {
    removePauseOverlay(); st.paused = false; restartGame();
  });
  el.querySelector('#btn-menu-p').addEventListener('click', goMenuFromPause);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
}
function removePauseOverlay() {
  const el = document.getElementById('pause-overlay'); if (!el) return;
  el.classList.remove('visible');
  setTimeout(() => { if (el.parentNode) el.remove(); }, 220);
}

// ─── QUIZ SYSTEM ───────────────────────────
function showQuiz() {
  st.quizOpen = true;
  const wasRunning = st.running;
  if (wasRunning) { st.running = false; stopTimers(); }
  st._wasRunning = wasRunning;

  const qBank = getQuizBank();
  quizData = qBank[Math.floor(Math.random() * qBank.length)];

  const subjEl = document.getElementById('quiz-subject');
  subjEl.className = 'quiz-subject-badge';
  const subjClass = { Sejarah: 'subj-sejarah', PKN: 'subj-pkn', 'Agama Islam': 'subj-agama' }[quizData.subj] || 'subj-sejarah';
  subjEl.classList.add(subjClass);
  const subjIcons = { Sejarah: '🏛️', PKN: '⚖️', 'Agama Islam': '☪️' };
  subjEl.textContent = `${subjIcons[quizData.subj] || '📚'} ${quizData.subj.toUpperCase()}`;
  document.getElementById('quiz-question').textContent = quizData.q;

  const optEl = document.getElementById('quiz-options');
  optEl.innerHTML = '';
  quizData.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt'; btn.textContent = opt;
    btn.addEventListener('click', () => answerQuiz(i));
    optEl.appendChild(btn);
  });
  document.getElementById('quiz-result').style.display = 'none';

  let timeLeft = 10;
  updateQuizRing(timeLeft, 10);
  document.getElementById('quiz-count-txt').textContent = timeLeft;
  document.getElementById('quiz-bar-fill').style.width = '100%';
  document.getElementById('quiz-bar-fill').style.background = '#39ff14';

  clearInterval(quizInterval);
  quizInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('quiz-count-txt').textContent = timeLeft;
    const pct = timeLeft / 10;
    document.getElementById('quiz-bar-fill').style.width = `${pct * 100}%`;
    document.getElementById('quiz-bar-fill').style.background = pct > .5 ? '#39ff14' : pct > .25 ? '#ffcc00' : '#ff1744';
    updateQuizRing(timeLeft, 10);
    if (timeLeft <= 0) { clearInterval(quizInterval); answerQuiz(-1); }
  }, 1000);

  const modal = document.getElementById('quiz-modal');
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('active'));
}

function updateQuizRing(left, total) {
  const cvs = document.getElementById('quiz-ring'); if (!cvs) return;
  const qc = cvs.getContext('2d');
  const cx = 18, cy = 18, r = 14;
  qc.clearRect(0, 0, 36, 36);
  qc.strokeStyle = 'rgba(255,255,255,0.12)'; qc.lineWidth = 3;
  qc.beginPath(); qc.arc(cx, cy, r, 0, Math.PI * 2); qc.stroke();
  const pct = left / total;
  const color = pct > .5 ? '#39ff14' : pct > .25 ? '#ffcc00' : '#ff1744';
  qc.strokeStyle = color; qc.lineWidth = 3; qc.lineCap = 'round';
  if (pct > 0) {
    qc.beginPath(); qc.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2); qc.stroke();
  }
}

function answerQuiz(selected) {
  clearInterval(quizInterval);
  const correct = quizData.ans;
  document.querySelectorAll('.quiz-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });
  const resultEl = document.getElementById('quiz-result');
  if (selected === correct) {
    st.score += SCORE_QUIZ; st.quizCorrect++;
    st.quizStreak = (st.quizStreak || 0) + 1;
    resultEl.className = 'quiz-result ok';
    resultEl.innerHTML = `✅ BENAR! +${SCORE_QUIZ} poin!`;
    SoundEngine.playQuizCorrect();
  } else {
    st.quizStreak = 0;
    if (selected === -1) {
      resultEl.className = 'quiz-result fail';
      resultEl.innerHTML = `⏰ Waktu habis! Jawaban: <strong>${quizData.opts[correct]}</strong>`;
    } else {
      resultEl.className = 'quiz-result fail';
      resultEl.innerHTML = `❌ Salah! Jawaban: <strong>${quizData.opts[correct]}</strong>`;
    }
    SoundEngine.playQuizWrong();
  }
  resultEl.style.display = 'block';
  checkAchievements();
  setTimeout(() => closeQuiz(), 2200);
}

function closeQuiz() {
  clearInterval(quizInterval);
  const modal = document.getElementById('quiz-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    st.quizOpen = false;
    if (st._wasRunning && !st.over && !st.won) {
      st.running = true; startTimers();
      animFr = requestAnimationFrame(gameLoop);
    }
  }, 300);
}

// ─── VISUAL EFFECTS ────────────────────────
function flashDamage() {
  const el = document.createElement('div'); el.className = 'dmg-flash';
  document.body.appendChild(el); setTimeout(() => el.remove(), 400);
  const gs = document.getElementById('screen-game');
  gs.classList.add('shaking');
  setTimeout(() => gs.classList.remove('shaking'), 300);
}

function showRespawnOverlay() {
  const el = document.createElement('div');
  el.className = 'respawn-overlay'; el.id = 'respawn-overlay';
  el.innerHTML = `<span class="respawn-txt">💀 RESPAWN...</span>`;
  document.body.appendChild(el);
}
function removeRespawnOverlay() {
  const el = document.getElementById('respawn-overlay'); if (el) el.remove();
}

function showPopup(text, col, row, color) {
  const T = getTile();
  const el = document.createElement('div');
  el.className = 'score-pop pu-pop';
  el.textContent = text;
  if (color) el.style.color = color;
  const canvR = canvas.getBoundingClientRect();
  el.style.left = (canvR.left + col * T + T / 2) + 'px';
  el.style.top = (canvR.top + row * T) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#ffcc00', '#ff4d00', '#00e5ff', '#39ff14', '#ff1744', '#fff', '#bf5fff'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (2 + Math.random() * 3) + 's';
    p.style.animationDelay = (Math.random() * 2) + 's';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (6 + Math.random() * 8) + 'px';
    container.appendChild(p);
  }
}

// ─── LEADERBOARD ───────────────────────────
const LB_KEY = 'bomskuy_v2_lb';
function loadLb() { try { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); } catch { return []; } }
function saveLb(e) { try { localStorage.setItem(LB_KEY, JSON.stringify(e)); } catch { } }

function addLbEntry(entry) {
  const entries = loadLb();
  entries.push(entry);
  entries.sort((a, b) => b.score - a.score || a.seconds - b.seconds);
  saveLb(entries.slice(0, 50));
}
function clearLeaderboard() {
  if (!confirm('Hapus semua data papan skor?')) return;
  localStorage.removeItem(LB_KEY);
  renderLbModal(currentLbTab);
}
function openLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'flex';
  renderLbModal(currentLbTab);
}
function closeLeaderboard() { document.getElementById('leaderboard-modal').style.display = 'none'; }
function closeLbOutside(e) { if (e.target === document.getElementById('leaderboard-modal')) closeLeaderboard(); }
function switchLbTab(tab, btn) {
  currentLbTab = tab;
  document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderLbModal(tab);
}
function renderLbModal(filter) {
  const listEl = document.getElementById('lb-list');
  let entries = loadLb();
  if (filter === 'win') entries = entries.filter(e => e.result === 'win');
  if (filter === 'lose') entries = entries.filter(e => e.result === 'lose');
  if (!entries.length) { listEl.innerHTML = `<div class="lb-empty">🎮<br>Belum ada data.<br>Mainkan dulu!</div>`; return; }
  const medals = ['🥇', '🥈', '🥉'];
  listEl.innerHTML = entries.map((entry, i) => {
    const rank = i + 1;
    const medal = rank <= 3 ? medals[rank - 1] : '';
    const rankClass = rank <= 3 ? `lb-r${rank}` : 'lb-rn';
    const badge = entry.result === 'win'
      ? `<span class="lb-badge badge-win">MENANG</span>`
      : `<span class="lb-badge badge-lose">KALAH</span>`;
    const isCur = currentEntryId !== null && entry._id === currentEntryId;
    return `
        <div class="lb-row${isCur ? ' lb-current' : ''}" style="animation-delay:${i * .04}s">
          <div class="lb-rank ${rankClass}">${medal || '#' + rank}</div>
          <div class="lb-info">
            <div class="lb-name">${esc(entry.name)}</div>
            <div class="lb-meta">⏱ ${entry.time} | 💀 ${entry.kills} | 📚 ${entry.quizCorrect || 0} benar | ${entry.date}</div>
          </div>
          <div class="lb-score-col">
            <div class="lb-score">${entry.score}</div>${badge}
          </div>
        </div>`;
  }).join('');
}
function renderInlineLb(highlightId) {
  const el = document.getElementById('lb-inline-list'); if (!el) return;
  const entries = loadLb().slice(0, 5);
  if (!entries.length) {
    el.innerHTML = `<div style="padding:12px;text-align:center;color:var(--dim);font-size:.6rem">Kamu yang pertama!</div>`;
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  el.innerHTML = entries.map((entry, i) => {
    const rank = i + 1;
    const medal = rank <= 3 ? medals[rank - 1] : `#${rank}`;
    const isCur = highlightId !== null && entry._id === highlightId;
    return `
        <div class="lb-inline-row${isCur ? ' is-current' : ''}" style="animation-delay:${i * .05}s">
          <div class="lb-inline-rank">${medal}</div>
          <div class="lb-inline-name">${esc(entry.name)}${isCur ? ' ◀ KAMU' : ''}</div>
          <div class="lb-inline-score">${entry.score}</div>
        </div>`;
  }).join('');
}

// ─── SOUND ENGINE v3.0 - BOMSFIX ULTIMATE ────────────────────────
const SoundEngine = {
  ctx: null,
  bgmNodes: [],
  _bgmTimer: null,
  _lastPlay: {},   // per sound type
  _retryQueue: [], // retry queue untuk sound gagal
  _isReady: false,


  init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 44100
        });
      }

      // FORCE resume + multiple user gesture listeners
      this._addUserGestures();

      // Mobile tab switch
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) this.resumeContext();
      });

      // Focus handler
      window.addEventListener('focus', () => this.resumeContext());

      console.log('🔊 SoundEngine ready');
      this._isReady = true;
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  },

  // 🏅 PLAY SOUND ACHIEVEMENT
  playAchievementFanfare() {
    if (!this._ensure('achievement')) return;
    try {
      // Melodi lonceng naik yang megah (arpeggio retro)
      [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) =>
        setTimeout(() => this._tone(f, 'sine', 0.22, 0.45), i * 90)
      );
    } catch (e) { }
  },

  playAchievement(id, volume = 1) {
    // 🏅 Synthesizer prosedural unik dengan efek audio retro chiptune untuk masing-masing achievement!
    try {
      if (id === 'first_blood') {
        // First Blood - Snappy, rapid high-tempo fanfare (2 tones rise)
        this._tone(800, 'triangle', 0.35, 0.15, 400);
        setTimeout(() => this._tone(1200, 'sawtooth', 0.3, 0.25, 600), 100);
      }
      else if (id === 'bomber') {
        // Bomber - Whistling bomb falling then a heavy low-frequency rumble explosion
        this._tone(200, 'sine', 0.3, 0.35, 1200);
        setTimeout(() => {
          this._noise(0.42, 0.45);
          this._tone(70, 'triangle', 0.48, 0.45);
        }, 320);
      }
      else if (id === 'scholar') {
        // Scholar (Cendekia) - A delightful, crystal-clear "magic lightbulb" arpeggio (sine)
        const notes = [659.25, 783.99, 1046.50, 1318.51]; // E5, G5, C6, E6
        notes.forEach((f, i) => {
          setTimeout(() => this._tone(f, 'sine', 0.3, 0.35), i * 80);
        });
      }
      else if (id === 'speedster') {
        // Speedster - Futuristic racing turbo accelerator laser sweeps (sawtooth)
        this._tone(1800, 'sawtooth', 0.28, 0.12, 300);
        setTimeout(() => this._tone(2400, 'sawtooth', 0.28, 0.18, 400), 80);
      }
      else if (id === 'exterminator') {
        // Exterminator (Pembantai) - A dark, powerful, dramatic retro doom arpeggio
        this._tone(150, 'sawtooth', 0.35, 0.28);
        setTimeout(() => this._tone(130, 'sawtooth', 0.35, 0.28), 100);
        setTimeout(() => this._tone(180, 'sawtooth', 0.35, 0.45), 200);
        setTimeout(() => this._tone(900, 'sawtooth', 0.3, 0.4, 300), 300);
      }
      else if (id === 'survivor') {
        // Survivor - A warm, harmonious, comforting major chord transition (peaceful survival victory)
        this._tone(261.63, 'triangle', 0.25, 0.45); // C4
        this._tone(329.63, 'sine', 0.25, 0.45);     // E4
        setTimeout(() => {
          this._tone(392.00, 'triangle', 0.22, 0.45); // G4
          this._tone(523.25, 'sine', 0.22, 0.55);     // C5
        }, 150);
      }
      else if (id === 'quiz_master') {
        // Quiz Master - A triumphant, celebratory, staccato trumpet fanfare (square wave)
        const notes = [523.25, 523.25, 659.25, 783.99]; // C5, C5, E5, G5
        notes.forEach((f, i) => {
          const d = i === 3 ? 0.45 : 0.18;
          setTimeout(() => this._tone(f, 'square', 0.25, d), i * 120);
        });
      }
      else if (id === 'speedrun') {
        // Speedrunner - A hyper-speed cascade of fast rising digital laser pulses
        const notes = [
          { f0: 880, f: 1760 },
          { f0: 1046, f: 2093 },
          { f0: 1318, f: 2637 },
          { f0: 1568, f: 3136 }
        ];
        notes.forEach((n, i) => {
          const d = i === 3 ? 0.3 : 0.1;
          setTimeout(() => this._tone(n.f, 'square', 0.25, d, n.f0), i * 80);
        });
      }
      else {
        // Default fallback: play procedural arpeggio chime fanfare
        this.playAchievementFanfare();
      }
    } catch (e) {
      console.warn('Procedural achievement audio failed:', e);
      // Absolute fallback
      this.playAchievementFanfare();
    }
  },


  _addUserGestures() {
    ['click', 'touchstart', 'touchend', 'keydown', 'mousedown'].forEach(ev => {
      document.addEventListener(ev, () => {
        if (this.ctx?.state === 'suspended') {
          this.resumeContext();
        }
      }, { once: false, passive: true });
    });
  },

  resumeContext() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        console.log('✅ AudioContext RESUMED');
        // Process retry queue
        this._processRetryQueue();
      }).catch(e => {
        console.warn('Resume failed:', e);
        // Retry after 100ms
        setTimeout(() => this.resumeContext(), 100);
      });
    }
  },

  _ensure(soundType = 'generic') {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.init();
      return false;
    }
    if (this.ctx.state === 'suspended') {
      // Queue untuk retry otomatis
      if (!this._retryQueue.some(r => r.type === soundType && Date.now() - r.ts < 500)) {
        this._retryQueue.push({ type: soundType, ts: Date.now() });
      }
      this.resumeContext();
      return false;
    }
    return true;
  },

  _cooldownCheck(soundType, cooldownMs = 50) {
    const now = Date.now();
    const last = this._lastPlay[soundType] || 0;
    if (now - last < cooldownMs) return false;
    this._lastPlay[soundType] = now;
    return true;
  },

  // 🔥 EXPLOSION - PRIORITY 1 (paling sering dipanggil) - BOMSFIX VERSION
  playExplosion() {
    if (!this._cooldownCheck('explosion', 30)) return; // tighter cooldown

    // IMMEDIATE resume attempt
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this._ensure('explosion')) {
      // CRITICAL: langsung fallback + retry
      this._playExplosionMultiLayer();
      setTimeout(() => this._playExplosionMultiLayer(), 50);
      setTimeout(() => this._playExplosionMultiLayer(), 150);
      return;
    }

    try {
      this._playExplosionMultiLayer();
    } catch (e) {
      this._playExplosionFallback();
    }
  },

  _playExplosionMultiLayer() {
    // Layer 1: MAIN BLAST (immediate)
    this._tone(140, 'sawtooth', 0.5, 0.35, 480);
    this._noise(0.5, 0.4);

    // Layer 2: High sweep (delayed)
    setTimeout(() => {
      if (this._ensure('explosion')) {
        this._tone(280, 'sawtooth', 0.4, 0.25, 800);
      }
    }, 60);

    // Layer 3: Bass rumble
    setTimeout(() => {
      if (this._ensure('explosion')) {
        this._tone(40, 'sine', 0.45, 0.4);
        this._noise(0.25, 0.2);
      }
    }, 120);
  },

  _playExplosionFallback() {
    try {
      // Ultra simple fallback - NO AudioContext dependency
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.type = 'sawtooth';
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);

      // Auto resume main context
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('Fallback failed:', e);
    }
  },

  // BOM PLACEMENT - ULTRA RESPONSIVE
  playBombPlace() {
    if (!this._cooldownCheck('bombplace', 40)) return;

    if (!this._ensure('bombplace')) {
      setTimeout(() => this.playBombPlace(), 20);
      return;
    }

    try {
      // Double tone untuk feedback INSTANT
      this._tone(220, 'sine', 0.35, 0.18, 260);
      setTimeout(() => this._tone(160, 'sine', 0.3, 0.15), 60);
    } catch (e) { }
  },

  _processRetryQueue() {
    this._retryQueue = this._retryQueue.filter(r => Date.now() - r.ts < 1000);
    if (this._retryQueue.length > 0 && this._ensure()) {
      // Replay recent sounds
      this._retryQueue.slice(-3).forEach(r => {
        if (r.type === 'explosion') this.playExplosion();
        if (r.type === 'bombplace') this.playBombPlace();
      });
    }
  },

  // Rest of sounds (tetap sama tapi pakai _ensure baru)
  playPickup() {
    if (!this._cooldownCheck('pickup', 100)) return;
    if (!this._ensure('pickup')) return;
    try {
      this._tone(880, 'sine', 0.3, 0.25, 660);
    } catch (e) { }
  },

  playHit() {
    if (!this._cooldownCheck('hit', 200)) return;
    if (!this._ensure('hit')) return;
    try {
      this._noise(0.35, 0.25);
      this._tone(200, 'sawtooth', 0.3, 0.3, 160);
    } catch (e) { }
  },

  playQuizCorrect() {
    if (!this._cooldownCheck('quizcorrect', 100)) return;
    if (!this._ensure('quizcorrect')) return;
    try {
      [330, 392, 523].forEach((f, i) =>
        setTimeout(() => this._tone(f, 'sine', 0.25, 0.3), i * 140)
      );
    } catch (e) { }
  },

  playQuizWrong() {
    if (!this._cooldownCheck('quizwrong', 100)) return;
    if (!this._ensure('quizwrong')) return;
    try {
      this._tone(180, 'sawtooth', 0.3, 0.25);
      setTimeout(() => this._tone(140, 'sawtooth', 0.25, 0.2), 120);
    } catch (e) { }
  },

  playLevelUp() {
    if (!this._cooldownCheck('levelup', 200)) return;
    if (!this._ensure('levelup')) return;
    try {
      [659, 784, 1046].forEach((f, i) =>
        setTimeout(() => this._tone(f, 'square', 0.3, 0.4), i * 180)
      );
    } catch (e) { }
  },

  // Tone/noise helpers (sama tapi lebih robust)
  _tone(f, type, vol, dur, f0) {
    if (!this._ensure()) return;
    try {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.connect(g);
      g.connect(this.ctx.destination);

      o.type = type || 'sine';
      o.frequency.setValueAtTime(f0 || f, this.ctx.currentTime);
      if (f0) o.frequency.exponentialRampToValueAtTime(f, this.ctx.currentTime + dur);

      g.gain.setValueAtTime(vol || 0.25, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      o.start();
      o.stop(this.ctx.currentTime + dur);
    } catch (e) { }
  },

  _noise(vol, dur) {
    if (!this._ensure()) return;
    try {
      const buf = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * dur), this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const src = this.ctx.createBufferSource();
      const g = this.ctx.createGain();
      src.buffer = buf;
      src.connect(g);
      g.connect(this.ctx.destination);

      g.gain.setValueAtTime(vol || 0.35, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      src.start();
      src.stop(this.ctx.currentTime + dur);
    } catch (e) { }
  },

  startBGM() {
    if (!this._ensure()) return;
    this.stopBGM();

    const notes = [261, 0, 329, 0, 392, 329, 261, 0, 220, 0, 261, 329, 392, 0, 329, 0];
    const beat = 60 / 140;
    let t = this.ctx.currentTime + 0.1;

    const schedule = () => {
      if (!this._ensure()) return;

      // Clean up previous nodes that have finished playing to prevent memory leak!
      this.bgmNodes = this.bgmNodes.filter(n => {
        try {
          return this.ctx.currentTime < n._stopTime;
        } catch (e) {
          return false;
        }
      });

      notes.forEach((f, i) => {
        if (!f) return;
        try {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);

          o.type = 'square';
          o.frequency.value = f;

          const startTime = t + i * beat;
          const stopTime = t + i * beat + beat;

          g.gain.setValueAtTime(0, startTime);
          g.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, startTime + beat * 0.8);

          o.start(startTime);
          o.stop(stopTime);

          o._stopTime = stopTime; // Save stop time for cleanup
          this.bgmNodes.push(o);
        } catch (e) { }
      });

      t += notes.length * beat;
      this._bgmTimer = setTimeout(schedule, (notes.length * beat - 0.2) * 1000);
    };

    schedule();
  },

  stopBGM() {
    clearTimeout(this._bgmTimer);
    this.bgmNodes.forEach(n => {
      try { n.stop(); } catch (e) { }
    });
    this.bgmNodes = [];
  }
};

// ─── ACHIEVEMENTS ────────────────────────
const ACHIEVEMENTS = [
  { id: 'first_blood', icon: '🩸', name: 'First Blood', desc: 'Bunuh musuh pertama', check: s => s.kills >= 1 },
  { id: 'bomber', icon: '💣', name: 'Bomber', desc: 'Ledakkan 10 bom', check: s => s.totalBombs >= 10 },
  { id: 'scholar', icon: '🧠', name: 'Cendekia', desc: 'Jawab 5 quiz benar berturutan', check: s => s.quizStreak >= 5 },
  { id: 'speedster', icon: '⚡', name: 'Speedster', desc: 'Kumpulkan 3 speed boost', check: s => s.speedCollected >= 3 },
  { id: 'exterminator', icon: '💀', name: 'Pembantai', desc: 'Bunuh 4 musuh dalam 60 detik', check: s => s.kills >= 4 && s.seconds < 60 },
  { id: 'survivor', icon: '🛡️', name: 'Survivor', desc: 'Selesai level tanpa mati', check: s => s.livesLost === 0 && s.kills > 0 },
  { id: 'quiz_master', icon: '🏆', name: 'Quiz Master', desc: 'Jawab 10 quiz benar total', check: s => s.quizCorrect >= 10 },
  { id: 'speedrun', icon: '⏱️', name: 'Speedrunner', desc: 'Menang dalam 90 detik', check: s => s.won && s.seconds <= 90 },
];
let _achQueue = [], _achShowing = false;
function checkAchievements() {
  if (!st) return;
  const p = loadProfile();
  ACHIEVEMENTS.forEach(a => {
    if (st.achievements.has(a.id) || p.unlockedAchievements.includes(a.id)) return;
    if (a.check(st)) { st.achievements.add(a.id); _achQueue.push(a); if (!_achShowing) showNextAchievement(); }
  });
}
function showNextAchievement() {
  if (!_achQueue.length) {
    _achShowing = false;
    return;
  }

  _achShowing = true;

  const a = _achQueue.shift();

  // 🔊 PLAY ACHIEVEMENT SOUND
  SoundEngine.playAchievement(a.id);

  const p = loadProfile();

  if (!p.unlockedAchievements.includes(a.id)) {
    p.unlockedAchievements.push(a.id);
    saveProfile(p);
  }

  const el = document.createElement('div');

  el.className = 'achievement-notif';

  el.innerHTML = `
    <span class="ach-icon">${a.icon}</span>

    <div class="ach-body">
      <div class="ach-unlock">🏅 Achievement!</div>

      <div class="ach-name">
        ${a.name}
      </div>

      <div class="ach-desc">
        ${a.desc}
      </div>
    </div>
  `;

  document.body.appendChild(el);

  // Force reflow agar animasi jalan
  void el.offsetHeight;

  requestAnimationFrame(() => {
    el.classList.add('show');
  });

  setTimeout(() => {

    el.classList.remove('show');

    setTimeout(() => {

      el.remove();

      showNextAchievement();

    }, 400);

  }, 3000);
}

// ─── NEXT LEVEL / LEVEL BANNER ────────────────
function nextLevel() {
  const nxt = st.level + 1;
  if (nxt > maxLevels) {
    st.won = true;
    if (isMultiplayer) {
      endGame(true);
    } else {
      updateProfile(true); checkAchievements(); setTimeout(() => endGame(true), 100);
    }
    return;
  }
  const bonus = st.level * 500;
  st.score += bonus;
  SoundEngine.playLevelUp();
  checkAchievements();

  // Kirim notif banner ke guest SEBELUM ganti map — agar guest juga tampilkan banner
  if (isMultiplayer && isHost && activeConn && activeConn.open) {
    activeConn.send({
      type: 'LEVEL_BANNER',
      doneLevel: st.level,
      bonus: bonus
    });
  }

  showLevelBanner(st.level, st.score, bonus, () => {
    st.level = nxt;
    const bd = Math.min(0.55 + (nxt - 1) * 0.05, 0.75);
    const ec = Math.min(3 + nxt, 8);
    st.grid = generateMap(bd);
    st.enemies = makeEnemies(ec, isMultiplayer);
    st.bombs.forEach(b => clearTimeout(b._tid));
    st.bombs = []; st.explosions = []; st.powerups = [];
    st.bombsAvail = st.player.bombCap;

    if (isMultiplayer) {
      // Co-op Resurrection: revive dead player & opponent with 1 life
      if (st.player.lives <= 0) st.player.lives = 1;
      st.player.alive = true;
      if (opponentState.lives <= 0) opponentState.lives = 1;
      opponentState.alive = true;

      st.player.row = isHost ? 1 : ROWS - 2;
      st.player.col = isHost ? 1 : COLS - 2;
      st.player.renderX = st.player.col;
      st.player.renderY = st.player.row;

      // Resurrect Guest/Host at their correct start tile on opponent's screen
      opponentState.row = isHost ? ROWS - 2 : 1;
      opponentState.col = isHost ? COLS - 2 : 1;
      opponentState.renderX = opponentState.col;
      opponentState.renderY = opponentState.row;

      if (isHost && activeConn && activeConn.open) {
        activeConn.send({
          type: 'NEXT_LEVEL',
          level: nxt,
          grid: st.grid,
          powerups: st.powerups,
          enemies: st.enemies.map(e => ({
            id: e.id, row: e.row, col: e.col, dir: e.dir, alive: e.alive
          }))
        });
      }
    } else {
      st.player.row = 1; st.player.col = 1;
      st.player.renderX = 1; st.player.renderY = 1;
    }

    st.player.invincible = true; st.player.invincibleUntil = Date.now() + 3000;
    st.livesLost = 0;
    st.running = true;
    startTimers();
    animFr = requestAnimationFrame(gameLoop);
  });
}
function showLevelBanner(done, score, bonus, cb) {
  stopTimers(); cancelAnimationFrame(animFr);
  const el = document.createElement('div');
  el.className = 'level-banner';
  el.innerHTML = `<div class="level-banner-card"><div class="lbc-star">⭐</div><div class="lbc-lvl">LEVEL ${done} SELESAI!</div><div class="lbc-score">Skor: ${score}</div><div class="lbc-bonus">+${bonus} Bonus Level!</div><div class="lbc-next">Level ${done + 1} dimulai...</div></div>`;
  document.getElementById('screen-game').appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => { el.remove(); if (cb) cb(); }, 500); }, 2500);
}

// ─── PROFILE SAVE SYSTEM ─────────────────
const PROFILE_KEY = 'bomskuy_v2_profile';
function loadProfile() {
  try {
    let p = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || _defProfile();
    if (!p.unlockedAchievements) p.unlockedAchievements = [];
    return p;
  } catch { return _defProfile(); }
}
function _defProfile() {
  return { lastName: '', totalGamesPlayed: 0, totalBombsPlaced: 0, totalQuizCorrect: 0, bestScore: 0, unlockedAchievements: [], totalPlaytimeSeconds: 0 };
}
function saveProfile(p) { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { } }
function updateProfile(won) {
  const p = loadProfile();
  p.lastName = st.name || p.lastName;
  p.totalGamesPlayed++;
  p.totalBombsPlaced += (st.totalBombs || 0);
  p.totalQuizCorrect += (st.quizCorrect || 0);
  p.totalPlaytimeSeconds += (st.seconds || 0);
  if (st.score > p.bestScore) p.bestScore = st.score;
  saveProfile(p);
  renderWelcomeStats();
}
function renderWelcomeStats() {
  const el = document.getElementById('profile-stats'); if (!el) return;
  const p = loadProfile();
  if (!p.totalGamesPlayed) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.innerHTML = `<div class="pstat-row"><span>🎮 Games</span><strong>${p.totalGamesPlayed}</strong></div><div class="pstat-row"><span>💣 Bom</span><strong>${p.totalBombsPlaced}</strong></div><div class="pstat-row"><span>📚 Quiz Benar</span><strong>${p.totalQuizCorrect}</strong></div><div class="pstat-row"><span>🏆 Skor Terbaik</span><strong>${p.bestScore}</strong></div><div class="pstat-row"><span>🎖️ Achievements</span><strong>${p.unlockedAchievements.length}/${ACHIEVEMENTS.length}</strong></div>`;
}

// ─── TOUCH D-PAD ────────────────────────
/**
 * Cek apakah device adalah HP/tablet (touch device)
 * Menggunakan 3 metode deteksi yang lebih andal dari 'ontouchstart' saja
 */
function isTouchDevice() {
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
  );
}

/**
 * Tampilkan/sembunyikan D-pad sesuai state game dan jenis device
 * @param {boolean} show - true untuk tampilkan, false untuk sembunyikan
 */
function setDpadVisible(show) {
  const dpad = document.getElementById('dpad');
  if (!dpad) return;
  // Hanya tampilkan jika touch device
  if (show && isTouchDevice()) {
    dpad.style.display = 'flex';  // dpad baru pakai flex
    if (!isJoystickActive) {
      isJoystickActive = true;
      if (typeof window.drawJoystickGlobal === 'function') {
        requestAnimationFrame(window.drawJoystickGlobal);
      }
    }
  } else {
    dpad.style.display = 'none';
    isJoystickActive = false; // Matikan loop joystick
  }
  // FIX: resize canvas setelah d-pad ditampilkan/disembunyikan
  if (st && (st.running || st.paused)) {
    requestAnimationFrame(() => sizeCanvas());
  }
}

function initTouchControls() {
  const dpad = document.getElementById('dpad');
  if (!dpad) return;

  if (!isTouchDevice()) { dpad.style.display = 'none'; return; }
  dpad.style.display = 'none';

  // ── Analog Joystick Setup ──
  const jCanvas = document.getElementById('joystick-canvas');
  if (jCanvas) {
    const jCtx = jCanvas.getContext('2d');
    const jSize = 140;
    const jCenter = jSize / 2;
    const jBaseRadius = 55;
    const jKnobRadius = 22;
    const jDeadZone = 12;
    let jTouching = false;
    let jKnobX = jCenter, jKnobY = jCenter;
    let jTargetX = jCenter, jTargetY = jCenter;

    window.drawJoystickGlobal = function () {
      if (!isJoystickActive) return; // Stop drawing if the joystick D-pad is hidden!
      jCtx.clearRect(0, 0, jSize, jSize);

      // Outer ring
      jCtx.strokeStyle = 'rgba(255, 180, 60, 0.2)';
      jCtx.lineWidth = 2;
      jCtx.beginPath();
      jCtx.arc(jCenter, jCenter, jBaseRadius, 0, Math.PI * 2);
      jCtx.stroke();

      // Inner guide lines (cardinal directions)
      jCtx.strokeStyle = 'rgba(255, 180, 60, 0.06)';
      jCtx.lineWidth = 1;
      [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
        jCtx.beginPath();
        jCtx.moveTo(jCenter + Math.cos(a) * jDeadZone, jCenter + Math.sin(a) * jDeadZone);
        jCtx.lineTo(jCenter + Math.cos(a) * jBaseRadius, jCenter + Math.sin(a) * jBaseRadius);
        jCtx.stroke();
      });

      // Base fill
      const baseGrad = jCtx.createRadialGradient(jCenter, jCenter, 0, jCenter, jCenter, jBaseRadius);
      baseGrad.addColorStop(0, 'rgba(255, 106, 0, 0.03)');
      baseGrad.addColorStop(1, 'rgba(255, 106, 0, 0.01)');
      jCtx.fillStyle = baseGrad;
      jCtx.beginPath();
      jCtx.arc(jCenter, jCenter, jBaseRadius, 0, Math.PI * 2);
      jCtx.fill();

      // Dead zone circle
      jCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      jCtx.lineWidth = 1;
      jCtx.beginPath();
      jCtx.arc(jCenter, jCenter, jDeadZone, 0, Math.PI * 2);
      jCtx.stroke();

      // Smooth lerp knob to target
      jKnobX += (jTargetX - jKnobX) * 0.3;
      jKnobY += (jTargetY - jKnobY) * 0.3;
      if (Math.abs(jTargetX - jKnobX) < 0.5) jKnobX = jTargetX;
      if (Math.abs(jTargetY - jKnobY) < 0.5) jKnobY = jTargetY;

      // Knob shadow
      jCtx.fillStyle = 'rgba(0,0,0,0.3)';
      jCtx.beginPath();
      jCtx.arc(jKnobX + 1, jKnobY + 2, jKnobRadius, 0, Math.PI * 2);
      jCtx.fill();

      // Knob
      const knobGrad = jCtx.createRadialGradient(jKnobX - 3, jKnobY - 3, 0, jKnobX, jKnobY, jKnobRadius);
      if (jTouching) {
        knobGrad.addColorStop(0, 'rgba(255, 160, 40, 0.9)');
        knobGrad.addColorStop(1, 'rgba(255, 106, 0, 0.7)');
      } else {
        knobGrad.addColorStop(0, 'rgba(200, 200, 200, 0.35)');
        knobGrad.addColorStop(1, 'rgba(150, 150, 150, 0.2)');
      }
      jCtx.fillStyle = knobGrad;
      jCtx.beginPath();
      jCtx.arc(jKnobX, jKnobY, jKnobRadius, 0, Math.PI * 2);
      jCtx.fill();

      // Knob border
      jCtx.strokeStyle = jTouching ? 'rgba(255, 180, 60, 0.6)' : 'rgba(255, 255, 255, 0.12)';
      jCtx.lineWidth = 1.5;
      jCtx.beginPath();
      jCtx.arc(jKnobX, jKnobY, jKnobRadius, 0, Math.PI * 2);
      jCtx.stroke();

      // Direction indicator arrow when touching
      if (jTouching) {
        const dx = jKnobX - jCenter, dy = jKnobY - jCenter;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > jDeadZone) {
          const angle = Math.atan2(dy, dx);
          const arrowLen = 8;
          const arrowX = jKnobX + Math.cos(angle) * (jKnobRadius - 6);
          const arrowY = jKnobY + Math.sin(angle) * (jKnobRadius - 6);
          jCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          jCtx.beginPath();
          jCtx.moveTo(arrowX + Math.cos(angle) * arrowLen, arrowY + Math.sin(angle) * arrowLen);
          jCtx.lineTo(arrowX + Math.cos(angle + 2.3) * arrowLen * 0.5, arrowY + Math.sin(angle + 2.3) * arrowLen * 0.5);
          jCtx.lineTo(arrowX + Math.cos(angle - 2.3) * arrowLen * 0.5, arrowY + Math.sin(angle - 2.3) * arrowLen * 0.5);
          jCtx.closePath();
          jCtx.fill();
        }
      }

      requestAnimationFrame(window.drawJoystickGlobal);
    };

    function handleJoystickInput(touchX, touchY) {
      const rect = jCanvas.getBoundingClientRect();
      const scaleX = jSize / rect.width;
      const scaleY = jSize / rect.height;
      let dx = (touchX - rect.left) * scaleX - jCenter;
      let dy = (touchY - rect.top) * scaleY - jCenter;

      // Clamp to base radius
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > jBaseRadius - jKnobRadius) {
        const clamp = (jBaseRadius - jKnobRadius) / dist;
        dx *= clamp;
        dy *= clamp;
      }

      jTargetX = jCenter + dx;
      jTargetY = jCenter + dy;

      // Clear all directions
      keysHeld['ArrowUp'] = false;
      keysHeld['ArrowDown'] = false;
      keysHeld['ArrowLeft'] = false;
      keysHeld['ArrowRight'] = false;

      // Map to direction if outside dead zone
      if (dist > jDeadZone) {
        const angle = Math.atan2(dy, dx); // radians
        // Up: -135 to -45 degrees
        if (angle > -Math.PI * 0.75 && angle < -Math.PI * 0.25) keysHeld['ArrowUp'] = true;
        // Down: 45 to 135 degrees
        else if (angle > Math.PI * 0.25 && angle < Math.PI * 0.75) keysHeld['ArrowDown'] = true;
        // Left: 135 to -135 degrees
        else if (angle > Math.PI * 0.75 || angle < -Math.PI * 0.75) keysHeld['ArrowLeft'] = true;
        // Right: -45 to 45 degrees
        else keysHeld['ArrowRight'] = true;
      }
    }

    function resetJoystick() {
      jTouching = false;
      jTargetX = jCenter;
      jTargetY = jCenter;
      keysHeld['ArrowUp'] = false;
      keysHeld['ArrowDown'] = false;
      keysHeld['ArrowLeft'] = false;
      keysHeld['ArrowRight'] = false;
    }

    jCanvas.addEventListener('touchstart', e => {
      e.preventDefault();
      jTouching = true;
      const t = e.touches[0];
      handleJoystickInput(t.clientX, t.clientY);
    }, { passive: false });

    jCanvas.addEventListener('touchmove', e => {
      e.preventDefault();
      if (!jTouching) return;
      const t = e.touches[0];
      handleJoystickInput(t.clientX, t.clientY);
    }, { passive: false });

    jCanvas.addEventListener('touchend', e => {
      e.preventDefault();
      resetJoystick();
    }, { passive: false });

    jCanvas.addEventListener('touchcancel', () => resetJoystick());
  }

  // ── Tombol Bom (kanan) — BESAR, responsif ──
  const bombBtn = document.getElementById('dpad-bomb');
  if (bombBtn) {
    let bombPressAnim = null;
    bombBtn.addEventListener('touchstart', e => {
      e.preventDefault();
      bombBtn.classList.add('pressed');
      placeBomb();
      // Animasi ring pulse
      clearTimeout(bombPressAnim);
      bombBtn.classList.add('bomb-fired');
      bombPressAnim = setTimeout(() => bombBtn.classList.remove('bomb-fired'), 300);
    }, { passive: false });
    bombBtn.addEventListener('touchend', e => {
      e.preventDefault(); bombBtn.classList.remove('pressed');
    }, { passive: false });
    bombBtn.addEventListener('touchcancel', () => bombBtn.classList.remove('pressed'));
  }
}

// ─── KEYBOARD ──────────────────────────────
document.addEventListener('keydown', e => {
  keysHeld[e.key] = true;
  if (e.key === ' ') { e.preventDefault(); placeBomb(); return; }
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal && lbModal.style.display !== 'none') { closeLeaderboard(); return; }
    if (st && st.quizOpen) return;
    const gameScreen = document.getElementById('screen-game');
    if (gameScreen.classList.contains('active') && st && !st.over && !st.won) {
      e.preventDefault(); togglePause();
    }
    return;
  }
  if (e.key === 'Enter') {
    const welcome = document.getElementById('screen-welcome');
    const isModalOpen = ['modal-callsign', 'modal-lobby', 'screen-tutorial', 'settings-modal']
      .some(id => {
        const el = document.getElementById(id);
        return el && el.style.display !== 'none';
      });
    if (welcome.classList.contains('active') && !isModalOpen) {
      startGame();
    }
  }
});
document.addEventListener('keyup', e => { keysHeld[e.key] = false; });
// P0 FIX: orientationchange untuk mobile
window.addEventListener('resize', () => { if (st && (st.running || st.paused)) sizeCanvas(); });
window.addEventListener('orientationchange', () => { setTimeout(() => { if (st && (st.running || st.paused)) sizeCanvas(); }, 300); });

// ─── SETTINGS FUNCTIONS ────────────────────
// ─── CALLSIGN & MULTIPLAYER LOBBY FLOW ─────
function openCallsignModal(mode) {
  callsignMode = mode;
  const modal = document.getElementById('modal-callsign');
  if (!modal) return;
  modal.style.display = 'flex';

  const p = loadProfile();
  const input = document.getElementById('modal-player-name');
  if (input) {
    input.value = p.lastName || '';
    setTimeout(() => input.focus(), 150);
  }
}

function closeCallsignModal() {
  const modal = document.getElementById('modal-callsign');
  if (modal) modal.style.display = 'none';
}

function confirmCallsign() {
  const inputEl = document.getElementById('modal-player-name');
  const name = inputEl ? inputEl.value.trim() : '';
  if (!name) {
    alert('Masukkan nama callsign kamu dulu ya!');
    return;
  }

  const p = loadProfile();
  p.lastName = name;
  saveProfile(p);

  closeCallsignModal();

  if (callsignMode === 'single') {
    myLobbyName = name;
    startGameWithLoading();
  } else {
    openLobbyModal(name);
  }
}

function openLobbyModal(name) {
  myLobbyName = name;
  const modal = document.getElementById('modal-lobby');
  if (!modal) return;
  modal.style.display = 'flex';
  showLobbyStep('select');

  // Pre-fetch ICE servers in the background so they are ready when hosting or joining
  getIceServersConfig().catch(() => {});
}

function closeLobbyModal() {
  const modal = document.getElementById('modal-lobby');
  if (modal) modal.style.display = 'none';
  cleanupPeer();
}

function showLobbyStep(step) {
  const select = document.getElementById('lobby-step-select');
  const setup = document.getElementById('lobby-step-host-setup');
  const host = document.getElementById('lobby-step-host');
  const join = document.getElementById('lobby-step-join');

  if (select) select.style.display = step === 'select' ? 'flex' : 'none';
  if (setup) setup.style.display = step === 'host-setup' ? 'flex' : 'none';
  if (host) host.style.display = step === 'host' ? 'flex' : 'none';
  if (join) join.style.display = step === 'join' ? 'flex' : 'none';

  const title = document.getElementById('lobby-title');
  if (title) {
    if (step === 'select') title.textContent = 'LOBI MULTIPLAYER';
    else if (step === 'host-setup') title.textContent = 'PENGATURAN HOST';
    else if (step === 'host') title.textContent = 'MENUNGGU GUEST JOIN';
    else if (step === 'join') title.textContent = 'GABUNG PERTEMPURAN';
  }
}

function backLobbyStep() {
  const select = document.getElementById('lobby-step-select');
  const setup = document.getElementById('lobby-step-host-setup');
  const host = document.getElementById('lobby-step-host');
  const join = document.getElementById('lobby-step-join');

  if (select && select.style.display !== 'none') {
    closeLobbyModal();
  } else if (setup && setup.style.display !== 'none') {
    showLobbyStep('select');
  } else if (host && host.style.display !== 'none') {
    cleanupPeer();
    showLobbyStep('host-setup');
  } else if (join && join.style.display !== 'none') {
    cleanupPeer();
    showLobbyStep('select');
  }
}

function ensureFirebase() {
  if (firebaseDb) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (typeof firebase === 'undefined') { reject(new Error('Firebase SDK tidak termuat!')); return; }
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      firebaseDb = firebase.database();
      resolve();
    } catch (e) { firebaseDb = firebase.database(); resolve(); }
  });
}

function cleanupPeer() {
  fbListeners.forEach(fn => { try { fn(); } catch (e) { } });
  fbListeners = [];
  if (roomRef && isHost) { roomRef.remove().catch(() => { }); roomRef = null; }
  if (dataChannel) { try { dataChannel.close(); } catch (e) { } dataChannel = null; }
  if (rtcPeer) { try { rtcPeer.close(); } catch (e) { } rtcPeer = null; }
  clearInterval(peerHeartbeatInterval); peerHeartbeatInterval = null;
  isMultiplayer = false; isHost = false; myRole = '';
}

function setupDataChannelHandlers(ch) {
  ch.onopen = () => {
    console.log('DataChannel open!');
    isMultiplayer = true;
    if (isHost) {
      const el = document.getElementById('host-status');
      if (el) el.textContent = 'Terkoneksi! Menunggu data player...';
    } else {
      const el = document.getElementById('join-status');
      if (el) { el.textContent = 'Terkoneksi! Memulai game...'; el.style.color = '#39ff14'; }
      setTimeout(() => {
        if (activeConn.open) activeConn.send({ type: 'JOIN', name: myLobbyName });
      }, 200);
    }
  };
  ch.onmessage = (e) => {
    try { handleMultiplayerPacket(JSON.parse(e.data)); } catch (err) { console.error('Packet parse error:', err); }
  };
  ch.onclose = () => {
    if (st && st.running) { alert('Koneksi terputus! Kembali ke Menu Utama.'); cleanupMultiplayerGame(); }
  };
  ch.onerror = (err) => { console.error('DataChannel error:', err); };
}

async function hostCreateRoom() {
  const roomIdEl = document.getElementById('host-room-id');
  const statusEl = document.getElementById('host-status');
  try { await ensureFirebase(); } catch (e) { alert('Firebase error: ' + e.message); return; }

  const randCode = Math.floor(1000 + Math.random() * 9000);
  roomCode = 'BOM-' + randCode;
  if (roomIdEl) roomIdEl.textContent = roomCode;
  if (statusEl) statusEl.textContent = 'Membuat room...';

  // Inisialisasi roomRef di awal agar siap menampung streaming ICE candidates
  roomRef = firebaseDb.ref('rooms/' + roomCode);

  const iceConfig = await getIceServersConfig();
  rtcPeer = new RTCPeerConnection(iceConfig);
  dataChannel = rtcPeer.createDataChannel('game', { ordered: true });
  setupDataChannelHandlers(dataChannel);

  // Monitor koneksi WebRTC — update status ke user
  rtcPeer.onconnectionstatechange = () => {
    const state = rtcPeer ? rtcPeer.connectionState : '';
    console.log('[HOST] connectionState:', state);
    if (state === 'connected') {
      if (statusEl) statusEl.textContent = 'Terkoneksi dengan guest!';
    } else if (state === 'failed' || state === 'disconnected') {
      if (statusEl) statusEl.textContent = 'Koneksi gagal. Coba lagi.';
    }
  };
  rtcPeer.oniceconnectionstatechange = () => {
    const state = rtcPeer ? rtcPeer.iceConnectionState : '';
    console.log('[HOST] iceConnectionState:', state);
    if (statusEl && state === 'checking') statusEl.textContent = 'Menyambungkan ke guest...';
    if (statusEl && state === 'connected') statusEl.textContent = 'ICE terhubung!';
    if (state === 'failed') {
      // Coba restart ICE otomatis
      if (rtcPeer) {
        console.warn('[HOST] ICE failed, mencoba restartIce...');
        rtcPeer.restartIce();
      }
    }
  };

  const iceCandidates = [];
  rtcPeer.onicecandidate = (e) => {
    if (e.candidate) {
      const cand = e.candidate.toJSON();
      iceCandidates.push(cand);
      // Streaming ICE secara dinamis ke Firebase
      if (roomRef) {
        roomRef.child('hostIce').push(cand).catch(() => {});
      }
    }
  };

  const offer = await rtcPeer.createOffer();
  await rtcPeer.setLocalDescription(offer);

  // Langsung simpan offer ke Firebase DULU (tanpa nunggu ICE selesai)
  // supaya guest bisa mulai baca dan kirim answer lebih cepat
  try {
    await roomRef.set({
      offer: { type: rtcPeer.localDescription.type, sdp: rtcPeer.localDescription.sdp },
      ice: [],
      ts: firebase.database.ServerValue.TIMESTAMP
    });
  } catch (err) {
    alert("Waduh! Firebase Realtime Database menolak akses (Gagal membuat room).\nDetail: " + err.message + "\n\nSolusi: Kemungkinan besar aturan keamanan (Security Rules) Firebase Anda sudah kedaluwarsa (berlalu 30 hari sejak dibuat).\nSilakan buka Firebase Console -> Realtime Database -> Tab 'Rules', lalu ubah aturan .read dan .write menjadi 'true' agar bisa diakses kembali!");
    cleanupPeer();
    showLobbyStep('select');
    return;
  }

  // Room otomatis dihapus setelah 10 menit
  setTimeout(() => { if (roomRef) roomRef.remove().catch(() => { }); }, 600000);

  if (statusEl) statusEl.textContent = 'Menunggu pemain kedua bergabung...';

  const answerRef = roomRef.child('answer');
  const listener = answerRef.on('value', async (snap) => {
    const val = snap.val();
    if (!val || !val.sdp) return;
    answerRef.off('value', listener);
    if (statusEl) statusEl.textContent = 'Guest ditemukan! Menyambungkan...';

    try {
      await rtcPeer.setRemoteDescription(new RTCSessionDescription(val));
    } catch(e) { console.error('[HOST] setRemoteDescription error:', e); return; }

    // Tambah ICE candidates dari answer guest
    for (const c of (val.ice || [])) {
      try { await rtcPeer.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { }
    }

    // Mulai streaming dengerin ICE dari Guest secara real-time
    const guestIceRef = roomRef.child('guestIce');
    const guestIceListener = guestIceRef.on('child_added', async (cSnap) => {
      const c = cSnap.val();
      if (c && rtcPeer && rtcPeer.remoteDescription) {
        try { await rtcPeer.addIceCandidate(new RTCIceCandidate(c)); } catch (err) { }
      }
    });
    fbListeners.push(() => guestIceRef.off('child_added', guestIceListener));
  });
  fbListeners.push(() => answerRef.off('value', listener));
}

async function guestJoinRoom(code) {
  const joinStatus = document.getElementById('join-status');
  try { await ensureFirebase(); } catch (e) { alert('Firebase error: ' + e.message); return; }
  if (joinStatus) { joinStatus.textContent = 'Mencari room...'; joinStatus.style.color = 'var(--acc)'; }

  let snap;
  try { snap = await firebaseDb.ref('rooms/' + code).get(); }
  catch (e) {
    alert("Waduh! Firebase Realtime Database menolak akses (Gagal mencari room).\nDetail: " + e.message + "\n\nSolusi: Aturan keamanan (Security Rules) Firebase Anda kemungkinan sudah kedaluwarsa (berlalu 30 hari sejak dibuat).\nSilakan buka Firebase Console -> Realtime Database -> Tab 'Rules', lalu ubah aturan .read dan .write menjadi 'true' agar bisa diakses kembali!");
    if (joinStatus) { joinStatus.textContent = 'Gagal koneksi!'; joinStatus.style.color = 'var(--red)'; }
    return;
  }

  if (!snap.exists()) {
    if (joinStatus) { joinStatus.textContent = 'Room tidak ditemukan! Cek kode.'; joinStatus.style.color = 'var(--red)'; }
    return;
  }

  const roomData = snap.val();
  if (!roomData.offer || !roomData.offer.sdp) {
    if (joinStatus) { joinStatus.textContent = 'Room belum siap. Tunggu sebentar lalu coba lagi.'; joinStatus.style.color = 'var(--red)'; }
    return;
  }
  roomCode = code;

  if (joinStatus) { joinStatus.textContent = 'Room ditemukan! Menyambungkan...'; joinStatus.style.color = 'var(--acc)'; }

  const iceConfig = await getIceServersConfig();
  rtcPeer = new RTCPeerConnection(iceConfig);

  const iceCandidates = [];
  rtcPeer.onicecandidate = (e) => {
    if (e.candidate) {
      const cand = e.candidate.toJSON();
      iceCandidates.push(cand);
      // Streaming ICE secara dinamis ke Firebase agar dibaca Host
      firebaseDb.ref('rooms/' + code + '/guestIce').push(cand).catch(() => {});
    }
  };

  // Monitor koneksi WebRTC — update status ke user
  rtcPeer.onconnectionstatechange = () => {
    const state = rtcPeer ? rtcPeer.connectionState : '';
    console.log('[GUEST] connectionState:', state);
    if (state === 'connected') {
      if (joinStatus) { joinStatus.textContent = 'Terkoneksi! Memulai game...'; joinStatus.style.color = '#39ff14'; }
    } else if (state === 'failed' || state === 'disconnected') {
      if (joinStatus) { joinStatus.textContent = 'Koneksi gagal. Coba lagi.'; joinStatus.style.color = 'var(--red)'; }
      cleanupPeer();
      showLobbyStep('join');
    }
  };
  rtcPeer.oniceconnectionstatechange = () => {
    const state = rtcPeer ? rtcPeer.iceConnectionState : '';
    console.log('[GUEST] iceConnectionState:', state);
    if (joinStatus && state === 'checking') { joinStatus.textContent = 'Mencari jalur koneksi...'; joinStatus.style.color = 'var(--acc)'; }
    if (state === 'failed') {
      // Coba restart ICE otomatis
      if (rtcPeer) {
        console.warn('[GUEST] ICE failed, mencoba restartIce...');
        rtcPeer.restartIce();
      }
    }
  };

  rtcPeer.ondatachannel = (e) => { dataChannel = e.channel; setupDataChannelHandlers(dataChannel); };

  // Set remote description dari offer host
  try {
    await rtcPeer.setRemoteDescription(new RTCSessionDescription(roomData.offer));
  } catch(e) {
    if (joinStatus) { joinStatus.textContent = 'Gagal baca offer host!'; joinStatus.style.color = 'var(--red)'; }
    cleanupPeer();
    return;
  }

  // Tambahkan ICE candidates host yang sudah ada di snapshot awal
  for (const c of (roomData.ice || [])) {
    try { await rtcPeer.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { }
  }

  // Mulai streaming dengerin ICE dari Host secara real-time SETELAH setRemoteDescription
  const hostIceRef = firebaseDb.ref('rooms/' + code + '/hostIce');
  const hostIceListener = hostIceRef.on('child_added', async (cSnap) => {
    const c = cSnap.val();
    if (c && rtcPeer && rtcPeer.remoteDescription) {
      try { await rtcPeer.addIceCandidate(new RTCIceCandidate(c)); } catch (err) { }
    }
  });
  fbListeners.push(() => hostIceRef.off('child_added', hostIceListener));

  // Buat answer
  const answer = await rtcPeer.createAnswer();
  await rtcPeer.setLocalDescription(answer);

  // Kirim answer ke Firebase SEGERA tanpa nunggu ICE gathering selesai
  // ICE candidates dikirim secara streaming via onicecandidate di atas
  try {
    await firebaseDb.ref('rooms/' + code + '/answer').set({
      type: rtcPeer.localDescription.type,
      sdp: rtcPeer.localDescription.sdp,
      ice: [] // ICE dikirim streaming, bukan batch
    });
  } catch (err) {
    alert("Gagal mengirimkan koneksi balik ke Firebase!\nDetail: " + err.message + "\n\nTip: Pastikan aturan Firebase Realtime Database Rules Anda tidak kedaluwarsa.");
    cleanupPeer();
    return;
  }

  if (joinStatus) { joinStatus.textContent = 'Menyambungkan ke host...'; joinStatus.style.color = '#39ff14'; }

  // Timeout fallback — kalau 20 detik belum konek, kasih pesan error
  setTimeout(() => {
    if (rtcPeer && rtcPeer.connectionState !== 'connected' && rtcPeer.iceConnectionState !== 'connected') {
      if (joinStatus && joinStatus.textContent === 'Menyambungkan ke host...') {
        joinStatus.textContent = 'Timeout! Pastikan room masih aktif atau coba lagi.';
        joinStatus.style.color = 'var(--red)';
        cleanupPeer();
        showLobbyStep('join');
      }
    }
  }, 20000);
}

function handleMultiplayerPacket(data) {
  if (data.type === 'JOIN') {
    opponentState.name = data.name || 'GUEST';
    applyTheme(); COLS = 21; ROWS = 13;
    const grid = generateMap(0.55);
    st = initState(myLobbyName, 1, true);
    st.grid = grid; st.powerups = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      if (st.grid[r][c] === T_ITEM) st.powerups.push({ row: r, col: c, type: PU_QUIZ });
    opponentState.row = ROWS - 2; opponentState.col = COLS - 2; opponentState.renderX = COLS - 2; opponentState.renderY = ROWS - 2;
    opponentState.dir = 'up'; opponentState.alive = true; opponentState.lives = 3; opponentState.score = 0;
    opponentState.invincible = false; opponentState.speedActive = false; opponentState.blastLevel = 0;
    setTimeout(() => {
      if (activeConn.open) activeConn.send({
        type: 'INIT', grid: st.grid, powerups: st.powerups,
        theme: currentTheme, difficulty: currentDifficulty, maxLevels: maxLevels, hostName: st.name,
        enemies: st.enemies.map(e => ({ id: e.id, row: e.row, col: e.col, dir: e.dir, alive: e.alive }))
      });
    }, 250);
    if (roomRef) { roomRef.remove().catch(() => { }); roomRef = null; }
  }
  else if (data.type === 'INIT') {
    COLS = 21; ROWS = 13; currentTheme = data.theme; currentDifficulty = data.difficulty; maxLevels = data.maxLevels;
    applyTheme();
    st = initState(myLobbyName, 1, true);
    st.grid = data.grid; st.powerups = data.powerups;
    st.player.row = ROWS - 2; st.player.col = COLS - 2; st.player.renderX = COLS - 2; st.player.renderY = ROWS - 2; st.player.dir = 'up';
    st.enemies = data.enemies.map(e => ({ id: e.id, row: e.row, col: e.col, renderX: e.col, renderY: e.row, alive: e.alive, stuckCount: 0, dir: e.dir }));
    opponentState = { row: 1, col: 1, renderX: 1, renderY: 1, dir: 'down', alive: true, lives: 3, score: 0, invincible: false, speedActive: false, blastLevel: 0, name: data.hostName || 'HOST' };
    if (activeConn.open) activeConn.send({ type: 'START_ACK' });
    startMultiplayerGame();
  }
  else if (data.type === 'START_ACK') { startMultiplayerGame(); }
  else if (data.type === 'MOVE') {
    opponentState.row = data.row; opponentState.col = data.col; opponentState.dir = data.dir;
    opponentState.lives = data.lives; opponentState.score = data.score;
    if (data.kills !== undefined) opponentState.kills = data.kills;
    opponentState.invincible = data.invincible; opponentState.speedActive = data.speedActive; opponentState.blastLevel = data.blastLevel;
    if (opponentState.renderX === undefined) { opponentState.renderX = data.col; opponentState.renderY = data.row; }

    // Spectator logic: update opponent's alive state
    if (opponentState.lives <= 0) {
      opponentState.alive = false;
      opponentState.renderX = opponentState.col;
      opponentState.renderY = opponentState.row;
      // If we are also dead (both dead), end the game!
      if (st.player.lives <= 0 && st.running) {
        st.running = false;
        setTimeout(() => endGame(false), 700);
      }
    } else {
      opponentState.alive = true;
    }
  }
  else if (data.type === 'ENEMIES') {
    st.enemies.forEach(le => {
      const re = data.enemies.find(oe => oe.id === le.id);
      if (re) {
        le.row = re.row; le.col = re.col; le.dir = re.dir;
        // Only update alive from host if enemy is still alive — don't resurrect locally-killed enemies
        if (re.alive === false) le.alive = false;
        else if (le.alive !== false) le.alive = re.alive;
      }
    });
  }
  // Immediate enemy kill from opponent — override before next ENEMIES tick
  else if (data.type === 'ENEMY_KILL') {
    const e = st.enemies.find(e => e.id === data.id);
    if (e) {
      // Tandai musuh mati secara visual saja, TIDAK mendapat skor/kills individu lawan
      e.alive = false;
    }
    // Host checks if this final kill from Guest cleared the level
    if (isHost && st.enemies.every(oe => !oe.alive) && st.running) {
      st.running = false;
      setTimeout(() => nextLevel(), 700);
    }
  }
  // Bug fix: PLACE_BOMB handler was missing — guest now sees host bombs visually
  else if (data.type === 'PLACE_BOMB') {
    const fuse = data.fuse || 2500;
    const bomb = { row: data.row, col: data.col, explodeAt: Date.now() + fuse, isMine: false, ownerBlastLevel: data.blastLevel || 0 };
    st.bombs.push(bomb);
    // Guest side: just visual — explosion is driven by EXPLOSION_SYNC from host
    bomb._tid = setTimeout(() => {
      st.bombs = st.bombs.filter(b => b !== bomb);
    }, fuse);
    SoundEngine.playBombPlace();
  }
  // Bug fix: EXPLOSION_SYNC replaces old EXPLOSION — syncs all explosion cells at once
  else if (data.type === 'EXPLOSION_SYNC') {
    SoundEngine.playExplosion();
    const bombDamagesMe = (currentDifficulty === 'normal' || currentDifficulty === 'hard');
    (data.cells || []).forEach(({ row: r, col: c }) => {
      st.explosions.push({ row: r, col: c, expireAt: Date.now() + EXPLOSION_MS });
      // Guest: cek apakah dirinya kena ledakan bom lawan (OPPONENT_HIT dari host yg authoritative)
      // Self damage dari bom sendiri tetap dihandle lokal di explodeBomb
    });
    // Note: damage ke guest dikirim via OPPONENT_HIT dari host, tidak perlu double-process di sini
  }
  else if (data.type === 'BOMB') {
    // Legacy fallback
    const fuse = data.fuse || 2500;
    const bomb = { row: data.row, col: data.col, explodeAt: Date.now() + fuse, isMine: false };
    st.bombs.push(bomb);
    bomb._tid = setTimeout(() => { st.bombs = st.bombs.filter(b => b !== bomb); }, fuse);
  }
  else if (data.type === 'EXPLOSION') { triggerExplosionVisual(data.row, data.col, data.blastLevel); }
  // Bug fix: PICKUP juga remove dari powerups array + grid
  else if (data.type === 'PICKUP') {
    st.powerups = st.powerups.filter(p => !(p.row === data.row && p.col === data.col));
    if (st.grid[data.row]) st.grid[data.row][data.col] = T_EMPTY;
  }
  else if (data.type === 'FREEZE_ACTIVE') {
    st.freezeActive = true;
    st.freezeUntil = Date.now() + (data.duration || FREEZE_DUR);
    const r = opponentState.row, c = opponentState.col;
    showPopup('❄️ FREEZE!', c, r, '#64d8ff');
    SoundEngine.playPickup();
  }
  // Bug fix: GRID_UPDATE sekarang juga update powerups array
  else if (data.type === 'GRID_UPDATE') {
    if (st.grid[data.row]) {
      st.grid[data.row][data.col] = data.tile;
      if (data.tile === T_ITEM && data.powerupType) {
        st.powerups = st.powerups.filter(p => !(p.row === data.row && p.col === data.col));
        st.powerups.push({ row: data.row, col: data.col, type: data.powerupType });
      } else if (data.tile === T_EMPTY) {
        st.powerups = st.powerups.filter(p => !(p.row === data.row && p.col === data.col));
      }
    }
  }
  // Guest hancurkan tembok — host update grid-nya agar musuh AI tidak nabrak tembok hantu
  else if (data.type === 'GUEST_GRID_UPDATE') {
    if (isHost && st.grid[data.row]) {
      const tile = st.grid[data.row][data.col];
      if (tile === T_BRICK) {
        // Host tentukan apakah ada item yang spawn (authoritative)
        let pType = null;
        if (Math.random() < 0.38) {
          const types = [PU_SPEED, PU_BLAST, PU_BOMB, PU_QUIZ, PU_SHIELD, PU_FREEZE, PU_MAGNET, PU_HEART];
          const weights = [0.18, 0.18, 0.18, 0.16, 0.08, 0.08, 0.07, 0.07];
          let roll = Math.random(), acc = 0;
          pType = PU_QUIZ;
          for (let i = 0; i < types.length; i++) {
            acc += weights[i];
            if (roll < acc) { pType = types[i]; break; }
          }
          st.grid[data.row][data.col] = T_ITEM;
          st.powerups.push({ row: data.row, col: data.col, type: pType });
        } else {
          st.grid[data.row][data.col] = T_EMPTY;
        }
        // Broadcast hasil ke guest (termasuk apakah ada item)
        if (activeConn && activeConn.open) {
          activeConn.send({
            type: 'GRID_UPDATE',
            row: data.row,
            col: data.col,
            tile: pType ? T_ITEM : T_EMPTY,
            powerupType: pType
          });
        }
      }
    }
  }
  else if (data.type === 'QUIZ') { if (!isHost) { pendingQuiz = data.quiz; showQuiz(data.quiz, false); } }
  else if (data.type === 'QUIZ_RESULT') { opponentState.score = data.score; }
  // Bug fix: OPPONENT_HIT — guest terima damage dari host yang authoritative
  else if (data.type === 'OPPONENT_HIT') {
    if (!isHost) {
      st.player.lives = data.lives;
      flashDamage(); SoundEngine.playHit();
      if (st.player.lives <= 0) {
        st.player.alive = false;
        // Snap render coordinates immediately upon death to avoid slide freeze
        st.player.renderX = st.player.col;
        st.player.renderY = st.player.row;
        // Guest side: send DIED packet containing final coordinates to Host
        if (activeConn && activeConn.open) {
          activeConn.send({
            type: 'DIED',
            row: st.player.row,
            col: st.player.col
          });
        }

        // Guest side: check if opponent (Host) is also dead
        if (opponentState.lives <= 0) {
          st.running = false;
          setTimeout(() => endGame(false), 700);
        } else {
          console.log("Spectating the Host...");
        }
      } else {
        respawnPlayer();
      }
    }
  }
  else if (data.type === 'HIT') {
    opponentState.lives = data.lives;
    if (opponentState.lives <= 0) {
      opponentState.alive = false;
      opponentState.renderX = opponentState.col;
      opponentState.renderY = opponentState.row;
      if (st.player.lives <= 0 && st.running) {
        st.running = false;
        setTimeout(() => endGame(false), 700);
      }
    } else {
      opponentState.alive = true;
    }
  }
  else if (data.type === 'DIED') {
    opponentState.lives = 0;
    opponentState.alive = false;
    opponentState.row = data.row;
    opponentState.col = data.col;
    opponentState.renderX = data.col;
    opponentState.renderY = data.row;

    // Check if both players are now dead to end game
    if (st.player.lives <= 0 && st.running) {
      st.running = false;
      setTimeout(() => endGame(false), 700);
    }
  }
  else if (data.type === 'LEVEL_BANNER') {
    // Guest tampilkan banner level selesai (sync dengan host)
    if (!isHost) {
      const guestBonus = data.bonus || 0;
      st.score += guestBonus;
      showLevelBanner(data.doneLevel, st.score, guestBonus, () => {
        // Banner selesai — tunggu NEXT_LEVEL packet dari host untuk ganti map
      });
    }
  }
  else if (data.type === 'NEXT_LEVEL') {
    if (!isHost) {
      st.level = data.level;
      COLS = 21; ROWS = 13;
      st.grid = data.grid;
      st.powerups = data.powerups || [];
      st.enemies = data.enemies.map(e => ({
        id: e.id, row: e.row, col: e.col, renderX: e.col, renderY: e.row,
        alive: e.alive, stuckCount: 0, dir: e.dir
      }));
      st.bombs.forEach(b => clearTimeout(b._tid));
      st.bombs = []; st.explosions = [];

      // Guest side resurrection: revive dead player & opponent with 1 life
      if (st.player.lives <= 0) st.player.lives = 1;
      st.player.alive = true;
      if (opponentState.lives <= 0) opponentState.lives = 1;
      opponentState.alive = true;

      st.player.row = ROWS - 2; st.player.col = COLS - 2;
      st.player.renderX = COLS - 2; st.player.renderY = ROWS - 2;
      st.player.bombsAvail = st.player.bombCap;
      st.player.invincible = true; st.player.invincibleUntil = Date.now() + 3000;

      // Resurrect Host at correct start tile on Guest's screen
      opponentState.row = 1; opponentState.col = 1;
      opponentState.renderX = 1; opponentState.renderY = 1;
      st.running = true;
      startTimers();
      animFr = requestAnimationFrame(gameLoop);
    }
  }
  else if (data.type === 'GAME_OVER') {
    st.running = false;
    // Hanya sinkronisasi waktu elapsed (durasi misi) agar sama presisi
    if (data.seconds !== undefined) st.seconds = data.seconds;
    endGame(data.won);
  }
  else if (data.type === 'REQUEST_NEXT_LEVEL') {
    if (isHost && st.enemies.every(oe => !oe.alive)) {
      st.running = false;
      setTimeout(() => nextLevel(), 700);
    }
  }
  else if (data.type === 'HEARTBEAT') { }
}

function lobbySelectRole(role) {
  if (role === 'host') {
    showLobbyStep('host-setup');
    isHost = true; myRole = 'host';
    document.querySelectorAll('#lobby-theme-options .sopt-btn').forEach(b => b.classList.toggle('active', b.dataset.val === 'all'));
    document.querySelectorAll('#lobby-diff-options .sopt-btn').forEach(b => b.classList.toggle('active', b.dataset.val === 'normal'));
    document.querySelectorAll('#lobby-maxlevel-options .sopt-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.val) === 5));
    lobbyTheme = 'all'; lobbyDifficulty = 'normal'; lobbyMaxLevels = 5;
  } else {
    showLobbyStep('join');
    const joinStatus = document.getElementById('join-status');
    if (joinStatus) { joinStatus.textContent = 'Masukkan kode dan klik Hubungkan'; joinStatus.style.color = 'var(--dim)'; }
    const input = document.getElementById('join-room-input');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 150); }
    isHost = false; myRole = 'guest';
  }
}

function confirmHostSetup() {
  currentTheme = lobbyTheme; currentDifficulty = lobbyDifficulty; maxLevels = lobbyMaxLevels;
  applyTheme(); showLobbyStep('host'); hostCreateRoom();
}

function lobbyConnectAsGuest() {
  const inputEl = document.getElementById('join-room-input');
  const code = inputEl ? inputEl.value.trim().toUpperCase() : '';
  if (!code) { alert('Masukkan kode room host!'); return; }
  guestJoinRoom(code);
}

function copyRoomCode() {
  const codeText = document.getElementById('host-room-id').textContent;
  if (!codeText || codeText === 'MEMBUAT...') return;
  navigator.clipboard.writeText(codeText).then(() => alert('Kode room ' + codeText + ' disalin!')).catch(() => alert('Salin manual: ' + codeText));
}

function setLobbyTheme(val, btn) { lobbyTheme = val; document.querySelectorAll('#lobby-theme-options .sopt-btn').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); }
function setLobbyDifficulty(val, btn) { lobbyDifficulty = val; document.querySelectorAll('#lobby-diff-options .sopt-btn').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); }
function setLobbyMaxLevel(val, btn) { lobbyMaxLevels = val; document.querySelectorAll('#lobby-maxlevel-options .sopt-btn').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); }

function startMultiplayerGame() {
  isMultiplayer = true; _achQueue = []; _achShowing = false;
  lastHudState = {}; // Reset HUD cache!
  applyTheme(); SoundEngine.init();
  setTimeout(() => SoundEngine.playPickup(), 100);
  SoundEngine.startBGM();
  sizeCanvas(); st.running = true;
  showScreen('screen-game');
  setDpadVisible(true);
  const modal = document.getElementById('modal-lobby');
  if (modal) modal.style.display = 'none';
  stopTimers(); startTimers();
  lastMoveTs = 0;
  animFr = requestAnimationFrame(gameLoop);
}

function cleanupMultiplayerGame() {
  st.running = false; stopTimers(); cleanupPeer(); showScreen('screen-welcome');
}

function sendMultiplayerMove() {
  if (!isMultiplayer || !activeConn) return;
  activeConn.send({
    type: 'MOVE',
    row: st.player.row,
    col: st.player.col,
    dir: st.player.dir,
    lives: st.player.lives,
    score: st.score,
    kills: st.kills,
    invincible: st.player.invincible,
    speedActive: st.player.speedActive,
    blastLevel: st.player.blastLevel
  });
}

function drawNameTag(name, rx, ry, color) {
  const T = getTile();
  const cx = rx * T + T / 2;
  const cy = ry * T - 8;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.font = `bold ${Math.floor(T * 0.26)}px monospace`;
  ctx.textAlign = 'center';

  const textWidth = ctx.measureText(name).width;
  ctx.fillRect(cx - textWidth / 2 - 4, cy - 8, textWidth + 8, 14);

  ctx.fillStyle = color || '#00e5ff';
  ctx.fillText(name, cx, cy + 2);
}

// ─── DRAW OPPONENT PLAYER ──────────────────
function drawOpponent(op) {
  if (!op.alive) return;
  const T = getTile(), now = Date.now();

  if (op.renderX === undefined) { op.renderX = op.col; op.renderY = op.row; }
  op.renderX += (op.col - op.renderX) * 0.48;
  op.renderY += (op.row - op.renderY) * 0.48;
  if (Math.abs(op.col - op.renderX) < 0.01) op.renderX = op.col;
  if (Math.abs(op.row - op.renderY) < 0.01) op.renderY = op.row;

  const isMoving = Math.abs(op.col - op.renderX) > 0.03 || Math.abs(op.row - op.renderY) > 0.03;

  const bounceSpeed = isMoving ? 130 : 220;
  const bounceScale = isMoving ? 0.06 : 0.03;
  const squashX = 1 + bounceScale * Math.sin(now / bounceSpeed);
  const squashY = 1 - bounceScale * Math.sin(now / bounceSpeed);
  const tilt = isMoving ? 0.12 * Math.sin(now / 70) : 0;

  const w = T * 0.95 * squashX;
  const h = T * 1.15 * squashY;

  const cx = op.renderX * T + T / 2;
  const cy = op.renderY * T + T * 0.88;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, T * 0.28, T * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Speed aura
  if (op.speedActive) {
    const grad = ctx.createRadialGradient(cx, cy - T * 0.4, 0, cx, cy - T * 0.4, T * 0.6);
    grad.addColorStop(0, 'rgba(255, 204, 0, 0.45)');
    grad.addColorStop(0.5, 'rgba(255, 170, 0, 0.15)');
    grad.addColorStop(1, 'rgba(255, 170, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy - T * 0.4, T * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  let themeImg;
  if (op.dir === 'up') {
    const backKey = currentTheme === 'all' ? 'allBack' : currentTheme + 'Back';
    themeImg = spriteAssets.player[backKey];
  } else {
    themeImg = spriteAssets.player[currentTheme] || spriteAssets.player.all;
  }

  if (themeImg && themeImg.complete) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    if (op.dir === 'right') {
      ctx.scale(-1, 1);
    }
    const originalSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(themeImg, -w / 2, -h, w, h);

    ctx.imageSmoothingEnabled = originalSmoothing;
    ctx.restore();
  }

  // Shield
  if (op.invincible) {
    const pulse = 1 + 0.1 * Math.sin(now / 100);
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy - h / 2, T * 0.48 * pulse, T * 0.42 * pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawNameTag(op.name || 'LAWAN', op.renderX, op.renderY - 0.2, '#ff1744');
}

function switchTutorTab(tabType) {
  document.querySelectorAll('#screen-tutorial .lb-tab').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = document.getElementById('tutor-tab-' + tabType);
  if (activeBtn) activeBtn.classList.add('active');

  const imgEl = document.getElementById('tutor-img');
  const descEl = document.getElementById('tutor-desc');

  if (imgEl && descEl) {
    imgEl.style.opacity = 0;
    setTimeout(() => {
      if (tabType === 'hp') {
        imgEl.src = 'tutor_controlhp.png';
        descEl.innerHTML = `🎮 <strong>KONTROL ANALOG MOBILE</strong><br><br>Gerakkan joystick virtual di bagian kiri layar untuk memandu karakter kamu melintasi labirin pertempuran.<br>Tekan tombol <strong>BOM</strong> besar di bagian kanan layar untuk menjatuhkan bom peledak di posisimu.<br>Hancurkan rintangan bata untuk menemukan bonus mapel dan item upgrade!`;
      } else if (tabType === 'pc') {
        imgEl.src = 'tutor_controlpc.png';
        descEl.innerHTML = `⌨️ <strong>KONTROL NAVIGASI KEYBOARD</strong><br><br>Gunakan tombol panah keyboard <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> untuk bergerak dengan presisi taktis tinggi.<br>Tekan tombol <kbd>Spasi</kbd> untuk menempatkan bom peledak.<br>Jika game perlu dijeda secara mendadak saat bertempur, tekan tombol <kbd>ESC</kbd> atau <kbd>P</kbd>.`;
      } else if (tabType === 'multi') {
        imgEl.src = 'tutor_multiply.png';
        descEl.innerHTML = `🌐 <strong>PERTANDINGAN ONLINE P2P</strong><br><br>Bertanding secara real-time langsung dengan temanmu lewat koneksi WebRTC P2P PeerJS tanpa server perantara!<br>Satu pemain bertindak sebagai <strong>Host</strong> (Buat Match) dan menyalin kode room unik.<br>Pemain kedua bertindak sebagai <strong>Joiner</strong> (Gabung Match), memasukkan kode room tersebut, lalu langsung terjun ke pertempuran di map berukuran raksasa <strong>21x13</strong>!`;
      }
      imgEl.style.opacity = 1;
    }, 150);
  }
}

function openTutorial() {
  const modal = document.getElementById('screen-tutorial');
  if (modal) {
    modal.style.display = 'flex';
    switchTutorTab('hp');
  }
}
function closeTutorial() {
  const modal = document.getElementById('screen-tutorial');
  if (modal) modal.style.display = 'none';
}
function closeTutorialOutside(e) {
  if (e.target.id === 'screen-tutorial') closeTutorial();
}

function startGameWithLoading() {
  const nameInput = myLobbyName || 'PEMAIN';

  showScreen('screen-loading-transition');
  let progress = 0;
  const bar = document.getElementById('transition-bar-fill');
  if (bar) bar.style.width = '0%';

  const interval = setInterval(() => {
    progress += Math.random() * 20 + 10;
    if (progress >= 100) progress = 100;
    if (bar) bar.style.width = progress + '%';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        const transScreen = document.getElementById('screen-loading-transition');
        if (transScreen) {
          transScreen.classList.remove('active');
          transScreen.style.display = 'none';
        }
        startGame();
      }, 400);
    }
  }, 150);
}

function startGame() {
  _achQueue = []; _achShowing = false;
  lastHudState = {}; // Reset HUD cache!
  applyTheme();
  SoundEngine.init();
  setTimeout(() => { SoundEngine.playPickup(); }, 100);
  SoundEngine.startBGM();

  const p = loadProfile();
  const name = myLobbyName || p.lastName || 'PEMAIN';

  COLS = 15;
  ROWS = 9;
  isMultiplayer = false;

  st = initState(name);
  sizeCanvas(); st.running = true;
  showScreen('screen-game');
  setDpadVisible(true);
  startTimers(); lastMoveTs = 0;
  animFr = requestAnimationFrame(gameLoop);
}

window.showScreen = showScreen;
window.restartGame = restartGame;
window.openLeaderboard = openLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.closeLbOutside = closeLbOutside;
window.switchLbTab = switchLbTab;
window.clearLeaderboard = clearLeaderboard;
window.resumeGame = resumeGame;
window.goMenuFromPause = goMenuFromPause;
window.togglePause = togglePause;
window.setTheme = setTheme;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.closeSettingsOutside = closeSettingsOutside;
window.setDifficulty = setDifficulty;
window.setMaxLevel = setMaxLevel;

window.openCallsignModal = openCallsignModal;
window.closeCallsignModal = closeCallsignModal;
window.confirmCallsign = confirmCallsign;
window.lobbySelectRole = lobbySelectRole;
window.setLobbyTheme = setLobbyTheme;
window.setLobbyDifficulty = setLobbyDifficulty;
window.setLobbyMaxLevel = setLobbyMaxLevel;
window.confirmHostSetup = confirmHostSetup;
window.copyRoomCode = copyRoomCode;
window.lobbyConnectAsGuest = lobbyConnectAsGuest;
window.backLobbyStep = backLobbyStep;
window.switchTutorTab = switchTutorTab;
window.openTutorial = openTutorial;
window.closeTutorial = closeTutorial;
window.closeTutorialOutside = closeTutorialOutside;

document.getElementById('modal-player-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.stopPropagation(); confirmCallsign(); } });

function openSettings() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.querySelectorAll('#diff-options .sopt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.val === currentDifficulty);
  });
  document.querySelectorAll('#maxlevel-options .sopt-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.val) === maxLevels);
  });
  document.querySelectorAll('#theme-options .sopt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.val === currentTheme);
  });
  updateDiffDesc();
  updateThemeDesc();
}
function closeSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.style.display = 'none';
}
function closeSettingsOutside(e) {
  if (e.target === document.getElementById('settings-modal')) closeSettings();
}
function setDifficulty(val, btn) {
  currentDifficulty = val;
  document.querySelectorAll('#diff-options .sopt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateDiffDesc();
}
function setMaxLevel(val, btn) {
  maxLevels = val;
  document.querySelectorAll('#maxlevel-options .sopt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function updateDiffDesc() {
  const el = document.getElementById('diff-desc');
  if (!el) return;
  const desc = {
    easy: 'Musuh bergerak lambat 🐢',
    normal: 'Musuh kecepatan normal ⚡',
    hard: 'Musuh bergerak sangat cepat 💀',
  };
  el.textContent = desc[currentDifficulty] || '';
}
function setTheme(val, btn) {
  currentTheme = val;
  document.querySelectorAll('#theme-options .sopt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateThemeDesc();

  // Update dynamic menu background
  const menuBg = document.getElementById('menu-bg-wrap');
  if (menuBg) {
    menuBg.className = 'menu-bg-wrap bg-theme-' + val;
  }

  // Update badge on main menu
  const menuBadge = document.getElementById('menu-edu-badge');
  if (menuBadge) {
    const t = THEMES[currentTheme] || THEMES.all;
    if (val === 'all') {
      menuBadge.textContent = '🎓 SEJARAH · PKN · AGAMA ISLAM';
    } else {
      menuBadge.textContent = t.icon + ' ' + t.name.toUpperCase();
    }
  }

  // Apply theme to game/win/gameover screens immediately
  applyTheme();
}
function updateThemeDesc() {
  const el = document.getElementById('theme-desc');
  if (!el) return;
  const t = THEMES[currentTheme] || THEMES.all;
  el.textContent = t.icon + ' ' + t.label;
}

function simulateLoadingInit() {
  const screen = document.getElementById('screen-loading-init');
  if (screen) {
    screen.style.display = 'flex';
    screen.classList.add('active');
    setTimeout(() => {
      screen.classList.remove('active');
      screen.style.display = 'none';
      showScreen('screen-welcome');
    }, 2000); // 2 seconds initial load
  } else {
    showScreen('screen-welcome');
  }
}

window.showScreen = showScreen;
window.restartGame = restartGame;
window.openLeaderboard = openLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.closeLbOutside = closeLbOutside;
window.switchLbTab = switchLbTab;
window.clearLeaderboard = clearLeaderboard;
window.resumeGame = resumeGame;
window.goMenuFromPause = goMenuFromPause;
window.togglePause = togglePause;
window.setTheme = setTheme;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.closeSettingsOutside = closeSettingsOutside;
window.setDifficulty = setDifficulty;
window.setMaxLevel = setMaxLevel;

renderWelcomeStats();
initTouchControls();
simulateLoadingInit();


