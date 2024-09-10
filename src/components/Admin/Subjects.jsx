/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";

export default function Subjects() {
  const [getSubject, setGetSubject] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const { setRefetchBanner } = useAuth();

  let token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "Admin | รายชื่อวิชาเรียน";
    useSubjects();
  }, [reload, token]);

  const useSubjects = async () => {
    const rs = await axiosPath.get("/admin/subject", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGetSubject(rs.data.sub);
  };

  const hdlAdd = () => {
    navigate("add");
  };

  const hdlDelete = async (id, sub_name) => {
    Swal.fire({
      icon: "question",
      title: "ต้องการลบข้อมูลหรือไม่ ?",
      text: `คุณต้องการลบวิชา ${sub_name} หรือไม่, เนื่องด้วยการลบจะทำให้ตารางเรียนที่ใช้วิชานี้อยู่นั้นจะหายไปด้วย, โปรดตรวจสอบข้อมูลก่อน`,
      showCancelButton: true,
      confirmButtonColor: "#E5252A",
      confirmButtonText: "ใช่, ต้องการลบ",
      cancelButtonText: "ไม่, ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const rs = await axiosPath.delete(`/admin/subject/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (rs.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ลบข้อมูลวิชาเรียนสำเร็จ",
            }).then(() => {
              setReload((prev) => !prev);
              setRefetchBanner((prev) => !prev);
            });
          }
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "พบข้อผิดพลาด",
            text: err.response.data.message,
          });
        }
      }
    });
  };

  const hdlEdit = (id) => {
    navigate(`edit/${id}`);
  };

  return (
    <>
      <div className="max-w-[80rem] mx-auto mt-3 select-none">
        <div className="bg-white p-3 md:p-5 rounded-2xl max-w-[53rem] mt-5 mx-auto overflow-hidden animate-slidein opacity-0 [--slidein-delay:100ms]">
          <div className="flex justify-end">
            <button
              className="p-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 animate-slidein opacity-0 [--slidein-delay:100ms]"
              type="button"
              onClick={hdlAdd}
            >
              เพิ่ม
            </button>
          </div>
          <div className="hidden md:block">
            {getSubject.length !== 0 ? (
              <table className="table table-xs text-black my-1">
                <thead className="text-center">
                  <tr className="text-[15px] text-black">
                    <th>ลำดับ</th>
                    <th>ชื่อวิชา</th>
                    <th>รหัสวิชา</th>
                    <th>กลุ่มวิชา</th>
                    <th>ห้องที่เรียน</th>
                    <th colSpan="2">ตัวเลือก</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {getSubject.map((el, number) => (
                    <tr key={number} className="text-[15px]">
                      <th className="text-[15px]">{number + 1}</th>
                      <td className="text-[15px]">{el.sub_name}</td>
                      <td className="text-[15px]">{el.sub_code}</td>
                      <td className="text-[15px]">{el.major.major_name}</td>
                      <td className="text-[15px]">{el.room.room_name}</td>
                      <th className="text-[15px]">
                        <button
                          className="py-2.5 px-3 hover:bg-gray-600 rounded-full"
                          onClick={() => hdlEdit(el.sub_id)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </th>
                      <th className="text-[15px]">
                        <button
                          className="py-2.5 px-3 hover:bg-gray-600 rounded-full"
                          onClick={() => hdlDelete(el.sub_id, el.sub_name)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xl font-bold py-2 my-1 border-y-2 text-center">
                ระบบไม่พบข้อมูลตารางเรียน
              </p>
            )}
          </div>

          {/* responsive */}

          <div className="font-semibold block md:hidden">
            <p className="text-black text-center font-bold text-lg mb-2 animate-slidein opacity-0 [--slidein-delay:200ms]">
              รายชื่อวิชาทั้งหมดที่เรามี
            </p>
            <hr />
            <div className="flex sm:gap-2 mx-auto flex-col sm:flex-row sm:flex-wrap">
              {getSubject.map((el, index) => (
                <div
                  className="relative w-full sm:w-[48%] mx-auto animate-slidein opacity-0 [--slidein-delay:400ms]"
                  key={index}
                >
                  <p className="absolute bg-white text-base-200 px-2 w-1/4 text-center font-extrabold top-1 left-0 rounded-br-md">
                    {index + 1}
                  </p>
                  <div className="absolute flex pt-1.5 items-center justify-around bg-white text-base-200 px-2 w-1/4 text-center font-extrabold top-1 right-0 rounded-bl-md">
                    <button
                      className="text-sm"
                      onClick={() => hdlEdit(el.sub_id)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className="text-sm"
                      onClick={() => hdlDelete(el.sub_id, el.sub_name)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div
                    className={`flex text-white text-[15px] sm:text-[16px] justify-between py-2 px-3 pt-6 my-1 sm:my-1.5 rounded-lg gap-2 shadow-lg border-2 border-white ${
                      index % 2 === 0 ? "bg-[#6096B4]" : "bg-[#FF90BC]"
                    }`}
                  >
                    <div>
                      <p>รหัส {el.sub_code}</p>
                      <p className="block sm:hidden">{el.sub_name}</p>
                      <p className="hidden sm:block">วิชา {el.sub_name}</p>
                      <p className="hidden sm:block truncate">
                        {el.major.major_name}
                      </p>
                      <p className="hidden sm:block">
                        ห้องเรียน {el.room.room_name}
                      </p>
                    </div>
                    <div className="block sm:hidden">
                      <p>{el.major.major_name}</p>
                      <p>ห้องเรียน {el.room.room_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
