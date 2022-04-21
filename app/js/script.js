'use-strict'

const menuButton = document.querySelector('#menu')
const menuModal = document.querySelector('#menu-modal')

menuButton.addEventListener('click', () => {
  if(checkModalStatus()) return menuModal.close()
  menuModal.show()
})

function checkModalStatus() {
  let status = menuModal.getAttribute('open')
  return status===null ? false : true
}
