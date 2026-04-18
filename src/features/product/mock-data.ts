import type { Category, Product } from "./types";

export const sampleCategories: Category[] = [
  { id: "veg", name: "야채/채소", icon: "eco" },
  { id: "fruit", name: "과일", icon: "nutrition" },
  { id: "seafood", name: "수산/해산", icon: "set_meal" },
  { id: "meat", name: "축산", icon: "kebab_dining" },
  { id: "dairy", name: "유제품/계란", icon: "egg" },
  { id: "sauce", name: "소스/조미료", icon: "liquor" },
  { id: "processed", name: "가공식품", icon: "inventory_2" },
  { id: "all", name: "전체보기", icon: "grid_view" }
];

export const sampleProducts: Product[] = [
  {
    id: "prod-lettuce-001",
    name: "무농약 버터헤드 레터스 1kg",
    description:
      "경상북도 청도군 덕산 농장에서 30년째 무농약 수경재배로 길러낸 버터헤드입니다.",
    category: "채소",
    unit: "1kg / 봉",
    priceNormal: 18500,
    priceBusiness: 14430,
    origin: "경상북도 청도군",
    imageEmoji: "🥬",
    imageBg: "from-emerald-200 to-emerald-400",
    badges: ["산지직송", "무농약"],
    isActive: true
  },
  {
    id: "prod-onion-001",
    name: "국산 양파",
    description: "기본 반찬과 국물 요리에 자주 쓰는 대용량 양파입니다.",
    category: "채소",
    unit: "3kg / 박스",
    priceNormal: 8900,
    priceBusiness: 7600,
    origin: "전라남도 무안",
    imageEmoji: "🧅",
    imageBg: "from-amber-100 to-amber-300",
    badges: ["국산"],
    isActive: true
  },
  {
    id: "prod-carrot-001",
    name: "국산 흙당근 10kg",
    description: "사장님들이 가장 많이 재구매하는 식당 표준 박스 단위 당근입니다.",
    category: "채소",
    unit: "10kg / 박스",
    priceNormal: 22000,
    priceBusiness: 18900,
    origin: "제주",
    imageEmoji: "🥕",
    imageBg: "from-orange-200 to-orange-400",
    badges: ["대용량"],
    isActive: true
  },
  {
    id: "prod-broccoli-001",
    name: "유기농 브로콜리 5kg",
    description: "유기농 인증을 받은 브로콜리, 데치기/볶음 모두 적합합니다.",
    category: "채소",
    unit: "5kg / 박스",
    priceNormal: 27000,
    priceBusiness: 23800,
    origin: "경상남도 진주",
    imageEmoji: "🥦",
    imageBg: "from-green-200 to-green-400",
    badges: ["유기농"],
    isActive: true
  },
  {
    id: "prod-tomato-001",
    name: "완토마토 5kg",
    description: "샐러드와 소스용으로 적합한 완숙 토마토입니다.",
    category: "채소",
    unit: "5kg / 박스",
    priceNormal: 18500,
    priceBusiness: 15800,
    origin: "강원도 화천",
    imageEmoji: "🍅",
    imageBg: "from-rose-200 to-rose-400",
    badges: ["당일 발송"],
    isActive: true
  },
  {
    id: "prod-watermelon-001",
    name: "고창 꿀수박 8kg 이상",
    description: "사업자 단독 특가, 내일 아침 도착 보장.",
    category: "과일",
    unit: "8kg+ / 통",
    priceNormal: 32000,
    priceBusiness: 24900,
    origin: "전북 고창",
    imageEmoji: "🍉",
    imageBg: "from-pink-200 to-rose-400",
    badges: ["사업자 단독", "내일 도착"],
    isActive: true
  },
  {
    id: "prod-lemon-001",
    name: "레몬 (미국산) 20과",
    description: "신선도가 유지되는 표준 박스 단위 미국산 레몬.",
    category: "과일",
    unit: "20과 / 박스",
    priceNormal: 14500,
    priceBusiness: 12400,
    origin: "미국",
    imageEmoji: "🍋",
    imageBg: "from-yellow-200 to-yellow-400",
    badges: [],
    isActive: true
  },
  {
    id: "prod-egg-001",
    name: "무항생제 왕란 60구",
    description: "베이커리/식당 표준 60구 박스. 무항생제 인증.",
    category: "유제품",
    unit: "60구 / 판",
    priceNormal: 21000,
    priceBusiness: 18500,
    origin: "충북 음성",
    imageEmoji: "🥚",
    imageBg: "from-stone-100 to-stone-300",
    badges: ["무항생제"],
    isActive: true
  },
  {
    id: "prod-pork-001",
    name: "돼지고기 앞다리 2kg",
    description: "찌개와 볶음 메뉴에 적합한 실속형 원육입니다.",
    category: "축산",
    unit: "2kg / 팩",
    priceNormal: 25900,
    priceBusiness: 22800,
    origin: "국산",
    imageEmoji: "🥩",
    imageBg: "from-rose-200 to-pink-300",
    badges: [],
    isActive: true
  },
  {
    id: "prod-oil-001",
    name: "식용유 1.8L",
    description: "업소와 가정 모두 사용하기 쉬운 표준 규격.",
    category: "공산품",
    unit: "1.8L / 병",
    priceNormal: 6500,
    priceBusiness: 5900,
    origin: "국내 제조",
    imageEmoji: "🫒",
    imageBg: "from-amber-100 to-yellow-200",
    badges: [],
    isActive: true
  },
  {
    id: "prod-potato-001",
    name: "수미감자 5kg (특)",
    description: "찜·구이·국물 모두에 잘 어울리는 강원도 수미감자 표준 5kg 박스.",
    category: "채소",
    unit: "5kg / 박스",
    priceNormal: 24000,
    priceBusiness: 16800,
    origin: "강원도",
    imageEmoji: "🥔",
    imageBg: "from-amber-200 to-amber-400",
    badges: ["사업자 특가", "BEST"],
    isActive: true
  },
  {
    id: "prod-cucumber-001",
    name: "백오이 50개 (특)",
    description: "단단하고 아삭한 식감의 표준 50과 박스.",
    category: "채소",
    unit: "50과 / 박스",
    priceNormal: 45000,
    priceBusiness: 34200,
    origin: "전라북도 김제",
    imageEmoji: "🥒",
    imageBg: "from-green-200 to-emerald-400",
    badges: ["선별"],
    isActive: true
  },
  {
    id: "prod-garlic-001",
    name: "깐마늘 1kg (대용량)",
    description: "의성 육쪽마늘을 직접 깐 업소용 대용량 1kg 팩.",
    category: "조미료",
    unit: "1kg / 팩",
    priceNormal: 15000,
    priceBusiness: 11500,
    origin: "경상북도 의성",
    imageEmoji: "🧄",
    imageBg: "from-stone-100 to-stone-300",
    badges: ["신선보장"],
    isActive: true
  },
  {
    id: "prod-pineapple-001",
    name: "골드파인애플 1수",
    description: "당도 높고 향이 진한 필리핀산 골드 파인애플.",
    category: "과일",
    unit: "1수 / 통",
    priceNormal: 9500,
    priceBusiness: 7500,
    origin: "필리핀",
    imageEmoji: "🍍",
    imageBg: "from-yellow-300 to-amber-500",
    badges: [],
    isActive: true
  },
  {
    id: "prod-discontinued-001",
    name: "한정판 단호박",
    description: "시즌 종료로 판매가 중단된 상품입니다.",
    category: "채소",
    unit: "5kg / 박스",
    priceNormal: 19800,
    priceBusiness: 17500,
    origin: "강원도",
    imageEmoji: "🎃",
    imageBg: "from-orange-200 to-amber-300",
    badges: [],
    isActive: false
  }
];

export function getProductById(id: string) {
  return sampleProducts.find((product) => product.id === id) ?? null;
}

export function getActiveProducts() {
  return sampleProducts.filter((product) => product.isActive);
}
