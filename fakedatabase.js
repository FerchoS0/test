let contactos = [
    {id: "1", nombre: "Fernando", numero: "9812008574", direccion: "Merida, Yucatan"},
    {id: "2", nombre: "Jorge", numero: "9811119600", direccion: "Campeche, Campeche"},
    {id: "3", nombre: "Gerardo", numero: "5348973561", direccion: "Toronto, Canada"}
];

const getContactos = () => contactos;
const getContactosID = (id) => contactos.find(contactos => contactos.id === id);
const deleteContacto = (id) => {
    const index = contactos.findIndex(contactos => contactos.id === id);
    if (index !== -1){
        contactos.splice(index, 1);
        return true;
    }
    console.log('Contacto no encontrado')
    return false;
};

module.exports = {getContactos, getContactosID, deleteContacto};