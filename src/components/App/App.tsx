import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import styles from './App.module.css';
import { fetchNotes, createNote, deleteNote, type CreateNoteParams } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader'; 
import Error from '../Error/Error';   

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
        search: searchQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); 
  }, 300);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>

        <SearchBox onSearch={handleSearch} />

        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </header>

      {isError && <Error />}
      {isLoading && <Loader />}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {!isLoading && !isError && notes.length === 0 && (
         <p style={{ textAlign: 'center', marginTop: '20px' }}>
           No notes found. Create one!
         </p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onSubmit={handleAddNote} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default App;