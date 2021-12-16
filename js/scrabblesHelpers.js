/**
 * File: scrabblesHelpers.js
 * Purpose: Contain all help function used in scrabbles.js
 * Author: Jen Yuan Shih (JenYuan_Shih@student.uml.edu)
 * Last Updated: 12/14/2021 9:00PM EST
 */

/**
 * Triggers when an accepted tiles is dragged onto the board, reposition 
 * the tiles to the center of the slot and append the element to the board.
 * Update the current word being displayed as well as the score
 * @param {Event} event 
 * @param {Object} ui 
 */
function dropBoardHandler(event, ui){
    var $this = $(this);
    
    $(this).append(ui.draggable.css('position', 'static'))
    ui.draggable.position({
        of: $this
    })
    ui.draggable.addClass("onBoard");
    ui.draggable.removeClass("onRack");
    updateCurrentWord();
    updateScore();
}

/**
 * Validate the tiles being dropped into the specific board slot and see if all requirements 
 * are met.
 * 1. Can't drop a tile if there's already a tile existing on the slot
 * 2. Can't drop a tile if the tiles were previously between two elements, which
 * could create a disconnecting word
 * 3. Can't dropa tile if the tile dropped will create a disconnecting word on the board
 * @param {Object} dropElm 
 * @returns boolean if the slot accepts the tile
 */
function boardTileAcceptHandler(dropElm){
    var currBoardTilesCount = $("#ScrabbleBoard .tiles").length;
    //if board is cleared, tile can be placed anywhere
    if(currBoardTilesCount == 0){
        return true;
    }
    else if(currBoardTilesCount == 1 && dropElm.hasClass("onBoard")){
        return true;
    }
    else{
        //if the current boardslot have tile, droppable won't accept
        if($(this).has(".tiles").length){
            return false;
        }
        //element between two tiles can't be moved 
        else if(dropElm.parent().prev().has(".tiles").length && dropElm.parent().next().has(".tiles").length){
            return false;
        }
        //element on the edge can't be moved anywhere that will disconnect current word
        else if($(this).prev().has(dropElm).length || $(this).next().has(dropElm).length){
            return false;
        }
        //the tile can only be placed down at the edge of the word
        else if($(this).prev().has(".tiles").length || $(this).next().has(".tiles").length){
            return true;
        }
        else{
            return false;
        }
    }
}

/**
 * Validate the tiles being dropped back onto the rack, if the tiles is currently between two
 * other tiles, then it should not be allowed to dropped back on the board as it will create
 * a disconnect in words
 * @param {Object} dropElm 
 * @returns boolean if the rack accepts the tile
 */
function rackTileAcceptHandler(dropElm){
    if(dropElm.parent().prev().has(".tiles").length && dropElm.parent().next().has(".tiles").length){
        return false;
    }
    return true;
}

/**
 * Trigger when the tiles is accepted into the rack, appending the tile element back onto the 
 * rack and order it. Updating the current word and socre on the board. 
 */
function dropRackHandler(event, ui){
    $(this).append(ui.draggable.css(
        {'position': 'relative', 
        'left': 0, 
        'top': 0}));
    ui.draggable.addClass("onRack");
    ui.draggable.removeClass("onBoard");
    updateCurrentWord();
    updateScore();
}

/**
 * Generate 7 random tiles onto the rack. Everytime this run it will check the scrabbleTiles
 * data to see what tile remains. Generate tiles until there're 7 tiles on the rack, or until
 * all tiles from the game are exhuasted. Will not remove existing unused tiles on the rack.
 * 
 * Creating the tiles element by adding appropriate ID, class, and image depending on the rack
 * generated. As well as giving draggable property. 
 */
function generateRacks(){
    var rack = $("#tileHolder")
    while($("#tileHolder img").length < 7 && tileRemainder > 0){
        var curr_tile = generateRandomAlphabet();
        var curr_img = $('<img>');
        var img_src = "imgs/tiles/Scrabble_Tile_" + curr_tile +".jpg"
        curr_img.attr({'class': "tiles onRack", "src": img_src, "id": curr_tile});
        rack.append(curr_img)
    }
    $(".tiles").draggable({
        revert: 'invalid'
    });
    $("#remainingTiles").html(tileRemainder)
}

/**
 * Generate a random remaining alphabet based on the scrabbleTiles data. Will only
 * generate letter with remaining tiles, as well as there are still tiles left to
 * generate
 * @returns a random valid alphabet
 */
function generateRandomAlphabet(){
    do{
        var randomAlp = capAlp.charAt(Math.floor(Math.random() * capAlp.length));
    }while(ScrabbleTiles[randomAlp].remaining == 0 && tileRemainder > 0)
    tileRemainder -= 1;
    ScrabbleTiles[randomAlp].remaining-=1;
    return randomAlp;
}

/**
 * Start a new game of scrabble by resetting tiles counts, current score. Generate
 * new set of tiles on the rack, and removing existing tiles on the board.
 */
function resetGame(){
    for(var i = 0; i<capAlp.length; i++){
        ScrabbleTiles[capAlp[i]].remaining = ScrabbleTiles[capAlp[i]].original;
    }
    tileRemainder = 100;
    turnScore = 0;
    totalScore = 0;
    $("#tileHolder").empty()
    $("#ScrabbleBoard td").empty();
    updateCurrentWord();
    generateRacks();
    updateScore();
}

/**
 * Generate new tiles until there are 7 tiles in the rack. Update the current score
 * and clear all tiles on the scrabble board. 
 */
function nextTurn(){
    generateRacks();
    $("#ScrabbleBoard td").empty();
    updateCurrentWord();
    totalScore=turnScore;
}

/**
 * Updating the element with "curWord" ID with the current word creates by the tiles
 * combination on the board. 
 */
function updateCurrentWord(){
    currWord = "";
    $("#ScrabbleBoard .tiles").each(function(index){
        currWord += $(this).attr('id');
    });
    $("#curWord").html(currWord);
}

/**
 * Update the element with "score" ID with the current game score, a combination of 
 * all previous turn's score and current score. If tiles are on bonus block, the score
 * will take in that as consideration as well.  
 */
function updateScore(){
    turnScore = 0;
    $("#ScrabbleBoard .tiles").each(function(index){
        var currLetter = $(this).attr("id");
        turnScore+=ScrabbleTiles[currLetter].value;
    });
    $("#ScrabbleBoard .doubleWordSpace .tiles").each(function(index){
        turnScore*=2;
    });
    turnScore += totalScore;
    $("#score").html(turnScore);
}