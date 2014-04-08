"use strict";

function get(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  return xhr.status == 200 ? xhr.responseText : null;
}

var profileData = (function () {
  var id = location.search.substring(1);
  if (! id)
    return null;

  var data = get(".profile/" + id + ".json") || get(".profile/" + id + ".txt");
  if (! data) {
    alert("failed to load profile data from server");
    return null;
  }
  return JSON.parse(data);
}());

// fill profile results
$(document).ready(function () {
  var resultsData = get(".profile/results.json");

  var results = resultsData ? JSON.parse(resultsData) : [];
  var select = $('#result-selector');
  for (var i = 0; i < results.length; i++) {
    var option = $('<option>').html(results[i]).attr({ value: results[i] });
    select.append(option);
  }
  var id = location.search.substring(1);
  if (id) {
    select.val(id);
  }

  select.bind("change", function (e) {
    location.href = location.pathname + "?" + e.target.value;
  });
});

var functions = (function () {
  if (! profileData) {
    return;
  }
  var map = {};
  (function doit(name, entry) {
    for (var k in entry) {
      if (k.charAt(0) != "$") {
        doit(k, entry[k]);
      }
    }
    if (name) {
      if (map[name]) {
        map[name].count += entry.$count;
        map[name].inclusive += entry.$inclusive;
        map[name].exclusive += entry.$exclusive;
      } else {
        map[name] = {
          count:     entry.$count,
          inclusive: entry.$inclusive,
          exclusive: entry.$exclusive
        };
      }
    }
  })(null, profileData);
  var ret = [];
  for (var k in map) {
    if (map[k].count != 0) {
      ret.push({
        name:      k,
        count:     map[k].count,
        inclusive: map[k].inclusive,
        exclusive: map[k].exclusive
      });
    }
  }
  return ret;
}());

function createTree(list, entry) {
  list.push({
    name:      entry.$name,
    count:     entry.$count,
    inclusive: entry.$inclusive,
    exclusive: entry.$exclusive
  });
  var callee = [];
  for (var k in entry) {
    if (k.charAt(0) != "$") {
      createTree(callee, entry[k]);
    }
  }
  list[list.length - 1].callee = callee.sort(function (x, y) {
    return x.inclusive - y.inclusive;
  });
  return list;
}

if (profileData) {
  var tree = createTree([], profileData);
  var invertedTree = createTree([], function () {
    function fill(slot, entry) {
      var t = slot[entry.$name];
      if (t) {
        t.$count += entry.$count;
        t.$inclusive += entry.$inclusive;
        t.$exclusive += entry.$exclusive;
      } else {
        t = slot[entry.$name] = {
          $name:      entry.$name,
          $count:     entry.$count,
          $inclusive: entry.$inclusive,
          $exclusive: entry.$exclusive,
        };
      }
      return t;
    }
    var root = {};
    function doIt(entry) {
      var slots = [];
      for (var k in entry) {
        if (k.charAt(0) != "$") {
          slots = slots.concat(doIt(entry[k]));
        }
      }
      if (slots.length == 0) {
        // is leaf
        slots.push(fill(root, entry));
      } else {
        for (var i = 0; i < slots.length; ++i) {
          slots[i] = fill(slots[i], entry);
        }
      }
      return slots;
    }
    for (var key in profileData) {
      if (key.charAt(0) != "$") {
        doIt(profileData[key]);
      }
    }
    return root;
  }());
}

function escapeHTML(s) {
  return s.toString()
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function insertDecimalSeparator(n) {
  var s = n.toString();
  while (true) {
    var s2 = s.replace(/([0-9])([0-9]{3}(?:,|\.|$))/, function (a, m1, m2) {
      return m1 + "," + m2;
    });
    if (s2 == s)
      break;
    s = s2;
  }
  return s;
}

function buildHeader() {
  var html = "<table id='results'><tr>"
    + "<th><a href='javascript:updateTable(%22name%22)'>Function</a></th>"
    + "<th><a href='javascript:updateTable(%22count%22)'>Count</a></th>"
    + "<th><a href='javascript:updateTable(%22inclusive%22)'>Inclusive (ms)</a></th>"
    + "<th><a href='javascript:updateTable(%22exclusive%22)'>Exclusive (ms)</a></th>"
    + "</tr>";
  return html;
}

function buildRow(id, parentId, name, count, inclusive, exclusive) {
    return "<tr"
     + (id != null ? " id='" + id + "'" : "")
     + (parentId != null ? " class='" + parentId + "'" : "")
     + "><td class='symbol'>" + escapeHTML(name) + "</td>"
     + "<td class='number'>" + insertDecimalSeparator(count) + "</td>"
     + "<td class='number'>" + insertDecimalSeparator(inclusive) + "</td>"
     + "<td class='number'>" + insertDecimalSeparator(exclusive) + "</td>"
     + "</tr>";
}

function buildList(comparator) {
  var list = functions.sort(comparator);
  var html = buildHeader();
  list.forEach(function (entry) {
    html += buildRow(
      null, null, entry.name, entry.count, entry.inclusive, entry.exclusive);
  });
  html += "</table>";
  $("#results-holder").html(html);
}

function getTreeBuilder(tree) {
  return function (comparator) {
    var html = buildHeader();
    var rowIndex = 1;
    (function doit(callee, parentRowIndex) {
      var callee = callee.sort(comparator);
      for (var i = 0; i < callee.length; ++i) {
        var theRowIndex = rowIndex++;
        html += buildRow(
          "node-" + theRowIndex,
          parentRowIndex ? "child-of-node-" + parentRowIndex : null,
          callee[i].name, callee[i].count, callee[i].inclusive,
          callee[i].exclusive);
        doit(callee[i].callee, theRowIndex);
      }
    })(tree[0].callee, 0);
    html += "</table>";
    $("#results-holder").html(html);
    $("#results").treeTable();
  };
}

function updateTable(orderBy) {
  switch ($("#mode option:selected").val()) {
  case "tree":
    var builder = getTreeBuilder(tree);
    break;
  case "invertedTree":
    builder = getTreeBuilder(invertedTree);
    break;
  case "name":
    builder = buildList;
    break;
  default:
    throw new Error("unexpected mode");
  }
  function compareBy(field, x, y) {
    if (x[field] == y[field]) {
      if (field != "name") {
        return compareBy("name", x, y);
      } else {
        return 0;
      }
    }
    var ret = x[field] < y[field] ? -1 : 1;
    if (field != "name") {
      ret *= -1;
    }
    return ret;
  }
  builder(function comparator(x, y) {
    return compareBy(orderBy, x, y);
  });
}

$(document).ready(function () {
  $("#mode").bind("change", function () {
    updateTable("count");
    return true;
  });
  updateTable("count");
});

// vim: set expandtab:
// vim: set tabstop=2:
// vim: set shiftwidth=2:
