
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import e from 'cors';

export default function Build() {

    const [builds, setBuild] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'SCHOOL NAME - Builds';

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

    }, [builds])

    const hdlDelete = async (id) => {
        try {
            if (confirm("คุณต้องการลบข้อมูลหรือไม่")) {
                let token = localStorage.getItem('token')
                const rs = await axiosPath.delete(`/admin/builds/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (rs.status === 200) {
                    alert("ลบข้อมูลเรียบร้อยแล้ว")
                }
            }
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
    }

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                    <div className='flex justify-end font-bold'>
                        <button className='border-[#FF90BC] bg-transparent border-2 text-[#FF90BC] py-2 w-1/6 rounded-lg shadow-md hover:bg-[#6096B4] hover:text-white hover:border-[#6096B4] scale-100 active:scale-95 active:border-[#6096B4] active:text-white active:bg-[#6096B4] transition ease-in-out' type="button" onClick={() => navigate('add')}>เพิ่ม</button>
                    </div>

                    <div className='mt-2 hidden md:block'>
                        {builds.length !== 0 ?
                            <table className='table table-sm text-black'>
                                <thead className='text-center'>
                                    <tr className='text-black'>
                                        <th>อันดับ</th>
                                        <th>ชื่ออาคาร</th>
                                        <th>เลขอาคาร</th>
                                        <th>รูปอาคาร</th>
                                        <th colSpan="2">ตัวเลือก</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {builds.map((builds, number) => (
                                        <tr key={builds.build_id}>
                                            <th>{number + 1}</th>
                                            <td>{builds.build_name}</td>
                                            <td>{builds.build_number}</td>
                                            <td><img className='rounded-lg max-w-[200px] mx-auto pointer-events-none' src={builds.build_image} /></td>
                                            <th className='text-end'><button className=''>กำลังพัฒนา..</button></th>
                                            <td><button className='' onClick={() => hdlDelete(builds.build_id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                        }
                    </div>

                    {/* responsive */}

                    <div className='text-white text-sm font-semibold block md:hidden'>
                        <p className='text-black text-center font-bold text-lg mt-2'>รายชื่ออาคารทั้งหมดที่มีในระบบ</p>
                        <div className='mt-1'>
                            <hr />
                            {builds.map((el, index) => (
                                <div className={`flex justify-between my-2 p-2 rounded-md shadow-md ${index % 2 === 0 ? "bg-[#6096B4]   " : "bg-[#FF90BC]"}`} key={index}>
                                    <div className='w-1/3'>
                                        <img className='max-w-[120px] max-h-[120px] rounded-md border-white border-2 shadow-xl' src={el.build_image} alt="image builds" />
                                    </div>
                                    <div className='w-full flex flex-col justify-center items-center drop-shadow-md'>
                                        <p>ชื่ออาคาร {el.build_name}</p>
                                        <p>เลขอาคาร {el.build_number}</p>
                                    </div>
                                    <button className='pr-3' onClick={() => hdlDelete(builds.build_id)}><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
