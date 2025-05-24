// components/EditTopicModal.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import EditTopicForm from './EditTopicForm';

export default function EditTopicModal({ id, onClose }) {
  const [topic, setTopic] = useState(null);
  const modalRef = useRef();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch topic');
        const data = await res.json();
        setTopic(data.topic);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchTopic();
  }, [id]);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-[600px] max-w-full relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        {/* Edit Form */}
        {topic ? (
          <EditTopicForm {...topic} id={id} onClose = {onClose} />
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}
