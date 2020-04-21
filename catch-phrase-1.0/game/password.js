
var PasswordGame = function(arenaId, roomId){
 
    

  this.arenaId = arenaId;
  this.roomId = roomId;
  this.countdown =60;
 
  this.Round = {
    overallTurns : ["TEAMA_PLAYER1","TEAMB_PLAYER1","TEAMA_PLAYER2","TEAMB_PLAYER2"],
    currentTurn : "TEAMA_PLAYER1",
    currentRound : 0,
    maxRounds : 3,
    completedTurn : "TEAMB_PLAYER2"
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

PasswordGame.prototype.isaAnswer = function(teamId){
  if(this.Round["currentTurn"] == teamId){
    return false;
  }
  return true;
}

PasswordGame.prototype.isaHint = function(teamId){
  if(this.Round["currentTurn"] == teamId){
    return true;
  }
  return false;
}

PasswordGame.prototype.isRoundCompleted = function() {
    if(this.Round["overallTurns"].indexOf(this.Round["currentTurn"]) == this.Round["overallTurns"].length -1) {
        return true;
    }
    return false;
}

PasswordGame.prototype.getNextTurn = function(currentTurn) {
    var turn = currentTurn;
    var index = 0;
    for (let element of this.Round["overallTurns"]) {
      if(element.localeCompare(turn) == 0) {
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



PasswordGame.prototype.passTurn = function(currentTurn) {
    this.Round["currentTurn"] =  this.getNextTurn(currentTurn);
}

PasswordGame.prototype.getCurrentTurnTeam = function() {
    return this.Round["currentTurn"].split("_")[0];
 }

 PasswordGame.prototype.getCurrentTurnPlayer = function() {
    return this.Round["currentTurn"].split("_")[1];
 }

module.exports = exports = PasswordGame;