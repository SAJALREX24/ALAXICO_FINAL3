// Medical cartoon avatar URLs - reliable SVG avatars
const MEDICAL_AVATARS = [
  // Using reliable Dicebear Adventurer style - cute cartoon characters
  'https://api.dicebear.com/7.x/adventurer/svg?seed=doctor&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=nurse&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=surgeon&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=pharmacist&backgroundColor=d1f4d1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=therapist&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=dentist&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=medic&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=health&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=care&backgroundColor=d1f4d1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hospital&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=clinic&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=lab&backgroundColor=c0aede',
];

// Get a consistent avatar based on user ID or email
export const getMedicalAvatar = (userId, email) => {
  // Create a simple hash from userId or email
  const str = userId || email || 'default';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Use the user's identifier as seed for consistent but unique avatar
  const seed = encodeURIComponent(str.substring(0, 20));
  const colors = ['b6e3f4', 'c0aede', 'ffd5dc', 'd1f4d1', 'ffdfbf', 'ffc9a9'];
  const colorIndex = Math.abs(hash) % colors.length;
  
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=${colors[colorIndex]}`;
};

// Get avatar with specific style
export const getAvatarBySeed = (seed) => {
  const colors = ['b6e3f4', 'c0aede', 'ffd5dc', 'd1f4d1', 'ffdfbf'];
  const colorIndex = Math.abs(seed.charCodeAt(0)) % colors.length;
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${colors[colorIndex]}`;
};

export default MEDICAL_AVATARS;
