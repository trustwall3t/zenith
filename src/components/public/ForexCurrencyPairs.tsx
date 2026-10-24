"use client";

const MAJORS = [
  "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "CAD/CHF", "CAD/JPY", "USD/CAD",
  "CHF/JPY", "EUR/CAD", "EUR/CHF", "EUR/GBP", "EUR/JPY", "GBP/CAD", "GBP/CHF", "GBP/JPY",
];
const MINORS = [
  "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "AUD/USD", "EUR/AUD", "EUR/NZD",
  "GBP/AUD", "GBP/NZD", "NZD/CAD", "NZD/CHF", "NZD/JPY", "NZD/USD",
];
const EXOTICS = [
  "EUR/NOK", "EUR/PLN", "EUR/SEK", "EUR/TRY", "USD/DKK", "USD/HUF", "USD/NOK",
  "USD/PLN", "USD/SEK", "USD/SGD", "USD/TRY", "USD/ZAR",
];

function PairList({ pairs, spread }: { pairs: string[]; spread: string }) {
  return (
    <ul className="gg-pairs">
      {pairs.map((pair) => (
        <li key={pair}>
          <strong>{pair}</strong>
          <span>{spread}</span>
        </li>
      ))}
    </ul>
  );
}

/** IDs match `home.css` (#fx-majors:checked ~ .pane-majors). Only render once per page. */
export function ForexCurrencyPairs() {
  return (
    <div className="gg-tabs">
      <input type="radio" name="fx" id="fx-majors" defaultChecked />
      <input type="radio" name="fx" id="fx-minors" />
      <input type="radio" name="fx" id="fx-exotics" />
      <div className="gg-tab-bar">
        <label htmlFor="fx-majors">FX majors</label>
        <label htmlFor="fx-minors">FX minors</label>
        <label htmlFor="fx-exotics">FX exotics</label>
      </div>
      <div className="gg-pane pane-majors">
        <PairList
          pairs={MAJORS}
          spread="Floating from 0.3 pips · $8 per lot · leverage up to 30"
        />
      </div>
      <div className="gg-pane pane-minors">
        <PairList
          pairs={MINORS}
          spread="Floating from 0.5 pips · $8 per lot · leverage up to 20"
        />
      </div>
      <div className="gg-pane pane-exotics">
        <PairList
          pairs={EXOTICS}
          spread="Floating from 1.9 pips · $8 per lot · leverage up to 20"
        />
      </div>
    </div>
  );
}
