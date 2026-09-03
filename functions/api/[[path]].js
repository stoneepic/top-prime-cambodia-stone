// Cloudflare Pages Functions backend for the TOP PRIME STONE admin.
// Deploy with these environment variables / secrets on the Pages project:
//   ADMIN_PASSWORD  — the admin panel password (must match the SPA's VITE_ADMIN_PASSWORD)
//   GITHUB_TOKEN    — a fine-grained PAT with Contents:Read/Write on the repo
//   GITHUB_OWNER    — repository owner, e.g. "yourname"
//   GITHUB_REPO     — repository name, e.g. "top-prime-cambodia-stone"
//   GITHUB_BRANCH   — branch to commit to (default "main")
//
// Routes:
//   POST /api/save     { content } — commits public/content.json and triggers a redeploy
//   POST /api/upload   multipart "file" — uploads a picture to public/assets/uploads/

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const unauthorized = () => json({ error: '未授权' }, 401);

async function gh(token, path, options = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'top-prime-admin',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub ${res.status}: ${text.slice(0, 300)}`);
  }
  return res;
}

// Write text content.json via the Contents API (creates or updates a single file).
async function commitContentJson(token, owner, repo, branch, contentString, message) {
  const base64 = Buffer.from(contentString, 'utf8').toString('base64');
  const filePath = 'public/content.json';
  let existingSha = null;
  try {
    const get = await gh(token, `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);
    const info = await get.json();
    existingSha = info.sha;
  } catch {
    existingSha = null; // file doesn't exist yet
  }
  const res = await gh(token, `/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: base64,
      branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });
  return res.json();
}

// Upload a binary image via Git Blob + Git Tree + Create Commit + Update Ref.
async function commitUploadedFile(token, owner, repo, branch, repoPath, bytes) {
  const blobRes = await gh(token, `/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: bytes.toString('base64'), encoding: 'base64' }),
  });
  const blob = await blobRes.json();

  const headRes = await gh(token, `/repos/${owner}/${repo}/git/refs/heads/${branch}`);
  const head = await headRes.json();

  const treeRes = await gh(token, `/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: head.object.sha,
      tree: [{ path: repoPath, mode: '100644', type: 'blob', sha: blob.sha }],
    }),
  });
  const tree = await treeRes.json();

  const commitRes = await gh(token, `/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `Admin: upload ${repoPath}`,
      tree: tree.sha,
      parents: [head.object.sha],
    }),
  });
  const commit = await commitRes.json();

  await gh(token, `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const password = env.ADMIN_PASSWORD;
  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) return json({ error: '服务器未配置 GitHub（缺 GITHUB_TOKEN/OWNER/REPO）' }, 500);

  const url = new URL(request.url);
  const headerPass = request.headers.get('X-Admin-Password');
  if (!password || headerPass !== password) return unauthorized();

  try {
    if (url.pathname.endsWith('/api/save')) {
      const body = await request.json().catch(() => ({}));
      if (!body.content) return json({ error: '缺少内容' }, 400);
      const contentString = JSON.stringify(body.content, null, 2) + '\n';
      await commitContentJson(token, owner, repo, branch, contentString, 'Admin: update content.json');
      return json({ ok: true, content: body.content, message: '已提交，Cloudflare 正在重新部署' });
    }

    if (url.pathname.endsWith('/api/upload')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') return json({ error: '缺少文件' }, 400);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const repoPath = `public/assets/uploads/${Date.now()}-${safeName}`;
      const bytes = Buffer.from(await file.arrayBuffer());
      await commitUploadedFile(token, owner, repo, branch, repoPath, bytes);
      return json({ ok: true, path: `/assets/uploads/${repoPath.split('/').pop()}` });
    }

    return json({ error: '未知接口' }, 404);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// Pages Functions exports the method handlers directly; Cloudflare routes
// each request to the matching handler (POST -> onRequestPost, OPTIONS -> onRequestOptions).
export async function onRequestOptions(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
  };
  return new Response(null, { status: 204, headers });
}
