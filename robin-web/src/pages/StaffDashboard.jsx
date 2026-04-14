import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RobinLogo from '../components/RobinLogo';

const STATUS_FLOW = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const SHIPPING_METHODS = ['Standard', 'Express', 'Pickup'];

const MOCK_ORDERS = [
  { id:1, orderNumber:'RBN-2026-1023', status:'Pending', totalAmount:2000, shippingAddress:'12 Talaat Harb St, Cairo', createdAt:'2026-04-10T09:00:00Z', user:{firstName:'Ahmad', lastName:'Hassan', email:'ahmad@email.com'}, items:[{product:{name:'Worker Tracksuit', imageUrl:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80'}, quantity:1, unitPrice:2000}] },
  { id:2, orderNumber:'RBN-2026-1024', status:'Confirmed', totalAmount:1200, shippingAddress:'45 Zamalek, Cairo', createdAt:'2026-04-11T11:30:00Z', trackingNumber:'', user:{firstName:'Sara', lastName:'Mohamed', email:'sara@email.com'}, items:[{product:{name:'Weeping Crewneck'}, quantity:1, unitPrice:1200}] },
  { id:3, orderNumber:'RBN-2026-1025', status:'Shipped', totalAmount:2400, shippingAddress:'7 Maadi Corniche, Cairo', createdAt:'2026-04-11T14:00:00Z', trackingNumber:'TRK-88291', user:{firstName:'Youssef', lastName:'Ali', email:'youssef@email.com'}, items:[{product:{name:'Prey Knit'}, quantity:2, unitPrice:900}] },
];

export default function StaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeOrder, setActiveOrder] = useState(null);
  const [shipForm, setShipForm] = useState({ trackingNumber: '', shippingMethod: 'Standard', notes: '' });
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (user && user.role !== 'Employee' && user.role !== 'Staff' && user.role !== 'SuperAdmin' && user.role !== 'Admin') {
      navigate('/'); return;
    }
    api.staffOrders().then(setOrders).catch(() => setOrders(MOCK_ORDERS)).finally(() => setLoading(false));
  }, [user]);

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      `${o.user?.firstName} ${o.user?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = { All: orders.length };
  STATUS_FLOW.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await api.staffUpdateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      setMsg('Status updated.');
    } catch { setMsg('Failed to update.'); }
    finally { setUpdating(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleShip = async (e) => {
    e.preventDefault();
    if (!activeOrder) return;
    setUpdating(true);
    try {
      await api.staffShipOrder(activeOrder.id, shipForm);
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, status: 'Shipped', trackingNumber: shipForm.trackingNumber } : o));
      setActiveOrder(null); setMsg('Order marked as shipped!');
    } catch { setMsg('Failed to ship order.'); }
    finally { setUpdating(false); setTimeout(() => setMsg(''), 3000); }
  };

  const statusColor = { Pending:'status-pending', Confirmed:'status-confirmed', Shipped:'status-shipped', Delivered:'status-delivered', Cancelled:'status-cancelled' };

  return (
    <main style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid rgba(246,242,236,0.1)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <RobinLogo size={26} color="#F6F2EC" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>Robin</span>
            </div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(246,242,236,0.4)' }}>Staff Portal</span>
          </div>

          {[
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'shipping', icon: Truck, label: 'Shipping' },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%', padding: '0.85rem 1.5rem', background: tab === item.id ? 'rgba(246,242,236,0.1)' : 'none', border: 'none', borderLeft: `3px solid ${tab === item.id ? 'var(--rust)' : 'transparent'}`, cursor: 'pointer', color: tab === item.id ? 'var(--cream)' : 'rgba(246,242,236,0.6)', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left', transition: 'all 0.2s' }}>
              <item.icon size={16} />
              {item.label}
            </button>
          ))}

          <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(246,242,236,0.1)' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(246,242,236,0.4)', marginBottom: '0.2rem' }}>Logged in as</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(246,242,236,0.8)' }}>{user?.firstName} {user?.lastName}</p>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(246,242,236,0.35)' }}>Staff</span>
          </div>
        </aside>

        {/* Main */}
        <div className="dashboard-main">
          {msg && <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.7rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{msg}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem' }}>Order Management</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>Update statuses, mark shipments, add tracking numbers.</p>
            </div>
          </div>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid var(--sand)', paddingBottom: '0' }}>
            {['All', ...STATUS_FLOW.slice(0, 4)].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: '0.6rem 1.2rem', background: 'none', border: 'none', borderBottom: `2px solid ${statusFilter === s ? 'var(--ink)' : 'transparent'}`, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusFilter === s ? 'var(--ink)' : 'var(--ink-muted)', whiteSpace: 'nowrap', marginBottom: -1 }}>
                {s} {counts[s] !== undefined && <span style={{ fontSize: '0.65rem', marginLeft: '0.3rem', opacity: 0.6 }}>({counts[s]})</span>}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 360 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or customer…"
              style={{ width: '100%', background: 'var(--parchment)', border: '1px solid var(--sand)', padding: '0.65rem 0.8rem 0.65rem 2.3rem', fontSize: '0.85rem', color: 'var(--ink)', outline: 'none' }} />
          </div>

          {/* Orders table */}
          {loading ? (
            <div>{[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: '0.5rem' }} />)}</div>
          ) : (
            <div style={{ border: '1px solid var(--sand)', background: 'var(--parchment)', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '0', background: 'var(--ivory)', padding: '0.75rem 1.2rem', borderBottom: '1px solid var(--sand)' }}>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                  <span key={h} className="label-small" style={{ fontSize: '0.65rem' }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)', fontSize: '0.9rem' }}>No orders found</div>
              ) : filtered.map(order => (
                <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '0', padding: '1rem 1.2rem', borderBottom: '1px solid var(--sand)', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--ivory)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{order.orderNumber}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    {order.trackingNumber && <p style={{ fontSize: '0.7rem', color: 'var(--olive)', marginTop: '0.2rem' }}>Track: {order.trackingNumber}</p>}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{order.user?.firstName} {order.user?.lastName}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{order.user?.email}</p>
                  </div>
                  <p style={{ fontSize: '0.82rem' }}>{order.items?.length || 0} item(s)</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.totalAmount?.toLocaleString()} EGP</p>
                  <span className={`status ${statusColor[order.status] || 'status-pending'}`}>{order.status}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {order.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'Confirmed')} style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', background: 'var(--ink)', color: 'var(--cream)', border: 'none', cursor: 'pointer' }}>
                        Confirm
                      </button>
                    )}
                    {order.status === 'Confirmed' && (
                      <button onClick={() => { setActiveOrder(order); setShipForm({ trackingNumber: '', shippingMethod: 'Standard', notes: '' }); }} style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', background: 'var(--olive)', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Mark Shipped
                      </button>
                    )}
                    {order.status === 'Shipped' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', background: 'var(--rust)', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ship Modal */}
      {activeOrder && (
        <div className="overlay" onClick={() => setActiveOrder(null)}>
          <div className="modal" style={{ padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '0.4rem' }}>Mark as Shipped</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>Order {activeOrder.orderNumber} → {activeOrder.user?.firstName} {activeOrder.user?.lastName}</p>
            <form onSubmit={handleShip} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="field">
                <label>Tracking Number</label>
                <input value={shipForm.trackingNumber} onChange={e => setShipForm(f => ({ ...f, trackingNumber: e.target.value }))} placeholder="e.g. TRK-88291" />
              </div>
              <div className="field">
                <label>Shipping Method</label>
                <select value={shipForm.shippingMethod} onChange={e => setShipForm(f => ({ ...f, shippingMethod: e.target.value }))}>
                  {SHIPPING_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Staff Notes (optional)</label>
                <textarea value={shipForm.notes} onChange={e => setShipForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Any notes about this shipment…" />
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn-outline" onClick={() => setActiveOrder(null)}>Cancel</button>
                <button type="submit" className="btn-rust" disabled={updating}>{updating ? 'Saving…' : 'Confirm Shipment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
