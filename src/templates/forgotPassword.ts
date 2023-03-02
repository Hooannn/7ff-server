export const forgotPasswordTemplate = (url: string) => `<!DOCTYPE html>
<html>

<head>
    <title>Forgot password - 7FF</title>
</head>

<body>
    <div>
        <div>Hi there,</div>
        <p>You requested for a password reset, kindly use this <a href="${url}">link</a> to reset your password</p>
        <br/>
        <p>This link will expire in 10 minutes.</p>
        <br/>
        <p>Cheers!</p>
    </div>

</body>

</html>`;
