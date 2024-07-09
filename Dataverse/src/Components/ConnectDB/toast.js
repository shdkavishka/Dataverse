// toast.js
import Swal from 'sweetalert2';

export const toast = (message, type) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: type,
    title: message,
  });
};
