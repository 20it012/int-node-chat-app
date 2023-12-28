const socket = io()
//elements
const $messageForm = document.querySelector('#form-message')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $message = document.querySelector('#messages')
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMesageTamplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//opetion
const { username, Room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    const $newMessage = $message.lastElementChild
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $message.offsetHeight

    const containerHeight = $message.scrollHeight
    const scrollOffset = $message.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $message.scrollTop = $message.scrollHeight
    }

}

const $sendLocationButton = document.querySelector('#send-location')
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMesageTamplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ Room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        Room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabeled')
    //disable
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (message) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        //enable
        console.log('message was delivered!', message)
    })
})
$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('geolocation is not supported by browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
//       console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})

            // socket.on('countUpdated', (count) => {
            //     console.log('count is updated', count)
            // })
 
            // document.querySelector('#increment').addEventListener('click', () => {
            //     console.log('clicked')
            //     socket.emit('increment')
            // }) 

socket.emit('join', { username, Room}, (error) => {
     if(error) {
        alert(error)
        location.href = '/'
     }
}) 