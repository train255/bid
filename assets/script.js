var ste;
var arr_row_entered = Array();
var arr_index = 0;
arr_row_entered[0] = 0;
var curr_row_entered = 0;
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
		stt = '0' + stt;
	html += '<td class="stt"><input name="stt' + stt + '" value="' + stt + '"  type="text" /></td>';
	html += '<td class="code"><input name="code' + stt + '" value="" type="text" onchange="fillName(this)"  /></td>'; 
	html += '<td class="name"><textarea name="customername' + stt + '" value="" rows=1 class="expand" onchange="resetLastRow(this)"></textarea></td>';
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

function resetLastRow(el) {
	var sttINT = 0;
	var row = $(el).parents("tr");
	var sttInput = row.find(".stt input").val();
	var codeInput = row.find(".code input").val();
	var nameInput = row.find(".name textarea").val();
	var priceInput = row.find(".price input").val();
	var priceINT = parseInt(priceInput.replace(/,/g,""));

	var str = sttInput.substr(0);
	if (str[0] == "0")
		sttINT = parseInt(str[1]);
	else
		sttINT = parseInt(sttInput);

	if (sttINT > curr_row_entered) {
		arr_row_entered[arr_index] = sttINT;
		curr_row_entered = arr_row_entered[arr_index];
		arr_index ++;
	} else if ((sttINT < curr_row_entered) && (sttINT == curr_row_entered - 1)) {
		if(arr_row_entered[arr_index])
			arr_index ++;
		arr_row_entered[arr_index] = curr_row_entered;
		arr_row_entered[arr_index - 1] = sttINT;
	}

	if (codeInput == "" && nameInput=="" && (isNaN(priceINT) || priceInput=="")) {
		if (sttINT == curr_row_entered && arr_index > 0) {
			if(!arr_row_entered[arr_index])
				arr_index = arr_index - 2;
			else
				arr_index = arr_index - 1;
			curr_row_entered = arr_row_entered[arr_index];
		}
	}
	console.log("Sau thay doi " + curr_row_entered);
}
	

//function getLastRow() {
//	var last_row = 1;
//	$("#price-table tbody tr").each(function (){
//		var st = $(this).find(".stt input").val();
//		var co = $(this).find(".code input").val();
//		var na = $(this).find(".name textarea").val();
//		var pr = $(this).find(".price input").val();
//		if(co != "" || na != "" || pr != "") {
//			if(last_row < parseInt(st))
//				last_row = parseInt(st);
//		}
//	});
//	return last_row;
//}

