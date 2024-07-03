export const getConnections = () => {
  const mockQueryResult = {
    rows: [
      {
        transformation_name: 'capitalize',
        source_topic: 'source_topic',
        target_topic: 'target_topic',
      },
      {
        transformation_name: 'transformation 2',
        source_topic: 'topic 2',
        target_topic: 'topic 2',
      },
      {
        transformation_name: 'transformation 3',
        source_topic: 'topic 3',
        target_topic: 'topic 3',
      },
      {
        transformation_name: 'transformation 4',
        source_topic: 'topic 4',
        target_topic: 'topic 4',
      },
      {
        transformation_name: 'transformation 5',
        source_topic: 'topic 5',
        target_topic: 'topic 5',
      },
      {
        transformation_name: 'transformation 6',
        source_topic: 'topic 6',
        target_topic: 'topic 6',
      },
      {
        transformation_name: 'transformation 7',
        source_topic: 'topic 7',
        target_topic: 'topic 7',
      },
      {
        transformation_name: 'transformation 8',
        source_topic: 'topic 8',
        target_topic: 'topic 8',
      },
      {
        transformation_name: 'transformation 9',
        source_topic: 'topic 9',
        target_topic: 'topic 9',
      },
      {
        transformation_name: 'transformation 10',
        source_topic: 'topic 10',
        target_topic: 'topic 10',
      },
    ],
  };

  return Promise.resolve(mockQueryResult);
};
