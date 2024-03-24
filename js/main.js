async function showWarn(message) {
    await Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: message,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    });
}


async function showSuccess(first_name, username) {
    await Swal.fire({
        title: "WebHook Was Set",
        html: `Your Bot : <a href="https://t.me/${username}">${first_name}</a>`,
        icon: "success",
    });
}


async function showError(error_code, description) {
    await Swal.fire({
        icon: "error",
        title: `e-Code : ${error_code}`,
        text: description,
    });
}


async function validate_items(token, url, maxConnections, dropPendingUpdates, allowedUpdates) {
    if (!token || token.length !== 46) {
        await showWarn("Token is Invalid");
        return false;
    }
    if (!url || !url.startsWith("https://")) {
        await showWarn("URL should start with 'https://'");
        return false;
    }
    if (maxConnections === null || maxConnections === undefined || isNaN(maxConnections) || maxConnections < 40 || maxConnections > 100) {
        await showWarn("Max Connections should be a number between 40 and 100");
        return false;
    }
    if (dropPendingUpdates === null || dropPendingUpdates === undefined || typeof dropPendingUpdates !== "boolean") {
        await showWarn("Drop Pending Updates is missing or not a boolean");
        return false;
    }
    if (!Array.isArray(allowedUpdates)) {
        await showWarn("Allowed Updates is missing or empty");
        return false;
    }
    return true;
}


async function setWebHook(token, url, ipAddress, maxConnections, dropPendingUpdates, allowedUpdates){
    if(!await validate_items(token, url, maxConnections, dropPendingUpdates, allowedUpdates)){
        return;
    }
    const data = {
        token: token,
        url: url,
        ip_address: ipAddress,
        max_connections: maxConnections,
        drop_pending_updates: dropPendingUpdates,
        allowed_updates: allowedUpdates,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    const response = await fetch('./request.php', options);
    var result = await response.json();
    console.log(result);
    return result;
}


document.getElementById("submitButton").addEventListener("click", async function() {
    var token = document.getElementById("token").value;
    var url = document.getElementById("url").value;
    var ipAddress = document.getElementById("ip_address").value;
    var maxConnections = document.getElementById("max_connections").value;
    var dropPendingUpdates = document.querySelector('input[name="drop_pending_updates"]').checked;
    var allowedUpdates = Array.from(document.querySelectorAll('#allowed_updates option:checked')).map(option => option.value);
    var response = await setWebHook(token, url, ipAddress, maxConnections, dropPendingUpdates, allowedUpdates);
    if(response.ok){
        await showSuccess(response.result.first_name, response.result.username);
    }else{
        await showError(response.error_code, response.description);
    }
});