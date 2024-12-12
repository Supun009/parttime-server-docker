
const jwt = require('jsonwebtoken');

function generateResetToken(userId) {

    const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
    return resetToken;
}

module.exports = { generateResetToken };
