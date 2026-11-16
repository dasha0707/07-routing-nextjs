import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { NewNote, Note, NoteTag } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}), // Never send 'all': API only accepts real tags.
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post('/notes', note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}
