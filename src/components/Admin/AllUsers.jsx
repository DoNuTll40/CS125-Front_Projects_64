
import { useEffect, useRef, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask'

export default function AllUsers() {

    const [student, setStudent] = useState([]);
    const [useClass, setUseClass] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [refreshTable, setRefreshTable] = useState(false);
    const [select, setSelect] = useState([])

    const [input, setInput] = useState({
        user_username: "",
        user_password: "",
        confirmPassword: "",
        user_role: "",
        user_nameprefix: "",
        user_firstname: "",
        user_lastname: "",
        user_nickname: "",
        user_email: "",
        user_phone: "",
        user_address: "",
        user_brithday: "",
        user_identity: "",
        class_id: ""
    });

    const fileInput = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Admin : Student';
        const getUser = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudent(rs.data.user)
        }

        const getClass = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get('/admin/class', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUseClass(rs.data.useClass)
        }
        getClass();
        getUser();

    }, [refreshTable])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlChange2 = e => {
        setSelect(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const hdlSubmit = async (e) => {
        e.preventDefault();

        // const checkPhone = /^\d{13}$/;
        // if (!checkPhone.test(input.user_phone)) {
        //     return alert("โปรดป้อนหมายเลขโทรศัพท์ที่ถูกต้อง");
        // }
        
        const { select, ...data } = input;
        if (Object.values(data).some(value => value !== "user_image" && data[value] === "")) {
            alert("Please enter input");
        } else {
            try {
                const file = fileInput.current?.files[0];
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                if (file) {
                    formData.append('image', file);
                }

                formData.set('user_brithday', new Date(data.user_brithday).toISOString());

                const token = localStorage.getItem('token')
                const rs = await axiosPath.post('/admin/users', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (rs.status === 200) {
                    alert("Create user success")
                    hdlCloseModal()
                    setRefreshTable(prevState => !prevState);
                }
                console.log(rs)
            } catch (err) {
                alert(err.message)
            }
        }
    }

    const hdlFileChange = (e) => {
        const file = fileInput.current.files[0];
        setSelectedFile(file);
        const checkSize = file.size;
        const fileSizeInMB = checkSize / (1024 * 1024);

        if (fileSizeInMB > 10) {
            alert("ขนาดของไฟล์เกิน 10 MB");
            setSelectedFile(null)
            e.target.value = null;
        }
    };

    const hdlClear = () => {
        setInput({
            user_username: "",
            user_password: "",
            confirmPassword: "",
            user_role: "",
            user_nameprefix: "",
            user_firstname: "",
            user_lastname: "",
            user_nickname: "",
            user_email: "",
            user_phone: "",
            user_address: "",
            user_birthday: "",
            user_identity: "",
            class_id: ""
        });
        setSelectedFile(null)
    }

    const hdlCloseModal = () => {
        setInput({
            user_username: "",
            user_password: "",
            confirmPassword: "",
            user_role: "",
            user_nameprefix: "",
            user_firstname: "",
            user_lastname: "",
            user_nickname: "",
            user_email: "",
            user_phone: "",
            user_address: "",
            user_birthday: "",
            user_identity: "",
            class_id: ""
        });
        setSelectedFile(null)
        document.getElementById('my_modal_3').close()
    }

    const hdlEdit = (id) => {
        navigate(`/users/edit/${id}`)
    }

    const hdlDelete = (id) => {
        if (confirm("คุณต้องการลบผู้ใช้งานหรือไม่") === true) {
            try {
                const deleteUser = async () => {
                    let token = localStorage.getItem('token')
                    const rs = await axiosPath.delete(`/admin/users/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(rs)
                    if (rs.status === 200) {
                        alert("ลบสำเร็จแล้ว")
                        setRefreshTable(prevState => !prevState);
                    }
                }
                deleteUser();
            } catch (err) {
                alert(err)
            }
        }
    }

    const dataNotAdmin = student.filter(el => el.user_role !== "ADMIN")
    const woman = dataNotAdmin.filter(el => el.user_nameprefix === "เด็กหญิง" || el.user_nameprefix === "นางสาว" || el.user_nameprefix === "นาง")
    const gender = dataNotAdmin.filter(el => el.user_nameprefix === "เด็กชาย" || el.user_nameprefix === "นาย")

    return (
        <>
            {student && <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white px-4 py-3 lg:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden'>
                    <div className='flex justify-between items-center'>
                        <select className='w-[120px] bg-transparent font-bold focus:outline-none' name="select" id="" onChange={hdlChange2}>
                            <option value="ADMIN">ทั้งหมด</option>
                            <option value="TEACHER">นักเรียน</option>
                            <option value="USER">คุณครู</option>
                        </select>
                        <p className='w-[120px] font-bold text-lg'>รายชื่อทั้งหมด</p>
                        <div className='w-[120px] flex justify-end'>
                            <button className='px-2.5 py-2 rounded-full hover:bg-[#FF90BC] hover:text-white transition ease-in-out flex items-center' onClick={() => document.getElementById('my_modal_3').showModal()} type="button"><FontAwesomeIcon icon={faAdd} /></button>
                        </div>
                    </div>
                    {student.length !== 0 ?
                        <div className='mt-2'>
                            <table className='table table-xs text-black hidden lg:block'>
                                <thead className='text-center'>
                                    <tr className='text-sm text-black'>
                                        <th>ลำดับ</th>
                                        <th>คำนำหน้า</th>
                                        <th>ชื่อ</th>
                                        <th>นามสกุล</th>
                                        <th>ชื่อเล่น</th>
                                        <th>เมล</th>
                                        <th>หน้าที่</th>
                                        <th>ห้อง</th>
                                        <th colSpan="2">ตัวเลือก</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {student.filter(user => user.user_role !== select.select).map((user, number) => (
                                        <tr className='hover:bg-[#FF90BC] hover:text-white transition ease-in-out' key={user.user_id}>
                                            <td className="text-[14px] rounded-l-full">{number + 1}</td>
                                            <td className="text-[14px]">{user.user_nameprefix}</td>
                                            <td className="text-[14px]">{user.user_firstname}</td>
                                            <td className="text-[14px]">{user.user_lastname}</td>
                                            <td className="text-[14px]">{user.user_nickname}</td>
                                            <td className="text-[14px]">{user.user_email}</td>
                                            <td className="text-[14px]">{user.user_role === "USER" ? "นักเรียน" : "ครู"}</td>
                                            <td className="text-[14px]">{user.class.class_name}</td>
                                            <td className='text-[14px]'>
                                                <button className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => hdlEdit(user.user_id)}><FontAwesomeIcon icon={faEdit} /></button>
                                            </td>
                                            <td className='text-[14px] rounded-r-full'>
                                                <button className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => { hdlDelete(user.user_id) }}><FontAwesomeIcon icon={faTrash} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* responsive */}

                            <div className='block lg:hidden font-medium'>
                                <div className='flex gap-1 items-center'>
                                    <span className='w-4 h-4 rounded-full bg-[#6096B4]'></span>
                                    <label className='font-bold'>ผู้ชาย {gender.filter(el => el.user_role !== select.select).length} คน</label>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <span className='w-4 h-4 rounded-full bg-[#FF96BC]'></span>
                                    <label className='font-bold'>ผู้หญิง {woman.filter(el => el.user_role !== select.select).length} คน</label>
                                </div>
                                {student.filter(user => user.user_role !== select.select && user.user_role !== "ADMIN").map((user, number) => (
                                    <div key={number + 1} className={`flex my-3 justify-between h-20 rounded-md text-white ${user.user_nameprefix === "นาย" || user.user_nameprefix === "เด็กชาย" ? "bg-[#6096B4]" : "bg-[#FF90BC]"}`}>
                                        <div className='flex gap-1 relative pl-2 items-center'>
                                            <p>{number + 1}</p>
                                            <div className='border-l-2 border-white px-1'>
                                                <p className='text-[14px]'>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                                                <p className='text-[14px]'>หน้าที่ {user.user_role === "USER" ? "นักเรียน" : "คุณครู"}</p>
                                                <p className='text-[14px]'>เบอร์ติดต่อ {user.user_phone}</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-1 relative pr-2 items-center'>
                                            <td className='text-end text-[14px] w-10'><button className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => hdlEdit(user.user_id)}><FontAwesomeIcon icon={faEdit} /></button></td>
                                            <td className="text-[14px] w-10 rounded-r-full"><button className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => { hdlDelete(user.user_id) }}><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                        : <p className='text-2xl font-semibold underline'>ไม่พบข้อมูล</p>
                    }
                    <dialog id="my_modal_3" className="modal scroll">
                        <div data-theme="dark" className="modal-box">
                            <button className="absolute right-4 top-2" onClick={hdlCloseModal}><FontAwesomeIcon icon={faXmark} /></button>
                            <form className='flex flex-col font-semibold' onSubmit={hdlSubmit}>
                                <h3 className="font-bold text-lg mt-5 text-center relative z-30 bg-gray-700 w-1/2 rounded-md mx-auto">เพิ่มข้อมูล</h3>
                                <hr className='relative bottom-3 mt-0' />
                                <div className='flex flex-col w-full mt-2 gap-1'>
                                    <p>เลือกคำนำหน้าชื่อ</p>
                                    <select className='w-full px-4 py-1 rounded-md' name="user_nameprefix" id="" onChange={hdlChange}>
                                        <option hidden>เลือก</option>
                                        <option value="เด็กชาย">เด็กชาย</option>
                                        <option value="เด็กหญิง">เด็กหญิง</option>
                                        <option value="นาย">นาย</option>
                                        <option value="นางสาว">นางสาว</option>
                                        <option value="นาง">นาง</option>
                                    </select>
                                </div>
                                <div className='flex w-full gap-3 mt-2'>
                                    <div className='flex flex-col'>
                                        <p>ชื่อ</p>
                                        <input className='w-full px-4 py-1 rounded-md'
                                            type="text"
                                            name='user_firstname'
                                            value={input.user_firstname}
                                            onChange={hdlChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p>นามสกุล</p>
                                        <input className='w-full px-4 py-1 rounded-md'
                                            type="text"
                                            name='user_lastname'
                                            value={input.user_lastname}
                                            onChange={hdlChange}
                                        />
                                    </div>
                                </div>
                                <div className='flex w-full gap-3'>
                                    <div className='flex flex-col w-1/3'>
                                        <p>ชื่อเล่น</p>
                                        <input className='w-full px-4 py-1 rounded-md'
                                            type="text"
                                            name='user_nickname'
                                            value={input.user_nickname}
                                            onChange={hdlChange}
                                        />
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <p>รหัสบัตรประชาชน</p>
                                        <InputMask className='w-full px-4 py-1 rounded-md'
                                            mask="9-9999-99999-99-9"
                                            placeholder='X-XXXX-XXXXX-XX-X'
                                            name='user_identity'
                                            value={input.user_identity}
                                            onChange={hdlChange}
                                        />
                                    </div>
                                </div>
                                <p>วัน-เดือน-ปีเกิด</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="date"
                                    name="user_brithday"
                                    value={input.user_brithday}
                                    onChange={hdlChange}
                                />
                                <p>email</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='user_email'
                                    value={input.user_email}
                                    onChange={hdlChange}
                                />
                                <p>เบอร์โทร</p>
                                <InputMask
                                    className='w-full px-4 py-1 rounded-md'
                                    placeholder='XXX-XXX-XXXX'
                                    mask="999-999-9999"
                                    name='user_phone'
                                    value={input.user_phone}
                                    onChange={hdlChange}
                                />
                                {/* <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                /> */}
                                <p>ที่อยู่</p>
                                <textarea className='w-full px-4 py-1 rounded-md resize-none' name="user_address" value={input.user_address} onChange={hdlChange} cols="5" rows="2"></textarea>
                                <div className='flex w-full gap-3'>
                                    <div className='flex flex-col w-full'>
                                        <p>หน้าที่</p>
                                        <select className='w-full px-4 py-1 rounded-md' name="user_role" value={input.user_role} onChange={hdlChange} id="">
                                            <option hidden>เลือกหน้าที่</option>
                                            <option value="USER">นักเรียน</option>
                                            <option value="TEACHER">คุณครู</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <p>เลือกห้อง</p>
                                        <select className='w-full px-4 py-1 rounded-md' name="class_id" value={input.class_id} onChange={hdlChange} id="">
                                            <option hidden >กรุณาเลือกห้อง</option>
                                            {useClass.filter(el => el.class_name !== "ADMIN").map(el => (
                                                <option key={el.class_id} value={el.class_id}>{el.class_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {input.user_role === "TEACHER" ?
                                    <div>
                                        <p className='mt-2'>ใส่ภาพตัวเอง</p>
                                        <input className='file-input-sm file-input-bordered w-full rounded-md hover:cursor-pointer' ref={fileInput} onChange={hdlFileChange} type="file" accept="image/*" />
                                        {selectedFile && (
                                            <>
                                                <img src={URL.createObjectURL(selectedFile)} alt="Selected Image" accept="image/*" className='mx-auto my-2 rounded-lg border-4 border-white max-h-[250px] pointer-events-none' />
                                                <button className='w-full text-md my-2 rounded-full py-1 bg-gray-700 ' onClick={(e) => setSelectedFile(null)}>ลบภาพตัวอย่าง</button>
                                            </>

                                        )}
                                        <p className='text-center text-red-500 text-[12px]'>*ขนาดไม่เกิน 10 MB</p></div>
                                    : ''}
                                <h3 className="font-bold text-lg mt-5 text-center relative z-30 bg-gray-700 w-1/2 rounded-md mx-auto">ตั้งค่าการเข้าสู่ระบบ</h3>
                                <hr className='relative bottom-3 mt-0 ' />
                                <p className='mt-2'>Username</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='user_username'
                                    value={input.user_username}
                                    onChange={hdlChange}
                                />
                                <p className='mt-1'>Password</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='user_password'
                                    value={input.user_password}
                                    onChange={hdlChange}
                                />
                                <p className='mt-1'>Comfirm Password</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='confirmPassword'
                                    value={input.confirmPassword}
                                    onChange={hdlChange}
                                />
                                <div className='flex justify-end gap-3 mt-2'>
                                    <input className='btn btn-success' type='submit' value="ยืนยัน" />
                                    <input onClick={hdlClear} type='reset' className='btn btn-warning' value="ล้างข้อมูล" />
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>}
        </>
    )
}
