function attachEvents() {
    const baseUrl = 'https://messager-a5533.firebaseio.com/';

    $('#refresh').click(refresh);
    $('#submit').click(sendMessage);

    let displayMessages = $('#messages');

    function refresh() {
        let req ={
            url: baseUrl + 'messager.json',
            method: 'GET',
            success: postMessage,
            error: handleError
        }

        $.ajax(req);
    }

    function postMessage(messages) {
        let result = '';
        let orderedMessages = [];
        Object.keys(messages).forEach(k => orderedMessages.push(messages[k]));
        console.log(orderedMessages);
        for(let message of orderedMessages.sort((a, b) => a.timestamp - b.timestamp)){
            result += message.author + ': ' + message.content + '\n';
        }

        $(displayMessages).text(result);
    }

    function handleError(err) {
        $(displayMessages).text('Error');
    }

    function sendMessage() {
        let author = $('#author');
        let content = $('#content');
        if($(author).val() !== '' && $(content).val() !== ''){
            let message = {
                author: $(author).val(),
                content: $(content).val(),
                timestamp: Date.now()
            };

            let req = {
                url: baseUrl + 'messager.json',
                method: 'POST',
                data: JSON.stringify(message),
                success: refresh,
                error: handleError
            };
            $.ajax(req);
        }
    }
}