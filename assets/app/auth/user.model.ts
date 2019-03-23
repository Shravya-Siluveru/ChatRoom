export class User {
    constructor(
                public userName: string,
                public password: string,
                public fullName?: string,
                public email?: string,
                public dateOfBirth?: Date,
                public phone?: string,
                public gender?: string
            ) {}
}