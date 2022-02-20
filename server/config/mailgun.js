const keys = require("./keys");
const { key, domain, sender } = keys.mailgun;

const mailgun = require("mailgun-js")({
  apiKey: key,
  domain: domain,
});

exports.sendEmail = (recipient, message) => {
  //  console.log(domain)
  return new Promise((resolve, reject) => {
    const data = {
      from: `Bijika Closet! <${sender}>`,
      to: recipient,
      subject: message.subject,
      text: message.text,
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        // console.log(error)
        // console.log("yyyyyyyyyooooooooo body")
        // console.log(body)
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};
