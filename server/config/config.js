//Entorno
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

//Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

//Puerto env URLDB
// process.env.URLDB = ;
process.env.URLDB =urlDB;
//Puerto
process.env.PORT = process.env.PORT || 3000;

//Vencimiento del Token
//60*60*24*30
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//Seed de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
