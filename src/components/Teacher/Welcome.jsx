
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth'
import axios from 'axios';

export default function Student() {
    const { user } = useAuth();
    const [student, setStudent] = useState([]);

    useEffect(() => {
        document.title = 'Home';
        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudent(rs.data.user)
        }
        getUser();
    }, [])

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-5 rounded-t-2xl max-w-[53rem] h-screen mt-5 mx-auto'>
                    {student.length !== 0 ?
                        <table className='table table-xs text-black'>
                            <thead className='text-center'>
                                <tr>
                                <th>ลำดับ</th>
                                    <th>ชื่อ</th>
                                    <th>นามสกุล</th>
                                    <th>ชื่อเล่น</th>
                                    <th>เมล</th>
                                    <th>วันเกิด</th>
                                    <th>หน้าที่</th>
                                    <th>ห้อง</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {student.filter(users => users.class_id === user.class_id && users.user_role === "USER").map((user, number) => (
                                    <tr className='hover:bg-[#FF90BC] hover:text-white h-10 transition ease-in-out' key={user.user_id}>
                                        <td className="text-[14px]">{number + 1}</td>
                                        <td className="text-[14px]">{user.user_firstname}</td>
                                        <td className="text-[14px]">{user.user_lastname}</td>
                                        <td className="text-[14px]">{user.user_nickname}</td>
                                        <td className="text-[14px]">{user.user_email}</td>
                                        <td>{new Date(user.user_brithday).toLocaleDateString('th-TH')}</td>
                                        <td className="text-[14px]">{user.user_role === "USER" ? "นักเรียน" : "ครู"}</td>
                                        <td className="text-[14px]">{user.class.class_name}</td>
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
