
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {

    const [builds, setBuild] = useState([])
    const [rooms, setRooms] = useState([])

    const navigate = useNavigate();

    // console.log(rooms)

    useEffect(() => {
        document.title = 'SCHOOL NAME - Builds';

        const getRoom = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/rooms', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRooms(rs.data.rooms)
        }

        const getBuild = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/builds', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBuild(rs.data.builds);
        }

        getBuild();
        getRoom();

    }, [])

    const hdlDelete = async (id) => {
        if (confirm("คุณต้องการลบข้อมูลใช่หรือไม่")) {
            try {
                let token = localStorage.getItem('token')
                const rs = await axiosPath.delete(`/admin/rooms/${id}`, {
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

    const hdlEdit = async (id) => {
        navigate(`edit/${id}`)
    }

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                    <div className='flex justify-end'>
                        <button className='' onClick={() => navigate('add')} type="button">เพิ่ม</button>
                    </div>
                    <div className='hidden md:block'>
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
                                            <th className='text-end'><button className='' onClick={() => hdlEdit(room.room_id)}><FontAwesomeIcon icon={faPenToSquare} /></button></th>
                                            <td><button className='' onClick={() => hdlDelete(room.room_id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                        }
                    </div>

                    {/* responsive */}

                    <div className='block md:hidden'>
                        <p className='text-center font-semibold text-black drop-shadow-[0_3px_2px_rgba(0,0,0,0.5)]'>รายชื่อห้องที่เรามีในระบบ</p>
                        <hr />
                        <div>
                            {rooms.map((el, index) => (
                                <div className={`flex gap-2 relative my-2 py-2 border-white border-2 rounded-md shadow-md ${index % 2 === 0 ? "bg-[#6096B4]" : "bg-[#FF90BC]"}`} key={index}>
                                    <p className='absolute bg-white w-10 rounded-br-lg rounded-tl-md text-end px-2 -top-[0.1rem] -left-[0.1rem] text-black font-extrabold text-sm'>{index + 1}</p>
                                    <div className="absolute flex items-center justify-around bg-white text-base-200 px-2 w-1/5 text-center font-extrabold -top-[0.1rem] right-0 rounded-bl-md">
                                        <button className="text-sm" onClick={() => hdlEdit(el.room_id)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                        <button className="text-sm" onClick={() => hdlDelete(el.room_id)}><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                    <div className='flex px-5 w-full justify-between mt-5 text-white font-bold'>
                                        <div className='flex justify-between w-full sm:hidden'>
                                            <div className='text-center'>
                                                <p className='text-sm'>ชื่อห้อง</p>
                                                <p>{el.room_name}</p>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-sm'>หมายเลขห้อง</p>
                                                <p>{el.room_number}</p>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-sm'>ชื่ออาคาร</p>
                                                <p>{el.build.build_name}</p>
                                            </div>
                                        </div>
                                        <div className='hidden sm:flex justify-between w-full'>
                                            <p>ชื่อห้อง {el.room_name}</p>
                                            <p>หมายเลขห้อง {el.room_number}</p>
                                            <p>ชื่ออาคาร {el.build.build_name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
