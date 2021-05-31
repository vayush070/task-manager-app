
const message1 = document.querySelector('#m2')
var i = 0
var flag = 1;
gettask(i)
// var task_count = 0;

document.querySelector('#next-btn').addEventListener('click', (e) => {
    
    // console.log(flag)
    // console.log(i);
    if (flag) {
        document.querySelector('.loader').style.cssText = 'display: block;'
        i = i + 4
        gettask(i)
    }


})

document.querySelector('#prev-btn').addEventListener('click', (e) => {
    document.querySelector('.loader').style.cssText = 'display: block;'
    if (i >= 3) {
        i = i - 4
        gettask(i)
    }
    else{
        document.querySelector('.loader').style.cssText = 'display: none;'
    }
})


function gettask(i) {
    document.querySelector('.loader').style.cssText = 'display: none;'
    fetch('/tasks?sortBy=createdAt:desc&limit=4&skip=' + i, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
            // 'token': document.cookie.replace("token=", "")
        }

    }).then((response) => {
        // console.log("ayush1")
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
        // console.log(data[0].username)
        // console.log(i)
        // console.log("data length: " + data.length)
        // fetch('/test').then(() => {
        //     document.querySelector('#m2').innerHTML = '<h1>Hello</h1>'
        // })
        // const user_id = data[0].owner
        // console.log(user_name)
        var task_list_topic="1";
        var task_list_status="2";
        var num = i + 1;
        const name = data[0].username
        delete data[0]
        if(data.length === 1) {
            flag=0;
            task_list_topic = `<div class="addtaskhere">Add Tasks Here</div>`
            task_list_status = `<div class="addtaskhere">&rarr;</div>`
        }
        else {
            flag =1;
        }

        // console.log(data[1]._id)
        if (flag) {
            task_list_topic = data.map(task => {
                var color = "1";
                // console.log(data)
                // task_count++;
                if (task.status === 'on' || (task.status) === 'true') {
                    // console.log("green")
                    color = "rgb(63, 143, 52)"
                    color1 = "rgb(255, 246, 227)"
                }
                else {
                    // console.log("red")
                    color1 = "rgb(255, 246, 227)"
                    color = "rgb(238, 150, 36)"
                }
                // console.log(id)
                return `<div class="data_cont"><div style="background-color:${color};box-shadow:0px 0px 6px 2px ${color1};" id="bullet1" class="status-bullet"></div><p>${num++}. <b>${task.topic}</b></p></div>`
            }).join('')
            // console.log(task_list_topic)
            task_list_status = data.map(task => {
                var id = task._id;
    
                return `<div class="data_cont"><div class="marks"><button class="submit31" id="${'1' + id}" onclick=update(id)>Mark as Pending</button>
                                                                  <button class="submit32" id="${'2' + id}" onclick=update(id)>Mark as Done</button>
                                                                  <button class="btn" id="${id}" onclick=Delete(id)><i class="fa fa-trash"></i></button>
                                                                  </div><p><b>${(task.status) === 'on' || (task.status) === 'true' ? "Done" : "Pending"}</b></p></div>`
            }).join('')
        }
        
        
        
        // const task_status_list = data.map(task =>{
        //     return `<p>Status: ${task.status}</p>`
        // }).join('')
        // console.log(task_list)
        // const task = (data[1].topic)
        // const status = (data[1].status)
        // console.log(task)
        document.querySelector('#username_wel').innerHTML = `Hi, Welcome ${name}`
        const dropname = name[0].toUpperCase();
        document.getElementById('drop-name').innerHTML = `${dropname}`
        message1.innerHTML = task_list_topic
        document.querySelector('#m3').innerHTML = task_list_status
        // const bullets = ''
        // document.querySelector('#m1').innerHTML = bullets
        //  message2.innerHTML = task_status_list

    }).catch((err) => {
        console.log(err)
    })

    // console.log(i)


}
document.querySelector('.circle-head').addEventListener('click', (e) => {
    // console.log("clicked")
    document.getElementById('popup-id').style.cssText = 'display:block;'
})
document.querySelector('.close-button').addEventListener('click', (e) => {
    // console.log("clicked")
    document.getElementById('popup-id').style.cssText = 'display:none;'
})
// document.querySelector('.submit32').addEventListener('click',(e) => {
//     document.getElementById('bullet1').style.cssText = 'background-color:rgb(63, 143, 52);box-shadow:0px 0px 6px 2px rgb(63, 143, 52);'
// })
// document.querySelector('.submit31').addEventListener('click',(e) => {
//     document.getElementById('bullet1').style.cssText = 'background-color:rgb(238, 150, 36);box-shadow:0px 0px 6px 2px rgb(238, 150, 36);'
// })
console.log("working")
// location.href = "/tasks"


function update(id) {
    const w = id[0]
    id = id.slice(1);
    // console.log(id)
    status = (w === '1') ? "false" : "on"
    // console.log(status)
    document.querySelector('.loader').style.cssText = 'display: block;'
    fetch('/tasks/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            // 'token': document.cookie.replace("token=", "")
        },
        body: JSON.stringify({
            status: status
        })
    }).then((response) => {
        return response.json()
    }).then((data) => {
        gettask(i)
    })
}

function Delete(id) {
    // console.log(id)
    document.querySelector('.loader').style.cssText = 'display: block;'
    fetch('/tasks/' + id, {
        method: 'GET'
    }).then((response) => {
        return response.json()
    }).then((data) => {
        gettask(i)
    })
}
// const taskinput = document.querySelector('form')
// const topic = document.querySelector('#input-topic')
// const status = document.querySelector('#input-status')
// // console.log(topic.value)

// taskinput.addEventListener('submit', (e) => {
//     const topic =topic.value
//     const status = status.value
//     console.log(topic)
//     e.preventDefault()

//     fetch('/tasks', { 
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//         },
//         body: JSON.stringify({
//             topic: topic,
//             status: status
//         })
//     }).then(() => {
//         console.log("ayuhsbkjda")
//         // location.href = "/test"
//     }).catch((error) => {
//         console.log("kadajdkabsd")
//     })
// })

// document.querySelector('#click-task').addEventListener('click', (e) => {
//     location.href = "/test"
// })