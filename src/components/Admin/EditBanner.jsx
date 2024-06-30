
import Swal from "sweetalert2";
import axios from "../../configs/axios-path";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

function EditBanner() {

    const [selectedFile, setSelectedFile] = useState();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        b_header: "",
        b_title: "",
        b_status: 1,
        b_create_at: "",
        b_enddate: "",
    });
    const navigate = useNavigate();

    const inputRef = useRef();

    const bannerId = location.pathname.split("/")[4]

    let token = localStorage.getItem('token');

    const getBannerByID = async () => {
        try {
            const rs = await axios.get(`/admin/banner/${bannerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setInput(rs.data.banner)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getBannerByID();
    }, [])

    const hdlFileChange = (e) => {
        const file = inputRef.current.files[0];
        setSelectedFile(file);
        const checkSize = file?.size;
        const fileSizeInMB = checkSize / (1024 * 1024);

        if (fileSizeInMB > 10) {
            alert("ขนาดของไฟล์เกิน 10 MB");
            setSelectedFile(null)
            e.target.value = null;
        }
    };

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const empty = (!input.b_enddate || input.b_header === "หัวข้อเรื่อง" || input.b_title === "เนื้อหาคราวๆ" || !input.b_enddate)

    const hdlUploadBanner = async () => {


        setLoading(true)

        let token = localStorage.getItem('token');

        const { b_id, b_enddate, ...data} = input

        const file = inputRef.current?.files[0];
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        
        if (file) {
            formData.append('imageBanner', file);
        }

        formData.set('b_enddate', new Date(input.b_enddate).toISOString());

        try {
            const rs = await axios.patch(`/admin/banner/${bannerId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                Swal.fire({
                    icon: 'success',
                    title: 'Update banner success!',
                    text: `Update banner success ${new Date().toLocaleDateString('th-TH')}`,
                    preConfirm: () => {
                        setLoading(false)
                        navigate(-1)
                    },
                })
            }
        }catch(err){
            console.log(err)
        }
    }

    const formatEndDate = input.b_enddate ? new Date(input.b_enddate).toISOString().substr(0, 10) : '';

  return (
    <div className="max-w-[80rem] mx-auto select-none text-black">
            <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-2 px-4 py-3 lg:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto ">
                <div className="relative overflow-hidden max-w-[353px] h-[563px] rounded-lg rounded-bl-lg bg-center">
                    <div
                        key={1}
                        className={`absolute inset-0 transition-transform duration-500 ease-in-out transform`}>
                        <img src={selectedFile !== undefined ? URL.createObjectURL(selectedFile) : input.b_url}  alt="header" className="max-w-[353px] max-h-[563px] pointer-events-none" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4">
                            <h5 className="text-white text-xl md:text-2xl font-bold">{input.b_header}</h5>
                            <p className="text-white text-md md:text-lg font-bold">{input.b_title}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2" data-theme="light">
                    <div className="w-full">
                        <p>อัพโหลดภาพ</p>
                        <input className="w-full py-2 rounded-lg px-2 file:rounded-md file:border-none file:bg-slate-200 shadow-inner border" type="file" ref={inputRef} onChange={hdlFileChange} accept="image/*" />
                    </div>
                    <div className="w-full">
                        <p>หัวข้อ</p>
                        <input className="w-full py-2 rounded-lg px-2 shadow-inner border" name="b_header" type="text" value={input.b_header} onChange={hdlChange} />
                    </div>
                    <div className="w-full">
                        <p>เนื้อความ</p>
                        <textarea className="w-full py-2 rounded-lg px-2 shadow-inner border"  rows={4} name="b_title" type="text" value={input.b_title} onChange={hdlChange} />
                    </div>
                    <div className="w-full">
                        <p>วันหมดอายุ</p>
                        <input className="w-full py-2 rounded-lg px-2 shadow-inner border" name="b_enddate" type="date" value={formatEndDate} onChange={hdlChange} />
                    </div>
                    <div className="w-full mt-4">
                        <button className="w-full bg-[#FF90BC] text-white font-semibold py-2 rounded-lg disabled:opacity-80 disabled:cursor-not-allowed" onClick={ () => hdlUploadBanner()} disabled={empty}>{!loading ? "บันทึกข้อมูล" : (<div className="flex gap-2 justify-center"><span className="loading loading-spinner loading-md"></span>กำลังอัพโหลด</div>) }</button>
                    </div>
                    <div className="w-full my-1">
                        <button className="w-full bg-[#6096B4] text-white font-semibold py-2 rounded-lg" onClick={ () => navigate(-1) }>ย้อนกลับ</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default EditBanner