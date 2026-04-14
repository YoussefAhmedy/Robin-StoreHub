import { Link } from 'react-router-dom';
import RobinLogo from './RobinLogo';

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

          {/* Info */}
          <div>
            <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(251,251,249,0.35)', marginBottom:'14px' }}>Info</p>
            {['Sizing Guide','Shipping & Returns','FAQ','Contact Us'].map(l => (
              <p key={l} style={{ color:'rgba(251,251,249,0.65)', fontSize:'13px', marginBottom:'8px', cursor:'pointer' }}>{l}</p>
            ))}
          </div>

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
