
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function EditUser() {

    const navigate = useNavigate();
    
    const [getUser, setGetUser] = useState([]);
    const [lock, setLock] = useState(true);
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
            const rs = await axios.get(`http://localhost:8000/admin/users/${userId}`, {
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
            const rs = await axios.patch(`http://localhost:8000/admin/users/${userId}`, output, {
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

    return (
        <div data-theme="light" className="max-w-[53rem] text-black mx-auto mt-5 mb-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-[19px] text-center font-extrabold">แก้ไขผู้ใช้งาน</p>
            <div className="flex justify-between">
                <button className="bg-gray-200 px-2 py-1 rounded-md my-2 active:scale-95" onClick={ () => navigate(-1)}>ย้อนกลับ</button>
                <button className="bg-gray-200 px-2 py-1 rounded-md my-2 active:scale-95" onClick={ () => { setLock(!lock); setInput(getUser) } }>{lock ? "แก้ไข" : "ยกเลิก"}</button>
            </div>
            <form action="" className="" onSubmit={hdlSubmit}>
                <div className="flex gap-4 mb-4 font-bold">
                    <div className="flex flex-col w-1/3 gap-2">
                        <label className="drop-shadow-md">ชื่อจริง <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_firstname" disabled={lock} value={input.user_firstname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">นามสกุล <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_lastname" disabled={lock} value={input.user_lastname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">ชื่อเล่น <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_nickname" disabled={lock} value={input.user_nickname} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">รหัสบัตรประชาชน <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_identity" disabled={lock} value={input.user_identity} onChange={hdlChange} /></label>
                        <label className="text-[13px] mt-7"><b>หมายเหตุ </b>ระบบยังไม่สามารถแก้ไข username และ password ได้ในขนะนี้</label>
                    </div>
                    <div className="flex flex-col w-1/3 gap-2">
                        <label className="drop-shadow-md">วันเกิด <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="date" name="user_brithday" disabled={lock} value={formatBirthday} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">อีเมล์ <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_email" disabled={lock} value={input.user_email} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">เบอร์โทร <input className={`w-full px-2 py-2 h-10 input border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_phone" disabled={lock} value={input.user_phone} onChange={hdlChange} /></label>
                        <label className="drop-shadow-md">ที่อยู่ <textarea className={`w-full px-2 py-2 h-28 input resize-none border-2 rounded-lg transition ease-in-out ${!lock ? "bg-[#FF90BC] text-white hover:font-bold focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white focus:font-bold" : "" }`} type="text" name="user_address" disabled={lock} value={input.user_address} onChange={hdlChange} /></label>
                    </div>
                    <div className="flex flex-col w-1/3 items-center">
                        <img className="max-w-[200px] max-h-[200px] skeleton shadow-md rounded-lg mt-2 pointer-events-none" src={getUser.user_image} alt="Profile" />
                    </div>
                </div>
                {!lock ? <button id="save" className="bg-gray-200 px-2 py-1 w-full rounded-md my-1 mb-4 active:scale-95">บันทึก</button> : ""}
            </form>
        </div>
    )
}
