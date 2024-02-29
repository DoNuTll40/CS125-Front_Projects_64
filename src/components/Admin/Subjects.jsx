import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Subjects() {

    const [getSubject, setGetSubject] = useState([]);
    const navigate = useNavigate();

    let token = localStorage.getItem('token');

    useEffect(() => {
        const useSubjects = async () => {
            const rs = await axios.get('http://localhost:8000/admin/subject', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGetSubject(rs.data.sub)
        }
        useSubjects();
    }, [getSubject])

    const hdlAdd = () => {
        navigate('add')
    }

    const hdlDelete = async (id) => {
        if (confirm(`คุณต้องการลบใช้หรือไม่`)) {
            try {
                const rs = await axios.delete(`http://localhost:8000/admin/subject/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden'>
                    <div className='flex justify-end'>
                        <button className='p-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type="button" onClick={hdlAdd}>เพิ่ม</button>
                    </div>
                    {getSubject.length !== 0 ?
                        <table className='table table-xs text-black my-1'>
                            <thead className='text-center'>
                                <tr className='text-[15px] text-black'>
                                    <th>ลำดับ</th>
                                    <th>ชื่อวิชา</th>
                                    <th>รหัสวิชา</th>
                                    <th>กลุ่มวิชา</th>
                                    <th>ห้องที่เรียน</th>
                                    <th colSpan="2">ตัวเลือก</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {getSubject.map((el, number) => (
                                    <tr key={number} className="text-[15px]">
                                        <th className="text-[15px]">{number + 1}</th>
                                        <td className="text-[15px]">{el.sub_name}</td>
                                        <td className="text-[15px]">{el.sub_code}</td>
                                        <td className="text-[15px]">{el.major.major_name}</td>
                                        <td className="text-[15px]">{el.room.room_name}</td>
                                        <th className="text-[15px]">กำลังพัฒนา..</th>
                                        <th className="text-[15px]"><button className="py-2.5 px-3 hover:bg-gray-600 rounded-full" onClick={() => hdlDelete(el.sub_id)}><FontAwesomeIcon icon={faTrash} /></button></th>
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
