import EmailService from "../../../service/emailServices/email.sercvice";

describe("EmailService - startEmailScheduler", () => {
    let service: EmailService;
    const mockUser = { _id: "user123", email: "test@example.com" };

    beforeEach(() => {
        jest.useFakeTimers();
        service = new EmailService();
        jest.spyOn(service, "sendNotification").mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it("should call sendNotification immediately and schedule interval", async () => {
        await service.startEmailScheduler(mockUser);

        expect(service.sendNotification).toHaveBeenCalledTimes(1);
        expect(service.sendNotification).toHaveBeenCalledWith(mockUser);

        jest.advanceTimersByTime(86400000);
        expect(service.sendNotification).toHaveBeenCalledTimes(2);
    });
});