const contactos = require("./fakedatabase");

const getContactos = () => contactos;

const getContactosID = (id) => contactos.find(contactos => contactos.id === id);

/*const deleteContacto = (id) => {
    const index = contactos.findIndex(contactos => contactos.id === id);
    if (index !== -1){
        contactos.splice(index, 1);
        return true;
    }
    console.log('Contacto no encontrado')
    return false;
};
*/

const addContacto = (nuevoContacto) => {
    const existe = contactos.some(contacto => contacto.id === nuevoContacto.id);
    if(existe){
        console.log('El contacto con ese ID ya existe');
        return false;
    } contactos.push(nuevoContacto);
    console.log('Contacto agregado');
    return true;
}
module.exports = {getContactos, getContactosID, addContacto};