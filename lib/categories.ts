export type CategoryDefinition = {
  slug: string
  name: string
  title: string
  shortTitle: string
  description: string
  keywords: string[]
  iconSampleNames: { name: string; library: string; displayName: string }[]
  faqs: { q: string; a: string }[]
  relatedCategories: string[]
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'ai',
    name: 'AI & Machine Learning',
    title: 'Free AI & Machine Learning SVG Icons',
    shortTitle: 'AI & ML',
    description: 'Explore and download 4,500+ free vector icons for artificial intelligence, neural networks, machine learning models, bots, sparkles, and automation.',
    keywords: ['ai', 'brain', 'cpu', 'sparkles', 'bot', 'chip', 'robot', 'wand', 'magic', 'neural', 'automation', 'algorithm'],
    iconSampleNames: [
      { name: 'sparkles', library: 'lucide-icons', displayName: 'Sparkles' },
      { name: 'bot', library: 'lucide-icons', displayName: 'Bot' },
      { name: 'cpu', library: 'lucide-icons', displayName: 'CPU' },
      { name: 'brain', library: 'tabler-icons', displayName: 'Brain' },
      { name: 'wand', library: 'lucide-icons', displayName: 'Wand' },
      { name: 'robot', library: 'tabler-icons', displayName: 'Robot' },
    ],
    faqs: [
      {
        q: 'What are the most popular AI icon concepts in 2026?',
        a: 'The most popular AI iconography includes sparkles (magic/generation), brain/neural nodes (deep learning), microchips/processors (compute), robot heads/assistants, and magical wands (prompting and transformations).',
      },
      {
        q: 'Can I use these AI icons in commercial SaaS applications?',
        a: 'Yes. All collections featured on IconSearch are licensed under commercial-friendly open-source licenses (MIT, Apache-2.0, ISC, CC0).',
      },
    ],
    relatedCategories: ['development', 'devices', 'design'],
  },
  {
    slug: 'commerce',
    name: 'E-Commerce & Shopping',
    title: 'Free E-Commerce & Shopping SVG Icons',
    shortTitle: 'Commerce',
    description: 'Download free shopping carts, price tags, credit cards, discounts, delivery trucks, store bags, and retail vector icons.',
    keywords: ['cart', 'shop', 'card', 'price', 'wallet', 'dollar', 'euro', 'money', 'bag', 'bank', 'coins', 'percent', 'tag', 'receipt', 'store', 'checkout'],
    iconSampleNames: [
      { name: 'shopping-cart', library: 'lucide-icons', displayName: 'Shopping Cart' },
      { name: 'shopping-bag', library: 'lucide-icons', displayName: 'Shopping Bag' },
      { name: 'credit-card', library: 'lucide-icons', displayName: 'Credit Card' },
      { name: 'tag', library: 'lucide-icons', displayName: 'Price Tag' },
      { name: 'receipt', library: 'tabler-icons', displayName: 'Receipt' },
      { name: 'truck', library: 'lucide-icons', displayName: 'Delivery Truck' },
    ],
    faqs: [
      {
        q: 'Which stroke width is recommended for checkout flow icons?',
        a: 'A 2px or 1.75px stroke width provides optimal legibility on mobile viewports for checkout steps, shopping carts, and payment badges.',
      },
    ],
    relatedCategories: ['finance', 'interface', 'security'],
  },
  {
    slug: 'arrows',
    name: 'Arrows & Navigation',
    title: 'Free Arrows & Directional SVG Icons',
    shortTitle: 'Arrows',
    description: 'Crisp vector arrows, chevrons, pointers, expanders, directional indicators, refresh loops, and navigation icons for UI designs.',
    keywords: ['arrow', 'chevron', 'direction', 'move', 'left', 'right', 'up', 'down', 'pointer', 'refresh', 'sync', 'rotate', 'expand', 'collapse', 'corner'],
    iconSampleNames: [
      { name: 'arrow-right', library: 'lucide-icons', displayName: 'Arrow Right' },
      { name: 'arrow-left', library: 'lucide-icons', displayName: 'Arrow Left' },
      { name: 'chevron-down', library: 'lucide-icons', displayName: 'Chevron Down' },
      { name: 'corner-down-right', library: 'lucide-icons', displayName: 'Corner Down Right' },
      { name: 'refresh-cw', library: 'lucide-icons', displayName: 'Refresh Clockwise' },
      { name: 'move', library: 'lucide-icons', displayName: 'Move' },
    ],
    faqs: [
      {
        q: 'How do I animate arrow icons on hover in Tailwind CSS?',
        a: 'Use `transition-transform duration-200 group-hover:translate-x-1` on the icon component inside a button or link with class `group`.',
      },
    ],
    relatedCategories: ['interface', 'editor'],
  },
  {
    slug: 'media',
    name: 'Media, Video & Audio',
    title: 'Free Media, Video & Audio SVG Icons',
    shortTitle: 'Media',
    description: 'High-quality play buttons, pause, volume sliders, cameras, microphones, video cameras, discs, musical notes, and recording vector graphics.',
    keywords: ['play', 'music', 'video', 'sound', 'audio', 'volume', 'camera', 'image', 'picture', 'disc', 'film', 'mic', 'headphones', 'radio', 'speaker', 'pause'],
    iconSampleNames: [
      { name: 'play', library: 'lucide-icons', displayName: 'Play' },
      { name: 'pause', library: 'lucide-icons', displayName: 'Pause' },
      { name: 'volume-2', library: 'lucide-icons', displayName: 'Volume High' },
      { name: 'camera', library: 'lucide-icons', displayName: 'Camera' },
      { name: 'video', library: 'lucide-icons', displayName: 'Video' },
      { name: 'mic', library: 'lucide-icons', displayName: 'Microphone' },
    ],
    faqs: [
      {
        q: 'Can I export media player icons as an SVG sprite sheet?',
        a: 'Yes. Select your media controls into the cart and click "Batch Export ZIP" or "Copy SVG Sprite" to bundle them into a single asset.',
      },
    ],
    relatedCategories: ['devices', 'interface'],
  },
  {
    slug: 'communication',
    name: 'Communication & Chat',
    title: 'Free Communication & Messaging SVG Icons',
    shortTitle: 'Communication',
    description: 'Download mail envelopes, message bubbles, chat threads, phone handsets, broadcast signals, contact cards, and inbox vector icons.',
    keywords: ['mail', 'message', 'chat', 'phone', 'call', 'send', 'share', 'envelope', 'inbox', 'conversation', 'bubble', 'comment', 'discussion', 'voicemail'],
    iconSampleNames: [
      { name: 'mail', library: 'lucide-icons', displayName: 'Mail Envelope' },
      { name: 'message-square', library: 'lucide-icons', displayName: 'Message Square' },
      { name: 'message-circle', library: 'lucide-icons', displayName: 'Message Circle' },
      { name: 'phone', library: 'lucide-icons', displayName: 'Phone' },
      { name: 'send', library: 'lucide-icons', displayName: 'Send' },
      { name: 'inbox', library: 'lucide-icons', displayName: 'Inbox' },
    ],
    faqs: [
      {
        q: 'What is the best format for unread message indicator badges?',
        a: 'Pair an outline `message-square` icon with a small absolute-positioned ping badge `<span className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full" />`.',
      },
    ],
    relatedCategories: ['social', 'interface'],
  },
  {
    slug: 'security',
    name: 'Security & Authentication',
    title: 'Free Security, Lock & Protection SVG Icons',
    shortTitle: 'Security',
    description: 'Padlocks, shields, security keys, fingerprints, passwords, biometric authentications, eye visibilities, and firewall vector icons.',
    keywords: ['lock', 'shield', 'key', 'eye', 'secure', 'auth', 'unlock', 'password', 'keyhole', 'fingerprint', 'protect', 'guard', 'safety', 'privacy'],
    iconSampleNames: [
      { name: 'shield-check', library: 'lucide-icons', displayName: 'Shield Check' },
      { name: 'lock', library: 'lucide-icons', displayName: 'Padlock Closed' },
      { name: 'unlock', library: 'lucide-icons', displayName: 'Padlock Open' },
      { name: 'key', library: 'lucide-icons', displayName: 'Security Key' },
      { name: 'fingerprint', library: 'lucide-icons', displayName: 'Fingerprint' },
      { name: 'eye', library: 'lucide-icons', displayName: 'Eye Visible' },
    ],
    faqs: [
      {
        q: 'Which libraries have matching solid and outline shield variants?',
        a: 'Heroicons and Tabler Icons provide dual outline and solid variants, allowing easy toggle between protected (solid) and unlocked (outline) states.',
      },
    ],
    relatedCategories: ['interface', 'development'],
  },
  {
    slug: 'weather',
    name: 'Weather & Climate',
    title: 'Free Weather, Climate & Seasons SVG Icons',
    shortTitle: 'Weather',
    description: 'Sun, clouds, raindrops, lightning, snowflakes, wind gusts, temperature gauges, stars, rainbows, and forecast vector graphics.',
    keywords: ['sun', 'cloud', 'rain', 'snow', 'wind', 'temp', 'weather', 'star', 'moon', 'leaf', 'tree', 'flower', 'lightning', 'fog', 'forecast'],
    iconSampleNames: [
      { name: 'sun', library: 'lucide-icons', displayName: 'Sun' },
      { name: 'cloud-rain', library: 'lucide-icons', displayName: 'Cloud Rain' },
      { name: 'cloud-snow', library: 'lucide-icons', displayName: 'Cloud Snow' },
      { name: 'wind', library: 'lucide-icons', displayName: 'Wind' },
      { name: 'thermometer', library: 'lucide-icons', displayName: 'Thermometer' },
      { name: 'moon', library: 'lucide-icons', displayName: 'Moon' },
    ],
    faqs: [
      {
        q: 'Are multi-color weather icons available?',
        a: 'Yes, collections like Flat Color Icons and Fluent Emoji Flat include full-color illustrations for weather widgets.',
      },
    ],
    relatedCategories: ['nature', 'travel'],
  },
  {
    slug: 'devices',
    name: 'Hardware & Tech Devices',
    title: 'Free Hardware, Gadgets & Tech Devices SVG Icons',
    shortTitle: 'Devices',
    description: 'Laptops, smartphones, monitors, tablets, smartwatches, keyboards, mice, printers, headphones, server racks, and battery indicators.',
    keywords: ['device', 'phone', 'computer', 'monitor', 'cpu', 'keyboard', 'laptop', 'tablet', 'wifi', 'battery', 'tv', 'plug', 'watch', 'mouse', 'printer', 'hard-drive'],
    iconSampleNames: [
      { name: 'laptop', library: 'lucide-icons', displayName: 'Laptop' },
      { name: 'smartphone', library: 'lucide-icons', displayName: 'Smartphone' },
      { name: 'monitor', library: 'lucide-icons', displayName: 'Monitor' },
      { name: 'tablet', library: 'lucide-icons', displayName: 'Tablet' },
      { name: 'watch', library: 'lucide-icons', displayName: 'Smartwatch' },
      { name: 'hard-drive', library: 'lucide-icons', displayName: 'Hard Drive' },
    ],
    faqs: [
      {
        q: 'Can I resize device icons without breaking line weights?',
        a: 'Yes. All SVG paths use `vector-effect="non-scaling-stroke"` or proportional stroke mappings to retain sharpness across 16px to 96px.',
      },
    ],
    relatedCategories: ['development', 'media'],
  },
  {
    slug: 'design',
    name: 'Design & Creativity',
    title: 'Free Graphic Design & Creative Tools SVG Icons',
    shortTitle: 'Design',
    description: 'Paintbrushes, color palettes, rulers, pencils, layers, pen tools, bezier curves, crop marks, typography tools, and canvas controls.',
    keywords: ['paint', 'brush', 'color', 'palette', 'ruler', 'pencil', 'layers', 'crop', 'bezier', 'vector', 'art', 'canvas', 'dropper', 'pen-tool'],
    iconSampleNames: [
      { name: 'palette', library: 'lucide-icons', displayName: 'Color Palette' },
      { name: 'pen-tool', library: 'lucide-icons', displayName: 'Pen Tool' },
      { name: 'layers', library: 'lucide-icons', displayName: 'Layers' },
      { name: 'crop', library: 'lucide-icons', displayName: 'Crop Tool' },
      { name: 'ruler', library: 'lucide-icons', displayName: 'Ruler' },
      { name: 'pipette', library: 'lucide-icons', displayName: 'Color Pipette' },
    ],
    faqs: [
      {
        q: 'How do I use the live customizer to tint design icons?',
        a: 'Click any icon to open the customizer drawer. Pick from curated Tailwind CSS palettes or input custom hex values with duotone secondary tints.',
      },
    ],
    relatedCategories: ['editor', 'ai'],
  },
  {
    slug: 'development',
    name: 'Development & Code',
    title: 'Free Software Development & Code SVG Icons',
    shortTitle: 'Development',
    description: 'Terminal prompts, code brackets, git branches, database cylinders, bugs, servers, API endpoints, and programming tool icons.',
    keywords: ['code', 'terminal', 'git', 'branch', 'database', 'server', 'bug', 'commit', 'pull-request', 'api', 'binary', 'variable', 'function', 'developer'],
    iconSampleNames: [
      { name: 'code', library: 'lucide-icons', displayName: 'Code Brackets' },
      { name: 'terminal', library: 'lucide-icons', displayName: 'Terminal' },
      { name: 'git-branch', library: 'lucide-icons', displayName: 'Git Branch' },
      { name: 'database', library: 'lucide-icons', displayName: 'Database' },
      { name: 'server', library: 'lucide-icons', displayName: 'Server Rack' },
      { name: 'bug', library: 'lucide-icons', displayName: 'Bug' },
    ],
    faqs: [
      {
        q: 'Which developer icon packages are tree-shakable in Next.js App Router?',
        a: 'Lucide React, Tabler Icons React, and Radix Icons all support tree-shaking with zero runtime bloat in Next.js Server and Client Components.',
      },
    ],
    relatedCategories: ['devices', 'brand', 'security'],
  },
  {
    slug: 'finance',
    name: 'Finance & Banking',
    title: 'Free Finance, Banking & Crypto SVG Icons',
    shortTitle: 'Finance',
    description: 'Bank buildings, dollar bills, coin stacks, cryptocurrency tokens, revenue charts, vaults, invoices, balance sheets, and percentage tags.',
    keywords: ['finance', 'bank', 'dollar', 'euro', 'crypto', 'bitcoin', 'coins', 'cash', 'money', 'vault', 'chart', 'investment', 'wallet', 'tax'],
    iconSampleNames: [
      { name: 'banknote', library: 'lucide-icons', displayName: 'Banknote' },
      { name: 'coins', library: 'lucide-icons', displayName: 'Coins Stack' },
      { name: 'wallet', library: 'lucide-icons', displayName: 'Wallet' },
      { name: 'trending-up', library: 'lucide-icons', displayName: 'Trending Up' },
      { name: 'landmark', library: 'lucide-icons', displayName: 'Bank Landmark' },
      { name: 'piggy-bank', library: 'lucide-icons', displayName: 'Piggy Bank' },
    ],
    faqs: [
      {
        q: 'Are official cryptocurrency token icons included?',
        a: 'Yes. Token Branded and Cryptocurrency Icons collections provide vector marks for Bitcoin, Ethereum, Solana, and 500+ tokens.',
      },
    ],
    relatedCategories: ['commerce', 'security'],
  },
  {
    slug: 'social',
    name: 'Social & Community',
    title: 'Free Social Media & Community SVG Icons',
    shortTitle: 'Social',
    description: 'Hearts, likes, thumbs up, stars, user profiles, followers, shared links, bookmarks, notifications, comments, and community badges.',
    keywords: ['social', 'heart', 'star', 'like', 'thumbs-up', 'user', 'people', 'share', 'bookmark', 'notification', 'follow', 'repost', 'award', 'trophy'],
    iconSampleNames: [
      { name: 'heart', library: 'lucide-icons', displayName: 'Heart Like' },
      { name: 'star', library: 'lucide-icons', displayName: 'Star Bookmark' },
      { name: 'thumbs-up', library: 'lucide-icons', displayName: 'Thumbs Up' },
      { name: 'share-2', library: 'lucide-icons', displayName: 'Share' },
      { name: 'users', library: 'lucide-icons', displayName: 'Users Group' },
      { name: 'award', library: 'lucide-icons', displayName: 'Award Badge' },
    ],
    faqs: [
      {
        q: 'How to implement an interactive favorite toggle with these icons?',
        a: 'Render `<Heart className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />` using Tailwind utility classes.',
      },
    ],
    relatedCategories: ['communication', 'interface'],
  },
  {
    slug: 'nature',
    name: 'Nature, Animals & Plants',
    title: 'Free Nature, Animals & Plants SVG Icons',
    shortTitle: 'Nature',
    description: 'Leaves, trees, flowers, paws, wildlife, mountains, rivers, eco recycling symbols, seeds, and outdoor environment vector graphics.',
    keywords: ['nature', 'leaf', 'tree', 'flower', 'plant', 'paw', 'animal', 'mountain', 'eco', 'recycle', 'forest', 'garden', 'sun', 'water'],
    iconSampleNames: [
      { name: 'leaf', library: 'lucide-icons', displayName: 'Green Leaf' },
      { name: 'trees', library: 'lucide-icons', displayName: 'Forest Trees' },
      { name: 'sprout', library: 'lucide-icons', displayName: 'Sprout' },
      { name: 'flower', library: 'lucide-icons', displayName: 'Flower' },
      { name: 'mountain', library: 'lucide-icons', displayName: 'Mountain Peak' },
      { name: 'recycle', library: 'lucide-icons', displayName: 'Recycle Eco' },
    ],
    faqs: [
      {
        q: 'Which collections contain eco-friendly and sustainability vector icons?',
        a: 'Tabler Icons and Lucide Icons provide over 200 dedicated eco, recycling, renewable energy, and nature icons.',
      },
    ],
    relatedCategories: ['weather', 'travel'],
  },
  {
    slug: 'health',
    name: 'Health & Medical',
    title: 'Free Healthcare & Medical SVG Icons',
    shortTitle: 'Health',
    description: 'Medical crosses, heart rate pulses, stethoscopes, pills, hospital buildings, syringes, DNA helices, and fitness health monitors.',
    keywords: ['health', 'heart', 'plus', 'aid', 'medical', 'hospital', 'pill', 'activity', 'thermometer', 'pulse', 'stethoscope', 'syringe', 'dna', 'fitness', 'ambulance'],
    iconSampleNames: [
      { name: 'activity', library: 'lucide-icons', displayName: 'Heart Pulse Activity' },
      { name: 'heart-pulse', library: 'lucide-icons', displayName: 'Heart Rate Pulse' },
      { name: 'pill', library: 'lucide-icons', displayName: 'Medical Pill' },
      { name: 'stethoscope', library: 'lucide-icons', displayName: 'Stethoscope' },
      { name: 'cross', library: 'lucide-icons', displayName: 'First Aid Cross' },
      { name: 'dna', library: 'lucide-icons', displayName: 'DNA Helix' },
    ],
    faqs: [
      {
        q: 'Are health icons compliant with healthcare design guidelines?',
        a: 'Yes. They follow standard universal hospital symbols and ISO medical communication iconography conventions.',
      },
    ],
    relatedCategories: ['sports', 'security'],
  },
  {
    slug: 'travel',
    name: 'Travel & Transportation',
    title: 'Free Travel & Transportation SVG Icons',
    shortTitle: 'Travel',
    description: 'Airplanes, luggage, passports, trains, compasses, hotel beds, cars, boats, tickets, globe maps, and vacation vector graphics.',
    keywords: ['travel', 'plane', 'car', 'bus', 'train', 'ship', 'luggage', 'passport', 'compass', 'ticket', 'hotel', 'map', 'globe', 'vacation', 'flight'],
    iconSampleNames: [
      { name: 'plane', library: 'lucide-icons', displayName: 'Airplane Flight' },
      { name: 'compass', library: 'lucide-icons', displayName: 'Compass' },
      { name: 'globe', library: 'lucide-icons', displayName: 'World Globe' },
      { name: 'luggage', library: 'lucide-icons', displayName: 'Luggage Bag' },
      { name: 'car', library: 'lucide-icons', displayName: 'Car' },
      { name: 'map-pin', library: 'lucide-icons', displayName: 'Map Location Pin' },
    ],
    faqs: [
      {
        q: 'Can travel icons be exported with customized circular badges?',
        a: 'Yes. In the customizer drawer, select "Frame: Circle" with custom padding to generate app icons or map marker assets.',
      },
    ],
    relatedCategories: ['maps', 'weather'],
  },
  {
    slug: 'food',
    name: 'Food & Dining',
    title: 'Free Food, Drinks & Dining SVG Icons',
    shortTitle: 'Food',
    description: 'Coffee cups, wine glasses, burger patties, pizzas, utensils, chef hats, bowls, fruits, vegetables, and restaurant menu icons.',
    keywords: ['food', 'coffee', 'cup', 'pizza', 'burger', 'drink', 'wine', 'utensils', 'fork', 'knife', 'restaurant', 'apple', 'cake', 'ice-cream', 'chef'],
    iconSampleNames: [
      { name: 'coffee', library: 'lucide-icons', displayName: 'Coffee Cup' },
      { name: 'utensils', library: 'lucide-icons', displayName: 'Fork & Knife' },
      { name: 'pizza', library: 'lucide-icons', displayName: 'Pizza Slice' },
      { name: 'wine', library: 'lucide-icons', displayName: 'Wine Glass' },
      { name: 'cake', library: 'lucide-icons', displayName: 'Birthday Cake' },
      { name: 'apple', library: 'lucide-icons', displayName: 'Apple Fruit' },
    ],
    faqs: [
      {
        q: 'What are the best vector sets for restaurant ordering apps?',
        a: 'Lucide, Remix Icons, and Tabler Icons provide complete hospitality catalogs covering breakfast, dinner, beverages, and cutlery.',
      },
    ],
    relatedCategories: ['commerce', 'travel'],
  },
  {
    slug: 'editor',
    name: 'Editor & Formatting',
    title: 'Free Text Editor & Typography SVG Icons',
    shortTitle: 'Editor',
    description: 'Text alignment, bold, italic, underline, list bullets, tables, quote marks, copy, paste, scissors, eraser, and typography controls.',
    keywords: ['edit', 'write', 'pen', 'align', 'format', 'list', 'trash', 'save', 'copy', 'paste', 'grid', 'table', 'columns', 'bold', 'italic', 'underline', 'quote'],
    iconSampleNames: [
      { name: 'bold', library: 'lucide-icons', displayName: 'Bold Text' },
      { name: 'italic', library: 'lucide-icons', displayName: 'Italic Text' },
      { name: 'align-left', library: 'lucide-icons', displayName: 'Align Left' },
      { name: 'list', library: 'lucide-icons', displayName: 'Bullet List' },
      { name: 'copy', library: 'lucide-icons', displayName: 'Copy to Clipboard' },
      { name: 'trash-2', library: 'lucide-icons', displayName: 'Trash Delete' },
    ],
    faqs: [
      {
        q: 'Which editor icons support monospaced alignments?',
        a: 'All Lucide and Tabler editor icons are designed on an integer 24x24 pixel grid with uniform bounding boxes.',
      },
    ],
    relatedCategories: ['interface', 'design'],
  },
  {
    slug: 'maps',
    name: 'Maps & Geolocation',
    title: 'Free Maps, Navigation & Location SVG Icons',
    shortTitle: 'Maps',
    description: 'Map pins, GPS crosshairs, navigation routes, compass needles, street signs, flag waypoints, and globe coordinates vector icons.',
    keywords: ['map', 'pin', 'navigation', 'location', 'gps', 'route', 'destination', 'marker', 'compass', 'globe', 'waypoint', 'coordinates', 'crosshair'],
    iconSampleNames: [
      { name: 'map-pin', library: 'lucide-icons', displayName: 'Map Marker Pin' },
      { name: 'map', library: 'lucide-icons', displayName: 'Folded Map' },
      { name: 'navigation', library: 'lucide-icons', displayName: 'Navigation Arrow' },
      { name: 'locate', library: 'lucide-icons', displayName: 'GPS Current Location' },
      { name: 'flag', library: 'lucide-icons', displayName: 'Waypoint Flag' },
      { name: 'crosshair', library: 'lucide-icons', displayName: 'Target Crosshair' },
    ],
    faqs: [
      {
        q: 'Can I drop these map pins into Mapbox or Leaflet as custom markers?',
        a: 'Yes. You can export as PNG with custom dimensions (e.g. 32px or 64px) or use inline SVGs as Leaflet DivIcons.',
      },
    ],
    relatedCategories: ['travel', 'interface'],
  },
  {
    slug: 'interface',
    name: 'UI & User Interface',
    title: 'Free UI Controls & Interface SVG Icons',
    shortTitle: 'Interface',
    description: 'Hamburger menus, close buttons, search magnifying glasses, filters, sliders, checkboxes, toggle switches, settings gears, and modals.',
    keywords: ['ui', 'menu', 'search', 'filter', 'settings', 'cog', 'sliders', 'check', 'x', 'close', 'more', 'toggle', 'switch', 'modal', 'dashboard', 'home'],
    iconSampleNames: [
      { name: 'menu', library: 'lucide-icons', displayName: 'Hamburger Menu' },
      { name: 'search', library: 'lucide-icons', displayName: 'Search Glass' },
      { name: 'settings', library: 'lucide-icons', displayName: 'Settings Gear' },
      { name: 'sliders', library: 'lucide-icons', displayName: 'Filter Sliders' },
      { name: 'check', library: 'lucide-icons', displayName: 'Checkmark' },
      { name: 'x', library: 'lucide-icons', displayName: 'Close Cross' },
    ],
    faqs: [
      {
        q: 'What is the optimal size for mobile tap targets with interface icons?',
        a: 'Render the icon at 20px–24px inside a minimum 44x44px interactive touch target (e.g. `p-2.5 rounded-lg`).',
      },
    ],
    relatedCategories: ['arrows', 'editor'],
  },
  {
    slug: 'brand',
    name: 'Brand & Tech Logos',
    title: 'Free Brand, Social & Tech Logo SVG Icons',
    shortTitle: 'Brands',
    description: 'GitHub, Twitter / X, Google, Discord, Slack, Apple, Microsoft, LinkedIn, YouTube, Figma, and open-source project vector marks.',
    keywords: ['brand', 'logo', 'github', 'twitter', 'google', 'apple', 'discord', 'slack', 'facebook', 'linkedin', 'youtube', 'figma', 'react', 'tailwind'],
    iconSampleNames: [
      { name: 'github', library: 'lucide-icons', displayName: 'GitHub Logo' },
      { name: 'twitter', library: 'lucide-icons', displayName: 'Twitter X' },
      { name: 'linkedin', library: 'lucide-icons', displayName: 'LinkedIn' },
      { name: 'youtube', library: 'lucide-icons', displayName: 'YouTube' },
      { name: 'figma', library: 'lucide-icons', displayName: 'Figma' },
      { name: 'slack', library: 'lucide-icons', displayName: 'Slack' },
    ],
    faqs: [
      {
        q: 'Are brand logos permitted under open source licenses?',
        a: 'Brand logos are provided for identification purposes under standard fair-use and respective trademark guidelines.',
      },
    ],
    relatedCategories: ['development', 'social'],
  },
  {
    slug: 'education',
    name: 'Education & Learning',
    title: 'Free Education, Books & Learning SVG Icons',
    shortTitle: 'Education',
    description: 'Graduation caps, open books, school desks, pencils, certificates, blackboards, microscopes, backpacks, and academic achievement medals.',
    keywords: ['education', 'book', 'school', 'grad', 'graduation', 'learn', 'academy', 'certificate', 'microscope', 'study', 'student', 'teacher', 'library', 'exam'],
    iconSampleNames: [
      { name: 'graduation-cap', library: 'lucide-icons', displayName: 'Graduation Cap' },
      { name: 'book-open', library: 'lucide-icons', displayName: 'Open Book' },
      { name: 'school', library: 'lucide-icons', displayName: 'School Building' },
      { name: 'award', library: 'lucide-icons', displayName: 'Certificate Medal' },
      { name: 'library', library: 'lucide-icons', displayName: 'Library' },
      { name: 'backpack', library: 'lucide-icons', displayName: 'Backpack' },
    ],
    faqs: [
      {
        q: 'Which icon set is best for edtech LMS platforms?',
        a: 'Lucide and Heroicons provide clean academic sets that integrate cleanly with shadcn/ui components.',
      },
    ],
    relatedCategories: ['editor', 'social'],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate & Buildings',
    title: 'Free Real Estate, Architecture & Buildings SVG Icons',
    shortTitle: 'Real Estate',
    description: 'Houses, apartment towers, keys, floor plans, real estate sold signs, mortgages, contracts, architecture, and interior design icons.',
    keywords: ['home', 'house', 'building', 'architecture', 'property', 'real-estate', 'apartment', 'door', 'roof', 'key', 'mortgage', 'rent', 'hotel'],
    iconSampleNames: [
      { name: 'home', library: 'lucide-icons', displayName: 'Home House' },
      { name: 'building-2', library: 'lucide-icons', displayName: 'Apartment Tower' },
      { name: 'key', library: 'lucide-icons', displayName: 'House Key' },
      { name: 'door-open', library: 'lucide-icons', displayName: 'Open Door' },
      { name: 'warehouse', library: 'lucide-icons', displayName: 'Warehouse' },
      { name: 'hotel', library: 'lucide-icons', displayName: 'Hotel' },
    ],
    faqs: [
      {
        q: 'Are architectural isometric icons available?',
        a: 'Tabler Icons and Remix Icon offer multi-perspective building and urban infrastructure vectors.',
      },
    ],
    relatedCategories: ['maps', 'commerce'],
  },
  {
    slug: 'sports',
    name: 'Sports, Fitness & Gaming',
    title: 'Free Sports, Fitness, Gym & Gaming SVG Icons',
    shortTitle: 'Sports & Games',
    description: 'Dumbbells, trophies, game controllers, running shoes, basketballs, soccer balls, medals, stopwatch timers, and fitness tracking icons.',
    keywords: ['sports', 'game', 'gamepad', 'trophy', 'fitness', 'dumbbell', 'ball', 'soccer', 'running', 'timer', 'medal', 'gym', 'workout', 'swimming'],
    iconSampleNames: [
      { name: 'gamepad-2', library: 'lucide-icons', displayName: 'Game Controller' },
      { name: 'trophy', library: 'lucide-icons', displayName: 'Trophy' },
      { name: 'dumbbell', library: 'lucide-icons', displayName: 'Dumbbell' },
      { name: 'timer', library: 'lucide-icons', displayName: 'Stopwatch Timer' },
      { name: 'medal', library: 'lucide-icons', displayName: 'Gold Medal' },
      { name: 'activity', library: 'lucide-icons', displayName: 'Heart Workout Activity' },
    ],
    faqs: [
      {
        q: 'Can I use game controller icons in gaming dashboards?',
        a: 'Yes. Lucide and Phosphor provide modern console controller, d-pad, joystick, and arcade vector icons.',
      },
    ],
    relatedCategories: ['health', 'media'],
  },
  {
    slug: 'files',
    name: 'Files & Document Formats',
    title: 'Free Files, Documents & Folders SVG Icons',
    shortTitle: 'Files',
    description: 'Document folders, PDF files, CSV spreadsheets, ZIP archives, image assets, code scripts, upload arrows, and cloud storage graphics.',
    keywords: ['file', 'folder', 'document', 'pdf', 'zip', 'archive', 'sheet', 'csv', 'image', 'upload', 'download', 'cloud', 'storage', 'attachment'],
    iconSampleNames: [
      { name: 'file-text', library: 'lucide-icons', displayName: 'Text Document' },
      { name: 'folder', library: 'lucide-icons', displayName: 'Folder' },
      { name: 'folder-plus', library: 'lucide-icons', displayName: 'New Folder' },
      { name: 'file-code', library: 'lucide-icons', displayName: 'Code File' },
      { name: 'file-archive', library: 'lucide-icons', displayName: 'ZIP Archive' },
      { name: 'paperclip', library: 'lucide-icons', displayName: 'Attachment Paperclip' },
    ],
    faqs: [
      {
        q: 'How to indicate file download status in React with these icons?',
        a: 'Switch conditionally between `<FileText />`, `<Download className="animate-bounce" />`, and `<CheckCircle className="text-green-500" />`.',
      },
    ],
    relatedCategories: ['editor', 'development'],
  },
  {
    slug: 'emoji',
    name: 'Emoji & Reactions',
    title: 'Free Emoji, Reactions & Smileys SVG Icons',
    shortTitle: 'Emoji',
    description: 'Smiley faces, laughing emojis, thumbs up, celebration party poppers, fire flames, heart eyes, and expressive reaction vector marks.',
    keywords: ['emoji', 'smile', 'laugh', 'frown', 'reaction', 'party', 'fire', 'flame', 'face', 'celebrate', 'rocket', 'clap', 'sparkles'],
    iconSampleNames: [
      { name: 'smile', library: 'lucide-icons', displayName: 'Smile Face' },
      { name: 'laugh', library: 'lucide-icons', displayName: 'Laughing Emoji' },
      { name: 'frown', library: 'lucide-icons', displayName: 'Frown' },
      { name: 'flame', library: 'lucide-icons', displayName: 'Fire Flame' },
      { name: 'party-popper', library: 'lucide-icons', displayName: 'Party Popper' },
      { name: 'rocket', library: 'lucide-icons', displayName: 'Rocket Launch' },
    ],
    faqs: [
      {
        q: 'Are full-color emoji packages available?',
        a: 'Yes. Fluent Emoji Flat and OpenMoji provide over 3,000 multi-color vector emojis.',
      },
    ],
    relatedCategories: ['social', 'communication'],
  },
]

export const CATEGORY_KEYWORDS_MAP: Record<string, string[]> = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.slug, cat.keywords])
)

export function getAllCategories(): CategoryDefinition[] {
  return CATEGORIES
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  const normalized = slug.toLowerCase()
  return CATEGORIES.find((cat) => cat.slug === normalized)
}
