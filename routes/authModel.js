import nodemailer from 'nodemailer'

export var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lykanh007@gmail.com',
    pass: 'sabarish@3'
  }
});

