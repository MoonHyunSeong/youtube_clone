import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) =>{
    res.render("join", {pageTitle: "Join"});
};

export const postJoin = async (req, res) =>{
    const {name, username, email, password,password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join",{
            pageTitle,
            errorMessage : "password confirmaion does not match.",
        });
    }
    const exists = await User.exists({$or: [{username}, {email}]});
     //$or 를 통해서 여러 케이스를 한줄로 해결 가능.
    if(exists){
        return res.status(400).render("join",{
            //status(400) 을 넣어줌으로 에러를 처리한다.
            pageTitle,
            errorMessage : "This username/email is already taken",
        });
    };
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
         });
         return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join",{
            pageTitle: "Join Video",
            errorMessage : error._message,
        });
    }
};



export const getLogin = (req, res) =>{
    res.render("login", {pageTitle: "Login"});
};

export const postLogin = async (req, res) =>{
    //check if account exists
    // check if password correct
    const {pageTitle} = "Login";
    const {username, password} = req.body;
    // 브라우저를 통해서 입력 받은 내용
    const user = await User.findOne({username, socialOnly:false});
    // 디비에서 꺼내온 내용
    if(!user){
        return res.status(400)
            .render("login",{
            pageTitle, 
            errorMessage:"An account with this username does not exists."});
    };

    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400)
            .render("login",{
            pageTitle, 
            errorMessage:"Wrong password."});
    };
    req.session.loggedIn = true;
    //loggedIn은 내부적으로 저장되어 있는게 아니라 그냥 추가한거다. user도 마찬가지.
    //필요한 내용을 세션에 이런식으로 추가할 수 있다.
    req.session.user= user;
    //디비에서 꺼내온 내용을 세션에 담는다고 생각하자.
    // 위 내용은 middleware에서 세션별로 로그인 인증을 처리한다.
    return res.redirect("/");
}

export const startGithubLogin = (req,res)=>{
    const baseUrl = 'https://github.com/login/oauth/authorize?';
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
    }; // 위 내용은 깃헙에서 요구하는 파라미터의 이름이다. 
    // 각 회사별로 요구하는 이름이 다르니 그 점에 유의하면서 작성하도록 한다.
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) =>{
    const baseUrl = "https://github.com/login/oauth/access_token?";
    const config = {
        client_id:process.env.GH_CLIENT,
        client_secret:process.env.GH_SECRET,
        code:req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}${params}`;
    const tokenRequest = await (
        await fetch(finalUrl,{
        method:"POST",
        headers : {
            Accept: "application/json",
        },
    })
    ).json(); // fetch? -> 서버엔 없고 브라우저에만 존재한다.
    // 그러므로 노드에서 다운받는다.
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        //github API와 소통하기 위한 엑세스ㅡ토큰이다. 규격이다.
        const apiUrl = "http://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
            headers:{
                Authorization: `token ${access_token}`
            }
        })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers:{
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true);
        if(!emailObj){
            return res.redirect("/login");
        } 
        let user = await User.findOne({email:emailObj.email});
        if(!user){
            user = await User.create({
                avatarUrl:userData.avatar_url,
                name : userData.name,
                username : userData.login,
                email : emailObj.email,
                password:"",
                socialOnly:true,
                location:userData.location,
            });
        }
        //userData 는 API로부터 오며, emailData 또한 깃헙API로부터 온다는걸
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
    
};


export const logout = (req,res) =>{
    req.flash("error", "byebye");
    req.session.destroy();
    return res.redirect("/");
};


export const getEdit = (req,res) =>{
    return res.render("edit-profile",{pageTitle:"Edit Profile",user:req.session.user});
}

export const postEdit = async (req,res) =>{
    // email 중복체크 코드 챌린지.
    const {
        session : {
            user:{_id, avatarUrl},
        },
        body:{name,email,username,location},
        file,
    } = req;
    const updateUser = await User.findByIdAndUpdate(
        _id, 
    {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
    },
    {new :true});
    // findByIdAndUpdate는 업데이트 되기 전의 데이터를 리턴해주고  {new :true} 를 설정해주면 findByIdAndUpdate가
    // 업데이트된 데이터를 리턴해줄것이다. 이와같이하면 아래 주석내용처럼 길게 작성할 필요가 없다.
    req.session.user = updateUser;
    // req.session.user = {
    //     ...req.session.user,
    //     // 세션업데이트 과정에서 수정되지 않는 내용이 있기때문에 먼저 덮어주고 수정된 내용을 밑에 작성해준다.
    //     name,
    //     email,
    //     username,
    //     location,
    // };
    // 폼에서 내용을 받고 디비에 업데이트를 했지만 세션도 업데이트를 해줘야한다.
    //그래야만 프론트에서 변경된 값이 보인다.
    return res.redirect("/users/edit");
}

export const getChangePassword = (req,res) =>{
    if(req.session.user.socialOnly === true){
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle:"change Password"});
}

export const postChangePassword = async (req,res) =>{
    const {
        session : {
            user:{_id,password},
        },
        body:{oldPassword,
            newPassword,
            newPasswordConfirmation,
        },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok){
        return res.status(400)
        .render("users/change-password", {
            pageTitle:"change Password", 
            errorMessage: "the current password is incorrect"
        });
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400)
        .render("users/change-password", {
            pageTitle:"change Password", 
            errorMessage: "the password does not match"
        });
    }
    user.password = newPassword;
    user.save();
    //req.session.user.password = user.password;
    // 세션과 디비 업데이트를 각각 해줘야한다.
    return res.redirect("/users/logout");
};

export const see = async (req, res) =>{
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
          path: "owner",
          model: "User",
        },
      });
    if(!user){
        return res.status(404).render("404",{pageTitle:"User not found"});
    }
    return res.render("users/profile", {pageTitle: user.name, user});
};