export const cognitoConfig = {
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_foo",
            userPoolClientId: "id123",
            // Login options (optional)
            loginWith: {
                username: true,
                email: false,
                phone: false,
            },
            mfaConfiguration: "OFF",
            passwordProtectionSettings: {
                minLength: 8,
            },
            verificationMechanisms: ["EMAIL"],
        }
    }
};
