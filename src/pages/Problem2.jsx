import { useState, useMemo, useEffect } from "react";
import "./Problem.css";

const getTokenIconUrl = (tokenSymbol) => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenSymbol}.svg`;
};

const PRICES_API_URL = "https://interview.switcheo.com/prices.json";

function Problem2() {
  const [prices, setPrices] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USDC");
  const [inputAmount, setInputAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [inputError, setInputError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(PRICES_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }
        const data = await response.json();

        const priceMap = {};
        const currencySet = new Set();

        data.forEach((item) => {
          const { currency, price } = item;
          currencySet.add(currency);
          if (
            !priceMap[currency] ||
            new Date(item.date) > new Date(priceMap[currency].date)
          ) {
            priceMap[currency] = { price, date: item.date };
          }
        });

        const simplifiedPrices = {};
        Object.keys(priceMap).forEach((currency) => {
          simplifiedPrices[currency] = priceMap[currency].price;
        });

        setPrices(simplifiedPrices);
        const sortedCurrencies = Array.from(currencySet).sort();
        setCurrencies(sortedCurrencies);

        if (
          sortedCurrencies.includes("ETH") &&
          sortedCurrencies.includes("USDC")
        ) {
          setFromCurrency("ETH");
          setToCurrency("USDC");
        } else if (sortedCurrencies.length >= 2) {
          setFromCurrency(sortedCurrencies[0]);
          setToCurrency(sortedCurrencies[1]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getExchangeRate = useMemo(() => {
    if (!prices[fromCurrency] || !prices[toCurrency]) return 1;
    return prices[fromCurrency] / prices[toCurrency];
  }, [prices, fromCurrency, toCurrency]);

  const validateInput = (value) => {
    if (!value || value.trim() === "") {
      setInputError("");
      return true;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
      return false;
    }

    if (numValue < 0) {
      setInputError("Amount cannot be negative");
      return false;
    }

    if (numValue === 0) {
      setInputError("Amount must be greater than zero");
      return false;
    }

    const decimalPlaces = value.includes(".") ? value.split(".")[1].length : 0;
    if (decimalPlaces > 18) {
      setInputError("Maximum 18 decimal places allowed");
      return false;
    }

    // Check for extremely large numbers
    if (numValue > 1e15) {
      setInputError("Amount is too large");
      return false;
    }

    setInputError("");
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputAmount(value);
    setSubmitError("");
    validateInput(value);
  };

  const outputAmount = useMemo(() => {
    if (
      inputAmount &&
      !inputError &&
      !isNaN(parseFloat(inputAmount)) &&
      parseFloat(inputAmount) > 0 &&
      prices[fromCurrency] &&
      prices[toCurrency]
    ) {
      const rate = getExchangeRate;
      const calculated = parseFloat(inputAmount) * rate;
      if (calculated >= 1) {
        return calculated.toFixed(6).replace(/\.?0+$/, "");
      } else if (calculated >= 0.01) {
        return calculated.toFixed(8).replace(/\.?0+$/, "");
      } else {
        return calculated.toFixed(10).replace(/\.?0+$/, "");
      }
    }
    return "";
  }, [
    inputAmount,
    fromCurrency,
    toCurrency,
    prices,
    getExchangeRate,
    inputError,
  ]);

  const handleSwapCurrencies = () => {
    if (fromCurrency === toCurrency) {
      setSubmitError("Cannot swap the same currency");
      return;
    }
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setInputError("");
    setSubmitError("");
    if (outputAmount) {
      setInputAmount(outputAmount);
      validateInput(outputAmount);
    }
  };

  const handleConfirmSwap = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!inputAmount || inputAmount.trim() === "") {
      setSubmitError("Please enter an amount to send");
      return;
    }

    if (!validateInput(inputAmount)) {
      setSubmitError(inputError || "Please enter a valid amount");
      return;
    }

    const numValue = parseFloat(inputAmount);
    if (numValue <= 0) {
      setSubmitError("Amount must be greater than zero");
      return;
    }

    if (fromCurrency === toCurrency) {
      setSubmitError("Cannot swap the same currency");
      return;
    }

    if (!prices[fromCurrency] || !prices[toCurrency]) {
      setSubmitError("Price data not available for selected currencies");
      return;
    }

    setIsSubmitting(true);
    setSwapSuccess(false);
    setInputError("");

    const delay = Math.random() * 1000 + 2000; // 2000-3000ms

    try {
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (Math.random() < 0.05) {
        throw new Error("Network error. Please try again.");
      }

      setSwapSuccess(true);
      setSubmitError("");

      setTimeout(() => {
        setInputAmount("");
        setSwapSuccess(false);
        setInputError("");
      }, 3000);
    } catch (err) {
      setSubmitError(err.message || "Swap failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="problem-container">
      <div className="problem-header">
        <h1>Problem 2</h1>
        <p className="problem-description">Create a currency swap form</p>
        <p className="problem-subtitle">
          Build a form that allows users to swap assets from one currency to
          another
        </p>
      </div>

      <div className="problem-content">
        <div className="swap-form-container">
          <form onSubmit={handleConfirmSwap} className="swap-form">
            <h5 className="swap-title">Swap</h5>

            <div className="currency-input-group">
              <label htmlFor="input-amount">Amount to send</label>
              <div
                className={`input-with-currency ${
                  inputError ? "input-error-wrapper" : ""
                }`}
              >
                <input
                  id="input-amount"
                  type="number"
                  value={inputAmount}
                  onChange={handleInputChange}
                  onBlur={() => validateInput(inputAmount)}
                  placeholder="0.00"
                  min="0"
                  step="0.00000001"
                  className={`amount-input ${inputError ? "input-error" : ""}`}
                  disabled={loading || currencies.length === 0 || isSubmitting}
                  aria-invalid={!!inputError}
                  aria-describedby={
                    inputError ? "input-error-message" : undefined
                  }
                />
                <div className="currency-select-wrapper">
                  <img
                    src={getTokenIconUrl(fromCurrency)}
                    alt={fromCurrency}
                    className="token-icon"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="currency-select"
                    disabled={
                      loading || currencies.length === 0 || isSubmitting
                    }
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {inputError && (
                <div
                  id="input-error-message"
                  className="input-error-message"
                  role="alert"
                >
                  {inputError}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSwapCurrencies}
              className="swap-button"
              aria-label="Swap currencies"
              disabled={isSubmitting}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            <div className="currency-input-group">
              <label htmlFor="output-amount">Amount to receive</label>
              <div className="input-with-currency">
                <input
                  id="output-amount"
                  type="text"
                  value={outputAmount || ""}
                  readOnly
                  placeholder="0.00"
                  className="amount-input output-input"
                />
                <div className="currency-select-wrapper">
                  <img
                    src={getTokenIconUrl(toCurrency)}
                    alt={toCurrency}
                    className="token-icon"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="currency-select"
                    disabled={
                      loading || currencies.length === 0 || isSubmitting
                    }
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {inputAmount &&
              parseFloat(inputAmount) > 0 &&
              prices[fromCurrency] &&
              prices[toCurrency] && (
                <div className="exchange-rate-info">
                  <span>
                    1 {fromCurrency} ={" "}
                    {getExchangeRate.toFixed(8).replace(/\.?0+$/, "")}{" "}
                    {toCurrency}
                  </span>
                </div>
              )}

            {loading && (
              <div className="loading-message">Loading prices...</div>
            )}

            {error && (
              <div className="error-message">Error loading prices: {error}</div>
            )}

            {submitError && (
              <div className="submit-error-message" role="alert">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{submitError}</span>
              </div>
            )}

            {swapSuccess && (
              <div className="success-message">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>
                  Swap successful! {inputAmount} {fromCurrency} → {outputAmount}{" "}
                  {toCurrency}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="confirm-swap-button"
              disabled={
                loading ||
                isSubmitting ||
                !prices[fromCurrency] ||
                !prices[toCurrency] ||
                !inputAmount ||
                !!inputError ||
                parseFloat(inputAmount) <= 0 ||
                fromCurrency === toCurrency
              }
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  PROCESSING...
                </>
              ) : (
                "CONFIRM SWAP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Problem2;
