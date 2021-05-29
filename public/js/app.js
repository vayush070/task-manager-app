
const inputlogin = document.querySelector('form')
const input1 = document.querySelector('#inputEmail3')
const input2 = document.querySelector('#inputPassword3')
// const message2 = document.querySelector('#m2')
const message1 = document.querySelector('#m1')

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
        if(!response.ok){
            throw ("Invalid Credentials!")
        }
        console.log("working")
        // location.href = "/tasks"
        fetch('/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                // 'token': document.cookie.replace("token=", "")
            }

        }).then((response) => {
            console.log("ayush1")
            return response.json()
            // // data = response.json(); 
            // response.json().then((data) => {
            //     // console.log(data[0].status);
            //     // message2.textContent = (data[0].status)
            //     // location.href = "/test"
            // })
            // // console.log(data[0])
            // // location.href ="/test"
        }).then((data) => {
            console.log(data)
            
            // fetch('/test').then(() => {
            //     document.querySelector('#m2').innerHTML = '<h1>Hello</h1>'
            // })
            location.href = "/test"
            // document.querySelector('#m2').innerHTML = '<h1>Hello</h1>'
            
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
        message1.innerHTML = (`<div class="red-alert">${err}</div>`)
    })

})