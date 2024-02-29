import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
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
                const rs = await axios.get(`http://localhost:8000/admin/class`, {
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

        const getSchedule = async () => {
            try {
                let classId = input.class_id
                let token = localStorage.getItem('token')
                const rs = await axios.get(`http://localhost:8000/admin/schedule/${classId}`, {
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
        getSchedule()

    }, [input, getSchedule])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlDelete = async (id) => {
        // alert(id)
        if (confirm('คุณต้องการลบหรือไม่')) {
            let token = localStorage.getItem('token');
            const rs = await axios.delete(`http://localhost:8000/admin/schedule/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                alert("ลบข้อมูลเรียบร้อยแล้ว")
            }
        }
    }

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
                        <button className='p-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type="button" onClick={() => navigate('delete')}>เพิ่ม</button>
                    </div>
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
                                        <th className="text-[15px]">กำลังพัฒนา..</th>
                                        <th className="text-[15px]"><button className="py-2.5 px-3 hover:bg-gray-600 rounded-full" onClick={() => hdlDelete(el.sched_id)}><FontAwesomeIcon icon={faTrash} /></button></th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p className="text-xl font-bold py-2 my-1 border-y-2 text-center">ระบบไม่พบข้อมูลตารางเรียน</p>}
                </div>
            </div>
        </>
    )
}
