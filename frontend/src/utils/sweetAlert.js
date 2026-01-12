import Swal from "sweetalert2";

export const simpleAlert = (titulo, mensage, icon) => {
    return Swal.fire({
        title: titulo,
        text: mensage,
        icon: icon
    })
}

export const questionAlert = (titulo, mensage, icon, cancelLbl, confirmLbl) => {
    return Swal.fire({
        title: titulo,
        text: mensage,
        icon: icon,
        showCancelButton: true,
        cancelButtonAriaLabel : cancelLbl ?? 'Cancelar',
        confirmButtonText: confirmLbl ?? 'Aceptar',
    })
}
