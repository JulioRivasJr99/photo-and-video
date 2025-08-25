import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, AlertCircle } from 'lucide-react';
import { PhotoVideoDatabase, PhotoVideoEntry } from '@/services/PhotoVideoDatabase';

interface VideoPlayerProps {
  detectedImage: string;
  onBack: () => void;
}

export const VideoPlayer = ({ detectedImage, onBack }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchedEntry, setMatchedEntry] = useState<PhotoVideoEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findMatch = async () => {
      setIsLoading(true);
      console.log('Buscando match para imagem detectada...');
      
      // Busca na base de dados real
      const match = PhotoVideoDatabase.findMatchingEntry(detectedImage);
      
      if (match) {
        console.log('Match encontrado na base:', match.name);
        setMatchedEntry(match);
      } else {
        console.log('Nenhum match encontrado, usando vídeo fallback');
        // Fallback para vídeos de exemplo se não encontrar match
        const fallbackVideos = [
          {
            id: 'fallback',
            name: "Vídeo de Demonstração",
            description: "Nenhum match encontrado na base - vídeo de exemplo",
            photoUrl: detectedImage,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            createdAt: new Date()
          }
        ];
        setMatchedEntry(fallbackVideos[0] as PhotoVideoEntry);
      }
      
      setIsLoading(false);
    };

    findMatch();
  }, [detectedImage]);

  if (isLoading) {
    return (
      <Card className="p-8 text-center border-primary/20">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <RotateCcw className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Processando imagem...</h3>
        <p className="text-muted-foreground">Buscando vídeo correspondente na base de dados</p>
      </Card>
    );
  }

  if (!matchedEntry) {
    return (
      <Card className="p-8 text-center border-destructive/20">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum match encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Esta foto não está cadastrada na base de dados
        </p>
        <Button onClick={onBack} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Imagem detectada */}
      <Card className="overflow-hidden border-primary/20">
        <div className="p-4 bg-gradient-hero">
          <h3 className="text-lg font-semibold text-white mb-2">
            ✅ Match encontrado na base!
          </h3>
          <div className="flex items-center space-x-4">
            <img 
              src={detectedImage} 
              alt="Imagem detectada" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-white/20"
            />
            <div className="text-white/90">
              <p className="text-sm font-semibold">{matchedEntry.name}</p>
              <p className="text-xs opacity-75">{matchedEntry.description || 'Reproduzindo vídeo correspondente'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Player de vídeo */}
      <Card className="overflow-hidden bg-black border-primary/20 shadow-glow">
        <div className="relative aspect-video">
          <video
            className="w-full h-full object-cover"
            src={matchedEntry.videoUrl}
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