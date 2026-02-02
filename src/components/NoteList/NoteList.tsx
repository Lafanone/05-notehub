import type { Note } from '../../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note._id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.category}</span>
            <button 
              className={styles.button} 
              onClick={() => onDelete(note._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;