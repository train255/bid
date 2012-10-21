var ste;
jQuery.fn.extend({
	param : function (a) {
		var s = [];
		
		// If an array was passed in, assume that it is an array
		// of form elements
		if (a.constructor == Array || a.jquery) {
			// Serialize the form elements
			jQuery.each(a, function () {
				s.push(unescape(encodeURIComponent(escape(this.name))) + "=" + unescape(encodeURIComponent(escape(this.value))));
			});
		}
		// Otherwise, assume that it's an object of key/value pairs
		else {
			// Serialize the key/values
			for (var j in a)
				// If the value is an array then the key names need to be repeated
				if (a[j] && a[j].constructor == Array)
					jQuery.each(a[j], function () {
						s.push(unescape(encodeURIComponent(escape(j)) + "=" + encodeURIComponent(escape(this))));
					});
				else
					s.push(unescape(encodeURIComponent(escape(j)) + "=" + encodeURIComponent(escape(a[j]))));
		}
		// Return the resulting serialization
		return s.join("&").replace(/ /g, "+");
	},
	
	serialize : function () {
		return this.param(this.serializeArray());
	}
	
});

$(document).ready(function () {
	ste = new SimpleTextEditor("report", "ste");
	ste.init();
	bindHover();
	addNewRow();
	addNewRow();
	addNewRow();
	addNewRowPlot();
	addNewRowPlot();
	addNewRowPlot();
	setAuctionList();
	$("body").hide();
	$("body").fadeIn();
});

function addNewRow() {
	var html = '';
	var stt = $("#price-table tbody tr").length + 1;
	var rowid = "row"+ stt;

	if ($("#price-table tbody tr:last").hasClass("row0"))
		html = '<tr class="row1" id="' + rowid + '">';
	else
		html = '<tr class="row0" id="' + rowid + '">';
	
	if (stt < 10)
		stt = "0" + stt;
	html += '<td class="stt"><input name="stt' + stt + '" value="' + stt + '"  type="text" /></td>';
	html += '<td class="code"><input name="code' + stt + '" value="" type="text" onchange="fillName(this)"  /></td>'; 
	html += '<td class="name"><textarea name="customername' + stt + '" value="" rows=1 class="expand"></textarea></td>';
	html += '<td class="price"><input name="price' + stt + '" value="" type="text" onchange="sort(this)" /></td>';
	html += '<td class="orderprice"><input name="orderprice' + stt + '" value="" type="text" /></td>';
	html += '<td class="plots"><input name="plots'+stt+'" value="" type="text" onchange=checkPlots("'+stt+'") /></td>';
	html += '<td class="totalprice"><input name="totalprice' + stt + '" value="" type="text" /></td>';
	html += '<td class="note"><input name="note' + stt + '" value="" type="text" /></td>';
	html += '<td class="delrow"><input type="button" value="Xóa" onclick=delRow("#'+rowid+'","price_table") ></td>';
	html += '</tr>';
	
	$("#price-table tbody").append(html);
	bindHover();
	$("textarea[class*=expand]").TextAreaExpander();
}

function bindHover() {
	$("#price-table tbody tr").hover(function () {
		$(this).addClass("hover");
	}, function () {
		$(this).removeClass("hover");
	});
}

function sort(el) {
	var row = $(el).parents("tr");
	el.value = addCommas(parseInt(el.value.replace(/,/g,"")));
	$(el).addClass("current");
	
	var stepPrice = parseInt($(".step-price input").val().replace(/,/g,""));
	var startPrice = parseInt($(".start-price input").val().replace(/,/g,""));
	var selectPrice = parseInt(el.value.replace(/,/g,""));

	if(selectPrice%stepPrice == 0 && selectPrice >= startPrice){
		row.find("input").removeClass("error");
		row.find(".note input").val(row.find(".note input").val().replace("Phạm quy",""));
	}
	else{
		row.find(".note input").val("Phạm quy");
		row.find("input").addClass("error");
	}

	var last = null;
	if($("#price-table tbody tr .price input:first").val()=="" && !$(el).hasClass("error")){
		row.insertBefore($("#price-table tbody tr:first"));
	} else
	$("#price-table tbody tr .price input").each(function () {
		if (this.value && !$(this).hasClass("current")) {
			var rowcompare = $(this).parents("tr");
			
			if (parseInt(this.value.replace(/,/g,"")) < parseInt(el.value.replace(/,/g,""))
					|| $(this).hasClass("error")) {
				if($(el).hasClass("error"))
					row.insertAfter(rowcompare);
				else
					row.insertBefore(rowcompare);
				last = null;
				return false;
			} else {
				last = rowcompare;
			}
		}
	});

	if(last)
		row.insertAfter(last);
	
	$(el).removeClass("current");
	
	updateOrder();
	arrangeRowColor();

	var stt_arr = el.name.split('price');
	totalPrice(stt_arr[1]);
}

