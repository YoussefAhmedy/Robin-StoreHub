import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, total, removeItem, updateQty, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();
  if (!cartOpen) return null;

  return (
    <div className="overlay" onClick={() => setCartOpen(false)} style={{ justifyContent:'flex-end', alignItems:'stretch', padding:0 }}>
      <div
        style={{ width:'100%', maxWidth:420, background:'var(--surface)', display:'flex', flexDirection:'column', height:'100vh', borderLeft:'2px solid var(--border)', boxShadow:'var(--shadow-xl)', animation:'slideInRight 0.28s var(--ease)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'2px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--text)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <ShoppingBag size={18} color="var(--primary)"/>
            <span style={{ fontWeight:900, fontSize:'15px', color:'var(--surface)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Your Bag</span>
            {items.length > 0 && <span style={{ background:'var(--primary)', color:'var(--text)', padding:'2px 7px', fontSize:'11px', fontWeight:900, border:'1px solid var(--border)' }}>{items.length}</span>}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--surface)', display:'flex' }}>
            <X size={20}/>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign:'center', paddingTop:'4rem' }}>
              <div style={{ width:56, height:56, border:'2px solid var(--border)', background:'var(--surface-2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'var(--shadow)' }}>
                <ShoppingBag size={24} color="var(--text-muted)"/>
              </div>
              <p style={{ fontWeight:800, fontSize:'17px', color:'var(--text)', marginBottom:'6px' }}>Your bag is empty</p>
              <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'24px' }}>Add some pieces you love.</p>
              <button className="btn btn-primary" onClick={() => { setCartOpen(false); navigate('/shop'); }} style={{ justifyContent:'center' }}>
                Explore Shop
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {items.map(item => {
                const img   = item.product?.imageUrl;
                const price = item.product?.discountPrice || item.product?.price || 0;
                return (
                  <div key={item.id} style={{ display:'flex', gap:'12px', paddingBottom:'12px', borderBottom:'1px solid var(--surface-3)' }}>
                    {/* Image */}
                    <div style={{ width:72, height:90, border:'2px solid var(--border)', background:'var(--surface-2)', flexShrink:0, overflow:'hidden' }}>
                      {img ? <img src={img} alt={item.product?.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : null}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'2px', lineHeight:1.2 }}>{item.product?.name}</p>
                      <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'8px', fontFamily:'var(--font-mono)' }}>{(price * item.quantity).toLocaleString()} EGP</p>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', border:'2px solid var(--border)' }}>
                          <button onClick={() => updateQty(item.id, item.quantity-1)} style={{ padding:'4px 8px', background:'none', border:'none', cursor:'pointer', color:'var(--text)', display:'flex' }}><Minus size={11}/></button>
                          <span style={{ padding:'4px 10px', fontWeight:700, fontSize:'13px' }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity+1)} style={{ padding:'4px 8px', background:'none', border:'none', cursor:'pointer', color:'var(--text)', display:'flex' }}><Plus size={11}/></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--danger)', background:'none', border:'none', cursor:'pointer' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding:'16px 20px', borderTop:'2px solid var(--border)', background:'var(--surface-2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px', alignItems:'baseline' }}>
              <span style={{ fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Subtotal</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'20px', fontWeight:900, color:'var(--text)' }}>{total.toLocaleString()} EGP</span>
            </div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:'13px' }}
              onClick={() => { setCartOpen(false); navigate('/cart'); }}>
              Checkout <ArrowRight size={14}/>
            </button>
            <button onClick={() => setCartOpen(false)} style={{ width:'100%', marginTop:'8px', padding:'8px', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideInRight{ from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>
  );
}
