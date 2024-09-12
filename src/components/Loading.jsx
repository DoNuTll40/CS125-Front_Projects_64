export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 min-h-[35vh]">
      <div className=" relative">
        <span className=" absolute loading loading-ring loading-lg"></span>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
      <p className="text-white font-semibold text-lg flex items-center gap-1">
        กำลังโหลดข้อมูล <span className="loading loading-bars loading-md"></span>
      </p>
    </div>
  );
}
