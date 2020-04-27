export abstract class UserInvitationAbstract {
    public abstract async findUserInvitationByEmail(email: string): Promise<any>
}