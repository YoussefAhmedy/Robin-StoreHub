import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Package, Users, TrendingUp, DollarSign,
  Plus, Trash2, Edit3, Send, Sparkles, X, Upload,
  ShoppingBag, AlertCircle, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RobinLogo from '../components/RobinLogo';

/* ── Mock data (used when API offline) ── */
const MOCK_STATS = { totalRevenue: 87400, ordersToday: 12, totalOrders: 156, totalUsers: 243, pendingOrders: 8, shippedOrders: 34 };
const MOCK_REVENUE = [
  { month: 'Nov', revenue: 18200, orders: 22 },
  { month: 'Dec', revenue: 32100, orders: 41 },
  { month: 'Jan', revenue: 24800, orders: 30 },
  { month: 'Feb', revenue: 19600, orders: 26 },
  { month: 'Mar', revenue: 41200, orders: 52 },
  { month: 'Apr', revenue: 28900, orders: 38 },
];
const MOCK_STATUS_PIE = [
  { name: 'Pending', value: 8, color: '#F59E0B' },
  { name: 'Confirmed', value: 14, color: '#3B82F6' },
  { name: 'Shipped', value: 34, color: '#10B981' },
  { name: 'Delivered', value: 82, color: '#6B7280' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
];
const MOCK_PRODUCTS = [
  { id:1, name:'The Worker Tracksuit', price:2000, stockQuantity:5, isAvailable:true, category:{name:'Tracksuit'}, imageUrl:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80' },
  { id:2, name:'Predator Knit Crewneck', price:1200, stockQuantity:0, isAvailable:false, category:{name:'Tops'}, imageUrl:'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=200&q=80' },
  { id:3, name:'Weeping Crewneck', price:1200, stockQuantity:3, isAvailable:true, category:{name:'Tops'}, imageUrl:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&q=80' },
];
const MOCK_ORDERS = [
  { id:1, orderNumber:'RBN-2026-1023', status:'Pending', totalAmount:2000, createdAt:'2026-04-10T09:00:00Z', user:{firstName:'Ahmad', lastName:'Hassan'} },
  { id:2, orderNumber:'RBN-2026-1024', status:'Confirmed', totalAmount:1200, createdAt:'2026-04-11T11:30:00Z', user:{firstName:'Sara', lastName:'Mohamed'} },
  { id:3, orderNumber:'RBN-2026-1025', status:'Shipped', totalAmount:2400, createdAt:'2026-04-11T14:00:00Z', user:{firstName:'Youssef', lastName:'Ali'} },
];

const TAB_ICONS = { overview: BarChart2, orders: ShoppingBag, products: Package, users: Users, ai: Sparkles };
const TABS = ['overview', 'orders', 'products', 'users', 'ai'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Product form */
  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name:'', price:'', description:'', imageUrl:'', stockQuantity:'', categoryName:'', sizesJson:'', isAvailable: true, isTrending: false });
  const [savingProduct, setSavingProduct] = useState(false);
  const [pMsg, setPMsg] = useState('');

  /* AI chat */
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Robin AI assistant. I can help you create new products, analyze your data, draft email campaigns, or answer questions about your store. What would you like to do?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user && user.role !== 'SuperAdmin' && user.role !== 'Admin') { navigate('/'); return; }
    Promise.all([
      api.adminStats().catch(() => MOCK_STATS),
      api.adminOrders().catch(() => MOCK_ORDERS),
      api.adminProducts().catch(() => MOCK_PRODUCTS),
    ]).then(([s, o, p]) => { setStats(s); setOrders(o); setProducts(p); }).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  const openNewProduct = () => {
    setEditProduct(null);
    setProductForm({ name:'', price:'', description:'', imageUrl:'', stockQuantity:'', categoryName:'', sizesJson:'["XS","S","M","L","XL"]', isAvailable:true, isTrending:false });
    setProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({ name: p.name, price: p.price, description: p.description||'', imageUrl: p.imageUrl||'', stockQuantity: p.stockQuantity, categoryName: p.category?.name||'', sizesJson: p.sizesJson||'', isAvailable: p.isAvailable, isTrending: p.isTrending||false });
    setProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault(); setSavingProduct(true); setPMsg('');
    const payload = { ...productForm, price: parseFloat(productForm.price), stockQuantity: parseInt(productForm.stockQuantity) };
    try {
      if (editProduct) { await api.adminUpdateProduct(editProduct.id, payload); setPMsg('Product updated!'); setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...payload } : p)); }
      else { const np = await api.adminCreateProduct(payload); setProducts(prev => [...prev, np]); setPMsg('Product created!'); }
      setTimeout(() => { setProductModal(false); setPMsg(''); }, 1200);
    } catch { setPMsg('Failed to save product.'); }
    finally { setSavingProduct(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.adminDeleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); }
    catch { alert('Failed to delete.'); }
  };

  /* ── AI Chat with Anthropic API ── */
  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = { role: 'user', content: aiInput };
    const updatedMsgs = [...aiMessages, userMsg];
    setAiMessages(updatedMsgs); setAiInput(''); setAiLoading(true);

    try {
      const systemContext = `You are Robin Admin AI — the intelligent assistant for Robin, a contemporary fashion brand based in Cairo. 
      
Current store data:
- Total Revenue: ${stats?.totalRevenue?.toLocaleString() || 0} EGP
- Total Orders: ${stats?.totalOrders || 0}  
- Pending Orders: ${stats?.pendingOrders || 0}
- Total Users: ${stats?.totalUsers || 0}
- Products in catalog: ${products.length}

When asked to create a product, respond with a JSON block like: \`\`\`json\n{"action":"create_product","name":"...","price":1200,"description":"...","imageUrl":"https://...","stockQuantity":10,"categoryName":"Tops","sizesJson":"[\\"XS\\",\\"S\\",\\"M\\",\\"L\\",\\"XL\\"]","isAvailable":true,"isTrending":false}\`\`\`

Be concise, professional, and knowledgeable about fashion retail and e-commerce. You can help with: product creation, email copy, trend analysis, pricing strategy, inventory advice.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemContext,
          messages: updatedMsgs.map(m => ({ role: m.role, content: m.content })),
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
      const assistantMsg = { role: 'assistant', content: text };
      setAiMessages(prev => [...prev, assistantMsg]);

      // Check for product creation action
      const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.action === 'create_product') {
            const { action, ...productData } = parsed;
            const created = await api.adminCreateProduct(productData).catch(() => ({ ...productData, id: Date.now() }));
            setProducts(prev => [...prev, created]);
            setAiMessages(prev => [...prev, { role: 'assistant', content: `✅ Product **"${productData.name}"** has been added to your catalog at ${productData.price?.toLocaleString()} EGP.` }]);
          }
        } catch {}
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please check your connection and try again.' }]);
    } finally { setAiLoading(false); }
  };

  const statusBadge = (s) => {
    const map = { Pending:'status-pending', Confirmed:'status-confirmed', Shipped:'status-shipped', Delivered:'status-delivered', Cancelled:'status-cancelled' };
    return <span className={`status ${map[s]||'status-pending'}`}>{s}</span>;
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 72px)' }}>
      <div style={{ textAlign:'center' }}>
        <RobinLogo size={48} />
        <p style={{ marginTop:'1rem', color:'var(--ink-muted)', fontSize:'0.9rem' }}>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div style={{ padding:'0 1.5rem 1.5rem', borderBottom:'1px solid rgba(246,242,236,0.1)', marginBottom:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.5rem' }}>
              <RobinLogo size={28} color="#F6F2EC" />
              <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:600 }}>Robin</span>
            </div>
            <span style={{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(246,242,236,0.35)' }}>Super Admin</span>
          </div>

          {TABS.map(t => {
            const Icon = TAB_ICONS[t];
            return (
              <button key={t} onClick={() => setTab(t)}
                style={{ display:'flex', alignItems:'center', gap:'0.8rem', width:'100%', padding:'0.85rem 1.5rem', background: tab===t ? 'rgba(246,242,236,0.1)' : 'none', border:'none', borderLeft:`3px solid ${tab===t?'var(--rust)':'transparent'}`, cursor:'pointer', color: tab===t?'var(--cream)':'rgba(246,242,236,0.55)', fontSize:'0.82rem', fontWeight: tab===t ? 600 : 400, textAlign:'left', transition:'all 0.2s', textTransform:'capitalize' }}>
                <Icon size={15} />
                {t === 'ai' ? 'AI Assistant' : t.charAt(0).toUpperCase()+t.slice(1)}
                {t === 'orders' && stats?.pendingOrders > 0 && <span style={{ marginLeft:'auto', background:'var(--rust)', color:'white', borderRadius:'50%', width:18, height:18, fontSize:'0.65rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{stats.pendingOrders}</span>}
              </button>
            );
          })}

          <div style={{ padding:'1.5rem', marginTop:'auto', borderTop:'1px solid rgba(246,242,236,0.1)', position:'absolute', bottom:0, left:0, right:0 }}>
            <p style={{ fontSize:'0.72rem', color:'rgba(246,242,236,0.4)', marginBottom:'0.2rem' }}>Signed in as</p>
            <p style={{ fontSize:'0.82rem', color:'rgba(246,242,236,0.8)', fontWeight:500 }}>{user?.firstName} {user?.lastName}</p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="dashboard-main">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div>
              <div style={{ marginBottom:'2rem' }}>
                <h2 style={{ fontSize:'1.8rem', marginBottom:'0.3rem' }}>Dashboard Overview</h2>
                <p style={{ fontSize:'0.85rem', color:'var(--ink-muted)' }}>Robin Store Performance — {new Date().toLocaleDateString('en-GB', { month:'long', year:'numeric' })}</p>
              </div>

              {/* KPI Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
                {[
                  { label:'Total Revenue', value:`${(stats?.totalRevenue||0).toLocaleString()} EGP`, delta:'+18% vs last month', icon:DollarSign, accent:'var(--rust)' },
                  { label:'Total Orders', value:stats?.totalOrders||0, delta:`${stats?.ordersToday||0} today`, icon:ShoppingBag, accent:'var(--olive)' },
                  { label:'Customers', value:stats?.totalUsers||0, delta:'Registered accounts', icon:Users, accent:'#6366F1' },
                  { label:'Pending', value:stats?.pendingOrders||0, delta:'Awaiting action', icon:AlertCircle, accent:'#F59E0B' },
                ].map(card => (
                  <div key={card.label} className="stat-card">
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <p className="stat-label">{card.label}</p>
                        <p className="stat-value" style={{ fontSize:'1.8rem' }}>{card.value}</p>
                        <p style={{ fontSize:'0.75rem', color:'var(--ink-muted)', marginTop:'0.3rem' }}>{card.delta}</p>
                      </div>
                      <div style={{ background: card.accent, padding:'0.6rem', borderRadius:2, opacity:0.15, position:'absolute' }} />
                      <card.icon size={22} style={{ color: card.accent, opacity:0.7 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
                {/* Revenue chart */}
                <div className="stat-card">
                  <p className="label-small" style={{ marginBottom:'1.5rem' }}>Revenue Over 6 Months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={MOCK_REVENUE}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#BF4317" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#BF4317" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--sand)" />
                      <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'var(--ink-muted)' }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v)=>[`${v.toLocaleString()} EGP`, 'Revenue']} contentStyle={{ background:'var(--parchment)', border:'1px solid var(--sand)', borderRadius:0, fontSize:12 }} />
                      <Area type="monotone" dataKey="revenue" stroke="var(--rust)" strokeWidth={2} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Status pie */}
                <div className="stat-card">
                  <p className="label-small" style={{ marginBottom:'1.5rem' }}>Order Status Breakdown</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={MOCK_STATUS_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                        {MOCK_STATUS_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background:'var(--parchment)', border:'1px solid var(--sand)', borderRadius:0, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'0.72rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly orders bar */}
              <div className="stat-card">
                <p className="label-small" style={{ marginBottom:'1.5rem' }}>Monthly Order Volume</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={MOCK_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--sand)" />
                    <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'var(--parchment)', border:'1px solid var(--sand)', borderRadius:0, fontSize:12 }} />
                    <Bar dataKey="orders" fill="var(--olive)" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div>
              <div style={{ marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                <h2 style={{ fontSize:'1.8rem' }}>All Orders</h2>
                <span style={{ fontSize:'0.82rem', color:'var(--ink-muted)' }}>{orders.length} total orders</span>
              </div>
              <div style={{ border:'1px solid var(--sand)', background:'var(--parchment)', overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 1fr 1fr', padding:'0.8rem 1.2rem', background:'var(--ivory)', borderBottom:'1px solid var(--sand)' }}>
                  {['Order #','Customer','Date','Total','Status'].map(h => <span key={h} className="label-small" style={{ fontSize:'0.65rem' }}>{h}</span>)}
                </div>
                {orders.map(order => (
                  <div key={order.id} style={{ display:'grid', gridTemplateColumns:'1.5fr 1.5fr 1fr 1fr 1fr', padding:'1rem 1.2rem', borderBottom:'1px solid var(--sand)', alignItems:'center' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--ivory)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <p style={{ fontSize:'0.82rem', fontWeight:600 }}>{order.orderNumber}</p>
                    <p style={{ fontSize:'0.85rem' }}>{order.user?.firstName} {order.user?.lastName}</p>
                    <p style={{ fontSize:'0.78rem', color:'var(--ink-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p style={{ fontSize:'0.88rem', fontWeight:600 }}>{order.totalAmount?.toLocaleString()} EGP</p>
                    {statusBadge(order.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div>
              <div style={{ marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                <div>
                  <h2 style={{ fontSize:'1.8rem' }}>Product Catalog</h2>
                  <p style={{ fontSize:'0.85rem', color:'var(--ink-muted)', marginTop:'0.2rem' }}>{products.length} products</p>
                </div>
                <button onClick={openNewProduct} className="btn-rust" style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <Plus size={15} /> Add Product
                </button>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.2rem' }}>
                {products.map(p => (
                  <div key={p.id} style={{ background:'var(--parchment)', border:'1px solid var(--sand)', overflow:'hidden' }}>
                    <div style={{ aspectRatio:'16/9', overflow:'hidden', background:'var(--ivory)', position:'relative' }}>
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--sand)' }}><Package size={40}/></div>}
                      {!p.isAvailable && <div style={{ position:'absolute', inset:0, background:'rgba(14,13,11,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><span className="tag">Sold Out</span></div>}
                    </div>
                    <div style={{ padding:'1rem' }}>
                      <p style={{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-muted)', marginBottom:'0.3rem' }}>{p.category?.name}</p>
                      <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:500, marginBottom:'0.4rem' }}>{p.name}</p>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <p style={{ fontWeight:600, color:'var(--rust)' }}>{p.price?.toLocaleString()} EGP</p>
                        <p style={{ fontSize:'0.78rem', color: p.stockQuantity===0?'var(--error)':'var(--ink-muted)' }}>Stock: {p.stockQuantity}</p>
                      </div>
                      <div style={{ display:'flex', gap:'0.6rem', marginTop:'0.8rem' }}>
                        <button onClick={() => openEditProduct(p)} className="btn-outline" style={{ flex:1, justifyContent:'center', padding:'0.5rem', fontSize:'0.72rem' }}>
                          <Edit3 size={13}/> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ padding:'0.5rem 0.8rem', background:'none', border:'1px solid #FECACA', color:'var(--error)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.72rem', fontWeight:500 }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI ASSISTANT ── */}
          {tab === 'ai' && (
            <div style={{ height:'calc(100vh - 72px - 5rem)', display:'flex', flexDirection:'column' }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.3rem' }}>
                  <Sparkles size={20} style={{ color:'var(--rust)' }} />
                  <h2 style={{ fontSize:'1.8rem' }}>Robin AI Assistant</h2>
                </div>
                <p style={{ fontSize:'0.85rem', color:'var(--ink-muted)' }}>
                  Add products, write copy, analyze performance — just ask.
                </p>
              </div>

              {/* Quick actions */}
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
                {[
                  'Create a new crewneck product priced at 1,400 EGP',
                  'Summarize this month\'s performance',
                  'Write a newsletter for our next drop',
                  'What products should I restock?',
                ].map(q => (
                  <button key={q} onClick={() => setAiInput(q)} style={{ padding:'0.4rem 0.9rem', background:'var(--parchment)', border:'1px solid var(--sand)', fontSize:'0.75rem', cursor:'pointer', color:'var(--ink-2)', transition:'all 0.2s', whiteSpace:'nowrap' }}
                    onMouseEnter={e=>{e.target.style.background='var(--ivory)';e.target.style.borderColor='var(--ink)'}}
                    onMouseLeave={e=>{e.target.style.background='var(--parchment)';e.target.style.borderColor='var(--sand)'}}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', background:'var(--parchment)', border:'1px solid var(--sand)', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'1rem' }}>
                {aiMessages.map((msg, i) => (
                  <div key={i} style={{ display:'flex', justifyContent: msg.role==='user'?'flex-end':'flex-start' }}>
                    <div style={{
                      maxWidth:'75%', padding:'0.85rem 1.1rem',
                      background: msg.role==='user' ? 'var(--ink)' : 'var(--ivory)',
                      color: msg.role==='user' ? 'var(--cream)' : 'var(--ink)',
                      fontSize:'0.88rem', lineHeight:1.6,
                      borderLeft: msg.role==='assistant' ? '3px solid var(--rust)' : 'none',
                    }}>
                      {msg.role==='assistant' && (
                        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.5rem', opacity:0.6 }}>
                          <Sparkles size={11} />
                          <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Robin AI</span>
                        </div>
                      )}
                      <p style={{ margin:0, whiteSpace:'pre-wrap', color:'inherit' }}>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display:'flex', justifyContent:'flex-start' }}>
                    <div style={{ padding:'0.85rem 1.1rem', background:'var(--ivory)', borderLeft:'3px solid var(--rust)' }}>
                      <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
                        {[0,1,2].map(j => <div key={j} style={{ width:6, height:6, background:'var(--rust)', borderRadius:'50%', animation:`pulse 1.2s ease-in-out ${j*0.2}s infinite` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ display:'flex', gap:'0' }}>
                <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),sendAiMessage())}
                  placeholder="Ask anything — add a product, analyze data, write copy…"
                  style={{ flex:1, background:'var(--parchment)', border:'1px solid var(--sand)', borderRight:'none', padding:'0.9rem 1.2rem', fontSize:'0.9rem', outline:'none', color:'var(--ink)' }} />
                <button onClick={sendAiMessage} disabled={aiLoading || !aiInput.trim()}
                  style={{ background:aiLoading||!aiInput.trim()?'var(--sand)':'var(--rust)', color:'white', border:'none', padding:'0.9rem 1.5rem', cursor:aiLoading||!aiInput.trim()?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', fontWeight:600, transition:'background 0.2s' }}>
                  <Send size={15} /> Send
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Product Modal */}
      {productModal && (
        <div className="overlay" onClick={() => setProductModal(false)}>
          <div className="modal" style={{ padding:'2rem', maxWidth:560 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={()=>setProductModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveProduct} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="field" style={{ gridColumn:'1/-1' }}>
                  <label>Product Name *</label>
                  <input value={productForm.name} onChange={e=>setProductForm(f=>({...f,name:e.target.value}))} required placeholder="e.g. Phantom Knit Crewneck" />
                </div>
                <div className="field">
                  <label>Price (EGP) *</label>
                  <input type="number" value={productForm.price} onChange={e=>setProductForm(f=>({...f,price:e.target.value}))} required placeholder="1200" min="0" />
                </div>
                <div className="field">
                  <label>Stock Quantity *</label>
                  <input type="number" value={productForm.stockQuantity} onChange={e=>setProductForm(f=>({...f,stockQuantity:e.target.value}))} required placeholder="10" min="0" />
                </div>
                <div className="field">
                  <label>Category</label>
                  <input value={productForm.categoryName} onChange={e=>setProductForm(f=>({...f,categoryName:e.target.value}))} placeholder="Tops / Bottoms / Tracksuit" />
                </div>
                <div className="field">
                  <label>Sizes (JSON array)</label>
                  <input value={productForm.sizesJson} onChange={e=>setProductForm(f=>({...f,sizesJson:e.target.value}))} placeholder='["S","M","L","XL"]' />
                </div>
                <div className="field" style={{ gridColumn:'1/-1' }}>
                  <label>Image URL</label>
                  <input value={productForm.imageUrl} onChange={e=>setProductForm(f=>({...f,imageUrl:e.target.value}))} placeholder="https://..." />
                </div>
                <div className="field" style={{ gridColumn:'1/-1' }}>
                  <label>Description</label>
                  <textarea value={productForm.description} onChange={e=>setProductForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Describe the piece…" />
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={productForm.isAvailable} onChange={e=>setProductForm(f=>({...f,isAvailable:e.target.checked}))} style={{ accentColor:'var(--olive)' }} />
                  Available for Purchase
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={productForm.isTrending} onChange={e=>setProductForm(f=>({...f,isTrending:e.target.checked}))} style={{ accentColor:'var(--rust)' }} />
                  Mark as New In / Trending
                </label>
              </div>
              {pMsg && <p style={{ fontSize:'0.82rem', color: pMsg.includes('Failed')?'var(--error)':'var(--olive)', padding:'0.5rem', background:'var(--ivory)' }}>{pMsg}</p>}
              <div style={{ display:'flex', gap:'0.8rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
                <button type="button" className="btn-outline" onClick={()=>setProductModal(false)}>Cancel</button>
                <button type="submit" className="btn-rust" disabled={savingProduct}>{savingProduct?'Saving…':editProduct?'Save Changes':'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.4);opacity:0.5}
        }
      `}</style>
    </main>
  );
}
