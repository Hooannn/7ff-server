import dayjs from 'dayjs';
export const bookingConfirmationTemplate = (underName: string, bookingTime: number | string) => `<!DOCTYPE html>
<html>

<head>
    <title>Forgot password - 7FF</title>
</head>

<body>
    <div>
        <div>Thanks ${underName},</div>
        <p>Your booking at 7FF is confirmed </p>
        <br/>
        <p>We are expecting you on ${dayjs(bookingTime).format('HH:mm DD/MM/YYYY')}</p>
        <br/>
        <p>Call 0989099090 for making changes or more details ! Cheers !</p>
    </div>

</body>

</html>`;
