const bcrypt = require('bcryptjs')

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(5)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function checkPass (password, hash) {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hashPassword, checkPass
}