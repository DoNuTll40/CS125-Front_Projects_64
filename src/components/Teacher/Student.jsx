
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth'
import Header from '../Header'
import axios from 'axios';

export default function Student() {

    const { user } = useAuth();

    const [teacher, setTeacher] = useState([])
    const [student, setStudent] = useState([])

    useEffect(() => {
        document.title = 'Student';
        const getTeacher = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/teachers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTeacher(rs.data.teacher)
        }

        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudent(rs.data.user)
        }
        getTeacher();
        getUser();

    }, [])

    return (
        <>
            <div className='max-w-[80rem] mx-auto mt-3 select-none'>

                <div className='bg-white p-5 rounded-t-2xl max-w-[53rem] h-screen mt-5 mx-auto'>
                    <div className='flex justify-end'>
                        <button className='btn btn-success' onClick={() => document.getElementById('my_modal_3').showModal()} type="button">เพิ่ม</button>
                    </div>
                    {student.length !== 0 ?
                        <table className='table text-black'>
                            <thead className='text-center'>
                                <tr className=''>
                                    <th>No</th>
                                    <th>FirstName</th>
                                    <th>LastName</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {student.filter(user => user.user_role === "USER").map((user, number) => (
                                    <tr key={user.user_id}>
                                        <td>{number + 1}</td>
                                        <td>{user.user_firstname}</td>
                                        <td>{user.user_lastname}</td>
                                        <td>{user.user_phone}</td>
                                        <td>{user.user_role === "USER" ? "STUDENT" : "Null"}</td>
                                        <td className='text-end'><button className='btn btn-warning' onClick={() => document.getElementById('my_modal_1').showModal()}>E</button></td>
                                        <td><button className='btn btn-error'>D</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                    }
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                <form className='flex flex-col font-semibold'>
                                    <h3 className="font-bold text-lg">เพิ่มข้อมูล</h3>
                                    <p className="py-4">กรุณากรอกให้ครบทุกช่อง</p>
                                    <p>ชื่อ</p>
                                    <input className='w-full px-4 py-1 rounded-md' 
                                        type="text" 
                                    />
                                    <p>นามสกุล</p>
                                    <input className='w-full px-4 py-1 rounded-md'
                                        type="text" 
                                    />
                                    <p>ชื่อเล่น</p>
                                    <input className='w-full px-4 py-1 rounded-md'
                                        type="text" 
                                    />
                                    <p>วัน-เดือน-ปีเกิด</p>
                                    <input className='w-full px-4 py-1 rounded-md'
                                        type="date" name="" id="" 
                                    />
                                    <p>email</p>
                                    <input className='w-full px-4 py-1 rounded-md'
                                        type="text" 
                                    />
                                    <p>เบอร์โทร</p>
                                    <input className='w-full px-4 py-1 rounded-md' 
                                        type="text"
                                    />
                                    <p>ที่อยู่</p>
                                    <textarea className='w-full px-4 py-1 rounded-md' name="" id="" cols="30" rows="5"></textarea>
                                    <div className='mt-4 flex gap-2 justify-end'>
                                        <button className='btn btn-success'>Submit</button>
                                        <input type='reset' className='btn btn-warning' value="Reset" />
                                    </div>
                                </form>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
        </>
    )
}
