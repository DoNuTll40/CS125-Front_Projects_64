
import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginStudent() {

    const { setUser, loading, setLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [input, setInput] = useState({
        username: '',
        password: ''
    });

    document.title = "Login";

    const hdlSubmit = async e => {
        try {
            e.preventDefault()

            if (input.username === "" || input.password === "") {
                alert("please enter your fill")
            } else {
                const rs = await axios.post('http://localhost:8000/auth/login', input);
                localStorage.setItem('token', rs.data.token);
                const rs1 = await axios.get('http://localhost:8000/auth/me', {
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
            if (err.response && err.response.data && err.response.data.message) {
                // alert(err.response.data.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${err.response.data.message}`,
                });
            } else {
                alert(err.message);
            }
        }

    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    return (
        <div data-theme="light" className="bg-[url('https://a.cdn-hotels.com/gdcs/production122/d1368/1ecd1184-2b25-4fa6-877c-320dc8a0f1e5.jpg?impolicy=fcrop&w=1600&h=1066&q=medium')] flex justify-center h-[100vh] items-center bg-cover bg-center">
            <div className="w-full h-full flex flex-col justify-center items-center backdrop-blur-sm">
                <div className="bg-gradient-to-r from-[#6096B4] to-[#FF90BC] flex rounded-lg drop-shadow-[5px_5px_3px_rgba(0,0,0,0.25)] w-[650px] h-[450px]">
                    <div className="max-w-[470px] max-h-[450px]">
                        <img
                            loading="lazy"
                            className="rounded-l-lg object-cover w-[100%] h-[100%]"
                            src="https://picsum.photos/id/125/1200"
                            type="image/jpeg"
                        />
                    </div>
                    <div className="p-4 w-full">
                        <form className="flex flex-col" onSubmit={hdlSubmit}>
                            <div className="flex flex-col gap-2">
                                <img className='mx-auto rounded-full w-[120px] h-[120px]' src='https://picsum.photos/id/125/600' />
                                <h1 className="text-2xl text-center font-bold text-white drop-shadow-[2px_2px_1.5px_rgba(0,0,0,0.25)]">Login Student</h1>
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
                                <Link to="/teacher" className='font-semibold text-white'>Teacher</Link>
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
