var url ='http://localhost/docsService/hs/api';
var dateDay = new Date(window.sessionStorage.getItem('dateDay'));

$(document).ready(function(){ 
    $('input[name="date"]').val(dateDay.getFullYear()+'-'+("0"+-~(dateDay.getMonth())).substr(-2,2)+'-'+("0"+-~(dateDay.getDate()-1)).substr(-2,2));

    $('.form-ok').click(function(e){
        var eventNew = {};
        eventNew.date = $('input[name="date"]').val();
        eventNew.timeStart = $('input[name="timeStart"]').val();
        eventNew.timeEnd = $('input[name="timeEnd"]').val();
        eventNew.name = $('input[name="name"]').val();
        eventNew.status = $('select[name="status"]  option:selected').text();
        if(eventNew.date==null || eventNew.date==undefined || eventNew.date==''){
            return alert("Не заполнено поле с датой!");
        }
        if(eventNew.timeStart==null || eventNew.timeStart==undefined || eventNew.timeStart==''){
            return alert("Не заполнено поле С!");
        }
        if(eventNew.timeEnd==null || eventNew.timeEnd==undefined || eventNew.timeEnd==''){
            return alert("Не заполнено поле По!");
        }
        if(eventNew.name==null || eventNew.name==undefined || eventNew.name==''){
            return alert("Не заполнено поле с названием!");
        }
        if(eventNew.status==null || eventNew.status==undefined || eventNew.status==''){
            return alert("Не заполнено поле с статусом!");
        }
        $.ajax({
            url: url+'/addEvent',
            success: function(data){
                data = JSON.stringify(data); 
                data = JSON.parse(data);
                if(data['status']=='ok') window.location.href='../html/calendar-day.html';;
                if(data['status']!='ok') alert(data['status']);
            },
            type: "POST",
            error:function(){
                alert("Error client");
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
        var time = $('input[name="timeStart"]').val();
        var hours = Number(time.split(':')[0]);
        var minutes = Number(time.split(':')[1]);
        var hoursNew = Number($(this).val().split(':')[0]);
        var minutesNew = Number($(this).val().split(':')[1]);
        if(minutes>=30){
            hours++;
            minutes = minutes+30-60;
        }
        else{
            minutes = minutes+30;
            if(minutes==60) minutes=0;
        }
        if(hours>hoursNew || (hours==hoursNew && minutes>minutesNew) ){
            if(hours>23){
                $('input[name="timeEnd"]').val(time); 
            }else{
                $('input[name="timeEnd"]').val((("0"+-~(hours-1)).substr(-2,2)).toString()+':'+(("0"+-~(minutes-1)).substr(-2,2)).toString()); 
            }
        }
    });
})