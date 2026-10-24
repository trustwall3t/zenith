$(document).ready(runCalc())

function runCalc() {
    var package = $('#calc-package').val()
    var amount = $('#cal-amount').val()
    $('#calc-error').html('')
        // console.log(amount)
    if (package == 'Basic') {
        $('#calc-interest').val('10%')
        if (amount > 0 && amount < 200) {
            return $('#calc-error').html('minimum amount for this package is $200')
        }
        amount ? $('#interest').html(amount * (10 / 100)) : false
    } else if (package == 'Standard') {
        $('#calc-interest').val('15%')
        amount ? $('#interest').html(amount * (15 / 100)) : false
        if (amount > 0 && amount < 10000) {
            return $('#calc-error').html('minimum amount for this package is $5000')
        }
    } else if (package == 'Premium') {
        $('#calc-interest').val('20%')
        amount ? $('#interest').html(amount * (20 / 100)) : false
        if (amount > 0 && amount < 50000) {
            return $('#calc-error').html('minimum amount for this package is $20000')
        }
    } else if (package == 'Platinium') {
        $('#calc-interest').val('60%')
        amount ? $('#interest').html(amount * (60 / 100)) : false
        if (amount > 0 && amount < 300000) {
            return $('#calc-error').html('minimum amount for this package is $50000')
        }
    }
}