'use-strict'

const menuButton = document.querySelector('#menu')
const menuModal = document.querySelector('#menu-modal')

const checkModalStatus = () => {
  let status = menuModal.getAttribute('open')

  return status===null ? false : true
}

menuButton.addEventListener('click', () => {
  if(checkModalStatus()) return menuModal.close()
  menuModal.show()
})

/*

*/

class ShortenUrl {
  _shortenUrl = []

  // constructor(input) {
  //   this.shortenUrl = input
  // }

  get shortenUrl() {
    return this._shortenUrl
  }

  set shortenUrl(input) {
    fetch(`https://api.shrtco.de/v2/shorten?url=${input}`)
    .then(response => {
      if(response.status!==201) throw new Error(response.statusText)
      return response.json()
    })
    .then(data => {
      this._shortenUrl.push({
        link: input, 
        shortenedLink: data.result.full_short_link
      })
      console.log(this._shortenUrl)
    })
    .catch(err => {
      console.log(err)
    })
  }
}

class DisplayShortenedLink extends ShortenUrl {

}

class CopyShortenedLink extends ShortenUrl {
  
}

const checkShortenUrlInput = input => {
  let validUrl = /^(ftp|http|https):\/\/[^ "]+$/

  if(!input) {
    displayErrorMessage('Please add a link')
    return false
  }

  return validUrl.test(input) ? true : false
}

const displayErrorMessage = errorMsg => {
  const errorContainer = document.createElement('span')
  const inputLabel = document.querySelector('.input-label')
  const urlInput = document.querySelector('#url-input')
  const shortenForm = document.querySelector('.shorten')

  urlInput.classList.add('shorten__input--error')
  shortenForm.classList.add('shorten__error')
  errorContainer.setAttribute('id', 'error-msg')
  errorContainer.innerText = errorMsg
  inputLabel.appendChild(errorContainer)
}

const clearErrorMessage = () => {
  const errorContainer = document.querySelector('#error-msg')
  const inputLabel = document.querySelector('.input-label')
  const urlInput = document.querySelector('#url-input')
  const shortenForm = document.querySelector('.shorten')

  if(!errorContainer) return

  urlInput.classList.remove('shorten__input--error')
  shortenForm.classList.remove('shorten__error')
  inputLabel.removeChild(errorContainer)
}

const shortenUrlForm = document.querySelector('.shorten')
const shortenUrlInput = document.querySelector('#url-input')
const user = new ShortenUrl()

shortenUrlForm.addEventListener('submit', ev => {
  ev.preventDefault()

  if(checkShortenUrlInput(shortenUrlInput.value)){
    user.shortenUrl = shortenUrlInput.value
    clearErrorMessage()
  }
})