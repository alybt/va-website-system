// frontend/src/pages/DubbingPage.jsx

import { useState } from "react";
import { useActors }         from "../hooks/useActors";
import { useCharacters }     from "../hooks/useCharacters";
import { useSequentialArt }  from "../hooks/useSequentialArt";
import ActorPool             from "../components/dubbing/ActorPool";
import ParticipatingRoster   from "../components/dubbing/ParticipatingRoster";
import ArtSelector           from "../components/dubbing/ArtSelector";
import styles from "./DubbingPage.module.css";

export default function DubbingPage() { 
  
  const {
    actors,
    loading: actorsLoading,
    error:   actorsError,
    deleteActor,
    updateActor,
  } = useActors();

  const {
    artList,
    loading: artLoading,
    error:   artError,
  } = useSequentialArt();

  const [selectedArtId, setSelectedArtId] = useState(null);

  const {
    characters,
    loading: charsLoading,
    error:   charsError,
  } = useCharacters(
    selectedArtId ? "art" : "all",
    selectedArtId ?? undefined
  );

  const [participatingIds, setParticipatingIds] = useState(new Set());

  const [assignments, setAssignments] = useState({});
  const [dragOverId,  setDragOverId]  = useState(null);

  const selectedArt   = artList.find(a => a.art_id === selectedArtId) ?? null;
  const assignedCount = Object.keys(assignments).length;
  const totalCount    = characters.length;

  const handleAddParticipant = (actorId) => {
    setParticipatingIds(prev => new Set([...prev, actorId]));
  };

  const handleRemoveParticipant = (actorId) => {
    setParticipatingIds(prev => {
      const next = new Set(prev);
      next.delete(actorId);
      return next;
    });

    setAssignments(prev => {
      const next = { ...prev };
      Object.entries(next).forEach(([charId, aId]) => {
        if (aId === actorId) delete next[charId];
      });
      return next;
    });
  };

  const handleSelectArt = (artId) => {
    setSelectedArtId(artId);
    setAssignments({});
  };

  const handleAssign = (characterId, actorId) => {
    setParticipatingIds(prev => new Set([...prev, actorId]));
    setAssignments(prev => ({ ...prev, [characterId]: actorId }));
  };

  const handleUnassign = (characterId) => {
    setAssignments(prev => {
      const next = { ...prev };
      delete next[characterId];
      return next;
    });
  };

  const handleClearAll = () => setAssignments({});

  return (
    <div className={`app-container ${styles.page}`}>

      <div className={styles.header}>
        <h1 className={styles.title}>Dubbing Session</h1>
        <p className={styles.subtitle}>
          Build your roster, then assign actors to character roles
        </p>
      </div>

      <div className={styles.layout}>

        <div className={styles.leftCol}>
          <ActorPool
            actors={actors}
            loading={actorsLoading}
            error={actorsError}
            participatingIds={participatingIds}
          />

          <ParticipatingRoster
            actors={actors}
            participatingIds={participatingIds}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
          />
        </div>

        <div className={styles.rightCol}>
          <ArtSelector
            artList={artList}
            artLoading={artLoading}
            artError={artError}
            selectedArtId={selectedArtId}
            onSelectArt={handleSelectArt}
            selectedArt={selectedArt}
            characters={characters}
            charsLoading={charsLoading}
            charsError={charsError}
            actors={actors}
            assignments={assignments}
            assignedCount={assignedCount}
            totalCount={totalCount}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            onClearAll={handleClearAll}
            dragOverId={dragOverId}
            setDragOverId={setDragOverId}
          />
        </div>

      </div>
    </div>
  );
}