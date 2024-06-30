import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Schedule() {

    const [getClass, setGetClass] = useState([])
    const [getSchedule, setGetSchedule] = useState([])
    const navigate = useNavigate();
    const [input, setInput] = useState({
        class_id: "1",
    });

    useEffect(() => {
        document.title = "All Schedule"
        const getClassRoom = async () => {
            try {
                let token = localStorage.getItem('token')
                const rs = await axiosPath.get(`/admin/class`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setGetClass(rs.data.useClass)
            } catch (err) {
                alert(err.message)
            }
        }
        getClassRoom()

        const importSchedule = async () => {
            try {
                let classId = input.class_id
                let token = localStorage.getItem('token')
                const rs = await axiosPath.get(`/admin/schedule/${classId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setGetSchedule(rs.data.schedule)
            } catch (err) {
                alert(err.message)
                console.log(err)
            }
        }
        importSchedule()

    }, [input])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlDelete = async (id) => {
        // alert(id)
        if (confirm('คุณต้องการลบหรือไม่')) {
            let token = localStorage.getItem('token');
            const rs = await axiosPath.delete(`/admin/schedule/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                alert("ลบข้อมูลเรียบร้อยแล้ว")
            }
        }
    }

    function sortByDay(a, b) {
        const daysOrder = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
        return daysOrder.indexOf(a.sched_day) - daysOrder.indexOf(b.sched_day);
    }

    const sortedSchedules = getSchedule.sort(sortByDay);

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden'>
                    <div className='flex justify-between'>
                        <select className='w-32 px-2 hover:font-bold focus:font-bold rounded-lg appearance-none bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white' name="class_id" onChange={hdlChange}>
                            <option hidden>เลือกห้องเรียน</option>
                            {getClass.filter(el => el.class_name !== "ADMIN" && el.class_name !== "ไม่มีห้อง").map((el, index) => (
                                <option key={index} value={el.class_id}>{el.class_name}</option>
                            ))}
                        </select>
                        <button className='p-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type="button" onClick={() => navigate('add')}>เพิ่ม</button>
                    </div>
                    <div className="hidden md:block">
                        {getSchedule.length !== 0 ?
                            <table className='table table-xs text-black my-1'>
                                <thead className='text-center'>
                                    <tr className='text-[15px] text-black'>
                                        <th>ลำดับ</th>
                                        <th>วัน</th>
                                        <th>เวลา</th>
                                        <th>จำนวนคาบ</th>
                                        <th>ชื่ออาจารย์</th>
                                        <th>ห้อง</th>
                                        <th>อาคารเรียน</th>
                                        <th colSpan="2">ตัวเลือก</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {getSchedule.map((el, number) => (
                                        <tr key={number} className="text-[15px]">
                                            <th className="text-[15px]">{number + 1}</th>
                                            <td className="text-[15px]">{el.sched_day}</td>
                                            <td className="text-[15px]">{el.sched_time}</td>
                                            <td className="text-[15px]">{el.sched_count}</td>
                                            <td className="text-[15px]">{el.user.user_firstname}</td>
                                            <td className="text-[15px]">{el.subject.room.room_name}</td>
                                            <td className="text-[15px]">{el.subject.room.build.build_name}</td>
                                            <th className="text-[15px]"><button className="py-2.5 px-3 hover:bg-gray-600 rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /></button></th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <p className="text-xl font-bold py-2 my-1 border-y-2 text-center">ระบบไม่พบข้อมูลตารางเรียน</p>}
                    </div>

                    {/* responsive */}

                    <div className="block md:hidden">
                        <div>
                            <p className="text-center font-bold text-lg text-black mt-3 drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">ตารางเรียนทั้งหมด</p>
                            {sortedSchedules.length !== 0 ?
                                <div className="flex gap-2 flex-wrap justify-between mt-1 text-sm font-bold text-white sm:text-[13px]">
                                    <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-yellow-400">
                                        <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-yellow-400">วันจันทร์</p>
                                        {sortedSchedules.filter(el => el.sched_day === "จันทร์").map((el, index) => (
                                            <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                                                <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                                                    <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                                                </div>
                                                <div className="absolute bg-white top-0 right-0 w-[20%] h-6 pt-0.5 rounded-bl-md hover:bg-gray-700 text-black hover:text-white hover:font-extrabold hover:cursor-pointer transition ease-in-out">
                                                    <button className="ml-[20%] rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /> ลบ</button>
                                                </div>
                                                <div className="my-1 text-center">
                                                    <div>
                                                        <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                                                        <p>จำนวน {el.sched_count} คาบ</p>
                                                    </div>
                                                    <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <p>ห้อง {el.subject.room.room_name}</p>
                                                    <p>อาคาร {el.subject.room.build.build_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-pink-400">
                                        <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-pink-400">วันอังคาร</p>
                                        {sortedSchedules.filter(el => el.sched_day === "อังคาร").map((el, index) => (
                                            <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                                                <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                                                    <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                                                </div>
                                                <div className="absolute bg-white top-0 right-0 w-[20%] h-6 pt-0.5 rounded-bl-md hover:bg-gray-700 text-black hover:text-white hover:font-extrabold hover:cursor-pointer transition ease-in-out">
                                                    <button className="ml-[20%] rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /> ลบ</button>
                                                </div>
                                                <div className="my-1 text-center">
                                                    <div>
                                                        <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                                                        <p>จำนวน {el.sched_count} คาบ</p>
                                                    </div>
                                                    <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <p>ห้อง {el.subject.room.room_name}</p>
                                                    <p>อาคาร {el.subject.room.build.build_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-green-400">
                                        <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-green-400">วันพุธ</p>
                                        {sortedSchedules.filter(el => el.sched_day === "พุธ").map((el, index) => (
                                            <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                                                <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                                                    <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                                                </div>
                                                <div className="absolute bg-white top-0 right-0 w-[20%] h-6 pt-0.5 rounded-bl-md hover:bg-gray-700 text-black hover:text-white hover:font-extrabold hover:cursor-pointer transition ease-in-out">
                                                    <button className="ml-[20%] rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /> ลบ</button>
                                                </div>
                                                <div className="my-1 text-center">
                                                    <div>
                                                        <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                                                        <p>จำนวน {el.sched_count} คาบ</p>
                                                    </div>
                                                    <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <p>ห้อง {el.subject.room.room_name}</p>
                                                    <p>อาคาร {el.subject.room.build.build_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-orange-400">
                                        <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-orange-400">วันพฤหัสบดี</p>
                                        {sortedSchedules.filter(el => el.sched_day === "พฤหัสบดี").map((el, index) => (
                                            <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                                                <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                                                    <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                                                </div>
                                                <div className="absolute bg-white top-0 right-0 w-[20%] h-6 pt-0.5 rounded-bl-md hover:bg-gray-700 text-black hover:text-white hover:font-extrabold hover:cursor-pointer transition ease-in-out">
                                                    <button className="ml-[20%] rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /> ลบ</button>
                                                </div>
                                                <div className="my-1 text-center">
                                                    <div>
                                                        <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                                                        <p>จำนวน {el.sched_count} คาบ</p>
                                                    </div>
                                                    <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <p>ห้อง {el.subject.room.room_name}</p>
                                                    <p>อาคาร {el.subject.room.build.build_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-blue-400">
                                        <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-blue-400">วันศุกร์</p>
                                        {sortedSchedules.filter(el => el.sched_day === "ศุกร์").map((el, index) => (
                                            <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                                                <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                                                    <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                                                </div>
                                                <div className="absolute bg-white top-0 right-0 w-[20%] h-6 pt-0.5 rounded-bl-md hover:bg-gray-700 text-black hover:text-white hover:font-extrabold hover:cursor-pointer transition ease-in-out">
                                                    <button className="ml-[20%] rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /> ลบ</button>
                                                </div>
                                                <div className="my-1 text-center">
                                                    <div>
                                                        <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                                                        <p>จำนวน {el.sched_count} คาบ</p>
                                                    </div>
                                                    <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <p>ห้อง {el.subject.room.room_name}</p>
                                                    <p>อาคาร {el.subject.room.build.build_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                : <p className="text-xl font-bold py-2 my-1 border-y-2 text-center">ระบบไม่พบข้อมูลตารางเรียน</p>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
