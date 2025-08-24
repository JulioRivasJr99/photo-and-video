import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  detectedImage: string;
  onBack: () => void;
}

export const VideoPlayer = ({ detectedImage, onBack }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Simular diferentes vídeos baseados na imagem detectada
  const getVideoForImage = (imageUrl: string) => {
    // Simula análise da imagem para determinar qual vídeo mostrar
    const imageHash = imageUrl.length % 4;
    
    const videoDatabase = [
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        title: "Big Buck Bunny",
        description: "Animação 3D sobre um coelhinho corajoso",
        poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
        title: "Elephants Dream",
        description: "Jornada surreal em mundo fantástico",
        poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "For Bigger Blazes", 
        description: "Aventura de ação em alta velocidade",
        poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        title: "Sintel",
        description: "História épica de uma guerreira",
        poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg"
      }
    ];
    
    return videoDatabase[imageHash];
  };

  const currentVideo = getVideoForImage(detectedImage);

  return (
    <div className="space-y-6">
      {/* Imagem detectada */}
      <Card className="overflow-hidden border-primary/20">
        <div className="p-4 bg-gradient-hero">
          <h3 className="text-lg font-semibold text-white mb-2">
            ✅ Imagem detectada com sucesso!
          </h3>
          <div className="flex items-center space-x-4">
            <img 
              src={detectedImage} 
              alt="Imagem detectada" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-white/20"
            />
            <div className="text-white/90">
              <p className="text-sm">Reproduzindo vídeo correspondente</p>
              <p className="text-xs opacity-75">{currentVideo.title}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Player de vídeo */}
      <Card className="overflow-hidden bg-black border-primary/20 shadow-glow">
        <div className="relative aspect-video">
          <video
            className="w-full h-full object-cover"
            src={currentVideo.url}
            poster={currentVideo.poster}
            controls
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Overlay de controles customizado */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova captura
            </Button>
          </div>
        </div>
      </Card>

      {/* Informações do vídeo */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <h4 className="text-lg font-semibold mb-2">Como funciona a magia? 🪄</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• IA analisa características únicas da foto impressa</p>
          <p>• Busca no banco de dados por vídeos correspondentes</p>
          <p>• Reproduz o conteúdo em realidade aumentada</p>
          <p>• Funciona offline após download inicial</p>
        </div>
      </Card>
    </div>
  );
};