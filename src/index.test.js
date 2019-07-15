import * as utils from './utils';
import cfwJwt from '@sagi.io/cfw-jwt';
import { PubSubREST } from './index';

jest.mock('./utils');
jest.mock('./topics');
jest.mock('@sagi.io/cfw-jwt');

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
      helpers: { createPubSubMessage: utils.createPubSubMessage },
    });

    expect(cfwJwt.getTokenFromGCPServiceAccount).toHaveBeenCalledWith({
      aud: 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher',
      cryptoImpl: null,
      serviceAccountJSON,
    });
    expect(utils.setGlobals).toHaveBeenCalled();
  });
});
