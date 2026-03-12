/* ============================================================
   CONFIG — STATIC DATA
============================================================ */

/** Gen 1 Game Boy sprite URL for a given Pokédex number */
const getSpriteUrl = (dexId) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${dexId}.png`;

/** PokeAPI item sprite URL */
const getItemSpriteUrl = (slug) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;

/** Translated UI labels */
const UI_LABELS = {
  fr: { owned: 'POSSEDEES', total: 'TOTAL', complete: 'COMPLET',  all: 'TOUTES', yes: 'POSSEDEES', no: 'MANQUANTES', search: '🔍 Rechercher...', subtitle: 'TRACKER — EDITION JAPONAISE',
        export: 'EXPORTER', import: 'IMPORTER', reset: 'RESET',
        noCards: '⚠️ Aucune carte à exporter !', alreadyEmpty: '⚠️ La collection est déjà vide !',
        imported: 'cartes importées !', resetDone: '🗑 Collection réinitialisée',
        resetTitle: 'REMETTRE', resetCards: 'CARTES À ZÉRO ?', resetHint: 'Cette action est irréversible.\nPense à exporter avant !',
        resetYes: 'OUI, RESET', resetNo: 'ANNULER',
        extrasTab: 'EXTRAS', extrasAdd: 'AJOUTER', extrasName: 'Nom de la carte', extrasType: 'Type', extrasDex: 'N° Pokédex (optionnel)', extrasEmpty: 'Aucune carte extra. Ajoute-en une !', extrasDelete: 'Supprimer', sortDefault: 'DÉFAUT', sortName: 'NOM', sortType: 'TYPE', showcase: 'SHOWCASE' },
  en: { owned: 'OWNED',     total: 'TOTAL', complete: 'COMPLETE', all: 'ALL',    yes: 'OWNED',     no: 'MISSING',    search: '🔍 Search...',       subtitle: 'TRACKER — JAPANESE EDITION',
        export: 'EXPORT',   import: 'IMPORT',   reset: 'RESET',
        noCards: '⚠️ No cards to export!', alreadyEmpty: '⚠️ Collection is already empty!',
        imported: 'cards imported!', resetDone: '🗑 Collection reset',
        resetTitle: 'RESET', resetCards: 'CARDS?', resetHint: 'This cannot be undone.\nExport first just in case!',
        resetYes: 'YES, RESET', resetNo: 'CANCEL',
        extrasTab: 'EXTRAS', extrasAdd: 'ADD', extrasName: 'Card name', extrasType: 'Type', extrasDex: 'Pokédex # (optional)', extrasEmpty: 'No extra cards yet. Add one!', extrasDelete: 'Delete', sortDefault: 'DEFAULT', sortName: 'NAME', sortType: 'TYPE', showcase: 'SHOWCASE' },
  jp: { owned: '所持済み',   total: '合計',  complete: '完成度',   all: '全て',   yes: '所持済み',  no: '未所持',     search: '🔍 検索...',          subtitle: 'トラッカー — 日本語版',
        export: 'エクスポート', import: 'インポート', reset: 'リセット',
        noCards: '⚠️ エクスポートするカードがありません！', alreadyEmpty: '⚠️ コレクションはすでに空です！',
        imported: '枚のカードをインポートしました！', resetDone: '🗑 コレクションをリセットしました',
        resetTitle: 'リセット', resetCards: '枚をリセット？', resetHint: 'この操作は取り消せません。\n先にエクスポートしてください！',
        resetYes: 'リセット', resetNo: 'キャンセル',
        extrasTab: 'EXTRAS', extrasAdd: '追加', extrasName: 'カード名', extrasType: 'タイプ', extrasDex: '図鑑番号（任意）', extrasEmpty: 'エクストラカードがありません', extrasDelete: '削除', sortDefault: 'デフォルト', sortName: '名前', sortType: 'タイプ', showcase: 'ショーケース' },
};

/** Rarity labels per language */
const RARITY_LABELS = {
  fr: { holo: '★★★ HOLO RARE', rare: '★★ RARE', uncommon: '★ PEU COMMUNE', common: '◆ COMMUNE' },
  en: { holo: '★★★ HOLO RARE', rare: '★★ RARE', uncommon: '★ UNCOMMON',    common: '◆ COMMON'  },
  jp: { holo: '★★★ キラレア',   rare: '★★ レア',  uncommon: '★ アンコモン',   common: '◆ コモン'  },
};

/**
 * Set data — verified official JP card lists.
 * Each card: { n: number, jp, fr, en, r: rarity, t: type emoji, d: dex id }
 *
 * BASE SET JP (拡張パック, 1996): 102 cards
 * JUNGLE JP (ポケモンジャングル, 1997): 48 cards
 * FOSSIL JP (化石の秘密, 1997): 48 cards
 * ROCKET JP (ロケット団, 1997): 65 cards (incl. 1 secret)
 */
const SETS = {
  base: {
    name: { fr: 'SET DE BASE', en: 'BASE SET', jp: '拡張パック' },
    subtitle: '拡張パック 1996',
    cards: [
      // ── Grass ──
      { n:'001', jp:'フシギダネ',   fr:'Bulbizarre',     en:'Bulbasaur',      r:'common',  t:'🌿', d:1   },
      { n:'002', jp:'キャタピー',   fr:'Chenipan',       en:'Caterpie',       r:'common',  t:'🐛', d:10  },
      { n:'003', jp:'トランセル',   fr:'Chrysacier',     en:'Metapod',        r:'common',  t:'🐛', d:11  },
      { n:'004', jp:'ビードル',     fr:'Aspicot',        en:'Weedle',         r:'common',  t:'🐛', d:13  },
      { n:'005', jp:'ニドラン♂',   fr:'Nidoran♂',        en:'Nidoran♂',      r:'common',  t:'💜', d:32  },
      { n:'006', jp:'ドガース',     fr:'Smogo',          en:'Koffing',        r:'common',  t:'☁️', d:109 },
      { n:'007', jp:'モンジャラ',   fr:'Saquedeneu',     en:'Tangela',        r:'common',  t:'🌿', d:114 },
      { n:'008', jp:'フシギソウ',   fr:'Herbizarre',     en:'Ivysaur',        r:'uncommon',t:'🌿', d:2   },
      { n:'009', jp:'コクーン',     fr:'Coconfort',      en:'Kakuna',         r:'uncommon',t:'🐛', d:14  },
      { n:'010', jp:'ニドリーノ',   fr:'Nidorino',       en:'Nidorino',       r:'uncommon',t:'💜', d:33  },
      { n:'011', jp:'フシギバナ',   fr:'Florizarre',     en:'Venusaur',       r:'holo',    t:'🌿', d:3   },
      { n:'012', jp:'スピアー',     fr:'Dardargnan',     en:'Beedrill',       r:'rare',    t:'🐛', d:15  },
      { n:'013', jp:'ニドキング',   fr:'Nidoking',       en:'Nidoking',       r:'holo',    t:'💜', d:34  },
      // ── Fire ──
      { n:'014', jp:'ヒトカゲ',     fr:'Salamèche',      en:'Charmander',     r:'common',  t:'🔥', d:4   },
      { n:'015', jp:'ロコン',       fr:'Goupix',         en:'Vulpix',         r:'common',  t:'🔥', d:37  },
      { n:'016', jp:'ポニータ',     fr:'Ponyta',         en:'Ponyta',         r:'common',  t:'🔥', d:77  },
      { n:'017', jp:'リザード',     fr:'Reptincel',      en:'Charmeleon',     r:'uncommon',t:'🔥', d:5   },
      { n:'018', jp:'ガーディ',     fr:'Caninos',        en:'Growlithe',      r:'uncommon',t:'🔥', d:58  },
      { n:'019', jp:'ウインディ',   fr:'Arcanin',        en:'Arcanine',       r:'rare',    t:'🔥', d:59  },
      { n:'020', jp:'マグマラシ',   fr:'Magmar',         en:'Magmar',         r:'rare',    t:'🔥', d:126 },
      { n:'021', jp:'リザードン',   fr:'Dracaufeu',      en:'Charizard',      r:'holo',    t:'🔥', d:6   },
      { n:'022', jp:'キュウコン',   fr:'Feunard',        en:'Ninetales',      r:'holo',    t:'🔥', d:38  },
      // ── Water ──
      { n:'023', jp:'ゼニガメ',     fr:'Carapuce',       en:'Squirtle',       r:'common',  t:'💧', d:7   },
      { n:'024', jp:'ニョロモ',     fr:'Ptitard',        en:'Poliwag',        r:'common',  t:'💧', d:60  },
      { n:'025', jp:'ヒトデマン',   fr:'Stari',          en:'Staryu',         r:'common',  t:'💧', d:120 },
      { n:'026', jp:'スターミー',   fr:'Staross',        en:'Starmie',        r:'uncommon',t:'💧', d:121 },
      { n:'027', jp:'カメール',     fr:'Carabaffe',      en:'Wartortle',      r:'uncommon',t:'💧', d:8   },
      { n:'028', jp:'ニョロゾ',     fr:'Têtarte',        en:'Poliwhirl',      r:'uncommon',t:'💧', d:61  },
      { n:'029', jp:'タマザラシ',   fr:'Otaria',         en:'Seel',           r:'uncommon',t:'💧', d:86  },
      { n:'030', jp:'ジュゴン',     fr:'Lamantine',      en:'Dewgong',        r:'rare',    t:'💧', d:87  },
      { n:'031', jp:'コイキング',   fr:'Magicarpe',      en:'Magikarp',       r:'rare',    t:'💧', d:129 },
      { n:'032', jp:'カメックス',   fr:'Tortank',        en:'Blastoise',      r:'holo',    t:'💧', d:9   },
      { n:'033', jp:'ニョロボン',   fr:'Tartard',        en:'Poliwrath',      r:'holo',    t:'💧', d:62  },
      { n:'034', jp:'ギャラドス',   fr:'Léviator',       en:'Gyarados',       r:'holo',    t:'💧', d:130 },
      // ── Lightning ──
      { n:'035', jp:'ピカチュウ',   fr:'Pikachu',        en:'Pikachu',        r:'common',  t:'⚡', d:25  },
      { n:'036', jp:'コイル',       fr:'Magnétite',      en:'Magnemite',      r:'common',  t:'⚡', d:81  },
      { n:'037', jp:'ビリリダマ',   fr:'Voltorbe',       en:'Voltorb',        r:'common',  t:'⚡', d:100 },
      { n:'038', jp:'ライチュウ',   fr:'Raichu',         en:'Raichu',         r:'holo',    t:'⚡', d:26  },
      { n:'039', jp:'レアコイル',   fr:'Magnéton',       en:'Magneton',       r:'holo',    t:'⚡', d:82  },
      { n:'040', jp:'マルマイン',   fr:'Électrode',      en:'Electrode',      r:'rare',    t:'⚡', d:101 },
      { n:'041', jp:'エレブー',     fr:'Électek',        en:'Electabuzz',     r:'rare',    t:'⚡', d:125 },
      { n:'042', jp:'ザップドス',   fr:'Électhor',       en:'Zapdos',         r:'holo',    t:'⚡', d:145 },
      // ── Psychic ──
      { n:'043', jp:'ケーシィ',     fr:'Abra',           en:'Abra',           r:'common',  t:'🔮', d:63  },
      { n:'044', jp:'ゴース',       fr:'Fantominus',     en:'Gastly',         r:'common',  t:'👻', d:92  },
      { n:'045', jp:'スリープ',     fr:'Soporifik',      en:'Drowzee',        r:'common',  t:'🔮', d:96  },
      { n:'046', jp:'フーディン',   fr:'Kadabra',        en:'Kadabra',        r:'uncommon',t:'🔮', d:64  },
      { n:'047', jp:'ゴースト',     fr:'Spectrum',       en:'Haunter',        r:'uncommon',t:'👻', d:93  },
      { n:'048', jp:'ルージュラ',   fr:'Lippoutou',      en:'Jynx',           r:'rare',    t:'❄️', d:124 },
      { n:'049', jp:'アラカザム',   fr:'Alakazam',       en:'Alakazam',       r:'holo',    t:'🔮', d:65  },
      { n:'050', jp:'ミュウツー',   fr:'Mewtwo',         en:'Mewtwo',         r:'holo',    t:'🔮', d:150 },
      // ── Fighting ──
      { n:'051', jp:'サンド',       fr:'Sablette',       en:'Sandshrew',      r:'common',  t:'💀', d:27  },
      { n:'052', jp:'ディグダ',     fr:'Taupiqueur',     en:'Diglett',        r:'common',  t:'💀', d:50  },
      { n:'053', jp:'ワンリキー',   fr:'Machoc',         en:'Machop',         r:'common',  t:'👊', d:66  },
      { n:'054', jp:'イワーク',     fr:'Onix',           en:'Onix',           r:'common',  t:'🪨', d:95  },
      { n:'055', jp:'ゴーリキー',   fr:'Machopeur',      en:'Machoke',        r:'uncommon',t:'👊', d:67  },
      { n:'056', jp:'ダグトリオ',   fr:'Triopikeur',     en:'Dugtrio',        r:'rare',    t:'💀', d:51  },
      { n:'057', jp:'カイリキー',   fr:'Mackogneur',     en:'Machamp',        r:'holo',    t:'👊', d:68  },
      { n:'058', jp:'エビワラー',   fr:'Tygnon',         en:'Hitmonchan',     r:'holo',    t:'👊', d:107 },
      // ── Colorless ──
      { n:'059', jp:'ポッポ',       fr:'Roucool',        en:'Pidgey',         r:'common',  t:'🐦', d:16  },
      { n:'060', jp:'コラッタ',     fr:'Rattata',        en:'Rattata',        r:'common',  t:'⬛', d:19  },
      { n:'061', jp:'ドードー',     fr:'Doduo',          en:'Doduo',          r:'common',  t:'🐦', d:84  },
      { n:'062', jp:'ラッタ',       fr:'Rattatac',       en:'Raticate',       r:'uncommon',t:'⬛', d:20  },
      { n:'063', jp:'カモネギ',     fr:'Canarticho',     en:"Farfetch'd",     r:'uncommon',t:'🐦', d:83  },
      { n:'064', jp:'ポリゴン',     fr:'Porygon',        en:'Porygon',        r:'uncommon',t:'💻', d:137 },
      { n:'065', jp:'ミニリュウ',   fr:'Minidraco',      en:'Dratini',        r:'uncommon',t:'🐉', d:147 },
      { n:'066', jp:'ピジョン',     fr:'Roucoups',       en:'Pidgeotto',      r:'rare',    t:'🐦', d:17  },
      { n:'067', jp:'ピッピ',       fr:'Mélofée',        en:'Clefairy',       r:'holo',    t:'✨', d:35  },
      { n:'068', jp:'ラッキー',     fr:'Leveinard',      en:'Chansey',        r:'holo',    t:'✨', d:113 },
      { n:'069', jp:'ハクリュー',   fr:'Draco',          en:'Dragonair',      r:'rare',    t:'🐉', d:148 },
      // ── Trainers ──
      { n:'070', jp:'エネルギー回収',  fr:'Retrait Énergie',     en:'Energy Removal',         r:'common',  t:'🃏', item:'energy-root', d:null },
      { n:'071', jp:'キズぐすり',      fr:'Potion',               en:'Potion',                 r:'common',  t:'🃏', item:'potion', d:null },
      { n:'072', jp:'ポケモン交換おじさん', fr:'Coup de Vent',    en:'Gust of Wind',           r:'common',  t:'🃏', item:'blue-flute', d:null },
      { n:'073', jp:'入れ替え',         fr:'Changement',           en:'Switch',                 r:'common',  t:'🃏', item:'escape-rope', d:null },
      { n:'074', jp:'マサキ',           fr:'Bill',                 en:'Bill',                   r:'common',  t:'🃏', item:'oran-berry', d:null },
      { n:'075', jp:'いいきずぐすり',   fr:'Super Potion',         en:'Super Potion',           r:'uncommon',t:'🃏', item:'super-potion', d:null },
      { n:'076', jp:'エネルギー回復',   fr:'Récupération Énergie', en:'Energy Retrieval',       r:'uncommon',t:'🃏', item:'energy-root', d:null },
      { n:'077', jp:'オーキド博士',     fr:'Prof. Chen',           en:'Professor Oak',          r:'uncommon',t:'🃏', item:'yellow-flute', d:null },
      { n:'078', jp:'復活草',           fr:'Rappel',               en:'Revive',                 r:'uncommon',t:'🃏', item:'revive', d:null },
      { n:'079', jp:'バリアーのカード', fr:'Défenseur',            en:'Defender',               r:'uncommon',t:'🃏', item:'x-defense', d:null },
      { n:'080', jp:'全快スプレー',     fr:'Soin Total',           en:'Full Heal',              r:'uncommon',t:'🃏', item:'full-heal', d:null },
      { n:'081', jp:'パワーカード',     fr:'Plus Puissance',       en:'PlusPower',              r:'uncommon',t:'🃏', item:'x-attack', d:null },
      { n:'082', jp:'ポケモン図鑑',     fr:'Pokédex',              en:'Pokedex',                r:'uncommon',t:'🃏', item:'pokedex', d:null },
      { n:'083', jp:'ポケモンセンター', fr:'Centre Pokémon',       en:'Pokemon Center',         r:'uncommon',t:'🃏', item:'full-restore', d:null },
      { n:'084', jp:'ポケモンフルート', fr:'Flûte Pokémon',        en:'Pokemon Flute',          r:'uncommon',t:'🃏', item:'poke-flute', d:null },
      { n:'085', jp:'維持のカード',     fr:'Maintenance',          en:'Maintenance',            r:'uncommon',t:'🃏', item:'antidote', d:null },
      { n:'086', jp:'退化スプレーU',    fr:'Spray Dévol.',         en:'Devolution Spray',       r:'rare',    t:'🃏', item:'old-gateau', d:null },
      { n:'087', jp:'アイテムファインダー', fr:'Cherche-Objet',   en:'Item Finder',            r:'rare',    t:'🃏', item:'itemfinder', d:null },
      { n:'088', jp:'強制ぬきとり',     fr:'Retrait Forcé',        en:'Super Energy Removal',   r:'rare',    t:'🃏', item:'x-sp-atk', d:null },
      { n:'089', jp:'にせオーキド博士', fr:'Faux Prof. Chen',      en:'Impostor Professor Oak', item:'red-flute', r:'rare',    t:'🃏', item:'red-flute', d:null },
      { n:'090', jp:'コンピューターサーチ', fr:'Ordi-Recherche',  en:'Computer Search',        r:'rare',    t:'🃏', item:'up-grade', d:null },
      { n:'091', jp:'ピッピ人形',       fr:'Poupée Mélofée',       en:'Clefairy Doll',          r:'rare',    t:'🃏', item:'cleanse-tag', d:null },
      { n:'092', jp:'回収',             fr:'Ramassage',            en:'Scoop Up',               r:'rare',    t:'🃏', item:'poke-toy', d:null },
      { n:'093', jp:'ポケモン交換',     fr:'Échange Pokémon',      en:'Pokemon Trader',         r:'rare',    t:'🃏', item:'coin', d:null },
      { n:'094', jp:'ポケモン育て屋さん', fr:'Pension Pokémon',    en:'Pokemon Breeder',        r:'rare',    t:'🃏', item:'oval-charm', d:null },
      { n:'095', jp:'サツキ',           fr:'Lass',                 en:'Lass',                   r:'rare',    t:'🃏', item:'lure', d:null },
      // ── Energies ──
      { n:'096', jp:'無色2個エネルギー', fr:'Énergie Incolore×2', en:'Double Colorless Energy',r:'uncommon',t:'⚡', item:'normal-gem', d:null },
      { n:'097', jp:'草エネルギー',     fr:'Énergie Plante',       en:'Grass Energy',           r:'common',  t:'🌿', item:'miracle-seed', d:null },
      { n:'098', jp:'炎エネルギー',     fr:'Énergie Feu',          en:'Fire Energy',            r:'common',  t:'🔥', item:'charcoal', d:null },
      { n:'099', jp:'水エネルギー',     fr:'Énergie Eau',          en:'Water Energy',           r:'common',  t:'💧', item:'mystic-water', d:null },
      { n:'100', jp:'雷エネルギー',     fr:'Énergie Foudre',       en:'Lightning Energy',       r:'common',  t:'⚡', item:'magnet', d:null },
      { n:'101', jp:'超エネルギー',     fr:'Énergie Psy',          en:'Psychic Energy',         r:'common',  t:'🔮', item:'twisted-spoon', d:null },
      { n:'102', jp:'闘エネルギー',     fr:'Énergie Combat',       en:'Fighting Energy',        r:'common',  t:'👊', item:'black-belt', d:null },
    ],
  },

  jungle: {
    name: { fr: 'JUNGLE', en: 'JUNGLE', jp: 'ポケモンジャングル' },
    subtitle: 'ポケモンジャングル 1997',
    cards: [
      // ── Grass ──
      { n:'001', jp:'ニドラン♀',     fr:'Nidoran♀',      en:'Nidoran♀',      r:'common',  t:'💜', d:29  },
      { n:'002', jp:'ナゾノクサ',    fr:'Mystherbe',      en:'Oddish',         r:'common',  t:'🌿', d:43  },
      { n:'003', jp:'パラス',       fr:'Paras',          en:'Paras',          r:'common',  t:'🌿', d:46  },
      { n:'004', jp:'コンパン',     fr:'Veniflor',       en:'Venonat',        r:'common',  t:'🐛', d:48  },
      { n:'005', jp:'マダツボミ',   fr:'Chétiflor',      en:'Bellsprout',     r:'common',  t:'🌿', d:69  },
      { n:'006', jp:'タマタマ',     fr:'Noeunoeuf',      en:'Exeggcute',      r:'common',  t:'🌿', d:102 },
      { n:'007', jp:'バタフリー',   fr:'Papilusion',     en:'Butterfree',     r:'uncommon',t:'🐛', d:12  },
      { n:'008', jp:'ニドリーナ',   fr:'Nidorina',       en:'Nidorina',       r:'uncommon',t:'💜', d:30  },
      { n:'009', jp:'クサイハナ',   fr:'Ortide',         en:'Gloom',          r:'uncommon',t:'🌿', d:44  },
      { n:'010', jp:'パラセクト',   fr:'Parasect',       en:'Parasect',       r:'uncommon',t:'🌿', d:47  },
      { n:'011', jp:'ウツドン',     fr:'Boustiflor',     en:'Weepinbell',     r:'uncommon',t:'🌿', d:70  },
      { n:'012', jp:'ナッシー',     fr:'Noadkoko',       en:'Exeggutor',      r:'uncommon',t:'🌿', d:103 },
      { n:'013', jp:'ニドクイン',   fr:'Nidoreïna',      en:'Nidoqueen',      r:'rare',    t:'💜', d:31  },
      { n:'014', jp:'ラフレシア',   fr:'Rafflesia',      en:'Vileplume',      r:'holo',    t:'🌸', d:45  },
      { n:'015', jp:'モルフォン',   fr:'Aéromite',       en:'Venomoth',       r:'rare',    t:'🐛', d:49  },
      { n:'016', jp:'ウツボット',   fr:'Empiflor',       en:'Victreebel',     r:'holo',    t:'🌿', d:71  },
      { n:'017', jp:'ストライク',   fr:'Insécateur',     en:'Scyther',        r:'holo',    t:'🌿', d:123 },
      { n:'018', jp:'カイロス',     fr:'Scarabrute',     en:'Pinsir',         r:'holo',    t:'🌿', d:127 },
      // ── Fire ──
      { n:'019', jp:'ギャロップ',   fr:'Galopa',         en:'Rapidash',       r:'uncommon',t:'🔥', d:78  },
      { n:'020', jp:'ブースター',   fr:'Pyroli',         en:'Flareon',        r:'holo',    t:'🔥', d:136 },
      // ── Water ──
      { n:'021', jp:'トサキント',   fr:'Poissirène',     en:'Goldeen',        r:'common',  t:'💧', d:118 },
      { n:'022', jp:'アズマオウ',   fr:'Poissoroy',      en:'Seaking',        r:'uncommon',t:'💧', d:119 },
      { n:'023', jp:'シャワーズ',   fr:'Aquali',         en:'Vaporeon',       r:'holo',    t:'💧', d:134 },
      // ── Lightning ──
      { n:'024', jp:'ピカチュウ',   fr:'Pikachu',        en:'Pikachu',        r:'common',  t:'⚡', d:25  },
      { n:'025', jp:'マルマイン',   fr:'Électrode',      en:'Electrode',      r:'holo',    t:'⚡', d:101 },
      { n:'026', jp:'サンダース',   fr:'Voltali',        en:'Jolteon',        r:'holo',    t:'⚡', d:135 },
      // ── Psychic ──
      { n:'027', jp:'バリヤード',   fr:'M. Mime',        en:'Mr. Mime',       r:'holo',    t:'🔮', d:122 },
      // ── Fighting ──
      { n:'028', jp:'マンキー',     fr:'Férosinge',      en:'Mankey',         r:'common',  t:'👊', d:56  },
      { n:'029', jp:'カラカラ',     fr:'Osselait',       en:'Cubone',         r:'common',  t:'💀', d:104 },
      { n:'030', jp:'サイホーン',   fr:'Rhinocorne',     en:'Rhyhorn',        r:'common',  t:'🪨', d:111 },
      { n:'031', jp:'オコリザル',   fr:'Colossinge',     en:'Primeape',       r:'uncommon',t:'👊', d:57  },
      { n:'032', jp:'ガラガラ',     fr:'Ossatueur',      en:'Marowak',        r:'rare',    t:'💀', d:105 },
      { n:'033', jp:'サイドン',     fr:'Rhinoféros',     en:'Rhydon',         r:'rare',    t:'🪨', d:112 },
      // ── Colorless ──
      { n:'034', jp:'ピジョット',   fr:'Roucarnage',     en:'Pidgeot',        r:'holo',    t:'🐦', d:18  },
      { n:'035', jp:'オニスズメ',   fr:'Piafabec',       en:'Spearow',        r:'common',  t:'🐦', d:21  },
      { n:'036', jp:'オニドリル',   fr:'Rapasdepic',     en:'Fearow',         r:'uncommon',t:'🐦', d:22  },
      { n:'037', jp:'ピクシー',     fr:'Mélodelfe',      en:'Clefable',       r:'holo',    t:'✨', d:36  },
      { n:'038', jp:'プリン',       fr:'Rondoudou',      en:'Jigglypuff',     r:'common',  t:'✨', d:39  },
      { n:'039', jp:'プクリン',     fr:'Grodoudou',      en:'Wigglytuff',     r:'holo',    t:'✨', d:40  },
      { n:'040', jp:'ニャース',     fr:'Miaouss',        en:'Meowth',         r:'common',  t:'⬛', d:52  },
      { n:'041', jp:'ペルシアン',   fr:'Persian',        en:'Persian',        r:'uncommon',t:'⬛', d:53  },
      { n:'042', jp:'ドードリオ',   fr:'Dodrio',         en:'Dodrio',         r:'uncommon',t:'🐦', d:85  },
      { n:'043', jp:'ベロリンガ',   fr:'Excelangue',     en:'Lickitung',      r:'rare',    t:'⬛', d:108 },
      { n:'044', jp:'ガルーラ',     fr:'Kangaskhan',     en:'Kangaskhan',     r:'holo',    t:'🦘', d:115 },
      { n:'045', jp:'ケンタロス',   fr:'Tauros',         en:'Tauros',         r:'rare',    t:'⬛', d:128 },
      { n:'046', jp:'イーブイ',     fr:'Évoli',          en:'Eevee',          r:'common',  t:'⬛', d:133 },
      { n:'047', jp:'カビゴン',     fr:'Ronflex',        en:'Snorlax',        r:'rare',    t:'⬛', d:143 },
      // ── Trainer ──
      { n:'048', jp:'モンスターボール', fr:'Poké Ball',  en:'Poké Ball',      r:'common',  t:'🃏', item:'poke-ball', d:null },
    ],
  },

  fossil: {
    name: { fr: 'FOSSIL', en: 'FOSSIL', jp: '化石の秘密' },
    subtitle: '化石の秘密 1997',
    cards: [
      // ── Poison / Grass ──
      { n:'001', jp:'アーボ',       fr:'Abo',            en:'Ekans',          r:'common',  t:'☁️', d:23  },
      { n:'002', jp:'ズバット',     fr:'Nosferapti',     en:'Zubat',          r:'common',  t:'☁️', d:41  },
      { n:'003', jp:'ベトベター',   fr:'Tadmorv',        en:'Grimer',         r:'common',  t:'☁️', d:88  },
      { n:'004', jp:'アーボック',   fr:'Arbok',          en:'Arbok',          r:'uncommon',t:'☁️', d:24  },
      { n:'005', jp:'ゴルバット',   fr:'Nosferalto',     en:'Golbat',         r:'uncommon',t:'☁️', d:42  },
      { n:'006', jp:'マタドガス',   fr:'Smogogo',        en:'Weezing',        r:'uncommon',t:'☁️', d:110 },
      { n:'007', jp:'ベトベトン',   fr:'Grotadmorv',     en:'Muk',            r:'rare',    t:'☁️', d:89  },
      // ── Fire ──
      { n:'008', jp:'マグマラシ',   fr:'Magmar',         en:'Magmar',         r:'uncommon',t:'🔥', d:126 },
      { n:'009', jp:'ファイヤー',   fr:'Sulfura',        en:'Moltres',        r:'holo',    t:'🔥', d:146 },
      // ── Water ──
      { n:'010', jp:'コダック',     fr:'Psykokwak',      en:'Psyduck',        r:'common',  t:'💧', d:54  },
      { n:'011', jp:'メノクラゲ',   fr:'Tentacool',      en:'Tentacool',      r:'common',  t:'💧', d:72  },
      { n:'012', jp:'シェルダー',   fr:'Kokiyas',        en:'Shellder',       r:'common',  t:'💧', d:90  },
      { n:'013', jp:'クラブ',       fr:'Krabby',         en:'Krabby',         r:'common',  t:'💧', d:98  },
      { n:'014', jp:'タッツー',     fr:'Hypotrempe',     en:'Horsea',         r:'common',  t:'💧', d:116 },
      { n:'015', jp:'オムナイト',   fr:'Amonita',        en:'Omanyte',        r:'common',  t:'💧', d:138 },
      { n:'016', jp:'ゴルダック',   fr:'Akwakwak',       en:'Golduck',        r:'uncommon',t:'💧', d:55  },
      { n:'017', jp:'ドククラゲ',   fr:'Tentacruel',     en:'Tentacruel',     r:'uncommon',t:'💧', d:73  },
      { n:'018', jp:'パルシェン',   fr:'Crustabri',      en:'Cloyster',       r:'uncommon',t:'💧', d:91  },
      { n:'019', jp:'キングラー',   fr:'Krabboss',       en:'Kingler',        r:'uncommon',t:'💧', d:99  },
      { n:'020', jp:'シードラ',     fr:'Hypocéan',       en:'Seadra',         r:'uncommon',t:'💧', d:117 },
      { n:'021', jp:'オムスター',   fr:'Ammonite',       en:'Omastar',        r:'rare',    t:'💧', d:139 },
      { n:'022', jp:'ラプラス',     fr:'Lokhlass',       en:'Lapras',         r:'rare',    t:'💧', d:131 },
      { n:'023', jp:'フリーザー',   fr:'Artikodin',      en:'Articuno',       r:'holo',    t:'❄️', d:144 },
      // ── Lightning ──
      { n:'024', jp:'ライチュウ',   fr:'Raichu',         en:'Raichu',         r:'holo',    t:'⚡', d:26  },
      { n:'025', jp:'レアコイル',   fr:'Magnéton',       en:'Magneton',       r:'holo',    t:'⚡', d:82  },
      { n:'026', jp:'ザップドス',   fr:'Électhor',       en:'Zapdos',         r:'holo',    t:'⚡', d:145 },
      // ── Psychic ──
      { n:'027', jp:'ヤドン',       fr:'Ramoloss',       en:'Slowpoke',       r:'common',  t:'💧', d:79  },
      { n:'028', jp:'ヤドラン',     fr:'Flagadoss',      en:'Slowbro',        r:'uncommon',t:'💧', d:80  },
      { n:'029', jp:'ゴース',       fr:'Fantominus',     en:'Gastly',         r:'common',  t:'👻', d:92  },
      { n:'030', jp:'ゴースト',     fr:'Spectrum',       en:'Haunter',        r:'uncommon',t:'👻', d:93  },
      { n:'031', jp:'ゲンガー',     fr:'Ectoplasma',     en:'Gengar',         r:'holo',    t:'👻', d:94  },
      { n:'032', jp:'スリーパー',   fr:'Hypnomade',      en:'Hypno',          r:'rare',    t:'🔮', d:97  },
      { n:'033', jp:'ミュウ',       fr:'Mew',            en:'Mew',            r:'holo',    t:'🔮', d:151 },
      // ── Fighting ──
      { n:'034', jp:'イシツブテ',   fr:'Racaillou',      en:'Geodude',        r:'common',  t:'🪨', d:74  },
      { n:'035', jp:'カブト',       fr:'Kabuto',         en:'Kabuto',         r:'common',  t:'💧', d:140 },
      { n:'036', jp:'サンド',       fr:'Sablaireau',     en:'Sandslash',      r:'uncommon',t:'💀', d:28  },
      { n:'037', jp:'ゴローン',     fr:'Gravalanch',     en:'Graveler',       r:'uncommon',t:'🪨', d:75  },
      { n:'038', jp:'ゴローニャ',   fr:'Grolem',         en:'Golem',          r:'holo',    t:'🪨', d:76  },
      { n:'039', jp:'サワムラー',   fr:'Kicklee',        en:'Hitmonlee',      r:'rare',    t:'👊', d:106 },
      { n:'040', jp:'カブトプス',   fr:'Kaputops',       en:'Kabutops',       r:'holo',    t:'💧', d:141 },
      { n:'041', jp:'プテラ',       fr:'Ptéra',          en:'Aerodactyl',     r:'holo',    t:'🐉', d:142 },
      // ── Colorless ──
      { n:'042', jp:'メタモン',     fr:'Métamorph',      en:'Ditto',          r:'rare',    t:'⬛', d:132 },
      { n:'043', jp:'カイリュー',   fr:'Dragonite',      en:'Dragonite',      r:'holo',    t:'🐉', d:149 },
      // ── Trainers ──
      { n:'044', jp:'エネルギーさがし', fr:'Cherche-Énergie',   en:'Energy Search',     r:'common',  t:'🃏', item:'energy-powder', d:null },
      { n:'045', jp:'ギャンブラー',     fr:'Joueur',             en:'Gambler',           r:'common',  t:'🃏', item:'coin', d:null },
      { n:'046', jp:'ふしぎなかせき',   fr:'Fossile Mystérieux', en:'Mysterious Fossil', item:'root-fossil', r:'common',  t:'🃏', item:'root-fossil', d:null },
      { n:'047', jp:'リサイクル',       fr:'Recyclage',          en:'Recycle',           r:'uncommon',t:'🃏', item:'recycle', d:null },
      { n:'048', jp:'フジオじいさん',   fr:'M. Fuji',            en:'Mr. Fuji',          r:'rare',    t:'🃏', item:'big-nugget', d:null },
    ],
  },

  rocket: {
    name: { fr: 'ROCKET', en: 'ROCKET', jp: 'ロケット団' },
    subtitle: 'ロケット団 1997',
    cards: [
      // ── Poison ──
      { n:'001', jp:'アーボ',           fr:'Abo',                  en:'Ekans',                r:'common',  t:'☁️', d:23  },
      { n:'002', jp:'ズバット',         fr:'Nosferapti',           en:'Zubat',                r:'common',  t:'☁️', d:41  },
      { n:'003', jp:'ナゾノクサ',       fr:'Mystherbe',            en:'Oddish',               r:'common',  t:'🌿', d:43  },
      { n:'004', jp:'ベトベター',       fr:'Tadmorv',              en:'Grimer',               r:'common',  t:'☁️', d:88  },
      { n:'005', jp:'ドガース',         fr:'Smogo',                en:'Koffing',              r:'common',  t:'☁️', d:109 },
      { n:'006', jp:'Drk クサイハナ',   fr:'Ortide Sombre',        en:'Dark Gloom',           r:'uncommon',t:'🌿', d:44  },
      { n:'007', jp:'Drk ベトベトン',   fr:'Grotadmorv Sombre',    en:'Dark Muk',             r:'rare',    t:'☁️', d:89  },
      { n:'008', jp:'Drk アーボック',   fr:'Arbok Sombre',         en:'Dark Arbok',           r:'uncommon',t:'☁️', d:24  },
      { n:'009', jp:'Drk ゴルバット',   fr:'Nosférapti Sombre',    en:'Dark Golbat',          r:'uncommon',t:'☁️', d:42  },
      { n:'010', jp:'Drk ラフレシア',   fr:'Rafflesia Sombre',     en:'Dark Vileplume',       r:'holo',    t:'🌸', d:45  },
      { n:'011', jp:'Drk マタドガス',   fr:'Smogogo Sombre',       en:'Dark Weezing',         r:'holo',    t:'☁️', d:110 },
      // ── Fire ──
      { n:'012', jp:'ヒトカゲ',         fr:'Salamèche',            en:'Charmander',           r:'common',  t:'🔥', d:4   },
      { n:'013', jp:'ポニータ',         fr:'Ponyta',               en:'Ponyta',               r:'common',  t:'🔥', d:77  },
      { n:'014', jp:'Drk ギャロップ',   fr:'Galopa Sombre',        en:'Dark Rapidash',        r:'uncommon',t:'🔥', d:78  },
      { n:'015', jp:'Drk リザード',     fr:'Reptincel Sombre',     en:'Dark Charmeleon',      r:'uncommon',t:'🔥', d:5   },
      { n:'016', jp:'Drk ブースター',   fr:'Pyroli Sombre',        en:'Dark Flareon',         r:'rare',    t:'🔥', d:136 },
      { n:'017', jp:'Drk リザードン',   fr:'Dracaufeu Sombre',     en:'Dark Charizard',       r:'holo',    t:'🔥', d:6   },
      // ── Water ──
      { n:'018', jp:'ゼニガメ',         fr:'Carapuce',             en:'Squirtle',             r:'common',  t:'💧', d:7   },
      { n:'019', jp:'コダック',         fr:'Psykokwak',            en:'Psyduck',              r:'common',  t:'💧', d:54  },
      { n:'020', jp:'コイキング',       fr:'Magicarpe',            en:'Magikarp',             r:'common',  t:'💧', d:129 },
      { n:'021', jp:'Drk カメール',     fr:'Carabaffe Sombre',     en:'Dark Wartortle',       r:'uncommon',t:'💧', d:8   },
      { n:'022', jp:'Drk ゴルダック',   fr:'Akwakwak Sombre',      en:'Dark Golduck',         r:'uncommon',t:'💧', d:55  },
      { n:'023', jp:'Drk シャワーズ',   fr:'Aquali Sombre',        en:'Dark Vaporeon',        r:'rare',    t:'💧', d:134 },
      { n:'024', jp:'Drk カメックス',   fr:'Tortank Sombre',       en:'Dark Blastoise',       r:'holo',    t:'💧', d:9   },
      { n:'025', jp:'Drk ギャラドス',   fr:'Léviator Sombre',      en:'Dark Gyarados',        r:'holo',    t:'💧', d:130 },
      // ── Lightning ──
      { n:'026', jp:'コイル',           fr:'Magnétite',            en:'Magnemite',            r:'common',  t:'⚡', d:81  },
      { n:'027', jp:'ビリリダマ',       fr:'Voltorbe',             en:'Voltorb',              r:'common',  t:'⚡', d:100 },
      { n:'028', jp:'Drk マルマイン',   fr:'Électrode Sombre',     en:'Dark Electrode',       r:'uncommon',t:'⚡', d:101 },
      { n:'029', jp:'Drk サンダース',   fr:'Voltali Sombre',       en:'Dark Jolteon',         r:'rare',    t:'⚡', d:135 },
      { n:'030', jp:'Drk レアコイル',   fr:'Magnéton Sombre',      en:'Dark Magneton',        r:'holo',    t:'⚡', d:82  },
      // ── Psychic ──
      { n:'031', jp:'ケーシィ',         fr:'Abra',                 en:'Abra',                 r:'common',  t:'🔮', d:63  },
      { n:'032', jp:'ヤドン',           fr:'Ramoloss',             en:'Slowpoke',             r:'common',  t:'💧', d:79  },
      { n:'033', jp:'スリープ',         fr:'Soporifik',            en:'Drowzee',              r:'common',  t:'🔮', d:96  },
      { n:'034', jp:'Drk フーディン',   fr:'Kadabra Sombre',       en:'Dark Kadabra',         r:'uncommon',t:'🔮', d:64  },
      { n:'035', jp:'Drk アラカザム',   fr:'Alakazam Sombre',      en:'Dark Alakazam',        r:'holo',    t:'🔮', d:65  },
      { n:'036', jp:'Drk ヤドラン',     fr:'Flagadoss Sombre',     en:'Dark Slowbro',         r:'rare',    t:'💧', d:80  },
      { n:'037', jp:'Drk スリーパー',   fr:'Hypnomade Sombre',     en:'Dark Hypno',           r:'holo',    t:'🔮', d:97  },
      // ── Fighting ──
      { n:'038', jp:'ディグダ',         fr:'Taupiqueur',           en:'Diglett',              r:'common',  t:'💀', d:50  },
      { n:'039', jp:'マンキー',         fr:'Férosinge',            en:'Mankey',               r:'common',  t:'👊', d:56  },
      { n:'040', jp:'ワンリキー',       fr:'Machoc',               en:'Machop',               r:'common',  t:'👊', d:66  },
      { n:'041', jp:'Drk オコリザル',   fr:'Colossinge Sombre',    en:'Dark Primeape',        r:'uncommon',t:'👊', d:57  },
      { n:'042', jp:'Drk ゴーリキー',   fr:'Machopeur Sombre',     en:'Dark Machoke',         r:'uncommon',t:'👊', d:67  },
      { n:'043', jp:'Drk ダグトリオ',   fr:'Triopikeur Sombre',    en:'Dark Dugtrio',         r:'rare',    t:'💀', d:51  },
      { n:'044', jp:'Drk カイリキー',   fr:'Mackogneur Sombre',    en:'Dark Machamp',         r:'holo',    t:'👊', d:68  },
      // ── Colorless ──
      { n:'045', jp:'コラッタ',         fr:'Rattata',              en:'Rattata',              r:'common',  t:'⬛', d:19  },
      { n:'046', jp:'Drk ラッタ',       fr:'Rattatac Sombre',      en:'Dark Raticate',        r:'uncommon',t:'⬛', d:20  },
      { n:'047', jp:'ニャース',         fr:'Miaouss',              en:'Meowth',               r:'common',  t:'⬛', d:52  },
      { n:'048', jp:'Drk ペルシアン',   fr:'Persian Sombre',       en:'Dark Persian',         r:'holo',    t:'⬛', d:53  },
      { n:'049', jp:'イーブイ',         fr:'Évoli',                en:'Eevee',                r:'common',  t:'⬛', d:133 },
      { n:'050', jp:'ポリゴン',         fr:'Porygon',              en:'Porygon',              r:'uncommon',t:'💻', d:137 },
      { n:'051', jp:'ミニリュウ',       fr:'Minidraco',            en:'Dratini',              r:'common',  t:'🐉', d:147 },
      { n:'052', jp:'Drk ハクリュー',   fr:'Draco Sombre',         en:'Dark Dragonair',       r:'uncommon',t:'🐉', d:148 },
      { n:'053', jp:'Drk カイリュー',   fr:'Dragonite Sombre',     en:'Dark Dragonite',       r:'holo',    t:'🐉', d:149 },
      // ── Trainers ──
      { n:'054', jp:'ねむれ！',             fr:'Dors !',                en:'Sleep!',                  r:'common',  t:'🃏', item:'cheri-berry', d:null },
      { n:'055', jp:'あなをほる',           fr:'Fouissement',           en:'Digger',                  r:'common',  t:'🃏', item:'ground-gem', d:null },
      { n:'056', jp:'ガス爆発',             fr:'Explosion de Gaz',      en:'Goop Gas Attack',         r:'common',  t:'🃏', item:'poison-barb', d:null },
      { n:'057', jp:'夜の廃品回収',         fr:'Recyclage Nocturne',    en:'Nightly Garbage Run',     r:'uncommon',t:'🃏', item:'black-glasses', d:null },
      { n:'058', jp:'勝負だ！',             fr:'Défi !',                en:'Challenge!',              r:'uncommon',t:'🃏', item:'amulet-coin', d:null },
      { n:'059', jp:'にせオーキドのリベンジ', fr:'Revanche Faux Chen',  en:"Imposter Oak's Revenge",  r:'uncommon',t:'🃏', item:'red-flute', d:null },
      { n:'060', jp:'サカキの命令',         fr:'Ordre de Giovanni',     en:"The Boss's Way",          r:'rare',    t:'🃏', item:'dark-gem', d:null },
      { n:'061', jp:'ロケット団のアジト',   fr:'QG Rocket',             en:"Rocket's Sneak Attack",   r:'rare',    t:'🃏', item:'smoke-ball', d:null },
      { n:'062', jp:'ロケット団参上！',     fr:'Voilà la Team Rocket!', en:'Here Comes Team Rocket!', item:'dusk-ball', r:'holo',    t:'🃏', item:'dusk-ball', d:null },
      // ── Special Energies ──
      { n:'063', jp:'ポーションエネルギー', fr:'Énergie Potion',        en:'Potion Energy',           r:'uncommon',t:'⚡', item:'potion', d:null },
      { n:'064', jp:'全快エネルギー',       fr:'Énergie Soin Total',    en:'Full Heal Energy',        r:'uncommon',t:'⚡', item:'full-heal', d:null },
      // ── Secret card ──
      { n:'065', jp:'Drk ライチュウ',       fr:'Raichu Sombre',         en:'Dark Raichu',             r:'holo',    t:'⚡', d:26  },
    ],
  },
};



/** Available types for extra cards */
const EXTRA_TYPES = {
  fr: [
    { emoji: '🌿', label: 'Plante'   },
    { emoji: '🔥', label: 'Feu'      },
    { emoji: '💧', label: 'Eau'      },
    { emoji: '⚡', label: 'Foudre'   },
    { emoji: '🔮', label: 'Psy'      },
    { emoji: '✊', label: 'Combat'   },
    { emoji: '⭐', label: 'Incolore' },
    { emoji: '💀', label: 'Poison'   },
    { emoji: '🃏', label: 'Trainer'  },
    { emoji: '🌀', label: 'Energie'  },
  ],
  en: [
    { emoji: '🌿', label: 'Grass'     },
    { emoji: '🔥', label: 'Fire'      },
    { emoji: '💧', label: 'Water'     },
    { emoji: '⚡', label: 'Lightning' },
    { emoji: '🔮', label: 'Psychic'   },
    { emoji: '✊', label: 'Fighting'  },
    { emoji: '⭐', label: 'Colorless' },
    { emoji: '💀', label: 'Poison'    },
    { emoji: '🃏', label: 'Trainer'   },
    { emoji: '🌀', label: 'Energy'    },
  ],
  jp: [
    { emoji: '🌿', label: 'くさ'     },
    { emoji: '🔥', label: 'ほのお'   },
    { emoji: '💧', label: 'みず'     },
    { emoji: '⚡', label: 'でんき'   },
    { emoji: '🔮', label: 'エスパー' },
    { emoji: '✊', label: 'かくとう' },
    { emoji: '⭐', label: 'むしょく' },
    { emoji: '💀', label: 'どく'     },
    { emoji: '🃏', label: 'トレーナー'},
    { emoji: '🌀', label: 'エネルギー'},
  ],
};
