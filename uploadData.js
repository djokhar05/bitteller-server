//Set up

let express = require("express");
let multer = require("multer");
let bodyParser = require("body-parser");
let router = express.Router();
let path = require("path");

const nodemailer = require("nodemailer");


var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
  	//console.log(file);
  	cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory


router.post("/uploadData", upload.array('uploads'), function(req, res, next) {
  //console.log("Received payment data");

	let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

	//This variable holds the array of images and image name that will be sent by nodemailer to email
	imageArr = [];

  //Iterate over the file objects and save the images
  for(let i=0; i<req.files.length; i++){
  	imageArr.push({
  		filename: req.files[i].filename,
  		content: require("fs").readFileSync(__dirname + "/uploads/" + req.files[i].filename)
  	})
  }

  //Generate test SMTP Service account from ethereal.email
	//Only needed if you don't a real mail account for testing
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
			from: 'Bitteller' + '<noreply@bit-teller.com>',
			to:	'support@bit-teller.com',
			subject: "New Bitteller Payment: " + req.body.subject,
			html: `<div style='width: 1000px; margin: 0 auto; padding: 20px; font-family: catdbri;background: #F1F1F1; height: 100%;'> <div style='text-atdgn: center;'><img src='https://i.ibb.co/F37d0Zy/bit-logo.png' style='height: 70px;' /><h1> Bitteller Payment (${req.body.subject})  </h1></div> <h3 style='text-decoration: undertdne;'> A customer just claimed a payment </h3> <p> Payer's information is outlined below </p>  	<table>\
		<tr>\
			<td style='border: 1px solid black; padding: 10px;'> <strong> Name </strong>: <span> ${req.body.name} </span></td>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Email </strong>: <span> ${req.body.email}  </span></td>\
		</tr>\
		<tr>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Tel. No </strong>: <span> ${req.body.num}  </span></td>		\
			<td style='border: 1px solid black; padding: 10px;'><strong> Country </strong>: <span> ${req.body.country}  </span></td>\
		</tr>\
		<tr>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Account No. </strong>: <span> ${req.body.actno}  </span></td>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Bank Name </strong>: <span> ${req.body.instname}  </span></td>\
		</tr>\
		<tr>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Trade Amount </strong>: <span> ${req.body.tradeamt}  </span></td>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Gift Card Type:  </strong>: <span> ${req.body.giftCardInfo}  </span></td>\
		</tr>\
		<tr>\
			<td style='border: 1px solid black; padding: 10px;'><strong> Trade type </strong>: <span> ${req.body.subject}  </span></td>\<td style='border: 1px solid black; padding: 10px;'><strong> IP Address </strong>: <span> ${ip}  </span></td>\
		</tr>\
	</table></div>`,
			attachments: imageArr
		};

		// Send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) =>{
			if(error){
				return console.log(error);
				res.send({"error": "There Was an error connecting to the server. Please try again later"})
			}
			console.log("Message Sent: %s", info.messageId);
			//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			res.send({"success": "Message successfully sent"})

			//Delete images from server so it doesn't clog the server up
			let fs = require('fs');		//require fs module
			//iterate through the array of files uploaed and delete them
			for(let i=0; i<req.files.length; i++){
				let filePath = __dirname + '/uploads/' + req.files[i].filename;
				fs.unlinkSync(filePath);
			 }


		});
	});
	}, 500)


  //res.send(fileinfo);
});


module.exports = router;
