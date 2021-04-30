const { CodeBuilder } = require("../../models/Code");
const ServiceTime = require("../../utils/ServiceTime");

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
        filterByUser(user_id) {
            this.result = this.result.filter(staring => staring.user_id == user_id);
            return this;
        },
        filterByCode: function(code_id) {
            this.result = this.result.filter(staring => staring.code_id == code_id);
            return this;
        },
        count: function() {
            this.cb = (list) => list;
            this.result = db;
            return this;
        },
        includeStaredCode: function () {
            if(this.result instanceof Array == false) {
                code_db.forEach(code =>{
                    this.result.stared_code = code;
                });
            }
            else {
                this.result.map(staring => {
                    staring.stared_code = code_db[code_db.findIndex(code => code.id === staring.code_id)];
                    return staring;
                });
            }
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
    code_db = [ new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build() ];
}

module.exports = StaringQueryBuilder;