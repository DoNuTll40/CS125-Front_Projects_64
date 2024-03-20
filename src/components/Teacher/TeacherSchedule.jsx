
import { useEffect, useState } from "react";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip, faGripLines, faPrint, faTable, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axiosPath from "../../configs/axios-path";

export default function TeacherSchedule() {

    const [schedule, setSchedule] = useState([])
    const { setFullSchedule } = useAuth();
    const [grip, setGrip] = useState(true)
    const [frame, setFrame] = useState(false)

    const navigate = useNavigate();

    let token = localStorage.getItem('token')

    useEffect(() => {
        const getSchedule = async () => {
            const rs = await axiosPath.get(`/admin/teacher/schedule`, {
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

    function sortByDay(a, b) {
        const daysOrder = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
        return daysOrder.indexOf(a.sched_day) - daysOrder.indexOf(b.sched_day);
    }

    const sortedSchedules = schedule.sort(sortByDay);

    const hdlGrip = () => {
        if(grip === true){
            setFrame(true)
            setGrip(false)
        }
        setGrip(true)
        setFrame(false)
    }

    const hdlFrame = () => {
        if(frame === true){
            setGrip(true)
            setFrame(false)
        }
        setFrame(true)
        setGrip(false)
    }   

    return (
        <div className='max-w-[80rem] mx-auto mt-3 select-none'>
            <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto hidden md:block'>
                <p className="text-center font-extrabold text-black  w-3/4 mx-auto text-lg relative">ตารางสอนของอาจารย์</p>
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

            <div data-theme="light" className="bg-white p-3 rounded-2xl max-w-[53rem] mt-5 mx-auto block md:hidden">
                <p className="text-center font-extrabold text-black  w-3/4 mx-auto text-lg relative">ตารางสอนของอาจารย์</p>
                <p className="text-center text-black mb-4 mx-auto text-[16px] relative"><b>คำอธิบาย</b> เวลาที่แสดงจะเป็นการแสดงเวลาแค่ช่วงคาบแรกที่สอน</p>
                <div className='flex justify-end'>
                    <button className='flex items-center gap-1 hover:gap-2 active:gap-2 font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint}><FontAwesomeIcon icon={faTable} /> ดูรายการสอน</button>
                </div>
                <div className="flex justify-between mb-4 text-white overflow-hidden bg-[#6096B4] w-20 h-7 rounded-full transition ease-in-out shadow-inner drop-shadow-sm">
                    <button className={`transition ease-in-out ${grip? "bg-[#FF90BC] px-3.5 shadow-inner border-r-2 border-white" : "px-3"}`} onClick={ () => hdlGrip()}><FontAwesomeIcon icon={faGrip}/></button>
                    <button className={`transition ease-in-out ${frame? "bg-[#FF90BC] px-3.5 shadow-inner border-l-2 border-white" : "px-3"}`} onClick={ () => hdlFrame()}><FontAwesomeIcon icon={faGripLines}/></button>
                </div>
                {/* {console.log(schedule)} */}
                <div className={`gap-3 flex transition ease-in-out ${grip ? "flex-row flex-wrap" : "flex-col"} justify-around w-full`}>
                    {sortedSchedules.map((el, number) => (
                        <div key={number} className={`bg-[#FF90BC] sk transition ease-in-out ${grip ? "w-[48%]" : "w-full"} text-white rounded-lg px-3 py-2 relative text-sm font-semibold shadow-lg border-2 border-[#6096B4]`}>
                            <p className="absolute top-[-12px] left-[-11px] bg-[#6096B4] px-2.5 py-1 rounded-full shadow-md">{number + 1}</p>
                            <div className="flex justify-between">
                                <p>{frame?"วัน":""} {el.sched_day}</p>
                                <p>{frame?"เวลา":""} {el.sched_time}</p>
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="text-[15px]">
                                    <p>{frame?"วิชา":""} {el.subject.sub_name}</p>
                                    <p>ห้อง {el.class.class_name}</p>
                                </div>
                                <div className="text-[13px] text-center bg-[#6096B4] px-2 py-1 rounded-md">
                                    <p>จำนวน</p>
                                    <p className="text-lg">{el.sched_count}</p>
                                    <p>คาบ</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
