export function toArabicOrdinal(n: number) {
  if (typeof n !== "number" || n < 1 || n > 1000) {
    throw new Error("Supported range: 1–1000");
  }

  const units: Record<number, string> = {
    1: "الأوّل",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس",
    6: "السادس",
    7: "السابع",
    8: "الثامن",
    9: "التاسع",
  };

  const teens: Record<number, string> = {
    10: "العاشر",
    11: "الحادي عشر",
    12: "الثاني عشر",
    13: "الثالث عشر",
    14: "الرابع عشر",
    15: "الخامس عشر",
    16: "السادس عشر",
    17: "السابع عشر",
    18: "الثامن عشر",
    19: "التاسع عشر",
  };

  const tens: Record<number, string> = {
    20: "العشرون",
    30: "الثلاثون",
    40: "الأربعون",
    50: "الخمسون",
    60: "الستون",
    70: "السبعون",
    80: "الثمانون",
    90: "التسعون",
  };

  const hundreds: Record<number, string> = {
    100: "المئة",
    200: "المئتان",
    300: "الثلاثمئة",
    400: "الأربعمئة",
    500: "الخمسمئة",
    600: "الستمئة",
    700: "السبعمئة",
    800: "الثمانمئة",
    900: "التسعمئة",
  };

  if (n === 1000) return "الألف";

  // Direct lookups
  if (units[n]) return units[n];
  if (teens[n]) return teens[n];
  if (tens[n]) return tens[n];
  if (hundreds[n]) return hundreds[n];

  // 21–99
  if (n > 20 && n < 100) {
    const u = n % 10;
    const t = n - u;
    return `${units[u]} و${tens[t]}`;
  }

  // 101–999 (use "بعد" here)
  const h = Math.floor(n / 100) * 100;
  const rest = n % 100;
  const hundredWord = hundreds[h];

  let restWord;
  if (rest < 10) {
    restWord = units[rest];
  } else if (rest < 20) {
    restWord = teens[rest];
  } else if (tens[rest]) {
    restWord = tens[rest];
  } else {
    const u = rest % 10;
    const t = rest - u;
    restWord = `${units[u]} و${tens[t]}`;
  }

  // 🆕 use "بعد"
  return `${restWord} بعد ${hundredWord}`;
}
