import { CognitoIdentityProviderClient, ConfirmSignUpCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { RegisterReq } from "../../Models/register/user-register";
import { RegisterRepo } from "../../user Repo/register/register.repo";

export class RegisterService {
    private registerRepo = new RegisterRepo();
    private cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });

    public async Register(data: RegisterReq): Promise<any> {
        try {
            // Validate data
            if (!data.email || !data.password || !data.name) {
                throw new Error("Missing required registration fields: email, password, name");
            }

            // Save the registration data to your repository
            const register = await this.registerRepo.CreateRegister(data);


            const clientId = "1a5pfcpdbkmv8b9a9ti7lao6sl"; // Replace with your actual Cognito Client ID


            console.log(`Calculated secret hash for ${data.email}`); // Log the secret hash for debugging

            // Create the SignUpCommand with the necessary parameters
            const command = new SignUpCommand({
                ClientId: clientId,
                Username: data.email,
                Password: data.password,
                UserAttributes: [
                    { Name: "email", Value: data.email },
                    { Name: "name", Value: `${data.name} ${data.password}` }, // Add name.formatted attribute
                    { Name: "zoneinfo", Value: `${data.name} ${data.password}` } // Add name.formatted attribute
                ]
            });

            // Send the command using the CognitoIdentityProviderClient
            const response = await this.cognitoClient.send(command);

            // Log and return the response from Cognito
            console.log("Cognito SignUp Response:", response);
            console.log("Register Data:", register);

            return response;

        } catch (error) {
            console.error("Error in RegisterService:", error);
            throw error;
        }
    }

    public async ConfirmCode (email:string,code:string) :Promise<any>{
        const clientId = "1a5pfcpdbkmv8b9a9ti7lao6sl"; 

        const command = new ConfirmSignUpCommand(({
            ClientId: clientId,
            Username: email,
            ConfirmationCode:code
        }));
        return this.cognitoClient.send(command)
    }

    public async login(email: string, password: string): Promise<any> {
        try {
            const clientId = "1a5pfcpdbkmv8b9a9ti7lao6sl"; // Replace with your actual Cognito Client ID

            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            });

            const response = await this.cognitoClient.send(command);
            console.log("Cognito InitiateAuth Response:", response);

            return response;

        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }
}
