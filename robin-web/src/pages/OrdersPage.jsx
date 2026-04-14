import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Truck } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_META = {
  Pending:   { label: 'Pending',   cls: 'status-pending',   icon: '🕐', msg: 'We\'ve received your order and are preparing it.' },
  Confirmed: { label: 'Confirmed', cls: 'status-confirmed', icon: '✅', msg: 'Your order has been confirmed and is being prepared.' },
  Shipped:   { label: 'Shipped',   cls: 'status-shipped',   icon: '📦', msg: 'Your order is on the way!' },
  Delivered: { label: 'Delivered', cls: 'status-delivered', icon: '🎉', msg: 'Delivered. We hope you love it.' },
  Cancelled: { label: 'Cancelled', cls: 'status-cancelled', icon: '✗',  msg: 'This order was cancelled.' },
};

const MOCK = [
  { id:1, orderNumber:'RBN-2026-1023', status:'Shipped', totalAmount:2000, shippingAddress:'12 Talaat Harb St, Cairo', createdAt:'2026-04-10T09:00:00Z', trackingNumber:'TRK-88291', items:[{ product:{ name:'The Worker Tracksuit', price:2000, imageUrl:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80' }, quantity:1, unitPrice:2000 }] },
  { id:2, orderNumber:'RBN-2026-0991', status:'Delivered', totalAmount:1200, shippingAddress:'45 Zamalek, Cairo', createdAt:'2026-03-28T11:30:00Z', items:[{ product:{ name:'Weeping Crewneck', price:1200, imageUrl:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80' }, quantity:1, unitPrice:1200 }] },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    api.getMyOrders().then(setOrders).catch(() => setOrders(MOCK)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="container" style={{ padding: '4rem 0' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, marginBottom: '1rem' }} />)}
    </div>
  );

  return (
    <main className="page-fade">
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--sand)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <span className="label-small" style={{ display: 'block', marginBottom: '0.4rem' }}>Account</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>Your Orders</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: 800 }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <ShoppingBag size={48} style={{ color: 'var(--sand)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '0.7rem', fontSize: '1.5rem' }}>No orders yet</h2>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              When you place an order, it'll appear here.
            </p>
            <button className="btn-primary" onClick={() => navigate('/shop')} style={{ justifyContent: 'center' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const meta = STATUS_META[order.status] || STATUS_META.Pending;
              const isOpen = expanded === order.id;

              return (
                <div key={order.id} style={{ background: 'var(--parchment)', border: '1px solid var(--sand)', overflow: 'hidden' }}>
                  {/* Order header row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', textAlign: 'left' }}
                  >
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>{order.orderNumber}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>{order.items?.length || 0} item(s)</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>{order.totalAmount?.toLocaleString()} EGP</p>
                    <span className={`status ${meta.cls}`}>{meta.icon} {meta.label}</span>
                    <ChevronRight size={16} style={{ color: 'var(--ink-muted)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--sand)', padding: '1.5rem' }}>
                      {/* Status message */}
                      <div style={{ background: 'var(--ivory)', padding: '0.8rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1rem' }}>{meta.icon}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)' }}>{meta.msg}</p>
                      </div>

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', padding: '0.7rem 1rem', background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                          <Truck size={15} style={{ color: '#065F46' }} />
                          <p style={{ fontSize: '0.82rem', color: '#065F46' }}>
                            Tracking number: <strong>{order.trackingNumber}</strong>
                          </p>
                        </div>
                      )}

                      {/* Progress bar */}
                      {order.status !== 'Cancelled' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((s, i) => {
                              const steps = ['Pending','Confirmed','Shipped','Delivered'];
                              const current = steps.indexOf(order.status);
                              const done = i <= current;
                              return (
                                <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                                  {i > 0 && (
                                    <div style={{ position: 'absolute', top: 8, left: '-50%', right: '50%', height: 2, background: done ? 'var(--olive)' : 'var(--sand)', zIndex: 0 }} />
                                  )}
                                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: done ? 'var(--olive)' : 'var(--sand)', margin: '0 auto 0.4rem', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                                  </div>
                                  <p style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: done ? 'var(--olive)' : 'var(--ink-muted)' }}>{s}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div>
                        <p className="label-small" style={{ marginBottom: '0.8rem' }}>Items in this order</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              {item.product?.imageUrl && (
                                <img src={item.product.imageUrl} alt={item.product.name}
                                  style={{ width: 56, height: 70, objectFit: 'cover', background: 'var(--ivory)' }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500 }}>{item.product?.name}</p>
                                {item.selectedSize && <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>Size: {item.selectedSize}</p>}
                                <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>
                                  Qty: {item.quantity} · {item.unitPrice?.toLocaleString()} EGP each
                                </p>
                              </div>
                              <p style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                                {(item.unitPrice * item.quantity)?.toLocaleString()} EGP
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping info */}
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sand)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <p className="label-small" style={{ marginBottom: '0.3rem' }}>Delivery Address</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)' }}>{order.shippingAddress}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p className="label-small" style={{ marginBottom: '0.3rem' }}>Order Total</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>{order.totalAmount?.toLocaleString()} EGP</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
