const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
dotenv.config();

//_______________________________ ENV variables __________________________________
const port = process.env.PORT || 4000;

const DOMAIN = process.env.DOMAIN;
const APY_KEY = process.env.API_KEY;
const USER = process.env.MAILGUN_USER;
const PASS = process.env.MAILGUN_PASS;
const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_TO = process.env.MAIL_TO;

//const mg = mailgun({ apiKey: APY_KEY, domain: DOMAIN });

//__________________________________  APP _______________________________________
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Middleware para parsear el body del formulario
app.use(express.urlencoded({ extended: true }));

app.get("/api", function (req, res) {
  res.send("Hello, welcome!");
});

//info
app.get("/api/info-pages", function (req, res) {
  const dataPath = "./data"; // ruta de la carpeta data

  fs.readdir(dataPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la carpeta data" });
    }
    const fileCount = files.length;
    res.json({ totalPages: fileCount });
  });
});

//get jsons
app.get("/api/page/:numero", (req, res) => {
  const { numero } = req.params;
  const filePath = `./data/page${numero}.json`;

  try {
    const data = require(filePath);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: "No se encontró el archivo" });
  }
});

/*
// Ruta para procesar el envío del formulario
app.post("/api/send-quote", (req, res) => {
  const { freelance, title, description, jobType, paymentQuotes } = req.body;

  // Configuración del transporte SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    secure: true,
    auth: {
      user: USER,
      pass: PASS,
    },
  });

  let date = new Date();

  const formatoMap = {
    dd: date.getDate(),
    mm: date.getMonth() + 1,
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };

  // Configuración del mensaje a enviar
  const data = {
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: "Mailbox Sourcelander - Asunto: Quotes",
    html: `
    <html>
      <head>
        <style>
          body{
            font-size: 20px !important;
          }
          span{
            color: #666666;
          }

          b {
            font-weight: bold;
          }
          h3{
            color: #051D39;
            margin: 0px;
            padding-bottom: 4px;
          }
          .subtitle{
            color: #334756;
          }
          .header-img{
            width:100%;
            height:60px;
            padding:10px;
            background-color:#F6F8FA;
            margin:0px;
            padding: 16px;
            padding-left: 20px;
            overflow:hidden;
         }
         .header-img > img{
             height: 100%;
             object-fit: content;
         }

        </style>
      </head>
      <body>
        <div class="header-img">
        <img src="http://sourcelander.org/wp-content/uploads/2023/04/logo.png" alt="Imagen de cabecera">
        </div>
        <br/><br/>
        <h3>FREELANCE</h3>
        <b class="subtitle">Nombre:</b> <span>${freelance.name} </span><br/>
        <b class="subtitle">Trabajo:</b> <span>${freelance.work} </span><br/> 
        <b class="subtitle">Dirección:</b> <span>${freelance.location} </span><br/>  
        <b class="subtitle">Presupuesto Hora:</b> <span>${freelance.budgetHour} </span><br/>  
        <br/>  
        <h3>PROYECTO</h3>
        <b class="subtitle">Titulo:</b> <span>${title}<br/>
        <b class="subtitle">Tipo de Trabajo:</b> <span>${jobType} </span><br/>
        <b class="subtitle">Descripción:</b> <span>${description} </span><br/><br/> 
        <b class="subtitle">Cuotas de pago:</b> <span>${paymentQuotes} </span><br/>
        <b class="subtitle">Fecha:</b> <span>${formatoMap.dd} / ${formatoMap.mm} / ${formatoMap.yyyy} </span>
        <br/><br/>
        <p><a href="https://sourcelander.org/freelancers/">https://sourcelander.org/freelancers/</a></p>
      </body>
    </html>
          `,
  };

  // Envío del mensaje
  transporter.sendMail(data, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al enviar el mensaje" });
    }
    console.log("Mensaje enviado: %s", info.messageId);
    res.json({ mensaje: "Mensaje enviado" });
  });
});
*/

//start server in port 4000
app.listen(port, () => {
  console.log(`Listen on Port ${port}`);
});
