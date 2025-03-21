export const WelcomeEmailTemplate = (userData) => {
    const { firstName, lastName, email, role } = userData;
    
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to InterviewConnect</title>
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
          .highlight {
              background-color: #f8f9fa;
              border-left: 4px solid #4a69bd;
              padding: 15px;
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
          <img src="https://via.placeholder.com/150x50" alt="InterviewConnect Logo" class="logo">
          <h1>Welcome to InterviewConnect!</h1>
      </div>
      
      <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          
          <p>Welcome to InterviewConnect! We're thrilled to have you join our community as a${role === 'interviewer' ? 'n' : ''} <strong>${role}</strong>.</p>
          
          <div class="highlight">
              <p>Your account has been successfully created with:</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          
          <p>At InterviewConnect, we're dedicated to making the interview process more effective and enjoyable for everyone involved. Our platform offers a range of features designed to help you succeed in your role.</p>
          
          ${role === 'candidate' ? 
          `<p>As a candidate, you'll be able to:</p>
          <ul>
              <li>Access practice interviews with experienced professionals</li>
              <li>Receive detailed feedback to improve your skills</li>
              <li>Showcase your abilities to potential employers</li>
              <li>Track your interview performance over time</li>
          </ul>` : 
          `<p>As an interviewer, you'll be able to:</p>
          <ul>
              <li>Connect with talented candidates</li>
              <li>Conduct efficient and structured interviews</li>
              <li>Provide valuable feedback to help candidates grow</li>
              <li>Build your reputation as an industry expert</li>
          </ul>`}
          
          <p>Our team is here to support you every step of the way. If you have any questions or need assistance, please don't hesitate to reach out to us at <a href="mailto:support@interviewconnect.example.com">support@interviewconnect.example.com</a>.</p>
          
          <p>We look forward to seeing you succeed on our platform!</p>
          
          <p>Best regards,<br>
          The InterviewConnect Team</p>
      </div>
      
      <div class="footer">
          <div class="social-links">
              <a href="#">Facebook</a> | 
              <a href="#">Twitter</a> | 
              <a href="#">LinkedIn</a>
          </div>
          
          <p>&copy; ${new Date().getFullYear()} InterviewConnect. All rights reserved.</p>
          <p>
              <a href="#">Privacy Policy</a> | 
              <a href="#">Terms of Service</a>
          </p>
      </div>
  </body>
  </html>`;
  };
  
  // 2. Welcome Back Email Template (for user login)
  export const WelcomeBackEmailTemplate = (userData) => {
    const { firstName, role, lastLogin } = userData;
    
    // Format date if available
    const formattedLastLogin = lastLogin ? new Date(lastLogin).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'first time';
    
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Back to InterviewConnect</title>
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
          .info-box {
              background-color: #e9f7fe;
              border-left: 4px solid #3498db;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #999999;
              border-top: 1px solid #eeeeee;
              padding-top: 20px;
          }
          .highlights {
              display: flex;
              justify-content: space-between;
              margin: 30px 0;
              flex-wrap: wrap;
          }
          .highlight-item {
              flex-basis: 45%;
              background-color: #f8f9fa;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          @media (max-width: 600px) {
              .highlight-item {
                  flex-basis: 100%;
              }
          }
      </style>
  </head>
  <body>
      <div class="header">
          <img src="https://via.placeholder.com/150x50" alt="InterviewConnect Logo" class="logo">
          <h1>Welcome Back!</h1>
      </div>
      
      <div class="content">
          <p>Hello ${firstName},</p>
          
          <p>Great to see you back on InterviewConnect! We've missed you.</p>
          
          <div class="info-box">
              <p>Your last login was: <strong>${formattedLastLogin}</strong></p>
          </div>
          
          ${role === 'candidate' ? 
          `<p>Here's what's been happening since you've been away:</p>
          
          <div class="highlights">
              <div class="highlight-item">
                  <h3>New Opportunities</h3>
                  <p>Several new interview opportunities matching your skills have been added.</p>
              </div>
              <div class="highlight-item">
                  <h3>Practice Sessions</h3>
                  <p>We've added new mock interview scenarios to help you prepare better.</p>
              </div>
          </div>` : 
          `<p>Here's what's been happening since you've been away:</p>
          
          <div class="highlights">
              <div class="highlight-item">
                  <h3>Candidate Pool</h3>
                  <p>Several new candidates are looking for interviewers with your expertise.</p>
              </div>
              <div class="highlight-item">
                  <h3>Interview Requests</h3>
                  <p>Check your dashboard for any pending interview requests.</p>
              </div>
          </div>`}
          
          <p>We're constantly working to improve your experience on InterviewConnect. If you have any feedback or suggestions, we'd love to hear from you!</p>
          
          <p>Have a productive day ahead!</p>
          
          <p>Best regards,<br>
          The InterviewConnect Team</p>
      </div>
      
      <div class="footer">
          <p>&copy; ${new Date().getFullYear()} InterviewConnect. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
      </div>
  </body>
  </html>`;
  };
  
  // 3. Profile Completion Email Template
  export const ProfileCompletionEmailTemplate = (userData) => {
    const { firstName, lastName, role, completedFields = [] } = userData;
    
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Profile Completed - InterviewConnect</title>
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
          .success-box {
              background-color: #e8f5e9;
              border-left: 4px solid #2ecc71;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #999999;
              border-top: 1px solid #eeeeee;
              padding-top: 20px;
          }
          .checkmark {
              color: #2ecc71;
              font-size: 24px;
              margin-right: 10px;
          }
          .profile-summary {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .field-list {
              list-style-type: none;
              padding-left: 0;
          }
          .field-list li {
              padding: 8px 0;
              border-bottom: 1px solid #eeeeee;
          }
          .field-list li:last-child {
              border-bottom: none;
          }
          .badge {
              display: inline-block;
              background-color: #3498db;
              color: white;
              padding: 3px 10px;
              border-radius: 20px;
              font-size: 14px;
              margin-left: 10px;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <img src="https://via.placeholder.com/150x50" alt="InterviewConnect Logo" class="logo">
          <h1>Profile Completed!</h1>
      </div>
      
      <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          
          <div class="success-box">
              <p><span class="checkmark">✓</span> Your profile has been successfully completed!</p>
          </div>
          
          <p>Congratulations on completing your profile on InterviewConnect! Having a complete profile is essential to make the most of our platform and increases your visibility to ${role === 'candidate' ? 'interviewers' : 'candidates'}.</p>
          
          <div class="profile-summary">
              <h3>Your Profile Summary</h3>
              <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)} <span class="badge">Active</span></p>
              
              <h4>Completed Information:</h4>
              <ul class="field-list">
                  ${completedFields.length > 0 ? 
                  completedFields.map(field => `<li><span class="checkmark">✓</span> ${field}</li>`).join('') : 
                  `<li><span class="checkmark">✓</span> Basic Information</li>
                  <li><span class="checkmark">✓</span> Contact Details</li>
                  <li><span class="checkmark">✓</span> ${role === 'candidate' ? 'Skills & Experience' : 'Expertise & Availability'}</li>`}
              </ul>
          </div>
          
          ${role === 'candidate' ? 
          `<p>With your completed profile, you're now ready to:</p>
          <ul>
              <li>Apply for interview opportunities</li>
              <li>Showcase your skills to potential employers</li>
              <li>Receive personalized interview practice recommendations</li>
          </ul>` : 
          `<p>With your completed profile, you're now ready to:</p>
          <ul>
              <li>Connect with candidates seeking your expertise</li>
              <li>Schedule interviews based on your availability</li>
              <li>Provide valuable feedback and mentorship</li>
          </ul>`}
          
          <p>Remember, you can always update your profile information as needed to keep it current and relevant.</p>
          
          <p>Thank you for being part of our community!</p>
          
          <p>Best regards,<br>
          The InterviewConnect Team</p>
      </div>
      
      <div class="footer">
          <p>&copy; ${new Date().getFullYear()} InterviewConnect. All rights reserved.</p>
          <p>
              <a href="#">Privacy Policy</a> | 
              <a href="#">Terms of Service</a>
          </p>
      </div>
  </body>
  </html>`;
  };