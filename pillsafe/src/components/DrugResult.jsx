import { useState } from "react";
import { styles, SEV_COLOR } from "../constants";

const TABS = ["Overview", "Side Effects", "Age & Dose", "Interactions"];

/**
 * Resolve a drug field that can be:
 *  - a plain string:                 "Some text"
 *  - a multilingual object:          { en: "...", am: "...", or: "..." }
 *  - an array of strings:            ["item1", "item2"]
 *  - a multilingual array object:    { en: [...], am: [...], or: [...] }
 *
 * Always returns a string or array in the requested language, falling back to English.
 */
function resolve(field, lang) {
  if (!field) return "";

  // Plain string — no translation needed
  if (typeof field === "string") return field;

  // Array — already in the right format (local drugDB)
  if (Array.isArray(field)) return field;

  // Multilingual object — pick the right language
  const value = field[lang] || field["en"] || field["am"] || Object.values(field)[0] || "";

  // The resolved value itself might be an array
  return value;
}

/** Render a field that could be a string or array of strings. */
function FieldText({ field, lang, style }) {
  const value = resolve(field, lang);
  if (Array.isArray(value)) {
    return <p style={style}>{value.join(" · ")}</p>;
  }
  return <p style={style}>{value}</p>;
}

/** Render stop warnings as a list — works for both string and array. */
function WarningList({ field, lang }) {
  const value = resolve(field, lang);
  if (Array.isArray(value)) {
    return (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        {value.map((w, i) => (
          <li key={i} style={{ fontSize: 13, color: "#A32D2D", padding: "2px 0" }}>{w}</li>
        ))}
      </ul>
    );
  }
  // Plain string from OpenFDA — split on sentence boundaries for readability
  const sentences = value.split(/\.\s+/).filter(Boolean);
  return (
    <ul style={{ paddingLeft: 16, margin: 0 }}>
      {sentences.slice(0, 5).map((s, i) => (
        <li key={i} style={{ fontSize: 13, color: "#A32D2D", padding: "2px 0" }}>{s.trim()}.</li>
      ))}
    </ul>
  );
}

/** Render side effects as tags — works for both string and array. */
function SideEffectTags({ field, lang }) {
  const value = resolve(field, lang);
  if (Array.isArray(value)) {
    return (
      <div style={styles.tagList}>
        {value.map((s, i) => <span key={i} style={styles.tagAmber}>{s}</span>)}
      </div>
    );
  }
  // Plain string — split into chunks
  const items = value.split(/[,;]\s*/).filter(s => s.length > 3);
  return (
    <div style={styles.tagList}>
      {items.slice(0, 8).map((s, i) => (
        <span key={i} style={styles.tagAmber}>{s.trim()}</span>
      ))}
    </div>
  );
}

export default function DrugResult({ drug, lang }) {
  const [tab, setTab] = useState(1);

  // ageSpecs may come from local DB (nested object with child/adult/elderly)
  // or not exist at all when coming from OpenFDA
  const hasAgeSpecs = drug.ageSpecs && (drug.ageSpecs.child || drug.ageSpecs.adult || drug.ageSpecs.elderly);

  // interactions may be an array (local DB) or a plain string (OpenFDA)
  const interactionsIsArray = Array.isArray(drug.interactions);

  return (
    <div style={styles.drugCard}>
      {/* Header */}
      <div style={styles.drugHeader}>
        <div style={styles.drugName}>{drug.name}</div>
        <div style={styles.drugGeneric}>{drug.generic}</div>
        <div style={styles.badgesRow}>
          {drug.rx
            ? <span style={styles.badgeRx}>Rx Required</span>
            : <span style={styles.badgeOtc}>Over the Counter</span>
          }
          <span style={styles.badgeCaution}>Check interactions</span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={styles.tabs}>
        {TABS.map((label, i) => (
          <button
            key={i}
            style={{ ...styles.tabBase, ...(tab === i + 1 ? styles.tabActive : {}) }}
            onClick={() => setTab(i + 1)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 1 && (
        <div>
          <div style={styles.drugSection}>
            <div style={styles.sectionTitle}>✅ What it treats</div>
            <FieldText
              field={drug.purpose}
              lang={lang}
              style={{ fontSize: 14, color: "#5F5E5A", lineHeight: 1.7 }}
            />
          </div>

          <div style={styles.drugSection}>
            <div style={styles.sectionTitle}>⛔ When to stop immediately</div>
            <div style={styles.warningBox}>
              <div style={styles.warningTitle}>Stop and seek help if you notice:</div>
              <WarningList field={drug.stopWarnings} lang={lang} />
            </div>
          </div>

          <div style={styles.drugSectionLast}>
            <div style={styles.disclaimer}>
              <div style={styles.disclaimerTitle}>⚕️ Important reminder</div>
              <div style={styles.disclaimerText}>
                <FieldText field={drug.disclaimer} lang={lang} style={{ display: "inline" }} />
                <br /><br />
                Always consult a licensed pharmacist or doctor before taking this medicine. This app provides information only and is not medical advice.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Effects tab */}
      {tab === 2 && (
        <div style={styles.drugSection}>
          <div style={styles.sectionTitle}>⚠️ Common side effects</div>
          <SideEffectTags field={drug.sideEffects} lang={lang} />
        </div>
      )}

      {/* Age & Dose tab */}
      {tab === 3 && (
        <div style={styles.drugSection}>
          <div style={styles.sectionTitle}>👥 Age & Dosage Specifications</div>
          {hasAgeSpecs ? (
            [["👶 Children", "child"], ["🧑 Adults", "adult"], ["👴 Elderly", "elderly"]].map(([label, key]) => (
              drug.ageSpecs[key] && (
                <div key={key} style={styles.infoItem}>
                  <div style={styles.infoLabel}>{label}</div>
                  <div style={styles.infoValue}>
                    {resolve(drug.ageSpecs[key], lang)}
                  </div>
                </div>
              )
            ))
          ) : (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Dosage</div>
              <div style={styles.infoValue}>
                <FieldText field={drug.dosage} lang={lang} style={{ fontSize: 13, color: "#1a1916" }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactions tab */}
      {tab === 4 && (
        <div style={styles.drugSection}>
          <div style={styles.sectionTitle}>🚫 Do not mix with</div>
          {interactionsIsArray ? (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                {[["High risk", "high"], ["Medium", "med"], ["Low", "low"]].map(([label, sev]) => (
                  <span key={sev} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#888780" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: SEV_COLOR[sev], display: "inline-block" }} />
                    {label}
                  </span>
                ))}
              </div>
              {drug.interactions.map((item, i) => (
                <div
                  key={i}
                  style={{ ...styles.interactionItem, borderBottom: i < drug.interactions.length - 1 ? "1px solid #E5E3DC" : "none" }}
                >
                  <div style={{ ...styles.sevDot, background: SEV_COLOR[item.sev] }} />
                  <div>
                    <div style={styles.interactionDrug}>{item.drug}</div>
                    <div style={styles.interactionDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <FieldText
              field={drug.interactions}
              lang={lang}
              style={{ fontSize: 13, color: "#5F5E5A", lineHeight: 1.7 }}
            />
          )}
        </div>
      )}
    </div>
  );
}
