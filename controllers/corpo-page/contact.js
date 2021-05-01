const nodemailer = require('nodemailer') // formulario de contacto corpo-page

const OUTLOOK_USER = process.env.OUTLOOK_USER;
const OUTLOOK_PASS = process.env.OUTLOOK_PASS;

const sendEmail = (req, res) => {
    try {
        // Instantiate the SMTP server
        const smtpTrans = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: OUTLOOK_USER,
                pass: OUTLOOK_PASS
            }
        })

        // Specify what the email will look like
        const mailOpts = {
            from: OUTLOOK_USER,
            to: OUTLOOK_USER,
            subject: `Consulta de ${req.body.email} enviado desde piensossergiorocamora.com. Asunto: ${req.body.asunto}`,
            text: `Nombre: ${req.body.nombre} | Correo: ${req.body.email} | Teléfono: ${req.body.telefono}) dice: ${req.body.mensaje}`
        }

        // Attempt to send the email
        smtpTrans.sendMail(mailOpts, (error, response) => {
            console.log(response);
            if (error) {
                res.json(error);
            }
            else {
                res.json(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    sendEmail
}