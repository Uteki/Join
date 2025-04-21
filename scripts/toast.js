/**
 * Creates a toast message if its succeeds and display it <showToast>
 *
 * @param {string} message - Takes a string that contains a message
 */
function createSuccessToast(message){
    document.querySelector('main').innerHTML += successToastNotificationTemplate(message, 'success');
    showToast('success');
}

/**
 * Creates a toast message if it fails and display it <showToast>
 *
 * @param {string} message  - Takes a string that contains an error message
 */
function createErrorToast(message){
    document.querySelector('main').innerHTML += errorToastNotificationTemplate(message, 'error');
    showToast('error');
}

/**
 * Displays the toast message box and sets a timeout to remove it
 *
 * @param {string} type - Identifies what type of toast message it is
 */
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
  