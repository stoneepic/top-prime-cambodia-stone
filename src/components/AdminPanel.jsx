import { useEffect, useMemo, useState } from 'react';

const LOCAL_OVERRIDE_KEY = 'tps-content-override';
const PASSWORD_KEY = 'tps-admin-session';
// 部署时通过 Cloudflare Pages 环境变量 VITE_ADMIN_PASSWORD 覆盖；留空则用此默认值（仅本地预览）。
const DEFAULT_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'topprime2026';
const API_BASE = '/api';

function readLocalOverride() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_OVERRIDE_KEY) || 'null');
  } catch {
    return null;
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setAtPath(obj, path, value) {
  const clone = deepClone(obj);
  let cursor = clone;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (cursor[key] === undefined) cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
  return clone;
}

function LanguageEditor({ contentStore, lang, onChange }) {
  const c = contentStore[lang];
  const set = (path, value) => onChange(lang, path, value);

  const rawField = (path, value, textarea) => (
    <label className="admin-field" key={path.join('.')}>
      <span>{path.join(' · ')}</span>
      {textarea ? (
        <textarea rows="3" value={value ?? ''} onChange={(e) => set(path, e.target.value)} />
      ) : (
        <input value={value ?? ''} onChange={(e) => set(path, e.target.value)} />
      )}
    </label>
  );

  // Walk the whole language object and collect every string leaf as a field.
  const fields = [];
  const walk = (node, path) => {
    if (typeof node === 'string') {
      fields.push({ path, value: node });
    } else if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, [...path, String(i)]));
    } else if (node && typeof node === 'object') {
      Object.entries(node).forEach(([k, v]) => walk(v, [...path, k]));
    }
  };
  walk(c, []);

  const groups = {
    '导航 · nav': fields.filter((f) => f.path[0] === 'nav'),
    '顶部 · hero': fields.filter((f) => f.path[0] === 'hero'),
    '能力 · capabilities': fields.filter((f) => f.path[0] === 'capabilities'),
    '区块标签 · sectionLabels': fields.filter((f) => f.path[0] === 'sectionLabels'),
    '区块标题 · sectionTitles': fields.filter((f) => f.path[0] === 'sectionTitles'),
    '石材 · materials': fields.filter((f) => f.path[0] === 'materials'),
    '产品 · products': fields.filter((f) => f.path[0] === 'products'),
    '矿山 · quarry': fields.filter((f) => f.path[0] === 'quarry'),
    '工厂 · factory': fields.filter((f) => f.path[0] === 'factory'),
    '关于 · about': fields.filter((f) => f.path[0] === 'about'),
    '联系 · contact': fields.filter((f) => f.path[0] === 'contact'),
    '表单 · form': fields.filter((f) => f.path[0] === 'form'),
    '页脚 · footer': fields.filter((f) => f.path[0] === 'footer'),
    '品牌 · brand': fields.filter((f) => f.path[0] === 'brand'),
    '语言 · langCode': fields.filter((f) => f.path[0] === 'langCode'),
  };

  return (
    <div className="admin-lang">
      <h4>{lang.toUpperCase()} · {lang === 'en' ? 'English' : '中文'} · 全部文字</h4>
      {Object.entries(groups).map(([group, groupFields]) => {
        if (groupFields.length === 0) return null;
        return (
          <fieldset className="admin-group" key={group}>
            <legend>{group}</legend>
            {groupFields.map(({ path, value }) => {
              const isLong = value?.length > 60;
              return rawField(path, value, isLong);
            })}
          </fieldset>
        );
      })}
    </div>
  );
}

