import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getTrendingProducts } from '../data/products';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState(getTrendingProducts());
  const [email,    setEmail]    = useState('');
  const [subMsg,   setSubMsg]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getTrending().then(live => { if (live?.length > 0) setProducts(live); }).catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try { await api.subscribe(email); setSubMsg("You're on the list."); setEmail(''); }
    catch { setSubMsg('Already subscribed.'); }
  };

  return (
    <main className="page-fade">

      {/* Ticker */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {Array(8).fill(null).map((_,i) => <span key={i}>Limited Stock Available</span>)}
          {Array(8).fill(null).map((_,i) => <span key={`b${i}`}>Free Shipping Over 2,000 EGP</span>)}
        </div>
      </div>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{ borderBottom:'2px solid var(--border)' }}>
        <div className="container" style={{ padding:'0 clamp(1rem,4vw,2.5rem)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 64px - 36px)', alignItems:'stretch', gap:0 }}>

            {/* Left */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', paddingRight:'4%', paddingTop:'3rem', paddingBottom:'3rem', borderRight:'2px solid var(--border)' }}>
              {/* Pre-label */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--primary)', border:'2px solid var(--border)', padding:'6px 12px', boxShadow:'var(--shadow-sm)', marginBottom:'28px', alignSelf:'flex-start' }}>
                <span style={{ width:8, height:8, background:'var(--text)', borderRadius:0 }}/>
                <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text)' }}>SS 2026 — Now Live</span>
              </div>

              <h1 style={{ fontSize:'clamp(3rem,7vw,7rem)', fontWeight:900, lineHeight:1, letterSpacing:'-0.05em', marginBottom:'24px', color:'var(--text)' }}>
                Wear<br/>
                <span style={{ WebkitTextStroke:'2px var(--text)', color:'transparent', display:'block' }}>the</span>
                Story.
              </h1>

              <p style={{ maxWidth:380, fontSize:'17px', color:'var(--text-2)', lineHeight:1.7, marginBottom:'36px' }}>
                Contemporary pieces crafted with intention.<br/>
                Limited runs, no restocks — once it's gone, it's gone.
              </p>

              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'32px' }}>
                <button className="btn btn-primary" style={{ fontSize:'13px', padding:'12px 24px' }} onClick={() => navigate('/shop')}>
                  Shop Now <ArrowRight size={15}/>
                </button>
                <button className="btn btn-outline" style={{ fontSize:'13px', padding:'12px 24px' }} onClick={() => navigate('/shop?filter=trending')}>
                  New In
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display:'flex', gap:'0', borderTop:'2px solid var(--border)', paddingTop:'24px' }}>
                {[['100+','Pieces'],['3','Genders'],['2','Cities']].map(([n,l],i,arr) => (
                  <div key={l} style={{ flex:1, paddingRight: i<arr.length-1 ? '16px' : 0, marginRight: i<arr.length-1 ? '16px' : 0, borderRight: i<arr.length-1 ? '2px solid var(--border)' : 'none' }}>
                    <p style={{ fontFamily:'var(--font-mono)', fontSize:'27px', fontWeight:700, color:'var(--text)', lineHeight:1 }}>{n}</p>
                    <p style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginTop:'3px' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual block */}
            <div style={{ position:'relative', overflow:'hidden', background:'var(--text)' }}>
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80&auto=format"
                alt="Robin SS26"
                style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.55, mixBlendMode:'luminosity' }}/>
              {/* Big number overlay */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'2rem' }}>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(5rem,15vw,12rem)', fontWeight:900, color:'rgba(253,200,0,0.18)', lineHeight:1, letterSpacing:'-0.06em', userSelect:'none' }}>2026</p>
              </div>
              {/* Yellow accent chip */}
              <div style={{ position:'absolute', top:'28px', right:'28px', background:'var(--primary)', border:'2px solid var(--border)', padding:'8px 14px', boxShadow:'var(--shadow)' }}>
                <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text)' }}>New Drop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          NEW IN GRID
      ══════════════════════════════════ */}
      <section style={{ padding:'clamp(3rem,6vw,5rem) 0', borderBottom:'2px solid var(--border)' }}>
        <div className="container">
          {/* Section header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px', paddingBottom:'20px', borderBottom:'2px solid var(--border)' }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>The Edit</p>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>New In</h2>
            </div>
            <Link to="/shop?filter=trending"
              style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text)', textDecoration:'none', border:'2px solid var(--border)', padding:'8px 14px', background:'var(--surface)', boxShadow:'var(--shadow-sm)', transition:'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='translate(-2px,-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='none'; }}
            >
              View All <ArrowUpRight size={14}/>
            </Link>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'16px' }}>
            {products.slice(0,4).map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          BRAND MANIFESTO — Dark block
      ══════════════════════════════════ */}
      <section style={{ background:'var(--text)', color:'var(--surface)', borderBottom:'2px solid var(--border)', padding:'clamp(3rem,7vw,6rem) 0', overflow:'hidden', position:'relative' }}>
        {/* Background grid decoration */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(253,200,0,0.06) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }}/>
        <div className="container" style={{ position:'relative', maxWidth:900 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--primary)', border:'2px solid var(--border)', padding:'6px 12px', marginBottom:'28px' }}>
            <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text)' }}>The Philosophy</span>
          </div>
          <blockquote style={{ fontFamily:'var(--font-body)', fontSize:'clamp(1.5rem,4vw,3rem)', fontWeight:900, lineHeight:1.2, letterSpacing:'-0.04em', marginBottom:'24px', color:'var(--surface)' }}>
            "Every piece has a limited run.<br/>
            <span style={{ WebkitTextStroke:'1px rgba(251,251,249,0.4)', color:'transparent' }}>Every run has a story.</span><br/>
            We don't restock — we move forward."
          </blockquote>
          <div style={{ display:'flex', gap:'24px', alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ width:48, height:2, background:'var(--primary)' }}/>
            <p style={{ fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,251,249,0.45)', fontFamily:'var(--font-mono)' }}>
              Robin Studio — Cairo & London
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CATEGORY PANELS
      ══════════════════════════════════ */}
      <section style={{ padding:'clamp(3rem,6vw,5rem) 0', borderBottom:'2px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom:'32px', paddingBottom:'20px', borderBottom:'2px solid var(--border)' }}>
            <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>Shop by</p>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>Categories</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { label:'Men',   sub:'Tracksuits, knits, outerwear', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', accent:'#432DD7', gender:'Men' },
              { label:'Women', sub:'Knitwear, jackets, essentials', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', accent:'#FDC800', gender:'Women' },
              { label:'Kids',  sub:'Boys & Girls seasonal drops',   img:'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80', accent:'#DC2626', gender:'Kids' },
            ].map(cat => (
              <Link key={cat.label} to={`/shop?gender=${cat.gender}`}
                style={{ position:'relative', overflow:'hidden', aspectRatio:'2/3', display:'block', textDecoration:'none', border:'2px solid var(--border)', boxShadow:'var(--shadow)', transition:'all 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.transform='translate(-2px,-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='none'; }}
              >
                <img src={cat.img} alt={cat.label}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(28,41,60,0.9) 0%, rgba(28,41,60,0.2) 60%)' }}/>
                {/* Label panel */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px', borderTop:'2px solid rgba(251,251,249,0.15)' }}>
                  <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:900, color:'white', lineHeight:1, letterSpacing:'-0.04em', marginBottom:'4px' }}>{cat.label}</p>
                  <p style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{cat.sub}</p>
                </div>
                {/* Accent chip */}
                <div style={{ position:'absolute', top:'12px', left:'12px', background:cat.accent, border:'2px solid var(--border)', padding:'4px 10px' }}>
                  <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.08em', textTransform:'uppercase', color: cat.accent==='#FDC800' ? 'var(--text)' : '#fff' }}>Shop</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════ */}
      <section style={{ borderBottom:'2px solid var(--border)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
          {/* Left — yellow */}
          <div style={{ background:'var(--primary)', border:'none', borderRight:'2px solid var(--border)', padding:'clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--text)', padding:'6px 12px', marginBottom:'20px' }}>
              <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--primary)' }}>Priority Access</span>
            </div>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', marginBottom:'14px', color:'var(--text)' }}>Be First to Know.</h2>
            <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.65, maxWidth:360 }}>
              New releases, restocks, and future collections — straight to your inbox.
            </p>
          </div>
          {/* Right — form */}
          <div style={{ background:'var(--surface-2)', padding:'clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <form onSubmit={handleSubscribe} style={{ maxWidth:400 }}>
              <div style={{ display:'flex', marginBottom:'10px' }}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" required
                  style={{ flex:1, background:'var(--surface)', border:'2px solid var(--border)', borderRight:'none', padding:'12px 14px', fontSize:'15px', outline:'none', fontFamily:'var(--font-body)', color:'var(--text)' }}/>
                <button type="submit" className="btn btn-dark" style={{ padding:'12px 20px', fontSize:'12px', whiteSpace:'nowrap' }}>
                  Sign Up <ArrowRight size={13}/>
                </button>
              </div>
              {subMsg && <p style={{ fontSize:'13px', fontWeight:700, color:'var(--secondary)' }}>{subMsg}</p>}
            </form>
            <div style={{ marginTop:'20px', display:'flex', gap:'16px', flexWrap:'wrap' }}>
              {['New Releases','Restock Alerts','Future Drops'].map(t => (
                <span key={t} style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'5px' }}>
                  <span style={{ width:6, height:6, background:'var(--primary)', border:'1px solid var(--border)', display:'inline-block' }}/>{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          section:nth-child(2) > div > div { grid-template-columns:1fr!important; }
          section:nth-child(2) > div > div > div:last-child { min-height:55vw; }
          section:nth-last-child(1) > div { grid-template-columns:1fr!important; }
          section:nth-child(5) > div > div:last-child { grid-template-columns:1fr!important; }
        }
      `}</style>
    </main>
  );
}
