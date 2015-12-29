// JavaScript source code
/*
Suggested error handling from https://www.youtube.com/watch?v=p-2fzgfk9AA 13:27

//custom mountain error
function MountainError(message) {
    Error.captureStackTrace(this);
    this.message = message;
    this.name = "MountainError";
}
MountainError.prototype = Object.create(Error.prototype);


//Error Handler (from same resource, 19:18)

function handleError(err, req, res) {
    logError(err);

    var message = err ? err.message : "Internal Server Error";

    res.json({
        error: {message: message}
    });

    function logError(error) {
        console.log({
            message: error.message,
            stack: error.stack
        });
    }
}

//ERROR HANDLER (USAGE)

app.get('/mountains/:id', function(req, res) {
    db.get(req.params.id, function(err, user) {
        if (err) {
            return handleError(err, req, res);
        }
        res.json(user);
    });
});

*/
