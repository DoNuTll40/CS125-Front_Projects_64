
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth'
import Header from '../Header'
import axios from 'axios';

export default function Build() {

    const { user } = useAuth();

    const [teacher, setTeacher] = useState([])
    const [student, setStudent] = useState([])
    const [builds, setBuild] = useState([])

    useEffect(() => {
        document.title = 'Build';
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
            // console.log(rs.data)
            setStudent(rs.data.user)
        }

        const getBuild = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get('http://localhost:8000/admin/builds', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBuild(rs.data.builds);
        }

        getBuild();
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
                    {builds.length !== 0 ?
                        <table className='table text-black'>
                            <thead className='text-center'>
                                <tr>
                                    <th>No</th>
                                    <th>Build Name</th>
                                    <th>Build Number</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {builds.map((builds, number) => (
                                    <tr key={builds.build_id}>
                                        <td>{number + 1}</td>
                                        <td>{builds.build_name}</td>
                                        <td>{builds.build_number}</td>
                                        <td className='text-end'><button className='btn btn-warning' onClick={() => document.getElementById('my_modal_1').showModal()}>E</button></td>
                                        <td><button className='btn btn-error'>D</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                    }
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">แก้ไขข้อมูล</h3>
                            <p className="py-4">กรุณากรอกให้ครบทุกช่อง</p>
                            <p>ชื่อ</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>นามสกุล</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>ชื่อเล่น</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>email</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>เบอร์โทร</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>ที่อยูุ่</p>
                            <textarea className='w-full px-4 py-1 rounded-md' name="" id="" cols="30" rows="5"></textarea>
                            <p>วัน-เดือน-ปีเกิด</p>
                            <input className='w-full px-4 py-1 rounded-md' type="date" name="" id="" />
                            <div className='flex justify-end gap-5 mt-4'>
                                <button className='btn btn-success'>Submit</button>
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">เพิ่มข้อมูล</h3>
                            <p className="py-4">กรุณากรอกให้ครบทุกช่อง</p>
                            <p>ชื่อ</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>นามสกุล</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>ชื่อเล่น</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>email</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>เบอร์โทร</p>
                            <input className='w-full px-4 py-1 rounded-md' type="text" />
                            <p>ที่อยูุ่</p>
                            <textarea className='w-full px-4 py-1 rounded-md' name="" id="" cols="30" rows="5"></textarea>
                            <p>วัน-เดือน-ปีเกิด</p>
                            <input className='w-full px-4 py-1 rounded-md' type="date" name="" id="" />
                            <div className='flex justify-end gap-5 mt-4'>
                                <button className='btn btn-success'>Submit</button>
                                <form><input type='reset' className='btn btn-warning' value="Reset" /></form>

                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </>
    )
}
