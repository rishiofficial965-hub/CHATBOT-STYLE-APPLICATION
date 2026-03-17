import { Provider, useDispatch } from "react-redux";
import { store } from "./app/app.store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.router";
import { useEffect } from "react";
import { getMe } from "./features/auth/auth.slice";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
