import axiosPath from "../../configs/axios-path";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export default function EditSubject() {
  const navigate = useNavigate();
  const [getMajor, setGetMajor] = useState([]);
  const [getRoom, setGetRoom] = useState([]);

  const [input, setInput] = useState({
    sub_name: "",
    sub_code: "",
    room_id: "",
    major_id: "",
  });

  const id = location.pathname.split('/')[4];
  let token = localStorage.getItem('token');

  const getSubjectById = async () => {
    try {
      const rs = await axiosPath.get(`/admin/subject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInput(rs.data.sub);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllRoom = async () => {
    try {
      const rs = await axiosPath.get(`/admin/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGetRoom(rs.data.rooms);
    } catch (err) {
      alert(err.message);
    }
  };

  const adminGetMajor = async () => {
    try {
      const rs = await axiosPath.get(`/admin/major`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGetMajor(rs.data.major);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    document.title = `แก้ไขข้อมูลวิชา | ${id}`

    getSubjectById();
    getAllRoom();
    adminGetMajor();
  }, []);

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    if (!input.sub_code || !input.sub_name || !input.major_id || !input.room_id) {
      return Swal.fire({
        title: 'กรุณาป้อนข้อมูลให้ครบ',
        icon: 'warning'
      })
    }
    try {

      const { sub_id, ...data } = input

      const rs = await axiosPath.patch(`/admin/subject/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (rs.status === 200) {
        Swal.fire({
          title: "บันทึกข้อมูลเรียบร้อย",
          icon: 'success',
        }).then(() => {
          navigate(-1)
        })
      }
    } catch (err) {
      Swal.fire({
        text: err.response.data.message,
        title: 'พบข้อผิดพลาด',
        icon: 'error',
      });
      console.log(err);
    }
  };

  const hdlReset = () => {
    setInput({
      sub_name: "",
      sub_code: "",
      room_id: "",
      major_id: "",
    });
    document.querySelector('select[name="room_id"]').selectedIndex = 0;
    document.querySelector('select[name="major_id"]').selectedIndex = 0;
  };

  const selectMajor = getMajor.map((el) => ({
    value: el.major_id,
    label: el.major_name
  }));

  return (
    <div data-theme="light" className="max-w-[53rem] md:h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
      <p className="text-xl text-center font-extrabold">แก้ไขวิชาเรียน</p>
      <form className="flex gap-2 mt-2 flex-col md:flex-row">
        <div>
          <p className='font-bold'>ชื่อวิชา</p>
          <input className={`w-full md:w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`} name="sub_name" type='text' value={input.sub_name} onChange={hdlChange} placeholder='พิมพ์ชื่อวิชา' />
        </div>
        <div>
          <p className='font-bold'>รหัสวิชา</p>
          <input className={`w-full md:w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`} type="text" name="sub_code" onChange={hdlChange} value={input.sub_code} placeholder='พิมพ์รหัสวิชา' />
        </div>
        <div>
          <p className='font-bold'>ห้องเรียน</p>
          <select className={`w-full md:w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`} name="room_id" onChange={hdlChange} value={input.room_id}>
            <option value="">เลือกห้อง</option>
            {getRoom.length > 0 && getRoom.map((el, number) => (
              <option key={number} value={el.room_id}>{el.room_name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='font-bold'>กลุ่มวิชา</p>
          {/* <Select className={`w-full md:w-[215px] hover:font-bold focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:text-white text-ellipsis`} name="major_id" onChange={handleMajorChange} options={selectMajor} value={selectMajor.find(option => option.value === input.major_id)}/> */}
          <select className={`w-full md:w-[215px] px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis`} name="major_id" value={input.major_id} onChange={hdlChange}>
            <option hidden>เลือกกลุ่มวิชา</option>
            {getMajor.map((el, number) => (
              <option key={number} value={el.major_id}>{el.major_name}</option>
            ))}
          </select>
        </div>
      </form>
      <div className='flex justify-end gap-1 mt-5 mb-3'>
        <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>แก้ไขข้อมูล</button>
        <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 disabled:opacity-45 disabled:active:scale-100 disabled:cursor-not-allowed' onClick={hdlReset} disabled>ล้างข้อมูล</button>
        <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>
      <hr />
    </div>
  );
}
