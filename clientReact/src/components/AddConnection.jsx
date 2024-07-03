import { postConnection } from '../utils/postConnection';

const AddConnection = ({ connections }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const sourceTopic = event.target.source_topic.value;
    const targetTopic = event.target.target_topic.value;
    const transformation = event.target.transformation.value;

    const handleRequest = async () => {
      postConnection(sourceTopic, targetTopic, transformation);
    };

    handleRequest();
  };

  return (
    <div className='add-connection-form'>
      <h1>Add Connection</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='source_topic'>Source Topic:</label>
        <select name='source_topic' id='source_topic'>
          <option value='source_topic' id='source_topic'>
            Select a source topic
          </option>
          {connections.map(({ source_topic }) => (
            <option key={source_topic} value={source_topic} id='source_topic'>
              {source_topic}
            </option>
          ))}
        </select>
        <label htmlFor='target_topic'>Target Topic:</label>
        <select name='target_topic' id='target_topic'>
          <option value='target_topic' id='target_topic'>
            Select a target topic
          </option>
          {connections.map(({ target_topic }) => (
            <option key={target_topic} value={target_topic} id='target_topic'>
              {target_topic}
            </option>
          ))}
        </select>
        <label htmlFor='transformation'>Transformation Name:</label>
        <select name='transformation' id='transformation'>
          <option value='capitalize' id='transformation'>
            Select a transformation
          </option>
          {connections.map(({ transformation_name }) => (
            <option
              key={transformation_name}
              value={transformation_name}
              id='transformation'
            >
              {transformation_name}
            </option>
          ))}
        </select>
        <button type='submit'>Add Connection</button>
      </form>
    </div>
  );
};

export default AddConnection;
