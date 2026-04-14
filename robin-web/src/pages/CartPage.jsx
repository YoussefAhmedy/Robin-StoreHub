import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const SHIPPING = [
  { id:'standard', label:'Standard Delivery', days:'3–5 business days', price:80 },
  { id:'express',  label:'Express Delivery',  days:'1–2 business days', price:150 },
  { id:'pickup',   label:'Pickup in Store',    days:'Cairo Studio',      price:0 },
];

export default function CartPage() {
  const { items, total, removeItem, updateQty, loadCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [address,    setAddress]    = useState('');
  const [shipping,   setShipping]   = useState('standard');
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(null);
  const [error,      setError]      = useState('');

  const shippingCost = SHIPPING.find(s => s.id===shipping)?.price || 0;
  const grandTotal   = total + shippingCost;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!address.trim()) { setError('Please enter a shipping address.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await api.createOrder({ shippingAddress: address, shippingMethod: shipping });
      setSuccess(res.orderNumber);
      await loadCart();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (success) return (
    <main className="page-fade" style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', maxWidth:480, padding:'2rem' }}>
        <div style={{ width:64, height:64, background:'var(--success)', border:'2px solid var(--border)', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'1.5rem', color:'white', fontWeight:900 }}>✓</div>
        <span className="badge badge-green" style={{ marginBottom:'12px', display:'inline-block' }}>Order Confirmed</span>
        <h2 style={{ marginBottom:'10px' }}>Thank you!</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'6px' }}>Order <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--text)' }}>{success}</span> has been placed.</p>
        <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'28px' }}>You'll receive a confirmation email shortly.</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')} style={{ justifyContent:'center' }}>Continue Shopping</button>
      </div>
    </main>
  );

  if (items.length === 0) return (
    <main className="page-fade" style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:'2rem' }}>
        <div style={{ width:64, height:64, border:'2px solid var(--border)', background:'var(--surface-2)', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <ShoppingBag size={28} color="var(--text-muted)"/>
        </div>
        <h2 style={{ marginBottom:'8px' }}>Your bag is empty</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'24px', fontSize:'15px' }}>Add some pieces you love.</p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')} style={{ justifyContent:'center' }}>Explore Shop</button>
      </div>
    </main>
  );

  return (
    <main className="page-fade">
      <div style={{ borderBottom:'2px solid var(--border)', background:'var(--surface-2)', padding:'24px 0 20px' }}>
        <div className="container">
          <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'4px' }}>Robin</p>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>Your Bag</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop:'2rem', paddingBottom:'5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'3rem', alignItems:'start' }}>

          {/* Items */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:'12px', borderBottom:'2px solid var(--border)', marginBottom:'0' }}>
              <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase' }}>Product</span>
              <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase' }}>Total</span>
            </div>
            {items.map(item => {
              const price = item.product?.discountPrice || item.product?.price || 0;
              return (
                <div key={item.id} style={{ display:'grid', gridTemplateColumns:'72px 1fr auto', gap:'16px', padding:'16px 0', borderBottom:'1px solid var(--surface-3)', alignItems:'start' }}>
                  <div style={{ width:72, height:90, border:'2px solid var(--border)', background:'var(--surface-2)', overflow:'hidden', flexShrink:0 }}>
                    {item.product?.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'15px', color:'var(--text)', marginBottom:'2px', lineHeight:1.2 }}>{item.product?.name}</p>
                    <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'10px', fontFamily:'var(--font-mono)' }}>{price.toLocaleString()} EGP each</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ display:'inline-flex', alignItems:'center', border:'2px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
                        <button onClick={() => updateQty(item.id,item.quantity-1)} style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', display:'flex' }}><Minus size={11}/></button>
                        <span style={{ padding:'6px 12px', fontWeight:900, fontSize:'14px', fontFamily:'var(--font-mono)', borderLeft:'2px solid var(--border)', borderRight:'2px solid var(--border)' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id,item.quantity+1)} style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', display:'flex' }}><Plus size={11}/></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}><X size={16}/></button>
                    </div>
                  </div>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'17px', fontWeight:900, whiteSpace:'nowrap' }}>
                    {(price * item.quantity).toLocaleString()} EGP
                  </p>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h)+2rem)' }}>
            <div style={{ border:'2px solid var(--border)', boxShadow:'var(--shadow)', background:'var(--surface)' }}>
              <div style={{ padding:'16px 20px', background:'var(--text)', borderBottom:'2px solid var(--border)' }}>
                <h3 style={{ fontSize:'17px', color:'var(--surface)', letterSpacing:'-0.02em' }}>Order Summary</h3>
              </div>
              <div style={{ padding:'20px' }}>
                <form onSubmit={handleCheckout} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  {/* Shipping method */}
                  <div>
                    <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'8px' }}>Shipping Method</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                      {SHIPPING.map(s => (
                        <label key={s.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', border:`2px solid ${shipping===s.id?'var(--text)':'var(--border)'}`, cursor:'pointer', background:shipping===s.id?'var(--surface-2)':'transparent', boxShadow:shipping===s.id?'var(--shadow-sm)':'none', transition:'all 0.1s' }}>
                          <input type="radio" name="shipping" value={s.id} checked={shipping===s.id} onChange={()=>setShipping(s.id)} style={{ accentColor:'var(--text)' }}/>
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:'13px', fontWeight:700 }}>{s.label}</p>
                            <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>{s.days}</p>
                          </div>
                          <span style={{ fontSize:'13px', fontWeight:900, fontFamily:'var(--font-mono)' }}>{s.price===0?'Free':`${s.price} EGP`}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="field">
                    <label>Shipping Address</label>
                    <textarea value={address} onChange={e=>setAddress(e.target.value)} rows={3} placeholder="Street, City, Governorate" required style={{ resize:'vertical' }}/>
                  </div>

                  <hr className="divider" style={{ margin:'4px 0' }}/>

                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'13px', color:'var(--text-muted)', fontWeight:600 }}>Subtotal</span>
                    <span style={{ fontSize:'14px', fontWeight:700, fontFamily:'var(--font-mono)' }}>{total.toLocaleString()} EGP</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'13px', color:'var(--text-muted)', fontWeight:600 }}>Shipping</span>
                    <span style={{ fontSize:'14px', fontWeight:700, fontFamily:'var(--font-mono)' }}>{shippingCost===0?'Free':`${shippingCost} EGP`}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'12px', borderTop:'2px solid var(--border)', marginBottom:'4px' }}>
                    <span style={{ fontWeight:900, fontSize:'15px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Total</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'21px', fontWeight:900 }}>{grandTotal.toLocaleString()} EGP</span>
                  </div>

                  {error && <div style={{ padding:'10px 12px', background:'#FEE2E2', border:'2px solid var(--danger)', color:'var(--danger)', fontSize:'13px', fontWeight:700 }}>{error}</div>}

                  <button type="submit" className="btn btn-primary" disabled={submitting} style={{ justifyContent:'center', padding:'13px', fontSize:'14px', opacity:submitting?0.7:1 }}>
                    {submitting ? 'Placing Order…' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){main>div:last-child>div{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
