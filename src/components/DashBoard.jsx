import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import axiosPath from "../configs/axios-path";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus } from "@fortawesome/free-regular-svg-icons";
import TimeRealtime from "./TimeRealtime";
import CountUp from "react-countup";


export default function DashBoard() {

    const { user, refetchBanner } = useAuth();
    const [allUser, setAllUser] = useState([]);
    const [allSub, setAllSub] = useState([]);

    useEffect(() => {
        const getAll = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllUser(rs.data.user)
        }
        getAll();

        const getSub = async () => {
            let token = localStorage.getItem('token');
            const rs = await axiosPath.get('/admin/subject', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAllSub(rs.data.sub);
        }
        getSub();

    }, [refetchBanner])

    const numberOFuser = (allUser.filter(users => users.user_role === "USER").length / allUser.filter(users => users.user_role !== "ADMIN").length) * 100
    const numberOFteacher = (allUser.filter(users => users.user_role === "TEACHER").length / allUser.filter(users => users.user_role !== "ADMIN").length) * 100

    return (
        <div>
            <div className='max-w-[80rem] mx-auto mt-16 select-none'>
                <div className='bg-white p-3 rounded-2xl max-w-[53rem] mx-auto animate-slidein opacity-0 [--slidein-delay:10ms]'>
                    <div className="flex items-center justify-end gap-1 px-2 text-[12px] mobile:text-md font-extrabold text-base-200">
                        <FontAwesomeIcon icon={faCalendarMinus} className="text-lg pb-1" />
                        <TimeRealtime />
                    </div>
                    <div className='my-3 text-center flex flex-col gap-3 text-base-200'>
                        <h1 className='text-2xl font-bold animate-slidein opacity-0 [--slidein-delay:100ms]'>สวัสดีคุณ {user.user_firstname} {user.user_lastname}</h1>
                        <h2 className='text-1xl font-bold animate-slidein opacity-0 [--slidein-delay:200ms]'>ยินดีต้อนรับเข้าสู่ระบบของเรา</h2>
                    </div>
                    <hr />
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 md:gap-5 text-white">
                        <div className='h-[100px] md:h-[135px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip animate-slidein opacity-0 [--slidein-delay:200ms]' data-tip={`จำนวนที่ดูแล ${allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนที่ดูแล</h1>
                                <h2 className='text-2xl font-bold'>
                                    <CountUp end={allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} duration={5} /><label> คน</label>
                                </h2>
                            </div>
                        </div>
                        <div className='h-[100px] md:h-[135px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip animate-slidein opacity-0 [--slidein-delay:400ms]' data-tip={`จำนวนนักเรียนทั้งหมด ${allUser.filter(users => users.user_role === "USER").length} คน`}>
                            <div>
                                <h1 className='text-1xl  font-bold'>นักเรียนทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>
                                    <CountUp end={allUser.filter(users => users.user_role === "USER").length} duration={5} /> <label>คน</label>
                                </h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFuser).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='h-[100px] md:h-[135px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip animate-slidein opacity-0 [--slidein-delay:600ms]' data-tip={`จำนวนครูทั้งหมด ${allUser.filter(user => user.user_role === "TEACHER").length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนครูทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'><CountUp end={allUser.filter(user => user.user_role === "TEACHER").length} duration={5} /> <label>คน</label></h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFteacher).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='h-[100px] md:h-[135px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip animate-slidein opacity-0 [--slidein-delay:800ms]' data-tip={`จำนวนวิชาทั้งหมด ${allSub.length} วิชา `}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนวิชาทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'><CountUp end={allSub.length} duration={5} /> <label>วิชา</label></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
