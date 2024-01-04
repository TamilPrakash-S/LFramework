async function init()
{
    FileIncluder.LoadJs("includers\\libraries\\api_handler.js");
    FileIncluder.LoadJs("includers\\animation\\l_animation.js");
    FileIncluder.LoadJs("includers\\libraries\\l_helper.js");
    FileIncluder.LoadJs("includers\\libraries\\extension.js");
    FileIncluder.LoadJs("includers\\elements\\l_div.js");
    FileIncluder.LoadJs("includers\\elements\\l_card.js");
    FileIncluder.LoadJs("includers\\elements\\l_button.js");
    // FileIncluder.LoadJs();
    // FileIncluder.LoadJs();
    // FileIncluder.LoadJs();
    // FileIncluder.LoadJs();
    let stringData = "";
    stringData += await JoinJs("includers\\libraries\\api_handler.js"); 
    stringData += await JoinJs("includers\\animation\\l_animation.js");
    stringData += await JoinJs("includers\\libraries\\FileIncluder.js");
    stringData += await JoinJs("includers\\libraries\\l_helper.js");
    stringData += await JoinJs("includers\\libraries\\extension.js");
    stringData += await JoinJs("includers\\elements\\l_div.js");
    stringData += await JoinJs("includers\\elements\\l_key_value_label.js");
    stringData += await JoinJs("includers\\elements\\l_label.js");
    stringData += await JoinJs("includers\\elements\\l_check_box.js");
    stringData += await JoinJs("includers\\elements\\l_card.js");
    stringData += await JoinJs("includers\\elements\\l_grid.js");
    stringData += await JoinJs("includers\\elements\\l_multiselect_cards.js");
    stringData += await JoinJs("includers\\elements\\l_textbox.js");
    stringData += await JoinJs("includers\\elements\\l_icon.js");
    stringData += await JoinJs("includers\\elements\\l_icon_label.js");
    stringData += await JoinJs("includers\\elements\\l_icon_textbox.js");
    stringData += await JoinJs("includers\\elements\\l_button.js");
    stringData += await JoinJs("includers\\elements\\l_tabpage.js");
    stringData += await JoinJs("includers\\elements\\l_active_button.js");
    stringData += await JoinJs("includers\\elements\\l_pagination.js");
    stringData += await JoinJs("includers\\elements\\loaders\\l_loader.js");
    stringData += await JoinJs("includers\\elements\\l_table.js");
    stringData += await JoinJs("includers\\elements\\l_select.js");
    stringData += await JoinJs("includers\\elements\\l_datepicker.js");
    stringData += await JoinJs("includers\\elements\\l_toast.js");
    stringData += await JoinJs("includers\\elements\\l_switch.js");

    // console.log(stringData);
    // var obfuscationResult = JavaScriptObfuscator.obfuscate(stringData);
    // console.log(obfuscationResult.getObfuscatedCode());
}


function JoinJs(fileName)
{
    return new Promise(function (resolve, myReject)
    {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", fileName);
    xhr.responseType = "blob";
    xhr.onload = function ()
    {
        if (xhr.status === 200) 
        {
            var fr = new FileReader();
            fr.onload = function ()
            {resolve(fr.result);
                resolve(fr.result.replace(/[^\x20-\x7E]/gmi, ""));
            }
            fr.readAsText(xhr.response);
        }
        else { }
    };
    xhr.send();
});
}

init();