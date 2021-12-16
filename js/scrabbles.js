/*
File: scrabbles.js
Purpose: initialize the scrabble game. Generating the tiles into the rack, set up
the droppable property of the scrabble board and the rack. Set up event listener 
for when the next and restart button are clicked on the page.

Author: Jen Yuan Shih (JenYuan_Shih@student.uml.edu)
Last Updated: 12/14/2021 9:00PM EST
*/

$(document).ready(function(){
    //set up the droppable property of rack and scrabble 
    //board, perform validation and updates when a draggable 
    //is dragged onto them.
    $(".boardSpace").droppable({
        drop: dropBoardHandler,
        accept: boardTileAcceptHandler,
    });

    $("#tileHolder").droppable({
        drop: dropRackHandler,
        accept: rackTileAcceptHandler
    })

    //Initialize the board with 7 random tiles from scrabbleDatas.js
    generateRacks(); 

    //Event listener for when next and restart button are clicked. 
    $("#next").click(nextTurn);

    $("#restart").click(resetGame);
});
