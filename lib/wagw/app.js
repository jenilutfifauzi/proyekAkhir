const express = require('express')
const app = express()
const port = 3000



// const { Client, Location, List, Buttons, LocalAuth} = require('./index');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';
let sessionData;

if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    
      authStrategy: new LocalAuth({
        clientId: "client-one"
      }),
      puppeteer: {
        headless: true,
      }
});



// Save session values to the file upon successful auth

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});


app.get('/api', async (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan = req.query.pesan;

  tujuan = tujuan.substring(1);
  tujuan = `62${tujuan}@c.us`;
  let cekUser = await client.isRegisteredUser(tujuan);
//   hit pesan kirim
  if(cekUser == true){
      client.sendMessage(tujuan, pesan);
      res.json( { status : true , pesan : "Pesan berhasil terkirim"});
  }else {
      res.json( { status : false , pesan : "Pesan gagal terkirim"});
  }

})


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
