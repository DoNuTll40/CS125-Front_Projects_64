
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";

export default function Build() {

    const [builds, setBuild] = useState([])


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
    }, [])

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
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
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
