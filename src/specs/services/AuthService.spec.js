jest.mock('axios');
jest.mock('../../configs');
jest.mock('../../repositories/definitions/UserRepo');
process.env.TOKEN_SECRET = 'token_secret';
jest.spyOn(Date, 'now').mockImplementation(() => 1616466983480);

const axios = require("axios");
const AuthService = require("../../services/AuthService");

const { UserRepo } = require('../../repositories');
const { UserBuilder } = require("../../models/User");

const sample_stringified_access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJ1c2VyX2lkIjo1LCJvYXV0aF90b2tlbiI6Im1vY2tlZF9vYXV0aF90b2tlbiIsImlhdCI6MTYxNjQ2Njk4MywiZXhwIjoxNjE3MDcxNzgzfQ.nYIxhfwLvVTu1fNI4RMdvsdiLapX0Lh26fLh50pqCFU';
const sample_stringified_access_token_for_unregistered_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJ1c2VyX2lkIjo4MTY1OCwib2F1dGhfdG9rZW4iOiJtb2NrZWRfb2F1dGhfdG9rZW4iLCJpYXQiOjE2MTY0NjY5ODMsImV4cCI6MTYxNzA3MTc4M30.RmbIW4SFcrf08bfZhN2bjHUrcrwB5Y0aRFtZTcFL1Xg';
describe('AuthService 단위 테스트', () => {
    describe('createAccessToken', () => {
        beforeEach(() => {
            UserRepo.mockClear();
        });
        it('등록된 유저 엑세스 토큰 발급 성공', async () => {
            const mocked_oauth_token = {access_token: 'mocked_oauth_token'};
            const mocked_user = { id: 5 };
            axios.post.mockResolvedValue({data: mocked_oauth_token});
            axios.get.mockResolvedValue({data: mocked_user});
    
            const access_token = await AuthService.createAccessToken('code');
            expect(access_token.toString()).toBe(sample_stringified_access_token);
        });
        it('미등록 유저 엑세스 토큰 발급 성공', async () => {
            const mocked_oauth_token = {access_token: 'mocked_oauth_token'};
            const mocked_user = { id: 81658 };
            axios.post.mockResolvedValue({data: mocked_oauth_token});
            axios.get.mockResolvedValue({data: mocked_user});

            const access_token = await AuthService.createAccessToken('code');
            expect(access_token.toString()).toBe(sample_stringified_access_token_for_unregistered_user);
            
            const users = await UserRepo.findAll();
            expect(users).toContainEqual(new UserBuilder(mocked_user.id).build());
        });
    });
});