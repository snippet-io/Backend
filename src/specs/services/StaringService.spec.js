jest.mock("../../querybuilders/Staring");
jest.mock("../../querybuilders/Code");
const { CodeBuilder } = require("../../models/Code");
const CodeQueryBuilder = require("../../querybuilders/Code");
const StaringQueryBuilder = require("../../querybuilders/Staring");
const StaringService = require("../../services/StaringService");
const ServiceTime = require("../../utils/ServiceTime");

const sample_stared_code = new CodeBuilder("코드제목", "rust", 1)
  .setContent("내용")
  .setDescription("설명")
  .setId(1)
  .setCreatedDatetime(new ServiceTime("2021-04-19T00:00:00.000Z"))
  .build();

describe("Code 서비스 단위 테스트", () => {
  beforeEach(() => {
    StaringQueryBuilder.mockClear();
    CodeQueryBuilder.mockClear();
  });
  it("코드 스타하기 테스트", async () => {
    await StaringService.starCode(1, 2);
    const staring = await new StaringQueryBuilder().findAll().excute();
    expect(staring).toContainEqual({ code_id: 1, user_id: 2 });
  });
  it("코드 언스타하기 테스트", async () => {
    await StaringService.unstarCode(1, 1);
    const staring = await new StaringQueryBuilder().findAll().excute();
    expect(staring).not.toContainEqual({ code_id: 1, user_id: 1 });
  });
  it("유저가 스타한 코드들", async () => {
    const result = await StaringService.getStaredCodeByUser(1);
    expect(result).toEqual([sample_stared_code]);
  });
});
