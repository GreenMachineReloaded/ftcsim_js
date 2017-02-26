function load(file) {
    var req = new XMLHttpRequest();
    req.open("GET", file, true);
    req.send();
    while (req.readyState < 2) {
        console.log("Loading...");
    }
    return this.responseText;
}
