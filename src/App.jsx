import { useEffect, useState } from "react";
import useAuth from "./hooks/UseAuth";
import AppRoute from "./routes/AppRoute";

function App() {
  const { loading } = useAuth();
  const [isVisible, setIsVisible] = useState(true); // เริ่มต้นเป็น true เพื่อให้แสดงการโหลด

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(false), 500); // เปลี่ยนเวลาให้เร็วขึ้น
      return () => clearTimeout(timer); // ลบ timer เมื่อ component ถูก unmount
    } else {
      setIsVisible(true); // รีเซ็ต state เมื่อ loading กลับมา
    }
  }, [loading]);

  return (
    <div data-theme="dark">
      {loading ? (
        <div
          className={`flex justify-center min-h-screen transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <AppRoute />
      )}
    </div>
  );
}

export default App;
