
import { useEffect, useState } from "react";
import useAuth from "./hooks/UseAuth";
import AppRoute from "./routes/AppRoute";

function App() {
  const { loading } = useAuth();
  const [isVisible, setIsVisible] = useState(loading);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(false), 1000); // รอให้ transition เสร็จ
      return () => clearTimeout(timer); // ลบ timer เมื่อ component ถูก unmount
    } else {
      setIsVisible(true); // รีเซ็ต state เมื่อ loading กลับมา
    }
  }, [loading]);

  return (
    <div data-theme="dark">
      {isVisible && (
        <div
          className={`flex justify-center min-h-screen transition-opacity duration-500 ${
            loading ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {!loading && <AppRoute />}
    </div>
  );
}

export default App;
