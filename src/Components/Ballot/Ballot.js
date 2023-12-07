import React, {useEffect, useState} from "react";
import useBallotData from "../../Hooks/useBallotData";
import Modal from "../Modal/Modal";
import "./Ballot.css";

const Ballot = () => {
  const { ballotData, loading, error } = useBallotData();
  const [userId, setUserId] = useState('');
  const [modalOpen, setModalOpen] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [selectedNominees, setSelectedNominees] = useState({});

  useEffect(() => {
    // Check if userId is already stored in localStorage
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If no userId is stored, generate a new one and store it in localStorage
      const newUserId = crypto.randomUUID();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleNomineeSelection = (categoryId, nomineeId) => {
    setSelectedNominees((prevSelectedNominees) => ({
      ...prevSelectedNominees,
      [categoryId]: nomineeId,
    }));
  };

  const handleSubmitVote = async (e) => {
    e.preventDefault()
    let voteData = {
      userId,
      votes: Object.entries(selectedNominees).map(([categoryId, nomineeId]) => ({ categoryId, nomineeId })),
    }

    try {
      const response = await fetch('http://localhost:3000/submit-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });
      console.log(response.status)
      if (response.ok) {
        setSubmissionMessage("SUCCESS")
        setModalOpen(true)
        setSelectedNominees({});
      } if (response.status === 403) {
        setSubmissionMessage("ALREADY VOTED")
        setModalOpen(true)
      }else {
        console.error('Failed to submit vote:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }

  return (
    <div className="ballot">
      <h1>AWARDS 2021</h1>
      <Modal
        open={modalOpen}
        message={submissionMessage}
      />
      <form id="ballotForm" className="ballotForm">
        {ballotData?.items.map((category) => {
          return (
            <>
              <div key={category.id} className="category">
                <div className="category-title">
                  <span>{category.title}</span>
                </div>

                <div className="nominee-list">
                  {category.items.map((nominee) => {
                    return (
                      <div key={nominee.id} className={selectedNominees[category.id] === nominee.id ? "category-nominee-selected" : "category-nominee"}
                      onClick={() => handleNomineeSelection(category.id, nominee.id)}
                      >
                        <span>{nominee.title}</span>
                        <img
                          width={150}
                          height={222}
                          src={nominee.photoUrL}
                          alt={nominee.title}
                        />
                        <button
                          className="nominee-button"
                          onClick={() => handleNomineeSelection(category.id, nominee.id)}
                          disabled={selectedNominees[category.id] === nominee.id}
                          >
                          Nominate
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })}

        <button type="submit" onClick={handleSubmitVote}>
          Submit Ballot
        </button>
      </form>

    </div>
  );
};

export default Ballot;
