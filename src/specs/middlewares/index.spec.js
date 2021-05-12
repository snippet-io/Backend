jest.mock("../../external/GithubApp");
jest.mock("../../configs");
process.env.TOKEN_SECRET = "token_secret";
jest.spyOn(Date, "now").mockImplementation(() => 1616466983480);

const { AccessTokenExtractor } = require("../../apis/middlewares");
const GithubApp = require("../../external/GithubApp");
const FakeRequestBuilder = require("../FakeRequest");
const FakeResponse = require("../FakeResponse");
const sample_stringified_access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJ1c2VyX2lkIjo1LCJvYXV0aF90b2tlbiI6Im1vY2tlZF9vYXV0aF90b2tlbiIsImlhdCI6MTYxNjQ2Njk4MywiZXhwIjoxNjE3MDcxNzgzfQ.nYIxhfwLvVTu1fNI4RMdvsdiLapX0Lh26fLh50pqCFU";
const sample_expired_stringified_access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJ1c2VyX2lkIjo1LCJvYXV0aF90b2tlbiI6Im1vY2tlZF9vYXV0aF90b2tlbiIsImlhdCI6MTYxNDQ2Njk4MywiZXhwIjoxNjE1MDcxNzgzfQ.3_3aR20bB-E9EYrXZrGL663uDLevS4PThkV41EaPMxI";

const { Unauthorized, Forbidden } = require("../../errors/HttpException");

describe("미들웨어에 대한 단위 테스트", () => {
  describe("AccessTokenExtractor 테스트", () => {
    it("엑세스 토큰 객체 발행 성공", async () => {
      GithubApp.mockImplementation(() => {
        return {
          getUserByAccessToken: () => {
            return {
              id: 5,
            };
          },
        };
      });
      const github_app = new GithubApp();

      const req = new FakeRequestBuilder()
        .setHeader({ Authorization: sample_stringified_access_token })
        .build();
      const res = new FakeResponse();
      await AccessTokenExtractor(req, res);

      const objectified_token = req.auth;

      expect(objectified_token.getUserId()).toBe(5);
      expect(objectified_token.getOauthToken()).toBe("mocked_oauth_token");
      expect(objectified_token.toString()).toBe(
        sample_stringified_access_token
      );
    });
    it("엑세스 토큰 만료", async () => {
      GithubApp.mockImplementation(() => {
        return {
          getUser: () => {
            return {
              id: 5,
            };
          },
        };
      });

      const req = new FakeRequestBuilder()
        .setHeader({ Authorization: sample_expired_stringified_access_token })
        .build();
      const res = new FakeResponse();
      await expect(AccessTokenExtractor(req, res)).rejects.toThrow(Forbidden);
    });
    it("유효하지 않은 엑세스 토큰", async () => {
      GithubApp.mockImplementation(() => {
        return {
          getUser: () => {
            return {
              id: 5,
            };
          },
        };
      });

      const req = new FakeRequestBuilder().setHeader({}).build();
      const res = new FakeResponse();
      await expect(AccessTokenExtractor(req, res)).rejects.toThrow(
        Unauthorized
      );
    });
  });
});
