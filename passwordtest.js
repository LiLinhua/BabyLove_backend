const bcrypt = require('bcryptjs');

console.log(bcrypt.hashSync('llh#cfy@20170716', bcrypt.genSaltSync(10)));
