
$(document).ready(function(){
    if(window.localStorage.getItem('login')!==null && window.localStorage.getItem('password')!==null){
        var login = window.localStorage.getItem('login');
        var password = window.localStorage.getItem('password');
        
        var aut = {
            "aut":{
                "login": login,
                "password": password
            }
        };

        $.ajax({
            url: url+"/getRegDocs",
            success: function(data){
                window.parent.location.href="./docs.html";
                window.sessionStorage.setItem("login",login);
                window.sessionStorage.setItem("password",password);
            },
            type: "POST",
            error:function(jqXHR){
                //alert("Сохранённый логин и пароль не действителен!");
            },
            data: JSON.stringify(aut)
        });
    }

    $('.content').on('click','#button-Aut', function(e){
        var login = $('#login').val().toString();
        var password = $('#password').val().toString();
        var remember = $('#remember').is(':checked');
        
        var aut = {
            "aut":{
                "login": login,
                "password": password
            }
        };

        $.ajax({
            url: url+"/getRegDocs",
            success: function(data){
                window.parent.location.href="./docs.html";
                if(remember){
                    window.localStorage.setItem("login",login);
                    window.localStorage.setItem("password",password);
                }else{
                    window.sessionStorage.setItem("login",login);
                    window.sessionStorage.setItem("password",password);
                }
            },
            type: "POST",
            error:function(jqXHR){
                alert(jqXHR.statusText);
                //alert('Не верный логин или пароль');
            },
            data: JSON.stringify(aut)
        });
    });
});
