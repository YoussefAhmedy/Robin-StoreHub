import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const placeholderBg = (name = '') => {
  const swatches = ['#FDC800','#432DD7','#D1FAE5','#DBEAFE','#FEE2E2'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return swatches[h % swatches.length];
};

export default function ProductCard({ product }) {
  const { addItem }  = useCart();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [imgErr,    setImgErr]    = useState(false);
  const [adding,    setAdding]    = useState(false);
  const [hovered,   setHovered]   = useState(false);

  const price    = product.discountPrice || product.price;
  const hasDisc  = product.discountPrice && product.discountPrice < product.price;
  const sold     = product.stockQuantity === 0 || !product.isAvailable;
  const lowStock = !sold && product.stockQuantity > 0 && product.stockQuantity <= 3;
  const imgSrc   = (!imgErr && product.imageUrl) ? product.imageUrl : null;

  const handleAdd = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { navigate('/auth'); return; }
    if (sold || adding) return;
    setAdding(true);
    await addItem(product.id, 1);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration:'none', display:'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: '2px solid var(--border)',
          background: 'var(--surface)',
          boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
          transform: hovered ? 'translate(-2px,-2px)' : 'none',
          transition: 'box-shadow 0.12s, transform 0.12s',
        }}
      >
        {/* Image zone */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: imgSrc ? 'var(--surface-2)' : placeholderBg(product.name),
          borderBottom: '2px solid var(--border)',
        }}>
          {imgSrc ? (
            <img src={imgSrc} alt={product.name} onError={() => setImgErr(true)}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.4s var(--ease)'
              }}/>
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
              <span style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.8rem,3cqi,1.5rem)', fontWeight:900, color:'rgba(28,41,60,0.25)', textAlign:'center', textTransform:'uppercase', letterSpacing:'-0.02em', lineHeight:1.1 }}>
                {product.name}
              </span>
            </div>
          )}

          {/* Tags top-left */}
          <div style={{ position:'absolute', top:'8px', left:'8px', display:'flex', flexDirection:'column', gap:'4px' }}>
            {sold     && <span className="badge badge-dark">Sold Out</span>}
            {lowStock && !sold && <span className="badge badge-red">Last {product.stockQuantity}</span>}
            {product.isTrending && !sold && <span className="badge badge-yellow">New In</span>}
            {hasDisc  && !sold && <span className="badge badge-blue">Sale</span>}
          </div>

          {/* Hover overlay with CTA buttons */}
          <div style={{ position:'absolute', inset:0, background:'rgba(28,41,60,0.6)', opacity: hovered ? 1 : 0, transition:'opacity 0.2s', display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'10px' }}>
            <button onClick={e => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product.slug||product.id}`); }}
              className="btn btn-outline" style={{ fontSize:'11px', padding:'7px 10px', background:'var(--surface)', flexShrink:0 }}>
              <Eye size={12}/> View
            </button>
            <button onClick={handleAdd} disabled={sold||adding}
              className="btn"
              style={{ fontSize:'11px', padding:'7px 10px', background: adding ? '#16A34A' : sold ? '#6B7A8D' : 'var(--primary)', color:'var(--text)', border:'2px solid var(--border)', cursor: sold ? 'not-allowed' : 'pointer', transition:'none' }}>
              <ShoppingBag size={12}/>
              {sold ? 'Out' : adding ? 'Added ✓' : 'Add'}
            </button>
          </div>
        </div>

        {/* Info strip */}
        <div style={{ padding:'12px' }}>
          {product.category && (
            <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'4px' }}>
              {product.gender ? `${product.gender} · ` : ''}{product.category.name}
            </p>
          )}
          <p style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', lineHeight:1.2, marginBottom:'8px',
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {product.name}
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'15px', fontWeight:900, color: hasDisc ? 'var(--danger)' : 'var(--text)', fontFamily:'var(--font-mono)' }}>
              {price?.toLocaleString()} EGP
            </span>
            {hasDisc && (
              <span style={{ fontSize:'13px', color:'var(--text-muted)', textDecoration:'line-through', fontFamily:'var(--font-mono)' }}>
                {product.price?.toLocaleString()} EGP
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
