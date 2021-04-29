
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
        delete: function (staring) {
            this.cb = (list_to_be_deleted) => {
                db = db.filter(s => list_to_be_deleted.findIndex(d => d.user_id === s.user_id && d.code_id === s.code_id) > 0);
                return list_to_be_deleted;
            };
            const index = db.findIndex(s => staring.user_id === s.user_id && staring.code_id === s.code_id);
            if(index == -1) {
                throw new NotFound;
            }
            this.result = [db[index]];
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