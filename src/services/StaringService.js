const StaringQueryBuilder = require('../querybuilders/Staring');

class StaringService {
    static async starCode(code_id, user_id) {
        await new StaringQueryBuilder().create({code_id, user_id}).excute();
    }
    static async unstarCode(code_id, user_id) {
        await new StaringQueryBuilder().delete({code_id, user_id}).excute();
    }
    static async getStaredCodeByUser(user_id) {
        const starings_of_user = await new StaringQueryBuilder().findAll().filterByUser(user_id).includeStaredCode().excute();
        const result = starings_of_user.map(staring => staring.stared_code);
        return result;
    }
}

module.exports = StaringService;