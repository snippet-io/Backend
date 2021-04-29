
const StaringQueryBuilder = jest.fn()
    .mockImplementation(() => ({
        findAll: function () {
            this.result = db;
            return this;
        },
        create: function (staring) {
            db.push(staring);
            return this;
        },
        excute: function () {
            if(this.cb) {
                return this.cb(this.result).length;
            }
            return this.result;
        }
    }));

StaringQueryBuilder.mockClear = () => {
    db = [{code_id: 1, user_id: 1}];
}

module.exports = StaringQueryBuilder;