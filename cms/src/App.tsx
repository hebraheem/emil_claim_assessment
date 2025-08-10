import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function App() {
  function AppRoutes() {
    return useRoutes(routes);
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
