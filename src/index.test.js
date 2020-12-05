import * as utils from './utils';
import cfwJwt from '@sagi.io/workers-jwt';
import PubSubREST from './index';

jest.mock('./utils');
jest.mock('./topics');
jest.mock('@sagi.io/workers-jwt');

describe('index', () => {
  test('PubSubREST', async () => {
    const projectId = 'proj-123';
    const token = 'DEADBEEF';
    const serviceAccountJSON = { project_id: projectId };

    cfwJwt.getTokenFromGCPServiceAccount.mockReturnValueOnce(token);
    const mockedTopics = { list: jest.fn(), publish: jest.fn() };
    utils.injectBaseInputs.mockReturnValueOnce(mockedTopics);
    await expect(PubSubREST({ serviceAccountJSON })).resolves.toEqual({
      topics: mockedTopics,
      helpers: {
        createPubSubMessage: utils.createPubSubMessage,
        headers: {
          Authorization: 'Bearer DEADBEEF',
        },
      },
    });

    expect(cfwJwt.getTokenFromGCPServiceAccount).toHaveBeenCalledWith({
      aud: 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
      cryptoImpl: null,
      serviceAccountJSON,
    });
    expect(utils.setGlobals).toHaveBeenCalled();
  });
});
