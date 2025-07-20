import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import axios from 'axios';
import api from '../lib/axios';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(true);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        console.log(res.data);
        setNotes(res.data || []); 
        setIsRateLimited(false);
      } catch (error) {
        console.log('Error fetching notes:', error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to fetch notes. Please try again later.");
        }
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
  <div className='min-h-screen'>
    <Navbar />
    {isRateLimited && <RateLimitedUI />}
    
    <div className='max-w-7xl p-4 mt-6'>
      {isLoading && (
        <div className='text-center text-primary py-10'>
          Loading notes...
        </div>
      )}
      {notes.length === 0 && !isRateLimited && <NotesNotFound/>}
      {notes.length > 0 && !isRateLimited && (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} setNotes={setNotes} />
        ))}
      </div>) }
    </div>
  </div>
); };

export default HomePage;