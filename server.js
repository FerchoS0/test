const express = require("express");
const app = express();
const PORT = 3000;

const fakeDatabase = require("./fakedatabase");

app.use(express.json());

//Metodo para solicitar
app.use((req, res, next)=> {
    console.log('Solicitud recibida: ${req.method} ${req.url}');
    next();
});

//Metodo para mostrar contacto y ordenar
app.get("/contactos", (req, res)=>{
    const contactos = fakeDatabase.getContactos().sort((a,b) => a.nombre.localeCompare(b.nombre));
    res.status(200).json(contactos);
});

//Metodo para mostrar contacto por ID
app.get("/contactos/:id", (req,res) => {
    const contacto = fakeDatabase.getContactosID(req.params.id);
    if(contacto){
        res.json(contacto);
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

//Iniciar servidor
app.get("/", (req, res) => {
    res.status("200 ok");
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:${PORT}');
});

