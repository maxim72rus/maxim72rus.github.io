
var login = window.sessionStorage.getItem('login');
var password = window.sessionStorage.getItem('password');
var dateDay = new Date(window.sessionStorage.getItem('dateDay'));

$(document).ready(function(){ 
    $('input[name="date"]').val(dateDay.getFullYear()+'-'+("0"+-~(dateDay.getMonth())).substr(-2,2)+'-'+("0"+-~(dateDay.getDate()-1)).substr(-2,2));

    $('.form-ok').click(function(e){
        var date = $('input[name="date"]').val();
        var timeStart = $('input[name="timeStart"]').val();
        var timeEnd = $('input[name="timeEnd"]').val();
        var name = $('input[name="name"]').val();
        var allDay = $('input[name="allDay"]').is(':checked');

        if(date==null || date==undefined || date==''){
            return alert("Не заполнено поле с датой!");
        }
        if(timeStart==null || timeStart==undefined || timeStart==''){
            return alert("Не заполнено поле С!");
        }
        if(timeEnd==null || timeEnd==undefined || timeEnd==''){
            return alert("Не заполнено поле По!");
        }
        if(name==null || name==undefined || name==''){
            return alert("Не заполнено поле с названием!");
        }

        
        var timeStartHours = Number(timeStart.split(':')[0]);
        var timeStartMinutes = Number(timeStart.split(':')[1]);
        var timeEndHours = Number(timeEnd.split(':')[0]);
        var timeEndMinutes = Number(timeEnd.split(':')[1]);

        if((timeEndHours<timeStartHours) ||(timeEndHours==timeStartHours && timeEndMinutes<=timeStartMinutes)){
            return alert("Время По не может быть меньше или равно времени С!");
        }
        
        var eventNew = {};
        eventNew["ПериодНачало"]=new Date(date+" "+timeStart).toISOString();
        eventNew["ПериодОкончание"]=new Date(date+" "+timeEnd).toISOString();
        eventNew["Тема"]= name;
        eventNew["НаВесьДень"]= allDay;
        eventNew["aut"]={
            "login": login,
            "password": password
        };
        $.ajax({
            url: url+'/setEvent',
            success: function(data){
                data = JSON.stringify(data); 
                data = JSON.parse(data);
                if(data['status']=='ok') window.location.href='../html/calendar-day.html';;
                if(data['status']!='ok') alert(data['status']);
            },
            type: "POST",
            error:function(jqXHR){
                alert(jqXHR.statusText);
            },
            data: JSON.stringify(eventNew)
        });
    });
    $('.form-cancel').click(function(e){
        window.location.href='../html/calendar-day.html';
    });
    $('.inner-content').on('input','input[name="timeStart"]',function(e){
        var time = $('input[name="timeStart"]').val();
        var hours = Number(time.split(':')[0]);
        var minutes = Number(time.split(':')[1]);
        if(minutes>=30){
            hours++;
            minutes = minutes+30-60;
        }
        else{
            minutes = minutes+30;
            if(minutes==60) minutes=0;
        }
        if(hours>23){
            $('input[name="timeEnd"]').val(time); 
        }else{
            $('input[name="timeEnd"]').val((("0"+-~(hours-1)).substr(-2,2)).toString()+':'+(("0"+-~(minutes-1)).substr(-2,2)).toString()); 
        }
    });

    $('.inner-content').on('input','input[name="timeEnd"]',function(e){
       
    });
})