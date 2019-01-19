$(function () {
	$('[name="city"]').kladr({
		type: $.kladr.type.city
	});
});


let from = $('#from');
let to = $('#to');
let der = $('#derival');
let arr = $('#arrival');

let results = $('#results');
let r_from = $('#r_from');
let r_to = $('#r_to');
let r_price = $('#r_price');
let r_intercity = $('#r_intercity');
let r_intercity_price = $('#r_intercity_price');
let r_derival = $('#r_derival');
let r_derival_price = $('#r_derival_price');
let r_arrival = $('#r_arrival');
let r_arrival_price = $('#r_arrival_price');


function validatePositiveFloat(f) {
    let val = parseFloat(f);
    return !(isNaN(val) || val < 0);
}

$("#submit").click(function(e) {
    let valid = this.form.checkValidity();

    if (valid) {
        event.preventDefault();

        let from_kladr = from.attr('data-kladr-id');
        let to_kladr = to.attr('data-kladr-id');

        if (isNaN(from_kladr) || isNaN(to_kladr)) {
            alert('Выберите города из списка');
            return false;
        }

        let derival = der.prop('checked');
        let arrival = arr.prop('checked');
        let weight = parseFloat($('#weight').val());
        let volume = parseFloat($('#volume').val());

        $.ajax({
                url: '/calculate/',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "POST",
                data: JSON.stringify({
                    'from_kladr': from_kladr,
                    'to_kladr': to_kladr,
                    'derival': derival,
                    'arrival': arrival,
                    'weight': weight,
                    'volume': volume,
                },),
                success: function (data) {
                    console.log(data);
                    if (data.derival > 0 || data.arrival>0) {
                        r_intercity.removeAttr('hidden');
                        r_intercity_price.text(data.intercity);
                    } else {
                        r_intercity.attr('hidden', '');
                    }
                    if (data.arrival > 0) {
                        r_arrival.removeAttr('hidden');
                        r_arrival_price.text(data.arrival);
                    } else {
                        r_arrival.attr('hidden', '');
                    }
                    if (data.derival > 0) {
                        r_derival.removeAttr('hidden');
                        r_derival_price.text(data.derival);
                    } else {
                        r_derival.attr('hidden', '');
                    }
                    r_price.text(data.total);
                    r_from.text(from.val());
                    r_to.text(to.val());
                    results.removeAttr('hidden');
                    $([document.documentElement, document.body]).animate({
                    scrollTop: results.offset().top
                    }, 2000);

                }
            });
    }
});

$('.city').kladr({close: function() {
    if (isNaN($(this).attr('data-kladr-id'))) {
        this.classList.add('invalid')
    } else {
        this.classList.remove('invalid')
    }
}});