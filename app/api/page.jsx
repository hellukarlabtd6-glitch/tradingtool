// NOTE: The price shown here is display-only copy. The actual amount charged comes from
// your Stripe Price (STRIPE_PRICE_ID). Edit PRICE_LABEL to match what you set in Stripe.
const PRICE_LABEL = "$19";
const PRICE_PERIOD = "/month";

const BANNERS = {
  canceled: { kind: "warn", text: "Checkout canceled — no charge was made." },
  not_paid: { kind: "warn", text: "We couldn't confirm a completed payment. Try again." },
  inactive: { kind: "warn", text: "Your subscription isn't active. Re-subscribe to continue." },
  signin: { kind: "warn", text: "Please subscribe to access the terminal." },
  checkout_failed: { kind: "err", text: "Couldn't start checkout. Check the server config and try again." },
  verify_failed: { kind: "err", text: "Payment verification failed. If you were charged, contact support." },
  missing_session: { kind: "err", text: "Missing checkout session." },
};

export default function Landing({ searchParams }) {
  const key = searchParams?.error || (searchParams?.canceled ? "canceled" : null);
  const banner = key ? BANNERS[key] : null;

  return (
    <main className="land">
      <div className="land-wrap">
        <header className="land-top">
          <span className="land-mark">SIGNAL<b>·</b>DESK</span>
          <span className="land-eyebrow">technical signal terminal</span>
        </header>

        {banner && <div className={`banner ${banner.kind}`}>{banner.text}</div>}

        <section className="hero">
          <p className="hero-kicker">CRYPTO · MULTI-INDICATOR</p>
          <h1 className="hero-h1">Read the market<br />like an instrument.</h1>
          <p className="hero-sub">
            A live terminal that runs a stack of technical detectors — trend, MACD, RSI,
            Bollinger stretch, breakouts and candlestick patterns — and fuses them into one
            explainable <b>BUY / SELL / HOLD</b> call, plotted on the chart.
          </p>
        </section>

        <section className="feats">
          <div className="feat">
            <span className="feat-n">01</span>
            <h3>Pattern stack</h3>
            <p>Seven detectors vote on every bar, each weighted by conviction.</p>
          </div>
          <div className="feat">
            <span className="feat-n">02</span>
            <h3>Explainable score</h3>
            <p>A signal gauge plus the exact patterns behind the call — no black box.</p>
          </div>
          <div className="feat">
            <span className="feat-n">03</span>
            <h3>Live data</h3>
            <p>Reads live market data, with a sample feed fallback so it never stalls.</p>
          </div>
        </section>

        <section className="pricecard">
          <div className="pricecard-left">
            <p className="price-eyebrow">FULL ACCESS</p>
            <div className="price">
              <span className="price-amt">{PRICE_LABEL}</span>
              <span className="price-per">{PRICE_PERIOD}</span>
            </div>
            <ul className="price-list">
              <li>All pairs &amp; timeframes</li>
              <li>Every indicator and pattern detector</li>
              <li>Cancel anytime from the billing portal</li>
            </ul>
          </div>
          <div className="pricecard-right">
            <form action="/api/checkout" method="POST">
              <button className="cta" type="submit">Subscribe &amp; open the terminal</button>
            </form>
            <p className="cta-note">Secure checkout via Stripe. You'll return here automatically.</p>
          </div>
        </section>

        <footer className="land-foot">
          Signals are generated from technical indicators for informational use only — not a
          prediction and not financial advice. Crypto is volatile and you can lose money. Do your
          own research.
        </footer>
      </div>
    </main>
  );
}
