

document.addEventListener('DOMContentLoaded', (event) => {
  const root = document.querySelector('#root');
  const button = document.createElement('button')
  const sourceSelect = document.getElementById('source_topic')
  const targetSelect = document.getElementById('target_topic')
  const transformationSelect = document.getElementById('transformation')

  let selectedSource = sourceSelect.value
  let selectedTarget = targetSelect.value
  let selectedTransformation = transformationSelect.value

  sourceSelect.addEventListener('change', function() {
    selectedSource = this.value
  });

  targetSelect.addEventListener('change', function() {
    selectedTarget = this.value
  });

  transformationSelect.addEventListener('change', function() {
    selectedTransformation = this.value
  });

  const createTransformation = (async () => {
    const body = {
      sourceTopic: selectedSource,
      targetTopic: selectedTarget,
      transformation: selectedTransformation
    }

    try {
      const response = await fetch('http://localhost:3000/create_transformation', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
    } catch (error) {
      console.error('Error:', error);
    }
  })

  button.addEventListener('click', createTransformation);

  button.append('Create transformation')

  root.append(button);
})


