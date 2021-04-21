const ServiceTime = require("../../utils/ServiceTime");
const {DateTime} = require('luxon');

Date.now = jest.fn()
    .mockImplementation(() => new Date('2021-04-19'));

describe('ServiceTime 모듈 테스트', () => {
    it('luxon 객체로 생성', () => {
        const time = new ServiceTime(DateTime.now().setZone('Asia/Seoul', { keepLocalTime: true }));
        expect(time.toString()).toBe('2021-04-19T00:00:00.000+09:00')
    });
    it('ISO 표준으로 생성', () => {
        const time = new ServiceTime('2021-04-19T00:00:00.000+08:00');
        expect(time.toString()).toBe('2021-04-19T01:00:00.000+09:00');
    });
});