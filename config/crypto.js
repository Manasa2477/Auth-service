const crypto = require("crypto")
function hashnumber(phoneNumber){
     const hash = crypto.createHash('sha256'); // or 'md5', 'sha512'
  hash.update(phoneNumber.toString());
  return hash.digest('hex');
}

module.exports={hashnumber};