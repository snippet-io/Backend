const { CodeBuilder } = require("../../models/Code");
const { UserBuilder } = require("../../models/User");
const ServiceTime = require("../../utils/ServiceTime");


const UserQueryBuilder = jest.fn()
    .mockImplementation(() => ({
        all: true,
        findAll: function () {
            this.result = db;
            return this;
        },
        findByPk: function (id) {
            this.result = db.filter(u => u.id == id)[0];
            return this;
        }, 
        create: function (user) {
            db.push(user);
            return this;
        },
        upsert: function (user) {
            const index = db.findIndex(u => u.getId() == user.getId());
            if(index == -1) {
                db.push(user);
            }
            else {
                db[index] = user;
            }
            return this;
        },
        includeCode: function () {
            if(this.result instanceof Array == false) {
                code_db.forEach(code =>{
                    this.result.addCode(code);
                });
            }
            return this;
        },
        excute: function () {
            if(this.cb) {
                return this.cb(this.result).length;
            }
            return this.result;
        }
    }));

UserQueryBuilder.mockClear = () => {
    db = [ new UserBuilder(1, 'Jungwoo-Son').build() ];
    code_db = [ new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build() ];
}

module.exports = UserQueryBuilder;