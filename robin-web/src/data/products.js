// ═══════════════════════════════════════════════════════
//  ROBIN — Static Product Catalog
//  Source of truth when the backend API is unavailable.
// ═══════════════════════════════════════════════════════

export const ALL_PRODUCTS = [
  // ════════ MEN ════════
  { id:1, name:"The Worker's Tracksuit", slug:'the-workers-tracksuit', description:'Precision utility tracksuit. Waterproof shell, contrast piping, oversized cut, reflective shoulders.', materials:'100% recycled polyester shell', fitNotes:'Oversized — size down for a regular fit', price:2000, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"]', sizesJson:'["XS","S","M","L","XL"]', colorTags:'black', gender:'Men', season:'Winter', subCategory:'Tracksuit', ageGroup:null, isTrending:true, isFeatured:true, isAvailable:true, stockQuantity:5, category:{id:1,name:'Tracksuit'}, avgRating:4.8, reviewCount:12 },
  { id:2, name:'Predator Knit Crewneck', slug:'predator-knit-crewneck', description:'Off-white jacquard knit with bold predator graphic. 100% merino wool. Ribbed cuffs and hem.', materials:'100% merino wool', fitNotes:'True to size', price:1200, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'white,cream', gender:'Unisex', season:'Winter', subCategory:'Sweatshirt', ageGroup:null, isTrending:false, isAvailable:false, stockQuantity:0, category:{id:2,name:'Tops'}, avgRating:4.6, reviewCount:8 },
  { id:3, name:'Weeping Knit Crewneck', slug:'weeping-knit-crewneck', description:'Tan intarsia knit with a weeping figure portrait. Boxy silhouette, dropped shoulder.', materials:'80% cotton 20% acrylic', fitNotes:'Boxy — true to size', price:1200, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'tan,beige', gender:'Unisex', season:'Winter', subCategory:'Sweatshirt', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:3, category:{id:2,name:'Tops'}, avgRating:4.5, reviewCount:6 },
  { id:4, name:'Prey Knit Crewneck', slug:'prey-knit-crewneck', description:'White crewneck with lion illustration. Heavyweight cotton blend.', materials:'80% cotton 20% acrylic', fitNotes:'Relaxed fit', price:1200, discountPrice:900, imageUrl:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80"]', sizesJson:'["S","M","L"]', colorTags:'white', gender:'Women', season:'Winter', subCategory:'Sweatshirt', ageGroup:null, isTrending:false, isAvailable:false, stockQuantity:0, category:{id:2,name:'Tops'}, avgRating:4.7, reviewCount:14 },
  { id:5, name:'Crab Crewneck', slug:'crab-crewneck', description:'Black crewneck with a large red crab embroidery across the chest. Limited run.', materials:'100% heavyweight cotton', fitNotes:'True to size', price:1200, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1614093302611-8efc4c3b0d85?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1614093302611-8efc4c3b0d85?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'black,red', gender:'Men', season:'AllSeason', subCategory:'Sweatshirt', ageGroup:null, isTrending:false, isAvailable:false, stockQuantity:0, category:{id:2,name:'Tops'}, avgRating:0, reviewCount:0 },
  { id:6, name:'Robin Shell Jacket', slug:'robin-shell-jacket', description:'Lightweight packable jacket in olive. Taped seams, inner mesh lining, half-zip collar. Perfect for layering.', materials:'100% nylon shell', fitNotes:'Regular fit', price:2500, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=900&q=80"]', sizesJson:'["XS","S","M","L","XL"]', colorTags:'olive,green', gender:'Men', season:'Winter', subCategory:'Outerwear', ageGroup:null, isTrending:true, isFeatured:true, isAvailable:true, stockQuantity:2, category:{id:4,name:'Outerwear'}, avgRating:4.9, reviewCount:5 },
  { id:7, name:'Utility Cargo Pants', slug:'utility-cargo-pants', description:'Heavy cotton cargo trousers with six pockets, contrast stitching, relaxed fit.', materials:'100% cotton canvas', fitNotes:'Relaxed — true to size', price:1500, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80"]', sizesJson:'["S","M","L","XL","XXL"]', colorTags:'black,olive', gender:'Men', season:'AllSeason', subCategory:'Trousers', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:4, category:{id:3,name:'Bottoms'}, avgRating:4.3, reviewCount:9 },
  { id:8, name:'Heavy Fleece Hoodie', slug:'heavy-fleece-hoodie-men', description:'400gsm fleece hoodie with embroidered Robin logo on chest. Kangaroo pocket, oversized hood.', materials:'100% cotton fleece 400gsm', fitNotes:'Oversized', price:1400, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'black', gender:'Men', season:'Winter', subCategory:'Hoodie', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:8, category:{id:2,name:'Tops'}, avgRating:4.7, reviewCount:22 },
  { id:9, name:'Essential Oxford Shirt', slug:'essential-oxford-shirt-men', description:'Classic Oxford weave with button-down collar. Easy care. Slim fit.', materials:'100% cotton Oxford', fitNotes:'Slim fit — size up for relaxed', price:900, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'white,blue', gender:'Men', season:'AllSeason', subCategory:'Shirt', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:10, category:{id:2,name:'Tops'}, avgRating:4.2, reviewCount:7 },
  { id:10, name:'Graphic Tee — Eye', slug:'graphic-tee-eye-men', description:'Heavyweight 200gsm tee with screen-print eye graphic. Pre-washed cotton.', materials:'100% cotton 200gsm pre-washed', fitNotes:'Boxy oversized', price:700, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=900&q=80"]', sizesJson:'["XS","S","M","L","XL","XXL"]', colorTags:'white,black', gender:'Men', season:'Summer', subCategory:'T-Shirt', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:15, category:{id:2,name:'Tops'}, avgRating:4.4, reviewCount:18 },

  // ════════ WOMEN ════════
  { id:11, name:'Studio Hoodie', slug:'studio-hoodie-women', description:'Cropped fit hoodie with wide tunnel hood and thumbhole cuffs. Side split hem.', materials:'100% French terry cotton', fitNotes:'Cropped — true to size', price:1150, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'grey,black', gender:'Women', season:'AllSeason', subCategory:'Hoodie', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:7, category:{id:2,name:'Tops'}, avgRating:4.8, reviewCount:16 },
  { id:12, name:'Oversized Flannel Shirt', slug:'flannel-shirt-women', description:'Oversized flannel in classic check. Dropped shoulders, side pockets.', materials:'100% brushed flannel cotton', fitNotes:'Oversized', price:950, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'red,blue,check', gender:'Women', season:'Winter', subCategory:'Shirt', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:9, category:{id:2,name:'Tops'}, avgRating:4.3, reviewCount:11 },
  { id:13, name:'Rib Knit Midi Dress', slug:'rib-knit-midi-dress', description:'Fitted ribbed knit dress with high neck and side split. Elegant and minimal.', materials:'95% viscose 5% elastane', fitNotes:'Fitted — true to size', price:1350, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'black', gender:'Women', season:'AllSeason', subCategory:'Dress', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:5, category:{id:2,name:'Tops'}, avgRating:4.9, reviewCount:24 },
  { id:14, name:'Wide Leg Linen Pants', slug:'wide-leg-linen-women', description:'High-waist wide-leg linen trousers. Relaxed and effortless.', materials:'100% linen', fitNotes:'High waist — true to size', price:1100, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'white,cream,beige', gender:'Women', season:'Summer', subCategory:'Trousers', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:6, category:{id:3,name:'Bottoms'}, avgRating:4.6, reviewCount:13 },
  { id:15, name:'Quilted Puffer Jacket', slug:'quilted-puffer-women', description:'Lightweight quilted puffer with funnel neck and interior pockets.', materials:'100% recycled polyester fill', fitNotes:'Relaxed — true to size', price:2200, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1539533018257-0fb6dc7f3d4f?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1539533018257-0fb6dc7f3d4f?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'black,grey', gender:'Women', season:'Winter', subCategory:'Outerwear', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:4, category:{id:4,name:'Outerwear'}, avgRating:4.7, reviewCount:9 },
  { id:16, name:'Boxy Graphic Tee', slug:'boxy-graphic-tee-women', description:'Boxy-cut heavyweight tee with abstract print. Pre-washed.', materials:'100% cotton 200gsm', fitNotes:'Boxy oversized', price:700, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80"]', sizesJson:'["XS","S","M","L","XL"]', colorTags:'white,black', gender:'Women', season:'Summer', subCategory:'T-Shirt', ageGroup:null, isTrending:true, isAvailable:true, stockQuantity:14, category:{id:2,name:'Tops'}, avgRating:4.4, reviewCount:19 },
  { id:17, name:'Merino Turtleneck', slug:'merino-turtleneck-women', description:'Ultra-soft merino turtleneck. Machine washable. Essential layering piece.', materials:'100% fine merino wool', fitNotes:'Slim fit', price:1050, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1487222444777-5b9eed4a32af?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1487222444777-5b9eed4a32af?w=900&q=80"]', sizesJson:'["XS","S","M","L"]', colorTags:'cream,white,camel', gender:'Women', season:'Winter', subCategory:'Sweatshirt', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:8, category:{id:2,name:'Tops'}, avgRating:4.8, reviewCount:31 },
  { id:18, name:'Linen Summer Trousers', slug:'linen-summer-trousers-men', description:'Wide-leg linen trousers with elastic waistband and side pockets.', materials:'100% linen', fitNotes:'Wide leg — true to size', price:1100, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=900&q=80"]', sizesJson:'["S","M","L","XL"]', colorTags:'beige,white', gender:'Men', season:'Summer', subCategory:'Trousers', ageGroup:null, isTrending:false, isAvailable:true, stockQuantity:6, category:{id:3,name:'Bottoms'}, avgRating:4.1, reviewCount:4 },

  // ════════ KIDS — BOYS ════════
  { id:19, name:"Boys' Graphic Hoodie", slug:'boys-graphic-hoodie', description:'Soft fleece hoodie with Robin bird graphic. Kangaroo pocket.', materials:'100% cotton fleece', fitNotes:'Regular fit', price:650, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'black,grey', gender:'Boys', season:'Winter', subCategory:'Hoodie', ageGroup:'2-13Y', isTrending:true, isAvailable:true, stockQuantity:12, category:{id:2,name:'Tops'}, avgRating:4.6, reviewCount:8 },
  { id:20, name:"Boys' Cargo Shorts", slug:'boys-cargo-shorts', description:'Cotton cargo shorts with six pockets. Adjustable waistband.', materials:'100% cotton twill', fitNotes:'Regular fit', price:550, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'khaki,olive', gender:'Boys', season:'Summer', subCategory:'Shorts', ageGroup:'2-13Y', isTrending:false, isAvailable:true, stockQuantity:15, category:{id:3,name:'Bottoms'}, avgRating:4.3, reviewCount:5 },
  { id:21, name:"Boys' Print T-Shirt", slug:'boys-print-tee', description:'Bold screen-print tee in heavyweight cotton. Easy care.', materials:'100% cotton', fitNotes:'Regular fit', price:400, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1565299715199-866c917206bb?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'white,blue', gender:'Boys', season:'Summer', subCategory:'T-Shirt', ageGroup:'2-13Y', isTrending:true, isAvailable:true, stockQuantity:20, category:{id:2,name:'Tops'}, avgRating:4.5, reviewCount:11 },
  { id:22, name:"Boys' Winter Puffer", slug:'boys-winter-puffer', description:'Lightweight water-resistant puffer with hood. Packable.', materials:'100% recycled polyester', fitNotes:'Regular fit — size up for growth room', price:950, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'black,navy', gender:'Boys', season:'Winter', subCategory:'Outerwear', ageGroup:'2-13Y', isTrending:false, isAvailable:true, stockQuantity:8, category:{id:4,name:'Outerwear'}, avgRating:4.7, reviewCount:6 },

  // ════════ KIDS — GIRLS ════════
  { id:23, name:"Girls' Floral Sweatshirt", slug:'girls-floral-sweatshirt', description:'Soft sweatshirt with embroidered floral graphic. Relaxed fit.', materials:'100% cotton fleece', fitNotes:'Relaxed fit', price:650, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'pink,white', gender:'Girls', season:'Winter', subCategory:'Sweatshirt', ageGroup:'2-13Y', isTrending:true, isAvailable:true, stockQuantity:10, category:{id:2,name:'Tops'}, avgRating:4.9, reviewCount:14 },
  { id:24, name:"Girls' Pastel Tee", slug:'girls-pastel-tee', description:"Soft pastel tee with hand-drawn Robin bird print. Pre-washed.", materials:'100% cotton', fitNotes:'Regular fit', price:400, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'pink,lavender,mint', gender:'Girls', season:'Summer', subCategory:'T-Shirt', ageGroup:'2-13Y', isTrending:false, isAvailable:true, stockQuantity:18, category:{id:2,name:'Tops'}, avgRating:4.5, reviewCount:9 },
  { id:25, name:"Girls' Winter Coat", slug:'girls-winter-coat', description:"Wool-blend coat with oversized buttons and a hood.", materials:'70% wool 30% polyester', fitNotes:'Regular fit — size up for growth room', price:1200, discountPrice:null, imageUrl:'https://images.unsplash.com/photo-1512327428051-2be7a19a5d96?w=900&q=80', imageUrlsJson:'["https://images.unsplash.com/photo-1512327428051-2be7a19a5d96?w=900&q=80"]', sizesJson:'["2-4Y","5-7Y","8-10Y","11-13Y"]', colorTags:'camel,brown', gender:'Girls', season:'Winter', subCategory:'Outerwear', ageGroup:'2-13Y', isTrending:false, isAvailable:true, stockQuantity:7, category:{id:4,name:'Outerwear'}, avgRating:4.8, reviewCount:12 },
];

export const findProductBySlug = (slug) => ALL_PRODUCTS.find(p => p.slug === slug) || null;
export const findProductById   = (id)   => ALL_PRODUCTS.find(p => p.id === parseInt(id,10)) || null;
export const getTrendingProducts = ()    => ALL_PRODUCTS.filter(p => p.isTrending);

export function getRelatedProducts(product) {
  return ALL_PRODUCTS.filter(p =>
    p.id !== product.id && p.category?.name === product.category?.name && p.isAvailable
  ).slice(0, 4);
}

export function filterProducts(params = {}) {
  let r = [...ALL_PRODUCTS];

  if (params.gender) {
    if (params.gender === 'Kids') r = r.filter(p => p.gender === 'Boys' || p.gender === 'Girls');
    else r = r.filter(p => p.gender === params.gender);
  }
  if (params.season && params.season !== 'AllSeason')
    r = r.filter(p => p.season === params.season || p.season === 'AllSeason');
  if (params.subCategory)
    r = r.filter(p => p.subCategory?.toLowerCase() === params.subCategory.toLowerCase());
  if (params.ageGroup)
    r = r.filter(p => p.ageGroup === params.ageGroup);
  if (params.available === true || params.available === 'true')
    r = r.filter(p => p.isAvailable && p.stockQuantity > 0);
  if (params.trending === true || params.trending === 'true')
    r = r.filter(p => p.isTrending);
  if (params.minPrice) r = r.filter(p => (p.discountPrice||p.price) >= parseFloat(params.minPrice));
  if (params.maxPrice) r = r.filter(p => (p.discountPrice||p.price) <= parseFloat(params.maxPrice));
  if (params.size) r = r.filter(p => { try { return JSON.parse(p.sizesJson||'[]').includes(params.size); } catch { return false; } });

  switch (params.sort) {
    case 'price-asc':  r.sort((a,b) => (a.discountPrice||a.price)-(b.discountPrice||b.price)); break;
    case 'price-desc': r.sort((a,b) => (b.discountPrice||b.price)-(a.discountPrice||a.price)); break;
    case 'name':       r.sort((a,b) => a.name.localeCompare(b.name)); break;
    default:           r.sort((a,b) => (b.isTrending?1:0)-(a.isTrending?1:0));
  }
  return r;
}

export function calcSizeRecommendation(heightCm, weightKg, fitPref, sizesAvailable) {
  const h = parseFloat(heightCm), w = parseFloat(weightKg);
  if (!h || !w || isNaN(h) || isNaN(w)) return null;

  // Kids sizes
  if (sizesAvailable.some(s => /^\d/.test(s))) {
    const kt = [{l:'2-4Y',maxH:110},{l:'5-7Y',maxH:128},{l:'8-10Y',maxH:142},{l:'11-13Y',maxH:158}];
    const ks = kt.find(s => h <= s.maxH) || kt[kt.length-1];
    return `We recommend size ${ks.l} based on a height of ${h}cm.`;
  }

  const table = [
    {label:'XS',maxW:52,maxH:163},{label:'S',maxW:62,maxH:170},{label:'M',maxW:75,maxH:178},
    {label:'L',maxW:88,maxH:186},{label:'XL',maxW:103,maxH:194},{label:'XXL',maxW:Infinity,maxH:Infinity},
  ];
  let idx = table.findIndex(s => w <= s.maxW);
  if (idx === -1) idx = table.length - 1;
  if (h > table[idx].maxH && idx < table.length-1) idx++;
  if (fitPref === 'slim')      idx = Math.max(0, idx-1);
  if (fitPref === 'oversized') idx = Math.min(table.length-1, idx+1);

  const rec = table[idx].label;
  const allS = ['XS','S','M','L','XL','XXL'];
  const fitDesc = fitPref==='slim'?'a tailored fit':fitPref==='oversized'?'an oversized fit':'a regular fit';

  if (sizesAvailable.includes(rec))
    return `We recommend size ${rec} for ${fitDesc} based on your measurements (${h}cm / ${w}kg).`;

  const closest = sizesAvailable.reduce((best,s) => {
    const bd = Math.abs(allS.indexOf(best)-allS.indexOf(rec));
    const sd = Math.abs(allS.indexOf(s)-allS.indexOf(rec));
    return sd < bd ? s : best;
  }, sizesAvailable[0]||rec);

  return `${rec} would be ideal, but it's not available — we recommend ${closest} as the closest option.`;
}
