import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PhotoVideoDatabase, PhotoVideoEntry } from '@/services/PhotoVideoDatabase';
import { Upload, Trash2, Eye, Video, Image } from 'lucide-react';

export const AdminPanel = () => {
  const [entries, setEntries] = useState<PhotoVideoEntry[]>(PhotoVideoDatabase.getAllEntries());
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photoFile: null as File | null,
    videoFile: null as File | null
  });
  const { toast } = useToast();

  const handleFileChange = (type: 'photo' | 'video') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        [`${type}File`]: file 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.photoFile || !formData.videoFile || !formData.name) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Converter arquivos para URLs (simulação - em produção seria upload real)
      const photoUrl = URL.createObjectURL(formData.photoFile);
      const videoUrl = URL.createObjectURL(formData.videoFile);

      const newEntry = PhotoVideoDatabase.saveEntry({
        name: formData.name,
        description: formData.description,
        photoUrl,
        videoUrl
      });

      setEntries(PhotoVideoDatabase.getAllEntries());
      setFormData({ name: '', description: '', photoFile: null, videoFile: null });
      setIsAdding(false);
      
      toast({
        title: "Sucesso!",
        description: `${formData.name} cadastrado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar entrada",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    if (PhotoVideoDatabase.deleteEntry(id)) {
      setEntries(PhotoVideoDatabase.getAllEntries());
      toast({
        title: "Deletado",
        description: "Entrada removida com sucesso",
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza que deseja limpar toda a base de dados?')) {
      PhotoVideoDatabase.clearAll();
      setEntries([]);
      toast({
        title: "Base limpa",
        description: "Todas as entradas foram removidas",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie fotos e vídeos correspondentes</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-gradient-primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isAdding ? 'Cancelar' : 'Adicionar Nova'}
          </Button>
          
          {entries.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Tudo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de adição */}
        {isAdding && (
          <Card className="lg:col-span-1 p-6 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Capa Revista Veja Jan/2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o conteúdo..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="photo">Foto de Referência *</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange('photo')}
                  required
                />
                {formData.photoFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    📷 {formData.photoFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="video">Vídeo Correspondente *</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange('video')}
                  required
                />
                {formData.videoFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    🎬 {formData.videoFile.name}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                <Upload className="w-4 h-4 mr-2" />
                Cadastrar
              </Button>
            </form>
          </Card>
        )}

        {/* Lista de entradas */}
        <div className={`${isAdding ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Entradas Cadastradas ({entries.length})
            </h2>
          </div>

          {entries.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2 border-primary/20">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma entrada cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando sua primeira foto + vídeo
              </p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-gradient-primary"
              >
                Adicionar Primeira Entrada
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden border-primary/20">
                  <div className="aspect-video relative bg-gradient-bg">
                    <img
                      src={entry.photoUrl}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="bg-primary/20 backdrop-blur-sm rounded-full p-1">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-accent/20 backdrop-blur-sm rounded-full p-1">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {entry.name}
                    </h3>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {entry.createdAt.toLocaleDateString()}
                      </span>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(entry.videoUrl, '_blank')}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};