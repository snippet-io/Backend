const StaringQueryBuilder = require('../querybuilders/Staring');

class StaringService {
    static async starCode(code_id, user_id) {
        await new StaringQueryBuilder().create({code_id, user_id}).excute();
    }
}

module.exports = StaringService;