function sort(el) {
	var lastRowNumber = getLastRow() - 1;
	var lastRow = $("#price-table tbody tr:eq("+lastRowNumber+")");

	var row = $(el).parents("tr");

	el.value = addCommas(parseInt(el.value.replace(/,/g,"")));
	$(el).addClass("current");	
	
	var stepPrice = parseInt($(".step-price input").val().replace(/,/g,""));
	var startPrice = parseInt($(".start-price input").val().replace(/,/g,""));
	var selectPrice = parseInt(el.value.replace(/,/g,""));

	if(selectPrice%stepPrice == 0 && selectPrice >= startPrice ){
		$(row).removeClass("error");
		row.find(".note input").val(row.find(".note input").val().replace("Phạm quy",""));
		var last_valid_row = null;
		if($("#price-table tbody tr .price input:first").val()=="" && !$(row).hasClass("error")){
			row.insertBefore($("#price-table tbody tr:first"));
		} else

		$("#price-table tbody tr .price input").each(function () {
			if (this.value && !$(this).hasClass("current")) {
				var rowcompare = $(this).parents("tr");
				var stt_rowcompare = parseInt($(rowcompare).find(".stt input").val());
				var stt_row = parseInt($(row).find(".stt input").val());

				console.log(stt_row + " " + stt_rowcompare);
				console.log(el.value + " " + this.value);

				if ($(rowcompare).hasClass("error")) {
					if (stt_rowcompare < stt_row)
						row.insertBefore(rowcompare);
					return false;
				} else {
					if (parseInt(this.value.replace(/,/g,"")) < parseInt(el.value.replace(/,/g,""))) {
						if (stt_rowcompare < stt_row)
							row.insertBefore(rowcompare);
						return false;
					} else {
						last_valid_row = rowcompare;
					}
				}
			}
		});

		if(last_valid_row)
			row.insertAfter(last_valid_row);
	}
	else{
		row.find(".note input").val("Phạm quy");
		$(row).addClass("error");
		if (row.find(".stt input").val() != lastRow.find(".stt input").val())
			row.insertAfter(lastRow);
	}
	
	$(el).removeClass("current");
	
	updateOrder();
	arrangeRowColor();

	var stt_arr = el.name.split('price');
	totalPrice(stt_arr[1]);
	
	if(isNaN(selectPrice))
		el.value = "";
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

		if ($(this).hasClass("error"))
			this.className = "error";
		else
			this.className = "";
		if (alternate > 0)
			$(this).addClass("row1");
		else
			$(this).addClass("row0");
		altervalue = currentvalue;
		
	});

	$("#price-table tbody tr .orderprice input").each(function () {
		var row_orderprice = $(this).parents("tr");
		if ($(this).val() == "001" && !$(row_orderprice).hasClass("error")) {
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

	var i = 0;
	$("#price-table tbody tr").each(function (){
		var className = $(this).attr('class');
		var st = $(this).find(".stt input").val();
		var cd = $(this).find(".code input").val();
		var nm = $(this).find(".name textarea").val();
		var pr = $(this).find(".price input").val();
		var od = $(this).find(".orderprice input").val();
		var pl = $(this).find(".plots input").val();
		var tt = $(this).find(".totalprice input").val();
		var nt = $(this).find(".note input").val();
		localStorage.setItem('tr_className' + i + hex_md5(auction), className);
		localStorage.setItem('tbl_stt' + i + hex_md5(auction), st);
		localStorage.setItem('tbl_code' + i + hex_md5(auction), cd);
		localStorage.setItem('tbl_name' + i + hex_md5(auction), nm);
		localStorage.setItem('tbl_price' + i + hex_md5(auction), pr);
		localStorage.setItem('tbl_orderprice' + i + hex_md5(auction), od);
		localStorage.setItem('tbl_plots' + i + hex_md5(auction), pl);
		localStorage.setItem('tbl_totalprice' + i + hex_md5(auction), tt);
		localStorage.setItem('tbl_note' + i + hex_md5(auction), nt);
		i++;
	});
	localStorage.setItem('row_number' + hex_md5(auction), i);

	var j = 0;
	$("#plot-table tbody tr").each(function (){
		var pt = $(this).find(".plot input").val();
		var ar_id = $(this).find(".area input").attr('id');
		var ar = $(this).find(".area input").val();
		localStorage.setItem('tbl2_plot' + j + hex_md5(auction), pt);
		localStorage.setItem('tbl2_area_id' + j + hex_md5(auction), ar_id);
		localStorage.setItem('tbl2_area' + j + hex_md5(auction), ar);
		j++;
	});
	localStorage.setItem('row2_number' + hex_md5(auction), j);

	var report_text = ste.frame.document.body.innerHTML;
	localStorage.setItem('report_text' + hex_md5(auction), report_text);
	
	var customerCode = localStorage.getItem('customerCode');
	if(customerCode){
		customerCode = customerCode.split(",");
	}
	else customerCode = Array();
	
	var customerName = localStorage.getItem('customerName');
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
	});

	localStorage.setItem('customerCode',customerCode);
	localStorage.setItem('customerName',customerName);

//	localStorage.setItem('row' + hex_md5(auction), $("#price-table tbody tr").length);
//	localStorage.setItem('row2' + hex_md5(auction), $("#plot-table tbody tr").length);
//	localStorage.setItem('data' + hex_md5(auction), $('form').serialize());
//	localStorage.setItem('html' + hex_md5(auction), $("#price-table tbody").html());
//	localStorage.setItem('html2' + hex_md5(auction), $("#plot-table tbody").html());

	setAuctionList();
	
}

