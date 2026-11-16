import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { NoteTag } from '@/types/note';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  if (slug.length !== 1) notFound();

  const selectedTag = slug[0];
  if (selectedTag !== 'all' && !tags.includes(selectedTag as NoteTag)) {
    notFound();
  }

  const tag = selectedTag === 'all' ? undefined : (selectedTag as NoteTag);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
