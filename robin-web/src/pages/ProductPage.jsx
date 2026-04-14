import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Share2, Star, ChevronDown, Eye, Bell, Sparkles, Send, X, Check } from 'lucide-react';
import { findProductBySlug, findProductById, getRelatedProducts, calcSizeRecommendation } from '../data/products';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

/* ── Stars ── */
const Stars = ({ rating, size=14 }) => (
  <span style={{ display:'inline-flex', gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size} fill={i<=Math.round(rating)?'#FDC800':'none'} stroke={i<=Math.round(rating)?'#1C293C':'#9BA8B5'} strokeWidth={1.5}/>
    ))}
  </span>
);

/* ── Accordion ── */
function Accordion({ label, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom:'2px solid var(--border)' }}>
      <button onClick={() => setOpen(o=>!o)}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'14px 0', background:'none', border:'none', cursor:'pointer' }}>
        <span style={{ fontSize:'12px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text)' }}>{label}</span>
        <ChevronDown size={14} style={{ color:'var(--text-muted)', transform:open?'rotate(180deg)':'none', transition:'transform 0.2s', flexShrink:0 }}/>
      </button>
      {open && <div style={{ paddingBottom:'14px', fontSize:'15px', color:'var(--text-2)', lineHeight:1.75 }}>{children}</div>}
    </div>
  );
}

/* ── Scarcity Engine ── */
function ScarcityBadge({ stock, productId }) {
  const [viewers, setViewers] = useState(0);
  useEffect(() => {
    const base = 3 + ((productId||0) % 7);
    setViewers(base);
    const t = setInterval(() => setViewers(v => Math.max(1, v + (Math.random()<0.4?1:0))), 9000);
    return () => clearInterval(t);
  }, [productId]);

  return (
    <div style={{ border:'2px solid var(--border)', background:'var(--surface-2)', padding:'10px 14px', marginBottom:'16px', display:'flex', flexDirection:'column', gap:'6px', boxShadow:'var(--shadow-sm)' }}>
      {viewers > 0 && (
        <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text-2)', display:'flex', alignItems:'center', gap:'6px' }}>
          <Eye size={13} style={{ color:'var(--secondary)' }}/> <strong>{viewers}</strong> people viewing right now
        </p>
      )}
      {stock > 0 && stock <= 5 && (
        <p style={{ fontSize:'13px', fontWeight:900, color:'var(--danger)', display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ width:8, height:8, background:'var(--danger)', display:'inline-block', animation:'pd 1.5s ease-in-out infinite' }}/>
          Only {stock} left in stock
          <style>{`@keyframes pd{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}`}</style>
        </p>
      )}
    </div>
  );
}

