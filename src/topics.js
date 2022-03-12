export const list = (baseInputs) => async () => {
  const { headers, projectId, baseUrl } = baseInputs;
  const method = 'GET';
  const url = `${baseUrl}/projects/${projectId}/topics`;
  const response = await fetch(url, { method, headers });
  const { topics } = await response.json();
  return topics;
};

export const get =
  (baseInputs) =>
  async ({ topic }) => {
    const { headers, projectId, baseUrl } = baseInputs;
    const method = 'GET';
    const url = `${baseUrl}/projects/${projectId}/topics/${topic}`;
    const response = await fetch(url, { method, headers });
    return await response.json();
  };

export const publish =
  (baseInputs) =>
  async ({ topic, messages }) => {
    const { headers, projectId, baseUrl } = baseInputs;

    const method = 'POST';
    const url = `${baseUrl}/projects/${projectId}/topics/${topic}:publish`;
    const bodyJSON = { messages };
    const body = JSON.stringify(bodyJSON);

    const response = await fetch(url, { method, headers, body });
    return await response.json();
  };
