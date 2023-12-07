import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './Modal.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    height: '400px',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const BallotSubmissionModal  = ({message, open}) => {
  const [modalIsOpen, setIsOpen] = useState(open);
  console.log(modalIsOpen)

  useEffect(() => {
    setIsOpen(open)
  }, [open, message])

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className='modal'>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 className='modal-message'>{message}</h2>
        <button className='modal-close-button' onClick={closeModal}>X</button>
      </Modal>
    </div>
  );
};

export default BallotSubmissionModal;
