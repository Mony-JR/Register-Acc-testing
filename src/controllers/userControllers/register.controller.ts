import { Body, Controller, Post, Query, Route, Tags } from "tsoa";
import { LoginReq, RegisterReq } from "../../Models/register/user-register";
import { RegisterService } from "../../services/userService/register-service";


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

}