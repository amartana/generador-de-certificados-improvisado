const fs = require('fs');
const Papa = require('papaparse');
const { createCanvas, loadImage } = require('canvas');

// lee el archivo CSV 
fs.readFile('nombres.csv', 'utf8', function (err, data) {
    if (err) {
        console.error('Error!!! -> ', err);
        return;
    }

    Papa.parse(data, {
        complete: function (results) {
            var names = results.data;
            names.forEach(function (name) {
                generarCertificado(name[0]);
            });
        }
    });
});


function generarCertificado(name) {

    loadImage('plantilla_certificado.jpg').then((certificado) => {
        // crear plantilla
        const canvas = createCanvas(certificado.width, certificado.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(certificado, 0, 0);

        // fuente y alineacion
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        // posicion
        const xPosition = (canvas.width / 2); // horizontal
        const yPosition = 520; // vertical 
        ctx.fillText(name, xPosition, yPosition);

        // guardar
        const output = fs.createWriteStream(`certificados/${name}.jpg`);
        const stream = canvas.createJPEGStream();
        stream.pipe(output);
    });
}
