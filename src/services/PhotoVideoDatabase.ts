export interface PhotoVideoEntry {
  id: string;
  name: string;
  photoUrl: string;
  videoUrl: string;
  description: string;
  createdAt: Date;
}

export class PhotoVideoDatabase {
  private static readonly STORAGE_KEY = 'photo_video_database';

  static saveEntry(entry: Omit<PhotoVideoEntry, 'id' | 'createdAt'>): PhotoVideoEntry {
    const entries = this.getAllEntries();
    const newEntry: PhotoVideoEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    entries.push(newEntry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    console.log('Entrada salva:', newEntry);
    return newEntry;
  }

  static getAllEntries(): PhotoVideoEntry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const entries = JSON.parse(stored);
      return entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      }));
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      return [];
    }
  }

  static deleteEntry(id: string): boolean {
    const entries = this.getAllEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    
    if (filtered.length !== entries.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      console.log('Entrada deletada:', id);
      return true;
    }
    return false;
  }

  static findMatchingEntry(photoUrl: string): PhotoVideoEntry | null {
    const entries = this.getAllEntries();
    console.log('Procurando match para foto. Total de entradas:', entries.length);
    
    // Por enquanto, retorna a primeira entrada para demonstração
    // Em produção, aqui seria feita comparação visual real
    if (entries.length > 0) {
      console.log('Match encontrado:', entries[0]);
      return entries[0];
    }
    
    console.log('Nenhum match encontrado');
    return null;
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Base de dados limpa');
  }
}