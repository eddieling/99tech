import "./Problem.css";

function Problem1() {
  return (
    <div className="problem-container">
      <div className="problem-header">
        <h1>Problem 1</h1>
        <p className="problem-description">Three ways to sum to n</p>
        <p className="problem-subtitle">
          Provide 3 unique implementations of the following function in
          JavaScript. **Input**: `n` - any integer
        </p>
      </div>

      <div className="problem-content">
        <div className="solutions-grid">
          <div className="solution-card">
            <div className="solution-header">
              <h3>Solution A: Iterative</h3>
              <span className="solution-badge">Loop</span>
            </div>
            <pre className="code-block">
              <code>{`var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};`}</code>
            </pre>
            <div>If n is 5, sum = 0 + 1 + 2 + 3 + 4 + 5 = 15</div>
          </div>

          <div className="solution-card">
            <div className="solution-header">
              <h3>Solution B: Recursive</h3>
              <span className="solution-badge">Recursion</span>
            </div>
            <pre className="code-block">
              <code>{`var sum_to_n_b = function(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_b(n - 1);
};`}</code>
            </pre>
            <div>If n is 5, sum = 5 + 4 + 3 + 2 + 1 = 15</div>
          </div>

          <div className="solution-card">
            <div className="solution-header">
              <h3>Solution C: Mathematical</h3>
              <span className="solution-badge">Formula</span>
            </div>
            <pre className="code-block">
              <code>{`var sum_to_n_c = function(n) {
  return (n * (n + 1)) / 2;
};`}</code>
            </pre>
            <div>If n is 5, sum = (5 * (5 + 1)) / 2 = 15</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem1;
