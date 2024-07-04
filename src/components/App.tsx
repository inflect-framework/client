import { useState, useEffect } from 'react';
import '../App.css';
import { getConnections } from '../utils/getEntities';
import { putConnection } from '../utils/putConnections';
import Modal from './Modal';
import Sidebar from './Sidebar';
import AddConnection from './AddConnection';
import { Connection } from '../types/connection';

function App() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<
    [string, string, string, boolean, number] | null
  >(null);
  const [connectionAlterations, setConnectionAlterations] = useState(0);
  const [mainContent, setMainContent] = useState('connections');

  useEffect(() => {
    getConnections()
      .then((rows: Connection[]) => {
        setConnections(rows);
      })
      .catch(console.error);
  }, [connectionAlterations]);

  // id: number;
  // sourceTopic: string;
  // targetTopic: string;
  // transformation: string;
  // connectionActiveState: boolean;

  const toggleModal = (connection: Connection) => {
    setSelectedConnection(
      Object.values(connection) as [string, string, string, boolean, number]
    );
    setModalDisplayed((prev) => !prev);
  };

  function pauseConnection(connectionId: number, activeState: boolean) {
    const request = async () => {
      const result = await putConnection(connectionId, !activeState);
      setConnectionAlterations((prev) => prev + 1);
      return result;
    };

    request();
  }

  function showConfirmPause(connectionId: number, activeState: boolean) {
    if (
      window.confirm(
        `Are you sure you want to ${
          activeState ? 'pause' : 'restart'
        } connection ${connectionId}?`
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
              {connections.map((connection: Connection) => (
                <tr id={connection.id.toString()} key={connection.source_topic}>
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
                      {connection.active_state ? (
                        <img src='../icons/pause.svg' alt='Pause' />
                      ) : (
                        <img src='../icons/play.svg' alt='Play' />
                      )}
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
        connection={
          selectedConnection as [string, string, string, boolean, number]
        }
      ></Modal>
    </>
  );
}

export default App;
