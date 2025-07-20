import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import { formatDate } from '../lib/utils'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const NoteCard = ({ note, setNotes }) => {
    console.log('timestamp value:', note.timestamp, typeof note.timestamp);
    
    const handleDelete = async (e,_id) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }
        try {
            await api.delete(`/notes/${_id}`);
            setNotes(prevNotes => prevNotes.filter(note => note._id !== _id));
            toast.success('Note deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting note:', error);
            if (error.response && error.response.status === 429) {
                toast.error("Slow down! You're deleting notes too fast", { duration: 4000, icon: '🚨' });
            } else {
                toast.error("Failed to delete note. Please try again later.");
            }
        }
    }

    return (
        <Link to={`/note/${note._id}`} className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]">
            <div className='card-body'>
                <h3 className='card-title text-base-content'>{note.title}</h3>
                <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
                <div className='card-actions justify-between items-center mt-4'>
                    <span className='text-sm text-base-content/60'>{formatDate(note.timestamp)}</span>
                    <div className='flex items-center gap-1'>
                        <PenSquareIcon className='size-4' />
                        <button
                            className='btn btn-ghost btn-xs text-error'
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(e, note._id);
                            }}
                            type="button"
                        >
                            <Trash2Icon className='size-4' />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default NoteCard