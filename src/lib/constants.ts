export const SITE_NAME = "Afshan Gift Centre";
export const SITE_TAGLINE = "Gifts, Luxury Decor & Fine Accents";
export const SITE_DESCRIPTION =
  "Afshan Gift Centre is Vehari's premier destination for curated gifts, exquisite home decor, botanical plants, artisan pots, decorative vases, luxury wall frames, and memorable festive gifts.";
export const CONTACT_PHONE = "03001005861";
export const CONTACT_PHONE_FORMATTED = "0300 1005861";
export const CONTACT_EMAIL = "contact@afshangiftcentre.com";
export const LOCATION = "Vehari, Pakistan";
export const ADDRESS = "Club Road, Commercial Area, Vehari, Punjab, Pakistan";
export const CURRENCY = "PKR";
export const CURRENCY_SYMBOL = "Rs.";
export const FREE_DELIVERY_THRESHOLD = 10000;

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavDropdownItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Gift Categories",
    href: "/collections",
    children: [
      { label: "Tissue Boxes", href: "/collections/tissue-boxes", description: "Handcrafted mother-of-pearl, velvet & artisan wooden tissue box covers" },
      { label: "Plants", href: "/collections/plants", description: "Lifelike botanical greenery, faux bonsai & everlasting decorative plants" },
      { label: "Pots", href: "/collections/pots", description: "Ceramic, brass & terracotta planters designed for indoor elegance" },
      { label: "Vases", href: "/collections/vases", description: "Fluted glass, porcelain & artistic ceramic decorative vases" },
      { label: "Wall Frames", href: "/collections/wall-frames", description: "Islamic calligraphy, luxury photo frames & gallery wall art" },
      { label: "Plant Holders", href: "/collections/plant-holders-stand", description: "Decorative cage-style & stand plant holders" },
      { label: "3D Photo Frames", href: "/collections/frame-3d", description: "Illuminated 3D light photo frames with reflective finish" },
      { label: "Crystal Jars", href: "/collections/crystal-jar", description: "Decorative crystal globe jars & candy jars with lids" },
    ],
  },
  {
    label: "Decor & Lighting",
    href: "/collections",
    children: [
      { label: "Table Lamps", href: "/collections/table-lamps", description: "Ambient ceramic and brushed brass designer bedside & desk lamps" },
      { label: "Floor Lamps", href: "/collections/floor-lamps", description: "Minimalist ambient floor lamps for warm room corners" },
      { label: "Mirrors", href: "/collections/mirrors", description: "Arched vanity, brass framed & sunburst decorative wall mirrors" },
      { label: "Clocks", href: "/collections/clocks", description: "Silent-sweep luxury vintage & contemporary wall timepieces" },
      { label: "Candle Stands", href: "/collections/candle-stands", description: "Ornate metallic candelabras & modern pillar candle holders" },
      { label: "Scented Candles", href: "/collections/scented-candles", description: "Hand-poured pure soy wax scented candles with oud & jasmine" },
      { label: "Trays & Table Decor", href: "/collections/trays", description: "Serving vanity trays & tabletop decorative centerpieces" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Sale",
    href: "/collections/sale",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const FOOTER_LINKS = {
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Gift Packaging & Curation", href: "/about#curation" },
    { label: "Vehari Gift Showroom", href: "/contact#showroom" },
    { label: "Corporate & Wedding Gifts", href: "/contact" },
  ],
  quickLinks: [
    { label: "Tissue Boxes", href: "/collections/tissue-boxes" },
    { label: "Botanical Plants", href: "/collections/plants" },
    { label: "Ceramic & Brass Pots", href: "/collections/pots" },
    { label: "Artisan Vases", href: "/collections/vases" },
    { label: "Wall Frames & Art", href: "/collections/wall-frames" },
    { label: "Ambient Table Lamps", href: "/collections/table-lamps" },
    { label: "Special Offers & Sale", href: "/collections/sale" },
  ],
  customerService: [
    { label: "Shipping & Delivery Policy", href: "/shipping-policy" },
    { label: "Return & Replacement Policy", href: "/return-policy" },
    { label: "Cash on Delivery Info", href: "/faq" },
    { label: "Gift Packaging & Protection", href: "/faq" },
    { label: "FAQs", href: "/faq" },
  ],
  policy: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "WhatsApp", href: "https://wa.me/923001005861", icon: "whatsapp" },
  { name: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
];
