
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/UseAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Banner() {
    const [banner, setBanner] = useState([]);
    const { setRefetchBanner } = useAuth();
    const navigate = useNavigate();

    let token = localStorage.getItem('token');

    useEffect(() => {
        fetchBannerApi();
    }, []);

    const fetchBannerApi = async () => {
        const rs = await axiosPath.get('/admin/banner', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (rs.status === 200) {
            setBanner(rs.data.banner);
            setRefetchBanner((prev) => !prev)
        }
    };

    const updateBannerStatus = async (id, status) => {
        try {
            await axiosPath.patch(`/admin/banner/status/${id}`, { b_status: status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchBannerApi();

        } catch (error) {
            console.error("Error updating banner status:", error);
        }
    };

    const handleToggle = (id, currentStatus, endDate) => {
        const nowDate = new Date().toLocaleDateString('th-TH');
        if (new Date(endDate).toLocaleDateString('th-TH') > nowDate) {
            const newStatus = currentStatus === 1 ? 0 : 1;
            updateBannerStatus(id, newStatus);
        }
    };

    const nowDate = new Date().toLocaleDateString('th-TH');

    const hdlDeleteBanner = async (id) => {
        try {

            let token = localStorage.getItem('token')

            const rs = await axiosPath.delete(`/admin/banner/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (rs.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Delete banner success!',
                    text: `Banner ID ${id}`,
                    preConfirm: () => {
                        fetchBannerApi();
                    }
                })
            }
        } catch (err) {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Delete banner fail!',
                text: err.response.data.message
            })
        }
    }

    const hdlEdit = (id) => {
        navigate('edit/' + id)
    }

    return (
        <div className="max-w-[80rem] mx-auto select-none text-black">
            <div className="bg-white px-4 py-3 lg:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto ">
                <div className="flex justify-end pb-3 border-b font-semibold">
                    <button className="bg-[#FF90BC] transition-all ease-in-out duration-150 hover:bg-[#6096B4] border-2 border-white text-white shadow-md py-2 px-3 rounded-lg" onClick={() => navigate('add')}>เพิ่มแบนเนอร์</button>
                </div>
                <div className="w-full flex flex-col gap-4 mt-3">
                    {banner?.length !== 0 ? (
                        banner.map((el, index) => (
                            <>
                                <div key={index} className="w-full justify-between border-b pb-4 hidden lg:flex">
                                    <div className="flex justify-between w-5/6 gap-2">
                                        <div className="flex gap-5">
                                            <div className="flex flex-col bg-slate-500 text-white p-2 items-center justify-center rounded-md">
                                                <p className="w-fit">ลำดับ</p>
                                                <p className="font-bold text-3xl">{index + 1}</p>
                                            </div>
                                            <img className="max-h-[15rem] rounded-md border-4 border-white drop-shadow-lg pointer-events-none" src={`${el.b_url}`} alt={`banner${index + 1}`} />
                                        </div>
                                        <div className="w-[250px]">
                                            <p>หัวเรื่อง {el.b_header}</p>
                                            <p>เนื้อหา {el.b_title}</p>
                                        </div>
                                        <div className="w-[120px] text-center">
                                            <div>
                                                <p className="font-semibold">วันที่อัพโหลด</p>
                                                <p>{new Date(el.b_create_at).toLocaleDateString('th-TH')}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">วันหมดอายุ</p>
                                                <p>{new Date(el.b_enddate).toLocaleDateString('th-TH')}</p>
                                                <p className={`font-bold ${new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "text-red-600" : "text-green-600 drop-shadow-md"}`}>{new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "หมดอายุแล้ว" : "ยังไม่หมดอายุ"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-10">
                                        <div data-theme="light" className="w-[100px] flex flex-col items-center gap-2">
                                            <p>{el.b_status === 1 && new Date(el.b_enddate).toLocaleDateString('th-TH') !== nowDate ? "แสดงผล" : "ปิดการแสดง"}</p>
                                            <input
                                                type="checkbox"
                                                className={`toggle ${new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "toggle-error" : "toggle-success"} toggle-sm`}
                                                disabled={new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate}
                                                checked={el?.b_status === 1 ? 1 : 0}
                                                onChange={() => handleToggle(el.b_id, el.b_status, el.b_enddate)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 w-full gap-2 text-white">
                                            <button className="border border-yellow-500 py-1 text-yellow-500 rounded-md shadow-md transition ease-in-out duration-150 scale-100 active:scale-95 hover:font-semibold hover:text-white hover:bg-yellow-500" onClick={() => hdlEdit(el.b_id)}>แก้ไข</button>
                                            <button className="border border-red-600 py-1 text-red-600 rounded-md shadow-md transition ease-in-out duration-150 scale-100 active:scale-95 hover:font-semibold hover:text-white hover:bg-red-600" onClick={() => hdlDeleteBanner(el.b_id)}>ลบ</button>
                                        </div>
                                    </div>
                                </div>

                                {/* responsive */}

                                <div className="block lg:hidden">
                                    <div data-theme="light" className="flex flex-col justify-end items-end my-2">
                                        <p>{el.b_status === 1 && new Date(el.b_enddate).toLocaleDateString('th-TH') !== nowDate ? "แสดงผล" : "ปิดการแสดง"}</p>
                                        <input
                                            type="checkbox"
                                            className={`toggle ${new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "toggle-error" : "toggle-success"} toggle-sm`}
                                            disabled={new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate}
                                            checked={el?.b_status === 1 ? 1 : 0}
                                            onChange={() => handleToggle(el.b_id, el.b_status, el.b_enddate)}
                                        />
                                    </div>
                                    <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4 capitalize">
                                        <div key={1} className={`mx-auto w-[176.5px] h-[281.5px] bg-contain transition-transform duration-500 ease-in-out transform rounded-md shadow-md border-2 border-white`}>
                                            <img src={el.b_url} alt={el.b_header} className="pointer-events-none rounded-md" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4 rounded-md">
                                                <h5 className="text-white text-[10px] font-bold">{el.b_header}</h5>
                                                <p className="text-white text-[8px] font-bold">{el.b_title}</p>
                                            </div>
                                        </div>
                                        <hr className="block sm:hidden" />
                                        <div>
                                            <div className="my-1">
                                                <p className="font-semibold">หัวเรื่อง</p>
                                                <p className="border p-2 rounded-md shadow-inner">{el.b_header}</p>
                                            </div>
                                            <div className="my-1">
                                                <p className="font-semibold">เนื้อหา</p>
                                                <p className="border p-2 rounded-md shadow-inner">{el.b_title}</p>
                                            </div>
                                        </div>
                                        <div className="text-center grid grid-cols-2 sm:flex sm:flex-col">
                                            <div>
                                                <p className="font-semibold">วันที่อัพโหลด</p>
                                                <p>{new Date(el.b_create_at).toLocaleDateString('th-TH')}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">วันหมดอายุ</p>
                                                <p>{new Date(el.b_enddate).toLocaleDateString('th-TH')}</p>
                                                <p className={`font-bold ${new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "text-red-600" : "text-green-600 drop-shadow-md"}`}>{new Date(el.b_enddate).toLocaleDateString('th-TH') <= nowDate ? "หมดอายุแล้ว" : "ยังไม่หมดอายุ"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 px-2 my-4">
                                        <button className="border w-1/2 border-yellow-500 py-1 text-yellow-500 rounded-md shadow-md transition ease-in-out duration-150 scale-100 active:scale-95 hover:font-semibold hover:text-white hover:bg-yellow-500" onClick={() => hdlEdit(el.b_id)}>แก้ไข</button>
                                        <button className="border w-1/2 border-red-600 py-1 text-red-600 rounded-md shadow-md transition ease-in-out duration-150 scale-100 active:scale-95 hover:font-semibold hover:text-white hover:bg-red-600" onClick={() => hdlDeleteBanner(el.b_id)}>ลบ</button>
                                    </div>
                                </div>
                                <hr className="block sm:hidden" />
                            </>
                        ))
                    ) : (
                        <div key="1" data-theme='light' className="w-full flex justify-between border-b pb-4">
                            <div className="flex justify-between w-5/6 gap-2">
                                <div className="flex gap-10">
                                    <p className="w-[3.5rem] skeleton h-7 rounded-sm"></p>
                                    <img className="h-[15rem] w-[9rem] rounded-sm skeleton" />
                                </div>
                                <div className="w-[250px]">
                                    <p className="h-8 skeleton mb-2"></p>
                                    <p className="h-32 skeleton"></p>
                                </div>
                                <div className="w-[120px]">
                                    <div>
                                        <p className="h-7 skeleton mb-2"></p>
                                        <p className="h-7 skeleton mb-2"></p>
                                    </div>
                                    <div>
                                        <p className="h-7 skeleton mb-2"></p>
                                        <p className="h-7 skeleton mb-2"></p>
                                        <p className="h-7 skeleton mb-2"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-10">
                                <div data-theme="light" className="w-[100px] flex flex-col items-center gap-2">
                                    <p className="h-7 w-full skeleton mb-2"></p>
                                    <p className="h-7 w-1/2 skeleton mb-2"></p>
                                </div>
                                <div className="flex gap-2 w-full">
                                    <p className="h-7 w-1/2 skeleton mb-2"></p>
                                    <p className="h-7 w-1/2 skeleton mb-2"></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Banner;
