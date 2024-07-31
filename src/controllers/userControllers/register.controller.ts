import { Body, Controller, Post, Query, Route } from "tsoa";
import { RegisterReq} from "../../Models/register/user-register";
import { RegisterService } from "../../services/userService/register-service";


@Route('/v3/users/register')

export class RegisterController extends Controller {

    private RegisterService = new RegisterService();

    @Post()
    public async registerUser(
        @Body() body: RegisterReq
    ): Promise<any> {
        try {
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
    ): Promise<any> {
        try {
            const result = await this.RegisterService.ConfirmCode(email, confirmationCode);
            return result;
        } catch (e) {
            console.error("Error in confirming code:", e);
            // Handle the error appropriately (e.g., return a user-friendly message)
            throw e; // Optionally, you can re-throw the error or return a custom error response
        }
    }
    @Post('/login')
    public async login(
        @Body() body: { email: string, password: string }
    ): Promise<any> {
        try {
            const result = await this.RegisterService.login(body.email, body.password);
            return result;
        } catch (e) {
            console.error("Error in login:", e);
            throw e;
        }
    }

}