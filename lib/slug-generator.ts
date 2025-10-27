// Friendly slug generation for readable URLs

const adjectives = [
  'happy', 'clever', 'bright', 'swift', 'quiet', 'bold', 'calm', 'eager',
  'gentle', 'kind', 'lively', 'proud', 'quick', 'brave', 'cool', 'fair',
  'fine', 'warm', 'wise', 'zesty', 'sunny', 'merry', 'noble', 'vivid',
  'fluffy', 'cosmic', 'golden', 'silver', 'purple', 'crimson', 'amber', 'azure',
  'crystal', 'diamond', 'emerald', 'jade', 'pearl', 'ruby', 'mystic', 'stellar',
  'lunar', 'solar', 'ocean', 'forest', 'mountain', 'river', 'meadow', 'desert',
  'arctic', 'tropic', 'autumn', 'winter', 'spring', 'summer', 'morning', 'evening'
];

const nouns = [
  'fox', 'owl', 'cat', 'dog', 'bear', 'deer', 'bird', 'fish',
  'lion', 'wolf', 'hawk', 'dove', 'swan', 'eagle', 'raven', 'seal',
  'panda', 'koala', 'tiger', 'zebra', 'whale', 'shark', 'coral', 'star',
  'cloud', 'moon', 'sun', 'comet', 'nova', 'aurora', 'nebula', 'galaxy',
  'breeze', 'storm', 'wave', 'flame', 'spark', 'thunder', 'lightning', 'frost',
  'shadow', 'whisper', 'echo', 'dream', 'vision', 'prism', 'cascade', 'meadow',
  'horizon', 'summit', 'valley', 'canyon', 'island', 'lagoon', 'reef', 'grove'
];

export function generateSlug(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}-${noun}-${number}`;
}

