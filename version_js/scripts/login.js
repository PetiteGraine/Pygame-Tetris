document.getElementById("button-login").addEventListener("click", function () {
    const username = document.getElementById("username-login").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                // Redirect to desired page or perform other actions
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
