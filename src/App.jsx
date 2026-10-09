import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'reloop_recovery_items_v1';
const weights = { Phone: 0.2, Laptop: 2, Tablet: 0.5, Battery: 0.25, 'Cable / accessory': 0.15, 'Small appliance': 1.5, 'Other electronics': 0.5 };
const icons = { Phone: '▯', Laptop: '▱', Tablet: '▯', Battery: '▰', 'Cable / accessory': '⌁', 'Small appliance': '◈', 'Other electronics': '▦' };
const demoItems = [
  { id: 'RL-1048', name: 'Old Android phone', type: 'Phone', condition: 'Not working', weight: 0.2, status: 'logged', notes: '', createdAt: '2026-10-08T10:30:00.000Z', demo: true },
  { id: 'RL-1047', name: 'Laptop battery', type: 'Battery', condition: 'Unsure', weight: 0.25, status: 'ready', notes: 'Keep separate; do not dismantle.', createdAt: '2026-10-07T10:30:00.000Z', demo: true },
  { id: 'RL-1046', name: 'Old college laptop', type: 'Laptop', condition: 'Working', weight: 2, status: 'recovered', notes: 'Demo record only — not a verified handover.', createdAt: '2026-10-05T10:30:00.000Z', demo: true },
];
const filters = [{ id: 'all', label: 'All' }, { id: 'logged', label: 'Logged' }, { id: 'ready', label: 'Ready' }, { id: 'recovered', label: 'Recovered' }];
const statusLabels = { logged: 'Logged', ready: 'Ready for handover', recovered: 'Recovered' };
const formatDate = (value) => {
  try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value)); }
  catch { return 'Recently'; }
};
const makeId = () => `RL-${Math.floor(1000 + Math.random() * 9000)}`;

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'footer-brand' : ''}`} href="#top" aria-label="ReLoop home"><span className="brand-mark">↻</span><span>reloop<span className="brand-dot">.</span></span></a>;
}

function DeviceRow({ item, onStatus, onDelete }) {
  const visualType = item.type === 'Phone' ? 'phone' : item.type === 'Laptop' ? 'laptop' : item.type === 'Battery' ? 'battery' : '';
  const weight = Number(item.weight || weights[item.type] || 0);
  return (
    <article className="device-row">
      <div className={`device-illustration ${visualType}`}>{icons[item.type] || '◈'}</div>
      <div className="device-main">
        <div className="device-name">{item.name}</div>
        <div className="device-meta"><span>{item.type}</span><span>{weight.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} kg est.</span><span>{formatDate(item.createdAt)}</span></div>
      </div>
      <span className={`device-status status-${item.status}`}>{statusLabels[item.status] || 'Logged'}</span>
      <div className="row-actions">
        {item.status === 'logged' && <button className="mini-action" onClick={() => onStatus(item, 'ready')}>Mark ready for handover ↗</button>}
        {item.status === 'ready' && <button className="mini-action" onClick={() => onStatus(item, 'recovered')}>Mark recovered ✓</button>}
        <button className="mini-action danger" onClick={() => onDelete(item)}>Remove</button>
      </div>
    </article>
  );
}

function AddDeviceModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', type: '', condition: 'Not working', weight: '', status: 'logged', notes: '' });
  useEffect(() => { if (open) setForm({ name: '', type: '', condition: 'Not working', weight: '', status: 'logged', notes: '' }); }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const type = form.type;
    onAdd({ id: makeId(), name: form.name.trim(), type, condition: form.condition, weight: Number(form.weight) > 0 ? Number(form.weight) : weights[type] || 0.5, status: form.status, notes: form.notes.trim(), createdAt: new Date().toISOString(), demo: false });
    onClose();
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-top"><div><div className="eyebrow dark-eyebrow">ADD TO YOUR RECOVERY QUEUE</div><h2 id="modal-title">Log a device</h2><p>Start a recovery passport for an item you no longer use.</p></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="device-name">Device name <span>*</span></label>
          <input id="device-name" name="name" value={form.name} onChange={update} required maxLength="60" placeholder="e.g. Old Android phone" autoFocus />
          <div className="form-row"><div><label className="field-label" htmlFor="device-type">Device category <span>*</span></label><select id="device-type" name="type" value={form.type} onChange={update} required><option value="">Choose a category</option>{Object.keys(weights).map((type) => <option key={type}>{type}</option>)}</select></div><div><label className="field-label" htmlFor="device-condition">Condition</label><select id="device-condition" name="condition" value={form.condition} onChange={update}><option>Not working</option><option>Working</option><option>Damaged</option><option>Unsure</option></select></div></div>
          <div className="form-row"><div><label className="field-label" htmlFor="device-weight">Approx. weight (kg)</label><input id="device-weight" name="weight" value={form.weight} onChange={update} type="number" min="0.05" max="100" step="0.05" placeholder="e.g. 0.2" /></div><div><label className="field-label" htmlFor="device-status">Current status</label><select id="device-status" name="status" value={form.status} onChange={update}><option value="logged">Logged</option><option value="ready">Ready for handover</option></select></div></div>
          <label className="field-label" htmlFor="device-notes">Notes <span className="optional-label">OPTIONAL</span></label><textarea id="device-notes" name="notes" value={form.notes} onChange={update} rows="2" maxLength="240" placeholder="Anything to remember before handover?" />
          <div className="form-tip"><span>✳</span><p>Your recovery log stays in this browser in this prototype. Don't include personal data or device passwords.</p></div>
          <div className="modal-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-dark">Create recovery passport <span>↗</span></button></div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const [items, setItems] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : demoItems; }
    catch { return demoItems; }
  });
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch { /* Export remains available if browser storage is blocked. */ }
  }, [items]);
  useEffect(() => {
    if (!toast) return undefined;
    setShowToast(true);
    const timer = window.setTimeout(() => setShowToast(false), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const notify = (message) => setToast(message);
  const visibleItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => (activeFilter === 'all' || item.status === activeFilter) && `${item.name} ${item.type} ${item.id}`.toLowerCase().includes(search));
  }, [items, query, activeFilter]);
  const totalWeight = items.reduce((sum, item) => sum + Number(item.weight || weights[item.type] || 0), 0);
  const progressCount = items.filter((item) => item.status === 'ready' || item.status === 'recovered').length;
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const addItem = (item) => {
    setItems((current) => [item, ...current]);
    setActiveFilter('all'); setQuery('');
    notify(`Recovery passport ${item.id} created.`);
  };
  const updateStatus = (item, status) => {
    if (status === 'recovered' && !window.confirm('Only mark this as recovered after the device has actually been handed to a suitable collection or recycling channel. Has that happened?')) return;
    setItems((current) => current.map((record) => record.id === item.id ? { ...record, status, ...(status === 'recovered' ? { recoveredAt: new Date().toISOString() } : {}) } : record));
    notify(status === 'ready' ? 'Marked ready. Verify a suitable collection route before handover.' : 'Recovery status updated. Keep any handover receipt.');
  };
  const deleteItem = (item) => {
    if (!window.confirm(`Remove “${item.name}” from your recovery log?`)) return;
    setItems((current) => current.filter((record) => record.id !== item.id));
    notify('Device removed from your recovery log.');
  };
  const exportData = () => {
    const payload = { product: 'ReLoop', exportType: 'browser recovery log', exportedAt: new Date().toISOString(), note: 'Demo seed records are illustrative and are not proof of real recycling or handover.', items };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'reloop-recovery-log.json'; link.click(); URL.revokeObjectURL(url);
    notify('Recovery log exported as JSON.');
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <Brand />
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation"><a className="nav-link active" href="#dashboard"><span>▦</span> Overview</a><a className="nav-link" href="#my-items"><span>◈</span> My e-waste <span className="nav-count">{items.length}</span></a><a className="nav-link" href="#disposal-guide"><span>↗</span> Disposal guide</a><a className="nav-link" href="#dropoff"><span>⌖</span> Recovery options</a></nav>
      <div className="sidebar-spacer" />
      <div className="impact-card"><div className="impact-icon">✳</div><p className="impact-kicker">SMALL ACTION. REAL CHANGE.</p><p className="impact-copy">Every device you route responsibly is one less unknown in the waste stream.</p><a href="#how-it-works">See how it works <span>↗</span></a></div>
      <div className="sidebar-foot"><span className="status-dot" /> Community recovery workspace</div>
    </aside>

    <main className="main-content" id="top">
      <header className="topbar"><div className="mobile-brand"><span className="brand-mark">↻</span> reloop<span className="brand-dot">.</span></div><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="topbar-right"><span className="prototype-pill"><span /> HACKATHON PROTOTYPE</span><div className="avatar" title="Demo user">S</div></div></header>
      <section className="hero" id="dashboard"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> THE NEXT LIFE OF ELECTRONICS</div><h1>Old tech.<br /><em>Better endings.</em></h1><p className="hero-description">Make your forgotten electronics count. Log a device, get safer disposal guidance, and keep its recovery journey moving.</p><div className="hero-actions"><button className="button button-light" onClick={openModal}><span>＋</span> Log e-waste</button><a className="text-link light-link" href="#how-it-works">How ReLoop works <span>↘</span></a></div></div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="device device-phone"><div className="phone-speaker" /><div className="phone-screen"><span>R</span><small>READY FOR<br />RE-USE</small></div></div><div className="device device-chip"><span>↻</span><small>RECOVER<br />RETHINK<br />RELOOP</small></div><div className="spark spark-a">✳</div><div className="spark spark-b">✦</div><div className="hero-art-caption">A better route<br />starts here.</div></div>
        <div className="hero-bottom"><span>01 — MAKE IT VISIBLE</span><span>02 — FIND ITS NEXT STEP</span><span>03 — TRACK THE JOURNEY</span></div></section>
      <section className="metrics-grid" aria-label="Your recovery summary"><article className="metric-card"><div className="metric-top"><span className="metric-label">Devices logged</span><span className="metric-symbol symbol-green">◈</span></div><div className="metric-number">{items.length}</div><div className="metric-foot"><span className="metric-dot green-dot" /> Items in your recovery list</div></article><article className="metric-card"><div className="metric-top"><span className="metric-label">Recovery in progress</span><span className="metric-symbol symbol-orange">↗</span></div><div className="metric-number">{progressCount}</div><div className="metric-foot"><span className="metric-dot orange-dot" /> Ready or handed over</div></article><article className="metric-card metric-impact"><div className="metric-top"><span className="metric-label">Estimated material logged</span><span className="metric-symbol symbol-blue">✳</span></div><div className="metric-number">{totalWeight.toFixed(2).replace(/0+$/, '').replace(/\.$/, '') || '0'}<small> kg</small></div><div className="metric-foot">An estimate based on logged device types</div></article></section>

      <section className="content-grid" id="my-items"><div className="panel items-panel"><div className="section-heading"><div><div className="eyebrow dark-eyebrow">YOUR RECOVERY QUEUE</div><h2>Give every device a next step.</h2><p className="section-subtitle">Keep track of what you have and where it is in the recovery journey.</p></div><button className="button button-dark" onClick={openModal}>＋ Add device</button></div>
        <div className="toolbar"><label className="search-box"><span>⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your devices" aria-label="Search devices" /></label><div className="filter-tabs" role="group" aria-label="Filter devices">{filters.map((filter) => <button key={filter.id} className={`filter-tab ${activeFilter === filter.id ? 'selected' : ''}`} onClick={() => setActiveFilter(filter.id)}>{filter.label}</button>)}</div></div>
        <div className="items-list" aria-live="polite">{visibleItems.map((item) => <DeviceRow key={item.id} item={item} onStatus={updateStatus} onDelete={deleteItem} />)}</div>
        {visibleItems.length === 0 && <div className="empty-state"><div className="empty-icon">◈</div><h3>No devices found</h3><p>Try another search or log your first device.</p><button className="button button-dark" onClick={openModal}>＋ Log a device</button></div>}
        <div className="panel-foot"><span><span className="status-dot" /> Your list is saved in this browser</span><button className="plain-button" onClick={exportData}>Export recovery log ↗</button></div>
      </div>
      <aside className="right-column"><article className="guide-card" id="disposal-guide"><div className="guide-heading"><div><div className="eyebrow dark-eyebrow">QUICK GUIDE</div><h2>Before it leaves your hands.</h2></div><span className="guide-icon">✳</span></div><p className="guide-intro">A few safer habits can protect people and keep useful materials in circulation.</p>
        <div className="guide-step"><span className="step-number">01</span><div><strong>Back up & sign out</strong><p>Save your data, sign out of accounts, and remove SIM or memory cards where possible.</p></div></div><div className="guide-step"><span className="step-number">02</span><div><strong>Keep batteries intact</strong><p>Don't puncture, crush, or dismantle batteries. If swollen or damaged, avoid handling and seek specialist advice.</p></div></div><div className="guide-step"><span className="step-number">03</span><div><strong>Use a suitable channel</strong><p>Choose an authorized e-waste collection or recycling route. Don't put electronics in regular household bins.</p></div></div><div className="guide-note"><span>ⓘ</span><p>Guidance only. Follow local rules and the recycler's instructions for your specific item.</p></div></article>
        <article className="recovery-card" id="dropoff"><div className="recovery-top"><div><div className="eyebrow">NEXT STEP</div><h2>Find a recovery route.</h2></div><span className="recovery-pin">⌖</span></div><p>Look for authorized collection options before handing over a device.</p><div className="local-listing-label">PUBLICLY LISTED FACILITY · SONIPAT</div><div className="local-listing"><div className="local-listing-icon">⌖</div><div><strong>RBH E-Waste Recycle Hub Pvt. Ltd.</strong><span>HSIIDC, Raj Industrial Estate, Phase 1, Sonipat, Haryana</span><a href="https://www.greentribunal.gov.in/sites/default/files/news_updates/Report%20by%20HSPCB%20in%20EA%20No.%2004%20of%202024%20IN%20OA%20No.%20512%20of%202018%20%28Shailesh%20Singh%20Vs.%20Govt%20of%20Uttar%20Pradesh%20and%20Ors%29.pdf" target="_blank" rel="noreferrer">View public listing source ↗</a></div></div><div className="recovery-option"><div className="option-icon">⌂</div><div><strong>Brand take-back program</strong><span>Check the manufacturer's official website or service centre.</span></div><span className="option-arrow">↗</span></div><a className="recovery-link" href="https://hspcb.gov.in/page/e-waste" target="_blank" rel="noreferrer">Check Haryana e-waste resources <span>↗</span></a><div className="demo-disclaimer">This facility appears in a public Haryana recycler list, but the listing may be dated. Verify current CPCB registration, accepted device types, hours, and pickup availability before visiting. ReLoop does not arrange collection.</div></article></aside></section>
      <section className="how-section" id="how-it-works"><div className="how-heading"><div className="eyebrow dark-eyebrow">DESIGNED FOR ACTION</div><h2>Less guessing. More recovery.</h2><p>ReLoop turns a forgotten device into a trackable next step.</p></div><div className="how-grid"><article><span className="how-index">01</span><div className="how-icon">＋</div><h3>Log the device</h3><p>Record the type, condition, and approximate weight of electronics you no longer use.</p></article><article><span className="how-index">02</span><div className="how-icon">↗</div><h3>Choose a safe route</h3><p>Use the handling guide and verify an appropriate authorized collection channel.</p></article><article><span className="how-index">03</span><div className="how-icon">↻</div><h3>Track the outcome</h3><p>Update the status as the item is prepared, handed over, and responsibly recovered.</p></article></div></section>
      <footer className="footer"><Brand footer /><span>Make recovery the default.</span><span>Built for Environmental Hacks · Waste & Energy</span></footer>
    </main>
    <AddDeviceModal open={modalOpen} onClose={closeModal} onAdd={addItem} />
    <div className={`toast ${showToast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

export default App;
