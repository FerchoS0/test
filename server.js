const express = require("express");
const app = express();
const Ajv = require("ajv");
const PORT = 3000;

const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const ajv = new Ajv();
const fakeDatabase = require("./fakedatabase");
const { validateAdditionalItems } = require("ajv/dist/vocabularies/applicator/additionalItems");

app.use(express.json());

//Metodo para solicitar
app.use((req, res, next)=> {
    console.log('Solicitud recibida: ${req.method} ${req.url}');
    next();
});

//Metodo para mostrar contacto por ID
app.get("/contactos/:id", (req,res) => {
    const contacto = fakeDatabase.getContactosID(req.params.id);
    if(contacto){
        res.status(200).json(contacto);
    }else{
        res.status(404).json({ error: "Contacto no encontrado"});
    }
});

//Metodo para eliminar contacto por ID
app.delete("/contactos/:id", (req, res)=> {
    const eliminar = fakeDatabase.deleteContacto(req.params.id);
    if(eliminar) {
        res.json({message: "Contacto eliminado"});
    }else{
        res.status(404).json({error:"Contacto no encontrado"});
    }
});

//Mostrar contactos con una frase
app.get("/contactos", (req,res)=>{
    const {frase} = req.query;
    let contactos =fakeDatabase.getContactos();

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
        id: {"type": "string"},
        nombre: {"type": "string"},
        numero: {"type": "string"},
        direccion: {"type": "string"}
    },
    required: ["id", "name", "numero", "direccion"],
    additionalProperties: false
};

const validar= ajv.compile(esquema);

const fakeDatabases = {
    contactos: [],
    addContacto: function(contacto){
        this.contactos.push(contacto);
    }
};

//Metodo para validar el esquema
const validarHeaders = (req, res, next) =>{
    const headers = {
        id: req.get("id"),
        nombre: req.get("nombre"),
        numero: req.get("numero"),
        direccion: req.get("direccion")
    };

    const vald = validar(headers);

    if(!vald){
        return res.status(400).json({error: "Introduce correctamente los datos", details: validar.errors});
    }
    req.contacto= headers;
    next();
};

//Metodo para agregar contacto
app.post("/contactos", validarHeaders, (req, res)=>{
    const {id,nombre,numero,direccion} = req.contacto;
    
    fakeDatabase.addContacto({id,nombre,numero,direccion});
    res.status(200).json({message: "Contacto agregado", contacto: {id,nombre,numero,direccion}});
});

//Iniciar servidor
app.get("/", (req, res) => {
    res.status("200 ok");
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:${PORT}');
});

