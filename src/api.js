const BASE = '/api/posts';

async function handleResponse(res) {
  if (!res.ok) {
    const txt = await res.text();
    let message = txt;
    try {
      const json = JSON.parse(txt);
      if (json.message) message = json.message;
    } catch (e) {}
    throw new Error(message || res.statusText);
  }
  return res.json();
}

export async function getPosts() {
  const res = await fetch(BASE);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}