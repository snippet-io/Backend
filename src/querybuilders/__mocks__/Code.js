const { NotFound } = require("../../errors/HttpException");
const { CodeBuilder } = require("../../models/Code");
const Option = require("js-option");
const ServiceTime = require("../../utils/ServiceTime");

let db;
const CodeQueryBuilder = jest.fn().mockImplementation(() => ({
  all: true,
  findAll: function () {
    this.result = db;
    return this;
  },
  create: function (code) {
    db.push(code);
    return this;
  },
  update: function (code) {
    this.cb = (list) => {
      list.map((c) => {
        c.title = code.title ?? c.title;
        c.content = code.content ?? c.contetn;
        c.description = code.description ?? c.description;
        c.language = code.language ?? c.language;
        c.author.id = code.author.id ?? c.author.id;
      });
      return list;
    };
    const index = db.findIndex((c) => c.getId() == code.getId());
    if (index == -1) {
      throw new NotFound();
    }
    this.result = [db[index]];
    return this;
  },
  delete: function (id) {
    this.cb = (list) => {
      db = db.filter(
        (c) => list.reduce((acc, cur) => acc || cur == c) == false
      );
      return list;
    };
    const index = db.findIndex((c) => c.getId() == id);
    if (index == -1) {
      throw new NotFound();
    }
    this.result = [db[index]];
    return this;
  },
  findByPk: function (id) {
    this.result = db.filter((r) => r.getId() == id);
    if (this.result.length == 0) {
      this.result = Option.none;
    } else {
      this.result = Option.some(this.result[0]);
    }
    return this;
  },
  filterByLanguage: function (language) {
    this.result = this.result.filter((r) => r.getLanguage() == language);
    return this;
  },
  filterByAuthorId: function (author_id) {
    this.result = this.result.filter((r) => r.getAuthorId() == author_id);
    return this;
  },
  paginate: function (limit, offset) {
    this.result = this.result.splice(offset, offset + limit);
    return this;
  },
  searchOnTitleAndContent: function (search) {
    this.result = this.result.filter(
      (r) => r.title.indexOf(search) != -1 || r.content.indexOf(search) != -1
    );
    return this;
  },

  excute: function () {
    if (this.cb) {
      return this.cb(this.result).length;
    }
    return this.result;
  },
}));

CodeQueryBuilder.mockClear = () => {
  db = [
    new CodeBuilder("코드제목", "rust", 1)
      .setContent("내용")
      .setId(1)
      .setDescription("설명")
      .setCreatedDatetime(new ServiceTime("2021-04-19T00:00:00.000Z"))
      .build(),
  ];
};

module.exports = CodeQueryBuilder;
