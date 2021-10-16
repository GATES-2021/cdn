
(function( $ ){
    $.fn.loading = function(display) {
        if (display)
            return this.addClass('spinner spinner-white spinner-right').prop('disabled', true);
        else
            return this.removeClass('spinner spinner-white spinner-right').prop('disabled', false);
    };


})( jQuery );

function GetDisplayFormattedDate(dates) {
    return dates.substring(8, 10) + "/" + dates.substring(5, 7) + "/" + dates.substring(0, 4);
}


function GetDisplayFormattedDateDefault(dates) {
    return dates.substring(6, 10) + "-" + dates.substring(3, 5) + "-" + dates.substring(0, 2);
}



//2020-01-02
const DATE_FORMAT = 'dd/mm/yyyy';

//selectpicker-class
$('.selectpicker').selectpicker();

//select2-basic
$('.select2').select2();


//datepicker-basic
$.fn.datepicker.defaults.format = DATE_FORMAT;
$('.date').datepicker({
    todayHighlight: true,
    orientation: "bottom left",
});

$('.daterange-start').on('change',function(){
    $('.daterange-end').val($(this).val());
    $('.daterange-end').datepicker('setStartDate',$(this).val());
})

//remove autocomplete on date
$('input','.date').attr('autocomplete','off');

// SWAL general
var swalError = function(e,message){
    var _message = '';

    if(message != undefined){
        _message = message;
    }

    if(e!=undefined && e.responseJSON){
        _message = e.responseJSON.message;
    }

    if(_message == 'abort'){
        return;
    }

    swal.fire({
        icon:'error',
        text: _message
    });
}


//AJAX Setup
$.ajaxSetup({
    headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    error:swalError
});


//export datatabase
var exportDataTable = function(url){
    window.open(url, '_blank');
}


var substringMatcher = function (strs,field) {
    return function findMatches(q, cb) {
        var matches, substringRegex;
        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str[field])) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const localeTimeFormat = date => `${date.toLocaleDateString()} ${(date.getHours()<10?'0':'') + date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;

let serializeForm = (form) => {
	var obj = {};
	var formData = new FormData(form);

	for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	
	return obj;
}

let fetchForm = (url, {method, headers, body, onSuccess, onFailed, buttonId}) => {
    $(buttonId).loading(true);

    fetch(url, { method: method !=  null ? method : 'POST', headers: headers != null ? headers : { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }, body: body })
    .then((response) => response.json())
    .then((response) => {

        if(true === response.status) {
            onSuccess != null ? onSuccess(response) : swal.fire("Success!", response.message, "success");
        } else {
            onFailed != null ? onFailed(response) : swal.fire("Failed!", response.message, "error");
        }

        $(buttonId).loading(false);

    })
    .catch((err) => {
        
        swal.fire("Failed!", err, "error");
        $(buttonId).loading(false);
        
    });
}

let ajaxForm = (url, {method, headers, body, onSuccess, onFailed, buttonId}) => {
	$(buttonId).loading(true);

	$.ajax({
		url: url,
		method: method != null ? method : 'POST',
		headers: headers != null ? headers : { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
		data: body,
		success: (response) => {
			
			if(true === response.status) {
				onSuccess != null ? onSuccess(response) : swal.fire("Success!", response.message, "success");
			} else {
				onFailed != null ? onFailed(response) : swal.fire("Failed!", response.message, "error");
			}
	
			$(buttonId).loading(false);
	
		},
		error: (xhr, status, err) => {

            onFailed != null ? onFailed(xhr.responseJSON) : swal.fire("Failed!", xhr.responseJSON.message != null ? xhr.responseJSON.message : err.toString(), "error");
            $(buttonId).loading(false);

		}
	});
}