const fs = require('fs');
const Papa = require('papaparse');
const { createCanvas, loadImage } = require('canvas');
const presentes = './archivos/nombres.csv';
const template = './archivos/template.jpg';
const keyNames = 'APELLIDO/S, NOMBRE/S:';
const carpeta = 'certificados'


// lee el archivo CSV 
fs.readFile(presentes, 'utf8', function (err, data) {
    if (err) {
        console.error('Error!!! -> ', err);
        return;
    }

    Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const names = results.data;
            // console.log(names)
            names.forEach(function (name) {
                generarCertificado(name[keyNames]);
            });
        }
    });
});


function generarCertificado(name) {

    loadImage(template).then((certificado) => {
        // crear plantilla
        const canvas = createCanvas(certificado.width, certificado.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(certificado, 0, 0);

        // fuente y alineacion
        ctx.font = 'medium 64px Roboto';
        ctx.fillStyle = 'rgb(223, 82, 9)';
        ctx.textAlign = 'center';

        // posicion
        const xPosition = (canvas.width / 2); // horizontal
        const yPosition = 520; // vertical 
        ctx.fillText(name.toUpperCase(), xPosition, yPosition);

        // guardar
        if (!fs.existsSync(carpeta)) {
            // Si no existe, crear la carpeta
            fs.mkdirSync(carpeta);
        }
        const output = fs.createWriteStream(`${carpeta}/${name}.jpg`);
        const stream = canvas.createJPEGStream();
        stream.pipe(output);
    });
}