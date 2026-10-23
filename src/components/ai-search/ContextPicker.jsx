import { Check, Community, Search, ViewGrid, Xmark } from 'iconoir-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MAX_SCOPE_CATEGORIES, MAX_SCOPE_MDAS } from './languages';

const TYPE_LABEL = { ministry: 'Ministry', agency: 'Agency', department: 'Department', parastatal: 'Parastatal' };
const POPOVER_WIDTH = 400;
const SHOW_LIMIT = 80;
const PREFERRED_HEIGHT = 440;

/**
 * Popover (bottom sheet on phones) for narrowing a chat to up to 5 MDAs and/or
 * up to 3 service categories. Controlled: `scope` in, `onChange(scope)` out.
 * `anchorRef` positions it on desktop; `placement` picks above/below.
 */
export default function ContextPicker({ open, onClose, tab, onTabChange, live, scope, onChange, onRetry, anchorRef, placement = 'down' }) {
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  // `onClose` is a new function on every parent render; read it through a ref so
  // effects don't re-run (and wipe the search box) each time the parent updates.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const mdas = scope.mdas || [];
  const categories = scope.categories || [];

  // Desktop positioning relative to the anchor; phones use a CSS bottom sheet.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = anchorRef?.current;
      if (!el || window.innerWidth <= 640) return setPos(null);
      const r = el.getBoundingClientRect();
      const width = Math.min(POPOVER_WIDTH, window.innerWidth - 24);
      const left = Math.max(12, Math.min(r.left, window.innerWidth - width - 12));

      // Prefer the requested side, but flip to whichever has room so the panel
      // never runs off-screen. A downward panel opens over its own trigger row
      // (like a menu) so it gets the most height; an upward one sits above it.
      const downTop = Math.max(12, r.top - 6);
      const below = window.innerHeight - downTop - 16;
      const above = r.top - 22;
      let dir = placement;
      if (dir === 'down' && below < PREFERRED_HEIGHT && above > below) dir = 'up';
      else if (dir === 'up' && above < PREFERRED_HEIGHT && below > above) dir = 'down';
      const maxHeight = Math.max(260, Math.min(540, dir === 'down' ? below : above));

      setPos(
        dir === 'up'
          ? { left, width, maxHeight, bottom: window.innerHeight - r.top + 10 }
          : { left, width, maxHeight, top: downTop }
      );
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, anchorRef, placement]);

  // Fresh search box + focus only when the picker opens or the tab changes —
  // never because something else re-rendered.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [open, tab]);

  // Escape / click-outside to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || anchorRef?.current?.contains(e.target)) return;
      onCloseRef.current();
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, anchorRef]);

  const q = query.trim().toLowerCase();

  const mdaRows = useMemo(() => {
    const all = live?.mdas || [];
    const selectedIds = new Set(mdas.map((m) => m.id));
    const matches = all.filter((m) => !q || m.name.toLowerCase().includes(q) || m.subdomain.toLowerCase().includes(q));
    const selected = matches.filter((m) => selectedIds.has(m.id));
    const rest = matches.filter((m) => !selectedIds.has(m.id));
    return { rows: [...selected, ...(q ? rest : rest.slice(0, SHOW_LIMIT))], hidden: q ? 0 : Math.max(0, rest.length - SHOW_LIMIT) };
  }, [live, q, mdas]);

  const categoryRows = useMemo(() => {
    const all = live?.categories || [];
    return all.filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [live, q]);

  if (!open) return null;

  const mdaFull = mdas.length >= MAX_SCOPE_MDAS;
  const catFull = categories.length >= MAX_SCOPE_CATEGORIES;

  const toggleMda = (m) => {
    const on = mdas.some((x) => x.id === m.id);
    if (!on && mdaFull) return;
    onChange({
      ...scope,
      mdas: on ? mdas.filter((x) => x.id !== m.id) : [...mdas, { id: m.id, name: m.name, subdomain: m.subdomain }],
    });
  };
  const toggleCategory = (c) => {
    const on = categories.some((x) => x.formattedName === c.formattedName);
    if (!on && catFull) return;
    onChange({
      ...scope,
      categories: on ? categories.filter((x) => x.formattedName !== c.formattedName) : [...categories, c],
    });
  };

  const total = mdas.length + categories.length;
  const style = pos ? { ...pos, position: 'fixed' } : undefined;

  return createPortal(
    <div className="eko-picker-layer">
      <div className="eko-picker-backdrop" onClick={onClose} />
      <div ref={panelRef} className="eko-picker" style={style} role="dialog" aria-label="Narrow your search">
        <div className="eko-picker-head">
          <div className="eko-picker-title">Narrow your search</div>
          <button type="button" className="eko-icon-btn" onClick={onClose} aria-label="Close">
            <Xmark />
          </button>
        </div>
        <p className="eko-picker-sub">Eko Smart will answer only from what you pick.</p>

        <div className="eko-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'mdas'} className={tab === 'mdas' ? 'on' : ''} onClick={() => onTabChange('mdas')}>
            <Community /> MDAs <span>{mdas.length}/{MAX_SCOPE_MDAS}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'categories'} className={tab === 'categories' ? 'on' : ''} onClick={() => onTabChange('categories')}>
            <ViewGrid /> Categories <span>{categories.length}/{MAX_SCOPE_CATEGORIES}</span>
          </button>
        </div>

        <label className="eko-picker-search">
          <Search />
          <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tab === 'mdas' ? 'Search ministries & agencies' : 'Search categories'} />
        </label>

        <div className="eko-picker-list">
          {!live && <div className="eko-picker-empty">Loading…</div>}

          {live && !live.mdas.length && !live.categories.length && (
            <div className="eko-picker-empty">
              We couldn’t load the directory right now.
              <br />
              <button type="button" className="eko-text-btn retry" onClick={onRetry}>
                Try again
              </button>
            </div>
          )}

          {live && (live.mdas.length > 0 || live.categories.length > 0) && tab === 'mdas' && (
            <>
              {mdaRows.rows.map((m) => {
                const on = mdas.some((x) => x.id === m.id);
                const blocked = !on && mdaFull;
                return (
                  <button type="button" key={m.id} className={`eko-row ${on ? 'on' : ''}`} disabled={blocked} onClick={() => toggleMda(m)} role="checkbox" aria-checked={on}>
                    <span className="eko-check">{on && <Check strokeWidth={3} />}</span>
                    <span className="eko-row-main">
                      <span className="eko-row-name">{m.name}</span>
                      {(TYPE_LABEL[m.type] || m.subdomain) && (
                        <span className="eko-row-meta">{[TYPE_LABEL[m.type], m.subdomain && !m.subdomain.includes('.') ? m.subdomain : ''].filter(Boolean).join(' · ')}</span>
                      )}
                    </span>
                  </button>
                );
              })}
              {mdaRows.rows.length === 0 && <div className="eko-picker-empty">No ministry or agency matches “{query}”.</div>}
              {mdaRows.hidden > 0 && <div className="eko-picker-more">Search to find {mdaRows.hidden} more…</div>}
            </>
          )}

          {live && (live.mdas.length > 0 || live.categories.length > 0) && tab === 'categories' && (
            <>
              {categoryRows.map((c) => {
                const on = categories.some((x) => x.formattedName === c.formattedName);
                const blocked = !on && catFull;
                return (
                  <button type="button" key={c.formattedName} className={`eko-row ${on ? 'on' : ''}`} disabled={blocked} onClick={() => toggleCategory(c)} role="checkbox" aria-checked={on}>
                    <span className="eko-check">{on && <Check strokeWidth={3} />}</span>
                    <span className="eko-row-main">
                      <span className="eko-row-name">{c.name}</span>
                    </span>
                  </button>
                );
              })}
              {categoryRows.length === 0 && <div className="eko-picker-empty">No category matches “{query}”.</div>}
            </>
          )}
        </div>

        <div className="eko-picker-foot">
          <span className="eko-picker-hint">
            {tab === 'mdas' && mdaFull ? `You can pick up to ${MAX_SCOPE_MDAS} MDAs.` : tab === 'categories' && catFull ? `You can pick up to ${MAX_SCOPE_CATEGORIES} categories.` : total ? `${total} selected` : 'Nothing selected — searching everything.'}
          </span>
          <div className="eko-picker-actions">
            {total > 0 && (
              <button type="button" className="eko-text-btn" onClick={() => onChange({ mdas: [], categories: [] })}>
                Clear
              </button>
            )}
            <button type="button" className="eko-btn-dark" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
