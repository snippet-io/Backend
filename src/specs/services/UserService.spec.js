jest.mock('../../querybuilders/User');
const { CodeBuilder } = require("../../models/Code");
const UserService = require('../../services/UserService');
const ServiceTime = require('../../utils/ServiceTime');
const UserQueryBuilder = require('../../querybuilders/User');
const { UserBuilder } = require("../../models/User");

const sample_user = new UserBuilder(1).build();
const sample_code = new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setDescription('설명').setId(1).setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build();

describe('User 서비스 단위 테스트', () => {
    beforeEach(() => {
        UserQueryBuilder.mockClear();
    });
    it('User의 코드 목록 얻기', async () => {
        const codes = await UserService.getCodesOfUser(1);
        expect(codes).toEqual([sample_code]);
    });
});