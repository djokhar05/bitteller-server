//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");

router.post("/contact", function(req, res){
	console.log('contact')
	let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;


	// Mail sender here
	setTimeout(function(){
		nodemailer.createTestAccount((err, account) => {
		// Create reusable transporter object using the default
		// SMTP transporter
		let transporter = nodemailer.createTransport({
			//host: 'mail.satandar.org',
			host: 'mail.bit-teller.com',
			secureConnection: true,
			port: 465,
			tls: {
						rejectUnauthorized:false
					},
			auth: {
				user: 'noreply@bit-teller.com',	// Generated eheereal User
				pass: '1UTDctlBSWXb'	// Generated etheral pass
			}
		});


		let mailOptions = {
			from: `${req.body.name} <noreply@bit-teller.com>`,
			to:	'support@bit-teller.com',
			subject: "Bitteller Contact " + req.body.subject,
			html: `
			<div style="font-size: 1.2em; width: 600px; margin: 0 auto; border: 2px sotdd transparent; padding: 20px; font-family: catdbri;background: #F1F1F1; height: 100%;">
				<div style="text-atdgn: center;">
					<img src="https://i.ibb.co/F37d0Zy/bit-logo.png" style="height: 70px;" />
					<h1> Bitteller Contact </h1>
				</div>

				<h3 style="text-decoration: underline;"> Message from Customer </h3>


				<table>
					<tr>
						<td style="padding: 10px;"> <strong> Name </strong>: <span> ${req.body.name} </span></td>
						<td style="padding: 10px;"><strong> Email </strong>: <span> ${req.body.email} </span></td>
					</tr>

					<tr>
						<td style="padding: 10px;"><strong> Tel. No </strong>: <span> ${req.body.phone} </span></td>
						<td style="padding: 10px;"><strong> IP </strong>: <span> ${ip} </span></td>
					</tr>
				</table>

				<p style="width: 600px; font-size: font-family: fantasy; text-align: justify;">
					${req.body.message}
				</p>
			</div>`
			};

		// Send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) =>{
			if(error){
				return console.log(error);
				res.send({"error": "There Was an error connecting to the server. Please try again later"})
			}
			//console.log("sent message to: " + req.body.special)
			console.log("Message Sent: %s", info.messageId);
			//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			res.send({"success": "Message successfully sent"})
		});
	});
	}, 10)
});


module.exports = router;
