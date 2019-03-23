export class Message {
    constructor(
                public sender: string,
                public message: string,
                public time: Date,
                public isNotification?: boolean
            ) {}
}