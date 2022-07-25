
in the ``app.test.js``:

```javascript 
import { render, screen, cleanup } from "@testing-library/jest-dom";
import App from "./src/App";

test("should render todo component", () => {
  render(<App />);
  const appElement = screen.getByTestId("app-id");
  expect(appElement).toBeInTheDocument();
  expect(appElement).toHaveTextContent("Hello World");
});
```

