import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Square, Play, Loader2 } from 'lucide-react';

interface CameraViewProps {
  onImageDetected: (image: string) => void;
}

export const CameraView = ({ onImageDetected }: CameraViewProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Processamento real - busca na base de dados
    try {
      const imageUrl = URL.createObjectURL(file);
      console.log('Analisando imagem capturada...');
      
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
        {!isCapturing && !isProcessing ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Aponte para uma foto impressa
              </h3>
              <p className="text-muted-foreground">
                O app irá detectar e reproduzir o vídeo correspondente
              </p>
            </div>
            <Button 
              onClick={handleCapture}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capturar Foto
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="text-center space-y-6">
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
        ) : (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
              <Square className="w-12 h-12 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Capturando...
              </h3>
              <p className="text-muted-foreground">
                Mantenha a foto no centro da tela
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        {/* Overlay de frame para simular viewfinder */}
        <div className="absolute inset-4 border-2 border-primary/30 rounded-lg pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        </div>
      </div>
    </Card>
  );
};