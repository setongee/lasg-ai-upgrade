// locationUtils.js

// Detects if user’s message requires a Lagos-specific location (e.g. nearest office)
export function needsLocationContext(message) {
  if (!message) return false;
  const locationKeywords = [
    'nearest',
    'close to me',
    'around me',
    'in my area',
    'where can i',
    'location',
    'office',
    'branch',
    'center',
    'centre',
    'hospital',
    'clinic',
    'school',
    'tax office',
    'renew',
    'registration',
    'apply',
    'how can i get',
    'where is',
    'contact',
    'visit',
    'service center',
    'station',
    'bus',
    'terminal',
    'zone',
    'lga',
    'local government',
    'area office',
    'near me',
    'near to me',
  ];
  const lowerMsg = message.toLowerCase();
  return locationKeywords.some((keyword) => lowerMsg.includes(keyword));
}

// Suggestion to ask user for LGA when location context is needed
export function getLgaPrompt() {
  return 'To give you the most accurate information, please tell me your **Local Government Area (LGA)** in Lagos — for example: Ikeja, Surulere, Lekki, Epe, or Badagry.';
}

// Extracts or infers LGA from a user message
export function extractLgaFromMessage(message) {
  if (!message) return null;

  const normalized = message.toLowerCase().replace(/[-–_]/g, ' ').trim();

  // ✅ LGA + landmarks mapping
  const lgaMap = {
    agege: 'Agege',
    'ajeromi ifelodun': 'Ajeromi-Ifelodun',
    ajeromi: 'Ajeromi-Ifelodun',
    ifelodun: 'Ajeromi-Ifelodun',
    alimosho: 'Alimosho',
    'amuwo odofin': 'Amuwo-Odofin',
    apapa: 'Apapa',
    badagry: 'Badagry',
    epe: 'Epe',
    'eti osa': 'Eti-Osa',
    'ibeju lekki': 'Ibeju-Lekki',
    lekki: 'Eti-Osa',
    ikoyi: 'Eti-Osa',
    'victoria island': 'Eti-Osa',
    'v i': 'Eti-Osa',
    'ifako ijaye': 'Ifako-Ijaiye',
    ikeja: 'Ikeja',
    ojota: 'Ikeja',
    maryland: 'Ikeja',
    ogba: 'Ikeja',
    ikorodu: 'Ikorodu',
    kosofe: 'Kosofe',
    'lagos island': 'Lagos Island',
    island: 'Lagos Island',
    cms: 'Lagos Island',
    idumota: 'Lagos Island',
    'lagos mainland': 'Lagos Mainland',
    yaba: 'Lagos Mainland',
    'ebute metta': 'Lagos Mainland',
    mushin: 'Mushin',
    ojo: 'Ojo',
    'oshodi isolo': 'Oshodi-Isolo',
    oshodi: 'Oshodi-Isolo',
    isolo: 'Oshodi-Isolo',
    shomolu: 'Shomolu',
    surulere: 'Surulere',
    bariga: 'Bariga',
    ejigbo: 'Ejigbo',
    'agboyi ketu': 'Agboyi-Ketu',
    ketu: 'Agboyi-Ketu',
  };

  // ✅ 1. Exact and partial match (handles multi-word and dash variants)
  for (const [key, lga] of Object.entries(lgaMap)) {
    if (normalized.includes(key)) return lga;
  }

  // ✅ 2. Fuzzy match (for typos, e.g. “suurlere” → “Surulere”)
  const threshold = 2;
  for (const [key, lga] of Object.entries(lgaMap)) {
    if (levenshteinDistance(key, normalized) <= threshold) return lga;
  }

  return null;
}

// 🧮 Levenshtein Distance — used for typo tolerance
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => Array(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
