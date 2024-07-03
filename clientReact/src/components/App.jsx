import React, { useState, useEffect } from 'react';
import '../App.css';
import { getConnections } from '../utils/getEntities';
import { putConnection } from '../utils/putConnections';
import Modal from './Modal';

function App() {
  const [connections, setConnections] = useState([]);
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connectionAlterations, setConnectionAlterations] = useState(0);

  useEffect(() => {
    getConnections()
      .then((rows) => {
        setConnections(rows);
      })
      .catch(console.error);
  }, [connectionAlterations]);

  const toggleModal = (connection) => {
    setSelectedConnection(Object.values(connection));
    setModalDisplayed((prev) => !prev);
  };

  function pauseConnection(connectionId, activeState) {
    const request = async () => {
      const result = await putConnection(connectionId, !activeState);
      setConnectionAlterations((prev) => prev + 1);
      return result;
    }

    request();
  }

  function showConfirmPause(connectionId, activeState) {
    if (window.confirm(`Are you sure you want to pause connection ${connectionId}?`)) {
      pauseConnection(connectionId, activeState);
    }
  }

  return (
    <>
      <div className='connections-table'>
        <h1>Connections</h1>
        <table>
          <thead>
            <tr>
              <th>Source Topic</th>
              <th>Target Topic</th>
              <th>Transformation Name</th>
              <th>Pause</th>
              {/* <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {connections.map((connection) => (
              <tr id={connection.id} key={connection.source_topic}>
                <td>
                  <a onClick={() => toggleModal(connection)}>
                    {connection.source_topic}
                  </a>
                </td>
                <td>
                  <a onClick={() => toggleModal(connection)}>
                    {connection.target_topic}
                  </a>
                </td>
                <td>
                  <a onClick={() => toggleModal(connection)}>
                    {connection.transformation_name}
                  </a>
                </td>
                <td>
                  <a onClick={() => showConfirmPause(connection.id, connection.active_state)}><img src='../public/pause.png' alt='Pause' /></a>
                </td>
                {/* <td>
                  <img src='../public/bin.png' alt='Delete' />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={modalDisplayed}
        onClose={() => setModalDisplayed(false)}
        connection={selectedConnection}
      >
        {selectedConnection && (
          <div>
            <h2>Connection Details</h2>
            <p>Source Topic: {selectedConnection.source_topic}</p>
            <p>Target Topic: {selectedConnection.target_topic}</p>
            <p>Transformation Name: {selectedConnection.transformation_name}</p>
          </div>
        )}
      </Modal>
    </>
  );
}

export default App;
