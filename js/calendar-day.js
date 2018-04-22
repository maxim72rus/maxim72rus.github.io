var url ='http://localhost/docsService/hs/api';
var docs = new ListDoc();
var dateDay = window.sessionStorage.getItem('dateDay');

$(document).ready(function(){
    var eventsDay = [];
    var months =["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    var date = new Date(dateDay);
    var mode;
    drowWeek(date);
    /*$.ajax({
            url: url+'/getEvents',
            success: function(data){
                var events = data;
                for(var i=0; i<events.length; i++){
                    eventsDay.push(new EventDay().setJSON(events[i]));
                    drowWeek(date);
                }
            },
            type: "POST",
            error:function(){
                alert("Error");
            }
        }
    );*/

    /*var docs = new ListDoc();
    $.ajax({
            url: url+'/getDocs',
            success: function(data){
                docs = docs.setJSON(data);
                $('.button-menu-lists.reg').click();
            },
            type: "POST",
            error:function(){
                alert("Error");
            }
        }
    );*/
    
    $('#weekLeft').click(function(e){
        if(date.getDate()>7){
            date.setDate(date.getDate()-7);
        }else{
            (date.getDate()!=1)?date.setDate('1'):date.setDate(date.getDate()-1);
        }
        drowWeek(date);
    });
    
    $('#weekRight').click(function(e){
        var daysInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
        if((date.getDate()+7)<daysInMonth){
            date.setDate(date.getDate()+7);
        }else{
            (date.getDate()!=daysInMonth)?date.setDate(daysInMonth):date.setDate(daysInMonth + 1);
        }
        drowWeek(date);
    });

    $('thead tr:eq(2) td').click(function(e){
        clickDay(new Date(this.id));
    });

    $('#button-add-event').click(function(e){
        window.location.href='../html/calendar-add-event.html';
    });

    $('#docs').click(function(e){
        dateString = date.getFullYear()+'-'+("0"+-~(month = date.getMonth())).substr(-2,2)+'-'+("0"+-~(date.getDate()-1)).substr(-2,2);
        drowDocs(dateString);
    }); 

    $('#events').click(function(e){
        dateString = date.getFullYear()+'-'+("0"+-~(month = date.getMonth())).substr(-2,2)+'-'+("0"+-~(date.getDate()-1)).substr(-2,2);
        drowEvents(dateString);
    });

    $('.inner-content').on('click','.event-day',function(e){
        window.location.href='../html/calendar-add-event.html';
    });

    var initialPoint;
    var finalPoint;
    $('.content').on('touchstart',function(event){  
        initialPoint=event.changedTouches[0];
    });

    $('.content').on('touchend',function(event){
        var nameEventMobil = '';
        finalPoint=event.changedTouches[0];
        var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
        var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
        if (xAbs > 20 || yAbs > 20) {
            selectionMode = false;
            if (xAbs > yAbs) {
                if (finalPoint.pageX < initialPoint.pageX){
                    nameEventMobil = 'swipeLeft';}
                else{
                    nameEventMobil = 'swipeRight';}
            }
            else {
                if (finalPoint.pageY < initialPoint.pageY){
                    nameEventMobil = 'swipeUp';}
                else{
                    nameEventMobil = 'swipeDown';}
                }
        }
        else{
            nameEventMobil = 'tap';
        }

        //swipe
        if(nameEventMobil=='swipeLeft'){
            if(mode=='events'){
                drowDocs(date.getFullYear()+'-'+("0"+-~(month = date.getMonth())).substr(-2,2)+'-'+("0"+-~(date.getDate()-1)).substr(-2,2));
            }
        }

        if(nameEventMobil=='swipeRight'){
            if(mode=='docs'){
                drowEvents(date.getFullYear()+'-'+("0"+-~(month = date.getMonth())).substr(-2,2)+'-'+("0"+-~(date.getDate()-1)).substr(-2,2));
            }
        }
        
    });
    
    function drowWeek(date){
        var day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear(),
        firstDay = day - ((date.getDay()==0)?6:(date.getDay()-1)),
        lastDay = firstDay + 6,
        daysInMonth = 33 - new Date(year, month, 33).getDate();

        $('#calendar > thead > tr:eq(0) > td').html(months[month]+' '+year);
        for (var i = firstDay; i <= lastDay; i++){
            if(i<=0 || i>daysInMonth){
                $('table > thead > tr:eq(2) > td:eq('+(i-firstDay)+')').html('').attr('id',''); 
            }else{
                $('table > thead > tr:eq(2) > td:eq('+(i-firstDay)+')').html(i).attr('id',year+'-'+("0"+-~(month)).substr(-2,2)+'-'+("0"+-~(i-1)).substr(-2,2));
            }
        }
        clickDay(date);

        //alert(day+' '+firstDay);
    }

    function clickDay(dateLocal){
        date = dateLocal;
        window.sessionStorage.setItem('dateDay',dateLocal);
        dateString = dateLocal.getFullYear()+'-'+("0"+-~(month = dateLocal.getMonth())).substr(-2,2)+'-'+("0"+-~(dateLocal.getDate()-1)).substr(-2,2);
        $('.select').removeClass('select');
        $('#'+dateString).addClass('select');
        drowDay(dateString);
    }

    function drowDay(date){
        switch (mode){
            case 'docs': drowDocs(date);break;
            case 'events': drowEvents(date); break;
            default: drowEvents(date); break;
        }
    }

    function drowEvents(date){
        mode = 'events';
        $('#container-day-content').html('');
        $('#docs').show();
        $('#events').hide();
        $('#container-day-caption span').html('События');
        for (var i = 0; i<eventsDay.length;i++){
            if(date==eventsDay[i].date){
                eventsDay[i].drow();
            }
        }
    }
    
    function drowDocs(date){
        mode = 'docs';
        $('#container-day-content').html('');
        $('#docs').hide();
        $('#events').show();
        $('#container-day-caption span').html('Забрать документы');
        docs.drowDateDoc($('#container-day-content'), date);
    }
});