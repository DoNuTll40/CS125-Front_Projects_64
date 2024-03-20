
import axiosPath from "../../configs/axios-path";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import useAuth from "../../hooks/UseAuth";

export default function EditUser() {

    const navigate = useNavigate();
    const {setLoading} = useAuth();
    const [getUser, setGetUser] = useState([]);
    const [lock, setLock] = useState(true);
    const fileInput = useRef(null);
    const userId = location.pathname.split('/')[3]

    const [input, setInput] = useState({
        user_username: "",
        user_password: "",
        confirmPassword: "",
        user_role: "",
        user_firstname: "",
        user_lastname: "",
        user_nickname: "",
        user_email: "",
        user_phone: "",
        user_address: "",
        user_brithday: "",
        user_identity: "",
        user_image: "",
        class_id: ""
    })

    const formatBirthday = input.user_brithday ? new Date(input.user_brithday).toISOString().substr(0, 10) : '';
    document.title = `Edit : ${getUser.user_firstname} ${getUser.user_lastname}`

    useEffect(() => {
        const getUserById = async () => {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.get(`/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGetUser(rs.data.user)
            setInput(rs.data.user)
        }
        getUserById();
    }, [])

    const hdlSubmit = async (e) => {
        e.preventDefault();
        const { user_id, class: classData, ...data } = input;
        const output = { ...data, user_brithday: new Date(input.user_brithday) }

        try {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.patch(`/admin/users/${userId}`, output, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(rs.data)
            if (rs.status === 200) {
                alert("แก้ไขข้อมูลสำเร็จ")
                navigate(-1)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const checkFile = (e) => {
        const selectedFile = fileInput.current.files[0];
        if (!selectedFile) {
            return;
        }
        const checkSize = selectedFile.size;
        const fileSizeInMB = checkSize / (1024 * 1024);

        if (fileSizeInMB > 10) {
            alert("ขนาดของไฟล์เกิน 10 MB");
            e.target.value = null;
        }

        hdlEditProfile()
    }

    const hdlEditProfile = () => {
        const selectedFile = fileInput.current.files[0];
        if (!selectedFile) {
            return;
        }
        const checkSize = selectedFile.size;
        const fileSizeInMB = checkSize / (1024 * 1024);

        if (fileSizeInMB > 10) {
            alert("ขนาดของไฟล์เกิน 10 MB");
            location.reload();
        }
        Swal.fire({
            title: "คุณต้องการเปลี่ยนภาพหรือไม่?",
            showDenyButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`,
            html: `<img src="${URL.createObjectURL(fileInput.current.files[0])}" class="mx-auto pointer-events-none" style="max-height: 350px"/>`,
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('profileImage', fileInput.current.files[0]);
                console.log(formData)
                const updateProfile = async () => {
                    try {
                        setLoading(true)
                        let token = localStorage.getItem('token')
                        const rs = await axios.patch(`/admin/profile/${userId}`, formData, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        if (rs.status === 200) {
                            location.reload();
                            setLoading(false)
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
                updateProfile();
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info").then(() => {
                    window.location.reload();
                });
            }
        });
    };

    return (
        <div data-theme="light" className="max-w-[53rem] text-black mx-auto mt-5 mb-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-[19px] text-center font-extrabold">แก้ไขผู้ใช้งาน</p>
            <div className="flex justify-between">
                <button className="font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white" onClick={() => navigate(-1)}>ย้อนกลับ</button>
                <button className="font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white" onClick={() => { setLock(!lock); setInput(getUser) }}>{lock ? "แก้ไข" : "ยกเลิก"}</button>
            </div>
            <form action="" className="" onSubmit={hdlSubmit}>
                <div className="flex gap-4 mb-4 font-bold">
                    <div className="flex flex-col w-1/3 gap-2">
                        <label className="drop-shadow-md">ชื่อจริง <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_firstname" disabled={lock} value={input.user_firstname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">นามสกุล <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_lastname" disabled={lock} value={input.user_lastname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">ชื่อเล่น <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_nickname" disabled={lock} value={input.user_nickname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">รหัสบัตรประชาชน <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_identity" disabled={lock} value={input.user_identity} onChange={hdlChange} /></label>
                        <label className="text-[13px] mt-7"><b>หมายเหตุ </b>ระบบยังไม่สามารถแก้ไข username และ password ได้ในขนะนี้</label>
                    </div>
                    <div className="flex flex-col w-1/3 gap-2">
                        <label className="drop-shadow-md">วันเกิด <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="date" name="user_brithday" disabled={lock} value={formatBirthday} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">อีเมล์ <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_email" disabled={lock} value={input.user_email} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">เบอร์โทร <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_phone" disabled={lock} value={input.user_phone} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">ที่อยู่ <textarea className={`w-full px-2 py-2 h-28 input resize-none border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : ""}`} type="text" name="user_address" disabled={lock} value={input.user_address} onChange={hdlChange} /></label>
                    </div>
                    <div className="flex flex-col w-1/3 items-center">
                        <div className="hover:cursor-pointer" onClick={() => document.getElementById('my_modal_2').showModal()} >
                            <img className="max-w-[200px] max-h-[250px] skeleton shadow-md rounded-lg pointer-events-none" src={getUser.user_image} alt="Profile" />
                        </div>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={checkFile} ref={fileInput} />
                        <p className='text-[13px] mt-5 font-bold text-blue-900 text-center hover:cursor-pointer scale-100 active:scale-95 ease-in-out transition underline' onClick={() => fileInput.current.click()}>อัพโหลดภาพ</p>
                    </div>
                </div>
                {!lock ? <button id="save" className="w-full font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white">บันทึก</button> : ""}
            </form>

            <dialog id="my_modal_2" className="modal">
                <div className="modal-box px-0 py-0 max-w-fit flex justify-center items-center pointer-events-none select-none">
                    <img className="max-w-[600px] max-h-[600px] skeleton shadow-md rounded-lg pointer-events-none select-none" src={getUser.user_image} alt="Profile" />
                </div>
                <form method="dialog" hidden className="modal-backdrop">
                    <button className="cursor-default" onClick={() => document.getElementById('my_modal_2').close()}>close</button>
                </form>
            </dialog>
        </div>
    )
}
