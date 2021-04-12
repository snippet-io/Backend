const { CodeBuilder } = require('../../../models/Code');

let mocking_code_datas;
const mock = {};
mock.mockClear = jest.fn().mockImplementation(() => {
    mocking_code_datas = [ new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').build() ];
    
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
    .mo
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
        mocking_code_datas = mocking_code_datas.filter(code => code.getId() !== code_id);
    });

module.exports = mock;