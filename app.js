(() => {
  const STORAGE_KEY = 'reloop_recovery_items_v1';
  const weights = { Phone: 0.2, Laptop: 2.0, Tablet: 0.5, Battery: 0.25, 'Cable / accessory': 0.15, 'Small appliance': 1.5, 'Other electronics': 0.5 };
  const icons = { Phone: '▯', Laptop: '▱', Tablet: '▯', Battery: '▰', 'Cable / accessory': '⌁', 'Small appliance': '◈', 'Other electronics': '▦' };
  const demoItems = [
    { id: 'RL-1048', name: 'Old Android phone', type: 'Phone', condition: 'Not working', weight: 0.2, status: 'logged', notes: '', createdAt: '2026-10-08T10:30:00.000Z', demo: true },
    { id: 'RL-1047', name: 'Laptop battery', type: 'Battery', condition: 'Unsure', weight: 0.25, status: 'ready', notes: 'Keep separate; do not dismantle.', createdAt: '2026-10-07T10:30:00.000Z', demo: true },
    { id: 'RL-1046', name: 'Old college laptop', type: 'Laptop', condition: 'Working', weight: 2, status: 'recovered', notes: 'Demo record only — not a verified handover.', createdAt: '2026-10-05T10:30:00.000Z', demo: true }
  ];
  const $ = (s) => document.querySelector(s);
  const list = $('#items-list');
  const empty = $('#empty-state');
  const form = $('#device-form');
  const modal = $('#modal-backdrop');
  const toast = $('#toast');
  let activeFilter = 'all';
  let toastTimer;
  let items = loadItems();

  function loadItems() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : demoItems.map(x => ({ ...x }));
    } catch { return demoItems.map(x => ({ ...x })); }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch { showToast('Browser storage is unavailable. Export your log to keep a copy.'); }
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  }
  function statusLabel(status) { return ({ logged: 'Logged', ready: 'Ready for handover', recovered: 'Recovered' })[status] || 'Logged'; }
  function formatDate(date) {
    try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(date)); }
    catch { return 'Recently'; }
  }
  function render() {
    const query = $('#search-items').value.trim().toLowerCase();
    const visible = items.filter(item => (activeFilter === 'all' || item.status === activeFilter) && `${item.name} ${item.type} ${item.id}`.toLowerCase().includes(query));
    list.innerHTML = visible.map(item => `
      <article class="device-row" data-id="${escapeHTML(item.id)}">
        <div class="device-illustration ${item.type === 'Phone' ? 'phone' : item.type === 'Laptop' ? 'laptop' : item.type === 'Battery' ? 'battery' : ''}">${icons[item.type] || '◈'}</div>
        <div class="device-main"><div class="device-name">${escapeHTML(item.name)}</div><div class="device-meta"><span>${escapeHTML(item.type)}</span><span>${Number(item.weight || weights[item.type] || 0).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} kg est.</span><span>${formatDate(item.createdAt)}</span></div></div>
        <span class="device-status status-${escapeHTML(item.status)}">${statusLabel(item.status)}</span>
        <div class="row-actions">${item.status === 'logged' ? `<button class="mini-action" data-action="ready" data-id="${escapeHTML(item.id)}">Mark ready for handover ↗</button>` : ''}${item.status === 'ready' ? `<button class="mini-action" data-action="recovered" data-id="${escapeHTML(item.id)}">Mark recovered ✓</button>` : ''}<button class="mini-action danger" data-action="delete" data-id="${escapeHTML(item.id)}">Remove</button></div>
      </article>`).join('');
    empty.classList.toggle('hidden', visible.length > 0);
    list.style.display = visible.length ? '' : 'none';
    $('#metric-devices').textContent = items.length;
    $('#metric-progress').textContent = items.filter(x => x.status === 'ready' || x.status === 'recovered').length;
    $('#metric-weight').textContent = items.reduce((sum, x) => sum + Number(x.weight || weights[x.type] || 0), 0).toFixed(2).replace(/0+$/, '').replace(/\.$/, '') || '0';
    $('#nav-count').textContent = items.length;
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function openModal() { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; setTimeout(() => $('#device-name').focus(), 50); }
  function closeModal() { modal.classList.add('hidden'); document.body.style.overflow = ''; form.reset(); }
  function makeId() { return `RL-${Math.floor(1000 + Math.random() * 9000)}`; }

  ['#open-add', '#open-add-secondary', '#empty-add'].forEach(sel => $(sel).addEventListener('click', openModal));
  ['#close-modal', '#cancel-modal'].forEach(sel => $(sel).addEventListener('click', closeModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
  $('#search-items').addEventListener('input', render);
  document.querySelectorAll('.filter-tab').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('selected', b === button));
    render();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const type = data.get('type');
    const weightInput = Number(data.get('weight'));
    const item = {
      id: makeId(), name: String(data.get('name')).trim(), type,
      condition: data.get('condition'), weight: weightInput > 0 ? weightInput : weights[type] || 0.5,
      status: data.get('status'), notes: String(data.get('notes') || '').trim(),
      createdAt: new Date().toISOString(), demo: false
    };
    if (!item.name || !type) return;
    items.unshift(item);
    save(); render(); closeModal();
    activeFilter = 'all';
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('selected', b.dataset.filter === 'all'));
    $('#search-items').value = '';
    render();
    showToast(`Recovery passport ${item.id} created.`);
  });

  list.addEventListener('click', e => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const item = items.find(x => x.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === 'delete') {
      items = items.filter(x => x.id !== item.id);
      save(); render(); showToast('Device removed from your recovery log.'); return;
    }
    if (button.dataset.action === 'ready') {
      item.status = 'ready'; save(); render(); showToast('Marked ready. Verify a suitable collection route before handover.'); return;
    }
    if (button.dataset.action === 'recovered') {
      const confirmed = window.confirm('Only mark this as recovered after the device has actually been handed to a suitable collection or recycling channel. Has that happened?');
      if (!confirmed) return;
      item.status = 'recovered'; item.recoveredAt = new Date().toISOString(); save(); render(); showToast('Recovery status updated. Keep any handover receipt.');
    }
  });

  $('#export-data').addEventListener('click', () => {
    const payload = { product: 'ReLoop', exportType: 'browser recovery log', exportedAt: new Date().toISOString(), note: 'Demo seed records are illustrative and are not proof of real recycling or handover.', items };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'reloop-recovery-log.json'; a.click(); URL.revokeObjectURL(url);
    showToast('Recovery log exported as JSON.');
  });
  render();
})();
