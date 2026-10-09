import { useEffect, useState } from "react";
import {
  applyReviewAction,
  fetchReviewItems,
  type ReviewAction,
  type ReviewItem
} from "./api";

const currentReviewer = "alex";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function App() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null);

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  async function loadItems() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const loaded = await fetchReviewItems();
      const next = loaded.find((item) => item.id === selectedId) ?? loaded[0] ?? null;
      setItems(loaded);
      setSelectedId(next?.id ?? null);
    } catch (error) {
      setErrorMessage("Something went wrong loading the queue.");
    } finally {
      setIsLoading(false);
    }
  }

  async function performAction(action: ReviewAction) {
    if (!selectedItem) return;

    setPendingAction(action);
    setErrorMessage(null);

    try {
      const updated = await applyReviewAction(selectedItem.id, action, currentReviewer);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (error) {
      setErrorMessage("That action could not be completed.");
    } finally {
      setPendingAction(null);
    }
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Reviewer workspace</p>
          <h1>Active queue</h1>
        </div>
        <div className="reviewer">Signed in as {currentReviewer}</div>
      </header>

      {errorMessage && <p className="error-banner">{errorMessage}</p>}
      {isLoading ? (
        <p className="loading">Loading review items...</p>
      ) : (
        <section className="workspace">
          <aside className="queue-list" aria-label="Review queue">
            {items.map((item) => (
              <button
                key={item.id}
                className={`queue-item${item.id === selectedItem?.id ? " selected" : ""}`}
                type="button"
                onClick={() => setSelectedId(item.id)}
              >
                <span className="queue-title">{item.title}</span>
                <span className="queue-meta">
                  {item.risk_level} risk · {item.customer_tier}
                </span>
                <span className="queue-meta">
                  {item.status} · {item.assigned_reviewer ?? "unassigned"}
                </span>
              </button>
            ))}
          </aside>

          {selectedItem && (
            <section className="detail-panel">
              <div className="detail-header">
                <div>
                  <p className="eyebrow">{selectedItem.id}</p>
                  <h2>{selectedItem.title}</h2>
                </div>
                <span className="status-pill">{selectedItem.status}</span>
              </div>

              <dl className="facts">
                <div>
                  <dt>Submitted</dt>
                  <dd>{formatDate(selectedItem.submitted_at)}</dd>
                </div>
                <div>
                  <dt>Risk</dt>
                  <dd>{selectedItem.risk_level}</dd>
                </div>
                <div>
                  <dt>Customer</dt>
                  <dd>{selectedItem.customer_tier}</dd>
                </div>
                <div>
                  <dt>Assignee</dt>
                  <dd>{selectedItem.assigned_reviewer ?? "None"}</dd>
                </div>
              </dl>

              <p className="summary">{selectedItem.summary}</p>
              <p className="notes">{selectedItem.notes_count} notes on this item</p>

              <div className="actions" aria-label="Workflow actions">
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={() => performAction("claim")}
                >
                  Claim
                </button>
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={() => performAction("approve")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={() => performAction("reject")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={Boolean(pendingAction)}
                  onClick={() => performAction("escalate")}
                >
                  Escalate
                </button>
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
