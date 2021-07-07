const login = document.querySelector('.login-button')

if (login) {
  login.addEventListener('click', event => {
    const form = document.querySelector('.login')
    form.classList.add('was-validated')
  })
}