/* ── Waitlist Button ── */
function WaitlistButton({ productId, selectedSize }) {
  const [email,   setEmail]   = useState('');
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.joinWaitlist({ productId, email, sizeWanted: selectedSize||undefined });
      setDone(true);
    } catch {
      const key = `wl_${productId}`;
      const existing = JSON.parse(localStorage.getItem(key)||'[]');
      localStorage.setItem(key, JSON.stringify([...existing, { email, size: selectedSize, ts: Date.now() }]));
      setDone(true);
    } finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ padding:'12px 16px', background:'#D1FAE5', border:'2px solid var(--border)', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', fontWeight:700, color:'#065F46', boxShadow:'var(--shadow-sm)' }}>
      <Check size={16}/> You're on the list! We'll notify you when it's back.
    </div>
  );

  return (
    <div style={{ marginBottom:'12px' }}>
      <button onClick={() => setOpen(o=>!o)}
        className="btn btn-outline" style={{ width:'100%', justifyContent:'center', fontSize:'13px', padding:'12px' }}>
        <Bell size={14}/> Notify Me When Back
      </button>
      {open && (
        <form onSubmit={submit} style={{ marginTop:'10px', display:'flex', flexDirection:'column', gap:'8px', padding:'14px', border:'2px solid var(--border)', background:'var(--surface-2)', boxShadow:'var(--shadow-sm)' }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="your@email.com"
            style={{ background:'var(--surface)', border:'2px solid var(--border)', padding:'10px 12px', fontSize:'14px', outline:'none', color:'var(--text)', fontFamily:'var(--font-body)' }}/>
          <button type="submit" className="btn btn-dark" disabled={loading} style={{ justifyContent:'center', fontSize:'12px' }}>
            {loading?'Joining…':'Join Waitlist'}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── AI Size Advisor (client-side) ── */
function SizeAdvisor({ product }) {
  const [open,    setOpen]    = useState(false);
  const [height,  setHeight]  = useState('');
  const [weight,  setWeight]  = useState('');
  const [fit,     setFit]     = useState('regular');
  const [result,  setResult]  = useState('');
  const [loading, setLoading] = useState(false);

  const calculate = (e) => {
    e.preventDefault(); setLoading(true); setResult('');
    setTimeout(() => {
      const sizes = product?.sizesJson ? JSON.parse(product.sizesJson) : [];
      const rec = calcSizeRecommendation(height, weight, fit, sizes);
      setResult(rec || 'Please check the size guide for this product.');
      setLoading(false);
    }, 500);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ display:'flex', alignItems:'center', gap:'5px', background:'none', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:700, color:'var(--secondary)', textDecoration:'underline', textDecorationColor:'var(--secondary)', padding:'4px 0', letterSpacing:'0.02em' }}>
      <Sparkles size={13}/> AI Size Recommendation
    </button>
  );

  return (
    <div style={{ padding:'14px', background:'var(--surface-2)', border:'2px solid var(--border)', marginBottom:'14px', boxShadow:'var(--shadow-sm)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'5px', color:'var(--text)' }}>
          <Sparkles size={12} style={{ color:'var(--secondary)' }}/> AI Size Advisor
        </span>
        <button onClick={() => { setOpen(false); setResult(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
          <X size={14}/>
        </button>
      </div>
      <form onSubmit={calculate} style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
          <input value={height} onChange={e=>setHeight(e.target.value)} placeholder="Height (cm)" type="number" required min="50" max="250"
            style={{ background:'var(--surface)', border:'2px solid var(--border)', padding:'9px 10px', fontSize:'13px', outline:'none', color:'var(--text)', fontFamily:'var(--font-mono)' }}/>
          <input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Weight (kg)" type="number" required min="10" max="300"
            style={{ background:'var(--surface)', border:'2px solid var(--border)', padding:'9px 10px', fontSize:'13px', outline:'none', color:'var(--text)', fontFamily:'var(--font-mono)' }}/>
          <select value={fit} onChange={e=>setFit(e.target.value)}
            style={{ background:'var(--surface)', border:'2px solid var(--border)', padding:'9px 10px', fontSize:'13px', color:'var(--text)', outline:'none', fontFamily:'var(--font-body)' }}>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="oversized">Oversized</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="btn btn-secondary" style={{ justifyContent:'center', fontSize:'12px', padding:'10px' }}>
          <Send size={12}/> {loading?'Calculating…':'Get My Size'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop:'10px', padding:'10px 12px', background:'var(--primary)', border:'2px solid var(--border)', fontSize:'14px', fontWeight:700, color:'var(--text)' }}>
          {result}
        </div>
      )}
    </div>
  );
}

/* ── Reviews ── */
function ReviewsSection({ productId, avgRating=0, reviewCount=0 }) {
  const { user } = useAuth();
  const [reviews,    setReviews]    = useState([]);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(reviewCount);
  const [writing,    setWriting]    = useState(false);
  const [form,       setForm]       = useState({ rating:5, title:'', body:'', sizePurchased:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    if (!productId) return;
    api.getReviews(productId, page).then(d => { setReviews(d.items||[]); setTotal(d.total||0); }).catch(()=>{});
  }, [productId, page]);

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.createReview(productId, form);
      setSubmitted(true); setWriting(false);
      api.getReviews(productId,1).then(d => setReviews(d.items||[]));
    } catch(err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'2px solid var(--border)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem', paddingBottom:'1.5rem', borderBottom:'2px solid var(--border)' }}>
        <div>
          <h3 style={{ fontSize:'21px', marginBottom:'8px' }}>Customer Reviews</h3>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <Stars rating={avgRating}/>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'20px', fontWeight:700, color:'var(--text)' }}>{Number(avgRating).toFixed(1)}</span>
            <span style={{ fontSize:'13px', color:'var(--text-muted)', fontWeight:600 }}>({reviewCount} {reviewCount===1?'review':'reviews'})</span>
          </div>
        </div>
        {user && !submitted && (
          <button onClick={() => setWriting(o=>!o)} className="btn btn-outline" style={{ fontSize:'12px' }}>
            Write a Review
          </button>
        )}
      </div>

      {writing && (
        <form onSubmit={submit} style={{ border:'2px solid var(--border)', padding:'20px', marginBottom:'24px', background:'var(--surface-2)', boxShadow:'var(--shadow)' }}>
          <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px' }}>Your Rating</p>
          <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f=>({...f,rating:n}))}
                style={{ background:'none', border:'none', cursor:'pointer', padding:'3px' }}>
                <Star size={22} fill={n<=form.rating?'#FDC800':'none'} stroke={n<=form.rating?'#1C293C':'#9BA8B5'} strokeWidth={1.5}/>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <div className="field"><label>Review Title</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Sum it up…"/></div>
            <div className="field"><label>Your Review</label><textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} rows={3} placeholder="What did you think?" style={{ resize:'vertical' }}/></div>
            <div className="field"><label>Size Purchased</label><input value={form.sizePurchased} onChange={e=>setForm(f=>({...f,sizePurchased:e.target.value}))} placeholder="e.g. M"/></div>
          </div>
          <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'14px' }}>
            <button type="button" onClick={() => setWriting(false)} className="btn btn-outline" style={{ fontSize:'12px' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ fontSize:'12px' }}>
              {submitting?'Posting…':'Post Review'}
            </button>
          </div>
        </form>
      )}

      {submitted && <div style={{ padding:'12px 16px', background:'#D1FAE5', border:'2px solid var(--border)', fontSize:'14px', fontWeight:700, color:'#065F46', marginBottom:'20px' }}>✓ Review submitted. Thank you!</div>}

      {reviews.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ paddingBottom:'16px', borderBottom:'1px solid var(--surface-3)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <Stars rating={r.rating} size={13}/>
                  {r.verified && <span className="badge badge-green" style={{ fontSize:'10px' }}>Verified</span>}
                </div>
                <span style={{ fontSize:'12px', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
                  {r.author} · {new Date(r.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                </span>
              </div>
              {r.title && <p style={{ fontWeight:700, fontSize:'15px', marginBottom:'4px', color:'var(--text)' }}>{r.title}</p>}
              {r.body  && <p style={{ fontSize:'14px', color:'var(--text-2)', lineHeight:1.7 }}>{r.body}</p>}
              {r.sizePurchased && <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'4px', fontFamily:'var(--font-mono)' }}>Size: {r.sizePurchased}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding:'3rem', border:'2px solid var(--border)', background:'var(--surface-2)', textAlign:'center' }}>
          <p style={{ fontSize:'15px', fontWeight:700, color:'var(--text-muted)' }}>No reviews yet. Be the first to share your thoughts.</p>
        </div>
      )}

      {total > 5 && (
        <div style={{ display:'flex', gap:'8px', marginTop:'24px' }}>
          {Array(Math.ceil(total/5)).fill(null).map((_,i) => (
            <button key={i} onClick={() => setPage(i+1)}
              style={{ width:36, height:36, border:'2px solid var(--border)', cursor:'pointer', fontSize:'13px', fontWeight:900, background:page===i+1?'var(--text)':'var(--surface)', color:page===i+1?'var(--surface)':'var(--text)', fontFamily:'var(--font-mono)' }}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════
   MAIN PRODUCT PAGE
═══════════════════════ */
export default function ProductPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [mainImg,  setMainImg]  = useState('');
  const [imgErr,   setImgErr]   = useState(false);
  const [qty,      setQty]      = useState(1);
  const [size,     setSize]     = useState('');
  const [adding,   setAdding]   = useState(false);
  const [copied,   setCopied]   = useState(false);
  const { addItem } = useCart();
  const { user }    = useAuth();

  useEffect(() => {
    window.scrollTo({ top:0, behavior:'instant' });
    const isNum = !isNaN(id);
    const staticP = isNum ? findProductById(id) : findProductBySlug(id);
    if (staticP) { setProduct(staticP); setMainImg(staticP.imageUrl||''); setRelated(getRelatedProducts(staticP)); }
    const fetchLive = isNum ? api.getProduct(id) : api.getBySlug(id);
    fetchLive.then(liveP => {
      if (liveP) setProduct(prev => ({ ...prev, ...liveP, imageUrl: liveP.imageUrl||prev?.imageUrl }));
    }).catch(() => {});
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/auth'); return; }
    setAdding(true);
    await addItem(product.id, qty);
    setTimeout(() => setAdding(false), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  };

  const getImages = () => {
    if (!product) return [];
    try {
      const arr = product.imageUrlsJson ? JSON.parse(product.imageUrlsJson) : [];
      const imgs = arr.filter(Boolean);
      return imgs.length === 0 && product.imageUrl ? [product.imageUrl] : imgs;
    } catch { return product.imageUrl ? [product.imageUrl] : []; }
  };

  const sizes   = product?.sizesJson ? JSON.parse(product.sizesJson) : [];
  const sold    = product && (!product.isAvailable || product.stockQuantity === 0);
  const hasDisc = product?.discountPrice && product.discountPrice < product.price;
  const images  = getImages();
  const currImg = (!imgErr && mainImg) ? mainImg : null;

  /* Loading skeleton */
  if (!product) return (
    <div className="container" style={{ padding:'3rem 0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem' }}>
        <div className="skeleton" style={{ aspectRatio:'3/4' }}/>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', paddingTop:'2rem' }}>
          <div className="skeleton" style={{ height:14, width:'30%' }}/>
          <div className="skeleton" style={{ height:48, width:'80%' }}/>
          <div className="skeleton" style={{ height:24, width:'25%' }}/>
        </div>
      </div>
    </div>
  );

  return (
    <main className="page-fade">
      <div className="container" style={{ paddingTop:'24px', paddingBottom:'5rem' }}>

        {/* Breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'24px', fontSize:'13px', fontWeight:600, flexWrap:'wrap' }}>
          <Link to="/" style={{ color:'var(--text-muted)', textDecoration:'none' }}>Home</Link>
          <span style={{ color:'var(--text-muted)' }}>/</span>
          <Link to="/shop" style={{ color:'var(--text-muted)', textDecoration:'none' }}>Shop</Link>
          {product.gender && <>
            <span style={{ color:'var(--text-muted)' }}>/</span>
            <Link to={`/shop?gender=${product.gender}`} style={{ color:'var(--text-muted)', textDecoration:'none' }}>{product.gender}</Link>
          </>}
          <span style={{ color:'var(--text-muted)' }}>/</span>
          <span style={{ color:'var(--text)', fontWeight:700 }}>{product.name}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(2rem,5vw,4rem)', alignItems:'start' }}>

          {/* Zone A — Images */}
          <div>
            <div style={{ aspectRatio:'3/4', overflow:'hidden', border:'2px solid var(--border)', background:'var(--surface-2)', marginBottom:'10px', position:'relative', boxShadow:'var(--shadow)' }}>
              {currImg ? (
                <img src={currImg} alt={product.name} onError={() => setImgErr(true)}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : (
                <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', background: 'var(--surface-2)' }}>
                  <span style={{ fontWeight:900, fontSize:'1.5rem', color:'rgba(28,41,60,0.15)', textAlign:'center', textTransform:'uppercase' }}>{product.name}</span>
                </div>
              )}
              {sold && (
                <div style={{ position:'absolute', top:'12px', left:'12px' }}>
                  <span className="badge badge-dark" style={{ fontSize:'12px', padding:'5px 10px' }}>Sold Out</span>
                </div>
              )}
              {product.isTrending && !sold && (
                <div style={{ position:'absolute', top:'12px', right:'12px' }}>
                  <span className="badge badge-yellow" style={{ fontSize:'12px', padding:'5px 10px' }}>New In</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(images.length,4)},1fr)`, gap:'10px' }}>
                {images.slice(0,4).map((img,i) => (
                  <ThumbBtn key={i} src={img} alt={`${product.name} ${i+1}`} active={mainImg===img} onClick={() => { setMainImg(img); setImgErr(false); }}/>
                ))}
              </div>
            )}
          </div>

          {/* Zone B+C */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h)+1.5rem)' }}>
            {/* Category tag */}
            {product.category && (
              <div style={{ marginBottom:'10px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                <span className="badge badge-outline" style={{ fontSize:'11px' }}>{product.category.name}</span>
                {product.gender && <span className="badge badge-outline" style={{ fontSize:'11px' }}>{product.gender}</span>}
              </div>
            )}

            <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.4rem)', marginBottom:'12px', lineHeight:1.1 }}>{product.name}</h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                <Stars rating={product.avgRating} size={14}/>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'15px', fontWeight:700 }}>{Number(product.avgRating).toFixed(1)}</span>
                <span style={{ fontSize:'13px', color:'var(--text-muted)', fontWeight:600 }}>({product.reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px', padding:'14px', border:'2px solid var(--border)', background:'var(--surface-2)', boxShadow:'var(--shadow-sm)' }}>
              {hasDisc ? (
                <>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'1.8rem', fontWeight:900, color:'var(--danger)' }}>{product.discountPrice.toLocaleString()} EGP</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'1.1rem', color:'var(--text-muted)', textDecoration:'line-through' }}>{product.price.toLocaleString()} EGP</span>
                  <span className="badge badge-red" style={{ marginLeft:'auto' }}>Sale</span>
                </>
              ) : (
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'1.8rem', fontWeight:900 }}>{product.price.toLocaleString()} EGP</span>
              )}
            </div>

            {/* Scarcity */}
            {!sold && <ScarcityBadge stock={product.stockQuantity} productId={product.id}/>}

            {/* Size picker */}
            {sizes.length > 0 && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize:'12px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    Size {size && <span style={{ color:'var(--secondary)' }}>— {size}</span>}
                  </span>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--secondary)', cursor:'pointer', textDecoration:'underline' }}>Size Guide</span>
                </div>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      style={{ padding:'8px 14px', border:`2px solid ${size===s?'var(--text)':'var(--border)'}`, background: size===s?'var(--text)':'var(--surface)', color: size===s?'var(--surface)':'var(--text)', fontSize:'14px', fontWeight:900, cursor:'pointer', transition:'all 0.1s', boxShadow: size===s?'var(--shadow-sm)':'none', minWidth:44, fontFamily:'var(--font-mono)', transform: size===s?'translate(-1px,-1px)':'none' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Advisor */}
            {sizes.length > 0 && <SizeAdvisor product={product}/>}

            {/* Qty */}
            {!sold && (
              <div style={{ marginBottom:'16px' }}>
                <span style={{ fontSize:'12px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', display:'block', marginBottom:'8px' }}>Quantity</span>
                <div style={{ display:'inline-flex', alignItems:'center', border:'2px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
                  <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ padding:'10px 12px', background:'none', border:'none', cursor:'pointer', color:'var(--text)', display:'flex' }}><Minus size={12}/></button>
                  <span style={{ padding:'10px 16px', fontWeight:900, minWidth:44, textAlign:'center', fontFamily:'var(--font-mono)', borderLeft:'2px solid var(--border)', borderRight:'2px solid var(--border)' }}>{qty}</span>
                  <button onClick={() => setQty(q=>Math.min(product.stockQuantity||10,q+1))} style={{ padding:'10px 12px', background:'none', border:'none', cursor:'pointer', color:'var(--text)', display:'flex' }}><Plus size={12}/></button>
                </div>
              </div>
            )}

            {/* CTA */}
            {sold ? (
              <WaitlistButton productId={product.id} selectedSize={size}/>
            ) : (
              <button onClick={handleAdd} className="btn btn-primary"
                style={{ width:'100%', justifyContent:'center', fontSize:'14px', padding:'14px', marginBottom:'10px',
                  background: adding ? '#16A34A' : 'var(--primary)',
                  borderColor: adding ? '#16A34A' : 'var(--border)',
                  transition:'none'
                }}>
                <ShoppingBag size={16}/>
                {adding ? 'Added to Bag ✓' : 'Add to Bag'}
              </button>
            )}

            <button onClick={handleShare}
              style={{ display:'flex', alignItems:'center', gap:'5px', background:'none', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 0' }}>
              <Share2 size={12}/> {copied ? 'Link Copied ✓' : 'Share'}
            </button>

            {/* Zone C — Accordions */}
            <div style={{ marginTop:'20px' }}>
              <Accordion label="About This Piece" defaultOpen={true}>
                <p>{product.description}</p>
                {product.fitNotes && <p style={{ marginTop:'8px', fontWeight:700, color:'var(--text)' }}>Fit: {product.fitNotes}</p>}
              </Accordion>
              <Accordion label="Materials & Care">
                <p>{product.materials || 'Please refer to the care label inside the garment.'}</p>
                <ul style={{ marginTop:'8px', paddingLeft:'1rem', display:'flex', flexDirection:'column', gap:'4px', fontSize:'14px', color:'var(--text-muted)' }}>
                  {['Machine wash cold, gentle cycle','Do not tumble dry','Iron on low heat if needed','Do not bleach'].map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="Delivery & Shipping">
                <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'14px' }}>
                  {[['Standard (3–5 days)','80 EGP · Free over 2,000 EGP'],['Express (1–2 days)','150 EGP'],['Cairo Pickup','Free — Robin Studio, Downtown'],['UK Delivery','5–7 business days']].map(([l,i]) => (
                    <div key={l} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                      <span style={{ fontWeight:700, minWidth:140, flexShrink:0 }}>{l}</span>
                      <span style={{ color:'var(--text-muted)' }}>{i}</span>
                    </div>
                  ))}
                </div>
              </Accordion>
              <Accordion label="Returns">
                <p>Returns accepted within 14 days for unworn items with original tags. Sale items are final. Email <span style={{ color:'var(--secondary)', fontWeight:700 }}>returns@robin.store</span></p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Zone D — Reviews */}
        <ReviewsSection productId={product.id} avgRating={product.avgRating} reviewCount={product.reviewCount}/>

        {/* Zone D — Related */}
        {related.length > 0 && (
          <div style={{ marginTop:'3.5rem', paddingTop:'2rem', borderTop:'2px solid var(--border)' }}>
            <h3 style={{ fontSize:'21px', marginBottom:'24px' }}>You Might Also Like</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
              {related.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        )}
      </div>

      <style>{`@media(max-width:768px){
        main > div > div:nth-child(2){ grid-template-columns:1fr!important; }
        main > div > div:nth-child(2) > div:last-child{ position:relative!important; top:0!important; }
      }`}</style>
    </main>
  );
}

function ThumbBtn({ src, alt, active, onClick }) {
  const [err, setErr] = useState(false);
  if (err) return null;
  return (
    <div onClick={onClick}
      style={{ aspectRatio:'3/4', overflow:'hidden', cursor:'pointer', border:`2px solid ${active?'var(--text)':'var(--border)'}`, background:'var(--surface-2)', transition:'border-color 0.1s', boxShadow: active ? 'var(--shadow-sm)' : 'none' }}>
      <img src={src} alt={alt} onError={() => setErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
    </div>
  );
}
