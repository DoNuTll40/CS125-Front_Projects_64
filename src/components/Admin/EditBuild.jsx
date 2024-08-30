
import axiosPath from "../../configs/axios-path";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditBuild() {

    const navigate = useNavigate();

    const [input, setInput] = useState({
        build_name: "",
        build_number: "",
    })
    const [selectFile, setSelectFile] = useState(null)

    const id = location.pathname.split("/")[4]

    let token = localStorage.getItem('token');

    const fileInput = useRef(null)

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchApi = async () => {
        try {
            const rs = await axiosPath(`/admin/builds/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                setInput(rs.data.build)
            }
        }catch(err){
            console.log(err)
        }
    }

    useEffect( () => {
        document.title = `แก้ไขข้อมูลอาคาร | ${id}`
        fetchApi();
    }, [fetchApi, id] )

    console.log(input)

    const hdlSubmit = async () => {
        try {
            const file = fileInput.current.files[0];

            if (!input.build_name || !input.build_number) {
                return Swal.fire({
                    title: 'กรุณาป้อนข้อมูลให้ครบ',
                    icon: 'warning'
                })
            }

            const formData = new FormData();

            // eslint-disable-next-line no-unused-vars
            const { build_id, ...data } = input

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (file) {
                formData.append('imageBuild', file);
            }
            const token = localStorage.getItem('token')
            const rs = await axiosPath.patch(`/admin/builds/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                Swal.fire({
                    title: "บันทึกข้อมูลเรียบร้อย",
                    icon: 'success',
                }).then(() => {
                    navigate(-1)
                })
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                text: err.response.data.message,
                title: 'พบข้อผิดพลาด',
                icon: 'error',
            });
        }
    }

    const hdlClear = () => {
        setInput({
            build_name: "",
            build_number: "",
        })
        fileInput.current.value = null
        setSelectFile(null)
    }

    const hdlChangeFile = () => {
        const file = fileInput.current.files[0]
        setSelectFile(file)
    }


    return (
        <div data-theme="light" className="max-w-[53rem] min-h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">แก้ไขอาคาร</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <div className="w-full sm:w-1/2">
                    <p className='font-bold'>ชื่ออาคาร</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.build_name !== "" ? "border-[#FF609C]" : ""}`} name="build_name" type='text' value={input.build_name} onChange={hdlChange} placeholder='พิมพ์ชื่ออาคาร' />
                </div>
                <div className="w-full sm:w-1/2">
                    <p className='font-bold'>เลขอาคาร</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.build_number !== "" ? "border-[#FF609C]" : ""}`} type="text" name="build_number" onChange={hdlChange} value={input.build_number} placeholder='พิมพ์เลขอาคาร' />
                </div>
            </form>
            <div className="w-full mt-3">
                <p>ใส่ภาพถ่ายอาคาร</p>
                <input className="block w-full focus:outline-none py-2 rounded-lg bg-gray-50 cursor-pointer mt-1 file:rounded-md file:mx-2 file:py-2 file:px-4 file:border-0" type="file" ref={fileInput} onChange={hdlChangeFile} accept="image/*" />
                {input.build_image && (
                    <>
                    {selectFile ? "" : <p className="text-center text-md font-medium">ภาพที่อยู่ในระบบ</p>}
                    <img className="max-w-[85%] sm:max-w-[50%] mx-auto rounded-lg my-2 shadow-md border-2 border-white" src={selectFile ? URL.createObjectURL(selectFile) : input.build_image} alt="ภาพตัวอย่าง" />
                    </>
                )}
            </div>
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className='border-2 border-[#FF609C] w-1/4 md:w-28 py-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>แก้ไขข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 disabled:opacity-45 disabled:active:scale-100 disabled:cursor-not-allowed' disabled onClick={hdlClear}>ล้างข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-1/4 md:w-28 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
            </div>
            <hr />
        </div>
    )
}


export default EditBuild