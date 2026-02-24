const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Projet Flutter</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          background: #0F1115; 
          color: white; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0; 
          text-align: center; 
          padding: 20px; 
        }
        h1 { color: #2F80ED; margin-bottom: 10px; }
        p { max-width: 600px; line-height: 1.6; color: #A1A1AA; font-size: 18px; }
        .code { 
          background: #151518; 
          padding: 15px 30px; 
          border-radius: 8px; 
          font-family: monospace; 
          color: #FF4757; 
          margin-top: 20px; 
          font-size: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
      </style>
    </head>
    <body>
      <h1>Projet Flutter (Dart)</h1>
      <p>L'environnement de prévisualisation (AI Studio) est conçu uniquement pour exécuter des applications Web (React, Node.js, etc.).</p>
      <p>Comme nous avons converti tout le projet en <strong>Flutter (Dart)</strong>, il ne peut plus être compilé et affiché directement dans ce navigateur.</p>
      <p>Pour voir et tester votre application, veuillez télécharger les fichiers du projet et l'exécuter localement sur votre machine avec Flutter :</p>
      <div class="code">flutter run</div>
    </body>
    </html>
  `);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
