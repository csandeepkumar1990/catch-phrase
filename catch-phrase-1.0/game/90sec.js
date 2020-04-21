
var NinetysecGame = function(arenaId, roomId){
 
  this.arenaId = arenaId;
  this.roomId = roomId;
  this.countdown =60;
 
  this.Round = {
    //"TEAMA_PLAYER1","TEAMB_PLAYER1","TEAMA_PLAYER2","TEAMB_PLAYER2"
    overallTurns : ["TEAMA_PLAYER1","TEAMB_PLAYER1"],
    currentTurn : "TEAMA_PLAYER1",
    currentRound : 0,
    maxRounds : 1,
    completedTurn : "TEAMB_PLAYER2"
  }

  this.teams = {
    TEAMA : { 
        PLAYER1 : {
              userId : "1",
              socketId : "",
              username : ""
        }
    },

    TEAMB : {
      PLAYER1 : {
        userId : "",
        socketId : "",
        username : ""
      }
    }
  }
  
};

NinetysecGame.prototype.getTeamId = function(userId){
  if(this.teams["TEAMA"]["PLAYER1"].userId == userId){
    return "TEAMA_PLAYER1";
  }
  return "TEAMB_PLAYER1";
}

NinetysecGame.prototype.isaAnswer = function(teamId){
  if(this.Round["currentTurn"] == teamId){
    return false;
  }
  return true;
}

NinetysecGame.prototype.isaHint = function(teamId){
  if(this.Round["currentTurn"] == teamId){
    return true;
  }
  return false;
}

NinetysecGame.prototype.isRoundCompleted = function() {
    if(this.Round["overallTurns"].indexOf(this.Round["currentTurn"]) == this.Round["overallTurns"].length -1) {
        return true;
    }
    return false;
}

NinetysecGame.prototype.getNextTurn = function(currentTurn) {
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



NinetysecGame.prototype.passTurn = function(currentTurn) {
    this.Round["currentTurn"] =  this.getNextTurn(currentTurn);
}

NinetysecGame.prototype.getCurrentTurnTeam = function() {
    return this.Round["currentTurn"].split("_")[0];
 }

 NinetysecGame.prototype.getCurrentTurnPlayer = function() {
    return this.Round["currentTurn"].split("_")[1];
 }

module.exports = exports = NinetysecGame;