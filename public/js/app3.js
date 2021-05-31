
fetch('/users/me').then((response) => {
    return response.json()
}).then((data) => {
    const name = data.name
    const email = data.email
    const age = data.age
    // console.log(name)
    document.getElementById('name').innerHTML = name
    document.getElementById('email').innerHTML = email
    document.getElementById('age').innerHTML = age
    document.getElementById('update-input1').value = name
    document.getElementById('update-input2').value = email
    document.getElementById('update-input3').value = age
})

const message1 = document.querySelector('#m1')
function updatepro() {
    // var flag = 1;
    const newname = document.querySelector('#update-input1').value
    const newemail = document.querySelector('#update-input2').value
    const newage = document.querySelector('#update-input3').value
    message1.innerHTML = `Updating...`
    fetch('/users/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({
            name: newname,
            email: newemail,
            age: newage
        })
    }).then((response) => {
        if (!response.ok) {
            throw "Email already taken"
        }

        data = response.json()
        document.getElementById('name').innerHTML = data.name
        document.getElementById('email').innerHTML = data.email
        document.getElementById('age').innerHTML = data.age
        location.href = '/profile'
    }).catch((error) => {
        console.log(error)
        message1.innerHTML = `<div class="red-alert">${error}</div>`
    })
}

function toggle1() {
    document.getElementById('update-input1').style.cssText = 'display: inline-block;'
    document.getElementById('ub1').style.cssText = 'display: none;'
}
function toggle2() {
    document.getElementById('update-input2').style.cssText = 'display: inline-block;'
    document.getElementById('ub2').style.cssText = 'display: none;'
}
function toggle3() {
    document.getElementById('update-input3').style.cssText = 'display: inline-block;'
    document.getElementById('ub3').style.cssText = 'display: none;'
}

function deleteaccount() {
    var r = confirm("Are you sure you want to permanently delete your Account!")
    if (r == false) {
        location.href = "/profile"
    }
    else {
        fetch('/users/deleteaccount', {
            method: 'POST'
        }).then(() => {
            console.log("deleted")
        }).catch((e) => {
            console.log(e)
        })
    }

}