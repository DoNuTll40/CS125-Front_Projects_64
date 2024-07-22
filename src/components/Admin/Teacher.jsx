
import { useEffect, useState } from 'react';
import axiosPath from "../../configs/axios-path";

export default function Teacher() {

    const [users, setUsers] = useState([])

    const role = location.pathname.split('/')[1]


    useEffect(() => {
        document.title = role.slice(0, 1).toUpperCase()+role.slice(1, role.length) + ' | รายชื่อคุณครู';
        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                setUsers(rs.data.user)
            }
        }
        getUser();
    }, [])

    return (
        <div className='max-w-[80rem] mx-auto mt-3 select-none'>
            <div className='bg-white p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto hidden md:block animate-slidein opacity-0 [--slidein-delay:300ms]'>
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
                        <tbody className='text-center'>
                            {users.filter(user => user.user_role === "TEACHER").map((user, number) => (
                                <tr className='hover:bg-[#FF90BC] hover:rounded-2xl hover:text-white' key={user.user_id}>
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
            {/* responsive */}
            <div className="bg-white py-1 px-2 rounded-2xl max-w-[53rem] mt-5 mx-auto block md:hidden">
                <p className='text-center text-lg font-bold text-base-200 mt-2 drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)]'>รายชื่ออาจารย์</p>
                {users.filter(user => user.user_role === "TEACHER").map((user, number) => (
                    <div className={`animate-slidein opacity-0 [--slidein-delay:200ms] my-2 flex justify-between font-bold text-white px-2 py-2 rounded-lg shadow-md ${user.user_nameprefix === "นางสาว" || user.user_nameprefix === "นาง" ? "bg-[#FF90BC]" : "bg-[#6096B4]"}`} key={number}>
                        <div className={`w-2/3 flex flex-col gap-2`}>
                            <p>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                            <p>{user.user_email}</p>
                            <p>{user.user_phone}</p>
                            <p>ประจำชั้น {user.class.class_name}</p>
                        </div>
                        <div className='w-1/3 flex justify-center items-center'>
                            <img className='max-w-[100px] max-h-[100px] border-2 shadow-md rounded-lg pointer-events-none' src={user.user_image} alt="photo" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
