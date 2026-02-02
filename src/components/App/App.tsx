import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Імпорт хука
import styles from './App.module.css';
import { fetchNotes, createNote, deleteNote, type CreateNoteParams } from '../../services/noteService';

import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';


const App = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PER_PAGE = 6;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        keyword: searchQuery,
      }),
    placeholderData: keepPreviousData,
  });;

  const notes = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleAddNote = async (noteData: CreateNoteParams) => {
    try {
      await createNote(noteData);
      setIsModalOpen(false);
      setPage(1);
      refetch();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      refetch();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        
        <button 
          className={styles.addButton} 
          onClick={() => setIsModalOpen(true)}
        >
          Create Note
        </button>
      </header>

      {isError && <p>Error loading notes...</p>}

      {isLoading && <p>Loading...</p>}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {!isLoading && !isError && notes.length === 0 && (
         <p>No notes found. Create one!</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onSubmit={handleAddNote} />
      </Modal>
    </div>
  );
};

export default App;