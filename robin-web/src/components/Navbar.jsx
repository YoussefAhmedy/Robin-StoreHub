import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import RobinLogo from './RobinLogo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userDrop, setUserDrop]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const adminRole = user?.role === 'SuperAdmin' || user?.role === 'Admin';
  const staffRole = user?.role === 'Employee'   || user?.role === 'Staff';
  const isActive  = (path) => location.pathname === path;

  return (
    <>
      {/* ── Main Nav Bar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        height: 'var(--nav-h)',
        background: 'var(--surface)',
        borderBottom: '2px solid var(--border)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'100%' }}>

          {/* Brand */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
            <RobinLogo size={36}/>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '20px',
              fontWeight: 900,
              color: 'var(--text)',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
            }}>Robin</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display:'flex', gap:'4px', alignItems:'center' }} className="desktop-nav">
            {[
              ['/shop',              'Shop'],
              ['/shop?filter=trending','New In'],
              ...(adminRole ? [['/admin', 'Admin']] : []),
              ...(adminRole||staffRole ? [['/staff','Staff']] : []),
            ].map(([path, label]) => (
              <Link key={path+label} to={path}
                style={{
                  fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', padding: '8px 14px',
                  color: isActive(path) ? 'var(--surface)' : 'var(--text)',
                  background: isActive(path) ? 'var(--text)' : 'transparent',
                  border: '2px solid transparent',
                  transition: 'all 0.12s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.border = '2px solid var(--border)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.border = '2px solid transparent';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {/* User */}
            {user ? (
              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setUserDrop(o => !o)}
                  style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', border:'2px solid var(--border)', background:'var(--surface)', cursor:'pointer', fontSize:'13px', fontWeight:700, boxShadow:'var(--shadow-sm)' }}
                >
                  <User size={15}/>
                  <span style={{ maxWidth:70, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.firstName}</span>
                </button>
                {userDrop && (
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'var(--surface)', border:'2px solid var(--border)', minWidth:160, zIndex:300, boxShadow:'var(--shadow-lg)' }}
                    onMouseLeave={() => setUserDrop(false)}>
                    <Link to="/orders" onClick={() => setUserDrop(false)}
                      style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', fontSize:'13px', fontWeight:600, color:'var(--text)', textDecoration:'none', borderBottom:'1px solid var(--surface-3)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <Package size={13}/> My Orders
                    </Link>
                    <button onClick={() => { logout(); setUserDrop(false); }}
                      style={{ display:'flex', width:'100%', padding:'10px 14px', background:'none', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, color:'var(--danger)', textAlign:'left' }}
                      onMouseEnter={e => e.currentTarget.style.background='#FEE2E2'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/auth')}
                style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', border:'2px solid var(--border)', background:'var(--surface)', cursor:'pointer', fontSize:'13px', fontWeight:700, boxShadow:'var(--shadow-sm)' }}>
                <User size={15}/> Sign In
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)}
              style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:40, height:40, border:'2px solid var(--border)', background:'var(--surface)', cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
              <ShoppingBag size={18}/>
              {count > 0 && (
                <span style={{ position:'absolute', top:-6, right:-6, background:'var(--primary)', color:'var(--text)', border:'2px solid var(--border)', borderRadius:0, width:20, height:20, fontSize:'10px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', letterSpacing:0 }}>
                  {count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(true)}
              style={{ display:'none', alignItems:'center', justifyContent:'center', width:40, height:40, border:'2px solid var(--border)', background:'var(--surface)', cursor:'pointer', boxShadow:'var(--shadow-sm)' }}
              className="mobile-btn">
              <Menu size={18}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} style={{ justifyContent:'flex-start', alignItems:'flex-start', padding:0 }}>
          <div style={{ width:300, maxWidth:'90vw', height:'100vh', background:'var(--surface)', border:'none', borderRight:'2px solid var(--border)', display:'flex', flexDirection:'column', animation:'slideInLeft 0.25s var(--ease)' }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'2px solid var(--border)', background:'var(--text)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <RobinLogo size={28} dark/>
                <span style={{ color:'var(--surface)', fontWeight:900, fontSize:'18px', textTransform:'uppercase', letterSpacing:'-0.03em' }}>Robin</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--surface)', display:'flex' }}>
                <X size={20}/>
              </button>
            </div>
            {/* Links */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {[
                ['/', 'Home'],
                ['/shop', 'Shop'],
                ['/shop?filter=trending', 'New In'],
                ...(user ? [['/orders','My Orders']] : []),
                ...(adminRole ? [['/admin','Admin Dashboard']] : []),
                ...(adminRole||staffRole ? [['/staff','Staff Portal']] : []),
              ].map(([path, label]) => (
                <Link key={path+label} to={path} onClick={() => setMenuOpen(false)}
                  style={{ display:'flex', alignItems:'center', padding:'14px 24px', borderBottom:'1px solid var(--surface-3)', fontSize:'13px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text)', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                  {label}
                </Link>
              ))}
            </div>
            {/* Bottom */}
            <div style={{ padding:'1.5rem', borderTop:'2px solid var(--border)' }}>
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-dark" style={{ width:'100%', justifyContent:'center' }}>
                  Sign Out
                </button>
              ) : (
                <button onClick={() => { navigate('/auth'); setMenuOpen(false); }} className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav{ display:none !important; }
          .mobile-btn{ display:flex !important; }
        }
        @keyframes slideInLeft{
          from{ transform:translateX(-100%); }
          to  { transform:translateX(0); }
        }
      `}</style>
    </>
  );
}
