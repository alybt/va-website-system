import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ScriptCard from '../components/ScriptCard';

const ScriptsPage = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const currentUserId = 1; 

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await api.get(`/scripts?user_id=${currentUserId}`);
        setScripts(response.data);
      } catch (err) {
        console.error("Failed to fetch scripts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading scripts...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Script Library</h1>
      <div className="flex flex-wrap gap-6">
        {scripts.length > 0 ? (
          scripts.map(script => (
            <ScriptCard 
              key={script.script_id} 
              script={script} 
              userId={currentUserId} 
            />
          ))
        ) : (
          <p>No scripts found.</p>
        )}
      </div>
    </div>
  );
};

export default ScriptsPage;