// Create the main container div
let e = document.createElement("div");
e.style.cssText = `
    width: 300px; 
    left: 1px; 
    top: 1px; 
    background-color: #282828; 
    color: white; 
    outline: white solid 1px; 
    position: absolute; 
    z-index: 99999; 
`;

// Set inner HTML for the main container
e.innerHTML = `
    <h1 style="font-size: 32px;">Mova PRO</h1>
    <br>
    <h2 style="font-size: 25px; font-style: normal; color: white;">Lesson Skipper</h2>
    <button id="skip-lesson">Skip current lesson</button>
    <br>
    <h2 style="font-size: 25px; font-style: normal; color: white;">Question Skipper</h2>
    <button id="skip-question">Skip current question</button>
    <br><br>
    <h1 style="font-size: 15px;">Darian on TOP</h1>
`;

// Append the main container to the body
document.body.appendChild(e);

// Add event listener for the "Skip Lesson" button
document.getElementById("skip-lesson").addEventListener("click", () => {
    let score = prompt("Score?");
    Object.values(top.document.querySelector("#main-section"))[0].return.return.memoizedProps.store.dispatch({
        type: "features/lesson/COMPLETE_LESSON_COMPONENT",
        payload: {
            componentStatusId: top.html5Iframe.src.split("=")[1].split("&")[0],
            instructionLessonOutcome: {
                score: score
            },
        }
    })
    Object.values(top.document.getElementById("html5-lesson-splash"))[0].memoizedProps.children[1]._owner.pendingProps.navigateToPage("/student/lesson/completed/true/" + score);
});

// Add event listener for the "Skip Question" button
document.getElementById("skip-question").addEventListener("click", () => {
    // find what context the script is being ran in
    let frame = document.getElementById("html5Iframe")?.contentWindow || window;
    
    // find the webpack in the frame (changes between lessons)
    let publicWebpack = Object.keys(frame).find((p => p.includes("webpack")));
    
    // push our own chunk to the webpack
    frame[publicWebpack].push([[Symbol()], {}, function (require) {
    
        // decode every module to find the one that contains "secret1"
        Object.values(require.m).forEach(function (module, index) {
            let decodedFn = Function.prototype.toString.apply(module).replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/g, match => {
                const hexCode = match.slice(2);
                return String.fromCharCode(parseInt(hexCode, 16));
            });
    
            // once we find the module get the token
            if (decodedFn.includes("secret01")) {
                let token = Object.values(require(Object.keys(require.m)[index]))[0]; // token is a "security" feature
    
                // find the react props for the lesson
                let lessonElement = frame.document.body.children['ifabric-react-root'].children['container'].children['lesson'];
                let lessonComponent = Object.values(lessonElement)[0].memoizedProps.children[1]._owner.stateNode._screenContainerRef._screenControllerViewRef.component;
    
                // set the score for the current screen and pass it
                lessonComponent.score = { raw: 1, max: 1 };
                lessonComponent.api.screen.complete(lessonComponent.score, token);
                lessonComponent.api.screen.enableNext(1, token);
            }
        });
    }]);
});

// Variables for dragging functionality
let t, o, isDragging = false;

// Mouse down event to initiate dragging
e.addEventListener("mousedown", (event) => {
    isDragging = true;
    t = event.clientX - e.offsetLeft;
    o = event.clientY - e.offsetTop;
});

// Mouse move event to update position while dragging
document.addEventListener("mousemove", (event) => {
    if (isDragging) {
        e.style.left = `${event.clientX - t}px`;
        e.style.top = `${event.clientY - o}px`;
    }
});

// Mouse up event to stop dragging
document.addEventListener("mouseup", () => {
    isDragging = false;
});
