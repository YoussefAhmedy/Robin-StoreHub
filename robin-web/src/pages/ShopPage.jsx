import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { filterProducts } from '../data/products';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

const SORT_OPTS  = [['default','Default'],['new','Newest'],['price-asc','Price ↑'],['price-desc','Price ↓'],['name','A–Z']];
const GENDERS    = ['Men','Women','Boys','Girls','Unisex'];
const SEASONS    = ['Summer','Winter','AllSeason'];
const SUB_CATS   = ['Tracksuit','Sweatshirt','Hoodie','T-Shirt','Shirt','Outerwear','Trousers','Dress','Skirt','Shorts'];
const AGE_GROUPS = ['2-4Y','5-7Y','8-10Y','11-13Y'];

function NBCheckbox({ checked, onChange, label }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', padding:'5px 0' }}>
      <div onClick={onChange} style={{ width:18, height:18, border:'2px solid var(--border)', background: checked ? 'var(--text)' : 'var(--surface)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        {checked && <span style={{ color:'var(--primary)', fontSize:'12px', fontWeight:900, lineHeight:1 }}>✓</span>}
      </div>
      <span style={{ fontSize:'14px', fontWeight: checked ? 700 : 500, color: checked ? 'var(--text)' : 'var(--text-2)' }}>{label}</span>
    </label>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom:'2px solid var(--border)', paddingBottom:'16px', marginBottom:'16px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', background:'none', border:'none', cursor:'pointer', paddingBottom: open ? '12px' : 0 }}>
        <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text)' }}>{title}</span>
        <ChevronDown size={13} style={{ color:'var(--text-muted)', transform: open?'rotate(180deg)':'none', transition:'transform 0.2s' }}/>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function ShopPage() {
  const [params]  = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page,     setPage]     = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [genders,   setGenders]   = useState(params.get('gender') ? [params.get('gender')] : []);
  const [seasons,   setSeasons]   = useState([]);
  const [subCats,   setSubCats]   = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [priceMin,  setPriceMin]  = useState('');
  const [priceMax,  setPriceMax]  = useState('');
  const [sort,      setSort]      = useState('default');

  const isKids = genders.some(g => g==='Boys'||g==='Girls'||g==='Kids');

  useEffect(() => {
    const paramObj = {
      gender: genders[0] || params.get('gender') || undefined,
      season: seasons[0] || undefined,
      subCategory: subCats[0] || undefined,
      ageGroup: ageGroups[0] || undefined,
      available: onlyAvail || undefined,
      trending: params.get('filter')==='trending' || undefined,
      minPrice: priceMin || undefined,
      maxPrice: priceMax || undefined,
      sort,
    };
    setProducts(filterProducts(paramObj));
    setPage(1);
    api.getProducts(paramObj).then(res => {
      const live = Array.isArray(res) ? res : (res.items||[]);
      if (live.length > 0) setProducts(live);
    }).catch(() => {});
  }, [genders, seasons, subCats, ageGroups, onlyAvail, priceMin, priceMax, sort, params]);

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev, val]);

  const clearAll = () => {
    setGenders([]); setSeasons([]); setSubCats([]); setAgeGroups([]);
    setOnlyAvail(false); setPriceMin(''); setPriceMax('');
  };

  const activeChips = [
    ...genders.map(v   => ({ label:v, remove:()=>setGenders(g=>g.filter(x=>x!==v)) })),
    ...seasons.map(v   => ({ label:v, remove:()=>setSeasons(s=>s.filter(x=>x!==v)) })),
    ...subCats.map(v   => ({ label:v, remove:()=>setSubCats(s=>s.filter(x=>x!==v)) })),
    ...ageGroups.map(v => ({ label:v, remove:()=>setAgeGroups(a=>a.filter(x=>x!==v)) })),
    ...(onlyAvail      ? [{ label:'In Stock', remove:()=>setOnlyAvail(false) }] : []),
    ...(priceMin       ? [{ label:`≥${priceMin}`,remove:()=>setPriceMin('') }] : []),
    ...(priceMax       ? [{ label:`≤${priceMax}`,remove:()=>setPriceMax('') }] : []),
  ];

  const gP = params.get('gender');
  const fP = params.get('filter');
  const pageTitle = fP==='trending'?'New In' : gP==='Kids'?'Kids' : gP||'All Items';

  const PAGE_SIZE = 24;
  const paged     = products.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages= Math.ceil(products.length/PAGE_SIZE);

  return (
    <main className="page-fade">
      {/* ── Page Header ── */}
      <div style={{ borderBottom:'2px solid var(--border)', background:'var(--surface-2)' }}>
        <div className="container" style={{ padding:'28px clamp(1rem,4vw,2.5rem)' }}>
          <p style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>Robin</p>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <h1 style={{ fontSize:'clamp(2rem,5vw,4rem)' }}>{pageTitle}</h1>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'13px', fontWeight:700, color:'var(--text-muted)', border:'2px solid var(--border)', padding:'4px 10px', background:'var(--surface)' }}>
              {products.length} {products.length===1?'item':'items'}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:'24px', paddingBottom:'5rem' }}>
        {/* ── Toolbar ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', gap:'12px', flexWrap:'wrap', paddingBottom:'20px', borderBottom:'2px solid var(--border)' }}>
          <button onClick={() => setFilterOpen(o => !o)}
            className="btn btn-outline" style={{ fontSize:'12px', padding:'9px 16px' }}>
            <SlidersHorizontal size={13}/>
            Filter {activeChips.length>0 && `(${activeChips.length})`}
          </button>
          <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}
            style={{ background:'var(--surface)', border:'2px solid var(--border)', padding:'9px 14px', fontSize:'13px', fontWeight:700, color:'var(--text)', cursor:'pointer', outline:'none', boxShadow:'var(--shadow-sm)' }}>
            {SORT_OPTS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div style={{ display:'grid', gridTemplateColumns: filterOpen ? '240px 1fr' : '1fr', gap:'2.5rem', alignItems:'start' }}>

          {/* ── Filter Sidebar ── */}
          {filterOpen && (
            <aside style={{ position:'sticky', top:'calc(var(--nav-h)+1.5rem)', border:'2px solid var(--border)', background:'var(--surface)', padding:'20px', boxShadow:'var(--shadow)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', paddingBottom:'14px', borderBottom:'2px solid var(--border)' }}>
                <span style={{ fontSize:'11px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase' }}>Filters</span>
                <button onClick={clearAll} style={{ fontSize:'11px', fontWeight:700, color:'var(--danger)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Clear</button>
              </div>

              <FilterGroup title="Gender">
                {GENDERS.map(g => <NBCheckbox key={g} checked={genders.includes(g)} onChange={() => toggle(genders,setGenders,g)} label={g}/>)}
              </FilterGroup>
              <FilterGroup title="Category">
                {SUB_CATS.map(s => <NBCheckbox key={s} checked={subCats.includes(s)} onChange={() => toggle(subCats,setSubCats,s)} label={s}/>)}
              </FilterGroup>
              <FilterGroup title="Season">
                {SEASONS.map(s => <NBCheckbox key={s} checked={seasons.includes(s)} onChange={() => toggle(seasons,setSeasons,s)} label={s==='AllSeason'?'All Season':s}/>)}
              </FilterGroup>
              {isKids && (
                <FilterGroup title="Age Group">
                  {AGE_GROUPS.map(a => <NBCheckbox key={a} checked={ageGroups.includes(a)} onChange={() => toggle(ageGroups,setAgeGroups,a)} label={a}/>)}
                </FilterGroup>
              )}
              <FilterGroup title="Price (EGP)">
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <input value={priceMin} onChange={e=>setPriceMin(e.target.value)} placeholder="Min" type="number"
                    style={{ width:'100%', background:'var(--surface)', border:'2px solid var(--border)', padding:'8px 10px', fontSize:'13px', outline:'none', color:'var(--text)', fontFamily:'var(--font-mono)' }}/>
                  <span style={{ fontWeight:700, color:'var(--text-muted)' }}>–</span>
                  <input value={priceMax} onChange={e=>setPriceMax(e.target.value)} placeholder="Max" type="number"
                    style={{ width:'100%', background:'var(--surface)', border:'2px solid var(--border)', padding:'8px 10px', fontSize:'13px', outline:'none', color:'var(--text)', fontFamily:'var(--font-mono)' }}/>
                </div>
              </FilterGroup>
              <div style={{ marginTop:'4px' }}>
                <NBCheckbox checked={onlyAvail} onChange={()=>setOnlyAvail(o=>!o)} label="In Stock Only"/>
              </div>
            </aside>
          )}

          {/* ── Product area ── */}
          <div>
            {/* Active chips */}
            {activeChips.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' }}>
                {activeChips.map((f,i) => (
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:'var(--text)', color:'var(--surface)', padding:'4px 10px', fontSize:'11px', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', border:'2px solid var(--border)' }}>
                    {f.label}
                    <button onClick={f.remove} style={{ background:'none', border:'none', color:'var(--surface)', cursor:'pointer', padding:0, display:'flex' }}><X size={10}/></button>
                  </span>
                ))}
                <button onClick={clearAll} style={{ fontSize:'11px', fontWeight:700, color:'var(--danger)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Clear all</button>
              </div>
            )}

            {products.length === 0 ? (
              <div style={{ textAlign:'center', padding:'5rem 0', border:'2px solid var(--border)', background:'var(--surface-2)' }}>
                <p style={{ fontWeight:900, fontSize:'21px', color:'var(--text)', marginBottom:'8px' }}>No items found</p>
                <p style={{ fontSize:'15px', color:'var(--text-muted)', marginBottom:'24px' }}>Try adjusting your filters.</p>
                <button className="btn btn-primary" onClick={clearAll}>Clear Filters</button>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
                {paged.map(p => <ProductCard key={p.id} product={p}/>)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'3rem' }}>
                {Array(totalPages).fill(null).map((_,i) => (
                  <button key={i} onClick={()=>{setPage(i+1);window.scrollTo({top:0,behavior:'smooth'});}}
                    style={{ width:40, height:40, border:'2px solid var(--border)', cursor:'pointer', fontSize:'14px', fontWeight:900, boxShadow: page===i+1 ? 'var(--shadow-sm)' : 'none', background: page===i+1 ? 'var(--text)' : 'var(--surface)', color: page===i+1 ? 'var(--surface)' : 'var(--text)', fontFamily:'var(--font-mono)', transform: page===i+1 ? 'translate(-2px,-2px)' : 'none' }}>
                    {i+1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ aside{ position:fixed!important; inset:0!important; top:var(--nav-h)!important; z-index:150!important; overflow-y:auto!important; } }`}</style>
    </main>
  );
}
