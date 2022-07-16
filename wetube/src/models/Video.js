// model이란 무엇인가?
// 데이터들이 어떻게 생겼는지 알려주기 위해 구조를 만들어 주는 것이다.
// 그것을 Schema 라고 부르기로 했다.

import mongoose, { modelNames } from "mongoose";
// 몽구스를 사용하여 모델을 몽고디비에 적용 시킬 수 있도록 구조를 만들었다. 

const videoSchema = new mongoose.Schema({
    // 스카미 데이터에 대한 구체적인 설정은 매우매우매우매우매우 중요하다.
    // model은 db에 저장될 내용에 관한 설정을 해주는 것이다.
    // 이는 해커들로부터 프론트 공격을 받아도 백에서 보호를 할 수 있도록 지정하는 것이기 때문에 굉장히 중요하다.
    title : {type:String, required:true, trim : true},
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description : {type:String, required:true, trim : true},
    createdAt: {type : Date, required: true, default:Date.now},
    // mongoose 는 default:Date.now 작성하면 Date,now()를 실행시켜준다 하지만 새로운 video를 
    // 생성할 때만 실행시켜주기 위해() 를 빼고 쓴 것이다.
    hashtags: [{type : String, trim: true} ],
    meta: {
        views: {type:Number, default: 0, required:true},
        rating : {type:Number, default: 0, required:true},
        //default는 말 그대로 기본값이다. 컨트롤러에서 값을 받아서 부여하지 않아도 
        //자동으로 입력된다.
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, required:true, ref:"Comment"}],
    owner:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    //ref -> ObjectId가 어디서 오는지를 알려주는 역할을 한다.
});


videoSchema.static('formatHashtags', function(hashtags){
    return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
// 일종의 미들웨어로 모델이 생성되기 전에 처리하는 과정이다. ==> static function


const Video = mongoose.model("Video", videoSchema);

export default Video;
