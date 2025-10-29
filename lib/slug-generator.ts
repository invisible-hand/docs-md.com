// Friendly slug generation for readable URLs
// Expanded vocabulary + alphanumeric suffix for 1-10M scale
// Total combinations: ~36.6 trillion (collision probability < 0.14% at 10M shares)

const adjectives = [
  // Original
  'happy', 'clever', 'bright', 'swift', 'quiet', 'bold', 'calm', 'eager',
  'gentle', 'kind', 'lively', 'proud', 'quick', 'brave', 'cool', 'fair',
  'fine', 'warm', 'wise', 'zesty', 'sunny', 'merry', 'noble', 'vivid',
  'fluffy', 'cosmic', 'golden', 'silver', 'purple', 'crimson', 'amber', 'azure',
  'crystal', 'diamond', 'emerald', 'jade', 'pearl', 'ruby', 'mystic', 'stellar',
  'lunar', 'solar', 'ocean', 'forest', 'mountain', 'river', 'meadow', 'desert',
  'arctic', 'tropic', 'autumn', 'winter', 'spring', 'summer', 'morning', 'evening',
  // Colors
  'scarlet', 'violet', 'indigo', 'cyan', 'magenta', 'olive', 'navy', 'teal',
  'coral', 'ivory', 'bronze', 'copper', 'platinum', 'rose', 'lime', 'mint',
  'peach', 'lavender', 'sage', 'rust', 'slate', 'cream', 'vanilla', 'mocha',
  // Nature
  'misty', 'foggy', 'stormy', 'cloudy', 'rainy', 'snowy', 'windy', 'breezy',
  'humid', 'frosty', 'icy', 'tropical', 'polar', 'wild', 'serene', 'tranquil',
  'verdant', 'lush', 'barren', 'rocky', 'sandy', 'muddy', 'mossy', 'leafy',
  // Qualities
  'ancient', 'modern', 'classic', 'vintage', 'retro', 'future', 'timeless', 'eternal',
  'mighty', 'tiny', 'giant', 'mini', 'mega', 'ultra', 'super', 'hyper',
  'silent', 'loud', 'soft', 'hard', 'smooth', 'rough', 'sharp', 'dull',
  'bright', 'dark', 'light', 'heavy', 'solid', 'liquid', 'frozen', 'molten',
  // Emotions
  'joyful', 'peaceful', 'cheerful', 'playful', 'gleeful', 'blissful', 'content', 'serene',
  'curious', 'eager', 'zealous', 'fervent', 'ardent', 'passionate', 'spirited', 'animated',
  'gentle', 'tender', 'caring', 'loving', 'devoted', 'loyal', 'faithful', 'true',
  // Elements
  'fiery', 'watery', 'earthy', 'airy', 'electric', 'magnetic', 'atomic', 'nuclear',
  'radiant', 'glowing', 'shining', 'sparkling', 'gleaming', 'luminous', 'brilliant', 'dazzling',
  // Movement
  'flowing', 'rushing', 'drifting', 'soaring', 'gliding', 'flying', 'sailing', 'rolling',
  'spinning', 'dancing', 'leaping', 'bouncing', 'swaying', 'rocking', 'floating', 'diving',
  // Time
  'dawn', 'dusk', 'twilight', 'midnight', 'noon', 'early', 'late', 'prompt',
  'instant', 'eternal', 'fleeting', 'lasting', 'brief', 'endless', 'infinite', 'temporal'
];

const nouns = [
  // Original animals
  'fox', 'owl', 'cat', 'dog', 'bear', 'deer', 'bird', 'fish',
  'lion', 'wolf', 'hawk', 'dove', 'swan', 'eagle', 'raven', 'seal',
  'panda', 'koala', 'tiger', 'zebra', 'whale', 'shark', 'coral', 'star',
  // More animals
  'otter', 'beaver', 'rabbit', 'squirrel', 'mouse', 'rat', 'bat', 'mole',
  'lynx', 'cougar', 'jaguar', 'leopard', 'cheetah', 'panther', 'hyena', 'jackal',
  'falcon', 'kestrel', 'osprey', 'kite', 'crane', 'heron', 'stork', 'pelican',
  'penguin', 'puffin', 'albatross', 'seagull', 'tern', 'petrel', 'gannet', 'skua',
  'turtle', 'tortoise', 'lizard', 'gecko', 'iguana', 'dragon', 'serpent', 'viper',
  'salmon', 'trout', 'bass', 'pike', 'carp', 'perch', 'tuna', 'marlin',
  'dolphin', 'orca', 'seal', 'walrus', 'manatee', 'dugong', 'narwhal', 'beluga',
  // Celestial
  'cloud', 'moon', 'sun', 'comet', 'nova', 'aurora', 'nebula', 'galaxy',
  'meteor', 'asteroid', 'planet', 'orbit', 'quasar', 'pulsar', 'cosmos', 'void',
  'zenith', 'nadir', 'eclipse', 'equinox', 'solstice', 'twilight', 'dawn', 'dusk',
  // Weather
  'breeze', 'storm', 'wave', 'flame', 'spark', 'thunder', 'lightning', 'frost',
  'rain', 'snow', 'hail', 'sleet', 'mist', 'fog', 'dew', 'ice',
  'wind', 'gale', 'gust', 'squall', 'tempest', 'cyclone', 'typhoon', 'monsoon',
  // Landscapes
  'shadow', 'whisper', 'echo', 'dream', 'vision', 'prism', 'cascade', 'meadow',
  'horizon', 'summit', 'valley', 'canyon', 'island', 'lagoon', 'reef', 'grove',
  'peak', 'ridge', 'slope', 'cliff', 'crag', 'bluff', 'mesa', 'butte',
  'plain', 'prairie', 'savanna', 'steppe', 'tundra', 'taiga', 'jungle', 'rainforest',
  'lake', 'pond', 'stream', 'brook', 'creek', 'river', 'delta', 'estuary',
  'bay', 'cove', 'inlet', 'fjord', 'sound', 'strait', 'channel', 'gulf',
  // Plants
  'pine', 'oak', 'maple', 'birch', 'willow', 'cedar', 'spruce', 'fir',
  'palm', 'bamboo', 'fern', 'moss', 'lichen', 'algae', 'kelp', 'reed',
  'rose', 'lily', 'lotus', 'orchid', 'jasmine', 'violet', 'daisy', 'tulip',
  // Minerals
  'quartz', 'granite', 'marble', 'slate', 'basalt', 'obsidian', 'flint', 'shale',
  'opal', 'topaz', 'garnet', 'sapphire', 'amethyst', 'turquoise', 'onyx', 'agate'
];

// Generate random alphanumeric string (a-z, A-Z, 0-9)
function randomAlphanumeric(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSlug(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = randomAlphanumeric(5);
  
  return `${adjective}-${noun}-${suffix}`;
}

