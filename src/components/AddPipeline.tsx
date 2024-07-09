import { postPipeline } from '../utils/postPipeline';

const AddPipeline = ({ pipelines }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const sourceTopic = event.target.source_topic.value;
    const targetTopic = event.target.target_topic.value;
    const transformation = event.target.transformation.value;

    const handleRequest = async () => {
      postPipeline(sourceTopic, targetTopic, transformation);
    };

    handleRequest();
  };

  return (
    <div className='add-pipeline-form'>
      <h1>Add Pipeline</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='source_topic'>Source Topic:</label>
        <select name='source_topic' id='source_topic'>
          <option value='source_topic' id='source_topic'>
            Select a source topic
          </option>
          {pipelines.map(({ source_topic }) => (
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
          {pipelines.map(({ target_topic }) => (
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
          {pipelines.map(({ transformation_name }) => (
            <option
              key={transformation_name}
              value={transformation_name}
              id='transformation'
            >
              {transformation_name}
            </option>
          ))}
        </select>
        <button type='submit'>Add Pipeline</button>
      </form>
    </div>
  );
};

export default AddPipeline;
