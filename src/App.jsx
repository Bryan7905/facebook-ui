import React, { useEffect, useState } from 'react';
import { getPosts, createPost, updatePost, deletePost } from './api';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // post being edited or null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const created = await createPost(payload);
      setPosts((p) => [created, ...p]);
      return true;
    } catch (e) {
      setError('Create failed');
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await updatePost(id, payload);
      setPosts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
      return true;
    } catch (e) {
      setError('Update failed');
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      setError('Delete failed');
    }
  };

  return (
    <div className="container">
      <h1>Posts</h1>
      {error && <div className="error">{error}</div>}

      <section className="form-section">
        <h2>{editing ? 'Edit Post' : 'Create Post'}</h2>
        <PostForm
          initialData={editing}
          onSave={async (data) => {
            if (editing) {
              const ok = await handleUpdate(editing.id, data);
              if (ok) setEditing(null);
            } else {
              await handleCreate(data);
            }
          }}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section className="list-section">
        <h2>All Posts</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <PostList
            posts={posts}
            onEdit={(post) => setEditing(post)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </section>
    </div>
  );
}