function ProductGroupsEditor({ contentStore, lang, onChange }) {
  const groups = contentStore[lang]?.products?.groups || [];

  const updateGroup = (gIndex, field, value) => {
    const next = groups.map((g, i) => (i === gIndex ? { ...g, [field]: value } : g));
    onChange(lang, ['products', 'groups'], next);
  };

  const updateImage = (gIndex, iIndex, field, value) => {
    const next = groups.map((g, i) => {
      if (i !== gIndex) return g;
      const images = g.images.map((img, j) => (j === iIndex ? { ...img, [field]: value } : img));
      return { ...g, images };
    });
    onChange(lang, ['products', 'groups'], next);
  };

  const addImage = (gIndex) => {
    const next = groups.map((g, i) =>
      i === gIndex ? { ...g, images: [...g.images, { image: '', alt: '' }] } : g,
    );
    onChange(lang, ['products', 'groups'], next);
  };

  const removeImage = (gIndex, iIndex) => {
    const next = groups.map((g, i) =>
      i === gIndex ? { ...g, images: g.images.filter((_, j) => j !== iIndex) } : g,
    );
    onChange(lang, ['products', 'groups'], next);
  };

  const addGroup = () => {
    onChange(lang, ['products', 'groups'], [
      ...groups,
      { id: `group-${Date.now()}`, title: '', images: [] },
    ]);
  };

  const removeGroup = (gIndex) => {
    onChange(lang, ['products', 'groups'], groups.filter((_, i) => i !== gIndex));
  };

  return (
    <div className="admin-items">
      <div className="admin-items__header">
        <span>{groups.length} 组</span>
        <button type="button" className="admin-btn" onClick={addGroup}>+ 新增分组</button>
      </div>
      {groups.map((group, gIndex) => (
        <div className="admin-item" key={group.id || gIndex}>
          <div className="admin-item__bar">
            <strong>#{gIndex + 1}</strong>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeGroup(gIndex)}>删除该组</button>
          </div>
          <label className="admin-field">
            <span>分组名称</span>
            <input value={group.title} onChange={(e) => updateGroup(gIndex, 'title', e.target.value)} />
          </label>
          <div className="admin-images">
            <span>图片（{group.images.length} 张）</span>
            {group.images.map((img, iIndex) => (
              <div className="admin-item" key={iIndex}>
                <div className="admin-image-row">
                  {img.image && <img src={img.image} alt="" className="admin-thumb" />}
                  <input
                    value={img.image ?? ''}
                    placeholder="/assets/…"
                    onChange={(e) => updateImage(gIndex, iIndex, 'image', e.target.value)}
                  />
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeImage(gIndex, iIndex)}>删</button>
                </div>
                <input
                  value={img.alt ?? ''}
                  placeholder="图片说明 alt"
                  onChange={(e) => updateImage(gIndex, iIndex, 'alt', e.target.value)}
                />
              </div>
            ))}
            <button type="button" className="admin-btn" onClick={() => addImage(gIndex)}>+ 添加图片</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemsEditor({ contentStore, lang, kind, onChange }) {
  const c = contentStore[lang];
  // materials/quarry/factory are arrays; products lives under products.items
  const itemPath = kind === 'products' ? ['products', 'items'] : [kind];
  const items = itemPath.reduce((acc, p) => acc?.[p], c) || [];
  const isMaterials = kind === 'materials';
  const isTrack = kind === 'factory';
  const isQuarry = kind === 'quarry';

  const updateItem = (index, field, value) => {
    const next = items.map((it, i) => (i === index ? { ...it, [field]: value } : it));
    onChange(lang, itemPath, next);
  };

  const addItem = () => {
    const blank = isMaterials
      ? { id: `new-${Date.now()}`, image: '', name: '', description: '', application: '', alt: '' }
      : isTrack
        ? { id: `new-${Date.now()}`, label: String(items.length + 1), title: '', description: '', image: '', alt: '' }
        : isQuarry
          ? { id: `new-${Date.now()}`, image: '', alt: '' }
          : { title: '', description: '', image: '', alt: '' };
    onChange(lang, itemPath, [...items, blank]);
  };

  const removeItem = (index) => {
    onChange(lang, itemPath, items.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(lang, itemPath, next);
  };

  return (
    <div className="admin-items">
      <div className="admin-items__header">
        <span>{items.length} 项</span>
        <button type="button" className="admin-btn" onClick={addItem}>+ 新增</button>
      </div>
      {items.map((item, i) => (
        <div className="admin-item" key={item.id || i}>
          <div className="admin-item__bar">
            <strong>#{i + 1}</strong>
            <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}>↓</button>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeItem(i)}>删除</button>
          </div>
          {item.name !== undefined && (
            <label className="admin-field">
              <span>名称</span>
              <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} />
            </label>
          )}
          {item.title !== undefined && (
            <label className="admin-field">
              <span>标题</span>
              <input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
            </label>
          )}
          {item.description !== undefined && (
            <label className="admin-field">
              <span>描述</span>
              <textarea rows="2" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
            </label>
          )}
          {item.application !== undefined && (
            <label className="admin-field">
              <span>应用</span>
              <input value={item.application} onChange={(e) => updateItem(i, 'application', e.target.value)} />
            </label>
          )}
          <label className="admin-field admin-field--image">
            <span>图片</span>
            <div className="admin-image-row">
              {item.image && <img src={item.image} alt="" className="admin-thumb" />}
              <input
                value={item.image ?? ''}
                placeholder="/assets/…"
                onChange={(e) => updateItem(i, 'image', e.target.value)}
              />
            </div>
          </label>
        </div>
      ))}
      {items.length === 0 && <p className="admin-empty">暂无内容</p>}
    </div>
  );
}

export default function AdminPanel({ contentStore, onApplyLocal }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PASSWORD_KEY) === '1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(() => readLocalOverride() || contentStore);
  const [lang, setLang] = useState('en');
  const [section, setSection] = useState('text');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  // Keep draft in sync if the parent content is replaced externally.
  useEffect(() => {
    if (!authed) return;
    const local = readLocalOverride();
    if (!local) setDraft(contentStore);
  }, [authed, contentStore]);

  const draftStore = useMemo(() => ({ ...draft }), [draft]);

  const handleChange = (language = lang, path = [], value) => {
    setDraft((prev) => {
      const nextLang = setAtPath(prev[language] || {}, path, value);
      const next = { ...prev, [language]: nextLang };
      return next;
    });
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (password === DEFAULT_PASSWORD) {
      sessionStorage.setItem(PASSWORD_KEY, '1');
      setAuthed(true);
      setError('');
    } else {
      setError('密码不正确');
    }
  };

  const handleSave = async (mode) => {
    setSaving(true);
    setNotice('');
    try {
      if (mode === 'github') {
        // 云端保存：调用 Cloudflare Pages Function，提交到 GitHub 并自动触发部署。
        const res = await fetch(`${API_BASE}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password || DEFAULT_PASSWORD },
          body: JSON.stringify({ content: draft }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `保存失败 (${res.status})`);
        setNotice('已提交到云端，Cloudflare 正在重新构建部署（约 1–2 分钟生效）。');
        setDraft(data.content || draft);
      } else {
        // 本地预览保存：写入当前浏览器 localStorage，刷新即可预览。
        localStorage.setItem(LOCAL_OVERRIDE_KEY, JSON.stringify(draft));
        onApplyLocal(draftStore);
        setNotice('已保存到本机预览。刷新网站即可看到效果（仅当前浏览器）。');
      }
    } catch (err) {
      setNotice(`错误：${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <form onSubmit={handlePassword}>
          <h1>后台管理</h1>
          <p>请输入管理密码</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="密码"
          />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary">登录</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-topbar">
        <h1>TOP PRIME STONE · 后台管理</h1>
        <div className="admin-topbar__actions">
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              setSaving(false);
              setNotice('重置为最近保存的内容');
              setDraft(readLocalOverride() || contentStore);
            }}
          >
            重置
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => { window.location.hash = '#/'; }}
          >
            返回网站
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        {[['text', '文字'], ['images', '图片'], ['lists', '列表']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`admin-tab ${section === key ? 'admin-tab--active' : ''}`}
            onClick={() => setSection(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-lang-tabs">
        {['en', 'zh'].map((key) => (
          <button
            key={key}
            type="button"
            className={`admin-lang-tab ${lang === key ? 'admin-lang-tab--active' : ''}`}
            onClick={() => setLang(key)}
          >
            {key === 'en' ? 'English' : '中文'}
          </button>
        ))}
      </div>

      <div className="admin-body">
        {section === 'text' && (
          <LanguageEditor contentStore={draftStore} lang={lang} onChange={handleChange} />
        )}

        {section === 'lists' && (
          <div className="admin-lists">
            {[
              ['materials', '石材 Materials'],
              ['quarry', '矿山 Quarry'],
              ['factory', '工厂 Factory'],
            ].map(([kind, legend]) => (
              <fieldset className="admin-group" key={kind}>
                <legend>{legend}</legend>
                <ItemsEditor contentStore={draftStore} lang={lang} kind={kind} onChange={handleChange} />
              </fieldset>
            ))}
            <fieldset className="admin-group">
              <legend>产品 Products（四组幻灯片）</legend>
              <ProductGroupsEditor contentStore={draftStore} lang={lang} onChange={handleChange} />
            </fieldset>
          </div>
        )}

        {section === 'images' && (
          <div className="admin-images">
            <p className="admin-hint">
              图片说明：把图片文件放进 <code>public/assets/</code> 后，在上方「文字 / 列表」中把路径填成
              <code>/assets/你的文件名.jpg</code>。云端版可通过右上角「保存到云端」把文件一起提交。
            </p>
            <AdminImageUploader
              lang={lang}
              password={password}
              onUploaded={(path) => setNotice(`图片已上传：${path}`)}
            />
          </div>
        )}
      </div>

      <footer className="admin-footer">
        <div className="admin-save">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={saving}
            onClick={() => handleSave('github')}
          >
            {saving ? '保存中…' : '保存到云端'}
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={saving}
            onClick={() => handleSave('local')}
          >
            本机预览保存
          </button>
        </div>
        {notice && <p className={`admin-notice ${notice.startsWith('错误') ? 'admin-notice--error' : ''}`}>{notice}</p>}
      </footer>

      <style>{`
        .admin-login { min-height: 100vh; display: grid; place-items: center; background: #131414; color: #f1eee7; }
        .admin-login form { background: #1c1d1b; padding: 40px; border-radius: 8px; display: grid; gap: 14px; width: min(92vw, 360px); }
        .admin-login input, .admin-topbar * { font-family: inherit; }
        .admin { background: #151616; color: #f1eee7; min-height: 100vh; padding: 0 0 80px; }
        .admin a { color: inherit; }
        .admin-topbar { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #2c2e2a; position: sticky; top: 0; background: #131414; z-index: 5; }
        .admin-topbar h1 { font-size: 1.1rem; margin: 0; letter-spacing: .04em; }
        .admin-topbar__actions { display: flex; gap: 10px; }
        .admin-tabs, .admin-lang-tabs { display: flex; gap: 8px; padding: 14px 24px 0; }
        .admin-tab, .admin-lang-tab { background: #202220; border: 1px solid transparent; color: #cfd0cb; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .admin-tab--active, .admin-lang-tab--active { background: #b98956; color: #131414; font-weight: 700; }
        .admin-lang-tabs { padding-top: 8px; }
        .admin-body { padding: 20px 24px; display: grid; gap: 24px; max-width: 1200px; }
        .admin-group { border: 1px solid #2c2e2a; border-radius: 6px; padding: 16px; display: grid; gap: 10px; background: #1c1d1b; }
        .admin-group legend { color: #b98956; font-weight: 700; padding: 0 6px; }
        .admin-field { display: grid; gap: 4px; font-size: .85rem; }
        .admin-field > span { color: #9a9d95; }
        .admin-field input, .admin-field textarea, .admin-field select { background: #131414; border: 1px solid #32352f; color: #f1eee7; border-radius: 4px; padding: 8px 10px; width: 100%; box-sizing: border-box; }
        .admin-image-row { display: flex; align-items: center; gap: 10px; }
        .admin-thumb { width: 72px; height: 54px; object-fit: cover; border-radius: 4px; border: 1px solid #32352f; background: #000; }
        .admin-items__header { display: flex; justify-content: space-between; align-items: center; }
        .admin-item { border: 1px dashed #3a3d36; padding: 12px; border-radius: 6px; display: grid; gap: 8px; }
        .admin-item__bar { display: flex; align-items: center; gap: 8px; }
        .admin-btn { background: #2a2c28; border: 1px solid #3a3d36; color: #f1eee7; border-radius: 4px; padding: 8px 14px; cursor: pointer; }
        .admin-btn--primary { background: #b98956; border-color: #b98956; color: #131414; font-weight: 700; }
        .admin-btn--danger { background: #4a1f1f; border-color: #6b2d2d; }
        .admin-btn:disabled { opacity: .5; cursor: not-allowed; }
        .admin-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #131414; border-top: 1px solid #2c2e2a; padding: 14px 24px; display: flex; gap: 16px; align-items: center; }
        .admin-save { display: flex; gap: 10px; }
        .admin-notice { margin: 0; color: #9fe3a0; }
        .admin-notice--error { color: #e3a09f; }
        .admin-error { color: #e3a09f; margin: 0; }
        .admin-empty { color: #6b6e66; }
        .admin-hint { color: #9a9d95; line-height: 1.6; }
        .admin-hint code, .admin-images code { background: #202220; padding: 1px 6px; border-radius: 3px; color: #d8b98a; }
      `}</style>
    </div>
  );
}

function AdminImageUploader({ onUploaded, password }) {
  const [status, setStatus] = useState('');
  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('上传中…');
    try {
      if (import.meta.env?.DEV) {
        // 本地开发：存到 localStorage 供预览
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem('tps-admin-upload', reader.result);
          setStatus('本地预览已保存图片');
          onUploaded?.();
        };
        reader.readAsDataURL(file);
        return;
      }
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'X-Admin-Password': password || DEFAULT_PASSWORD },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '上传失败');
      setStatus(`已上传：${data.path}`);
      onUploaded?.(data.path);
    } catch (err) {
      setStatus(`上传失败：${err.message}`);
    }
  };
  return (
    <div className="admin-images">
      <input type="file" accept="image/*" onChange={handle} />
      <p>{status}</p>
    </div>
  );
}
