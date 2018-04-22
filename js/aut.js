$(document).ready(function(){

    $('.inner-content').on('click','#button-Aut', function(e){
        var login = $('#login').val();
        var password = $('#password').val();

        if(login=='123' && password=='123'){

            var eventDay1 = new EventDay('event1','2018-04-14','12:00','13:00',"Встреча 1",'','Занят');
            var eventDay2 = new EventDay('event2','2018-04-14','14:30','15:00',"Встреча 2",'','Свободен');
            var eventDay3 = new EventDay('event3','2018-04-13','11:00','12:00',"Встреча 3",'','Занят');
            var eventsDay = [eventDay1,eventDay2,eventDay3];
        
            var doc1 = new Doc(1, "Документ 1",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');
            var doc2 = new Doc (2, "Документ 2",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');       
            var doc3 = new Doc(3, "Документ 3",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');
            var doc4 = new Doc(4, "Документ 4",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');
            var doc5 = new Doc (5, "Документ 5",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');
            var doc6 = new Doc (6, "Документ 6",'статус','2018-04-14','Бронб есть','ул. Петрова 55', '100.00 m2');
            var docs = new ListDoc([doc1,doc2],[doc3],[doc4,doc5,doc6]);
            
            eventsDay = JSON.stringify(eventsDay);
            docs = JSON.stringify(docs);

            window.localStorage.setItem('events',eventsDay);
            window.localStorage.setItem('docs',docs);
            window.parent.location.href="./docs.html";
        }
        else{
            alert('Не верный логин или пароль');
        }
    });
});