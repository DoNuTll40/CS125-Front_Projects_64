
import useAuth from "./hooks/UseAuth";
import AppRoute from "./routes/AppRoute";

function App() {

  const { loading, theme } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div data-theme="dark">
      <AppRoute />
    </div>
  )
}

export default App
