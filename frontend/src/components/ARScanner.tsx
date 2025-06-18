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

    const { isLight } = useThemeStore();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
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

                {/* Action Buttons */}
                <div className="flex items-center sm:flex-nowrap flex-wrap justify-center gap-6 mt-2">
                    <button
                        onClick={startCamera}
                        title="Start Camera"
                        className={`flex items-center gap-1 cursor-pointer p-3 rounded-full border-1 ${isLight ? "border-black/60 hover:bg-[#e4e0e0]" : "border-white/30 hover:bg-zinc-700"} transition`}
                    >
                        Camera
                        <Camera className="size-6" />
                    </button>
                    <button
                        onClick={captureAndAnalyze}
                        title="Analyze"
                        className="flex w-[120px] items-center gap-1 cursor-pointer p-3 rounded-md bg-violet-600 hover:bg-violet-500 transition"
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <ScanLine className="size-6" />}
                        {isAnalyzing ? <span>Analyzing</span> : <span>Analyze</span>}
                    </button>
                    <button
                        onClick={stopCamera}
                        title="Stop Camera"
                        className="flex items-center gap-1 border-1 border-white/30 hover:scale-[1.05] active:scale-[0.95] cursor-pointer p-3 rounded-full transition"
                    >
                        <X className="size-6" />
                        Cancel
                    </button>
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
