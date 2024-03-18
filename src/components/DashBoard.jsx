import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCalendarMinus } from "@fortawesome/free-regular-svg-icons";

export default function DashBoard() {

    const { user, time } = useAuth();
    const [allUser, setAllUser] = useState([]);
    const [allSub, setAllSub] = useState([]);

    useEffect(() => {
        const getAll = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://10.90.0.20:8000/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllUser(rs.data.user)
        }
        getAll();

        const getSub = async () => {
            let token = localStorage.getItem('token');
            const rs = await axios.get('http://10.90.0.20:8000/admin/subject', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAllSub(rs.data.sub);
        }
        getSub();
    }, [])

    const numberOFuser = (allUser.filter(users => users.user_role === "USER").length / allUser.filter(users => users.user_role !== "ADMIN").length) * 100
    const numberOFteacher = (allUser.filter(users => users.user_role === "TEACHER").length / allUser.filter(users => users.user_role !== "ADMIN").length) * 100

    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const time2 = new Date();

    const dayOfWeek = thaiDays[time2.getDay()];
    const dayOfMonth = time2.getDate();
    const month = thaiMonths[time2.getMonth()];
    const year = time2.getFullYear() + 543;

    const thaiDate = `วัน${dayOfWeek}ที่ ${dayOfMonth} เดือน ${month} พ.ศ. ${year} เวลา ${time.length !== 0 ? new Date(time).toLocaleTimeString('th-TH') : new Date().toLocaleTimeString('th-TH')} น.`;

    return (
        <div>
            <div className='max-w-[80rem] mx-auto mt-16 select-none'>
                <div className='bg-white p-3 rounded-2xl max-w-[53rem] mx-auto'>
                    <div className="flex items-center justify-end gap-1 px-2 text-[12px] mobile:text-md font-extrabold text-base-200">
                        <FontAwesomeIcon icon={faCalendarMinus} className="text-lg pb-1" />
                        <p>{thaiDate}</p>
                    </div>
                    <div className='my-3 text-center flex flex-col gap-3 text-base-200'>
                        <h1 className='text-2xl font-bold'>สวัสดีคุณ {user.user_firstname} {user.user_lastname}</h1>
                        <h2 className='text-1xl font-bold'>ยินดีต้อนรับเข้าสู่ระบบของเรา</h2>
                    </div>
                    <hr />
                    <div className="mt-3 flex gap-1 mobile:gap-3 md:gap-5 mobile:scale-90 md:scale-100 justify-around grid-flow-row md:justify-center flex-wrap text-white text-center">
                        <div className='w-full mobile:w-[135px] h-[85px] mobile:h-[129px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนที่ดูแล ${allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนที่ดูแล</h1>
                                <h2 className='text-2xl font-bold'>
                                    {allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} <label>คน</label>
                                </h2>
                            </div>
                        </div>
                        <div className='w-full mobile:w-[135px] h-[85px] mobile:h-[129px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนนักเรียนทั้งหมด ${allUser.filter(users => users.user_role === "USER").length} คน`}>
                            <div>
                                <h1 className='text-1xl  font-bold'>นักเรียนทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>
                                    {allUser.filter(users => users.user_role === "USER").length} <label>คน</label>
                                </h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFuser).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='w-full mobile:w-[135px] h-[85px] mobile:h-[129px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนครูทั้งหมด ${allUser.filter(user => user.user_role === "TEACHER").length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนครูทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>{allUser.filter(user => user.user_role === "TEACHER").length} <label>คน</label></h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFteacher).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='w-full mobile:w-[135px] h-[85px] mobile:h-[129px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนวิชาทั้งหมด ${allSub.length} วิชา `}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนวิชาทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>{allSub.length} <label>วิชา</label></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
