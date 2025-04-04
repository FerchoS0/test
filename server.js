const express = require("express");
const app = express();
const Ajv = require("ajv");
const PORT = 3000;
const configContactos = require("./configContactos");

const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const ajv = new Ajv();

const { validateAdditionalItems } = require("ajv/dist/vocabularies/applicator/additionalItems");

app.use(express.json());

//Metodo para imprimir IP
const imprimirIP = (req, res, next)=>{
    const ip = req.ip ||  req.connection.remoteAddress || req.headers['x-forwarded-for'] || null;
    console.log(`🖥️ Contacto creado desde la IP: ${ip}`);
    next();
};

//Metodo para solicitar
app.use((req, res, next)=> {
    console.log('Solicitud recibida: ${req.method} ${req.url}');
    next();
});

//Metodo para mostrar contacto por ID
app.get("/contactos/:id", (req,res) => {
    const contacto = configContactos.getContactosID(req.params.id);
    if(contacto){
        res.status(200).json(contacto);
    }else{
        res.status(404).json({ error: "Contacto no encontrado"});
    }
});

/*Metodo para eliminar contacto por ID
app.delete("/contactos/:id", (req, res)=> {
    const eliminar = fakeDatabase.deleteContacto(req.params.id);
    if(eliminar) {
        res.json({message: "Contacto eliminado"});
    }else{
        res.status(404).json({error:"Contacto no encontrado"});
    }
});
*/
//Mostrar contactos con una frase
app.get("/contactos", (req,res)=>{
    const {frase} = req.query;
    let contactos =configContactos.getContactos();

    if (frase){
        const fraseMiniscula = frase.toLowerCase();
        contactos = contactos.filter(contacto =>
            contacto.nombre.toLowerCase().includes(fraseMiniscula)
        );
    }
    if (frase === ""){
        return res.status(400).json({});
    }
    if (contactos.length === 0){
        return res.status(200).json([]);
    }
    contactos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    res.status(200).json(contactos);
});

//Metodo para el esquema de validacion
const esquema = {
    type: "object",
    properties: {
        id: {type: "string"},
        nombre: {type: "string"},
        numero: {type: "string", pattern: "^[0-9-]+$"},
        direccion: {type: "string"}
    },
    required: ["id", "nombre", "numero", "direccion"],
    additionalProperties: false
};

//Metodo para validar el JSON schema
const validarHeaders = (req, res, next) =>{
    const datos = {
        id: req.headers["id"],
        nombre: req.headers["nombre"],
        numero: req.headers["numero"],
        direccion: req.headers["direccion"]
    };

    const validar = ajv.compile(esquema);
    const vald = validar(datos);

    if(!vald){
        return res.status(400).json({error: "Introduce correctamente los datos", details: validar.errors});
    }
    req.contactoD= datos;
    next();
};

//Metodo para agregar contacto
app.post("/contactos", validarHeaders, (req, res, next)=>{
    const completado =  configContactos.addContacto(req.contactoD);
    if (completado){
       next();
    } else {
        return res.status(500).json({error:  "No se pudo agregar el contacto con el mismo ID"});
    }
}, imprimirIP, (req, res) =>{
    return res.status(201).json(req.contactoD);
});

//Metodo para manejar tareas no permitidas
app.use("/contactos", (req, res, next) => {
    res.status(405).json({ error: "Método no permitido en esta ruta" });
});

//Metodo para rutas no especificadas
app.use((req,res,next)=>{
    res.status(404).json({error: "Ruta no encontrada"});
});

//Iniciar servidor
app.get("/", (req, res) => {
    res.status("200 ok");
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:${PORT}');
});

