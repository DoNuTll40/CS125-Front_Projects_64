
import { useEffect, createContext, useState } from 'react';
import Swal from 'sweetalert2';
import axiosPath from '../configs/axios-path';

const AuthContext = createContext();

function AuthContextProvider(props) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullStudent, setFullStudent] = useState([])
    const [fullSchedule, setFullSchedule] = useState([])
    const [refetchBanner, setRefetchBanner] = useState(false)

    useEffect(() => {

        const run = async () => {
            try {
                setLoading(true);
                let token = localStorage.getItem('token');
                if (!token) {
                    return
                }

                const rs = await axiosPath.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(rs.data);

            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error token',
                    text: err.response.data.message
                })
                if (err.response.data.message.startsWith('Token verification failed')) {
                    localStorage.removeItem('token');
                }


                if (err.response.data.message.startsWith('TokenExpiredError')) {
                    localStorage.removeItem('token');
                }
            } finally {
                setLoading(false)
            };
        };
        run();

    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, setLoading, fullStudent, setFullStudent, fullSchedule, setFullSchedule, refetchBanner, setRefetchBanner }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export { AuthContextProvider };
export default AuthContext;
