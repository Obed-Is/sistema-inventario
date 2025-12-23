import Swal from "sweetalert2";

export const simpleAlert = (titulo, mensage, icon) => {
    return Swal.fire({
        title: titulo,
        text: mensage,
        icon: icon
    })
}
