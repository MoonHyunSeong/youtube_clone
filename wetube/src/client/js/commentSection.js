

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id= id;
    // x누르고 아이디 찾아서 제거하면 된다는데.
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className  = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText =`  ${text}`;
    const span2 = document.createElement("span");
    span2.innerText ="  X";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
}

const handleSubmit = async (event) =>{
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === ""){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        //express에 json 미들웨어를 서버.js에서 활용하는데 이걸 쓰기 위해서는 우리가 json파일을 보내고 있다고 헤더에 담아야 한다.
        // 그래서 fetch할때 작성하여 같이 보내둔다.
        body:JSON.stringify({text}),
        //req.body처럼 그냥 이렇게 body만 보내도 된다.
        //하지만 텍스트만 보낼 때는 log를 출력하면서 잘 출력되는지 확인해야한다.
        //우리가 보낼때는 출력이 안되어서 body:text, 로만 해서 보냈어도 안되길래
        // server.js에서 express의 도움을 받아 app.use(express.text()); 처럼 해결하니 텍스트가 출력되었다.
        // 추가적으로 오브젝트로 보내는 경우도 고려할 때 우리는 이것을 string으로 바꿔서 해결하고 싶을때가 있을것이다.
        // 그럴때 body:JSON.stringify() 를 사용하면 된다.
    });
    if(response === 201){
        textarea.value = "";
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
    // 패치할 때 async await를 반드시 쓰는 것은 아닌가보다
};

if(form){
    form.addEventListener("submit", handleSubmit);
}