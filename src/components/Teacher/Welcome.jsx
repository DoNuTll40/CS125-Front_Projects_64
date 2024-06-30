
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth'
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Student() {
    const { user, setFullStudent } = useAuth();
    const [student, setStudent] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Home`;
        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudent(rs.data.user)
            setFullStudent(rs.data.user.filter(users => users.class_id === user.class_id && users.user_role === "USER"))
        }
        getUser();
    }, [])

    const hdlPrint = () => {
        navigate('/teacher/print');
    }

    // console.log(student)

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white p-4 md:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto'>
                    {student.length !== 0 ?
                        <div className='hidden md:block'>
                            <div className='flex justify-end'>
                                {student.filter(users => users.class_id === user.class_id && users.user_role === "USER").length === 0 ?
                                    <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white disabled:opacity-40' disabled onClick={hdlPrint} > <FontAwesomeIcon icon={faPrint} /> ปริ้นรายชื่อ</button>
                                    :
                                    <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint} > <FontAwesomeIcon icon={faPrint} /> ปริ้นรายชื่อ</button>
                                }
                            </div>
                            <table className='table table-xs text-black'>
                                <thead className='text-center'>
                                    <tr className='text-black text-[14px]'>
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
                        </div>
                        : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                    }
                    <div className='block md:hidden'>
                        {student.filter(users => users.class_id === user.class_id && users.user_role === "USER").length !== 0 ?
                            <div>
                                <p className='text-center mb-1 text-lg font-bold text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]'>รายชื่อนักเรียนที่ดูแล</p>
                                <p className='text-center mb-2 text-[12px] font-semibold text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]'><b>หมายเหตุ</b> ถ้าต้องการปริ้นรายชื่อให้เป็นเว็บไซต์บน PC หรือ Laptop</p>
                                {student.filter(users => users.user_role === "USER").map((user, number) => (
                                    <div key={number} className={`my-2 border-2 border-white rounded-md px-3 text-white shadow-md font-bold py-2 ${number % 2 === 0 ? "bg-[#6096B4]   " : "bg-[#FF90BC]"}`}>
                                        <div className='flex gap-2'>
                                            <p>{number + 1}</p>
                                            <p>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <p>{user.user_email}</p>
                                            <p>{user.user_phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            : <p className='text-sm font-bold text-black text-center'>ไม่พบข้อมูล</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
