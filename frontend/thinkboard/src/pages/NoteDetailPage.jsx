import { ArrowLeft, Trash2, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const NoteDetailPage = () => {
    const [note, setNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await api.get(`/notes/${id}`);
                setNote(response.data);
            } catch (error) {
                console.error('Error fetching note:', error);
                toast.error("Failed to fetch note. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleSave = async () => {
        if (!note || !note.title || !note.content) {
            toast.error('All fields are required');
            return;
        }
        setSaving(true);
        try {
            await api.put(`/notes/${id}`, { title: note.title, content: note.content });
            toast.success('Note updated successfully');
            navigate('/');
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error("Failed to update note. Please try again later.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }
        try {
            await api.delete(`/notes/${id}`);
            toast.success('Note deleted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error deleting note:', error);
            if (error.response && error.response.status === 429) {
                toast.error("Slow down! You're deleting notes too fast", { duration: 4000, icon: '🚨' });
            } else {
                toast.error("Failed to delete note. Please try again later.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-base-200 flex items-center justify-center'>
                <Loader className='size-10 animate-spin' />
                <span className='ml-2'>Loading...</span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-base-200'>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className='flex items-center justify-between mb-6'>
                        <Link to="/" className="btn btn-ghost">
                            <ArrowLeft className='size-5'/> Back to Notes
                        </Link>
                        <button onClick={handleDelete} className="btn btn-error btn-outline">
                            <Trash2 className='size-5'/> Delete Note
                        </button>
                    </div>
                    {note && (
                        <div className='card bg-base-100'>
                            <div className='card-body'>
                                <div className='form-control mb-4'>
                                    <label className='label'>
                                        <span className='label-text'>Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        className='input input-bordered'
                                        value={note.title}
                                        onChange={(e) => setNote({...note, title: e.target.value})}
                                    />
                                </div>

                                <div className='form-control mb-4'>
                                    <label className='label'>
                                        <span className='label-text'>Content</span>
                                    </label>
                                    <textarea
                                        className='textarea textarea-bordered h-32'
                                        value={note.content}
                                        onChange={(e) => setNote({...note, content: e.target.value})}
                                    />
                                </div>

                                <div className='card-actions justify-end'>
                                    <button 
                                        className='btn btn-primary' 
                                        disabled={saving} 
                                        onClick={handleSave}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteDetailPage;