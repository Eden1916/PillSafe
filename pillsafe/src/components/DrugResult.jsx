import { useState } from "react";
import { styles, SEV_COLOR } from "../constants";
import { t } from "../utils";

const TABS = ["Overview", "Side Effects", "Age & Dose", "Interactions"];

export default function DrugResult({ drug, lang }) {
  const [tab, setTab] = useState(1);

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
            <p style={{ fontSize: 14, color: "#5F5E5A", lineHeight: 1.7 }}>{t(drug.purpose, lang)}</p>
          </div>

          <div style={styles.drugSection}>
            <div style={styles.sectionTitle}>⛔ When to stop immediately</div>
            <div style={styles.warningBox}>
              <div style={styles.warningTitle}>Stop and seek help if you notice:</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {(drug.stopWarnings[lang] || drug.stopWarnings.en).map((w, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#A32D2D", padding: "2px 0" }}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={styles.drugSectionLast}>
            <div style={styles.disclaimer}>
              <div style={styles.disclaimerTitle}>⚕️ Important reminder</div>
              <div style={styles.disclaimerText}>
                {t(drug.disclaimer, lang)}
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
          <div style={styles.tagList}>
            {(drug.sideEffects[lang] || drug.sideEffects.en).map((s, i) => (
              <span key={i} style={styles.tagAmber}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Age & Dose tab */}
      {tab === 3 && (
        <div style={styles.drugSection}>
          <div style={styles.sectionTitle}>👥 Age & Dosage Specifications</div>
          {[["👶 Children", "child"], ["🧑 Adults", "adult"], ["👴 Elderly", "elderly"]].map(([label, key]) => (
            <div key={key} style={styles.infoItem}>
              <div style={styles.infoLabel}>{label}</div>
              <div style={styles.infoValue}>{drug.ageSpecs[key][lang] || drug.ageSpecs[key].en}</div>
            </div>
          ))}
        </div>
      )}

      {/* Interactions tab */}
      {tab === 4 && (
        <div style={styles.drugSection}>
          <div style={styles.sectionTitle}>🚫 Do not mix with</div>
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
        </div>
      )}
    </div>
  );
}
