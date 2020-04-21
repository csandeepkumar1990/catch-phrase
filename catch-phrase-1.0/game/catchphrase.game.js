var CatchphraseGame = function(arenaId, roomId){
 
    this.arenaId = arenaId;
    this.roomId = roomId;
    this.countdown =60;
    this.MAX_PLAYERS = 4;
    this.MAX_ROUNDS = 3;

    this.status = "YET_TO_START";
   
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
  
  CatchphraseGame.prototype.getTeamId = function(userId){
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
  
  CatchphraseGame.prototype.isaAnswer = function(teamId){
    if(this.Round["currentTurn"] == teamId){
      return false;
    }
    return true;
  }
  
  CatchphraseGame.prototype.isaHint = function(teamId){
    if(this.Round["currentTurn"] == teamId){
      return true;
    }
    return false;
  }
  
  CatchphraseGame.prototype.isRoundCompleted = function() {
      if(this.Round["overallTurns"].indexOf(this.Round["currentTurn"]) == this.Round["overallTurns"].length -1) {
          return true;
      }
      return false;
  }

  CatchphraseGame.prototype.isMaxRoundsCompleted = function() {
        if(this.MAX_ROUNDS == this.Round["currentRound"]) {
            return true;
        }
        return false;
    }
  
  CatchphraseGame.prototype.getNextTurn = function(currentTurn) {
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
  
  
  
  CatchphraseGame.prototype.passTurn = function() {
      this.Round["completedTurn"] = this.Round["currentTurn"];
      this.Round["currentTurn"] =  this.getNextTurn(this.Round["currentTurn"]);
  }
  
  CatchphraseGame.prototype.getCurrentTurnTeam = function() {
      return this.Round["currentTurn"].split("_")[0];
   }
  
   CatchphraseGame.prototype.getCurrentTurnPlayer = function() {
      return this.Round["currentTurn"].split("_")[1];
   }

   CatchphraseGame.prototype.getCurrentTurnPlayerObj = function() {
    var team = this.Round["currentTurn"].split("_")[0];
    var player = this.Round["currentTurn"].split("_")[1];
    return this.teams[team][player];
    }

    CatchphraseGame.prototype.getNextTurnPlayerObj = function() {
    this.Round["completedTurn"] = this.Round["currentTurn"];
    this.Round["currentTurn"] =  this.getNextTurn(this.Round["currentTurn"]);
    var team = this.Round["currentTurn"].split("_")[0];
    var player = this.Round["currentTurn"].split("_")[1];
    return this.teams[team][player];
    }

    CatchphraseGame.prototype.doIgnore = function(){
    return "DO_IGNORE";
    }
  
  module.exports = exports = CatchphraseGame;