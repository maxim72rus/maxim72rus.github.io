$(document).ready(function(){
    $('body').on('click',function(e){
        if($(e.target)!=$('.menu')&&
        $('.menu').find(e.target).length==0
        &&
        $(e.target)!=$('.button-menu')&&
        $('.button-menu').find(e.target).length==0){
            $('.container-menu').remove();
        }
    });

    $('header').on('click','.button-menu', function(e){
        if($('.container-menu').length==0){
            $('body').append("<div class='container-menu'><div class='menu'>"+
                    "<div class='menu-item' id='menu-item-docs'>Работа с документами</div>"+
                    "<div class='menu-item' id='menu-item-calendar'>Календарь</div>"+
                    "<div class='menu-item' id='menu-item-exit'>Выход из аккаунта</div>"+
            "</div></div>");

            var fileHtmlName = location.pathname.match(/[^/]*$/);
            switch(fileHtmlName.toString()){
                case 'doc-info.html':
                case 'docs.html':
                    $('#menu-item-docs').removeClass('menu-item');
                    $('#menu-item-docs').addClass('menu-item-active');
                    break;
                case 'calendar-add-event.html':
                case 'calendar-day.html':
                case 'calendar.html':
                    $('#menu-item-calendar').removeClass('menu-item');
                    $('#menu-item-calendar').addClass('menu-item-active');
                    break;
                default:
                    break;
            }
        }
    });

    $('body').on('click','.menu-item',function(e){
        switch(this.id){
            case 'menu-item-docs':
                window.parent.location.href="./docs.html";
                break;                
            case 'menu-item-calendar':
                window.parent.location.href="./calendar.html";
                break;                
            case 'menu-item-exit':
                window.parent.location.href="./aut.html";
                break;
            default:
                break;
        }
    });
});