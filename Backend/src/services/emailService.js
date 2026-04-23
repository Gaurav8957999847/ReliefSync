import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailService {
  async sendEmail(to, subject, text) {
    try {
      await transporter.sendMail({
        from: `"ReliefSync AI" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      });
      console.log(`✅ Email sent successfully to ${to}`);
      return true;
    } catch (err) {
      console.error("❌ Failed to send email:", err.message);
      return false;
    }
  }

  // this is for the urgency email sending (critical alert to ngo)

  async sendCriticalNeedAlert(need, ngoEmail) {
    const text = `
🚨 CRITICAL NEED ALERT

Title: ${need.title}
Priority: ${need.priority.toUpperCase()}

Location: ${need.extractedData?.location || "Not specified"}
Affected People: ${need.extractedData?.affectedPeople || "Unknown"}

Required Skills: ${need.extractedData?.requiredSkills?.join(", ") || "None"}

Please check the dashboard immediately and take action.

This is an automated alert from ReliefSync AI.
    `;
    // from is decided always
    return await this.sendEmail(ngoEmail, `🚨 CRITICAL: ${need.title}`, text);
  }

  // Assignment Alert to Volunteer
  async sendAssignmentAlert(volunteerEmail, needTitle) {
    const text = `
New Assignment Assigned to You

Task: ${needTitle}

Please login to ReliefSync AI and check your assignments.

Thank you for your support!
ReliefSync AI Team
    `;

    return await this.sendEmail(
      volunteerEmail,
      `New Assignment: ${needTitle}`,
      text,
    );
  }
}

export default new EmailService();
