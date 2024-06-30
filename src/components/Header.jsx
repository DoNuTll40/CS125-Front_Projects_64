
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/UseAuth';
import { useEffect, useState } from 'react';
import axiosPath from "../configs/axios-path";
import ScrollProgress from './ScrollProgress';
import Swal from 'sweetalert2';

export default function Header() {

    const { user, logout } = useAuth();
    const [profile, setProfile] = useState([])
    const navigate = useNavigate()

    const hdlLogout = () => {
        Swal.fire({
            text: "Logout complete",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            width: '500px'
        }).then(() => {
            navigate('/');
            logout();
        });
    }    

    const liNav = user.user_role === "ADMIN" ? [
        { to: "/admin", text: "หน้าหลัก" },
        { to: "/admin/users", text: "ผู้ใช้งานทั้งหมด" },
        { to: "/admin/teachers", text: "รายชื่ออาจารย์" },
        { to: "/admin/build", text: "รายชื่ออาคาร" },
        { to: "/admin/room", text: "รายชื่อห้อง" },
        { to: "/admin/schedule", text: "ตารางทั้งหมด" },
        { to: "/admin/class", text: "ชั้นเรียนทั้งหมด" },
        { to: "/admin/subject", text: "รายวิชาทั้งหมด" },
        { to: "/admin/banner", text: "แบนเนอร์" },
        { to: "/admin/report", text: "รายงานระบบ" },

    ] : [
        { to: "/teacher", text: "หน้าหลัก" },
        { to: "/teacher/teacher-table", text: "รายการสอน" },
        { to: "/teacher/teachers", text: "รายชื่ออาจารย์" },
        { to: "/teacher/build", text: "รายชื่ออาคาร" },
        { to: "/teacher/report", text: "รายงานระบบ" }
    ];

    const ltion = useLocation();
    const location = ltion.pathname;
    const regex = /^\/admin\/users\//;
    const tablePath = /^\/admin\/schedule\//;
    const roomAddPath = /^\/admin\/room\/add$/;
    const roomEditPath = /^\/admin\/room\/edit\/\d+$/;
    const buildAddPath = /^\/admin\/build\/add$/;
    const buildEditPath = /^\/admin\/build\/edit\/\d+$/;
    const subAddPath = /^\/admin\/subject\/add$/;
    const subEditPath = /^\/admin\/subject\/edit\/\d+$/;
    const bannerAddPath = /^\/admin\/banner\/add$/;
    const bannerEditPath = /^\/admin\/banner\/edit\/\d+$/;
    const acText = location === "profile" ? "โปรไฟล์" :
        location === "/teacher" + ("/profile") ? "โปรไฟล์" :
            location === "/admin" + ("/profile") ? "โปรไฟล์" :
                location === "teacher" ? "หน้าหลัก"
                    : location.startsWith("/admin") && regex.test(location) ? "แก้ไขผู้ใช้งาน"
                        : tablePath.test(location) ? "เพิ่มตารางเรียน"
                            : roomAddPath.test(location) ? "เพิ่มห้อง"
                                : roomEditPath.test(location) ? "แก้ไขห้อง"
                                    : bannerAddPath.test(location) ? "เพิ่มแบนเนอร์"
                                        : bannerEditPath.test(location) ? "แก้ไขแบนเนอร์"
                                            : buildAddPath.test(location) ? "เพิ่มอาคาร"
                                                : buildEditPath.test(location) ? "แก้ไขอาคาร"
                                                    : subAddPath.test(location) ? "เพิ่มวิชา"
                                                        : subEditPath.test(location) ? "แก้ไขวิชา"
                                                            : location === "/teacher/teacher-schedule" ? "ดูตารางสอน"
                                                                : liNav.find(link => link.to === location)?.text;

    useEffect(() => {
        const id = user.user_id
        const getUserBid = async () => {
            const rs = await axiosPath.get(`/header/user/${id}`)
            setProfile(rs.data.getUserBid);
        }
        getUserBid();
    }, [])

    return (
        <>
            <div data-theme="light" className='bg-gradient-to-r from-[#FF90BC] to-[#6096B4] h-[58px] select-none fixed top-0 w-screen z-50'>
                <div className='max-w-[80rem] mx-auto flex justify-between items-center'>
                    {user.user_role !== "USER" ?
                        <div className="dropdown w-[170px] mobile:w-[200px]">
                            <summary tabIndex={0} role='button' className="m-1 btn px-2 mobile:px-4">{acText}</summary>
                            <ul className="p-2 shadow mt-2 menu dropdown-content z-[1] bg-base-100 rounded-box w-36 mobile:w-52">
                                {liNav.map((el, number) => (
                                    <li key={number + 1} className={`${acText === el.text ? "bg-pink-500 text-white font-bold" : ""} rounded-md`}><Link to={el.to} onClick={() => location.reload()}>{el.text}</Link></li>
                                ))}
                            </ul>
                        </div>
                        : <div className='w-[170px] mobile:w-[200px]'></div>
                    }
                    <h1 className='text-sm flex items-center justify-center text-center font-bold text-white h-[46.4px] m-[4px] px-[16px] md:text-2xl'>{user.user_role === "ADMIN" ? "ระบบตารางเรียน (ผู้ดูแล)" : "ระบบตารางเรียน"}</h1>
                    <div className="dropdown dropdown-end w-[170px] mobile:w-[200px] flex justify-end">
                        <div className='flex items-center'>
                            <p className='hidden md:block sm:text-lg font-bold text-white'>{user.user_role === "USER" ? "น้อง" : user.user_role === "TEACHER" ? "ครู" : "คุณ"} {user.user_nickname}</p>
                        </div>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mx-2 mr-4">
                            <div className="w-10 rounded-full shadow-md pointer-events-none">
                                <img alt="Tailwind CSS Navbar component" src={profile.user_image} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-16 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><Link to="profile" onClick={() => location.reload()}>โปรไฟล์</Link></li>
                            <li><Link to="#" onClick={hdlLogout}>ออกจากระบบ</Link></li>
                        </ul>
                    </div>
                </div>
            </div >
            <ScrollProgress />
        </>
    )
}
