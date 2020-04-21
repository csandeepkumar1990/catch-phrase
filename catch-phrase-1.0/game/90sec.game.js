
var NinetysecGame = function(arenaId, roomId){
 
  this.arenaId = arenaId;
  this.roomId = roomId;
  this.countdown =60;
  this.MAX_PLAYERS = 2;
  this.MAX_ROUNDS = 1;

  this.status = "YET_TO_START";
 
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
      }
    }
  }

  this.scoreBoard = {
    TEAMA : {
      PLAYER1 : {
        points: 0,
        correctans: 0
      },

      METRICS : { 
        points : 0,
        correctans: 0
      }

    },

    TEAMB : {
      PLAYER1 : {
        points: 0,
        correctans: 0
      },

      METRICS : { 
        points : 0,
        correctans: 0
      }
    },

    METRICS : {
      overallwinner : "",
      TEAMA_POINTS : 0,
      TEAMB_POINTS : 0
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

NinetysecGame.prototype.isMaxRoundsCompleted = function() {
  if(this.MAX_ROUNDS == this.Round["currentRound"]) {
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



NinetysecGame.prototype.passTurn = function() {
    this.Round["currentTurn"] =  this.getNextTurn(this.Round["currentTurn"]);
}

NinetysecGame.prototype.getCurrentTurnTeam = function() {
    return this.Round["currentTurn"].split("_")[0];
 }

 NinetysecGame.prototype.getCurrentTurnPlayer = function() {
    return this.Round["currentTurn"].split("_")[1];
 }

 NinetysecGame.prototype.getCurrentTurnPlayerObj = function() {
  var team = this.Round["currentTurn"].split("_")[0];
  var player = this.Round["currentTurn"].split("_")[1];
  return this.teams[team][player];
}

 NinetysecGame.prototype.doIgnore = function(){
  return "DO_IGNORE";
}

module.exports = exports = NinetysecGame;