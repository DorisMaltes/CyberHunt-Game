import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

export default function QRScanner({ onScan }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const webcam = webcamRef.current;
      const canvas = canvasRef.current;
      if (webcam && webcam.video && canvas) {
        const video = webcam.video;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          console.log("QR detectado:", code.data);
          onScan(code.data);
        }
      }
    }, 500); // 🔥 Escanea cada 500ms

    return () => clearInterval(interval);
  }, [onScan]);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{
           facingMode: 'environment' ,
           width: {ideal: 1280}, //aumenta resolucion
           height: { ideal: 720}
          }} // 🔥 Cámara trasera
        style={{ width: '100%' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* 🔥 Canvas oculto para procesar frames */}
    </div>
  );
}
