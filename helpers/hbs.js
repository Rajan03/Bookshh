const moment = require("moment");
module.exports = {
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: (bookUser, loggedUser, bookId) => {
    if (bookUser._id.toString() == loggedUser._id.toString()) {
      return `<a href="/books/edit/${bookId}" class="editBtn">edit</a>`;
    } else {
      return "";
    }
  },
  select: (selected, options) => {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
