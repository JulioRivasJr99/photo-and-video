import { useState } from 'react';
import { CameraView } from '@/components/CameraView';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Card } from '@/components/ui/card';
import { Smartphone, Zap, Eye, PlayCircle } from 'lucide-react';

const Index = () => {
  const [detectedImage, setDetectedImage] = useState<string | null>(null);

  const handleImageDetected = (image: string) => {
    setDetectedImage(image);
  };

  const handleBack = () => {
    setDetectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  PhotoPlay AR
                </h1>
                <p className="text-xs text-muted-foreground">Foto + Vídeo = Magia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">MVP Demo</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!detectedImage ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">
                Transforme <span className="bg-gradient-hero bg-clip-text text-transparent">fotos</span> em{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent">vídeos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Aponte sua câmera para qualquer foto impressa e veja a mágica acontecer. 
                Realidade aumentada na palma da sua mão.
              </p>
            </div>

            {/* Camera Component */}
            <div className="max-w-md mx-auto">
              <CameraView onImageDetected={handleImageDetected} />
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 text-center bg-gradient-to-b from-primary/5 to-transparent border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">IA Avançada</h3>
                <p className="text-sm text-muted-foreground">
                  Reconhecimento inteligente de imagens com precisão
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-b from-accent/5 to-transparent border-accent/20">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Super Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Detecção instantânea e reprodução em tempo real
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-b from-primary-glow/5 to-transparent border-primary-glow/20">
                <div className="w-12 h-12 rounded-xl bg-primary-glow/20 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-primary-glow" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiplataforma</h3>
                <p className="text-sm text-muted-foreground">
                  Funciona em Android, iOS e navegadores
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <VideoPlayer detectedImage={detectedImage} onBack={handleBack} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
