
import React, { useEffect, useRef } from 'react'
import useAuth from '../hooks/UseAuth'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask'
import axiosPath from '../configs/axios-path';

export default function Profile() {

    const { user, setLoading } = useAuth();
    const fileInput = useRef(null);

    const bDay = new Date(user.user_brithday);
    const fBrithDay = bDay.toDateString('th-TH')

    const profile = user.user_image
    // console.log(profile)

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Profile";
    }, [])

    const hdlEditProfile = () => {
        const selectedFile = fileInput.current.files[0];
        if (!selectedFile) {
            return;
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
                console.log(fileInput.current.files[0])
                formData.append('profileImage', fileInput.current.files[0]);
                console.log(formData)
                const updateProfile = async () => {
                    try {
                        setLoading(true)
                        let token = localStorage.getItem('token')
                        const rs = await axiosPath.patch('/admin/profile', formData, {
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
        <div className='max-w-[40rem] text-black mx-auto mt-16 pt-5 pb-2 select-none rounded-lg px-5 bg-white shadow-lg'>
            <h1 className='text-2xl font-bold mb-2'>โปรไฟล์</h1>
            <hr />
            <div className='flex flex-col mt-3'>
                <div className='flex mb-3'>
                    <div className="flex-grow flex flex-col gap-1 drop-shadow-lg">
                        <div>
                            <p><b>ชื่อ :</b>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                        </div>
                        <p><b>ชื่อเล่น :</b> {user.user_nickname}</p>
                        <p><b>อีเมล์ :</b> {user.user_email}</p>
                        <p><b>เบอร์โทร :</b> <InputMask className='bg-transparent pointer-events-none' mask="999-999-XXXX" value={user.user_phone} /></p>
                        <p><b>ที่อยู่ :</b> {user.user_address}</p>
                        <p><b>วันเกิด :</b> {fBrithDay}</p>
                        <p className=' select-none'><b>รหัสบัตรประชาชน :</b> <InputMask className='bg-transparent pointer-events-none' mask="9-9999-XXXXX-99-9" maskChar={null} value={`${user.user_identity.substring(0, 6)}${user.user_identity.substring(13, 17)}`} /></p>
                        <p><b>ชั้นเรียน :</b> {user.class.class_name === "ADMIN" ? "ไม่พบห้อง" : user.class.class_name}</p>
                    </div>
                    <div className="flex-grow">
                        <img className='rounded-lg border-4 border-white shadow-lg w-[200px] ml-auto pointer-events-none' src={profile} alt="profile" />
                        <p className='text-end mr-14 mt-3 font-bold'>ภาพโปรไฟล์</p>
                        {user.user_role !== "USER" && (
                            <>
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={hdlEditProfile} ref={fileInput} />
                                <p className='text-[11px] font-bold text-blue-900 text-center ml-[3.1rem] hover:cursor-pointer scale-100 active:scale-95 ease-in-out transition underline' onClick={() => fileInput.current.click()}>เปลี่ยนโปรไฟล์</p>
                            </>
                        )}
                    </div>
                </div>
                <hr />
                <div className='text-[10px] flex justify-center align-bottom items-end mt-4'>
                    <p>&copy; CS125 Nuttawoot Chawna SNRU | CodeCamp Academy 01</p>
                </div>
            </div>
            <p className='hover:cursor-pointer' onClick={() => navigate(-1)}>Back</p>
        </div>
    )
}
