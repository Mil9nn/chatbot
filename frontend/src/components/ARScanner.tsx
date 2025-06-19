import { useState, useRef } from 'react';
import { axiosInstance } from '@/lib/axios';
import { Camera, Loader2, ScanLine, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useThemeStore } from '@/store/useThemeStore';

function ARScanner() {
    const [image, setImage] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isFrontCamera, setIsFrontCamera] = useState(false);

    const [isCameraActive, setIsCameraActive] = useState(false);

    const { isLight } = useThemeStore();

    const startCamera = async (facingMode: 'user' | 'environment' = 'user') => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
        setIsCameraActive(false);
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImage(imageData);

        setIsAnalyzing(true);
        setResponse('Analyzing image...');
        try {
            const res = await axiosInstance.post('/messages/analyze-image', { image: imageData });
            if (res.data.success) {
                setResponse(res.data.message);
            }
        } catch (err) {
            console.error("Error analyzing image:", err);
            setResponse('Error analyzing image');
        } finally {
            setIsAnalyzing(false);
            stopCamera();
        }
    };

    return (
        <ScrollArea className="w-full h-[calc(100vh-70px)] pb-10">
            <div className={`flex flex-col items-center justify-center gap-4 p-4 ${isLight ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}>

                {/* Intro Description */}
                <div className="w-full max-w-2xl text-center text-sm text-zinc-400 px-2">
                    <p>
                        Start your camera, capture an image, and get a description powered by AI. Perfect for analyzing visual content in real time.
                    </p>
                </div>

                {/* Live Camera Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full max-w-2xl aspect-video rounded-lg border border-zinc-800 shadow-md object-cover"
                />

                <div className="flex items-center flex-wrap justify-center gap-4 mt-2">
                    <button
                        title="Start Camera"
                        onClick={() => startCamera(isFrontCamera ? 'user' : 'environment')}
                        className={`flex items-center gap-1 p-3 rounded-full border-1 ${isLight ? "border-black/60 hover:bg-[#e4e0e0]" : "border-white/30 hover:bg-zinc-700"} cursor-pointer transition`}
                    >
                        <Camera className="size-6" />
                    </button>
                    {isCameraActive && <button
                        disabled={!isCameraActive}
                        onClick={captureAndAnalyze}
                        className="flex w-[120px] items-center gap-1 p-3 rounded-md bg-violet-600 hover:bg-violet-500 cursor-pointer transition"
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <ScanLine className="size-6" />}
                        {isAnalyzing ? <span>Analyzing</span> : <span>Analyze</span>}
                    </button>}
                    {isCameraActive && <button
                        onClick={stopCamera}
                        title="Cancel"
                        className="flex items-center gap-1 border border-white/30 hover:scale-105 active:scale-95 p-3 rounded-full cursor-pointer transition"
                    >
                        <X className="size-6" />
                    </button>}
                    {isCameraActive && <button
                        onClick={() => {
                            stopCamera();
                            const newFacing = isFrontCamera ? 'environment' : 'user';
                            setIsFrontCamera(!isFrontCamera);
                            startCamera(newFacing);
                        }} 
                        title="Switch Camera"
                        className="flex items-center gap-1 hover:scale-105 active:scale-95 p-3 rounded-full cursor-pointer transition"
                    >
                        <svg fill="teal" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M213.1 64.8L202.7 96 128 96c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L426.9 64.8C420.4 45.2 402.1 32 381.4 32L258.6 32c-20.7 0-39 13.2-45.5 32.8zM448 256c0 8.8-7.2 16-16 16l-76.7 0c-6.2 0-11.3-5.1-11.3-11.3c0-3 1.2-5.9 3.3-8L371 229c-13.6-13.4-31.9-21-51-21c-19.2 0-37.7 7.6-51.3 21.3L249 249c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l19.7-19.7C257.4 172.7 288 160 320 160c31.8 0 62.4 12.6 85 35l23.7-23.7c2.1-2.1 5-3.3 8-3.3c6.2 0 11.3 5.1 11.3 11.3l0 76.7zM192 320c0-8.8 7.2-16 16-16l76.7 0c6.2 0 11.3 5.1 11.3 11.3c0 3-1.2 5.9-3.3 8L269 347c13.6 13.4 31.9 21 51 21c19.2 0 37.7-7.6 51.3-21.3L391 327c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-19.7 19.7C382.6 403.3 352 416 320 416c-31.8 0-62.4-12.6-85-35l-23.7 23.7c-2.1 2.1-5 3.3-8 3.3c-6.2 0-11.3-5.1-11.3-11.3l0-76.7z"/></svg>
                    </button>}
                </div>

                <div>
                    {image && (
                        <div className="mt-4 p-2 rounded-sm border border-zinc-700 bg-zinc-800 max-w-2xl">
                            <img src={image} alt="Captured" className="w-full h-auto rounded-sm" />
                        </div>
                    )}
                </div>

                {/* Response Section */}
                {response && (
                    <div className="mt-4 p-4 text-sm whitespace-pre-wrap bg-zinc-800 text-zinc-200 border border-zinc-700 w-full max-w-2xl shadow-sm">
                        {response}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}

export default ARScanner;
