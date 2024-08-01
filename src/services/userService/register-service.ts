import { CognitoIdentityProviderClient, ConfirmSignUpCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { RegisterReq } from "../../Models/register/user-register";
import { RegisterRepo } from "../../user Repo/register/register.repo";
import configs from "../../config";
import * as crypto from "crypto";


export class RegisterService {
    private registerRepo = new RegisterRepo();
    private cognitoClient = new CognitoIdentityProviderClient({ region:configs.region });
        private calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
        const hash = crypto.createHmac("SHA256", clientSecret)
                           .update(username + clientId)
                           .digest("base64");
        return hash;
    }

    public async Register(data: RegisterReq): Promise<any> {
        try {
            // Validate data
            if (!data.email || !data.password || !data.name) {
                throw new Error("Missing required registration fields: email, password, name");
            }

            // Save the registration data to your repository
            const register = await this.registerRepo.CreateRegister(data);
            const secretHash=await this.calculateSecretHash(data.email, configs.clientID, configs.secretHash)

            console.log(`Calculated secret hash for ${data.email}`); // Log the secret hash for debugging

            // Create the SignUpCommand with the necessary parameters
            const command = new SignUpCommand({
                ClientId: configs.clientID,
                SecretHash: secretHash,
                Username: data.email,
                Password: data.password,
                UserAttributes: [
                    { Name: "given_name", Value: `${data.email} ${data.name} ${data.password} `},
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

    public async ConfirmCode1 (email:string,code:string) :Promise<any>{ 

        const command = new ConfirmSignUpCommand(({
            ClientId: configs.clientID,
            Username: email,
            ConfirmationCode:code
        }));
        

        console.log("Token is ",code);
        
        return this.cognitoClient.send(command)


    }

    public async login(email: string, password: string): Promise<any> {
        try {

            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: configs.clientID,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            });

            const response = await this.cognitoClient.send(command);
            console.log("Cognito InitiateAuth Response:", response);
            const data={
                
            }
            await this.registerRepo.CreateRegister(data)
            return response;

        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }
}
