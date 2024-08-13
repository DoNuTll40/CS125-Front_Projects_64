
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Major() {

    const [majors, setMajors] = useState([])
    const [refetch, setRefetch] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Admin | รายชื่อกลุ่มวิชา';

        const getBuild = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/major', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMajors(rs.data.major);
        }

        getBuild();

    }, [refetch])

    const hdlDelete = async (id, major_name) => {
        Swal.fire({
            icon: 'question',
            title: "ต้องการลบข้อมูลหรือไม่ ?",
            html: `คุณต้องการลบกลุ่มวิชา <strong>${major_name}</strong> หรือไม่, เนื่องด้วยการลบจะทำให้ตารางเรียนที่อยู่ในกลุ่มวิชานี้จะหายไปด้วย, โปรดตรวจสอบข้อมูลก่อน`,
            showCancelButton: true,
            confirmButtonColor: '#E5252A',
            confirmButtonText: 'ใช่, ต้องการลบ',
            cancelButtonText: "ไม่, ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let token = localStorage.getItem('token')
                    const rs = await axiosPath.delete(`/admin/major/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if (rs.status === 200) {
                        Swal.fire({
                            title: "บันทึกข้อมูลเรียบร้อย",
                            icon: 'success',
                        });
                        setRefetch(prev => !prev)
                    }
                } catch (err) {
                    console.log(err)
                    Swal.fire({
                        text: err.response.data.message,
                        title: 'พบข้อผิดพลาด',
                        icon: 'error',
                    });
                }
            }
        })
    }

    const hdlEdit = async (id) => {
        navigate(`edit/${id}`)
    }

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                    <div className='flex justify-end'>
                        <button className='bg-[#FF90BC] font-semibold transition-all ease-in-out duration-150 hover:bg-[#6096B4] border-2 border-white text-white shadow-md py-2 px-3 rounded-lg' onClick={() => navigate('add')} type="button">เพิ่มกลุ่มวิชา</button>
                    </div>
                    <div className='hidden md:block'>
                        {majors.length !== 0 ?
                            <table className='table text-black'>
                                <thead className='text-center'>
                                    <tr className='text-black'>
                                        <th>ลำดับ</th>
                                        <th>ชื่อกลุ่มวิชา</th>
                                        <th colSpan="2">ตัวเลือก</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {majors.map((major, number) => (
                                        <tr key={number + 1}>
                                            <td>{major.major_id}</td>
                                            <td>{major.major_name}</td>
                                            <th className='text-end'><button className='' onClick={() => hdlEdit(major.major_id)}><FontAwesomeIcon icon={faPenToSquare} /></button></th>
                                            <td><button className='' onClick={() => hdlDelete(major.major_id, major.major_name)}><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                        }
                    </div>

                    {/* responsive */}

                    <div className='block md:hidden'>
                        <p className='text-center font-semibold text-black drop-shadow-[0_3px_2px_rgba(0,0,0,0.5)]'>รายชื่อกลุ่มวิชา</p>
                        <hr />
                        <div>
                            {majors.map((el, index) => (
                                <div className={`flex gap-2 relative my-2 py-2 border-white border-2 rounded-md shadow-md ${index % 2 === 0 ? "bg-[#6096B4]" : "bg-[#FF90BC]"}`} key={index}>
                                    <p className='absolute bg-white w-10 rounded-br-lg rounded-tl-md text-end px-2 -top-[0.1rem] -left-[0.1rem] text-black font-extrabold text-sm'>{index + 1}</p>
                                    <div className="absolute flex items-center justify-around bg-white text-base-200 px-2 w-1/5 text-center font-extrabold -top-[0.1rem] right-0 rounded-bl-md">
                                        <button className="text-sm" onClick={() => hdlEdit(el.major_id)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                        <button className="text-sm" onClick={() => hdlDelete(el.major_id, el.major_name)}><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                    <div className='flex px-5 w-full justify-between mt-5 text-white font-bold'>
                                        <div className='flex justify-between w-full sm:hidden'>
                                            <div className='text-center'>
                                                <p className='text-sm'>ไอดีกลุ่มวิชา</p>
                                                <p>{el.major_id}</p>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-sm'>ชื่อกลุ่มวิชา</p>
                                                <p>{el.major_name}</p>
                                            </div>
                                        </div>
                                        <div className='hidden sm:flex justify-between w-full'>
                                            <p>ไอดีกลุ่มวิชา {el.major_id}</p>
                                            <p>ชื่อกลุ่มวิชา {el.major_name}</p>
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
