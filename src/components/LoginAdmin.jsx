
import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import Swal from "sweetalert2";
import axiosPath from "../configs/axios-path";
import { Link } from "react-router-dom";
import SlideDashboard from "./SlideDashboard";

export default function LoginAdmin() {

    const { setUser, setLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [input, setInput] = useState({
        username: '',
        password: ''
    });

    
    useEffect(() => {

        document.title = "เข้าสู่ระบบ | Admin";

        const loadImage = async () => {
            const image1 = "https://a.cdn-hotels.com/gdcs/production122/d1368/1ecd1184-2b25-4fa6-877c-320dc8a0f1e5.jpg?impolicy=fcrop&w=1600&h=1066&q=medium";
            // setLoading(true);
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image1;
                });
                console.log("ภาพโหลดเสร็จสมบูรณ์");
            } catch (error) {
                console.log("เกิดข้อผิดพลาดในการโหลดภาพ", error);
            } finally {
                // setLoading(false);
            }
        };
        loadImage();
    }, [setLoading]);

    const hdlSubmit = async e => {

        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we fetch the data',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading(); // แสดง loading indicator
            }
          });

        try {
            e.preventDefault()
            const rs = await axiosPath.post('/auth/adminLogin', input);
            localStorage.setItem('token', rs.data.token);
            const rs1 = await axiosPath.get('/auth/me', {
                headers: { Authorization: `Bearer ${rs.data.token}` }
            });
            if (rs1.data !== "") {
                Swal.fire({
                    title: "Login Success",
                    text: "Login web site success",
                    icon: "success",
                    preConfirm: () => {
                        setUser(rs1.data);
                    }
                });
            }

        } catch (err) {
            Swal.close(); // ปิดการโหลด
            const message = err.response?.data?.message || err.message;
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: message,
                icon: "error"
            });
        }
    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    return (
        <div data-theme="light" className="bg-[url('https://a.cdn-hotels.com/gdcs/production122/d1368/1ecd1184-2b25-4fa6-877c-320dc8a0f1e5.jpg?impolicy=fcrop&w=1600&h=1066&q=medium')] flex justify-center h-[100vh] items-center bg-cover bg-center">
            <div className="w-full h-full flex flex-col justify-center items-center backdrop-blur-sm">
                <div className="bg-gradient-to-r from-[#6096B4] to-[#FF90BC] flex rounded-lg drop-shadow-[5px_5px_3px_rgba(0,0,0,0.25)] scale-95 md:scale-100 w-full md:w-[650px] md:h-[450px]">
                    <SlideDashboard />
                    <div className="p-4 w-full">
                        <form className="flex flex-col" onSubmit={hdlSubmit}>
                            <div className="flex flex-col gap-2">
                                <img className='mx-auto rounded-full w-[120px] h-[120px]' src='/Blue and Pink Simple School Logo.png' />
                                <h1 className="text-2xl text-center font-bold text-white drop-shadow-[2px_2px_1.5px_rgba(0,0,0,0.25)]">Login Admin</h1>
                                <label className='text-white font-semibold'>Username</label>
                                <input className="h-[2.5rem] border-2 border-[#FF90BC] rounded-full px-5 focus:outline-[#6096B4]"
                                    type="text"
                                    placeholder="Enter Username"
                                    name='username'
                                    value={input.username}
                                    onChange={hdlChange}
                                    autoFocus
                                />
                                <label className='text-white font-semibold'>Password</label>
                                <input className="h-[2.5rem] border-2 border-[#FF90BC] rounded-full px-5 focus:outline-[#6096B4]"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    name='password'
                                    value={input.password}
                                    onChange={hdlChange}
                                />
                                <label className="label justify-start gap-2 cursor-pointer">
                                    <input type="checkbox" className="checkbox checkbox-secondary rounded-full" onChange={() => setShowPassword((prev) => !prev)} />
                                    <span className="label-text font-semibold text-white">Show password</span>
                                </label>
                            </div>
                            <div className="flex justify-between mt-[14px]">
                                <div className="flex gap-4">
                                    <Link to="/" className='font-semibold text-white'>Student</Link>
                                    <Link to="/teacher" className='font-semibold text-white'>Teacher</Link>
                                </div>
                                <input type="submit" className="bg-white font-semibold px-8 scale-100 active:scale-95 hover:bg-green-700 hover:text-white rounded-full" value="Login" />
                            </div>
                        </form>
                        <div className="bg-white flex justify-center items-center text-[8px] font-bold h-5 mt-2 rounded-t-lg drop-shadow-[-3px_-3px_3px_rgba(0,0,0,0.20)]">
                            <p>&copy; CS125 Nuttawoot Chawna SNRU | CodeCamp Academy 01 | Version 0.3</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
