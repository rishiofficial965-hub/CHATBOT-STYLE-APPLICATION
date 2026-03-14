import { AuthProvider } from "./features/auth/context/auth.context";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
