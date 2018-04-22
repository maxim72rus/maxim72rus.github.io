$(document).ready(function(){
    function calendar(id, year, month) {
        var Dlast = new Date(year,month+1,0).getDate(),
            D = new Date(year,month,Dlast),
            DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay(),
            DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay(),
            calendar = '<tr>',
            month=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
        if (DNfirst != 0) {
        for(var  i = 1; i < DNfirst; i++) calendar += '<td>';
        }else{
        for(var  i = 0; i < 6; i++) calendar += '<td>';
        }
        for(var  i = 1; i <= Dlast; i++) {
            if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
                calendar += '<td class="today"><div class="day" id="'+D.getFullYear()+'-'+("0"+-~(D.getMonth())).substr(-2,2)+'-'+("0"+-~(i-1)).substr(-2,2)+'">' + i+'</div>';
            }else{
                calendar += '<td><div class="day" id="'+D.getFullYear()+'-'+("0"+-~(D.getMonth())).substr(-2,2)+'-'+("0"+-~(i-1)).substr(-2,2)+'">' + i+'</div>';
            }
            if (new Date(D.getFullYear(),D.getMonth(),i).getDay() == 0) {
                calendar += '</tr>';
            }
        }
        for(var  i = DNlast; i < 7; i++) calendar += '<td>';
        document.querySelector('#'+id+' tbody').innerHTML = calendar;
        document.querySelector('#'+id+' thead td:nth-child(2)').innerHTML = month[D.getMonth()] +' '+ D.getFullYear();
        document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month = D.getMonth();
        document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year = D.getFullYear();
        if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
            document.querySelector('#'+id+' tbody').innerHTML += '<tr><td><td><td><td><td><td><td>';
        }
        drowDoc();
    }
    
    var deleteNotice=false;
    $('body').on('click',function(e){
        if(deleteNotice){
            $('.notice').remove();
        }
        deleteNotice = true;
    });

    $('.inner-content').on('click','.day',function(e){
        /*$('.inner-content').append("<div class='notice'><div class='signature-form-Aut'><div class='text-caption'>"+$(this).attr('id')+"</div></div><div class='info-notice'></div></div>");
        $('.info-notice').append('<div class="elem-notice">'+'12:00'+' - '+'Документ 123123');
        $('.info-notice').append('<div class="elem-notice">'+'13:40'+' - '+'Документ 3213');
        deleteNotice = false;*/
        window.sessionStorage.setItem('dateDay', this.id);
        window.location.href="./calendar-day.html";
    });

    calendar("calendar", new Date().getFullYear(), new Date().getMonth());

    // переключатель минус месяц
    document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
        calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)-1);
    }
    // переключатель плюс месяц
    document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
        calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)+1);
    }

    function drowDoc(){
        $('#'+new Date().getFullYear()+'-'+("0"+-~(new Date().getMonth())).substr(-2,2)+'-'+("0"+-~(new Date().getDate()-1)).substr(-2,2)).append('<div class="calendar-doc">(2)</div>');
    }
});