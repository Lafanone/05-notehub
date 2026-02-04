import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styles from './NoteForm.module.css';
import type { CreateNoteParams } from '../../services/noteService';

interface NoteFormProps {
    onSubmit: (note: CreateNoteParams) => void;
    onCancel: () => void;
}

interface FormValues {
    title: string;
    content: string;
    tag: string;
}

const initialValues: FormValues = {
    title: '',
    content: '',
    tag: 'Todo',
}

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters')
        .required('Title is required'),
        content: Yup.string()
    .max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

const NoteForm = ({ onSubmit, onCancel }: NoteFormProps) => {
    const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        onSubmit({
            title: values.title,
            content: values.content,
            category: values.tag,
        });
        resetForm();
    };

    return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <Field 
            id="title" 
            type="text" 
            name="title" 
            className={styles.input} 
          />
          <ErrorMessage name="title" component="span" className={styles.error} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={styles.textarea}
          />
          <ErrorMessage name="content" component="span" className={styles.error} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={styles.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={styles.error} />
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