function fillName(el){
	resetLastRow(el);

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

	var j = 0;
	$("#price-table tbody tr").each(function (){
		j++;
	});

	var k = 0;
	$("#plot-table tbody tr").each(function (){
		k++;
	});
	
	if (auction) {
		var num = localStorage.getItem('row_number' + hex_md5(auction));
		for (var i = 0; i < num; i++) {
			if (i >= j) {
				addNewRow();
			}
			var className = localStorage.getItem('tr_className' + i + hex_md5(auction));
			var st = localStorage.getItem('tbl_stt' + i + hex_md5(auction));
			var cd = localStorage.getItem('tbl_code' + i + hex_md5(auction));
			var nm = localStorage.getItem('tbl_name' + i + hex_md5(auction));
			var pr = localStorage.getItem('tbl_price' + i + hex_md5(auction));
			var od = localStorage.getItem('tbl_orderprice' + i + hex_md5(auction));
			var pl = localStorage.getItem('tbl_plots' + i + hex_md5(auction));
			var tt = localStorage.getItem('tbl_totalprice' + i + hex_md5(auction));
			var nt = localStorage.getItem('tbl_note' + i + hex_md5(auction));

			var row_curr = $("#price-table tbody tr:eq("+i+")");
			$(row_curr).attr('class', className);
			$(row_curr).find(".stt input").val(st);
			$(row_curr).find(".code input").val(cd);
			$(row_curr).find(".name textarea").val(nm);
			$(row_curr).find(".price input").val(pr);
			$(row_curr).find(".orderprice input").val(od);
			$(row_curr).find(".plots input").val(pl);
			$(row_curr).find(".totalprice input").val(tt);
			$(row_curr).find(".note input").val(nt);
		};
		divideTop();

		var num2 = localStorage.getItem('row2_number' + hex_md5(auction));
		for (var i = 0; i < num2; i++) {
			if (i >= k) {
				addNewRowPlot();
			}
			var pt = localStorage.getItem('tbl2_plot' + i + hex_md5(auction));
			var ar_id = localStorage.getItem('tbl2_area_id' + i + hex_md5(auction));
			var ar = localStorage.getItem('tbl2_area' + i + hex_md5(auction));
			
			var row_curr = $("#plot-table tbody tr:eq("+i+")");
			$(row_curr).find(".plot input").val(pt);
			$(row_curr).find(".area input").val(ar);
			$(row_curr).find(".area input").attr('id', ar_id);
		};

		var report_text = localStorage.getItem('report_text' + hex_md5(auction));
		ste.frame.document.body.innerHTML = report_text;

//		$("#price-table tbody").html(localStorage.getItem('html' + hex_md5(auction)));
//		$("#plot-table tbody").html(localStorage.getItem('html2' + hex_md5(auction)));
//		$("form").unserializeForm(localStorage.getItem('data' + hex_md5(auction)));
		$('.report').slideUp("fast");
		$("body").hide();
		$("body").fadeIn();		
		$("textarea[class*=expand]").TextAreaExpander();
	}
	
}

function clearAuction() {
	var auction = $(".auctionList").val();
	if (auction) {
		var num = localStorage.getItem('row_number' + hex_md5(auction));
		for (var i = 0; i < num; i++) {
			localStorage.removeItem('tr_className' + i + hex_md5(auction));
			localStorage.removeItem('tbl_stt' + i + hex_md5(auction));
			localStorage.removeItem('tbl_code' + i + hex_md5(auction));
			localStorage.removeItem('tbl_name' + i + hex_md5(auction));
			localStorage.removeItem('tbl_price' + i + hex_md5(auction));
			localStorage.removeItem('tbl_orderprice' + i + hex_md5(auction));
			localStorage.removeItem('tbl_plots' + i + hex_md5(auction));
			localStorage.removeItem('tbl_totalprice' + i + hex_md5(auction));
			localStorage.removeItem('tbl_note' + i + hex_md5(auction));
		};

		var num2 = localStorage.getItem('row2_number' + hex_md5(auction));
		for (var i = 0; i < num2; i++) {
			localStorage.removeItem('tbl2_plot' + i + hex_md5(auction));
			localStorage.removeItem('tbl2_area_id' + i + hex_md5(auction));
			localStorage.removeItem('tbl2_area' + i + hex_md5(auction));
		};

		localStorage.removeItem('row_number' + hex_md5(auction));
		localStorage.removeItem('row2_number' + hex_md5(auction));
		localStorage.removeItem('report_text' + hex_md5(auction));
		
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
