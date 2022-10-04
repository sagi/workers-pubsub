export declare type ServiceAccountCredentials = {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
};

export declare type PubSubMessage = {
    data?: string;
    attributes?: Record<string, string>;
    ordering_key?: string;
};

export declare type PubSubAPI = {
    topics: {
        list: () => Promise<{
            name: string;
        }[]>;
        get: (options: {
            topic: string;
        }) => Promise<{
            name: string;
        }>;
        publish: (options: {
            topic: string;
            messages: PubSubMessage[];
        }) => Promise<unknown>;
    };
    helpers: {
        createPubSubMessage: ({ message, attributes, ordering_key, }?: {
            message?: string | null;
            attributes?: Record<string, string> | null;
            ordering_key?: string | null;
        }) => PubSubMessage;
        headers: Record<string, string>;
    };
}


export default function PubSubREST({ serviceAccountJSON, cryptoImpl, fetchImpl, }: {
    serviceAccountJSON: ServiceAccountCredentials;
    cryptoImpl?: globalThis.Crypto;
    fetchImpl?: typeof fetch;
}): Promise<PubSubAPI>
