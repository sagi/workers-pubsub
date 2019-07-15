export const list = baseInputs => async () => {
  const { headers, projectId, baseUrl } = baseInputs;
  const method = 'GET';
  const url = `${baseUrl}/projects/${projectId}/topics`;
  const response = await fetch(url, { method, headers });
  const { topics } = await response.json();
  return topics;
};

export const publish = baseInputs => async ({ topic }) => {
  const { headers, projectId, baseUrl } = baseInputs;

  const method = 'POST';
  const url = `${baseUrl}/projects/${projectId}/topics/${topic}:publish`;
  const data = Buffer.from('hey hey').toString('base64');
  const bodyJSON = {
    messages: [
      {
        data,
        messageId: '12',
        publishTime: new Date().toISOString(),
      },
    ],
  };
  const body = JSON.stringify(bodyJSON);

  const response = await fetch(url, { method, headers, body });
  const resBody = await response.text();
  return resBody;
};

export const get = baseInputs => async ({ topic }) => {
  const { headers, projectId, baseUrl } = baseInputs;
  const method = 'GET';
  const url = `${baseUrl}/projects/${projectId}/topics/${topic}`;
  const response = await fetch(url, { method, headers });
  const x = await response.json();
  return x;
};
