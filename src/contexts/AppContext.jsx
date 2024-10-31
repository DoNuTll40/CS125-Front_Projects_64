/* eslint-disable react/prop-types */

import { useEffect, createContext, useState } from "react";
import Swal from "sweetalert2";
import axiosPath from "../configs/axios-path";
import axios from "../configs/axios-path";
import { v4 as uuidv4 } from "uuid"; // ติดตั้ง uuid

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullStudent, setFullStudent] = useState([]);
  const [fullSchedule, setFullSchedule] = useState([]);
  const [refetchBanner, setRefetchBanner] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [sessionId] = useState(uuidv4());

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  if (!location.latitude || !location.longitude) {
    getLocation();
  }

  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (err) {
      if (err.response && err.response.status === 429) {
        return null;
      }
    }
  };

  const browserInfo = {
    userAgent: navigator.userAgent,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    language: navigator.language,
    platform: navigator.platform,
    vendor: navigator.vendor,
  };

  const screenInfo = {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendVisitData = async () => {
    try {
      if (location.latitude !== null && location.longitude !== null) {
        const publicIP = await getPublicIP();
        const visitData = {
          latitude: location.latitude,
          longitude: location.longitude,
          ipAddress: publicIP || "IP not available",
          userAgent: browserInfo.userAgent,
          appName: browserInfo.appName,
          appVersion: browserInfo.appVersion,
          language: browserInfo.language,
          platform: browserInfo.platform,
          vendor: browserInfo.vendor,
          screenWidth: screenInfo.width,
          screenHeight: screenInfo.height,
          screenColorDepth: screenInfo.colorDepth,
          sessionId: sessionId,
          website: window.location.href,
          pageViewed: window.location.pathname,
          mapURL: `https://www.google.com/maps/place/${location.latitude},${location.longitude}`,
        };

        await axios.post(
          "https://cs125-personal-projects-64.onrender.com/auth/gps",
          visitData
        );
      }
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        let token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const rs = await axiosPath.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(rs.data);
      } catch (err) {
        if (err.message === "Network Error") {
          return Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถติดต่อกับเซิฟเวอร์ได้ในขณะนี้",
          });
        }
        Swal.fire({
          icon: "error",
          title: "Error token",
          text: err.response.data.message,
        });
        if (err.response.data.message.startsWith("Token verification failed")) {
          localStorage.removeItem("token");
        }

        if (err.response.data.message.startsWith("TokenExpiredError")) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };
    run();

    getLocation();
    sendVisitData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude, sessionId]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        setLoading,
        fullStudent,
        setFullStudent,
        fullSchedule,
        setFullSchedule,
        refetchBanner,
        setRefetchBanner,
        sendVisitData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider };
export default AuthContext;
