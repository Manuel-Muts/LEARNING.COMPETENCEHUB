export default function SubscriptionPreviewNotice({
  content,
}: {
  content: "learning" | "past-papers";
}) {
  const description =
    content === "learning"
      ? "Choose a grade and subject to preview the learning experience. A subscription will unlock the full learning library."
      : "Browse the available subjects and paper samples. A subscription will unlock the full downloadable past-paper library.";

  return (
    <aside className="subscription-preview-notice" aria-label="Subscription preview">
      <span className="subscription-preview-lock" aria-hidden="true">🔒</span>
      <div>
        <span className="subscription-preview-label">SUBSCRIPTION PREVIEW</span>
        <h2>Full access will be included with a subscription</h2>
        <p>{description}</p>
        <span className="subscription-preview-footnote">
          Preview mode for now — payment access controls are not active yet.
        </span>
      </div>
    </aside>
  );
}
