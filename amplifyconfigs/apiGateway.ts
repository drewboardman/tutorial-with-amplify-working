export const apiGateWayName = "lambdafoo";

export const apiGateway = {
    API: {
        REST: {
            [apiGateWayName]: {
                // endpoint: process.env.REACT_APP_API_GATEWAY_URI,
                endpoint: 'foo',
                region: 'us-east-1' // Optional
            }
        }
    }
}
