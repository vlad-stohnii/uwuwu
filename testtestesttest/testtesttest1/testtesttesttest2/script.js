// Vulnerable JavaScript Example

// 1. Cross-Site Scripting (XSS)
function displayUserInput() {
    var userInput = document.getElementById('userInput').value;
    // Directly inserting user input into the DOM without sanitization
    document.getElementById('output').innerHTML = userInput;
}

// 2. Insecure use of eval
function executeUserScript() {
    var userScript = document.getElementById('userScript').value || '';
    // Basic limits to reduce abuse
    if (userScript.length > 10000) {
        console.warn('User script too large, aborted.');
        return;
    }
    // Remove any existing sandboxed iframe
    var existing = document.getElementById('userScriptSandbox');
    if (existing) {
        existing.parentNode.removeChild(existing);
    }
    var iframe = document.createElement('iframe');
    iframe.id = 'userScriptSandbox';
    // sandbox="allow-scripts" permits script execution but prevents the iframe from sharing origin
    // with the parent, reducing risk of DOM access or exfiltration. Do NOT add allow-same-origin.
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.display = 'none';
    // Escape closing script tags so the srcdoc string isn't terminated early
    var safeScript = userScript.replace(/<\/script>/gi, '<\\/script>');
    // Run the user script inside an isolated srcdoc iframe; errors are caught inside the iframe
    iframe.srcdoc = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>try{'
                    + safeScript +
                    '}catch(e){if (parent && parent.console) parent.console.error("Sandbox error:", e);}<\/script></body></html>';
    document.body.appendChild(iframe);
}

// 3. Unsecured AJAX request
function loadUserData() {
    var xhr = new XMLHttpRequest();
    // Using HTTP instead of HTTPS and no proper handling of CORS
    xhr.open('GET', 'http://example.com/userdata', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('ajaxOutput').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
