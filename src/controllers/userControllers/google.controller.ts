import { Controller, Get, Query, Res, Route, Tags, TsoaResponse } from 'tsoa';
import crypto from 'crypto';
import querystring from 'querystring';
import configs from '../../config';
import { RegisterService } from '../../services/userService/register-service';

const COGNITO_DOMAIN1 = 'https://bata-4.auth.us-east-1.amazoncognito.com';

@Route('v4/users')
@Tags('Google')
export class RegisterController_Google extends Controller {
    private registerService: RegisterService;
    constructor() {
        super();
        this.registerService = new RegisterService();
    }
    @Get("/google")
    public async GoogleConsentScreen(@Res() redirect: TsoaResponse<302, void>): Promise<void> {
        const redirectURI = `${configs.host}/v4/users/signin/google/callback`;
        const state = crypto.randomBytes(16).toString('hex');
        const params = {
            client_id: configs.clientID,
            redirect_uri: redirectURI,
            response_type: "code",
            scope: "profile email openid", // Ensure there are no trailing spaces
            identity_provider: "Google",
            state: state,
            prompt: "consent",
        };

        // Add debugging output
        console.log("Redirect URI:", redirectURI);
        console.log("Client ID:", configs.clientID);
        console.log("Params:", params);

        const url = `${COGNITO_DOMAIN1}/oauth2/authorize?${querystring.stringify(params)}`;

        // Log the constructed URL for debugging
        console.log("Constructed URL:", url);

        redirect(302, undefined, { Location: url });
    }


    @Get('signin/google/callback')
    public async handleGoogleCallback(
        @Query() code: string,
        @Query() state: string,
    ): Promise<any> {

        return this.registerService.GetToken(code, state);

    }
}

