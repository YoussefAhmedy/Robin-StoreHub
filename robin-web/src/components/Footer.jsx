import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import RobinLogo from './RobinLogo';

// ── Fix 4: Info accordion content ───────────────────────────────────────────
const INFO_ITEMS = [
  {
    label: 'Sizing Guide',
    content: (
      <div style={{ fontSize:'12px', color:'rgba(251,251,249,0.55)', lineHeight:1.7 }}>
        <p style={{ marginBottom:'6px' }}>All measurements are in <strong style={{ color:'rgba(251,251,249,0.8)' }}>centimetres</strong>. Measure over light clothing.</p>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
          <thead>
            <tr>
              {['Size','Chest','Waist','Hip'].map(h => (
                <th key={h} style={{ textAlign:'left', paddingBottom:'4px', color:'rgba(251,251,249,0.4)', fontWeight:700, letterSpacing:'0.06em', borderBottom:'1px solid rgba(251,251,249,0.1)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['XS','84–86','66–68','90–92'],['S','88–92','72–74','94–96'],['M','94–98','78–80','100–102'],['L','100–104','84–86','106–108'],['XL','108–112','90–92','112–114']].map(([s,...v]) => (
              <tr key={s}>
                <td style={{ padding:'4px 0', fontWeight:700, color:'var(--primary)' }}>{s}</td>
                {v.map((val,i) => <td key={i} style={{ padding:'4px 0' }}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop:'8px', fontSize:'11px', color:'rgba(251,251,249,0.35)' }}>Between sizes? Size up for a relaxed fit.</p>
      </div>
    ),
  },
  {
    label: 'Shipping & Returns',
    content: (
      <div style={{ fontSize:'12px', color:'rgba(251,251,249,0.55)', lineHeight:1.8 }}>
        <p><span style={{ color:'var(--primary)', fontWeight:700 }}>Cairo:</span> 1–3 business days · Free over 2,000 EGP</p>
        <p><span style={{ color:'var(--primary)', fontWeight:700 }}>London:</span> 2–5 business days · Free over £80</p>
        <p><span style={{ color:'var(--primary)', fontWeight:700 }}>International:</span> 7–14 business days · Flat rate</p>
        <p style={{ marginTop:'8px', paddingTop:'8px', borderTop:'1px solid rgba(251,251,249,0.1)' }}>
          Returns accepted within <strong style={{ color:'rgba(251,251,249,0.8)' }}>14 days</strong> of delivery — unworn, tags attached.
          Contact us to initiate a return.
        </p>
      </div>
    ),
  },
  {
    label: 'FAQ',
    content: (
      <div style={{ fontSize:'12px', color:'rgba(251,251,249,0.55)', lineHeight:1.8 }}>
        <p><strong style={{ color:'rgba(251,251,249,0.8)' }}>Do you restock?</strong> No — every run is final. Once it's gone, it's gone.</p>
        <p><strong style={{ color:'rgba(251,251,249,0.8)' }}>Can I cancel my order?</strong> Within 2 hours of placing it, yes. Email us immediately.</p>
        <p><strong style={{ color:'rgba(251,251,249,0.8)' }}>What payment methods?</strong> Visa, Mastercard, Cash on Delivery (Cairo only).</p>
        <p><strong style={{ color:'rgba(251,251,249,0.8)' }}>Are your pieces unisex?</strong> Some are. Each product page specifies the fit.</p>
      </div>
    ),
  },
  {
    label: 'Contact Us',
    content: (
      <div style={{ fontSize:'12px', color:'rgba(251,251,249,0.55)', lineHeight:1.9 }}>
        <p>📧 <a href="mailto:hello@robin.store" style={{ color:'var(--primary)', textDecoration:'none' }}>hello@robin.store</a></p>
        <p>📍 Cairo, Egypt &amp; London, UK</p>
        <p>🕐 Support hours: Sun–Thu, 10 am – 6 pm CAT</p>
        <p style={{ marginTop:'6px', fontSize:'11px', color:'rgba(251,251,249,0.35)' }}>
          We typically reply within 24 hours.
        </p>
      </div>
    ),
  },
];

function InfoAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,251,249,0.35)', marginBottom:'14px' }}>Info</p>
      {INFO_ITEMS.map(({ label, content }) => {
        const isOpen = open === label;
        return (
          <div key={label} style={{ borderBottom:'1px solid rgba(251,251,249,0.08)', marginBottom:'2px' }}>
            <button
              onClick={() => setOpen(isOpen ? null : label)}
              style={{
                width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                background:'none', border:'none', cursor:'pointer',
                padding:'7px 0', fontSize:'13px', fontWeight:500,
                color: isOpen ? 'var(--primary)' : 'rgba(251,251,249,0.65)',
                textAlign:'left', transition:'color 0.15s',
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.color = 'rgba(251,251,249,0.9)'; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.color = 'rgba(251,251,249,0.65)'; }}
            >
              {label}
              <ChevronDown
                size={13}
                style={{
                  transition:'transform 0.2s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.5, flexShrink: 0,
                }}
              />
            </button>
            {isOpen && (
              <div style={{ paddingBottom:'12px', animation:'fadeDown 0.18s ease' }}>
                {content}
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background:'var(--text)', color:'var(--surface)', borderTop:'2px solid var(--border)', marginTop:'auto' }}>
      {/* Top strip */}
      <div style={{ background:'var(--primary)', borderBottom:'2px solid var(--border)', padding:'14px 0', textAlign:'center' }}>
        <span style={{ fontSize:'13px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text)' }}>
          ◆ Limited Stock — No Restocks Planned ◆ Free Shipping Over 2,000 EGP ◆ Cairo & London
        </span>
      </div>

      <div className="container" style={{ padding:'3rem clamp(1rem,4vw,2.5rem) 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'3rem', paddingBottom:'3rem', borderBottom:'1px solid rgba(251,251,249,0.12)' }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
              <RobinLogo size={28} dark/>
              <span style={{ fontWeight:900, fontSize:'18px', textTransform:'uppercase', letterSpacing:'-0.03em' }}>Robin</span>
            </div>
            <p style={{ fontSize:'13px', color:'rgba(251,251,249,0.5)', lineHeight:1.7, maxWidth:200 }}>
              Contemporary fashion with intention. Wear the story.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,251,249,0.35)', marginBottom:'14px' }}>Shop</p>
            {[['New In','/shop?filter=trending'],['All Items','/shop'],['Men','/shop?gender=Men'],['Women','/shop?gender=Women'],['Kids','/shop?gender=Kids']].map(([l,h]) => (
              <Link key={l} to={h} style={{ display:'block', color:'rgba(251,251,249,0.65)', fontSize:'13px', fontWeight:500, marginBottom:'8px', textDecoration:'none' }}
                onMouseEnter={e=>e.target.style.color='var(--primary)'}
                onMouseLeave={e=>e.target.style.color='rgba(251,251,249,0.65)'}
              >{l}</Link>
            ))}
          </div>

          {/* ── Fix 4: Info accordion ── */}
          <InfoAccordion />

          {/* Newsletter */}
          <div>
            <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,251,249,0.35)', marginBottom:'14px' }}>Newsletter</p>
            <p style={{ fontSize:'13px', color:'rgba(251,251,249,0.5)', marginBottom:'14px' }}>Be first to know about new drops.</p>
            <div style={{ display:'flex' }}>
              <input placeholder="your@email.com"
                style={{ flex:1, background:'rgba(251,251,249,0.08)', border:'2px solid rgba(251,251,249,0.2)', borderRight:'none', color:'var(--surface)', padding:'9px 12px', fontSize:'13px', outline:'none', fontFamily:'var(--font-body)' }}/>
              <button className="btn" style={{ background:'var(--primary)', color:'var(--text)', border:'2px solid rgba(251,251,249,0.2)', padding:'9px 14px', fontSize:'11px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>Go</button>
            </div>
          </div>
        </div>

        <div style={{ paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontSize:'11px', color:'rgba(251,251,249,0.3)', fontFamily:'var(--font-mono)' }}>© {new Date().getFullYear()} Robin. All rights reserved.</p>
          <p style={{ fontSize:'11px', color:'rgba(251,251,249,0.3)', fontFamily:'var(--font-mono)' }}>Cairo × London</p>
        </div>
      </div>
    </footer>
  );
}
