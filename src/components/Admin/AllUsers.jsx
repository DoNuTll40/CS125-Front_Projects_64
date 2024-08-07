
import { useEffect, useRef, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faAngleRight, faAnglesLeft, faAnglesRight, faEdit, faMagnifyingGlass, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask'
import Swal from 'sweetalert2';
import { icon } from '@fortawesome/fontawesome-svg-core';

export default function AllUsers() {

    const [student, setStudent] = useState([]);
    const [useClass, setUseClass] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [refreshTable, setRefreshTable] = useState(false);
    const [select, setSelect] = useState('')
    const [limit, setLimit] = useState('')
    const [search, setSearch] = useState({ search: '' })
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState("")

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
        document.title = 'Admin | รายชื่อนักเรียน';
        const roleParam = select.select || '';
        const limitParam = limit.limit || 10;
        const searchParam = search.search || '';

        const getUser = async () => {
            let token = localStorage.getItem('token')
            try {
                const rs = await axiosPath.get(`/admin/all/users?page=${page}`, {
                    params: {
                        search: searchParam,
                        page: 1,
                        limit: limitParam,
                        role: roleParam,
                        class: ''
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (rs.status === 200) {
                    setStudent(rs?.data)
                    setTotalPage(rs?.data?.totalPages)
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: "เกิดข้อผิดพลาด",
                    text: (err.response.data.message),
                })
            }
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

    }, [refreshTable, select, limit, search, page])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlChange2 = e => {
        setSelect(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const hdlChangeLimit = e => {
        setLimit(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    let timeout = null

    const hdlSearchInput = (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setSearch({ search: e.target.value }); // แก้ไขเป็นการกำหนดค่าโดยตรงให้เป็น object
        }, 1000);
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();

        const checkPhone = input.user_phone.replace(/_/g, '')

        const checkIdent = input.user_identity.replace(/_/g, '')

        if (checkIdent.length !== 17) {
            return alert("โปรดป้อนเลขบัตรประชาชนให้ครบ");
        }

        if (checkPhone.length !== 12) {
            return alert("โปรดป้อนหมายเลขโทรศัพท์ให้ครบ");
        }

        const { select, user_birthday, ...data } = input;

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
                console.log(err)
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
            user_brithday: "",
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
            user_brithday: "",
            user_identity: "",
            class_id: ""
        });
        setSelectedFile(null)
        document.getElementById('my_modal_3').close()
    }

    const hdlEdit = (id) => {
        navigate(`/admin/users/edit/${id}`)
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

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPage) {
            setPage(page + 1);
        }
    };

    return (
        <>
            {student.get_user && <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white px-4 py-3 lg:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden'>
                    <div className='flex justify-between mb-2 relative' data-theme='light'>
                        <select className='w-[120px] bg-transparent font-bold text-gray-400 focus:outline-none' name="limit" onChange={hdlChangeLimit}>
                            <option value={5}>5</option>
                            <option value={10} selected>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className='relative flex items-center bg-white border border-gray-300 rounded-lg px-3'>
                        <FontAwesomeIcon className='text-gray-500 mr-2' icon={faMagnifyingGlass} />
                        <input className='flex-1 h-9 rounded-lg px-1 focus:outline-none'
                            name='search'
                            type="text"
                            placeholder="Search..."
                            onChange={hdlSearchInput} />
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <select className='w-[120px] bg-transparent font-bold focus:outline-none' name="select" id="" onChange={hdlChange2}>
                            <option value="">ทั้งหมด</option>
                            <option value="USER">นักเรียน</option>
                            <option value="TEACHER">คุณครู</option>
                        </select>
                        <p className='w-[120px] font-bold text-lg'>รายชื่อทั้งหมด</p>
                        <div className='w-[120px] flex justify-end'>
                            <button name='btn-add' className='px-2.5 py-2 rounded-full hover:bg-[#FF90BC] hover:text-white transition ease-in-out flex items-center' onClick={() => document.getElementById('my_modal_3').showModal()} type="button"><FontAwesomeIcon icon={faAdd} /></button>
                        </div>
                    </div>
                    {student.get_user.length !== 0 ?
                        <div className='mt-2 w-full'>
                            <div className=' hidden lg:block'>
                                <table className="min-w-full text-black border-collapse">
                                    <thead className="border-b">
                                        <tr className="text-md text-black">
                                            <th className="text-center font-semibold py-3">ลำดับ</th>
                                            <th className="text-center font-semibold py-3">คำนำหน้า</th>
                                            <th className="text-center font-semibold py-3">ชื่อ - นามสกุล</th>
                                            <th className="text-center font-semibold py-3">ชื่อเล่น</th>
                                            <th className="text-center font-semibold py-3">เมล</th>
                                            <th className="text-center font-semibold py-3">หน้าที่</th>
                                            <th className="text-center font-semibold py-3">ห้อง</th>
                                            <th className="text-center font-semibold py-3" colSpan="2">ตัวเลือก</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-sm'>
                                        {student.get_user.map((user, number) => (
                                            <tr
                                                className="hover:bg-[#FF90BC] hover:text-white transition ease-in-out"
                                                key={user.user_id}>
                                                <td className='text-center'>{user.user_id}</td>
                                                <td>{user.user_nameprefix}</td>
                                                <td>{user.user_firstname} {user.user_lastname}</td>
                                                <td>{user.user_nickname}</td>
                                                <td>{user.user_email}</td>
                                                <td>
                                                    {user.user_role === "USER" ? "นักเรียน" : "ครู"}
                                                </td>
                                                <td>{user.class.class_name}</td>
                                                <td>
                                                    <button
                                                        className="rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out"
                                                        onClick={() => hdlEdit(user.user_id)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </td>
                                                <td className='text-center'>
                                                    <button
                                                        className="rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out"
                                                        onClick={() => {
                                                            hdlDelete(user.user_id);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div data-theme='light' className='flex justify-end items-center mt-5 gap-2'>
                                    <button className="btn btn-ghost btn-sm capitalize" onClick={handlePrevious} disabled={page === 1}>
                                        <FontAwesomeIcon icon={faAnglesLeft} className='mr-1' />
                                        <span>ก่อน</span>
                                    </button>
                                    <p className='text-center'>หน้า {page} จาก {totalPage}</p>
                                    <button className="btn btn-ghost btn-sm capitalize" onClick={handleNext} disabled={page === totalPage}>
                                        <span>ถัดไป</span>
                                        <FontAwesomeIcon icon={faAnglesRight} className='mr-1' />
                                    </button>
                                </div>
                            </div>

                            {/* responsive */}

                            <div className='block lg:hidden font-medium'>
                                <div className='flex gap-1 items-center'>
                                    <span className='w-4 h-4 rounded-full bg-[#6096B4]'></span>
                                    <label className='font-bold'>ผู้ชาย {student.man} คน</label>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <span className='w-4 h-4 rounded-full bg-[#FF96BC]'></span>
                                    <label className='font-bold'>ผู้หญิง {student.woman} คน</label>
                                </div>
                                {student.get_user.map((user, number) => (
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
                                            <td className='text-end text-[14px] w-10'><button name={`btn-edit-${number + 1}`} className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => hdlEdit(user.user_id)}><FontAwesomeIcon icon={faEdit} /></button></td>
                                            <td className="text-[14px] w-10 rounded-r-full"><button name={`btn-del-${number + 1}`} className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => { hdlDelete(user.user_id) }}><FontAwesomeIcon icon={faTrash} /></button></td>
                                        </div>
                                    </div>
                                ))}
                                <div data-theme='light' className='flex justify-end items-center mt-5 gap-2 pb-2'>
                                        <button className="btn btn-ghost btn-sm capitalize" onClick={handlePrevious} disabled={page === 1}>
                                            <FontAwesomeIcon icon={faAnglesLeft} className='mr-1' />
                                            <span>ก่อน</span>
                                        </button>
                                        <p className='text-center'>หน้า {page} จาก {totalPage}</p>
                                        <button className="btn btn-ghost btn-sm capitalize" onClick={handleNext} disabled={page === totalPage}>
                                            <span>ถัดไป</span>
                                            <FontAwesomeIcon icon={faAnglesRight} className='mr-1' />
                                        </button>
                                </div>
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
