
import { useEffect, useRef, useState } from 'react';
import axios from '../configs/axios-path';
import useAuth from '../hooks/UseAuth';

function SlideDashboard() {
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const intervalRef = useRef(null);
    const [ bannerData, setBannerData ] = useState([]);
    const { refetchBanner } = useAuth();

    const goToNextSlide = () => {
        if (bannerData.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % bannerData.length);
        }
    };

    // console.log(refetchBanner)

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const fetchBanner = async () => {
        try {
            const response = await axios.get("/banner");
            if (response.status === 200) {
                setBannerData(response.data.banner);
                setCurrentSlide(0); // Reset currentSlide after fetching new data
            }
        } catch (error) {
            console.error('Error fetching banner:', error);
        }
    };

    useEffect(() => {
        // console.log('refetchBanner changed:', refetchBanner);
        fetchBanner();
    }, [refetchBanner]);
    
    useEffect(() => {
        // console.log('Banner data updated:', bannerData);
        startAutoSlide();
        return () => clearInterval(intervalRef.current);
    }, [bannerData]);

    const startAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(goToNextSlide, 5000);
    };

    const handleIndicatorClick = (index) => {
        goToSlide(index);
        startAutoSlide();
    };

    return (
        <div className="relative w-[80%] shadow hidden md:block select-none">
            <div className="relative overflow-hidden h-full rounded-tl-lg rounded-bl-lg">
                {bannerData.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-500 ease-in-out transform ${index === currentSlide ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                    >
                        <img src={slide.b_url} alt={slide.b_header} className="w-[353px] max-h-[563px] pointer-events-none" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4">
                            <h5 className="text-white text-[18px] font-bold">{slide.b_header}</h5>
                            <p className="text-white text-[14px] font-bold">{slide.b_title}</p>
                        </div>
                    </div>
                ))}
            </div>
            {bannerData.length !== 0 && (
                <div className="absolute items-center bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {bannerData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleIndicatorClick(index)}
                            className={`rounded-full shadow-sm ${currentSlide === index ? 'bg-white w-3 h-3' : 'bg-gray-400 h-2 w-2'}`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SlideDashboard;
