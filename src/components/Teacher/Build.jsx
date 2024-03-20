
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";

export default function TeacherBuild() {

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

    }, [builds])

    const hdlDelete = async (id) => {
        try {
            if (confirm("คุณต้องการลบข้อมูลหรือไม่")) {
                let token = localStorage.getItem('token')
                const rs = await axios.delete(`/admin/builds/${id}`, {
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
                    {builds.length !== 0 ?
                        <table className='table text-black'>
                            <thead className='text-center'>
                                <tr className='text-black'>
                                    <th>อันดับ</th>
                                    <th>ชื่ออาคาร</th>
                                    <th>เลขอาคาร</th>
                                    <th>รูปอาคาร</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {builds.map((builds, number) => (
                                    <tr key={builds.build_id}>
                                        <th>{number + 1}</th>
                                        <td>{builds.build_name}</td>
                                        <td>{builds.build_number}</td>
                                        <td><img className='rounded-lg max-w-[200px] mx-auto pointer-events-none' src={builds.build_image} /></td>
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
