
import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axiosPath from '../configs/axios-path';
import SlideDashboard from "./SlideDashboard";

export default function LoginStudent() {

    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [input, setInput] = useState({
        username: '',
        password: ''
    });

    useEffect( () => {
        document.title = "เข้าสู่ระบบ";
    }, [])

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

            if (input.username === "" || input.password === "") {
                alert("please enter your fill")
            } else {
                const rs = await axiosPath.post('/auth/login', input);
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
            }

        } catch (err) {
            Swal.close(); // ปิดการโหลด
            const message = err.response?.data?.message || err.message;
            Swal.fire({
                title: "Error",
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
                        <form className="flex flex-col select-none  " onSubmit={hdlSubmit}>
                            <div className="flex flex-col gap-2">
                                <img className='mx-auto rounded-full w-[120px] h-[120px] pointer-events-none' src='/Blue and Pink Simple School Logo.png' />
                                <h1 className="text-2xl text-center font-extrabold text-white drop-shadow-[2px_2px_1.5px_rgba(0,0,0,0.25)]">Login</h1>
                                <label className='text-white font-semibold'>Username</label>
                                <input className={`h-[2.5rem] border-2 rounded-full px-5 focus:outline-[#6096B4] ${input.username === "" ? "border-[#FF90BC]" : "border-[#6096B4]"}`}
                                    type="text"
                                    placeholder="Enter Username"
                                    name='username'
                                    value={input.username}
                                    onChange={hdlChange}
                                />
                                <label className='text-white font-semibold'>Password</label>
                                <input className={`h-[2.5rem] border-2 rounded-full px-5 focus:outline-[#6096B4] ${input.password === "" ? " border-[#FF90BC]" : "border-[#6096B4]"}`}
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
                            <div className="flex justify-between mt-3">
                                <div className="flex gap-4">
                                    <Link to="/teacher" className='font-semibold text-white hover:cursor-pointer'>Teacher</Link>
                                    <Link to="/admin" className='font-semibold text-white hover:cursor-pointer'>Admin</Link>
                                </div>
                                <input type="submit" className="bg-white font-semibold px-8 scale-100 active:scale-95 hover:bg-green-700 hover:text-white rounded-full" value="Login" />
                            </div>
                        </form>
                        <div className="text-white flex justify-center items-center text-[8px] font-bold h-5 mt-2 rounded-t-lg drop-shadow-[3px_3px_3px_rgba(0,0,0,0.20)]">
                            <p>&copy; CS125 Nuttawoot Chawna SNRU | CodeCamp Academy 01</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
