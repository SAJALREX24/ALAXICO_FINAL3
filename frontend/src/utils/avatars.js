// Medical cartoon avatar URLs - cute healthcare characters
const MEDICAL_AVATARS = [
  // Doctor avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1&backgroundColor=b6e3f4&accessories=prescription01&accessoriesColor=3c4f5c&clothing=blazerAndSweater&clothesColor=3c79ce&eyebrows=default&eyes=default&facialHair=blank&hairColor=2c1b18&mouth=smile&skinColor=f8d25c&top=shortHairShortCurly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2&backgroundColor=c0aede&accessories=prescription02&clothing=collarAndSweater&clothesColor=3c79ce&eyebrows=defaultNatural&eyes=happy&mouth=smile&skinColor=ae5d29&top=shortHairDreads01',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse1&backgroundColor=ffd5dc&clothing=blazerAndSweater&clothesColor=e6e6e6&eyebrows=raisedExcited&eyes=wink&mouth=smile&skinColor=ffdbb4&top=longHairStraight',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse2&backgroundColor=d1f4d1&clothing=hoodie&clothesColor=3c79ce&eyebrows=default&eyes=default&mouth=smile&skinColor=614335&top=longHairBob',
  // Surgeon avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=surgeon1&backgroundColor=b6e3f4&clothing=overall&clothesColor=25557c&eyebrows=default&eyes=default&mouth=serious&skinColor=f8d25c&top=shortHairShortFlat&topColor=2c1b18',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=surgeon2&backgroundColor=c0aede&clothing=overall&clothesColor=25557c&eyebrows=defaultNatural&eyes=squint&mouth=twinkle&skinColor=d08b5b&top=shortHairTheCaesar',
  // Lab technician avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lab1&backgroundColor=ffd5dc&accessories=prescription01&clothing=shirtVNeck&clothesColor=ffffff&eyebrows=upDown&eyes=surprised&mouth=smile&skinColor=edb98a&top=longHairCurly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lab2&backgroundColor=d1f4d1&accessories=prescription02&clothing=shirtCrewNeck&clothesColor=ffffff&eyebrows=default&eyes=happy&mouth=smile&skinColor=ae5d29&top=shortHairShortWaved',
  // Pharmacist avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pharma1&backgroundColor=b6e3f4&clothing=collarAndSweater&clothesColor=65c9ff&eyebrows=default&eyes=default&mouth=smile&skinColor=ffdbb4&top=longHairStraight2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pharma2&backgroundColor=c0aede&clothing=blazerAndShirt&clothesColor=929598&eyebrows=raisedExcitedNatural&eyes=winkWacky&mouth=smile&skinColor=614335&top=shortHairShortRound',
  // Healthcare admin avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin1&backgroundColor=ffd5dc&clothing=blazerAndSweater&clothesColor=25557c&eyebrows=defaultNatural&eyes=default&mouth=smile&skinColor=f8d25c&top=longHairMiaWallace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2&backgroundColor=d1f4d1&clothing=shirtScoopNeck&clothesColor=ff488e&eyebrows=default&eyes=happy&mouth=twinkle&skinColor=d08b5b&top=shortHairFrizzle',
];

// Get a consistent avatar based on user ID or email
export const getMedicalAvatar = (userId, email) => {
  // Create a simple hash from userId or email
  const str = userId || email || 'default';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % MEDICAL_AVATARS.length;
  return MEDICAL_AVATARS[index];
};

// Get avatar with custom seed for variety
export const getAvatarBySeed = (seed) => {
  const colors = ['b6e3f4', 'c0aede', 'ffd5dc', 'd1f4d1', 'ffdfbf'];
  const colorIndex = Math.abs(seed.charCodeAt(0)) % colors.length;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${colors[colorIndex]}&accessories=prescription01&clothing=blazerAndSweater&clothesColor=3c79ce&mouth=smile`;
};

export default MEDICAL_AVATARS;
