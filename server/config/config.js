//Entorno
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

//Base de datos
let urlDBL;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb://cafe-user:num3r0s@ds263500.mlab.com:63500/cafe_db';
}

//Puerto env URLDB
process.env.URLDB = process.env.MONGO_URI;
//Puerto
process.env.PORT = process.env.PORT || 3000;
