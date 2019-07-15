import * as topics from './topics';
import '@sagi.io/globalthis';

describe('topics', () => {
  const projectId = 'CAFEBABE';
  const token = 'DEADBEEF';
  const headers = { Authorization: `Bearer ${token}` };
  const baseUrl = `https://pubsub.googleapis.com/v1`;
  const baseInputs = { projectId, headers, baseUrl };

  const fetchJSON = jest.fn();
  globalThis.fetch = jest.fn(() => ({ json: fetchJSON }));

  beforeEach(() => {
    fetchJSON.mockClear();
    globalThis.fetch.mockClear();
  });

  test('list', async () => {
    const expectedTopics = [
      { name: `projects/${projectId}/topics/topic1` },
      { name: `projects/${projectId}/topics/topic2` },
    ];

    const responseJSON = {
      topics: expectedTopics,
    };
    fetchJSON.mockReturnValueOnce(responseJSON);

    await expect(topics.list(baseInputs)()).resolves.toEqual(expectedTopics);

    const expectedFetchUrl = `https://pubsub.googleapis.com/v1/projects/CAFEBABE/topics`;
    const exectedFetchOptions = {
      headers: { Authorization: `Bearer DEADBEEF` },
      method: 'GET',
    };
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expectedFetchUrl,
      exectedFetchOptions
    );
  });

  test('publish', async () => {
    const msg1 = {
      attributes: {
        type: 'slack-poll',
      },
      data: 'YWJjZGVmZw',
    };
    const msg2 = {
      data: 'YWJjZGVmZw',
    };
    const messages = [msg1, msg2];
    const topic = 'topic-123';

    await topics.publish(baseInputs)({ topic, messages });

    const expectedFetchUrl = `https://pubsub.googleapis.com/v1/projects/CAFEBABE/topics/${topic}:publish`;
    const exectedFetchOptions = {
      headers: { Authorization: `Bearer DEADBEEF` },
      method: 'POST',
      body: JSON.stringify({ messages }),
    };
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expectedFetchUrl,
      exectedFetchOptions
    );
    expect(fetchJSON).toHaveBeenCalled();
  });

  test('get', async () => {
    const topic = 'bla-topic';
    const expectedTopicConfig = {
      name: `projects/${projectId}/topics/${topic}`,
    };

    const responseJSON = expectedTopicConfig;
    fetchJSON.mockReturnValueOnce(responseJSON);

    await expect(topics.get(baseInputs)({ topic })).resolves.toEqual(
      expectedTopicConfig
    );
    const expectedFetchUrl = `https://pubsub.googleapis.com/v1/projects/CAFEBABE/topics/bla-topic`;
    const exectedFetchOptions = {
      headers: { Authorization: `Bearer DEADBEEF` },
      method: 'GET',
    };
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expectedFetchUrl,
      exectedFetchOptions
    );
  });
});
