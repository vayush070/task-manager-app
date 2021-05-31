const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT

// app.set('views',path.join(__dirname , "..", "frontend", "html") );
// app.engine('html', require('ejs').renderFile);
const public_dir = path.join(__dirname, '../public')
const customviews = path.join(__dirname, '../templates/views')
const partialspath = path.join(__dirname, '../templates/partials')

app.use(express.static(public_dir))

app.set('view engine', 'hbs')
app.set('views', customviews)
hbs.registerPartials(partialspath)

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(cookieParser())


app.listen(port, () => {
    console.log('server is up on port ' + port)
})
