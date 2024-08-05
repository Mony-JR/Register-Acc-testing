import { Body, Controller, Get, Post, Query, Res, Route, Tags, TsoaResponse } from "tsoa";
import { LoginReq, RegisterReq } from "../../Models/register/user-register";
import { RegisterService } from "../../services/userService/register-service";
// import { Request as ExRequest } from 'express';
import crypto from 'crypto';
import querystring from 'querystring';
import configs from "../../config";


const COGNITO_DOMAIN = 'https://google-tesing1.auth.us-east-1.amazoncognito.com';

@Route('/v3/users/register')
@Tags('Authentication')

export class RegisterController extends Controller {

    private RegisterService = new RegisterService();


    @Post()
    public async registerUser(
        @Body() body: RegisterReq
    ): Promise<RegisterReq | null | undefined> {
        try {
            if (!body) {
                console.log("Data not having")
            }
            const user = await this.RegisterService.Register(body)
            return user

        } catch (e) {
            console.log(e);

        }
    }
    @Post('/confirm')
    public async confirmCode(
        @Query() email: string,
        @Query() confirmationCode: string
    ): Promise<RegisterReq | null | undefined> {
        try {
            const result = await this.RegisterService.ConfirmCode1(email, confirmationCode)
            return result;
        } catch (e) {
            console.error("Error in confirming code:", e);
        }
    }
    @Post('/login')
    public async login(
        @Body() body: LoginReq
    ): Promise<RegisterReq | null | undefined> {
        try {
            const result = await this.RegisterService.login(body);
            return result;
        } catch (e) {
            console.error("Error in login:", e);
        }
    }

    @Get("/signin/google")
    public ShowConsenScreen(
      @Res() redirect: TsoaResponse<302, void>
    ): void {
      const redirectURI = `${configs.host}/v3/auth/signin/google/callback`;
      const state = crypto.randomBytes(16).toString('hex');
      const params = {
        client_id: configs.clientID, 
        redirect_uri: redirectURI,
        response_type: "code",
        scope: "openid profile email",
        identity_provider: "Google",
        state: state,
      };
  
      // Add debugging output
      console.log("Redirect URI:", redirectURI);
      console.log("Client ID:", configs.clientID);
      console.log("Params:", params);
  
      const url = `${COGNITO_DOMAIN}/oauth2/authorize?${querystring.stringify(params)}`;
      redirect(302, undefined, { Location: url });
    }
    


    // @Get("/signin/google/u")
    // public redirectToGoogleOAuth(
    //     @Res() redirect: TsoaResponse<302, void>
    // ): void {
    //     const COGNITO_DOMAIN = `https://my-user-pool-ny.auth.us-east-1.amazoncognito.com`
    //     const redirectURI = `${configs.host}/v1/auth/signin/google/callback`; // This URI will be handled by your application after Cognito's callback
    //     const params = {
    //         client_id: configs.googleID!, // Your Cognito Client ID
    //         redirect_uri: redirectURI,
    //         response_type: "code",
    //         scope: "openid profile email",
    //         identity_provider: "Google", // Explicitly specify Google as the identity provider
    //     };
    //     const url = `${COGNITO_DOMAIN}?${querystring.stringify(params)}`;
    //     redirect(302, undefined, { Location: url });
    // }


}