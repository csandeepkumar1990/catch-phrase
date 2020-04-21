var PasswordGame = function(arenaId, roomId){
 
    this.arenaId = arenaId;
    this.roomId = roomId;
    this.countdown =60;
    this.MAX_PLAYERS = 4;
    this.MAX_ROUNDS = 4;

    this.status = "YET_TO_START";
   
    this.Round = {
      overallTurns : [["TEAMA_PLAYER1", "TEAMB_PLAYER1"],["TEAMA_PLAYER2","TEAMB_PLAYER2"]],
      roundTurns : ["TEAMA_PLAYER1","TEAMB_PLAYER2","TEAMB_PLAYER1","TEAMA_PLAYER2"],
      currentTurn : ["TEAMA_PLAYER1", "TEAMB_PLAYER1"],
      innerCurrentTurn : "TEAMA_PLAYER1",
      currentRound : 0,
      maxRounds : 3,
      completedTurn : ["TEAMA_PLAYER2","TEAMB_PLAYER2"],
      TEAMAPOINTS : 0,
      TEAMBPOINTS : 0,
      currentPoints : 6,
      roundUpdated : false,
      isAnswerCorrect : false
    }
  
    this.teams = {
        TEAMA : { 
            PLAYER1 : {
                  userId : "",
                  socketId : "",
                  username : ""
            },
            PLAYER2 : {
                  userId : "",
                  socketId : "",
                  username : ""
            }
        },
    
        TEAMB : {
          PLAYER1 : {
            userId : "",
            socketId : "",
            username : ""
          },
          PLAYER2 : {
            userId : "",
            socketId : "",
            username : ""
          }
        }
    }
    
  };
  
  PasswordGame.prototype.getTeamId = function(userId){
    if(this.teams["TEAMA"]["PLAYER1"].userId == userId){
        return "TEAMA_PLAYER1";
    }
    if(this.teams["TEAMA"]["PLAYER2"].userId == userId){
        return "TEAMA_PLAYER2";
    }
    if(this.teams["TEAMB"]["PLAYER1"].userId == userId){
        return "TEAMB_PLAYER1";
    }
    return "TEAMB_PLAYER2";
  }

  PasswordGame.prototype.resetCurrentPoints = function(teamId){
      this.Round["currentPoints"] = 6;
  }

  PasswordGame.prototype.resetInnerCurrentTurn = function(teamId){
      this.Round["innerCurrentTurn"] = this.Round["roundTurns"][this.Round["currentRound"]];
  }
  
  
  PasswordGame.prototype.isaAnswer = function(teamId){
    if(this.Round["currentTurn"].includes(teamId)){
      return false;
    }
    return true;
  }
  
  PasswordGame.prototype.isaHint = function(teamId){
    if(this.Round["currentTurn"].includes(teamId)){
      return true;
    }else if(this.getInnerCurrentTurnTeam() == teamId.split("_")[0])
                return false;
            else
                return true;
  }
  
  PasswordGame.prototype.isRoundCompleted = function() {
      if(this.Round["overallTurns"].indexOf(this.Round["currentTurn"]) == this.Round["overallTurns"].length -1) {
          if(!this.Round["roundUpdated"]){
              this.Round["roundUpdated"] = true;
              return true;
          } else {
              return false;
          }
                
      } else {
          this.Round["roundUpdated"] = false;
          return false;
      }
      
  }

  PasswordGame.prototype.isMaxRoundsCompleted = function() {
        if(this.MAX_ROUNDS == this.Round["currentRound"]) {
            return true;
        }
        return false;
    }
  
  PasswordGame.prototype.getNextTurn = function(currentTurn) {
      var turn = currentTurn;
      var index = 0;
      for (let element of this.Round["overallTurns"]) {
        if(element[0].localeCompare(turn[0]) == 0) {
          if(index == this.Round["overallTurns"].length -1) {
            index = -1;
          }
          turn = this.Round["overallTurns"][index + 1];
          break;
        }
        index = index +1;
      }
      return turn;
  }
  
  PasswordGame.prototype.passInnerCurrentTurn = function() {
      this.Round["currentPoints"] = this.Round["currentPoints"]-1;
      if(this.Round["innerCurrentTurn"] == this.Round["currentTurn"][0])
        this.Round["innerCurrentTurn"] = this.Round["currentTurn"][1];
        else
            this.Round["innerCurrentTurn"] = this.Round["currentTurn"][0];
  }

PasswordGame.prototype.getInnerCurrentTurnPlayerObj = function() {
    var team = this.Round["innerCurrentTurn"].split("_")[0];
    var player = this.Round["innerCurrentTurn"].split("_")[1];
    return this.teams[team][player];
}
  
  
  PasswordGame.prototype.passTurn = function() {
      this.Round["completedTurn"] = this.Round["currentTurn"];
      this.Round["currentTurn"] =  this.getNextTurn(this.Round["currentTurn"]);
  }

PasswordGame.prototype.getPlayerObj = function(name) {
    var team = name.split("_")[0];
    var player = name.split("_")[1];
    return this.teams[team][player];
}

  PasswordGame.prototype.getInnerCurrentTurnTeam = function() {
      return this.Round["innerCurrentTurn"].split("_")[0];
   }

PasswordGame.prototype.addPoints = function() {
    if(this.getInnerCurrentTurnTeam() == "TEAMA"){
        this.Round["TEAMAPOINTS"] += this.Round["currentPoints"];

    } else {
        this.Round["TEAMBPOINTS"] += this.Round["currentPoints"];
    }
}
  
//   PasswordGame.prototype.getCurrentTurnTeam = function() {
//       return this.Round["currentTurn"].split("_")[0];
//    }
  
//    PasswordGame.prototype.getCurrentTurnPlayer = function() {
//       return this.Round["currentTurn"].split("_")[1];
//    }

//    PasswordGame.prototype.getCurrentTurnPlayerObj = function() {
//     var team = this.Round["currentTurn"].split("_")[0];
//     var player = this.Round["currentTurn"].split("_")[1];
//     return this.teams[team][player];
//     }

//     PasswordGame.prototype.getNextTurnPlayerObj = function() {
//     this.Round["completedTurn"] = this.Round["currentTurn"];
//     this.Round["currentTurn"] =  this.getNextTurn(this.Round["currentTurn"]);
//     var team = this.Round["currentTurn"].split("_")[0];
//     var player = this.Round["currentTurn"].split("_")[1];
//     return this.teams[team][player];
//     }

    PasswordGame.prototype.doIgnore = function(){
    return "DO_IGNORE";
    }
  
  module.exports = exports = PasswordGame;