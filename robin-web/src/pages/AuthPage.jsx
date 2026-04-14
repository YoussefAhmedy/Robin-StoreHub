import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import RobinLogo from '../components/RobinLogo';

export default function AuthPage() {
  const [mode,     setMode]     = useState('login');
  const [form,     setForm]     = useState({ firstName:'', lastName:'', email:'', password:'' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, register }     = useAuth();
  const navigate                = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = mode === 'login' ? await login(form.email, form.password) : await register(form);
      if (user?.role === 'SuperAdmin' || user?.role === 'Admin') navigate('/admin');
      else if (user?.role === 'Employee' || user?.role === 'Staff') navigate('/staff');
      else navigate('/');
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="page-fade" style={{ minHeight:'calc(100vh - 64px)', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      {/* Left — visual */}
      <div style={{ background:'var(--text)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'3.5rem', borderRight:'2px solid var(--border)', position:'relative', overflow:'hidden' }}>
        {/* Grid BG */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(253,200,0,0.08) 1px, transparent 1px)', backgroundSize:'32px 32px' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'36px' }}>
            <RobinLogo size={40} dark/>
            <span style={{ fontWeight:900, fontSize:'22px', color:'var(--surface)', textTransform:'uppercase', letterSpacing:'-0.04em' }}>Robin</span>
          </div>
          {/* Big text */}
          <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(2.5rem,5vw,5rem)', fontWeight:900, lineHeight:1, letterSpacing:'-0.05em', color:'var(--surface)', marginBottom:'20px' }}>
            Wear<br/>
            <span style={{ WebkitTextStroke:'1px rgba(251,251,249,0.4)', color:'transparent' }}>the</span><br/>
            Story.
          </p>
          <p style={{ fontSize:'15px', color:'rgba(251,251,249,0.45)', maxWidth:300, lineHeight:1.65 }}>
            Limited runs, no restocks. Join the list and be first to know.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(2rem,6vw,5rem) clamp(2rem,5vw,4rem)', background:'var(--surface)' }}>
        <div style={{ maxWidth:400, width:'100%' }}>
          {/* Mode toggle */}
          <div style={{ display:'flex', border:'2px solid var(--border)', marginBottom:'28px', boxShadow:'var(--shadow-sm)' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ flex:1, padding:'11px', background: mode===m ? 'var(--text)' : 'var(--surface)', color: mode===m ? 'var(--surface)' : 'var(--text)', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', transition:'all 0.12s', borderRight: m==='login' ? '2px solid var(--border)' : 'none' }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize:'27px', marginBottom:'6px' }}>{mode==='login'?'Welcome back.':'Create account.'}</h2>
          <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'24px' }}>
            {mode==='login'?'Sign in to your Robin account.':'Join to access drops and track orders.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {mode === 'register' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div className="field">
                  <label>First Name</label>
                  <input value={form.firstName} onChange={e=>set('firstName',e.target.value)} required placeholder="Ahmad"/>
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input value={form.lastName} onChange={e=>set('lastName',e.target.value)} required placeholder="Hassan"/>
                </div>
              </div>
            )}
            <div className="field">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} required placeholder="you@email.com"/>
            </div>
            <div className="field">
              <label>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} value={form.password} onChange={e=>set('password',e.target.value)} required placeholder="••••••••" style={{ paddingRight:'2.5rem' }}/>
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding:'10px 14px', background:'#FEE2E2', border:'2px solid var(--danger)', color:'var(--danger)', fontSize:'13px', fontWeight:700, boxShadow:'var(--shadow-sm)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent:'center', padding:'13px', fontSize:'13px', marginTop:'4px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait…' : mode==='login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode==='login' && (
            <p style={{ marginTop:'16px', fontSize:'13px', color:'var(--text-muted)', textAlign:'center' }}>
              No account?{' '}
              <button onClick={() => setMode('register')} style={{ color:'var(--secondary)', background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'13px', textDecoration:'underline' }}>
                Register here
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`@media(max-width:768px){main{grid-template-columns:1fr!important} main>div:first-child{display:none!important}}`}</style>
    </main>
  );
}
