const { NotFound, Forbidden } = require('../../../errors/HttpException');
const { CodeBuilder } = require('../../../models/Code');
const Option = require('../../../utils/option');
const ServiceTime = require('../../../utils/ServiceTime');

let mocking_code_datas;
const mock = {};
mock.mockClear = jest.fn().mockImplementation(() => {
    mocking_code_datas = [ new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build() ];
    
});
mock.repo = {
    hasMany: jest.fn(),
    belongsTo: jest.fn()
};

mock.findAll = jest.fn()
    .mockImplementation(() => {
        return mocking_code_datas.map((code) => {
            code.content = undefined;
            code.description = undefined;
            return code;
        });
    });
mock.findById = jest.fn()
    .mockImplementation(id => {
        let result = mocking_code_datas.filter(code => code.getId() == id)[0];

        result = result? Option.some(result) : Option.none;
        return result;
    });
mock.create = jest.fn()
    .mockImplementation((code) => {
        const new_code = new CodeBuilder(code.getTitle(), code.getLanguage(), code.getAuthorId())
            .setContent(code.getContent())
            .setDescription(code.getDescription())
            .setId(2)
            .build();
        mocking_code_datas.push(new_code);
    });
mock.delete = jest.fn()
    .mockImplementation((code_id) => {
        const before_len = mocking_code_datas.length;
        mocking_code_datas = mocking_code_datas.filter(code => code.getId() !== code_id);
        const after_len = mocking_code_datas.length;

        if(before_len == after_len) {
            throw new NotFound;
        }
    });
mock.update = jest.fn()
    .mockImplementation(code => {
        const before_len = mocking_code_datas.length;
        mocking_code_datas = mocking_code_datas.filter(c => c.getId() !== code.getId() || c.getAuthorId() !== code.getAuthorId());
        const after_len = mocking_code_datas.length;

        if(before_len == after_len) {
            throw new Forbidden;
        }

        mocking_code_datas.push(code);
    });
mock.findByAuthorId = jest.fn()
    .mockImplementation(author_id => {
        const result = mocking_code_datas.filter(code => code.getAuthorId() == author_id);
        return result;
    });
mock.findAllLimitedTo = jest.fn()
    .mockImplementation((limit, offset) => {
        return mocking_code_datas.slice(offset, offset + limit);
    });
module.exports = mock;