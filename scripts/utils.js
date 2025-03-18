const logoutMenu = document.getElementById('logout-menu')

function toggleLogoutMenu(){
    logoutMenu.classList.toggle('d-none')
}

function toggleContactMenu(){
    document.getElementById('con-display').classList.toggle('d-none');
    document.getElementById('con-sidebar').style.display = 'unset';
}