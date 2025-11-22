import { useState } from "react";
import "./Problem.css";

function Problem3() {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isRefactoredExpanded, setIsRefactoredExpanded] = useState(false);

  const toggleCodeBlock = () => {
    setIsCodeExpanded(!isCodeExpanded);
  };

  const toggleRefactoredCode = () => {
    setIsRefactoredExpanded(!isRefactoredExpanded);
  };

  return (
    <div className="problem-container">
      <div className="problem-header">
        <h1>Problem 3</h1>
        <p className="problem-description">
          List out the computational inefficiencies and anti-patterns found in
          the code block below. This code block uses - ReactJS with TypeScript -
          Functional components - React Hooks You should also provide a
          refactored version of the code, but more points are awarded to
          accurately stating the issues and explaining correctly how to improve
          them.
        </p>

        <div className="code-accordion">
          <button
            type="button"
            className="code-accordion-header"
            onClick={toggleCodeBlock}
            aria-expanded={isCodeExpanded}
          >
            <span className="code-accordion-title">
              View Original Code Block
            </span>
            <svg
              className={`code-accordion-icon ${
                isCodeExpanded ? "expanded" : ""
              }`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div
            className={`code-accordion-content ${
              isCodeExpanded ? "expanded" : ""
            }`}
          >
            <div className="code-display-wrapper">
              <pre className="code-block">
                <code>{`interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="problem-content">
        <div className="analysis-section">
          <h2 className="analysis-title">Inefficiencies and Anti-patterns</h2>

          <div className="issue-list">
            <div className="issue-item">
              <h3 className="issue-number">1. Undefined Variable Reference</h3>
              <p className="issue-location">
                <code>lhsPriority</code> is used but never defined
              </p>
              <p className="issue-description">
                The code references <code>lhsPriority</code> which doesn't
                exist. It should be <code>balancePriority</code>. This will
                cause a runtime error.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">2. Incorrect Filter Logic</h3>
              <p className="issue-location">Filter condition is inverted</p>
              <p className="issue-description">
                The filter returns <code>true</code> when{" "}
                <code>balance.amount &lt;= 0</code>, which means it keeps
                balances with zero or negative amounts. This is likely backwards
                - it should filter OUT negative/zero balances.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">3. Missing Return Value in Sort</h3>
              <p className="issue-location">Sort comparator doesn't return 0</p>
              <p className="issue-description">
                When <code>leftPriority === rightPriority</code>, the function
                doesn't return anything (undefined). It should return{" "}
                <code>0</code> to indicate equal priority. This can cause
                unpredictable sorting behavior.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">4. Unused Dependency in useMemo</h3>
              <p className="issue-location">
                <code>prices</code> in dependency array but not used
              </p>
              <p className="issue-description">
                <code>prices</code> is included in the dependency array but
                never referenced in the <code>useMemo</code>
                computation. This is unnecessary and could cause unnecessary
                recalculations if prices change.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">5. Redundant Computation</h3>
              <p className="issue-location">
                <code>formattedBalances</code> created but never used
              </p>
              <p className="issue-description">
                <code>formattedBalances</code> is computed but then{" "}
                <code>sortedBalances</code> is used in the rows mapping. The
                formatted property is accessed but doesn't exist on{" "}
                <code>sortedBalances</code> items.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">6. Type Safety Issues</h3>
              <p className="issue-location">
                <code>blockchain: any</code> and Type mismatch
              </p>
              <p className="issue-description">
                Using <code>any</code> defeats the purpose of TypeScript. Also,{" "}
                <code>sortedBalances</code> is typed as
                <code>WalletBalance[]</code> but used as{" "}
                <code>FormattedWalletBalance</code>, causing a type error.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">
                7. Inefficient Priority Calculation
              </h3>
              <p className="issue-location">
                <code>getPriority</code> called multiple times
              </p>
              <p className="issue-description">
                <code>getPriority</code> is called multiple times for the same
                balance (once in filter, twice in sort). This is inefficient -
                priorities should be calculated once and stored.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">
                8. React Anti-pattern: Index as Key
              </h3>
              <p className="issue-location">
                <code>key={`{index}`}</code>
              </p>
              <p className="issue-description">
                Using array index as React key is an anti-pattern. If the list
                order changes, React may incorrectly reuse components. Should
                use a unique identifier like <code>balance.currency</code> or a
                combination of currency and blockchain.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">9. Missing Null/Undefined Checks</h3>
              <p className="issue-location">
                <code>prices[balance.currency]</code> may be undefined
              </p>
              <p className="issue-description">
                No validation that <code>prices[balance.currency]</code> exists
                before multiplication. This could result in <code>NaN</code> if
                the price is missing.
              </p>
            </div>

            <div className="issue-item">
              <h3 className="issue-number">10. Missing Blockchain Property</h3>
              <p className="issue-location">
                <code>balance.blockchain</code> not in interface
              </p>
              <p className="issue-description">
                The code accesses <code>balance.blockchain</code> but the{" "}
                <code>WalletBalance</code> interface doesn't include a{" "}
                <code>blockchain</code> property, causing a type error.
              </p>
            </div>
          </div>

          <div className="refactored-section">
            <h2 className="analysis-title">Refactored Code</h2>
            <p className="refactored-intro">
              Below is a refactored version that addresses all the issues
              identified above:
            </p>

            <div className="code-accordion">
              <button
                type="button"
                className="code-accordion-header"
                onClick={toggleRefactoredCode}
                aria-expanded={isRefactoredExpanded}
              >
                <span className="code-accordion-title">
                  View Refactored Code
                </span>
                <svg
                  className={`code-accordion-icon ${
                    isRefactoredExpanded ? "expanded" : ""
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div
                className={`code-accordion-content ${
                  isRefactoredExpanded ? "expanded" : ""
                }`}
              >
                <div className="code-display-wrapper">
                  <pre className="code-block">
                    <code>{`// Define blockchain types for type safety
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}

interface Props extends BoxProps {
}

// Priority mapping - moved outside component for better performance
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
};

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Single useMemo that handles filtering, sorting, and formatting
  // Calculate priority once per balance and store it
  const formattedBalances = useMemo(() => {
    return balances
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter((balance) => {
        // Fixed: Filter OUT negative/zero balances
        // Fixed: Use balancePriority instead of undefined lhsPriority
        return balance.priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        // Fixed: Return 0 for equal priorities
        // Fixed: Use stored priority instead of recalculating
        if (lhs.priority > rhs.priority) {
          return -1;
        } else if (rhs.priority > lhs.priority) {
          return 1;
        }
        return 0; // Fixed: Added missing return 0
      })
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      }));
  }, [balances]); // Fixed: Removed unused 'prices' dependency

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    // Fixed: Add null check for price
    const price = prices[balance.currency];
    const usdValue = price ? price * balance.amount : 0;
    
    // Fixed: Use unique key instead of index
    const uniqueKey = \`\${balance.blockchain}-\${balance.currency}\`;
    
    return (
      <WalletRow 
        className={classes.row}
        key={uniqueKey}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="refactored-improvements">
              <h3 className="improvements-title">Key Improvements:</h3>
              <ul className="improvements-list">
                <li>✅ Fixed undefined variable reference</li>
                <li>
                  ✅ Corrected filter logic to exclude negative/zero balances
                </li>
                <li>✅ Added return 0 in sort comparator</li>
                <li>✅ Removed unused 'prices' from useMemo dependencies</li>
                <li>✅ Used formattedBalances consistently throughout</li>
                <li>
                  ✅ Added proper TypeScript types (Blockchain enum, proper
                  interfaces)
                </li>
                <li>
                  ✅ Calculate priority once and store it (no redundant calls)
                </li>
                <li>✅ Use unique composite key instead of index</li>
                <li>✅ Added null checks for price data</li>
                <li>✅ Added blockchain property to WalletBalance interface</li>
                <li>
                  ✅ Combined filtering, sorting, and formatting in single
                  useMemo for efficiency
                </li>
                <li>
                  ✅ Moved priority mapping outside component for better
                  performance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem3;
