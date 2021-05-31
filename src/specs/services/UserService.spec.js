jest.mock("../../querybuilders/User");
jest.mock("../../querybuilders/Code");
jest.mock("../../querybuilders/Staring");
jest.mock("../../external/GithubApp");
const { CodeBuilder } = require("../../models/Code");
const UserService = require("../../services/UserService");
const ServiceTime = require("../../utils/ServiceTime");
const UserQueryBuilder = require("../../querybuilders/User");
const CodeQueryBuilder = require("../../querybuilders/Code");
const { UserBuilder } = require("../../models/User");
const GithubApp = require("../../external/GithubApp");
const StaringQueryBuilder = require("../../querybuilders/Staring");

const sample_user = new UserBuilder(1).build();
const sample_code = new CodeBuilder("코드제목", "rust", 1)
  .setContent("내용")
  .setDescription("설명")
  .setId(1)
  .setCreatedDatetime(new ServiceTime("2021-04-19T00:00:00.000Z"))
  .build();
sample_code.setStarCount(1);

describe("User 서비스 단위 테스트", () => {
  beforeEach(() => {
    UserQueryBuilder.mockClear();
    CodeQueryBuilder.mockClear();
    StaringQueryBuilder.mockClear();
  });
  it("User의 코드 목록 얻기", async () => {
    const codes = await UserService.getCodesOfUser(1);
    expect(codes).toEqual([sample_code]);
  });
  it("User의 코드 목록 중 특정 언어인 코드들 얻기", async () => {
    const codes = await UserService.getCodesOfUser(1, { language: "rust" });
    expect(codes).toEqual([sample_code]);
  });
  it("User의 프로필 얻기", async () => {
    GithubApp.mockImplementation(() => ({
      getUserById: (id) =>
        id == 1
          ? {
              id: 1,
              login: "Jungwoo-Son",
            }
          : undefined,
      getUser: (user_name) =>
        user_name == "Jungwoo-Son"
          ? {
              name: "Jungwoo Son",
              id: 1,
              avatar_url:
                "https://avatars.githubusercontent.com/u/44115353?v=4",
            }
          : undefined,
    }));
    const user_profile = await UserService.getUser(1);
    expect(user_profile).toEqual({
      id: 1,
      name: "Jungwoo Son",
      profile_image_url: "https://avatars.githubusercontent.com/u/44115353?v=4",
    });
  });
});