function updateOrder() {
	var number = 0;
	$("#price-table tbody tr .stt input").each(function () {
		number++;
		if (number < 10)
			$(this).val("0" + number);
		else
			$(this).val(number);
	});
	divideTop();
}

function arrangeRowColor(){
	var alternate = 1;
	var altervalue = 0;
	var number = 0;
	$("#price-table tbody tr").each(function () {
		var currentvalue = $(this).find(".price input").val();
		if (currentvalue != altervalue || currentvalue == "") {
			alternate *= -1;
			if (currentvalue)
				number++;
		}
		if (currentvalue) {
			if (number < 10)
				$(this).find(".orderprice input").val("00" + number);
			else
				$(this).find(".orderprice input").val(number);
		}
		
		if (alternate > 0)
			this.className = "row1";
		else
			this.className = "row0";
		altervalue = currentvalue;
		
	});

	$("#price-table tbody tr .orderprice input").each(function () {
		if ($(this).val() == "001" && !$(this).hasClass("error")) {
			var row_orderprice = $(this).parents("tr");
			$(row_orderprice).addClass("first");
		}
	});
}

function formatPrice(el){
	el.value = addCommas(parseInt(el.value.replace(/,/g,""))) + " VND";
}

function addCommas(nStr) {
	nStr += '';
	nStr = nStr.replace(/,/g,"");
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function save() {
	$("body").hide();
	$("body").fadeIn();
	var auction = $(".auction input").val().replace("|", "");
	var auctionList = localStorage.getItem('auctionList');
	
	if (auctionList) {
		if (auctionList.indexOf(auction) == -1)
			localStorage.setItem('auctionList', auctionList + '|' + auction);
	} else {
		localStorage.setItem('auctionList', auction);
	}
	
	var customerCode = localStorage.getItem('customerCode')
	if(customerCode){
		customerCode = customerCode.split(",");
	}
	else customerCode = Array();
	
	var customerName = localStorage.getItem('customerName')
	if(customerName){
		customerName = customerName.split(",");
	}
	else customerName = Array();
	
	var eq = 0;
	$(".code input").each(function (){
		
		if(this.value){
			var i = getKeyArray(this.value,customerCode);
			if(i != -1){
				customerName[i] = $(".name textarea:eq("+eq+")").val();
			}
			else{
				customerCode.push(this.value);
				customerName.push($(".name textarea:eq("+eq+")").val());
			}
		}
		eq ++;
	})
	
	localStorage.setItem('customerCode',customerCode);
	localStorage.setItem('customerName',customerName);
	
	localStorage.setItem('row' + hex_md5(auction), $("#price-table tbody tr").length);
	localStorage.setItem('row2' + hex_md5(auction), $("#plot-table tbody tr").length);
	localStorage.setItem('data' + hex_md5(auction), $('form').serialize());
	localStorage.setItem('html' + hex_md5(auction), $("#price-table tbody").html());
	localStorage.setItem('html2' + hex_md5(auction), $("#plot-table tbody").html());
	setAuctionList();
	
}

function fillName(el){
	var row = $(el).parents("tr");
	var nameInput = row.find(".name input");

		var customerCode = (localStorage.getItem('customerCode') + "").split(",");
		var customerName = (localStorage.getItem('customerName') + "").split(",");

		var i = getKeyArray(el.value,customerCode);
		if(i !=-1 ) nameInput.val(customerName[i]);
		else{
			nameInput.val("");
		}

	
}

function getKeyArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return i;
    }
    return -1;
}

function loadAuction() {
	var auction = $(".auctionList").val();
	
	if (auction) {
		$("#price-table tbody").html(localStorage.getItem('html' + hex_md5(auction)));
		$("#plot-table tbody").html(localStorage.getItem('html2' + hex_md5(auction)));
		$("form").unserializeForm(localStorage.getItem('data' + hex_md5(auction)));
		$('.report').slideUp("fast");
		$("body").hide();
		$("body").fadeIn();
		$("textarea[class*=expand]").TextAreaExpander();
	}
	
}

