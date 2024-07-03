import React from 'react';

const Modal = ({ show, onClose, connection }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className='modal-content'>
        <span className='modal-close' onClick={onClose}>
          &times;
        </span>
        <h1>{connection ? connection.join(' | ') : ''}</h1>
        <div className='schema-versioning-controls'>
          <button onClick={onClose}>Evolve Version</button>
          <button onClick={onClose}>Is Previous Version</button>
          <button onClick={onClose}>Is Deprecated Version</button>
        </div>{' '}
        <div className='test-events-container'>
          <button onClick={onClose}>Create Test Events</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
