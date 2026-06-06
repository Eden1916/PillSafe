import { useState, useRef } from "react";
import drugDB from "./data/drugDB";
import { QUICK_SEARCHES, styles } from "./constants";
import DrugResult from "./components/DrugResult";

// Switch between local dev and deployed backend automatically
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PLACEHOLDERS = {
  en: "e.g. Amoxicillin, Paracetamol, Metformin…",
  am: "ለምሳሌ አሞክሲሲሊን, ፓራሴታሞል...",
  or: "Fakk. Amoxicillin, Paracetamol...",
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null); // null | "loading" | "notfound" | drug object
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  async function doSearch(q) {
    const term = (q || query).trim();
    if (!term) return;
    setResult("loading");

    // Try the real backend first
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(term)}&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.drug);
        return;
      }
      if (res.status === 404) {
        setResult("notfound");
        return;
      }
    } catch {
      // Backend offline — fall through to local drugDB
    }

    // Local fallback
    const termLower = term.toLowerCase();
    const key = Object.keys(drugDB).find(dbKey => {
      const drug = drugDB[dbKey];
      const candidates = [
        dbKey,
        drug.name.toLowerCase(),
        drug.generic.toLowerCase(),
        ...(drug.localNames || []).map(n => n.toLowerCase()),
      ];
      return candidates.some(c => c.includes(termLower) || termLower.includes(c));
    });
    setResult(key ? drugDB[key] : "notfound");
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setPreview({ src: ev.target.result, name: file.name });
      setResult("loading");

      // Try the real backend OCR endpoint
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE}/ocr?lang=${lang}`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data.drug);
          return;
        }
        if (res.status === 404 || res.status === 422) {
          setResult("notfound");
          return;
        }
      } catch {
        // Backend offline — fall through to local random demo
      }

      // Local fallback: return a random drug as a demo
      const keys = Object.keys(drugDB);
      setResult(drugDB[keys[Math.floor(Math.random() * keys.length)]]);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #FAFAF8; }
      `}</style>

      <div style={styles.app}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.logoPill}>ዳዋ INFO</div>
          <div style={styles.tagline}>Medicine Safety for Ethiopia</div>
          <h1 style={styles.heroTitle}>
            Know what you&apos;re taking. <em style={styles.heroTitleEm}>Stay safe.</em>
          </h1>
          <p style={styles.heroSub}>
            Upload a medicine photo or search by name to get safety information in your language — before it&apos;s too late.
          </p>
          <div style={styles.langBar}>
            {[["en", "English"], ["am", "አማርኛ"], ["or", "Afaan Oromo"]].map(([code, label]) => (
              <button
                key={code}
                style={{ ...styles.langBtnBase, ...(lang === code ? styles.langBtnActive : {}) }}
                onClick={() => setLang(code)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={styles.content}>
          <div style={styles.sectionLabel}>📷 Upload Medicine Photo</div>

          {preview ? (
            <div style={{ marginBottom: 16 }}>
              <img src={preview.src} alt="Medicine" style={styles.previewImg} />
              <div style={styles.previewBar}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#085041" }}>{preview.name}</span>
                <span
                  style={{ fontSize: 12, color: "#E24B4A", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => { setPreview(null); setResult(null); }}
                >
                  ✕ Remove
                </span>
              </div>
            </div>
          ) : (
            <div
              style={styles.uploadZone}
              onClick={() => fileInputRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFile({ target: { files: e.dataTransfer.files } });
              }}
            >
              <div style={styles.uploadIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </div>
              <div style={styles.uploadTitle}>Tap to take or upload a photo</div>
              <div style={styles.uploadSub}>
                Snap the medicine label — AI will read it ·{" "}
                <span style={{ color: "#1D9E75", fontWeight: 500 }}>Browse files</span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleFile}
          />

          <div style={styles.divider}>
            <span style={{ flex: 1, height: 1, background: "#E5E3DC" }} />
            or search by name
            <span style={{ flex: 1, height: 1, background: "#E5E3DC" }} />
          </div>

          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch()}
              placeholder={PLACEHOLDERS[lang]}
            />
            <button style={styles.searchBtn} onClick={() => doSearch()}>Search →</button>
          </div>

          <div style={styles.quickSearches}>
            <span style={{ fontSize: 12, color: "#888780", alignSelf: "center" }}>Try:</span>
            {QUICK_SEARCHES.map(name => (
              <button
                key={name}
                style={styles.quickPill}
                onClick={() => { setQuery(name); doSearch(name); }}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {result === "loading" && (
            <div style={styles.loadingCard}>
              <div style={styles.spinner} />
              <div style={{ fontSize: 14, color: "#5F5E5A" }}>Searching drug database…</div>
            </div>
          )}

          {/* Not found state */}
          {result === "notfound" && (
            <div style={styles.drugCard}>
              <div style={styles.emptyState}>
                <div style={{ fontSize: 16, color: "#5F5E5A", fontWeight: 500, marginBottom: 6 }}>Medicine not found</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Try searching by generic name. For unlisted medicines, consult a licensed pharmacist.
                </div>
              </div>
            </div>
          )}

          {/* Drug result */}
          {result && result !== "loading" && result !== "notfound" && (
            <DrugResult drug={result} lang={lang} />
          )}
        </div>
      </div>
    </>
  );
}