function clearAuction() {
	
	var auction = $(".auctionList").val();
	if (auction) {
		localStorage.removeItem('row' + hex_md5(auction));
		localStorage.removeItem('row2' + hex_md5(auction));
		localStorage.removeItem('data' + hex_md5(auction));
		
		var auctionList = localStorage.getItem('auctionList');
		
		if (auctionList) {
			auctionList = auctionList.replace("|" + auction, "").replace(auction, "");
		}
		if (auctionList) {
			localStorage.setItem('auctionList', auctionList);
		} else {
			localStorage.removeItem("auctionList");
		}
		setAuctionList();
		$("body").hide();
		$("body").fadeIn();
	}
}

function setAuctionList() {
	$(".auctionList").html("");
	$(".auctionList").append('<option value="">- Chọn dữ liệu -</option>');
	if (localStorage.getItem('auctionList')) {
		var auctionList = localStorage.getItem('auctionList').split("|")
			
			for (var i = 0; i < auctionList.length; i++) {
				$(".auctionList").append('<option value="' + auctionList[i] + '">' + auctionList[i] + '</option>');
			}
	}
}

function showReport() {
	if ($('.report').is(":hidden"))
		$('.report').slideDown("fast");
	else
		$('.report').slideUp("fast");
}

function clearPrice(){
	$(".price input").val("")
	$(".orderprice input").val("")
	$("body").hide();
	$("body").fadeIn();

}

function delRow(row_id,table_name){
	if(!confirm('Bạn chắc chắn muốn xóa không?')){
		ev.preventDefault();
		return false;
	}else{
		$(row_id).remove();
	}
	if (table_name=="price_table"){
		updateOrder();
		arrangeRowColor();
	}
	if (table_name=="plots_table")
		recalculate();
}

function getPlots(stt) {
	var plotsCol = "plots" + stt;
	var plot_str = $('input[name='+plotsCol+']').val();
	if (plot_str == "")
		return 0;
	var plots_arr = plot_str.split(',');
	return plots_arr;
}

function totalPrice(stt) {
	var priceCol = "price"+stt;
	var price_str = $('input[name='+priceCol+']').val();
	var price = parseInt(price_str.replace(/,/g,""));

	var plots = getPlots(stt);

	var total = 0;
	for (var i = 0; i < plots.length; i++){
		areaId = "#areaId" + $.trim(plots[i]);
		area = $(areaId).val();
		total += price*area;
  }
	total = addCommas(total);
	$('input[name=totalprice'+stt+']').val(total);
}

function checkPlots(stt) {
	var plots = getPlots(stt);
	var check = true;

	if (plots.length > 0) {
		for (var i = 0; i < plots.length; i++){
			areaId = "#areaId" + $.trim(plots[i]);
			if($(areaId).length <= 0)
				check = false;
		}
	}

	if (check == false) {
		$('input[name=note'+stt+']').val("Kiểm tra lại lô đất").css('color','red');
	}	else if (check == true) {
		$('input[name=note'+stt+']').val("");
		totalPrice(stt);
	}

	return check;
}

function showTablePlot() {
	if ($('.tableplot').is(":hidden"))
		$('.tableplot').slideDown("fast");
	else
		$('.tableplot').slideUp("fast");
}

function addNewRowPlot(){
	var html = '';
	var stt = $("#plot-table tbody tr").length + 1;
	var plotid = "plot"+stt;	

	html = '<tr id="' + plotid + '">';
	if (stt < 10)
		stt = "0" + stt;
	html += '<td class="plot"><input name="plot'+stt+'" value="" type="text" onchange=setPlotId(this,"area'+stt+'") /></td>';
	html += '<td class="area"><input name="area'+stt+'" value="" type="text" onchange="recalculate()" /></td>';
	html += '<td class="delrow"><input type="button" value="Xóa" onclick=delRow("#'+plotid+'","plots_table") ></td>';
	html += '</tr>';
	
	$("#plot-table tbody").append(html);
}

function setPlotId(el,areaName) {
	var areaId = "areaId"+el.value;
	$('input[name='+areaName+']').attr("id", areaId);
	
	recalculate();
}

function divideTop(){
	$("#divide_td").remove();
	var rowdiv = '<td id="divide_td" class="divide" colspan="9"><td>';
	var top = $('input[name=win_number]').val();
	if (top < 10)
		top = "0" + top;
	$("#price-table tbody tr .stt input").each(function () {
		if ($(this).val() == top) {
			var row2 = $(this).parents("tr");
			$(row2).after(rowdiv);
		}
	});
}

function recalculate(){
	$("#price-table tbody tr .plots input").each(function () {
		var stt_arr = this.name.split('plots');
		if (checkPlots(stt_arr[1]))
			totalPrice(stt_arr[1]);
	});
}
