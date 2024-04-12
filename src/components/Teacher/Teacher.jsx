
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";

export default function Teacher() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        document.title = 'SCHOOL NAME : Student';

        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUsers(rs.data.user)
        }
        getUser();

    }, [])

    return (
        <div className='max-w-[80rem] mx-auto mt-3 select-none'>
            <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto '>
                {users.length !== 0 ?
                    <table className='table text-black'>
                        <thead className='text-center'>
                            <tr className='text-sm text-black'>
                                <th>ลำดับ</th>
                                <th>ชื่อ</th>
                                <th>นามสกุล</th>
                                <th>ชื่อเล่น</th>
                                <th>เมล์</th>
                                <th>หน้าที่</th>
                                <th>ห้อง</th>
                            </tr>
                        </thead>
                        <tbody className='text-center '>
                            {users.filter(user => user.user_role === "TEACHER").map((user, number) => (
                                <tr className='hover:bg-[#FF90BC] hover:rounded-2xl hover:text-white transition ease-in-out' key={user.user_id}>
                                    <td className="text-[14px] rounded-l-full">{number + 1}</td>
                                    <td className="text-[14px]">{user.user_firstname}</td>
                                    <td className="text-[14px]">{user.user_lastname}</td>
                                    <td className="text-[14px]">{user.user_nickname}</td>
                                    <td className="text-[14px]">{user.user_email}</td>
                                    <td className="text-[14px]">{user.user_role === "USER" ? "นักเรียน" : "ครู"}</td>
                                    <td className="text-[14px] rounded-r-full">{user.class.class_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                }
            </div>
        </div>
    )
}
