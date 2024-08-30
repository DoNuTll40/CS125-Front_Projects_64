
import { useEffect, useRef, useState } from 'react';
import axiosPath from "../../configs/axios-path";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faAnglesLeft, faAnglesRight, faEdit, faMagnifyingGlass, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask'
import Swal from 'sweetalert2';
import useAuth from '../../hooks/UseAuth';

export default function AllUsers() {

    const [student, setStudent] = useState([]);
    const [useClass, setUseClass] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [refreshTable, setRefreshTable] = useState(false);
    const [select, setSelect] = useState('')
    const [selectClass, setSelectClass] = useState('')
    const [limit, setLimit] = useState('')
    const [search, setSearch] = useState({ search: '' })
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState("")
    const [loading, setLoading]  =useState(false)
    const { setRefetchBanner } = useAuth();

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

    const savedRole = sessionStorage.getItem('role-select');
    const savedLimit = sessionStorage.getItem('limit-select');
    const savedPage = sessionStorage.getItem('page-user');
    const savedClass = sessionStorage.getItem('class-select');

    useEffect(() => {
        document.title = 'Admin | รายชื่อนักเรียน';

        if (savedRole) {
            setSelect(savedRole);
        }

        if (savedLimit) {
            setLimit(savedLimit)
        }

        if (savedPage) {
            setPage(parseInt(savedPage))
        }

        if(savedClass){
            setSelectClass(parseInt(savedClass))
        }

        if (savedPage && parseInt(savedPage) !== page) {
            setPage(parseInt(savedPage));
        }

        const roleParam = savedRole || '';
        const limitParam = savedLimit || 5;
        const searchParam = search.search || '';
        const classParam = savedClass || ''

        const getUser = async () => {
            let token = localStorage.getItem('token')
            try {
                const rs = await axiosPath.get(`/admin/all/users?page=${savedPage !== "" ? savedPage : page}`, {
                    params: {
                        search: searchParam,
                        page: 1,
                        limit: limitParam,
                        role: roleParam,
                        class: classParam
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
                }).then(() => {
                    setPage(1)
                    sessionStorage.setItem('page-user', 1)
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

    }, [refreshTable, select, limit, search, page, savedPage, savedLimit, savedRole, selectClass, savedClass])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlChange2 = e => {
        setSelect(prv => ({ ...prv, [e.target.name]: e.target.value }))
        sessionStorage.setItem('role-select', e.target.value)
    }

    const hdlChange3 = e => {
        setPage(1)
        sessionStorage.setItem('page-user', 1)
        setSelectClass(prv => ({ ...prv, [e.target.name]: e.target.value }))
        sessionStorage.setItem('class-select', e.target.value)
    }

    const hdlChangeLimit = e => {
        setLimit(prv => ({ ...prv, [e.target.name]: e.target.value }))
        sessionStorage.setItem('limit-select', e.target.value)
    }

    let timeout = null

    const hdlSearchInput = (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setSearch({ search: e.target.value }); // แก้ไขเป็นการกำหนดค่าโดยตรงให้เป็น object
            setPage(1); // Reset page to 1 on new search
            setSelect('')
            sessionStorage.setItem('role-select', '')
            sessionStorage.setItem('page-user', '1');
        }, 1000);
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();

        const checkPhone = input.user_phone.replace(/_/g, '')

        const checkIdent = input.user_identity.replace(/_/g, '')

        if (checkIdent.length !== 17) {
            document.getElementById('my_modal_3').close()
            return Swal.fire({
                title: 'โปรดป้อนเลขบัตรประชาชนให้ครบ',
                icon: 'warning'
            }).then(() => {
                document.getElementById('my_modal_3').showModal()
            })
        }

        if (checkPhone.length !== 12) {
            document.getElementById('my_modal_3').close()
            return Swal.fire({
                title: 'โปรดป้อนหมายเลขโทรศัพท์ให้ครบ',
                icon: 'warning'
            }).then(() => {
                document.getElementById('my_modal_3').showModal()
            })
        }

        // eslint-disable-next-line no-unused-vars
        const { select, user_birthday, ...data } = input;

        if (Object.values(data).some(value => value !== "user_image" && data[value] === "")) {
            document.getElementById('my_modal_3').close()
            return Swal.fire({
                title: 'กรุณาป้อนข้อมูลให้ครบ',
                icon: 'warning'
            }).then(() => {
                document.getElementById('my_modal_3').showModal()
            })
        } else {
            try {
                setLoading(true)
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
                    hdlCloseModal()
                    setRefreshTable(prevState => !prevState);
                    setRefetchBanner(prev => !prev)
                    setLoading(false)
                    Swal.fire({
                        icon: 'success',
                        title: "เพิ่มข้อมูลสำเร็จ",
                        text: "ระบบได้เพิ่มข้อมูลเรียบร้อยแล้ว",
                    })
                }
            } catch (err) {
                document.getElementById('my_modal_3').close()
                Swal.fire({
                    icon: 'error',
                    title: 'ตรวจพบข้อผิดพลาด',
                    text: err.response.data.message,
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById('my_modal_3').showModal()
                    }
                })
                // console.log(err)
            }
        }
    }

    const hdlFileChange = (e) => {
        const file = fileInput.current.files[0];
        setSelectedFile(file);
        const checkSize = file.size;
        const fileSizeInMB = checkSize / (1024 * 1024);

        if (fileSizeInMB > 10) {
            document.getElementById('my_modal_3').close()
            Swal.fire({
                title: "ขนาดของไฟล์เกิน 10 MB",
                icon: 'warning',
            }).then(() => {
                document.getElementById('my_modal_3').showModal()
            })
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

    const hdlDelete = (id, namePrefix, firstName, lastName) => {
        Swal.fire({
            icon: 'warning',
            title: "ต้องการลบข้อมูลหรือไม่ ?",
            text: `คุณต้องการลบข้อมูลผู้ใช้ ${namePrefix}${firstName} ${lastName}`,
            showCancelButton: true,
            confirmButtonColor: '#E5252A',
            confirmButtonText: 'ใช่, ต้องการลบ',
            cancelButtonText: "ไม่, ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const deleteUser = async () => {
                        let token = localStorage.getItem('token')
                        const rs = await axiosPath.delete(`/admin/users/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        if (rs.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: "ลบผู้ใช้งานสำเร็จ",
                                text: "ระบบได้ลบข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
                            })
                            setRefreshTable(prevState => !prevState);
                            setRefetchBanner(prev => !prev)
                        }
                    }
                    deleteUser();
                } catch (err) {
                    alert(err)
                }
            }
        });
    }

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
            sessionStorage.setItem('page-user', page - 1)
        }
    };

    const handleNext = () => {
        if (page < totalPage) {
            setPage(page + 1);
            sessionStorage.setItem('page-user', page + 1)
        }
    };

    return (
        <>
            {student.get_user && <div className='max-w-[80rem] mx-auto mt-3 select-none'>
                <div className='bg-white px-4 py-3 lg:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden'>
                    <div className='flex justify-between mb-2 relative' data-theme='light'>
                        <select className='w-[120px] bg-transparent font-bold text-gray-400 focus:outline-none' name="limit" value={limit} onChange={hdlChangeLimit}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
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
                    <p className='w-full font-bold text-lg text-center my-2'>รายชื่อทั้งหมด</p>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <div>
                                <p className='font-semibold'>ตำแหน่ง</p>
                                <hr />
                                <select className='w-[120px] bg-transparent font-bold focus:outline-none' name="select" id="role-fullscreen" value={select} onChange={hdlChange2}>
                                    <option value="">ทั้งหมด</option>
                                    <option value="USER">นักเรียน</option>
                                    <option value="TEACHER">คุณครู</option>
                                </select>
                            </div>
                            <div>
                                <p className='font-semibold'>ห้องเรียน</p>
                                <hr />
                                <select className="w-[120px] bg-transparent font-bold text-gray-400 focus:outline-none" name='selectClass' value={selectClass} onChange={hdlChange3}>
                                    <option value=''>ทั้งหมด</option>
                                    {useClass.filter(el => el.class_name !== "ADMIN").map((el, index) => (
                                        <option key={index + 1} value={el.class_id}>{el.class_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
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
                                            <th className="text-center font-semibold py-3">ไอดี</th>
                                            <th className="text-center font-semibold py-3">คำนำหน้า</th>
                                            <th className="text-center font-semibold py-3">ชื่อ - นามสกุล</th>
                                            <th className="text-center font-semibold py-3">ชื่อผู้ใช้</th>
                                            <th className="text-center font-semibold py-3">เมล</th>
                                            <th className="text-center font-semibold py-3">หน้าที่</th>
                                            <th className="text-center font-semibold py-3">ห้อง</th>
                                            <th className="text-center font-semibold py-3" colSpan="2">ตัวเลือก</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-sm'>
                                        {student.get_user.map((user) => (
                                            <tr
                                                className="hover:bg-[#FF90BC] hover:text-white transition ease-in-out"
                                                key={user.user_id}>
                                                <td className='text-center'>{user.user_id}</td>
                                                <td>{user.user_nameprefix}</td>
                                                <td>{user.user_firstname} {user.user_lastname}</td>
                                                <td>{user.user_username}</td>
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
                                                            hdlDelete(user.user_id, user.user_nameprefix, user.user_firstname, user.user_lastname);
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
                                            <p>{user.user_id}</p>
                                            <div className='border-l-2 border-white px-1'>
                                                <p className='text-[14px]'>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                                                <p className='text-[14px]'>หน้าที่ {user.user_role === "USER" ? "นักเรียน" : "คุณครู"}</p>
                                                <p className='text-[14px]'>เบอร์ติดต่อ {user.user_phone}</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-1 relative pr-2 items-center'>
                                            <td className='text-end text-[14px] w-10'><button name={`btn-edit-${number + 1}`} className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => hdlEdit(user.user_id)}><FontAwesomeIcon icon={faEdit} /></button></td>
                                            <td className="text-[14px] w-10 rounded-r-full"><button name={`btn-del-${number + 1}`} className='rounded-full scale-100 active:scale-95 hover:bg-[#6096B4] w-10 h-10 transition ease-in-out' onClick={() => { hdlDelete(user.user_id, user.user_nameprefix, user.user_firstname, user.user_lastname); }}><FontAwesomeIcon icon={faTrash} /></button></td>
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
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p>นามสกุล</p>
                                        <input className='w-full px-4 py-1 rounded-md'
                                            type="text"
                                            name='user_lastname'
                                            value={input.user_lastname}
                                            onChange={hdlChange}
                                            required
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
                                            required
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
                                    placeholder='dd/mm/yyyy'
                                    onChange={hdlChange}
                                    required
                                />
                                <p>email</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='user_email'
                                    value={input.user_email}
                                    onChange={hdlChange}
                                    required
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
                                <textarea className='w-full px-4 py-1 rounded-md resize-none' name="user_address" value={input.user_address} onChange={hdlChange} cols="5" rows="2" required></textarea>
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
                                                <button className='w-full text-md my-2 rounded-full py-1 bg-gray-700 ' onClick={() => setSelectedFile(null)}>ลบภาพตัวอย่าง</button>
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
                                    required
                                />
                                <p className='mt-1'>Password</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='user_password'
                                    value={input.user_password}
                                    onChange={hdlChange}
                                    required
                                />
                                <p className='mt-1'>Comfirm Password</p>
                                <input className='w-full px-4 py-1 rounded-md'
                                    type="text"
                                    name='confirmPassword'
                                    value={input.confirmPassword}
                                    onChange={hdlChange}
                                    required
                                />
                                <div className='flex justify-end gap-3 mt-2'>
                                    <input className='btn btn-success' type='submit' value={`${loading ? "" : ""}`} />
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
