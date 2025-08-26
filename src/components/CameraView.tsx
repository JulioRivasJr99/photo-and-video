import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Square, RotateCcw, Loader2, Upload } from 'lucide-react';

interface CameraViewProps {
  onImageDetected: (image: string) => void;
}

export const CameraView = ({ onImageDetected }: CameraViewProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const [flashAnimation, setFlashAnimation] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Verifica se a câmera é suportada
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraSupported(false);
    }
    
    return () => {
      // Cleanup: para o stream quando o componente é desmontado
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    if (!cameraSupported) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Câmera traseira no mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      setCameraSupported(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Configura o canvas com as dimensões do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converte para base64
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    setIsProcessing(true);
    stopCamera();
    
    try {
      console.log('Analisando imagem capturada...');
      
      // Simula tempo de processamento da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onImageDetected(imageDataUrl);
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro no processamento:', error);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      console.log('Analisando imagem carregada...');
      
      // Simula tempo de processamento da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onImageDetected(imageUrl);
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro no processamento:', error);
      setIsProcessing(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-hero border-primary/20 shadow-glow">
      <div className="aspect-square bg-gradient-bg flex items-center justify-center min-h-[350px] md:min-h-[400px] relative">
        {/* Vídeo da câmera */}
        {isStreaming && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover absolute inset-0"
            />
            {flashAnimation && (
              <div className="absolute inset-0 bg-white opacity-80 pointer-events-none animate-pulse" />
            )}
          </>
        )}
        
        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Estados da interface */}
        {!isStreaming && !isProcessing ? (
          <div className="text-center space-y-6 z-10">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {cameraSupported ? 'Aponte para uma foto impressa' : 'Câmera não disponível'}
              </h3>
              <p className="text-muted-foreground">
                {cameraSupported 
                  ? 'Ative a câmera para detectar fotos em tempo real'
                  : 'Use o upload para enviar uma foto'
                }
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              {cameraSupported && (
                <Button 
                  onClick={startCamera}
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Ativar Câmera
                </Button>
              )}
              
              <Button 
                onClick={handleFileUpload}
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                <Upload className="w-5 h-5 mr-2" />
                Enviar Foto
              </Button>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="text-center space-y-6 z-10">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Analisando imagem...
              </h3>
              <p className="text-muted-foreground">
                IA detectando elementos na foto
              </p>
            </div>
          </div>
        ) : isStreaming ? (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-3">
              <Button 
                onClick={capturePhoto}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capturar
              </Button>
              
              <Button 
                onClick={stopCamera}
                size="lg"
                variant="outline"
                className="bg-background/80 backdrop-blur-sm border-primary/30"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Parar
              </Button>
            </div>
          </div>
        ) : null}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        {/* Overlay de frame para simular viewfinder - só aparece quando a câmera está ativa */}
        {isStreaming && (
          <div className="absolute inset-4 border-2 border-primary/50 rounded-lg pointer-events-none z-10">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
          </div>
        )}
      </div>
    </Card>
  );
};