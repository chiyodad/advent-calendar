var Day = Backbone.Model.extend({
  initialize: function (params) {
    this.set('day', params.day);
    this.set('author', params.author);
    this.set('empty', params.empty);
    this.set('title', params.title);
    this.set('link', params.link);
    this.set('force', params.force);
    this.set('active', params.day > 0 && params.day < 26 ? true : false);
    var date = new Date();
    this.set('linkActive', date.getMonth() == 11 && date.getDate() >= params.day ? true : false);
  }
});
var Days = Backbone.Collection.extend({ model: Day });

var CalendarView = Backbone.View.extend({
  el: $('#table-calendar'),

  initialize: function (days) {
    this.dayTemplate = _.template($('#cell-day').html());
    this.weekTemplate = _.template($('#cell-week').html());

    this.collection = new Days();
    _.each(days, function(day) {
      this.collection.add(new Day(day));
    }, this);
    this.render();
  },
  render: function () {

    var table = this.collection.reduce(function (table, day) {
      var lastRow = _.last(table);
      if (_.size(_.last(table)) == 7) {
        lastRow = [];
        table.push(lastRow);
      }
      lastRow.push(this.renderCelltoHtml(day));
      return table;
    }, [[]], this);

    html = _.chain(table)
      .map(function (row) {
      return this.weekTemplate({days: row.join('')});
      }, this).join('').value();

    this.$el.html(html);
    return this;
  },
  renderCelltoHtml: function (day) {
    return this.dayTemplate(day.attributes);
  }
});

$(document).ready(function () {
  new CalendarView(window.calendar);
  var height = $(document).height() + 40;
  $('#snow').height(height + 'px');
});