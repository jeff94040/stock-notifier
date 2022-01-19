import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//import config props from .env file
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: "true", //use TLS
  auth: {
    user: process.env.FROM_EMAIL_ADDRESS,
    pass: process.env.FROM_EMAIL_PASSWORD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: "false"
  }
})

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

try{

  console.log('sending request to server & awaiting response...')

  // NVIDIA GeForce RTX 3080 Ti
  const response = await fetch('https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-ti-12gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6462956.p?skuId=6462956')
  
  // in stock example
  // const response = await fetch('https://www.bestbuy.com/site/pny-geforce-gt-730-2gb-ddr3-single-fan-graphics-card/6471621.p?skuId=6471621')

  console.log(`server response: ${response.status}/${response.statusText}`)

  if(response.status === 200 && response.statusText === 'OK'){

    const body = await response.text()
    //console.log(body)

    body.includes('sold out') ? console.log('sold out') : console.log('in stock')

  }
}
catch (error){

  console.log(error)

}