import { apiGateway } from "./apiGateway";
import { cognitoConfig } from "./cognito";

export const config = {
    ...apiGateway,
    ...cognitoConfig
};