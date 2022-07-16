import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";



// Video.find({}, (error, videos)=>{  
// });

export const home = async(req,res) =>{
    const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
    //db 에서 video가 존재할 때 그 내용을 찾아서 videos 에 담는다.
    console.log(videos);
    res.render("home", {pageTitle: "home", videos});
};

export const watch = async (req, res) => {
    const { id } = req.params;
    // == const id = req.params.id;
    // id를 콘솔창에 출력해보면 비디오에 대한 id가 나온다. 
    // id는 어디서 오는가? 비디오 목록에서 비디오를 누르면 url 안에 Id가 존재한다. 
    // id를 바탕으로 그 비디오를 찾는 것이다.
    // 디비에 연결 된 경우에는 req.params 로 가져온 id만으로도 비디오를 찾을 수 있다는 것을 알려준다.
    const video = await Video.findById(id).populate("owner").populate("comments");
    if (!video){
        return res.status(404).render("404",{pageTitle: "Video not found."});
    }
    return res.render("watch", {pageTitle :"Watching", video/* == video:video*/});
};

export const getEdit = async (req,res) =>{
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if (!video){
        return res.status(404).render("404",{pageTitle: "Video not found."});
    }
    if(String(video.owner) !== String(_id)){
        req.flash("error", "Not authorized");
        //어떠한 상황에서도 백엔드에서 본인이 아닌 이상 수정이 불가능하게 한다.
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit ${video.title}`, video});
};

export const postEdit = async (req, res) =>{
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const {title, description, hashtags} = req.body;
    // 수정하고 싶은 내용들을 여기에 담아두고 밑에서 수정하는거다.
    // body는 form을 통해 받은 내용들을 가져오는 것이다.
    const video = await Video.exists({_id : id});
    // findById를 사용하면 비디오 전체를 가져오는데 굳이? 이런 느낌이다
    // exists 를 사용하면 해당 아이디에 속한 비디오가 있는지 t/f로 알려준다. 추가적으로 파라미터는 filter로 받는다. 
    // 이건 비디오가 있는지 id를 통해 찾아온거지 세부내용을 가져오는게 아니다.
    if(!video){
        return res.render("404",{pageTitle: "Video not found."});
    }
    if(String(video.owner) !== String(_id)){
        //어떠한 상황에서도 백엔드에서 본인이 아닌 이상 수정이 불가능하게 한다.
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        // this.title = title 이런식으로 하지 않고 mongoose 에 있는 함수를 사용하여서 
        // 바꿀 내용을 구조적으로 보여주고 한번에 해결하는 구조를 만들어준다. create와 유사.
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req,res) =>{
    return res.render("upload",{pageTitle: "Upload Video"});
};

export const postUpload = async(req, res) =>{ 
    const {
        user:{_id},
    } = req.session;
    const {video, thumb} = req.files;
    const {
        title,
        description,
        hashtags,
    } = req.body;
    try{
        const newVideo = await Video.create({
        title,
        // == title : this.title 자바식으로 짬뽕해서 쓰면 이런식이다.
        description,
        //createdAt: Date.now(),
        fileUrl : video[0].path,
        thumbUrl : thumb[0].path,
        owner:_id,
        hashtags: Video.formatHashtags(hashtags),
        // meta:{
        //     views:0,
        //     rating:0,
        // },
        // 모델에서 디폴트 값을 주었기 때문에 굳이 다시 쓸 필요가 없어진 내용들이다. -> 헷갈리면 6.17 강의 확인
    }); // 이것은 비디오 오브젝트를 생성한 내용이다 진짜 데이터와 관련이 있는 위치다. 
    // 새로운 비디오가 생성될 때마다 mongoose에서 고유의 id를 준다
    // 추가적으로 여기까지만 한다면 데이터베이스에 저장되는 것은 아니다. 어떻게 저장하는가?
    //await video.save();
    //이렇게 한다. save 는 promise를 리턴해주는데 저장이 될 때까지 기다리기 위해 async, await를 사용한다.
    // 추가적으로 save는 몽구스가 해주는 것이다.
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
    } catch(error){
        return res.status(400).render("upload",{
            pageTitle: "Upload Video",
            errorMessage : error._message,
        });
    }
};

export const deleteVideo = async (req,res)=>{
    const {
        user:{_id},
    } = req.session;
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404",{pageTitle: "Video not found."});
    }
    if(String(video.owner) !== String(_id)){
        //어떠한 상황에서도 백엔드에서 본인이 아닌 이상 수정이 불가능하게 한다.
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}
// delete, remove 차이?
// -> 대부분의 경우 delete를 사용한다.

export const search = async (req, res) =>{
    const {keyword} = req.query;
    // 입력받은 값을 갖고 오는 query
    let videos = [];
    // if 구절 유효범위 문제 때문에 let으로 구성
    if(keyword){
        // search
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
                // i == 대소문자 구분을 안해주는 역할.
                // keyword를 포함하는 영상들을 찾을거다.
                //₩^${keyword}₩ => 키워드로 시작하는 문자열만 찾는다.
                //이건 몽고디비가 제공하는 기능이다.
            }, 
        }).populate("owner");
    }
    return res.render("search", {pageTitle:"Search", videos});
};


export const registerView = async (req, res) =>{
    const {id} = req.params;
    //id from router
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
        // status는 무언가 랜더링을 해줘야만 하는 메소드라 작성하면 에러난다 어떻게 해결하는가? sendStatus를 사용한다.
        //status는 무언가 랜더링을 하기전에 상태를 알려주기에 랜더링이 필수적이고
        //sendStatus는 상태를 보내주고 연결을 끊어내는 역할이다.
    }
    video.meta.views = video.meta.views +1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) =>{
    const {
        session:{user},
        body:{text},
        params:{id}, 
    } = req;

    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video:id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId: comment._id});
}