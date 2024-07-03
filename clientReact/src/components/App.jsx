import React, { useState, useEffect } from 'react';
import '../App.css';
import { getConnections } from '../utils/getEntities';
import { putConnection } from '../utils/putConnections';
import Modal from './Modal';
import Sidebar from './Sidebar';
import AddConnection from './AddConnection';

function App() {
  const [connections, setConnections] = useState([]);
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connectionAlterations, setConnectionAlterations] = useState(0);
  const [mainContent, setMainContent] = useState('connections');

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
    };

    request();
  }

  function showConfirmPause(connectionId, activeState) {
    if (
      window.confirm(
        `Are you sure you want to pause connection ${connectionId}?`
      )
    ) {
      pauseConnection(connectionId, activeState);
    }
  }

  return (
    <>
      <Sidebar setMainContent={setMainContent} />
      {mainContent === 'connections' ? (
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
                    <a
                      onClick={() =>
                        showConfirmPause(connection.id, connection.active_state)
                      }
                    >
                      <img src='../pause.png' alt='Pause' />
                    </a>
                  </td>
                  {/* <td>
                  <img src='../public/bin.png' alt='Delete' />
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <AddConnection connections={connections} />
      )}

      <Modal
        show={modalDisplayed}
        onClose={() => setModalDisplayed(false)}
        connection={selectedConnection}
      ></Modal>
    </>
  );
}

export default App;
