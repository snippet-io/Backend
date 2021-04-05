const ModelBuilder = require('./ModelBuilder');

class Code {
    getId() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    
    getContent() {
        return this.content;
    }
    setContent(content) {
        this.content = content;
    }

    getDescription() {
        return this.description;
    }
    setDescription(description) {
        this.description = description;
    }

    getLanguage() {
        return this.language;
    }
    getAuthorId() {
        return this.author.id;
    }
    getAuthor() {
        return this.author;
    }


    toJSON() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            description: this.description,
            language: this.language,
            author: this.author.id
        };
    }
}

class CodeBuilder extends ModelBuilder{
    constructor(title, language, author_id) {
        super(Code);
        this.title = title;
        this.content = null;
        this.language = language;
        this.author = { id: author_id };
        this.id = null;
    }
    setContent(content) {
        this.content = content;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    setAuthor(user) {
        this.author = user;
        return this;
    }
}
module.exports = {
    Code,
    CodeBuilder
};