function onLoad() {
	var elts = document.getElementsByClassName("text-area-input");
	for (i = 0; i < elts.length; i++) {
		textareaOnKeyup(elts[i]);
	}

	load();
	updatePost();

	window.setInterval(save, 5000);
}

function textareaOnKeyup(element) {
  element.style.height = "1px";
  element.style.height = (element.scrollHeight)+"px";
  updatePost();
}

function updatePost() {
	var before = document.getElementById("instructionsBefore").value;
	var listText = makeListText();
	var after = document.getElementById("instructionsAfter").value;

	var text = "";

	if (!!before) {
		text = text + before + '\n\n'
	}

	if (!!listText) {
		text = text + listText + '\n\n';
	}

	text = text + after;

	document.getElementById("postOutput").innerText = text.trim();
}

function makeListText() {
	var text = "";
	var items = document.getElementsByClassName("item-table-item");
	if (!items || items.length < 1) {
		return "";
	}
	for (i = 0; i < items.length; i++) {
		var itemText = makeItemText(items[i]);
		if (!!itemText) {
			text = text + itemText + '\n';
		}
	}
	return text.trim();
}

function makeItemText(tableRow) {
	var text = "";

	var children = tableRow.childNodes;
	var desc = children[0].childNodes[0].value;
	var quant = children[1].childNodes[0].value;
	var price = children[2].childNodes[0].value;
	var currency = children[3].childNodes[0].value;
	var per = children[4].childNodes[0].value;

	if (!!desc) {
		text = text + 
			desc + " (x" +
			quant + ") at " +
			price + " " +
			currency + " per " +
			per;
	}

	return text.trim();
}

function copy() {
    var text = document.getElementById("postOutput").innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
	elem.setSelectionRange(0, 999999);
    document.execCommand("copy");
    document.body.removeChild(elem);
}

function addItem() {
	var item = makeNewItem();
	var lastRow = document.getElementById("lastRow");
	var parent = document.getElementById("lastRow").parentElement;
	parent.insertBefore(item, lastRow);
}

function removeItem(element) {
	var elem = element.parentElement.parentElement;
	elem.remove();
}

function makeNewItem() {
	var template = document.createElement("template");
	template.innerHTML =
		"<tr class=\"item-table-item\"><td><input onkeyup=\"updatePost()\"></input onkeyup=\"updatePost()\"></td><td><input onkeyup=\"updatePost()\"></input></td><td><input onkeyup=\"updatePost()\"></input></td><td><input onkeyup=\"updatePost()\"></input onkeyup=\"updatePost()\"></td><td><input onkeyup=\"updatePost()\"></input></td><td><button onclick=\"removeItem(this)\">X</button></td><tr>";
	return template.content.firstChild;
}

function save() {
	var obj = {};
	obj.before = document.getElementById("instructionsBefore").value;
	obj.after = document.getElementById("instructionsAfter").value;
	obj.list = getList();
	setCookie("data", JSON.stringify(obj), 60);
}

function getList() {
	var list = [];
	var items = document.getElementsByClassName("item-table-item");
	if (!items || items.length < 1) {
		return list;
	}
	for (i = 0; i < items.length; i++) {
		var row = {};
		var children = items[i].childNodes;
		row.desc = children[0].childNodes[0].value;
		row.quant = children[1].childNodes[0].value;
		row.price = children[2].childNodes[0].value;
		row.currency = children[3].childNodes[0].value;
		row.per = children[4].childNodes[0].value;
		list.push(row);
	}
	return list;
}

function load() {
	var obj = {};
	try {
		var rawObj = getCookie("data");
		obj = JSON.parse(rawObj);
	}
	catch {
		return;
	}
	
	if (!!obj) {
		if (!!obj.before) {
			document.getElementById("instructionsBefore").value = obj.before;
		}
		if (!!obj.after) {
			document.getElementById("instructionsAfter").value = obj.after;
		}
		if (!!obj.list) {
			for (i = 0; i < obj.list.length; i++) {
				var row = obj.list[i];
				addItem();
				var item = document.getElementsByClassName("item-table-item")[i];
				var children = item.childNodes;
				children[0].childNodes[0].value = row.desc;
				children[1].childNodes[0].value = row.quant;
				children[2].childNodes[0].value = row.price;
				children[3].childNodes[0].value = row.currency;
				children[4].childNodes[0].value = row.per;
			}
		}
	}
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}