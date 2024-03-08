
import axios from 'axios';
import { useEffect, createContext, useState } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

function AuthContextProvider(props) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ fullStudent, setFullStudent ] = useState([])

    useEffect(() => {

        document.title = "SCHOOL NAME : Login";

        const run = async () => {
            try {
                setLoading(true);
                let token = localStorage.getItem('token');
                if (!token) {
                    return
                }

                const rs = await axios.get("http://localhost:8000/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(rs.data);

            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            };
        };
        run();
    }, []);

    const logout = () => {
        Swal.fire({
            text: "Log out complete",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            width: '500px'
        }).then(()=>{
            setUser(null);
            localStorage.removeItem("token");
        })

    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, setLoading, fullStudent, setFullStudent }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export { AuthContextProvider };
export default AuthContext;
