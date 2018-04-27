
var login = window.sessionStorage.getItem('login');
var password = window.sessionStorage.getItem('password');
var docs = new ListDoc();
var dateDay = window.sessionStorage.getItem('dateDay');

$(document).ready(function(){
    var eventsDay = {};
    var months =["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    var date = new Date(dateDay);
    var mode;
    drowWeek(date);
    //loadEvents(date.getFullYear(), date.getMonth()+1, date.getDate(),true);
    loadDocs('pol');

    function loadDocs(type, forcedLoading = false, drowing = true){
        if(docs.lists[type].length>0 && !forcedLoading) { 
            drowListDoc(type); return;
        }
        
        var aut = {
            "aut":{
                "login": login,
                "password": password
            }
        };
        switch(type){
            case 'reg':
                docs.lists['reg'] = [];
                $.ajax({
                        url: url+'/getRegDocs',
                        success: function(data){
                            docs.lists['reg'] = docs.setJSON(data);
                        },
                        type: "POST",
                        error:function(jqXHR){
                            alert(jqXHR.status);
                        },
                        data: JSON.stringify(aut)
                    });
            break;

            case 'pol':
                docs.lists['pol'] = [];
                $.ajax({
                        url: url+'/getPolDocs',
                        success: function(data){
                            docs.lists['pol'] = docs.setJSON(data);
                        },
                        type: "POST",
                        error:function(jqXHR){
                            alert(jqXHR.statusText);
                        },
                        data: JSON.stringify(aut)
                    });
            break;

            case 'zareg':
                docs.lists['zareg'] = [];
                $.ajax({
                        url: url+'/getZaregDocs',
                        success: function(data){
                            docs.lists['zareg'] = docs.setJSON(data);
                        },
                        type: "POST",
                        error:function(jqXHR){
                            alert(jqXHR.statusText);
                        },
                        data: JSON.stringify(aut)
                    });
            break;
        }
    }

    function loadEvents(year, month, day, forcedLoading=false){
        if(eventsDay.hasOwnProperty(year+"-"+month) && !forcedLoading) {
            clickDay(date);
            return;
        }   
        
        mode='load';
        $('#container-day-content').html(`<div class="windows8">
                                    <div class="wBall" id="wBall_1">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_2">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_3">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_4">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_5">
                                        <div class="wInnerBall"></div>
                                    </div>
                                </div>`);
        
        eventsDay[year+"-"+month]=[];
        $.ajax({
            url: url+'/getEvents',
            success: function(data){
                var events = data;
                for(var i=0; i<events.length; i++){
                    eventsDay[year+"-"+month].push((new EventDay().setJSON(events[i])));
                    //drowWeek(date);
                }
                clickDay(date);
            },
            type: "POST",
            error:function(jqXHR){
                alert(jqXHR.statusText);
            },
            data: JSON.stringify({"year": year, "month": month, "day": day, "aut":{
                "login": login,
                "password": password
            }})
        });
    }
    
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
        date = new Date(this.id);
        loadEvents(date.getFullYear(), date.getMonth()+1, date.getDate());
        //clickDay(new Date(this.id));
    });

    $('thead tr:eq(0) td:eq(0)').click(function(e){
        window.location.href = './calendar.html'; 
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
        for(var key in eventsDay){
            for(var i=0; i<eventsDay[key].length; i++){
                if(eventsDay[key][i].id==this.id){
                    window.sessionStorage.setItem('event-info', JSON.stringify(eventsDay[key][i]));
                }
            }
        }
        window.location.href='../html/event-info.html';
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
        var keyEventsDay = new Date(date).getFullYear()+"-"+((new Date(date).getMonth())+1);
        if(eventsDay.hasOwnProperty(keyEventsDay)){
            for (var i = 0; i<eventsDay[keyEventsDay].length;i++){
                if(date==eventsDay[keyEventsDay][i].date){
                    eventsDay[keyEventsDay][i].drow();
                }
            }
        }
        else{
            loadEvents(new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate());
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