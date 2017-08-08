module.exports = function(options){
  const conn = options.connection;

  return function(req, res) {
  // Get type of game  
    if((req.body.calctype && req.body.difficulty )|| req.session.endflag){
      setupGame(req);
    }
    let calctype = req.session.calctype;
    let difficulty = req.session.difficulty;
  
    let questionNum = 1;
    if(req.session.questionNum){
      if(req.session.correctAns == req.body.answer){
      // the answer of the player is correct
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

      insertResult(result, calctype, difficulty, req);

      res.render("results", {result:"結果："+result});
      return;
    }

    // Set questions
    // the question is changed everytime
    setQuestion(calctype, difficulty, req);

    res.render("game", {message: calctype, message2: "むずかしさ：" + difficulty, 
      qcount:"Q."+questionNum,  message3: req.session.firstNum+" "+req.session.sign+" "
    +req.session.secondNum+" ＝ ？"});
  };

  function setupGame(req) {
    console.log("Set session");

    if(req.body.calctype && req.body.difficulty){
    // when type and difficulty are chosen
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
    return `${hou}:${zeroPad(min, 2)}:${zeroPad(sec, 2)}.${zeroPad(milli_sec, 3)}`;
  }

  function setQuestion(calctype, difficulty, req){
  // easy: 1~9, normal 1~99
    let maxNum;
    switch(difficulty){
    case "easy":
      maxNum = 9;
      break;
    case "normal":
      maxNum = 99;
      break;
    default:
      break;
    } 

    const firstNum =  1 + Math.floor( Math.random() * maxNum ) ;
    const secondNum =  1 + Math.floor( Math.random() * maxNum ) ;
    const addNum = firstNum + secondNum;
    const multipleNum = firstNum * secondNum;

    switch(calctype){
    case "add":
      req.session.firstNum = firstNum;
      req.session.secondNum = secondNum;
      req.session.correctAns = addNum;
      req.session.sign = "＋";
      break;
    case "subtract":
      req.session.firstNum = addNum;
      req.session.secondNum = firstNum;
      req.session.correctAns = secondNum;
      req.session.sign = "－";
      break;
    case "multiple":
      req.session.firstNum = firstNum;
      req.session.secondNum = secondNum;
      req.session.correctAns = multipleNum;
      req.session.sign = "×";
      break;
    case "divide":
      req.session.firstNum = multipleNum;
      req.session.secondNum = firstNum;
      req.session.correctAns = secondNum;
      req.session.sign = "÷";
      break;
    default:
      break;
    }
  }

  function insertResult(result, calctype, difficulty, req){
    let query ="INSERT INTO result set ?";
    let calcId = getCalctypeId(calctype);
    let difficultyId = getDifficultyId(difficulty);
    let name = req.session.username;
    let post = {player_name: name, result_time: result, 
      game_type_id: calcId, difficulty_id: difficultyId};

    conn.query(query, post, function (error) {
      if (error) { console.log("err: " + error); }
    });



  }

  function getCalctypeId(calctype){
    let ret = "";
    switch(calctype){
    case "add":
      ret = 1;
      break;
    case "subtract":
      ret = 2;
      break;
    case "multiple":
      ret = 3;
      break;
    case "divide":
      ret = 4;
      break;
    default:
      break;
    }
    return ret;
  }

  function getDifficultyId(difficulty){
    let ret = "";
    switch(difficulty){
    case "easy":
      ret = 1;
      break;
    case "normal":
      ret = 2;
      break;
    default:
      break;
    }
    return ret;
    
  }

};