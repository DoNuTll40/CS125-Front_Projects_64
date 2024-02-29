
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {

    const [builds, setBuild] = useState([])
    const [rooms, setRooms] = useState([])

    const navigate = useNavigate();

    console.log(rooms)

    useEffect(() => {
        document.title = 'SCHOOL NAME - Builds';

        const getRoom = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/rooms', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRooms(rs.data.rooms)
        }

        const getBuild = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/builds', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBuild(rs.data.builds);
        }

        getBuild();
        getRoom();

    }, [rooms])

    const hdlDelete = async (id) => {
        if (confirm("คุณต้องการลบข้อมูลใช่หรือไม่")) {
            try {
                let token = localStorage.getItem('token')
                const rs = await axios.delete(`http://localhost:8000/admin/rooms/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } catch (err) {
                console.log(err)
                alert(err.message, "โปรดแจ้งผู้พัฒนา")
            }
        }
    }

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                    <div className='flex justify-end'>
                        <button className='' onClick={() => navigate('add')} type="button">เพิ่ม</button>
                    </div>
                    {rooms.length !== 0 ?
                        <table className='table text-black'>
                            <thead className='text-center'>
                                <tr className='text-black'>
                                    <th>ลำดับ</th>
                                    <th>ชื่อห้องเรียน</th>
                                    <th>เลขห้องเรียน</th>
                                    <th>ชื่ออาคาร</th>
                                    <th colSpan="2">ตัวเลือก</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {rooms.map((room, number) => (
                                    <tr key={room.room_id}>
                                        <td>{number + 1}</td>
                                        <td>{room.room_name}</td>
                                        <td>{room.room_number}</td>
                                        <td>{room.build.build_name}</td>
                                        <th className='text-end'><button className=''>กำลังพัฒนา..</button></th>
                                        <td><button className='' onClick={() => hdlDelete(room.room_id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                    }
                </div>
            </div>
        </>
    )
}
