
const inputlogin = document.querySelector('form')
const input1 = document.querySelector('#inputEmail3')
const input2 = document.querySelector('#inputPassword3')
// const message2 = document.querySelector('#m2')
const message1 = document.querySelector('#m1')

preload1 = document.getElementById('preload1')
preload1.style.cssText = 'visibility: hidden;'

preload2 = document.getElementById('preload2')
preload2.style.cssText = 'visibility: hidden;'

preload2 = document.getElementById('preload3')
preload2.style.cssText = 'visibility: hidden;'

preload2 = document.getElementById('preload4')
preload2.style.cssText = 'visibility: hidden;'

preload2 = document.getElementById('preload5')
preload2.style.cssText = 'visibility: hidden;'


inputlogin.addEventListener('submit', (e) => {
    const email = input1.value
    const password = input2.value
    e.preventDefault()
    message1.textContent = ('Please Wait...')

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then((response) => {
        console.log(response)
        if (!response.ok) {
            throw ("Invalid Credentials!")
        }
        console.log("working")
        fetch('/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }

        }).then((response) => {
            console.log("ayush1")
            return response.json()
        }).then((data) => {
            console.log(data)
            location.href = "/test"
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
        message1.innerHTML = (`<div class="red-alert">${err}</div>`)
    })

})