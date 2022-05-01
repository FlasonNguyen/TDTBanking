//create User model in mongoose
const mongoose = require('mongoose')
const StudentDept = new mongoose.Schema({
    fullname: {type: String, required: true},
    studentId: {type: String, required: true},
    dept: {type: Number, required: true},
})

module.exports = mongoose.model('StudentDept', StudentDept)