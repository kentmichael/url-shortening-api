'use-strict'

/*
  Responsive landing page integrated with 
  shrtcode API - https://app.shrtco.de/
*/

const menuButton = document.querySelector('#menu')

menuButton.addEventListener('click', () => {
  if(!document.querySelector('#menu-modal')) 
    return createDialog()

  document.querySelector('#menu-modal').close()
  removeDialog()
})

const removeDialog = () => {
  const nav = document.querySelector('.nav')
  const dialog = document.querySelector('#menu-modal')
  nav.removeChild(dialog)
}

const createDialog = () => {
  const nav = document.querySelector('.nav')
  const dialog = document.createElement('dialog')
  const ul = document.createElement('ul')
  const hr = document.createElement('hr')
  const dialogContent = ['Features', 'Pricing', 'Resources', 'hr', 'Login', 'Sign Up']

  dialogContent.forEach(element => {
    const li = document.createElement('li')
    const link = document.createElement('a')

    if(element==='Sign Up') link.classList.add('cta')

    if(element!=='hr') {
      link.setAttribute('href', '#')
      link.innerText = element
      li.appendChild(link)
    }else {
      li.appendChild(hr)
    }

    ul.appendChild(li)
  })

  ul.classList.add('menu-links')
  dialog.open = true
  dialog.id = 'menu-modal'
  dialog.classList.add('container')
  dialog.appendChild(ul)
  nav.appendChild(dialog)
}

class ShortenUrl {
  _shortenUrl = []
  _linkId = 0

  get shortenUrl() {
    return this._shortenUrl
  }

  set shortenUrl(input) {
    if(Array.isArray(input)) {
      this._shortenUrl = structuredClone(input)
      this._linkId = this._shortenUrl[this._shortenUrl.length - 1].linkId
      displayResults(this.shortenUrl)
    }else {
      fetch(`https://api.shrtco.de/v2/shorten?url=${input}`)
      .then(response => {
        if(response.status!==201) throw new Error(response.statusText)
        return response.json()
      })
      .then(data => {
        let id = this._linkId + 1
        this._linkId = id
        this._shortenUrl.push({
          linkId: id,
          link: input, 
          shortenedLink: data.result.full_short_link
        })
        displayItem( id, input, data.result.full_short_link )
        saveResultsToLocalStorage(this.shortenUrl)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}

function saveResultsToLocalStorage(results) {
  localStorage.setItem('shortlyLinks', JSON.stringify(results))
  console.log('Save item to localStorage...')
}

function displayItem( linkId, link, shortenedLink ) {
  const itemDiv = document.createElement('div')
  const longLink = document.createElement('span')
  const shortLink = document.createElement('span')
  const copyLink = document.createElement('button')

  longLink.classList.add('features__results--link')
  longLink.innerText = link
  shortLink.classList.add('features__results--shortenlink')
  shortLink.innerText = shortenedLink
  copyLink.innerText = 'Copy'
  copyLink.setAttribute('id', 'copy-link')
  copyLink.classList.add('cta', `link${linkId}`)
  copyLink.addEventListener('click', () => {
    copyShortenedLink( `link${linkId}`, shortenedLink )
  })

  itemDiv.append(longLink, shortLink, copyLink)
  displayItemContainer(itemDiv)
}

function displayItemContainer(itemDiv) {
  let resultContainer

  if(document.querySelector('#features-result')) {
    resultContainer = document.querySelector('#features-result')
  }else {
    const parent = document.querySelector('.features')
    resultContainer = document.createElement('div')
    resultContainer.setAttribute('id', 'features-result')
    resultContainer.classList.add('features__results')
    resultContainer.classList.add('container')
    parent.insertAdjacentElement( "afterbegin", resultContainer )
  }

  return resultContainer.prepend(itemDiv)
}

function copyShortenedLink( linkId, link ) {
  navigator.clipboard.writeText(link)
  .then(() => {
    const copyButton = document.querySelector(`.${linkId}`)
    copyButton.innerText = 'Copied!'
    copyButton.classList.add('features__results--copiedlink')
  })
  .catch(err => console.log(err))
}

function displayResults(items) {

  items.forEach( ({linkId, link, shortenedLink}) => {
    displayItem( linkId, link, shortenedLink )
  })
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
  let errorContainer = document.createElement('span')

  if(document.querySelector('#error-msg'))
    errorContainer = document.querySelector('#error-msg')

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

if(localStorage.getItem('shortlyLinks')) {
  user.shortenUrl = JSON.parse(localStorage.getItem('shortlyLinks'))
  console.log('Load items from localStorage...')
}

shortenUrlForm.addEventListener('submit', ev => {
  ev.preventDefault()

  if(checkShortenUrlInput(shortenUrlInput.value)){
    user.shortenUrl = shortenUrlInput.value
    shortenUrlInput.value = ''
    clearErrorMessage()
  }
})