import { Resend } from "resend";

export const sendEmail = async (to, subject, text, from = "CourseHuB") => {
    const resend = new Resend(process.env.RESEND_API);

    try {
        await resend.emails.send({
            from: `${from} <onboarding@resend.dev>`,
            to: [to],
            subject: subject,
            html: `<strong>${text}</strong>`,
        });
    } catch (error) {
        console.log(error);
    }
};

// import { createTransport } from "nodemailer";
// export const sendEmail = async (to, subject, text) => {
//   const transporter = createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     to,
//     subject,
//     text,
//   });
// };
