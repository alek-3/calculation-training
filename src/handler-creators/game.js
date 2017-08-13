module.exports = function(options){
  const conn = options.connection;

  return function(req, res) {
    const allquestion = 5;
    // Get type of game  
    if((req.body.calctype && req.body.difficulty )|| req.session.endflag){
      // first play or restart
      setupGame(req);
    }
    const calctype = req.session.calctype;
    const difficulty = req.session.difficulty;
  
    let questionNum = 1;
    if(req.body.answer && req.session.correctAns == req.body.answer){
      // the answer of the player is correct
      questionNum = req.session.questionNum + 1;
    }
    else{
      questionNum = req.session.questionNum;
    }
    req.session.questionNum = questionNum;

    // Answer 10 questions -> Go to result page
    if(questionNum > allquestion){
    // Set end time
      const date_obj = new Date();
      const time = date_obj.getTime() - req.session.starttime;
      const result = TimeGetTimeString(time);
      console.log(result);

      req.session.endflag = true;

      insertResult(result, calctype, difficulty, req);

      res.render("results", {result:"結果："+result});
      return;
    }

    // Set questions
    // the question is changed everytime
    setQuestion(calctype, difficulty, req);
    const calctypeLabel = getCalctypeLabel(calctype);
    const difficultyLabel = getDifficultyLabel(difficulty);

    res.render("game", {message: calctypeLabel, message2: difficultyLabel, 
      qcount:"Q."+questionNum+" / "+allquestion,  message3: req.session.firstNum+" "+req.session.sign+" "
    +req.session.secondNum+" ＝ ？"});
  };

  function setupGame(req) {
    if(req.body.calctype && req.body.difficulty){
    // start from home screen
      req.session.calctype =  req.body.calctype;
      req.session.difficulty =  req.body.difficulty;
    } 
    req.session.questionNum = 1;
    req.session.endflag = false;

    // Set start time
    const date_obj = new Date();
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
    const query ="INSERT INTO result set ?";
    const calcId = getCalctypeId(calctype);
    const difficultyId = getDifficultyId(difficulty);
    const name = req.session.username;
    const post = {player_name: name, result_time: result, 
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

  function getCalctypeLabel(calctype){
    let ret = "";
    switch(calctype){
    case "add":
      ret = "たしざん";
      break;
    case "subtract":
      ret = "ひきざん";
      break;
    case "multiple":
      ret = "かけざん";
      break;
    case "divide":
      ret = "わりざん";
      break;
    default:
      break;
    }
    return ret;
  }

  function getDifficultyLabel(difficulty){
    let ret = "";
    switch(difficulty){
    case "easy":
      ret = "かんたん";
      break;
    case "normal":
      ret = "ふつう";
      break;
    default:
      break;
    }
    return ret;
  }

};