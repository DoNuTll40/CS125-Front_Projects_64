
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const thaiLocale = 'th-TH';
    const fBrithDay = bDay.toLocaleDateString(thaiLocale, options);

    const profile = user.user_image

    const navigate = useNavigate();

    const role = location.pathname.split("/")[1]

    useEffect(() => {
        document.title = role.slice(0, 1).toUpperCase()+role.slice(1, role.length) +" | โปรไฟล์";
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
        <div className='max-w-[40rem] text-black mx-auto mt-16 pt-2 sm:pt-5 pb-2 select-none rounded-lg px-2 sm:px-5 bg-white shadow-lg'>
            <h1 className='text-md sm:text-2xl font-bold mb-1 sm:mb-2'>โปรไฟล์</h1>
            <hr />
            <div className='flex flex-col mt-1.5 sm:mt-3 text-[12px] sm:text-lg'>
                <div className='flex mb-3'>
                    <div className="flex-grow flex flex-col gap-1 drop-shadow-lg">
                        <div>
                            <p><b>ชื่อ :</b> {user.user_nameprefix} {user.user_firstname} {user.user_lastname}</p>
                        </div>
                        <p><b>ชื่อเล่น :</b> {user.user_nickname}</p>
                        <p><b>อีเมล์ :</b> {user.user_email}</p>
                        <p><b>เบอร์โทร :</b> <input className='bg-transparent pointer-events-none' value={user.user_phone} readOnly/></p>
                        <p><b>ที่อยู่ :</b> {user.user_address}</p>
                        <p><b>วันเกิด :</b> {fBrithDay}</p>
                        <p className=' select-none'><b>รหัสบัตรประชาชน :</b> <input className='bg-transparent pointer-events-none' value={`${user.user_identity}`} readOnly/></p>
                        <p><b>{user.user_role === "USER" ? "ชั้นเรียน" : user.user_role === "ADMIN" ? "ตำแหน่ง" : "ประจำชั้น"} :</b> {user.class.class_name === "ADMIN" ? "ผู้ดูแลระบบ" : user.class.class_name}</p>
                    </div>
                    <div className="flex-grow">
                        <img className='rounded-lg border-2 sm:border-4 border-white shadow-lg max-w-[120px] max-h-[120px] sm:max-w-[200px] sm:max-h-[200px] mx-auto pointer-events-none' src={profile} alt="profile" />
                        <p className='text-[13px] sm:text-lg text-center mt-1 font-bold'>ภาพโปรไฟล์</p>
                        {user.user_role !== "USER" && (
                            <>
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={hdlEditProfile} ref={fileInput} />
                                <p className='text-[9px] sm:text-[11px] font-bold text-blue-900 text-center hover:cursor-pointer scale-100 active:scale-95 ease-in-out transition underline' onClick={() => fileInput.current.click()}>เปลี่ยนโปรไฟล์</p>
                            </>
                        )}
                    </div>
                </div>
                <hr />
                <div className='text-[8px] sm:text-[10px] flex justify-center align-bottom items-end mt-1 sm:mt-4'>
                    <p>&copy; CS125 Nuttawoot Chawna SNRU | CodeCamp Academy 01</p>
                </div>
            </div>
            <p className='text-sm sm:text-md hover:cursor-pointer' onClick={() => navigate(-1)}>Back</p>
        </div>
    )
}
