function createSuccessToast(message){
    document.querySelector('main').innerHTML += successToastNotificationTemplate(message, 'success');
    showToast('success');
}


function createErrorToast(message){
    document.querySelector('main').innerHTML += errorToastNotificationTemplate(message, 'error');
    showToast('error');
}

function showToast(type) { 
    const toast = document.getElementById(`${type}ToastNotification`)
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
  
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
}
  