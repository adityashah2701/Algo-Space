export const WelcomeTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Service</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            margin: 0 10px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://via.placeholder.com/150x50" alt="Company Logo" class="logo">
        <h1>Welcome to [Company Name]!</h1>
    </div>
    
    <div class="content">
        <p>Dear [Customer Name],</p>
        
        <p>Thank you for joining [Company Name]! We're thrilled to have you as part of our community.</p>
        
        <p>Your account has been successfully created and is ready to use. Here's what you can do next:</p>
        
        <ul>
            <li>Complete your profile to personalize your experience</li>
            <li>Explore our features and services</li>
            <li>Check out our knowledge base for helpful resources</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="#" class="button">Get Started</a>
        </div>
        
        <p>If you have any questions or need assistance, our support team is always here to help. Simply reply to this email or contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
        
        <p>We look forward to serving you!</p>
        
        <p>Best regards,<br>
        The [Company Name] Team</p>
    </div>
    
    <div class="footer">
        <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Twitter</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">LinkedIn</a>
        </div>
        
        <p>&copy; 2025 [Company Name]. All rights reserved.</p>
        <p>123 Main Street, City, Country</p>
        <p>
            <a href="#">Unsubscribe</a> | 
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Service</a>
        </p>
    </div>
</body>
</html>`
}

export const LoginTemplate = (firstName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px 0;
        }
        .login-details {
            background-color: #f7f7f7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #f44336;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
        }
        .safe-message {
            color: #4CAF50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://via.placeholder.com/150x50" alt="Company Logo" class="logo">
        <h1>New Login Detected</h1>
    </div>
    
    <div class="content">
        <p>Hello ${firstName},</p>
        
        <p>We detected a new login to your account on [Company Name].</p>
        
        <div class="login-details">
            <p><strong>Date & Time:</strong> [Login DateTime]</p>
            <p><strong>Device:</strong> [Device Type]</p>
            <p><strong>Location:</strong> [Location/IP]</p>
            <p><strong>Browser:</strong> [Browser Info]</p>
        </div>
        
        <p class="safe-message">If this was you, no further action is required.</p>
        
        <p>If you don't recognize this login activity, please secure your account immediately:</p>
        
        <div style="text-align: center;">
            <a href="#" class="button">Secure My Account</a>
        </div>
        
        <p>For added security, we recommend:</p>
        <ul>
            <li>Changing your password regularly</li>
            <li>Enabling two-factor authentication</li>
            <li>Never sharing your login credentials</li>
        </ul>
        
        <p>If you have any questions or concerns, please contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
        
        <p>Thank you for helping us keep your account secure.</p>
        
        <p>Best regards,<br>
        The [Company Name] Security Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message, please do not reply directly.</p>
        <p>&copy; 2025 [Company Name]. All rights reserved.</p>
        <p>123 Main Street, City, Country</p>
        <p>
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Service</a> | 
            <a href="#">Help Center</a>
        </p>
    </div>
</body>
</html>`
}


