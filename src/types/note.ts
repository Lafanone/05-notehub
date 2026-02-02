export interface Note {
  _id: string; 
  title: string;
  content: string;
  category: string; 
  createdAt: string;
  updatedAt: string;
}

export interface NoteTag{
  id: string;
  name: string;
  color: string;
}