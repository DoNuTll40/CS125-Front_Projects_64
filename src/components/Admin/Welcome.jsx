
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth'
import axiosPath from "../../configs/axios-path";

export default function Student() {
    const { user } = useAuth();
    const [student, setStudent] = useState([]);

    useEffect(() => {
        document.title = 'Home';
        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudent(rs.data.user)
        }
        getUser();

    }, [])

    return (
        <div className='max-w-[80rem] mx-auto mt-3 select-none'>
            {/* Create Table */}
            <div className='bg-white p-5 rounded-t-2xl max-w-[53rem] h-screen mt-5 mx-auto'>
                {student.filter(users => users.class_id === user.class_id && users.user_role === "USER").length !== 0 ?
                    <table className='table table-xs text-black'>
                        <thead className='text-center'>
                            <tr>
                                <th>No</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th colSpan="2">Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {student.filter(users => users.class_id === user.class_id && users.user_role === "USER").map((user, number) => (
                                <tr className='hover:bg-[#FF90BC] hover:text-white h-10' key={user.user_id}>
                                    <th className="text-[14px]">{number + 1}</th>
                                    <td className="text-[14px]">{user.user_firstname}</td>
                                    <td className="text-[14px]">{user.user_lastname}</td>
                                    <th className="text-[14px]">{user.user_phone}</th>
                                    <td className="text-[14px]">{user.user_role === "USER" ? "STUDENT" : "Null"}</td>
                                    <td>123</td>
                                    <td>123</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <p className='text-2xl font-semibold underline text-center'>ไม่พบข้อมูล</p>
                }
            </div>
        </div>
    )
}
