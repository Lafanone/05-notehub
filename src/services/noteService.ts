import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export interface FetchNotesParams {
  page: number;
  perPage: number;
  keyword?: string;
}

export interface FetchNotesResponse {
  data: Note[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  category: string; 
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
  });
  return data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
    const { data } = await api.post<Note>('/notes', noteData);
    return data;
}

export const deleteNote = async (id: string): Promise<Note> => {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
}