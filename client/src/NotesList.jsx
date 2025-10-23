import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import './NotesList.css';

export default function NotesList({ apiBase = "http://localhost:8080", userId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal + form state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const api = useMemo(() => axios.create({ baseURL: apiBase }), [apiBase]);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/notes"); 
      setNotes(data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadNotes();
    })();
    return () => { cancelled = true; };
  }, [loadNotes]);

  async function handleCreateNote(e) {
    e.preventDefault();
    if (!userId) {
      setPostError("No user id found.");
      return;
    }
    setPosting(true);
    setPostError(null);
    try {
      const { data: created } = await api.post("/notes", {
        user_id: userId,
        title,
        body,
      });

      // fallback: just reload all notes.
      if (created && created.id) {
        setNotes(prev => [created, ...prev]);
      } else {
        await loadNotes();
      }

      // reset & close
      setTitle("");
      setBody("");
      setOpen(false);
    } catch (e) {
      setPostError(e?.response?.data?.error || e.message || "Failed to create note");
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <div>Loading notes…</div>;
  if (error) return <div style={{ color: "#c00" }}>{error}</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Your Notes</h2>
      </div>

      {notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        notes.map(n => (
          <article key={n.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ margin: 0 }}>{n.title}</h3>
            <p style={{ whiteSpace: "pre-wrap", fontSize:"20px" }}>{n.body}</p>
            <small style={{ fontSize:"12px"}}>{new Date(n.created_at).toLocaleString()}</small>

    <div style={{ marginTop: 8 }}>
      <button
        onClick={async () => {
          try {
            await api.delete(`/notes/${n.id}`);           // hits DELETE /notes/:id
            setNotes(prev => prev.filter(x => x.id !== n.id)); 
          } catch (e) {
            alert(e?.response?.data?.error || 'Delete failed');
          }
        }}
        style={{ border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
      >
        Delete
      </button>
    </div>

          </article>
        ))
      )}

      <div style={{ marginTop: 16}}>
        <button onClick={() => setOpen(true)} className = "primaryBtn">Add Note</button>
      </div>

      {/* Modal */}
      {open && (
        <div className="overlayStyle" onClick={() => setOpen(false)}>
          <div className="cardStyle" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="closeBtnStyle">✕</button>
            <h3 style={{ marginTop: 0 }}>Add a Note</h3>
            <form onSubmit={handleCreateNote} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                className="inputStyle"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="inputStyleText"
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
              {postError && <div style={{ color: "#c00", fontSize: 14 }}>{postError}</div>}
              <button type="submit" disabled={posting} className="primaryBtn">
                {posting ? "Posting…" : "Post Note"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}