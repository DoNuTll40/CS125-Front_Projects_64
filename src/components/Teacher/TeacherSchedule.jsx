
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTable, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TeacherSchedule() {

    const [schedule, setSchedule] = useState([])
    const { setFullSchedule } = useAuth();

    const navigate = useNavigate();

    let token = localStorage.getItem('token')

    useEffect(() => {
        const getSchedule = async () => {
            const rs = await axios.get(`http://localhost:8000/admin/teacher/schedule`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setSchedule(rs.data.getSchedule);
            setFullSchedule(rs.data.getSchedule);
        }
        getSchedule();
    }, [])

    const hdlPrint = () => {
        navigate('/teacher-schedule');
    }

    return (
        <div className='max-w-[80rem] mx-auto mt-3 select-none'>
            <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                <p className="text-center font-extrabold text-black  w-1/4 mx-auto text-lg relative">ตารางสอนของอาจารย์</p>
                <p className="text-center text-black mb-4 mx-auto text-[16px] relative"><b>คำอธิบาย</b> เวลาที่แสดงจะเป็นการแสดงเวลาแค่ช่วงคาบแรกที่สอน</p>
                <div className='flex justify-end'>
                    <button className='flex items-center gap-1 hover:gap-2 active:gap-2 font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint}><FontAwesomeIcon icon={faTable} /> ดูตารางสอน</button>
                </div>
                {schedule.length !== 0 ?
                    <table className='table table-xs text-black'>
                        <thead className='text-center'>
                            <tr className="text-black text-[14px]">
                                <th>ลำดับ</th>
                                <th>ชื่อวิชา</th>
                                <th>รหัสวิชา</th>
                                <th>วัน</th>
                                <th>เวลา</th>
                                <th>จำนวนชั่วโมง</th>
                                <th>ห้อง</th>
                                <th>ห้องเรียน</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {schedule.map((el, number) => (
                                <tr className='hover:bg-[#FF90BC] hover:text-white h-10 transition ease-in-out' key={number}>
                                    <th className="text-[14px] rounded-l-full">{number + 1}</th>
                                    <td className="text-[14px]">{el.subject.sub_name}</td>
                                    <td className="text-[14px]">{el.subject.sub_code}</td>
                                    <td className="text-[14px]">วัน{el.sched_day}</td>
                                    <td className="text-[14px]">{el.sched_count === 2 && el.sched_time === "13:30-14:30" ? "13:30-15:30" : el.sched_time}</td>
                                    <td className="text-[14px]">{el.sched_count === 2 ? "สองชั่วโมง" : "หนึ่งชั่วโมง"}</td>
                                    <td className="text-[14px]">{el.class.class_name}</td>
                                    <td className="text-[14px] rounded-r-full">{el.subject.room.room_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                }
            </div>
        </div>
    )
}
