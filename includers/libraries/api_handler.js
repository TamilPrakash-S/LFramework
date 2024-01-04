class APIHandler
{
    static CreateApiCall(apiFilePath, data, callbackFuction, isNonParseCheck)
    {
        return new Promise((resolve, reject) =>
        {                    
            function returnCall(x)
            {
                resolve(x);
                callbackFuction(x);
            }
            fetch(apiFilePath,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(async function (response)
                {
                    if (!callbackFuction) callbackFuction = () => { };
                    let resultData = await response.text();
                    try
                    {
                        if(isNonParseCheck) returnCall(resultData);
                        else 
                        {
                            let boolRes = JSON.parse(resultData);
                            if(!boolRes.Result) console.error(boolRes.Message); 
                            returnCall(boolRes);
                        }
                    }
                    catch (e)
                    {
                        console.error(e);
                        console.error(resultData);
                        let result = { "Result": false };
                        result["Message"] += resultData;
                        let errorWindow = window.open("", "Error Window", "width=1000,height=1000");
                        let data = result["Message"];
                        errorWindow.document.write(data);
                        resultData = result;
                        returnCall();
                    }
                })
                .catch(function (error)
                {
                    console.warn(error);
                    returnCall();
                });
        });
    }

    static CreateApiCallAjax(apiFilePath, data, callbackFuction, isNonParseCheck) /* Need TO include JQuery */
    {
        $.ajax({
            type: "POST",
            url: apiFilePath,
            data: JSON.stringify(data),
            headers: { 'Accept': 'application/json' },
            success: function (resultData)
            {
                function returnCall(data)
                {
                    if (data.Result)
                    {
                        callbackFuction(resultData.Value);
                    }
                    else
                    {
                        console.error(resultData.Message)
                    }
                }
                if (isNonParseCheck)
                {
                    returnCall(resultData);
                    return;
                }
                try
                {
                    resultData = JSON.parse(resultData);
                    returnCall(resultData);
                }
                catch (e)
                {
                    console.error(e);
                    console.error(resultData);
                    let result = { "Result": false };
                    result["Message"] += resultData;
                    let errorWindow = window.open("", "Error Window", "width=1000,height=1000");
                    let data = result["Message"];
                    errorWindow.document.write(data);
                    resultData = result;
                    returnCall("");
                }
            },
            error: function (response)
            {
                console.warn(response);
            }
        });
    }
}

window.APIHandler = APIHandler;