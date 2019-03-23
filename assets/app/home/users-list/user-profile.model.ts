export class UserProfile {
    constructor(
                public userName: string,
                public fullName?: string,
                public dateOfBirth?: Date,
                public email?: string,
                public gender?: string,
                public phone?: string
            ) {}
}