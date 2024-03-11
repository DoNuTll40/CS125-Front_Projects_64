import { useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth"
import axios from "axios";

export default function DashBoard() {

    const { user } = useAuth();
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

    return (
        <div>
            <div className='max-w-[80rem] mx-auto mt-16 select-none'>
                <div className='bg-white p-3 rounded-2xl max-w-[53rem] mx-auto'>
                    <div className='my-3 text-center flex flex-col gap-3'>
                        <h1 className='text-2xl font-bold'>สวัสดีคุณ {user.user_firstname} {user.user_lastname}</h1>
                        <h2 className='text-1xl font-bold'>ยินดีต้อนรับเข้าสู่ระบบของเรา</h2>
                    </div>
                    <hr />
                    <div className="mt-3 flex gap-5 justify-center text-white text-center">
                        <div className='w-[135px] h-[129px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนที่ดูแล ${allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนที่ดูแล</h1>
                                <h2 className='text-2xl font-bold'>
                                    {allUser.filter(users => users.user_role === "USER" && users.class_id === user.class_id).length} <label>คน</label>
                                </h2>
                            </div>
                        </div>
                        <div className='w-[135px] h-[129px] p-3 bg-[#FF90BC] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนนักเรียนทั้งหมด ${allUser.filter(users => users.user_role === "USER").length} คน`}>
                            <div>
                                <h1 className='text-1xl  font-bold'>นักเรียนทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>
                                    {allUser.filter(users => users.user_role === "USER").length} <label>คน</label>
                                </h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFuser).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='w-[135px] h-[129px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนครูทั้งหมด ${allUser.filter(user => user.user_role === "TEACHER").length} คน`}>
                            <div>
                                <h1 className='text-1xl font-bold' >จำนวนครูทั้งหมด</h1>
                                <h2 className='text-2xl font-bold'>{allUser.filter(user => user.user_role === "TEACHER").length} <label>คน</label></h2>
                                <h1 className="text-[12px] font-bold mt-1">คิดเป็น {(numberOFteacher).toFixed(2)}% ของผู้ใช้ทั้งหมด</h1>
                            </div>
                        </div>
                        <div className='w-[135px] h-[129px] p-3 bg-[#6096B4] rounded-xl flex justify-center items-center tooltip' data-tip={`จำนวนวิชาทั้งหมด ${allSub.length} วิชา `}>
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
