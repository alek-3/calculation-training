module.exports = function(req, res) {
  // Get type of game  
  if((req.body.calctype && req.body.difficulty )|| req.session.endflag){
    setupGame(req);
  }
  let calctype = req.session.calctype;
  let difficulty = req.session.difficulty;
  
  let questionNum = 1;
  if(req.session.questionNum){
    if(req.session.firstnum + req.session.secondnum  == req.body.answer){
      questionNum = req.session.questionNum + 1;
    }
    else{
      questionNum = req.session.questionNum;
    }
  }
  req.session.questionNum = questionNum;

  // Answer 10 questions -> Go to result page
  if(questionNum > 5){
    // Set end time
    let date_obj = new Date();
    let time = date_obj.getTime() - req.session.starttime;
    let result = TimeGetTimeString(time);
    console.log(result);

    req.session.endflag = true;

    res.render("results", {result:"結果："+result});
    return;
  }

  // Set questions
  let firstnum = 1 + Math.floor( Math.random() * 9 ) ;
  let secondnum = 1 + Math.floor( Math.random() * 9 ) ;
  req.session.firstnum = firstnum;
  req.session.secondnum = secondnum;

  res.render("game", {message: calctype, message2: "むずかしさ：" + difficulty, 
    qcount:"Q."+questionNum,  message3: firstnum+" + "+secondnum+" = ?"});
};

function setupGame(req) {
  console.log("Set session");
  if(req.body.calctype && req.body.difficulty){
    req.session.calctype =  req.body.calctype;
    req.session.difficulty =  req.body.difficulty;
  } 
  req.session.questionNum = 1;
  req.session.endflag = false;

  // Set start time
  let date_obj = new Date();
  req.session.starttime = date_obj.getTime();
}

function zeroPad(num, rank) {
  let tmp = "";
  for (let i = 0; i < rank; i++) {
    tmp += "0";
  }
  let numStr = num.toString();
  numStr = tmp + numStr;
  return numStr.substring(numStr.length - rank);
}

function TimeGetTimeString(time){
  var milli_sec = time % 1000;
  time = (time - milli_sec) / 1000;
  var sec = time % 60;
  time = (time - sec) / 60;
  var min = time % 60;
  var hou = (time - min) / 60;
  return `${hou}:${zeroPad(min, 2)}:${zeroPad(sec, 2)}.${zeroPad(milli_sec, 4)}`;
}
